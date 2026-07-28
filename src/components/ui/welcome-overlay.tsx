"use client";

import { useEffect, useState } from "react";
import { Mascot, MASCOT_NAMES, type MascotId } from "@/components/ui/mascot";

// Duolingo-style greeting: the mascot pops in, waves hello, then the
// overlay fades away. Shown once per browser session so it feels like a
// welcome rather than a nag on every navigation.
export function WelcomeOverlay({
  name,
  mascot,
}: {
  name: string;
  mascot: MascotId;
}) {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("greeted") === "1") return;
    sessionStorage.setItem("greeted", "1");
    setShow(true);
    const fade = setTimeout(() => setLeaving(true), 2100);
    const hide = setTimeout(() => setShow(false), 2700);
    return () => {
      clearTimeout(fade);
      clearTimeout(hide);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background"
      style={{
        animation: leaving ? "fadeOut 0.6s ease-in forwards" : undefined,
      }}
    >
      <div style={{ animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div style={{ animation: "wiggle 1s ease-in-out 0.5s 2" }}>
          <Mascot id={mascot} size={168} />
        </div>
      </div>
      <p
        className="px-8 text-center text-2xl font-extrabold"
        style={{ animation: "fadeSlideUp 0.5s ease-out 0.35s both" }}
      >
        {name}, it&apos;s really you!
      </p>
      <p
        className="text-sm font-semibold text-muted"
        style={{ animation: "fadeSlideUp 0.5s ease-out 0.5s both" }}
      >
        {MASCOT_NAMES[mascot]} is ready to learn 💜
      </p>
    </div>
  );
}
