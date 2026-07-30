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
  // Keep Hangul, spaces and sentence punctuation; drop the rest.
  t = t.replace(/[^\uAC00-\uD7A3\u3130-\u318F0-9\s?!.,]/g, " ");
  return t.replace(/\s+/g, " ").trim();
}

export function speakKorean(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const phrase = speakableKorean(text);
  if (!phrase) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.lang = "ko-KR";
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}
