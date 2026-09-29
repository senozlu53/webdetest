import type { SahneAd } from '../components/Gorsel'

/** Ardıç Mimarlık (kurgu) */
export type ProjeTur = 'Konut' | 'Otel' | 'Kültür'
export interface Proje {
  id: string
  no: string
  ad: string
  yer: string
  yil: number
  tur: ProjeTur
  alan: string
  sahne: SahneAd
  not: string
}
export const PROJELER: Proje[] = [
  { id: 'kuru-tas', no: '01', ad: 'Kuru Taş Evi', yer: 'Datça', yil: 2024, tur: 'Konut', alan: '240 m²', sahne: 'cephe', not: 'Yerel taşla örülmüş, iki avlulu yazlık. Cephede tek malzeme, içeride tek ışık.' },
  { id: 'sessiz-han', no: '02', ad: 'Sessiz Han', yer: 'Mardin', yil: 2023, tur: 'Otel', alan: '1.850 m²', sahne: 'kemer', not: 'Kemerli bir hanın on iki odalı otele dönüşümü. Kireç sıva, kayrak zemin.' },
  { id: 'carsi', no: '03', ad: 'Çarşı Galerisi', yer: 'İstanbul', yil: 2022, tur: 'Kültür', alan: '920 m²', sahne: 'duvar', not: 'Eski bir depoda beton ve gün ışığından kurulu sergi salonları.' },
  { id: 'ada', no: '04', ad: 'Ada Pavyonu', yer: 'Ayvalık', yil: 2024, tur: 'Konut', alan: '180 m²', sahne: 'kumsal', not: 'Tek katlı, denize açılan cam kenarlı pavyon. Ahşap, keten, taş.' },
  { id: 'tuz', no: '05', ad: 'Tuz Müzesi', yer: 'Tuz Gölü', yil: 2021, tur: 'Kültür', alan: '3.200 m²', sahne: 'mermer', not: 'Gölün beyazına karışan traverten kabuklu müze. Dikey ışık kuyuları.' },
  { id: 'kil', no: '06', ad: 'Kil Atölyesi', yer: 'Çanakkale', yil: 2023, tur: 'Kültür', alan: '410 m²', sahne: 'seramik', not: 'Seramik ustalarına iki katlı, kuzey ışıklı atölye ve misafir odaları.' },
]

/** Ardıç Koleksiyon (kurgu) */
export type Teknik = 'Fotoğraf' | 'Resim' | 'Seramik' | 'Heykel'
export interface Eser {
  id: string
  no: string
  ad: string
  sanatci: string
  yil: number
  teknik: Teknik
  olcu: string
  sahne: SahneAd
  not: string
}
export const ESERLER: Eser[] = [
  { id: 'k1', no: 'K-001', ad: 'Sabah Işığı I', sanatci: 'Leyla Sönmez', yil: 2022, teknik: 'Fotoğraf', olcu: '90 × 60 cm', sahne: 'duvar', not: 'Pigment baskı, mat kâğıt. Baskı 3/7.' },
  { id: 'k2', no: 'K-002', ad: 'Kum', sanatci: 'Nehir Aras', yil: 2021, teknik: 'Fotoğraf', olcu: '120 × 80 cm', sahne: 'kumsal', not: 'Gümüş jelatin baskı. Baskı 1/5.' },
  { id: 'k3', no: 'K-003', ad: 'Üç Kap', sanatci: 'Arda Kılıç', yil: 2023, teknik: 'Seramik', olcu: 'h 34 cm', sahne: 'seramik', not: 'El yapımı, ateş rengi sırsız gövde. Tek parça.' },
  { id: 'k4', no: 'K-004', ad: 'Kıvrım', sanatci: 'Leyla Sönmez', yil: 2020, teknik: 'Resim', olcu: '150 × 100 cm', sahne: 'kumas', not: 'Keten üzerine yağlı boya.' },
  { id: 'k5', no: 'K-005', ad: 'Damar No. 4', sanatci: 'Tolga Demir', yil: 2024, teknik: 'Heykel', olcu: '48 × 30 × 30 cm', sahne: 'mermer', not: 'Traverten, elle cilalı. Tek parça.' },
  { id: 'k6', no: 'K-006', ad: 'Kemer Serisi', sanatci: 'Nehir Aras', yil: 2022, teknik: 'Fotoğraf', olcu: '100 × 66 cm', sahne: 'kemer', not: 'Pigment baskı, kırk yıllık sıvalı bir avlu. Baskı 2/7.' },
  { id: 'k7', no: 'K-007', ad: 'Cephe', sanatci: 'Tolga Demir', yil: 2019, teknik: 'Resim', olcu: '120 × 80 cm', sahne: 'cephe', not: 'Tuval üzerine akrilik.' },
  { id: 'k8', no: 'K-008', ad: 'Oda', sanatci: 'Arda Kılıç', yil: 2021, teknik: 'Resim', olcu: '80 × 60 cm', sahne: 'oda', not: 'Kâğıt üzerine guaj.' },
]

