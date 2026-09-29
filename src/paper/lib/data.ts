import type { SimgeAd } from './simge'

/** Kâğıt Orman (kurgu): geri dönüşümlü kâğıttan çocuk kitapları ve kırtasiye */
export interface Urun {
  id: string
  ad: string
  not: string
  fiyat: number
  simge: SimgeAd
  renk: string
  grup: 'ofis' | 'ev' | 'bahce'
  tasarruf: number // kg CO₂
}
export const URUNLER: Urun[] = [
  { id: 'defter', ad: 'Ağaçsız defter', not: '%100 geri dönüşümlü, 96 sayfa, dikişli', fiyat: 95, simge: 'kutu', renk: 'var(--gunes)', grup: 'ofis', tasarruf: 1.2 },
  { id: 'kalem', ad: 'Tohumlu kalem', not: 'bitince toprağa dik: fesleğen çıkar', fiyat: 35, simge: 'yaprak', renk: 'var(--yaprak)', grup: 'bahce', tasarruf: 0.3 },
  { id: 'canta', ad: 'Bez alışveriş çantası', not: 'organik pamuk, iki sap', fiyat: 140, simge: 'sepet', renk: 'var(--pembe)', grup: 'ev', tasarruf: 2.4 },
  { id: 'kutu', ad: 'Karton oyun kutusu', not: 'kes-katla-oyna, suluboya boyalı', fiyat: 120, simge: 'agac', renk: 'var(--turkuaz)', grup: 'ev', tasarruf: 0.9 },
  { id: 'kart', ad: 'Kabartma kart seti', not: '12 kart, tohum kâğıdı zarf', fiyat: 60, simge: 'zarf', renk: 'var(--leylak)', grup: 'ofis', tasarruf: 0.5 },
  { id: 'kitap', ad: 'Minik Ayı kitabı', not: 'katman katman kesilmiş, 32 sayfa', fiyat: 185, simge: 'ayi', renk: 'var(--mercan)', grup: 'ev', tasarruf: 1.6 },
]

export interface Bolum {
  baslik: string
  metin: string
}
/** Minik Ayı ve Kayıp Nehir (kurgu) */
export const BOLUMLER: Bolum[] = [
  { baslik: 'Sabah', metin: 'Minik Ayı bir sabah uyanır ve dere yatağını kupkuru bulur. Nehir nereye gitti?' },
  { baslik: 'Yolculuk', metin: 'Dağların ardına yürür. Her tepe bir kâğıt daha katlanır, gökyüzü bir ton açılır.' },
  { baslik: 'Kaynak', metin: 'Kaynakta bir yığın atık suyu tıkamıştır. Kuş, balık ve ayı birlikte ayıklar.' },
  { baslik: 'Nehir', metin: 'Su yeniden akar. Ayı ilk kez ayaklarını kâğıt dalgalara sokar ve gülümser.' },
]
