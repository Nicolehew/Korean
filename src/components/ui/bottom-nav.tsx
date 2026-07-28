"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/learn", label: "Learn", icon: "🏠" },
  { href: "/learn/map", label: "Map", icon: "🗺️" },
  { href: "/learn/rewards", label: "Rewards", icon: "🏆" },
  { href: "/learn/profile", label: "Profile", icon: "🧑" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 flex border-t-2 border-border bg-card pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold transition ${
              active ? "text-primary" : "text-muted"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${
                active ? "bg-primary/15" : ""
              }`}
            >
              {tab.icon}
            </span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
