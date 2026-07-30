"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { submitLessonResult } from "@/lib/actions/progress";
import { SpeakButton } from "@/components/ui/speak-button";
import type { Exercise, ExerciseQuestion, Lesson } from "@/types/domain";

type ExerciseWithQuestions = Exercise & { questions: ExerciseQuestion[] };

type Step =
  | { kind: "vocab"; question: ExerciseQuestion; speak: string; speakBeforeAnswer: true }
  | {
      kind: "choice";
      question: ExerciseQuestion;
      options: string[];
      speak: string;
      // Listening drills require hearing the phrase up front; for the rest,
      // playing it early would read the correct answer aloud.
      speakBeforeAnswer: boolean;
    }
  | { kind: "build"; question: ExerciseQuestion; tokens: string[]; speak: string; speakBeforeAnswer: false };

function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function normalize(s: string): string {
  return s.replace(/\s+/g, "");
}

function buildSteps(exercises: ExerciseWithQuestions[]): Step[] {
  return exercises.flatMap((exercise): Step[] => {
    if (exercise.exercise_type === "vocab_card") {
      return exercise.questions.map((question) => ({
        kind: "vocab" as const,
        question,
        speak: question.prompt_ko ?? "",
        speakBeforeAnswer: true as const,
      }));
    }
    if (exercise.exercise_type === "matching") {
      // No drag-and-drop board here — each term is checked one at a time
      // against the exercise's own answer pool as distractors.
      const pool = shuffled(
        exercise.questions.map((q) => q.correct_answer).filter((a): a is string => !!a),
      );
      return exercise.questions.map((question) => ({
        kind: "choice" as const,
        question,
        options: pool,
        speak: question.prompt_ko ?? "",
        speakBeforeAnswer: true,
      }));
    }
    // multiple_choice, listening, sentence_build
    return exercise.questions.map((question) => {
      const opts = question.options ?? [];
      // If no single option matches the full answer, this is a multi-token
      // sentence to assemble in order rather than a pick-one question.
      const isBuild =
        opts.length > 1 &&
        !opts.some((o) => normalize(o) === normalize(question.correct_answer ?? ""));
      const spoken = question.prompt_ko ?? question.correct_answer ?? "";
      if (isBuild) {
        return {
          kind: "build" as const,
          question,
          tokens: shuffled(opts),
          speak: spoken,
          speakBeforeAnswer: false as const,
        };
      }
      return {
        kind: "choice" as const,
        question,
        options: shuffled(opts),
        speak: spoken,
        // Safe to play early only when the prompt itself is the Korean.
        speakBeforeAnswer: exercise.exercise_type === "listening" || !!question.prompt_ko,
      };
    });
  });
}

const CONFETTI = ["#ff5a6e", "#2fb0f0", "#16c79a", "#8a4fff", "#ffc23c"];

