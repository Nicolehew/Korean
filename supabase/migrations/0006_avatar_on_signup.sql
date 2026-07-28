-- Lets signUp's options.data carry an avatar_url (we store an emoji
-- mascot string here rather than an image URL, but the column already
-- exists for exactly this purpose).

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'role';
begin
  insert into public.profiles (id, role, full_name, avatar_url)
  values (
    new.id,
    (case when requested_role = 'parent' then 'parent' else 'student' end)::user_role,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;
