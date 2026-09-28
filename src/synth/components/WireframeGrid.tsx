import { useId, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../../shared/cx'

/** Güneşin alt yarısındaki yatay kesikler: aşağı indikçe boşluk büyür, şerit incelir */
const KESIK = (() => {
  let y = 46
  const d: string[] = []
  for (let i = 0; i < 7 && y < 100; i++) {
    y += 10 - i * 1.2
    const bosluk = 1.6 + i * 1.3
    d.push(`M0 ${y.toFixed(1)}h200v${bosluk.toFixed(1)}h-200z`)
    y += bosluk
  }
  return d.join('')
})()

/**
 * Madde 2 · 11 · 14: <WireframeGrid>. Ekranın altından ufka uzanan tel kafes zemin.
 * Zemin CSS 3B: düz bir ızgara rotateX ile yatırılır, perspective ufku verir; arka plan konumu bir hücre kaydıkça
 * sonsuz ileri akış olur (Madde 16). Güneş: üstü dolu, altı giderek kalınlaşan boşluklarla kesik yarım daire (Madde 6).
 */
export function WireframeGrid({ renk = 'pink', hucre = 60, hiz = 1.2, egim = 76, ufuk = 52, perspektif = 320, akis = true, gunes = true, daglar = true, palmiye = true, gunesX = 50, palmiyeSag = false, className, style, children }: { renk?: 'pink' | 'cyan'; hucre?: number; hiz?: number; egim?: number; ufuk?: number; perspektif?: number; akis?: boolean; gunes?: boolean; daglar?: boolean; palmiye?: boolean; gunesX?: number; palmiyeSag?: boolean; className?: string; style?: CSSProperties; children?: ReactNode }) {
  const uid = useId().replace(/:/g, '')
  const c = renk === 'pink' ? 'var(--pink)' : 'var(--cyan)'
  const v = { '--hucre': `${hucre}px`, '--hiz': `${hiz}s`, '--egim': `${egim}deg`, '--ufuk': `${ufuk}%`, '--pers': `${perspektif}px`, '--gc': c } as CSSProperties
  return (
    <div className={cx('wf', className)} style={{ ...v, ...style }} data-wf="">
      {gunes ? (
        <svg className="absolute w-[min(46%,420px)] -translate-x-1/2" style={{ bottom: `${100 - ufuk}%`, left: `${gunesX}%` }} viewBox="0 0 200 100" aria-hidden="true">
          <defs>
            <linearGradient id={`${uid}g`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffe08a" />
              <stop offset="0.45" stopColor="#ff8c00" />
              <stop offset="1" stopColor="#ff00ff" />
            </linearGradient>
            <mask id={`${uid}k`}>
              <rect width="200" height="100" fill="#fff" />
              <path d={KESIK} fill="#000" />
            </mask>
          </defs>
          <circle cx="100" cy="100" r="92" fill={`url(#${uid}g)`} mask={`url(#${uid}k)`} style={{ filter: 'drop-shadow(0 0 var(--g3) #ff5ab4)' }} />
        </svg>
      ) : null}
      {daglar ? (
        <svg className="absolute inset-x-0 h-[26%] w-full max-md:h-[12%]" style={{ bottom: `${100 - ufuk}%` }} viewBox="0 0 800 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 100 L60 55 L110 80 L180 20 L250 70 L300 45 L360 100 M440 100 L500 50 L560 78 L630 15 L700 62 L760 40 L800 60 V100" fill="#12062a" stroke="#00ffff" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path d="M180 20 L190 100 M630 15 L620 100 M60 55 L70 100 M500 50 L495 100" stroke="#00ffff" strokeWidth="1" opacity="0.6" vectorEffect="non-scaling-stroke" />
        </svg>
      ) : null}
      <div className="wf-zemin" data-akis={akis ? '' : undefined} aria-hidden="true" />
      <div className="wf-ufuk" aria-hidden="true" />
      {palmiye ? (
        <svg className={cx('absolute bottom-0 h-[62%] max-md:hidden', palmiyeSag ? 'right-[3%] -scale-x-100' : 'left-[3%]')} viewBox="0 0 120 220" aria-hidden="true">
          <path d="M62 220 C66 170 58 120 70 70 M70 70 C45 52 18 60 4 84 M70 70 C88 46 112 48 120 66 M70 70 C62 44 40 32 18 36 M70 70 C82 40 104 26 116 32 M70 70 C66 88 56 100 44 112 M70 70 C80 86 88 98 94 116" fill="none" stroke="#0d0418" strokeWidth="9" strokeLinecap="round" />
        </svg>
      ) : null}
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  )
}
