import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'

/**
 * Koruyucu gradyan (Madde 18). Metni saran katman; kenarları 40px'te eriyerek zemine karışır,
 * metin ise her zaman tam opak ortada durur. İçerik 40px'ten fazla iç boşlukla yerleşir.
 */
export function Scrim({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('relative p-10 md:p-12', className)}>
      <div aria-hidden="true" className="scrim-fade absolute inset-0 rounded-[48px]" />
      <div className="relative">{children}</div>
    </div>
  )
}
