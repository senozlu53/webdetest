import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'

/**
 * Madde 6 · 14: oval balon kapsayıcı. Krom çerçeve (kalınlık --cb: masaüstü 5px, mobil 3px), üstte plastik parlama.
 */
export function Y2KCard({ as: Tag = 'article', className, children, id, labelledBy }: { as?: 'article' | 'section' | 'div' | 'li' | 'aside'; className?: string; children: ReactNode; id?: string; labelledBy?: string }) {
  return (
    <Tag id={id} aria-labelledby={labelledBy} className={cx('rim shine rounded-[36px] p-5 text-ink md:p-6', className)}>
      {children}
    </Tag>
  )
}
