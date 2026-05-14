import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const redisConfigured =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) && Boolean(process.env.UPSTASH_REDIS_REST_TOKEN)

const redis = redisConfigured ? Redis.fromEnv() : null

export const authRegisterLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(12, '1 m'),
      prefix: 'ratelimit:shopmy:register',
    })
  : null

export const checkoutLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '5 m'),
      prefix: 'ratelimit:shopmy:checkout',
    })
  : null

export const ordersLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, '5 m'),
      prefix: 'ratelimit:shopmy:orders',
    })
  : null

export function rateLimitFingerprint(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'anon'
}

export function jsonTooManyRetries() {
  return NextResponse.json(
    { error: 'Muitas requisições. Tente novamente em instantes.' },
    {
      status: 429,
    }
  )
}
