import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from '../../shared/cx'

type Size = 'hero' | 'display' | 'h2' | 'h3'

const SIZE: Record<Size, string> = {
  hero: 'text-hero',
  display: 'text-display',
  h2: 'text-h2',
  h3: 'text-h3',
}

type Props = HTMLAttributes<HTMLElement> & {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  size?: Size
  ref?: Ref<HTMLElement>
  children?: ReactNode
}

/**
 * Devasa, kalın, büyük harfli başlık.
 * `font-sans font-black uppercase tracking-tighter rounded-none`
 * Büyük harfe çevirmenin Türkçe kurallara (i → İ) uyması için sayfa `lang="tr"` olmalıdır.
 */
export function TypographyDisplay({ as = 'h2', size = 'display', className, children, ...rest }: Props) {
  const Component = as as ElementType
  return (
    <Component
      className={cx('font-sans font-black uppercase tracking-tighter rounded-none', SIZE[size], className)}
      {...rest}
    >
      {children}
    </Component>
  )
}
