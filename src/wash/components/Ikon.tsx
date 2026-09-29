import type { CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { SIMGELER, SIMGE_AD, type Kat, type Pigment, type SimgeAd } from '../lib/simge'

const RENK: Record<Pigment, string> = {
  ultramarin: 'var(--ultramarin)',
  yesil: 'var(--yesil)',
  gul: 'var(--gul)',
  ocre: 'var(--ocre)',
  murekkep: 'var(--murekkep)',
  kagit: 'var(--sayfa)',
}

/** Katmanları çizer. `kagit` katmanları normal kipte (boya kaldırma / açık ton), diğerleri çoğaltma kipiyle */
export function Katmanlar({ katmanlar }: { katmanlar: readonly Kat[] }) {
  return (
    <>
      {katmanlar
        .filter((k) => k.o !== 0)
        .map((k, i) => (
          <path key={i} d={k.d} fill={RENK[k.p]} fillOpacity={k.o ?? 0.8} style={{ mixBlendMode: k.p === 'kagit' ? 'normal' : ('var(--blend)' as CSSProperties['mixBlendMode']) }} />
        ))}
    </>
  )
}

/** Madde 9: el boyaması ikon. `etiket` verilirse erişilebilir görsel, yoksa süs */
export function Ikon({ ad, boyut = 48, className, etiket, filtre = true }: { ad: SimgeAd; boyut?: number; className?: string; etiket?: string; filtre?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" width={boyut} height={boyut} className={cx('inline-block shrink-0 overflow-visible', className)} role={etiket ? 'img' : undefined} aria-label={etiket} aria-hidden={etiket ? undefined : true} data-simge={ad} style={{ opacity: 'calc(0.55 + 0.45 * var(--su))' }}>
      <g filter={filtre ? 'url(#wc-ikon)' : undefined}>
        <Katmanlar katmanlar={SIMGELER[ad]} />
      </g>
    </svg>
  )
}

export const simgeAdi = (a: SimgeAd) => SIMGE_AD[a]
