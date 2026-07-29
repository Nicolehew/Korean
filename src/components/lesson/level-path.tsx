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

  const height = lessons.length * ROW_HEIGHT;

  // Smooth curve through each stage centre so the trail visibly links them.
  const centres = lessons.map((_, i) => ({
    x: nodeX(i),
    y: i * ROW_HEIGHT + ROW_HEIGHT * 0.24,
  }));
  const trailD = centres
    .map((pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = centres[i - 1];
      const midY = (prev.y + pt.y) / 2;
      return `C ${prev.x} ${midY}, ${pt.x} ${midY}, ${pt.x} ${pt.y}`;
    })
    .join(" ");

  return (
    <div
      className="path-bg relative w-full overflow-hidden rounded-3xl"
      style={{ height }}
    >
      {/* clouds */}
      <div
        className="scene-cloud"
        style={{ width: 64, height: 22, top: 24, left: "8%", animationDelay: "0s" }}
      />
      <div
        className="scene-cloud"
        style={{ width: 46, height: 16, top: 70, left: "55%", animationDelay: "-13s" }}
      />

      {/* dirt trail winding between the stages */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={trailD} fill="none" stroke="#e6ddff" strokeWidth="13" strokeLinecap="round" />
        <path d={trailD} fill="none" stroke="#f4f0ff" strokeWidth="9" strokeLinecap="round" />
        <path
          d={trailD}
          fill="none"
          stroke="#d8ceff"
          strokeWidth="9"
          strokeLinecap="butt"
          strokeDasharray="1.5 7"
          opacity="0.5"
        />
      </svg>

      {lessons.map((lesson, i) => {
        const x = nodeX(i);
        const completed = lesson.status === "completed";
        const isActive = i === activeIndex;
        const isGate = lesson.lesson_type === "unlock_game";
        const isTest = lesson.lesson_type === "level_test";
        const locked = lesson.status === "locked";

        const circle = (
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-extrabold transition active:translate-y-1 ${
              completed
                ? "bg-mint text-white shadow-[0_5px_0_#0f9c78]"
                : locked
                  ? "bg-border text-muted shadow-[0_5px_0_rgba(0,0,0,0.10)]"
                  : isTest
                    ? "bg-coral text-white shadow-[0_5px_0_#d4455a]"
                    : isActive
                      ? "bg-sun text-white shadow-[0_5px_0_#d99a1f]"
                      : "bg-white text-primary shadow-[0_5px_0_#cfc6f5]"
            }`}
          >
            {locked ? "🔒" : completed ? "★" : isTest ? "🏁" : isGate ? "🎮" : i + 1}
          </div>
        );

        return (
          <div
            key={lesson.id}
            className="absolute z-10 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${x}%`, top: i * ROW_HEIGHT, width: "8.5rem" }}
          >
            {isActive && (
              <span className="mb-1 rounded-lg bg-white px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-primary shadow">
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
            <p className="mt-1.5 line-clamp-2 text-center text-[11px] font-bold leading-tight text-muted">
              {lesson.name}
            </p>
          </div>
        );
      })}

      {showMascot && activeIndex >= 0 && (
        <div
          className="absolute z-10"
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
