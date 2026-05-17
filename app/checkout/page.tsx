'use client'

import { useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { checkoutAuthenticatedFormSchema, checkoutGuestFormSchema } from '@/lib/validations'
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
import type { Session } from 'next-auth'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const steps = [
  { id: 1, label: 'Carrinho' },
  { id: 2, label: 'Pagamento' },
  { id: 3, label: 'Confirmação' },
]

type CheckoutForm = z.infer<typeof checkoutGuestFormSchema>

type CartState = ReturnType<typeof useCart>['state']
type CartDispatch = ReturnType<typeof useCart>['dispatch']

function CheckoutFlow({
  session,
  state,
  dispatch,
}: {
  session: Session | null
  state: CartState
  dispatch: CartDispatch
}) {
  const [loading, setLoading] = useState(false)
  const [showStripeModal, setShowStripeModal] = useState(false)

  const requiresGuestCheckout = !session?.user?.id
  const formSchema = useMemo(
    () => (requiresGuestCheckout ? checkoutGuestFormSchema : checkoutAuthenticatedFormSchema),
    [requiresGuestCheckout]
  )

  const {
    register,
    handleSubmit,
    formState: { errors: checkoutErrors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      guestEmail: '',
      guestName: '',
    },
  })

  const guestEmailError = checkoutErrors.guestEmail?.message as string | undefined
  const guestNameError = checkoutErrors.guestName?.message as string | undefined

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
    else dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const handleRemoveItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
  }

  const processCheckout = async (values: CheckoutForm) => {
    if (state.items.length === 0) return

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()) {
      setShowStripeModal(true)
      return
    }

    setLoading(true)
    try {
      const trimmedEmail = values.guestEmail.trim()
      const trimmedName = values.guestName.trim()
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          ...(session?.user?.id ? {} : { guestEmail: trimmedEmail, guestName: trimmedName }),
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

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <nav aria-label="Progresso do checkout" className="mx-auto mb-10 max-w-xl">
        <ol className="flex items-center justify-between gap-2">
          {steps.map((step, idx) => (
            <li key={step.id} className="flex flex-1 items-center">
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold',
                  idx <= 0
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted bg-muted text-muted-foreground'
                )}
              >
                {step.id}
              </span>
              <span
                className={cn(
                  'ml-2 hidden text-sm sm:inline',
                  idx <= 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
              {idx < steps.length - 1 ? (
                <div className="mx-3 min-h-0 min-w-[16px] flex-1 bg-border" aria-hidden />
              ) : null}
            </li>
          ))}
        </ol>
      </nav>

      <h1 className="mb-8 text-center text-xl font-semibold md:text-left">Finalizar compra</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {!session?.user?.id ? (
            <Card className="rounded-shell">
              <CardHeader>
                <CardTitle>Comprar como convidado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Informe seu e-mail para confirmação do pedido. Já tem conta?{' '}
                  <Link
                    href="/auth/signin"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Entrar
                  </Link>
                </p>
                <div className="space-y-2">
                  <Label htmlFor="guest-email">E-mail</Label>
                  <Input
                    id="guest-email"
                    type="email"
                    autoComplete="email"
                    placeholder="nome@email.com"
                    className="rounded-control"
                    {...register('guestEmail')}
                    aria-invalid={Boolean(guestEmailError)}
                  />
                  {guestEmailError ? (
                    <p className="text-xs font-medium text-destructive">{guestEmailError}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest-name">Nome (opcional)</Label>
                  <Input
                    id="guest-name"
                    autoComplete="name"
                    placeholder="Nome completo"
                    className="rounded-control"
                    {...register('guestName')}
                    aria-invalid={Boolean(guestNameError)}
                  />
                  {guestNameError ? (
                    <p className="text-xs font-medium text-destructive">{guestNameError}</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card className="rounded-shell">
            <CardHeader>
              <CardTitle>Itens do carrinho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.items.map((item) => (
                <div key={item.product.id} className="flex gap-4 rounded-lg border p-4">
                  <div className="relative h-24 w-24 shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="96px"
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      R$ {item.product.price.toFixed(2)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        className="h-11 w-11 min-h-11 min-w-11 rounded-control"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center text-sm tabular-nums">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        className="h-11 w-11 min-h-11 min-w-11 rounded-control"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="ml-auto h-11 w-11 min-h-11 min-w-11 rounded-control text-destructive"
                        onClick={() => handleRemoveItem(item.product.id)}
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold tabular-nums">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-shell">
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
                type="button"
                className="w-full rounded-control"
                size="lg"
                disabled={loading}
                onClick={() => void handleSubmit(processCheckout)()}
              >
                {loading ? 'Redirecionando…' : 'Ir ao pagamento'}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
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

export default function CheckoutPage() {
  const { data: session } = useSession()
  const { state, dispatch } = useCart()

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-lg space-y-4 text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" aria-hidden />
          <h1 className="text-xl font-semibold">Seu carrinho está vazio</h1>
          <p className="text-sm text-muted-foreground">Adicione produtos antes de finalizar.</p>
          <Button asChild className="rounded-control">
            <Link href="/products">Ver produtos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <CheckoutFlow
      key={session?.user?.id ?? 'guest'}
      session={session ?? null}
      state={state}
      dispatch={dispatch}
    />
  )
}
