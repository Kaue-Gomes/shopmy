import Link from 'next/link'
import { ShieldCheck, Lock, CreditCard } from 'lucide-react'
import { Logo } from '@/components/logo'

export function Footer() {
  return (
    <footer className="bg-primary-dark text-primary-foreground border-t border-primary-dark/80">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Logo inverse />
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Sua loja online com Next.js, Stripe e experiência pensada para conversão.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-medium border border-white/10">
                <Lock className="h-4 w-4 shrink-0" aria-hidden />
                HTTPS
              </div>
              <div className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-medium border border-white/10">
                <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
                Stripe
              </div>
              <div className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-medium border border-white/10">
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
                LGPD ready
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/95">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-primary-foreground/80 hover:text-white transition-colors"
                >
                  Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-primary-foreground/80 hover:text-white transition-colors"
                >
                  Categorias
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-primary-foreground/80 hover:text-white transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/95">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-primary-foreground/80 hover:text-white transition-colors"
                >
                  Ajuda
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-primary-foreground/80 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-primary-foreground/80 hover:text-white transition-colors"
                >
                  Envios
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/95">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-primary-foreground/80 hover:text-white transition-colors"
                >
                  Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-primary-foreground/80 hover:text-white transition-colors"
                >
                  Termos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 text-center text-sm text-primary-foreground/70">
          <p>&copy; {new Date().getFullYear()} ShopMy. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
