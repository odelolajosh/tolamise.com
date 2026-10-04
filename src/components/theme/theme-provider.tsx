import { useRouter } from '@tanstack/react-router'
import { createContext, use, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { T as Theme } from '@/lib/theme'
import { setThemeServerFn } from '@/lib/theme'

type ThemeContextVal = { theme: Theme; setTheme: (val: Theme) => void }
type Props = PropsWithChildren<{ theme: Theme }>

const ThemeContext = createContext<ThemeContextVal | null>(null)

export function ThemeProvider({ children, theme: initial }: Props) {
  const router = useRouter()
  const [theme, setThemeState] = useState(initial)

  function setTheme(val: Theme) {
    setThemeState(val)
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    if (val !== 'system') root.classList.add(val)

    setThemeServerFn({ data: val }).then(() => router.invalidate())
  }

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>
}

export function useTheme() {
  const val = use(ThemeContext)
  if (!val) throw new Error('useTheme called outside of ThemeProvider!')
  return val
}
