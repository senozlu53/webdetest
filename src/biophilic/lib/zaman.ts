/**
 * Madde 2 · 3 · 12 · 18: günün saatine göre uyarlanan renk sistemi.
 * Dört mod (Figma Variables · Modes): Sabah, Öğle, Akşam, Gece. Aralarında sürekli karışım yapılır;
 * cam panelin opaklığı ve yazı rengi her saat için okunabilirlik (WCAG) hedefine göre çözülür.
 */
import { kontrast, hexRgb } from './contrast'

export type ModAd = 'sabah' | 'ogle' | 'aksam' | 'gece'
type Uclu = readonly [string, string, string]

export interface Mod {
  ad: string
  token: string
  saat: number
  /** gökyüzü: üst, orta, alt */
  gok: Uclu
  /** güneş / ay parıltısı */
  isik: string
  /** bitki katmanları: uzak, orta, yakın */
  yaprak: Uclu
  su: string
}

/** Saf hex renkler: tokenlarla (Theme/MorningLight vb.) birebir aynıdır */
export const MODLAR: Record<ModAd, Mod> = {
  sabah: { ad: 'Sabah', token: 'Theme/MorningLight', saat: 7, gok: ['#9ED6F0', '#E4F3E6', '#FFFACD'], isik: '#FFF1A8', yaprak: ['#5BBE6B', '#2E9E4A', '#1F7A34'], su: '#A9DCEB' },
  ogle: { ad: 'Öğle', token: 'Theme/NoonSky', saat: 13, gok: ['#87CEEB', '#C6E9F5', '#E6F6E4'], isik: '#FFFDE0', yaprak: ['#4FB964', '#228B22', '#17692A'], su: '#8FD3EA' },
  aksam: { ad: 'Akşam', token: 'Theme/EveningGlow', saat: 19, gok: ['#86AEDB', '#F8CBA2', '#F0977C'], isik: '#FFD08A', yaprak: ['#4F8B5A', '#2F6B3E', '#1E4A2B'], su: '#E9B7A0' },
  gece: { ad: 'Gece', token: 'Theme/NightCalm', saat: 25, gok: ['#0B1D2E', '#12343F', '#1B4A44'], isik: '#EAF2FF', yaprak: ['#2A6B5E', '#1B4F45', '#0F332D'], su: '#2C6672' },
}
export const MOD_SIRA: ModAd[] = ['sabah', 'ogle', 'aksam', 'gece']

export const modAdi = (saat: number): ModAd => {
  const h = ((saat % 24) + 24) % 24
  return h >= 5 && h < 10 ? 'sabah' : h >= 10 && h < 16 ? 'ogle' : h >= 16 && h < 21 ? 'aksam' : 'gece'
}

