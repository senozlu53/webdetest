import { useEffect, useState } from 'react'

/**
 * Madde 17: mobilde klavye açılınca görünür alan küçülür ama 100vh küçülmez. Görünür alanın yüksekliği ve
 * kayması CSS değişkenlerine yazılır (--app-h, --app-top); tam ekran sohbet bu değerlerle konumlanır,
 * böylece komut kutusu hep klavyenin üstünde kalır.
 */
export function useVisualViewport() {
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const root = document.documentElement
    const apply = () => {
      root.style.setProperty('--app-h', `${Math.round(vv.height)}px`)
      root.style.setProperty('--app-top', `${Math.round(vv.offsetTop)}px`)
    }
    apply()
    vv.addEventListener('resize', apply)
    vv.addEventListener('scroll', apply)
    return () => {
      vv.removeEventListener('resize', apply)
      vv.removeEventListener('scroll', apply)
    }
  }, [])
}

export function useMedia(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const f = () => setM(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [q])
  return m
}
