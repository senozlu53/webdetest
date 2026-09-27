import { useState, type ComponentType } from 'react'
import type { IconProps } from '@phosphor-icons/react'
import { useElementWidth } from '../lib/useElementWidth'

export type Segment = { key: string; label: string; amount: number; color: string; Icon: ComponentType<IconProps> }

type Props = {
  segments: Segment[]
  formatValue: (v: number) => string
  formatPercent: (v: number) => string
}

const H = 20
const GAP = 2

/**
 * Parça-bütün: tek, %100 yığılmış yatay çubuk. Parçalar arasında 2px yüzey boşluğu,
 * dış uçlar 4px yuvarlak. Durum rengi hiçbir zaman tek başına değil: lejantta ikon + etiket + değer.
 */
export function StatusBar({ segments, formatValue, formatPercent }: Props) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const total = segments.reduce((a, s) => a + s.amount, 0) || 1
  const visible = segments.filter((s) => s.amount > 0)
  const usable = Math.max(0, width - GAP * (visible.length - 1))

  let x = 0
  const rects = segments.map((s) => {
    const w = s.amount > 0 ? (s.amount / total) * usable : 0
    const r = { x, w }
    if (w > 0) x += w + GAP
    return r
  })

  return (
    <div className="flex flex-col gap-5">
      <div ref={ref} className="relative w-full">
        <svg width={width} height={H} className="block" aria-hidden="true">
          <defs>
            <clipPath id="status-bar-clip">
              <rect x="0" y="0" width={width} height={H} rx="4" />
            </clipPath>
          </defs>
          <g clipPath="url(#status-bar-clip)">
            {segments.map((s, i) =>
              rects[i].w > 0 ? (
                <rect
                  key={s.key}
                  x={rects[i].x}
                  y="0"
                  width={rects[i].w}
                  height={H}
                  fill={s.color}
                  opacity={active === null || active === i ? 1 : 0.55}
                  onPointerEnter={() => setActive(i)}
                  onPointerLeave={() => setActive(null)}
                />
              ) : null,
            )}
          </g>
        </svg>
        {active !== null ? (
          <div
            className="pointer-events-none absolute bottom-full z-10 mb-2 -translate-x-1/2 rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md"
            style={{ left: Math.min(Math.max(rects[active].x + rects[active].w / 2, 90), width - 90) }}
          >
            <p className="font-semibold whitespace-nowrap tabular-nums">
              {formatValue(segments[active].amount)} · {formatPercent(segments[active].amount / total)}
            </p>
            <p className="whitespace-nowrap text-muted-foreground">{segments[active].label}</p>
          </div>
        ) : null}
      </div>

      <ul className="flex flex-col divide-y">
        {segments.map((s, i) => (
          <li
            key={s.key}
            className="flex min-h-11 items-center gap-3 py-2"
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
          >
            <s.Icon size={20} weight="fill" color={s.color} aria-hidden="true" className="shrink-0" />
            <span className="flex-1 text-sm">{s.label}</span>
            <span className="text-right font-semibold tabular-nums">{formatValue(s.amount)}</span>
            <span className="w-12 text-right text-sm text-muted-foreground tabular-nums">{formatPercent(s.amount / total)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
