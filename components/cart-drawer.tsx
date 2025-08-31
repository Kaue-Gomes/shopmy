'use client'

import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/context/cart-context'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, dispatch } = useCart()
  const { data: session } = useSession()

  if (!isOpen) return null

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
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-lg">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Carrinho</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Seu carrinho está vazio</p>
                <Link href="/products">
                  <Button className="mt-4" onClick={onClose}>
                    Ver Produtos
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <Card key={item.product.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            R$ {item.product.price.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleUpdateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleUpdateQuantity(
                                item.product.id,
                                item.quantity + 1
                              )}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => handleRemoveItem(item.product.id)}
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
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>R$ {state.total.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                {session ? (
                  <Link href="/checkout" className="block">
                    <Button className="w-full" onClick={onClose}>
                      Finalizar Compra
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/signin" className="block">
                    <Button className="w-full" onClick={onClose}>
                      Entrar para Comprar
                    </Button>
                  </Link>
                )}
                <Link href="/cart" className="block">
                  <Button variant="outline" className="w-full" onClick={onClose}>
                    Ver Carrinho
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
