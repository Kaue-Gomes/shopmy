'use client'

import * as Sentry from '@sentry/nextjs'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error)
  }

  return (
    <html lang="pt-BR">
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col justify-center px-6">
        <div className="max-w-xl mx-auto text-center space-y-6 py-16">
          <h1 className="text-xl font-semibold">Erro inesperado</h1>
          <p className="text-sm text-muted-foreground">
            Aplicação encontrou falha grave. Você pode tentar recarregar.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
