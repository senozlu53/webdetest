import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from '../../shared/cx'

export type Ton = 'kan' | 'demir' | 'hayalet'

/** Gotik düğme: sivri uçlu, perçinli demir levha. Üzerine gelince kırmızı ışık iç kenardan yükselir. */
export function Dugme({
  ton = 'kan',
  dar = false,
  className,
  children,
  type = 'button',
  ...rest
}: {
  ton?: Ton
  dar?: boolean
  children: ReactNode
  ref?: Ref<HTMLButtonElement>
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} data-ton={ton} className={cx('gd', dar && 'gd-dar', className)} {...rest}>
      {children}
    </button>
  )
}
export function DugmeLink({
  ton = 'kan',
  dar = false,
  className,
  children,
  ...rest
}: {
  ton?: Ton
  dar?: boolean
  children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a data-ton={ton} className={cx('gd', dar && 'gd-dar', className)} {...rest}>
      {children}
    </a>
  )
}
