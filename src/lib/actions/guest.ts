"use server";

import { redirect } from "next/navigation";

import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_MASCOT } from "@/lib/mascots";

export type StartState = { error: string } | undefined;

// Students shouldn't have to think about accounts. They type a name and we
// silently create a real Supabase user behind it, so progress, streaks and
// the teacher/parent dashboards all keep working unchanged.
//
// The email is synthetic and non-routable — it exists only because Supabase
// requires one. Nothing is ever sent to it.
const GUEST_DOMAIN = "students.hangeulquest.app";

export async function startLearning(
  _prev: StartState,
  formData: FormData,
): Promise<StartState> {
  const name = String(formData.get("full_name") ?? "").trim();
  if (name.length < 1) return { error: "Please tell us your name first." };
  if (name.length > 40) return { error: "That name is a bit too long." };

  const avatar = String(formData.get("avatar") ?? DEFAULT_MASCOT);

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { error: "This site isn't connected to its database yet." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: `s-${randomUUID()}@${GUEST_DOMAIN}`,
    // Never shown or reused — the session cookie is what keeps them signed in.
    password: randomUUID() + randomUUID(),
    options: { data: { full_name: name, role: "student", avatar_url: avatar } },
  });
  if (error) return { error: error.message };

  redirect("/save-progress");
}
