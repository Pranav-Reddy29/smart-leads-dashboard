import { AlertCircle } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[28px] border border-rose-500/20 bg-rose-500/5 px-6 py-12 text-center">
      <div className="mb-4 rounded-full bg-rose-100 p-3 text-rose-600 dark:bg-rose-500/20">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-xl font-semibold text-[var(--foreground)]">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">
        {message}
      </p>
      {onRetry && (
        <div className="mt-6">
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;
