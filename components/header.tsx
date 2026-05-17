'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, LogOut, Menu, LogIn, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import { Logo } from '@/components/logo'
import { HeaderSearch, HeaderSearchMobileIcon } from '@/components/header-search'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { PULSE_EVENT } from '@/lib/cart-events'

function useCartIconBump() {
  const [pulse, setPulse] = React.useState(false)
  React.useEffect(() => {
    const bump = () => {
      setPulse(true)
      window.setTimeout(() => setPulse(false), 620)
    }
    window.addEventListener(PULSE_EVENT, bump)
    return () => window.removeEventListener(PULSE_EVENT, bump)
  }, [])
  return pulse
}

function DesktopNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const active =
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        'relative flex h-16 shrink-0 items-center border-b-2 border-transparent px-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        active && 'border-primary text-primary font-semibold'
      )}
    >
      {children}
    </Link>
  )
}

function MobileDrawerLink({
  href,
  children,
  onNavigate,
}: {
  href: string
  children: React.ReactNode
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const active =
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      onClick={() => onNavigate?.()}
      className={cn(
        'block rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active && 'bg-muted/70 text-primary'
      )}
    >
      {children}
    </Link>
  )
}

export function Header() {
  const { data: session } = useSession()
  const { state } = useCart()
  const [cartOpen, setCartOpen] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()
  const cartPulse = useCartIconBump()

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:gap-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="h-11 w-11 shrink-0 lg:hidden rounded-control"
                aria-label="Abrir menu"
              >
                <Menu className="h-6 w-6" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              aria-describedby={undefined}
              className="relative w-[min(100%,288px)] p-0"
            >
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="absolute right-3 top-3 z-[1] rounded-full"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" aria-hidden />
                </Button>
              </SheetClose>
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <nav
                aria-label="Principal mobile"
                className="flex flex-col gap-1 border-b px-4 pb-8 pt-[3.75rem]"
              >
                <MobileDrawerLink href="/" onNavigate={() => setMobileOpen(false)}>
                  Início
                </MobileDrawerLink>
                <MobileDrawerLink href="/products" onNavigate={() => setMobileOpen(false)}>
                  Produtos
                </MobileDrawerLink>
                <MobileDrawerLink href="/categories" onNavigate={() => setMobileOpen(false)}>
                  Categorias
                </MobileDrawerLink>
                {session ? (
                  <>
                    <MobileDrawerLink href="/orders" onNavigate={() => setMobileOpen(false)}>
                      Pedidos
                    </MobileDrawerLink>
                    {session.user.role === 'ADMIN' ? (
                      <MobileDrawerLink href="/admin" onNavigate={() => setMobileOpen(false)}>
                        Admin
                      </MobileDrawerLink>
                    ) : null}
                  </>
                ) : (
                  <>
                    <MobileDrawerLink href="/auth/signin" onNavigate={() => setMobileOpen(false)}>
                      Entrar
                    </MobileDrawerLink>
                    <MobileDrawerLink href="/auth/signup" onNavigate={() => setMobileOpen(false)}>
                      Cadastrar
                    </MobileDrawerLink>
                  </>
                )}
              </nav>
              <SheetFooter className="p-6 mt-auto gap-4">
                <ThemeToggle />
                {session ? (
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full rounded-control"
                    onClick={() => signOut()}
                  >
                    Sair
                  </Button>
                ) : null}
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Logo />

          <nav
            aria-label="Principal desktop"
            className="mx-6 hidden h-full lg:flex lg:items-stretch lg:gap-x-2 xl:gap-x-3"
          >
            <DesktopNavLink href="/">Início</DesktopNavLink>
            <DesktopNavLink href="/products">Produtos</DesktopNavLink>
            <DesktopNavLink href="/categories">Categorias</DesktopNavLink>
            {session ? <DesktopNavLink href="/orders">Pedidos</DesktopNavLink> : null}
            {session?.user.role === 'ADMIN' ? (
              <DesktopNavLink href="/admin">Admin</DesktopNavLink>
            ) : null}
          </nav>
        </div>

        <HeaderSearch />

        <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
          <HeaderSearchMobileIcon />
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative h-11 w-11 rounded-control border border-transparent transition-colors duration-200 hover:bg-muted hover:text-primary"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart
              className={cn(
                'h-5 w-5 transition-transform duration-200',
                cartPulse && 'animate-cart-icon-pulse'
              )}
              aria-hidden
            />
            {state.itemCount > 0 ? (
              <span
                className="absolute right-[9px] top-[9px] h-[8px] w-[8px] rounded-full bg-promo shadow-sm ring-[1.5px] ring-background"
                aria-hidden
              />
            ) : null}
          </Button>

          {session ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-11 w-11 rounded-control border border-transparent sm:inline-flex"
                asChild
                aria-label="Minha conta e pedidos"
              >
                <Link href="/orders">
                  <User className="h-5 w-5" aria-hidden />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="hidden h-11 w-11 rounded-control border border-transparent md:inline-flex"
                onClick={() => signOut()}
                aria-label="Sair"
              >
                <LogOut className="h-5 w-5" aria-hidden />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-control"
              asChild
            >
              <Link
                href={`/auth/signin?callbackUrl=${encodeURIComponent(pathname || '/')}`}
                aria-label="Entrar ou cadastrar"
              >
                <LogIn className="h-5 w-5" aria-hidden />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}
