'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/context/cart-context'
import { Product } from '@prisma/client'
import { ShoppingCart, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { dispatch } = useCart()

  // Debounce para busca em tempo real
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1)
      fetchProducts()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search])

  useEffect(() => {
    fetchProducts()
  }, [page])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      })
      
      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      
      setProducts(data.products || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity: 1 }
    })
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Produtos</h1>
        
        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {search && (
            <Button 
              variant="outline" 
              onClick={() => setSearch('')}
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-green-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Estoque: {product.stock}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                    <Link href={`/products/${product.id}`}>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <span className="flex items-center px-4">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
