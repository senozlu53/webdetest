import type { BitkiTur, MekanTur } from '../components/Bitki'
import type { SimgeAd } from './simge'

/* ── Madde 3: karakteristikler ── */
export const KARAKTER: { ikon: SimgeAd; baslik: string; metin: string; olcu: string }[] = [
  { ikon: 'agac', baslik: 'Canlı ekosistem hissi', metin: 'Gökyüzü, tepeler, su ve yapraklar arka planda hiç durmadan yaşar: bulut süzülür, yaprak rüzgârda kıpırdar, polen ışıkta yükselir.', olcu: '5 canlı katman' },
  { ikon: 'gunes', baslik: 'Gün ışığı senkronizasyonu', metin: 'Arayüz cihazın saatini okur. Sabah, öğle, akşam ve gece arasında sürekli karışım yapılır; tek bir “tema düğmesi” yoktur.', olcu: '24 saat · 4 mod' },
  { ikon: 'nefes', baslik: 'Ferahlatıcı nefes alanları', metin: 'Bölüm araları, satır aralığı ve panel iç boşlukları cömerttir. İçerik, sıkışık bir pencere gibi değil, açık bir odada durur.', olcu: 'gövde 1,72 satır' },
  { ikon: 'meditasyon', baslik: 'Zihinsel dinginlik odaklı UX', metin: 'Hiçbir şey sıçramaz, titremez, alarm vermez. Geçişler 1 saniyeyi bulur; hareket kalp ve nefes hızında yapılır.', olcu: '1000 ms geçiş' },
]

/* ── Madde 4: ana renkler ── */
export const ANA_RENK: { ad: string; hex: string; rol: string; yazi: string }[] = [
  { ad: 'Gökyüzü Mavisi', hex: '#87CEEB', rol: 'Öğle göğü, su yüzeyi, açık alan', yazi: 'Yalnız arka plan' },
  { ad: 'Orman Yeşili', hex: '#228B22', rol: 'Yaprak katmanları, dolgu, büyük metin', yazi: 'Küçük metinde türevi #14612A' },
  { ad: 'Güneş Işığı Sarısı', hex: '#FFFACD', rol: 'Güneş parıltısı, vurgu düğmesi, ilerleme ucu', yazi: 'Üzerinde koyu yazı' },
  { ad: 'Saf Beyaz', hex: '#FFFFFF', rol: 'Gündüz cam paneli, yüzeyler', yazi: 'Üzerinde koyu yeşil yazı' },
]

/* ── Madde 6 ── */
export const SEKILLER = [
  { id: 'daire', ad: 'Daire', aciklama: 'Hücre ve tohum çekirdeği', r: '50%' },
  { id: 'hucre', ad: 'Hücre', aciklama: 'Zar, çekirdek ve koful', r: '63% 37% 54% 46% / 55% 48% 52% 45%' },
  { id: 'tohum', ad: 'Tohum', aciklama: 'Damla; tek köşesi sivri', r: '50% 50% 50% 8% / 60% 60% 40% 40%' },
  { id: 'damla', ad: 'Su damlası', aciklama: 'Alttan yuvarlak, üstten sivri', r: '50% 50% 50% 50% / 62% 62% 38% 38%' },
] as const

/* ── Madde 10 · Bitki yönetimi ── */
export type Oda = 'salon' | 'calisma' | 'mutfak'
export const ODA_AD: Record<Oda, string> = { salon: 'Salon', calisma: 'Çalışma odası', mutfak: 'Mutfak' }
export interface Bitki {
  id: string
  tur: BitkiTur
  ad: string
  latince: string
  oda: Oda
  nem: number
  hedef: [number, number]
  isik: number
  sicaklik: number
  sulama: string
}
export const BITKILER: Bitki[] = [
  { id: 'monstera', tur: 'monstera', ad: 'Deve tabanı', latince: 'Monstera deliciosa', oda: 'salon', nem: 58, hedef: [45, 65], isik: 6400, sicaklik: 22.5, sulama: '2 gün önce' },
  { id: 'kaucuk', tur: 'kaucuk', ad: 'Kauçuk', latince: 'Ficus elastica', oda: 'salon', nem: 41, hedef: [35, 55], isik: 5200, sicaklik: 22, sulama: '4 gün önce' },
  { id: 'egrelti', tur: 'egrelti', ad: 'Eğrelti otu', latince: 'Nephrolepis exaltata', oda: 'calisma', nem: 27, hedef: [55, 75], isik: 2900, sicaklik: 21, sulama: '6 gün önce' },
  { id: 'sukulent', tur: 'sukulent', ad: 'Sukulent', latince: 'Echeveria elegans', oda: 'mutfak', nem: 18, hedef: [10, 30], isik: 9800, sicaklik: 23, sulama: '12 gün önce' },
]
export const nemDurum = (b: { nem: number; hedef: [number, number] }): { kod: 'susamis' | 'iyi' | 'islak'; ad: string } => (b.nem < b.hedef[0] ? { kod: 'susamis', ad: 'Susamış' } : b.nem > b.hedef[1] ? { kod: 'islak', ad: 'Fazla ıslak' } : { kod: 'iyi', ad: 'İyi' })

