import Link from "next/link";
import type { LessonWithStatus } from "@/lib/data/progress";

const NODE_Y_STEP = 120;
const TOP_PADDING = 70;
const BOTTOM_PADDING = 60;

function nodeX(index: number): number {
  return 50 + 26 * Math.sin(index * 1.1);
}

export function LevelPath({
  unitName,
  lessons,
  mascot,
}: {
  unitName: string;
  lessons: LessonWithStatus[];
  mascot: string;
}) {
  const height = TOP_PADDING + Math.max(lessons.length - 1, 0) * NODE_Y_STEP + BOTTOM_PADDING;
  const points = lessons.map((_, i) => ({ x: nodeX(i), y: TOP_PADDING + i * NODE_Y_STEP }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="sky-bg rounded-3xl p-5">
      <div className="cloud" style={{ width: 70, height: 34, top: "6%", left: "8%" }} />
      <div className="cloud" style={{ width: 50, height: 26, top: "14%", right: "10%", animationDelay: "1.5s" }} />
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-extrabold drop-shadow">{unitName}</h2>
        <span className="text-3xl" style={{ animation: "floatY 4s ease-in-out infinite" }}>
          {mascot}
        </span>
      </div>

      <div className="relative" style={{ height }}>
        <svg
          className="absolute left-0 top-0 h-full w-full"
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
        >
          <path
            d={pathD}
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth={3}
            strokeDasharray="2 10"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {lessons.map((lesson, i) => {
          const { x, y } = points[i];
          const locked = lesson.status === "locked";
          const completed = lesson.status === "completed";
          const label = lesson.lesson_type === "unlock_game" ? "🔒" : String(i + 1);

          const content = (
            <div
              className={`icon-badge h-14 w-14 border-4 text-xl font-extrabold shadow-lg ${
                completed
                  ? "border-white bg-mint text-white"
                  : locked
                    ? "border-white/40 bg-white/30 text-white/70"
                    : "border-white bg-sun text-white"
              }`}
              style={!locked && !completed ? { animation: "popIn 0.5s ease-out, floatY 2.4s ease-in-out infinite" } : undefined}
            >
              {completed ? "✅" : label}
            </div>
          );

          return (
            <div
              key={lesson.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${x}%`, top: y }}
            >
              {locked ? (
                content
              ) : (
                <Link href={`/learn/lesson/${lesson.id}`} className="block">
                  {content}
                </Link>
              )}
              <p className="mt-1 max-w-[6rem] text-xs font-semibold text-white drop-shadow">
                {lesson.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
