import type { Vurgu } from './store'

/* ── Madde 4: palet ── */
export const KARBON = '#0d0e12'
export const VURGULAR: { id: Vurgu; ad: string; hex: string; yazi: string; rgb: string; rol: string }[] = [
  { id: 'mavi', ad: 'Elektrik Mavisi', hex: '#00f0ff', yazi: '#00f0ff', rgb: '0 240 255', rol: 'Birincil vurgu, canlı, bağlantı' },
  { id: 'lime', ad: 'Neon Lime Yeşili', hex: '#39ff14', yazi: '#39ff14', rgb: '57 255 20', rol: 'Galibiyet, ikincil vurgu, şerit' },
  { id: 'turuncu', ad: 'Agresif Turuncu', hex: '#ff4500', yazi: '#ff8f5f', rgb: '255 69 0', rol: 'Uyarı, mağlubiyet, geri sayım' },
]

/** Sayfa değişkenleri ile birebir aynı: kontrast tablosu ve varyant kartları bunu okur */
export function palet(y: boolean) {
  return {
    zemin: KARBON,
    metin: y ? '#ffffff' : '#f2f6fa',
    soluk: y ? '#e6edf5' : '#b4c0cf',
    mavi: '#00f0ff',
    lime: '#39ff14',
    turuncu: '#ff4500',
    turuncuYazi: '#ff8f5f',
  }
}

/* ── Madde 9: simgeler ── */
export type IkonAd = 'nisangah' | 'kalkan' | 'fuze' | 'drone' | 'radar' | 'mermi' | 'zirh' | 'simsek' | 'kupa' | 'kumanda' | 'kulaklik' | 'monitor' | 'islemci' | 'yayin' | 'rutbe' | 'granat'
export const IKONLAR: { ad: IkonAd; anlam: string; grup: 'silah' | 'savunma' | 'teknik' | 'oyun' }[] = [
  { ad: 'nisangah', anlam: 'Nişangâh', grup: 'silah' },
  { ad: 'fuze', anlam: 'Füze', grup: 'silah' },
  { ad: 'mermi', anlam: 'Mermi', grup: 'silah' },
  { ad: 'granat', anlam: 'El bombası', grup: 'silah' },
  { ad: 'kalkan', anlam: 'Kalkan', grup: 'savunma' },
  { ad: 'zirh', anlam: 'Zırh', grup: 'savunma' },
  { ad: 'radar', anlam: 'Radar', grup: 'savunma' },
  { ad: 'drone', anlam: 'Keşif dronu', grup: 'savunma' },
  { ad: 'islemci', anlam: 'İşlemci', grup: 'teknik' },
  { ad: 'monitor', anlam: 'Monitör', grup: 'teknik' },
  { ad: 'yayin', anlam: 'Yayın', grup: 'teknik' },
  { ad: 'simsek', anlam: 'Hız', grup: 'teknik' },
  { ad: 'kumanda', anlam: 'Kumanda', grup: 'oyun' },
  { ad: 'kulaklik', anlam: 'Kulaklık', grup: 'oyun' },
  { ad: 'kupa', anlam: 'Kupa', grup: 'oyun' },
  { ad: 'rutbe', anlam: 'Rütbe', grup: 'oyun' },
]

/* ── Madde 10 · 11: veri ── */
export interface Takim {
  id: string
  ad: string
  kisa: string
  g: number
  m: number
  kd: number
  seri: string
  sehir: string
}
export const TAKIMLAR: Takim[] = [
  { id: 'v9', ad: 'Vektör-9', kisa: 'V9', g: 14, m: 3, kd: 1.62, seri: 'G5', sehir: 'İstanbul' },
  { id: 'ks', ad: 'Kutup Şoku', kisa: 'KŞ', g: 13, m: 4, kd: 1.48, seri: 'G2', sehir: 'Erzurum' },
  { id: 'ksn', ad: 'Kızıl Sinyal', kisa: 'KS', g: 12, m: 5, kd: 1.41, seri: 'M1', sehir: 'Ankara' },
  { id: 'n0', ad: 'Nöbetçi-0', kisa: 'N0', g: 11, m: 6, kd: 1.27, seri: 'G3', sehir: 'İzmir' },
  { id: 'cf', ad: 'Çelik Fırtına', kisa: 'ÇF', g: 9, m: 8, kd: 1.09, seri: 'M2', sehir: 'Bursa' },
  { id: 'gh', ad: 'Gölge Hattı', kisa: 'GH', g: 8, m: 9, kd: 0.98, seri: 'G1', sehir: 'Adana' },
  { id: 'ac', ad: 'Ateş Çemberi', kisa: 'AÇ', g: 6, m: 11, kd: 0.87, seri: 'M4', sehir: 'Konya' },
  { id: 'mo', ad: 'Merkez Osu', kisa: 'MO', g: 3, m: 14, kd: 0.71, seri: 'M6', sehir: 'Eskişehir' },
]
export const puanOf = (t: Takim) => t.g * 3

