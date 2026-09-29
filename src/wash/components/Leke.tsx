import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { useWash } from '../lib/store'
import { leke } from '../lib/firca'
import type { Pigment } from '../lib/simge'

export const PIGMENT: Record<Pigment, string> = {
  ultramarin: 'var(--ultramarin)',
  yesil: 'var(--yesil)',
  gul: 'var(--gul)',
  ocre: 'var(--ocre)',
  murekkep: 'var(--murekkep)',
  kagit: 'var(--sayfa)',
}
export const PIGMENT_AD: Record<'ultramarin' | 'yesil' | 'gul' | 'ocre', string> = { ultramarin: 'Ultramarin', yesil: 'Sap Yeşili', gul: 'Gül Kökü', ocre: 'Sarı Ocre' }

/** Elemanın piksel ölçüsü */
export function useSize<T extends Element>() {
  const ref = useRef<T>(null)
  const [s, set] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const oku = () => {
      const r = el.getBoundingClientRect()
      const w = Math.round(r.width)
      const h = Math.round(r.height)
      set((p) => (p.w === w && p.h === h ? p : { w, h }))
    }
    oku()
    const ro = new ResizeObserver(oku)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, s] as const
}

/** Ekrana girdi mi? Bir kez true olur (boya yalnız görününce yayılır) */
export function useGorunur<T extends Element>(esik = 0.15) {
  const ref = useRef<T>(null)
  const [g, setG] = useState(false)
  const { hareket } = useWash()
  useEffect(() => {
    const el = ref.current
    if (!el || g) return
    if (!hareket || typeof IntersectionObserver === 'undefined') {
      setG(true)
      return
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setG(true)
          io.disconnect()
        }
      },
      { threshold: esik },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [g, hareket, esik])
  return [ref, g] as const
}

export interface LekeTanim {
  renk: Pigment
  x: number // merkez, viewBox'ın yüzdesi
  y: number
  w: number // genişlik, viewBox yüzdesi
  h: number
  tohum: number
  op?: number
  dalga?: number
  gecikme?: number // yayılma gecikmesi (sn)
}

/**
 * Madde 14: <WatercolorBackground>. Arkaya yerleşen, çoğaltma kipli suluboya lekeleri.
 * viewBox 1000×600, `slice` ile alanı doldurur. Görününce yayılır (ink bleed) ve yavaşça kurur.
 * Metnin altına girmez: yalnız süs alanlarında kullanılır (aria-hidden, pointer-events yok).
 */
export function WatercolorBackground({ lekeler, className, sure = 3.2, vb = [1000, 600] as [number, number], gizle = false, filtre = 'wc-leke' }: { lekeler: LekeTanim[]; className?: string; sure?: number; vb?: [number, number]; gizle?: boolean; filtre?: string }) {
  const [ref, gorunur] = useGorunur<HTMLDivElement>()
  const [W, H] = vb
  const yollar = useMemo(() => lekeler.map((l) => ({ ...l, cw: (l.w / 100) * W, ch: (l.h / 100) * H })), [lekeler, W, H])
  return (
    <div ref={ref} className={cx('pointer-events-none absolute inset-0', gizle ? 'overflow-hidden' : 'overflow-visible', className)} aria-hidden="true" data-leke-katman="" data-gorunur={gorunur ? '' : undefined}>
      <svg className="leke-svg size-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" style={{ ['--yayil-sure' as string]: `${sure}s` } as CSSProperties}>
        {gorunur
          ? yollar.map((l, i) => (
              <g key={i} opacity={l.op ?? 1} transform={`translate(${(l.x / 100) * W - l.cw / 2} ${(l.y / 100) * H - l.ch / 2})`}>
                <g className="leke-g" data-yayil="" style={{ animationDelay: `${l.gecikme ?? i * 0.5}s, ${(l.gecikme ?? i * 0.5) + 3}s` }}>
                  <g filter={`url(#${filtre})`}>
                    <path d={leke(l.cw, l.ch, l.tohum, { dalga: l.dalga })} fill={PIGMENT[l.renk]} />
                  </g>
                </g>
              </g>
            ))
          : null}
      </svg>
    </div>
  )
}

/** Sarmalayıcı: çocuk içerik lekelerin ÜSTÜNDE ve kendi opak sayfasında durur */
export function LekeliAlan({ lekeler, children, className, gizle }: { lekeler: LekeTanim[]; children: ReactNode; className?: string; gizle?: boolean }) {
  return (
    <div className={cx('relative isolate', className)}>
      <WatercolorBackground lekeler={lekeler} gizle={gizle} />
      <div className="relative">{children}</div>
    </div>
  )
}
