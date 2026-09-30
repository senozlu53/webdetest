/** Madde 9: özel vektör seti */
export const IKONLAR = ['kafatasi', 'zincir', 'muhur', 'hac', 'mum', 'kemer', 'mizrak', 'kilit', 'anahtar', 'kitap', 'kuzgun', 'damla', 'hancer', 'can', 'ay', 'tabut'] as const
export type IkonAd = (typeof IKONLAR)[number]

export const IKON_ADI: Record<IkonAd, string> = {
  kafatasi: 'Kafatası',
  zincir: 'Zincir',
  muhur: 'Mühür',
  hac: 'Haç',
  mum: 'Mum',
  kemer: 'Kemer',
  mizrak: 'Mızrak',
  kilit: 'Kilit',
  anahtar: 'Anahtar',
  kitap: 'Kitap',
  kuzgun: 'Kuzgun',
  damla: 'Kan damlası',
  hancer: 'Hançer',
  can: 'Çan',
  ay: 'Ay',
  tabut: 'Tabut',
}
