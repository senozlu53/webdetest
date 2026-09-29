/** Tohumlu rastgele sayı üreteci: aynı tohum her seferinde aynı "el hareketini" verir */
export function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Karalama: kutuyu dolduran tek parça zikzak. Her vuruş biraz eğik, uçlar kutudan biraz taşar
 * (Madde 6). `aci` derece, `aralik` vuruşlar arası piksel.
 */
export function karalama(w: number, h: number, { aralik = 8, tasma = 3, tohum = 1, aci = -18 }: { aralik?: number; tasma?: number; tohum?: number; aci?: number } = {}) {
  const r = mulberry32(tohum)
  const egim = Math.tan((aci * Math.PI) / 180)
  const pts: string[] = []
  let y = -Math.abs(egim) * w * 0.5
  let sag = false
  const son = h + Math.abs(egim) * w * 0.5
  while (y < son) {
    const x0 = -tasma + r() * tasma
    const x1 = w + tasma - r() * tasma
    const j = () => (r() - 0.5) * aralik * 0.5
    const a = sag ? x1 : x0
    const b = sag ? x0 : x1
    const ya = y + (sag ? egim * w : 0) + j()
    const yb = y + (sag ? 0 : egim * w) + j()
    pts.push(`${pts.length ? 'L' : 'M'}${a.toFixed(1)} ${ya.toFixed(1)}`, `L${b.toFixed(1)} ${yb.toFixed(1)}`)
    sag = !sag
    y += aralik * (0.8 + r() * 0.4)
  }
  return pts.join(' ')
}
