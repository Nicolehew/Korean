import { getCurrentProfile } from "@/lib/data/session";
import { getStreak, getLevelMap } from "@/lib/data/progress";
import { createClient } from "@/lib/supabase/server";
import { IconBadge } from "@/components/ui/icon-badge";

export default async function TeacherDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const { data: classes } = await supabase
    .from("classes")
    .select("id, name")
    .eq("teacher_id", profile.id);

  if (!classes || classes.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <span className="text-4xl">🍎</span>
        <p className="font-bold">No classes yet</p>
        <p className="max-w-sm text-muted">
          Classes and student rosters are currently managed directly in Supabase.
          A class-creation UI is a natural next addition here.
        </p>
      </div>
    );
  }

  const classSummaries = await Promise.all(
    classes.map(async (klass) => {
      const { data: classStudents } = await supabase
        .from("class_students")
        .select("student_id, profiles(id, full_name)")
        .eq("class_id", klass.id);

      const students = (classStudents ?? [])
        .map((cs) => cs.profiles as unknown as { id: string; full_name: string } | null)
        .filter((s): s is { id: string; full_name: string } => !!s);

      const summaries = await Promise.all(
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

      return { klass, summaries };
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold">🍎 Your classes</h1>
      {classSummaries.map(({ klass, summaries }, i) => (
        <section
          key={klass.id}
          className="pop-card p-5"
          style={{ animation: `fadeSlideUp 0.5s ease-out ${i * 0.06}s both` }}
        >
          <h2 className="mb-3 text-lg font-bold">{klass.name}</h2>
          {summaries.length === 0 ? (
            <p className="text-muted">No students in this class yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-primary/10 text-muted">
                  <tr>
                    <th className="p-3">Student</th>
                    <th className="p-3">Streak</th>
                    <th className="p-3">Units completed</th>
                  </tr>
                </thead>
                <tbody>
                  {summaries.map(({ student, streak, unitsCompleted, totalUnits }) => (
                    <tr key={student.id} className="border-t border-border">
                      <td className="flex items-center gap-2 p-3">
                        <IconBadge emoji="🧑‍🎓" color="violet" size={32} /> {student.full_name}
                      </td>
                      <td className="p-3">🔥 {streak?.current_streak ?? 0}</td>
                      <td className="p-3">
                        {unitsCompleted}/{totalUnits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
