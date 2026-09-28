/**
 * Madde 9: 16×16 sprite'lar. Her satır 16 karakter, her karakter paletteki bir renk; '.' saydam.
 * Madde 3 · 4: sınırlı palet. Ekranda aynı anda 16 renk (arcade kartının renk tablosu gibi).
 * Çizimler 1× tuvale basılır ve PNG olur; büyütme her zaman en yakın komşu (image-rendering: pixelated).
 */
export const PALET = {
  k: '#000000',
  w: '#FFFFFF',
  a: '#7F7F7F',
  d: '#3F3F3F',
  r: '#FF0000',
  R: '#7F0000',
  o: '#FF8000',
  y: '#FFEA00',
  Y: '#7F7500',
  g: '#00FF00',
  G: '#007F00',
  c: '#00FFFF',
  C: '#007F7F',
  b: '#2040FF',
  m: '#FF00FF',
  s: '#FFBF80',
} as const
export type PaletKod = keyof typeof PALET

export const PALET_AD: Record<PaletKod, string> = {
  k: 'Siyah',
  w: 'Beyaz',
  a: 'Gri',
  d: 'Koyu gri',
  r: 'Kırmızı',
  R: 'Bordo',
  o: 'Turuncu',
  y: 'Atari sarısı',
  Y: 'Zeytin',
  g: 'Saf yeşil',
  G: 'Koyu yeşil',
  c: 'Camgöbeği',
  C: 'Petrol',
  b: 'Mavi',
  m: 'Eflatun',
  s: 'Ten',
}

export type Cizim = readonly string[]

const kalp: Cizim = [
  '................',
  '..kkkk....kkkk..',
  '.krrrrk..krrrrk.',
  'krrwwrrkkrrrrrRk',
  'krrwrrrrrrrrrrRk',
  'krrrrrrrrrrrrrRk',
  'krrrrrrrrrrrrrRk',
  '.krrrrrrrrrrrRk.',
  '..krrrrrrrrrRk..',
  '...krrrrrrrRk...',
  '....krrrrrRk....',
  '.....krrrRk.....',
  '......krRk......',
  '.......kk.......',
  '................',
  '................',
]

const kilic: Cizim = [
  '............kkk.',
  '...........kwwk.',
  '..........kwwak.',
  '.........kwwak..',
  '........kwwak...',
  '.......kwwak....',
  '..kk..kwwak.....',
  '..kyk.kwak......',
  '...kykwak.......',
  '....kyak........',
  '...kakyyk.......',
  '..kok.kyyk......',
  '.kook..kk.......',
  '.kkk............',
  '................',
  '................',
]

const kalkan: Cizim = [
  '................',
  '..kkkkkkkkkkkk..',
  '..kaaaaaaaaaak..',
  '..kabbbbybbbak..',
  '..kabbbbybbbak..',
  '..kabbbbybbbak..',
  '..kayyyyyyyyak..',
  '..kabbbbybbbak..',
  '..kabbbbybbbak..',
  '...kabbbybbak...',
  '...kabbbybbak...',
  '....kabbybak....',
  '.....kabbak.....',
  '......kaak......',
  '.......kk.......',
  '................',
]

const iksir: Cizim = [
  '................',
  '......kkkk......',
  '......kook......',
  '......kkkk......',
  '......kwak......',
  '......kwak......',
  '.....kkrrkk.....',
  '....kwrrrrrk....',
  '...kwrrrrrrrk...',
  '...krrrrrrrrk...',
  '...krrrrrrrrk...',
  '...kRrrrrrrRk...',
  '....kRRRRRRk....',
  '.....kkkkkk.....',
  '................',
  '................',
]

const anahtar: Cizim = [
  '................',
  '................',
  '................',
  '..kkkk..........',
  '.kyyyyk.........',
  'kyykkyyk........',
  'kyk..kykkkkkkkk.',
  'kyk..kyyyyyyyyyk',
  'kyykkyykkkykykk.',
  '.kyyyyk...kYkYk.',
  '..kkkk.....k.k..',
  '................',
  '................',
  '................',
  '................',
  '................',
]

const mucevher: Cizim = [
  '................',
  '................',
  '....kkkkkkkk....',
  '...kcwcccccCk...',
  '..kcwcccccccCk..',
  '.kkkkkkkkkkkkkk.',
  '.kwccccccccccCk.',
  '..kwcccccccCCk..',
  '...kwcccccCCk...',
  '....kwcccCCk....',
  '.....kwcCCk.....',
  '......kcCk......',
  '.......kk.......',
  '................',
  '................',
  '................',
]

const kafatasi: Cizim = [
  '................',
  '.....kkkkkk.....',
  '....kwwwwwwk....',
  '...kwwwwwwwwk...',
  '..kwwwwwwwwwwk..',
  '..kwkkkwwkkkwk..',
  '..kwkkkwwkkkwk..',
  '..kwwwwkkwwwwk..',
  '..kawwwkkwwwak..',
  '...kawwwwwwak...',
  '....kwkwkwkwk...',
  '....kwkwkwkwk...',
  '.....kkkkkkk....',
  '................',
  '................',
  '................',
]

