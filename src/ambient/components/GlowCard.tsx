import { useRef, type ElementType, type HTMLAttributes, type PointerEvent, type ReactNode } from 'react'
import { cx } from '../../shared/cx'

type Props = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'section' | 'li' | 'figure' | 'form'
  children?: ReactNode
}

/** Klasik gölge yok: kenarda imleci izleyen ışık, içeride yayılan hafif parıltı. */
export function GlowCard({ as = 'div', className, children, onPointerMove, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)
  const Component = as as ElementType
  const move = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (el) {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--px', `${e.clientX - r.left}px`)
      el.style.setProperty('--py', `${e.clientY - r.top}px`)
    }
    onPointerMove?.(e)
  }
  return (
    <Component ref={ref} onPointerMove={move} className={cx('glow-card rounded-[28px]', className)} {...rest}>
      {children}
    </Component>
  )
}
