// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { WarpGrid } from './warp-grid'

let reducedMotion = false
let rafQueue: Array<FrameRequestCallback> = []
let now = 0

const flushFrames = (count: number) => {
  for (let i = 0; i < count; i++) {
    now += 16
    const queue = rafQueue
    rafQueue = []
    queue.forEach((cb) => cb(now))
  }
}

beforeEach(() => {
  reducedMotion = false
  rafQueue = []
  now = 0
  vi.spyOn(performance, 'now').mockImplementation(() => now)
  window.matchMedia = ((q: string) => ({
    matches: q.includes('reduce') && reducedMotion,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia
  window.requestAnimationFrame = (cb) => rafQueue.push(cb)
  window.cancelAnimationFrame = () => {}
  window.ResizeObserver = class {
    observe() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

/** Renders the grid on a 400×200 host and records every drawn point. */
function setup() {
  let points: Array<[number, number]> = []
  const ctx = {
    setTransform() {},
    clearRect() {},
    beginPath: () => (points = []),
    moveTo: (x: number, y: number) => points.push([x, y]),
    lineTo: (x: number, y: number) => points.push([x, y]),
    stroke() {},
    strokeStyle: '',
    globalAlpha: 1,
    lineWidth: 1,
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D,
  )
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 0, top: 0, width: 400, height: 200, right: 400, bottom: 200, x: 0, y: 0,
    toJSON() {},
  })
  const { container } = render(
    <div>
      <WarpGrid />
      <a href="/x">link</a>
    </div>,
  )
  const host = container.firstElementChild as HTMLElement
  // Horizontal lines are drawn first, row by row: 21 columns × 11 rows
  const cols = 21
  const at = (c: number, r: number) => {
    const [x, y] = points[r * cols + c]
    return { dx: x - (c * 20 + 0.5), dy: y - (r * 20 + 0.5) }
  }
  const maxOffset = () =>
    Math.max(...points.map(([x, y], i) => {
      const half = 21 * 11
      const j = i % half
      const [c, r] = i < half ? [j % 21, Math.floor(j / 21)] : [Math.floor(j / 11), j % 11]
      return Math.hypot(x - (c * 20 + 0.5), y - (r * 20 + 0.5))
    }))
  return { host, ctx, at, maxOffset, points: () => points }
}

const move = (host: Element, x: number, y: number) =>
  host.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: x, clientY: y }))

/** Sweeps the cursor right along y=100 at `speed` px per 16ms frame. */
function sweep(host: Element, speed: number, frames = 6) {
  let x = 120
  move(host, x, 100)
  for (let i = 0; i < frames; i++) {
    x += speed
    now += 16
    move(host, x, 100)
    flushFrames(1)
  }
  return x
}

describe('WarpGrid', () => {
  it('draws the grid at rest, exactly on the CSS grid lines', () => {
    const { maxOffset, points } = setup()
    expect(points()[0]).toEqual([0.5, 0.5])
    expect(maxOffset()).toBe(0)
  })

  it('drags lines along the direction the cursor moves', () => {
    const { host, at } = setup()
    const x = sweep(host, 8)
    const near = at(Math.round(x / 20), 5)
    expect(near.dx).toBeGreaterThan(1) // pulled right, with the motion
  })

  it('warps more when the cursor moves faster', () => {
    const slow = setup()
    sweep(slow.host, 3)
    const slowWarp = slow.maxOffset()
    cleanup()
    rafQueue = []
    const fast = setup()
    sweep(fast.host, 15)
    expect(fast.maxOffset()).toBeGreaterThan(slowWarp * 2)
  })

  it('keeps animating when the first frame is timestamped before the wake', () => {
    // Real browsers pass rAF the frame's start time, often earlier than
    // the performance.now() read when the cursor moved
    const { host, maxOffset } = setup()
    let x = 120
    move(host, x, 100)
    for (let i = 0; i < 6; i++) {
      x += 10
      now += 16
      move(host, x, 100)
      const queue = rafQueue
      rafQueue = []
      queue.forEach((cb) => cb(now - 8))
    }
    flushFrames(2)
    expect(maxOffset()).toBeGreaterThan(1)
  })

  it('springs back to rest and stops animating', () => {
    const { host, maxOffset } = setup()
    sweep(host, 12)
    expect(maxOffset()).toBeGreaterThan(1)
    flushFrames(300) // ~5s
    expect(maxOffset()).toBe(0)
    expect(rafQueue).toHaveLength(0)
  })

  it('never stretches a point beyond the limit', () => {
    const { host, maxOffset } = setup()
    sweep(host, 60, 4) // a violent flick
    expect(maxOffset()).toBeLessThanOrEqual(42.01)
  })

  it('pushes points outward on click, but not on a link', () => {
    const { host, at, maxOffset } = setup()
    host.querySelector('a')!.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 200, clientY: 100 }))
    flushFrames(3)
    expect(maxOffset()).toBe(0)

    host.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 200, clientY: 100 }))
    flushFrames(4)
    expect(at(12, 5).dx).toBeGreaterThan(0.5) // right of the click moves right
    expect(at(8, 5).dx).toBeLessThan(-0.5) // left of it moves left
  })

  it('leaves the CSS grid alone with reduced motion', () => {
    reducedMotion = true
    const { container } = render(<WarpGrid />)
    expect(container.querySelector('.bg-grid')!.classList.contains('invisible')).toBe(false)
  })
})
