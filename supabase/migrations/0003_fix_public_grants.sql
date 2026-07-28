-- 0002 revoked EXECUTE from `anon` specifically, but every new function
-- also gets an implicit EXECUTE grant to the `PUBLIC` pseudo-role by
-- default, and anon inherits from PUBLIC — so the advisor still flagged
-- them. Revoke from PUBLIC directly, then grant back only to the roles
-- that actually need it.

revoke execute on function get_user_role() from public;
revoke execute on function is_linked_parent(uuid) from public;
revoke execute on function teaches_student(uuid) from public;
revoke execute on function handle_new_user() from public;

grant execute on function get_user_role() to authenticated;
grant execute on function is_linked_parent(uuid) to authenticated;
grant execute on function teaches_student(uuid) to authenticated;
-- handle_new_user is trigger-only — no role needs a direct EXECUTE grant;
-- the trigger fires regardless of the inserting role's function privileges.
