import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { Kesik } from './Kesik'
import { Katman } from './Paper'

/**
 * Madde 16: kaydırma ilerlemesini `--dp` (0…1) olarak elemana yazar. Katmanlar bunu kendi genliğiyle çarpar,
 * yani her kâğıt farklı hızda hareket eder. Hareket kapalıysa ilerleme 0'da kalır.
 * mod 'ust': sayfa başındayken 0, eleman ekrandan çıkarken 1. mod 'gecis': ekrana girerken 0, çıkarken 1.
 */
export function useParalaks<T extends HTMLElement>(mod: 'ust' | 'gecis', aktif: boolean) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!aktif) {
      el.style.setProperty('--dp', '0')
      return
    }
    let raf = 0
    const hesap = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = mod === 'ust' ? -r.top / r.height : (vh - r.top) / (vh + r.height)
      el.style.setProperty('--dp', Math.max(0, Math.min(1, p)).toFixed(4))
    }
    const f = () => {
      if (!raf) raf = requestAnimationFrame(hesap)
    }
    hesap()
    window.addEventListener('scroll', f, { passive: true })
    window.addEventListener('resize', f)
    return () => {
      window.removeEventListener('scroll', f)
      window.removeEventListener('resize', f)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [aktif, mod])
  return ref
}

/** Bir simgeyi kendi hızında kaydıran sarmalayıcı (güneş, bulut, ağaç) */
export function Paralaks({ ax = 0, ay = 0, className, style, children }: { ax?: number; ay?: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={cx('paralaks !right-auto', className)} style={{ ['--ax' as string]: ax, ['--ay' as string]: ay, ...style } as CSSProperties}>
      {children}
    </div>
  )
}

/** Katman tanımı: oncelik küçük olan önce tutulur; etkin derinlik kadar katman çizilir */
export interface SahneKatman {
  ad: string
  oncelik: number
}
export const KATMANLAR: SahneKatman[] = [
  { ad: 'gökyüzü', oncelik: 0 },
  { ad: 'ön plan', oncelik: 1 },
  { ad: 'dağlar', oncelik: 2 },
  { ad: 'tepeler', oncelik: 3 },
  { ad: 'bulutlar', oncelik: 4 },
]
export const goster = (d: number, oncelik: number) => oncelik < d

/**
 * Diyorama: gökyüzü (yüzey) + bulut, dağ, tepe, ön plan katmanları. Katman sayısı `derinlik` ile kırpılır
 * (Madde 17: dar ekranda flattening). Her katman farklı genlikle kayar (Madde 16).
 */
export function Sahne({ derinlik, hiz = 1, kucuk }: { derinlik: number; hiz?: number; kucuk?: boolean }) {
  const k = kucuk ? 0.55 : 1
  return (
    <>
      {goster(derinlik, 4) ? (
        <>
          <Paralaks ax={60 * hiz} ay={70 * hiz} style={{ left: '4%', top: '9%', zIndex: 2 }}>
            <Kesik ad="bulut" boyut={150 * k} nivel={2} />
          </Paralaks>
          <Paralaks ax={-40 * hiz} ay={90 * hiz} style={{ left: '48%', top: '4%', zIndex: 2 }}>
            <Kesik ad="bulut" boyut={110 * k} nivel={2} />
          </Paralaks>
        </>
      ) : null}
      <Paralaks ax={0} ay={40 * hiz} style={{ left: '74%', top: '10%', zIndex: 1 }}>
        <Kesik ad="gunes" boyut={140 * k} nivel={3} className="yuz" />
      </Paralaks>
      {goster(derinlik, 2) ? (
        <>
          <Katman z={3} nivel={2} renk="var(--leylak)" sekil="dag" tohum={4} ust={22} ay={54 * hiz} taban={0.36} genlik={0.3} n={4} />
          <Katman z={4} nivel={3} renk="var(--turkuaz)" sekil="dag" tohum={9} ust={34} ay={38 * hiz} taban={0.4} genlik={0.26} n={5} />
        </>
      ) : null}
      {goster(derinlik, 3) ? (
        <Katman z={5} nivel={3} renk="var(--yaprak)" sekil="dalga" tohum={6} ust={48} ay={22 * hiz} taban={0.22} genlik={0.16} n={5}>
          {[
            [6, 4, 92],
            [19, 9, 70],
            [63, 6, 100],
            [80, 11, 76],
            [92, 3, 84],
          ].map(([x, y, b]) => (
            <Kesik key={x} ad="agac" boyut={b * k} nivel={2} className="absolute" style={{ left: `${x}%`, top: `${y}%` }} />
          ))}
        </Katman>
      ) : null}
      {goster(derinlik, 1) ? (
        <Katman
          z={6}
          nivel={4}
          renk="var(--kraft-d)"
          sekil="dalga"
          tohum={12}
          ust={70}
          ay={0}
          taban={0.2}
          genlik={0.14}
          n={6}
          delikler={[
            { x: 0.2, y: 0.62, r: 26 * k },
            { x: 0.52, y: 0.72, r: 18 * k },
            { x: 0.86, y: 0.6, r: 30 * k },
          ]}
        />
      ) : null}
    </>
  )
}
