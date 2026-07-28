import { getCurrentProfile } from "@/lib/data/session";
import { getStreak, getLevelMap } from "@/lib/data/progress";
import { createClient } from "@/lib/supabase/server";
import { IconBadge } from "@/components/ui/icon-badge";

export default async function RewardsPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const [streak, levelMap, { data: userAchievements }] = await Promise.all([
    getStreak(profile.id),
    getLevelMap(profile.id),
    supabase
      .from("user_achievements")
      .select("earned_at, achievements(name, description, icon)")
      .eq("user_id", profile.id),
  ]);

  const totalStars = levelMap
    .flatMap((l) => l.units)
    .reduce((sum, u) => sum + u.progress.stars, 0);
  const unitsCompleted = levelMap
    .flatMap((l) => l.units)
    .filter((u) => u.progress.status === "completed").length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold">🏆 Rewards</h1>

      <div className="grid grid-cols-3 gap-3">
        <div
          className="pop-card flex flex-col items-center gap-2 p-4 text-center"
          style={{ animation: "fadeSlideUp 0.5s ease-out both" }}
        >
          <IconBadge emoji="🔥" color="coral" animate={streak?.current_streak ? "flicker" : undefined} />
          <p className="font-extrabold">{streak?.current_streak ?? 0}</p>
          <p className="text-xs text-muted">day streak</p>
        </div>
        <div
          className="pop-card flex flex-col items-center gap-2 p-4 text-center"
          style={{ animation: "fadeSlideUp 0.5s ease-out 0.06s both" }}
        >
          <IconBadge emoji="⭐" color="sun" animate="wiggle" />
          <p className="font-extrabold">{totalStars}</p>
          <p className="text-xs text-muted">stars earned</p>
        </div>
        <div
          className="pop-card flex flex-col items-center gap-2 p-4 text-center"
          style={{ animation: "fadeSlideUp 0.5s ease-out 0.12s both" }}
        >
          <IconBadge emoji="🏆" color="violet" animate="float" />
          <p className="font-extrabold">{unitsCompleted}</p>
          <p className="text-xs text-muted">units cleared</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold">Badges</h2>
        {userAchievements && userAchievements.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {userAchievements.map((ua, i) => (
              <li key={i} className="pop-card flex flex-col items-center gap-2 p-4 text-center">
                <IconBadge emoji={(ua.achievements as { icon?: string })?.icon ?? "🎖️"} color="mint" size={48} />
                <p className="text-sm font-semibold">
                  {(ua.achievements as { name?: string })?.name}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="pop-card p-6 text-center">
            <p className="mb-1 text-3xl">🎖️</p>
            <p className="text-muted">No badges yet — keep learning to earn your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
