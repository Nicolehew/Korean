"use client";

import { useActionState, useState } from "react";
import { startLearning } from "@/lib/actions/guest";
import { MascotPicker } from "@/components/ui/mascot-picker";
import { Mascot, MASCOT_IDS, MASCOT_NAMES, type MascotId } from "@/components/ui/mascot";

export function StartForm() {
  const [state, action, pending] = useActionState(startLearning, undefined);
  // Lifted so the big mascot above the card reflects the current choice.
  const [mascot, setMascot] = useState<MascotId>(MASCOT_IDS[0]);

  return (
    <>
      <div className="relative z-10 -mb-10 flex justify-center">
        {/* key remounts the svg so the pop-in animation replays on change */}
        <div key={mascot} style={{ animation: "popIn 0.4s ease-out both" }}>
          <Mascot id={mascot} size={104} animate />
        </div>
      </div>

      <div className="pop-card p-7 pt-14 text-foreground">
        <h1 className="text-center text-2xl font-extrabold">Hangeul Quest</h1>
        <p className="mb-6 text-center text-sm text-muted">
          Learn Korean with {MASCOT_NAMES[mascot]} 💜
        </p>

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

          <MascotPicker value={mascot} onChange={setMascot} />

          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="pill-btn bg-mint py-3.5 text-lg text-white shadow-md shadow-mint/30 disabled:opacity-60"
          >
            {pending ? "Getting ready..." : "Start learning →"}
          </button>
        </form>
      </div>
    </>
  );
}
