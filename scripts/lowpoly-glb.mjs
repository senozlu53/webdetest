// Stil 009 · Low Poly için GLB modelleri üretir (bağımlılık yok, sabit tohum → her çalıştırmada aynı dosya).
// Çalıştırma: node scripts/lowpoly-glb.mjs
// Çıktı: src/lowpoly/assets/{kristal,ucak,kaya,agac}.glb
//
// Her model "flat shaded": üçgenler köşe paylaşmaz, her yüzün kendi normali ve tek rengi vardır.
// Malzeme mat (metalik 0, pürüzlülük 1); renkler COLOR_0 (doğrusal) olarak yazılır.

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/lowpoly/assets')

const PALETTE = {
  gece: '#101820',
  denizalti: '#314E52',
  turkuaz: '#7A9E9F',
  kum: '#E8D8B0',
  beyaz: '#F2F2F2',
}

function rng(seed) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}

const hexToLinear = (hex) =>
  [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm = (a) => {
  const l = Math.hypot(...a) || 1
  return a.map((v) => v / l)
}

/** Üçgen listesi → düz gölgelendirilmiş (paylaşımsız) konum, normal ve renk dizileri */
class Mesh {
  constructor() {
    this.pos = []
    this.nrm = []
    this.col = []
  }
  tri(a, b, c, color) {
    const n = norm(cross(sub(b, a), sub(c, a)))
    for (const p of [a, b, c]) {
      this.pos.push(...p)
      this.nrm.push(...n)
      this.col.push(...color)
    }
  }
  quad(a, b, c, d, color) {
    this.tri(a, b, c, color)
    this.tri(a, c, d, color)
  }
}

function writeGlb(file, name, mesh, { doubleSided = false } = {}) {
  const pos = new Float32Array(mesh.pos)
  const nrm = new Float32Array(mesh.nrm)
  const col = new Float32Array(mesh.col)
  const count = pos.length / 3
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < count; i++)
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], pos[i * 3 + k])
      max[k] = Math.max(max[k], pos[i * 3 + k])
    }
  const bin = Buffer.concat([Buffer.from(pos.buffer), Buffer.from(nrm.buffer), Buffer.from(col.buffer)])
  const L = pos.byteLength
  const json = {
    asset: { version: '2.0', generator: 'webdetest scripts/lowpoly-glb.mjs' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name }],
    meshes: [{ name, primitives: [{ attributes: { POSITION: 0, NORMAL: 1, COLOR_0: 2 }, material: 0, mode: 4 }] }],
    materials: [{ name: `${name}-mat`, doubleSided, pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 1], metallicFactor: 0, roughnessFactor: 1 } }],
    buffers: [{ byteLength: bin.length }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: L, target: 34962 },
      { buffer: 0, byteOffset: L, byteLength: L, target: 34962 },
      { buffer: 0, byteOffset: 2 * L, byteLength: L, target: 34962 },
    ],
    accessors: [
      { bufferView: 0, componentType: 5126, count, type: 'VEC3', min: min.map((v) => +v.toFixed(5)), max: max.map((v) => +v.toFixed(5)) },
      { bufferView: 1, componentType: 5126, count, type: 'VEC3' },
      { bufferView: 2, componentType: 5126, count, type: 'VEC3' },
    ],
  }
  let jsonBuf = Buffer.from(JSON.stringify(json), 'utf8')
  jsonBuf = Buffer.concat([jsonBuf, Buffer.alloc((4 - (jsonBuf.length % 4)) % 4, 0x20)])
  const binBuf = Buffer.concat([bin, Buffer.alloc((4 - (bin.length % 4)) % 4, 0)])
  const total = 12 + 8 + jsonBuf.length + 8 + binBuf.length
  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546c67, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(total, 8)
  const jh = Buffer.alloc(8)
  jh.writeUInt32LE(jsonBuf.length, 0)
  jh.writeUInt32LE(0x4e4f534a, 4)
  const bh = Buffer.alloc(8)
  bh.writeUInt32LE(binBuf.length, 0)
  bh.writeUInt32LE(0x004e4942, 4)
  writeFileSync(resolve(OUT, file), Buffer.concat([header, jh, jsonBuf, bh, binBuf]))
  console.log(`${file}: ${count / 3} üçgen, ${total} bayt`)
}

const C = Object.fromEntries(Object.entries(PALETTE).map(([k, v]) => [k, hexToLinear(v)]))

