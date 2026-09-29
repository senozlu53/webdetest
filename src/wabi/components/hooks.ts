import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useWabi } from '../lib/store'

/** Elemanın piksel ölçüsü */
export function useSize<T extends Element>() {
  const ref = useRef<T>(null)
  const [s, set] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const oku = () => {
      const r = el.getBoundingClientRect()
      const w = Math.round(r.width)
      const h = Math.round(r.height)
      set((p) => (p.w === w && p.h === h ? p : { w, h }))
    }
    oku()
    const ro = new ResizeObserver(oku)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, s] as const
}

/** Ekrana girdi mi? Bir kez true olur. Hareket kapalıyken hemen true */
export function useGorunur<T extends Element>(esik = 0.12) {
  const ref = useRef<T>(null)
  const [g, setG] = useState(false)
  const { hareket } = useWabi()
  useEffect(() => {
    const el = ref.current
    if (!el || g) return
    if (!hareket || typeof IntersectionObserver === 'undefined') {
      setG(true)
      return
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setG(true)
          io.disconnect()
        }
      },
      { threshold: esik },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [g, hareket, esik])
  return [ref, g] as const
}
