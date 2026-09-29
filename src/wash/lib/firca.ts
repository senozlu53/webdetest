/** Tohumlu rastgele sayı üreteci: aynı tohum aynı fırça darbesi */
export function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type P = [number, number]
const f = (n: number) => Math.round(n * 10) / 10

/** Kapalı Catmull-Rom → kübik Bézier (sıvı gibi yumuşak, hiç sivri köşe yok) */
export function kapali(pts: P[]) {
  const n = pts.length
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d + 'Z'
}
/** Açık Catmull-Rom (yalnız kesim çizgisi: sap, dal, fırça saç teli) */
export function acik(pts: P[]) {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  const n = pts.length
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(n - 1, i + 2)]
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}

/**
 * Suluboya lekesi: elipsin çevresinde yarıçapı dalgalanan organik kapalı şekil.
 * dalga: 0…0,4 (0 = elips), n: kontrol noktası sayısı
 */
export function leke(w: number, h: number, tohum: number, { dalga = 0.16, n = 9 }: { dalga?: number; n?: number } = {}) {
  const r = mulberry32(tohum * 7919 + 13)
  const pts: P[] = []
  const kayma = r() * Math.PI * 2
  for (let i = 0; i < n; i++) {
    const a = kayma + (i / n) * Math.PI * 2
    const k = 1 + (r() * 2 - 1) * dalga
    pts.push([w / 2 + Math.cos(a) * (w / 2) * 0.86 * k, h / 2 + Math.sin(a) * (h / 2) * 0.86 * k])
  }
  return kapali(pts)
}

export interface FircaSecenek {
  kalin?: number // yükseklik oranı 0…1
  kuru?: number // uçtaki kıl darbeleri (0…1)
  egim?: number // orta çizginin yukarı-aşağı sallanması (px)
}
/**
 * Fırça darbesi: soldan sağa, ortası kalın, uçları incelen ve tırnaklanan bant. Kıl teli olarak
 * uçtan taşan ince çizgiler ayrı döner (dry brush).
 */
export function firca(w: number, h: number, tohum: number, { kalin = 0.6, kuru = 0.5, egim = 6 }: FircaSecenek = {}) {
  const r = mulberry32(tohum * 15485863 + 5)
  const N = 12
  const ust: P[] = []
  const alt: P[] = []
  const ph = r() * Math.PI * 2
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const x = w * (0.02 + 0.96 * t)
    const orta = h / 2 + Math.sin(t * Math.PI * 1.5 + ph) * egim
    const profil = Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.92 + 0.04)), 0.55)
    const th = h * kalin * (0.35 + 0.65 * profil) * (0.9 + r() * 0.2)
    ust.push([x, orta - th / 2 + (r() - 0.5) * h * 0.06])
    alt.push([x, orta + th / 2 + (r() - 0.5) * h * 0.06])
  }
  const yol = kapali([...ust, ...[...alt].reverse()])
  // kıl telleri: sağ uçtan taşan 3–6 ince çizgi
  const teller: string[] = []
  const say = 3 + Math.round(kuru * 3)
  for (let i = 0; i < say; i++) {
    const y = h / 2 + (r() - 0.5) * h * kalin * 0.7
    const x0 = w * (0.78 + r() * 0.12)
    const x1 = w * (0.96 + r() * 0.04)
    teller.push(`M${f(x0)} ${f(y)}L${f(x1)} ${f(y + (r() - 0.5) * 4)}`)
  }
  return { yol, teller }
}

/** Serbest çizim noktalarından yumuşak yol (fırça darbesi çizerken) */
export function yumusat(pts: P[]) {
  if (pts.length < 3) return pts.length === 2 ? `M${f(pts[0][0])} ${f(pts[0][1])}L${f(pts[1][0])} ${f(pts[1][1])}` : pts.length === 1 ? `M${f(pts[0][0])} ${f(pts[0][1])}l0.1 0.1` : ''
  return acik(pts)
}
