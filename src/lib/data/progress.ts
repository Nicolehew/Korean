import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  Level,
  Unit,
  Lesson,
  ProgressStatus,
  UserUnitProgress,
  UserProgress,
  Streak,
} from "@/types/domain";

export type LessonWithStatus = Lesson & { status: ProgressStatus };
export type UnitWithProgress = Unit & {
  lessons: LessonWithStatus[];
  progress: { status: ProgressStatus; stars: number };
};
export type LevelMap = (Level & {
  units: UnitWithProgress[];
  /** Locked levels are visible but not enterable until the prior test passes. */
  locked: boolean;
  testPassed: boolean;
})[];

export async function getLevelMap(userId: string): Promise<LevelMap> {
  const supabase = await createClient();

  const [
    { data: levels },
    { data: units },
    { data: lessons },
    { data: unitProgress },
    { data: lessonProgress },
  ] = await Promise.all([
    supabase.from("levels").select("*").order("order_index"),
    supabase.from("units").select("*").order("order_index"),
    supabase.from("lessons").select("*").order("order_index"),
    supabase.from("user_unit_progress").select("*").eq("user_id", userId),
    supabase.from("user_progress").select("*").eq("user_id", userId),
  ]);

  const unitProgressById = new Map<string, UserUnitProgress>(
    (unitProgress ?? []).map((p) => [p.unit_id, p as UserUnitProgress]),
  );
  const lessonProgressById = new Map<string, UserProgress>(
    (lessonProgress ?? []).map((p) => [p.lesson_id, p as UserProgress]),
  );

  const sortedUnits = [...((units ?? []) as Unit[])].sort(
    (a, b) => a.order_index - b.order_index,
  );

  const orderedLevels = [...((levels ?? []) as Level[])].sort(
    (a, b) => a.order_index - b.order_index,
  );

  // A level's test counts as passed when its level_test lesson is completed
  // at or above the level's threshold.
  const testPassedByLevel = new Map<string, boolean>();
  for (const level of orderedLevels) {
    const levelUnitIds = sortedUnits
      .filter((u) => u.level_id === level.id)
      .map((u) => u.id);
    const testLessons = ((lessons ?? []) as Lesson[]).filter(
      (l) => levelUnitIds.includes(l.unit_id) && l.lesson_type === "level_test",
    );
    const passed =
      testLessons.length > 0 &&
      testLessons.some((l) => {
        const rec = lessonProgressById.get(l.id);
        return (
          rec?.status === "completed" &&
          (rec.score ?? 0) >= (level.test_threshold_pct ?? 80)
        );
      });
    testPassedByLevel.set(level.id, passed);
  }

  let priorLevelBlocked = false;

  return orderedLevels.map((level) => {
    const testPassed = testPassedByLevel.get(level.id) ?? false;
    const locked = priorLevelBlocked;
    // Once a level's test is unpassed, everything after it is gated.
    priorLevelBlocked = priorLevelBlocked || !testPassed;

    return {
    ...level,
    locked,
    testPassed,
    units: sortedUnits
      .filter((u) => u.level_id === level.id)
      .map((unit) => {
        const storedUnit = unitProgressById.get(unit.id);

        const unitLessons = ((lessons ?? []) as Lesson[])
          .filter((l) => l.unit_id === unit.id)
          .sort((a, b) => a.order_index - b.order_index);

        // Every stage is open. Students asked to be able to jump ahead and
        // to replay finished lessons, so status is now purely a record of
        // what they've done, not a gate on what they may tap.
        let firstUnfinishedTaken = false;
        const lessonsWithStatus: LessonWithStatus[] = unitLessons.map((lesson) => {
          const stored = lessonProgressById.get(lesson.id);
          if (stored?.status === "completed") {
            return { ...lesson, status: "completed" as ProgressStatus };
          }
          if (!firstUnfinishedTaken) {
            firstUnfinishedTaken = true;
            return { ...lesson, status: "in_progress" as ProgressStatus };
          }
          return { ...lesson, status: "available" as ProgressStatus };
        });

        const allDone =
          lessonsWithStatus.length > 0 &&
          lessonsWithStatus.every((l) => l.status === "completed");

        return {
          ...unit,
          lessons: lessonsWithStatus.map((l) =>
            locked ? { ...l, status: "locked" as ProgressStatus } : l,
          ),
          progress: {
            status: (locked
              ? "locked"
              : allDone
                ? "completed"
                : "in_progress") as ProgressStatus,
            stars: storedUnit?.stars ?? 0,
          },
        };
      }),
    };
  });
}

export function findNextLesson(levelMap: LevelMap) {
  for (const level of levelMap) {
    for (const unit of level.units) {
      const lesson = unit.lessons.find((l) => l.status === "in_progress");
      if (lesson) return { level, unit, lesson };
    }
  }
  return null;
}

export async function getGlobalUnitOrder() {
  const supabase = await createClient();
  const [{ data: levels }, { data: units }] = await Promise.all([
    supabase.from("levels").select("id, order_index").order("order_index"),
    supabase.from("units").select("id, level_id, order_index"),
  ]);
  const levelOrder = new Map((levels ?? []).map((l) => [l.id, l.order_index]));
  return [...(units ?? [])].sort((a, b) => {
    const la = levelOrder.get(a.level_id) ?? 0;
    const lb = levelOrder.get(b.level_id) ?? 0;
    if (la !== lb) return la - lb;
    return a.order_index - b.order_index;
  });
}

export async function getNextUnitId(currentUnitId: string): Promise<string | null> {
  const ordered = await getGlobalUnitOrder();
  const idx = ordered.findIndex((u) => u.id === currentUnitId);
  if (idx === -1 || idx === ordered.length - 1) return null;
  return ordered[idx + 1].id;
}

export async function getStreak(userId: string): Promise<Streak | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as Streak) ?? null;
}
