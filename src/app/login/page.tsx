import { redirect } from "next/navigation";
import { getCurrentProfile, homePathForRole } from "@/lib/data/session";
import { LoginForm } from "@/components/auth/login-form";

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
        className="pop-card relative w-full max-w-sm p-8 text-foreground"
        style={{ animation: "fadeSlideUp 0.5s ease-out both" }}
      >
        <span className="mb-2 block text-center text-4xl">👋</span>
        <h1 className="mb-6 text-center text-2xl font-extrabold text-foreground">
          Welcome back
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
