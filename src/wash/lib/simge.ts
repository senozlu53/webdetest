/**
 * Madde 9: el boyaması spot illüstrasyon ikonları. Çizgi yok: her ikon birkaç saydam pigment katmanının (glaze)
 * üst üste sürülmesi. Katmanlar çoğaltma kipiyle birbirine biner, kesişimler koyulaşır; kenarlar filtreyle ıslak kalır.
 */
const f = (n: number) => Math.round(n * 10) / 10
export type Pigment = 'ultramarin' | 'yesil' | 'gul' | 'ocre' | 'murekkep' | 'kagit'
export interface Kat {
  d: string
  p: Pigment
  o?: number // opaklık
}

const daire = (cx: number, cy: number, r: number) => `M${f(cx - r)} ${f(cy)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`
/** Döndürülmüş elips (yaprak, taç yaprağı) */
const elp = (cx: number, cy: number, rx: number, ry: number, rot = 0) => {
  const a = (rot * Math.PI) / 180
  const c = Math.cos(a)
  const s = Math.sin(a)
  const k = 0.5523
  const pt = (x: number, y: number) => `${f(cx + x * c - y * s)} ${f(cy + x * s + y * c)}`
  return `M${pt(rx, 0)}C${pt(rx, ry * k)} ${pt(rx * k, ry)} ${pt(0, ry)}C${pt(-rx * k, ry)} ${pt(-rx, ry * k)} ${pt(-rx, 0)}C${pt(-rx, -ry * k)} ${pt(-rx * k, -ry)} ${pt(0, -ry)}C${pt(rx * k, -ry)} ${pt(rx, -ry * k)} ${pt(rx, 0)}Z`
}
/** Işın: iç yarıçaptan dışa incelen fırça darbesi */
const isin = (cx: number, cy: number, r1: number, r2: number, aci: number, w = 2.2) => {
  const a = (aci * Math.PI) / 180
  const dx = Math.cos(a)
  const dy = Math.sin(a)
  const nx = -dy
  const ny = dx
  const p = (r: number, k: number): string => `${f(cx + dx * r + nx * k)} ${f(cy + dy * r + ny * k)}`
  return `M${p(r1, -w / 2)}L${p(r2, 0)}L${p(r1, w / 2)}Z`
}

const ISINLAR = Array.from({ length: 8 }, (_, i) => isin(24, 24, 15, 22.5, i * 45 + 10, 3.4)).join('')
const CICEK = [0, 60, 120, 180, 240, 300].map((r) => {
  const a = ((r - 90) * Math.PI) / 180
  return elp(24 + Math.cos(a) * 9, 20 + Math.sin(a) * 9, 4.6, 8.4, r)
})

