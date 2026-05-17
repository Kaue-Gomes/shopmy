'use client'

import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/context/cart-context'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { EmptyCart } from '@/components/empty-states'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, dispatch } = useCart()
  const { data: session } = useSession()

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
    }
  }

  const handleRemoveItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className="flex max-h-none w-[100vw] max-w-none flex-col border-border bg-background p-0 shadow-xl sm:!max-w-[400px]"
      >
        <SheetTitle className="sr-only">Carrinho de compras</SheetTitle>
        <div className="flex h-full flex-col bg-muted/40">
          <div className="flex items-center justify-between p-4 border-b bg-background">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" aria-hidden />
              Carrinho
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar carrinho">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <EmptyCart onDismiss={onClose} />
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <Card
                    key={item.product.id}
                    className="overflow-hidden border-border/80 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden ring-1 ring-border">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            R$ {item.product.price.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-11 w-11 min-h-11 min-w-11 rounded-control shrink-0"
                              onClick={() =>
                                handleUpdateQuantity(item.product.id, item.quantity - 1)
                              }
                              aria-label="Diminuir quantidade"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-8 text-center tabular-nums">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-11 w-11 min-h-11 min-w-11 rounded-control shrink-0"
                              onClick={() =>
                                handleUpdateQuantity(item.product.id, item.quantity + 1)
                              }
                              aria-label="Aumentar quantidade"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-auto h-11 w-11 min-h-11 min-w-11 rounded-control shrink-0 text-destructive"
                              onClick={() => handleRemoveItem(item.product.id)}
                              aria-label="Remover item"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {state.items.length > 0 && (
            <div className="border-t p-4 space-y-4 bg-background">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">R$ {state.total.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full rounded-control transition-colors duration-200" asChild>
                  <Link href="/products" onClick={onClose}>
                    Continuar comprando
                  </Link>
                </Button>
                <Link href="/checkout" className="block">
                  <Button className="w-full rounded-control" onClick={onClose}>
                    {session ? 'Finalizar compra' : 'Finalizar como convidado'}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
