export const f = (n: number) => Math.round(n * 100) / 100

export type KoseStil = 'duz' | 'pah' | 'basamak'

/** Köşeleri pahlı ya da basamaklı (ziggurat) simetrik çerçeve yolu. Sol üst köşeden saat yönünde */
export function cerceveYol(w: number, h: number, stil: KoseStil, k: number, ic = 0): string {
  const x0 = ic
  const y0 = ic
  const x1 = w - ic
  const y1 = h - ic
  if (stil === 'duz') return `M${f(x0)} ${f(y0)}H${f(x1)}V${f(y1)}H${f(x0)}Z`
  if (stil === 'pah') {
    const c = k
    return `M${f(x0 + c)} ${f(y0)}H${f(x1 - c)}L${f(x1)} ${f(y0 + c)}V${f(y1 - c)}L${f(x1 - c)} ${f(y1)}H${f(x0 + c)}L${f(x0)} ${f(y1 - c)}V${f(y0 + c)}Z`
  }
  const a = k
  const b = 2 * k
  const p: [number, number][] = [
    [x0 + b, y0],
    [x1 - b, y0],
    [x1 - b, y0 + a],
    [x1 - a, y0 + a],
    [x1 - a, y0 + b],
    [x1, y0 + b],
    [x1, y1 - b],
    [x1 - a, y1 - b],
    [x1 - a, y1 - a],
    [x1 - b, y1 - a],
    [x1 - b, y1],
    [x0 + b, y1],
    [x0 + b, y1 - a],
    [x0 + a, y1 - a],
    [x0 + a, y1 - b],
    [x0, y1 - b],
    [x0, y0 + b],
    [x0 + a, y0 + b],
    [x0 + a, y0 + a],
    [x0 + b, y0 + a],
  ]
  return 'M' + p.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z'
}

/** Yarım daire güneş ışını: (0,0) merkez, yukarı doğru. Işın uzunlukları dönüşümlü uzun-kısa */
export function isinlar(n: number, r0: number, r1: number, r2: number, aci = 180): string[] {
  const out: string[] = []
  for (let i = 0; i <= n; i++) {
    const t = Math.PI + (aci / 180) * Math.PI * (i / n) - ((aci - 180) / 360) * Math.PI
    const r = i % 2 === 0 ? r1 : r2
    out.push(`M${f(Math.cos(t) * r0)} ${f(Math.sin(t) * r0)}L${f(Math.cos(t) * r)} ${f(Math.sin(t) * r)}`)
  }
  return out
}

/** Yay (yukarı bakan yarım daire) yolu: yarıçap r, merkez (0,0) */
export const yay = (r: number, aci = 180) => {
  const s = ((180 - aci) / 2 / 180) * Math.PI
  const a0 = Math.PI + s
  const a1 = 2 * Math.PI - s
  return `M${f(Math.cos(a0) * r)} ${f(Math.sin(a0) * r)}A${r} ${r} 0 0 1 ${f(Math.cos(a1) * r)} ${f(Math.sin(a1) * r)}`
}

/** Tohumlu sözde-rastgele (kırılganlık gerektirmeyen süsler için) */
export function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Madde 17: ekran daraldıkça çerçeve sayısı ve köşe küçülür; simetri ve ortalama korunur */
export function katSayisi(w: number): { kat: number; k: number; aralik: number } {
  if (w < 420) return { kat: 1, k: 8, aralik: 7 }
  if (w < 640) return { kat: 2, k: 10, aralik: 8 }
  return { kat: 3, k: 14, aralik: 9 }
}
