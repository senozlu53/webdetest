/** Bir metin öğesinin gerçek satır sayısı ve satır başına ortalama karakter sayısı (satır kırılmalarından ölçülür) */
export function satirOlc(el: HTMLElement) {
  const r = document.createRange()
  r.selectNodeContents(el)
  const lh = parseFloat(getComputedStyle(el).lineHeight) || 20
  const tops = new Set<number>()
  for (const k of Array.from(r.getClientRects())) if (k.width > 0) tops.add(Math.round(k.top / (lh * 0.6)))
  const satir = Math.max(1, tops.size)
  const karakter = (el.textContent ?? '').length
  return { satir, karakter: Math.round(karakter / satir) }
}

let tuval: CanvasRenderingContext2D | null = null
/** Bir sütunun satır başına kaç karakter alacağı: ortalama karakter genişliği tuvalde ölçülür */
export function ortKarakter(el: HTMLElement, sutunGenislik: number) {
  tuval ??= document.createElement('canvas').getContext('2d')
  if (!tuval) return 0
  const s = getComputedStyle(el)
  tuval.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`
  const ornek = (el.textContent ?? '').slice(0, 240) || 'Bir sayfayı iyi yapan şey'
  const w = tuval.measureText(ornek).width / ornek.length
  return Math.round(sutunGenislik / w)
}
