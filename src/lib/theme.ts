import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import * as z from 'zod'

const postThemeValidator = z.union([
  z.literal('light'),
  z.literal('dark'),
  z.literal('system'),
])
export type T = z.infer<typeof postThemeValidator>
const storageKey = '_preferred-theme'

export const getThemeServerFn = createServerFn().handler(async () => {
  const parsed = postThemeValidator.safeParse(getCookie(storageKey))
  return parsed.success ? parsed.data : 'system'
})

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .validator(postThemeValidator)
  .handler(async ({ data }) =>
    setCookie(storageKey, data, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    }),
  )
