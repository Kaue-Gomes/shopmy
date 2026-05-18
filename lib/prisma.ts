import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Strings da Neon CLI (--prisma) podem incluir channel_binding=require, que falha em
 * alguns ambientes Node + pg (serverless incluso).
 */
function normalizeDatabaseUrl(raw: string): string {
  try {
    const u = new URL(raw)
    if (u.protocol !== 'postgresql:' && u.protocol !== 'postgres:') {
      return raw
    }
    u.searchParams.delete('channel_binding')
    if (!u.searchParams.has('sslmode')) {
      u.searchParams.set('sslmode', 'require')
    }
    return u.href
  } catch {
    return raw
  }
}

function createPrismaClient(): PrismaClient {
  const raw = process.env.DATABASE_URL
  const logs: Array<'warn' | 'error'> =
    process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']

  if (!raw) {
    return new PrismaClient({ log: logs })
  }

  const url = normalizeDatabaseUrl(raw)
  return new PrismaClient({
    datasources: { db: { url } },
    log: logs,
  })
}

export const prisma = globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient())
