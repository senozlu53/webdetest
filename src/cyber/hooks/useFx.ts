import { useCallback, useEffect, useState } from 'react'

export type Fx = 'tam' | 'sade' | 'kapali'
export type FxPref = 'oto' | Fx
const KEY = 'cyber-fx'

function useMedia(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const f = () => setM(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [q])
  return m
}

/**
 * Madde 16 · 17 · 18: efekt düzeyi. Otomatikte hareketi azalt → kapalı, dar ekran → sade
 * (glitch ve kayan tarama durur), aksi hâlde tam. Sonuç <html data-fx> olarak yazılır.
 */
export function useFx() {
  const [pref, setPrefState] = useState<FxPref>(() => {
    try {
      const v = localStorage.getItem(KEY)
      return v === 'tam' || v === 'sade' || v === 'kapali' ? v : 'oto'
    } catch {
      return 'oto'
    }
  })
  const reduce = useMedia('(prefers-reduced-motion: reduce)')
  const narrow = useMedia('(max-width: 767px)')
  const auto: Fx = reduce ? 'kapali' : narrow ? 'sade' : 'tam'
  const reason = reduce ? 'Hareketi azalt açık' : narrow ? 'Dar ekran: glitch ve kayan tarama durdu' : 'Geniş ekran'
  const fx: Fx = pref === 'oto' ? auto : pref

  useEffect(() => {
    document.documentElement.dataset.fx = fx
  }, [fx])

  const setPref = useCallback((p: FxPref) => {
    setPrefState(p)
    try {
      if (p === 'oto') localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, p)
    } catch {
      /* depolama kapalı */
    }
  }, [])

  return { pref, setPref, fx, reason }
}
