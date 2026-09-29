import { cx } from '../../shared/cx'
import { SIMGELER, type SimgeAd } from '../lib/simge'

/** Madde 9: 24×24 mikro ikon: tek ince çizgi, dolgu yok; çizgi kalınlığı ölçekle değişmez */
export function Ikon({ ad, boyut = 24, className, etiket, kalin = 1 }: { ad: SimgeAd; boyut?: number; className?: string; etiket?: string; kalin?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={boyut}
      height={boyut}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx('shrink-0 overflow-visible', className)}
      role={etiket ? 'img' : undefined}
      aria-label={etiket}
      aria-hidden={etiket ? undefined : true}
      data-simge={ad}
    >
      <g style={{ strokeWidth: kalin }}>
        {SIMGELER[ad].map((p, i) => (
          <path key={i} d={p.d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  )
}
