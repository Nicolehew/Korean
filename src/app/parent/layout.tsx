import Link from "next/link";
import { requireRole } from "@/lib/data/session";
import { logout } from "@/lib/actions/auth";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["parent"]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <Link href="/parent" className="font-semibold">
          Hangeul Quest · Parent
        </Link>
        <form action={logout}>
          <button type="submit" className="text-sm text-muted">
            Log out
          </button>
        </form>
      </header>
      <main className="flex flex-1 flex-col p-4">{children}</main>
    </div>
  );
}
