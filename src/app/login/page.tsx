import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data/session";
import { LoginForm } from "@/components/auth/login-form";
import { Mascot } from "@/components/ui/mascot";

export default async function LoginPage() {
  if (await getCurrentProfile()) redirect("/learn");

  return (
    <div className="cosmic-bg flex flex-1 items-center justify-center p-5">
      <div className="relative w-full max-w-sm" style={{ animation: "fadeSlideUp 0.5s ease-out both" }}>
        <div className="relative z-10 -mb-10 flex justify-center">
          <Mascot id="duck" size={96} animate />
        </div>
        <div className="pop-card p-7 pt-14 text-foreground">
          <h1 className="text-center text-2xl font-extrabold">Welcome back!</h1>
          <p className="mb-6 text-center text-sm text-muted">Log in to pick up where you left off 💜</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
