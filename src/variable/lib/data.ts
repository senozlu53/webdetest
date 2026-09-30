import type { Kontrast, Palet } from './store'

/* ── Madde 4: palet (CSS ile birebir aynı; kontrast hesabı için) ── */
export interface PaletDeger {
  ad: string
  zemin: string
  metin: string
  soluk: string
  kontrol: string
  hat: string
  patlama: string
  patlamaYazi: string
  patlamaUzeri: string
}
export function palet(p: Palet, k: Kontrast): PaletDeger {
  const y = k === 'yuksek'
  switch (p) {
    case 'ters':
      return { ad: 'Ters', zemin: '#000000', metin: '#ffffff', soluk: y ? '#dcdcdc' : '#b3b3b3', kontrol: y ? '#bfbfbf' : '#8c8c8c', hat: y ? '#8c8c8c' : '#333333', patlama: y ? '#ff5ee0' : '#ff2bd6', patlamaYazi: y ? '#ff6be6' : '#ff2bd6', patlamaUzeri: '#000000' }
    case 'kobalt':
      return { ad: 'Kobalt', zemin: y ? '#1420e0' : '#1a2bff', metin: '#ffffff', soluk: y ? '#e4e7ff' : '#d6daff', kontrol: y ? '#ffffff' : '#b8bfff', hat: y ? '#8a94ff' : '#4d5bff', patlama: '#ffe600', patlamaYazi: '#ffe600', patlamaUzeri: '#000000' }
    case 'beton':
      return { ad: 'Beton', zemin: '#d9d9d6', metin: '#0a0a0a', soluk: y ? '#1f1f1f' : '#3b3b3b', kontrol: y ? '#3d3d3d' : '#5c5c5c', hat: y ? '#7d7d7a' : '#b5b5b2', patlama: y ? '#ff6a33' : '#ff3d00', patlamaYazi: y ? '#7a1600' : '#b32000', patlamaUzeri: '#000000' }
    default:
      return { ad: 'Ham', zemin: '#ffffff', metin: '#000000', soluk: y ? '#262626' : '#4a4a4a', kontrol: y ? '#404040' : '#767676', hat: y ? '#737373' : '#d4d4d4', patlama: y ? '#ff6a33' : '#ff3d00', patlamaYazi: y ? '#a32100' : '#c22800', patlamaUzeri: '#000000' }
  }
}
export const PALET_ACIKLAMA: Record<Palet, string> = {
  ham: 'Ham siyah-beyaz zıtlık. Patlayan tek renk: turuncu kırmızı',
  ters: 'Siyah zemin, beyaz metin. Patlayan tek renk: sıcak pembe',
  kobalt: 'Monokrom kobalt zemin. Patlayan tek renk: sarı',
  beton: 'Monokrom beton grisi. Patlayan tek renk: turuncu kırmızı',
}

