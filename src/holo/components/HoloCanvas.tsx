import { useCallback, useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { cx } from '../../shared/cx'
import { readPalette, render, type Mesh, type Palette } from '../lib/geo3d'
import { useInView } from '../hooks/useInView'
import { useHolo } from '../lib/store'

/**
 * 3B kanvas: yavaşça dönen uzay nesnesi (Madde 16). Ekran dışında, "Hareket kapalı"da ya da
 * `playing` false iken döngü durur ve tek kare çizilir. Etkileşimliyse sürükleyerek ve ok tuşlarıyla döner.
 */
export function HoloCanvas({
  mesh,
  playing = true,
  speed = 0.16,
  zoom = 1,
  interactive,
  className,
  label,
  describedBy,
  onZoom,
}: {
  mesh: Mesh
  playing?: boolean
  /** radyan / saniye */
  speed?: number
  zoom?: number
  interactive?: boolean
  className?: string
  label?: string
  describedBy?: string
  onZoom?: (delta: number) => void
}) {
  const { motion, theme } = useHolo()
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const rot = useRef({ yaw: 0.7, pitch: -0.32 })
  const pal = useRef<Palette | null>(null)
  const size = useRef({ w: 0, h: 0 })
  const drag = useRef<{ x: number; y: number } | null>(null)
  const visible = useInView(wrap)
  const zoomRef = useRef(zoom)

  const draw = useCallback(() => {
    const c = canvas.current
    if (!c || !size.current.w) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (!pal.current && wrap.current) pal.current = readPalette(wrap.current)
    render(ctx, mesh, size.current.w, size.current.h, { ...rot.current, zoom: zoomRef.current }, pal.current!)
  }, [mesh])

  // Boyut ve piksel yoğunluğu
  useEffect(() => {
    const el = wrap.current
    const c = canvas.current
    if (!el || !c) return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      c.width = Math.round(width * dpr)
      c.height = Math.round(height * dpr)
      size.current = { w: width, h: height }
      draw()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [draw])

  // Tema değişince renkleri yeniden oku
  useEffect(() => {
    pal.current = null
    draw()
  }, [theme, draw])

  useEffect(() => {
    zoomRef.current = zoom
    draw()
  }, [zoom, draw])

  // Döngü
  const running = playing && motion === 'acik' && visible
  useEffect(() => {
    if (!running) {
      draw()
      return
    }
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!drag.current) rot.current.yaw += speed * dt
      draw()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, speed, draw])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    rot.current.yaw += (e.clientX - drag.current.x) * 0.01
    rot.current.pitch = Math.max(-1.3, Math.min(1.3, rot.current.pitch + (e.clientY - drag.current.y) * 0.01))
    drag.current = { x: e.clientX, y: e.clientY }
    if (!running) draw()
  }
  const onPointerUp = () => {
    drag.current = null
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 0.15
    if (e.key === 'ArrowLeft') rot.current.yaw -= step
    else if (e.key === 'ArrowRight') rot.current.yaw += step
    else if (e.key === 'ArrowUp') rot.current.pitch = Math.max(-1.3, rot.current.pitch - step)
    else if (e.key === 'ArrowDown') rot.current.pitch = Math.min(1.3, rot.current.pitch + step)
    else if (e.key === '+' || e.key === '=') onZoom?.(0.1)
    else if (e.key === '-') onZoom?.(-0.1)
    else return
    e.preventDefault()
    draw()
  }

  return (
    <div
      ref={wrap}
      className={cx(!/\b(absolute|fixed)\b/.test(className ?? '') && 'relative', interactive && 'cursor-grab touch-none rounded-2xl active:cursor-grabbing', className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={interactive ? onKeyDown : undefined}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'group' : undefined}
      aria-roledescription={interactive ? '3B görüntüleyici' : undefined}
      aria-label={interactive ? label : undefined}
      aria-describedby={interactive ? describedBy : undefined}
      aria-hidden={interactive ? undefined : true}
    >
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
