/** Elastik tepki: bir kütle-yay-sönüm sistemi. Sönüm oranı ζ < 1 iken hedefi aşar ve sallanarak yerleşir */
export interface Yay {
  x: number
  v: number
}
export function yayAdim(y: Yay, hedef: number, sertlik: number, sonum: number, dt: number) {
  // yarı örtük Euler, iki alt adım (büyük sertlikte kararlı kalsın)
  const h = dt / 2
  for (let i = 0; i < 2; i++) {
    const a = sertlik * (hedef - y.x) - sonum * y.v
    y.v += a * h
    y.x += y.v * h
  }
}
/** Sönüm oranı ve beklenen aşım (%) */
export function yayOzellik(sertlik: number, sonum: number) {
  const zeta = sonum / (2 * Math.sqrt(sertlik))
  const asim = zeta >= 1 ? 0 : Math.exp((-Math.PI * zeta) / Math.sqrt(1 - zeta * zeta)) * 100
  const w0 = Math.sqrt(sertlik)
  return { zeta, asim, w0 }
}
/** Basamak yanıtı: 0 → 1 (grafik ve ölçüm için) */
export function basamakYaniti(sertlik: number, sonum: number, sure = 2, n = 120) {
  const y: Yay = { x: 0, v: 0 }
  const dt = sure / n
  const pts: number[] = []
  let tepe = 0
  for (let i = 0; i <= n; i++) {
    pts.push(y.x)
    tepe = Math.max(tepe, y.x)
    // küçük adımlarla ilerle
    for (let k = 0; k < 8; k++) yayAdim(y, 1, sertlik, sonum, dt / 8)
  }
  return { pts, asim: Math.max(0, (tepe - 1) * 100) }
}
export const sinirla = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
