import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../shared/cx'

type Variant = 'primary' | 'accent' | 'soft' | 'ghost'
type Size = 'md' | 'lg'

const VARIANT: Record<Variant, string> = {
  primary: 'bg-ink text-canvas hover:shadow-float',
  accent: 'bg-gold text-on-gold hover:shadow-float',
  soft: 'bg-sand text-ink hover:bg-glow',
  ghost: 'bg-transparent text-ink border border-field hover:bg-sand',
}

const SIZE: Record<Size, string> = {
  md: 'px-6 py-3 text-small',
  lg: 'px-7 py-3.5 text-body',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  icon?: ReactNode
}

/** Hap formunda düğme. Durum değişimleri 400ms ease-in-out. */
export function PillButton({ variant = 'primary', size = 'md', icon, className, children, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex items-center justify-center gap-2.5 rounded-pill font-medium tracking-wide cursor-pointer',
        'transition-[background-color,box-shadow,transform] duration-400 ease-soft hover:-translate-y-px',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...rest}
    >
      {children}
      {icon}
    </button>
  )
}
