import { useId, useRef, useState, type PointerEvent } from 'react'
import { useWidth } from '../hooks/useWidth'
import { fmtNum } from '../lib/data'

export type Sample = { rx: number; tx: number }
type Series = { key: keyof Sample; label: string; color: string }

/**
 * Alan grafiği (Madde 11): son 60 saniyenin aktarım hızı. Tek y ekseni (Gbit/sn, 0–10 sabit),
 * iki seri üst üste bindirilmemiş; çizgi 2px, dolgu hafif gradyan. Artı imleç + ipucu, sağ uçta doğrudan etiket.
 */
export function AreaChart({ data, series, max = 10, height = 240, label }: { data: Sample[]; series: Series[]; max?: number; height?: number; label: string }) {
  const id = useId()
  const wrap = useRef<HTMLDivElement>(null)
  const width = useWidth(wrap)
  const [hover, setHover] = useState<number | null>(null)
  const narrow = width < 480
  const pad = { l: 40, r: narrow ? 46 : 118, t: 14, b: 28 }
  const iw = Math.max(10, width - pad.l - pad.r)
  const ih = height - pad.t - pad.b
  const n = data.length
  const x = (i: number) => pad.l + (i / Math.max(1, n - 1)) * iw
  const y = (v: number) => pad.t + ih - (Math.min(max, v) / max) * ih
  const line = (k: keyof Sample) => data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d[k]).toFixed(1)}`).join(' ')
  const area = (k: keyof Sample) => `${line(k)} L${x(n - 1).toFixed(1)} ${y(0)} L${x(0)} ${y(0)} Z`
  const last = data[n - 1]

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - r.left
    const i = Math.round(((px - pad.l) / iw) * (n - 1))
    setHover(i >= 0 && i < n ? i : null)
  }
  // Doğrudan etiketler üst üste binmesin
  const labelY = series.map((s) => y(last[s.key]))
  if (labelY.length === 2 && Math.abs(labelY[0] - labelY[1]) < 16) {
    const mid = (labelY[0] + labelY[1]) / 2
    const up = labelY[0] <= labelY[1] ? 0 : 1
    labelY[up] = mid - 8
    labelY[1 - up] = mid + 8
  }

  return (
    <div ref={wrap} className="relative w-full min-w-0">
      <svg width={width} height={height} className="block max-w-full" role="img" aria-label={label} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`${id}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={s.color} stopOpacity={0.32} />
              <stop offset="1" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {[0, 2.5, 5, 7.5, 10].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={pad.l + iw} y1={y(v)} y2={y(v)} stroke="var(--line-soft)" strokeWidth={v === 0 ? 1 : 0.75} strokeDasharray={v === 0 ? undefined : '2 4'} />
            <text x={pad.l - 8} y={y(v)} textAnchor="end" dominantBaseline="middle" className="fill-[var(--muted)] font-tech text-[11px] tabular-nums">
              {String(v).replace('.', ',')}
            </text>
          </g>
        ))}
        {[0, 15, 30, 45, 59].map((i) => (
          <text key={i} x={x(i)} y={height - 8} textAnchor={i === 0 ? 'start' : i === 59 ? 'end' : 'middle'} className="fill-[var(--muted)] font-tech text-[11px]">
            {i === 59 ? 'şimdi' : `-${60 - i} sn`}
          </text>
        ))}
        {series.map((s) => (
          <g key={s.key}>
            <path d={area(s.key)} fill={`url(#${id}-${s.key})`} />
            <path d={line(s.key)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 5px ${s.color})` }} />
          </g>
        ))}
        {series.map((s, k) => (
          <g key={`e-${s.key}`}>
            <circle cx={x(n - 1)} cy={y(last[s.key])} r={4} fill={s.color} stroke="var(--surface)" strokeWidth={2} />
            <text x={x(n - 1) + 10} y={labelY[k]} dominantBaseline="middle" className="fill-[var(--ink)] font-tech text-[12px] font-semibold tabular-nums">
              {narrow ? fmtNum(last[s.key]) : `${s.label} ${fmtNum(last[s.key])}`}
            </text>
          </g>
        ))}
        {hover !== null ? (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} stroke="var(--ink)" strokeOpacity={0.4} strokeWidth={1} />
            {series.map((s) => (
              <circle key={s.key} cx={x(hover)} cy={y(data[hover][s.key])} r={4} fill={s.color} stroke="var(--surface)" strokeWidth={2} />
            ))}
          </g>
        ) : null}
      </svg>
      {hover !== null ? (
        <div
          className="pointer-events-none absolute top-2 z-10 rounded-lg border border-line bg-surface px-3 py-2 text-[13px] whitespace-nowrap shadow-[0_0_18px_var(--glow)]"
          style={x(hover) > width / 2 ? { right: width - x(hover) + 12 } : { left: x(hover) + 12 }}
          role="presentation"
        >
          <p className="font-tech text-[12px] text-muted">{hover === n - 1 ? 'şimdi' : `${n - 1 - hover} sn önce`}</p>
          {series.map((s) => (
            <p key={s.key} className="flex items-center gap-2 tabular-nums">
              <span className="size-2 rounded-full" style={{ background: s.color }} aria-hidden="true" />
              {s.label}: {fmtNum(data[hover][s.key], 2)} Gbit/sn
            </p>
          ))}
        </div>
      ) : null}
    </div>
  )
}
