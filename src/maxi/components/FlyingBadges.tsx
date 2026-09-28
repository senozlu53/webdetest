import { useEffect, useRef } from 'react'
import { BADGES } from '../lib/data'
import { useMaxi } from '../lib/store'
import { useMedia } from '../hooks/useMedia'
import { StickerFace } from './Sticker'

/** Bildirimde koyu metin: mavi ve mor zeminde okunmaz, leylak kullanılır */
export const badgeToastColor = (b: (typeof BADGES)[number]) => (b.fg === '#111014' && b.bg !== 'holo' ? b.bg : 'var(--lilac)')

/**
 * Madde 11: ekranın kenarlarında uçuşan etkileşimli rozetler. Hepsi tek bir rAF döngüsünü paylaşır;
 * her biri kendi Lissajous yolunda gezinir. Üstüne gelince ya da odakta durur (hareketli hedefe basmak zor).
 * Basınca toplanır ve koleksiyona düşer. Mobilde ve sakin modda uçmaz (Madde 17 · 18).
 */
export function FlyingBadges() {
  const { vars, motion, kaos, collected, collect, toast } = useMaxi()
  const desktop = useMedia('(min-width: 768px)')
  const list = BADGES.slice(0, vars.rozet).filter((b) => !collected.includes(b.id))
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const paused = useRef<Set<number>>(new Set())
  const speed = vars.hiz
  const ids = list.map((b) => b.id).join()
  const count = list.length

  useEffect(() => {
    if (!desktop || kaos === 'sakin') return
    const n = count
    const acc = new Array(n).fill(0)
    let last = performance.now()
    let raf = 0
    const place = (i: number, t: number) => {
      const el = refs.current[i]
      if (!el) return
      const vw = window.innerWidth
      const vh = window.innerHeight
      const left = i % 2 === 0
      const band = Math.min(160, vw * 0.1)
      const bx = (0.5 + 0.5 * Math.sin(t * 0.31 + i * 1.3)) * band
      const x = left ? 8 + bx : vw - 108 - bx
      const y = 96 + (vh - 220) * (0.5 + 0.5 * Math.sin(t * (0.17 + i * 0.023) + i * 1.9))
      const rot = Math.sin(t * 0.45 + i) * 22
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`
    }
    const loop = (now: number) => {
      const dt = Math.min(64, now - last) / 1000
      last = now
      for (let i = 0; i < n; i++) {
        if (!paused.current.has(i)) acc[i] += dt * speed
        place(i, acc[i] + i * 3.7)
      }
      raf = requestAnimationFrame(loop)
    }
    if (motion) raf = requestAnimationFrame(loop)
    else for (let i = 0; i < n; i++) place(i, i * 3.7)
    const onResize = () => !motion && Array.from({ length: n }, (_, i) => place(i, i * 3.7))
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [desktop, kaos, motion, speed, ids, count])

  if (!desktop || kaos === 'sakin' || !list.length) return null
  return (
    <div role="region" aria-label="Uçan rozetler" className="clutter">
      {list.map((b, i) => (
        <button
          key={b.id}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="button"
          data-badge={b.id}
          data-cursor="topla"
          aria-label={`Rozet: ${b.ad}. Toplamak için bas`}
          onPointerEnter={() => paused.current.add(i)}
          onPointerLeave={() => paused.current.delete(i)}
          onFocus={() => paused.current.add(i)}
          onBlur={() => paused.current.delete(i)}
          onClick={() => {
            collect(b.id)
            toast(`Rozet toplandı: ${b.ad}`, badgeToastColor(b))
          }}
          className="fixed top-0 left-0 z-[60] cursor-pointer"
          style={{ transform: 'translate3d(-200px,-200px,0)' }}
        >
          <StickerFace shape={b.shape} bg={b.bg} fg={b.fg} size={b.shape === 'pill' ? 80 : 96}>
            {b.ad}
          </StickerFace>
        </button>
      ))}
    </div>
  )
}
