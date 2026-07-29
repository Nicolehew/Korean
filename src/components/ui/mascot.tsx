// Hand-drawn SVG mascots — soft rounded plush-toy style with big eyes and
// blush cheeks. Kept as inline SVG (rather than images) so they scale
// crisply, animate, and need no asset pipeline.

export type MascotId = "duck" | "cat" | "bear" | "bunny" | "dino" | "fox" | "panda";

export const MASCOT_IDS: MascotId[] = ["duck", "cat", "bear", "bunny", "dino", "fox", "panda"];

export const MASCOT_NAMES: Record<MascotId, string> = {
  duck: "Ori the duck",
  cat: "Nabi the cat",
  bear: "Gomi the bear",
  bunny: "Tokki the bunny",
  dino: "Dino",
  fox: "Yeou the fox",
  panda: "Panda",
};

const PALETTE: Record<MascotId, { body: string; inner: string; dark: string }> = {
  duck: { body: "#f7d94e", inner: "#fdf0b8", dark: "#f0a23c" },
  cat: { body: "#f5a94e", inner: "#ffd2a6", dark: "#e08b32" },
  bear: { body: "#b98a63", inner: "#e4c3a3", dark: "#9c7050" },
  bunny: { body: "#f7ecd9", inner: "#ffd5d5", dark: "#e0d2bb" },
  dino: { body: "#8ec963", inner: "#c2e6a4", dark: "#6faa46" },
  fox: { body: "#ef8b57", inner: "#ffd8bd", dark: "#d16f3d" },
  panda: { body: "#f4f4f6", inner: "#dcdce2", dark: "#3f3f46" },
};


function DuckArt({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-body`} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#ffef9e" />
          <stop offset="55%" stopColor="#fbdd5c" />
          <stop offset="100%" stopColor="#efc132" />
        </radialGradient>
        <radialGradient id={`${uid}-hat`} cx="38%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#fffdf4" />
          <stop offset="60%" stopColor="#f7f0d9" />
          <stop offset="100%" stopColor="#e6dcbd" />
        </radialGradient>
        <radialGradient id={`${uid}-beak`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffb562" />
          <stop offset="100%" stopColor="#ef8f26" />
        </radialGradient>
        <radialGradient id={`${uid}-bag`} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#cfe9f5" />
          <stop offset="100%" stopColor="#a4cfe4" />
        </radialGradient>
      </defs>

      {/* soft ground shadow */}
      <ellipse cx="50" cy="95" rx="26" ry="4" fill="#000" opacity="0.08" />

      {/* body */}
      <ellipse cx="50" cy="73" rx="25" ry="22" fill={`url(#${uid}-body)`} />
      {/* wings tucked at the sides */}
      <ellipse cx="26" cy="72" rx="7" ry="12" fill="#f3cd45" />
      <ellipse cx="74" cy="72" rx="7" ry="12" fill="#f3cd45" />
      {/* webbed feet */}
      <ellipse cx="39" cy="93" rx="8" ry="4.5" fill={`url(#${uid}-beak)`} />
      <ellipse cx="61" cy="93" rx="8" ry="4.5" fill={`url(#${uid}-beak)`} />

      {/* crossbody strap + bag */}
      <path d="M40 55 Q52 66 63 74" stroke="#bcdcec" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="58" y="72" width="16" height="12" rx="5" fill={`url(#${uid}-bag)`} />
      <rect x="58" y="72" width="16" height="4.5" rx="2.2" fill="#bcdcec" />

      {/* head */}
      <circle cx="50" cy="47" r="27" fill={`url(#${uid}-body)`} />

      {/* bucket hat: wavy brim then rounded crown */}
      <path
        d="M14 40
           Q22 32 30 39
           Q38 31 46 38
           Q54 31 62 38
           Q70 31 78 39
           Q86 33 88 41
           Q70 51 50 51
           Q30 51 14 40 Z"
        fill={`url(#${uid}-hat)`}
      />
      <path d="M27 40 Q27 14 50 14 Q73 14 73 40 Q50 47 27 40 Z" fill={`url(#${uid}-hat)`} />
      <path d="M27 40 Q50 46 73 40" stroke="#e2d7b4" strokeWidth="1.6" fill="none" />

      {/* flower on the hat */}
      <g transform="translate(70 22)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-5.4"
            rx="3.2"
            ry="4.6"
            fill="#ffb3c9"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="2.9" fill="#ffd85e" />
      </g>

      {/* eyes with highlights */}
      <ellipse cx="40" cy="49" rx="5.4" ry="6" fill="#2b2118" />
      <ellipse cx="60" cy="49" rx="5.4" ry="6" fill="#2b2118" />
      <circle cx="42" cy="46.5" r="1.9" fill="#fff" />
      <circle cx="62" cy="46.5" r="1.9" fill="#fff" />
      <circle cx="38.6" cy="51.5" r="0.9" fill="#fff" opacity="0.7" />
      <circle cx="58.6" cy="51.5" r="0.9" fill="#fff" opacity="0.7" />

      {/* blush */}
      <ellipse cx="30" cy="56" rx="5.4" ry="3.6" fill="#ff9db4" opacity="0.6" />
      <ellipse cx="70" cy="56" rx="5.4" ry="3.6" fill="#ff9db4" opacity="0.6" />

      {/* beak */}
      <ellipse cx="50" cy="58" rx="6.4" ry="4.4" fill={`url(#${uid}-beak)`} />
      <path d="M45 58.6 Q50 61 55 58.6" stroke="#d97b18" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </>
  );
}

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
      {id === "duck" && <DuckArt uid={`d${size}`} />}
      {id !== "duck" && (
      <>
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

      {/* nose / beak */}
      <ellipse cx="50" cy="56" rx="3.4" ry="2.6" fill="#2b2b33" />
      <path
        d="M43 62 Q50 68 57 62"
        fill="none"
        stroke="#2b2b33"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* paws / webbed feet */}
      <ellipse cx="34" cy="88" rx="8" ry="6" fill={c.inner} />
      <ellipse cx="66" cy="88" rx="8" ry="6" fill={c.inner} />
      </>
      )}
    </svg>
  );
}
