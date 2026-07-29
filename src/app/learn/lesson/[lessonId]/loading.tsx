export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 pt-4">
      <div className="h-2.5 animate-pulse rounded-full bg-border/60" />
      <div className="h-64 flex-1 animate-pulse rounded-3xl bg-border/50" />
      <div className="h-12 animate-pulse rounded-full bg-border/60" />
    </div>
  );
}
