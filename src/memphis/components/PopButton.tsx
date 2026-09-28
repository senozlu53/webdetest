import type { ButtonHTMLAttributes, MouseEvent, ReactNode, Ref } from 'react'
import { cx } from '../../shared/cx'
import type { Ton } from '../lib/data'
import { konfetiPatlat } from './KonfetiKatmani'

/**
 * Madde 11 · 14 · 16: <PopButton>. Hap formu, 4px kontur, katı gölge. Üstüne gelince yayla büyür (linear() yay eğrisi),
 * basınca gölgesine iner ve biraz ezilir. konfeti: tıklanınca tıklama noktasından konfeti saçar (hareket açıksa).
 */
export function PopButton({ ton = 'sari', boy, ikon, konfeti, className, children, onClick, type = 'button', ref, ...rest }: { ton?: Ton; boy?: 'k' | 'b'; ikon?: ReactNode; konfeti?: boolean; children: ReactNode; ref?: Ref<HTMLButtonElement> } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      ref={ref}
      type={type}
      data-ton={ton}
      data-boy={boy}
      className={cx('pop', className)}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        if (konfeti) {
          const r = e.currentTarget.getBoundingClientRect()
          konfetiPatlat(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2)
        }
        onClick?.(e)
      }}
      {...rest}
    >
      {ikon}
      {children}
    </button>
  )
}
