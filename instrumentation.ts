export async function register() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return

  const runtime = process.env.NEXT_RUNTIME
  if (runtime === 'nodejs') {
    await import('./sentry.server.config')
  } else if (runtime === 'edge') {
    await import('./sentry.edge.config')
  }
}
