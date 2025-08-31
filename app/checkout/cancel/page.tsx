'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ShoppingCart, Home } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Pagamento Cancelado</h1>
            <p className="text-gray-600 mb-6">
              Seu pagamento foi cancelado. Nenhuma cobrança foi realizada.
            </p>

            <div className="space-y-3">
              <Link href="/checkout" className="block">
                <Button className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </Link>
              <Link href="/products" className="block">
                <Button variant="outline" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                Se você teve problemas durante o pagamento, entre em contato conosco.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
