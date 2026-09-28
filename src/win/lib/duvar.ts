import { PALET } from './pixel'

/**
 * Madde 8: 16 renkli (4-bit) duvar kağıdı. 320×200 (VGA) gökyüzü ve bulutlar hesaplanır, sonra 4×4 Bayer
 * matrisiyle sıralı dither uygulanıp VGA paletinin en yakın rengine indirilir. Büyütülürken yumuşatılmaz.
 */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16 - 0.5)
const VGA = Object.values(PALET).map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)])

function enYakin(r: number, g: number, b: number) {
  let en = 0
  let d = Infinity
  for (let i = 0; i < VGA.length; i++) {
    const [x, y, z] = VGA[i]
    const q = (r - x) ** 2 * 0.3 + (g - y) ** 2 * 0.59 + (b - z) ** 2 * 0.11
    if (q < d) {
      d = q
      en = i
    }
  }
  return VGA[en]
}

function gurultu(x: number, y: number, t: number) {
  return Math.sin(x * 0.045 + t) * Math.cos(y * 0.09 - t * 0.7) + Math.sin(x * 0.11 + y * 0.03 + t * 1.3) * 0.5 + Math.sin(x * 0.021 - y * 0.05) * 0.8
}

/** Ölçüm: çizilen resmin kaç farklı renk kullandığı (≤ 16 olmalı) */
export let sonRenkSayisi = 0

export function duvarCiz(gece: boolean, w = 320, h = 200, dither = true) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  if (!ctx) return ''
  const img = ctx.createImageData(w, h)
  const kume = new Set<string>()
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = y / h
      let r: number
      let g: number
      let b: number
      if (gece) {
        r = 0
        g = 0 + 20 * t
        b = 128 * (1 - t) + 20
      } else {
        r = 20 + 120 * t
        g = 90 + 130 * t
        b = 220 + 30 * t
      }
      const n = gurultu(x, y, gece ? 2 : 0)
      const bulut = Math.max(0, n - 0.55) * (gece ? 60 : 260)
      r += bulut
      g += bulut
      b += bulut
      if (gece && (x * 7919 + y * 104729) % 997 === 0) {
        r = g = b = 255
      }
      const k = dither ? BAYER[(y % 4) * 4 + (x % 4)] * 110 : 0
      const [R, G, B] = enYakin(r + k, g + k, b + k)
      const i = (y * w + x) * 4
      img.data[i] = R
      img.data[i + 1] = G
      img.data[i + 2] = B
      img.data[i + 3] = 255
      kume.add(`${R},${G},${B}`)
    }
  }
  sonRenkSayisi = kume.size
  ctx.putImageData(img, 0, 0)
  return c.toDataURL('image/png')
}

/** Duvar kağıdını :root üzerindeki --bulut değişkenine yazar (gündüz ve gece için ayrı) */
export function duvarKur(gece: boolean) {
  const url = duvarCiz(gece)
  if (url) document.documentElement.style.setProperty('--bulut', `url(${url})`)
}
