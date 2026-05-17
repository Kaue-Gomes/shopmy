import { cn } from '@/lib/utils'

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-shell border border-border/80 bg-card shadow-sm ring-1 ring-border/40',
        className
      )}
    >
      <div className="relative aspect-[3/4] w-full animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3.5 w-3.5 animate-pulse rounded-sm bg-muted" />
          ))}
        </div>
        <div className="h-4 animate-pulse rounded bg-muted max-w-[92%]" />
        <div className="h-4 animate-pulse rounded bg-muted w-3/4" />
        <div className="h-11 animate-pulse rounded-control bg-muted" />
        <div className="h-4 animate-pulse rounded bg-muted mx-auto w-28" />
      </div>
    </div>
  )
}
