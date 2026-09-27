import { useEffect, useRef } from 'react'

/**
 * Fareyle eğilen kart. İmleç kartın neresindeyse o kenar izleyiciye döner
 * ve parlama o noktaya düşer. Yalnızca ince imleçli cihazlarda ve hareket
 * azaltma kapalıyken çalışır.
 */
export function useTilt<T extends HTMLElement>(max = 8) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    let frame = 0
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.dataset.tilting = ''
        el.style.setProperty('--rx', `${((0.5 - y) * max).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${((x - 0.5) * max * 1.2).toFixed(2)}deg`)
        el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`)
        el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`)
        el.style.setProperty('--glare', '1')
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(frame)
      delete el.dataset.tilting
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
      el.style.setProperty('--glare', '0')
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [max])

  return ref
}
