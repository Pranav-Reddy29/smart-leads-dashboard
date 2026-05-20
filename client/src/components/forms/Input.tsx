import clsx from "clsx";
import {
  forwardRef,
  type InputHTMLAttributes,
} from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<
  HTMLInputElement,
  InputProps
>(function Input(
  { label, error, helperText, className, ...props },
  ref
) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </span>

      <input
        ref={ref}
        {...props}
        className={clsx(
          "w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] shadow-sm outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20",
          error &&
            "border-rose-400 focus:border-rose-400 focus:ring-rose-500/20",
          className
        )}
      />

      {error ? (
        <p className="text-sm text-rose-500">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-sm text-[var(--muted-foreground)]">
          {helperText}
        </p>
      ) : null}
    </label>
  );
});

export default Input;
