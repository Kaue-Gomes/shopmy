'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Category } from '@prisma/client'
import { cn } from '@/lib/utils'

export function HomeCategoryRail({ className }: { className?: string }) {
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Category[]) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
  }, [])

  if (!categories.length) return null

  return (
    <section className={cn('section-y border-y border-border/60 bg-background', className)}>
      <div className="container mx-auto px-4">
        <h2 className="stack-title-grid text-xl font-semibold">Categorias</h2>
        <div className="-mx-1 flex gap-3 overflow-x-auto scrollbar-hide pb-1 pt-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.id}`}
              className="shrink-0 rounded-full border border-border bg-transparent px-5 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/categories"
            className="ml-2 shrink-0 self-center text-sm font-medium text-primary underline-offset-4 transition-colors duration-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Ver todas
          </Link>
        </div>
      </div>
    </section>
  )
}
