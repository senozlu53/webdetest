import type { Tema } from './store'

/** Tema başına yüzey ve yazı renkleri (contrast hesapları için; CSS ile birebir aynı) */
export const TEMA_RENK: Record<
  Tema,
  {
    zemin: string
    panel: string
    metin: string
    soluk: string
    zeytin: string
    altin: string
    gul: string
    dokRenk: string
    dokA: number
  }
> = {
  parsomen: {
    zemin: '#F1E6CF',
    panel: '#FBF6E8',
    metin: '#1B2347',
    soluk: '#4E5169',
    zeytin: '#46601A',
    altin: '#7A5A17',
    gul: '#8B4A2E',
    dokRenk: '#8A6A2F',
    dokA: 0.2,
  },
  zeytin: {
    zemin: '#E4E8CF',
    panel: '#F6F7E9',
    metin: '#1B2347',
    soluk: '#464C52',
    zeytin: '#46601A',
    altin: '#7A5A17',
    gul: '#8B4A2E',
    dokRenk: '#47601A',
    dokA: 0.2,
  },
  gece: {
    zemin: '#141A36',
    panel: '#1E2650',
    metin: '#F1E6CF',
    soluk: '#C2C0D4',
    zeytin: '#A9C078',
    altin: '#DCBB7D',
    gul: '#E8B99A',
    dokRenk: '#DCBB7D',
    dokA: 0.13,
  },
}

/** Madde 4 · 13: tanım renkleri */
export const RENKLER = [
  {
    ad: 'Soluk Zeytin Yeşili',
    token: 'Color/NouveauSage',
    hex: '#6B8E23',
    css: '--nv-sage',
    rol: 'Sarmaşık gövdesi, yaprak dolgusu, odak ve seçili işaretleri',
    yazi: '#46601A',
    yaziAd: 'Zeytin (yazı)',
  },
  {
    ad: 'Antik Altın',
    token: 'Color/AntiqueGold',
    hex: '#C5A059',
    css: '--nv-gold',
    rol: 'Çerçeve konturu, dalgalı ayraç, kıvrım ucu',
    yazi: '#7A5A17',
    yaziAd: 'Altın (yazı)',
  },
  {
    ad: 'Kirli Gül',
    token: 'Color/DustyRose',
    hex: '#D8A47F',
    css: '--nv-gul',
    rol: 'Taç yaprak, üst üste binen çerçeve katmanı, vurgu dolgusu',
    yazi: '#8B4A2E',
    yaziAd: 'Gül (yazı)',
  },
  {
    ad: 'Gece Laciverti',
    token: 'Color/NightIndigo',
    hex: '#1B2347',
    css: '--nv-gece',
    rol: 'Mürekkep (metin), düğme dolgusu, gece teması zemini',
    yazi: '#1B2347',
    yaziAd: 'Mürekkep (yazı)',
  },
] as const

export const DOKU_AD = {
  parsomen: 'Parşömen',
  cicek: 'Preslenmiş çiçek',
  duvar: 'Antika duvar kâğıdı',
} as const

export interface Eser {
  no: string
  ad: string
  yil: string
  sanatci: string
  sahne: 'nilufer' | 'sarmasik' | 'zambak' | 'sac' | 'pavus'
  aciklama: string
  salon: string
}
export const ESERLER: Eser[] = [
  {
    no: '01',
    ad: 'Nilüfer Havuzu',
    yil: '1899',
    sanatci: 'Ada Vuyk',
    sahne: 'nilufer',
    salon: 'Salon 2 · Su',
    aciklama: 'Suyun dalga çizgisi, taç yaprağın eğrisiyle aynı ritimde. Yaprakların kenarı hiçbir yerde düz değil.',
  },
  {
    no: '02',
    ad: 'Sarmaşık Dalı',
    yil: '1903',
    sanatci: 'Erol Bayram',
    sahne: 'sarmasik',
    salon: 'Salon 1 · Duvar',
    aciklama: 'Tek bir dal, bütün kompozisyonu çaprazlayarak taşır. Uçtaki kıvrımlar kamçı eğrisinin en saf örneği.',
  },
  {
    no: '03',
    ad: 'Zambak Demeti',
    yil: '1897',
    sanatci: 'Lale Sarıgül',
    sahne: 'zambak',
    salon: 'Salon 3 · Cam',
    aciklama: 'Üç sap, üç ayrı eğim. Simetri bilerek bozulmuş: çiçekler farklı yüksekliklerde, farklı yönlere bakıyor.',
  },
  {
    no: '04',
    ad: 'Akan Saçlar',
    yil: '1905',
    sanatci: 'Mira Kandemir',
    sahne: 'sac',
    salon: 'Salon 4 · Afiş',
    aciklama: 'Saç telleri halkayı aşar ve yeniden kıvrılır. Plakat sanatının en tanınan motifi: çerçeveye sığmayan çizgi.',
  },
  {
    no: '05',
    ad: 'Tavus Kuşu Tüyü',
    yil: '1901',
    sanatci: 'Nedim Ateş',
    sahne: 'pavus',
    salon: 'Salon 2 · Su',
    aciklama: 'Göz motifinin dalgalı halkaları, tüy telleriyle iç içe. Altın çizgi burada süs değil, iskelet.',
  },
]

