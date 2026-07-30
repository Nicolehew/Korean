import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data/session";
import { StartForm } from "@/components/auth/start-form";

export default async function Home() {
  const profile = await getCurrentProfile();
  if (profile) redirect("/learn");

  return (
    <div className="cosmic-bg flex flex-1 items-center justify-center p-5">
      <div
        className="blob"
        style={{ width: 130, height: 130, top: "7%", left: "6%", background: "#b38dff", opacity: 0.3 }}
      />
      <div
        className="blob"
        style={{ width: 80, height: 80, bottom: "9%", right: "8%", background: "#ffc23c", opacity: 0.28, animationDelay: "2s" }}
      />

      <div
        className="relative w-full max-w-sm"
        style={{ animation: "fadeSlideUp 0.5s ease-out both" }}
      >
        <StartForm />
      </div>
    </div>
  );
}