export const SIMGELER = {
  yaprak: [
    { d: 'M7 41C4 21 17 7 42 5C43 30 30 43 7 41Z', p: 'yesil', o: 0.8 },
    { d: 'M10 38C14 26 24 16 40 8C38 26 28 38 10 38Z', p: 'yesil', o: 0.5 },
    { d: 'M9 39C18 30 28 20 38 9L39.5 10.5C30 22 20 32 10.5 41Z', p: 'murekkep', o: 0.3 },
  ],
  damla: [
    { d: 'M24 4C24 4 38 20 38 30C38 38.5 32 44 24 44C16 44 10 38.5 10 30C10 20 24 4 24 4Z', p: 'ultramarin', o: 0.8 },
    { d: 'M22 14C22 14 32 26 32 33C32 38 28 41 23 41C18 41 15 38 15 33C15 27 22 14 22 14Z', p: 'ultramarin', o: 0.5 },
    { d: 'M16 30C16 35 19 38.5 24 39.5C20 37 18 34 18 30Z', p: 'kagit', o: 0.85 },
  ],
  ay: [
    { d: 'M31 5C18 6 9 16 11 28C13 40 26 46 39 40C29 39 21 31 22 21C23 14 26 9 31 5Z', p: 'ocre', o: 0.85 },
    { d: 'M31 5C24 10 21 17 22 24C24 16 30 10 36 9Z', p: 'ocre', o: 0.5 },
    { d: daire(38, 13, 1.8) + daire(42, 24, 1.4) + daire(34, 30, 1.2), p: 'ultramarin', o: 0.8 },
  ],
  gunes: [
    { d: ISINLAR, p: 'gul', o: 0.7 },
    { d: daire(24, 24, 12), p: 'ocre', o: 0.85 },
    { d: daire(21, 22, 8.5), p: 'ocre', o: 0.5 },
  ],
  cicek: [
    { d: 'M24 26C24 34 23 40 25 45', p: 'yesil', o: 0 },
    { d: 'M23 27C23 34 22 40 24 45L26 45C25 40 25.5 34 25.5 27Z', p: 'yesil', o: 0.8 },
    { d: elp(32, 38, 6.5, 2.8, -35), p: 'yesil', o: 0.75 },
    ...CICEK.map((d) => ({ d, p: 'gul' as Pigment, o: 0.55 })),
    { d: daire(24, 20, 5), p: 'ocre', o: 0.9 },
  ],
  kus: [
    { d: 'M11 31L2 29L4 36Z', p: 'ultramarin', o: 0.7 },
    { d: elp(23, 28, 14, 9, -18), p: 'ultramarin', o: 0.7 },
    { d: daire(35, 19, 6.2), p: 'ultramarin', o: 0.75 },
    { d: elp(21, 29, 9, 4.6, -22), p: 'ultramarin', o: 0.5 },
    { d: 'M40 18L46.5 20.5L40 23Z', p: 'ocre', o: 0.9 },
    { d: daire(36.4, 18.2, 1.1), p: 'murekkep', o: 0.85 },
    { d: 'M18 38L17 45M26 38L26 45', p: 'murekkep', o: 0 },
    { d: 'M17 37L16.2 45H17.8L18.8 37ZM25 37L25 45H26.6L26.8 37Z', p: 'gul', o: 0.7 },
  ],
  kelebek: [
    { d: elp(14.5, 17, 8.5, 10.5, -30), p: 'gul', o: 0.7 },
    { d: elp(33.5, 17, 8.5, 10.5, 30), p: 'gul', o: 0.7 },
    { d: elp(16, 32, 6.6, 8, 20), p: 'ultramarin', o: 0.65 },
    { d: elp(32, 32, 6.6, 8, -20), p: 'ultramarin', o: 0.65 },
    { d: elp(24, 26, 1.9, 10.5, 0), p: 'murekkep', o: 0.85 },
    { d: 'M23 16C20 10 18 8 15 8L15.4 9.4C18 10 20 12 22.6 17ZM25 16C28 10 30 8 33 8L32.6 9.4C30 10 28 12 25.4 17Z', p: 'murekkep', o: 0.7 },
  ],
  mantar: [
    { d: 'M18 29C18 29 17 40 14 44H34C31 40 30 29 30 29Z', p: 'ocre', o: 0.4 },
    { d: 'M6 27C6 14 14 7 24 7C34 7 42 14 42 27C42 29 40 30 38 30H10C8 30 6 29 6 27Z', p: 'gul', o: 0.82 },
    { d: daire(15, 19, 3.2) + daire(28, 14, 2.7) + daire(33, 23, 3.1) + daire(22, 24, 2.1), p: 'kagit', o: 0.9 },
  ],
  agac: [
    { d: 'M22 34C22 34 22 42 19 45H30C27 42 26 34 26 34Z', p: 'ocre', o: 0.75 },
    { d: 'M22 34C22 34 22 42 19 45H30C27 42 26 34 26 34Z', p: 'murekkep', o: 0.3 },
    { d: daire(15.5, 20, 10), p: 'yesil', o: 0.62 },
    { d: daire(31.5, 18, 11), p: 'yesil', o: 0.62 },
    { d: daire(24, 27, 11), p: 'yesil', o: 0.62 },
  ],
  dag: [
    { d: 'M14 41L27 11L46 41Z', p: 'ultramarin', o: 0.65 },
    { d: 'M2 41L16 18L30 41Z', p: 'yesil', o: 0.78 },
    { d: 'M22.4 22L27 11L31.6 22L27 19.6Z', p: 'kagit', o: 0.9 },
  ],
  kitap: [
    { d: 'M4 12C11 9 18 10 23 14V41C18 37 11 36 4 39Z', p: 'gul', o: 0.6 },
    { d: 'M44 12C37 9 30 10 25 14V41C30 37 37 36 44 39Z', p: 'ultramarin', o: 0.62 },
    { d: 'M23 14L25 14V41L23 41Z', p: 'murekkep', o: 0.55 },
    { d: 'M32 10V22L35 19L38 22V11Z', p: 'ocre', o: 0.9 },
  ],
  fincan: [
    { d: 'M15 6C11 10 19 12 15 18L17 18C21 12 13 10 17 6ZM24 3C20 8 28 10 24 16L26 16C30 10 22 8 26 3Z', p: 'gul', o: 0.5 },
    { d: 'M8 21H34V30C34 38 29 42 21 42C13 42 8 38 8 30Z', p: 'ultramarin', o: 0.78 },
    { d: 'M34 24C44 22 45 35 34 36L34 33C39 32 39 27 34 27Z', p: 'ultramarin', o: 0.7 },
    { d: 'M3 44C10 47 32 47 39 44C33 45.5 9 45.5 3 44Z', p: 'murekkep', o: 0.45 },
  ],
  kalp: [
    { d: 'M24 42C8 31 4 22 8 14C12 8 21 9 24 15C27 9 36 8 40 14C44 22 40 31 24 42Z', p: 'gul', o: 0.82 },
    { d: 'M24 36C13 28 11 22 14 17C17 13 22 14 24 19C25 15 31 13 34 17C37 22 35 28 24 36Z', p: 'gul', o: 0.45 },
  ],
  yildiz: [
    { d: 'M24 4L29.5 17.5L44 18.5L33 28L36.5 42L24 34.5L11.5 42L15 28L4 18.5L18.5 17.5Z', p: 'ocre', o: 0.82 },
    { d: 'M24 14L27 21.5L35 22L29 27L31 34.5L24 30.5L17 34.5L19 27L13 22L21 21.5Z', p: 'ocre', o: 0.5 },
  ],
  bulut: [
    { d: 'M10 38C4 38 3 29 10 28C10 20 18 16 24 20C30 14 40 18 39 27C46 28 46 38 38 38Z', p: 'ultramarin', o: 0.6 },
    { d: 'M14 37C8 37 8 31 14 30C15 24 21 22 25 25C30 21 36 25 35 30C40 31 40 37 34 37Z', p: 'ultramarin', o: 0.42 },
  ],
  balik: [
    { d: 'M35 24L46 12L44 24L46 36Z', p: 'gul', o: 0.7 },
    { d: 'M4 24C12 10 30 10 38 24C30 38 12 38 4 24Z', p: 'ultramarin', o: 0.72 },
    { d: 'M20 14C24 8 30 9 31 14Z', p: 'gul', o: 0.5 },
    { d: daire(12, 21.5, 1.7), p: 'murekkep', o: 0.85 },
  ],
  tuy: [
    { d: 'M10 42C6 26 16 10 40 5C41 24 30 40 10 42Z', p: 'ultramarin', o: 0.6 },
    { d: 'M14 38C13 28 20 17 36 10C35 24 28 35 14 38Z', p: 'gul', o: 0.35 },
    { d: 'M8 44C20 32 30 20 40 5L41.5 6.5C31 21 21 33 9.5 45Z', p: 'murekkep', o: 0.55 },
  ],
  nilufer: [
    { d: 'M2 40C12 45 36 45 46 40C38 36 10 36 2 40Z', p: 'yesil', o: 0.8 },
    { d: elp(9, 33, 4.2, 10, -68), p: 'gul', o: 0.42 },
    { d: elp(39, 33, 4.2, 10, 68), p: 'gul', o: 0.42 },
    { d: elp(16, 28, 5, 13, -36), p: 'gul', o: 0.55 },
    { d: elp(32, 28, 5, 13, 36), p: 'gul', o: 0.55 },
    { d: elp(24, 25, 5.4, 14, 0), p: 'gul', o: 0.62 },
  ],
  ev: [
    { d: 'M9 22H39V42H9Z', p: 'ocre', o: 0.72 },
    { d: 'M4 24L24 6L44 24Z', p: 'gul', o: 0.82 },
    { d: 'M20 31H28V42H20Z', p: 'ultramarin', o: 0.75 },
    { d: 'M30 27H36V33H30Z', p: 'kagit', o: 0.9 },
  ],
  zeytin: [
    { d: 'M4 40C16 34 30 26 44 9L45.5 10.5C31 28 17 36 5 42Z', p: 'murekkep', o: 0.55 },
    { d: elp(11, 32, 7, 3.1, -32) + elp(19, 26, 7, 3.1, 28) + elp(24, 30, 7, 3.1, -32) + elp(31, 18, 7, 3.1, 28) + elp(37, 21, 6.5, 3, -32), p: 'yesil', o: 0.78 },
    { d: elp(28, 34, 3, 3.8, 20) + elp(37, 27, 3, 3.8, 20) + elp(41, 15, 2.8, 3.6, 20), p: 'ultramarin', o: 0.85 },
  ],
  elma: [
    { d: 'M24 14C16 8 6 14 8 27C10 38 18 45 24 42C30 45 38 38 40 27C42 14 32 8 24 14Z', p: 'gul', o: 0.82 },
    { d: 'M22 18C15 15 12 22 13 28C15 36 19 40 23 39C18 33 17 24 22 18Z', p: 'ocre', o: 0.45 },
    { d: 'M23.4 14C23.4 10 25 6 29 3.5L30.2 5C27 7.5 25.6 10.5 25.6 14Z', p: 'murekkep', o: 0.65 },
    { d: elp(32, 8.5, 5.6, 2.6, -28), p: 'yesil', o: 0.8 },
  ],
  havuc: [
    { d: 'M17 11C24 6 34 12 31 20L23 43C21 47 18 46 18 42Z', p: 'ocre', o: 0.88 },
    { d: 'M19 14C24 11 28 14 27 19L22 38C21 41 19 40 19 37Z', p: 'gul', o: 0.4 },
    { d: elp(20, 7, 2.4, 6.5, -12) + elp(26, 5.5, 2.4, 6.5, 8) + elp(31, 8, 2.4, 6, 32), p: 'yesil', o: 0.82 },
  ],
  ekmek: [
    { d: 'M6 32C4 22 12 14 24 14C36 14 44 22 42 32C41 38 34 40 24 40C14 40 7 38 6 32Z', p: 'ocre', o: 0.82 },
    { d: 'M9 31C9 24 15 18 24 18C33 18 39 24 39 31C39 35 33 37 24 37C15 37 9 35 9 31Z', p: 'murekkep', o: 0.2 },
    { d: 'M14 22C16 21 18 25 16 28L14.6 27.4C15.8 25 15 23 13.6 23ZM23 20C25 19 27 23 25 27L23.6 26.4C24.8 24 24 21.6 22.6 21.8ZM32 22C34 21 36 25 34 28L32.6 27.4C33.8 25 33 23 31.6 23Z', p: 'kagit', o: 0.9 },
  ],
  bal: [
    { d: 'M12 9H36V15H12Z', p: 'ultramarin', o: 0.65 },
    { d: 'M13 14H35C38 18 38 40 34 43H14C10 40 10 18 13 14Z', p: 'ocre', o: 0.85 },
    { d: 'M14 20C17 18 20 22 18 30C17 36 15 39 13 40C11 34 11 24 14 20Z', p: 'kagit', o: 0.35 },
    { d: 'M17 24H31V35H17Z', p: 'kagit', o: 0.9 },
    { d: 'M20 29.5H28', p: 'murekkep', o: 0 },
    { d: 'M20 28.6H28V30.2H20Z', p: 'gul', o: 0.7 },
  ],
} satisfies Record<string, Kat[]>
export type SimgeAd = keyof typeof SIMGELER
export const DOGA_SIMGELERI: SimgeAd[] = ['yaprak', 'damla', 'ay', 'gunes', 'cicek', 'kus', 'kelebek', 'mantar', 'agac', 'dag', 'bulut', 'balik', 'tuy', 'nilufer']
export const YAPI_SIMGELERI: SimgeAd[] = ['kitap', 'fincan', 'kalp', 'yildiz', 'ev', 'zeytin', 'elma', 'havuc', 'ekmek', 'bal']
export const TUM_SIMGELER = [...DOGA_SIMGELERI, ...YAPI_SIMGELERI] as SimgeAd[]
export const SIMGE_AD: Record<SimgeAd, string> = {
  yaprak: 'Yaprak',
  damla: 'Damla',
  ay: 'Ay',
  gunes: 'Güneş',
  cicek: 'Çiçek',
  kus: 'Kuş',
  kelebek: 'Kelebek',
  mantar: 'Mantar',
  agac: 'Ağaç',
  dag: 'Dağ',
  bulut: 'Bulut',
  balik: 'Balık',
  tuy: 'Tüy',
  nilufer: 'Nilüfer',
  kitap: 'Kitap',
  fincan: 'Çay',
  kalp: 'Kalp',
  yildiz: 'Yıldız',
  ev: 'Ev',
  zeytin: 'Zeytin dalı',
  elma: 'Elma',
  havuc: 'Havuç',
  ekmek: 'Ekmek',
  bal: 'Bal',
}