export interface Lot {
  no: string
  ad: string
  donem: string
  durum: string
  fiyat: number
  sahne: Eser['sahne']
  tohum: number
  not: string
}
export const LOTLAR: Lot[] = [
  {
    no: 'Lot 14',
    ad: 'Zambaklı vitray lamba',
    donem: '1902 · Nancy',
    durum: 'Orijinal, bir yaprak onarılmış',
    fiyat: 84500,
    sahne: 'zambak',
    tohum: 4,
    not: 'Kurşun çıtaları özgün. Zeytin yeşili camda ince kabarcıklar var; bu bir kusur değil, üretim izi.',
  },
  {
    no: 'Lot 22',
    ad: 'Sarmaşık saplı ayna',
    donem: '1899 · Viyana',
    durum: 'Çok iyi',
    fiyat: 46200,
    sahne: 'sarmasik',
    tohum: 6,
    not: 'Altın varak çerçeve, sap kıvrımı tek parça döküm. Arka ahşap yenilenmiş.',
  },
  {
    no: 'Lot 31',
    ad: 'Pavus tüylü gümüş broş',
    donem: '1905 · Brüksel',
    durum: 'İyi, emaye kenarında küçük çıkık',
    fiyat: 18900,
    sahne: 'pavus',
    tohum: 8,
    not: 'Emaye eski usul (cloisonné). İğne ve kanca özgün, sertifikalı.',
  },
  {
    no: 'Lot 38',
    ad: 'Nilüfer vazo',
    donem: '1900 · Paris',
    durum: 'Kusursuz',
    fiyat: 122000,
    sahne: 'nilufer',
    tohum: 9,
    not: 'İmzalı. Cam içine gömülü altın tozu, ışığa tutulunca dalga dalga görünür.',
  },
]

export const NOTALAR = {
  ust: {
    ad: 'Üst nota',
    ogeler: ['Bergamot', 'Yeşil incir yaprağı', 'Nilüfer'],
    sure: 'İlk 20 dakika',
    sahne: 'nilufer' as const,
  },
  kalp: {
    ad: 'Kalp notası',
    ogeler: ['Sarmaşık', 'Süsen kökü', 'Kirli gül'],
    sure: '1–4 saat',
    sahne: 'sarmasik' as const,
  },
  dip: {
    ad: 'Dip nota',
    ogeler: ['Sedir', 'Amber', 'Vetiver'],
    sure: '5 saatten fazla',
    sahne: 'zambak' as const,
  },
}
export const BOYLAR = [
  { id: '30', ad: '30 ml', fiyat: 2400 },
  { id: '50', ad: '50 ml', fiyat: 3600 },
  { id: '100', ad: '100 ml', fiyat: 5900 },
] as const

export const MOTIFLER = ['Sarmaşık', 'Zambak', 'Nilüfer', 'Tavus kuşu', 'Akan saç', 'Kamçı'] as const
export const ESER_TURLERI = ['Vitray panel', 'Duvar kâğıdı', 'Mücevher', 'Afiş ve plakat', 'Mobilya kabartması'] as const
