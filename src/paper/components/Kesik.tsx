import type { CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { SIMGELER, type Katman, type SimgeAd } from '../lib/simge'

/**
 * Madde 9: kâğıttan kesilmiş silüet. Alta krem bir kâğıt kenarı (halo), üstüne renkli katmanlar;
 * ikinci ve sonraki katmanlar bir alttakine kendi gölgesini düşürür.
 */
export function Kesik({ ad, boyut = 48, renk, nivel = 2, halo = true, className, style, etiket }: { ad: SimgeAd; boyut?: number; renk?: string; nivel?: 1 | 2 | 3 | 4 | 5; halo?: boolean; className?: string; style?: CSSProperties; etiket?: string }) {
  const katmanlar: Katman[] = SIMGELER[ad]
  return (
    <svg viewBox="0 0 48 48" width={boyut} height={boyut} className={cx('inline-block shrink-0 overflow-visible', className)} style={{ filter: `var(--kenar) var(--sh-${nivel})`, ...style }} role={etiket ? 'img' : undefined} aria-label={etiket} aria-hidden={etiket ? undefined : true} data-simge={ad}>
      {halo ? (
        <g fill="var(--krem)" stroke="var(--krem)" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
          {katmanlar.map((k, i) => (k.cizgi ? <path key={i} d={k.d} fill="none" strokeWidth={k.cizgi + 5} /> : <path key={i} d={k.d} />))}
        </g>
      ) : null}
      {katmanlar.map((k, i) => (
        <g key={i} style={i > 0 ? { filter: 'var(--sh-1)' } : undefined}>
          {k.cizgi ? <path d={k.d} fill="none" stroke={i === 0 && renk ? renk : k.renk} strokeWidth={k.cizgi} strokeLinecap="round" /> : <path d={k.d} fill={i === 0 && renk ? renk : k.renk} />}
        </g>
      ))}
    </svg>
  )
}
