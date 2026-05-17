'use client'

import { useEffect, useState } from 'react'
import type { Product } from '@prisma/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductCardSkeleton } from '@/components/catalog/ProductCardSkeleton'
import { RevealOnScroll } from '@/components/catalog/RevealOnScroll'

type TabId = 'featured' | 'new' | 'bestsellers'

const tabs: { id: TabId; label: string }[] = [
  { id: 'featured', label: 'Destaques' },
  { id: 'new', label: 'Novidades' },
  { id: 'bestsellers', label: 'Mais vendidos' },
]

export function HomeProductTabs() {
  const [tab, setTab] = useState<TabId>('featured')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const params = new URLSearchParams({ limit: '8', page: '1' })
        if (tab === 'featured') params.append('featured', 'true')
        if (tab === 'new') params.set('sort', 'newest')
        if (tab === 'bestsellers') params.set('sort', 'bestsellers')

        const res = await fetch(`/api/products?${params}`)
        const data = await res.json()
        if (!cancelled) setProducts(Array.isArray(data.products) ? data.products : [])
      } catch {
        if (!cancelled) setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [tab])

  return (
    <section className="section-y bg-surface">
      <div className="container mx-auto px-4">
        <nav className="-mx-1 mb-10 flex gap-8 overflow-x-auto scrollbar-hide border-b border-border pb-px">
          {tabs.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative shrink-0 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 -mb-[1px]',
                  active && 'border-primary text-primary font-semibold'
                )}
              >
                {t.label}
              </button>
            )
          })}
        </nav>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {products.length ? (
                products.map((product, idx) => (
                  <RevealOnScroll key={`${tab}-${product.id}`}>
                    <ProductCard product={product} priority={tab === 'featured' && idx < 2} />
                  </RevealOnScroll>
                ))
              ) : (
                <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
                  Nenhum produto encontrado nesta seleção.
                </p>
              )}
            </div>
            <div className="mt-12 flex justify-center">
              <Button asChild variant="outline" className="rounded-control">
                <Link href={`/products`}>Ir para o catálogo completo</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
