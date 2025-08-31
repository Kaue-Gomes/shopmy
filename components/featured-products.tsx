'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { Product } from '@prisma/client'
import { ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { dispatch } = useCart()

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then(res => {
        if (!res.ok) {
          throw new Error('Erro ao buscar produtos')
        }
        return res.json()
      })
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error('Erro ao buscar produtos:', error)
        setProducts([])
        setLoading(false)
      })
  }, [])

  const handleAddToCart = (product: Product) => {
    try {
      dispatch({
        type: 'ADD_ITEM',
        payload: { product, quantity: 1 }
      })
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Produtos em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products && products.length > 0 ? products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Destaque
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-green-600">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-1"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
                <Link href={`/products/${product.id}`} className="block mt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Detalhes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Nenhum produto em destaque encontrado.</p>
            </div>
          )}
        </div>
        <div className="text-center mt-8">
          <Link href="/products">
            <Button size="lg">
              Ver Todos os Produtos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
