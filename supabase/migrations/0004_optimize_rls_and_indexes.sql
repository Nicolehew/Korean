-- Performance advisor findings from 0001-0003:
-- 1. auth_rls_initplan: every policy called auth.uid()/helper functions
--    directly, which re-evaluates per row instead of once per query.
--    Wrapping in `(select ...)` lets Postgres treat it as an InitPlan.
-- 2. unindexed_foreign_keys: 7 FK columns had no covering index.

drop policy "profiles_select" on profiles;
create policy "profiles_select" on profiles for select
  using (
    id = (select auth.uid())
    or (select is_linked_parent(id))
    or (select teaches_student(id))
    or (select get_user_role()) in ('teacher', 'admin')
  );

drop policy "profiles_update_self" on profiles;
create policy "profiles_update_self" on profiles for update
  using (id = (select auth.uid()));

drop policy "profiles_insert_self" on profiles;
create policy "profiles_insert_self" on profiles for insert
  with check (id = (select auth.uid()));

drop policy "parent_links_select" on parent_student_links;
create policy "parent_links_select" on parent_student_links for select
  using (parent_id = (select auth.uid()) or (select get_user_role()) = 'admin');

drop policy "parent_links_admin_write" on parent_student_links;
create policy "parent_links_admin_write" on parent_student_links for all
  using ((select get_user_role()) = 'admin');

drop policy "classes_select" on classes;
create policy "classes_select" on classes for select
  using (teacher_id = (select auth.uid()) or (select get_user_role()) = 'admin');

drop policy "classes_teacher_write" on classes;
create policy "classes_teacher_write" on classes for all
  using (teacher_id = (select auth.uid()) or (select get_user_role()) = 'admin');

drop policy "class_students_select" on class_students;
create policy "class_students_select" on class_students for select
  using (
    exists (select 1 from classes c where c.id = class_id and c.teacher_id = (select auth.uid()))
    or (select get_user_role()) = 'admin'
  );

drop policy "class_students_teacher_write" on class_students;
create policy "class_students_teacher_write" on class_students for all
  using (
    exists (select 1 from classes c where c.id = class_id and c.teacher_id = (select auth.uid()))
    or (select get_user_role()) = 'admin'
  );

drop policy "levels_read" on levels;
create policy "levels_read" on levels for select using ((select auth.uid()) is not null);
drop policy "levels_write" on levels;
create policy "levels_write" on levels for all using ((select get_user_role()) in ('teacher', 'admin'));

drop policy "units_read" on units;
create policy "units_read" on units for select using ((select auth.uid()) is not null);
drop policy "units_write" on units;
create policy "units_write" on units for all using ((select get_user_role()) in ('teacher', 'admin'));

drop policy "lessons_read" on lessons;
create policy "lessons_read" on lessons for select using ((select auth.uid()) is not null);
drop policy "lessons_write" on lessons;
create policy "lessons_write" on lessons for all using ((select get_user_role()) in ('teacher', 'admin'));

drop policy "exercises_read" on exercises;
create policy "exercises_read" on exercises for select using ((select auth.uid()) is not null);
drop policy "exercises_write" on exercises;
create policy "exercises_write" on exercises for all using ((select get_user_role()) in ('teacher', 'admin'));

drop policy "exercise_questions_read" on exercise_questions;
create policy "exercise_questions_read" on exercise_questions for select using ((select auth.uid()) is not null);
drop policy "exercise_questions_write" on exercise_questions;
create policy "exercise_questions_write" on exercise_questions for all using ((select get_user_role()) in ('teacher', 'admin'));

drop policy "achievements_read" on achievements;
create policy "achievements_read" on achievements for select using ((select auth.uid()) is not null);
drop policy "achievements_write" on achievements;
create policy "achievements_write" on achievements for all using ((select get_user_role()) in ('teacher', 'admin'));

drop policy "user_unit_progress_select" on user_unit_progress;
create policy "user_unit_progress_select" on user_unit_progress for select
  using (
    user_id = (select auth.uid())
    or (select is_linked_parent(user_id))
    or (select teaches_student(user_id))
    or (select get_user_role()) = 'admin'
  );
drop policy "user_unit_progress_write" on user_unit_progress;
create policy "user_unit_progress_write" on user_unit_progress for all
  using (user_id = (select auth.uid()));

drop policy "user_progress_select" on user_progress;
create policy "user_progress_select" on user_progress for select
  using (
    user_id = (select auth.uid())
    or (select is_linked_parent(user_id))
    or (select teaches_student(user_id))
    or (select get_user_role()) = 'admin'
  );
drop policy "user_progress_write" on user_progress;
create policy "user_progress_write" on user_progress for all
  using (user_id = (select auth.uid()));

drop policy "question_attempts_select" on question_attempts;
create policy "question_attempts_select" on question_attempts for select
  using (
    user_id = (select auth.uid())
    or (select is_linked_parent(user_id))
    or (select teaches_student(user_id))
    or (select get_user_role()) = 'admin'
  );
drop policy "question_attempts_write" on question_attempts;
create policy "question_attempts_write" on question_attempts for insert
  with check (user_id = (select auth.uid()));

drop policy "streaks_select" on streaks;
create policy "streaks_select" on streaks for select
  using (
    user_id = (select auth.uid())
    or (select is_linked_parent(user_id))
    or (select teaches_student(user_id))
    or (select get_user_role()) = 'admin'
  );
drop policy "streaks_write" on streaks;
create policy "streaks_write" on streaks for all
  using (user_id = (select auth.uid()));

drop policy "user_achievements_select" on user_achievements;
create policy "user_achievements_select" on user_achievements for select
  using (
    user_id = (select auth.uid())
    or (select is_linked_parent(user_id))
    or (select teaches_student(user_id))
    or (select get_user_role()) = 'admin'
  );
drop policy "user_achievements_write" on user_achievements;
create policy "user_achievements_write" on user_achievements for all
  using (user_id = (select auth.uid()));

create index on class_students (student_id);
create index on classes (teacher_id);
create index on parent_student_links (student_id);
create index on question_attempts (question_id);
create index on user_achievements (achievement_id);
create index on user_progress (lesson_id);
create index on user_unit_progress (unit_id);
