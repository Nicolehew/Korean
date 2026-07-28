-- Addresses Supabase security advisor findings after 0001_init.sql:
-- 1. security definer functions without a pinned search_path
-- 2. helper functions exposed as public RPC endpoints via PostgREST
--
-- get_user_role/is_linked_parent/teaches_student stay EXECUTE-able by
-- `authenticated` — RLS policies evaluate as the querying role, so revoking
-- that would break every policy that calls them. `anon` never needs them
-- (every read policy already gates on `auth.uid() is not null`), and
-- handle_new_user is trigger-only, so both get locked down for both roles.

create or replace function get_user_role()
returns user_role
language sql
security definer
stable
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function is_linked_parent(target_student_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from parent_student_links
    where parent_id = auth.uid() and student_id = target_student_id
  );
$$;

create or replace function teaches_student(target_student_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from class_students cs
    join classes c on c.id = cs.class_id
    where c.teacher_id = auth.uid() and cs.student_id = target_student_id
  );
$$;

revoke execute on function get_user_role() from anon;
revoke execute on function is_linked_parent(uuid) from anon;
revoke execute on function teaches_student(uuid) from anon;
revoke execute on function handle_new_user() from anon, authenticated;