/** Ardıç Han, butik otel (kurgu) */
export interface Oda {
  id: string
  ad: string
  m2: number
  fiyat: number
  sahne: SahneAd
  not: string
}
export const ODALAR: Oda[] = [
  { id: 'avlu', ad: 'Avlu Odası', m2: 32, fiyat: 8900, sahne: 'oda', not: 'Avluya bakan, keten yatak takımı, kireç sıvalı duvar. Kahvaltı avluda.' },
  { id: 'kemer', ad: 'Kemer Süiti', m2: 54, fiyat: 14800, sahne: 'kemer', not: 'Kemerle ikiye ayrılan salon ve yatak. Özel banyo, traverten küvet.' },
  { id: 'cati', ad: 'Çatı Evi', m2: 96, fiyat: 26500, sahne: 'kumsal', not: 'Tek kat, çatı terası, vadiye bakan cam duvar. Özel şef, akşam yemeği.' },
]

/** Ardıç Mağaza (kurgu) */
export interface Urun {
  id: string
  ad: string
  fiyat: number
  sahne: SahneAd
  konum: string
  renkler: string[]
  not: string
}
export const URUNLER: Urun[] = [
  { id: 'ortu', ad: 'Keten Örtü', fiyat: 3400, sahne: 'kumas', konum: 'xMidYMid', renkler: ['Kum', 'Kömür'], not: 'Yıkanmış keten, 140 × 240 cm' },
  { id: 'atki', ad: 'Kaşmir Atkı', fiyat: 5900, sahne: 'kumas', konum: 'xMaxYMid', renkler: ['Taş', 'Toprak'], not: '%100 kaşmir, el kenarı' },
  { id: 'vazo', ad: 'Seramik Vazo', fiyat: 2750, sahne: 'seramik', konum: 'xMidYMid', renkler: ['Fildişi', 'Kömür'], not: 'El yapımı, h 28 cm' },
  { id: 'tepsi', ad: 'Traverten Tepsi', fiyat: 4200, sahne: 'mermer', konum: 'xMidYMid', renkler: ['Bej', 'Gri'], not: 'Tek parça taş, 42 cm' },
  { id: 'yastik', ad: 'Keten Yastık', fiyat: 1650, sahne: 'oda', konum: 'xMidYMax', renkler: ['Kum', 'Fildişi'], not: '50 × 50 cm, tüy dolgu' },
  { id: 'battaniye', ad: 'Yün Battaniye', fiyat: 7800, sahne: 'duvar', konum: 'xMidYMid', renkler: ['Taş', 'Kömür'], not: 'Merinos yünü, 180 × 220 cm' },
]

/** Ardıç Dergi (kurgu) */
export type Konu = 'Mimari' | 'Kültür' | 'Zanaat' | 'Sanat'
export interface Makale {
  id: string
  no: string
  baslik: string
  konu: Konu
  sure: number
  yazar: string
  ozet: string
}
export const MAKALELER: Makale[] = [
  { id: 'bosluk', no: '01', baslik: 'Boşluğun Mimarisi', konu: 'Mimari', sure: 8, yazar: 'Defne Aksoy', ozet: 'Bir odanın sessizliği, içindeki nesnelerin değil, aralarındaki mesafenin ölçüsüdür.' },
  { id: 'bilen', no: '02', baslik: 'Bilen Bilir: Sessiz Lüksün Kısa Tarihi', konu: 'Kültür', sure: 11, yazar: 'Kerem Yıldız', ozet: 'Logosuz çantalardan dikişsiz gömleklere; gösterişin yerini ustalığın alışı.' },
  { id: 'kasmir', no: '03', baslik: 'Bir Kaşmirin Ömrü', konu: 'Zanaat', sure: 6, yazar: 'Selin Arıkan', ozet: 'Tüyünden atkıya kadar altı el, dokuz hafta ve hiç acele etmeyen bir tezgâh.' },
  { id: 'yemek', no: '04', baslik: 'Sabah Işığında Yemek Odası', konu: 'Mimari', sure: 5, yazar: 'Defne Aksoy', ozet: 'Kuzeye bakan bir pencere, tek uzun masa ve yalnızca gerekenler.' },
  { id: 'koleksiyon', no: '05', baslik: 'Az ama İyi: Koleksiyon Yapmak', konu: 'Sanat', sure: 9, yazar: 'Nehir Aras', ozet: 'İlk eserinizi almak için acele etmeyin; ikinciyi almak için daha da az.' },
]

export const ANA_MAKALE = [
  'Bir odaya girdiğinizde önce eşyaları değil, aralarındaki boşluğu hissedersiniz. Sessizlik böyle kurulur: duvarın ve masanın arasındaki elli santimetre, pencereyle koltuk arasındaki tek bir ışık çizgisi.',
  'Mimarlar buna “negatif alan” der; biz ise basitçe nefes payı. Cömert bir boşluk, bir mekâna sahip olduğunuz şeylerin çokluğunu değil, seçtiklerinizin kalitesini gösterir.',
  'Bu yüzden bir sayfayı tasarlarken de aynı soruyu sorarız: burada gerçekten neye ihtiyaç var? Cevap çoğu zaman bir başlık, iyi bir görsel ve doğru yerde bir satır metindir.',
]
