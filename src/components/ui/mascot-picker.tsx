"use client";

import { useState } from "react";
import { Mascot, MASCOT_IDS, MASCOT_NAMES, type MascotId } from "@/components/ui/mascot";

/**
 * Controlled when `value`/`onChange` are supplied (so a parent can mirror the
 * choice elsewhere), otherwise it manages its own state.
 */
export function MascotPicker({
  value,
  onChange,
}: {
  value?: MascotId;
  onChange?: (id: MascotId) => void;
}) {
  const [internal, setInternal] = useState<MascotId>(MASCOT_IDS[0]);
  const selected = value ?? internal;

  function choose(id: MascotId) {
    setInternal(id);
    onChange?.(id);
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-bold">Pick your mascot</legend>
      <input type="hidden" name="avatar" value={selected} />
      <div className="flex flex-wrap justify-center gap-2">
        {MASCOT_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => choose(id)}
            aria-pressed={selected === id}
            title={MASCOT_NAMES[id]}
            className={`rounded-2xl p-1 transition active:scale-90 ${
              selected === id
                ? "bg-primary/20 ring-2 ring-primary"
                : "bg-border/40 hover:bg-primary/10"
            }`}
          >
            <Mascot id={id} size={44} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
