export default function Loading() {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-border/60" />
      <div className="h-28 animate-pulse rounded-2xl bg-border/60" />
      <div className="h-28 animate-pulse rounded-2xl bg-border/40" />
    </div>
  );
}
