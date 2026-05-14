import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { checkoutBodySchema } from '@/lib/validations'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.length <= 254
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json().catch(() => null)
    const parsed = checkoutBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { items, guestEmail, guestName } = parsed.data

    if (!session?.user?.id) {
      if (!guestEmail || !isValidEmail(guestEmail)) {
        return NextResponse.json(
          {
            error: 'Informe um e-mail válido para continuar como convidado ou faça login.',
          },
          { status: 400 }
        )
      }
    }

    const productIds = items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'Alguns produtos não foram encontrados' }, { status: 400 })
    }

    const isGuestCheckout = !session?.user?.id
    const emailForStripe = session?.user?.email ? session.user.email : guestEmail!.trim()

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => {
        const product = products.find((p) => p.id === item.productId)
        return {
          price_data: {
            currency: 'brl',
            product_data: {
              name: product?.name || 'Produto',
              description: product?.description || '',
              images: product?.image ? [product.image] : [],
            },
            unit_amount: Math.round((product?.price || 0) * 100),
          },
          quantity: item.quantity,
        }
      }),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: emailForStripe,
      metadata:
        session?.user?.id != null
          ? {
              userId: session.user.id,
              isGuest: 'false',
            }
          : {
              userId: '',
              guestEmail: guestEmail!.trim(),
              guestName: (guestName?.trim() || '').slice(0, 120),
              isGuest: 'true',
            },
    })

    return NextResponse.json({ sessionId: stripeSession.id })
  } catch (error) {
    console.error('Erro no checkout:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
