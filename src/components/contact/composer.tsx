import { useEffect, useId, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, RotateCcw } from 'lucide-react'
import { EMAIL } from '@/lib/contact'
import { useCopy } from '@/lib/use-copy'
import { cn } from '@/lib/utils'
import { Kbd } from './kbd'

const topics = [
  'Just saying hi',
  'Collaboration',
  'Job opportunity',
  'Research',
  'About a post',
  'Something else',
] as const

export type Draft = {
  topic: (typeof topics)[number]
  name: string
  subject: string
  message: string
}

const EMPTY: Draft = { topic: topics[0], name: '', subject: '', message: '' }
const STORAGE_KEY = 'contact-draft'
// Some mail clients and browsers truncate or reject longer mailto: links
const MAILTO_LIMIT = 2000

export function compose(draft: Draft) {
  const name = draft.name.trim()
  const subject =
    draft.subject.trim() || (name ? `${draft.topic} · from ${name}` : draft.topic)
  const signOff = name ? `\n\n${name}` : ''
  const body = `Hi Joshua,\n\n${draft.message.trim()}${signOff}`
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  return { subject, body, mailto }
}

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

const fieldClass =
  'w-full border border-border bg-transparent px-3 py-2 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-muted-foreground focus-visible:border-foreground'

const labelClass =
  'font-mono text-xs uppercase tracking-widest text-muted-foreground'

export function Composer() {
  const id = useId()
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [loaded, setLoaded] = useState(false)
  const [status, setStatus] = useState<'idle' | 'empty' | 'opened'>('idle')
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const { copied, copy } = useCopy()

  // Restore a saved draft after hydration, so server and client HTML match
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
      if (saved && typeof saved === 'object') {
        setDraft({
          ...EMPTY,
          ...saved,
          topic: topics.includes(saved.topic) ? saved.topic : EMPTY.topic,
        })
      }
    } catch {
      // A corrupt draft isn't worth surfacing
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    const isEmpty = !draft.name && !draft.subject && !draft.message
    if (isEmpty) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  }, [draft, loaded])

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setStatus('idle')
  }

  const { subject, body, mailto } = compose(draft)
  const hasMessage = draft.message.trim().length > 0
  const words = countWords(draft.message)
  const tooLong = mailto.length > MAILTO_LIMIT
  const hasDraft = Boolean(draft.name || draft.subject || draft.message)

  const send = () => {
    if (!hasMessage) {
      setStatus('empty')
      messageRef.current?.focus()
      return
    }
    window.location.href = mailto
    setStatus('opened')
  }

  const fullMessage = `To: ${EMAIL}\nSubject: ${subject}\n\n${body}`

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
      >
        <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
          <legend className={cn(labelClass, 'mb-3')}>What&apos;s it about?</legend>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <label key={topic} className="cursor-pointer">
                <input
                  type="radio"
                  name={`${id}-topic`}
                  value={topic}
                  checked={draft.topic === topic}
                  onChange={() => update('topic', topic)}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground peer-checked:border-foreground peer-checked:text-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring">
                  {topic}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor={`${id}-name`} className={labelClass}>
              Your name
            </label>
            <input
              id={`${id}-name`}
              type="text"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={draft.name}
              onChange={(e) => update('name', e.target.value)}
              className={fieldClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={`${id}-subject`} className={labelClass}>
              Subject <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id={`${id}-subject`}
              type="text"
              placeholder={draft.topic}
              value={draft.subject}
              onChange={(e) => update('subject', e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor={`${id}-message`} className={labelClass}>
              Message
            </label>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {words} {words === 1 ? 'word' : 'words'}
            </span>
          </div>
          <textarea
            id={`${id}-message`}
            ref={messageRef}
            rows={8}
            placeholder="What's on your mind?"
            value={draft.message}
            aria-invalid={status === 'empty' || undefined}
            aria-describedby={`${id}-status`}
            onChange={(e) => update('message', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                send()
              }
            }}
            className={cn(
              fieldClass,
              'resize-y leading-relaxed',
              status === 'empty' && 'border-foreground',
            )}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="group inline-flex cursor-pointer items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-85"
          >
            Open in my mail app
            <ArrowUpRight
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={() => void copy('message', fullMessage)}
            disabled={!hasMessage}
            className="inline-flex cursor-pointer items-center gap-2 border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied?.id === 'message' && copied.ok ? (
              <>
                <Check className="size-4" aria-hidden="true" /> Copied
              </>
            ) : (
              <>
                <Copy className="size-4" aria-hidden="true" /> Copy message
              </>
            )}
          </button>
          <span className="hidden items-center gap-1 text-xs text-muted-foreground md:inline-flex">
            <Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> to send
          </span>
        </div>

        <p
          id={`${id}-status`}
          aria-live="polite"
          className="m-0 min-h-5 text-sm text-muted-foreground"
        >
          {status === 'empty' && 'Write a message first.'}
          {status === 'opened' &&
            `Your mail app should open with everything filled in. Nothing happened? Copy the message and send it to ${EMAIL}.`}
          {status === 'idle' &&
            tooLong &&
            'That’s a long one! Some mail apps cut off long messages, so “Copy message” is the safer bet.'}
          {copied?.id === 'message' &&
            !copied.ok &&
            'Couldn’t copy. Select the preview text instead.'}
        </p>
      </form>

      <Preview
        subject={subject}
        name={draft.name.trim()}
        message={draft.message.trim()}
        onClear={
          hasDraft
            ? () => {
                setDraft(EMPTY)
                setStatus('idle')
              }
            : undefined
        }
      />
    </div>
  )
}

function Preview({
  subject,
  name,
  message,
  onClear,
}: {
  subject: string
  name: string
  message: string
  onClear?: () => void
}) {
  return (
    <figure className="m-0 flex flex-col self-start border border-border lg:sticky lg:top-10">
      <figcaption className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <span
            aria-hidden="true"
            className={cn(
              'size-1.5 rounded-full',
              message ? 'bg-foreground motion-safe:animate-pulse' : 'bg-muted-foreground/50',
            )}
          />
          {message ? 'Draft · saved on this device' : 'Live preview'}
        </span>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex cursor-pointer items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3" aria-hidden="true" /> Clear
          </button>
        )}
      </figcaption>
      <div className="flex flex-col gap-1 border-b border-border px-4 py-3 font-mono text-sm">
        <PreviewHeader label="To">{EMAIL}</PreviewHeader>
        {name && <PreviewHeader label="From">{name}</PreviewHeader>}
        <PreviewHeader label="Subject">{subject}</PreviewHeader>
      </div>
      <div className="min-h-56 whitespace-pre-wrap break-words px-4 py-4 leading-relaxed text-foreground">
        <p className="m-0">Hi Joshua,</p>
        <p className="mt-4 mb-0">
          {message ? (
            message
          ) : (
            <span className="text-muted-foreground/70">
              Your message shows up here as you type…
            </span>
          )}
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-[1.1em] w-px translate-y-[0.2em] bg-foreground motion-safe:animate-blink"
          />
        </p>
        {name && <p className="mt-4 mb-0">{name}</p>}
      </div>
    </figure>
  )
}

function PreviewHeader({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
      <span className="text-muted-foreground">{label}:</span>
      <span className="break-words text-foreground">{children}</span>
    </div>
  )
}
