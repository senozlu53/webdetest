import { rng } from './rand'

/** Madde 6: yıldız patlaması (starburst) yolu */
export function starPath(cx: number, cy: number, ro: number, ri: number, n: number, rot = 0) {
  const pts: string[] = []
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? ri : ro
    const a = rot + (Math.PI * i) / n - Math.PI / 2
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`)
  }
  return `M${pts.join('L')}Z`
}

/** Madde 6: organik damla. Tohumlu yarıçaplar, Catmull-Rom ile yumuşatılmış kapalı eğri */
export function blobPath(seed: number, cx: number, cy: number, r: number, n = 7, wobble = 0.32) {
  const rand = rng(seed)
  const p = Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n
    const rr = r * (1 - wobble / 2 + rand() * wobble)
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]
  })
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n]
    const p1 = p[i]
    const p2 = p[(i + 1) % n]
    const p3 = p[(i + 2) % n]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d + 'Z'
}

/** Madde 8: yırtık kâğıt kenarı için clip-path çokgeni (yüzde) */
export function tornClip(seed: number, depth = 2.2, steps = 22) {
  const r = rng(seed)
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) pts.push(`${((i / steps) * 100).toFixed(1)}% ${(r() * depth).toFixed(1)}%`)
  for (let i = 0; i <= steps; i++) pts.push(`${(100 - r() * depth).toFixed(1)}% ${((i / steps) * 100).toFixed(1)}%`)
  for (let i = steps; i >= 0; i--) pts.push(`${((i / steps) * 100).toFixed(1)}% ${(100 - r() * depth).toFixed(1)}%`)
  for (let i = steps; i >= 0; i--) pts.push(`${(r() * depth).toFixed(1)}% ${((i / steps) * 100).toFixed(1)}%`)
  return `polygon(${pts.join(',')})`
}
