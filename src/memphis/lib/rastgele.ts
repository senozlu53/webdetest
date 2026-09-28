import { useMemo } from 'react'
import { useMemphis } from './store'

/** Madde 6: altın oran ve altın açı */
export const PHI = (1 + Math.sqrt(5)) / 2
export const ALTIN_ACI = 360 * (1 - 1 / PHI) // 137,507…°

/** Dizgiden 32 bit özet (FNV-1a) */
export function ozet(s: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}
/** Tohumlu sözde rastgele sayı üreteci (mulberry32): aynı tohum, aynı dizi */
export function uretec(tohum: number) {
  let a = tohum >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Madde 14: rastgele dönüş açısı veren hook. Açı anahtar ve sayfa tohumundan türetilir:
 * her yenilemede ya da StrictMode'un çift çizimında değişmez; "Karıştır" yeni tohum verince hepsi birlikte değişir.
 * Açılar 0'a çok yakın olmaz (en az `min`): Memphis'te kart ya belirgin eğiktir ya dümdüz, "yanlışlıkla eğik" görünmez.
 */
export function useRandomRotation(anahtar: string, { max = 4, min = 1.2 }: { max?: number; min?: number } = {}) {
  const { tohum } = useMemphis()
  return useMemo(() => {
    const r = uretec(ozet(anahtar) ^ tohum)
    const buyukluk = min + r() * (max - min)
    const yon = r() < 0.5 ? -1 : 1
    return Math.round(yon * buyukluk * 10) / 10
  }, [anahtar, tohum, max, min])
}

/** Altın açı sarmalı (Vogel): n nokta, kaotik görünür ama alan eşit dolar */
export function sarmal(n: number, yaricap: number, baslangic = 0) {
  return Array.from({ length: n }, (_, i) => {
    const r = yaricap * Math.sqrt((i + 0.5) / n)
    const a = ((baslangic + i * ALTIN_ACI) * Math.PI) / 180
    return { x: r * Math.cos(a), y: r * Math.sin(a), i }
  })
}
