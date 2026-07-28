import Link from "next/link";
import { requireRole } from "@/lib/data/session";
import { logout } from "@/lib/actions/auth";
import { MASCOTS } from "@/lib/mascots";

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole(["student"]);

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shadow-sm">
        <Link href="/learn" className="flex items-center gap-2 font-extrabold">
          <span className="text-xl">🚀</span> Hangeul Quest
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/learn" className="transition hover:text-primary">Home</Link>
          <Link href="/learn/map" className="transition hover:text-primary">Map</Link>
          <Link href="/learn/rewards" className="transition hover:text-primary">Rewards</Link>
          <Link
            href="/learn/profile"
            className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary transition hover:bg-primary/20"
          >
            <span>{profile.avatar_url ?? MASCOTS[0]}</span> {profile.full_name}
          </Link>
          <form action={logout}>
            <button type="submit" className="text-muted transition hover:text-foreground">
              Log out
            </button>
          </form>
        </nav>
      </header>
      <main className="flex flex-1 flex-col p-4">{children}</main>
    </div>
  );
}
