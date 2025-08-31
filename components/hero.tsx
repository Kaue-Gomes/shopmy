import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Star, Truck, Shield } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bem-vindo ao <span className="text-yellow-300">ShopMy</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Sua plataforma de e-commerce completa com as melhores tecnologias
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Ver Produtos
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Saiba Mais
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-yellow-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Produtos de Qualidade</h3>
            <p className="text-blue-100">Selecionamos os melhores produtos para você</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-green-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
            <p className="text-blue-100">Receba seus pedidos no menor tempo possível</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Compra Segura</h3>
            <p className="text-blue-100">Pagamentos protegidos com Stripe</p>
          </div>
        </div>
      </div>
    </section>
  )
}