export type MacDurum = 'bitti' | 'canli' | 'yakinda'
export interface Mac {
  id: string
  gun: string
  saat: string
  a: string
  b: string
  skor?: [number, number]
  durum: MacDurum
  tur: string
}
export const MACLAR: Mac[] = [
  { id: 'm1', gun: 'Cuma', saat: '17:00', a: 'Kutup Şoku', b: 'Çelik Fırtına', skor: [2, 0], durum: 'bitti', tur: 'Grup · Bo3' },
  { id: 'm2', gun: 'Cuma', saat: '19:30', a: 'Kızıl Sinyal', b: 'Nöbetçi-0', skor: [1, 2], durum: 'bitti', tur: 'Grup · Bo3' },
  { id: 'm3', gun: 'Cuma', saat: '21:30', a: 'Vektör-9', b: 'Gölge Hattı', skor: [1, 1], durum: 'canli', tur: 'Grup · Bo3' },
  { id: 'm4', gun: 'Cumartesi', saat: '17:00', a: 'Ateş Çemberi', b: 'Merkez Osu', durum: 'yakinda', tur: 'Grup · Bo3' },
  { id: 'm5', gun: 'Cumartesi', saat: '20:00', a: 'Nöbetçi-0', b: 'Kutup Şoku', durum: 'yakinda', tur: 'Yarı final · Bo5' },
  { id: 'm6', gun: 'Pazar', saat: '20:00', a: 'Finalistler', b: 'Finalistler', durum: 'yakinda', tur: 'Büyük final · Bo5' },
]
export const DURUM_AD: Record<MacDurum, string> = { bitti: 'Bitti', canli: 'Canlı', yakinda: 'Yakında' }

export const OYUNCULAR: { nick: string; rol: string; kd: number; ikon: IkonAd; not: string }[] = [
  { nick: 'RAZOR', rol: 'Öncü', kd: 1.84, ikon: 'nisangah', not: 'İlk temas, ilk raunt. Ortalama 22 saniyede ilk öldürme.' },
  { nick: 'NULLPOINT', rol: 'Nişancı', kd: 2.1, ikon: 'fuze', not: 'Uzun menzil. Kafa isabeti oranı %61.' },
  { nick: 'KAOS', rol: 'Destek', kd: 1.12, ikon: 'kalkan', not: 'Takımın en çok asist yapan oyuncusu.' },
  { nick: 'VOLT', rol: 'Kontrol', kd: 1.36, ikon: 'radar', not: 'Harita kontrolü ve bilgi. Raunt başına 3,4 keşif.' },
  { nick: 'ŞAHİN', rol: 'Lider', kd: 1.51, ikon: 'rutbe', not: 'Oyun içi lider. Son iki sezonda %72 kazanma.' },
]
export const ROLLER = ['Hepsi', 'Öncü', 'Nişancı', 'Destek', 'Kontrol', 'Lider'] as const

export const KLIPLER: { id: string; baslik: string; sure: string; tur: string; izlenme: number }[] = [
  { id: 'k1', baslik: '1v4 son raunt', sure: '0:38', tur: 'Clutch', izlenme: 184200 },
  { id: 'k2', baslik: 'Duvar ardından üçlü', sure: '0:22', tur: 'Ace', izlenme: 96400 },
  { id: 'k3', baslik: 'Dron ile kapan', sure: '0:31', tur: 'Taktik', izlenme: 61800 },
  { id: 'k4', baslik: 'Havada çift isabet', sure: '0:12', tur: 'Ace', izlenme: 143900 },
  { id: 'k5', baslik: 'Son saniye kurulum', sure: '0:27', tur: 'Clutch', izlenme: 75300 },
  { id: 'k6', baslik: 'Sessiz yaklaşma', sure: '0:45', tur: 'Taktik', izlenme: 42100 },
]
export const KLIP_TURLERI = ['Hepsi', 'Ace', 'Clutch', 'Taktik'] as const

export const SOHBET: { kim: string; metin: string }[] = [
  { kim: 'kutupAyisi', metin: 'ilk raundu nasıl aldılar!' },
  { kim: 'cikolatalikedi', metin: 'V9 bugün çok sakin oynuyor' },
  { kim: 'nullfan_61', metin: 'NULLPOINT kafa kafa kafa' },
  { kim: 'ankaraliDemir', metin: 'Gölge Hattı geri geldi, izleyin' },
  { kim: 'hizliParmak', metin: 'yayın kalitesi 1440p60 çok temiz' },
  { kim: 'lagAvcisi', metin: 'bu harita onlara göre' },
  { kim: 'ismiYok42', metin: 'skor 1–1, karar raundu geliyor' },
  { kim: 'ArtikRefleks', metin: 'ŞAHİN çağrısı yerinde' },
  { kim: 'gecekusu', metin: 'yarın yarı final, bilet aldım' },
  { kim: 'fpsKralı', metin: 'ne kadar hızlı bir el' },
]
export const OZEL_SOHBET = 'Bu yayın bir simülasyondur: harici oynatıcı yüklenmez, sohbet yazılı senaryodan gelir.'

