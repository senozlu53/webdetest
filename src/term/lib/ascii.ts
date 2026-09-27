// Saf ASCII yardımcıları: hizalama, çubuk, yoğunluk rampası ve blok yazı.
// Yazı tiplerinin Latin alt kümelerinde kutu çizim karakterleri (U+2500) yok; bu yüzden yalnız + - | # = . kullanılır.

/** Görünen karakter sayısı (Türkçe harfler tek kod noktası) */
export const len = (s: string) => [...s].length

export function pad(s: string, n: number, align: 'left' | 'right' = 'left') {
  const d = Math.max(0, n - len(s))
  return align === 'right' ? ' '.repeat(d) + s : s + ' '.repeat(d)
}

/** Nokta dolgulu satır: "Bellek ........ [ OK ]" */
export function dots(left: string, right: string, width: number) {
  const n = Math.max(2, width - len(left) - len(right) - 2)
  return `${left} ${'.'.repeat(n)} ${right}`
}

/** Yatay çubuk: [#########.........] */
export function bar(value: number, max: number, width: number, fill = '#', empty = '.') {
  const n = Math.max(0, Math.min(width, Math.round((value / max) * width)))
  return fill.repeat(n) + empty.repeat(width - n)
}

/** Yoğunluk rampası: 0 → boşluk, 1 → @ */
export const RAMP = ' .:-=+*#%@'
export const shade = (t: number) => RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.round(t * (RAMP.length - 1))))]

export const nf = (n: number, d = 0) => n.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d })

export function clock(d = new Date()) {
  const p = (n: number, w = 2) => String(n).padStart(w, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`
}

/* ── Blok yazı: her piksel iki karakter ("##"), böylece hücre yaklaşık karedir ── */
const FONT: Record<string, string[]> = {
  T: ['#####', '  #  ', '  #  ', '  #  ', '  #  '],
  E: ['#####', '#    ', '#### ', '#    ', '#####'],
  R: ['#### ', '#   #', '#### ', '#  # ', '#   #'],
  M: ['#   #', '## ##', '# # #', '#   #', '#   #'],
  İ: ['###', ' # ', ' # ', ' # ', '###'],
  I: ['###', ' # ', ' # ', ' # ', '###'],
  N: ['#   #', '##  #', '# # #', '#  ##', '#   #'],
  A: [' ### ', '#   #', '#####', '#   #', '#   #'],
  L: ['#    ', '#    ', '#    ', '#    ', '#####'],
  ' ': ['  ', '  ', '  ', '  ', '  '],
}

/** Satır dizisi döndürür; "İ" üstündeki nokta için fazladan bir satır eklenir */
export function banner(text: string, px = '##') {
  const glyphs = [...text].map((c) => FONT[c] ?? FONT[' '])
  const rows = [0, 1, 2, 3, 4].map((r) => glyphs.map((g) => g[r].replace(/#/g, '\u0001').replace(/ /g, ' '.repeat(px.length)).replace(/\u0001/g, px)).join('  '))
  // Noktalı İ: üstte tek satır
  const top = glyphs
    .map((g, i) => {
      const w = g[0].length * px.length
      if ([...text][i] !== 'İ') return ' '.repeat(w)
      const mid = Math.floor(g[0].length / 2) * px.length
      return ' '.repeat(mid) + px + ' '.repeat(w - mid - px.length)
    })
    .join('  ')
  return top.trim() ? [top, ...rows] : rows
}
