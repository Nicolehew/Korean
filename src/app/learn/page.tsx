import { getCurrentProfile } from "@/lib/data/session";
import { getLevelMap, findNextLesson, getStreak } from "@/lib/data/progress";
import { LevelPath } from "@/components/lesson/level-path";
import { StatsBar } from "@/components/ui/stats-bar";
import { toMascotId } from "@/lib/mascots";

export default async function LearnHomePage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const [levelMap, streak] = await Promise.all([
    getLevelMap(profile.id),
    getStreak(profile.id),
  ]);
  const next = findNextLesson(levelMap);
  const currentUnit = next?.unit ?? levelMap[0]?.units[0];
  const currentLevel = next?.level ?? levelMap[0];

  const allUnits = levelMap.flatMap((l) => l.units);
  const stars = allUnits.reduce((sum, u) => sum + u.progress.stars, 0);
  const cleared = allUnits.filter((u) => u.progress.status === "completed").length;
  const mascot = toMascotId(profile.avatar_url);

  return (
    <div className="flex flex-col gap-4">
      <StatsBar
        mascot={mascot}
        streak={streak?.current_streak ?? 0}
        stars={stars}
        unitsCleared={cleared}
      />

      {currentUnit ? (
        <>
          {/* Duolingo-style unit banner */}
          <div className="rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-md">
            <p className="text-[11px] font-bold uppercase tracking-wide opacity-80">
              {currentLevel?.name}
            </p>
            <p className="text-lg font-extrabold leading-tight">{currentUnit.name}</p>
          </div>

          <LevelPath lessons={currentUnit.lessons} mascot={mascot} />
        </>
      ) : (
        <div className="pop-card p-5 text-center">
          <p className="text-3xl">🎉</p>
          <p className="font-bold">You&apos;re all caught up!</p>
        </div>
      )}
    </div>
  );
}
