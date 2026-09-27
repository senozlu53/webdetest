import { useState } from 'react'
import { useElementWidth } from '../lib/useElementWidth'

export type ColumnDatum = { key: string; label: string; fullLabel: string; value: number }

type Props = {
  data: ColumnDatum[]
  formatValue: (v: number) => string
  formatTick: (v: number) => string
  height?: number
  /** Ekran okuyucu için grafik özeti */
  summary: string
}

const M = { top: 28, right: 8, bottom: 32, left: 64 }
const BAR_MAX = 24
const R = 4

function niceStep(raw: number) {
  const exp = Math.pow(10, Math.floor(Math.log10(raw || 1)))
  const f = raw / exp
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * exp
}

/** Üstü 4px yuvarlatılmış, tabanı düz sütun. */
function columnPath(x: number, y: number, w: number, base: number) {
  const r = Math.min(R, (base - y) / 2, w / 2)
  return `M${x},${base}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${base}Z`
}

/**
 * Tek seri sütun grafik: tek renk, lejant yok (başlık seriyi adlandırır).
 * Yalnızca en yüksek ve son sütun doğrudan etiketlenir; her sütunun değeri
 * fareyle ya da klavyeyle (Tab) ipucunda görünür.
 */
export function ColumnChart({ data, formatValue, formatTick, height = 260, summary }: Props) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)

  const max = Math.max(...data.map((d) => d.value), 1)
  const step = niceStep(max / 4)
  const top = Math.ceil(max / step) * step
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step)

  const plotW = Math.max(0, width - M.left - M.right)
  const plotH = height - M.top - M.bottom
  const band = data.length ? plotW / data.length : 0
  const barW = Math.min(BAR_MAX, band * 0.56)
  const base = M.top + plotH
  const y = (v: number) => M.top + plotH - (v / top) * plotH
  const cx = (i: number) => M.left + band * i + band / 2

  const maxIndex = data.findIndex((d) => d.value === max)
  const labelled = new Set([maxIndex, data.length - 1])

  return (
    <div ref={ref} className="relative w-full">
      <svg width={width} height={height} role="group" aria-label={summary} className="block overflow-visible">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} stroke="var(--chart-grid)" strokeWidth="1" />
            <text x={M.left - 10} y={y(t)} dy="0.32em" textAnchor="end" fontSize="12" fill="var(--muted-foreground)" className="tabular-nums">
              {formatTick(t)}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const x = cx(i) - barW / 2
          const isActive = active === i
          return (
            <g
              key={d.key}
              tabIndex={0}
              role="img"
              aria-label={`${d.fullLabel}: ${formatValue(d.value)}`}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="cursor-default outline-none"
            >
              {/* Vuruş alanı: sütundan geniş, bandın tamamı */}
              <rect x={M.left + band * i} y={M.top} width={band} height={plotH} fill="transparent" />
              {d.value > 0 ? (
                <path d={columnPath(x, y(d.value), barW, base)} fill="var(--chart-1)" opacity={active === null || isActive ? 1 : 0.55} />
              ) : null}
              {isActive ? (
                <rect x={x - 4} y={y(d.value) - 4} width={barW + 8} height={base - y(d.value) + 4} rx="6" fill="none" stroke="var(--ring)" strokeWidth="2" />
              ) : null}
              {labelled.has(i) && d.value > 0 ? (
                <text x={cx(i)} y={y(d.value) - 8} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--foreground)">
                  {formatTick(d.value)}
                </text>
              ) : null}
              <text x={cx(i)} y={base + 20} textAnchor="middle" fontSize="12" fill="var(--muted-foreground)">
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>

      {active !== null ? (
        <div
          role="presentation"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md"
          style={{ left: Math.min(Math.max(cx(active), 80), width - 80), top: y(data[active].value) - 12 }}
        >
          <p className="font-semibold whitespace-nowrap tabular-nums">{formatValue(data[active].value)}</p>
          <p className="whitespace-nowrap text-muted-foreground">{data[active].fullLabel}</p>
        </div>
      ) : null}
    </div>
  )
}
