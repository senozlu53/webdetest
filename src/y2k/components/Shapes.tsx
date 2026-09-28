import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../shared/cx'

/** Çağıran absolute/fixed verdiyse kök relative olmaz (iki konum sınıfı çakışınca relative kazanır) */
const kok = (c?: string) => (c && /(^|\s)(absolute|fixed)(\s|$)/.test(c) ? '' : 'relative')

export function starPath(cx0: number, cy: number, ro: number, ri: number, n: number, rot = -90) {
  let d = ''
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? ri : ro
    const a = ((rot + (i * 180) / n) * Math.PI) / 180
    d += `${i ? 'L' : 'M'}${(cx0 + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`
  }
  return d + 'Z'
}

/** Madde 6: yıldız patlaması. İçindeki metin siyah; dolgu krom ya da pembe gradyan */
export function Starburst({ size = 110, points = 16, ton = 'candy', children, className, style }: { size?: number; points?: number; ton?: 'candy' | 'chrome' | 'icy'; children?: ReactNode; className?: string; style?: CSSProperties }) {
  const id = `sb-${ton}`
  const stops = ton === 'candy' ? ['#ffd1f0', '#ff66cc', '#d12c93'] : ton === 'icy' ? ['#ffffff', '#a5f2f3', '#4fc2c6'] : ['#ffffff', '#b0c4de', '#778899']
  return (
    <span className={cx(kok(className), 'inline-grid place-items-center', className)} style={{ width: size, height: size, ...style }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={stops[0]} />
            <stop offset="0.55" stopColor={stops[1]} />
            <stop offset="1" stopColor={stops[2]} />
          </linearGradient>
        </defs>
        <path d={starPath(50, 50, 49, 38, points)} fill={`url(#${id})`} stroke="#1b1530" strokeWidth="1.6" strokeLinejoin="round" />
        <ellipse cx="44" cy="34" rx="24" ry="11" fill="#ffffff" opacity="0.4" />
      </svg>
      {children ? <span className="relative px-2 text-center font-logo text-[12px] leading-tight text-black uppercase">{children}</span> : null}
    </span>
  )
}

/** Asimetrik elips: iki eksen ve açı farklı, yarı saydam plastik */
export function Ellipse({ w = 220, h = 120, rot = -18, fill = 'var(--pink)', className, style }: { w?: number; h?: number; rot?: number; fill?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={className} style={style} aria-hidden="true">
      <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 4} ry={h / 2 - 4} fill={fill} transform={`rotate(${rot} ${w / 2} ${h / 2})`} opacity="0.8" />
      <ellipse cx={w * 0.4} cy={h * 0.32} rx={w * 0.22} ry={h * 0.1} fill="#ffffff" opacity="0.55" transform={`rotate(${rot} ${w / 2} ${h / 2})`} />
    </svg>
  )
}

/** Oval balon: sabun köpüğü gibi saydam, üstte parlama */
export function Bubble({ size = 80, className, style }: { size?: number; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={cx('pointer-events-none block rounded-full', className)}
      style={{
        width: size,
        height: size * 0.86,
        background: 'radial-gradient(circle at 32% 28%, rgb(255 255 255 / 0.95) 0 9%, rgb(255 255 255 / 0.25) 10% 30%, transparent 55%), radial-gradient(circle at 70% 75%, rgb(255 102 204 / 0.35), transparent 50%), rgb(165 242 243 / 0.25)',
        boxShadow: 'inset 0 0 0 1.5px rgb(255 255 255 / 0.8), inset 0 -6px 14px rgb(46 8 84 / 0.18)',
        ...style,
      }}
      aria-hidden="true"
    />
  )
}

/** Madde 2: CD-ROM */
export function CD({ size = 120, className, style }: { size?: number; className?: string; style?: CSSProperties }) {
  return <span className={cx('cd block shrink-0', kok(className), className)} style={{ width: size, height: size, ...style }} aria-hidden="true" />
}
