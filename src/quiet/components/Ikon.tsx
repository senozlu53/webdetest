import { cx } from '../../shared/cx'
import { SIMGELER, type SimgeAd } from '../lib/simge'

/** Tek piksel hatlı işlevsel ikon; çizgi kalınlığı ölçekle değişmez */
export function Ikon({ ad, boyut = 24, className, etiket }: { ad: SimgeAd; boyut?: number; className?: string; etiket?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={boyut}
      height={boyut}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={cx('shrink-0 overflow-visible', className)}
      role={etiket ? 'img' : undefined}
      aria-label={etiket}
      aria-hidden={etiket ? undefined : true}
      data-simge={ad}
    >
      <g style={{ strokeWidth: 1 }}>
        {SIMGELER[ad].map((d, i) => (
          <path key={i} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  )
}
