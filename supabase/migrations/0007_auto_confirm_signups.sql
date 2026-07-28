-- Auto-confirm new signups so students can start immediately.
--
-- Why: Supabase's built-in email service rate-limits confirmation emails
-- hard on the free tier ("email rate limit exceeded"), which blocked
-- signup entirely during a classroom demo. Confirming in-database removes
-- the dependency on email delivery for account activation.
--
-- TRADEOFF: this means a person can sign up with an email address they
-- don't own, because nothing proves they can read that inbox. That's
-- acceptable for a school roster where staff know the students, but if
-- this app ever gates something sensitive on email identity, drop this
-- trigger and configure a real SMTP provider in Supabase instead.

create or replace function auto_confirm_user()
returns trigger
language plpgsql
security definer
set search_path = auth
as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_auto_confirm on auth.users;
create trigger on_auth_user_auto_confirm
  before insert on auth.users
  for each row execute function auto_confirm_user();

-- Confirm anyone already stuck unconfirmed from a rate-limited attempt.
update auth.users set email_confirmed_at = now() where email_confirmed_at is null;
