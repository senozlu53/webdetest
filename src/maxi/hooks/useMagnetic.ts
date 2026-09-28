import { useEffect, useRef } from 'react'
import { useMaxi } from '../lib/store'

/**
 * Madde 14 · 16: manyetik öğe. İmleç yarıçapa girince öğe imlece doğru çekilir, çıkınca yerine döner.
 * translate özelliğini kullanır; böylece .tilt (rotate) ve .fx (transform) ile çakışmaz.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35, radius = 130) {
  const ref = useRef<T>(null)
  const { motion, kaos } = useMaxi()
  const on = motion && kaos !== 'sakin'
  useEffect(() => {
    const el = ref.current
    if (!el || !on || !window.matchMedia('(pointer: fine)').matches) return
    let raf = 0
    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    const loop = () => {
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0
    }
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect()
      const cx = b.left + b.width / 2 - x
      const cy = b.top + b.height / 2 - y
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const d = Math.hypot(dx, dy)
      const reach = radius + Math.max(b.width, b.height) / 2
      if (d < reach) {
        tx = dx * strength
        ty = dy * strength
      } else {
        tx = 0
        ty = 0
      }
      if (!raf) raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
      el.style.translate = ''
    }
  }, [on, strength, radius])
  return ref
}
