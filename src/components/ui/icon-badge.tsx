const COLORS = {
  coral: "#ff5a6e",
  sky: "#2fb0f0",
  mint: "#16c79a",
  violet: "#8a4fff",
  sun: "#ffc23c",
} as const;

export function IconBadge({
  emoji,
  color = "violet",
  size = 56,
  animate,
  className = "",
}: {
  emoji: string;
  color?: keyof typeof COLORS;
  size?: number;
  animate?: "flicker" | "wiggle" | "float";
  className?: string;
}) {
  const animationClass =
    animate === "flicker"
      ? "animate-[flicker_2s_ease-in-out_infinite]"
      : animate === "wiggle"
        ? "animate-[wiggle_1.2s_ease-in-out_infinite]"
        : animate === "float"
          ? "animate-[floatY_4s_ease-in-out_infinite]"
          : "";

  return (
    <span
      className={`icon-badge ${animationClass} ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        background: `${COLORS[color]}22`,
      }}
    >
      {emoji}
    </span>
  );
}
