/** Kurgu içerik: Horror Vacui · Boşluk Korkusu Festivali. Sanatçılar, eserler ve ürünler uydurmadır. */

export type Day = 'cuma' | 'cumartesi' | 'pazar'
export type Genre = 'elektronik' | 'rock' | 'pop' | 'deneysel' | 'hiphop'
export type Tier = 1 | 2 | 3

export const DAYS: { id: Day; ad: string; tarih: string }[] = [
  { id: 'cuma', ad: 'Cuma', tarih: '11 Haziran' },
  { id: 'cumartesi', ad: 'Cumartesi', tarih: '12 Haziran' },
  { id: 'pazar', ad: 'Pazar', tarih: '13 Haziran' },
]
export const GENRES: { id: Genre; ad: string }[] = [
  { id: 'elektronik', ad: 'Elektronik' },
  { id: 'rock', ad: 'Rock' },
  { id: 'pop', ad: 'Pop' },
  { id: 'deneysel', ad: 'Deneysel' },
  { id: 'hiphop', ad: 'Hip-hop' },
]
export const STAGES = ['Ana Sahne', 'Kolaj Çadırı', 'Hologram Kubbe'] as const

export interface Artist {
  id: string
  ad: string
  gun: Day
  tur: Genre
  sahne: (typeof STAGES)[number]
  saat: string
  /** 1 manşet, 2 orta, 3 küçük */
  tier: Tier
}

export const ARTISTS: Artist[] = [
  { id: 'a1', ad: 'Neon Kuzgun', gun: 'cuma', tur: 'elektronik', sahne: 'Ana Sahne', saat: '23.30', tier: 1 },
  { id: 'a2', ad: 'Pembe Tuğla', gun: 'cuma', tur: 'rock', sahne: 'Ana Sahne', saat: '21.45', tier: 2 },
  { id: 'a3', ad: 'Kaset Kız', gun: 'cuma', tur: 'pop', sahne: 'Kolaj Çadırı', saat: '20.00', tier: 2 },
  { id: 'a4', ad: 'Gren & Nokta', gun: 'cuma', tur: 'deneysel', sahne: 'Hologram Kubbe', saat: '01.00', tier: 3 },
  { id: 'a5', ad: 'Bıçaklı Pasta', gun: 'cuma', tur: 'hiphop', sahne: 'Kolaj Çadırı', saat: '22.15', tier: 3 },
  { id: 'a6', ad: 'Kadife Makine', gun: 'cuma', tur: 'elektronik', sahne: 'Hologram Kubbe', saat: '02.30', tier: 3 },
  { id: 'a7', ad: 'Mor Kasırga', gun: 'cumartesi', tur: 'rock', sahne: 'Ana Sahne', saat: '23.00', tier: 1 },
  { id: 'a8', ad: 'Asit Çiçek', gun: 'cumartesi', tur: 'elektronik', sahne: 'Hologram Kubbe', saat: '00.30', tier: 2 },
  { id: 'a9', ad: 'Plastik Tanrı', gun: 'cumartesi', tur: 'pop', sahne: 'Ana Sahne', saat: '21.00', tier: 2 },
  { id: 'a10', ad: 'Ses Heykeli', gun: 'cumartesi', tur: 'deneysel', sahne: 'Kolaj Çadırı', saat: '19.30', tier: 3 },
  { id: 'a11', ad: 'Gece Sirki', gun: 'cumartesi', tur: 'hiphop', sahne: 'Kolaj Çadırı', saat: '22.00', tier: 3 },
  { id: 'a12', ad: 'Sarı Alarm', gun: 'cumartesi', tur: 'rock', sahne: 'Kolaj Çadırı', saat: '20.45', tier: 3 },
  { id: 'a13', ad: 'Holografik Ali', gun: 'pazar', tur: 'pop', sahne: 'Ana Sahne', saat: '22.30', tier: 1 },
  { id: 'a14', ad: 'Dijital Nine', gun: 'pazar', tur: 'elektronik', sahne: 'Hologram Kubbe', saat: '23.45', tier: 2 },
  { id: 'a15', ad: 'Kolaj Kulüp', gun: 'pazar', tur: 'hiphop', sahne: 'Ana Sahne', saat: '20.30', tier: 2 },
  { id: 'a16', ad: 'Ağır Pastel', gun: 'pazar', tur: 'deneysel', sahne: 'Kolaj Çadırı', saat: '19.00', tier: 3 },
  { id: 'a17', ad: 'Yıldız Patlaması', gun: 'pazar', tur: 'rock', sahne: 'Kolaj Çadırı', saat: '21.15', tier: 3 },
  { id: 'a18', ad: 'Kum Saati Kolektifi', gun: 'pazar', tur: 'deneysel', sahne: 'Hologram Kubbe', saat: '01.30', tier: 3 },
]

