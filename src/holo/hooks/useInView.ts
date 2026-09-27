import { useEffect, useState, type RefObject } from 'react'

/** Öğe ekranda mı? Ekran dışındaki kanvas döngüleri durur. */
export function useInView(ref: RefObject<Element | null>, margin = '120px') {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
  return visible
}
