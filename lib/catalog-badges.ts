import type { Product } from '@prisma/client'

const NEW_PRODUCT_MS = 21 * 24 * 60 * 60 * 1000
export const LOW_STOCK_MAX = 5

export type CatalogBadgeSale = { kind: 'sale'; percent: number }

export type CatalogBadgeInfo =
  | CatalogBadgeSale
  | { kind: 'new' }
  | { kind: 'low-stock' }
  | { kind: 'exclusive' }

export function catalogBadges(
  product: Pick<Product, 'price' | 'compareAtPrice' | 'stock' | 'createdAt' | 'exclusive'>
): CatalogBadgeInfo[] {
  const out: CatalogBadgeInfo[] = []

  const cmp = product.compareAtPrice
  if (cmp != null && cmp > product.price + 1e-6) {
    const raw = Math.round((1 - product.price / cmp) * 100)
    out.push({ kind: 'sale', percent: Math.max(1, Math.min(99, raw)) })
  }

  const created = new Date(product.createdAt).getTime()
  if (Date.now() - created <= NEW_PRODUCT_MS) {
    out.push({ kind: 'new' })
  }

  if (product.exclusive) {
    out.push({ kind: 'exclusive' })
  }

  if (product.stock > 0 && product.stock <= LOW_STOCK_MAX) {
    out.push({ kind: 'low-stock' })
  }

  return out
}
