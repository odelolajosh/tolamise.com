import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  // Content dates are plain `YYYY-MM-DD`, which parse as UTC midnight.
  // Formatting in UTC keeps the day the same everywhere, server and client.
  timeZone: 'UTC',
})

export function formatDate(date: string) {
  return dateFormat.format(new Date(date))
}

export const siteTitle = (title?: string) =>
  title ? `${title} · Joshua Odelola` : 'Joshua Odelola'
