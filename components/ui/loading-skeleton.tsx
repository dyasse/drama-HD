export function LoadingSkeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-emerald/15 ${className}`} />;
}