/* ── Madde 5: eksenler ── */
export type Aile = 'flex' | 'rec' | 'fra'
export interface Eksen {
  tag: string
  ad: string
  min: number
  varsayilan: number
  max: number
  adim: number
}
export interface AileTanim {
  ad: string
  css: string
  eksenler: Eksen[]
  onayarlar: { ad: string; deger: Record<string, number> }[]
  not: string
}
export const AILELER: Record<Aile, AileTanim> = {
  flex: {
    ad: 'Roboto Flex',
    css: 'f-flex',
    not: '13 eksen: optik boyut, kalınlık, genişlik, eğim ve harf iskeletinin ince ayarları',
    eksenler: [
      { tag: 'opsz', ad: 'Optik boyut', min: 8, varsayilan: 14, max: 144, adim: 1 },
      { tag: 'wght', ad: 'Kalınlık', min: 100, varsayilan: 400, max: 1000, adim: 1 },
      { tag: 'GRAD', ad: 'Derecelendirme', min: -200, varsayilan: 0, max: 150, adim: 1 },
      { tag: 'wdth', ad: 'Genişlik', min: 25, varsayilan: 100, max: 151, adim: 1 },
      { tag: 'slnt', ad: 'Eğim', min: -10, varsayilan: 0, max: 0, adim: 0.5 },
      { tag: 'XOPQ', ad: 'Gövde kalınlığı (X)', min: 27, varsayilan: 96, max: 175, adim: 1 },
      { tag: 'YOPQ', ad: 'Gövde kalınlığı (Y)', min: 25, varsayilan: 79, max: 135, adim: 1 },
      { tag: 'XTRA', ad: 'Harf içi genişlik', min: 323, varsayilan: 468, max: 603, adim: 1 },
      { tag: 'YTUC', ad: 'Büyük harf boyu', min: 528, varsayilan: 712, max: 760, adim: 1 },
      { tag: 'YTLC', ad: 'Küçük harf boyu', min: 416, varsayilan: 514, max: 570, adim: 1 },
      { tag: 'YTAS', ad: 'Çıkıntı yüksekliği', min: 649, varsayilan: 750, max: 854, adim: 1 },
      { tag: 'YTDE', ad: 'Sarkma derinliği', min: -305, varsayilan: -203, max: -98, adim: 1 },
      { tag: 'YTFI', ad: 'Rakam boyu', min: 560, varsayilan: 738, max: 788, adim: 1 },
    ],
    onayarlar: [
      { ad: 'Sıkışık', deger: { wght: 1000, wdth: 25, opsz: 144 } },
      { ad: 'Uzatılmış', deger: { wght: 100, wdth: 151, opsz: 144 } },
      { ad: 'Şişkin', deger: { wght: 1000, wdth: 151, GRAD: 150, opsz: 144 } },
      { ad: 'Eğik', deger: { wght: 700, slnt: -10, opsz: 144 } },
      { ad: 'Garip', deger: { wght: 900, wdth: 25, XOPQ: 175, YOPQ: 25, XTRA: 603, YTUC: 528, YTAS: 854, opsz: 144 } },
    ],
  },
  rec: {
    ad: 'Recursive',
    css: 'f-rec',
    not: '5 eksen: mono, sıradanlık (casual), kalınlık, eğim, el yazısı',
    eksenler: [
      { tag: 'MONO', ad: 'Mono', min: 0, varsayilan: 0, max: 1, adim: 0.01 },
      { tag: 'CASL', ad: 'Sıradanlık', min: 0, varsayilan: 0, max: 1, adim: 0.01 },
      { tag: 'wght', ad: 'Kalınlık', min: 300, varsayilan: 400, max: 1000, adim: 1 },
      { tag: 'slnt', ad: 'Eğim', min: -15, varsayilan: 0, max: 0, adim: 0.5 },
      { tag: 'CRSV', ad: 'El yazısı', min: 0, varsayilan: 0.5, max: 1, adim: 0.5 },
    ],
    onayarlar: [
      { ad: 'Ham mono', deger: { MONO: 1, CASL: 0, wght: 800 } },
      { ad: 'Sıradan', deger: { MONO: 0, CASL: 1, wght: 900, slnt: -15 } },
      { ad: 'Şişkin', deger: { MONO: 0, CASL: 0.5, wght: 1000, CRSV: 1 } },
    ],
  },
  fra: {
    ad: 'Fraunces',
    css: 'f-fra',
    not: '4 eksen: optik boyut, kalınlık, yumuşaklık (SOFT), tuhaflık (WONK)',
    eksenler: [
      { tag: 'opsz', ad: 'Optik boyut', min: 9, varsayilan: 144, max: 144, adim: 1 },
      { tag: 'wght', ad: 'Kalınlık', min: 100, varsayilan: 400, max: 900, adim: 1 },
      { tag: 'SOFT', ad: 'Yumuşaklık', min: 0, varsayilan: 0, max: 100, adim: 1 },
      { tag: 'WONK', ad: 'Tuhaflık', min: 0, varsayilan: 0, max: 1, adim: 1 },
    ],
    onayarlar: [
      { ad: 'Cıvık', deger: { SOFT: 100, WONK: 1, wght: 900, opsz: 144 } },
      { ad: 'Keskin', deger: { SOFT: 0, WONK: 0, wght: 300, opsz: 144 } },
      { ad: 'Garip', deger: { SOFT: 60, WONK: 1, wght: 100, opsz: 9 } },
    ],
  },
}
/** eksen değerlerini `font-variation-settings` dizesine çevirir */
export function eksenDizesi(d: Record<string, number>) {
  return Object.entries(d)
    .map(([k, v]) => `'${k}' ${Number.isInteger(v) ? v : v.toFixed(2)}`)
    .join(', ')
}

