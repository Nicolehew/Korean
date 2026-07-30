-- Recovery codes let a learner resume on a different device.
--
-- Students never see an email or password. Instead each account gets a short
-- code; the synthetic login credentials are derived from it, so typing the
-- code on any device is enough to sign back in. The code IS the credential,
-- so it's generated with enough entropy to not be guessable.
--
-- This guards lesson progress, not sensitive personal data — an appropriate
-- tradeoff for a school roster, but not a model to copy for anything private.

alter table profiles
  add column if not exists recovery_code text unique;

create index if not exists profiles_recovery_code_idx on profiles (recovery_code);
