// Flat-vector garden backdrop for the lesson path: pastel rolling grass with
// smiling flowers, toadstools and sparkles. Drawn as SVG (not an image) so it
// stretches to whatever height a unit needs and stays crisp on any screen.

const GREEN_BACK = "#cfeab0";
const GREEN_MID = "#b9e096";
const GREEN_FRONT = "#a6d67f";
const LEAF = "#4f9c52";
const LEAF_DARK = "#3f8043";

function FaceFlower({
  x,
  y,
  scale = 1,
  petal,
  centre,
  delay = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  petal: string;
  centre: string;
  delay?: number;
}) {
  return (
    // Positioning lives on the outer <g> and the animation on the inner one.
    // A CSS transform animation replaces the element's own transform
    // attribute, so combining them drops the flower at the origin.
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <g
      style={{
        animation: `sway 5s ease-in-out ${delay}s infinite`,
        transformOrigin: "0px 0px",
      }}
    >
      {/* stem + leaves */}
      <path d="M0 0 C -3 -18, 3 -30, 0 -46" stroke={LEAF} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M0 -16 C -12 -20, -15 -28, -4 -26 Z" fill={LEAF} />
      <path d="M0 -26 C 12 -30, 15 -38, 4 -36 Z" fill={LEAF_DARK} />
      {/* petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse key={deg} cx="0" cy="-62" rx="6.5" ry="11" fill={petal} transform={`rotate(${deg} 0 -46)`} />
      ))}
      {/* face */}
      <circle cx="0" cy="-46" r="10.5" fill={centre} />
      <path d="M-5 -48 q2.2 2.6 4.4 0" stroke="#7a5a2e" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <path d="M1 -48 q2.2 2.6 4.4 0" stroke="#7a5a2e" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <ellipse cx="-6.5" cy="-42" rx="2.4" ry="1.6" fill="#ffa9b8" opacity="0.75" />
      <ellipse cx="6.5" cy="-42" rx="2.4" ry="1.6" fill="#ffa9b8" opacity="0.75" />
    </g>
    </g>
  );
}

function Toadstool({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-5 0 L-4 -13 Q0 -16 4 -13 L5 0 Z" fill="#fdf6ec" />
      <path d="M-15 -12 Q0 -30 15 -12 Q0 -6 -15 -12 Z" fill="#f0655f" />
      <circle cx="-6" cy="-15" r="2.6" fill="#fff" />
      <circle cx="4" cy="-18" r="2" fill="#fff" />
      <circle cx="8" cy="-13" r="1.6" fill="#fff" />
    </g>
  );
}

function Daisy({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse key={deg} cx="0" cy="-5" rx="2.4" ry="4" fill="#fffdf7" transform={`rotate(${deg})`} />
      ))}
      <circle cx="0" cy="0" r="2.4" fill="#ffcf4d" />
    </g>
  );
}

function Sparkle({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <path
      d={`M${x} ${y - 6 * s} L${x + 1.7 * s} ${y - 1.7 * s} L${x + 6 * s} ${y} L${x + 1.7 * s} ${y + 1.7 * s} L${x} ${y + 6 * s} L${x - 1.7 * s} ${y + 1.7 * s} L${x - 6 * s} ${y} L${x - 1.7 * s} ${y - 1.7 * s} Z`}
      fill="#ffffff"
      opacity="0.9"
      style={{ animation: `twinkle 2.6s ease-in-out ${delay}s infinite` }}
    />
  );
}

function Tree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-7 0 L-5 -46 L5 -46 L7 0 Z" fill="#a9713f" />
      <path d="M-5 -30 L-16 -40" stroke="#a9713f" strokeWidth="5" strokeLinecap="round" />
      <circle cx="0" cy="-62" r="30" fill="#7cc45c" />
      <circle cx="-24" cy="-50" r="20" fill="#8fd06a" />
      <circle cx="24" cy="-52" r="22" fill="#6fb852" />
    </g>
  );
}

/** Repeats a garden band every `BAND` px so any unit height stays populated. */
const BAND = 420;

export function GardenScene({ height }: { height: number }) {
  const bands = Math.max(1, Math.ceil(height / BAND));

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 400 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e4f5cf" />
          <stop offset="100%" stopColor="#c3e6a2" />
        </linearGradient>
      </defs>

      <rect width="400" height={height} fill="url(#grass)" />

      {Array.from({ length: bands }).map((_, i) => {
        const o = i * BAND;
        return (
          <g key={i}>
            {/* rolling hill silhouettes */}
            <ellipse cx="60" cy={o + 90} rx="150" ry="70" fill={GREEN_BACK} />
            <ellipse cx="350" cy={o + 200} rx="140" ry="80" fill={GREEN_MID} />
            <ellipse cx="140" cy={o + 330} rx="170" ry="75" fill={GREEN_FRONT} opacity="0.75" />

            {/* trees at the edges so they never sit under the path */}
            <Tree x={44} y={o + 152} scale={0.5} />
            <Tree x={356} y={o + 350} scale={0.46} />

            {/* face flowers */}
            <FaceFlower x={58} y={o + 300} scale={0.66} petal="#ffe480" centre="#ffc23c" delay={0} />
            <FaceFlower x={344} y={o + 172} scale={0.6} petal="#ffb6cf" centre="#ff8fb1" delay={1.2} />
            <FaceFlower x={52} y={o + 412} scale={0.55} petal="#d9b8ff" centre="#b98cff" delay={2.1} />

            <Toadstool x={330} y={o + 268} scale={0.6} />
            <Toadstool x={92} y={o + 196} scale={0.45} />

            <Daisy x={100} y={o + 210} scale={1.1} />
            <Daisy x={300} y={o + 386} scale={0.9} />
            <Daisy x={36} y={o + 348} scale={0.95} />
            <Daisy x={366} y={o + 236} scale={0.8} />

            <Sparkle x={120} y={o + 120} s={0.8} delay={0} />
            <Sparkle x={286} y={o + 250} s={1} delay={0.8} />
            <Sparkle x={70} y={o + 356} s={0.7} delay={1.6} />
            <Sparkle x={330} y={o + 96} s={0.9} delay={2.2} />
          </g>
        );
      })}
    </svg>
  );
}
