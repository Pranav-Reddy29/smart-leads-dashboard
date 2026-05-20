import { MoonStar, SunMedium } from "lucide-react";

import { useTheme } from "../../hooks/useTheme";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-muted)]"
    >
      {theme === "light" ? (
        <MoonStar size={16} />
      ) : (
        <SunMedium size={16} />
      )}
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}

export default ThemeToggle;
