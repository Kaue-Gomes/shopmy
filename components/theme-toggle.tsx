'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    document.documentElement.classList.toggle('dark')
    const on = document.documentElement.classList.contains('dark')
    setIsDark(on)
    try {
      localStorage.setItem('shopmy-theme', on ? 'dark' : 'light')
    } catch {
      //
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      type="button"
      onClick={toggle}
      className="h-11 w-11 shrink-0 rounded-control border-transparent text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      aria-pressed={isDark}
    >
      {isDark ? <Moon className="h-5 w-5" aria-hidden /> : <Sun className="h-5 w-5" aria-hidden />}
    </Button>
  )
}
