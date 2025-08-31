'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { Product, Category } from '@prisma/client'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductWithCategory extends Product {
  category: Category
}

export default function CategoryDetailPage() {
  const params = useParams()
  const categoryId = params.id as string
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const { dispatch } = useCart()

  useEffect(() => {
    if (categoryId) {
      fetchCategoryAndProducts()
    }
  }, [categoryId])

  const fetchCategoryAndProducts = async () => {
    try {
      const [categoryRes, productsRes] = await Promise.all([
        fetch(`/api/categories/${categoryId}`),
        fetch(`/api/products?category=${categoryId}`)
      ])

      if (categoryRes.ok) {
        const categoryData = await categoryRes.json()
        setCategory(categoryData)
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.products || [])
      }
    } catch (error) {
      console.error('Erro ao buscar dados da categoria:', error)
    } finally {
      setLoading(false)
    }
  }

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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
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
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Categoria não encontrada</h1>
          <p className="text-gray-600 mb-6">A categoria que você está procurando não existe.</p>
          <Link href="/categories">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar às Categorias
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/categories" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar às Categorias
        </Link>
        
        <div className="flex items-center gap-6">
          {category.image && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                             <Image
                 src={category.image}
                 alt={category.name}
                 fill
                 sizes="96px"
                 className="object-cover"
               />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            <p className="text-gray-600">{category.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
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
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum produto encontrado nesta categoria.</p>
          <Link href="/products" className="mt-4 inline-block">
            <Button>Ver Todos os Produtos</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
