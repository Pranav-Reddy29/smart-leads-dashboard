import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

import { Loader2 } from "lucide-react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
  isLoading?: boolean;
}

function Button({
  children,
  className,
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-60",
        fullWidth && "w-full",
        variant === "primary" &&
          "bg-sky-600 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-500",
        variant === "secondary" &&
          "bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--surface-strong)]",
        variant === "ghost" &&
          "bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
        variant === "danger" &&
          "bg-rose-600 text-white hover:bg-rose-500",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : null}
      {children}
    </button>
  );
}

export default Button;
