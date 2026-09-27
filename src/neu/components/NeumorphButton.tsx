import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../shared/cx'

type Shape = 'circle' | 'pill' | 'rounded'
type Size = 'sm' | 'md' | 'lg'

const SHAPE: Record<Shape, string> = {
  circle: 'rounded-full aspect-square justify-center',
  pill: 'rounded-full px-6',
  rounded: 'rounded-neu px-6',
}
const SIZE: Record<Size, string> = {
  sm: 'min-h-11 min-w-11 text-sm',
  md: 'min-h-14 min-w-14 text-base',
  lg: 'min-h-20 min-w-20 text-lg',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  shape?: Shape
  size?: Size
  /** Açma/kapama düğmesi: basılı kalır (aria-pressed) ve vurgu ışığı yanar */
  pressed?: boolean
  icon?: ReactNode
}

/**
 * Figma Variants: Default (iki dış gölge) · Pressed (iki iç gölge).
 * Durum yalnızca gölgeyle anlatılmaz: basılıyken metin/ikon vurgu rengine geçer ve LED yanar.
 */
export function NeumorphButton({ shape = 'pill', size = 'md', pressed, icon, className, children, type = 'button', ...rest }: Props) {
  const toggle = pressed !== undefined
  return (
    <button
      type={type}
      aria-pressed={toggle ? pressed : undefined}
      className={cx(
        'neu neu-raised neu-press relative inline-flex shrink-0 items-center gap-2.5 font-bold',
        SHAPE[shape],
        SIZE[size],
        pressed ? 'text-accent' : 'text-ink',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
      {toggle ? (
        <span
          aria-hidden="true"
          className={cx(
            'absolute size-1.5 rounded-full transition-colors duration-200',
            shape === 'circle' ? 'bottom-[18%] left-1/2 -translate-x-1/2' : 'top-2 right-3',
            pressed ? 'bg-accent shadow-[0_0_8px_var(--accent)]' : 'bg-neu-lo',
          )}
        />
      ) : null}
    </button>
  )
}
