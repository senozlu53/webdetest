import { ADJ, ARTISTS_ART, NOUN, TECH } from './data'
import { between, pick, rng } from './rand'

export const ART_COLORS = ['#ff2e93', '#c8ff00', '#2f3cff', '#ff6a00', '#00e5ff', '#8a2bff', '#c9b5ff', '#ffb59e', '#9ef0c8', '#ffe680', '#9fd4ff', '#ffb8d9', '#0b0a0f', '#fff7ee']
const WORDS = ['ÇOK', 'DAHA', 'KAOS', 'HEY!', 'AŞIRI', 'BOL', 'TAŞ', 'OF!', 'YENİ', 'ŞIMARIK']

export type ElType = 'blob' | 'burst' | 'halftone' | 'stripes' | 'tri' | 'ring' | 'word'
export interface ArtEl {
  t: ElType
  x: number
  y: number
  s: number
  rot: number
  c: string
  c2: string
  seed: number
  word?: string
  font?: 'serif' | 'sans' | 'mono'
}
export interface ArtSpec {
  seed: number
  w: number
  h: number
  bg: string
  els: ArtEl[]
  title: string
  artist: string
  year: number
  tech: string
}

/** Galeri eseri: tohumdan kurulan kolaj. Aynı tohum aynı eser */
export function artSpec(seed: number): ArtSpec {
  const r = rng(seed * 7919 + 13)
  const w = 400
  const h = pick(r, [300, 400, 500, 560])
  const bg = pick(r, ART_COLORS)
  const other = () => {
    let c = pick(r, ART_COLORS)
    while (c === bg) c = pick(r, ART_COLORS)
    return c
  }
  const types: ElType[] = ['halftone', 'blob', 'blob', 'burst', 'stripes', 'tri', 'ring', 'word']
  const els: ArtEl[] = types
    .filter(() => r() > 0.18)
    .map((t) => ({
      t,
      x: between(r, 40, w - 40),
      y: between(r, 40, h - 40),
      s: t === 'halftone' ? between(r, 90, 170) : t === 'word' ? between(r, 46, 86) : between(r, 40, 120),
      rot: between(r, -40, 40),
      c: other(),
      c2: other(),
      seed: Math.floor(r() * 1e6),
      word: pick(r, WORDS),
      font: pick(r, ['serif', 'sans', 'mono'] as const),
    }))
  const n = 1 + Math.floor(r() * 40)
  return {
    seed,
    w,
    h,
    bg,
    els,
    title: `${pick(r, ADJ)} ${pick(r, NOUN)} No. ${n}`,
    artist: pick(r, ARTISTS_ART),
    year: 2019 + Math.floor(r() * 8),
    tech: pick(r, TECH),
  }
}
