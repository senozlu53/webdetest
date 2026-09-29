/** Tohumlu rastgele sayı üreteci: aynı tohum, aynı makas izi */
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
const f = (n: number) => Math.round(n * 100) / 100

/** Kapalı Catmull-Rom eğrisini kübik Bézier yoluna çevirir (makas izi gibi yumuşak, hiç sivri değil) */
function kapali(pts: P[]) {
  const n = pts.length
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
  }
  return d + 'Z'
}
/** Açık Catmull-Rom (uçlar ikilenir) */
function acik(pts: P[]) {
  let d = ''
  const n = pts.length
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(n - 1, i + 2)]
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}

export interface Delik {
  x: number
  y: number
  r: number
}
const delikYol = (h: Delik) => `M${f(h.x + h.r)} ${f(h.y)}A${f(h.r)} ${f(h.r)} 0 1 0 ${f(h.x - h.r)} ${f(h.y)}A${f(h.r)} ${f(h.r)} 0 1 0 ${f(h.x + h.r)} ${f(h.y)}Z`

export interface KutuSecenek {
  r?: number // köşe yarıçapı
  dalga?: number // kenar dalgalanması (px)
  adim?: number // kenar örnekleme aralığı (px)
  delikler?: Delik[] // zımbayla delinmiş kusursuz daireler
}

/**
 * Makasla kesilmiş dikdörtgen: köşe yarıçapları her köşede farklı, kenarlar hafif dalgalı.
 * clip-path: path(evenodd, …) ile kullanılır; delikler aynı yola eklenir.
 */
export function kutuYol(w: number, h: number, tohum: number, { r = 18, dalga = 2.5, adim = 110, delikler = [] }: KutuSecenek = {}) {
  const rnd = mulberry32(tohum * 7919 + 13)
  const sal = () => (rnd() * 2 - 1) * dalga
  const rr = [0, 1, 2, 3].map(() => Math.min(r * (0.6 + rnd() * 1.0), w / 3, h / 3))
  const pts: P[] = []
  const kenar = (x0: number, y0: number, x1: number, y1: number, nx: number, ny: number) => {
    const len = Math.hypot(x1 - x0, y1 - y0)
    const n = Math.max(1, Math.round(len / adim))
    for (let i = 0; i <= n; i++) {
      const t = i / n
      const j = i === 0 || i === n ? 0 : sal()
      pts.push([x0 + (x1 - x0) * t + nx * j, y0 + (y1 - y0) * t + ny * j])
    }
  }
  kenar(rr[0], 0, w - rr[1], 0, 0, 1)
  kenar(w, rr[1], w, h - rr[2], 1, 0)
  kenar(w - rr[2], h, rr[3], h, 0, 1)
  kenar(0, h - rr[3], 0, rr[0], 1, 0)
  return kapali(pts) + delikler.map(delikYol).join('')
}

export interface DalgaSecenek {
  taban?: number // dalganın orta çizgisi (yüksekliğin oranı, üstten)
  genlik?: number // tepe-çukur farkı (yüksekliğin oranı)
  n?: number // dalga sayısı
  delikler?: Delik[]
}
/** Topografik katman: üst kenar organik dalgalı, yanlar ve alt düz (kap tarafından kırpılır) */
export function dalgaYol(w: number, h: number, tohum: number, { taban = 0.3, genlik = 0.12, n = 6, delikler = [] }: DalgaSecenek = {}) {
  const rnd = mulberry32(tohum * 104729 + 7)
  const pts: P[] = []
  const adet = n + 1
  for (let i = 0; i <= adet; i++) {
    const x = (w * i) / adet
    const y = h * (taban + (rnd() * 2 - 1) * genlik * 0.5)
    pts.push([x, y])
  }
  return `M0 ${f(h)}L0 ${f(pts[0][1])}` + acik(pts) + `L${f(w)} ${f(h)}Z` + delikler.map(delikYol).join('')
}

/** Dağ katmanı: sivri ama uçları hafif yuvarlatılmış tepeler */
export function dagYol(w: number, h: number, tohum: number, { taban = 0.35, genlik = 0.3, n = 4 }: DalgaSecenek = {}) {
  const rnd = mulberry32(tohum * 15485863 + 3)
  const pts: P[] = [[0, h * (taban + genlik * 0.6)]]
  for (let i = 0; i < n; i++) {
    const cx = (w * (i + 0.5)) / n + (rnd() - 0.5) * (w / n) * 0.35
    const tepe = h * (taban - genlik * (0.35 + rnd() * 0.65))
    const vadi = h * (taban + genlik * (0.35 + rnd() * 0.4))
    pts.push([cx, tepe])
    pts.push([Math.min(w, cx + (w / n) * 0.5), vadi])
  }
  pts.push([w, h * (taban + genlik * 0.6)])
  let d = `M0 ${f(h)}L${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i]
    const [px, py] = pts[i - 1]
    // tepede küçük yuvarlatma: köşeye Q ile yaklaş
    const yon = y < py ? 1 : -1
    if (yon === 1) d += `L${f(x - 6)} ${f(y + 8)}Q${f(x)} ${f(y - 2)} ${f(x + 6)} ${f(y + 8)}`
    else d += `L${f(x)} ${f(y)}`
    void px
  }
  return d + `L${f(w)} ${f(h)}Z`
}
