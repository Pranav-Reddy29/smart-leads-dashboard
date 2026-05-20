import { Building2, LogOut, Menu } from "lucide-react";

import ThemeToggle from "../common/ThemeToggle";
import useAuthStore from "../../store/authStore";
import Button from "../common/Button";

interface NavbarProps {
  onOpenSidebar: () => void;
}

function Navbar({ onOpenSidebar }: NavbarProps) {
  const {
    user,
    organization,
    clearSession,
  } = useAuthStore();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface-overlay)]/90 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--foreground)] lg:hidden"
          >
            <Menu size={18} />
          </button>

          <div>
            <p className="text-sm font-medium text-[var(--muted-foreground)]">
              Workspace
            </p>
            <div className="mt-1 flex items-center gap-2 text-[var(--foreground)]">
              <Building2 size={16} className="text-sky-600" />
              <span className="font-semibold">
                {organization?.name ?? "Smart Leads"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="hidden rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 md:block">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {user?.name}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              {user?.role}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="rounded-full"
            onClick={clearSession}
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
