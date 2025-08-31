'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'
import { StripeConfigModal } from '@/components/stripe-config-modal'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { state, dispatch } = useCart()
  const [loading, setLoading] = useState(false)
  const [showStripeModal, setShowStripeModal] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, router])

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

  const handleCheckout = async () => {
    if (state.items.length === 0) return

    // Verificar se o Stripe está configurado
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('your_publishable_key_here')) {
      setShowStripeModal(true)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          setShowStripeModal(true)
          return
        }
        throw new Error('Erro na API de checkout')
      }

      const { sessionId } = await response.json()

      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Erro no checkout:', error)
        }
      }
    } catch (error) {
      console.error('Erro ao processar checkout:', error)
      setShowStripeModal(true)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Faça login para continuar</h1>
          <Button onClick={() => router.push('/auth/signin')}>
            Fazer Login
          </Button>
        </div>
      </div>
    )
  }

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <Button onClick={() => router.push('/products')}>
            Ver Produtos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Itens do Carrinho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4 border rounded-lg">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      R$ {item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
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
                        className="h-8 w-8"
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
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>Grátis</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>R$ {state.total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Finalizar Compra'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <StripeConfigModal 
        isOpen={showStripeModal} 
        onClose={() => setShowStripeModal(false)} 
      />
    </div>
  )
}
