import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile, homePathForRole } from "@/lib/data/session";

export default async function Home() {
  const profile = await getCurrentProfile();
  if (profile) redirect(homePathForRole(profile.role));

  return (
    <main className="cosmic-bg flex flex-1 flex-col items-center justify-center gap-8 px-6 py-20 text-center">
      <div
        className="blob"
        style={{ width: 160, height: 160, top: "8%", left: "8%", background: "#8a4fff", opacity: 0.5 }}
      />
      <div
        className="blob"
        style={{ width: 90, height: 90, top: "18%", right: "12%", background: "#ffc23c", animationDelay: "1.5s" }}
      />
      <div
        className="blob"
        style={{ width: 50, height: 50, bottom: "14%", left: "16%", background: "#2fb0f0", animationDelay: "3s" }}
      />

      <div
        className="relative flex flex-col items-center gap-4"
        style={{ animation: "fadeSlideUp 0.7s ease-out both" }}
      >
        <span className="text-6xl animate-[wiggle_2.5s_ease-in-out_infinite]">🚀</span>
        <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Learn Korean, one stage at a time
        </h1>
        <p className="max-w-md text-lg text-white/80">
          Bite-sized lessons, unlockable stages, and progress your teachers
          and parents can actually see.
        </p>
      </div>
      <div
        className="relative flex gap-4"
        style={{ animation: "fadeSlideUp 0.7s ease-out 0.15s both" }}
      >
        <Link
          href="/signup"
          className="pill-btn bg-coral px-7 py-3 text-white shadow-lg shadow-coral/30"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="pill-btn border-2 border-white/30 px-7 py-3 text-white"
        >
          Log in
        </Link>
      </div>
    </main>
  );
}
