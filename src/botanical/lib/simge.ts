/**
 * Madde 9: ince çizgili organik vektör ikonlar. 32×32 kutuda; yaprak, toprak ve su elementleri.
 * `dolgu` yumuşak bir ton dolgusudur (yaprak, damla, tohum).
 */
import { elips, petalAt, yaprakAt } from './organik'

export interface Parca {
  d: string
  dolgu?: boolean
}
const PI = Math.PI
const isin = (n: number, r0: number, r1: number, s = 16): string =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * PI * 2
    return `M${(s + Math.cos(a) * r0).toFixed(1)} ${(s + Math.sin(a) * r0).toFixed(1)}L${(s + Math.cos(a) * r1).toFixed(1)} ${(s + Math.sin(a) * r1).toFixed(1)}`
  }).join('')

export const SIMGELER = {
  /* ── doğa: bitki, toprak, su ── */
  yaprak: [{ d: 'M6 26C4 14 12 6 27 5C28 19 20 27 6 26Z', dolgu: true }, { d: 'M6 26C12 20 18 14 23 9' }],
  filiz: [{ d: 'M16 28V15' }, { d: 'M16 18C16 12 11 8 5 9C5 15 10 18 16 18Z', dolgu: true }, { d: 'M16 14C16 9 20 6 27 6C27 12 23 14 16 14Z', dolgu: true }, { d: 'M9 28H23' }],
  tohum: [{ d: 'M16 4C23 11 24 19 16 28C8 19 9 11 16 4Z', dolgu: true }, { d: 'M16 10C14 15 14 20 16 24' }],
  damla: [{ d: 'M16 4C22 12 26 16 26 20C26 25 22 28 16 28C10 28 6 25 6 20C6 16 10 12 16 4Z', dolgu: true }, { d: 'M11 21C11 23.5 13 25 15 25' }],
  dalga: [{ d: 'M3 10C7 6 11 6 16 10S25 14 29 10' }, { d: 'M3 17C7 13 11 13 16 17S25 21 29 17' }, { d: 'M3 24C7 20 11 20 16 24S25 28 29 24' }],
  gunes: [{ d: elips(16, 16, 5.5, 5.5), dolgu: true }, { d: isin(8, 9, 12.5) }],
  toprak: [{ d: 'M3 12C8 9 12 14 17 11S25 10 29 12' }, { d: 'M3 18C8 15 12 20 17 17S25 16 29 18' }, { d: 'M3 24C8 21 12 26 17 23S25 22 29 24' }, { d: 'M9 21.5h.01M22 14.5h.01M15 27.5h.01' }],
  agac: [{ d: 'M16 28V17' }, { d: 'M16 4C22 4 27 8 26 13C26 18 21 21 16 21C11 21 6 18 6 13C5 8 10 4 16 4Z', dolgu: true }, { d: 'M16 24L12 19M16 20L20 15' }],
  dag: [{ d: 'M3 27L12 9L17 18L21 12L29 27Z', dolgu: true }, { d: 'M9.5 14.5C11 16.5 12.5 15 14 17' }],
  cicek: [...petalAt(16, 14, -PI / 2, 9, 5, 0.42).map((d) => ({ d, dolgu: true })), { d: elips(16, 14, 2.2, 2.2) }, { d: 'M16 15V28' }, { d: yaprakAt(16, 24, -0.5, 8, 2.6) }],
  ari: [{ d: elips(17, 18, 8, 5.5, 0.2), dolgu: true }, { d: 'M14 13.5C13.5 17 14 20 15 22.5M19 14.5C19 17.5 19.5 20 20.5 22' }, { d: elips(13, 10, 4.5, 2.6, -0.7) }, { d: elips(19.5, 9, 4.5, 2.6, -1.0) }, { d: 'M25 20L28 22' }],
  dongu: [{ d: 'M8 15A9 9 0 0 1 23 9' }, { d: 'M24 5V10H19' }, { d: 'M24 17A9 9 0 0 1 9 23' }, { d: 'M8 27V22H13' }],
  kavanoz: [{ d: 'M10 4H22V8H10Z' }, { d: 'M10 8C7 10 7 12 7 15V25C7 27 8.5 28 10.5 28H21.5C23.5 28 25 27 25 25V15C25 12 25 10 22 8', dolgu: true }, { d: elips(16, 18, 5, 4) }],
  /* ── arayüz ── */
  sepet: [{ d: 'M5 13H27L24.5 25C24.3 26.2 23.4 27 22.2 27H9.8C8.6 27 7.7 26.2 7.5 25Z', dolgu: true }, { d: 'M11 13C11 6 21 6 21 13' }, { d: 'M12 19V22M16 19V22M20 19V22' }],
  kalp: [{ d: 'M16 27C6 20 4 13 8 9C11 6 15 8 16 11C17 8 21 6 24 9C28 13 26 20 16 27Z', dolgu: true }],
  ara: [{ d: 'M13 5C19 5 22 9 22 13C22 18 18 21 13 21C8 21 4 17 4 13C4 8 8 5 13 5Z' }, { d: 'M20 20L27 27' }],
  menu: [{ d: 'M5 9H27M5 16H21M5 23H27' }],
  ok: [{ d: 'M5 16H26M19 9L26 16L19 23' }],
  sol: [{ d: 'M27 16H6M13 9L6 16L13 23' }],
  tik: [{ d: 'M6 17L13 24L26 8' }],
  kapat: [{ d: 'M8 8L24 24M24 8L8 24' }],
  kullanici: [{ d: elips(16, 10, 5.5, 5.5), dolgu: true }, { d: 'M5 28C6 22 10 19 16 19C22 19 26 22 27 28' }],
  konum: [{ d: 'M16 28C10 20 7 16 7 12C7 7 11 4 16 4C21 4 25 7 25 12C25 16 22 20 16 28Z', dolgu: true }, { d: elips(16, 12, 3.2, 3.2) }],
  takvim: [{ d: 'M5 9C5 7.5 6 6.5 7.5 6.5H24.5C26 6.5 27 7.5 27 9V25C27 26.5 26 27.5 24.5 27.5H7.5C6 27.5 5 26.5 5 25Z' }, { d: 'M5 13H27' }, { d: 'M11 4V9M21 4V9' }, { d: yaprakAt(12, 24, -0.6, 8, 2.4), dolgu: true }],
  cadir: [{ d: 'M3 27L16 6L29 27Z', dolgu: true }, { d: 'M16 27V17L11 27' }, { d: 'M16 17L21 27' }],
  kalkan: [{ d: 'M16 4L26 8V16C26 22 21 26 16 28C11 26 6 22 6 16V8Z', dolgu: true }, { d: 'M11.5 16L15 19.5L21 12.5' }],
} satisfies Record<string, Parca[]>

