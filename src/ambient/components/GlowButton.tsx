import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../shared/cx'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'glow' | 'ghost'; icon?: ReactNode }

/** Parlayan çerçeveli düğme: dönen konik degrade kenar, hover'da yayılan ışık. */
export function GlowButton({ variant = 'glow', icon, className, children, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-normal tracking-wide text-ink transition-[background-color] duration-500 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'glow' ? 'glow-border bg-scrim' : 'border border-line hover:bg-scrim',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
