import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../hooks/useInView'
import { cx } from '../../shared/cx'

type Props = { as?: 'div' | 'li' | 'section' | 'article'; i?: number; className?: string; style?: CSSProperties; children: ReactNode }

/** Ekrana girerken esneyip yerine oturan kapsayıcı (Madde 16). `i` sıradaki gecikmeyi verir. */
export function Pop({ as = 'div', i = 0, className, style, children }: Props) {
  const ref = useInView<HTMLElement>()
  const Component = as as ElementType
  return (
    <Component ref={ref} className={cx('pop', className)} style={{ '--i': i, ...style } as CSSProperties}>
      {children}
    </Component>
  )
}
