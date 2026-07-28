import Link from "next/link";
import { getCurrentProfile } from "@/lib/data/session";
import { getLevelMap, findNextLesson, getStreak } from "@/lib/data/progress";
import { IconBadge } from "@/components/ui/icon-badge";
import { LevelPath } from "@/components/lesson/level-path";
import { MASCOTS } from "@/lib/mascots";

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

  return (
    <div className="flex flex-col gap-6">
      <div style={{ animation: "fadeSlideUp 0.5s ease-out both" }}>
        <h1 className="text-2xl font-extrabold">Hi, {profile.full_name}! 👋</h1>
        <p className="text-muted">Choose a stage to play</p>
      </div>

      <div
        className="pop-card flex items-center gap-3 p-4"
        style={{ animation: "fadeSlideUp 0.5s ease-out 0.05s both" }}
      >
        <IconBadge emoji="🔥" color="coral" animate={streak?.current_streak ? "flicker" : undefined} />
        <div>
          <p className="font-bold">{streak?.current_streak ?? 0} day streak</p>
          <p className="text-sm text-muted">Best: {streak?.longest_streak ?? 0} days</p>
        </div>
      </div>

      {currentUnit ? (
        <div style={{ animation: "fadeSlideUp 0.5s ease-out 0.1s both" }}>
          <LevelPath
            unitName={`${currentLevel?.name} · ${currentUnit.name}`}
            lessons={currentUnit.lessons}
            mascot={profile.avatar_url ?? MASCOTS[0]}
          />
        </div>
      ) : (
        <div className="pop-card p-5" style={{ animation: "fadeSlideUp 0.5s ease-out 0.1s both" }}>
          <p className="font-bold">You&apos;re all caught up! 🎉</p>
        </div>
      )}

      <Link href="/learn/map" className="text-sm font-semibold text-primary underline">
        View full level map →
      </Link>
    </div>
  );
}
