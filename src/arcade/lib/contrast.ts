/** WCAG 2.x göreli parlaklık ve kontrast */
export function hexRgb(h: string): [number, number, number] {
  const s = h.replace('#', '')
  const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)) as [number, number, number]
}
export function lum(h: string) {
  const [r, g, b] = hexRgb(h).map((c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export function kontrast(a: string, b: string) {
  const x = lum(a)
  const y = lum(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
/** Zeminin tam zıttı: siyah ya da beyaz, hangisi daha yüksek kontrast veriyorsa */
export const zit = (bg: string) => (kontrast('#000000', bg) >= kontrast('#ffffff', bg) ? '#000000' : '#ffffff')
/** Bir gradyanın bütün durakları için en kötü kontrast */
export const enKotu = (metin: string, duraklar: string[]) => Math.min(...duraklar.map((d) => kontrast(metin, d)))
export const oran = (n: number) => `${n.toFixed(2).replace('.', ',')}:1`
/** İki renk arasında doğrusal karışım (gradyan ara noktası için) */
export function karis(a: string, b: string, t: number) {
  const x = hexRgb(a)
  const y = hexRgb(b)
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')
}
