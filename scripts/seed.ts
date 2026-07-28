// Loads the draft curriculum in scripts/content.ts into Supabase.
// Requires SUPABASE_SERVICE_ROLE_KEY (bypasses RLS) — never run this
// against a project you don't control, and never commit .env.local.
//
// Usage: npm run seed

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { CONTENT } from "./content";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function insertOne<T>(table: string, row: Record<string, unknown>) {
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw new Error(`${table} insert failed: ${error.message}`);
  return data as T & { id: string };
}

async function main() {
  for (const [levelIndex, level] of CONTENT.entries()) {
    const levelRow = await insertOne<{ id: string }>("levels", {
      name: level.name,
      slug: level.slug,
      description: level.description,
      order_index: levelIndex + 1,
    });
    console.log(`Level: ${level.name}`);

    for (const [unitIndex, unit] of level.units.entries()) {
      const unitRow = await insertOne<{ id: string }>("units", {
        level_id: levelRow.id,
        name: unit.name,
        slug: unit.slug,
        icon: unit.icon,
        order_index: unitIndex + 1,
      });
      console.log(`  Unit: ${unit.name}`);

      for (const [lessonIndex, lesson] of unit.lessons.entries()) {
        const lessonRow = await insertOne<{ id: string }>("lessons", {
          unit_id: unitRow.id,
          name: lesson.name,
          lesson_type: lesson.lesson_type,
          unlock_threshold_pct: lesson.unlock_threshold_pct ?? null,
          order_index: lessonIndex + 1,
        });

        for (const [exerciseIndex, exercise] of lesson.exercises.entries()) {
          const exerciseRow = await insertOne<{ id: string }>("exercises", {
            lesson_id: lessonRow.id,
            exercise_type: exercise.exercise_type,
            order_index: exerciseIndex + 1,
          });

          const questionRows = exercise.questions.map((q, questionIndex) => ({
            exercise_id: exerciseRow.id,
            prompt_ko: q.prompt_ko ?? null,
            prompt_en: q.prompt_en ?? null,
            romanization: q.romanization ?? null,
            audio_url: q.audio_url ?? null,
            image_url: q.image_url ?? null,
            options: q.options ?? null,
            correct_answer: q.correct_answer ?? null,
            order_index: questionIndex + 1,
          }));

          const { error } = await supabase.from("exercise_questions").insert(questionRows);
          if (error) throw new Error(`exercise_questions insert failed: ${error.message}`);
        }
      }
    }
  }

  console.log("\nSeed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
