import { useEffect, useState } from 'react'

export function useMedia(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const f = () => setM(mq.matches)
    f()
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [q])
  return m
}

export function useInView<T extends HTMLElement>(margin = '0px') {
  const [el, setEl] = useState<T | null>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [el, margin])
  return [setEl, on] as const
}
