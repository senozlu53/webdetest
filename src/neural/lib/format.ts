const cache = new Map<number, Intl.NumberFormat>()
function nf(d: number) {
  let f = cache.get(d)
  if (!f) {
    f = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d })
    cache.set(d, f)
  }
  return f
}

/** Türkçe sayı: 48.200 · 2,31 */
export const num = (n: number, d = 0) => nf(d).format(n)
export const pct = (n: number, d = 0) => `%${num(n * 100, d)}`

/** Süre: 12,4 sn · 3 dk 20 sn · 3 sa 38 dk */
export function dur(sec: number) {
  if (sec < 60) return `${num(sec, sec < 10 ? 1 : 0)} sn`
  const m = Math.floor(sec / 60)
  if (m < 60) return `${m} dk ${Math.round(sec % 60)} sn`
  return `${Math.floor(m / 60)} sa ${m % 60} dk`
}

/** Bilimsel gösterim: 3,0e-4 */
export function sci(n: number) {
  if (n === 0) return '0'
  const e = Math.floor(Math.log10(Math.abs(n)))
  return `${num(n / 10 ** e, 1)}e${e}`
}

export function tokens(n: number) {
  if (n >= 1e9) return `${num(n / 1e9, 1)} milyar`
  if (n >= 1e6) return `${num(n / 1e6, 1)} milyon`
  if (n >= 1e3) return `${num(n / 1e3, n >= 1e4 ? 0 : 1)} bin`
  return num(n)
}
