"use client";

import { useActionState } from "react";
import { saveAccount } from "@/lib/actions/account";

export function SaveAccountForm({ savedEmail }: { savedEmail: string | null }) {
  const [state, action, pending] = useActionState(saveAccount, undefined);

  if (savedEmail) {
    return (
      <p className="text-sm text-muted">
        ✅ Progress saved to <span className="font-semibold">{savedEmail}</span>.
        Log in with it on any device.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <p className="text-sm text-muted">
        Add an email and password so your progress follows you to other devices.
      </p>
      <input name="email" type="email" required placeholder="Email" autoComplete="email"
        className="rounded-xl border-2 border-border bg-card px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30" />
      <input name="password" type="password" required minLength={8} placeholder="Password (8+ characters)" autoComplete="new-password"
        className="rounded-xl border-2 border-border bg-card px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30" />
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.ok && <p className="text-sm text-mint">{state.ok}</p>}
      <button type="submit" disabled={pending}
        className="pill-btn bg-mint py-3 text-white shadow-md shadow-mint/30 disabled:opacity-60">
        {pending ? "Saving..." : "Save my progress"}
      </button>
    </form>
  );
}
