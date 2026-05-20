import clsx from "clsx";

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "info" | "danger";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tone === "neutral" &&
          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        tone === "success" &&
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
        tone === "info" &&
          "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
        tone === "danger" &&
          "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
