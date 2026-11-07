import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** A keyboard key. Hidden on small screens, where there's rarely a keyboard. */
export function Kbd({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <kbd
      className={cn(
        'hidden min-w-5 items-center justify-center rounded border border-border px-1.5 font-mono text-[0.7rem] leading-5 text-muted-foreground md:inline-flex',
        className,
      )}
    >
      {children}
    </kbd>
  )
}
