import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProductDetail from '@/components/catalog/ProductDetail'
import { CatalogBreadcrumbs } from '@/components/catalog/Breadcrumbs'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  })
  if (!product) return { title: 'Produto | ShopMy' }

  const base = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')
  const absImage = product.image.startsWith('http')
    ? product.image
    : base
      ? `${base}${product.image.startsWith('/') ? '' : '/'}${product.image}`
      : undefined

  return {
    title: `${product.name} | ShopMy`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: absImage ? [{ url: absImage }] : undefined,
      ...(base ? { url: `${base}/products/${product.id}` } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      images: absImage ? [absImage] : undefined,
    },
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  })

  if (!product) notFound()

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    take: 8,
    orderBy: { createdAt: 'desc' },
  })

  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Produtos', href: '/products' },
    ...(product.category
      ? [{ label: product.category.name, href: `/categories/${product.category.id}` }]
      : []),
    { label: product.name, href: `/products/${product.id}` },
  ]

  return (
    <div className="container px-4 py-8">
      <CatalogBreadcrumbs items={crumbs} />
      <ProductDetail product={product} related={related} />
    </div>
  )
}
