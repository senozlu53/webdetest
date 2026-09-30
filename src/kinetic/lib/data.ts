import type { Kontrast, Tema, Vurgu } from './store'

/** CSS'teki paletle birebir aynı (kontrast hesabı için) */
export interface Palet {
  zemin: string
  metin: string
  soluk: string
  kontrol: string
  hat: string
  vurgu: string
  vurguYazi: string
  vurguUzeri: string
}
export function palet(tema: Tema, vurgu: Vurgu, kontrast: Kontrast): Palet {
  const y = kontrast === 'yuksek'
  if (tema === 'kara') {
    return {
      zemin: '#000000',
      metin: '#ffffff',
      soluk: y ? '#d4d4d4' : '#a3a3a3',
      kontrol: y ? '#d4d4d4' : '#8a8a8a',
      hat: y ? '#8a8a8a' : '#2b2b2b',
      vurgu: vurgu === 'asit' ? '#ccff00' : y ? '#ff6060' : '#ff3b3b',
      vurguYazi: vurgu === 'asit' ? '#ccff00' : y ? '#ff6060' : '#ff3b3b',
      vurguUzeri: '#000000',
    }
  }
  return {
    zemin: '#ffffff',
    metin: '#000000',
    soluk: y ? '#262626' : '#525252',
    kontrol: y ? '#404040' : '#757575',
    hat: y ? '#737373' : '#d4d4d4',
    vurgu: vurgu === 'asit' ? '#ccff00' : y ? '#b00000' : '#d40000',
    vurguYazi: vurgu === 'asit' ? (y ? '#2c4200' : '#3d5a00') : y ? '#b00000' : '#d40000',
    vurguUzeri: vurgu === 'asit' ? '#000000' : '#ffffff',
  }
}

/* ── Madde 3 ── */
export const KARAKTER = [
  { ad: 'Hareket odaklı', metin: 'Metin durmaz. Kaydırırsınız, hızlanır; durursunuz, soluk alır.' },
  { ad: 'Akışkan geçiş', metin: 'Bir biçimden ötekine sıçrama yok; ağırlık, eğim ve boy birlikte akar.' },
  { ad: 'Doğrudan kelimeye', metin: 'Görsel yok, kutu yok. Göz yalnız kelimeye gider.' },
  { ad: 'Minimal', metin: 'Siyah, beyaz ve tek bir neon. Gölge, doku ve ikon yok.' },
  { ad: 'Cüretkar', metin: 'Harf ekranı doldurur; sığmayan kelime küçülür, kaçmaz.' },
] as const

export const PROMPT = 'Kinetic typography web design, motion-driven text headers, massive dynamic fonts, high contrast black and white, interactive scroll typography.'

/* ── Madde 10 · Portfolyo ── */
export const PROJELER = [
  { id: 'gurultu', ad: 'Gürültü', yil: 2025, rol: 'Sergi grafikleri', not: 'Ses dalgasını harf yüksekliğine çeviren üç kanallı bir yerleştirme; ziyaretçinin sesi başlığı büyütür.' },
  { id: 'esik', ad: 'Eşik', yil: 2025, rol: 'Sinema jeneriği', not: 'Jenerik kayarken satırlar ekranın iki yanından ters yönde akar ve kesişimde tek kelimeye dönüşür.' },
  { id: 'nabiz', ad: 'Nabız', yil: 2024, rol: 'Müzik festivali kimliği', not: 'Kimliğin tek öğesi bir yazı tipi: davulun her vuruşunda ağırlığı 400 ile 800 arasında gider gelir.' },
  { id: 'sapma', ad: 'Sapma', yil: 2024, rol: 'Web sitesi', not: 'Kaydırma hızı arttıkça sayfadaki tüm başlıklar sağa yatar; durunca geri doğrulur.' },
  { id: 'dongu', ad: 'Döngü', yil: 2023, rol: 'İnteraktif poster', not: 'Bir poster, bir cümle. İmleci çekince kelimeler ağırlaşır, bırakınca sarılır.' },
  { id: 'kesik', ad: 'Kesik', yil: 2023, rol: 'Sanat kitabı', not: 'Her sayfada başlık yatay dilimlere bölünür; sayfayı çevirdikçe dilimler hizalanır.' },
] as const

/* ── Madde 10 · Albüm ── */
export const PARCALAR = [
  { ad: 'Sinyal', sure: 214, bpm: 128 },
  { ad: 'Gürültü', sure: 187, bpm: 140 },
  { ad: 'Boşluk', sure: 243, bpm: 96 },
  { ad: 'Kesinti', sure: 176, bpm: 152 },
  { ad: 'Tekrar', sure: 259, bpm: 110 },
] as const
export const SOZ = ['SİNYAL', 'GELİYOR', 'DUY', 'BİRAZ', 'DAHA', 'YÜKSEK', 'KES', 'SESİ', 'AÇ', 'TEKRAR', 'TEKRAR', 'SİNYAL'] as const

