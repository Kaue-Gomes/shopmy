import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Carrinho vazio' },
        { status: 400 }
      )
    }

    // Buscar produtos do banco de dados
    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })

    // Verificar se todos os produtos existem
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Alguns produtos não foram encontrados' },
        { status: 400 }
      )
    }

    // Calcular total
    const total = items.reduce((sum: number, item: any) => {
      const product = products.find(p => p.id === item.productId)
      return sum + (product?.price || 0) * item.quantity
    }, 0)

    // Criar sessão de checkout do Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => {
        const product = products.find(p => p.id === item.productId)
        return {
          price_data: {
            currency: 'brl',
            product_data: {
              name: product?.name || 'Produto',
              description: product?.description || '',
              images: product?.image ? [product.image] : [],
            },
            unit_amount: Math.round((product?.price || 0) * 100), // Stripe usa centavos
          },
          quantity: item.quantity,
        }
      }),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      metadata: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({ sessionId: stripeSession.id })
  } catch (error) {
    console.error('Erro no checkout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
