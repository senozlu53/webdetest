/**
 * İzometrik projeksiyon (Madde 3 · 12 · 15).
 * CSS'teki `rotateX(θ) rotateZ(-45deg)` dönüşümünün ortografik izdüşümüyle birebir aynıdır:
 *   ekran x = (x + y) · √½
 *   ekran y = (y − x) · √½ · cos θ − z · sin θ
 * θ = 54,7356° (arctan √2) → gerçek izometri, zemin çizgileri 30°.
 * θ = 60° (tanımdaki satır) → 2:1 oyun izometrisi, çizgiler 26,57°.
 * Görünen yan yüzler: x = min (sol, orta ton) ve y = max (sağ, karanlık ton).
 */
export type Projection = 'gercek' | 'oyun'
export const TILT: Record<Projection, number> = { gercek: 54.7356, oyun: 60 }

export type Pt = [number, number]
export type Project = (x: number, y: number, z?: number) => Pt

export function makeProject(tiltDeg: number, unit: number, origin: Pt = [0, 0]): Project {
  const t = (tiltDeg * Math.PI) / 180
  const c = Math.cos(t)
  const s = Math.sin(t)
  const k = Math.SQRT1_2
  return (x, y, z = 0) => [origin[0] + (x + y) * k * unit, origin[1] + (y - x) * k * c * unit - z * s * unit]
}

/** Zemin çizgilerinin yatayla yaptığı açı (derece) */
export const lineAngle = (tiltDeg: number) => (Math.atan(Math.cos((tiltDeg * Math.PI) / 180)) * 180) / Math.PI

export const pts = (list: Pt[]) => list.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ')

export type Box = { x: number; y: number; z?: number; w: number; d: number; h: number }

export function boxFaces(P: Project, b: Box) {
  const z = b.z ?? 0
  const { x, y, w, d, h } = b
  return {
    top: [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)],
    left: [P(x, y, z + h), P(x, y + d, z + h), P(x, y + d, z), P(x, y, z)],
    right: [P(x, y + d, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x, y + d, z)],
  }
}

/** Uzaktan yakına çizim sırası: bakış yönü (−x, +y) */
export const depth = (b: Box) => b.y + b.d / 2 - (b.x + b.w / 2) + (b.z ?? 0) * 0.01

/** Tek yönlü sert gölge (Madde 7): ışık (−x, −y) yönünden gelir, gölge (+x, +y) boyunca uzanır. */
export const LIGHT: [number, number] = [0.8, 0.8]

function hull(points: Array<[number, number]>) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower: Array<[number, number]> = []
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop()
    lower.push(q)
  }
  const upper: Array<[number, number]> = []
  for (const q of [...p].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop()
    upper.push(q)
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1))
}

/**
 * Kutunun, üzerinde durduğu yüzeye (z = ground) düşen gölgesi: taban ile ışık yönünde
 * kaydırılmış tavan izdüşümünün dışbükey zarfı. Süzülen nesnede taban da kayar.
 */
export function shadowPolygon(P: Project, b: Box, length = 1, ground = b.z ?? 0) {
  const z = b.z ?? 0
  const lx = LIGHT[0] * length
  const ly = LIGHT[1] * length
  const base: Array<[number, number]> = [
    [b.x, b.y],
    [b.x + b.w, b.y],
    [b.x + b.w, b.y + b.d],
    [b.x, b.y + b.d],
  ]
  const up = z + b.h - ground
  const lift = z - ground
  const cast = base.map(([x, y]) => [x + lx * up, y + ly * up] as [number, number])
  const lifted = lift > 0 ? base.map(([x, y]) => [x + lx * lift, y + ly * lift] as [number, number]) : base
  return hull([...lifted, ...cast]).map(([x, y]) => P(x, y, ground))
}

/** Silindir (veritabanı, jeton): daire izdüşümü rx = r · birim, ry = r · cos θ · birim */
export function cylinder(P: Project, cx: number, cy: number, r: number, z: number, h: number, tiltDeg: number, unit: number) {
  const c = Math.cos((tiltDeg * Math.PI) / 180)
  const [bx, by] = P(cx, cy, z)
  const [tx, ty] = P(cx, cy, z + h)
  const rx = r * unit
  const ry = r * c * unit
  const side = `M${bx - rx},${by} L${tx - rx},${ty} A${rx},${ry} 0 0 0 ${tx + rx},${ty} L${bx + rx},${by} A${rx},${ry} 0 0 1 ${bx - rx},${by} Z`
  return { side, top: { cx: tx, cy: ty, rx, ry }, bottom: { cx: bx, cy: by, rx, ry } }
}
