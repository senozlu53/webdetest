import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../cx'

/** Tek sayı ya da [temel, md, lg] şeklinde duyarlı değer. */
export type Responsive = number | readonly [base: number, md?: number, lg?: number]

type Tag = 'div' | 'section' | 'header' | 'footer' | 'article' | 'aside' | 'nav' | 'ul' | 'ol' | 'li' | 'dl' | 'figure'

type GridProps = HTMLAttributes<HTMLElement> & {
  as?: Tag
  /** 'none' → kolonlar arası boşluk yok (çizgili hücreler için). */
  gap?: 'gutter' | 'none'
  children?: ReactNode
}

/** Kesin 12 kolonlu grid. Oluk: 8px (sm) · 16px (md) · 32px (lg). */
export function SwissGrid({ as = 'div', gap = 'gutter', className, children, ...rest }: GridProps) {
  const Component = as as ElementType
  return (
    <Component className={cx('swiss-grid', className)} data-gap={gap === 'none' ? 'none' : undefined} {...rest}>
      {children}
    </Component>
  )
}

type ColProps = HTMLAttributes<HTMLElement> & {
  as?: Tag
  /** Kaç kolon kaplayacağı (1–12). */
  span?: Responsive
  /** Hangi kolondan başlayacağı (1–12). Verilmezse akışa göre yerleşir. */
  start?: Responsive
  children?: ReactNode
}

const BREAKPOINTS = ['', '-md', '-lg'] as const

function toVars(name: 'span' | 'start', value: Responsive | undefined): Record<string, number> {
  if (value === undefined) return {}
  const values = typeof value === 'number' ? [value] : value
  const vars: Record<string, number> = {}
  values.forEach((v, i) => {
    if (v !== undefined) vars[`--${name}${BREAKPOINTS[i]}`] = v
  })
  return vars
}

export function SwissCol({ as = 'div', span, start, className, style, children, ...rest }: ColProps) {
  const Component = as as ElementType
  const vars = { ...toVars('span', span), ...toVars('start', start), ...style } as CSSProperties
  return (
    <Component className={cx('swiss-col', className)} style={vars} {...rest}>
      {children}
    </Component>
  )
}

SwissGrid.Col = SwissCol
