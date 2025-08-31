'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Home } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      // Aqui você pode buscar os detalhes do pedido usando o sessionId
      // Por enquanto, vamos simular um sucesso
      setTimeout(() => {
        setOrderDetails({
          id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          total: 0, // Será preenchido com o total real
        })
        setLoading(false)
      }, 1000)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Processando seu pedido...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Pedido Confirmado!</h1>
            <p className="text-gray-600 mb-6">
              Obrigado pela sua compra. Seu pedido foi processado com sucesso.
            </p>

            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Número do Pedido:</p>
                <p className="font-semibold">{orderDetails.id}</p>
              </div>
            )}

            <div className="space-y-3">
              <Link href="/orders" className="block">
                <Button className="w-full">
                  <Package className="h-4 w-4 mr-2" />
                  Ver Meus Pedidos
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Você receberá um email de confirmação em breve com os detalhes do seu pedido.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
