'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Product, Category } from '@prisma/client'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { CatalogBreadcrumbs } from '@/components/catalog/Breadcrumbs'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductCardSkeleton } from '@/components/catalog/ProductCardSkeleton'
import { RevealOnScroll } from '@/components/catalog/RevealOnScroll'

interface ProductWithCategory extends Product {
  category: Category
}

export default function CategoryDetailPage() {
  const params = useParams()
  const categoryId = params.id as string
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategoryAndProducts = useCallback(async () => {
    try {
      const [categoryRes, productsRes] = await Promise.all([
        fetch(`/api/categories/${categoryId}`),
        fetch(`/api/products?category=${categoryId}`),
      ])

      if (categoryRes.ok) {
        const categoryData = await categoryRes.json()
        setCategory(categoryData)
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.products || [])
      }
    } catch (error) {
      console.error('Erro ao buscar dados da categoria:', error)
    } finally {
      setLoading(false)
    }
  }, [categoryId])

  useEffect(() => {
    if (!categoryId) return
    void fetchCategoryAndProducts()
  }, [categoryId, fetchCategoryAndProducts])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-10">
          <div className="h-8 w-1/3 max-w-[220px] animate-pulse rounded bg-muted" />
          <div className="mt-3 h-4 w-2/5 max-w-md animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-lg space-y-4 text-center">
          <h1 className="text-xl font-semibold">Categoria não encontrada</h1>
          <p className="text-sm text-muted-foreground">
            A categoria que você está procurando não existe ou foi removida.
          </p>
          <Button asChild className="rounded-control">
            <Link href="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              Voltar às categorias
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Categorias', href: '/categories' },
    { label: category.name, href: `/categories/${category.id}` },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <CatalogBreadcrumbs items={crumbs} />

      <Link
        href="/categories"
        className="-mt-2 mb-6 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
        Voltar às categorias
      </Link>

      <header className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-center">
        {category.image ? (
          <div className="relative h-28 w-full max-w-[7rem] shrink-0 overflow-hidden rounded-shell bg-muted shadow-sm ring-1 ring-border/60">
            <Image src={category.image} alt={category.name} fill sizes="112px" className="object-cover" />
          </div>
        ) : null}

        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-balance md:text-xl">
            {category.name}
          </h1>
          {category.description ? (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{category.description}</p>
          ) : null}
          <p className="mt-4 text-xs text-muted-foreground">
            {products.length}{' '}
            {products.length === 1 ? 'produto nesta lista' : 'produtos nesta lista'}
          </p>
        </div>
      </header>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-6">
          {products.map((product, idx) => (
            <RevealOnScroll key={product.id}>
              <ProductCard product={product} priority={idx < 2} showQuickView />
            </RevealOnScroll>
          ))}
        </div>
      ) : (
        <div className="rounded-shell border bg-surface px-8 py-16 text-center text-sm text-muted-foreground">
          Nenhum produto nesta categoria ainda.
          <div className="mt-8">
            <Button asChild className="rounded-control">
              <Link href="/products">Ver todos os produtos</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
