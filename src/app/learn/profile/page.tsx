import { getCurrentProfile } from "@/lib/data/session";
import { createClient } from "@/lib/supabase/server";
import { SaveAccountForm } from "@/components/auth/save-account-form";
import { logout } from "@/lib/actions/auth";
import { MascotSelector } from "@/components/ui/mascot-selector";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { toMascotId } from "@/lib/mascots";
import { Mascot } from "@/components/ui/mascot";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Guest accounts carry a synthetic address; only show a real one back.
  const email = user?.email ?? "";
  const savedEmail = email.endsWith("@students.hangeulquest.app") ? null : email || null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold">Profile</h1>
      <div className="pop-card flex items-center gap-4 p-5">
        <Mascot id={toMascotId(profile.avatar_url)} size={72} animate />
        <div>
          <p className="text-lg font-bold">{profile.full_name}</p>
          <p className="text-sm capitalize text-muted">{profile.role}</p>
        </div>
      </div>
      <div className="pop-card p-5">
        <p className="mb-3 font-bold">Your mascot</p>
        <MascotSelector currentAvatar={profile.avatar_url} />
      </div>
      <div className="pop-card p-5">
        <p className="mb-3 font-bold">Save your progress</p>
        <SaveAccountForm savedEmail={savedEmail} />
      </div>
      <div className="pop-card p-5">
        <p className="mb-3 font-bold">Appearance</p>
        <ThemeToggle />
      </div>
      <form action={logout}>
        <button type="submit" className="pill-btn border-2 border-border px-6 py-2.5 font-semibold">
          Switch learner
        </button>
      </form>
    </div>
  );
}
