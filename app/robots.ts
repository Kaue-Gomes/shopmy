import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const originRaw = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const origin = originRaw.replace(/\/$/, '')

  let host: string | undefined
  try {
    host = new URL(origin).host
  } catch {
    host = undefined
  }

  const baseRule: MetadataRoute.Robots = {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${origin}/sitemap.xml`,
  }

  return host ? { ...baseRule, host } : baseRule
}
