import Link from "next/link";
import type { LessonWithStatus } from "@/lib/data/progress";
import { Mascot, type MascotId } from "@/components/ui/mascot";

const NODE_Y_STEP = 140;
const TOP_PADDING = 56;
const BOTTOM_PADDING = 56;

// Gentle left/right sway like Duolingo's path. Percentages keep it inside
// the viewport at any width, so the page never scrolls sideways.
function nodeX(index: number): number {
  return 50 + 22 * Math.sin(index * 1.15);
}

export function LevelPath({
  lessons,
  mascot,
}: {
  lessons: LessonWithStatus[];
  mascot: MascotId;
}) {
  const height =
    TOP_PADDING + Math.max(lessons.length - 1, 0) * NODE_Y_STEP + BOTTOM_PADDING;
  const points = lessons.map((_, i) => ({
    x: nodeX(i),
    y: TOP_PADDING + i * NODE_Y_STEP,
  }));

  const activeIndex = lessons.findIndex((l) => l.status === "in_progress");

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      {lessons.map((lesson, i) => {
        const { x, y } = points[i];
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
            style={{ left: `${x}%`, top: y, width: "8rem" }}
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

      {/* mascot cheering beside the current stage */}
      {activeIndex >= 0 && (
        <div
          className="absolute"
          style={{
            top: points[activeIndex].y - 6,
            left: points[activeIndex].x > 50 ? "8%" : "auto",
            right: points[activeIndex].x > 50 ? "auto" : "8%",
          }}
        >
          <Mascot id={mascot} size={56} animate />
        </div>
      )}
    </div>
  );
}