/* ── Madde 6: harf müzesi (aynı glif, dokuz bozulma) ── */
export const BOZULMALAR: { ad: string; deger: Record<string, number> }[] = [
  { ad: 'Sıkıştırılmış', deger: { wght: 1000, wdth: 25 } },
  { ad: 'Uzatılmış', deger: { wght: 100, wdth: 151 } },
  { ad: 'Şişkin', deger: { wght: 1000, wdth: 151 } },
  { ad: 'İnce-dar', deger: { wght: 100, wdth: 25 } },
  { ad: 'Eğik', deger: { wght: 700, wdth: 100, slnt: -10 } },
  { ad: 'Uzun boylu', deger: { wght: 400, YTAS: 854, YTUC: 760, YTDE: -98 } },
  { ad: 'Kısa boylu', deger: { wght: 400, YTAS: 649, YTUC: 528, YTLC: 416, YTDE: -305 } },
  { ad: 'Boş gövde', deger: { wght: 100, XOPQ: 27, YOPQ: 25, wdth: 151 } },
  { ad: 'Ağır gövde', deger: { wght: 1000, XOPQ: 175, YOPQ: 135, XTRA: 603 } },
]

/* ── Madde 9: yazı tipinin kendi simgeleri ── */
export const GLIFLER: { g: string; ad: string; kullanim: string }[] = [
  { g: '↑', ad: 'Yukarı', kullanim: 'Başa dön' },
  { g: '↓', ad: 'Aşağı', kullanim: 'Devam et' },
  { g: '+', ad: 'Artı', kullanim: 'Aç, ekle' },
  { g: '−', ad: 'Eksi', kullanim: 'Kapat, çıkar' },
  { g: '×', ad: 'Çarpı', kullanim: 'Kapat, sil' },
  { g: '÷', ad: 'Bölü', kullanim: 'Ayır' },
  { g: '•', ad: 'Nokta', kullanim: 'Liste, seçili' },
  { g: '§', ad: 'Bölüm', kullanim: 'Bölüm işareti' },
  { g: '¶', ad: 'Paragraf', kullanim: 'Metin bloğu' },
  { g: '@', ad: 'Et', kullanim: 'İletişim' },
  { g: '#', ad: 'Diyez', kullanim: 'Etiket, sıra' },
  { g: '&', ad: 'Ve', kullanim: 'Birlikte' },
]

/* ── Madde 10 · Moda ── */
export const MODA = [
  { id: 'kivrim', ad: 'Kıvrım', tur: 'Palto', fiyat: 14500, not: 'Tek dikişle bükülmüş omuz hattı.' },
  { id: 'yirtik', ad: 'Yırtık', tur: 'Gömlek', fiyat: 6200, not: 'Kenarı bilerek açık bırakılmış.' },
  { id: 'gerilim', ad: 'Gerilim', tur: 'Pantolon', fiyat: 8900, not: 'Dizde gerilen, belde salınan.' },
  { id: 'sarkma', ad: 'Sarkma', tur: 'Elbise', fiyat: 11800, not: 'Kendi ağırlığıyla şekillenen etek.' },
] as const

/* ── Madde 10 · Bienal ── */
export const PROGRAM = [
  { gun: 'Cuma', saat: '10:00', yer: 'Antrepo 3', ad: 'Açılış konuşması: Bükülen zemin', tur: 'Konuşma' },
  { gun: 'Cuma', saat: '12:30', yer: 'Avlu', ad: 'Gölgesiz bina, ışıksız mekân', tur: 'Sergi' },
  { gun: 'Cuma', saat: '16:00', yer: 'Antrepo 1', ad: 'Sıkıştırılmış şehir atölyesi', tur: 'Atölye' },
  { gun: 'Cumartesi', saat: '11:00', yer: 'Antrepo 3', ad: 'Eksenler ve yapı: mimarlıkta değişken form', tur: 'Konuşma' },
  { gun: 'Cumartesi', saat: '14:00', yer: 'Rıhtım', ad: 'Esneyen cephe, yürüyüş turu', tur: 'Tur' },
  { gun: 'Cumartesi', saat: '18:30', yer: 'Antrepo 2', ad: 'Karanlıkta model: performans', tur: 'Performans' },
  { gun: 'Pazar', saat: '11:00', yer: 'Avlu', ad: 'Çocuklar için yapı bükme', tur: 'Atölye' },
  { gun: 'Pazar', saat: '15:00', yer: 'Antrepo 3', ad: 'Kapanış: bir sonraki eğri', tur: 'Konuşma' },
] as const
export const GUNLER = ['Hepsi', 'Cuma', 'Cumartesi', 'Pazar'] as const

