/**
 * Madde 9: yalnızca temel işlevleri anlatan, detaysız mikro ikonlar. 24×24 kutuda, tek çizgi, dolgusuz.
 * Çizgiler bilerek tam simetrik değildir: uçlar birkaç onda bir birim kayar.
 */
export interface Parca {
  d: string
}
const daire = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`

export const SIMGELER = {
  /* ── işlev ── */
  ok: [{ d: 'M4 12.2H19.6M14 6.4L19.8 12L14.2 17.8' }],
  sol: [{ d: 'M20 11.8H4.4M10 5.8L4.2 12L9.8 18.2' }],
  yukari: [{ d: 'M12.2 20V4.4M6.2 10L12 4.2L17.8 9.8' }],
  asagi: [{ d: 'M11.8 4V19.6M5.8 14L12 19.8L18.2 14.2' }],
  arti: [{ d: 'M12 4.4V19.8M4.2 12.2H19.6' }],
  eksi: [{ d: 'M4.4 12.2H19.8' }],
  kapat: [{ d: 'M5.6 5.4L18.4 18.8M18.6 5.2L5.2 18.6' }],
  tik: [{ d: 'M4.6 12.8L9.8 18L19.6 6.4' }],
  menu: [{ d: 'M4 8H20M4 16H15' }],
  ara: [{ d: daire(10.6, 10.4, 6.4) }, { d: 'M15.4 15.2L20 20' }],
  daire: [{ d: 'M15.2 4.8A8 8 0 1 0 19.4 10.6' }],
  nokta: [{ d: daire(12, 12, 1.4) }],
  oynat: [{ d: 'M8 5.2L19 12L8.2 18.8Z' }],
  duraklat: [{ d: 'M9 5V19M15.2 5.4V18.6' }],
  takvim: [{ d: 'M4.6 7.4H19.4V19.6H4.6Z' }, { d: 'M4.6 11.4H19.4M8.6 4.6V8.4M15.6 4.4V8.2' }],
  saat: [{ d: daire(12, 12, 8) }, { d: 'M12 7.4V12.4L15.4 14.2' }],
  posta: [{ d: 'M4 6.4H20.2V18H4Z' }, { d: 'M4.4 6.8L12.2 13L19.8 6.6' }],
  konum: [{ d: 'M12 20.4C8 15.4 6.4 12.8 6.4 10.2A5.6 5.6 0 0 1 17.6 10.2C17.6 12.8 16 15.4 12 20.4Z' }, { d: daire(12, 10, 1.8) }],
  sepet: [{ d: 'M4.6 8.4H19.4L18 19.4H6Z' }, { d: 'M8.6 8.4C8.6 3.8 15.4 3.8 15.4 8.4' }],
  /* ── temalı, yine yalın ── */
  yaprak: [{ d: 'M5 19C4 11 9.400 5.600 19.600 5C19.800 13.400 14.600 19 5 19Z' }, { d: 'M5 19L14 10' }],
  alev: [{ d: 'M12 20C7.600 20 6 16.400 7.400 13.200C8.400 11 10.400 9.400 11 4.800C15.200 8 17.800 11.400 16.800 15.400C16.400 18 14.400 20 12 20Z' }],
  fincan: [{ d: 'M5.400 8.600H16.600V15C16.600 17.600 14.800 19.400 11 19.400C7.200 19.400 5.400 17.600 5.400 15Z' }, { d: 'M16.600 10.400H18.200A2.400 2.400 0 0 1 18.200 15H16.400' }],
  vazo: [{ d: 'M10.400 4.400C10.800 6.800 9.400 7.600 8 10C6.400 12.800 6.800 16.600 9 19.400H15.200C17.600 16.400 17.200 12.400 15.600 10C14.400 8 13.400 6.800 13.800 4.400Z' }],
  tas: [{ d: 'M4.600 15.400C4.400 11.600 8 8.400 12.400 8.800C16.600 9.200 19.800 11.800 19.400 15.200C19 18 16 18.800 12 18.600C8 18.400 4.800 18.200 4.600 15.400Z' }],
  ay: [{ d: 'M19 14.600A7.600 7.600 0 1 1 9.400 5C11.800 5.800 13 7.800 13 10C13 13 15.800 15 19 14.600Z' }],
  gunes: [{ d: daire(12, 12, 4) }, { d: 'M12 3.400V5.600M12 18.400V20.600M3.400 12H5.600M18.400 12H20.600' }],
  goz: [{ d: 'M3.400 12C6 7.800 9 6.400 12 6.400C15 6.400 18 7.800 20.600 12C18 16.200 15 17.600 12 17.600C9 17.600 6 16.200 3.400 12Z' }, { d: daire(12, 12, 2.4) }],
} satisfies Record<string, Parca[]>

export type SimgeAd = keyof typeof SIMGELER

export const IKON_GRUPLARI: { ad: string; liste: SimgeAd[] }[] = [
  { ad: 'Yön', liste: ['ok', 'sol', 'yukari', 'asagi', 'menu'] },
  { ad: 'Eylem', liste: ['arti', 'eksi', 'kapat', 'tik', 'ara', 'oynat', 'duraklat'] },
  { ad: 'Bilgi', liste: ['takvim', 'saat', 'posta', 'konum', 'sepet', 'goz'] },
  { ad: 'Malzeme', liste: ['daire', 'nokta', 'yaprak', 'alev', 'fincan', 'vazo', 'tas', 'ay', 'gunes'] },
]

export const SIMGE_AD: Record<SimgeAd, string> = {
  ok: 'Sağa',
  sol: 'Sola',
  yukari: 'Yukarı',
  asagi: 'Aşağı',
  arti: 'Artı',
  eksi: 'Eksi',
  kapat: 'Kapat',
  tik: 'Onay',
  menu: 'Menü',
  ara: 'Ara',
  daire: 'Çember',
  nokta: 'Nokta',
  oynat: 'Başlat',
  duraklat: 'Duraklat',
  takvim: 'Takvim',
  saat: 'Saat',
  posta: 'Posta',
  konum: 'Konum',
  sepet: 'Sepet',
  yaprak: 'Yaprak',
  alev: 'Fırın',
  fincan: 'Fincan',
  vazo: 'Vazo',
  tas: 'Taş',
  ay: 'Ay',
  gunes: 'Güneş',
  goz: 'Göz',
}
