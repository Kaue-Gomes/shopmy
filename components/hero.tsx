import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Shield } from 'lucide-react'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=82'

export function Hero() {
  return (
    <section className="border-b border-border/70 bg-background">
      <div className="relative h-[260px] w-full md:h-[360px]">
        <Image
          src={HERO_IMAGE}
          alt="Ambiente editorial da coleção atual em destaque na loja ShopMy"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent" />
      </div>

      <div className="section-y border-t border-transparent pb-14 pt-10 md:py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <p
            className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
            style={{ lineHeight: 1.2 }}
          >
            Nova coleção · Outono · Frete econômico em pedidos combinados
          </p>

          <h1 className="text-balance text-xl font-semibold leading-tight text-foreground md:text-xl">
            Peças selecionadas para o seu guarda-roupa do dia a dia — com checkout seguro
          </h1>

          <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground line-clamp-2 md:line-clamp-none">
            Curadoria de produtos, pagamento Stripe e navegação pensada para mobile.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="rounded-control gap-2 bg-foreground px-10 font-semibold text-background hover:bg-foreground/90"
              asChild
            >
              <Link href="/products">
                <ShoppingBag className="h-5 w-5" aria-hidden />
                Comprar agora
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-control px-10 font-semibold" asChild>
              <Link href="/categories">Explorar categorias</Link>
            </Button>
          </div>

          <div className="mt-14 flex justify-center gap-10 text-muted-foreground">
            <span className="inline-flex items-center gap-2 text-xs">
              <Shield className="h-4 w-4 text-primary" aria-hidden /> Pagamentos com Stripe
            </span>
            <span className="hidden text-xs sm:inline">Suporte rápido em horário comercial</span>
          </div>
        </div>
      </div>
    </section>
  )
}
