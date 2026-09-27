import type { CSSProperties } from 'react'

export type Blip = { id: string; angle: number; dist: number; tone: 'cyan' | 'magenta' | 'yesil' }

/** Dönen taramalı radar. Tarama bir kama; halkalar ve çizgiler ince neon. Süstür, veri listesi yanında verilir. */
export function Radar({ blips, size = 220, className }: { blips: Blip[]; size?: number; className?: string }) {
  const c = 100
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--cyan)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--cyan)" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="var(--cyan)" strokeWidth="1" opacity="0.7">
        {[88, 64, 40, 16].map((r) => (
          <circle key={r} cx={c} cy={c} r={r} opacity={r === 88 ? 1 : 0.5} />
        ))}
        <path d="M100 8v184M8 100h184" opacity="0.35" />
        <path d="M37.8 37.8l124.4 124.4M162.2 37.8L37.8 162.2" opacity="0.2" strokeDasharray="2 4" />
      </g>
      <g className="radar-sweep" style={{ transformOrigin: '100px 100px' } as CSSProperties}>
        <path d="M100 100 L188 100 A88 88 0 0 0 176.2 56 Z" fill="url(#sweep)" />
        <path d="M100 100 L188 100" stroke="var(--cyan)" strokeWidth="1.5" />
      </g>
      {blips.map((b) => {
        const a = (b.angle * Math.PI) / 180
        const x = c + Math.cos(a) * b.dist * 88
        const y = c - Math.sin(a) * b.dist * 88
        return (
          <g key={b.id} className="glow-cyan">
            <circle cx={x} cy={y} r="3" fill={`var(--${b.tone})`} />
            <circle cx={x} cy={y} r="7" fill="none" stroke={`var(--${b.tone})`} strokeWidth="0.75" opacity="0.6" />
          </g>
        )
      })}
    </svg>
  )
}