/* ── renk yardımcıları ── */
const hex = (r: number, g: number, b: number) =>
  '#' +
  [r, g, b]
    .map((v) =>
      Math.round(Math.max(0, Math.min(255, v)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
export const karisHex = (a: string, b: string, t: number) => {
  const x = hexRgb(a)
  const y = hexRgb(b)
  return hex(x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t)
}
/** yarı saydam tint'i (alfa) zemine bindirir */
export const bindir = (tint: string, zemin: string, alfa: number) => karisHex(zemin, tint, alfa)
const parlaklik = (h: string) => {
  const [r, g, b] = hexRgb(h).map((c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/* ── mod karışımı ── */
const DURAK: { ad: ModAd; saat: number }[] = [
  { ad: 'sabah', saat: 7 },
  { ad: 'ogle', saat: 13 },
  { ad: 'aksam', saat: 19 },
  { ad: 'gece', saat: 25 },
  { ad: 'sabah', saat: 31 },
]

export interface Kaynak {
  gok: [string, string, string]
  isik: string
  yaprak: [string, string, string]
  su: string
}
export function karisim(saat: number): Kaynak {
  const h0 = ((saat % 24) + 24) % 24
  const h = h0 < 7 ? h0 + 24 : h0
  let i = 0
  while (i < DURAK.length - 2 && h >= DURAK[i + 1].saat) i++
  const a = MODLAR[DURAK[i].ad]
  const b = MODLAR[DURAK[i + 1].ad]
  // yumuşak geçiş (smoothstep)
  const ham = (h - DURAK[i].saat) / (DURAK[i + 1].saat - DURAK[i].saat)
  const t = ham * ham * (3 - 2 * ham)
  const m3 = (x: Uclu, y: Uclu): [string, string, string] => [karisHex(x[0], y[0], t), karisHex(x[1], y[1], t), karisHex(x[2], y[2], t)]
  return { gok: m3(a.gok, b.gok), isik: karisHex(a.isik, b.isik, t), yaprak: m3(a.yaprak, b.yaprak), su: karisHex(a.su, b.su, t) }
}

/** Güneş (gündüz) ya da ay (gece) konumu: x, y ∈ [0,1], yay üzerinde */
export function gunes(saat: number) {
  const h = ((saat % 24) + 24) % 24
  const gunduz = h >= 5.5 && h < 19.5
  const t = gunduz ? (h - 5.5) / 14 : ((h - 19.5 + 24) % 24) / 10
  const x = gunduz ? 0.1 + 0.8 * t : 0.86 - 0.72 * t
  const y = (gunduz ? 0.8 : 0.42) - (gunduz ? 0.68 : 0.3) * Math.sin(Math.PI * t)
  // gün doğumu ve batımında ufka yaklaşırken büyür (görsel ağırlık)
  const boy = gunduz ? 26 - 6 * Math.sin(Math.PI * t) : 15
  return { x, y, boy, gunduz }
}

/* ── okunabilirlik çözücüsü (Madde 18) ── */
export interface Cam {
  tint: string
  alfa: number
  metin: string
  soluk: string
  vurguYazi: string
  kontrol: string
  btn: string
  btnYazi: string
  btnUst: string
  odak: string
  /** açık (beyaz) mı, koyu (gece) mü cam */
  acik: boolean
  /** en kötü zeminde metin kontrastı */
  oran: number
  oranSoluk: number
  /** bu cam altında karşılaşılabilecek en kötü zemin */
  enKotu: string
  gecti: boolean
}
const KOYU_MUREKKEP = '#0F2E1B'
const AYDINLIK_MUREKKEP = '#F3FBF4'
const KOYU_TINT = '#08161C'
const ACIK_TINT = '#FFFFFF'

export interface CozumSecenek {
  /** dengeleyici katman: kapalıysa opaklık sabit kalır */
  denge?: boolean
  /** hedef kontrast; yüksek kontrast varyantında 7 */
  hedef?: number
  /** yüzey dokusunun en fazla alfa değeri; 0 ise doku yok. Doku, en kötü zemin hesabına katılır */
  doku?: number
}

/** Panelin altına düşebilecek renkler: gökyüzü üç durak, güneş parıltısı, üç yaprak, su */
function zeminler(k: Kaynak): string[] {
  return [...k.gok, k.isik, ...k.yaprak, k.su]
}
/** Bir zeminin üstündeki cam panelin görünen renkleri. Doku panelin üstüne biner; hem koyulaştırıp hem açabilir, iki uç da hesaba girer */
function paneller(tint: string, z: string, alfa: number, doku: number): string[] {
  const p = bindir(tint, z, alfa)
  return doku > 0 ? [p, karisHex(p, '#000000', doku), karisHex(p, '#ffffff', doku)] : [p]
}

function dene(k: Kaynak, tint: string, murekkep: string, taban: number, hedef: number, sabit: boolean, doku = 0) {
  const soluk = karisHex(murekkep, tint, 0.14)
  const stops = zeminler(k)
  const olc = (a: number) => {
    let m = Infinity
    let ms = Infinity
    let kotu = stops[0]
    for (const z of stops) {
      for (const p of paneller(tint, z, a, doku)) {
        const c = kontrast(murekkep, p)
        const cs = kontrast(soluk, p)
        if (c < m) {
          m = c
          kotu = p
        }
        ms = Math.min(ms, cs)
      }
    }
    return { m, ms, kotu }
  }
  if (sabit) {
    const o = olc(taban)
    return { alfa: taban, soluk, ...o }
  }
  for (let a = taban; a <= 0.965; a += 0.02) {
    const o = olc(a)
    if (o.m >= hedef && o.ms >= hedef) return { alfa: Math.round(a * 100) / 100, soluk, ...o }
  }
  const o = olc(0.965)
  return { alfa: 0.965, soluk, ...o }
}

export function camCoz(k: Kaynak, sec: CozumSecenek = {}): Cam {
  const { denge = true, hedef: istenen = 4.5, doku = 0 } = sec
  // arka plan bulanıklığı ve doygunluk filtresi renkleri az da olsa oynatır: çözüm hedefin 0,2 üstünü arar
  const hedef = istenen + 0.2
  const taban = 0.5
  const ortGok = (parlaklik(k.gok[0]) + parlaklik(k.gok[1]) + parlaklik(k.gok[2])) / 3
  const acik = dene(k, ACIK_TINT, KOYU_MUREKKEP, taban, hedef, !denge, doku)
  const koyu = dene(k, KOYU_TINT, AYDINLIK_MUREKKEP, taban, hedef, !denge, doku)
  let secilen: 'acik' | 'koyu'
  if (denge) {
    const aOk = acik.m >= hedef && acik.ms >= hedef
    const kOk = koyu.m >= hedef && koyu.ms >= hedef
    // parlak gökyüzünde açık cam, ışık azalınca koyu cam; tercih edilen ton uygulanabilirse (opaklık ≤ %86) o seçilir
    const tercih: 'acik' | 'koyu' = ortGok > 0.6 ? 'acik' : 'koyu'
    const tercihOk = tercih === 'acik' ? aOk && acik.alfa <= 0.86 : kOk && koyu.alfa <= 0.86
    secilen = tercihOk ? tercih : aOk && !kOk ? 'acik' : kOk && !aOk ? 'koyu' : acik.alfa < koyu.alfa - 0.001 ? 'acik' : 'koyu'
  } else {
    // katman kapalı: yalnızca saate bakılır, opaklık sabit
    secilen = ortGok > 0.3 ? 'acik' : 'koyu'
  }
  const r = secilen === 'acik' ? acik : koyu
  const tint = secilen === 'acik' ? ACIK_TINT : KOYU_TINT
  const metin = secilen === 'acik' ? KOYU_MUREKKEP : AYDINLIK_MUREKKEP
  // vurgu yazısı: orman yeşilinin koyu / açık türevi
  const vurguAdaylar = secilen === 'acik' ? ['#14612A', '#0F4F20', '#0B3A18'] : ['#A6EDB0', '#C6F5CC', '#E2FBE5']
  let vurguYazi = vurguAdaylar[vurguAdaylar.length - 1]
  for (const v of vurguAdaylar) {
    if (zeminler(k).every((z) => paneller(tint, z, r.alfa, doku).every((p) => kontrast(v, p) >= hedef))) {
      vurguYazi = v
      break
    }
  }
  // form çerçevesi ve odak halkası: metne yakın koyulukta, panel zemininde ≥3:1
  const kontrol = karisHex(metin, tint, 0.12)
  const acikTint = secilen === 'acik'
  return {
    tint,
    alfa: r.alfa,
    metin,
    soluk: r.soluk,
    vurguYazi,
    kontrol,
    btn: acikTint ? '#17692A' : '#A6EDB0',
    btnYazi: acikTint ? '#FFFFFF' : '#08161C',
    btnUst: acikTint ? '#0F4F20' : '#C6F5CC',
    odak: acikTint ? '#0B3A18' : '#E2FBE5',
    acik: acikTint,
    oran: r.m,
    oranSoluk: r.ms,
    enKotu: r.kotu,
    gecti: r.m >= istenen && r.ms >= istenen,
  }
}

export interface Palet extends Kaynak {
  saat: number
  mod: ModAd
  gunes: ReturnType<typeof gunes>
  cam: Cam
  /** güneşin konumuna göre gölge kayması (px): sabahları sağa, akşamları sola düşer */
  golgeX: number
}
export function palet(saat: number, sec: CozumSecenek = {}): Palet {
  const k = karisim(saat)
  const g = gunes(saat)
  return { ...k, saat: ((saat % 24) + 24) % 24, mod: modAdi(saat), gunes: g, cam: camCoz(k, sec), golgeX: Math.round((0.5 - g.x) * 36) }
}

/** Kök (ya da kapsayıcı) elemana yazılacak CSS değişkenleri */
export function degiskenler(p: Palet): Record<string, string> {
  return {
    '--zg-1': p.gok[0],
    '--zg-2': p.gok[1],
    '--zg-3': p.gok[2],
    '--isik-renk': p.isik,
    '--yaprak-1': p.yaprak[0],
    '--yaprak-2': p.yaprak[1],
    '--yaprak-3': p.yaprak[2],
    '--su-renk': p.su,
    '--cam-tint': p.cam.tint,
    '--cam-a': String(p.cam.alfa),
    '--metin': p.cam.metin,
    '--soluk': p.cam.soluk,
    '--vurgu-yazi': p.cam.vurguYazi,
    '--kontrol': p.cam.kontrol,
    '--btn': p.cam.btn,
    '--btn-yazi': p.cam.btnYazi,
    '--btn-ust': p.cam.btnUst,
    '--odak': p.cam.odak,
    '--gunes-x': String(Math.round(p.gunes.x * 1000) / 1000),
    '--gunes-y': String(Math.round(p.gunes.y * 1000) / 1000),
    '--gunes-boy': String(Math.round(p.gunes.boy * 10) / 10),
    '--golge-x': `${p.golgeX}px`,
  }
}

/** Yardımcı: saat metni */
export const saatMetni = (s: number) => {
  const toplam = Math.round((((s % 24) + 24) % 24) * 60) % 1440
  return `${String(Math.floor(toplam / 60)).padStart(2, '0')}:${String(toplam % 60).padStart(2, '0')}`
}
