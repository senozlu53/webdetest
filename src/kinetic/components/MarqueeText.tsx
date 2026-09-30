import { motion, useAnimationFrame, useMotionValue } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import { useKayma } from '../lib/kayma'
import { HIZ_PX, useKinetic } from '../lib/store'
import { useEkranda, useKayit } from './hooks'

/**
 * <MarqueeText>: sonsuz döngülü maruz şeridi. Taban hızı `hiz` (px/sn) belirler; `tepki` açıksa kaydırma hızı şeridi hızlandırır,
 * yukarı kaydırınca yön ters döner. Hareket kapalıyken şerit durur ve metin satır atlayarak tam okunur.
 */
export function MarqueeText({
  metin,
  hiz = HIZ_PX.normal,
  yon = 1,
  tepki = true,
  durHover = true,
  ayirac = '/',
  kontur = false,
  className,
  ad = 'marquee',
}: {
  metin: string
  /** taban hız, piksel/sn */
  hiz?: number
  /** 1: sola akar, −1: sağa akar */
  yon?: 1 | -1
  tepki?: boolean
  durHover?: boolean
  ayirac?: string
  kontur?: boolean
  className?: string
  ad?: string
}) {
  const { hareket, tam, hizCarpan, hareketRef } = useKinetic()
  const { yumusak } = useKayma()
  const kap = useRef<HTMLDivElement>(null)
  const birim = useRef<HTMLSpanElement>(null)
  const [kopya, setKopya] = useState(3)
  const birimGen = useRef(1)
  const x = useMotionValue(0)
  const ofset = useRef(0)
  const yonRef = useRef<number>(yon)
  const dur = useRef(false)
  useEffect(() => {
    yonRef.current = yon
  }, [yon])
  const [ekranda, ekrandaRef] = useEkranda(kap, '120px', hareket)
  useKayit(ad, hareket && ekranda)
  useLayoutEffect(() => {
    const k = kap.current
    const b = birim.current
    if (!k || !b) return
    const olc = () => {
      birimGen.current = Math.max(1, b.offsetWidth)
      setKopya(Math.max(2, Math.ceil(k.clientWidth / birimGen.current) + 1))
    }
    olc()
    const ro = new ResizeObserver(olc)
    ro.observe(k)
    ro.observe(b)
    return () => ro.disconnect()
  }, [hareket, metin, ayirac])
  useAnimationFrame((_, delta) => {
    if (!hareketRef.current || dur.current || !ekrandaRef.current) return
    const v = yumusak.get()
    if (tepki && tam && Math.abs(v) > 60) yonRef.current = Math.sign(v) * yon
    const boost = tepki && tam ? 1 + Math.min(4, (Math.abs(v) / 1000) * 4) : 1
    const px = hiz * hizCarpan * (tam ? 1 : 0.5) * boost
    ofset.current += yonRef.current * px * (delta / 1000)
    const u = birimGen.current
    x.set(-(((ofset.current % u) + u) % u))
  })
  if (!hareket) {
    return (
      <div className={cx('mq', className)} role="group" aria-label={metin} data-marquee="durgan" data-mq-hiz={hiz}>
        <p className={cx('mq-durgan', kontur && 'kontur')}>{metin}</p>
      </div>
    )
  }
  return (
    <div
      ref={kap}
      className={cx('mq', className)}
      role="group"
      aria-roledescription="kayan yazı"
      data-marquee="akiyor"
      data-mq-hiz={hiz}
      data-mq-yon={yon}
      data-mq-kopya={kopya}
      onPointerEnter={() => durHover && (dur.current = true)}
      onPointerLeave={() => (dur.current = false)}
      onFocus={() => durHover && (dur.current = true)}
      onBlur={() => (dur.current = false)}
    >
      <span className="sr-only">{metin}</span>
      <motion.div className="mq-iz" style={{ x }} aria-hidden="true" data-mq-iz="">
        {Array.from({ length: kopya }, (_, i) => (
          <span key={i} ref={i === 0 ? birim : undefined} className={cx('mq-birim', kontur && 'kontur')}>
            {metin}
            <span className="mq-ay">{ayirac}</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
