import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { HAREKET_KAYDI } from '../lib/store'

/** Ekranda mı? Ekran dışındaki hareketli bileşen hiçbir iş yapmaz */
export function useEkranda<T extends Element>(ref: RefObject<T | null>, pay = '120px') {
  const [g, setG] = useState(true)
  const gr = useRef(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (es) => {
        const v = es.some((e) => e.isIntersecting)
        gr.current = v
        setG(v)
      },
      { rootMargin: pay },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, pay])
  return [g, gr] as const
}

/** Hareket bütçesi: çalışan bileşeni kayda yazar */
export function useKayit(ad: string, calisiyor: boolean) {
  const id = useId()
  useEffect(() => {
    if (!calisiyor) return
    const k = `${ad}:${id}`
    HAREKET_KAYDI.add(k)
    return () => {
      HAREKET_KAYDI.delete(k)
    }
  }, [ad, id, calisiyor])
}
