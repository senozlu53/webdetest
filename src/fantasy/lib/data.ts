import type { Kontrast, Tema } from './store'

/* ── Madde 4: palet ── */
export interface PaletDeger {
  ad: string
  zemin: string
  metin: string
  soluk: string
  altin: string
  altinYazi: string
  kan: string
  kanYazi: string
  mana: string
  manaYazi: string
  murekkep: string
  parsomen: string
  parsomenSoluk: string
  baslikParsomen: string
}
export function palet(t: Tema, k: Kontrast): PaletDeger {
  const y = k === 'yuksek'
  return {
    ad: t === 'zindan' ? 'Zindan' : 'Parşömen',
    zemin: t === 'zindan' ? '#1e1e24' : y ? '#f4ecd0' : '#e9ddb8',
    metin: y ? '#ffffff' : '#f4ecd8',
    soluk: y ? '#e8e2d0' : '#c9bfa8',
    altin: '#d4af37',
    altinYazi: y ? '#ffe07a' : '#e6c55a',
    kan: '#8b0000',
    kanYazi: y ? '#ffb3b3' : '#ff9c9c',
    mana: '#1e90ff',
    manaYazi: y ? '#a6d3ff' : '#7fbfff',
    murekkep: y ? '#000000' : '#2b1d0e',
    parsomen: y ? '#f4ecd0' : '#e9ddb8',
    parsomenSoluk: y ? '#2b1d0e' : '#33240f',
    baslikParsomen: y ? '#3d0000' : '#4d0c0c',
  }
}

/* ── Nadirlik ── */
export type Nadirlik = 'siradan' | 'ozel' | 'nadir' | 'epik' | 'efsanevi'
export const NADIRLIK: Record<Nadirlik, { ad: string; renk: string }> = {
  siradan: { ad: 'Sıradan', renk: '#bdb8ad' },
  ozel: { ad: 'Özel', renk: '#7bd88f' },
  nadir: { ad: 'Nadir', renk: '#7fbfff' },
  epik: { ad: 'Epik', renk: '#d2a9ff' },
  efsanevi: { ad: 'Efsanevi', renk: '#ffc94d' },
}

/* ── Simgeler (Madde 9) ── */
export type IkonAd = 'kilic' | 'kalkan' | 'iksir-kan' | 'iksir-mana' | 'parsomen' | 'sandik' | 'ates' | 'su' | 'toprak' | 'yildirim' | 'anahtar' | 'altin' | 'mucevher' | 'migfer' | 'kitap' | 'asa' | 'yay'
export const IKONLAR: { ad: IkonAd; anlam: string; grup: 'silah' | 'zirh' | 'iksir' | 'esya' | 'element' }[] = [
  { ad: 'kilic', anlam: 'Kılıç', grup: 'silah' },
  { ad: 'asa', anlam: 'Asa', grup: 'silah' },
  { ad: 'yay', anlam: 'Yay', grup: 'silah' },
  { ad: 'kalkan', anlam: 'Kalkan', grup: 'zirh' },
  { ad: 'migfer', anlam: 'Miğfer', grup: 'zirh' },
  { ad: 'iksir-kan', anlam: 'Can iksiri', grup: 'iksir' },
  { ad: 'iksir-mana', anlam: 'Mana iksiri', grup: 'iksir' },
  { ad: 'parsomen', anlam: 'Parşömen', grup: 'esya' },
  { ad: 'kitap', anlam: 'Büyü kitabı', grup: 'esya' },
  { ad: 'sandik', anlam: 'Sandık', grup: 'esya' },
  { ad: 'anahtar', anlam: 'Anahtar', grup: 'esya' },
  { ad: 'altin', anlam: 'Altın', grup: 'esya' },
  { ad: 'mucevher', anlam: 'Mücevher', grup: 'esya' },
  { ad: 'ates', anlam: 'Ateş', grup: 'element' },
  { ad: 'su', anlam: 'Su', grup: 'element' },
  { ad: 'toprak', anlam: 'Toprak', grup: 'element' },
  { ad: 'yildirim', anlam: 'Yıldırım', grup: 'element' },
]

