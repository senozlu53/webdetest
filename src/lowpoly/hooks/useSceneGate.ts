import { useEffect, useState, type RefObject } from 'react'

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

type Nav = Navigator & { connection?: { saveData?: boolean } }

/**
 * Madde 17: WebGL sahnesi mi, durağan .webp mi? Dar ekran, veri tasarrufu ya da WebGL yokluğu
 * durağan görseli seçer; kullanıcı yine de 3B sahneyi açabilir. Hareketi azalt açıksa sahne
 * yüklenir ama kendiliğinden dönmez ve imleci izlemez.
 */
export function useSceneGate() {
  const narrowQ = '(max-width: 767px)'
  const reduceQ = '(prefers-reduced-motion: reduce)'
  const [narrow, setNarrow] = useState(() => window.matchMedia(narrowQ).matches)
  const [reduced, setReduced] = useState(() => window.matchMedia(reduceQ).matches)
  const [optIn, setOptIn] = useState(false)
  const [gl] = useState(webglAvailable)
  const saveData = (navigator as Nav).connection?.saveData === true

  useEffect(() => {
    const a = window.matchMedia(narrowQ)
    const b = window.matchMedia(reduceQ)
    const sa = () => setNarrow(a.matches)
    const sb = () => setReduced(b.matches)
    a.addEventListener('change', sa)
    b.addEventListener('change', sb)
    return () => {
      a.removeEventListener('change', sa)
      b.removeEventListener('change', sb)
    }
  }, [])

  const reason = !gl ? 'Tarayıcı WebGL desteklemiyor' : saveData ? 'Veri tasarrufu açık' : narrow ? 'Dar ekran: pil ve işlemci korunuyor' : null
  const webgl = gl && (optIn || reason === null)
  return { webgl, reason, reduced, canOptIn: gl && !webgl, optIn: () => setOptIn(true) }
}

/** Öğe görünür değilken sahne çizilmez (frameloop 'never') */
export function useVisible<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '80px' })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return visible
}