export const HIZLI_SKOR: { a: string; b: string; s: string; durum: MacDurum }[] = [
  { a: 'KŞ', b: 'ÇF', s: '2–0', durum: 'bitti' },
  { a: 'KS', b: 'N0', s: '1–2', durum: 'bitti' },
  { a: 'V9', b: 'GH', s: '1–1', durum: 'canli' },
  { a: 'AÇ', b: 'MO', s: '17:00', durum: 'yakinda' },
  { a: 'N0', b: 'KŞ', s: '20:00', durum: 'yakinda' },
  { a: 'V9', b: 'KS', s: '3–1', durum: 'bitti' },
]

export const SURUM = { ad: 'Vektör X1 Pro', dpi: [400, 26000] as const }

/* ── Madde 11 · 14: bileşen özellikleri ── */
export const PROPLAR: { bilesen: string; ad: string; tip: string; varsayilan: string; aciklama: string }[] = [
  { bilesen: '<EsportsCard>', ad: 'kesim', tip: '"kose" | "egik" | "duz"', varsayilan: '"kose"', aciklama: 'Köşe: 45° kesik iki köşe. Eğik: sağ kenar eğik, sol kenarda neon şerit. Düz: kesim yok' },
  { bilesen: '<EsportsCard>', ad: 'vurgu', tip: '"mavi" | "lime" | "turuncu"', varsayilan: 'sayfa vurgusu', aciklama: 'Kartın neon rengi; verilmezse sayfa vurgusunu izler' },
  { bilesen: '<EsportsCard>', ad: 'yuzey', tip: '"karbon" | "celik" | "plastik"', varsayilan: '"karbon"', aciklama: 'Karbon fiber, fırçalanmış çelik ya da mat siyah plastik; metin renkleri yüzeye göre değişir' },
  { bilesen: '<EsportsCard>', ad: 'parlama', tip: 'boolean', varsayilan: 'true', aciklama: 'Kesik kenarı izleyen neon parlama ve keskin köşeli dış gölge' },
  { bilesen: '<SlantedButton>', ad: 'ton', tip: '"birincil" | "ikincil" | "turuncu" | "hayalet"', varsayilan: '"ikincil"', aciklama: 'Üzerine gelince ya da odaklanınca sağa doğru kayan neon dilim (skew slide)' },
  { bilesen: '<SlantedButton>', ad: 'egim', tip: 'number (derece)', varsayilan: '12', aciklama: 'Düğmenin eğimi; yazı ters yönde eğilir ve düz okunur' },
  { bilesen: '<LeaderboardTable>', ad: 'takimlar', tip: 'Takim[]', varsayilan: '—', aciklama: 'Sıra, takım, galibiyet, K/D, puan; sütun başlığına basınca sıralanır (aria-sort)' },
  { bilesen: '<LeaderboardTable>', ad: 'canli', tip: 'boolean', varsayilan: 'false', aciklama: 'Açıkken puanlar birkaç saniyede bir güncellenir ve satır yanıp söner; durdurulabilir' },
]

/* ── Madde 12 · 13: Figma ── */
export const FIGMA_TOKENLAR = [
  { ad: 'Color/EsportsNeonGreen', deger: '#39FF14', tip: 'color' },
  { ad: 'Color/CarbonBlack', deger: '#0D0E12', tip: 'color' },
  { ad: 'Color/ElectricBlue', deger: '#00F0FF', tip: 'color' },
  { ad: 'Color/AggressiveOrange', deger: '#FF4500', tip: 'color' },
  { ad: 'Texture/CarbonFiber', deger: 'SVG 12 × 12 çapraz örgü · #0D0E12 zemin, #141720 kare, #1B1F27 parlak iplik', tip: 'texture' },
  { ad: 'Shape/SlantedCard', deger: 'polygon(0 0, 100% 0, calc(100% − 16px) 100%, 0 100%)', tip: 'shape' },
  { ad: 'Effects/NeonGlow', deger: '0 0 12px rgba(0, 240, 255, 0.5)', tip: 'effect' },
  { ad: 'Effects/HardShadow', deger: '6px 6px 0 rgba(0, 0, 0, 0.55)', tip: 'effect' },
] as const

export const CSS_SATIRI = '[clip-path:polygon(0_0,100%_0,95%_100%,0%_100%)] bg-[#0D0E12] border-l-4 border-[#39FF14]'
export const CSS_KURALI = 'clip-path: polygon(0 0, 100% 0, 95% 100%, 0% 100%);'
