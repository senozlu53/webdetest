// Bağımlılıksız küçük 3B çizici: tel kafes ve nokta bulutu, perspektif izdüşüm, derinliğe göre saydamlık.
// Hologram estetiği için yeterli ve three.js'e göre çok hafif (Madde 11 · 16).

export type Vec3 = [number, number, number]
export type Mesh = {
  points: Vec3[]
  edges: [number, number][]
  /** Nokta grubu: 0 = seri A, 1 = seri B, 2 = diğer */
  groups?: number[]
  pointSize?: number
}

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}
const norm = (v: Vec3): Vec3 => {
  const l = Math.hypot(...v) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}

/** İkosfer: ikosahedron n kez bölünür; kenarlar yüzlerden benzersiz çıkarılır */
export function icosphere(subdiv = 1, radius = 1): Mesh {
  const t = (1 + Math.sqrt(5)) / 2
  let pts: Vec3[] = (
    [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ] as Vec3[]
  ).map(norm)
  let faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ]
  for (let s = 0; s < subdiv; s++) {
    const cache = new Map<string, number>()
    const mid = (a: number, b: number) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`
      let i = cache.get(k)
      if (i === undefined) {
        pts.push(norm([(pts[a][0] + pts[b][0]) / 2, (pts[a][1] + pts[b][1]) / 2, (pts[a][2] + pts[b][2]) / 2]))
        i = pts.length - 1
        cache.set(k, i)
      }
      return i
    }
    faces = faces.flatMap(([a, b, c]) => {
      const ab = mid(a, b)
      const bc = mid(b, c)
      const ca = mid(c, a)
      return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]]
    })
  }
  pts = pts.map((p) => [p[0] * radius, p[1] * radius, p[2] * radius])
  const seen = new Set<string>()
  const edges: [number, number][] = []
  for (const [a, b, c] of faces)
    for (const [x, y] of [[a, b], [b, c], [c, a]]) {
      const k = x < y ? `${x}-${y}` : `${y}-${x}`
      if (!seen.has(k)) {
        seen.add(k)
        edges.push([x, y])
      }
    }
  return { points: pts, edges }
}

/** Eğik yörünge halkası */
export function ring(radius: number, n: number, tiltX: number, tiltZ = 0): Mesh {
  const points: Vec3[] = []
  const edges: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    let p: Vec3 = [Math.cos(a) * radius, 0, Math.sin(a) * radius]
    p = rotX(p, tiltX)
    p = rotZ(p, tiltZ)
    points.push(p)
    edges.push([i, (i + 1) % n])
  }
  return { points, edges }
}

/** Tensör kafesi: n×n×n nokta, eksen boyunca komşu kenarlar */
export function lattice(n = 5, size = 1.5): Mesh {
  const points: Vec3[] = []
  const edges: [number, number][] = []
  const idx = (x: number, y: number, z: number) => x * n * n + y * n + z
  for (let x = 0; x < n; x++)
    for (let y = 0; y < n; y++)
      for (let z = 0; z < n; z++) {
        points.push([(x / (n - 1) - 0.5) * size * 2 * 0.62, (y / (n - 1) - 0.5) * size * 2 * 0.62, (z / (n - 1) - 0.5) * size * 2 * 0.62])
        if (x < n - 1) edges.push([idx(x, y, z), idx(x + 1, y, z)])
        if (y < n - 1) edges.push([idx(x, y, z), idx(x, y + 1, z)])
        if (z < n - 1) edges.push([idx(x, y, z), idx(x, y, z + 1)])
      }
  return { points, edges, pointSize: 1.2 }
}

/** Gömme uzayı: iki küme (seri A, seri B) ve seyrek "diğer" noktalar */
export function embeddingCloud(seed = 11): Mesh {
  const r = rng(seed)
  const gauss = () => {
    const u = r() || 1e-6
    const v = r()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }
  const centers: Vec3[] = [
    [-0.55, 0.25, 0.2],
    [0.6, -0.2, -0.25],
  ]
  const points: Vec3[] = []
  const groups: number[] = []
  centers.forEach((c, g) => {
    for (let i = 0; i < 140; i++) {
      points.push([c[0] + gauss() * 0.28, c[1] + gauss() * 0.22, c[2] + gauss() * 0.26])
      groups.push(g)
    }
  })
  for (let i = 0; i < 60; i++) {
    points.push([(r() - 0.5) * 2.4, (r() - 0.5) * 1.8, (r() - 0.5) * 2.2])
    groups.push(2)
  }
  return { points, edges: [], groups, pointSize: 1.6 }
}

export function merge(...meshes: Mesh[]): Mesh {
  const points: Vec3[] = []
  const edges: [number, number][] = []
  for (const m of meshes) {
    const o = points.length
    points.push(...m.points)
    edges.push(...m.edges.map(([a, b]) => [a + o, b + o] as [number, number]))
  }
  return { points, edges }
}

export function rotX(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]
}
export function rotY(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]
}
export function rotZ(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]
}

export type Palette = { line: string; point: string; a: string; b: string; other: string; glow: boolean }

const sprites = new Map<string, HTMLCanvasElement>()
function glowSprite(color: string) {
  let c = sprites.get(color)
  if (c) return c
  c = document.createElement('canvas')
  c.width = c.height = 32
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16)
  grad.addColorStop(0, color)
  grad.addColorStop(0.25, color)
  grad.addColorStop(1, 'transparent')
  g.fillStyle = grad
  g.globalAlpha = 0.5
  g.fillRect(0, 0, 32, 32)
  sprites.set(color, c)
  return c
}

/**
 * Çizim: noktalar yaw (Y) ve pitch (X) ile döner, kameraya uzaklığa göre perspektif alır.
 * Uzaktaki çizgiler soluklaşır (derinlik ipucu); yakın noktalara yumuşak parıltı eklenir.
 */
export function render(
  ctx: CanvasRenderingContext2D,
  mesh: Mesh,
  w: number,
  h: number,
  rot: { yaw: number; pitch: number; zoom: number },
  pal: Palette,
  glow = pal.glow,
) {
  ctx.clearRect(0, 0, w, h)
  const D = 3.6
  const f = (Math.min(w, h) / 2) * 2.35 * rot.zoom
  const proj = mesh.points.map((p) => {
    const q = rotX(rotY(p, rot.yaw), rot.pitch)
    const s = f / (D - q[2])
    return [w / 2 + q[0] * s, h / 2 - q[1] * s, q[2], s] as const
  })
  // Kenarlar: derinliği 4 kovaya bölüp her kovayı tek seferde çiz
  if (mesh.edges.length) {
    const buckets: number[][] = [[], [], [], []]
    mesh.edges.forEach(([a, b], i) => {
      const z = (proj[a][2] + proj[b][2]) / 2
      const k = Math.max(0, Math.min(3, Math.floor((z + 1.2) / 0.6)))
      buckets[k].push(i)
    })
    ctx.lineWidth = 1
    ctx.strokeStyle = pal.line
    buckets.forEach((list, k) => {
      ctx.globalAlpha = 0.14 + k * 0.2
      ctx.beginPath()
      for (const i of list) {
        const [a, b] = mesh.edges[i]
        ctx.moveTo(proj[a][0], proj[a][1])
        ctx.lineTo(proj[b][0], proj[b][1])
      }
      ctx.stroke()
    })
  }
  // Noktalar
  const size = mesh.pointSize ?? 1.4
  const colorOf = (g: number | undefined) => (g === 0 ? pal.a : g === 1 ? pal.b : g === 2 ? pal.other : pal.point)
  const order = proj.map((_, i) => i).sort((i, j) => proj[i][2] - proj[j][2])
  for (const i of order) {
    const [x, y, z, s] = proj[i]
    const depth = Math.max(0, Math.min(1, (z + 1.3) / 2.6))
    const rad = Math.max(0.6, (size * s) / 70)
    const g0 = mesh.groups?.[i]
    const color = colorOf(g0)
    // "Diğer" noktalar geri planda kalır: parıltısız ve soluk
    if (g0 === 2) {
      ctx.globalAlpha = 0.2 + depth * 0.3
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, rad * 0.8, 0, Math.PI * 2)
      ctx.fill()
      continue
    }
    if (glow && depth > 0.55) {
      ctx.globalAlpha = depth * 0.8
      const g = glowSprite(color)
      const gs = rad * 7
      ctx.drawImage(g, x - gs / 2, y - gs / 2, gs, gs)
    }
    ctx.globalAlpha = 0.3 + depth * 0.7
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, rad, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

export function readPalette(el: Element): Palette {
  const cs = getComputedStyle(el)
  const v = (n: string) => cs.getPropertyValue(n).trim()
  return { line: v('--cyan-text'), point: v('--cyan-text'), a: v('--series-a'), b: v('--series-b'), other: v('--muted'), glow: v('--canvas-glow') !== '0' }
}