const yildiz: Cizim = [
  '................',
  '.......kk.......',
  '......kyyk......',
  '......kyyk......',
  '.....kyyyyk.....',
  'kkkkkkyyyykkkkkk',
  'kyyyyyyyyyyyyyYk',
  '.kyyyyyyyyyyyYk.',
  '..kyyyyyyyyyYk..',
  '...kyyyyyyyYk...',
  '...kyyyyyyyYk...',
  '..kyyyykkyyyYk..',
  '..kyyyk..kyyYk..',
  '.kyyk......kYYk.',
  '.kkk........kkk.',
  '................',
]

const sandik: Cizim = [
  '................',
  '................',
  '................',
  '..kkkkkkkkkkkk..',
  '.kooooooooooook.',
  '.koRRRRRRRRRRok.',
  '.kooooooooooook.',
  '.kkkkkkyykkkkkk.',
  '.kooooykkyooook.',
  '.kooooykkyooook.',
  '.kooooyyyyooook.',
  '.kRRRRRRRRRRRRk.',
  '.kooooooooooook.',
  '.kkkkkkkkkkkkkk.',
  '................',
  '................',
]

const sandikAcik: Cizim = [
  '................',
  '..kkkkkkkkkkkk..',
  '.kooooooooooook.',
  '.koRRRRRRRRRRok.',
  '.kkkkkkkkkkkkkk.',
  '.kywyyyyyyywyyk.',
  '.kyyyyYyyyyYyyk.',
  '.kkkkkkyykkkkkk.',
  '.kooooykkyooook.',
  '.kooooykkyooook.',
  '.kooooyyyyooook.',
  '.kRRRRRRRRRRRRk.',
  '.kooooooooooook.',
  '.kkkkkkkkkkkkkk.',
  '................',
  '................',
]

const kupa: Cizim = [
  '................',
  '...kkkkkkkkkk...',
  '.kkkyywyyyyykkk.',
  'kyykyywyyyyykyyk',
  'ky.kyywyyyyyk.yk',
  'kyykyywyyyyykyyk',
  '.kkkyyyyyyyykkk.',
  '....kyyyyyyk....',
  '.....kyyyyk.....',
  '......kyyk......',
  '......kYYk......',
  '.....kYyyYk.....',
  '....kkkkkkkk....',
  '....kaaaaaak....',
  '....kkkkkkkk....',
  '................',
]

const kol: Cizim = [
  '................',
  '......kkkk......',
  '.....krrwrk.....',
  '.....krrrrk.....',
  '.....kRrrRk.....',
  '......kkkk......',
  '......kaak......',
  '......kaak......',
  '......kaak......',
  '..kkkkkaakkkkk..',
  '.kddddddddddddk.',
  '.kdyydddddddrrk.',
  '.kddddddddddddk.',
  '.kkkkkkkkkkkkkk.',
  '................',
  '................',
]

const kahramanA: Cizim = [
  '................',
  '.....kkkkkk.....',
  '....krrrrrrk....',
  '...krrrrrrrrrk..',
  '...kkssksksk....',
  '...kssssssssk...',
  '....kssssssk....',
  '....kkbbbbkk....',
  '...kbbbbbbbbk...',
  '..ksbbbbbbbbsk..',
  '..kskbbbbbbksk..',
  '...kkyyyyyykk...',
  '....kbbkkbbk....',
  '...kbbk..kbbk...',
  '..kookk..kkook..',
  '..kkkk....kkkk..',
]

const kahramanB: Cizim = [
  '................',
  '................',
  '.....kkkkkk.....',
  '....krrrrrrk....',
  '...krrrrrrrrrk..',
  '...kkssksksk....',
  '...kssssssssk...',
  '....kssssssk....',
  '....kkbbbbkk....',
  '...kbbbbbbbbk...',
  '..ksbbbbbbbbsk..',
  '..kskyyyyyyksk..',
  '....kbbbbbbk....',
  '....kbbkkbbk....',
  '...kookkkook....',
  '...kkkk.kkkk....',
]

const balcikA: Cizim = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '......kkkk......',
  '....kkggggkk....',
  '...kgwwgggggk...',
  '..kgwwgggggggk..',
  '..kggkgggkgggk..',
  '.kgggkgggkggggk.',
  '.kGgggggggggGGk.',
  '.kGGGGGGGGGGGGk.',
  '..kkkkkkkkkkkk..',
]

const balcikB: Cizim = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '.....kkkkkk.....',
  '...kkggggggkk...',
  '.kgwwgkgggkgggk.',
  'kggggkgggkggggGk',
  'kGgggggggggggGGk',
  'kGGGGGGGGGGGGGGk',
  '.kkkkkkkkkkkkkk.',
]

