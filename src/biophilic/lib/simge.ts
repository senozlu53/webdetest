/**
 * Madde 9: ince konturlu modern ikonlar. 32×32 kutuda, dolgusuz; güneş, yaprak, su damlası ve nefes ailesi.
 * Çizgi kalınlığı Ikon bileşeninden gelir (varsayılan 1,4); uçlar ve köşeler yuvarlaktır.
 */
import { elips, yaprakAt } from './organik'

export interface Parca {
  d: string
}
const PI = Math.PI
const isin = (n: number, r0: number, r1: number, faz = 0, s = 16): string =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * PI * 2 + faz
    return `M${(s + Math.cos(a) * r0).toFixed(1)} ${(s + Math.sin(a) * r0).toFixed(1)}L${(s + Math.cos(a) * r1).toFixed(1)} ${(s + Math.sin(a) * r1).toFixed(1)}`
  }).join('')
const daire = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`

export const SIMGELER = {
  /* ── gökyüzü ve ışık ── */
  gunes: [{ d: daire(16, 16, 5.5) }, { d: isin(8, 9.5, 13) }],
  ay: [{ d: 'M25 19.5A10 10 0 1 1 12.5 7A8 8 0 0 0 25 19.5Z' }, { d: 'M22 6.5v3M20.5 8h3' }],
  dogus: [{ d: 'M8 22a8 8 0 0 1 16 0' }, { d: 'M3 22h26M16 6v4M6.5 12l2.5 2.5M25.5 12L23 14.5' }, { d: 'M12 27h8' }],
  batis: [{ d: 'M8 22a8 8 0 0 1 16 0' }, { d: 'M3 22h26M12 9l4 4 4-4' }, { d: 'M9 27h14' }],
  bulut: [{ d: 'M9 25a5.2 5.2 0 0 1-.6-10.4A8 8 0 0 1 23.6 12.8 6.1 6.1 0 0 1 23 25Z' }],
  ruzgar: [{ d: 'M4 12h14a3.5 3.5 0 1 0-3.5-3.5' }, { d: 'M4 18h20a3.5 3.5 0 1 1-3.5 3.5' }, { d: 'M4 24h9' }],
  isik: [{ d: 'M11 21c0-2-3-3.6-3-7.5a8 8 0 0 1 16 0C24 17.4 21 19 21 21Z' }, { d: 'M12 25h8M13.5 28.5h5' }],
  /* ── bitki ve su ── */
  yaprak: [{ d: 'M6 26C4 14 12 6 27 5C28 19 20 27 6 26Z' }, { d: 'M6 26L21 11M13 19.5L13 14M17 16.5l5 .5' }],
  filiz: [{ d: 'M16 28V14' }, { d: 'M16 19C16 13 11 9.5 5 10.5C5 16 10 19 16 19Z' }, { d: 'M16 14C16 9 20 6 27 6C27 12 23 14 16 14Z' }],
  tohum: [{ d: 'M16 4C23 11 24 19 16 28C8 19 9 11 16 4Z' }, { d: 'M16 10C14.5 14.5 14.5 19 16 23' }],
  agac: [{ d: 'M16 28V18' }, { d: 'M16 4C22 4 27 8 26 13C26 18 21 21 16 21C11 21 6 18 6 13C5 8 10 4 16 4Z' }, { d: 'M16 24l-4-5M16 20l4-5' }],
  damla: [{ d: 'M16 4C22 12 26 16 26 20a10 10 0 0 1-20 0C6 16 10 12 16 4Z' }, { d: 'M11 21a5 5 0 0 0 4.5 4.5' }],
  dalga: [{ d: 'M3 10C7 6 11 6 16 10S25 14 29 10' }, { d: 'M3 17C7 13 11 13 16 17S25 21 29 17' }, { d: 'M3 24C7 20 11 20 16 24S25 28 29 24' }],
  nem: [{ d: 'M16 4C22 12 26 16 26 20a10 10 0 0 1-20 0C6 16 10 12 16 4Z' }, { d: 'M10.5 20.5c1.8-1.2 3.6-1.2 5.5 0s3.7 1.2 5.5 0' }],
  sicaklik: [{ d: 'M13 6.5a3 3 0 0 1 6 0v12.2a5.5 5.5 0 1 1-6 0Z' }, { d: 'M16 12v10.5' }, { d: 'M22 9h3M22 13h2' }],
  /* ── nefes, beden ── */
  nefes: [{ d: daire(16, 16, 3) }, { d: daire(16, 16, 7.2) }, { d: 'M16 5a11 11 0 0 1 9.5 5.5M6.5 21.5A11 11 0 0 1 6.5 10.5M25.5 21.5A11 11 0 0 1 16 27' }],
  kalp: [{ d: 'M16 27C6 20 4 13 8 9.2c3-2.8 7-.8 8 2.2 1-3 5-5 8-2.2C28 13 26 20 16 27Z' }],
  nabiz: [{ d: 'M3 17h6l3-8 5 15 3.5-10H29' }],
  uyku: [{ d: 'M24 21A10 10 0 1 1 11 8a8 8 0 0 0 13 13Z' }, { d: 'M19 5h5l-5 6h5' }],
  meditasyon: [{ d: daire(16, 8.5, 2.7) }, { d: 'M16 12.5v6' }, { d: 'M9 17c3.2 0 4.4-2 7-2s3.8 2 7 2' }, { d: 'M6 27c0-3.4 3.6-5.5 10-5.5S26 23.6 26 27' }],
  /* ── yaşam alanı ── */
  ev: [{ d: 'M4 15L16 5l12 10' }, { d: 'M7 13v14h18V13' }, { d: 'M13 27v-8h6v8' }],
  saksi: [{ d: 'M10 20h12l-1.6 8h-8.8Z' }, { d: 'M16 20V12' }, { d: 'M16 15.5C16 10.5 12 8.5 7 8.5c0 5 4 7 9 7Z' }, { d: 'M16 12.5C16 8 19 5 25 5c0 5-3.6 7.500-9 7.500Z' }],
  sulama: [{ d: 'M5 13h14v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z' }, { d: 'M19 18L27 11M25.5 8.5l4 3.5' }, { d: 'M5 15C1 15 1 23 5 23' }, { d: 'M8 13C8 8.5 16 8.5 16 13' }, { d: 'M30 16v.01M27 19v.01M30 21v.01' }],
  ofis: [{ d: 'M6 28V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v22' }, { d: 'M19 12h6a1 1 0 0 1 1 1v15' }, { d: 'M10 10h5M10 15h5M10 20h5M4 28h24' }],
  ahsap: [{ d: elips(16, 16, 12, 8.5) }, { d: elips(16, 16, 8, 5.4) }, { d: elips(16, 16, 4, 2.6) }, { d: 'M16 16v.01' }],
  cadir: [{ d: 'M3 27L16 6l13 21Z' }, { d: 'M16 27V17l-5 10M16 17l5 10' }],
  konum: [{ d: 'M16 28C10 20 7 16 7 12c0-5 4-8 9-8s9 3 9 8c0 4-3 8-9 16Z' }, { d: daire(16, 12, 3.2) }],
  /* ── arayüz ── */
  saat: [{ d: daire(16, 16, 11.5) }, { d: 'M16 9v7l4.500 3' }],
  takvim: [{ d: 'M5 9.5A2.500 2.500 0 0 1 7.500 7h17A2.500 2.500 0 0 1 27 9.500v15a2.500 2.500 0 0 1-2.500 2.500h-17A2.500 2.500 0 0 1 5 24.500Z' }, { d: 'M5 13h22M11 4.500V9M21 4.500V9' }, { d: yaprakAt(12, 24, -0.6, 8, 2.4) }],
  ayar: [{ d: 'M5 9h11M22 9h5M5 16h4M15 16h12M5 23h13M24 23h3' }, { d: daire(19, 9, 3) }, { d: daire(12, 16, 3) }, { d: daire(21, 23, 3) }],
  menu: [{ d: 'M5 9H27M5 16H21M5 23H27' }],
  ok: [{ d: 'M5 16H26M19 9L26 16L19 23' }],
  sol: [{ d: 'M27 16H6M13 9L6 16L13 23' }],
  asagi: [{ d: 'M8 12l8 8 8-8' }],
  tik: [{ d: 'M6 17L13 24L26 8' }],
  kapat: [{ d: 'M8 8L24 24M24 8L8 24' }],
  arti: [{ d: 'M16 6v20M6 16h20' }],
  eksi: [{ d: 'M6 16h20' }],
  oynat: [{ d: 'M10 6.500v19L25.500 16Z' }],
  duraklat: [{ d: 'M10 6v20M22 6v20' }],
  yenile: [{ d: 'M8 15A9 9 0 0 1 23 9' }, { d: 'M24 5V10H19' }, { d: 'M24 17A9 9 0 0 1 9 23' }, { d: 'M8 27V22H13' }],
  kalkan: [{ d: 'M16 4L26 8V16C26 22 21 26 16 28C11 26 6 22 6 16V8Z' }, { d: 'M11.5 16L15 19.5L21 12.5' }],
  goz: [{ d: 'M3 16C7 9.500 11.500 7 16 7s9 2.500 13 9c-4 6.500-8.500 9-13 9S7 22.500 3 16Z' }, { d: daire(16, 16, 4) }],
} satisfies Record<string, Parca[]>

export type SimgeAd = keyof typeof SIMGELER

export const IKON_GRUPLARI: { ad: string; liste: SimgeAd[] }[] = [
  { ad: 'Gökyüzü ve ışık', liste: ['gunes', 'ay', 'dogus', 'batis', 'bulut', 'ruzgar', 'isik'] },
  { ad: 'Bitki ve su', liste: ['yaprak', 'filiz', 'tohum', 'agac', 'damla', 'dalga', 'nem', 'sicaklik'] },
  { ad: 'Nefes ve beden', liste: ['nefes', 'kalp', 'nabiz', 'uyku', 'meditasyon'] },
  { ad: 'Yaşam alanı', liste: ['ev', 'saksi', 'sulama', 'ofis', 'ahsap', 'cadir', 'konum'] },
  { ad: 'Arayüz', liste: ['saat', 'takvim', 'ayar', 'menu', 'ok', 'sol', 'asagi', 'tik', 'kapat', 'arti', 'eksi', 'oynat', 'duraklat', 'yenile', 'kalkan', 'goz'] },
]

export const SIMGE_AD: Record<SimgeAd, string> = {
  gunes: 'Güneş',
  ay: 'Ay',
  dogus: 'Gün doğumu',
  batis: 'Gün batımı',
  bulut: 'Bulut',
  ruzgar: 'Rüzgâr',
  isik: 'Işık',
  yaprak: 'Yaprak',
  filiz: 'Filiz',
  tohum: 'Tohum',
  agac: 'Ağaç',
  damla: 'Su damlası',
  dalga: 'Su dalgası',
  nem: 'Nem',
  sicaklik: 'Sıcaklık',
  nefes: 'Nefes',
  kalp: 'Kalp',
  nabiz: 'Nabız',
  uyku: 'Uyku',
  meditasyon: 'Meditasyon',
  ev: 'Ev',
  saksi: 'Saksı',
  sulama: 'Sulama',
  ofis: 'Ofis',
  ahsap: 'Ahşap kesiti',
  cadir: 'Çadır',
  konum: 'Konum',
  saat: 'Saat',
  takvim: 'Takvim',
  ayar: 'Ayarlar',
  menu: 'Menü',
  ok: 'Sağa',
  sol: 'Sola',
  asagi: 'Aşağı',
  tik: 'Onay',
  kapat: 'Kapat',
  arti: 'Artı',
  eksi: 'Eksi',
  oynat: 'Oynat',
  duraklat: 'Duraklat',
  yenile: 'Yenile',
  kalkan: 'Koruma',
  goz: 'Göz',
}
