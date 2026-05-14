'use client'

import '@/sentry.client.config'
import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/context/cart-context'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster richColors closeButton duration={4200} position="top-center" />
      </CartProvider>
    </SessionProvider>
  )
}
