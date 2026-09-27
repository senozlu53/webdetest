import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from '../../shared/cx'
import { useTilt } from '../useTilt'

type Props = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'section' | 'aside' | 'li' | 'figure' | 'header' | 'nav' | 'form'
  /** Effects/BackdropBlur: sm 8 · md 16 · lg 24 · xl 40 (mobilde yarıya iner) */
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  /** subtle: yalnızca süsleme, metin taşımaz · panel: metin taşır (AA) · strong: yoğun metin */
  tone?: 'subtle' | 'panel' | 'strong'
  /** Holografik 1px kenar */
  holo?: boolean
  /** Fareyle eğilme ve parlama */
  tilt?: boolean
  children?: ReactNode
}

/** Buzlu cam paneli: backdrop blur + yarı saydam dolgu + 1px kenar + 1px iç parlama + yayvan gölge. */
export function GlassCard({ as = 'div', blur = 'lg', tone = 'panel', holo, tilt, className, children, ...rest }: Props) {
  const tiltRef = useTilt<HTMLElement>()
  const Component = as as ElementType
  return (
    <Component
      ref={tilt ? (tiltRef as Ref<HTMLElement>) : undefined}
      data-blur={blur}
      data-tone={tone}
      data-holo={holo ? '' : undefined}
      className={cx('glass rounded-glass', tilt && 'glass-tilt glass-glare', className)}
      {...rest}
    >
      {children}
    </Component>
  )
}
