import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-2xl bg-[var(--surface-muted)]",
        className
      )}
    />
  );
}

export default Skeleton;
