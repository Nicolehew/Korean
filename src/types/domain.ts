// Hand-written domain types matching supabase/migrations/0001_init.sql.
// Replace with generated types once the Supabase project is linked (see
// src/types/database.ts).

export type UserRole = "student" | "parent" | "teacher" | "admin";
export type ProgressStatus = "locked" | "available" | "in_progress" | "completed";
export type LessonType = "standard" | "unlock_game";
export type ExerciseType =
  | "vocab_card"
  | "multiple_choice"
  | "listening"
  | "matching"
  | "sentence_build";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
};

export type Level = {
  id: string;
  name: string;
  slug: string;
  order_index: number;
  description: string | null;
};

export type Unit = {
  id: string;
  level_id: string;
  name: string;
  slug: string;
  order_index: number;
  icon: string | null;
};

export type Lesson = {
  id: string;
  unit_id: string;
  name: string;
  order_index: number;
  lesson_type: LessonType;
  unlock_threshold_pct: number | null;
};

export type Exercise = {
  id: string;
  lesson_id: string;
  exercise_type: ExerciseType;
  order_index: number;
};

export type ExerciseQuestion = {
  id: string;
  exercise_id: string;
  prompt_ko: string | null;
  prompt_en: string | null;
  romanization: string | null;
  audio_url: string | null;
  image_url: string | null;
  options: string[] | null;
  correct_answer: string | null;
  order_index: number;
};

export type UserUnitProgress = {
  user_id: string;
  unit_id: string;
  status: ProgressStatus;
  stars: number;
  completed_at: string | null;
};

export type UserProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  status: ProgressStatus;
  score: number | null;
  completed_at: string | null;
};

export type Streak = {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
};

export type UnitWithLessons = Unit & { lessons: Lesson[] };
export type LevelWithUnits = Level & { units: UnitWithLessons[] };