export const TICKETS = [
  { id: 'gunluk', ad: 'Günlük', fiyat: 1450, not: 'Tek gün, bütün sahneler', renk: 'var(--butter)' },
  { id: 'uc', ad: '3 Gün', fiyat: 3600, not: 'Üç gün, gece otobüsü dahil', renk: 'var(--cyan)' },
  { id: 'vip', ad: 'VIP 3 Gün', fiyat: 7900, not: 'Sahne önü, holo bileklik', renk: 'var(--pink)' },
] as const

export const FEST_START = new Date('2027-06-11T20:00:00+03:00')

/** Uçan rozetler (Madde 11) */
export const BADGES = [
  { id: 'yeni', ad: 'Yeni!', bg: 'var(--lime)', fg: '#111014', shape: 'burst' },
  { id: 'indirim', ad: '%30', bg: 'var(--pink)', fg: '#111014', shape: 'circle' },
  { id: 'sanatci', ad: '72 sanatçı', bg: 'holo', fg: '#111014', shape: 'circle' },
  { id: 'gece', ad: 'Gece 04.00', bg: 'var(--blue)', fg: '#fff7ee', shape: 'pill' },
  { id: 'su', ad: 'Su bedava', bg: 'var(--cyan)', fg: '#111014', shape: 'burst' },
  { id: 'vip', ad: 'VIP', bg: 'var(--orange)', fg: '#111014', shape: 'star' },
  { id: 'sold', ad: 'Tükendi?', bg: 'var(--butter)', fg: '#111014', shape: 'pill' },
  { id: 'holo', ad: 'Holo', bg: 'holo', fg: '#111014', shape: 'star' },
  { id: 'gunes', ad: '3 gün', bg: 'var(--violet)', fg: '#fff7ee', shape: 'burst' },
] as const

/** Moda kampanyası (Madde 10) */
export type Pattern = 'halftone' | 'stripes' | 'holo' | 'dots' | 'zigzag'
export interface Look {
  id: string
  no: string
  ad: string
  bg: string
  body: string
  pattern: Pattern
  urunler: { ad: string; fiyat: number }[]
}
export const LOOKS: Look[] = [
  { id: 'l1', no: '01', ad: 'Holo trençkot', bg: 'var(--lime)', body: 'var(--pink)', pattern: 'holo', urunler: [{ ad: 'Holografik trençkot', fiyat: 8900 }, { ad: 'Pastel platform', fiyat: 3200 }] },
  { id: 'l2', no: '02', ad: 'Nokta nokta', bg: 'var(--blue)', body: 'var(--butter)', pattern: 'halftone', urunler: [{ ad: 'Halftone elbise', fiyat: 5400 }, { ad: 'Neon çorap', fiyat: 390 }] },
  { id: 'l3', no: '03', ad: 'Çizgi kaosu', bg: 'var(--rose)', body: 'var(--violet)', pattern: 'stripes', urunler: [{ ad: 'Çizgili tulum', fiyat: 4700 }, { ad: 'Kalın kemer', fiyat: 950 }] },
  { id: 'l4', no: '04', ad: 'Zikzak gece', bg: 'var(--black)', body: 'var(--cyan)', pattern: 'zigzag', urunler: [{ ad: 'Zikzak ceket', fiyat: 6200 }, { ad: 'Yıldız küpe', fiyat: 480 }] },
  { id: 'l5', no: '05', ad: 'Pastel patlama', bg: 'var(--mint)', body: 'var(--orange)', pattern: 'dots', urunler: [{ ad: 'Puantiyeli etek', fiyat: 3900 }, { ad: 'Kabarık kol bluz', fiyat: 2800 }] },
]

export const tl = (n: number) => `₺${new Intl.NumberFormat('tr-TR').format(n)}`

/** Galeri (Madde 11): üretken eserler için kelime havuzları */
export const ADJ = ['Pembe', 'Gürültülü', 'Holografik', 'Taşan', 'Eriyen', 'Kırık', 'Neon', 'Sonsuz', 'Asit', 'Kadife', 'Çığlık Atan', 'Pastel', 'Aşırı', 'Yapışkan']
export const NOUN = ['Gürültü', 'Bahçe', 'Kolaj', 'Yıldız', 'Damla', 'Kalabalık', 'Rüya', 'Makine', 'Patlama', 'Pazar', 'Oda', 'Kuyruk', 'Kutsal Şey', 'Karnaval']
export const ARTISTS_ART = ['Deniz Parlak', 'Ece Karmaşa', 'Umut Bol', 'Selin Taşkın', 'Kerem Neon', 'Ayla Gren', 'Mert Kolaj', 'Zeynep Holo', 'Can Nokta', 'İpek Patlak']
export const TECH = ['dijital kolaj', 'halftone baskı', 'holografik folyo', 'serigrafi', 'kesik kâğıt', 'risografi']

/** 3D nesnelerin renk döngüsü (tıklayınca ya da karıştırınca sıradaki) */
export const PALETTE_3D = ['#ff2e93', '#c8ff00', '#00e5ff', '#ff6a00', '#c9b5ff', '#ffe680', '#8a2bff']
