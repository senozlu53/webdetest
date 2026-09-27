import { useEffect, useState, type RefObject } from 'react'

/** Kapsayıcının piksel genişliği: grafikler metni ölçeklemeden gerçek genişlikte çizilir */
export function useWidth(ref: RefObject<Element | null>, fallback = 640) {
  const [w, setW] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return w
}
