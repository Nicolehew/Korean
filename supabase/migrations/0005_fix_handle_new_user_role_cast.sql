-- handle_new_user's CASE expression evaluated to `text`, which Postgres
-- does not implicitly cast to the `user_role` enum in an INSERT — every
-- real signup would have hit "column role is of type user_role but
-- expression is of type text". Caught while creating a test account to
-- verify the signup flow end-to-end, not by any automated check.

create or replace function handle_new_user()
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
    (case when requested_role = 'parent' then 'parent' else 'student' end)::user_role,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
  );
  return new;
end;
$$;
