import Link from "next/link";
import type { LessonWithStatus } from "@/lib/data/progress";
import { Mascot, type MascotId } from "@/components/ui/mascot";

// Each stage occupies a fixed row; the label sits inside that row so a
// two-line lesson name can never collide with the next circle.
const ROW_HEIGHT = 132;

// Gentle left/right sway like Duolingo's path. Percentages keep every node
// inside the viewport at any width, so the page never scrolls sideways.
function nodeX(index: number): number {
  return 50 + 20 * Math.sin(index * 1.15);
}

export function LevelPath({
  lessons,
  mascot,
  showMascot = false,
}: {
  lessons: LessonWithStatus[];
  mascot: MascotId;
  showMascot?: boolean;
}) {
  const activeIndex = lessons.findIndex((l) => l.status === "in_progress");

  return (
    <div className="relative w-full" style={{ height: lessons.length * ROW_HEIGHT }}>
      {lessons.map((lesson, i) => {
        const x = nodeX(i);
        const locked = lesson.status === "locked";
        const completed = lesson.status === "completed";
        const isActive = i === activeIndex;
        const isGate = lesson.lesson_type === "unlock_game";

        const circle = (
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-extrabold transition active:translate-y-1 ${
              completed
                ? "bg-mint text-white shadow-[0_5px_0_#0f9c78]"
                : locked
                  ? "bg-border text-muted shadow-[0_5px_0_rgba(0,0,0,0.12)]"
                  : "bg-sun text-white shadow-[0_5px_0_#d99a1f]"
            }`}
          >
            {completed ? "★" : isGate ? "🔒" : i + 1}
          </div>
        );

        return (
          <div
            key={lesson.id}
            className="absolute flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${x}%`, top: i * ROW_HEIGHT, width: "8.5rem" }}
          >
            {isActive && (
              <span className="mb-1 rounded-lg bg-card px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-primary shadow">
                Start
              </span>
            )}
            {locked ? (
              circle
            ) : (
              <Link href={`/learn/lesson/${lesson.id}`} aria-label={lesson.name}>
                {circle}
              </Link>
            )}
            <p className="mt-1.5 line-clamp-2 text-center text-[11px] font-semibold leading-tight text-muted">
              {lesson.name}
            </p>
          </div>
        );
      })}

      {showMascot && activeIndex >= 0 && (
        <div
          className="absolute"
          style={{
            top: activeIndex * ROW_HEIGHT + 24,
            left: nodeX(activeIndex) > 50 ? "6%" : "auto",
            right: nodeX(activeIndex) > 50 ? "auto" : "6%",
          }}
        >
          <Mascot id={mascot} size={54} animate />
        </div>
      )}
    </div>
  );
}
