// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Composer } from './composer'
import { Channels } from './channels'

const writeText = vi.fn(() => Promise.resolve())

beforeEach(() => {
  localStorage.clear()
  Object.assign(navigator, { clipboard: { writeText } })
  writeText.mockClear()
})
afterEach(cleanup)

describe('Composer', () => {
  it('updates the preview, saves the draft and restores it', () => {
    const { unmount } = render(<Composer />)
    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Ada' } })
    fireEvent.click(screen.getByLabelText('Research'))
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Hello there friend' },
    })

    expect(screen.getByText('Research · from Ada')).toBeTruthy()
    expect(screen.getByText('Hello there friend', { selector: 'figure p' })).toBeTruthy()
    expect(screen.getByText('3 words')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('contact-draft')!).message).toBe(
      'Hello there friend',
    )

    unmount()
    render(<Composer />)
    expect((screen.getByLabelText('Message') as HTMLTextAreaElement).value).toBe(
      'Hello there friend',
    )
  })

  it('asks for a message before sending', () => {
    render(<Composer />)
    fireEvent.click(screen.getByText('Open in my mail app'))
    expect(screen.getByText('Write a message first.')).toBeTruthy()
  })

  it('copies the full message', async () => {
    render(<Composer />)
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hi!' } })
    await act(async () => {
      fireEvent.click(screen.getByText('Copy message'))
    })
    expect(writeText).toHaveBeenCalledWith(
      'To: hello@tolamise.com\nSubject: Just saying hi\n\nHi Joshua,\n\nHi!',
    )
    expect(screen.getByText('Copied')).toBeTruthy()
  })

  it('clears the draft', () => {
    render(<Composer />)
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'x' } })
    fireEvent.click(screen.getByText('Clear'))
    expect((screen.getByLabelText('Message') as HTMLTextAreaElement).value).toBe('')
    expect(localStorage.getItem('contact-draft')).toBeNull()
  })
})

describe('Channels', () => {
  it('copies the email on E and opens profiles on G/L/X', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<Channels />)

    await act(async () => {
      fireEvent.keyDown(window, { key: 'e' })
    })
    expect(writeText).toHaveBeenCalledWith('hello@tolamise.com')
    expect(screen.getByText(/Copied to clipboard/)).toBeTruthy()

    fireEvent.keyDown(window, { key: 'G' })
    fireEvent.keyDown(window, { key: 'x' })
    expect(open.mock.calls.map((c) => c[0])).toEqual([
      'https://github.com/odelolajosh',
      'https://x.com/odelolajosh',
    ])
  })

  it('ignores shortcuts while typing or with modifiers', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(
      <>
        <input aria-label="field" />
        <Channels />
      </>,
    )
    fireEvent.keyDown(screen.getByLabelText('field'), { key: 'g' })
    fireEvent.keyDown(window, { key: 'l', metaKey: true })
    expect(open).not.toHaveBeenCalled()
  })
})
