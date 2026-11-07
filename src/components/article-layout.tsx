import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { TocItem } from '@/lib/markdown'
import { cn } from '@/lib/utils'

/**
 * Two columns on large screens: content on the left, a sticky overview on the
 * right. On small screens the overview's details sit between header and body.
 *
 * The overview spans every row on large screens. The last row is `1fr` so it
 * absorbs any height the overview adds, instead of the browser spreading it
 * between header, content and footer. `content-start` stops rows stretching
 * when the article is shorter than the page.
 */
export function ArticleLayout({
  header,
  aside,
  children,
  footer,
}: {
  header: ReactNode
  aside: ReactNode
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <article className="grid flex-1 grid-cols-1 content-start gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-16 xl:gap-x-24">
      <div className="lg:col-start-1 lg:row-start-1">{header}</div>
      <aside
        aria-label="Overview"
        className="grid grid-cols-2 gap-6 border-y border-border py-6 lg:col-start-2 lg:row-span-full lg:sticky lg:top-10 lg:flex lg:max-h-[calc(100svh-5rem)] lg:flex-col lg:gap-8 lg:self-start lg:overflow-y-auto lg:border-0 lg:py-0"
      >
        {aside}
      </aside>
      <div className="min-w-0 lg:col-start-1 lg:row-start-2">{children}</div>
      {footer && <div className="lg:col-start-1 lg:row-start-3">{footer}</div>}
    </article>
  )
}

export function AsideSection({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('flex flex-col gap-2', className)}>
      <h2 className="m-0 font-mono text-xs font-normal uppercase tracking-widest text-muted-foreground">
        {label}
      </h2>
      <div className="text-sm">{children}</div>
    </section>
  )
}

/** The section currently at the top of the viewport. */
function useActiveSection(ids: Array<string>) {
  const [active, setActive] = useState<string | null>(null)
  // A string, so a new array with the same ids doesn't resubscribe
  const key = ids.join('\n')

  useEffect(() => {
    const ids = key ? key.split('\n') : []
    let frame = 0
    const update = () => {
      frame = 0
      let current: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [key])

  return active
}

/** Numbered to match the § labels styles.css puts on each section. */
export function TableOfContents({ items }: { items: Array<TocItem> }) {
  const active = useActiveSection(items.map((item) => item.id))
  if (items.length < 2) return null

  return (
    <AsideSection label="Contents" className="col-span-2 hidden lg:flex">
      <nav aria-label="Table of contents">
        <ol className="m-0 flex list-none flex-col gap-1.5">
          {items.map((item, i) => (
            <li key={item.id} className="m-0">
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? 'location' : undefined}
                className="group flex gap-3 no-underline text-muted-foreground transition-colors hover:text-foreground aria-[current=location]:text-foreground"
              >
                <span className="w-6 shrink-0 font-mono text-xs leading-5 opacity-70">
                  §{i + 1}
                </span>
                <span className="leading-5">{item.text}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </AsideSection>
  )
}
