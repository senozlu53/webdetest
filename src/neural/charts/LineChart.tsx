import { useId, useMemo, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useSize } from '../hooks/useSize'
import { cx } from '../../shared/cx'

export interface XY {
  x: number
  y: number
}
export interface Series {
  id: string
  ad: string
  color: string
  data: XY[]
  dash?: string
  markers?: boolean
  /** Bu x'ten sonrası planlanan: kesik ve soluk çizilir */
  futureFrom?: number
}
export interface Note {
  x: number
  label: string
}

function nice(min: number, max: number, count = 4) {
  const span = max - min || 1
  const raw = span / count
  const p = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => span / s <= count + 0.5) ?? p * 10
  const lo = Math.floor(min / step) * step
  const hi = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(+v.toPrecision(12))
  return { lo, hi, ticks }
}

/**
 * Tek eksenli çizgi grafiği (dataviz: çift eksen yok). İnce çizgiler, 2px seri, en az 8px işaretçi,
 * seçici doğrudan etiketler, artı imleç ve ipucu. Odaktayken ← → ile nokta nokta gezilir.
 */
export function LineChart({ series, x0, x1, height, fmtX, fmtY, notes = [], endLabels, label, zeroBase, now }: { series: Series[]; x0: number; x1: number; height: number; fmtX: (x: number) => string; fmtY: (y: number) => string; notes?: Note[]; endLabels?: boolean; label: string; zeroBase?: boolean; now?: number }) {
  const [ref, { w }] = useSize<HTMLDivElement>()
  const [hx, setHx] = useState<number | null>(null)
  const tipId = useId()
  const narrow = w < 520
  const m = { l: 52, r: endLabels ? (narrow ? 84 : 112) : 16, t: 16, b: 28 }
  const iw = Math.max(10, w - m.l - m.r)
  const ih = height - m.t - m.b

  const vis = useMemo(
    () =>
      series.map((s) => {
        const d = s.data.filter((p) => p.x >= x0 && p.x <= x1)
        const n = Math.max(1, Math.ceil(d.length / Math.max(60, iw)))
        return { ...s, d: n > 1 ? d.filter((_, i) => i % n === 0 || i === d.length - 1) : d, all: d }
      }),
    [series, x0, x1, iw],
  )
  const ys = vis.flatMap((s) => s.all.map((p) => p.y))
  const yMin = zeroBase ? 0 : Math.min(...ys)
  const yMax = Math.max(...ys)
  const { lo, hi, ticks } = nice(zeroBase ? 0 : yMin - (yMax - yMin) * 0.06, yMax + (yMax - yMin) * 0.06)
  const sx = (x: number) => m.l + ((x - x0) / (x1 - x0 || 1)) * iw
  const sy = (y: number) => m.t + ih - ((y - lo) / (hi - lo || 1)) * ih
  const xt = nice(x0, x1, narrow ? 3 : 5).ticks.filter((t) => t >= x0 && t <= x1)

  const line = (d: XY[]) => d.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`).join('')
  const base = vis[0]?.all ?? []
  const nearest = (d: XY[], x: number, tol = Infinity) => {
    let best: XY | null = null
    let bd = tol
    for (const p of d) {
      const dd = Math.abs(p.x - x)
      if (dd < bd) {
        bd = dd
        best = p
      }
    }
    return best
  }
  const hp = hx !== null ? nearest(base, hx) : null
  const step = base.length > 1 ? base[1].x - base[0].x : 1

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const b = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - b.left
    if (px < m.l - 8 || px > m.l + iw + 8) return setHx(null)
    setHx(x0 + ((px - m.l) / iw) * (x1 - x0))
  }
  const onKey = (e: KeyboardEvent) => {
    if (!base.length) return
    const idx = hp ? base.indexOf(hp) : base.length - 1
    const jump = e.shiftKey ? 25 : 1
    const go: Record<string, number> = { ArrowLeft: idx - jump, ArrowRight: idx + jump, Home: 0, End: base.length - 1 }
    if (e.key in go) {
      e.preventDefault()
      setHx(base[Math.max(0, Math.min(base.length - 1, go[e.key]))].x)
    } else if (e.key === 'Escape') setHx(null)
  }

  // Doğrudan etiketler: seri sonları; çakışırsa aralarını aç
  const ends = endLabels
    ? vis
        .map((s) => {
          const p = s.futureFrom !== undefined ? nearest(s.all, s.futureFrom) : s.all[s.all.length - 1]
          return p ? { s, p, y: sy(p.y) } : null
        })
        .filter(Boolean)
        .sort((a, b) => a!.y - b!.y) as { s: (typeof vis)[number]; p: XY; y: number }[]
    : []
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 30) ends[i].y = ends[i - 1].y + 30

  const tipRows = hp
    ? vis
        .map((s) => ({ s, p: nearest(s.all, hp.x, s.markers ? 260 : step * 1.5) }))
        .filter((r) => r.p)
    : []
  const tipText = hp ? `${fmtX(hp.x)}: ${tipRows.map((r) => `${r.s.ad} ${fmtY(r.p!.y)}`).join(', ')}` : ''
  const tipLeft = hp ? sx(hp.x) : 0

  return (
    <div ref={ref} className="relative min-w-0">
      {w > 0 ? (
        <svg
          width={w}
          height={height}
          className="block touch-pan-y outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          role="group"
          aria-roledescription="grafik"
          aria-label={`${label}. Odaklanınca sol ve sağ ok tuşlarıyla noktalar arasında gezinin.`}
          aria-describedby={tipId}
          tabIndex={0}
          onPointerMove={onMove}
          onPointerLeave={() => setHx(null)}
          onKeyDown={onKey}
          onBlur={() => setHx(null)}
        >
          <g className="font-mono mono-tight" fontSize={11} fill="var(--faint)">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={m.l} x2={m.l + iw} y1={sy(t)} y2={sy(t)} stroke="rgb(255 255 255 / 0.06)" />
                <text x={m.l - 8} y={sy(t) + 4} textAnchor="end">
                  {fmtY(t)}
                </text>
              </g>
            ))}
            <line x1={m.l} x2={m.l + iw} y1={m.t + ih} y2={m.t + ih} stroke="var(--line-strong)" />
            {xt.map((t) => (
              <text key={t} x={sx(t)} y={height - 8} textAnchor={sx(t) > m.l + iw - 24 ? 'end' : sx(t) < m.l + 24 ? 'start' : 'middle'}>
                {fmtX(t)}
              </text>
            ))}
          </g>
          {notes
            .filter((n) => n.x >= x0 && n.x <= x1)
            .map((n) => (
              <g key={n.x}>
                <line x1={sx(n.x)} x2={sx(n.x)} y1={m.t} y2={m.t + ih} stroke="var(--node-active)" strokeDasharray="3 4" opacity={0.7} />
                <text x={sx(n.x) + 6} y={m.t + 10} className="font-mono mono-tight" fontSize={11} fill="var(--node-active)">
                  {n.label}
                </text>
              </g>
            ))}
          {now !== undefined && now >= x0 && now <= x1 ? <line x1={sx(now)} x2={sx(now)} y1={m.t} y2={m.t + ih} stroke="var(--line-strong)" /> : null}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {vis.map((s) => {
              if (s.futureFrom !== undefined) {
                const past = s.d.filter((p) => p.x <= s.futureFrom!)
                const fut = s.d.filter((p) => p.x >= s.futureFrom!)
                return (
                  <g key={s.id}>
                    <path d={line(past)} stroke={s.color} strokeWidth={2} />
                    <path d={line(fut)} stroke={s.color} strokeWidth={1.5} strokeDasharray="4 5" opacity={0.55} />
                  </g>
                )
              }
              return <path key={s.id} d={line(s.d)} stroke={s.color} strokeWidth={2} strokeDasharray={s.dash} />
            })}
          </g>
          {vis
            .filter((s) => s.markers)
            .map((s) => (
              <g key={s.id}>
                {s.all.map((p) => (
                  <circle key={p.x} cx={sx(p.x)} cy={sy(p.y)} r={4} fill={s.color} stroke="var(--panel)" strokeWidth={2} />
                ))}
              </g>
            ))}
          {ends.map(({ s, p, y }) => (
            <g key={s.id} className="font-mono mono-tight" fontSize={11}>
              <line x1={sx(p.x) + 6} x2={m.l + iw + 8} y1={sy(p.y)} y2={y} stroke="var(--line-strong)" />
              <text x={m.l + iw + 12} y={y - 2} fill="var(--ink)">
                {s.ad}
              </text>
              <text x={m.l + iw + 12} y={y + 12} fill="var(--muted)">
                {fmtY(p.y)}
              </text>
            </g>
          ))}
          {hp ? (
            <g pointerEvents="none">
              <line x1={sx(hp.x)} x2={sx(hp.x)} y1={m.t} y2={m.t + ih} stroke="var(--ink)" strokeOpacity={0.5} />
              {tipRows.map(({ s, p }) => (
                <circle key={s.id} cx={sx(p!.x)} cy={sy(p!.y)} r={5} fill={s.color} stroke="var(--ink)" strokeWidth={2} />
              ))}
            </g>
          ) : null}
        </svg>
      ) : (
        <div style={{ height }} />
      )}
      {hp ? (
        <div className={cx('pointer-events-none absolute top-2 z-10 w-max max-w-[220px] rounded-lg border border-line-strong bg-panel-2/95 px-3 py-2 shadow-[0_8px_24px_rgb(0_0_0/0.5)]')} style={tipLeft > w - 200 ? { right: w - tipLeft + 12 } : { left: tipLeft + 12 }} aria-hidden="true">
          <p className="font-mono text-[11px] text-faint mono-tight">{fmtX(hp.x)}</p>
          {tipRows.map(({ s, p }) => (
            <p key={s.id} className="flex items-center gap-2 text-[13px]">
              <span className="h-0.5 w-3 rounded-full" style={{ background: s.color }} />
              <span className="text-muted">{s.ad}</span>
              <span className="ml-auto pl-2 font-mono text-[12px] text-ink tabular-nums mono-tight">{fmtY(p!.y)}</span>
            </p>
          ))}
        </div>
      ) : null}
      <p id={tipId} className="sr-only" aria-live="polite">
        {tipText}
      </p>
    </div>
  )
}
