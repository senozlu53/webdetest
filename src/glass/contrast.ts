/** WCAG kontrastı ve yarı saydam katman karışımı: cam laboratuvarı ve renk tablosu için. */
export type RGB = [number, number, number]

export function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB
}

/** `top` rengini `alpha` opaklıkla `bottom` üstüne bindirir. */
export function blend(top: RGB, bottom: RGB, alpha: number): RGB {
  return top.map((c, i) => c * alpha + bottom[i] * (1 - alpha)) as RGB
}

function luminance([r, g, b]: RGB) {
  const f = (v: number) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

export function contrast(a: RGB, b: RGB) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * Cam arkasındaki en kötü durum: blur ortalama rengi değiştirmez, en açık ya da en koyu
 * ışık lekesinin tam arkaya denk geldiği an esas alınır.
 */
export function worstContrast(text: RGB, glass: RGB, alpha: number, backgrounds: RGB[]) {
  return Math.min(...backgrounds.map((bg) => contrast(text, blend(glass, bg, alpha))))
}
