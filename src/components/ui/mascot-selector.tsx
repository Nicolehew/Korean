"use client";

import { useState, useTransition } from "react";
import { MASCOTS } from "@/lib/mascots";
import { updateMascot } from "@/lib/actions/profile";

export function MascotSelector({ currentAvatar }: { currentAvatar: string | null }) {
  const [selected, setSelected] = useState(currentAvatar ?? MASCOTS[0]);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {MASCOTS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          disabled={isPending}
          onClick={() => {
            setSelected(emoji);
            startTransition(() => updateMascot(emoji));
          }}
          aria-pressed={selected === emoji}
          className={`icon-badge h-12 w-12 text-2xl transition disabled:opacity-60 ${
            selected === emoji ? "bg-primary/20 ring-2 ring-primary" : "bg-border/40 hover:bg-primary/10"
          }`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
