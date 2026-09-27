/** Madde 11: AI Model Selector verisi. Adlar kurgudur; değerler tanıtım içindir. */
export type Cap = 'akil' | 'arac' | 'gorsel' | 'kod' | 'uzun'
export type Where = 'bulut' | 'yerel'

export interface Model {
  id: string
  ad: string
  yer: Where
  /** Parametre sayısı (yerel modellerde) */
  boyut?: string
  nicem?: string
  /** GB, yalnız yerel */
  vram?: number
  baglam: number
  /** saniyede token */
  hiz: number
  yetenek: Cap[]
  not: string
}

export const MACHINE_VRAM = 24

export const CAPS: Record<Cap, { ad: string; uzun: string }> = {
  akil: { ad: 'Akıl yürütme', uzun: 'Çok adımlı plan ve gerekçe' },
  arac: { ad: 'Araç', uzun: 'Araç ve işlev çağırabilir; ajan için gerekli' },
  gorsel: { ad: 'Görsel', uzun: 'Görsel girdi okur' },
  kod: { ad: 'Kod', uzun: 'Kod yazar ve açıklar' },
  uzun: { ad: 'Uzun bağlam', uzun: '200 bin token ve üstü' },
}

export const MODELS: Model[] = [
  { id: 'korteks-ultra', ad: 'Korteks Ultra', yer: 'bulut', baglam: 1_000_000, hiz: 60, yetenek: ['akil', 'arac', 'gorsel', 'kod', 'uzun'], not: 'En yetenekli; uzun ajan görevleri' },
  { id: 'korteks-hizli', ad: 'Korteks Hızlı', yer: 'bulut', baglam: 200_000, hiz: 180, yetenek: ['arac', 'gorsel', 'kod', 'uzun'], not: 'Düşük gecikme; günlük işler' },
  { id: 'sinaps-kod', ad: 'Sinaps Kod', yer: 'bulut', baglam: 256_000, hiz: 95, yetenek: ['akil', 'arac', 'kod', 'uzun'], not: 'Kod tabanı ve veri hatları' },
  { id: 'akson-8b', ad: 'Akson 8B', yer: 'yerel', boyut: '8B', nicem: 'Q4', vram: 4.9, baglam: 128_000, hiz: 85, yetenek: ['arac', 'kod'], not: 'Cihazda kalır; hızlı ve hafif' },
  { id: 'akson-32b', ad: 'Akson 32B', yer: 'yerel', boyut: '32B', nicem: 'Q4', vram: 19.8, baglam: 32_000, hiz: 24, yetenek: ['akil', 'arac', 'kod'], not: 'Cihazda kalır; yavaş ama derin' },
  { id: 'retina-11b', ad: 'Retina 11B', yer: 'yerel', boyut: '11B', nicem: 'Q4', vram: 7.8, baglam: 16_000, hiz: 48, yetenek: ['gorsel'], not: 'Görsel etiketleme; araç çağıramaz' },
  { id: 'miyelin-3b', ad: 'Miyelin 3B', yer: 'yerel', boyut: '3B', nicem: 'Q8', vram: 3.4, baglam: 8_000, hiz: 150, yetenek: [], not: 'Özet ve sınıflandırma; araç çağıramaz' },
  { id: 'dendrit-70b', ad: 'Dendrit 70B', yer: 'yerel', boyut: '70B', nicem: 'Q4', vram: 42.5, baglam: 32_000, hiz: 9, yetenek: ['akil', 'arac', 'kod'], not: 'Çok GPU gerektirir' },
]

export const model = (id: string) => MODELS.find((m) => m.id === id) ?? MODELS[1]
export const fits = (m: Model) => m.vram === undefined || m.vram <= MACHINE_VRAM
export const canAgent = (m: Model) => m.yetenek.includes('arac')

export function ctxLabel(n: number) {
  return n >= 1_000_000 ? `${n / 1_000_000}M` : `${Math.round(n / 1000)}K`
}
