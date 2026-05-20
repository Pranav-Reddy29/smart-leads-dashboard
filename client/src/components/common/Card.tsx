import clsx from "clsx";
import type { ReactNode } from "react";

function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-[28px] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;
