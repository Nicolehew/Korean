"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AccountState = { error?: string; ok?: string } | undefined;

function configured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Attaches an email + password to the guest account the student is already
 * signed in as. Same user row, so every lesson, streak and test result is
 * kept — it just becomes reachable from another device.
 */
export async function saveAccount(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  if (!configured()) return { error: "Not connected to the database yet." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email.includes("@")) return { error: "Please enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please start learning first." };

  // Deliberately not supabase.auth.updateUser(): an email change there
  // sends a confirmation mail, which the free tier rate-limits, and it
  // rejects the synthetic guest domain outright. The RPC writes the new
  // credentials directly for this user only.
  const { data, error } = await supabase.rpc("claim_account", {
    new_email: email,
    new_password: password,
  });
  if (error) return { error: error.message };

  const result = data as { ok: boolean; error?: string } | null;
  if (!result?.ok) return { error: result?.error ?? "Could not save your account." };

  return { ok: "Saved. You can now log in on any device." };
}

export async function login(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  if (!configured()) return { error: "Not connected to the database yet." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect("/learn");
}
