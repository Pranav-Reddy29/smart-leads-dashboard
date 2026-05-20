function PageLoader({
  message = "Loading workspace...",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--app-background)] px-6">
      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-elevated)] px-8 py-10 text-center shadow-xl">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600" />
        <p className="mt-5 text-sm font-medium text-[var(--muted-foreground)]">
          {message}
        </p>
      </div>
    </div>
  );
}

export default PageLoader;