/* ── Madde 10 · Ajans ── */
export const HIZMETLER = [
  { ad: 'Hareketli kimlik', yon: 1 as const, hiz: 90 },
  { ad: 'Etkileşimli poster', yon: -1 as const, hiz: 140 },
  { ad: 'Web ve gösteri', yon: 1 as const, hiz: 60 },
] as const
export const RAKAMLAR = [
  { ad: 'Yayındaki proje', deger: 128 },
  { ad: 'Ülke', deger: 17 },
  { ad: 'Ödül', deger: 23 },
  { ad: 'Kare/sn', deger: 60 },
] as const
export const BUTCELER = ['50 bin ₺ altı', '50–150 bin ₺', '150–500 bin ₺', '500 bin ₺ üstü']

/* ── Madde 10 · Poster ── */
export const POSTER_SATIRLAR = [['SESİ', 'AÇ'], ['HER', 'HARF'], ['BİR', 'HAREKET'], ['DURMA'], ['AKIŞ', 'BU']] as const

/* ── Madde 11 · 14 ── */
export const PROPLAR: { bilesen: string; ad: string; tip: string; varsayilan: string; aciklama: string }[] = [
  { bilesen: '<KineticHeader>', ad: 'satirlar', tip: 'SatirTanim[]', varsayilan: '—', aciklama: 'Her satır: metin, efekt (dalga, imlec, z), kontur, vurgu. Satırlar kaydırmayla zıt yönlere kayar' },
  { bilesen: '<KineticHeader>', ad: 'as', tip: '"h1" | "h2"', varsayilan: '"h1"', aciklama: 'Başlık düzeyi; ekran okuyucu metni bir kez ve bütün okur' },
  { bilesen: '<MarqueeText>', ad: 'metin', tip: 'string', varsayilan: '—', aciklama: 'Şeritte akan metin; hareket kapalıyken satır atlayarak durağan görünür' },
  { bilesen: '<MarqueeText>', ad: 'hiz', tip: 'number (px/sn)', varsayilan: '100', aciklama: 'Taban hız; Animation/TextSpeed* tokenları 40 · 100 · 240' },
  { bilesen: '<MarqueeText>', ad: 'yon', tip: '1 | −1', varsayilan: '1', aciklama: '1 sola, −1 sağa akar' },
  { bilesen: '<MarqueeText>', ad: 'tepki', tip: 'boolean', varsayilan: 'true', aciklama: 'Kaydırma hızıyla hızlanır, yukarı kaydırınca ters döner' },
  { bilesen: '<MarqueeText>', ad: 'durHover', tip: 'boolean', varsayilan: 'true', aciklama: 'Üzerine gelince ya da odaklanınca durur' },
  { bilesen: '<ImlecBaslik>', ad: 'metin · alt', tip: 'string', varsayilan: '—', aciklama: 'İmleci yaylı gecikmeyle izleyen dev başlık; çizgi katmanı daha geriden gelir' },
  { bilesen: '<KatmanMetin>', ad: 'katman · aralik', tip: 'number', varsayilan: '8 · 40', aciklama: 'Z ekseninde kopya sayısı ve aralığı (px)' },
  { bilesen: '<Harfler>', ad: 'efekt', tip: '("dalga" | "imlec" | "z")[]', varsayilan: '[]', aciklama: 'Harf hareketleri; hareket kapalıyken hiçbiri çalışmaz' },
]

/* ── Madde 12 · 13 ── */
export const FIGMA_DURUMLARI = [
  { id: 'static', ad: 'Static', not: 'Hareket yok; son kare. Okuma ve yazdırma için.' },
  { id: 'animating', ad: 'Animating', not: 'Harfler dalgalanır, zaman tabanlı.' },
  { id: 'hover', ad: 'Hover', not: 'İmleç yakın: ağırlık 800, vurgu rengi.' },
] as const
export const HIZ_TOKENLARI = [
  { id: 'yavas', ad: 'Animation/TextSpeedSlow', px: 40 },
  { id: 'normal', ad: 'Animation/TextSpeedNormal', px: 100 },
  { id: 'hizli', ad: 'Animation/TextSpeedFast', px: 240 },
] as const

/* ── Madde 15 ── */
export const TAILWIND_SINIF = 'font-extrabold tracking-tighter uppercase transition-transform duration-300'

/* ── Madde 12 hareket dili tablosu ── */
export const HAREKET_TABLOSU = [
  ['Kaydırma hızı → eğim', 'skewX ±14°', '±3000 px/sn', 'yaylı (damping 50, stiffness 400)'],
  ['Kaydırma hızı → esneme', 'scaleX 1 → 1,12', '±3000 px/sn', 'aynı yay'],
  ['Kaydırma hızı → şerit', 'taban × (1 + 4 · |v| / 1000)', 'en çok ×5', 'yön işaretle çevrilir'],
  ['Kaydırma ilerlemesi → kayma', 'x 0 → ∓%16', 'bölüm boyunca', 'doğrusal'],
  ['Zaman → dalga', 'sin(2,4 t + 0,62 i)', '0,075 em', 'hız çarpanıyla'],
  ['İmleç → ağırlık', '500 → 800', '150 px yarıçap', 'harf başına yumuşatma 0,16'],
]
