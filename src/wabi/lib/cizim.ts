/**
 * Elle çizilmiş gibi duran hatlar (Madde 6): düz olmayan çizgiler, keskin olmayan köşeli çerçeveler ve fırça çemberi (ensō).
 * Hepsi tohumla deterministiktir; `k` kusur çarpanıdır (0: kusursuz çizgi).
 */
import { ornekle, rastgele, serit, yumusak, type Nk } from './organik'

export type Kusur = 'yok' | 'az' | 'orta' | 'cok'
export const KUSUR_CARPAN: Record<Kusur, number> = { yok: 0, az: 0.55, orta: 1, cok: 1.7 }
export const KUSUR_AD: Record<Kusur, string> = { yok: 'Yok', az: 'Az', orta: 'Orta', cok: 'Çok' }

const yuvarla = (n: number) => Math.round(n * 10) / 10

/** (x0,y0) → (x1,y1) arası, komşu sapmaları birbirine bağlı, uçları hafifçe taşan çizgi */
export function elCizgisi(x0: number, y0: number, x1: number, y1: number, tohum: number, k = 1, adim = 34): string {
  if (k === 0) return `M${yuvarla(x0)} ${yuvarla(y0)}L${yuvarla(x1)} ${yuvarla(y1)}`
  const r = rastgele(tohum)
  const len = Math.hypot(x1 - x0, y1 - y0) || 1
  const ux = (x1 - x0) / len
  const uy = (y1 - y0) / len
  const nx = -uy
  const ny = ux
  const tasma0 = r() * 2.4 * k
  const tasma1 = r() * 2.4 * k
  const n = Math.max(2, Math.round(len / adim))
  const pts: Nk[] = []
  let s = (r() - 0.5) * 1.6 * k
  for (let i = 0; i <= n; i++) {
    const t = i / n
    s = s * 0.55 + (r() - 0.5) * 2.1 * k
    const uc = i === 0 || i === n ? 0.4 : 1
    const bx = x0 - ux * tasma0 + (x1 - x0 + ux * (tasma0 + tasma1)) * t
    const by = y0 - uy * tasma0 + (y1 - y0 + uy * (tasma0 + tasma1)) * t
    pts.push([bx + nx * s * uc, by + ny * s * uc])
  }
  return yumusak(pts, false, 1, 1)
}

/** Dört kenarı ayrı ayrı sapan, köşeleri yuvarlatılmış (keskin olmayan) kapalı çerçevenin noktaları */
export function elCerceveNoktalar(w: number, h: number, tohum: number, k = 1, kose = 8): Nk[] {
  const r = rastgele(tohum)
  const R = Math.min(kose, w / 3, h / 3)
  const pts: Nk[] = []
  const kenar = (ax: number, ay: number, bx: number, by: number, nx: number, ny: number) => {
    const len = Math.hypot(bx - ax, by - ay)
    const n = Math.max(1, Math.round(len / 46))
    let s = (r() - 0.5) * 1.6 * k
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1)
      s = s * 0.5 + (r() - 0.5) * 2 * k
      pts.push([ax + (bx - ax) * t + nx * s, ay + (by - ay) * t + ny * s])
    }
  }
  const kosea = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= 2; i++) {
      const a = a0 + (i / 2) * (Math.PI / 2)
      const rr = R * (1 + (r() - 0.5) * 0.5 * k)
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
    }
  }
  const e = 0.6 * k
  // sol üst köşeden saat yönüne
  kosea(R + e, R + e, Math.PI)
  kenar(R, 0, w - R, 0, 0, 1)
  kosea(w - R - e, R - e, -Math.PI / 2)
  kenar(w, R, w, h - R, -1, 0)
  kosea(w - R + e, h - R - e, 0)
  kenar(w - R, h, R, h, 0, -1)
  kosea(R - e, h - R + e, Math.PI / 2)
  kenar(0, h - R, 0, R, 1, 0)
  return pts
}

export function elCerceve(w: number, h: number, tohum: number, k = 1, kose = 8): string {
  return yumusak(elCerceveNoktalar(w, h, tohum, k, kose), true, 1, 1)
}

/** Fırça çemberi: kalın başlar, incelir, uçları birleşmez (açık ensō) */
export function enso(r: number, tohum: number, kalin = 9, k = 1): string {
  const rnd = rastgele(tohum)
  const a0 = -2.2 + (rnd() - 0.5) * 0.5
  const kapsam = 5.55 + (rnd() - 0.5) * 0.4
  const n = 30
  const dalga = Array.from({ length: 4 }, () => (rnd() - 0.5) * 0.06 * k)
  const pts: Nk[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const a = a0 + kapsam * t
    const rr = r * (1 + t * 0.06 + dalga[0] * Math.sin(t * 5) + dalga[1] * Math.sin(t * 9 + 1)) * (1 + (rnd() - 0.5) * 0.012 * k)
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr])
  }
  const yol = ornekle(pts, 4)
  return serit(yol, (t) => kalin * (0.28 + 0.72 * Math.sin(Math.PI * Math.min(1, t * 0.95 + 0.05)) ** 0.7) * (t > 0.9 ? 1 - (t - 0.9) * 5 : 1) + 0.6)
}

/** Elle çizilmiş gibi hafif basık ve kapanmayan bir daire çizgisi (ilerleme çemberi için); başlangıç üstte */
export function elDairesi(r: number, tohum: number, k = 1): string {
  const rnd = rastgele(tohum)
  const n = 28
  const faz = rnd() * 6
  const pts: Nk[] = []
  for (let i = 0; i <= n; i++) {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2
    const rr = r * (1 + k * (0.018 * Math.sin(a * 2 + faz) + 0.012 * Math.sin(a * 3 + faz * 2) + (rnd() - 0.5) * 0.006 + (i / n) * 0.02))
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr])
  }
  return yumusak(pts, false, 1, 1)
}

/** Kalın çizgi yerine ince, kusurlu bölücü: geniş viewBox + non-scaling-stroke ile kullanılır */
export function bolucuCizgi(tohum: number, k = 1, uzunluk = 1000): string {
  return elCizgisi(0, 4, uzunluk, 4, tohum, k * 0.8, 56)
}

/** Kusurlu çerçevenin düz kenardan en büyük sapması (px); köşe yayları sayılmaz */
export function sapma(w: number, h: number, tohum: number, k: number, kose = 8): number {
  const R = Math.min(kose, w / 3, h / 3)
  let m = 0
  for (const [x, y] of elCerceveNoktalar(w, h, tohum, k, kose)) {
    if (x > R + 1 && x < w - R - 1) m = Math.max(m, Math.min(Math.abs(y), Math.abs(y - h)))
    else if (y > R + 1 && y < h - R - 1) m = Math.max(m, Math.min(Math.abs(x), Math.abs(x - w)))
  }
  return Math.round(m * 10) / 10
}
