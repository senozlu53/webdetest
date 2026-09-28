/** Tohumlu rastgele (mulberry32): "rastgele" yerleşim her açılışta aynı, Karıştır ile yeni tohum */
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
export const between = (r: () => number, a: number, b: number) => a + (b - a) * r()
export const pick = <T,>(r: () => number, xs: readonly T[]) => xs[Math.floor(r() * xs.length)]
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
/** −1…1 arası tohumlu değer; .tilt sınıfı bunu --r olarak kullanır */
export const signed = (seed: number) => rng(seed)() * 2 - 1
