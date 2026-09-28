/** Kurgusal içerik: MİLENYUM FM, SAKIZ mağazası ve ELMAS portfolyosu */

export interface Parca {
  id: string
  ad: string
  sanatci: string
  sure: number
  bpm: number
  /** Arpej notaları (A minör üzerinde yarım ton farkları) */
  notalar: number[]
  renk: string
}

export const PARCALAR: Parca[] = [
  { id: 'p1', ad: 'Buz Kalp', sanatci: 'Elmas', sure: 204, bpm: 128, notalar: [0, 3, 7, 12, 7, 3, 10, 7], renk: '#a5f2f3' },
  { id: 'p2', ad: 'Krom Sokaklar', sanatci: 'Gümüş Kanat', sure: 231, bpm: 140, notalar: [0, 7, 12, 15, 12, 7, 5, 3], renk: '#e0e5ec' },
  { id: 'p3', ad: 'Sakız Pembesi', sanatci: 'Elmas feat. Mor Dalga', sure: 187, bpm: 118, notalar: [0, 4, 7, 11, 12, 11, 7, 4], renk: '#ff66cc' },
  { id: 'p4', ad: 'Milenyum Böceği', sanatci: 'Y2K Kulübü', sure: 256, bpm: 150, notalar: [0, 12, 3, 15, 7, 19, 3, 15], renk: '#b0c4de' },
  { id: 'p5', ad: 'Çevirmeli Aşk', sanatci: 'Modem 56k', sure: 199, bpm: 100, notalar: [0, 2, 3, 7, 3, 2, 0, -5], renk: '#7b4fb5' },
]
export const sureYaz = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export interface Urun {
  id: string
  ad: string
  fiyat: number
  eski?: number
  rozet: string
  rozetTon: 'candy' | 'icy' | 'chrome' | 'grape'
  cizim: 'kelebek' | 'gozluk' | 'telefon' | 'canta'
  bedenler: string[]
}
export const URUNLER: Urun[] = [
  { id: 'kelebek', ad: 'Kelebek toka seti', fiyat: 190, rozet: 'Yeni', rozetTon: 'candy', cizim: 'kelebek', bedenler: ['Tek'] },
  { id: 'gozluk', ad: 'Kalkan güneş gözlüğü', fiyat: 540, eski: 780, rozet: '%30', rozetTon: 'grape', cizim: 'gozluk', bedenler: ['Tek'] },
  { id: 'telefon', ad: 'Kapaklı telefon askısı', fiyat: 120, rozet: 'Son 3', rozetTon: 'icy', cizim: 'telefon', bedenler: ['Tek'] },
  { id: 'canta', ad: 'Krom baget çanta', fiyat: 1290, rozet: 'Y2K', rozetTon: 'chrome', cizim: 'canta', bedenler: ['Mini', 'Midi'] },
]
export const tl = (n: number) => `${n.toLocaleString('tr-TR')} ₺`

export interface Proje {
  id: string
  ad: string
  yil: number
  tur: string
  not: string
  ton: 'candy' | 'icy' | 'chrome' | 'grape'
}
export const PROJELER: Proje[] = [
  { id: 'j1', ad: 'Buz Kalp', yil: 2026, tur: 'Klip', not: 'Krom sokaklarda, buz mavisi ışıkta tek plan. 3 dakika 24 saniye.', ton: 'icy' },
  { id: 'j2', ad: 'Sakız Pembesi', yil: 2025, tur: 'Albüm kapağı', not: 'Sıvı metal yazı, plastik balonlar, dört kat iç gölge.', ton: 'candy' },
  { id: 'j3', ad: 'Milenyum Turnesi', yil: 2025, tur: 'Sahne tasarımı', not: 'Dönen CD ekranlar ve kabile desenli ışık kafesi.', ton: 'chrome' },
  { id: 'j4', ad: 'Mor Dalga', yil: 2024, tur: 'Web sitesi', not: 'Pop-up pencerelerle gezilen bir hayran sayfası.', ton: 'grape' },
]
