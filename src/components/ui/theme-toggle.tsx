"use client";

import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";

const LABEL: Record<Theme, string> = {
  system: "🌗 System",
  light: "☀️ Light",
  dark: "🌙 Dark",
};
const ORDER: Theme[] = ["system", "light", "dark"];

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) ?? "system";
    setTheme(saved);
    apply(saved);
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    localStorage.setItem("theme", next);
    apply(next);
  }

  return (
    <div className="flex gap-2">
      {ORDER.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => choose(t)}
          aria-pressed={theme === t}
          className={`pill-btn border-2 px-3 py-1.5 text-sm ${
            theme === t
              ? "border-primary bg-primary/15 text-primary"
              : "border-border text-muted"
          }`}
        >
          {LABEL[t]}
        </button>
      ))}
    </div>
  );
}
