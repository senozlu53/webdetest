import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'

export type TagFill = 'yellow' | 'red' | 'blue' | 'green' | 'pink' | 'surface' | 'ink'
const FILL: Record<TagFill, string> = { yellow: 'fill-yellow', red: 'fill-red', blue: 'fill-blue', green: 'fill-green', pink: 'fill-pink', surface: 'bg-surface text-ink', ink: 'fill-ink' }

/** Madde 11: büyük etiket. Hafif döndürülmüş "çıkartma" için tilt */
export function Tag({ fill = 'yellow', size = 'm', tilt, className, children }: { fill?: TagFill; size?: 's' | 'm' | 'l'; tilt?: number; className?: string; children: ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-brut border-[3px] border-line font-display font-extrabold whitespace-nowrap uppercase [font-stretch:110%]',
        size === 's' ? 'px-2 py-0.5 text-[12px]' : size === 'l' ? 'px-4 py-1.5 text-[22px] brut-shadow-sm' : 'px-3 py-1 text-[15px]',
        FILL[fill],
        className,
      )}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      {children}
    </span>
  )
}
