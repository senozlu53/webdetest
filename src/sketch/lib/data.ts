import type { IkonAd } from '../components/Icons'

/** Kırık Fincan menüsü (kurgu). Fiyatlar TL: seçilen fontlarda ₺ glifi yok */
export interface Urun {
  id: string
  ad: string
  not: string
  fiyat: number
  ikon: IkonAd
  icecek: boolean
}
export const MENU: Urun[] = [
  { id: 'filtre', ad: 'Filtre kahve', not: 'V60, haftanın çekirdeği: Etiyopya Guji', fiyat: 85, ikon: 'fincan', icecek: true },
  { id: 'cortado', ad: 'Cortado', not: 'çift shot, yarım buhar sütü', fiyat: 95, ikon: 'cekirdek', icecek: true },
  { id: 'latte', ad: 'Portakal kabuklu latte', not: 'evde kurutulmuş kabuk, tarçın', fiyat: 110, ikon: 'gunes', icecek: true },
  { id: 'cold', ad: 'Cold brew', not: '18 saat soğuk demleme, buzla', fiyat: 105, ikon: 'bardak', icecek: true },
  { id: 'kurabiye', ad: 'Kakaolu kurabiye', not: 'yarım kalmış çikolata parçaları', fiyat: 55, ikon: 'kalp', icecek: false },
  { id: 'rulo', ad: 'Tarçınlı rulo', not: 'sabah 7’de fırından', fiyat: 70, ikon: 'yaprak', icecek: false },
]
export const EKSTRA = { shot: 20, yulaf: 15 }
export const BOY: Record<string, { ad: string; ek: number }> = { k: { ad: 'Küçük', ek: 0 }, o: { ad: 'Orta', ek: 10 }, b: { ad: 'Büyük', ek: 20 } }

/** Ece Kaya'nın portfolyosu (kurgu) */
export interface Proje {
  id: string
  ad: string
  ozet: string
  tur: 'uygulama' | 'web' | 'tasarim'
  etiket: string[]
  yil: number
  ikon: IkonAd
}
export const PROJELER: Proje[] = [
  { id: 'nota', ad: 'Nota', ozet: 'Yalnız klavyeyle çalışan sade not defteri. Her not tek dosya.', tur: 'uygulama', etiket: ['React', 'SQLite'], yil: 2025, ikon: 'kalem' },
  { id: 'kum', ad: 'Kum Saati', ozet: 'Odak zamanlayıcı: süre bitince kum yerine kâğıt yaprak düşer.', tur: 'uygulama', etiket: ['Swift'], yil: 2024, ikon: 'ampul' },
  { id: 'harita', ad: 'Harita Çizgisi', ozet: 'Yürüyüş rotalarını elle çizilmiş haritaya döken web sitesi.', tur: 'web', etiket: ['TypeScript', 'MapLibre'], yil: 2025, ikon: 'ev' },
  { id: 'tohum', ad: 'Tohum', ozet: 'Bitki bakım takvimi; sulama günü gelince yaprağı kıvrılır.', tur: 'uygulama', etiket: ['Rust', 'Tauri'], yil: 2023, ikon: 'yaprak' },
  { id: 'fincan', ad: 'Kırık Fincan sitesi', ozet: 'Bu sayfa: butik kahvecinin çizgili defteri.', tur: 'web', etiket: ['React', 'rough.js'], yil: 2026, ikon: 'fincan' },
  { id: 'harf', ad: 'Defter Harfleri', ozet: 'Kendi el yazımdan 240 karakterlik yazı tipi denemesi.', tur: 'tasarim', etiket: ['Glyphs'], yil: 2024, ikon: 'kitap' },
]

export const MAKALE = {
  baslik: 'Neden hâlâ elle çiziyorum?',
  yazar: 'Ece Kaya',
  tarih: '14 Eylül',
  sure: '4 dk okuma',
}
