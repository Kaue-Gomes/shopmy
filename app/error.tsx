'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container px-4 py-20 flex flex-col items-center text-center gap-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Algo deu errado</h1>
      <p className="text-muted-foreground leading-relaxed">
        Não foi possível completar esta ação. Tente novamente em instantes. Se persistir, contate o
        suporte.
      </p>
      {process.env.NODE_ENV === 'development' ? (
        <pre className="text-xs bg-muted rounded-md p-3 w-full overflow-x-auto text-left">
          {error.message}
        </pre>
      ) : null}
      <button
        type="button"
        className="inline-flex rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
        onClick={() => reset()}
      >
        Tentar de novo
      </button>
    </div>
  )
}
