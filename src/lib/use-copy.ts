import { useCallback, useEffect, useRef, useState } from 'react'

type CopyState = { id: string; ok: boolean } | null

/** Copies text and remembers which item was copied for a moment. */
export function useCopy(resetAfterMs = 2000) {
  const [state, setState] = useState<CopyState>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(
    async (id: string, text: string) => {
      let ok = true
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        ok = false
      }
      setState({ id, ok })
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setState(null), resetAfterMs)
      return ok
    },
    [resetAfterMs],
  )

  return { copied: state, copy }
}
