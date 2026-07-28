import { redirect } from "next/navigation";
import { getCurrentProfile, homePathForRole } from "@/lib/data/session";
import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage() {
  const profile = await getCurrentProfile();
  if (profile) redirect(homePathForRole(profile.role));

  return (
    <div className="cosmic-bg flex flex-1 items-center justify-center p-6">
      <div
        className="blob"
        style={{ width: 110, height: 110, top: "8%", right: "10%", background: "#ff5a6e", opacity: 0.4 }}
      />
      <div
        className="blob"
        style={{ width: 60, height: 60, bottom: "10%", left: "14%", background: "#16c79a", animationDelay: "1s" }}
      />
      <div
        className="pop-card relative w-full max-w-sm p-8 text-foreground"
        style={{ animation: "fadeSlideUp 0.5s ease-out both" }}
      >
        <span className="mb-2 block text-center text-4xl">🎒</span>
        <h1 className="mb-6 text-center text-2xl font-extrabold">
          Create your account
        </h1>
        <SignupForm />
      </div>
    </div>
  );
}
