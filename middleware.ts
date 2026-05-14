import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  authRegisterLimiter,
  checkoutLimiter,
  jsonTooManyRetries,
  rateLimitFingerprint,
} from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/api/auth/register' && request.method === 'POST' && authRegisterLimiter) {
    const { success } = await authRegisterLimiter.limit(rateLimitFingerprint(request))
    if (!success) return jsonTooManyRetries()
  }

  if (pathname === '/api/checkout' && request.method === 'POST' && checkoutLimiter) {
    const { success } = await checkoutLimiter.limit(rateLimitFingerprint(request))
    if (!success) return jsonTooManyRetries()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/auth/register', '/api/checkout'],
}
