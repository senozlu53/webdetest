import { createElement, type ReactNode } from 'react'
import { useAyar } from '../lib/ayar'

/**
 * Madde 16: doksanların <marquee> etiketi, olduğu gibi. React'in tiplerinde olmadığı için createElement ile.
 * Hareket kapalıyken durdurulmuş bir marquee yazıyı kutunun dışında bırakabilir; bu yüzden düz paragrafa döner.
 */
export function Kayan({ children, behavior = 'scroll', direction = 'left', scrollamount = 6 }: { children: ReactNode; behavior?: 'scroll' | 'slide' | 'alternate'; direction?: 'left' | 'right' | 'up' | 'down'; scrollamount?: number }) {
  const dikey = direction === 'up' || direction === 'down'
  const { hareket } = useAyar()
  if (!hareket) return <p>{children}</p>
  return createElement('marquee', { behavior, direction, scrollamount, height: dikey ? 96 : undefined }, children)
}
