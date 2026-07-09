import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700",
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-8 w-28" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <Skeleton className="h-12 w-40 rounded-xl" />
    </div>
  );
}

export function SkeletonResult() {
  return (
    <div className="space-y-6">
      {/* Salary header */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-12 w-48 mb-6" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="grid gap-4 p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 p-4 border-b border-slate-100 dark:border-slate-700 last:border-0"
        >
          {[...Array(columns)].map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
