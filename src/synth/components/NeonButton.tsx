import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from '../../shared/cx'

export type Renk = 'pink' | 'cyan' | 'turuncu'

/**
 * Madde 11 · 14: <NeonButton>. 2px neon tüp çerçeve, üç katmanlı hale (2 · 4 · 12 px), yazı Bold mono.
 * Üstüne gelince tüp dolar ve yazı gece moruna döner (renk tek başına durum söylemesin diye dolu hali aria-pressed ile de verilir).
 */
export function NeonButton({ renk = 'pink', boy, dolu, ikon, className, children, type = 'button', ref, ...rest }: { renk?: Renk; boy?: 'k' | 'b'; dolu?: boolean; ikon?: ReactNode; children: ReactNode; ref?: Ref<HTMLButtonElement> } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button ref={ref} type={type} data-renk={renk} data-boy={boy} data-dolu={dolu ? '' : undefined} className={cx('nbtn', className)} {...rest}>
      {ikon}
      {children}
    </button>
  )
}
