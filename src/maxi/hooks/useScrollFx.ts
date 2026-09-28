import { useEffect, useRef } from 'react'
import { useMaxi } from '../lib/store'

/**
 * Madde 16: kaydırdıkça dönen, büyüyen ve renk değiştiren asimetrik paralaks.
 * Bütün öğeler tek bir kaydırma dinleyicisini ve tek bir rAF'i paylaşır.
 * Her öğeye --p (−1 ekranın üstünde, 0 ortada, 1 altında) yazılır; dönüşüm CSS'te (.fx) hesaplanır.
 */
const els = new Set<HTMLElement>()
let frame = 0
function tick() {
  frame = 0
  const vh = window.innerHeight
  for (const el of els) {
    const r = el.getBoundingClientRect()
    if (r.bottom < -200 || r.top > vh + 200) continue
    const c = r.top + r.height / 2
    const p = Math.max(-1, Math.min(1, (c - vh / 2) / (vh / 2 + r.height / 2)))
    el.style.setProperty('--p', p.toFixed(3))
  }
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(tick)
}
let bound = false
function bind() {
  if (bound) return
  bound = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
}

export function useScrollFx<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const { motion } = useMaxi()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!motion) {
      el.style.setProperty('--p', '0')
      return
    }
    bind()
    els.add(el)
    schedule()
    return () => {
      els.delete(el)
    }
  }, [motion])
  return ref
}
