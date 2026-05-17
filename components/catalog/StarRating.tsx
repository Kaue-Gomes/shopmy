import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StarRating({
  value,
  reviewCount,
  className,
}: {
  value: number
  reviewCount?: number
  className?: string
}) {
  const safe = Math.max(0, Math.min(5, value))

  return (
    <div className={cn('flex items-center gap-1 text-star', className)}>
      {[0, 1, 2, 3, 4].map((idx) => {
        const remainder = Math.max(0, Math.min(1, safe - idx))
        const full = remainder >= 1
        return (
          <span key={idx} className="relative inline-block h-3.5 w-3.5 shrink-0" aria-hidden>
            <Star
              className="absolute inset-0 h-3.5 w-3.5 text-muted-foreground/50"
              strokeWidth={1.2}
            />
            {full ? (
              <Star
                className="absolute inset-0 h-3.5 w-3.5 fill-star text-star"
                strokeWidth={1.2}
              />
            ) : remainder > 0 ? (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${remainder * 100}%` }}
              >
                <Star className="h-3.5 w-3.5 fill-star text-star" strokeWidth={1.2} />
              </span>
            ) : null}
          </span>
        )
      })}
      <span className="sr-only">{`${safe.toFixed(1)} de 5 estrelas`}</span>
      {typeof reviewCount === 'number' && reviewCount >= 0 ? (
        <span className="ml-1 text-xs text-muted-foreground transition-colors duration-200">
          ({reviewCount})
        </span>
      ) : null}
    </div>
  )
}
