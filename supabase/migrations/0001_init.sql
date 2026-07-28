-- Korean learning app: initial schema
-- Run against your Supabase project (via SQL editor, `supabase db push`,
-- or the Supabase MCP `apply_migration` tool).

create extension if not exists "pgcrypto";

create type user_role as enum ('student', 'parent', 'teacher', 'admin');
create type lesson_type as enum ('standard', 'unlock_game');
create type exercise_type as enum ('vocab_card', 'multiple_choice', 'listening', 'matching', 'sentence_build');
create type progress_status as enum ('locked', 'in_progress', 'completed');

-- ---------------------------------------------------------------------
-- People & relationships
-- ---------------------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'student',
  full_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table parent_student_links (
  parent_id uuid not null references profiles (id) on delete cascade,
  student_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (parent_id, student_id)
);

create table classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table class_students (
  class_id uuid not null references classes (id) on delete cascade,
  student_id uuid not null references profiles (id) on delete cascade,
  primary key (class_id, student_id)
);

-- ---------------------------------------------------------------------
-- Content: level > unit > lesson > exercise > question
-- ---------------------------------------------------------------------

create table levels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  order_index int not null,
  description text
);

create table units (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references levels (id) on delete cascade,
  name text not null,
  slug text not null,
  order_index int not null,
  icon text,
  unique (level_id, slug)
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units (id) on delete cascade,
  name text not null,
  order_index int not null,
  lesson_type lesson_type not null default 'standard',
  unlock_threshold_pct int
);

create table exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons (id) on delete cascade,
  exercise_type exercise_type not null,
  order_index int not null
);

create table exercise_questions (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references exercises (id) on delete cascade,
  prompt_ko text,
  prompt_en text,
  romanization text,
  audio_url text,
  image_url text,
  options jsonb,
  correct_answer text, -- null for vocab_card questions, which have no right/wrong check
  order_index int not null
);

-- ---------------------------------------------------------------------
-- Progress, streaks, achievements
-- ---------------------------------------------------------------------

create table user_unit_progress (
  user_id uuid not null references profiles (id) on delete cascade,
  unit_id uuid not null references units (id) on delete cascade,
  status progress_status not null default 'locked',
  stars int not null default 0,
  completed_at timestamptz,
  primary key (user_id, unit_id)
);

create table user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  lesson_id uuid not null references lessons (id) on delete cascade,
  status progress_status not null default 'in_progress',
  score int,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

create table question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  question_id uuid not null references exercise_questions (id) on delete cascade,
  is_correct boolean not null,
  attempted_at timestamptz not null default now()
);

create table streaks (
  user_id uuid primary key references profiles (id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_activity_date date
);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  icon text
);

