import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="relative h-48 animate-pulse bg-muted" />
      <CardContent className="space-y-3 p-4">
        <div className="h-4 animate-pulse rounded bg-muted max-w-[92%]" />
        <div className="h-3 animate-pulse rounded bg-muted w-2/3" />
        <div className="h-10 animate-pulse rounded bg-muted mt-4" />
      </CardContent>
    </Card>
  )
}
