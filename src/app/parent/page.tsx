import { getCurrentProfile } from "@/lib/data/session";
import { getStreak, getLevelMap } from "@/lib/data/progress";
import { createClient } from "@/lib/supabase/server";
import { IconBadge } from "@/components/ui/icon-badge";

export default async function ParentDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const { data: links } = await supabase
    .from("parent_student_links")
    .select("student_id, profiles!parent_student_links_student_id_fkey(id, full_name)")
    .eq("parent_id", profile.id);

  const students = (links ?? [])
    .map((l) => l.profiles as unknown as { id: string; full_name: string } | null)
    .filter((s): s is { id: string; full_name: string } => !!s);

  if (students.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <span className="text-4xl">👨‍👩‍👧</span>
        <p className="font-bold">No linked students yet</p>
        <p className="max-w-sm text-muted">
          Ask your school to link your account to your child&apos;s student profile.
        </p>
      </div>
    );
  }

  const studentSummaries = await Promise.all(
    students.map(async (student) => {
      const [streak, levelMap] = await Promise.all([
        getStreak(student.id),
        getLevelMap(student.id),
      ]);
      const units = levelMap.flatMap((l) => l.units);
      const unitsCompleted = units.filter((u) => u.progress.status === "completed").length;
      return { student, streak, unitsCompleted, totalUnits: units.length };
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold">👨‍👩‍👧 Your children</h1>
      {studentSummaries.map(({ student, streak, unitsCompleted, totalUnits }, i) => (
        <div
          key={student.id}
          className="pop-card p-5"
          style={{ animation: `fadeSlideUp 0.5s ease-out ${i * 0.06}s both` }}
        >
          <div className="mb-4 flex items-center gap-3">
            <IconBadge emoji="🧑‍🎓" color="violet" size={48} />
            <p className="text-lg font-bold">{student.full_name}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center gap-1">
              <IconBadge emoji="🔥" color="coral" size={40} />
              <p className="font-bold">{streak?.current_streak ?? 0}</p>
              <p className="text-xs text-muted">day streak</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <IconBadge emoji="✅" color="mint" size={40} />
              <p className="font-bold">
                {unitsCompleted}/{totalUnits}
              </p>
              <p className="text-xs text-muted">units done</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <IconBadge emoji="🏆" color="sun" size={40} />
              <p className="font-bold">{streak?.longest_streak ?? 0}</p>
              <p className="text-xs text-muted">best streak</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
