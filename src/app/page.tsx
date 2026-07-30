import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile, homePathForRole } from "@/lib/data/session";
import { StartForm } from "@/components/auth/start-form";
import { Mascot } from "@/components/ui/mascot";

export default async function Home() {
  const profile = await getCurrentProfile();
  if (profile) redirect(homePathForRole(profile.role));

  return (
    <div className="cosmic-bg flex flex-1 items-center justify-center p-5">
      <div
        className="blob"
        style={{ width: 110, height: 110, top: "8%", left: "8%", background: "#2fb0f0", opacity: 0.35 }}
      />
      <div
        className="blob"
        style={{ width: 70, height: 70, bottom: "10%", right: "10%", background: "#ffc23c", animationDelay: "2s" }}
      />

      <div
        className="relative w-full max-w-sm"
        style={{ animation: "fadeSlideUp 0.5s ease-out both" }}
      >
        <div className="relative z-10 -mb-10 flex justify-center">
          <Mascot id="duck" size={104} animate />
        </div>

        <div className="pop-card p-7 pt-14 text-foreground">
          <h1 className="text-center text-2xl font-extrabold">Hangeul Quest</h1>
          <p className="mb-6 text-center text-sm text-muted">
            Learn Korean, one stage at a time 💜
          </p>
          <StartForm />
        </div>

        <p className="mt-5 text-center text-xs text-white/70">
          Teacher or parent?{" "}
          <Link href="/login" className="underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
