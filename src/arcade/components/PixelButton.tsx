import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { Ton } from '../lib/data'

/** Arcade düğmesi: ton dolgusu, siyah Press Start yazısı, piksel kabartma; basınca gölgesine iner (Madde 7) */
export function PixelButton({ ton = 'sari', boy, ikon, className, children, type = 'button', ...rest }: { ton?: Ton; boy?: 'k' | 'b'; ikon?: ReactNode; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} data-ton={ton} data-boy={boy} className={cx('pbtn', className)} {...rest}>
      {ikon}
      {children}
    </button>
  )
}