/** Madde 6: jeton dönüşü tuvalde değil, orta nokta elips algoritmasıyla piksele oturtulur: kenar merdiven basamağıdır */
function jetonKare(yariGen: number): Cizim {
  const satir: string[] = []
  for (let y = 0; y < 16; y++) {
    const dy = (y + 0.5 - 8) / 6.5
    if (Math.abs(dy) > 1) {
      satir.push('.'.repeat(16))
      continue
    }
    const w = Math.max(1, Math.round(yariGen * Math.sqrt(1 - dy * dy)))
    let s = ''
    for (let x = 0; x < 16; x++) {
      const dx = x + 0.5 - 8
      const ic = Math.abs(dx) < w
      const kenar = ic && (Math.abs(dx) >= w - 1 || Math.abs(dy) > 0.86)
      if (!ic) s += '.'
      else if (kenar) s += 'k'
      else if (yariGen > 2 && dx < -w + 2.5 && dy < 0.2) s += 'w'
      else if (yariGen > 2 && dx > w - 2.5) s += 'Y'
      else s += 'y'
    }
    satir.push(s)
  }
  return satir
}

function donustur(c: Cizim, harita: Partial<Record<string, string>>): Cizim {
  return c.map((s) => [...s].map((ch) => harita[ch] ?? ch).join(''))
}

export const SPRITE = {
  kalp,
  kalpYarim: kalp.map((s, y) => [...s].map((ch, x) => (x >= 8 && y > 0 && ch !== 'k' && ch !== '.' ? 'd' : ch)).join('')),
  kalpBos: donustur(kalp, { r: 'd', R: 'd', w: 'd' }),
  kilic,
  kalkan,
  iksir,
  mana: donustur(iksir, { r: 'c', R: 'C', o: 'a' }),
  anahtar,
  mucevher,
  kafatasi,
  yildiz,
  sandik,
  sandikAcik,
  kupa,
  kol,
  kahramanA,
  kahramanB,
  balcikA,
  balcikB,
  jeton1: jetonKare(6),
  jeton2: jetonKare(4),
  jeton3: jetonKare(2),
  jeton4: jetonKare(4),
} satisfies Record<string, Cizim>
export type SpriteAd = keyof typeof SPRITE

export const SPRITE_AD: Partial<Record<SpriteAd, string>> = {
  kalp: 'Kalp',
  kilic: 'Kılıç',
  kalkan: 'Kalkan',
  iksir: 'Can iksiri',
  mana: 'Mana iksiri',
  anahtar: 'Anahtar',
  mucevher: 'Mücevher',
  kafatasi: 'Kafatası',
  yildiz: 'Yıldız',
  sandik: 'Sandık',
  kupa: 'Kupa',
  kol: 'Oyun kolu',
  jeton1: 'Jeton',
  kahramanA: 'Kahraman',
  balcikA: 'Balçık',
}

/** Animasyon şeritleri: kareler yan yana, CSS steps() ile oynatılır */
export const ANIM = {
  jeton: { kareler: ['jeton1', 'jeton2', 'jeton3', 'jeton4'] as SpriteAd[], sure: 140, ad: 'Dönen jeton' },
  kahraman: { kareler: ['kahramanA', 'kahramanB'] as SpriteAd[], sure: 220, ad: 'Yürüyen kahraman' },
  balcik: { kareler: ['balcikA', 'balcikB'] as SpriteAd[], sure: 320, ad: 'Zıplayan balçık' },
  kalp: { kareler: ['kalp', 'kalpYarim', 'kalpBos', 'kalpYarim'] as SpriteAd[], sure: 260, ad: 'Azalan kalp' },
} as const
export type AnimAd = keyof typeof ANIM

/** Çizimi 1× tuvale basar. Tarayıcı dışında (test) boş döner */
export function tuvale(c: Cizim, ctx: CanvasRenderingContext2D, ox = 0, oy = 0, ayna = false) {
  for (let y = 0; y < c.length; y++) {
    const s = c[y]
    for (let x = 0; x < s.length; x++) {
      const ch = s[ayna ? s.length - 1 - x : x] as PaletKod | '.'
      if (ch === '.') continue
      ctx.fillStyle = PALET[ch]
      ctx.fillRect(ox + x, oy + y, 1, 1)
    }
  }
}

const onbellek = new Map<string, string>()
/** PNG veri adresi: tek kare ya da yatay şerit */
export function png(adlar: SpriteAd[] | SpriteAd): string {
  const l = Array.isArray(adlar) ? adlar : [adlar]
  const anahtar = l.join(',')
  const var_ = onbellek.get(anahtar)
  if (var_) return var_
  const cv = document.createElement('canvas')
  cv.width = 16 * l.length
  cv.height = 16
  const ctx = cv.getContext('2d')
  if (!ctx) return ''
  l.forEach((ad, i) => tuvale(SPRITE[ad], ctx, i * 16, 0))
  const url = cv.toDataURL('image/png')
  onbellek.set(anahtar, url)
  return url
}

/** Kaç farklı renk kullanıyor (sprite sayfasında gösterilir) */
export function renkSayisi(ad: SpriteAd) {
  return new Set(SPRITE[ad].join('').replace(/\./g, '')).size
}
