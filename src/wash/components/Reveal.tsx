import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { useWash } from '../lib/store'
import { leke } from '../lib/firca'
import { useGorunur, useSize } from './Leke'

/**
 * Madde 11 · 16: <Reveal>. İçerik, tıklanan noktadan sıvı gibi yayılan bir maskeyle açılır.
 * Maske: üç daire (biri ana, ikisi uydu) + kenarı gürültüyle bozan `wc-sizinti` filtresi; r CSS geçişiyle uzar.
 * Açılış bitince maske kaldırılır (odak halkası ve içerik kırpılmasın). Hareket kapalıysa doğrudan açık.
 */
export function Reveal({ acik, kaynak = [0.5, 0.5], sure = 2.6, children, className, style, onBitti }: { acik: boolean; kaynak?: [number, number]; sure?: number; children: ReactNode; className?: string; style?: CSSProperties; onBitti?: () => void }) {
  const { hareket } = useWash()
  const id = useId().replace(/:/g, '')
  const [ref, { w, h }] = useSize<HTMLDivElement>()
  const [bitti, setBitti] = useState(false)
  const onceki = useRef(acik)
  const R = Math.hypot(w, h) * 1.05
  useEffect(() => {
    if (onceki.current !== acik) {
      onceki.current = acik
      setBitti(false)
    }
    if (!acik || !hareket) return
    const t = window.setTimeout(
      () => {
        setBitti(true)
        onBitti?.()
      },
      sure * 1000 + 200,
    )
    return () => window.clearTimeout(t)
  }, [acik, hareket, sure, onBitti])
  const maskeli = hareket && !(acik && bitti) && w > 0
  const [kx, ky] = [kaynak[0] * w, kaynak[1] * h]
  const gecis = `r ${sure}s cubic-bezier(0.25, 0.6, 0.25, 1)`
  return (
    <div ref={ref} className={cx('relative', className)} data-reveal={acik ? 'acik' : 'kapali'} data-reveal-maske={maskeli ? '' : undefined} style={{ ...style, ...(maskeli ? { maskImage: `url(#${id})`, WebkitMaskImage: `url(#${id})` } : { visibility: acik || !hareket ? 'visible' : 'hidden' }) }}>
      {maskeli ? (
        <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
          <defs>
            <mask id={id} maskUnits="userSpaceOnUse" x={-w * 0.2} y={-h * 0.2} width={w * 1.4} height={h * 1.4}>
              <g filter="url(#wc-sizinti)">
                <circle cx={kx} cy={ky} fill="#fff" style={{ r: acik ? R : 0, transition: gecis }} />
                <circle cx={kx + w * 0.12} cy={ky - h * 0.1} fill="#fff" style={{ r: acik ? R * 0.9 : 0, transition: `r ${sure * 0.85}s cubic-bezier(0.25, 0.6, 0.25, 1) 0.15s` }} />
                <circle cx={kx - w * 0.15} cy={ky + h * 0.12} fill="#fff" style={{ r: acik ? R * 0.85 : 0, transition: `r ${sure * 0.92}s cubic-bezier(0.25, 0.6, 0.25, 1) 0.3s` }} />
              </g>
            </mask>
          </defs>
        </svg>
      ) : null}
      {children}
    </div>
  )
}

/** Fırçayla kesilmiş kenarlı görsel: içerik, organik lekeye maskelenir (SVG maskeli resim, Madde 14) */
export function MaskeliResim({ children, tohum = 4, dalga = 0.1, className, style, etiket }: { children: ReactNode; tohum?: number; dalga?: number; className?: string; style?: CSSProperties; etiket?: string }) {
  const id = useId().replace(/:/g, '')
  const [ref, { w, h }] = useSize<HTMLDivElement>()
  const yol = useMemo(() => (w > 20 ? leke(w, h, tohum, { dalga, n: 10 }) : ''), [w, h, tohum, dalga])
  return (
    <div ref={ref} className={cx('relative', className)} style={{ ...style, ...(yol ? { maskImage: `url(#${id})`, WebkitMaskImage: `url(#${id})` } : {}) }} role={etiket ? 'img' : undefined} aria-label={etiket} data-maskeli="">
      {yol ? (
        <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
          <defs>
            <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
              <g filter="url(#wc-maske-kenar)">
                <path d={yol} fill="#fff" transform={`translate(${w * 0.02} ${h * 0.02}) scale(0.96)`} />
              </g>
            </mask>
          </defs>
        </svg>
      ) : null}
      {children}
    </div>
  )
}

/** Görününce açılan Reveal: kaydırırken sayfa parçalarını boyanır gibi ortaya çıkarır */
export function GorununceAc({ children, className, kaynak, sure }: { children: ReactNode; className?: string; kaynak?: [number, number]; sure?: number }) {
  const [ref, g] = useGorunur<HTMLDivElement>(0.2)
  return (
    <div ref={ref} className={className}>
      <Reveal acik={g} kaynak={kaynak} sure={sure}>
        {children}
      </Reveal>
    </div>
  )
}
