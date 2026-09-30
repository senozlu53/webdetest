import { motion, useAnimationFrame, useMotionValue, useMotionValueEvent, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { useKinetic } from '../lib/store'
import { useEkranda, useKayit } from './hooks'
import { Dev } from './Harfler'

/**
 * <ImlecBaslik>: bölge içinde imleci (ya da dokunuşu) yaylı bir gecikmeyle izleyen dev başlık.
 * Dolgulu katman imleci yakından, çizgi katmanı daha geriden izler; iki katman arasındaki gecikme derinliği verir.
 * İmleç yokken başlık kendi kendine çok yavaş dolaşır; hareket kapalıyken ortada durur.
 */
export function ImlecBaslik({ metin, alt, boy = 'clamp(48px, 15vw, 240px)', yukseklik = 'min(72vh, 620px)', className, children }: { metin: string; alt?: string; boy?: string; yukseklik?: string; className?: string; children?: ReactNode }) {
  const { hareket, tam, hareketRef } = useKinetic()
  const bolge = useRef<HTMLDivElement>(null)
  const oge = useRef<HTMLDivElement>(null)
  const boyut = useRef({ w: 1, h: 1, tw: 1, th: 1 })
  const son = useRef(0)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.8 })
  const sy = useSpring(my, { stiffness: 90, damping: 18, mass: 0.8 })
  const gx = useSpring(mx, { stiffness: 38, damping: 14, mass: 1 })
  const gy = useSpring(my, { stiffness: 38, damping: 14, mass: 1 })
  const [ekranda, ekrandaRef] = useEkranda(bolge)
  useKayit('imlec-baslik', hareket && ekranda)
  useEffect(() => {
    const b = bolge.current
    const o = oge.current
    if (!b || !o) return
    const olc = () => {
      boyut.current = { w: b.clientWidth, h: b.clientHeight, tw: o.offsetWidth, th: o.offsetHeight }
    }
    olc()
    const ro = new ResizeObserver(olc)
    ro.observe(b)
    ro.observe(o)
    return () => ro.disconnect()
  }, [])
  // merkezden sapma; başlık bölgenin dışına taşmaz (başlık bölgeden geniş ise sıfır)
  const sap = (v: number, eksen: 'x' | 'y') => {
    const { w, h, tw, th } = boyut.current
    const yari = Math.max(0, ((eksen === 'x' ? w - tw : h - th) / 2) | 0)
    const m = eksen === 'x' ? w / 2 : h / 2
    return Math.max(-yari, Math.min(yari, v - m))
  }
  const x = useTransform(sx, (v) => sap(v, 'x'))
  const y = useTransform(sy, (v) => sap(v, 'y'))
  const gxx = useTransform(gx, (v) => sap(v, 'x') * 1.08)
  const gyy = useTransform(gy, (v) => sap(v, 'y') * 1.08)
  useMotionValueEvent(x, 'change', (v) => {
    if (bolge.current) bolge.current.dataset.imlecX = String(Math.round(v))
  })
  useMotionValueEvent(y, 'change', (v) => {
    if (bolge.current) bolge.current.dataset.imlecY = String(Math.round(v))
  })
  useAnimationFrame((t) => {
    if (!hareketRef.current || !ekrandaRef.current) return
    const { w, h } = boyut.current
    if (performance.now() - son.current < 2200) return
    if (!tam) return
    mx.set(w / 2 + Math.sin(t / 1900) * w * 0.34)
    my.set(h / 2 + Math.cos(t / 2500) * h * 0.3)
  })
  const izle = (e: React.PointerEvent) => {
    if (!hareketRef.current) return
    const r = bolge.current!.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
    son.current = performance.now()
  }
  const aktif = hareket
  return (
    <div ref={bolge} className={cx('relative overflow-clip', className)} style={{ height: yukseklik, touchAction: 'pan-y' }} onPointerMove={izle} onPointerDown={izle} data-imlec-baslik={aktif ? 'izliyor' : 'durgun'}>
      <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
        <motion.div className="w-[min(78%,1100px)]" style={aktif ? { x: gxx, y: gyy } : undefined}>
          <Dev metin={metin} boy={boy} className="kontur kontur-vurgu" ad="imlec-arka" />
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <motion.div ref={oge} className="w-[min(78%,1100px)]" style={aktif ? { x, y } : undefined}>
          <Dev metin={metin} boy={boy} efekt={['imlec']} ad="imlec-on" />
          {alt ? <p className="kicker mt-4 text-metin">{alt}</p> : null}
        </motion.div>
      </div>
      {children}
    </div>
  )
}
