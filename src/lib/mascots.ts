import { MASCOT_IDS, type MascotId } from "@/components/ui/mascot";

export const DEFAULT_MASCOT: MascotId = MASCOT_IDS[0];

// avatar_url holds a mascot id (e.g. "cat"). Older rows may hold an emoji
// from the first version of the picker, so fall back rather than render junk.
export function toMascotId(value: string | null | undefined): MascotId {
  return (MASCOT_IDS as string[]).includes(value ?? "")
    ? (value as MascotId)
    : DEFAULT_MASCOT;
}