/* ── Kristal: sekizgen taç + sivri alt (pavyon) ─────────────────── */
function crystal() {
  const r = rng(9)
  const m = new Mesh()
  const n = 8
  const table = 0.42
  const girdle = 1
  const yTop = 0.62
  const yGirdle = 0.18
  const yCulet = -1.25
  const top = (i) => [Math.cos((i / n) * Math.PI * 2) * table, yTop, Math.sin((i / n) * Math.PI * 2) * table]
  const mid = (i) => [Math.cos(((i + 0.5) / n) * Math.PI * 2) * girdle, yGirdle, Math.sin(((i + 0.5) / n) * Math.PI * 2) * girdle]
  const face = () => mix(C.turkuaz, C.kum, r() * 0.55)
  const center = [0, yTop, 0]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    m.tri(center, top(j), top(i), mix(C.beyaz, C.kum, r() * 0.5))
    m.tri(top(i), top(j), mid(i), face())
    m.tri(top(i), mid(i), mid((i + n - 1) % n), face())
    m.tri(mid(i), [0, yCulet, 0], mid((i + n - 1) % n), mix(C.turkuaz, C.kum, r() * 0.45))
  }
  return m
}

/* ── Kağıt uçak: origami, iki kanat ve omurga ─────────────────── */
function plane() {
  const m = new Mesh()
  const nose = [0, 0, 1.4]
  const tailL = [-1.05, 0.12, -1]
  const tailR = [1.05, 0.12, -1]
  const keelTop = [0, 0, -1]
  const keelBottom = [0, -0.42, -0.95]
  const foldL = [-0.22, 0.02, -1]
  const foldR = [0.22, 0.02, -1]
  m.tri(nose, foldL, tailL, C.beyaz)
  m.tri(nose, tailR, foldR, mix(C.beyaz, C.kum, 0.6))
  m.tri(nose, keelTop, foldL, mix(C.kum, C.beyaz, 0.3))
  m.tri(nose, foldR, keelTop, C.kum)
  m.tri(nose, keelBottom, keelTop, mix(C.turkuaz, C.kum, 0.4))
  return m
}

/* ── Kaya: gürültüyle bozulmuş ikosahedron (1 kez bölünmüş) ───── */
function rock() {
  const r = rng(27)
  const t = (1 + Math.sqrt(5)) / 2
  let verts = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map(norm)
  let faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ]
  const cache = new Map()
  const midpoint = (a, b) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`
    if (!cache.has(k)) {
      verts.push(norm(verts[a].map((v, i) => (v + verts[b][i]) / 2)))
      cache.set(k, verts.length - 1)
    }
    return cache.get(k)
  }
  faces = faces.flatMap(([a, b, c]) => {
    const ab = midpoint(a, b)
    const bc = midpoint(b, c)
    const ca = midpoint(c, a)
    return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]]
  })
  verts = verts.map((v) => {
    const k = 0.78 + r() * 0.34
    return [v[0] * k * 1.15, v[1] * k * 0.8, v[2] * k]
  })
  const m = new Mesh()
  for (const [a, b, c] of faces) {
    const y = (verts[a][1] + verts[b][1] + verts[c][1]) / 3
    m.tri(verts[a], verts[b], verts[c], mix(C.denizalti, C.turkuaz, Math.min(1, Math.max(0, 0.45 + y * 0.6 + (r() - 0.5) * 0.25))))
  }
  return m
}

/* ── Ağaç: altıgen gövde ve üç kat koni yaprak ─────────────────── */
function tree() {
  const r = rng(5)
  const m = new Mesh()
  const ring = (n, rad, y, rot = 0) => Array.from({ length: n }, (_, i) => [Math.cos((i / n) * Math.PI * 2 + rot) * rad, y, Math.sin((i / n) * Math.PI * 2 + rot) * rad])
  const trunkB = ring(6, 0.16, -1.2)
  const trunkT = ring(6, 0.12, -0.55)
  for (let i = 0; i < 6; i++) {
    const j = (i + 1) % 6
    m.quad(trunkB[j], trunkB[i], trunkT[i], trunkT[j], mix(C.kum, C.denizalti, 0.35 + r() * 0.2))
  }
  const tiers = [
    { y: -0.7, rad: 0.95, h: 1.0 },
    { y: -0.15, rad: 0.75, h: 0.9 },
    { y: 0.4, rad: 0.5, h: 0.85 },
  ]
  tiers.forEach((t, k) => {
    const base = ring(7, t.rad, t.y, k * 0.4)
    const tip = [0, t.y + t.h, 0]
    for (let i = 0; i < 7; i++) {
      const j = (i + 1) % 7
      m.tri(base[j], base[i], tip, mix(C.denizalti, C.turkuaz, 0.25 + r() * 0.55))
      m.tri(base[i], base[j], [0, t.y - 0.08, 0], mix(C.gece, C.denizalti, 0.6))
    }
  })
  return m
}

mkdirSync(OUT, { recursive: true })
writeGlb('kristal.glb', 'Kristal', crystal())
writeGlb('ucak.glb', 'KagitUcak', plane(), { doubleSided: true })
writeGlb('kaya.glb', 'Kaya', rock())
writeGlb('agac.glb', 'Agac', tree())
