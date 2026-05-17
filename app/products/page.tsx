'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Category, Product } from '@prisma/client'
import { ArrowUpDown, Check, Search, SlidersHorizontal } from 'lucide-react'
import { EmptySearch } from '@/components/empty-states'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductCardSkeleton } from '@/components/catalog/ProductCardSkeleton'
import { RevealOnScroll } from '@/components/catalog/RevealOnScroll'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type SortOpt = 'newest' | 'price_asc' | 'price_desc' | 'bestsellers'

const sortLabels: Record<SortOpt, string> = {
  newest: 'Mais recentes',
  price_asc: 'Menor preço',
  price_desc: 'Maior preço',
  bestsellers: 'Mais vendidos',
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [sort, setSort] = useState<SortOpt>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search.trim()), 400)
    return () => window.clearTimeout(t)
  }, [search])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) setCategories(await res.json())
      } catch {
        //
      }
    })()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, categoryFilter, sort])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '12',
          sort,
        })
        if (debouncedSearch) params.append('search', debouncedSearch)
        if (categoryFilter) params.append('category', categoryFilter)

        const response = await fetch(`/api/products?${params}`)
        const data = await response.json()

        if (!response.ok) {
          if (!cancelled) toast.error(data.error || 'Não foi possível carregar os produtos')
          return
        }

        if (!cancelled) {
          setProducts(data.products || [])
          setTotalPages(data.pagination?.pages || 1)
        }
      } catch {
        if (!cancelled) toast.error('Erro de rede ao buscar produtos')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [page, debouncedSearch, categoryFilter, sort])

  const filterControls = (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-sm font-medium">Categoria</p>
        <select
          aria-label="Filtrar por categoria"
          className="w-full rounded-control border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Ordenar</p>
        <select
          aria-label="Ordenar lista"
          className="w-full rounded-control border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as SortOpt)
            setPage(1)
          }}
        >
          {(Object.keys(sortLabels) as SortOpt[]).map((k) => (
            <option key={k} value={k}>
              {sortLabels[k]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )

  function CategoryPillsRow({ className }: { className?: string }) {
    return (
      <div className={cn('flex gap-6', className)}>
        <div className="min-w-0 flex-1 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('')
              setPage(1)
            }}
            className={cn(
              'flex shrink-0 items-center rounded-full border px-4 py-2 text-sm transition-colors duration-200',
              categoryFilter === ''
                ? 'border-primary font-medium text-primary'
                : 'border-border bg-transparent text-muted-foreground hover:border-primary/60 hover:text-foreground'
            )}
          >
            {categoryFilter === '' ? (
              <Check className="mr-2 h-[11px] w-[11px]" strokeWidth={3} aria-hidden />
            ) : null}
            Todas
          </button>
          {categories.map((c) => {
            const active = categoryFilter === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCategoryFilter(c.id)
                  setPage(1)
                }}
                className={cn(
                  'flex shrink-0 items-center rounded-full border px-4 py-2 text-sm transition-colors duration-200',
                  active
                    ? 'border-primary font-medium text-primary'
                    : 'border-border bg-transparent text-muted-foreground hover:border-primary/60 hover:text-foreground'
                )}
              >
                {active ? (
                  <Check className="mr-2 h-[11px] w-[11px]" strokeWidth={3} aria-hidden />
                ) : null}
                {c.name}
              </button>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2 pb-2">
          <ArrowUpDown
            className="h-4 w-4 shrink-0 text-muted-foreground sm:inline-block"
            aria-hidden
          />
          <label className="sr-only" htmlFor="sort-inline">
            Ordenar produtos
          </label>
          <select
            id="sort-inline"
            aria-label="Ordenar produtos"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortOpt)
              setPage(1)
            }}
            className="rounded-full border border-transparent bg-transparent py-2 pr-8 pl-0 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {(Object.keys(sortLabels) as SortOpt[]).map((k) => (
              <option key={k} value={k}>
                {sortLabels[k]}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-xl font-semibold lg:text-xl">Produtos</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Filtre por categoria ou busque pelo nome — no desktop há painel lateral; no mobile use o
            ícone para mais opções.
          </p>
        </div>

        <div className="relative flex min-w-[260px] max-w-lg flex-1 gap-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar na loja…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-control flex-1 pl-10 transition-colors duration-200"
            aria-label="Buscar produtos"
          />
          {search ? (
            <Button
              type="button"
              variant="outline"
              className="shrink-0 rounded-control transition-colors duration-200"
              onClick={() => setSearch('')}
            >
              Limpar
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[220px,minmax(0,1fr)]">
        <aside className="hidden space-y-6 lg:block">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Filtrar
          </h2>
          {filterControls}
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className="mt-4 px-0 text-primary underline-offset-4 transition-colors duration-200 hover:underline"
            onClick={() => {
              setCategoryFilter('')
              setSort('newest')
              setSearch('')
              setPage(1)
            }}
          >
            Resetar filtros
          </Button>
        </aside>

        <div className="min-w-0">
          <div className="mb-10 lg:hidden">
            <CategoryPillsRow />
          </div>

          <div className="mb-8 flex justify-end lg:hidden">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" type="button" className="gap-2 rounded-control">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="max-h-[85vh] overflow-y-auto rounded-t-2xl p-6 pb-10"
                aria-describedby={undefined}
              >
                <SheetTitle className="mb-3 text-xl font-semibold">Filtros</SheetTitle>
                <SheetDescription className="mb-6 text-sm text-muted-foreground">
                  Ajuste categoria e ordenação.
                </SheetDescription>
                {filterControls}
                <SheetFooter className="mt-8 gap-2 sm:flex-row">
                  <SheetClose asChild>
                    <Button className="flex-1 rounded-control" type="button">
                      Fechar
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-6">
                {products && products.length > 0 ? (
                  products.map((product, i) => (
                    <RevealOnScroll key={product.id}>
                      <ProductCard product={product} priority={page === 1 && i < 3} />
                    </RevealOnScroll>
                  ))
                ) : (
                  <EmptySearch />
                )}
              </div>

              {totalPages > 1 ? (
                <div className="mt-12 flex flex-wrap justify-center gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    className="rounded-control transition-colors duration-200"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    Página {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    type="button"
                    className="rounded-control transition-colors duration-200"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
