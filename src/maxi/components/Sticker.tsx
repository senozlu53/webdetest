import type { CSSProperties, ReactNode } from 'react'
import { starPath } from '../lib/shapes'
import { rootPos } from './Shapes'
import { sheen } from '../hooks/useSheen'
import { cx } from '../../shared/cx'

export type StickerShape = 'circle' | 'burst' | 'pill' | 'star'

/**
 * Madde 9: ikon yerine illüstratif çıkartma. Kalın beyaz kesim kenarı, sert gölge.
 * bg="holo" holografik folyo: imleç parlamayı sürükler.
 */
export function StickerFace({ shape, bg, fg, children, size = 92, className, style }: { shape: StickerShape; bg: string; fg: string; children: ReactNode; size?: number; className?: string; style?: CSSProperties }) {
  const holo = bg === 'holo'
  if (shape === 'pill')
    return (
      <span className={cx('sticker inline-flex items-center rounded-full px-4 py-2 font-sans text-[15px] leading-none font-black whitespace-nowrap uppercase [font-stretch:125%]', holo && 'holo', className)} style={{ background: holo ? undefined : bg, color: fg, ...style }} onPointerMove={holo ? sheen : undefined}>
        {children}
      </span>
    )
  if (shape === 'circle')
    return (
      <span className={cx('sticker inline-grid place-items-center rounded-full p-2 text-center font-serif text-[17px] leading-[0.95] font-black italic', holo && 'holo', className)} style={{ width: size, height: size, background: holo ? undefined : bg, color: fg, ...style }} onPointerMove={holo ? sheen : undefined}>
        <span className="wonk">{children}</span>
      </span>
    )
  const d = shape === 'star' ? starPath(50, 50, 48, 22, 5) : starPath(50, 50, 48, 38, 16)
  const id = `sf-${Math.abs(size * 13 + (typeof children === 'string' ? children.length : 1))}`
  return (
    <span className={cx(rootPos(className), 'inline-grid place-items-center', className)} style={{ width: size, height: size, ...style }}>
      <svg viewBox="-6 -6 112 112" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        {holo ? (
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff9ad5" />
              <stop offset="0.35" stopColor="#9fe8ff" />
              <stop offset="0.65" stopColor="#fff59a" />
              <stop offset="1" stopColor="#c6a8ff" />
            </linearGradient>
          </defs>
        ) : null}
        <path d={d} fill="#111014" transform="translate(3 4)" />
        <path d={d} fill={holo ? `url(#${id})` : bg} stroke="#fffdf7" strokeWidth={5} strokeLinejoin="round" paintOrder="stroke" />
      </svg>
      <span className="relative px-2 text-center font-sans text-[13px] leading-none font-black uppercase [font-stretch:115%]" style={{ color: fg }}>
        {children}
      </span>
    </span>
  )
}
