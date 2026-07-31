import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data/session";
import { SaveProgressStep } from "@/components/auth/save-progress-step";
import { toMascotId } from "@/lib/mascots";

export default async function SaveProgressPage() {
  const profile = await getCurrentProfile();
  // Only reachable straight after starting; otherwise send them to learn.
  if (!profile) redirect("/");

  return (
    <div className="cosmic-bg flex flex-1 items-center justify-center p-5">
      <div className="relative w-full max-w-sm" style={{ animation: "fadeSlideUp 0.5s ease-out both" }}>
        <SaveProgressStep name={profile.full_name} mascot={toMascotId(profile.avatar_url)} />
      </div>
    </div>
  );
}