/* ── Madde 10 · Biofilik portfolyo ── */
export type ProjeTur = 'ofis' | 'konut' | 'kamusal'
export const PROJE_TUR_AD: Record<ProjeTur, string> = { ofis: 'Ofis', konut: 'Konut', kamusal: 'Kamusal' }
export interface Proje {
  id: string
  ad: string
  tur: ProjeTur
  yer: string
  yil: number
  alan: string
  mekan: MekanTur
  saat: number
  yesil: number
  gunisigi: number
  bitki: number
  enerji: number
  aciklama: string
  desenler: number[]
}
export const BIOFILIK_DESENLER = [
  'Doğaya görsel bağlantı',
  'Doğaya görsel olmayan bağlantı',
  'Düzensiz duyusal uyaranlar',
  'Isıl ve hava akışı çeşitliliği',
  'Suyun varlığı',
  'Dinamik ve yayılmış ışık',
  'Doğal sistemlerle bağlantı',
  'Biyomorfik biçimler ve desenler',
  'Doğal malzemelerle bağlantı',
  'Karmaşıklık ve düzen',
  'Manzara',
  'Sığınak',
  'Gizem',
  'Risk ve tehlike',
]
export const PROJELER: Proje[] = [
  {
    id: 'kavak',
    ad: 'Kavak Atrium',
    tur: 'ofis',
    yer: 'Nilüfer, Bursa',
    yil: 2024,
    alan: '4.200 m²',
    mekan: 'atrium',
    saat: 10,
    yesil: 38,
    gunisigi: 86,
    bitki: 62,
    enerji: 21,
    aciklama: 'Üç katı saran cam çatılı bir iç bahçe. Çalışma masaları ağacın çevresine dizildi; öğleden sonra ışık yaprakların arasından süzülür.',
    desenler: [1, 3, 4, 5, 6, 7, 8, 10, 11],
  },
  {
    id: 'sedir',
    ad: 'Sedir Salonu',
    tur: 'ofis',
    yer: 'Levent, İstanbul',
    yil: 2023,
    alan: '1.150 m²',
    mekan: 'salon',
    saat: 16.5,
    yesil: 24,
    gunisigi: 71,
    bitki: 18,
    enerji: 14,
    aciklama: 'Ahşap çıta duvarlı bir toplantı ve dinlenme salonu. Büyük kemerli pencere gün boyu yön değiştiren bir ışık düşürür.',
    desenler: [1, 6, 9, 12, 8],
  },
  {
    id: 'cinar',
    ad: 'Çınar Çatı Bahçesi',
    tur: 'kamusal',
    yer: 'Çankaya, Ankara',
    yil: 2025,
    alan: '2.600 m²',
    mekan: 'cati',
    saat: 19,
    yesil: 61,
    gunisigi: 100,
    bitki: 41,
    enerji: 9,
    aciklama: 'Belediye binasının çatısında herkese açık bir bahçe. Yağmur suyu toplanır, pergola gölgesi yaz sıcağını kırar.',
    desenler: [1, 2, 4, 5, 7, 11, 13],
  },
  {
    id: 'zeytin',
    ad: 'Zeytin Evi',
    tur: 'konut',
    yer: 'Urla, İzmir',
    yil: 2024,
    alan: '380 m²',
    mekan: 'salon',
    saat: 7,
    yesil: 33,
    gunisigi: 78,
    bitki: 24,
    enerji: 32,
    aciklama: 'Sabah güneşini doğu cephesinden alan taş ve ahşap bir ev. Avlu, yazın serin bir sığınak olarak çalışır.',
    desenler: [1, 4, 6, 9, 12, 14],
  },
  {
    id: 'dere',
    ad: 'Dere Kütüphanesi',
    tur: 'kamusal',
    yer: 'Bolu Merkez',
    yil: 2022,
    alan: '1.900 m²',
    mekan: 'atrium',
    saat: 13,
    yesil: 44,
    gunisigi: 90,
    bitki: 35,
    enerji: 18,
    aciklama: 'Okuma salonunun ortasından geçen sığ bir su kanalı ve altında çınlayan hafif bir ses; çocuk bölümü ağaç evin gölgesinde.',
    desenler: [1, 2, 3, 5, 6, 8, 13],
  },
]

/* ── Madde 10 · Uyku ve sağlık uygulaması ── */
export const UYKU_SAATLERI: { saat: string; derin: number; hafif: number; nabiz: number }[] = [
  { saat: '23', derin: 0, hafif: 40, nabiz: 62 },
  { saat: '00', derin: 20, hafif: 40, nabiz: 58 },
  { saat: '01', derin: 45, hafif: 15, nabiz: 55 },
  { saat: '02', derin: 50, hafif: 10, nabiz: 54 },
  { saat: '03', derin: 30, hafif: 25, nabiz: 55 },
  { saat: '04', derin: 15, hafif: 35, nabiz: 57 },
  { saat: '05', derin: 10, hafif: 35, nabiz: 59 },
  { saat: '06', derin: 0, hafif: 20, nabiz: 63 },
]
export const AKSAM_RUTINI = [
  { id: 'isik', ad: 'Ekran ışığını kıs', ipucu: 'Gün batımından sonra mavi ışığı azaltır' },
  { id: 'oda', ad: 'Odayı 19 °C’ye indir', ipucu: 'Akıllı ısıtıcı 21:30’da başlar' },
  { id: 'nefes', ad: '4-7-8 nefes egzersizi', ipucu: 'Yaklaşık 3 dakika' },
] as const

