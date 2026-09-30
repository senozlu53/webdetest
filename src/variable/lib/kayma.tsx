import { createContext, useContext, type ReactNode } from 'react'
import { useScroll, useSpring, useVelocity, type MotionValue } from 'motion/react'

interface KaymaCtx {
  /** sayfa kaydırma konumu (px) */
  scrollY: MotionValue<number>
  /** anlık kaydırma hızı (px/sn), işaretli: aşağı +, yukarı − */
  hiz: MotionValue<number>
  /** yaylı yumuşatılmış hız: metin esnemesinin kaynağı */
  yumusak: MotionValue<number>
  /** sayfa ilerlemesi 0–1 */
  ilerleme: MotionValue<number>
}
const C = createContext<KaymaCtx | null>(null)

/** Kaydırma hızı bir kez ölçülür ve bütün kinetik bileşenlere MotionValue olarak dağıtılır (Framer Motion) */
export function KaymaProvider({ children }: { children: ReactNode }) {
  const { scrollY, scrollYProgress } = useScroll()
  const hiz = useVelocity(scrollY)
  const yumusak = useSpring(hiz, { damping: 50, stiffness: 400 })
  return <C.Provider value={{ scrollY, hiz, yumusak, ilerleme: scrollYProgress }}>{children}</C.Provider>
}

export function useKayma() {
  const v = useContext(C)
  if (!v) throw new Error('KaymaProvider yok')
  return v
}
