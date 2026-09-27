import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../shared/cx'

type Variant = 'primary' | 'glass' | 'ghost'

const VARIANT: Record<Variant, string> = {
  primary: 'text-(--primary-text) shadow-glass [background-image:linear-gradient(120deg,var(--primary-from),var(--primary-to))] hover:brightness-110',
  glass: 'glass text-ink hover:bg-glass-strong',
  ghost: 'text-ink hover:bg-glass-subtle',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; icon?: ReactNode }

export function GlassButton({ variant = 'primary', icon, className, children, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold',
        'transition-[filter,background-color,transform] duration-300 ease-glass active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
