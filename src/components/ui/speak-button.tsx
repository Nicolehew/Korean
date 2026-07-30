"use client";

import { useEffect, useState } from "react";
import { speakKorean, findKoreanVoice } from "@/lib/speak";

export function SpeakButton({ text }: { text: string }) {
  const [hasVoice, setHasVoice] = useState<boolean | null>(null);
  const [warned, setWarned] = useState(false);

  useEffect(() => {
    // Voices load asynchronously, and on some browsers the first call
    // returns an empty list until the voiceschanged event fires.
    const check = () => setHasVoice(!!findKoreanVoice());
    check();
    window.speechSynthesis?.addEventListener?.("voiceschanged", check);
    return () =>
      window.speechSynthesis?.removeEventListener?.("voiceschanged", check);
  }, []);

  if (hasVoice === false) {
    return (
      <p className="max-w-[15rem] text-center text-xs text-muted">
        🔇 Add a Korean voice in your device&apos;s speech settings to hear
        pronunciation.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => {
          if (speakKorean(text) === "no-korean-voice") setWarned(true);
        }}
        className="pill-btn inline-flex items-center gap-1.5 border-2 border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary"
        aria-label={`Play pronunciation for ${text}`}
      >
        🔊 Listen
      </button>
      {warned && (
        <span className="text-[11px] text-muted">
          No Korean voice found on this device.
        </span>
      )}
    </div>
  );
}
