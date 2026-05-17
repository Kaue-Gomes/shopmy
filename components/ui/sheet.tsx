'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close
const SheetPortal = DialogPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out fade-in-0 fade-out-0 duration-200',
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName

type SheetSide = 'left' | 'right' | 'bottom'

type SheetContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  side?: SheetSide
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ className, side = 'right', children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-[60] bg-background shadow-lg outline-none duration-300',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in transition',
        side === 'left' &&
          cn(
            'flex h-full w-full max-w-md flex-col border-r',
            'inset-y-0 left-0',
            'data-[state=open]:animate-slide-in-from-left',
            'data-[state=closed]:animate-slide-out-to-left'
          ),
        side === 'right' &&
          cn(
            'flex h-full w-full max-w-md flex-col border-l',
            'inset-y-0 right-0',
            'data-[state=open]:animate-slide-in-from-right',
            'data-[state=closed]:animate-slide-out-to-right'
          ),
        side === 'bottom' &&
          cn(
            'flex flex-col border-t rounded-t-2xl max-h-[80vh]',
            'inset-x-0 bottom-0',
            'data-[state=open]:animate-slide-in-from-bottom',
            'data-[state=closed]:animate-slide-out-to-bottom'
          ),
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = DialogPrimitive.Content.displayName

const SheetTitle = DialogPrimitive.Title
const SheetDescription = DialogPrimitive.Description

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetPortal,
  SheetTrigger,
  SheetClose,
  SheetOverlay,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetFooter,
}
