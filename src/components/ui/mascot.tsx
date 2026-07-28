// Hand-drawn SVG mascots — soft rounded plush-toy style with big eyes and
// blush cheeks. Kept as inline SVG (rather than images) so they scale
// crisply, animate, and need no asset pipeline.

export type MascotId = "cat" | "bear" | "bunny" | "dino" | "fox" | "panda";

export const MASCOT_IDS: MascotId[] = ["cat", "bear", "bunny", "dino", "fox", "panda"];

export const MASCOT_NAMES: Record<MascotId, string> = {
  cat: "Nabi the cat",
  bear: "Gomi the bear",
  bunny: "Tokki the bunny",
  dino: "Dino",
  fox: "Yeou the fox",
  panda: "Panda",
};

const PALETTE: Record<MascotId, { body: string; inner: string; dark: string }> = {
  cat: { body: "#f5a94e", inner: "#ffd2a6", dark: "#e08b32" },
  bear: { body: "#b98a63", inner: "#e4c3a3", dark: "#9c7050" },
  bunny: { body: "#f7ecd9", inner: "#ffd5d5", dark: "#e0d2bb" },
  dino: { body: "#8ec963", inner: "#c2e6a4", dark: "#6faa46" },
  fox: { body: "#ef8b57", inner: "#ffd8bd", dark: "#d16f3d" },
  panda: { body: "#f4f4f6", inner: "#dcdce2", dark: "#3f3f46" },
};

export function Mascot({
  id,
  size = 72,
  className = "",
  animate = false,
}: {
  id: MascotId;
  size?: number;
  className?: string;
  animate?: boolean;
}) {
  const c = PALETTE[id];

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={MASCOT_NAMES[id]}
      style={animate ? { animation: "floatY 3s ease-in-out infinite" } : undefined}
    >
      {/* ears / head-top features */}
      {id === "cat" && (
        <>
          <path d="M22 34 L26 12 L44 24 Z" fill={c.body} />
          <path d="M78 34 L74 12 L56 24 Z" fill={c.body} />
          <path d="M27 30 L29 19 L38 25 Z" fill={c.inner} />
          <path d="M73 30 L71 19 L62 25 Z" fill={c.inner} />
        </>
      )}
      {id === "fox" && (
        <>
          <path d="M20 34 L24 10 L44 24 Z" fill={c.dark} />
          <path d="M80 34 L76 10 L56 24 Z" fill={c.dark} />
          <path d="M26 30 L28 18 L38 25 Z" fill={c.inner} />
          <path d="M74 30 L72 18 L62 25 Z" fill={c.inner} />
        </>
      )}
      {(id === "bear" || id === "panda") && (
        <>
          <circle cx="26" cy="26" r="13" fill={id === "panda" ? c.dark : c.body} />
          <circle cx="74" cy="26" r="13" fill={id === "panda" ? c.dark : c.body} />
          <circle cx="26" cy="26" r="7" fill={c.inner} />
          <circle cx="74" cy="26" r="7" fill={c.inner} />
        </>
      )}
      {id === "bunny" && (
        <>
          <ellipse cx="35" cy="18" rx="8" ry="20" fill={c.body} />
          <ellipse cx="65" cy="18" rx="8" ry="20" fill={c.body} />
          <ellipse cx="35" cy="19" rx="4" ry="14" fill={c.inner} />
          <ellipse cx="65" cy="19" rx="4" ry="14" fill={c.inner} />
        </>
      )}
      {id === "dino" && (
        <>
          <path d="M40 16 L45 6 L50 16 Z" fill={c.dark} />
          <path d="M52 15 L58 5 L63 16 Z" fill={c.dark} />
        </>
      )}

      {/* body + head */}
      <ellipse cx="50" cy="72" rx="30" ry="24" fill={c.body} />
      <circle cx="50" cy="48" r="32" fill={c.body} />

      {/* panda eye patches */}
      {id === "panda" && (
        <>
          <ellipse cx="38" cy="47" rx="10" ry="12" fill={c.dark} />
          <ellipse cx="62" cy="47" rx="10" ry="12" fill={c.dark} />
        </>
      )}

      {/* muzzle */}
      <ellipse cx="50" cy="58" rx="15" ry="11" fill={c.inner} opacity={id === "panda" ? 0 : 0.55} />

      {/* eyes */}
      <circle cx="38" cy="46" r="7" fill="#2b2b33" />
      <circle cx="62" cy="46" r="7" fill="#2b2b33" />
      <circle cx="40.5" cy="43.5" r="2.6" fill="#fff" />
      <circle cx="64.5" cy="43.5" r="2.6" fill="#fff" />

      {/* blush */}
      <ellipse cx="27" cy="57" rx="6" ry="4" fill="#ff9aa8" opacity="0.55" />
      <ellipse cx="73" cy="57" rx="6" ry="4" fill="#ff9aa8" opacity="0.55" />

      {/* nose + smile */}
      <ellipse cx="50" cy="56" rx="3.4" ry="2.6" fill="#2b2b33" />
      <path
        d="M43 62 Q50 68 57 62"
        fill="none"
        stroke="#2b2b33"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* paws */}
      <ellipse cx="34" cy="88" rx="8" ry="6" fill={c.inner} />
      <ellipse cx="66" cy="88" rx="8" ry="6" fill={c.inner} />
    </svg>
  );
}
