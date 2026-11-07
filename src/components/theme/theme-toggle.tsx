import { Monitor, Moon, Sun } from 'lucide-react'
import type { T as Theme } from '@/lib/theme'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'

const next: Record<Theme, Theme> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

const labels: Record<Theme, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
}

const icons = { system: Monitor, light: Sun, dark: Moon }

/** Text button that cycles system → light → dark. */
export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const Icon = icons[theme]

  return (
    <button
      type="button"
      onClick={() => setTheme(next[theme])}
      aria-label={`Theme: ${labels[theme]}. Switch to ${labels[next[theme]]}`}
      title={`Switch to ${labels[next[theme]].toLowerCase()} theme`}
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground',
        className,
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {/* Every label sits in the same cell, so the button is always as wide
          as the longest one and the nav doesn't shift when it changes */}
      <span className="inline-grid">
        {Object.entries(labels).map(([key, label]) => (
          <span
            key={key}
            aria-hidden="true"
            className={cn(
              'col-start-1 row-start-1 text-left',
              key !== theme && 'invisible',
            )}
          >
            {label}
          </span>
        ))}
      </span>
    </button>
  )
}
