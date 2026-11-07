import { describe, expect, it } from 'vitest'
import { compose } from './composer'

const draft = {
  topic: 'Collaboration' as const,
  name: '',
  subject: '',
  message: 'Want to build something?',
}

describe('compose', () => {
  it('uses the topic as the subject, adding the name when given', () => {
    expect(compose(draft).subject).toBe('Collaboration')
    expect(compose({ ...draft, name: ' Ada ' }).subject).toBe(
      'Collaboration · from Ada',
    )
  })

  it('prefers a custom subject', () => {
    expect(compose({ ...draft, subject: 'Hello' }).subject).toBe('Hello')
  })

  it('greets, includes the message and signs off with the name', () => {
    expect(compose({ ...draft, name: 'Ada' }).body).toBe(
      'Hi Joshua,\n\nWant to build something?\n\nAda',
    )
  })

  it('encodes the mailto link so the message survives intact', () => {
    const { mailto } = compose({ ...draft, message: 'a & b?\n#1 = 100%' })
    expect(mailto.startsWith('mailto:hello@tolamise.com?subject=Collaboration&body=')).toBe(true)
    const body = new URL(mailto).searchParams.get('body')
    expect(body).toBe('Hi Joshua,\n\na & b?\n#1 = 100%')
  })
})
