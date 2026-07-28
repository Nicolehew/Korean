import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNextUnitId } from "@/lib/data/progress";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import type { Exercise, ExerciseQuestion, Lesson } from "@/types/domain";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();
  if (!lesson) notFound();

  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("order_index");

  const exerciseIds = (exercises ?? []).map((e) => e.id);
  const { data: questions } = exerciseIds.length
    ? await supabase
        .from("exercise_questions")
        .select("*")
        .in("exercise_id", exerciseIds)
        .order("order_index")
    : { data: [] as ExerciseQuestion[] };

  const exercisesWithQuestions = ((exercises ?? []) as Exercise[]).map((exercise) => ({
    ...exercise,
    questions: ((questions ?? []) as ExerciseQuestion[]).filter(
      (q) => q.exercise_id === exercise.id,
    ),
  }));

  const nextUnitId = await getNextUnitId((lesson as Lesson).unit_id);

  return (
    <LessonPlayer
      lesson={lesson as Lesson}
      exercises={exercisesWithQuestions}
      nextUnitId={nextUnitId}
    />
  );
}
