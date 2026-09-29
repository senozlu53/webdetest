/**
 * Madde 9: özel organik ikon seti. 32×32 kutuda, hepsi eğri ve bitkisel.
 * Her ikon bir dizi parçadır: `d` yolu, `dolgu` ise yumuşak dolgu (yaprak, taç yaprak) demektir.
 */
import { damarAt, kamci, ornekle, petalAt, sarmasikAt, serit, yaprakAt, yumusak, type Nk } from './bitki'

export interface Parca {
  d: string
  dolgu?: boolean
}

const yap = (x: number, y: number, a: number, b: number, e: number): Parca[] => [{ d: yaprakAt(x, y, a, b, e), dolgu: true }, { d: damarAt(x, y, a, b) }]
const PI = Math.PI

/** Yol dizgesini yatayda (32 birimlik kutuda) aynalar; yalnız mutlak komutlar ve x y çiftleri için */
const aynala = (d: string) => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, x, y) => `${Math.round((32 - +x) * 10) / 10} ${y}`)

/** Noktaları 32 birimlik kutuya ortalayıp sığdırır */
function sigdir(p: Nk[], pad = 3): Nk[] {
  const xs = p.map((q) => q[0])
  const ys = p.map((q) => q[1])
  const x0 = Math.min(...xs)
  const y0 = Math.min(...ys)
  const w = Math.max(...xs) - x0 || 1
  const h = Math.max(...ys) - y0 || 1
  const k = (32 - pad * 2) / Math.max(w, h)
  return p.map(([x, y]) => [pad + (x - x0) * k + (32 - pad * 2 - w * k) / 2, pad + (y - y0) * k + (32 - pad * 2 - h * k) / 2] as Nk)
}

// yardımcı kıvrımlar
const curl = (x: number, y: number, boy: number, aci: number, don: number, yon: 1 | -1 = 1) => yumusak(ornekle(kamci(x, y, boy, aci, { donus: don, dalga: 0.35, us: 2.0, yon, n: 26 }), 1))