/* ── Eşyalar (Madde 11) ── */
export type EsyaTip = 'silah' | 'zirh' | 'iksir' | 'parsomen' | 'malzeme'
export interface Esya {
  id: string
  ad: string
  tip: EsyaTip
  nadirlik: Nadirlik
  ikon: IkonAd
  adet: number
  aciklama: string
  deger: number
  istatistik: string[]
  etki?: { can?: number; mana?: number }
}
export const TIP_AD: Record<EsyaTip, string> = { silah: 'Silah', zirh: 'Zırh', iksir: 'İksir', parsomen: 'Parşömen', malzeme: 'Malzeme' }
export const ESYALAR: Esya[] = [
  { id: 'kul-kilici', ad: 'Kül Kılıcı', tip: 'silah', nadirlik: 'efsanevi', ikon: 'kilic', adet: 1, aciklama: 'Ejderha ateşinde dövülmüş, sapı kemikten. Her vuruşta kıvılcım saçar.', deger: 4200, istatistik: ['Saldırı +42', 'Kritik %8'] },
  { id: 'pul-kalkan', ad: 'Ejder Pulu Kalkanı', tip: 'zirh', nadirlik: 'epik', ikon: 'kalkan', adet: 1, aciklama: 'Yüzlerce ejder pulunun üst üste bindirilmesiyle yapılmış ağır bir kalkan.', deger: 2600, istatistik: ['Savunma +58', 'Ateş direnci %20'] },
  { id: 'kan-iksiri', ad: 'Kan İksiri', tip: 'iksir', nadirlik: 'siradan', ikon: 'iksir-kan', adet: 5, aciklama: 'Yarayı kapatır, nefesi düzeltir. İçmek bir saniye sürer.', deger: 40, istatistik: ['Can +40'], etki: { can: 40 } },
  { id: 'mana-iksiri', ad: 'Mana İksiri', tip: 'iksir', nadirlik: 'ozel', ikon: 'iksir-mana', adet: 3, aciklama: 'Yıldız suyundan damıtılmış mavi bir sıvı. Zihni berraklaştırır.', deger: 65, istatistik: ['Mana +30'], etki: { mana: 30 } },
  { id: 'kadim-parsomen', ad: 'Kadim Parşömen', tip: 'parsomen', nadirlik: 'nadir', ikon: 'parsomen', adet: 1, aciklama: 'Unutulmuş bir dilde yazılmış ışınlanma büyüsü. Bir kez okunur.', deger: 380, istatistik: ['Işınlanma'] },
  { id: 'demir-migfer', ad: 'Demir Miğfer', tip: 'zirh', nadirlik: 'siradan', ikon: 'migfer', adet: 1, aciklama: 'Kaba ama güvenilir. Kırmızı tüylü.', deger: 120, istatistik: ['Savunma +12'] },
  { id: 'simsek-asasi', ad: 'Yıldırım Asası', tip: 'silah', nadirlik: 'epik', ikon: 'asa', adet: 1, aciklama: 'Ucundaki mavi küre fırtına bulutlarını çeker.', deger: 2900, istatistik: ['Büyü gücü +38', 'Mana +20'] },
  { id: 'orman-yayi', ad: 'Orman Yayı', tip: 'silah', nadirlik: 'nadir', ikon: 'yay', adet: 1, aciklama: 'Yüz yıllık bir meşeden oyulmuş, kirişi peri saçından.', deger: 900, istatistik: ['Saldırı +24', 'Menzil +6'] },
  { id: 'altin-anahtar', ad: 'Altın Anahtar', tip: 'malzeme', nadirlik: 'ozel', ikon: 'anahtar', adet: 1, aciklama: 'Kilitli bir sandığı açar. Bir kullanımlık.', deger: 150, istatistik: ['Sandık açar'] },
  { id: 'alevli-tas', ad: 'Alevli Taş', tip: 'malzeme', nadirlik: 'ozel', ikon: 'ates', adet: 4, aciklama: 'İçinde sönmeyen bir kor taşıyan taş. Demirciler arar.', deger: 55, istatistik: ['Ateş özü'] },
  { id: 'buz-damlasi', ad: 'Buz Damlası', tip: 'malzeme', nadirlik: 'ozel', ikon: 'su', adet: 6, aciklama: 'Kuzey göllerinden toplanmış, hiç erimeyen bir damla.', deger: 45, istatistik: ['Su özü'] },
  { id: 'yildiz-mucevheri', ad: 'Yıldız Mücevheri', tip: 'malzeme', nadirlik: 'efsanevi', ikon: 'mucevher', adet: 1, aciklama: 'Gökten düşmüş bir yıldızın çekirdeği. Karanlıkta ışık verir.', deger: 3800, istatistik: ['Her silaha +1 yuva'] },
  { id: 'buyu-kitabi', ad: 'Büyü Kitabı', tip: 'parsomen', nadirlik: 'epik', ikon: 'kitap', adet: 1, aciklama: 'Kapağındaki yıldız kendiliğinden parlar. Üç büyü içerir.', deger: 1700, istatistik: ['Büyü +3'] },
  { id: 'toprak-kristali', ad: 'Toprak Kristali', tip: 'malzeme', nadirlik: 'siradan', ikon: 'toprak', adet: 9, aciklama: 'Dağ kaya çatlaklarında bulunan yeşilimsi bir kristal.', deger: 20, istatistik: ['Toprak özü'] },
  { id: 'firtina-ozu', ad: 'Fırtına Özü', tip: 'malzeme', nadirlik: 'nadir', ikon: 'yildirim', adet: 2, aciklama: 'Yıldırımın düştüğü yerde kalan sarı bir cam.', deger: 210, istatistik: ['Yıldırım özü'] },
  { id: 'altin-sikke', ad: 'Altın Sikke', tip: 'malzeme', nadirlik: 'siradan', ikon: 'altin', adet: 250, aciklama: 'Kadim Diyar’ın bütün hanlarında geçer.', deger: 1, istatistik: ['Para'] },
]
const bul = (id: string) => ESYALAR.find((e) => e.id === id)!
/** açılışta envanterdeki yerleşim (30 yuva) */
export const YERLESIM: Record<number, string> = {
  0: 'kul-kilici',
  1: 'pul-kalkan',
  2: 'kan-iksiri',
  3: 'mana-iksiri',
  4: 'kadim-parsomen',
  6: 'demir-migfer',
  7: 'simsek-asasi',
  8: 'orman-yayi',
  9: 'altin-anahtar',
  12: 'alevli-tas',
  13: 'buz-damlasi',
  14: 'yildiz-mucevheri',
  18: 'buyu-kitabi',
  19: 'toprak-kristali',
  20: 'firtina-ozu',
  24: 'altin-sikke',
}
export const ENV_BOYUT = 30
export const esyaOlustur = (id: string, adet?: number): Esya => ({ ...bul(id), adet: adet ?? bul(id).adet })
/** sandıktan çıkan ganimet: rastgele değil, sabit (test edilebilir) */
export const GANIMET: { id: string; adet: number }[] = [
  { id: 'kan-iksiri', adet: 2 },
  { id: 'yildiz-mucevheri', adet: 1 },
  { id: 'altin-sikke', adet: 120 },
]

