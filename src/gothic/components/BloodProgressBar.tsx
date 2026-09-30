import { useId, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'

const DAMLA: { p: number; d: string; t: string; dm: number }[] = [
  { p: 0.16, d: '0s', t: '7s', dm: 16 },
  { p: 0.52, d: '2.4s', t: '9s', dm: 22 },
  { p: 0.86, d: '4.8s', t: '6.2s', dm: 13 },
]

/**
 * <BloodProgressBar>: demir kanal içinde akan kan ve altından sızan damlalar (Madde 11 · 14).
 * `deger` verilmezse belirsiz (yükleniyor) kipidir. Damlalar ve akış süstür; ilerleme ve etiket metinle de verilir.
 */
export function BloodProgressBar({
  etiket,
  deger,
  belirsiz = false,
  birim = '%',
  metin,
  gizliEtiket = false,
  damla = true,
  className,
  style,
}: {
  etiket: string
  deger?: number
  belirsiz?: boolean
  birim?: string
  metin?: string
  gizliEtiket?: boolean
  damla?: boolean
  className?: string
  style?: CSSProperties
}) {
  const id = useId()
  const b = belirsiz || deger === undefined
  const v = b ? 38 : Math.max(0, Math.min(100, deger))
  const gorunen = metin ?? (b ? 'Yükleniyor…' : `${Math.round(v)}${birim}`)
  return (
    <div className={cx('kb', className)} data-belirsiz={b ? '' : undefined} data-dolu={!b && v >= 100 ? '' : undefined} style={style}>
      <div className={cx('kb-satir', gizliEtiket && 'sr-only')}>
        <span id={id} className="t-etiket">
          {etiket}
        </span>
        <span className="rakam kb-deger">{gorunen}</span>
      </div>
      <div className="kb-alan">
        <div className="kb-iz" role="progressbar" aria-labelledby={id} aria-valuemin={0} aria-valuemax={100} aria-valuenow={b ? undefined : Math.round(v)} aria-valuetext={gorunen}>
          <div className="kb-dolu" style={{ ['--oran' as string]: v }}>
            {damla && v > 4
              ? DAMLA.map((x, i) => (
                  <span
                    key={i}
                    className="kb-damla"
                    aria-hidden="true"
                    style={{
                      ['--p' as string]: x.p,
                      ['--d' as string]: x.d,
                      ['--t' as string]: x.t,
                      ['--dm' as string]: `${x.dm}px`,
                    }}
                  />
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  )
}
