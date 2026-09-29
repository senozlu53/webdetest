import { cx } from '../../shared/cx'
import { SIMGELER, SIMGE_AD, type SimgeAd } from '../lib/simge'

/** 1 piksel ince hatlı, dikey eksende simetrik altın ikon. Çizgi kalınlığı ölçekle değişmez */
export function Ikon({ ad, boyut = 32, className, etiket }: { ad: SimgeAd; boyut?: number; className?: string; etiket?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={boyut}
      height={boyut}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx('shrink-0 overflow-visible text-altin-cizgi', className)}
      role={etiket ? 'img' : undefined}
      aria-label={etiket}
      aria-hidden={etiket ? undefined : true}
      data-simge={ad}
    >
      <g style={{ strokeWidth: 'var(--kalin)' }}>
        {SIMGELER[ad].map((d, i) => (
          <path key={i} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  )
}
export const simgeAdi = (a: SimgeAd) => SIMGE_AD[a]
