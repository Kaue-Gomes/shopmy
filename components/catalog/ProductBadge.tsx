import { cn } from '@/lib/utils'
import type { CatalogBadgeSale, CatalogBadgeInfo } from '@/lib/catalog-badges'

const baseClass =
  'inline-flex items-center rounded-badge px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white'

function SaleBadge({ percent }: CatalogBadgeSale) {
  return <span className={cn(baseClass, 'bg-promo')}>-{percent}%</span>
}

function ExclusiveBadge() {
  return (
    <span className={cn(baseClass, 'bg-badgeExclusive text-badgeExclusive-foreground shadow-sm')}>
      Exclusivo
    </span>
  )
}

function NewBadge() {
  return <span className={cn(baseClass, 'bg-emerald-600 shadow-sm')}>Novo</span>
}

function LowStockBadge() {
  return (
    <span className={cn(baseClass, 'bg-amber-600 text-black shadow-sm')}>Últimas unidades</span>
  )
}



export function resolveBadge(kind: CatalogBadgeInfo) {
  switch (kind.kind) {
    case 'sale':
      return <SaleBadge {...kind} />
    case 'new':
      return <NewBadge />
    case 'exclusive':
      return <ExclusiveBadge />
    case 'low-stock':
      return <LowStockBadge />
    default:
      return null
  }
}

export function ProductBadgeList({ badges }: { badges: CatalogBadgeInfo[] }) {
  if (!badges.length) return null
  return (
    <div className="absolute left-2 top-2 z-10 flex max-w-[min(88%,calc(100%-52px))] flex-wrap gap-1">
      {badges.map((b, i) => (
        <span key={`${b.kind}-${i}`}>{resolveBadge(b)}</span>
      ))}
    </div>
  )
}
