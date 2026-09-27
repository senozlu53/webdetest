import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../shared/cx'

type Variant = 'solid' | 'outline' | 'accent'

const VARIANT: Record<Variant, string> = {
  solid: 'bg-ink text-paper border-ink hover:bg-accent hover:text-on-accent hover:border-accent',
  outline: 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper',
  accent: 'bg-accent text-on-accent border-accent hover:bg-ink hover:text-paper hover:border-ink',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  icon?: ReactNode
}

/** Keskin köşeli düğme. Durum değişimleri geçişsiz, anında. */
export function SwissButton({ variant = 'solid', icon, className, children, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex items-center justify-between gap-m border-2 px-s py-s text-left font-bold uppercase tracking-wider rounded-none cursor-pointer',
        'text-label disabled:cursor-not-allowed',
        VARIANT[variant],
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      {icon}
    </button>
  )
}
