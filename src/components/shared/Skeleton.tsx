interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#c9a87a]/40 ${className}`}
      aria-hidden="true"
    />
  );
}

export function ShelfSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-5 lg:grid-cols-9" aria-label="Loading books…" aria-busy="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <Skeleton className="h-28 w-10" />
          <Skeleton className="h-3 w-14 rounded-sm" />
          <Skeleton className="h-2 w-10 rounded-sm" />
        </div>
      ))}
    </div>
  );
}
