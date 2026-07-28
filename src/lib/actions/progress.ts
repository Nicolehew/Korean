"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitLessonResult(input: {
  lessonId: string;
  unitId: string;
  nextUnitId: string | null;
  scorePct: number;
  isUnlockGame: boolean;
  unlockThresholdPct: number | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      lesson_id: input.lessonId,
      status: "completed",
      score: input.scorePct,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );

  const passedGate =
    input.isUnlockGame && input.scorePct >= (input.unlockThresholdPct ?? 100);

  if (passedGate) {
    await supabase.from("user_unit_progress").upsert(
      {
        user_id: user.id,
        unit_id: input.unitId,
        status: "completed",
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,unit_id" },
    );

    if (input.nextUnitId) {
      await supabase.from("user_unit_progress").upsert(
        { user_id: user.id, unit_id: input.nextUnitId, status: "in_progress" },
        { onConflict: "user_id,unit_id" },
      );
    }
  }

  await bumpStreak(user.id);

  revalidatePath("/learn");
  revalidatePath("/learn/map");

  return { passedGate };
}

async function bumpStreak(userId: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: streak } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!streak) {
    await supabase
      .from("streaks")
      .insert({ user_id: userId, current_streak: 1, longest_streak: 1, last_activity_date: today });
    return;
  }

  if (streak.last_activity_date === today) return;

  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const nextCurrent = streak.last_activity_date === yesterday ? streak.current_streak + 1 : 1;

  await supabase
    .from("streaks")
    .update({
      current_streak: nextCurrent,
      longest_streak: Math.max(nextCurrent, streak.longest_streak),
      last_activity_date: today,
    })
    .eq("user_id", userId);
}
