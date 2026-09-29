import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from '../../shared/cx'

/** Madde 14: <GoldBorderButton>. İnce altın gradyan çerçeve, iç ince çerçeve; üstüne gelince dolgu ortadan iki yana simetrik açılır */
export function GoldBorderButton({ ana, boy, ikon, className, children, type = 'button', ref, ...rest }: { ana?: boolean; boy?: 'k' | 'b'; ikon?: ReactNode; children?: ReactNode; ref?: Ref<HTMLButtonElement> } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button ref={ref} type={type} data-ana={ana ? '' : undefined} data-boy={boy} className={cx('gbtn', className)} {...rest}>
      {ikon}
      {children}
    </button>
  )
}
