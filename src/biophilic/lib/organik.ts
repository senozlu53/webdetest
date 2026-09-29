/**
 * Organik geometri araç seti (Madde 6 · 9): yapraklar, taç yapraklar, elipsler, yumuşak yollar ve
 * "vector network" tutamakları. Hepsi saf fonksiyon; tohumla deterministik.
 */

export type Nk = readonly [number, number]

/** mulberry32: küçük, hızlı, tohumlu rastgele sayı üretici */
export function rastgele(tohum: number) {
  let a = tohum >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const yuvarla = (n: number, hane = 1) => {
  const o = 10 ** hane
  return String(Math.round(n * o) / o || 0)
}
export const mp = (p: Nk, hane = 1) => `${yuvarla(p[0], hane)} ${yuvarla(p[1], hane)}`
const RAD = Math.PI / 180
export const derece = (r: number) => r / RAD

function don(px: number, py: number, x: number, y: number, a: number): Nk {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [x + px * c - py * s, y + px * s + py * c]
}

/** Catmull-Rom eğrisini kübik Bezier yoluna çevirir (k: gerilim çarpanı, hane: ondalık basamak) */
export function yumusak(p: readonly Nk[], kapali = false, k = 1, hane = 1): string {
  const n = p.length
  if (n < 2) return ''
  const g = (i: number): Nk => (kapali ? p[((i % n) + n) % n] : p[Math.max(0, Math.min(n - 1, i))])
  let d = `M${mp(p[0], hane)}`
  const son = kapali ? n : n - 1
  for (let i = 0; i < son; i++) {
    const p0 = g(i - 1)
    const p1 = g(i)
    const p2 = g(i + 1)
    const p3 = g(i + 2)
    const c1: Nk = [p1[0] + ((p2[0] - p0[0]) / 6) * k, p1[1] + ((p2[1] - p0[1]) / 6) * k]
    const c2: Nk = [p2[0] - ((p3[0] - p1[0]) / 6) * k, p2[1] - ((p3[1] - p1[1]) / 6) * k]
    d += `C${mp(c1, hane)} ${mp(c2, hane)} ${mp(p2, hane)}`
  }
  return kapali ? d + 'Z' : d
}

/** "Vector network" tutamakları: her düğüm için iki Bezier tutamağı (Figma'daki gibi) */
export interface Dugum {
  nokta: Nk
  giris: Nk
  cikis: Nk
}
export function tutamaklar(p: readonly Nk[], k = 1): Dugum[] {
  const n = p.length
  return p.map((q, i) => {
    const onceki = p[(i - 1 + n) % n]
    const sonraki = p[(i + 1) % n]
    const vx = ((sonraki[0] - onceki[0]) / 6) * k
    const vy = ((sonraki[1] - onceki[1]) / 6) * k
    return { nokta: q, giris: [q[0] - vx, q[1] - vy] as Nk, cikis: [q[0] + vx, q[1] + vy] as Nk }
  })
}

/** Aynı eğriyi sık noktalarla örnekler */
export function ornekle(p: readonly Nk[], adim = 6, kapali = false): Nk[] {
  const n = p.length
  const g = (i: number): Nk => (kapali ? p[((i % n) + n) % n] : p[Math.max(0, Math.min(n - 1, i))])
  const out: Nk[] = []
  const son = kapali ? n : n - 1
  for (let i = 0; i < son; i++) {
    const p0 = g(i - 1)
    const p1 = g(i)
    const p2 = g(i + 1)
    const p3 = g(i + 2)
    for (let s = 0; s < adim; s++) {
      const t = s / adim
      const t2 = t * t
      const t3 = t2 * t
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  if (!kapali) out.push(p[n - 1])
  return out
}

/** Yola dik, değişken kalınlıklı şerit (sap, dal, otlar için) */
export function serit(pts: readonly Nk[], kalinlik: (t: number) => number): string {
  const n = pts.length
  const sol: Nk[] = []
  const sag: Nk[] = []
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(n - 1, i + 1)]
    let tx = b[0] - a[0]
    let ty = b[1] - a[1]
    const l = Math.hypot(tx, ty) || 1
    tx /= l
    ty /= l
    const w = Math.max(0.15, kalinlik(i / (n - 1))) / 2
    sol.push([pts[i][0] - ty * w, pts[i][1] + tx * w])
    sag.push([pts[i][0] + ty * w, pts[i][1] - tx * w])
  }
  const halka = [...sol, ...sag.reverse()]
  return 'M' + halka.map((q) => mp(q)).join('L') + 'Z'
}

/** (x,y) kökten `aci` yönünde uzanan sivri uçlu yaprak. asim: alt/üst kambur farkı */
export function yaprakAt(x: number, y: number, aci: number, boy: number, en: number, asim = 0.18): string {
  const u = en * (1 + asim)
  const a = en * (1 - asim)
  const T = (px: number, py: number) => mp(don(px, py, x, y, aci))
  return `M${T(0, 0)}C${T(boy * 0.22, -u * 1.05)} ${T(boy * 0.72, -u * 0.85)} ${T(boy, 0)}C${T(boy * 0.7, a * 0.9)} ${T(boy * 0.24, a * 1.05)} ${T(0, 0)}Z`
}
/** Yaprağın orta damarı */
export function damarAt(x: number, y: number, aci: number, boy: number): string {
  const T = (px: number, py: number) => mp(don(px, py, x, y, aci))
  return `M${T(0, 0)}Q${T(boy * 0.5, boy * 0.035)} ${T(boy * 0.9, 0)}`
}
/** Zeytin yaprağı: dar ve uzun, iki ucu sivri */
export function zeytinAt(x: number, y: number, aci: number, boy: number, en = boy * 0.13): string {
  const T = (px: number, py: number) => mp(don(px, py, x, y, aci))
  return `M${T(0, 0)}C${T(boy * 0.25, -en * 1.3)} ${T(boy * 0.75, -en * 1.2)} ${T(boy, 0)}C${T(boy * 0.75, en * 1.2)} ${T(boy * 0.25, en * 1.3)} ${T(0, 0)}Z`
}
/** Taç yapraklar: n adet, merkezden dışa */
export function petalAt(x: number, y: number, aci: number, r: number, n: number, sivriOran = 0.34): string[] {
  return Array.from({ length: n }, (_, i) => yaprakAt(x, y, aci + (i / n) * Math.PI * 2, r, r * sivriOran, 0.06))
}
/** Döndürülmüş elips (yay komutlarıyla) */
export function elips(cx: number, cy: number, rx: number, ry: number, aci = 0): string {
  const a = don(-rx, 0, cx, cy, aci)
  const b = don(rx, 0, cx, cy, aci)
  const deg = derece(aci)
  return `M${mp(a)}A${yuvarla(rx)} ${yuvarla(ry)} ${yuvarla(deg)} 1 0 ${mp(b)}A${yuvarla(rx)} ${yuvarla(ry)} ${yuvarla(deg)} 1 0 ${mp(a)}Z`
}
/** Yumuşak köşeli dikdörtgen yolu */
export function yuvarlakDortgen(x: number, y: number, w: number, h: number, r: number): string {
  const R = Math.min(r, w / 2, h / 2)
  return `M${x + R} ${y}H${x + w - R}Q${x + w} ${y} ${x + w} ${y + R}V${y + h - R}Q${x + w} ${y + h} ${x + w - R} ${y + h}H${x + R}Q${x} ${y + h} ${x} ${y + h - R}V${y + R}Q${x} ${y} ${x + R} ${y}Z`
}
/** Dalgalı çizgi: başlangıçtan bitişe sinüs dalgası */
export function dalgaCizgi(x0: number, x1: number, y: number, genlik: number, dalgaBoyu: number, faz = 0): string {
  const pts: Nk[] = []
  const say = Math.max(4, Math.round((x1 - x0) / (dalgaBoyu / 6)))
  for (let i = 0; i <= say; i++) {
    const x = x0 + ((x1 - x0) * i) / say
    pts.push([x, y + Math.sin(((x - x0) / dalgaBoyu) * Math.PI * 2 + faz) * genlik])
  }
  return yumusak(pts)
}
