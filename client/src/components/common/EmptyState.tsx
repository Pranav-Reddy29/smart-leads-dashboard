import type { ReactNode, ElementType } from "react";
import { Inbox } from "lucide-react";

function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ElementType;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center">
      <div className="mb-4 rounded-full bg-[var(--surface-muted)] p-4 text-[var(--muted-foreground)]">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold text-[var(--foreground)]">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
        {description}
      </p>
      {action ? (
        <div className="mt-6 flex justify-center">
          {action}
        </div>
      ) : null}
    </div>
  );
}

export default EmptyState;
