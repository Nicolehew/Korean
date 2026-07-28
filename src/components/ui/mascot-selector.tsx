"use client";

import { useState, useTransition } from "react";
import { Mascot, MASCOT_IDS, MASCOT_NAMES, type MascotId } from "@/components/ui/mascot";
import { updateMascot } from "@/lib/actions/profile";

export function MascotSelector({ currentAvatar }: { currentAvatar: string | null }) {
  const initial = (MASCOT_IDS as string[]).includes(currentAvatar ?? "")
    ? (currentAvatar as MascotId)
    : MASCOT_IDS[0];
  const [selected, setSelected] = useState<MascotId>(initial);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {MASCOT_IDS.map((id) => (
        <button
          key={id}
          type="button"
          disabled={isPending}
          title={MASCOT_NAMES[id]}
          onClick={() => {
            setSelected(id);
            startTransition(() => updateMascot(id));
          }}
          aria-pressed={selected === id}
          className={`rounded-2xl p-1 transition disabled:opacity-60 ${
            selected === id ? "bg-primary/20 ring-2 ring-primary" : "bg-border/40 hover:bg-primary/10"
          }`}
        >
          <Mascot id={id} size={48} />
        </button>
      ))}
    </div>
  );
}
