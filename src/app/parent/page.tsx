import { getCurrentProfile } from "@/lib/data/session";
import { getStreak, getLevelMap } from "@/lib/data/progress";
import { createClient } from "@/lib/supabase/server";

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
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="font-semibold">No linked students yet</p>
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
      <h1 className="text-2xl font-bold">Your children</h1>
      {studentSummaries.map(({ student, streak, unitsCompleted, totalUnits }) => (
        <div key={student.id} className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 font-semibold">{student.full_name}</p>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div>
              <p className="text-lg">🔥 {streak?.current_streak ?? 0}</p>
              <p className="text-muted">day streak</p>
            </div>
            <div>
              <p className="text-lg">✅ {unitsCompleted}/{totalUnits}</p>
              <p className="text-muted">units done</p>
            </div>
            <div>
              <p className="text-lg">🏆 {streak?.longest_streak ?? 0}</p>
              <p className="text-muted">best streak</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
