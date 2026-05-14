'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/context/cart-context'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'
import { StripeConfigModal } from '@/components/stripe-config-modal'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const steps = [
  { id: 1, label: 'Carrinho' },
  { id: 2, label: 'Pagamento' },
  { id: 3, label: 'Confirmação' },
]

export default function CheckoutPage() {
  const { data: session } = useSession()
  const { state, dispatch } = useCart()
  const [loading, setLoading] = useState(false)
  const [showStripeModal, setShowStripeModal] = useState(false)
  const [guestEmail, setGuestEmail] = useState('')
  const [guestName, setGuestName] = useState('')

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

    if (!session?.user?.id && !guestEmail.trim()) {
      setShowStripeModal(false)
      return
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()) {
      setShowStripeModal(true)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          ...(session?.user?.id
            ? {}
            : { guestEmail: guestEmail.trim(), guestName: guestName.trim() }),
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        if (response.status === 401) setShowStripeModal(true)
        else console.error(err.error || 'Erro na API de checkout')
        return
      }

      const { sessionId } = await response.json()

      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) console.error('Erro no checkout:', error)
      }
    } catch (error) {
      console.error('Erro ao processar checkout:', error)
      setShowStripeModal(true)
    } finally {
      setLoading(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center space-y-4">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" aria-hidden />
          <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground">Adicione produtos antes de finalizar.</p>
          <Button asChild>
            <Link href="/products">Ver produtos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav aria-label="Progresso do checkout" className="max-w-xl mx-auto mb-10">
        <ol className="flex items-center justify-between gap-2">
          {steps.map((step, idx) => (
            <li key={step.id} className="flex flex-1 items-center">
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold border-2',
                  idx <= 0
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted bg-muted text-muted-foreground'
                )}
              >
                {step.id}
              </span>
              <span
                className={cn(
                  'ml-2 text-sm hidden sm:inline',
                  idx <= 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
              {idx < steps.length - 1 ? (
                <div className="mx-3 h-0.5 flex-1 bg-border min-w-[16px]" aria-hidden />
              ) : null}
            </li>
          ))}
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Finalizar compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {!session?.user?.id ? (
            <Card>
              <CardHeader>
                <CardTitle>Comprar como convidado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Informe seu e-mail para confirmação do pedido. Já tem conta?{' '}
                  <Link href="/auth/signin" className="text-primary font-medium hover:underline">
                    Entrar
                  </Link>
                </p>
                <div className="space-y-2">
                  <Label htmlFor="guest-email">E-mail</Label>
                  <Input
                    id="guest-email"
                    type="email"
                    autoComplete="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="nome@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest-name">Nome (opcional)</Label>
                  <Input
                    id="guest-name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Itens do carrinho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4 border rounded-lg">
                  <div className="relative h-20 w-20 shrink-0">
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
                    <p className="text-sm text-muted-foreground">
                      R$ {item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
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
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>R$ {state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>R$ {state.total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full"
                size="lg"
                disabled={
                  loading || (!session?.user?.id && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail))
                }
              >
                {loading ? 'Redirecionando…' : 'Ir ao pagamento'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Você será redirecionado ao Stripe de forma segura.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <StripeConfigModal isOpen={showStripeModal} onClose={() => setShowStripeModal(false)} />
    </div>
  )
}
