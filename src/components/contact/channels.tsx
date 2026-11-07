import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import type { Channel, ChannelKey } from '@/lib/contact'
import { channels } from '@/lib/contact'
import { useCopy } from '@/lib/use-copy'
import { cn } from '@/lib/utils'
import { GithubIcon, LinkedInIcon, XIcon } from '@/components/icons'
import { Kbd } from './kbd'

const icons: Record<ChannelKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  email: Mail,
  github: GithubIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

export function Channels() {
  const { copied, copy } = useCopy()
  // The card whose shortcut was just pressed, so it can flash
  const [flashed, setFlashed] = useState<ChannelKey | null>(null)
  const flashTimer = useRef<number | undefined>(undefined)

  const activate = (channel: Channel) => {
    if (channel.key === 'email') void copy('email', channel.handle)
    else window.open(channel.href, '_blank', 'noopener,noreferrer')
  }
  // The keydown listener is added once; the ref keeps `activate` current
  const activateRef = useRef(activate)
  activateRef.current = activate

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return
      const channel = channels.find((c) => c.shortcut === e.key.toLowerCase())
      if (!channel) return
      e.preventDefault()
      activateRef.current(channel)
      setFlashed(channel.key)
      window.clearTimeout(flashTimer.current)
      flashTimer.current = window.setTimeout(() => setFlashed(null), 600)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(flashTimer.current)
    }
  }, [])

  const email = channels.find((c) => c.key === 'email')!
  const profiles = channels.filter((c) => c.key !== 'email')
  const emailCopied = copied?.id === 'email' ? copied : null

  return (
    <div className="flex flex-col gap-10">
      {/* Primary: email */}
      <div
        className={cn(
          'relative isolate flex flex-col gap-8 overflow-hidden border border-border p-6 transition-colors duration-300 sm:p-10',
          (flashed === 'email' || emailCopied?.ok) && 'border-foreground',
        )}
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid" />
        {/* Fades the grid out towards the bottom left, behind the text */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-background mask-[radial-gradient(ellipse_at_top_right,transparent_10%,black_70%)]"
        />

        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Mail className="size-4" aria-hidden="true" />
            Email · the best way to reach me
          </span>
          <Kbd>E</Kbd>
        </div>

        <button
          type="button"
          onClick={() => activate(email)}
          aria-label={`Copy email address ${email.handle}`}
          className="group w-fit max-w-full cursor-pointer text-left"
        >
          <span className="block break-all font-display text-[clamp(1.75rem,7vw,4.5rem)] leading-[1.1] text-foreground">
            {email.handle}
          </span>
          <span className="mt-3 block h-px w-0 bg-foreground transition-[width] duration-500 ease-out group-hover:w-full group-focus-visible:w-full" />
        </button>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={() => activate(email)}
            className="inline-flex min-w-44 cursor-pointer items-center justify-center gap-2 border border-foreground bg-foreground px-5 py-2.5 text-sm text-background transition-opacity hover:opacity-85"
          >
            {emailCopied ? (
              emailCopied.ok ? (
                <>
                  <Check className="size-4" aria-hidden="true" /> Copied to clipboard
                </>
              ) : (
                <>Couldn&apos;t copy</>
              )
            ) : (
              <>
                <Copy className="size-4" aria-hidden="true" /> Copy address
              </>
            )}
          </button>
          <a
            href={email.href}
            className="group inline-flex items-center gap-1 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
          >
            Open in mail app
            <ArrowUpRight
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>

      {/* Secondary: profiles */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Elsewhere
        </span>
        <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2">
          {profiles.map((channel) => {
            const Icon = icons[channel.key]
            return (
              <li key={channel.key} className="m-0">
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${channel.label}: ${channel.handle}`}
                  className={cn(
                    'group inline-flex items-center gap-2 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground',
                    flashed === channel.key && 'text-foreground',
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  <span>{channel.label}</span>
                  <span className="text-muted-foreground/70 group-hover:text-muted-foreground">
                    {channel.handle}
                  </span>
                  <ArrowUpRight
                    className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                  <Kbd className="ml-1">{channel.shortcut.toUpperCase()}</Kbd>
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      <p aria-live="polite" className="sr-only">
        {emailCopied &&
          (emailCopied.ok ? 'Email address copied' : 'Could not copy the email address')}
      </p>
    </div>
  )
}
