import rough from 'roughjs'
import type { Drawable } from 'roughjs/bin/core'
import { karalama } from './prng'

/**
 * Madde 14: rough.js. Çizgileri <canvas>a değil, React'in kendi SVG'sine yazmak için üretici (generator) kullanılır:
 * toPaths() her şekli yol dizgesine çevirir. Aynı tohum aynı çizimi verir.
 */
const gen = rough.generator()

export interface Iz {
  d: string
  stroke: string
  sw: number
  fill: string
}
export interface Secenek {
  kusur?: number // roughness
  egrilik?: number // bowing
  sw?: number
  stroke?: string
  fill?: string
  dolguTip?: 'hachure' | 'cross-hatch' | 'zigzag' | 'solid' | 'dots' | 'dashed' | 'zigzag-line'
  aralik?: number // hachureGap
  aci?: number // hachureAngle
  dolguKalinlik?: number
  tohum?: number
  cokluCizgi?: boolean
}

const onbellek = new Map<string, Iz[]>()

function toIz(dr: Drawable): Iz[] {
  return gen.toPaths(dr).map((p) => ({ d: p.d, stroke: p.stroke, sw: p.strokeWidth, fill: p.fill ?? 'none' }))
}
function opt(o: Secenek) {
  return {
    roughness: o.kusur ?? 1.2,
    bowing: o.egrilik ?? 1.4,
    strokeWidth: o.sw ?? 2,
    stroke: o.stroke ?? '#2b2b2b',
    fill: o.fill,
    fillStyle: o.dolguTip ?? 'hachure',
    hachureGap: o.aralik ?? 7,
    hachureAngle: o.aci ?? -41,
    fillWeight: o.dolguKalinlik ?? 1.4,
    seed: o.tohum ?? 1,
    disableMultiStroke: o.cokluCizgi === false,
    preserveVertices: false,
  }
}
function onb(anahtar: string, uret: () => Drawable) {
  let v = onbellek.get(anahtar)
  if (!v) {
    v = toIz(uret())
    if (onbellek.size > 2500) onbellek.clear()
    onbellek.set(anahtar, v)
  }
  return v
}

export const kutu = (w: number, h: number, o: Secenek) => onb(`k${w}x${h}${JSON.stringify(o)}`, () => gen.rectangle(0, 0, w, h, opt(o)))
export const elips = (w: number, h: number, o: Secenek) => onb(`e${w}x${h}${JSON.stringify(o)}`, () => gen.ellipse(w / 2, h / 2, w, h, opt(o)))
export const yol = (d: string, o: Secenek) => onb(`y${d}${JSON.stringify(o)}`, () => gen.path(d, opt(o)))
export const cizgi = (x1: number, y1: number, x2: number, y2: number, o: Secenek) => onb(`c${x1},${y1},${x2},${y2}${JSON.stringify(o)}`, () => gen.line(x1, y1, x2, y2, opt(o)))

/** Yuvarlatılmış dikdörtgen yolu (rough.js'e yol olarak verilir) */
export function yuvarlakYol(w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2)
  return `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`
}
export const yuvarlak = (w: number, h: number, r: number, o: Secenek) => onb(`r${w}x${h}${r}${JSON.stringify(o)}`, () => gen.path(yuvarlakYol(w, h, r), opt(o)))

export const karalamaYol = (w: number, h: number, o: { aralik?: number; tohum?: number; aci?: number; tasma?: number }) => karalama(w, h, o)
