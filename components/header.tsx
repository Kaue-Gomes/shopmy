'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, LogOut, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import { useState } from 'react'

export function Header() {
  const { data: session } = useSession()
  const { state } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <span className="text-xl font-bold">ShopMy</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Início
          </Link>
          <Link href="/products" className="text-sm font-medium hover:text-primary">
            Produtos
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-primary">
            Categorias
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className="relative"
          >
            <ShoppingCart className="h-4 w-4" />
            {state.itemCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {state.itemCount}
              </span>
            )}
          </Button>

          {session ? (
            <div className="flex items-center space-x-2">
              {session.user.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
