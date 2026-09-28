import { useEffect, useRef, useState } from 'react'
import { useMaxi } from '../lib/store'
import { useMedia } from '../hooks/useMedia'

/**
 * Madde 16: imleç takipçisi. Beyaz daire mix-blend-difference ile altındakini tersine çevirir, gecikmeli izler;
 * düğme ve bağlantı üstünde büyür, data-cursor varsa etiketini yazar. Yalnız ince işaretçide, hareket açıkken ve sakin modda değilken.
 * Asıl imleç gizlenmez; takipçi tıklamayı engellemez (pointer-events: none).
 */
export function CursorFollower() {
  const { motion, kaos } = useMaxi()
  const fine = useMedia('(pointer: fine)')
  const on = motion && kaos !== 'sakin' && fine
  const dot = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | null>(null)
  useEffect(() => {
    if (!on) return
    let x = -120
    let y = -120
    let tx = x
    let ty = y
    let raf = 0
    const loop = () => {
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      if (dot.current) dot.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0
    }
    const move = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      const t = (e.target as Element | null)?.closest?.('[data-cursor], a, button, label, select, input, [role="tab"]')
      const l = t ? (t.getAttribute('data-cursor') ?? '') : null
      setLabel((p) => (p === l ? p : l))
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const leave = () => {
      tx = -120
      ty = -120
      if (!raf) raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [on])
  if (!on) return null
  const s = label === null ? 22 : label ? 92 : 54
  return (
    <div ref={dot} aria-hidden="true" data-follower="" className="pointer-events-none fixed top-0 left-0 z-[80] grid place-items-center rounded-full bg-white mix-blend-difference transition-[width,height] duration-200" style={{ width: s, height: s, transform: 'translate3d(-120px,-120px,0)' }}>
      {label ? <span className="font-code text-[10px] font-bold text-black uppercase">{label}</span> : null}
    </div>
  )
}
