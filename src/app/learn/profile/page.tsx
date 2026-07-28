import { getCurrentProfile } from "@/lib/data/session";
import { logout } from "@/lib/actions/auth";
import { IconBadge } from "@/components/ui/icon-badge";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold">Profile</h1>
      <div className="pop-card flex items-center gap-4 p-5">
        <IconBadge emoji="🧑‍🎓" color="violet" size={64} />
        <div>
          <p className="text-lg font-bold">{profile.full_name}</p>
          <p className="text-sm capitalize text-muted">{profile.role}</p>
        </div>
      </div>
      <form action={logout}>
        <button type="submit" className="pill-btn border-2 border-border px-6 py-2.5 font-semibold">
          Log out
        </button>
      </form>
    </div>
  );
}
