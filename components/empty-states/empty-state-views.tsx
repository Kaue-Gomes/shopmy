import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, SearchX, Package } from 'lucide-react'

export function EmptyCart({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] px-4 text-center">
      <ShoppingBag className="h-14 w-14 text-muted-foreground mb-4" aria-hidden />
      <h3 className="font-semibold text-lg mb-2">Seu carrinho está vazio</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Explore produtos e adicione itens quando quiser voltar ao checkout.
      </p>
      <Button asChild>
        <Link href="/products" onClick={onDismiss}>
          Ver produtos
        </Link>
      </Button>
    </div>
  )
}

export function EmptySearch() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
      <SearchX className="h-14 w-14 text-muted-foreground mb-4" aria-hidden />
      <h3 className="font-semibold text-xl mb-2">Nenhum resultado</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Tente outros termos de busca ou limpe os filtros para ver mais produtos.
      </p>
      <Button asChild variant="outline">
        <Link href="/products">Ver todos</Link>
      </Button>
    </div>
  )
}

export function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-lg mx-auto">
      <Package className="h-14 w-14 text-muted-foreground mb-4" aria-hidden />
      <h3 className="font-semibold text-xl mb-2">Nenhum pedido ainda</h3>
      <p className="text-muted-foreground mb-6">
        Quando você finalizar uma compra, seus pedidos aparecerão aqui.
      </p>
      <Button asChild>
        <Link href="/products">Ir às compras</Link>
      </Button>
    </div>
  )
}
