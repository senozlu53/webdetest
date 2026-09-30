/** Sayfa taramaları: hepsi tarayıcının hesaplanan stilinden okunur */

export interface YuzeyTarama {
  n: number
  golge: number
  gradyan: number
  filtre: number
  kose: number
  gorsel: number
}
export function yuzeyTara(): YuzeyTarama {
  const hepsi = Array.from(document.querySelectorAll<HTMLElement>('body *'))
  let golge = 0
  let gradyan = 0
  let filtre = 0
  let kose = 0
  hepsi.forEach((e) => {
    const s = getComputedStyle(e)
    if (s.boxShadow !== 'none' || s.textShadow !== 'none') golge++
    if (s.backgroundImage !== 'none' || s.maskImage !== 'none') gradyan++
    if (s.filter !== 'none' || s.backdropFilter !== 'none') filtre++
    if (!['0px', ''].includes(s.borderTopLeftRadius) || !['0px', ''].includes(s.borderBottomRightRadius)) kose++
  })
  return { n: hepsi.length, golge, gradyan, filtre, kose, gorsel: document.querySelectorAll('img, picture, canvas, video').length }
}

let bc: CanvasRenderingContext2D | null = null
const onbellek = new Map<string, [number, number, number, number]>()
export function rgba(c: string): [number, number, number, number] {
  const hit = onbellek.get(c)
  if (hit) return hit
  bc ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  if (!bc) return [0, 0, 0, 1]
  bc.canvas.width = bc.canvas.height = 1
  bc.clearRect(0, 0, 1, 1)
  bc.fillStyle = '#000'
  bc.fillStyle = c
  bc.fillRect(0, 0, 1, 1)
  const d = bc.getImageData(0, 0, 1, 1).data
  const v: [number, number, number, number] = [d[0], d[1], d[2], d[3] / 255]
  onbellek.set(c, v)
  return v
}
const parlak = ([r, g, b]: number[]) => {
  const f = (v: number) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
export const oranHesap = (a: number[], b: number[]) => {
  const x = parlak(a)
  const y = parlak(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

export interface KontrastTarama {
  n: number
  aaa: number
  altinda: number
  enDusuk: number
  ornek: string[]
  kirpik: number
}
/** WCAG AAA: normal metin 7:1, büyük metin (≥ 24 px ya da ≥ 18,66 px kalın) 4,5:1. Ayrıca kırpılmış (taşan) metin sayısı. */
export function kontrastTara(): KontrastTarama {
  const kok = getComputedStyle(document.documentElement)
  const zemin = rgba(kok.getPropertyValue('--zemin')).slice(0, 3)
  let n = 0
  let altinda = 0
  let enDusuk = 99
  let kirpik = 0
  const ornek: string[] = []
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const gorulen = new Set<Element>()
  for (let t = w.nextNode(); t; t = w.nextNode()) {
    if (!t.textContent?.trim()) continue
    const e = t.parentElement
    if (!e || gorulen.has(e)) continue
    if (e.closest('.sr-only, script, style, svg, option, [aria-hidden="true"], [data-radix-popper-content-wrapper]')) continue
    gorulen.add(e)
    const s = getComputedStyle(e)
    if (s.display === 'none' || s.visibility === 'hidden') continue
    let bg = zemin
    for (let a: Element | null = e; a && a !== document.documentElement; a = a.parentElement) {
      const c = rgba(getComputedStyle(a).backgroundColor)
      if (c[3] >= 0.99) {
        bg = c.slice(0, 3)
        break
      }
    }
    const f = rgba(s.color)
    const fg = [0, 1, 2].map((i) => f[i] * f[3] + bg[i] * (1 - f[3]))
    const k = oranHesap(fg, bg)
    const px = parseFloat(s.fontSize)
    const buyuk = px >= 24 || (px >= 18.66 && parseInt(s.fontWeight) >= 700)
    const esik = buyuk ? 4.5 : 7
    n++
    enDusuk = Math.min(enDusuk, k)
    if (k < esik) {
      altinda++
      if (ornek.length < 3) ornek.push(`${k.toFixed(2)} < ${esik} "${t.textContent.trim().slice(0, 24)}"`)
    }
    // kırpılma: taşmayı gizleyen bir öğede içerik dışarıda kalıyor mu?
    if ((s.overflowX === 'hidden' || s.overflowX === 'clip') && e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 2) kirpik++
  }
  return { n, aaa: n - altinda, altinda, enDusuk: Math.round(enDusuk * 100) / 100, ornek, kirpik }
}
