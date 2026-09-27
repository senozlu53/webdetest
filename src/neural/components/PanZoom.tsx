import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { useNeural } from '../lib/store'
import { IconFit, IconMinus, IconPlus } from './Icons'
import { cx } from '../../shared/cx'

export interface PanZoomHandle {
  fit: () => void
  /** İçerik koordinatında bir noktayı ortala; k: sığdırma ölçeğinin katı */
  focus: (x: number, y: number, rel?: number) => void
}
interface T {
  k: number
  x: number
  y: number
}

/**
 * Madde 17: karmaşık ağ grafikleri kaydırılıp yakınlaştırılabilen bir alana dönüşür.
 * Tek parmak / fare sürükleme kaydırır, iki parmak ya da Ctrl + tekerlek yakınlaştırır.
 * Klavye: odaktayken oklar kaydırır, + ve − yakınlaştırır, 0 sığdırır.
 * Sayfa kaydırmasını çalmamak için düz tekerlek yakınlaştırmaz, yalnız ipucu gösterir.
 */
export const PanZoom = forwardRef<PanZoomHandle, { cw: number; ch: number; height: string; label: string; children: (k: number) => ReactNode; onTap?: (x: number, y: number, k: number) => void; className?: string; toolbar?: ReactNode; maxRel?: number; initial?: { x: number; y: number; rel: number } }>(function PanZoom({ cw, ch, height, label, children, onTap, className, toolbar, maxRel = 8, initial }, ref) {
  const { motion } = useNeural()
  const box = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [t, setT] = useState<T>({ k: 1, x: 0, y: 0 })
  const tr = useRef(t)
  tr.current = t
  const touched = useRef(false)
  const pts = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<{ x: number; y: number; time: number; moved: number } | null>(null)
  const anim = useRef(0)
  const [hint, setHint] = useState(false)
  const hid = useId()
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  const fitK = size.w && size.h ? Math.min(size.w / cw, size.h / ch) * 0.94 : 1
  const fitT = useCallback((): T => ({ k: fitK, x: (size.w - cw * fitK) / 2, y: (size.h - ch * fitK) / 2 }), [fitK, size, cw, ch])
  const clampK = useCallback((k: number) => Math.min(fitK * maxRel, Math.max(fitK * 0.7, k)), [fitK, maxRel])

  const animateTo = useCallback(
    (to: T) => {
      cancelAnimationFrame(anim.current)
      if (!motion) return setT(to)
      const from = tr.current
      const t0 = performance.now()
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / 420)
        const e = 1 - Math.pow(1 - p, 3)
        setT({ k: from.k + (to.k - from.k) * e, x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e })
        if (p < 1) anim.current = requestAnimationFrame(step)
      }
      anim.current = requestAnimationFrame(step)
    },
    [motion],
  )

  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  // Başlangıç görünümü: dar ekranda okunur bir ölçekten başlanabilir. Kullanıcı dokunmadıysa boyut değişince yenilenir
  const ix = initial?.x
  const iy = initial?.y
  const irel = initial?.rel
  useEffect(() => {
    if (!size.w || touched.current) return
    if (ix === undefined || iy === undefined || !irel) return setT(fitT())
    const k = fitK * irel
    setT({ k, x: size.w / 2 - ix * k, y: size.h / 2 - iy * k })
  }, [size, fitT, fitK, ix, iy, irel])

  const zoomAt = useCallback(
    (px: number, py: number, f: number, animate = false) => {
      const c = tr.current
      const k = clampK(c.k * f)
      const next = { k, x: px - (px - c.x) * (k / c.k), y: py - (py - c.y) * (k / c.k) }
      touched.current = true
      if (animate) animateTo(next)
      else setT(next)
    },
    [clampK, animateTo],
  )

  useImperativeHandle(
    ref,
    () => ({
      fit: () => {
        touched.current = false
        animateTo(fitT())
      },
      focus: (x, y, rel = 2.6) => {
        touched.current = true
        const k = clampK(fitK * rel)
        animateTo({ k, x: size.w / 2 - x * k, y: size.h / 2 - y * k })
      },
    }),
    [animateTo, fitT, clampK, fitK, size],
  )

  // Tekerlek: yalnız Ctrl / ⌘ ile (trackpad kıstırma da ctrlKey gönderir)
  useEffect(() => {
    const el = svg.current
    if (!el) return
    let timer = 0
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const b = el.getBoundingClientRect()
        zoomAt(e.clientX - b.left, e.clientY - b.top, Math.exp(-e.deltaY * 0.0024))
      } else {
        setHint(true)
        window.clearTimeout(timer)
        timer = window.setTimeout(() => setHint(false), 1400)
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      window.clearTimeout(timer)
    }
  }, [zoomAt])

  const local = (e: PointerEvent) => {
    const b = svg.current!.getBoundingClientRect()
    return { x: e.clientX - b.left, y: e.clientY - b.top }
  }
  const down = (e: PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return
    cancelAnimationFrame(anim.current)
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = local(e)
    pts.current.set(e.pointerId, p)
    gesture.current = pts.current.size === 1 ? { ...p, time: performance.now(), moved: 0 } : null
  }
  const move = (e: PointerEvent<SVGSVGElement>) => {
    const prev = pts.current.get(e.pointerId)
    if (!prev) return
    const p = local(e)
    const all = [...pts.current.entries()]
    if (all.length === 1) {
      const dx = p.x - prev.x
      const dy = p.y - prev.y
      if (gesture.current) gesture.current.moved += Math.abs(dx) + Math.abs(dy)
      if (!gesture.current || gesture.current.moved > 4) {
        touched.current = true
        setT((c) => ({ ...c, x: c.x + dx, y: c.y + dy }))
      }
    } else if (all.length === 2) {
      const other = all.find(([id]) => id !== e.pointerId)![1]
      const d0 = Math.hypot(prev.x - other.x, prev.y - other.y)
      const d1 = Math.hypot(p.x - other.x, p.y - other.y)
      const mx = (p.x + other.x) / 2
      const my = (p.y + other.y) / 2
      const pmx = (prev.x + other.x) / 2
      const pmy = (prev.y + other.y) / 2
      touched.current = true
      setT((c) => {
        const k = clampK(c.k * (d0 ? d1 / d0 : 1))
        return { k, x: mx - (pmx - c.x) * (k / c.k), y: my - (pmy - c.y) * (k / c.k) }
      })
    }
    pts.current.set(e.pointerId, p)
  }
  const up = (e: PointerEvent<SVGSVGElement>) => {
    const g = gesture.current
    pts.current.delete(e.pointerId)
    if (g && onTap && g.moved <= 6 && performance.now() - g.time < 600 && e.type === 'pointerup') {
      const p = local(e)
      const c = tr.current
      onTap((p.x - c.x) / c.k, (p.y - c.y) / c.k, c.k)
    }
    gesture.current = null
  }

  const key = (e: KeyboardEvent) => {
    const step = 48
    const c = { x: size.w / 2, y: size.h / 2 }
    const map: Record<string, () => void> = {
      ArrowLeft: () => setT((v) => ({ ...v, x: v.x + step })),
      ArrowRight: () => setT((v) => ({ ...v, x: v.x - step })),
      ArrowUp: () => setT((v) => ({ ...v, y: v.y + step })),
      ArrowDown: () => setT((v) => ({ ...v, y: v.y - step })),
      '+': () => zoomAt(c.x, c.y, 1.25, true),
      '=': () => zoomAt(c.x, c.y, 1.25, true),
      '-': () => zoomAt(c.x, c.y, 0.8, true),
      '0': () => {
        touched.current = false
        animateTo(fitT())
      },
    }
    const f = map[e.key]
    if (f) {
      e.preventDefault()
      touched.current = true
      f()
    }
  }

  const rel = fitK ? t.k / fitK : 1
  return (
    <div className={cx('relative min-w-0', className)}>
      <div ref={box} className="relative overflow-hidden rounded-xl border border-line bg-bg/70" style={{ height }}>
        <svg
          ref={svg}
          className="pan-surface block size-full"
          role="group"
          aria-roledescription="kaydırılabilir harita"
          aria-label={label}
          aria-describedby={hid}
          tabIndex={0}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onKeyDown={key}
        >
          <g transform={`translate(${t.x} ${t.y}) scale(${t.k})`}>{children(t.k)}</g>
        </svg>
        <div className={cx('pointer-events-none absolute inset-x-0 top-3 flex justify-center transition-opacity duration-300', hint ? 'opacity-100' : 'opacity-0')} aria-hidden="true">
          <span className="rounded-full border border-line-strong bg-panel-2/95 px-3 py-1 text-[13px] text-ink">Yakınlaştırmak için Ctrl + tekerlek</span>
        </div>
        <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
          <span className="rounded-md bg-bg/80 px-1.5 font-mono text-[11px] text-muted tabular-nums mono-tight" aria-hidden="true">
            %{Math.round(rel * 100)}
          </span>
          <button type="button" className="icon-btn" aria-label="Uzaklaştır" onClick={() => zoomAt(size.w / 2, size.h / 2, 0.8, true)} disabled={rel <= 0.71}>
            <IconMinus size={16} />
          </button>
          <button type="button" className="icon-btn" aria-label="Yakınlaştır" onClick={() => zoomAt(size.w / 2, size.h / 2, 1.25, true)} disabled={rel >= maxRel - 0.01}>
            <IconPlus size={16} />
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Sığdır"
            onClick={() => {
              touched.current = false
              animateTo(fitT())
            }}
          >
            <IconFit size={16} />
          </button>
        </div>
        {toolbar ? <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">{toolbar}</div> : null}
      </div>
      <p id={hid} className="mt-2 text-[13px] text-muted">
        {coarse ? 'Tek parmakla kaydırın, iki parmakla yakınlaştırın; bir noktaya dokunarak seçin.' : 'Sürükleyerek kaydırın, Ctrl + tekerlek ya da düğmelerle yakınlaştırın. Odaktayken oklar kaydırır, + ve − yakınlaştırır, 0 sığdırır.'}
      </p>
    </div>
  )
})
