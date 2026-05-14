import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Star, Truck, Shield } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light text-primary-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, white 0%, transparent 45%), radial-gradient(circle at 80% 60%, white 0%, transparent 40%)',
        }}
        aria-hidden
      />
      <div className="container relative mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/80 mb-4">
            E-commerce profissional
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Tudo o que você precisa, com{' '}
            <span className="text-white drop-shadow-sm">checkout seguro</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-primary-foreground/90 max-w-2xl mx-auto text-balance">
            Catálogo completo, pagamentos com Stripe e entrega que você confia. Comece a comprar
            agora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold"
              asChild
            >
              <Link href="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Comprar agora
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/80 text-white hover:bg-white/15 hover:text-white"
              asChild
            >
              <Link href="/categories">Explorar categorias</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container relative mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center rounded-xl bg-white/10 backdrop-blur-sm p-6 border border-white/10">
            <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <Star className="h-7 w-7 text-amber-200" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Curadoria</h3>
            <p className="text-sm text-primary-foreground/85">
              Produtos selecionados com critério de qualidade
            </p>
          </div>
          <div className="text-center rounded-xl bg-white/10 backdrop-blur-sm p-6 border border-white/10">
            <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <Truck className="h-7 w-7 text-emerald-200" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Entrega</h3>
            <p className="text-sm text-primary-foreground/85">
              Logística pensada para chegar no prazo
            </p>
          </div>
          <div className="text-center rounded-xl bg-white/10 backdrop-blur-sm p-6 border border-white/10">
            <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Pagamento seguro</h3>
            <p className="text-sm text-primary-foreground/85">
              Criptografia e processamento Stripe
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
