import { useId, useMemo, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { dal as dalUret, SIR, seramik, type Sir, type SeramikTur } from '../lib/seramik'
import { useWabi } from '../lib/store'

const YAPRAK = 'M0 0C3.500 -3.800 9 -3 11.500 1.600C7 5.400 3 4.400 0 0Z'

/**
 * Elle yapılmış seramik illüstrasyonu (Madde 2 · 8): iki yanı birbirinden farklı silüet, sır, atölye halkaları,
 * benek ve ince çatlak. Gölge yok; yalnız yere değen ince bir çizgi. `kusur` sıfırken form kusursuz simetriktir.
 */
export function Seramik({ tur, sir = 'kul', tohum = 1, boy = 260, dal = false, sirOran = 0.42, etiket, className, style }: { tur: SeramikTur; sir?: Sir; tohum?: number; boy?: number; dal?: boolean; sirOran?: number; etiket?: string; className?: string; style?: CSSProperties }) {
  const { k } = useWabi()
  const kid = useId()
  const gid = useId()
  const g = useMemo(() => seramik(tur, tohum, k, sirOran), [tur, tohum, k, sirOran])
  const d = useMemo(() => (dal ? dalUret(tohum + 3, k) : null), [dal, tohum, k])
  const cs = SIR[sir]
  const ac = tur === 'tas' ? 0 : 1
  // `boy` kabın kendi yüksekliğidir (px); dal varsa çizim onun üstüne taşar
  const olcek = boy / g.h
  const ust = dal ? -215 : -14
  const yuk = g.h + (dal ? 230 : 28)
  return (
    <svg
      viewBox={`-6 ${ust} ${g.w + 12} ${yuk}`}
      width={Math.round((g.w + 12) * olcek)}
      height={Math.round(yuk * olcek)}
      className={cx('h-auto max-w-full overflow-visible', className)}
      style={style}
      role={etiket ? 'img' : undefined}
      aria-label={etiket}
      aria-hidden={etiket ? undefined : true}
      data-seramik={tur}
      data-sir={sir}
      focusable="false"
    >
      <defs>
        <clipPath id={kid}>
          <path d={g.govde} />
        </clipPath>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".2" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".16" />
        </linearGradient>
      </defs>
      <path d={g.zemin} className="cizgi-yol" />
      <g clipPath={`url(#${kid})`}>
        <rect x="-20" y="-40" width={g.w + 40} height={g.h + 80} fill={tur === 'tas' ? cs.sir : cs.govde} />
        {ac ? <path d={g.sirYolu} fill={cs.sir} /> : null}
        {ac && sir === 'yaprak' ? <path d={g.sirYolu} fill={cs.damla} opacity=".38" transform={`translate(0 -${Math.round(g.h * 0.12)})`} /> : null}
        <rect x="-20" y="-40" width={g.w + 40} height={g.h + 80} fill={`url(#${gid})`} />
        {g.halkalar.map((h, i) => (
          <path key={i} d={h} fill="none" stroke={i % 2 ? '#fff' : cs.cizgi} strokeOpacity={i % 2 ? 0.2 : 0.16} strokeWidth=".9" strokeLinecap="round" />
        ))}
        {g.noktalar.map((n, i) => (
          <circle key={i} cx={n.x.toFixed(1)} cy={n.y.toFixed(1)} r={n.r.toFixed(2)} fill={cs.nokta} opacity={n.o} />
        ))}
        {g.catlak ? <path d={g.catlak} fill="none" stroke={cs.cizgi} strokeOpacity=".5" strokeWidth=".8" strokeLinecap="round" /> : null}
      </g>
      <path d={g.govde} fill="none" style={{ stroke: 'var(--cizgi)' }} strokeOpacity=".7" strokeWidth=".9" strokeLinejoin="round" />
      {ac ? (
        <>
          <path d={g.agiz} fill={cs.ic} />
          <path d={g.agizYay} fill="none" style={{ stroke: 'var(--cizgi)' }} strokeOpacity=".7" strokeWidth=".9" strokeLinecap="round" />
        </>
      ) : null}
      {d ? (
        <g transform={`translate(${g.agizMerkez[0].toFixed(1)} ${(g.agizMerkez[1] + 2).toFixed(1)})`}>
          <path d={d.ana} style={{ fill: 'var(--metin)' }} opacity=".82" />
          {d.dallar.map((p, i) => (
            <path key={i} d={p} style={{ fill: 'var(--metin)' }} opacity=".78" />
          ))}
          {d.yapraklar.map((y, i) => (
            <path key={i} d={YAPRAK} transform={`translate(${y.x.toFixed(1)} ${y.y.toFixed(1)}) rotate(${((y.a * 180) / Math.PI - 30).toFixed(0)})`} style={{ fill: 'var(--yaprak)' }} />
          ))}
        </g>
      ) : null}
    </svg>
  )
}
