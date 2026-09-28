import type { SpriteAd } from './sprites'

export type Ton = 'kirmizi' | 'sari' | 'yesil' | 'camgobegi' | 'eflatun' | 'beyaz'

/** Kurgu turnuva: Jeton Kupası. Takımlar, sonuçlar ve oyuncular uydurmadır */
export interface Takim {
  id: string
  ad: string
  kisa: string
  sehir: string
  g: number
  m: number
  puan: number
  ton: Ton
}

export const TAKIMLAR: Takim[] = [
  { id: 'kzl', ad: 'Kızıl Piksel', kisa: 'KZL', sehir: 'İstanbul', g: 7, m: 1, puan: 2180, ton: 'kirmizi' },
  { id: 'sim', ad: 'Sekiz Bit Şimşek', kisa: 'ŞİM', sehir: 'İzmir', g: 6, m: 2, puan: 1990, ton: 'sari' },
  { id: 'yes', ad: 'Yeşil Ekran', kisa: 'YEŞ', sehir: 'Ankara', g: 6, m: 2, puan: 1875, ton: 'yesil' },
  { id: 'tar', ad: 'Tarama Çizgisi', kisa: 'TÇZ', sehir: 'Bursa', g: 5, m: 3, puan: 1640, ton: 'camgobegi' },
  { id: 'jet', ad: 'Son Jeton', kisa: 'JTN', sehir: 'Eskişehir', g: 4, m: 4, puan: 1420, ton: 'eflatun' },
  { id: 'kol', ad: 'Kırık Kol', kisa: 'KOL', sehir: 'Trabzon', g: 3, m: 5, puan: 1210, ton: 'beyaz' },
  { id: 'bal', ad: 'Balçık Kralları', kisa: 'BLÇ', sehir: 'Konya', g: 2, m: 6, puan: 980, ton: 'yesil' },
  { id: 'gec', ad: 'Gece Yarısı', kisa: 'GCY', sehir: 'Antalya', g: 1, m: 7, puan: 760, ton: 'kirmizi' },
]

/** Eleme ağacı: çeyrek final, yarı final, final. kazanan = üstteki (0) ya da alttaki (1) */
export interface Mac {
  a: string
  b: string
  sa: number
  sb: number
}
export const AGAC: { tur: string; maclar: Mac[] }[] = [
  {
    tur: 'Çeyrek final',
    maclar: [
      { a: 'kzl', b: 'gec', sa: 3, sb: 0 },
      { a: 'tar', b: 'jet', sa: 3, sb: 2 },
      { a: 'sim', b: 'bal', sa: 3, sb: 1 },
      { a: 'yes', b: 'kol', sa: 2, sb: 3 },
    ],
  },
  {
    tur: 'Yarı final',
    maclar: [
      { a: 'kzl', b: 'tar', sa: 3, sb: 1 },
      { a: 'sim', b: 'kol', sa: 3, sb: 2 },
    ],
  },
  { tur: 'Final', maclar: [{ a: 'kzl', b: 'sim', sa: 1, sb: 1 }] },
]

export type Nadirlik = 'siradan' | 'nadir' | 'destansi' | 'efsanevi'
export const NADIRLIK: Record<Nadirlik, { ad: string; ton: Ton; yildiz: number }> = {
  siradan: { ad: 'Sıradan', ton: 'beyaz', yildiz: 1 },
  nadir: { ad: 'Nadir', ton: 'camgobegi', yildiz: 2 },
  destansi: { ad: 'Destansı', ton: 'eflatun', yildiz: 3 },
  efsanevi: { ad: 'Efsanevi', ton: 'sari', yildiz: 4 },
}

export interface Esya {
  id: string
  ad: string
  sprite: SpriteAd
  nadirlik: Nadirlik
  aciklama: string
  guc?: string
  /** Madde 10 · Web3: zincir üstü kimlik (kurgu) */
  belirtec: string
}

export const ESYALAR: Esya[] = [
  { id: 'kilic', ad: 'Paslı Kılıç', sprite: 'kilic', nadirlik: 'siradan', aciklama: 'Köy demircisinden. Kesmekten çok ezer.', guc: 'SAL +4', belirtec: '0x0A1F' },
  { id: 'kalkan', ad: 'Mavi Kalkan', sprite: 'kalkan', nadirlik: 'nadir', aciklama: 'Kale muhafızlarının kalkanı. Oklara dayanır.', guc: 'SAV +6', belirtec: '0x0B72' },
  { id: 'iksir', ad: 'Can İksiri', sprite: 'iksir', nadirlik: 'siradan', aciklama: '30 can puanı geri verir. Tadı çilek.', guc: 'CAN +30', belirtec: '0x0C03' },
  { id: 'mana', ad: 'Mana İksiri', sprite: 'mana', nadirlik: 'siradan', aciklama: '20 mana puanı geri verir.', guc: 'MANA +20', belirtec: '0x0C04' },
  { id: 'anahtar', ad: 'Altın Anahtar', sprite: 'anahtar', nadirlik: 'nadir', aciklama: 'Zindanın dördüncü katındaki kapıyı açar.', belirtec: '0x0D19' },
  { id: 'mucevher', ad: 'Buz Mücevheri', sprite: 'mucevher', nadirlik: 'destansi', aciklama: 'Büyü hasarını yüzde 15 artırır.', guc: 'ZEK +8', belirtec: '0x0E88' },
  { id: 'yildiz', ad: 'Yenilmezlik Yıldızı', sprite: 'yildiz', nadirlik: 'efsanevi', aciklama: '10 saniye boyunca hasar almazsın.', belirtec: '0x0F01' },
  { id: 'kafatasi', ad: 'Lanetli Kafatası', sprite: 'kafatasi', nadirlik: 'destansi', aciklama: 'Düşmanları korkutur, seni de biraz.', guc: 'SAL +10 · CAN −5', belirtec: '0x0F66' },
]
