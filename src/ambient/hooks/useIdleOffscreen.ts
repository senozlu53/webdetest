import { useEffect, type RefObject } from 'react'

/**
 * Ekranda görünmeyen animasyonlu yüzeyi durdurur (Madde 17). Gradyan konumu @property ile
 * animasyonlandığı için her kare yeniden boyanır; görünmüyorsa bu iş boşa gider.
 * Öğeye `data-idle` yazılır, CSS animasyonu duraklatır. Yeniden render gerekmez.
 */
export function useIdleOffscreen(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) delete el.dataset.idle
        else el.dataset.idle = ''
      },
      { rootMargin: '120px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}