create table user_achievements (
  user_id uuid not null references profiles (id) on delete cascade,
  achievement_id uuid not null references achievements (id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create index on units (level_id);
create index on lessons (unit_id);
create index on exercises (lesson_id);
create index on exercise_questions (exercise_id);
create index on user_progress (user_id);
create index on question_attempts (user_id);

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------

create function get_user_role()
returns user_role
language sql
security definer
stable
as $$
  select role from profiles where id = auth.uid();
$$;

create function is_linked_parent(target_student_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from parent_student_links
    where parent_id = auth.uid() and student_id = target_student_id
  );
$$;

create function teaches_student(target_student_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from class_students cs
    join classes c on c.id = cs.class_id
    where c.teacher_id = auth.uid() and cs.student_id = target_student_id
  );
$$;

-- Auto-create a profile row whenever a new auth user signs up, reading
-- role/full_name from signUp's `options.data`. Runs as security definer so
-- it isn't blocked by RLS. Only 'student' and 'parent' are ever honored
-- here — self-signup must never be able to grant 'teacher' or 'admin';
-- promote those manually (SQL editor or an internal admin tool).
create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'role';
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    case when requested_role = 'parent' then 'parent' else 'student' end,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table profiles enable row level security;
alter table parent_student_links enable row level security;
alter table classes enable row level security;
alter table class_students enable row level security;
alter table levels enable row level security;
alter table units enable row level security;
alter table lessons enable row level security;
alter table exercises enable row level security;
alter table exercise_questions enable row level security;
alter table user_unit_progress enable row level security;
alter table user_progress enable row level security;
alter table question_attempts enable row level security;
alter table streaks enable row level security;
alter table achievements enable row level security;
alter table user_achievements enable row level security;

-- profiles: self, linked parent, teacher/admin
create policy "profiles_select" on profiles for select
  using (
    id = auth.uid()
    or is_linked_parent(id)
    or teaches_student(id)
    or get_user_role() in ('teacher', 'admin')
  );
create policy "profiles_update_self" on profiles for update
  using (id = auth.uid());
create policy "profiles_insert_self" on profiles for insert
  with check (id = auth.uid());

-- parent_student_links: parent sees their own links, admin manages all
create policy "parent_links_select" on parent_student_links for select
  using (parent_id = auth.uid() or get_user_role() = 'admin');
create policy "parent_links_admin_write" on parent_student_links for all
  using (get_user_role() = 'admin');

-- classes / class_students: teacher owns theirs, admin all
create policy "classes_select" on classes for select
  using (teacher_id = auth.uid() or get_user_role() = 'admin');
create policy "classes_teacher_write" on classes for all
  using (teacher_id = auth.uid() or get_user_role() = 'admin');
create policy "class_students_select" on class_students for select
  using (
    exists (select 1 from classes c where c.id = class_id and c.teacher_id = auth.uid())
    or get_user_role() = 'admin'
  );
create policy "class_students_teacher_write" on class_students for all
  using (
    exists (select 1 from classes c where c.id = class_id and c.teacher_id = auth.uid())
    or get_user_role() = 'admin'
  );

-- content tables: readable by any signed-in user, writable by teacher/admin
create policy "levels_read" on levels for select using (auth.uid() is not null);
create policy "levels_write" on levels for all using (get_user_role() in ('teacher', 'admin'));
create policy "units_read" on units for select using (auth.uid() is not null);
create policy "units_write" on units for all using (get_user_role() in ('teacher', 'admin'));
create policy "lessons_read" on lessons for select using (auth.uid() is not null);
create policy "lessons_write" on lessons for all using (get_user_role() in ('teacher', 'admin'));
create policy "exercises_read" on exercises for select using (auth.uid() is not null);
create policy "exercises_write" on exercises for all using (get_user_role() in ('teacher', 'admin'));
create policy "exercise_questions_read" on exercise_questions for select using (auth.uid() is not null);
create policy "exercise_questions_write" on exercise_questions for all using (get_user_role() in ('teacher', 'admin'));
create policy "achievements_read" on achievements for select using (auth.uid() is not null);
create policy "achievements_write" on achievements for all using (get_user_role() in ('teacher', 'admin'));

-- progress/streaks/attempts/unit-progress: owner, linked parent, teacher/admin
create policy "user_unit_progress_select" on user_unit_progress for select
  using (
    user_id = auth.uid()
    or is_linked_parent(user_id)
    or teaches_student(user_id)
    or get_user_role() = 'admin'
  );
create policy "user_unit_progress_write" on user_unit_progress for all
  using (user_id = auth.uid());

create policy "user_progress_select" on user_progress for select
  using (
    user_id = auth.uid()
    or is_linked_parent(user_id)
    or teaches_student(user_id)
    or get_user_role() = 'admin'
  );
create policy "user_progress_write" on user_progress for all
  using (user_id = auth.uid());

create policy "question_attempts_select" on question_attempts for select
  using (
    user_id = auth.uid()
    or is_linked_parent(user_id)
    or teaches_student(user_id)
    or get_user_role() = 'admin'
  );
create policy "question_attempts_write" on question_attempts for insert
  with check (user_id = auth.uid());

create policy "streaks_select" on streaks for select
  using (
    user_id = auth.uid()
    or is_linked_parent(user_id)
    or teaches_student(user_id)
    or get_user_role() = 'admin'
  );
create policy "streaks_write" on streaks for all
  using (user_id = auth.uid());

create policy "user_achievements_select" on user_achievements for select
  using (
    user_id = auth.uid()
    or is_linked_parent(user_id)
    or teaches_student(user_id)
    or get_user_role() = 'admin'
  );
create policy "user_achievements_write" on user_achievements for all
  using (user_id = auth.uid());
