/**
 * Madde 10: Web3 sanat galerisi. Her eser bir tohumdan üretilen synthwave manzarası (SVG):
 * dilimli güneş, tel kafes dağlar, perspektif ızgara, palmiye silüetleri. Aynı tohum hep aynı eseri verir.
 */
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

const GOK = [
  ['#0d0418', '#3a0f5c', '#ff2f92'],
  ['#07021a', '#1a0b2e', '#ff8c00'],
  ['#050b1f', '#2b0f4f', '#00b3ff'],
  ['#12021f', '#4a0a4f', '#ff00ff'],
]

/** Güneş: üst yarı düz, alt yarı giderek kalınlaşan yatay boşluklarla kesik (Madde 6) */
export function gunesDilimleri(cx: number, cy: number, r: number, adet = 7) {
  const d: string[] = []
  let y = cy - r * 0.05
  for (let i = 0; i < adet; i++) {
    const bosluk = 1.2 + i * 1.1
    const kalin = Math.max(1.5, r * 0.11 - i * 1.1)
    y += kalin
    if (y + bosluk > cy + r) break
    d.push(`M${cx - r - 2} ${y}h${2 * r + 4}v${bosluk}h${-2 * r - 4}z`)
    y += bosluk
  }
  return d.join('')
}

export function manzara(tohum: number, w = 320, h = 200) {
  const r = uretec(tohum)
  const g = GOK[Math.floor(r() * GOK.length)]
  const ufuk = h * (0.52 + r() * 0.08)
  const gr = h * (0.2 + r() * 0.1)
  const gx = w * (0.35 + r() * 0.3)
  const id = `m${tohum}`
  // Dağlar: tel kafes üçgenler
  const dag: string[] = []
  let x = -10
  while (x < w + 10) {
    const gen = 30 + r() * 70
    const yuk = 15 + r() * (ufuk * 0.35)
    dag.push(`M${x} ${ufuk} L${x + gen / 2} ${ufuk - yuk} L${x + gen} ${ufuk}`)
    dag.push(`M${x + gen / 2} ${ufuk - yuk} L${x + gen / 2 + (r() - 0.5) * 16} ${ufuk}`)
    x += gen * (0.6 + r() * 0.3)
  }
  // Perspektif ızgara: kaçış noktası (w/2, ufuk)
  const iz: string[] = []
  for (let i = -12; i <= 12; i++) iz.push(`M${w / 2} ${ufuk} L${w / 2 + i * w * 0.14} ${h}`)
  for (let k = 1; k <= 8; k++) {
    const yy = ufuk + (h - ufuk) * (k / 8) ** 1.9
    iz.push(`M0 ${yy.toFixed(1)} H${w}`)
  }
  const palmiye = r() < 0.75
  const px = r() < 0.5 ? w * 0.12 : w * 0.84
  const palm = palmiye
    ? `M${px} ${h} C${px + 3} ${h - 40} ${px - 2} ${h - 80} ${px + 6} ${ufuk - 34} M${px + 6} ${ufuk - 34} q-22 -6 -34 10 M${px + 6} ${ufuk - 34} q18 -12 36 2 M${px + 6} ${ufuk - 34} q-10 -18 -30 -18 M${px + 6} ${ufuk - 34} q10 -20 30 -16 M${px + 6} ${ufuk - 34} q-4 14 -14 26 M${px + 6} ${ufuk - 34} q10 10 16 26`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${g[0]}"/><stop offset=".7" stop-color="${g[1]}"/><stop offset="1" stop-color="${g[2]}"/></linearGradient><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset=".5" stop-color="#ff8c00"/><stop offset="1" stop-color="#ff00ff"/></linearGradient><mask id="${id}k"><rect width="${w}" height="${h}" fill="#fff"/><path d="${gunesDilimleri(gx, ufuk - gr * 0.35, gr)}" fill="#000"/></mask><clipPath id="${id}u"><rect width="${w}" height="${ufuk}"/></clipPath></defs><rect width="${w}" height="${ufuk}" fill="url(#${id}g)"/><rect y="${ufuk}" width="${w}" height="${h - ufuk}" fill="#0d0418"/><g clip-path="url(#${id}u)"><circle cx="${gx}" cy="${ufuk - gr * 0.35}" r="${gr}" fill="url(#${id}s)" mask="url(#${id}k)"/></g><path d="${dag.join('')}" fill="#1a0b2e" stroke="#00ffff" stroke-width="1.2" stroke-linejoin="round"/><path d="${iz.join('')}" stroke="#ff00ff" stroke-width="1" fill="none" opacity=".9"/><line x1="0" y1="${ufuk}" x2="${w}" y2="${ufuk}" stroke="#ff00ff" stroke-width="2"/>${palm ? `<path d="${palm}" fill="none" stroke="#0d0418" stroke-width="5" stroke-linecap="round"/>` : ''}</svg>`
}

export const svgUrl = (s: string) => `data:image/svg+xml,${encodeURIComponent(s)}`