/* ── Madde 10 · Dergi ── */
export const YAZILAR = [
  { no: '01', baslik: 'Eksenin ötesi', yazar: 'Deniz Arı', dk: 8, ozet: 'Bir yazı tipi tek bir biçim değil, bir uzaydır. Kalınlık ve genişlik iki koordinat, okur ise o uzayda bir noktadır.' },
  { no: '02', baslik: 'Hiyerarşiyi bozmak', yazar: 'Kaan Ünal', dk: 6, ozet: 'Başlığı gövdeden büyük yapmak kural; başlığı gövdenin içine gömmek ise sayfaya soru sormaktır.' },
  { no: '03', baslik: 'Cıvık serif', yazar: 'Melis Tan', dk: 11, ozet: 'Yumuşaklık ekseni serifin köşelerini eritir. Kâğıt kokusu ekranda bir anlığına geri döner.' },
  { no: '04', baslik: 'Okunmayanın onuru', yazar: 'Ozan Kılıç', dk: 5, ozet: 'Okunmayan büyük başlık bir davettir; gövde metni ise sözleşme. İkisini karıştırmayın.' },
  { no: '05', baslik: 'Mono ve el yazısı', yazar: 'Ada Sönmez', dk: 9, ozet: 'Aynı harf, iki eksen: makine gibi düzgün ya da el gibi düzensiz. Seçim satır başına yapılabilir.' },
] as const

/* ── Madde 10 · Kişisel site ── */
export const ISLER = [
  { ad: 'Bükülü Yüzey', yil: 2025, tur: 'Kimlik' },
  { ad: 'Esnek Harita', yil: 2025, tur: 'Poster serisi' },
  { ad: 'Kırık Sütun', yil: 2024, tur: 'Dergi tasarımı' },
  { ad: 'Şişkin Alfabe', yil: 2024, tur: 'Yazı tipi' },
  { ad: 'Yarım Kalan Cümle', yil: 2023, tur: 'Kitap' },
] as const

/* ── Madde 11 · 14 ── */
export const PROPLAR: { bilesen: string; ad: string; tip: string; varsayilan: string; aciklama: string }[] = [
  { bilesen: '<Degisken>', ad: 'metin', tip: 'string', varsayilan: '—', aciklama: 'Harflere bölünür; ekran okuyucu metni bir kez okur, harfler aria-hidden' },
  { bilesen: '<Degisken>', ad: 'aile', tip: '"flex" | "rec" | "fra"', varsayilan: '"flex"', aciklama: 'Roboto Flex, Recursive ya da Fraunces' },
  { bilesen: '<Degisken>', ad: 'mod', tip: '"yakin" | "sabit"', varsayilan: '"yakin"', aciklama: 'İmleç yakınlığı: yaklaşan harf şişer, halkadaki harf incelir; ikisi de yayla elastik' },
  { bilesen: '<Degisken>', ad: 'bazi', tip: '"kaos" | "duz"', varsayilan: '"kaos"', aciklama: 'Dinlenme durumu: harf başına farklı eksenler ya da güvenli standart' },
  { bilesen: '<EksenBaslik>', ad: 'harita', tip: '{ x, y }[]', varsayilan: '—', aciklama: 'Kart içi imleç koordinatını eksenlere bağlar (x → genişlik, y → kalınlık gibi)' },
  { bilesen: '<EksenBaslik>', ad: 'sertlik · sonum', tip: 'number', varsayilan: '170 · 11', aciklama: 'Yay sertliği ve sönümü; sönüm oranı < 1 ise hedefi aşar' },
  { bilesen: '<KirikBlok>', ad: 'c · s · mx · my · don', tip: 'number', varsayilan: '1 · 6 · 0 · 0 · 0', aciklama: '12 kolonda başlangıç ve genişlik; kırık düzende kayma ve dönme' },
  { bilesen: '<KatmanSahne>', ad: 'katman · oran', tip: 'number', varsayilan: '4 · 0,62', aciklama: 'Üst üste binen katman sayısı ve boy oranı' },
  { bilesen: '<GlitchMetin>', ad: 'metin', tip: 'string', varsayilan: '—', aciklama: 'Kısa patlamalarla kayan dilimler; hareket kapalıyken hiç çalışmaz' },
]

/* ── Madde 12 · 13: Figma ── */
export const FIGMA_OZELLIKLER = [
  { ad: 'Font Weight', tag: 'wght', tip: 'Number', min: 100, varsayilan: 400, max: 1000 },
  { ad: 'Width', tag: 'wdth', tip: 'Number', min: 25, varsayilan: 100, max: 151 },
  { ad: 'Slant', tag: 'slnt', tip: 'Number', min: -10, varsayilan: 0, max: 0 },
] as const

/* ── Madde 15 ── */
export const CSS_SATIRI = `style={{ fontVariationSettings: "'wght' 900, 'wdth' 125" }}`
export const TAILWIND_SATIRI = `[font-variation-settings:'wght'_900,'wdth'_125]`
