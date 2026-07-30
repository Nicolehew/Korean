import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/domain";

// Memoized per-request: safe to call from multiple Server Components
// without re-querying Supabase each time.
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  // Lets the welcome page render before a Supabase
  // project is wired up, instead of crashing on missing env vars.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (profile as Profile) ?? null;
});

export async function requireStudent() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/");
  return profile;
}
