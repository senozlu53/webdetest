import { useId } from 'react'

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
}
function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const [x1, y1] = polar(cx, cy, r, from)
  const [x2, y2] = polar(cx, cy, r, to)
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

/**
 * Havada asılı asimetrik gösterge (Madde 6): yay 250°, başlangıcı sola kaymış; değer yayı parlar,
 * ince tik çizgileri ölçeği verir. Değer metin olarak da okunur (role="meter").
 */
export function Gauge({
  value,
  max = 100,
  label,
  display,
  unit,
  size = 132,
  tone = 'cyan',
}: {
  value: number
  max?: number
  label: string
  display: string
  unit?: string
  size?: number
  tone?: 'cyan' | 'blue'
}) {
  const id = useId()
  const from = -150
  const sweep = 250
  const t = Math.max(0, Math.min(1, value / max))
  const c = size / 2
  const r = c - 10
  const color = tone === 'cyan' ? 'var(--cyan-text)' : 'var(--blue-text)'
  return (
    <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.round(value)} aria-valuetext={`${display}${unit ? ` ${unit}` : ''}`} className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="absolute inset-0" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-g`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="var(--cyan)" />
            <stop offset="1" stopColor={tone === 'cyan' ? 'var(--cyan-text)' : 'var(--blue)'} />
          </linearGradient>
        </defs>
        <path d={arc(c, c, r, from, from + sweep)} fill="none" stroke="var(--line-soft)" strokeWidth={6} strokeLinecap="round" />
        {Array.from({ length: 26 }, (_, i) => {
          const d = from + (sweep / 25) * i
          const [x1, y1] = polar(c, c, r - 9, d)
          const [x2, y2] = polar(c, c, r - (i % 5 === 0 ? 15 : 12), d)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line)" strokeWidth={i % 5 === 0 ? 1.2 : 0.8} />
        })}
        {t > 0.005 ? (
          <path
            d={arc(c, c, r, from, from + sweep * t)}
            fill="none"
            stroke={`url(#${id}-g)`}
            strokeWidth={6}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px var(--glow-strong))', transition: 'd 400ms ease' }}
          />
        ) : null}
        {(() => {
          const [x, y] = polar(c, c, r, from + sweep * t)
          return <circle cx={x} cy={y} r={3.5} fill="var(--bg)" stroke={color} strokeWidth={1.5} />
        })()}
      </svg>
      <div className="relative flex flex-col items-center leading-none">
        <span className="text-[28px] font-[300] tabular-nums" style={{ color }}>
          {display}
        </span>
        {unit ? <span className="mt-1 font-tech text-[12px] text-muted">{unit}</span> : null}
        <span className="mt-2 max-w-[9ch] text-center font-tech text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">{label}</span>
      </div>
    </div>
  )
}
