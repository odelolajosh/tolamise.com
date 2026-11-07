import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const CELL = 20 // Same spacing as `bg-grid`
const RADIUS = 90 // px; how far the cursor's pull reaches
const STIFFNESS = 60 // pull of each point back to rest
const DAMPING = 7 // lower = more wobble
const COUPLING = 30 // pull between neighbouring points, so warps spread
const DRAG = 2.4 // how much the cursor's velocity drags points along
const PUSH = 1.6 // how much speed pushes points away from the cursor
const MAX_OFFSET = 42 // px
const CLICK_IMPULSE = 900 // px/s outward kick on click
const STEP = 1 / 120 // fixed physics step, in seconds

const isInteractive = (target: EventTarget | null) =>
  target instanceof Element && target.closest('a, button, input, textarea, label')

/**
 * The homepage grid as a spring mesh. Moving the cursor drags and pushes the
 * lines around it, harder the faster it moves; they wobble back when it stops.
 * Falls back to the plain CSS grid until it's running, or with reduced motion.
 */
export function WarpGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !host || !ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let width = 0
    let height = 0
    let dpr = 1
    let cols = 0 // vertical lines
    let rows = 0 // horizontal lines
    // Offsets from rest and velocities, one entry per grid intersection
    let ox = new Float32Array(0)
    let oy = new Float32Array(0)
    let vx = new Float32Array(0)
    let vy = new Float32Array(0)

    const cursor = { x: 0, y: 0, vx: 0, vy: 0, inside: false, lastMove: 0 }
    let frame = 0
    let lastFrame = 0
    let carry = 0
    let color = ''

    const readColor = () => {
      // Matches bg-grid: the border colour at 50%, drawn with globalAlpha
      const value = getComputedStyle(canvas).borderTopColor
      const probe = '#010203'
      ctx.strokeStyle = probe
      ctx.strokeStyle = value
      color = ctx.strokeStyle === probe ? 'rgba(128,128,128,0.4)' : value
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      cols = Math.ceil(width / CELL) + 1
      rows = Math.ceil(height / CELL) + 1
      const n = cols * rows
      ox = new Float32Array(n)
      oy = new Float32Array(n)
      vx = new Float32Array(n)
      vy = new Float32Array(n)
      draw()
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = color
      ctx.globalAlpha = 0.5
      ctx.lineWidth = 1
      ctx.beginPath()
      // +0.5 puts a 1px line exactly on the pixel the CSS grid uses
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          const x = c * CELL + 0.5 + ox[i]
          const y = r * CELL + 0.5 + oy[i]
          if (c === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
      }
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const i = r * cols + c
          const x = c * CELL + 0.5 + ox[i]
          const y = r * CELL + 0.5 + oy[i]
          if (r === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    }

    /** Advances the mesh one step; returns how much is still moving. */
    const step = (dt: number) => {
      // The cursor's velocity dies away once it stops moving
      const decay = Math.exp(-dt * 12)
      cursor.vx *= decay
      cursor.vy *= decay
      const speed = Math.hypot(cursor.vx, cursor.vy)

      // Only points near the cursor feel it
      let c0 = 0
      let c1 = -1
      let r0 = 0
      let r1 = -1
      if (cursor.inside && speed > 1) {
        const reach = RADIUS * 3
        c0 = Math.max(0, Math.floor((cursor.x - reach) / CELL))
        c1 = Math.min(cols - 1, Math.ceil((cursor.x + reach) / CELL))
        r0 = Math.max(0, Math.floor((cursor.y - reach) / CELL))
        r1 = Math.min(rows - 1, Math.ceil((cursor.y + reach) / CELL))
      }

      let energy = 0
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          let ax = -STIFFNESS * ox[i] - DAMPING * vx[i]
          let ay = -STIFFNESS * oy[i] - DAMPING * vy[i]

          // Springs to neighbours (missing neighbours count as at rest)
          const left = c > 0 ? i - 1 : -1
          const right = c < cols - 1 ? i + 1 : -1
          const up = r > 0 ? i - cols : -1
          const down = r < rows - 1 ? i + cols : -1
          let sx = -4 * ox[i]
          let sy = -4 * oy[i]
          if (left >= 0) { sx += ox[left]; sy += oy[left] }
          if (right >= 0) { sx += ox[right]; sy += oy[right] }
          if (up >= 0) { sx += ox[up]; sy += oy[up] }
          if (down >= 0) { sx += ox[down]; sy += oy[down] }
          ax += COUPLING * sx
          ay += COUPLING * sy

          if (c >= c0 && c <= c1 && r >= r0 && r <= r1) {
            const dx = c * CELL + ox[i] - cursor.x
            const dy = r * CELL + oy[i] - cursor.y
            const d2 = dx * dx + dy * dy
            const falloff = Math.exp(-d2 / (2 * RADIUS * RADIUS))
            if (falloff > 0.01) {
              const d = Math.sqrt(d2) || 1
              ax += falloff * (cursor.vx * DRAG + (dx / d) * speed * PUSH)
              ay += falloff * (cursor.vy * DRAG + (dy / d) * speed * PUSH)
            }
          }

          vx[i] += ax * dt
          vy[i] += ay * dt
          ox[i] += vx[i] * dt
          oy[i] += vy[i] * dt

          const offset = Math.hypot(ox[i], oy[i])
          if (offset > MAX_OFFSET) {
            ox[i] *= MAX_OFFSET / offset
            oy[i] *= MAX_OFFSET / offset
          }
          energy = Math.max(energy, offset, Math.abs(vx[i]) * 0.05, Math.abs(vy[i]) * 0.05)
        }
      }
      return Math.max(energy, speed * 0.01)
    }

    const tick = (now: number) => {
      // rAF timestamps are the frame's start, which can be earlier than the
      // performance.now() taken in wake(); never let that go negative
      carry += Math.min(Math.max((now - lastFrame) / 1000, 0), 0.05)
      lastFrame = now
      let energy = 0
      let stepped = false
      while (carry >= STEP) {
        energy = step(STEP)
        carry -= STEP
        stepped = true
      }
      draw()
      // Only sleep once a step has actually run and found nothing moving
      if (stepped && energy < 0.02) {
        // Settled: snap to rest and sleep until the cursor moves again
        ox.fill(0)
        oy.fill(0)
        vx.fill(0)
        vy.fill(0)
        draw()
        frame = 0
        return
      }
      frame = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (frame) return
      lastFrame = performance.now()
      carry = 0
      frame = requestAnimationFrame(tick)
    }

    const local = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      const { x, y } = local(e)
      if (cursor.inside && cursor.lastMove) {
        const dt = Math.max((now - cursor.lastMove) / 1000, 1 / 240)
        // Smooth the velocity so jittery input doesn't spike the warp
        cursor.vx += ((x - cursor.x) / dt - cursor.vx) * 0.5
        cursor.vy += ((y - cursor.y) / dt - cursor.vy) * 0.5
      }
      cursor.x = x
      cursor.y = y
      cursor.inside = true
      cursor.lastMove = now
      wake()
    }

    const onLeave = () => {
      cursor.inside = false
      cursor.lastMove = 0
    }

    const onDown = (e: PointerEvent) => {
      if (isInteractive(e.target)) return
      const { x, y } = local(e)
      // Kick nearby points outward, like a pebble in water
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dx = c * CELL - x
          const dy = r * CELL - y
          const d = Math.hypot(dx, dy) || 1
          const falloff = Math.exp(-(d * d) / (2 * (RADIUS * 1.2) ** 2))
          if (falloff < 0.01) continue
          const i = r * cols + c
          vx[i] += (dx / d) * CLICK_IMPULSE * falloff
          vy[i] += (dy / d) * CLICK_IMPULSE * falloff
        }
      }
      wake()
    }

    // Redraw in the new colour when the theme changes
    const onTheme = () => {
      readColor()
      draw()
    }
    const themeObserver = new MutationObserver(onTheme)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    const scheme = window.matchMedia('(prefers-color-scheme: dark)')
    scheme.addEventListener('change', onTheme)

    readColor()
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    host.addEventListener('pointerdown', onDown)
    setActive(true)

    return () => {
      themeObserver.disconnect()
      scheme.removeEventListener('change', onTheme)
      resizeObserver.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      host.removeEventListener('pointerdown', onDown)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      {/* The CSS grid shows until the canvas takes over */}
      <div
        aria-hidden="true"
        className={cn('absolute inset-0 -z-10 bg-grid', active && 'invisible')}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full border-border"
      />
    </>
  )
}
