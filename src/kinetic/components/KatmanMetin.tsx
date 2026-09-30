import { motion, useAnimationFrame, useMotionValue, useMotionValueEvent, useSpring } from 'motion/react'
import { useRef, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { useKinetic } from '../lib/store'
import { useEkranda, useKayit, useSaat } from './hooks'

/**
 * <KatmanMetin>: aynı metnin Z ekseninde dizilmiş kopyaları. Ön katman dolu beyaz, aradakiler kademeli soluklaşan çizgi,
 * en arkadaki vurgu rengi. Gölge yok; derinliği perspektif, katman aralığı ve döndürme verir.
 * İmleç (ya da sürükleme) sahneyi döndürür, imleç yokken sahne yavaşça salınır; hareket kapalıyken sabit bir açıda durur.
 */
export function KatmanMetin({ metin, katman = 8, aralik = 40, boy = 'clamp(56px, 12.5vw, 176px)', yukseklik = 'clamp(260px, 44vw, 480px)', className }: { metin: string; katman?: number; aralik?: number; boy?: string; yukseklik?: string; className?: string }) {
  const { hareket, tam, hareketRef } = useKinetic()
  const sahne = useRef<HTMLDivElement>(null)
  const zaman = useRef<HTMLDivElement>(null)
  const son = useRef(0)
  const hx = useMotionValue(-14)
  const hy = useMotionValue(24)
  const rx = useSpring(hx, { stiffness: 80, damping: 16 })
  const ry = useSpring(hy, { stiffness: 80, damping: 16 })
  const [ekranda, ekrandaRef] = useEkranda(sahne)
  const oynuyor = hareket && tam
  useSaat(zaman, 'z-katman', oynuyor)
  useKayit('z-donme', oynuyor && ekranda)
  useMotionValueEvent(ry, 'change', (v) => {
    if (sahne.current) sahne.current.dataset.ry = v.toFixed(1)
  })
  useMotionValueEvent(rx, 'change', (v) => {
    if (sahne.current) sahne.current.dataset.rx = v.toFixed(1)
  })
  useAnimationFrame((t) => {
    if (!oynuyor || !ekrandaRef.current) return
    if (performance.now() - son.current < 2200) return
    hy.set(24 + Math.sin(t / 2100) * 34)
    hx.set(-14 + Math.sin(t / 3300) * 9)
  })
  const izle = (e: React.PointerEvent) => {
    if (!hareketRef.current || !tam) return
    const r = sahne.current!.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    hy.set((nx - 0.5) * 90)
    hx.set((0.5 - ny) * 50)
    son.current = performance.now()
  }
  const yarim = (katman - 1) / 2
  return (
    <div ref={sahne} className={cx('z-sahne', className)} style={{ height: yukseklik }} onPointerMove={izle} onPointerDown={izle} data-z-sahne="" data-katman={katman} data-aralik={aralik} data-z-durum={oynuyor ? 'doner' : 'sabit'}>
      <motion.div ref={zaman} className="z-dondur h-full" style={oynuyor ? { rotateX: rx, rotateY: ry } : undefined}>
        <span className="sr-only">{metin}</span>
        {Array.from({ length: katman }, (_, i) => {
          const on = i === katman - 1
          const arka = i === 0
          const oran = katman === 1 ? 1 : i / (katman - 1)
          const stil = {
            ['--zb' as string]: (i - yarim) * aralik,
            ['--k' as string]: i,
            ['--osc' as string]: oynuyor ? aralik * 0.4 : 0,
            opacity: on ? 1 : arka ? 1 : 0.18 + oran * 0.5,
          } as CSSProperties
          return (
            <div key={i} className="z-katman" style={stil} aria-hidden="true" data-z-katman={i}>
              <span className={cx('dev', !on && 'kontur', arka && 'kontur-vurgu')} style={{ fontSize: boy }}>
                {metin}
              </span>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
