export default function Loading() {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="h-10 animate-pulse rounded-xl bg-border/60" />
      <div className="h-20 animate-pulse rounded-2xl bg-border/60" />
      <div className="h-64 animate-pulse rounded-3xl bg-border/40" />
      <div className="h-64 animate-pulse rounded-3xl bg-border/30" />
    </div>
  );
}
