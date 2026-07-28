"use client";

import { speakKorean } from "@/lib/speak";

export function SpeakButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => speakKorean(text)}
      className="pill-btn inline-flex items-center gap-1.5 border-2 border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary"
      aria-label={`Play pronunciation for ${text}`}
    >
      🔊 Listen
    </button>
  );
}
