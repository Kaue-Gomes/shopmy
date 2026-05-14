'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Home } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/cart-context'

export default function CheckoutSuccessClient() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { dispatch } = useCart()

  useEffect(() => {
    if (sessionId) {
      dispatch({ type: 'CLEAR_CART' })
    }
  }, [sessionId, dispatch])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-2xl font-bold">Obrigado pela compra</h1>
            <p className="text-muted-foreground">
              {sessionId
                ? 'Seu pagamento pelo Stripe está sendo processado. Em instantes você verá o pedido em “Meus pedidos”, se estiver logado.'
                : 'Retorne à página de checkout usando o fluxo oficial da loja ou confira suas compras no painel Stripe.'}
            </p>

            {sessionId ? (
              <div className="bg-muted rounded-lg p-4 text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Sessão</p>
                <p className="font-mono text-xs truncate" title={sessionId}>
                  {sessionId}
                </p>
              </div>
            ) : null}

            <div className="flex flex-col gap-2 pt-2">
              <Button className="w-full" asChild>
                <Link href="/orders">
                  <Package className="mr-2 h-4 w-4" />
                  Meus pedidos
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Voltar ao início
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
