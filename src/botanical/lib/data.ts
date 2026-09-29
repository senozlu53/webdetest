import type { Tema } from './store'
import type { SahneAd } from '../components/Gorsel'
import type { SimgeAd } from './simge'

/** Tema başına yüzey ve yazı renkleri (contrast hesapları için; CSS ile birebir aynı) */
export const TEMA_RENK: Record<Tema, { zemin: string; yuzey: string; yuzey2: string; metin: string; soluk: string; zeytinYazi: string; kilYazi: string; dokRenk: string; dokA: number }> = {
  keten: { zemin: '#F4EEE1', yuzey: '#FBF8F1', yuzey2: '#EBE1CD', metin: '#2F4F4F', soluk: '#4A5F5C', zeytinYazi: '#556B2F', kilYazi: '#9A4530', dokRenk: '#8B6F47', dokA: 0.12 },
  toprak: { zemin: '#D2B48C', yuzey: '#E9DBC0', yuzey2: '#DFC9A4', metin: '#1C2E2E', soluk: '#2F4A47', zeytinYazi: '#3D4F1E', kilYazi: '#63301D', dokRenk: '#6D5330', dokA: 0.14 },
  orman: { zemin: '#1F3535', yuzey: '#2F4F4F', yuzey2: '#284343', metin: '#F4EEE1', soluk: '#C9D2C4', zeytinYazi: '#BDD186', kilYazi: '#F0B5A0', dokRenk: '#D2B48C', dokA: 0.07 },
}

/** Madde 4 · 13: tanım renkleri ve yazıda güvenli türevleri */
export const RENKLER = [
  { ad: 'Kil Kırmızısı', token: 'Color/TerracottaPrimary', hex: '#C86D51', rol: 'Vurgu dolgusu, büyük ve kalın düğme yazısı, rozet. Küçük yazıda kullanılmaz (3,2:1)', yazi: '#9A4530', yaziAd: 'Derin kil (yazı)', tonlar: ['#F0CBBB', '#E3A48F', '#C86D51', '#9A4530', '#6F2F1F'] },
  { ad: 'Zeytin Yeşili', token: 'Color/OliveSurface', hex: '#556B2F', rol: 'Yüzey, seçili durum, kaydırıcı dolgusu. Keten üstünde yazı olarak da yeterli (5,1:1)', yazi: '#556B2F', yaziAd: 'Aynı renk (yazı)', tonlar: ['#DDE3C6', '#B9C68F', '#8A9E5B', '#556B2F', '#3D4F20'] },
  { ad: 'Toprak Beji', token: 'Color/EarthBeige', hex: '#D2B48C', rol: 'Yüzey ve zemin. Üstünde orman yeşili yazı 4,5:1, derin kömür 6,8:1', yazi: '#7A5B32', yaziAd: 'Koyu toprak (yazı)', tonlar: ['#F3E9D6', '#E8D6B8', '#D2B48C', '#A98A5F', '#7A5B32'] },
  { ad: 'Koyu Orman Yeşili', token: 'Color/ForestInk', hex: '#2F4F4F', rol: 'Metin, düğme dolgusu, Orman temasının yüzeyi. Keten üstünde 7,7:1', yazi: '#2F4F4F', yaziAd: 'Aynı renk (yazı)', tonlar: ['#DCE5E3', '#9BB3AF', '#5C7C7A', '#2F4F4F', '#1F3535'] },
] as const

export const DOKU_AD = { keten: 'Keten', kraft: 'Kraft kâğıt', toprak: 'Toprak tanesi' } as const

