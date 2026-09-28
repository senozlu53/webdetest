import { useId } from 'react'
import { cx } from '../../shared/cx'
import { Mascot } from './Mascot'
import type { MaskotRenk } from '../lib/maskot'

/**
 * Madde 11: kalın (30px), şeker çubuğu çizgili, uçta küçük maskot taşıyan ilerleme çubuğu.
 * Değer yazıyla da verilir; renk tek başına anlam taşımaz.
 */
export function KawaiiProgress({
  deger,
  max = 100,
  etiket,
  renk = 'mint',
  maskot = true,
  maskotRenk = 'peach',
  birim,
  className,
}: {
  deger: number
  max?: number
  etiket: string
  renk?: 'mint' | 'peach' | 'salmon' | 'rose'
  maskot?: boolean
  maskotRenk?: MaskotRenk
  birim?: (d: number, m: number) => string
  className?: string
}) {
  const id = useId()
  const p = Math.max(0, Math.min(1, deger / max))
  const yazi = birim ? birim(deger, max) : `%${Math.round(p * 100)}`
  return (
    <div className={cx('min-w-0', className)}>
      <div className="flex items-baseline justify-between gap-3 text-[16px] font-extrabold">
        <span id={id}>{etiket}</span>
        <span className="tabular-nums">{yazi}</span>
      </div>
      <div className={cx('relative', maskot ? 'mt-9' : 'mt-2')}>
        <div className="kbar" role="progressbar" aria-labelledby={id} aria-valuemin={0} aria-valuemax={max} aria-valuenow={deger} aria-valuetext={yazi}>
          {p > 0 ? (
            <span
              className="dolu"
              style={{
                width: `calc((100% - 8px) * ${p})`,
                ['--c' as string]: `var(--${renk})`,
              }}
            />
          ) : null}
        </div>
        {maskot ? (
          <span className="kbar-maskot" style={{ left: `calc(4px + (100% - 8px) * ${p})` }}>
            <Mascot ruh={p >= 1 ? 'heyecanli' : p === 0 ? 'uykulu' : 'mutlu'} renk={maskotRenk} boyut={46} />
          </span>
        ) : null}
      </div>
    </div>
  )
}
