"use client";

import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";

const ORDER: Theme[] = ["system", "light", "dark"];
const ICON: Record<Theme, string> = { system: "🌗", light: "☀️", dark: "🌙" };
const LABEL: Record<Theme, string> = {
  system: "Following system theme",
  light: "Light theme",
  dark: "Dark theme",
};

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

/**
 * `variant="icon"` is a single tap-to-cycle button for the header.
 * `variant="full"` shows all three choices, used on the profile page.
 */
export function ThemeToggle({ variant = "full" }: { variant?: "icon" | "full" }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) ?? "system";
    setTheme(saved);
    apply(saved);
    setReady(true);
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    localStorage.setItem("theme", next);
    apply(next);
  }

  if (variant === "icon") {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    return (
      <button
        type="button"
        onClick={() => choose(next)}
        title={LABEL[theme]}
        aria-label={`${LABEL[theme]}. Tap to switch.`}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-lg transition active:scale-90"
      >
        {/* keep the box stable until the saved theme is known */}
        {ready ? ICON[theme] : ""}
      </button>
    );
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
          {ICON[t]} {t[0].toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}
