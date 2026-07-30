/** Strip teaching notation so the voice reads natural Korean, not symbols. */
export function speakableKorean(raw: string): string {
  let t = raw;
  // "가다 → 가요" teaches a transformation; only the result is worth hearing.
  if (t.includes("→")) t = t.split("→").pop() ?? t;
  // "이에요/예요" lists alternatives — speak one, not the word "slash".
  // The longer branch is kept because notation like "아/어야" puts the shared
  // ending only on the second one, so taking the first would drop it.
  t = t.replace(/([가-힣]+)\/([가-힣]+)/g, (_m, a: string, b: string) =>
    b.length > a.length ? b : a,
  );
  // "[이름]" is a fill-in-the-blank placeholder, not a word.
  t = t.replace(/\[[^\]]*\]/g, " ");
  // Leading dashes mark a grammar ending ("-습니다"), not speech.
  t = t.replace(/(^|\s)[-–]+/g, " ");
  // Keep Hangul, digits and spaces only. Sentence punctuation is dropped
  // deliberately: it changes nothing about pronunciation, and a fallback
  // voice with no Korean support will happily read "?" out as the words
  // "question mark" while silently skipping the Hangul.
  t = t.replace(/[^\uAC00-\uD7A3\u3130-\u318F0-9\s]/g, " ");
  return t.replace(/\s+/g, " ").trim();
}

/** A real Korean voice, or null when the device has none installed. */
export function findKoreanVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === "ko-KR" || v.lang.startsWith("ko")) ?? null;
}

export type SpeakResult = "spoken" | "unsupported" | "no-korean-voice";

export function speakKorean(text: string): SpeakResult {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return "unsupported";
  }
  const phrase = speakableKorean(text);
  if (!phrase) return "unsupported";

  // Without a Korean voice the browser substitutes the system default, which
  // cannot pronounce Hangul. Better to say so than to emit nonsense.
  const voice = findKoreanVoice();
  if (!voice) return "no-korean-voice";

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
  return "spoken";
}
