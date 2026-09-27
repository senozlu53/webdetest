import { useLayoutEffect, useRef, useState } from 'react'

/** Öğenin piksel boyutu; SVG yolları gerçek ölçüyle çizilir, böylece eğri ve çizgi kalınlığı bozulmaz */
export function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}
