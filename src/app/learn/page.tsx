import { getCurrentProfile } from "@/lib/data/session";
import { getLevelMap, findNextLesson, getStreak } from "@/lib/data/progress";
import { LevelPath } from "@/components/lesson/level-path";
import { StatsBar } from "@/components/ui/stats-bar";
import { toMascotId } from "@/lib/mascots";

const BANNER_TONES = [
  "bg-primary",
  "bg-mint",
  "bg-coral",
  "bg-violet",
  "bg-sky",
] as const;

export default async function LearnHomePage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const [levelMap, streak] = await Promise.all([
    getLevelMap(profile.id),
    getStreak(profile.id),
  ]);

  const next = findNextLesson(levelMap);
  const activeUnitId = next?.unit.id;

  const allUnits = levelMap.flatMap((l) => l.units);
  const stars = allUnits.reduce((sum, u) => sum + u.progress.stars, 0);
  const cleared = allUnits.filter((u) => u.progress.status === "completed").length;
  const mascot = toMascotId(profile.avatar_url);

  return (
    <div className="flex flex-col">
      {/* stats stay pinned while the course scrolls beneath */}
      <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 backdrop-blur">
        <StatsBar
          mascot={mascot}
          streak={streak?.current_streak ?? 0}
          stars={stars}
          unitsCleared={cleared}
        />
      </div>

      {levelMap.map((level) =>
        level.units.map((unit, unitIndex) => (
          <section key={unit.id} className="flex flex-col">
            <div
              className={`mt-4 rounded-2xl px-4 py-3 text-white shadow-md ${
                BANNER_TONES[unitIndex % BANNER_TONES.length]
              } ${unit.progress.status === "locked" ? "opacity-60" : ""}`}
            >
              <p className="text-[11px] font-bold uppercase tracking-wide opacity-85">
                {level.name}
              </p>
              <p className="text-lg font-extrabold leading-tight">{unit.name}</p>
            </div>

            <LevelPath
              lessons={unit.lessons}
              mascot={mascot}
              showMascot={unit.id === activeUnitId}
            />
          </section>
        )),
      )}

      <p className="py-8 text-center text-sm font-semibold text-muted">
        More lessons coming soon 🎉
      </p>
    </div>
  );
}
