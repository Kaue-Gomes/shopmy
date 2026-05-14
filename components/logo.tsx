import Link from 'next/link'
import { cn } from '@/lib/utils'

type LogoProps = { className?: string; inverse?: boolean }

export function Logo({ className, inverse }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md',
        className
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg font-bold text-sm shadow-sm shrink-0',
          inverse ? 'bg-white text-primary-dark' : 'bg-primary text-primary-foreground'
        )}
        aria-hidden
      >
        S
      </span>
      <span
        className={cn(
          'text-xl font-bold tracking-tight',
          inverse ? 'text-white' : 'text-foreground'
        )}
      >
        ShopMy
      </span>
    </Link>
  )
}
