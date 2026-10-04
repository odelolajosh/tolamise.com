import { Monitor, Moon, Sun } from 'lucide-react'
import type { T as Theme } from '@/lib/theme'
import { useTheme } from '@/components/theme/theme-provider'

const next: Record<Theme, Theme> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

const icons = { system: Monitor, light: Sun, dark: Moon }

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const Icon = icons[theme]

  return (
    <button
      type="button"
      onClick={() => setTheme(next[theme])}
      aria-label={`Theme: ${theme}. Switch to ${next[theme]}`}
      title={`Theme: ${theme}`}
      className="flex cursor-pointer hover:text-foreground"
    >
      <Icon className="w-6 h-6" />
    </button>
  )
}
