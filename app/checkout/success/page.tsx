import { Suspense } from 'react'
import CheckoutSuccessClient from './checkout-success-client'
import { Card, CardContent } from '@/components/ui/card'

function CheckoutSuccessSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 text-center space-y-4 animate-pulse">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted" />
            <div className="mx-auto h-8 w-3/4 max-w-xs rounded-md bg-muted" />
            <div className="mx-auto h-10 w-full max-w-sm rounded-md bg-muted" />
            <div className="mx-auto h-10 w-full rounded-md bg-muted" />
            <div className="mx-auto h-10 w-full rounded-md bg-muted" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessSkeleton />}>
      <CheckoutSuccessClient />
    </Suspense>
  )
}
