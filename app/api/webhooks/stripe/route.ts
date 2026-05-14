import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error('Erro na verificação do webhook:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      {
        status: 400,
      }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const meta = session.metadata || {}
        const isGuest = meta.isGuest === 'true'
        const userId = meta.userId?.trim() || null
        const guestEmail = meta.guestEmail?.trim() || null
        const guestName = meta.guestName?.trim() || null

        if (!isGuest && !userId) {
          console.error('checkout.session.completed: userId ausente para compra logada')
          break
        }
        if (isGuest && !guestEmail) {
          console.error('checkout.session.completed: guestEmail ausente')
          break
        }

        const order = await prisma.order.create({
          data: {
            userId: isGuest ? null : userId,
            guestEmail: isGuest ? guestEmail : null,
            guestName: isGuest ? guestName : null,
            total: session.amount_total! / 100,
            status: 'PROCESSING',
            paymentIntent: session.payment_intent as string,
          },
        })

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

        for (const item of lineItems.data) {
          if (item.price?.product) {
            const product = await prisma.product.findFirst({
              where: { name: item.description },
            })

            if (product) {
              await prisma.orderItem.create({
                data: {
                  orderId: order.id,
                  productId: product.id,
                  quantity: item.quantity || 1,
                  price: (item.price.unit_amount || 0) / 100,
                },
              })

              await prisma.product.update({
                where: { id: product.id },
                data: {
                  stock: {
                    decrement: item.quantity || 1,
                  },
                },
              })
            }
          }
        }

        if (!isGuest && userId) {
          await prisma.cartItem.deleteMany({
            where: { userId },
          })
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await prisma.order.update({
          where: { paymentIntent: paymentIntent.id },
          data: { status: 'PROCESSING' },
        })

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await prisma.order.update({
          where: { paymentIntent: paymentIntent.id },
          data: { status: 'CANCELLED' },
        })

        break
      }

      default:
        console.log(`Evento não tratado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
