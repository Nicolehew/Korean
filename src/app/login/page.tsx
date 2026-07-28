import { redirect } from "next/navigation";
import { getCurrentProfile, homePathForRole } from "@/lib/data/session";
import { LoginForm } from "@/components/auth/login-form";
import { Mascot } from "@/components/ui/mascot";

export default async function LoginPage() {
  const profile = await getCurrentProfile();
  if (profile) redirect(homePathForRole(profile.role));

  return (
    <div className="cosmic-bg flex flex-1 items-center justify-center p-6">
      <div
        className="blob"
        style={{ width: 100, height: 100, top: "10%", left: "10%", background: "#2fb0f0", opacity: 0.4 }}
      />
      <div
        className="blob"
        style={{ width: 70, height: 70, bottom: "12%", right: "12%", background: "#ffc23c", animationDelay: "2s" }}
      />

      <div
        className="relative w-full max-w-sm"
        style={{ animation: "fadeSlideUp 0.5s ease-out both" }}
      >
        {/* mascot peeking over the top of the card */}
        <div className="relative z-10 -mb-10 flex justify-center">
          <Mascot id="cat" size={96} animate />
        </div>

        <div className="pop-card p-8 pt-14 text-foreground">
          <h1 className="text-center text-2xl font-extrabold">Welcome back!</h1>
          <p className="mb-6 text-center text-sm text-muted">
            Your mascot missed you 💜
          </p>
          <LoginForm />
        </div>

        <div className="mt-4 flex justify-center gap-3 opacity-90">
          <Mascot id="bunny" size={40} />
          <Mascot id="dino" size={40} />
          <Mascot id="bear" size={40} />
        </div>
      </div>
    </div>
  );
}
