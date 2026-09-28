/** Madde 18: erişilebilirlik ağacının kaba bir özeti, DOM'dan canlı çıkarılır */

export interface Iskelet {
  tur: string
  metin: string
  duzey: number
}

const gizli = (el: Element) => !!el.closest('[aria-hidden="true"], [hidden]')
const temiz = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim()

function ad(el: HTMLElement): string {
  const lb = el.getAttribute('aria-labelledby')
  if (lb) return temiz(lb.split(' ').map((id) => document.getElementById(id)?.textContent).join(' '))
  return temiz(el.getAttribute('aria-label'))
}

function rol(el: HTMLElement): string | null {
  switch (el.tagName) {
    case 'HEADER':
      return el.closest('main, section, article') ? null : 'başlık alanı (banner)'
    case 'FOOTER':
      return el.closest('main, section, article') ? null : 'alt bilgi (contentinfo)'
    case 'NAV':
      return 'gezinme (navigation)'
    case 'MAIN':
      return 'ana içerik (main)'
    case 'SECTION':
      return ad(el) ? 'bölge (region)' : null
    case 'FORM':
      return ad(el) ? 'form' : null
    default:
      return null
  }
}

/** Yer imleri ve başlıklar, belge sırasıyla: ekran okuyucunun gezinme listesi */
export function iskelet(): Iskelet[] {
  const out: Iskelet[] = []
  for (const el of document.body.querySelectorAll<HTMLElement>('header, footer, nav, main, section, form, h1, h2, h3, h4, h5, h6')) {
    if (gizli(el)) continue
    const m = /^H([1-6])$/.exec(el.tagName)
    if (m) {
      out.push({ tur: `başlık ${m[1]}`, metin: temiz(el.textContent), duzey: +m[1] })
      continue
    }
    const r = rol(el)
    if (r) out.push({ tur: r, metin: ad(el), duzey: 0 })
  }
  return out
}

export interface Sayim {
  sinif: number
  stil: number
  div: number
  etiket: [string, number][]
  alan: number
  etiketsiz: number
  tablo: number
  basliksizTablo: number
  atlama: number
  link: number
  gorsel: number
  golge: number
}

/** Sayfanın canlı sayımı: sınıf, style, div, etiketler, etiketsiz alanlar, başlık atlamaları, gölgeler */
export function say(): Sayim {
  const b = document.body
  const hepsi = Array.from(b.querySelectorAll<HTMLElement>('*'))
  const acik = hepsi.filter((e) => !gizli(e))
  const alanlar = acik.filter((e) => e.matches('input:not([type="hidden"], [type="submit"], [type="reset"], [type="button"]), select, textarea'))
  const etiketsiz = alanlar.filter((e) => !((e as HTMLInputElement).labels?.length || e.getAttribute('aria-label') || e.getAttribute('aria-labelledby')))
  const tablolar = acik.filter((e) => e.tagName === 'TABLE')
  const basliklar = acik.filter((e) => /^H[1-6]$/.test(e.tagName)).map((h) => +h.tagName[1])
  const atlama = basliklar.filter((l, i) => i > 0 && l > basliklar[i - 1] + 1).length
  const kontrol = 'input, select, textarea, button, progress, meter, marquee, summary'
  const golge = acik.filter((e) => {
    if (e.matches(kontrol)) return false
    const s = getComputedStyle(e)
    return s.boxShadow !== 'none' || s.textShadow !== 'none' || parseFloat(s.borderTopLeftRadius) > 0
  }).length
  const say = new Map<string, number>()
  for (const e of hepsi) say.set(e.tagName.toLowerCase(), (say.get(e.tagName.toLowerCase()) ?? 0) + 1)
  return {
    sinif: hepsi.filter((e) => e.hasAttribute('class')).length,
    stil: hepsi.filter((e) => e.hasAttribute('style')).length,
    div: b.querySelectorAll('div').length,
    etiket: [...say.entries()].sort((a, c) => c[1] - a[1]),
    alan: alanlar.length,
    etiketsiz: etiketsiz.length,
    tablo: tablolar.length,
    basliksizTablo: tablolar.filter((t) => !t.querySelector('caption') && !t.getAttribute('aria-label')).length,
    atlama,
    link: acik.filter((e) => e.tagName === 'A' && e.hasAttribute('href')).length,
    gorsel: b.querySelectorAll('img').length,
    golge,
  }
}
