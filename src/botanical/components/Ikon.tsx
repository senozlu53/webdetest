import { cx } from '../../shared/cx'
import { SIMGELER, type SimgeAd } from '../lib/simge'

/** Madde 9: 32×32 organik ikon. Yumuşak dolgu yaprak ve taç yapraklarda, çizgi kalınlığı ölçekle değişmez */
export function Ikon({ ad, boyut = 24, className, etiket, kalin = 1.5 }: { ad: SimgeAd; boyut?: number; className?: string; etiket?: string; kalin?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
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
          <path key={i} d={p.d} vectorEffect="non-scaling-stroke" fill={'dolgu' in p && p.dolgu ? 'currentColor' : 'none'} fillOpacity={'dolgu' in p && p.dolgu ? 0.18 : undefined} />
        ))}
      </g>
    </svg>
  )
}
