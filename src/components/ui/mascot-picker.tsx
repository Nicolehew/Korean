"use client";

import { useState } from "react";
import { MASCOTS, DEFAULT_MASCOT } from "@/lib/mascots";

export function MascotPicker({ defaultValue = DEFAULT_MASCOT }: { defaultValue?: string }) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium">Pick your mascot</legend>
      <input type="hidden" name="avatar" value={selected} />
      <div className="flex flex-wrap justify-center gap-2">
        {MASCOTS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => setSelected(emoji)}
            aria-pressed={selected === emoji}
            className={`icon-badge h-12 w-12 text-2xl transition ${
              selected === emoji
                ? "bg-primary/20 ring-2 ring-primary"
                : "bg-border/40 hover:bg-primary/10"
            }`}
            style={selected === emoji ? { animation: "popIn 0.3s ease-out both" } : undefined}
          >
            {emoji}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
