'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { HeaderSearch, HeaderSearchMobileIcon } from '@/components/header-search'

export function Header() {
  const { data: session } = useSession()
  const { state } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-2">
        <Logo />

        <HeaderSearch />

        <HeaderSearchMobileIcon />

        <nav className="hidden lg:flex items-center gap-6 shrink-0">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary">
            Início
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Produtos
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Categorias
          </Link>
          {session ? (
            <Link
              href="/orders"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Pedidos
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className="relative border-primary/20"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart className="h-4 w-4" />
            {state.itemCount > 0 ? (
              <span className="absolute -top-2 -right-2 min-h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-5 flex items-center justify-center border-2 border-background">
                {state.itemCount > 99 ? '99+' : state.itemCount}
              </span>
            ) : null}
          </Button>

          {session ? (
            <>
              {session.user.role === 'ADMIN' ? (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    Admin
                  </Button>
                </Link>
              ) : null}
              <Link href="/orders" className="hidden sm:inline">
                <Button variant="outline" size="icon" aria-label="Pedidos">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="icon" onClick={() => signOut()} aria-label="Sair">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
