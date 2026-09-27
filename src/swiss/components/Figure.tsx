import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'

type Props = {
  number: number | string
  caption: string
  className?: string
  /** Görsel alanın en-boy oranı. Varsayılan tam kare. */
  ratio?: string
  children: ReactNode
}

/**
 * Nesnel görsel çerçevesi. Fotoğraflar filtresiz ve yüksek kontrastlı kullanılır:
 * `object-fit: cover`, filtre yok, köşe yarıçapı yok, gölge yok.
 */
export function Figure({ number, caption, className, ratio = '1 / 1', children }: Props) {
  return (
    <figure className={cx('m-0 flex flex-col gap-xs', className)}>
      <div className="relative w-full max-w-full overflow-hidden bg-mute" style={{ aspectRatio: ratio }}>
        {children}
      </div>
      <figcaption className="flex gap-s text-label">
        <span className="shrink-0 font-bold tabular-nums">Şek. {number}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  )
}
