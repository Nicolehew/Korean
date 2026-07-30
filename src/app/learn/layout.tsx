import { requireStudent } from "@/lib/data/session";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStudent();

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between px-4 py-2">
          <span className="flex items-center gap-1.5 font-extrabold">
            <span>🚀</span> Hangeul Quest
          </span>
          <ThemeToggle variant="icon" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-4">{children}</main>
      <BottomNav />
    </div>
  );
}
