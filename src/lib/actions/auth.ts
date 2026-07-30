"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { homePathForRole } from "@/lib/data/session";
import { DEFAULT_MASCOT } from "@/lib/mascots";
import type { UserRole } from "@/types/domain";

export type AuthFormState = { error: string } | undefined;

// Without these, createClient() throws and the whole route 500s with an
// opaque "server error occurred". Surface it as a normal form error instead.
const MISSING_ENV_MESSAGE =
  "This site isn't connected to its database yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the hosting environment settings.";

function supabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!supabaseConfigured()) return { error: MISSING_ENV_MESSAGE };

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  redirect(homePathForRole((profile?.role as UserRole) ?? "student"));
}

export async function signup(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!supabaseConfigured()) return { error: MISSING_ENV_MESSAGE };

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "");
  // Only 'student' or 'parent' are ever accepted — see handle_new_user().
  const role = String(formData.get("role") ?? "student");
  const avatarUrl = String(formData.get("avatar") ?? DEFAULT_MASCOT);

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role, avatar_url: avatarUrl } },
  });
  if (error) return { error: error.message };

  redirect(role === "parent" ? "/parent" : "/learn");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
