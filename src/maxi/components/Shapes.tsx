import type { CSSProperties, ReactNode } from 'react'
import { blobPath, starPath } from '../lib/shapes'

/** Çağıran absolute/fixed verdiyse kökü relative yapma; iki konum sınıfı çakışınca relative kazanıyordu */
export const rootPos = (className?: string) => (className && /(^|\s)(absolute|fixed)(\s|$)/.test(className) ? '' : 'relative')

/** Yıldız patlaması: içinde metin taşıyabilir */
export function Starburst({ size = 140, fill = 'var(--lime)', stroke = '#111014', points = 14, inner = 0.78, children, className, style, textColor = '#111014' }: { size?: number; fill?: string; stroke?: string; points?: number; inner?: number; children?: ReactNode; className?: string; style?: CSSProperties; textColor?: string }) {
  return (
    <span className={`${rootPos(className)} inline-grid place-items-center ${className ?? ''}`} style={{ width: size, height: size, ...style }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <path d={starPath(50, 50, 49, 49 * inner, points)} fill={fill} stroke={stroke} strokeWidth={2.5} strokeLinejoin="miter" />
      </svg>
      {children ? (
        <span className="relative px-3 text-center leading-[0.95]" style={{ color: textColor }}>
          {children}
        </span>
      ) : null}
    </span>
  )
}

export function Blob({ seed = 1, size = 200, fill = 'var(--lilac)', stroke, className, style }: { seed?: number; size?: number; fill?: string; stroke?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} style={style} aria-hidden="true">
      <path d={blobPath(seed, 100, 100, 88, 8, 0.38)} fill={fill} stroke={stroke} strokeWidth={stroke ? 3 : 0} />
    </svg>
  )
}

/** Keskin üçgen */
export function Tri({ size = 120, fill = 'var(--orange)', className, style }: { size?: number; fill?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true">
      <path d="M50 4L97 94H3z" fill={fill} stroke="#111014" strokeWidth={3} strokeLinejoin="miter" />
    </svg>
  )
}

/** Esnetilmiş vektör: oran korunmaz, yıldız yatayda çekilir */
export function Stretched({ w = 260, h = 90, fill = 'var(--cyan)', className, style }: { w?: number; h?: number; fill?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={h} preserveAspectRatio="none" className={className} style={style} aria-hidden="true">
      <path d={starPath(50, 50, 48, 22, 5)} fill={fill} stroke="#111014" strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function Squiggle({ w = 220, color = 'var(--pink)', className, style }: { w?: number; color?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 220 40" width={w} height={(w * 40) / 220} className={className} style={style} aria-hidden="true">
      <path d="M4 20c14-22 26 22 40 0s26 22 40 0 26 22 40 0 26 22 40 0 26 22 40 0" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" />
    </svg>
  )
}
