"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateMascot(avatar: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase.from("profiles").update({ avatar_url: avatar }).eq("id", user.id);
  revalidatePath("/learn");
  revalidatePath("/learn/profile");
}
