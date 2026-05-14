'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Category, Product } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useCart } from '@/context/cart-context'
import { ShoppingCart, Star, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

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
  const [activeImage, setActiveImage] = useState(product.image)
  const gallery = Array.from(new Set([product.image].filter(Boolean)))
  const [zoomOpen, setZoomOpen] = useState(false)

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity },
    })
    toast.success('Produto adicionado', { description: product.name })
  }

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
                <Image src={url} alt="" fill sizes="64px" className="object-cover" />
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
            <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-3xl font-bold text-primary md:text-4xl tabular-nums">
              R$ {product.price.toFixed(2)}
            </p>
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
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </Button>
                  <span className="w-10 text-center tabular-nums font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || product.stock === 0}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full shadow-md hover:shadow-lg transition-shadow"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock === 0 ? 'Indisponível' : 'Adicionar ao carrinho'}
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
