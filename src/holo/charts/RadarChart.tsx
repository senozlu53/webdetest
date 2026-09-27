import { useRef, useState } from 'react'
import { useWidth } from '../hooks/useWidth'
import { cx } from '../../shared/cx'

type Series = { id: string; label: string; values: readonly number[]; color: string }

/**
 * Radar grafiği (Madde 11): altı eksen, iki seri. Izgara ve eksenler geri planda; seriler 2px çizgi,
 * hafif dolgu, 8px işaretçi (2px yüzey halkalı). Lejant her zaman var, seriler doğrudan da etiketli;
 * işaretçi üzerinde ipucu. Değerler ayrıca tablo olarak okunabilir.
 */
export function RadarChart({ axes, series, title }: { axes: readonly string[]; series: Series[]; title: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const W = Math.min(560, useWidth(wrap, 480))
  const [tip, setTip] = useState<{ s: number; a: number } | null>(null)
  const narrow = W < 440
  // Yan boşluk eksen etiketleri için: dar ekranda etiketler iki satıra bölünür
  const side = narrow ? 66 : 104
  const H = Math.min(W, 440)
  const ox = W / 2
  const oy = H / 2
  const R = Math.max(60, Math.min(H / 2 - 36, W / 2 - side))
  const n = axes.length
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2
    return [ox + Math.cos(a) * R * (v / 100), oy + Math.sin(a) * R * (v / 100)] as const
  }
  // Doğrudan etiket: serinin öbüründen en çok öne çıktığı eksende
  const labelAxis = series.map((s, k) => {
    const other = series[1 - k]
    let best = 0
    s.values.forEach((v, i) => {
      if (v - (other?.values[i] ?? 0) > s.values[best] - (other?.values[best] ?? 0)) best = i
    })
    return best
  })

  return (
    <div ref={wrap} className="relative w-full min-w-0">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="mx-auto block h-auto max-w-full" role="img" aria-label={`${title}. ${series.map((s) => `${s.label}: ${axes.map((a, i) => `${a} ${s.values[i]}`).join(', ')}`).join('. ')}`}>
        {/* Izgara: 20'lik halkalar */}
        {[20, 40, 60, 80, 100].map((v) => (
          <polygon key={v} points={axes.map((_, i) => pt(i, v).join(',')).join(' ')} fill="none" stroke="var(--line-soft)" strokeWidth={v === 100 ? 1 : 0.75} />
        ))}
        {axes.map((a, i) => {
          const [x, y] = pt(i, 100)
          const [lx, ly] = pt(i, 100 + 1400 / R)
          const anchor = Math.abs(lx - ox) < 8 ? 'middle' : lx > ox ? 'start' : 'end'
          const lines = narrow && a.includes(' ') ? a.split(' ') : [a]
          return (
            <g key={a}>
              <line x1={ox} y1={oy} x2={x} y2={y} stroke="var(--line-soft)" strokeWidth={0.75} />
              <text x={lx} y={ly - (lines.length - 1) * 7} textAnchor={anchor} dominantBaseline="middle" className="fill-[var(--muted)] font-tech text-[12px] font-semibold tracking-[0.04em]">
                {lines.map((l, k) => (
                  <tspan key={l} x={lx} dy={k ? 14 : 0}>
                    {l}
                  </tspan>
                ))}
              </text>
            </g>
          )
        })}
        {[50, 100].map((v) => (
          <text key={v} x={ox + 4} y={pt(0, v)[1] + 12} className="fill-[var(--muted)] font-tech text-[10px]">
            {v}
          </text>
        ))}
        {series.map((s) => (
          <polygon key={s.id} points={s.values.map((v, i) => pt(i, v).join(',')).join(' ')} fill={s.color} fillOpacity={0.14} stroke={s.color} strokeWidth={2} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${s.color})` }} />
        ))}
        {series.map((s, k) =>
          s.values.map((v, i) => {
            const [x, y] = pt(i, v)
            return (
              <g key={`${s.id}-${i}`} onPointerEnter={() => setTip({ s: k, a: i })} onPointerLeave={() => setTip(null)}>
                <circle cx={x} cy={y} r={12} fill="transparent" />
                <circle cx={x} cy={y} r={4} fill={s.color} stroke="var(--surface)" strokeWidth={2} />
              </g>
            )
          }),
        )}
        {series.map((s, k) => {
          const i = labelAxis[k]
          const [x, y] = pt(i, s.values[i])
          const dx = x - ox
          const dy = y - oy
          const len = Math.hypot(dx, dy) || 1
          return (
            <text key={`l-${s.id}`} x={x - (dx / len) * 16} y={y - (dy / len) * 16} textAnchor="middle" dominantBaseline="middle" className="fill-[var(--ink)] font-tech text-[12px] font-semibold" style={{ paintOrder: 'stroke', stroke: 'var(--surface)', strokeWidth: 4 }}>
              {s.label}
            </text>
          )
        })}
      </svg>
      {tip ? (
        (() => {
          const s = series[tip.s]
          const [x, y] = pt(tip.a, s.values[tip.a])
          const offset = ((wrap.current?.clientWidth ?? W) - W) / 2
          return (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-lg border border-line bg-surface px-3 py-2 text-[13px] whitespace-nowrap shadow-[0_0_18px_var(--glow)]"
              style={{ left: x + Math.max(0, offset), top: y }}
              role="presentation"
            >
              <p className="font-tech text-[12px] text-muted">{axes[tip.a]}</p>
              {series.map((ss, k) => (
                <p key={ss.id} className={cx('flex items-center gap-2 tabular-nums', k === tip.s ? 'font-semibold' : 'text-muted')}>
                  <span className="size-2 rounded-full" style={{ background: ss.color }} aria-hidden="true" />
                  {ss.label}: {ss.values[tip.a]}
                </p>
              ))}
            </div>
          )
        })()
      ) : null}
    </div>
  )
}