/* ── Madde 12 · 13 ── */
export const FIGMA_KOLEKSIYONLAR: { ad: string; mod: string; not: string }[] = [
  { ad: 'Primitives', mod: 'Tek mod', not: 'Ham renkler: Sky/400, Forest/600, Sun/100, White' },
  { ad: 'Theme', mod: 'Sabah · Öğle · Akşam · Gece', not: 'Dinamik tema: aynı değişken adı, mod başına farklı değer' },
  { ad: 'Glass', mod: 'Sabah · Öğle · Akşam · Gece', not: 'Cam tonu, opaklık ve yazı renkleri (dengeleyici çıktısı)' },
  { ad: 'Radius', mod: 'Tek mod', not: 'Radius/BiophilicOrganic ve türevleri' },
  { ad: 'Motion', mod: 'Normal · Hafif', not: 'Geçiş süreleri; Hafif mod mobil için' },
]
export const FIGMA_ETIKETLER: { ad: string; deger: string }[] = [
  { ad: 'Theme/MorningLight', deger: 'Sabah modu · 05–10' },
  { ad: 'Theme/NoonSky', deger: 'Öğle modu · 10–16' },
  { ad: 'Theme/EveningGlow', deger: 'Akşam modu · 16–21' },
  { ad: 'Theme/NightCalm', deger: 'Gece modu · 21–05' },
  { ad: 'Radius/BiophilicOrganic', deger: '63% 37% 54% 46% / 55% 48% 52% 45%' },
  { ad: 'Shadow/SunSoft', deger: 'x güneşe göre, y 16, blur 44' },
  { ad: 'Motion/Breath', deger: '4 sn al · 6 sn ver' },
]

/* ── Madde 14 ── */
export const PROPLAR: { bilesen: string; ad: string; tip: string; varsayilan: string; aciklama: string }[] = [
  { bilesen: '<BiophilicCard>', ad: 'gorsel', tip: 'ReactNode', varsayilan: '—', aciklama: 'Kartın üstündeki organik maskeli görsel alanı' },
  { bilesen: '<BiophilicCard>', ad: 'dinamik', tip: 'boolean', varsayilan: 'false', aciklama: 'O anki günün modunu gösterir; cam opaklığı saate göre çözülür' },
  { bilesen: '<BiophilicCard>', ad: 'nefes', tip: 'boolean', varsayilan: 'false', aciklama: 'Kart çok yavaş genişler ve daralır (−%1,4 / +%1,4)' },
  { bilesen: '<DynamicAmbientBackground>', ad: 'kapsam', tip: '"sayfa" | "alan"', varsayilan: '"sayfa"', aciklama: 'Sayfaya sabit ya da kapsayıcıya bağlı ortam' },
  { bilesen: '<DynamicAmbientBackground>', ad: 'seviye', tip: '"tam" | "hafif"', varsayilan: 'oto', aciklama: 'Hafif: huzme, bulut, su ve polen çizilmez' },
  { bilesen: '<BreatheTimer>', ad: 'desen', tip: 'NefesDesen', varsayilan: '—', aciklama: 'Adımlar: al, tut, ver, bekle; her adımın süresi ve halka ölçeği' },
  { bilesen: '<BreatheTimer>', ad: 'sureDk', tip: 'number', varsayilan: '—', aciklama: 'Oturum süresi (dakika)' },
  { bilesen: '<BreatheTimer>', ad: 'duyurAdim', tip: 'boolean', varsayilan: 'false', aciklama: 'Her adımı ekran okuyucuya duyurur' },
]

/* ── Madde 15 ── */
export const TAILWIND_ORNEK = {
  sinif: 'transition-colors duration-1000 ease-in-out bg-gradient-to-br from-emerald-50 to-teal-100',
  varyant: [
    { id: 'ogle', ad: 'Öğle (spec)', sinif: 'bg-gradient-to-br from-emerald-50 to-teal-100' },
    { id: 'sabah', ad: 'Sabah', sinif: 'bg-gradient-to-br from-amber-50 to-sky-100' },
    { id: 'aksam', ad: 'Akşam', sinif: 'bg-gradient-to-br from-orange-100 to-sky-200' },
    { id: 'gece', ad: 'Gece', sinif: 'bg-gradient-to-br from-teal-800 to-slate-900' },
  ],
}

export const BITKI_ORNEK_ETIKET: Record<BitkiTur, string> = {
  monstera: 'Deve tabanı çizimi',
  kaucuk: 'Kauçuk çizimi',
  egrelti: 'Eğrelti otu çizimi',
  sukulent: 'Sukulent çizimi',
}
