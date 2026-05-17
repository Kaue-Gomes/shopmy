'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { Product } from '@prisma/client'
import { Heart, Loader2, Minus, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useCart } from '@/context/cart-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { catalogBadges } from '@/lib/catalog-badges'
import { ProductBadgeList, resolveBadge } from '@/components/catalog/ProductBadge'
import { StarRating } from '@/components/catalog/StarRating'
import { emitCartIconPulse } from '@/lib/cart-events'

type ProductRating = { value: number; count: number }

function formatMoney(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

export function ProductCard({
  product,
  rating,
  priority = false,
  className,
  showQuickView = true,
}: {
  product: Product
  rating?: ProductRating
  priority?: boolean
  className?: string
  showQuickView?: boolean
}) {
  const { dispatch } = useCart()
  const [busy, setBusy] = useState(false)
  const [iconPulse, setIconPulse] = useState(false)
  const [qvOpen, setQvOpen] = useState(false)
  const [qvQty, setQvQty] = useState(1)

  const openTimerRef = useRef<number | null>(null)
  const [pointerFine, setPointerFine] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setPointerFine(window.matchMedia('(pointer: fine)').matches)
    return undefined
  }, [])

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current)
    }
  }, [])

  const badges = catalogBadges(product)
  const cmp = product.compareAtPrice
  const hasStrike = cmp != null && cmp > product.price + 1e-6

  const runAdd = (qty: number) => {
    if (product.stock <= 0 || busy) return
    setBusy(true)
    Promise.resolve()
      .then(() => {
        dispatch({
          type: 'ADD_ITEM',
          payload: { product, quantity: qty },
        })
        toast.success('Adicionado ao carrinho', { description: product.name })
        emitCartIconPulse()
        setIconPulse(true)
        window.setTimeout(() => setIconPulse(false), 620)
      })
      .finally(() => setBusy(false))
  }

  const handleImageEnter = () => {
    if (!pointerFine || !showQuickView) return
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    openTimerRef.current = window.setTimeout(() => setQvOpen(true), 400)
  }

  const handleImageLeave = () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    openTimerRef.current = null
  }

  const handleAddQuickView = () => {
    runAdd(qvQty)
    setQvOpen(false)
    setQvQty(1)
  }

  return (
    <>
      <article
        className={cn(
          'group/card flex flex-col overflow-hidden rounded-shell border border-border/80 bg-card shadow-sm ring-1 ring-border/60 transition-colors duration-200 hover:shadow-xl hover:ring-primary/25',
          className
        )}
      >
        <div
          className="relative aspect-[3/4] w-full overflow-hidden bg-muted"
          onMouseEnter={handleImageEnter}
          onMouseLeave={() => {
            handleImageLeave()
          }}
        >
          <Link
            href={`/products/${product.id}`}
            className="absolute inset-0 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            aria-describedby={undefined}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
              priority={priority}
              className="object-cover transition-transform duration-400 ease-out group-hover/card:scale-105"
            />
          </Link>

          <ProductBadgeList badges={badges} />

          <button
            type="button"
            aria-label="Adicionar aos favoritos"
            className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-foreground shadow-sm backdrop-blur-sm transition-colors duration-200 hover:bg-white md:h-[28px] md:w-[28px]"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toast.message('Em breve', {
                description: 'Favoritos ainda não estão disponíveis.',
              })
            }}
          >
            <Heart className="h-[15px] w-[15px]" strokeWidth={2} aria-hidden />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          {rating ? (
            <StarRating value={rating.value} reviewCount={rating.count} className="gap-px" />
          ) : (
            <div className="h-4" aria-hidden />
          )}
          <Link href={`/products/${product.id}`}>
            <h3
              className="line-clamp-2 font-medium leading-snug text-base text-foreground transition-colors duration-200 group-hover/card:text-primary"
              style={{ fontWeight: 500, lineHeight: 1.3 }}
            >
              {product.name}
            </h3>
          </Link>

          <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-2">
            <span className="text-lg font-semibold tabular-nums text-primary">
              {formatMoney(product.price)}
            </span>
            {hasStrike ? (
              <span className="text-sm text-muted-foreground line-through tabular-nums transition-colors duration-200">
                {formatMoney(cmp)}
              </span>
            ) : null}
          </div>

          <Button
            type="button"
            disabled={product.stock <= 0 || busy}
            className={cn(
              'mt-1 w-full rounded-control gap-2 bg-foreground font-medium text-background transition-colors duration-200 hover:bg-foreground/90'
            )}
            onClick={(e) => {
              e.stopPropagation()
              runAdd(1)
            }}
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Adicionando…
              </>
            ) : (
              <>
                <ShoppingCart className={cn('h-4 w-4', iconPulse && 'animate-cart-icon-pulse')} aria-hidden />
                Adicionar ao carrinho
              </>
            )}
          </Button>

          <Link
            href={`/products/${product.id}`}
            className="rounded-control text-center text-sm font-medium text-primary underline-offset-4 transition-colors duration-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Ver detalhes
          </Link>
        </div>
      </article>

      <Dialog
        open={qvOpen}
        onOpenChange={(o) => {
          setQvOpen(o)
          if (!o) setQvQty(1)
        }}
      >
        <DialogContent
          className="max-w-lg border-border bg-background p-6"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Visualização rápida</DialogTitle>
          <DialogDescription className="sr-only">{product.name}</DialogDescription>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-shell bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold leading-tight">{product.name}</h2>
              <div className="flex flex-wrap gap-2">
                {badges.slice(0, 4).map((b, i) => (
                  <span key={`${b.kind}-${i}`} className="inline-flex">
                    {resolveBadge(b)}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xl font-bold tabular-nums text-primary">
                  {formatMoney(product.price)}
                </span>
                {hasStrike ? (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatMoney(cmp)}
                  </span>
                ) : null}
              </div>
              <p className="line-clamp-4 text-sm text-muted-foreground">{product.description}</p>

              <p className="text-xs text-muted-foreground">Única · selecionar quantidade abaixo</p>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 min-h-11 min-w-11 shrink-0 rounded-control"
                  onClick={() => setQvQty((q) => Math.max(1, q - 1))}
                  disabled={qvQty <= 1}
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center tabular-nums">{qvQty}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 min-h-11 min-w-11 shrink-0 rounded-control"
                  onClick={() => setQvQty((q) => Math.min(product.stock, q + 1))}
                  disabled={qvQty >= product.stock || product.stock === 0}
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                type="button"
                className="w-full rounded-control gap-2 bg-foreground font-medium text-background"
                disabled={product.stock <= 0 || busy}
                onClick={handleAddQuickView}
              >
                <ShoppingCart className="h-4 w-4" />
                Adicionar ao carrinho
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
