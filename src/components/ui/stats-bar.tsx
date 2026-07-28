import { Mascot, type MascotId } from "@/components/ui/mascot";

// Duolingo-style top row: compact stat chips, always on one line so the
// page never scrolls sideways on a phone.
export function StatsBar({
  mascot,
  streak,
  stars,
  unitsCleared,
}: {
  mascot: MascotId;
  streak: number;
  stars: number;
  unitsCleared: number;
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-1 py-2">
      <Mascot id={mascot} size={34} />
      <div className="flex items-center gap-1.5 text-sm font-extrabold">
        <span className="text-base">🔥</span>
        <span className="text-coral">{streak}</span>
      </div>
      <div className="flex items-center gap-1.5 text-sm font-extrabold">
        <span className="text-base">⭐</span>
        <span className="text-sun">{stars}</span>
      </div>
      <div className="flex items-center gap-1.5 text-sm font-extrabold">
        <span className="text-base">🏆</span>
        <span className="text-mint">{unitsCleared}</span>
      </div>
    </div>
  );
}