export const SIMGELER = {
  /* ── işlev ikonları ── */
  ok: [
    { d: 'M4 18C8 13 12 22 17 17S22 14 24 16' },
    {
      d: 'M19 9C23 11 27 14 29 16C27 18 23 21 19 23C21.5 20 22.5 18 22.5 16C22.5 14 21.5 12 19 9Z',
      dolgu: true,
    },
    { d: 'M4 18C3 20 3 22 4.5 23' },
  ],
  sol: [
    { d: aynala('M4 18C8 13 12 22 17 17S22 14 24 16') },
    {
      d: aynala('M19 9C23 11 27 14 29 16C27 18 23 21 19 23C21.5 20 22.5 18 22.5 16C22.5 14 21.5 12 19 9Z'),
      dolgu: true,
    },
    { d: aynala('M4 18C3 20 3 22 4.5 23') },
  ],
  yukari: [{ d: 'M16 27C16 21 17 15 16 9' }, { d: 'M16 4C21 8 21 13 16 14C11 13 11 8 16 4Z', dolgu: true }, { d: curl(16, 27, 9, -PI / 2 - 0.4, 0.5, 1) }],
  kapat: [{ d: 'M7 7C12 12 20 20 25 25' }, { d: 'M25 7C20 12 12 20 7 25' }, { d: curl(7, 7, 6, 2.3, 0.6, -1) }, { d: curl(25, 25, 6, -0.8, 0.6, -1) }],
  ara: [
    {
      d: 'M13 5C19 5 22 9 22 13C22 18 18 21 13 21C8 21 4 17 4 13C4 8 8 5 13 5Z',
    },
    { d: 'M20 20C23 23 25 26 27 27C29 28 29 25 27 24' },
    ...yap(9, 12, -0.9, 6, 2.2),
  ],
  menu: [{ d: 'M4 9C9 5 13 13 18 9S25 7 28 9' }, { d: 'M4 16C9 12 13 20 18 16S25 14 28 16' }, { d: 'M4 23C9 19 13 27 18 23S25 21 28 23' }],
  ev: [{ d: 'M5 15C9 10 13 6 16 4C19 6 23 10 27 15' }, { d: 'M8 14C8 20 8 24 9 27C13 28 19 28 23 27C24 24 24 20 24 14' }, ...yap(16, 26, -PI / 2, 8, 3)],
  kullanici: [
    {
      d: 'M16 4C20 4 22 7 22 10C22 14 19 16 16 16C13 16 10 14 10 10C10 7 12 4 16 4Z',
    },
    { d: 'M5 28C6 22 10 19 16 19C22 19 26 22 27 28' },
    { d: yaprakAt(16, 3, -PI / 2 + 0.5, 6, 2), dolgu: true },
  ],
  kalp: [{ d: yaprakAt(16, 27, -PI / 2 - 0.62, 20, 7.5, 0.05), dolgu: true }, { d: yaprakAt(16, 27, -PI / 2 + 0.62, 20, 7.5, 0.05), dolgu: true }, { d: curl(16, 27, 6, PI / 2, 0.5, 1) }],
  yildiz: [
    ...petalAt(16, 16, -PI / 2, 12, 5, 0.3).map((d) => ({ d, dolgu: true })),
    {
      d: 'M16 13.5C17.5 13.5 18.5 14.5 18.5 16C18.5 17.5 17.5 18.5 16 18.5C14.5 18.5 13.5 17.5 13.5 16C13.5 14.5 14.5 13.5 16 13.5Z',
    },
  ],
  posta: [
    {
      d: 'M4 9C10 7 22 7 28 9C29 14 29 18 28 23C22 25 10 25 4 23C3 18 3 14 4 9Z',
    },
    { d: 'M5 10C10 15 13 17 16 17C19 17 22 15 27 10' },
  ],
  takvim: [
    {
      d: 'M5 8C11 6 21 6 27 8C28 14 28 20 27 26C21 28 11 28 5 26C4 20 4 14 5 8Z',
    },
    { d: 'M5 13C11 15 21 11 27 13' },
    { d: 'M11 4C10 6 10 8 11 9' },
    { d: 'M21 4C22 6 22 8 21 9' },
    ...yap(16, 24, -PI / 2, 7, 2.6),
  ],
  sepet: [
    {
      d: 'M6 12C6 20 8 25 10 27C14 28 18 28 22 27C24 25 26 20 26 12C20 14 12 14 6 12Z',
    },
    { d: 'M10 12C10 4 22 4 22 12' },
    { d: 'M13 18C14 22 15 23 16 23' },
  ],
  indir: [{ d: 'M16 5C16 11 15 17 16 22' }, { d: 'M9 17C12 21 14 23 16 24C18 23 20 21 23 17' }, { d: 'M6 27C11 25 21 25 26 27' }],
  bilgi: [
    {
      d: 'M16 4C23 4 28 9 28 16C28 23 23 28 16 28C9 28 4 23 4 16C4 9 9 4 16 4Z',
    },
    { d: 'M16 14C16 17 15 20 16 23' },
    {
      d: 'M16 8.5C16.8 8.5 17.4 9.1 17.4 9.9C17.4 10.7 16.8 11.3 16 11.3C15.2 11.3 14.6 10.7 14.6 9.9C14.6 9.1 15.2 8.5 16 8.5Z',
      dolgu: true,
    },
  ],
  uyari: [
    { d: 'M16 4C20 10 25 19 28 26C21 29 11 29 4 26C7 19 12 10 16 4Z' },
    { d: 'M16 12C16 16 15 19 16 21' },
    {
      d: 'M16 24C16.8 24 17.4 24.6 17.4 25.4C17.4 26.2 16.8 26.8 16 26.8C15.2 26.8 14.6 26.2 14.6 25.4C14.6 24.6 15.2 24 16 24Z',
      dolgu: true,
    },
  ],
  /* ── botanik illüstrasyonlar ── */
  yaprak: [{ d: yaprakAt(6, 27, -0.95, 30, 9), dolgu: true }, { d: damarAt(6, 27, -0.95, 30) }, { d: 'M14 20C12 18 10 17 8 17' }],
  sarmasik: [{ d: sarmasikAt(5, 27, -0.85, 26), dolgu: true }, { d: 'M5 27C10 22 15 18 20 12' }, { d: curl(20, 12, 10, -0.9, 0.85, 1) }],
  zambak: [{ d: 'M16 30C16 24 16 18 16 14' }, { d: 'M16 15C11 13 8 8 8 4C13 6 15 10 16 15Z', dolgu: true }, { d: 'M16 15C21 13 24 8 24 4C19 6 17 10 16 15Z', dolgu: true }, { d: 'M16 16C13 12 13 7 16 3C19 7 19 12 16 16Z', dolgu: true }, { d: yaprakAt(16, 27, -PI + 0.5, 10, 2.8), dolgu: true }],
  gul: [
    {
      d: 'M16 6C21 6 25 9 25 14C25 19 21 22 16 22C11 22 7 19 7 14C7 9 11 6 16 6Z',
    },
    {
      d: 'M16 10C19 10 21 12 21 14.5C21 17 19 18.5 16.5 18.5C14.5 18.5 13 17 13 15.5C13 14 14.5 13 16 13C17 13 17.8 13.8 17.6 14.6',
    },
    { d: 'M16 22C16 25 16 28 15 30' },
    ...yap(16, 26, -0.4, 9, 3.2),
  ],
  nilufer: [
    ...petalAt(16, 22, -PI / 2, 15, 5, 0.26)
      .slice(0, 5)
      .map((d, i) => ({ d: d, dolgu: i % 2 === 0 })),
    { d: 'M3 25C8 23 12 26 16 24C20 26 24 23 29 25' },
    { d: 'M6 29C11 27 14 30 18 28C22 30 25 28 27 29' },
  ],
  dal: [{ d: 'M6 28C11 22 17 16 26 5' }, ...yap(11, 23, -1.9, 9, 3), ...yap(15, 18, 0.2, 10, 3.2), ...yap(19, 13, -1.9, 8, 2.8), ...yap(22, 9, 0.1, 7, 2.4)],
  tomurcuk: [{ d: 'M16 29C15 24 16 19 16 15' }, { d: 'M16 15C11 13 10 7 16 3C22 7 21 13 16 15Z', dolgu: true }, { d: 'M16 15C14 11 14 8 16 5' }, ...yap(16, 25, 0.4, 8, 2.8)],
  girdap: [
    {
      d: yumusak(
        ornekle(
          Array.from({ length: 30 }, (_, i) => {
            const u = i / 29
            const a = -PI / 2 + u * 2.3 * PI * 2
            const rr = 1.5 + u * 12.5
            return [16 + Math.cos(a) * rr, 16 + Math.sin(a) * rr] as Nk
          }),
          2,
        ),
      ),
    },
  ],
  kavis: [
    {
      d: serit(
        sigdir(
          kamci(0, 0, 100, -0.4, {
            donus: 1.05,
            dalga: 1.1,
            us: 2.3,
            yon: -1,
            n: 56,
          }),
        ),
        (t) => 0.9 + (1 - t) * 3.6,
      ),
      dolgu: true,
    },
  ],
  egrelti: [{ d: 'M16 30C16 22 17 12 22 4' }, ...[0, 1, 2, 3, 4].flatMap((i) => [...yap(16.7 - i * 0.3, 27 - i * 5, -1.1 - i * 0.07, 8 - i * 0.9, 2), ...yap(16.7 - i * 0.3, 27 - i * 5, -2.5 + i * 0.05, 7 - i * 0.9, 2)])],
} satisfies Record<string, Parca[]>

