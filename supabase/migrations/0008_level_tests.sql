-- Level tests: a checkpoint quiz at the end of each level.
--
-- Lessons stay freely tappable inside a level (students asked to be able
-- to jump around and replay), but the NEXT level stays locked until the
-- current level's test is passed. So `lesson_type` gains a third value
-- and levels gain a pass threshold.

alter type lesson_type add value if not exists 'level_test';

alter table levels
  add column if not exists test_threshold_pct int not null default 80;
