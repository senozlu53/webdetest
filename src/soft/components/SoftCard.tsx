import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../shared/cx'

type Blur = 'none' | 'sm' | 'md'
type Elevation = 'flat' | 'rest' | 'soft' | 'float'
type Padding = 'none' | 'compact' | 'card'

const BLUR: Record<Blur, string> = {
  none: 'bg-float-solid',
  sm: 'bg-float backdrop-blur-sm',
  md: 'bg-float backdrop-blur-md',
}

const ELEVATION: Record<Elevation, string> = {
  flat: '',
  rest: 'shadow-rest',
  soft: 'shadow-soft',
  float: 'shadow-float',
}

/** Figma Auto Layout: P 32px 48px. Mobilde 24px 28px. */
const PADDING: Record<Padding, string> = {
  none: '',
  compact: 'px-7 py-6',
  card: 'px-7 py-6 md:px-12 md:py-8',
}

type Props = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'section' | 'aside' | 'li' | 'figure' | 'form'
  /** Arka planı bulanıklaştıran yarı saydam yüzey. 'none' → mat, dolu yüzey. */
  blur?: Blur
  elevation?: Elevation
  padding?: Padding
  children?: ReactNode
}

/** Yüzen kart: 24px yarıçap, geniş ve dağınık gölge, isteğe bağlı buzlu cam. */
export function SoftCard({
  as = 'div',
  blur = 'sm',
  elevation = 'float',
  padding = 'card',
  className,
  children,
  ...rest
}: Props) {
  const Component = as as ElementType
  return (
    <Component
      className={cx('rounded-card border border-line/60', BLUR[blur], ELEVATION[elevation], PADDING[padding], className)}
      {...rest}
    >
      {children}
    </Component>
  )
}