/* ── Organik pazar ── */
export type KatId = 'tumu' | 'yag' | 'bal' | 'ot' | 'sebze' | 'sabun' | 'fidan'
export const KATEGORILER: { id: KatId; ad: string; ikon: SimgeAd }[] = [
  { id: 'tumu', ad: 'Tümü', ikon: 'sepet' },
  { id: 'yag', ad: 'Zeytinyağı', ikon: 'damla' },
  { id: 'bal', ad: 'Bal', ikon: 'ari' },
  { id: 'ot', ad: 'Otlar', ikon: 'yaprak' },
  { id: 'sebze', ad: 'Sebze', ikon: 'toprak' },
  { id: 'sabun', ad: 'Kozmetik', ikon: 'kavanoz' },
  { id: 'fidan', ad: 'Fidan', ikon: 'filiz' },
]
export interface Urun {
  id: string
  maske: 'yaprak' | 'damla' | 'tas' | 'dalga'
  ad: string
  kat: Exclude<KatId, 'tumu'>
  fiyat: number
  birim: string
  sahne: SahneAd
  yerel: boolean
  rozet?: string
  aciklama: string
}
export const URUNLER: Urun[] = [
  { id: 'zy-500', maske: 'yaprak', ad: 'Soğuk sıkım zeytinyağı', kat: 'yag', fiyat: 420, birim: '500 ml', sahne: 'yag', yerel: true, rozet: 'Yeni hasat', aciklama: 'Ayvalık memleci, ilk 4 saatte sıkıldı, cam şişede.' },
  { id: 'zy-erken', maske: 'tas', ad: 'Erken hasat zeytinyağı', kat: 'yag', fiyat: 310, birim: '250 ml', sahne: 'zeytin', yerel: true, aciklama: 'Acı ve baharatlı, polifenolü yüksek.' },
  { id: 'bal-cicek', maske: 'tas', ad: 'Çiçek balı', kat: 'bal', fiyat: 310, birim: '450 g', sahne: 'bal', yerel: true, rozet: 'Süzülmemiş', aciklama: 'Kaz Dağları yaylasından, ısıtılmadan.' },
  { id: 'bal-kara', maske: 'dalga', ad: 'Karakovan balı', kat: 'bal', fiyat: 480, birim: '250 g', sahne: 'bal', yerel: false, aciklama: 'Petekli, yılda bir hasat.' },
  { id: 'ot-kekik', maske: 'yaprak', ad: 'Dağ kekiği', kat: 'ot', fiyat: 85, birim: '40 g', sahne: 'ot', yerel: true, aciklama: 'Gölgede kurutuldu, elle ayıklandı.' },
  { id: 'ot-nane', maske: 'damla', ad: 'Nane ve adaçayı karışımı', kat: 'ot', fiyat: 70, birim: '60 g', sahne: 'ot', yerel: true, aciklama: 'Kâğıt zarfta, plastiksiz.' },
  { id: 'sb-domates', maske: 'dalga', ad: 'Bahçe domatesi', kat: 'sebze', fiyat: 140, birim: '2 kg', sahne: 'sebze', yerel: true, rozet: 'Bu hafta', aciklama: 'Sulama dışında müdahalesiz, sabah toplandı.' },
  { id: 'sb-kutu', maske: 'tas', ad: 'Mevsim sebze kutusu', kat: 'sebze', fiyat: 260, birim: '5 kg', sahne: 'sebze', yerel: true, aciklama: 'Yedi çeşit, kraft kutuda.' },
  { id: 'sp-zeytin', maske: 'damla', ad: 'Zeytinyağlı sabun', kat: 'sabun', fiyat: 195, birim: '3 adet', sahne: 'sabun', yerel: true, aciklama: 'Soğuk yöntemle, kokusuz ve palm yağsız.' },
  { id: 'fd-set', maske: 'dalga', ad: 'Fidan seti', kat: 'fidan', fiyat: 260, birim: '3 saksı', sahne: 'fidan', yerel: false, aciklama: 'Fesleğen, nane, kekik; çürüyen saksıda.' },
]
export const ucretsizKargo = 600

/* ── Kozmetik ── */
export type CiltId = 'kuru' | 'karma' | 'yagli' | 'hassas'
export const CILTLER: { id: CiltId; ad: string; oneri: string; urun: string; not: string; sahne: SahneAd }[] = [
  { id: 'kuru', ad: 'Kuru', urun: 'Zeytin ve shea nemlendirici', not: 'Zeytinyağı ve shea yağı bariyeri güçlendirir. Akşamları ince bir kat yeter.', oneri: 'Yoğun nem', sahne: 'yag' },
  { id: 'karma', ad: 'Karma', urun: 'Aloe ve yeşil çay jeli', not: 'T bölgesini yağlandırmadan nemlendirir. Sabah ve akşam nohut tanesi kadar.', oneri: 'Dengeli nem', sahne: 'fidan' },
  { id: 'yagli', ad: 'Yağlı', urun: 'Kil ve nane temizleyici', not: 'Kil fazla yağı emer, nane ferahlatır. Haftada iki kez maske olarak da.', oneri: 'Arındırıcı', sahne: 'ot' },
  { id: 'hassas', ad: 'Hassas', urun: 'Yulaf ve papatya kremi', not: 'Kokusuz, uçucu yağsız. Önce kolun iç yüzünde deneyin.', oneri: 'Yatıştırıcı', sahne: 'bal' },
]
export const ICERIK = [
  { ad: 'Aloe vera suyu', yuzde: 62, kaynak: 'Muğla, organik sertifikalı seralar', ne: 'Nem ve yatıştırma' },
  { ad: 'Soğuk sıkım zeytinyağı', yuzde: 14, kaynak: 'Ayvalık, kendi zeytinliğimiz', ne: 'Bariyer ve yumuşaklık' },
  { ad: 'Shea yağı', yuzde: 8, kaynak: 'Gana, adil ticaret kooperatifi', ne: 'Yoğun besleme' },
  { ad: 'Kayısı çekirdeği yağı', yuzde: 6, kaynak: 'Malatya', ne: 'Hafif doku' },
  { ad: 'Bitkisel gliserin', yuzde: 5, kaynak: 'Palm yağsız', ne: 'Nem tutucu' },
  { ad: 'E vitamini', yuzde: 2, kaynak: 'Ayçiçeğinden', ne: 'Doğal koruyucu' },
  { ad: 'Lavanta uçucu yağı', yuzde: 1.5, kaynak: 'Isparta', ne: 'Koku' },
  { ad: 'Kalan (sentetik koruyucu yok)', yuzde: 1.5, kaynak: 'Tuz ve bitkisel emülgatör', ne: 'Denge' },
] as const
export const ROZETLER: { ikon: SimgeAd; ad: string; ac: string }[] = [
  { ikon: 'kalkan', ad: 'Organik sertifikalı', ac: 'Bağımsız kuruluşça yılda iki kez denetlenir.' },
  { ikon: 'dongu', ad: 'Dolum istasyonu', ac: 'Boş şişeyi getirin, %20 indirimle doldurun.' },
  { ikon: 'damla', ad: 'Su tasarruflu', ac: 'Üretimde su geri kazanılır.' },
  { ikon: 'ari', ad: 'Hayvan deneyi yok', ac: 'Hiçbir aşamada.' },
]

