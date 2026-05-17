'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Category, Product } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useCart } from '@/context/cart-context'
import { ShoppingCart, Star, ZoomIn, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { emitCartIconPulse } from '@/lib/cart-events'

type ProductWithCategory = Product & { category: Category | null }

export default function ProductDetail({
  product,
  related,
}: {
  product: ProductWithCategory
  related: Product[]
}) {
  const { dispatch } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [iconPulse, setIconPulse] = useState(false)
  const [activeImage, setActiveImage] = useState(product.image)
  const gallery = Array.from(new Set([product.image].filter(Boolean)))
  const [zoomOpen, setZoomOpen] = useState(false)

  const handleAddToCart = () => {
    if (product.stock <= 0 || adding) return
    setAdding(true)
    Promise.resolve()
      .then(() => {
        dispatch({
          type: 'ADD_ITEM',
          payload: { product, quantity },
        })
        toast.success('Produto adicionado', { description: product.name })
        emitCartIconPulse()
        setIconPulse(true)
        window.setTimeout(() => setIconPulse(false), 620)
      })
      .finally(() => setAdding(false))
  }

  const cmp = product.compareAtPrice
  const hasStrike = cmp != null && cmp > product.price + 1e-6

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square max-h-[520px] w-full overflow-hidden rounded-xl border bg-muted/30 shadow-sm ring-1 ring-border">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover cursor-zoom-in"
              onClick={() => setZoomOpen(true)}
            />
            <button
              type="button"
              className="absolute bottom-4 right-4 rounded-full bg-background/90 p-2 shadow border text-foreground hover:bg-muted"
              onClick={() => setZoomOpen(true)}
              aria-label="Abrir zoom"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {gallery.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => setActiveImage(url)}
                className={cn(
                  'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2 transition-all',
                  activeImage === url
                    ? 'ring-primary'
                    : 'ring-transparent opacity-80 hover:opacity-100'
                )}
              >
                <Image src={url} alt={`Miniatura · ${product.name}`} fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            {product.featured ? (
              <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Star className="h-3.5 w-3.5" />
                Destaque
              </div>
            ) : null}
            <h1 className="text-balance text-xl font-semibold tracking-tight">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 tabular-nums">
              <p className="text-xl font-bold text-primary">{`R$ ${product.price.toFixed(2)}`}</p>
              {hasStrike ? (
                <p className="text-sm text-muted-foreground line-through transition-colors duration-200">
                  {`R$ ${cmp.toFixed(2)}`}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Descrição</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Estoque: <span className="font-semibold text-foreground">{product.stock}</span> unidades
          </p>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium">Quantidade</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    className="h-11 w-11 rounded-control"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Diminuir quantidade"
                  >
                    −
                  </Button>
                  <span className="w-10 text-center tabular-nums font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    className="h-11 w-11 rounded-control"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || product.stock === 0}
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                type="button"
                className="w-full rounded-control bg-foreground font-semibold text-background shadow-md transition-colors duration-200 hover:bg-foreground/90 hover:shadow-lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
              >
                {adding ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
                    Adicionando…
                  </>
                ) : (
                  <>
                    <ShoppingCart
                      className={cn('mr-2 h-5 w-5 transition-transform duration-200', iconPulse && 'animate-cart-icon-pulse')}
                      aria-hidden
                    />
                    {product.stock === 0 ? 'Indisponível' : 'Adicionar ao carrinho'}
                  </>
                )}
              </Button>

              {product.stock === 0 ? (
                <p className="text-center text-sm text-destructive">Produto fora de estoque.</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      {related.length ? (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-bold mb-6">
            Relacionados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <Link
                href={`/products/${p.id}`}
                key={p.id}
                className="group rounded-lg border overflow-hidden hover:shadow-lg transition-all bg-card"
              >
                <div className="relative h-36 w-full">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {p.name}
                  </p>
                  <p className="text-primary font-bold mt-2">R$ {p.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <DialogPrimitive.Root open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out fade-in fade-out duration-200" />
          <DialogPrimitive.Content className="fixed left-4 right-4 top-[10vh] z-[71] mx-auto flex max-h-[80vh] max-w-[900px] flex-col rounded-xl border bg-background p-4 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out fade-in fade-out zoom-in-95 duration-200">
            <DialogPrimitive.Title className="sr-only">Zoom: {product.name}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Imagem ampliada para visualização
            </DialogPrimitive.Description>
            <div className="flex justify-end">
              <DialogPrimitive.Close className="rounded-md px-3 py-1 text-sm border bg-muted hover:bg-muted/90">
                Fechar
              </DialogPrimitive.Close>
            </div>
            <div className="relative mt-2 min-h-[50vh] w-full flex-1">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes="900px"
                className="object-contain"
                priority
              />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}
