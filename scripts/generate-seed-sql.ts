// One-off generator: turns scripts/content.ts into a single PL/pgSQL block
// so it can be run through any SQL runner (Supabase SQL editor, MCP
// execute_sql, `supabase db execute`) without needing a service role key.
// Usage: npx tsx scripts/generate-seed-sql.ts > /tmp/seed.sql

import { CONTENT } from "./content";

function str(value: string | undefined | null): string {
  if (value === undefined || value === null) return "null";
  return `'${value.replace(/'/g, "''")}'`;
}

function jsonbArr(value: string[] | undefined): string {
  if (!value) return "null";
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

let sql = "do $$\ndeclare\n  level_id uuid;\n  unit_id uuid;\n  lesson_id uuid;\n  exercise_id uuid;\nbegin\n";

CONTENT.forEach((level, levelIndex) => {
  sql += `  insert into levels (name, slug, description, order_index) values (${str(level.name)}, ${str(level.slug)}, ${str(level.description)}, ${levelIndex + 1}) returning id into level_id;\n`;

  level.units.forEach((unit, unitIndex) => {
    sql += `  insert into units (level_id, name, slug, icon, order_index) values (level_id, ${str(unit.name)}, ${str(unit.slug)}, ${str(unit.icon)}, ${unitIndex + 1}) returning id into unit_id;\n`;

    unit.lessons.forEach((lesson, lessonIndex) => {
      sql += `  insert into lessons (unit_id, name, lesson_type, unlock_threshold_pct, order_index) values (unit_id, ${str(lesson.name)}, ${str(lesson.lesson_type)}, ${lesson.unlock_threshold_pct ?? "null"}, ${lessonIndex + 1}) returning id into lesson_id;\n`;

      lesson.exercises.forEach((exercise, exerciseIndex) => {
        sql += `  insert into exercises (lesson_id, exercise_type, order_index) values (lesson_id, ${str(exercise.exercise_type)}, ${exerciseIndex + 1}) returning id into exercise_id;\n`;

        exercise.questions.forEach((question, questionIndex) => {
          sql +=
            `  insert into exercise_questions (exercise_id, prompt_ko, prompt_en, romanization, audio_url, image_url, options, correct_answer, order_index) values ` +
            `(exercise_id, ${str(question.prompt_ko)}, ${str(question.prompt_en)}, ${str(question.romanization)}, ${str(question.audio_url)}, ${str(question.image_url)}, ${jsonbArr(question.options)}, ${str(question.correct_answer)}, ${questionIndex + 1});\n`;
        });
      });
    });
  });
});

sql += "end $$;\n";

console.log(sql);
