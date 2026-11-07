import { describe, expect, it } from 'vitest'
import { renderMarkdown } from './markdown'
import { formatDate } from './utils'

describe('renderMarkdown', () => {
  it('highlights code with both themes', async () => {
    const { html } = await renderMarkdown('```go\nfunc main() {}\n```')
    expect(html).toContain('class="shiki')
    expect(html).toContain('--shiki-dark')
  })

  it('falls back to plain text for unknown languages', async () => {
    const { html } = await renderMarkdown('```notalang\nhello\n```')
    expect(html).toContain('hello')
  })

  it('reports whether there is math', async () => {
    expect((await renderMarkdown('$y = w^T X + b$')).hasMath).toBe(true)
    expect((await renderMarkdown('No math, just $5.')).hasMath).toBe(false)
  })

  it('lists h2 sections with ids for the table of contents', async () => {
    const { html, toc } = await renderMarkdown(
      '## The problem\n\ntext\n\n### Detail\n\n## How it works',
    )
    expect(toc).toEqual([
      { id: 'the-problem', text: 'The problem' },
      { id: 'how-it-works', text: 'How it works' },
    ])
    expect(html).toContain('<h2 id="the-problem">')
  })

  it('renders GFM tables', async () => {
    const { html } = await renderMarkdown('| a | b |\n| - | - |\n| 1 | 2 |')
    expect(html).toContain('<table>')
  })
})

describe('formatDate', () => {
  it('keeps the calendar day of a YYYY-MM-DD date', () => {
    expect(formatDate('2025-11-09')).toBe('Nov 9, 2025')
  })
})