export type SimgeAd = keyof typeof SIMGELER

export const ISLEV_SIMGELERI: SimgeAd[] = ['ok', 'sol', 'yukari', 'kapat', 'ara', 'menu', 'ev', 'kullanici', 'kalp', 'yildiz', 'posta', 'takvim', 'sepet', 'indir', 'bilgi', 'uyari']
export const BOTANIK_SIMGELERI: SimgeAd[] = ['yaprak', 'sarmasik', 'zambak', 'gul', 'nilufer', 'dal', 'tomurcuk', 'girdap', 'kavis', 'egrelti']

export const SIMGE_AD: Record<SimgeAd, string> = {
  ok: 'Sarmaşık oku (ileri)',
  sol: 'Sarmaşık oku (geri)',
  yukari: 'Filiz (yukarı)',
  kapat: 'Çapraz saplar (kapat)',
  ara: 'Halka ve sülük (ara)',
  menu: 'Üç dalga (menü)',
  ev: 'Kıvrık çatı (ana sayfa)',
  kullanici: 'Tomurcuk baş (kullanıcı)',
  kalp: 'İki yaprak (beğen)',
  yildiz: 'Beş taç yaprak (favori)',
  posta: 'Dalgalı zarf (posta)',
  takvim: 'Yapraklı takvim',
  sepet: 'Yuvarlak sepet',
  indir: 'Damla ve dalga (indir)',
  bilgi: 'Bilgi',
  uyari: 'Uyarı',
  yaprak: 'Yaprak',
  sarmasik: 'Sarmaşık yaprağı',
  zambak: 'Zambak',
  gul: 'Gül',
  nilufer: 'Nilüfer',
  dal: 'Yapraklı dal',
  tomurcuk: 'Tomurcuk',
  girdap: 'Girdap',
  kavis: 'Kamçı kıvrımı',
  egrelti: 'Eğrelti otu',
}
