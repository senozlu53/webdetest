import { useEffect, useRef } from 'react'

/**
 * Hızlı scroll reveal. Eleman görünür durumda başlar; görüş alanına girdiği an
 * üstünden bir mürekkep bloğu 4 sert adımda (steps(4)) çekilir. Easing yoktur.
 * Hareket azaltma tercihinde blok hiç çizilmez (bkz. index.css).
 */
export function useCutReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-cut')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
