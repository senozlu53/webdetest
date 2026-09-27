import type { AnchorHTMLAttributes } from 'react'
import { cx } from '../cx'

/** Minimalist altı çizili bağlantı. Hover'da çizgi anında kırmızıya ve 3px'e geçer. */
export function UnderlineLink({ className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cx('swiss-link', className)} {...rest} />
}
