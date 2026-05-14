'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/context/cart-context'
import { Product, Category } from '@prisma/client'
import { ShoppingCart, Search, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { EmptySearch } from '@/components/empty-states'
import { ProductCardSkeleton } from '@/components/catalog/ProductCardSkeleton'
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

type SortOpt = 'newest' | 'price_asc' | 'price_desc'

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
  const { dispatch } = useCart()

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

  useEffect(() => {
    //
  }, [])

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity: 1 },
    })
    toast.success('Adicionado ao carrinho', { description: product.name })
  }

  const filterControls = (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium mb-2">Categoria</p>
        <select
          aria-label="Filtrar por categoria"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
        <p className="text-sm font-medium mb-2">Ordenar</p>
        <select
          aria-label="Ordenar lista"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as SortOpt)
            setPage(1)
          }}
        >
          <option value="newest">Mais recentes</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
        </select>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Produtos</h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Filtros e ordenação ficam sempre visíveis no desktop e no ícone em telas pequenas.
          </p>
        </div>

        <div className="relative flex flex-1 min-w-[280px] max-w-md gap-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar na loja..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 flex-1"
            aria-label="Buscar produtos"
          />
          {search ? (
            <Button type="button" variant="outline" onClick={() => setSearch('')}>
              Limpar
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block space-y-6">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Filtrar
          </h2>
          {filterControls}
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className="text-primary px-0"
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

        <div className="lg:col-span-3">
          <div className="flex justify-end lg:hidden mb-4">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="rounded-t-2xl p-6 pb-10 overflow-y-auto"
                aria-describedby={undefined}
              >
                <SheetTitle className="text-lg font-semibold mb-2">Filtros</SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground mb-4">
                  Ajuste categoria e ordenação.
                </SheetDescription>
                {filterControls}
                <SheetFooter className="mt-6 gap-2 sm:flex-row">
                  <SheetClose asChild>
                    <Button className="flex-1" type="button">
                      Fechar
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <Card
                      key={product.id}
                      className="group relative overflow-hidden border-border/70 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20"
                    >
                      <Link
                        href={`/products/${product.id}`}
                        className="block overflow-hidden rounded-t-xl"
                      >
                        <div className="relative h-52 overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                      </Link>
                      <CardContent className="relative p-4 space-y-3">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xl font-bold text-primary tabular-nums">
                            R$ {product.price.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            Est. {product.stock}
                          </span>
                        </div>

                        <div className="pointer-events-none absolute bottom-24 left-4 right-4 translate-y-[140%] transition-transform duration-300 group-hover:translate-y-0 group-hover:pointer-events-auto opacity-0 group-hover:opacity-100">
                          <Button
                            size="sm"
                            type="button"
                            className="w-full shadow-md pointer-events-auto"
                            disabled={product.stock === 0}
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Adicionar
                          </Button>
                        </div>

                        <div className="flex gap-2 pt-2 relative z-[1]">
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            className="flex-1 bg-background/95"
                            disabled={product.stock === 0}
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="mr-1 h-4 w-4" />
                            Carrinho
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            type="button"
                            asChild
                            className="flex-1"
                          >
                            <Link href={`/products/${product.id}`}>Detalhes</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <EmptySearch />
                )}
              </div>

              {totalPages > 1 ? (
                <div className="flex justify-center mt-10 gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    type="button"
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
