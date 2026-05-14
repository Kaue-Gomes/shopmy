'use client'

import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Product } from '@prisma/client'
import Link from 'next/link'

export function HeaderSearch() {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [hits, setHits] = useState<Product[]>([])
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!expanded) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setHits([])
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [expanded])

  useEffect(() => {
    if (!q.trim() || q.trim().length < 2) {
      setHits([])
      return
    }
    const id = window.setTimeout(async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          limit: '8',
          page: '1',
          search: q.trim(),
        })
        const res = await fetch(`/api/products?${params}`)
        if (res.ok) {
          const data = await res.json()
          setHits(data.products ?? [])
        }
      } finally {
        setLoading(false)
      }
    }, 320)
    return () => window.clearTimeout(id)
  }, [q])

  return (
    <div ref={rootRef} className="hidden md:block flex-1 min-w-0 max-w-xl mx-auto px-4">
      <div className="relative flex justify-center">
        {!expanded ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => setExpanded(true)}
            aria-label="Abrir busca"
          >
            <Search className="h-5 w-5" />
          </Button>
        ) : (
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              aria-label="Buscar produtos"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nome do produto…"
              className="pl-9 pr-20"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setExpanded(false)
                  setQ('')
                  setHits([])
                }
              }}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setExpanded(false)
                setQ('')
                setHits([])
              }}
            >
              Fechar
            </button>
            {loading ? (
              <div className="absolute right-14 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : null}
            {hits.length > 0 && q.trim().length >= 2 ? (
              <ul
                className="absolute z-50 top-full mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md max-h-80 overflow-auto"
                role="listbox"
              >
                {hits.map((p) => (
                  <li key={p.id} role="option" aria-selected={false}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                      onClick={() => {
                        router.push(`/products/${p.id}`)
                        setExpanded(false)
                        setQ('')
                        setHits([])
                      }}
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md ring-1 ring-border">
                        <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="line-clamp-2 flex-1">{p.name}</span>
                      <span className="text-primary font-semibold whitespace-nowrap text-xs">
                        R$ {p.price.toFixed(2)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export function HeaderSearchMobileIcon({ href = '/products' }: { href?: string }) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="md:hidden shrink-0"
      asChild
      aria-label="Buscar produtos"
    >
      <Link href={href}>
        <Search className="h-5 w-5" />
      </Link>
    </Button>
  )
}
