import { useEffect, useState } from 'react'

/** Sayfadaki öğeleri seçiciyle sayar (canlı kanıt). İlk ölçüm kısa gecikmeyle, bağımlılık değişince yeniden. */
export function useSay(secici: string, bagimlilik: unknown[] = [], gecikme = 500) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const t = window.setTimeout(() => setN(document.querySelectorAll(secici).length), gecikme)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, bagimlilik)
  return n
}
