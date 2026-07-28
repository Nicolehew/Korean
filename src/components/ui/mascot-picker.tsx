"use client";

import { useState } from "react";
import { Mascot, MASCOT_IDS, MASCOT_NAMES, type MascotId } from "@/components/ui/mascot";

export function MascotPicker({ defaultValue = MASCOT_IDS[0] }: { defaultValue?: MascotId }) {
  const [selected, setSelected] = useState<MascotId>(defaultValue);

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium">Pick your mascot</legend>
      <input type="hidden" name="avatar" value={selected} />
      <div className="flex flex-wrap justify-center gap-2">
        {MASCOT_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelected(id)}
            aria-pressed={selected === id}
            title={MASCOT_NAMES[id]}
            className={`rounded-2xl p-1 transition ${
              selected === id
                ? "bg-primary/20 ring-2 ring-primary"
                : "bg-border/40 hover:bg-primary/10"
            }`}
            style={selected === id ? { animation: "popIn 0.3s ease-out both" } : undefined}
          >
            <Mascot id={id} size={44} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