/* ── Madde 10: sahneler ── */
export const OYUNLAR = [
  { id: 'o1', ad: 'Kadim Diyar', tur: 'MMORPG', platform: 'PC', yil: 2026, ozet: 'Ejderhaların uyandığı açık dünya. Yüz oyunculuk baskınlar, lonca savaşları.' },
  { id: 'o2', ad: 'Küllerin Yolu', tur: 'Aksiyon RPG', platform: 'Konsol', yil: 2024, ozet: 'Yanmış bir krallıkta tek başına yürüyüş. Zindan sürünmesi, ağır dövüş.' },
  { id: 'o3', ad: 'Rün Bekçisi', tur: 'Kart RPG', platform: 'Mobil', yil: 2023, ozet: 'Kadim rünlerle kurulan desteler. Haftalık sezonlar.' },
  { id: 'o4', ad: 'Gölgeli Vadi', tur: 'Taktik RPG', platform: 'PC', yil: 2022, ozet: 'Izgara üstünde sıra tabanlı savaş, geri dönüşsüz kararlar.' },
] as const
export const PLATFORMLAR = ['Hepsi', 'PC', 'Konsol', 'Mobil'] as const

export const BOLUMLER = [
  { no: 1, baslik: 'Kül ve Kor', metin: ['Vadi, yıllardır ilk kez sessizdi. Aldric kılıcını kınına soktu ve dağların ardındaki kızıl ışığa baktı; ejderhalar uyanıyordu.', 'Eski krallığın bütün çanları aynı anda çaldı. Kimse neden çaldıklarını bilmiyordu, ama herkes ayağa kalktı.'] },
  { no: 2, baslik: 'Sekiz Kapı', metin: ['Sur, sekiz kapıyla kapatılmıştı ve her kapının anahtarı ayrı bir loncadaydı. Anahtarları birleştirmek için önce birbirlerine güvenmeleri gerekiyordu.', 'Bekçi kadın, altın anahtarı avucunda tartarak güldü: “Güven, bir kılıçtan daha ağır taşınır.”'] },
  { no: 3, baslik: 'Yıldızın Çekirdeği', metin: ['Gökten düşen taş, gece boyunca vadiyi aydınlattı. Sabaha kadar kimse ona dokunmaya cesaret edemedi.', 'Büyücü çırağı elini uzattığında taşın içinden bir ses duydu: “Ben bir mücevher değilim. Ben bir sözüm.”'] },
] as const

export const SIRALAMA = [
  { ad: 'Kül Şövalyeleri', puan: 9840, uye: 84, sehir: 'Ankara' },
  { ad: 'Gölge Tahtı', puan: 9520, uye: 71, sehir: 'İstanbul' },
  { ad: 'Demir Kartallar', puan: 9105, uye: 96, sehir: 'İzmir' },
  { ad: 'Rün Bekçileri', puan: 8760, uye: 58, sehir: 'Bursa' },
  { ad: 'Kuzey Kurtları', puan: 8420, uye: 66, sehir: 'Erzurum' },
  { ad: 'Kızıl Kalkan', puan: 8090, uye: 49, sehir: 'Adana' },
] as const

