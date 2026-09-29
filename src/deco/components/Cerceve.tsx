import { type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { cerceveYol, f, type KoseStil } from '../lib/geo'
import { Ayirac } from './Ornament'
import { useGorunur, useSize } from './hooks'
import { Ikon } from './Ikon'
import type { SimgeAd } from '../lib/simge'

/**
 * Madde 6 · 7 · 12: iç içe altın çerçeveler. SVG, kutunun ölçüsünü izler; çizgi hep 1 piksel.
 * Dış çerçeve gradyan altın, içtekiler solar. Üst ve alt orta noktada baklava motifi çizgiyi keser.
 */
export function Cerceve({
  kat = 2,
  stil = 'basamak',
  k = 10,
  aralik = 8,
  motif = true,
  ciz = false,
  acik,
  yavas = 2.2,
  zemin = 'var(--yuzey)',
  dolgu = true,
  className,
}: {
  kat?: number
  stil?: KoseStil
  k?: number
  aralik?: number
  motif?: boolean
  ciz?: boolean
  acik?: boolean
  yavas?: number
  zemin?: string
  dolgu?: boolean
  className?: string
}) {
  const [ref, { w, h }] = useSize<HTMLDivElement>()
  const [gRef, g] = useGorunur<HTMLDivElement>(0.05)
  const yollar: string[] = []
  if (w > 24 && h > 24) {
    for (let i = 0; i < kat; i++) {
      const ic = 0.5 + i * aralik
      if (ic * 2 + k * 4 > Math.min(w, h)) break
      const kk = stil === 'pah' ? Math.max(3, k - i * aralik * 0.586) : k
      yollar.push(cerceveYol(w, h, stil, kk, ic))
    }
  }
  const cx0 = f(w / 2)
  return (
    <div
      ref={(el) => {
        ;(ref as { current: HTMLDivElement | null }).current = el
        ;(gRef as { current: HTMLDivElement | null }).current = el
      }}
      className={cx('pointer-events-none absolute inset-0 -z-10', className)}
      aria-hidden="true"
      data-cerceve={kat}
    >
      {yollar.length ? (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="absolute inset-0 overflow-visible">
          {dolgu && yollar[0] ? <path d={yollar[0]} fill={zemin} stroke="none" data-dolgu="" /> : null}
          {yollar.map((d, i) => (
            <path
              key={i}
              d={d}
              pathLength={1}
              strokeDasharray={ciz ? 1 : undefined}
              stroke={i === 0 ? 'url(#dc-g)' : 'var(--altin-cizgi)'}
              strokeOpacity={i === 0 ? 1 : Math.max(0.3, 0.7 - i * 0.12)}
              style={{
                strokeWidth: 'var(--kalin)',
                ...(acik !== undefined
                  ? { strokeDasharray: 1, strokeDashoffset: acik ? 0 : 1, transition: `stroke-dashoffset ${yavas}s cubic-bezier(0.65,0,0.35,1) ${(acik ? i : yollar.length - 1 - i) * 0.25}s` }
                  : ciz
                    ? g
                      ? { animation: `cizgi-ciz ${yavas}s cubic-bezier(0.65,0,0.35,1) ${i * 0.25}s both`, ['--uzunluk' as string]: 1 }
                      : { strokeDashoffset: 1 }
                    : {}),
              }}
            />
          ))}
          {motif && yollar.length ? (
            <g stroke="var(--altin-cizgi)" style={{ strokeWidth: 'var(--kalin)' }}>
              {[0.5, h - 0.5].map((y, i) => (
                <g key={i}>
                  <path d={`M${f(cx0 - 9)} ${y}L${cx0} ${f(y - 9)}L${f(cx0 + 9)} ${y}L${cx0} ${f(y + 9)}Z`} fill={zemin} />
                  <path d={`M${f(cx0 - 3.5)} ${y}L${cx0} ${f(y - 3.5)}L${f(cx0 + 3.5)} ${y}L${cx0} ${f(y + 3.5)}Z`} fill="var(--altin-cizgi)" />
                </g>
              ))}
            </g>
          ) : null}
        </svg>
      ) : null}
    </div>
  )
}

/** Madde 14: <ArtDecoCard>. Altın çerçeveli, ortalanmış simetrik kart */
export function ArtDecoCard({ ustyazi, baslik, ikon, kat = 2, stil = 'basamak', ciz = false, children, className, seviye = 3 }: { ustyazi?: string; baslik?: ReactNode; ikon?: SimgeAd; kat?: number; stil?: KoseStil; ciz?: boolean; children?: ReactNode; className?: string; seviye?: 2 | 3 | 4 }) {
  const H = `h${seviye}` as 'h2' | 'h3' | 'h4'
  return (
    <div className={cx('relative isolate flex flex-col items-center bg-yuzey px-7 py-10 text-center', className)} data-deco-kart="" data-kat={kat} data-stil={stil}>
      <Cerceve kat={kat} stil={stil} ciz={ciz} />
      {ikon ? <Ikon ad={ikon} boyut={44} className="mb-4" /> : null}
      {ustyazi ? <p className="kicker">{ustyazi}</p> : null}
      {baslik ? <H className="mt-3 text-[clamp(20px,2.4vw,26px)]">{baslik}</H> : null}
      {baslik || ustyazi ? <Ayirac className="my-5 max-w-[200px]" baklava={7} /> : null}
      {children}
    </div>
  )
}
