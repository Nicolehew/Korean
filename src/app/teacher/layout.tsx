import Link from "next/link";
import { requireRole } from "@/lib/data/session";
import { logout } from "@/lib/actions/auth";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["teacher", "admin"]);

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shadow-sm">
        <Link href="/teacher" className="flex items-center gap-2 font-extrabold">
          <span className="text-xl">🚀</span> Hangeul Quest <span className="text-muted">· Teacher</span>
        </Link>
        <form action={logout}>
          <button type="submit" className="text-sm font-semibold text-muted transition hover:text-foreground">
            Log out
          </button>
        </form>
      </header>
      <main className="flex flex-1 flex-col p-4">{children}</main>
    </div>
  );
}
