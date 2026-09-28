import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { Ton } from '../lib/data'

type Props<T extends ElementType> = {
  as?: T
  /** Kenar rengi; yoksa beyaz (Kılavuz'da siyah) */
  ton?: Ton
  /** Ton rengiyle dolu zemin, üstünde siyah metin */
  dolu?: boolean
  /** Blok gölge, sanal piksel cinsinden (0–4). Bulanıklık yok */
  golge?: 0 | 1 | 2 | 3 | 4
  /** Köşe basamağı: 1 (NES penceresi) ya da 2 (büyük panel) */
  basamak?: 1 | 2
  className?: string
  style?: CSSProperties
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'style' | 'children'>

/**
 * Madde 6 · 7 · 14: <PixelContainer>. Merdiven köşeli, 1 piksel kenarlı, katı blok gölgeli kutu.
 * Kenar ve gölge box-shadow bantlarıdır (bkz. .px): içerik kırpılmaz, metne gölge düşmez, odak halkası görünür kalır.
 */
export function PixelContainer<T extends ElementType = 'div'>({ as, ton, dolu, golge = 2, basamak = 1, className, style, children, ...rest }: Props<T>) {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag className={cx('px', className)} data-ton={ton} data-dolu={dolu ? '' : undefined} data-golge={golge === 2 ? undefined : String(golge)} data-basamak={basamak === 2 ? '2' : undefined} style={style} {...rest}>
      {children}
    </Tag>
  )
}
