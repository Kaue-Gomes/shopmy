import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container px-4 py-20 flex flex-col items-center text-center gap-4 max-w-lg mx-auto">
      <span className="text-8xl font-bold text-primary tabular-nums">404</span>
      <h1 className="text-2xl font-bold text-balance">Página não encontrada</h1>
      <p className="text-muted-foreground">O recurso solicitado não existe ou foi movido.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
        >
          Ir ao início
        </Link>
        <Link
          href="/products"
          className="rounded-md border border-input px-6 py-2 text-sm font-medium hover:bg-muted"
        >
          Ver produtos
        </Link>
      </div>
    </div>
  )
}
