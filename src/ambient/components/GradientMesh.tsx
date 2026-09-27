import { useRef, type HTMLAttributes, type ReactNode } from 'react'
import { useIdleOffscreen } from '../hooks/useIdleOffscreen'
import { cx } from '../../shared/cx'

type Props = HTMLAttributes<HTMLDivElement> & {
  palette?: 'aurora1' | 'aurora2'
  children?: ReactNode
}

/**
 * Dört radyal gradyan; merkezleri @property ile kayıtlı değişkenlerdir ve
 * @keyframes mesh-flow ile yer değiştirir (Madde 15). Ekrandan çıkınca durur.
 */
export function GradientMesh({ palette = 'aurora1', className, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useIdleOffscreen(ref)
  return (
    <div ref={ref} data-palette={palette} className={cx('gradient-mesh', className)} {...rest}>
      {children}
    </div>
  )
}
