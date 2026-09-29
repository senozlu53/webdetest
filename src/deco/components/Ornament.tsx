import { useId } from 'react'
import { cx } from '../../shared/cx'
import { isinlar, yay } from '../lib/geo'
import { useGorunur } from './hooks'

/** Madde 6: yelpaze (güneş ışını). Alt orta noktadan yukarı doğru; uçlara doğru sönen ince altın ışınlar ve halkalar */
export function Sunburst({ n = 36, halka = 5, aci = 180, kisa = 0.78, className, ciz = false, acik, yavas = 2.4 }: { n?: number; halka?: number; aci?: number; kisa?: number; className?: string; ciz?: boolean; acik?: boolean; yavas?: number }) {
  const id = useId().replace(/:/g, '')
  const [ref, g] = useGorunur<SVGSVGElement>(0.1)
  const R = 470
  const r0 = 64
  const isin = isinlar(n, r0, R, R * kisa, aci)
  return (
    <svg ref={ref} viewBox="-500 -490 1000 510" preserveAspectRatio="xMidYMax meet" className={cx('w-full overflow-visible', className)} fill="none" aria-hidden="true" data-sunburst={n} data-halka={halka}>
      <defs>
        <radialGradient id={`${id}-r`} cx="0" cy="0" r="490" gradientUnits="userSpaceOnUse">
          <stop offset="0.12" stopColor="#fff" />
          <stop offset="0.72" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="-500" y="-490" width="1000" height="510">
          <rect x="-500" y="-490" width="1000" height="510" fill={`url(#${id}-r)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-m)`} stroke="var(--altin-cizgi)" style={{ strokeWidth: 'var(--kalin)' }}>
        {isin.map((d, i) => (
          <path
            key={i}
            d={d}
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray={ciz || acik !== undefined ? 1 : undefined}
            style={
              acik !== undefined
                ? { strokeDashoffset: acik ? 0 : 1, transition: `stroke-dashoffset ${yavas}s cubic-bezier(0.65,0,0.35,1) ${(Math.abs(i - n / 2) / (n / 2)) * (acik ? 0.9 : 0.1)}s` }
                : ciz && g
                  ? { animation: `cizgi-ciz ${yavas}s cubic-bezier(0.65,0,0.35,1) ${(Math.abs(i - n / 2) / (n / 2)) * 0.9}s both`, ['--uzunluk' as string]: 1 }
                  : ciz
                    ? { strokeDashoffset: 1 }
                    : undefined
            }
          />
        ))}
        {Array.from({ length: halka }, (_, i) => (
          <path key={`h${i}`} d={yay(r0 + ((R - r0) * (i + 1)) / (halka + 0.5), aci)} vectorEffect="non-scaling-stroke" strokeOpacity={0.7} />
        ))}
      </g>
      <path d={yay(r0 - 14, 180)} stroke="var(--altin-cizgi)" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 'var(--kalin)' }} />
      <path d={`M${-(r0 - 14)} 0H${r0 - 14}`} stroke="var(--altin-cizgi)" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 'var(--kalin)' }} />
    </svg>
  )
}

/** Basamaklı (ziggurat) tepe süsü: dikey eksende simetrik */
export function Ziggurat({ className, boy = 44 }: { className?: string; boy?: number }) {
  return (
    <svg viewBox="-64 -44 128 48" height={boy} className={cx('mx-auto w-auto overflow-visible text-altin-cizgi', className)} fill="none" stroke="currentColor" aria-hidden="true" data-ziggurat="">
      <g style={{ strokeWidth: 'var(--kalin)' }}>
        <path d="M-60 0V-8H-48V-16H-36V-24H-24V-32H-12V-40H12V-32H24V-24H36V-16H48V-8H60V0Z" vectorEffect="non-scaling-stroke" />
        <path d="M-44 0V-8M-32 0V-16M-20 0V-24M-8 0V-32M8 0V-32M20 0V-24M32 0V-16M44 0V-8" vectorEffect="non-scaling-stroke" strokeOpacity={0.6} />
      </g>
    </svg>
  )
}

/** Çizgi – baklava – çizgi ayraç. Her iki yan aynı, ortadan dışa doğru sönen çizgi */
export function Ayirac({ className, baklava = 9 }: { className?: string; baklava?: number }) {
  return (
    <div className={cx('mx-auto flex w-full items-center justify-center gap-4', className)} aria-hidden="true" data-ayirac="">
      <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--altin-cizgi))' }} />
      <span className="block shrink-0 border border-altin-cizgi" style={{ width: baklava, height: baklava, rotate: '45deg' }} />
      <span className="block shrink-0 border border-altin-cizgi" style={{ width: baklava * 0.55, height: baklava * 0.55, rotate: '45deg', background: 'var(--altin-cizgi)' }} />
      <span className="block shrink-0 border border-altin-cizgi" style={{ width: baklava, height: baklava, rotate: '45deg' }} />
      <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, var(--altin-cizgi))' }} />
    </div>
  )
}

/** Desen bandı: yelpaze, zigzag ya da dikey kanal. Kenarlara doğru söner */
export function Bant({ tur, boy = 40, className }: { tur: 'yelpaze' | 'zigzag' | 'kanal'; boy?: number; className?: string }) {
  const fade = 'linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent)'
  return (
    <div className={cx('w-full', className)} style={{ height: boy, maskImage: fade, WebkitMaskImage: fade }} aria-hidden="true" data-bant={tur}>
      <div className={cx('desen size-full', `desen-${tur}`)} />
    </div>
  )
}
