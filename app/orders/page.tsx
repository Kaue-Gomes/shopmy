'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyOrders } from '@/components/empty-states'

type OrderItem = {
  id: string
  quantity: number
  price: number
  product: { id: string; name: string; image: string }
}

type Order = {
  id: string
  total: number
  status: string
  createdAt: string
  orderItems: OrderItem[]
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user?.id) return

    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders')
        if (!res.ok) {
          setError('Não foi possível carregar pedidos.')
          setOrders([])
          return
        }
        const data = await res.json()
        setOrders(Array.isArray(data) ? data : [])
      } catch {
        setError('Erro de rede.')
        setOrders([])
      }
    }

    fetchOrders()
  }, [session?.user?.id])

  if (status === 'loading') {
    return <div className="container px-4 py-12 text-muted-foreground text-center">Carregando…</div>
  }

  if (!session?.user?.id) {
    return (
      <div className="container px-4 py-12 max-w-md mx-auto space-y-4 text-center">
        <p className="text-lg font-medium">Faça login para ver seus pedidos.</p>
        <Button asChild>
          <Link href="/auth/signin">Entrar</Link>
        </Button>
      </div>
    )
  }

  if (orders === null) {
    return (
      <div className="container px-4 py-12 text-center text-muted-foreground">
        Buscando pedidos…
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-12 max-w-lg mx-auto text-center space-y-4">
        <p className="text-destructive">{error}</p>
        <Button asChild variant="outline">
          <Link href="/">Voltar</Link>
        </Button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container px-4 py-8">
        <EmptyOrders />
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Meus pedidos</h1>
        <p className="text-muted-foreground mt-2">Histórico de compras realizadas em sua conta.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base font-semibold">
                  Pedido {order.id.slice(0, 8)}…
                </CardTitle>
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleString('pt-BR')}
              </p>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-2">
                {order.orderItems?.map((line) => (
                  <div key={line.id} className="flex justify-between gap-4 text-sm">
                    <span className="truncate">
                      {line.product.name}{' '}
                      <span className="text-muted-foreground">×{line.quantity}</span>
                    </span>
                    <span className="shrink-0 tabular-nums">
                      R$ {(line.price * line.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-semibold">
                <span>Total</span>
                <span className="text-primary tabular-nums">R$ {order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
