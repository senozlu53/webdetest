import { useEffect, useRef } from 'react'

/**
 * Pürüzsüz paralaks: eleman, sayfa kaydırmasının `speed` katı kadar dikeyde kayar.
 * requestAnimationFrame ile çizilir; hareket azaltma açıksa çalışmaz.
 */
export function useParallax<T extends HTMLElement>(speed = 0.15) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      el.style.transform = `translate3d(0, ${(window.scrollY * speed).toFixed(1)}px, 0)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [speed])

  return ref
}