/* ── Ekolojik tarım ── */
export const PARSELLER = [
  { id: 'zeytinlik', ad: 'Zeytinlik', ikon: 'agac' as SimgeAd, taban: 34, hedef: [28, 45] as const },
  { id: 'bahce', ad: 'Sebze bahçesi', ikon: 'toprak' as SimgeAd, taban: 20, hedef: [35, 55] as const },
  { id: 'fidanlik', ad: 'Fidanlık', ikon: 'filiz' as SimgeAd, taban: 46, hedef: [50, 70] as const },
  { id: 'kovan', ad: 'Bal ormanı', ikon: 'ari' as SimgeAd, taban: 40, hedef: [30, 50] as const },
]
export const AYLAR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
/** E: ekim, H: hasat */
export const TAKVIM: { ad: string; ikon: SimgeAd; ay: string }[] = [
  { ad: 'Domates', ikon: 'sepet', ay: '..EEE.HHHH..' },
  { ad: 'Zeytin', ikon: 'agac', ay: '.........HHH' },
  { ad: 'Ispanak', ikon: 'yaprak', ay: 'HHEE....EEHH' },
  { ad: 'Bal', ikon: 'ari', ay: '....HH.H....' },
  { ad: 'Kekik', ikon: 'filiz', ay: '..EE.HHH.H..' },
]
export const KUTULAR = [
  { id: 'kucuk', ad: 'Küçük', kg: 4, fiyat: 290, kisi: '1–2 kişi' },
  { id: 'orta', ad: 'Orta', kg: 6, fiyat: 420, kisi: '2–3 kişi' },
  { id: 'buyuk', ad: 'Büyük', kg: 9, fiyat: 590, kisi: '4+ kişi' },
] as const
export const EKLER = [
  { id: 'yumurta', ad: 'Gezen tavuk yumurtası (10 adet)', fiyat: 90 },
  { id: 'bal', ad: 'Çiçek balı (450 g)', fiyat: 120 },
  { id: 'ekmek', ad: 'Ekşi mayalı ekmek', fiyat: 60 },
] as const

/* ── Doğa turizmi ── */
export interface Rota {
  id: string
  ad: string
  bolge: string
  km: number
  sure: string
  zorluk: 1 | 2 | 3
  tirmanis: number
  fiyat: number
  sahne: SahneAd
  profil: number[]
  ozet: string
}
export const ROTALAR: Rota[] = [
  { id: 'kaz', ad: 'Kaz Dağları patikası', bolge: 'Balıkesir', km: 12.4, sure: '5 saat', zorluk: 2, tirmanis: 640, fiyat: 450, sahne: 'vadi', profil: [10, 14, 26, 38, 52, 66, 60, 74, 88, 70, 52, 34, 22], ozet: 'Kızılçam ormanından yayla göletine; rehber eşliğinde, çöp bırakmadan.' },
  { id: 'salda', ad: 'Salda kıyı yürüyüşü', bolge: 'Burdur', km: 6.8, sure: '2,5 saat', zorluk: 1, tirmanis: 120, fiyat: 320, sahne: 'vadi', profil: [30, 32, 30, 34, 38, 36, 40, 38, 34, 32, 30, 30, 28], ozet: 'Beyaz kumsalda sakin bir yürüyüş; yerel kooperatifte öğle yemeği.' },
  { id: 'kamp', ad: 'Zeytinlikte kamp gecesi', bolge: 'Ayvalık', km: 9.1, sure: '2 gün', zorluk: 2, tirmanis: 310, fiyat: 650, sahne: 'kamp', profil: [8, 12, 20, 34, 30, 44, 56, 50, 62, 58, 46, 30, 18], ozet: 'Yüz yıllık ağaçların altında çadır, sofrada kendi yağımız, gökyüzünde yıldızlar.' },
]
export const CADIR_UCRETI = 350
