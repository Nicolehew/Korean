"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { homePathForRole } from "@/lib/data/session";
import { DEFAULT_MASCOT } from "@/lib/mascots";
import type { UserRole } from "@/types/domain";

export type AuthFormState = { error: string } | undefined;

export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
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
  redirect("/login");
}
