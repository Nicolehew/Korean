"use client";

import { useActionState } from "react";
import { startLearning } from "@/lib/actions/guest";
import { MascotPicker } from "@/components/ui/mascot-picker";

export function StartForm() {
  const [state, action, pending] = useActionState(startLearning, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="full_name" className="text-sm font-bold">
          What should we call you?
        </label>
        <input
          id="full_name"
          name="full_name"
          required
          maxLength={40}
          autoFocus
          autoComplete="given-name"
          placeholder="Your name"
          className="rounded-xl border-2 border-border bg-card px-4 py-3 text-lg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <MascotPicker />

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="pill-btn bg-mint py-3.5 text-lg text-white shadow-md shadow-mint/30 disabled:opacity-60"
      >
        {pending ? "Getting ready..." : "Start learning →"}
      </button>
    </form>
  );
}
