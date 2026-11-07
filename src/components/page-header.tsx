import type { ReactNode } from 'react'

export function PageHeader({
  title,
  description,
}: {
  title: string
  description: ReactNode
}) {
  return (
    <header className="flex flex-col gap-3 text-center">
      <h1 className="font-display text-5xl md:text-6xl tracking-tight leading-[1.1]">
        {title}
      </h1>
      <p className="m-0 text-base md:text-lg text-muted-foreground text-balance">
        {description}
      </p>
    </header>
  )
}

/** Top border with a soft highlight in the middle, separating header and content. */
export function Divider() {
  return (
    <div aria-hidden="true" className="relative border-t border-border">
      <div className="absolute left-1/2 -top-px h-px w-[300px] max-w-full -translate-x-1/2 bg-linear-to-r from-transparent via-muted-foreground/60 to-transparent" />
    </div>
  )
}
