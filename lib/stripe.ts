import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const formatAmountForDisplay = (amount: number, currency: string): string => {
  let numberFormat = new Intl.NumberFormat(['pt-BR'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  return numberFormat.format(amount)
}

export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100)
}