export const SINIFLAR = [
  { id: 'sovalye', ad: 'Şövalye', ikon: 'kilic' as IkonAd, rol: 'Ön safta savunma', guc: 78, buyu: 20, hiz: 40 },
  { id: 'buyucu', ad: 'Büyücü', ikon: 'asa' as IkonAd, rol: 'Uzaktan büyü hasarı', guc: 25, buyu: 95, hiz: 55 },
  { id: 'okcu', ad: 'Okçu', ikon: 'yay' as IkonAd, rol: 'Menzilli hızlı saldırı', guc: 55, buyu: 35, hiz: 90 },
  { id: 'sifaci', ad: 'Şifacı', ikon: 'kitap' as IkonAd, rol: 'İyileştirme ve destek', guc: 30, buyu: 80, hiz: 50 },
] as const
export const SURUMLER = [
  { id: 'standart', ad: 'Standart', fiyat: 599 },
  { id: 'kahraman', ad: 'Kahraman', fiyat: 899 },
  { id: 'efsane', ad: 'Efsane', fiyat: 1299 },
] as const
export const LANSMAN_TARIHI = '2026-11-21T18:00:00+03:00'

/* ── Madde 11 · 14: bileşen özellikleri ── */
export const PROPLAR: { bilesen: string; ad: string; tip: string; varsayilan: string; aciklama: string }[] = [
  { bilesen: '<InventoryGrid>', ad: 'yuvalar', tip: '(Esya | null)[]', varsayilan: '—', aciklama: 'Yuvaları ızgarada gösterir; kapsayıcıya göre sütun sayısı ve yuva boyu küçülür' },
  { bilesen: '<InventoryGrid>', ad: 'secili · onSec', tip: 'number | null · fn', varsayilan: 'null', aciklama: 'Seçili yuva; ok tuşları, Home, End, Enter ile de sürülür' },
  { bilesen: '<InventoryGrid>', ad: 'onTasi', tip: '(a, b) => void', varsayilan: '—', aciklama: 'Sürükle-bırak ya da klavyeyle "Taşı" modu: iki yuvanın yerini değiştirir' },
  { bilesen: '<HealthBar>', ad: 'deger · azami', tip: 'number', varsayilan: '—', aciklama: 'Doluluk; aria-valuenow / aria-valuemax; dolgu 500 ms, hasar izi 1,2 sn içinde yetişir' },
  { bilesen: '<HealthBar>', ad: 'tur', tip: '"can" | "mana" | "deneyim"', varsayilan: '"can"', aciklama: 'Kan kırmızısı, mana mavisi ya da altın dolgu' },
  { bilesen: '<FantasyModal>', ad: 'acik · onAcikDegisti', tip: 'boolean · fn', varsayilan: '—', aciklama: 'Parşömen açılış efektli iletişim kutusu; odak tuzağı, Esc ile kapanır' },
  { bilesen: '<FantasyModal>', ad: 'baslik · aciklama', tip: 'string', varsayilan: '—', aciklama: 'Ekran okuyucuya okunan ad ve açıklama' },
  { bilesen: '<Panel>', ad: 'yuzey', tip: '"tas" | "parsomen" | "deri" | "metal" | "ahsap"', varsayilan: '"tas"', aciklama: 'Doku ve metin renkleri; dört köşede filigree süsü (sadeleşince kapanır)' },
]

/* ── Madde 12 · 13: Figma ── */
export const FIGMA_TOKENLAR = [
  { ad: 'Color/FantasyGold', deger: '#D4AF37', tip: 'color' },
  { ad: 'Color/DungeonStone', deger: '#1E1E24', tip: 'color' },
  { ad: 'Color/BloodRed', deger: '#8B0000', tip: 'color' },
  { ad: 'Color/ManaBlue', deger: '#1E90FF', tip: 'color' },
  { ad: 'Texture/Parchment', deger: 'SVG fractalNoise 0,018 · 4 oktav · %42 kahve leke + %24 ince tane', tip: 'texture' },
  { ad: 'Effects/MagicGlow', deger: '0 0 12px 2px rgba(212, 175, 55, 0.55)', tip: 'effect' },
  { ad: 'Effects/InnerShadow', deger: 'inset 0 0 10px rgba(0, 0, 0, 0.8)', tip: 'effect' },
] as const

export const CSS_SATIRI = 'border-4 border-[#D4AF37] bg-[#1E1E24] shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]'
