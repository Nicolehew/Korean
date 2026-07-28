import { requireRole } from "@/lib/data/session";
import { BottomNav } from "@/components/ui/bottom-nav";

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["student"]);

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-4">{children}</main>
      <BottomNav />
    </div>
  );
}
