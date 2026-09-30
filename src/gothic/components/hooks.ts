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

/** Sayfada ölçülen bir değeri gecikmeyle hesaplar (canlı kanıt); bağımlılık değişince yeniden */
export function useOlc<T>(hesapla: () => T, bagimlilik: unknown[] = [], ilk: T, gecikme = 500) {
  const [v, setV] = useState<T>(ilk)
  useEffect(() => {
    const t = window.setTimeout(() => setV(hesapla()), gecikme)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, bagimlilik)
  return v
}

export type DokuAd = 'pas' | 'tas' | 'deri' | 'kadife'
export interface DokuTepe {
  /** en açık yüzde 0,5'lik dilimin başladığı renk */
  hex: string
  /** göreli parlaklık */
  L: number
}

/**
 * Dokuların gerçek piksellerini ölçer (canlı kanıt): CSS değişkenindeki SVG karosu bir tuvale çizilir, en açık yüzde 0,5'lik dilimin
 * parlaklığı bulunur. Metin kontrastı bu en kötü noktaya göre hesaplanır.
 */
export function useDokuTepe() {
  const [v, setV] = useState<Record<DokuAd, DokuTepe | null>>({
    pas: null,
    tas: null,
    deri: null,
    kadife: null,
  })
  useEffect(() => {
    let iptal = false
    const ad: DokuAd[] = ['pas', 'tas', 'deri', 'kadife']
    ad.forEach((a) => {
      const ham = getComputedStyle(document.documentElement).getPropertyValue(`--doku-${a}`)
      const m = ham.match(/url\("?(.*?)"?\)\s*$/)
      if (!m) return
      const img = new Image()
      img.onload = () => {
        if (iptal) return
        const cv = document.createElement('canvas')
        cv.width = img.naturalWidth || 128
        cv.height = img.naturalHeight || 128
        const cx = cv.getContext('2d', { willReadFrequently: true })
        if (!cx) return
        cx.drawImage(img, 0, 0)
        const d = cx.getImageData(0, 0, cv.width, cv.height).data
        const lum = (r: number, g: number, b: number) => {
          const f = (c: number) => {
            const x = c / 255
            return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
          }
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
        }
        const liste: { L: number; i: number }[] = []
        for (let i = 0; i < d.length; i += 4) liste.push({ L: lum(d[i], d[i + 1], d[i + 2]), i })
        liste.sort((x, y) => x.L - y.L)
        const p = liste[Math.floor(liste.length * 0.995)]
        const hex = '#' + [d[p.i], d[p.i + 1], d[p.i + 2]].map((c) => c.toString(16).padStart(2, '0')).join('')
        setV((o) => ({ ...o, [a]: { hex, L: p.L } }))
      }
      img.src = m[1].replace(/'/g, '"')
    })
    return () => {
      iptal = true
    }
  }, [])
  return v
}
