import { rng } from './rng'

/**
 * 2B düşük poligon yüzey (Madde 6 · 7 · 11). Titreşimli ızgaradan üçgenler üretilir;
 * her köşenin bir yüksekliği vardır. Her üçgenin normali bu 3B noktalardan hesaplanır ve
 * ışık yönüyle açısına göre TEK bir renk alır (Lambert, düz gölgelendirme: yumuşatma yok).
 */
export type Facet = { points: string; fill: string; height: number; cx: number; cy: number }

type Vec3 = [number, number, number]

/** Derin gece → denizaltı → mat turkuaz → kum → kırık beyaz */
export const RAMP: Array<[number, [number, number, number]]> = [
  [0, [0x10, 0x18, 0x20]],
  [0.35, [0x31, 0x4e, 0x52]],
  [0.62, [0x7a, 0x9e, 0x9f]],
  [0.85, [0xe8, 0xd8, 0xb0]],
  [1, [0xf2, 0xf2, 0xf2]],
]

export function ramp(t: number): [number, number, number] {
  const x = Math.min(1, Math.max(0, t))
  for (let i = 1; i < RAMP.length; i++) {
    const [p1, c1] = RAMP[i]
    const [p0, c0] = RAMP[i - 1]
    if (x <= p1) {
      const k = (x - p0) / (p1 - p0)
      return [c0[0] + (c1[0] - c0[0]) * k, c0[1] + (c1[1] - c0[1]) * k, c0[2] + (c1[2] - c0[2]) * k]
    }
  }
  return RAMP[RAMP.length - 1][1]
}

const hex = (c: number[]) => '#' + c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')

/** Işık: yatay açı (derece, 0 = sağdan) ve yükseklik açısı (derece) */
export function lightDir(azimuth: number, elevation: number): Vec3 {
  const a = (azimuth * Math.PI) / 180
  const e = (elevation * Math.PI) / 180
  return [Math.cos(a) * Math.cos(e), -Math.sin(a) * Math.cos(e), Math.sin(e)]
}

type MeshOpts = {
  width: number
  height: number
  cols: number
  rows: number
  seed: number
  jitter?: number
  relief?: number
  heightAt?: (u: number, v: number, r: () => number) => number
}

export type Mesh = { verts: Vec3[]; tris: Array<[number, number, number]> }

export function buildMesh({ width, height, cols, rows, seed, jitter = 0.42, relief = 1, heightAt }: MeshOpts): Mesh {
  const r = rng(seed)
  const verts: Vec3[] = []
  const dx = width / cols
  const dy = height / rows
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      const edgeX = i === 0 || i === cols
      const edgeY = j === 0 || j === rows
      const x = i * dx + (edgeX ? 0 : (r() - 0.5) * dx * jitter * 2)
      const y = j * dy + (edgeY ? 0 : (r() - 0.5) * dy * jitter * 2)
      const u = x / width
      const v = y / height
      const h = heightAt ? heightAt(u, v, r) : 0.5 + 0.28 * Math.sin(u * 6.2 + 1.3) * Math.cos(v * 4.1) + (r() - 0.5) * 0.22
      verts.push([x, y, h * relief])
    }
  }
  const tris: Array<[number, number, number]> = []
  const id = (i: number, j: number) => j * (cols + 1) + i
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = id(i, j)
      const b = id(i + 1, j)
      const c = id(i, j + 1)
      const d = id(i + 1, j + 1)
      // Köşegen yönü değişken: ızgara hissini kırar
      if ((i + j + Math.floor(r() * 2)) % 2) {
        tris.push([a, b, d], [a, d, c])
      } else {
        tris.push([a, b, c], [b, d, c])
      }
    }
  }
  return { verts, tris }
}

/**
 * Yüzleri gölgelendirir. zScale, yüksekliğin piksele göre ne kadar dik sayılacağıdır;
 * ambient gölgede kalan yüzün aldığı en düşük ışıktır.
 */
export function shade(mesh: Mesh, light: Vec3, { zScale = 60, ambient = 0.38, tint = 0 }: { zScale?: number; ambient?: number; tint?: number } = {}): Facet[] {
  return mesh.tris.map(([ia, ib, ic]) => {
    const a = mesh.verts[ia]
    const b = mesh.verts[ib]
    const c = mesh.verts[ic]
    const A: Vec3 = [a[0], a[1], a[2] * zScale]
    const B: Vec3 = [b[0], b[1], b[2] * zScale]
    const Cc: Vec3 = [c[0], c[1], c[2] * zScale]
    const u: Vec3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]]
    const v: Vec3 = [Cc[0] - A[0], Cc[1] - A[1], Cc[2] - A[2]]
    let n: Vec3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
    const len = Math.hypot(...n) || 1
    const lambert = Math.max(0, (n[0] * light[0] + n[1] * light[1] + n[2] * light[2]) / len)
    const h = (a[2] + b[2] + c[2]) / 3
    const base = ramp(h + tint)
    const k = ambient + (1 - ambient) * lambert
    return {
      points: `${a[0].toFixed(1)},${a[1].toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)} ${c[0].toFixed(1)},${c[1].toFixed(1)}`,
      fill: hex(base.map((x) => x * k)),
      height: h,
      cx: (a[0] + b[0] + c[0]) / 3,
      cy: (a[1] + b[1] + c[1]) / 3,
    }
  })
}
