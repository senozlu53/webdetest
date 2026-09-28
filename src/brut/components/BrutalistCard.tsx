import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'

export type CardFill = 'surface' | 'yellow' | 'red' | 'blue' | 'green' | 'pink'
const FILL: Record<CardFill, string> = { surface: 'bg-surface text-ink', yellow: 'fill-yellow', red: 'fill-red', blue: 'fill-blue', green: 'fill-green', pink: 'fill-pink' }

/**
 * <BrutalistCard> (Madde 11 · 14): 3px çerçeve, 6/6/0 gölge. interactive: üstüne gelince 3px yukarı sekip gölge 9px olur.
 * Asimetrik iç boşluk (Madde 12): üst 20, sağ 28, alt 24, sol 20.
 */
export function BrutalistCard({ fill = 'surface', interactive, className, children, as: Tag = 'div', shadow = 'md' }: { fill?: CardFill; interactive?: boolean; className?: string; children: ReactNode; as?: 'div' | 'article' | 'li' | 'section'; shadow?: 'sm' | 'md' | 'lg' | 'none' }) {
  return (
    <Tag
      className={cx(
        'relative min-w-0 rounded-brut border-[3px] border-line pt-5 pr-7 pb-6 pl-5',
        shadow === 'sm' ? 'brut-shadow-sm' : shadow === 'lg' ? 'brut-shadow-lg' : shadow === 'md' ? 'brut-shadow' : '',
        interactive && 'snap lift',
        FILL[fill],
        className,
      )}
    >
      {children}
    </Tag>
  )
}