export function LessonPlayer({
  lesson,
  exercises,
  nextUnitId,
}: {
  lesson: Lesson;
  exercises: ExerciseWithQuestions[];
  nextUnitId: string | null;
}) {
  const steps = useMemo(() => buildSteps(exercises), [exercises]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [builtIndices, setBuiltIndices] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [gradedCount, setGradedCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ passedGate: boolean; scorePct: number } | null>(null);

  const step = steps[index];
  const isLast = index === steps.length - 1;
  const answered =
    step?.kind === "choice"
      ? selected !== null
      : step?.kind === "build"
        ? builtIndices.length === step.tokens.length
        : false;

  async function finish(finalCorrect: number, finalGraded: number) {
    const scorePct = finalGraded > 0 ? Math.round((finalCorrect / finalGraded) * 100) : 100;
    setSubmitting(true);
    const { passedGate } = await submitLessonResult({
      lessonId: lesson.id,
      unitId: lesson.unit_id,
      nextUnitId,
      scorePct,
      isUnlockGame:
        lesson.lesson_type === "unlock_game" || lesson.lesson_type === "level_test",
      unlockThresholdPct: lesson.unlock_threshold_pct,
    });
    setSubmitting(false);
    setResult({ passedGate, scorePct });
  }

  function handleAdvance(graded: boolean, wasCorrect: boolean) {
    const nextCorrect = graded && wasCorrect ? correctCount + 1 : correctCount;
    const nextGraded = graded ? gradedCount + 1 : gradedCount;
    setCorrectCount(nextCorrect);
    setGradedCount(nextGraded);
    setSelected(null);
    setBuiltIndices([]);

    if (isLast) {
      finish(nextCorrect, nextGraded);
    } else {
      setIndex(index + 1);
    }
  }

  if (result) {
    const celebrate = result.passedGate || lesson.lesson_type === "standard";
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden text-center">
        {celebrate &&
          CONFETTI.map((color, i) => (
            <span
              key={i}
              className="pointer-events-none absolute top-6 h-3 w-3 rounded-full"
              style={{
                left: `${12 + i * 18}%`,
                background: color,
                animation: `floatY ${2 + i * 0.3}s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        <p
          className="text-6xl"
          style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}
        >
          {celebrate ? "🎉" : "💪"}
        </p>
        <h1 className="text-3xl font-extrabold">Score: {result.scorePct}%</h1>
        {lesson.lesson_type !== "standard" && (
          <p className="max-w-xs text-muted">
            {result.passedGate
              ? lesson.lesson_type === "level_test"
                ? "Level passed — the next level is unlocked! 🎉"
                : "Next unit unlocked!"
              : `You need ${lesson.unlock_threshold_pct}% to pass. Try again!`}
          </p>
        )}
        <div className="flex gap-3">
          <Link href="/learn/map" className="pill-btn border-2 border-border px-6 py-3 font-semibold">
            Back to map
          </Link>
          {!result.passedGate && lesson.lesson_type !== "standard" && (
            <Link
              href={`/learn/lesson/${lesson.id}`}
              className="pill-btn bg-primary px-6 py-3 text-primary-foreground shadow-md shadow-primary/30"
            >
              Retry
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!step) {
    return <p className="text-muted">This lesson has no content yet.</p>;
  }

  const { question } = step;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6">
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet to-sky transition-all duration-500"
          style={{ width: `${(index / steps.length) * 100}%` }}
        />
      </div>

      <div
        key={index}
        className="pop-card flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center"
        style={{ animation: "fadeSlideUp 0.35s ease-out both" }}
      >
        {question.prompt_ko && <p className="text-4xl font-extrabold">{question.prompt_ko}</p>}
        {question.romanization && <p className="text-muted">{question.romanization}</p>}
        {question.prompt_en && <p className="text-lg">{question.prompt_en}</p>}
        {step.speak && (step.speakBeforeAnswer || answered) && (
          <SpeakButton text={step.speak} />
        )}

        {step.kind === "build" && (
          <div className="mt-2 flex min-h-[3rem] w-full flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-3">
            {builtIndices.length === 0 && (
              <span className="text-sm text-muted">Tap the words below in order</span>
            )}
            {builtIndices.map((tokenIndex, position) => (
              <button
                key={position}
                type="button"
                onClick={() => setBuiltIndices(builtIndices.filter((_, i) => i !== position))}
                className="rounded-lg bg-primary/15 px-3 py-1.5 font-medium text-primary"
                style={{ animation: "popIn 0.25s ease-out both" }}
              >
                {step.tokens[tokenIndex]}
              </button>
            ))}
          </div>
        )}
      </div>

      {step.kind === "vocab" && (
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleAdvance(false, false)}
          className="pill-btn bg-mint py-3 text-white shadow-md shadow-mint/30 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isLast ? "Finish" : "Got it 👍"}
        </button>
      )}

      {step.kind === "choice" && (
        <div className="flex flex-col gap-2.5">
          {step.options.map((option) => {
            const isSelected = selected === option;
            const isCorrectOption = normalize(option) === normalize(question.correct_answer ?? "");
            const showFeedback = selected !== null;
            return (
              <button
                key={option}
                type="button"
                disabled={selected !== null}
                onClick={() => setSelected(option)}
                style={
                  showFeedback && (isCorrectOption || isSelected)
                    ? { animation: "popIn 0.3s ease-out both" }
                    : undefined
                }
                className={`rounded-2xl border-2 px-4 py-3 text-left font-medium transition ${
                  showFeedback && isCorrectOption
                    ? "border-mint bg-mint/10"
                    : showFeedback && isSelected
                      ? "border-coral bg-coral/10"
                      : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {option}
              </button>
            );
          })}
          <button
            type="button"
            disabled={selected === null || submitting}
            onClick={() => handleAdvance(true, normalize(selected ?? "") === normalize(question.correct_answer ?? ""))}
            className="pill-btn mt-2 bg-primary py-3 text-primary-foreground shadow-md shadow-primary/30 disabled:opacity-50"
          >
            {submitting ? "Saving..." : isLast ? "Finish" : "Next"}
          </button>
        </div>
      )}

      {step.kind === "build" && (() => {
        const complete = builtIndices.length === step.tokens.length;
        const isCorrect =
          complete &&
          normalize(builtIndices.map((i) => step.tokens[i]).join(" ")) ===
            normalize(question.correct_answer ?? "");
        return (
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap justify-center gap-2">
              {step.tokens.map((token, tokenIndex) =>
                builtIndices.includes(tokenIndex) ? null : (
                  <button
                    key={tokenIndex}
                    type="button"
                    onClick={() => setBuiltIndices([...builtIndices, tokenIndex])}
                    className="rounded-2xl border-2 border-border bg-card px-4 py-2.5 font-medium transition hover:border-primary/40"
                  >
                    {token}
                  </button>
                ),
              )}
            </div>
            {complete && (
              <p
                className={`text-sm font-semibold ${isCorrect ? "text-mint" : "text-coral"}`}
                style={{ animation: "popIn 0.3s ease-out both" }}
              >
                {isCorrect ? "That's right! ✅" : `Not quite — it's "${question.correct_answer}"`}
              </p>
            )}
            <button
              type="button"
              disabled={!complete || submitting}
              onClick={() => handleAdvance(true, isCorrect)}
              className="pill-btn mt-1 bg-primary py-3 text-primary-foreground shadow-md shadow-primary/30 disabled:opacity-50"
            >
              {submitting ? "Saving..." : isLast ? "Finish" : "Next"}
            </button>
          </div>
        );
      })()}
    </div>
  );
}
