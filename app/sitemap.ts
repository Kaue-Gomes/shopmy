import { prisma } from '@/lib/prisma'
import type { MetadataRoute } from 'next'

function baseOrigin() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = baseOrigin()

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({ select: { id: true, updatedAt: true } }),
      prisma.category.findMany({ select: { id: true, updatedAt: true } }),
    ])

    const staticUrls: MetadataRoute.Sitemap = [
      '/',
      '/products',
      '/categories',
      '/faq',
      '/contact',
      '/shipping',
      '/privacy',
      '/terms',
    ].map((path) => ({
      url: `${origin}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '/' ? ('daily' as const) : ('weekly' as const),
      priority: path === '/' ? 1 : 0.7,
    }))

    return [
      ...staticUrls,
      ...products.map((p) => ({
        url: `${origin}/products/${p.id}`,
        lastModified: p.updatedAt,
      })),
      ...categories.map((c) => ({
        url: `${origin}/categories/${c.id}`,
        lastModified: c.updatedAt,
      })),
    ]
  } catch {
    return [
      {
        url: `${origin}/`,
        lastModified: new Date(),
      },
    ]
  }
}