export type SimgeAd = keyof typeof SIMGELER

export const DOGA_SIMGELERI: SimgeAd[] = ['yaprak', 'filiz', 'tohum', 'damla', 'dalga', 'gunes', 'toprak', 'agac', 'dag', 'cicek', 'ari', 'dongu', 'kavanoz']
export const ARAYUZ_SIMGELERI: SimgeAd[] = ['sepet', 'kalp', 'ara', 'menu', 'ok', 'sol', 'tik', 'kapat', 'kullanici', 'konum', 'takvim', 'cadir', 'kalkan']

export const SIMGE_AD: Record<SimgeAd, string> = {
  yaprak: 'Yaprak',
  filiz: 'Filiz',
  tohum: 'Tohum',
  damla: 'Su damlası',
  dalga: 'Su dalgası',
  gunes: 'Güneş',
  toprak: 'Toprak katmanları',
  agac: 'Ağaç',
  dag: 'Dağ',
  cicek: 'Çiçek',
  ari: 'Arı',
  dongu: 'Yenilenme (döngü)',
  kavanoz: 'Kavanoz',
  sepet: 'Sepet',
  kalp: 'Favori',
  ara: 'Ara',
  menu: 'Menü',
  ok: 'İleri',
  sol: 'Geri',
  tik: 'Onay',
  kapat: 'Kapat',
  kullanici: 'Kullanıcı',
  konum: 'Konum',
  takvim: 'Takvim',
  cadir: 'Çadır',
  kalkan: 'Sertifika',
}
