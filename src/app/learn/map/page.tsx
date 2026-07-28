import Link from "next/link";
import { getCurrentProfile } from "@/lib/data/session";
import { getLevelMap } from "@/lib/data/progress";
import { IconBadge } from "@/components/ui/icon-badge";

const STATUS_LABEL = {
  completed: "Completed",
  in_progress: "In progress",
  locked: "Locked",
  available: "Open",
} as const;

const STATUS_STYLE = {
  completed: "bg-mint/15 text-mint",
  in_progress: "bg-primary/15 text-primary",
  locked: "bg-muted/15 text-muted",
  available: "bg-sky/15 text-sky",
} as const;

const UNIT_EMOJI: Record<string, string> = {
  wave: "👋",
  box: "📦",
  "map-pin": "📍",
  "calendar-check": "✅",
  calendar: "📅",
  utensils: "🍜",
  "message-circle": "💬",
  "heart-pulse": "💪",
  "scroll-text": "📜",
};

export default async function LevelMapPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const levelMap = await getLevelMap(profile.id);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-extrabold">🗺️ Level Map</h1>

      {levelMap.map((level, levelIndex) => (
        <section
          key={level.id}
          className="flex flex-col gap-3"
          style={{ animation: `fadeSlideUp 0.5s ease-out ${levelIndex * 0.06}s both` }}
        >
          <h2 className="text-lg font-bold">{level.name}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {level.units.map((unit) => {
              const locked = false;
              const badgeColor =
                unit.progress.status === "completed"
                  ? "mint"
                  : unit.progress.status === "in_progress"
                    ? "violet"
                    : "sky";
              return (
                <div
                  key={unit.id}
                  className={`pop-card p-4 ${locked ? "opacity-50 grayscale" : ""}`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <IconBadge emoji={UNIT_EMOJI[unit.icon ?? ""] ?? "⭐"} color={badgeColor} size={44} />
                    <div className="flex-1">
                      <p className="font-bold leading-tight">{unit.name}</p>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[unit.progress.status]}`}
                      >
                        {STATUS_LABEL[unit.progress.status]}
                      </span>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-1 text-sm">
                    {unit.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-center justify-between">
                        <span>
                          {lesson.lesson_type === "unlock_game" ? "🔒 " : ""}
                          {lesson.name}
                        </span>
                        {lesson.status === "locked" ? (
                          <span className="text-muted">—</span>
                        ) : (
                          <Link
                            href={`/learn/lesson/${lesson.id}`}
                            className="font-semibold text-primary underline"
                          >
                            {lesson.status === "completed" ? "Review" : "Start"}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
