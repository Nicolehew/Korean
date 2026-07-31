"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveAccount } from "@/lib/actions/account";
import { Mascot, type MascotId } from "@/components/ui/mascot";

export function SaveProgressStep({ name, mascot }: { name: string; mascot: MascotId }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveAccount, undefined);

  useEffect(() => {
    if (state?.ok) router.push("/learn");
  }, [state?.ok, router]);

  return (
    <>
      <div className="relative z-10 -mb-10 flex justify-center">
        <Mascot id={mascot} size={104} animate />
      </div>
      <div className="pop-card p-7 pt-14 text-foreground">
        <h1 className="text-center text-xl font-extrabold">Nice to meet you, {name}!</h1>
        <p className="mb-5 text-center text-sm text-muted">
          Want to save your progress? Add an email and password so you can carry
          on from another phone or computer.
        </p>

        <form action={action} className="flex flex-col gap-3">
          <input name="email" type="email" required placeholder="Email" autoComplete="email"
            className="rounded-xl border-2 border-border bg-card px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30" />
          <input name="password" type="password" required minLength={8}
            placeholder="Password (8+ characters)" autoComplete="new-password"
            className="rounded-xl border-2 border-border bg-card px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30" />
          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          <button type="submit" disabled={pending}
            className="pill-btn bg-mint py-3 text-white shadow-md shadow-mint/30 disabled:opacity-60">
            {pending ? "Saving..." : "Save and start"}
          </button>
        </form>

        <button type="button" onClick={() => router.push("/learn")}
          className="mt-3 w-full py-2 text-sm font-semibold text-muted underline">
          Skip for now
        </button>
      </div>
    </>
  );
}
