import { motion, useTransform } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { useKayma } from '../lib/kayma'
import { useKinetic } from '../lib/store'

/**
 * Kaydırma hızıyla eğilen ve esneyen sarmalayıcı (Madde 16): hız arttıkça `skewX` ve `scaleX` büyür, yön değişince eğim ters döner.
 * Hareket kapalıyken ya da hafif şiddette hiçbir dönüşüm uygulanmaz.
 */
export function Kayma({ children, egim = 10, esnet = 1.06, ters = false, className, style }: { children: ReactNode; egim?: number; esnet?: number; ters?: boolean; className?: string; style?: CSSProperties }) {
  const { yumusak } = useKayma()
  const { hareket, tam } = useKinetic()
  const d = ters ? -1 : 1
  const skewX = useTransform(yumusak, [-3000, 0, 3000], [egim * d, 0, -egim * d])
  const scaleX = useTransform(yumusak, [-3000, 0, 3000], [esnet, 1, esnet])
  const aktif = hareket && tam
  return (
    <motion.div className={className} style={aktif ? { skewX, scaleX, transformOrigin: '0% 50%', ...style } : style} data-kayma={aktif ? 'acik' : 'kapali'}>
      {children}
    </motion.div>
  )
}
