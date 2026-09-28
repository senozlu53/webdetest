/**
 * Maskotun ortak geometrisi: SVG bileşeni ve Lottie animasyonu aynı yolları kullanır.
 * Gövde, altı biraz daha geniş bir mochi damlası (koordinat merkezi gövdenin ortası, 140 × 120).
 */
export type Ruh = 'mutlu' | 'uzgun' | 'saskin' | 'uykulu' | 'heyecanli'
export type MaskotRenk = 'peach' | 'mint' | 'salmon' | 'rose' | 'paper'

export const RENK: Record<MaskotRenk, { dolgu: string; koyu: string; ad: string }> = {
  peach: { dolgu: '#FFD3B6', koyu: '#F2AD85', ad: 'Bebek pembesi' },
  mint: { dolgu: '#A8E6CF', koyu: '#6FC7A5', ad: 'Nane' },
  salmon: { dolgu: '#FFAAA5', koyu: '#E9827C', ad: 'Şeftali' },
  rose: { dolgu: '#D4A5A5', koyu: '#B38282', ad: 'Lavanta' },
  paper: { dolgu: '#FFFFFF', koyu: '#ECD9CF', ad: 'Pamuk' },
}

export const RUH_AD: Record<Ruh, string> = {
  mutlu: 'Mutlu',
  uzgun: 'Üzgün',
  saskin: 'Şaşkın',
  uykulu: 'Uykulu',
  heyecanli: 'Heyecanlı',
}

type V = [number, number]
export interface Yol {
  v: V[]
  i: V[]
  o: V[]
  c: boolean
}

/** Bezier yolunu SVG d dizgesine çevirir (Lottie'nin i/o teğetleri köşeye göre görelidir) */
export function yolD(y: Yol) {
  const n = y.v.length
  let d = `M${y.v[0][0]} ${y.v[0][1]}`
  const son = y.c ? n : n - 1
  for (let k = 0; k < son; k++) {
    const a = y.v[k]
    const b = y.v[(k + 1) % n]
    const c1: V = [a[0] + y.o[k][0], a[1] + y.o[k][1]]
    const c2: V = [b[0] + y.i[(k + 1) % n][0], b[1] + y.i[(k + 1) % n][1]]
    d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${b[0]} ${b[1]}`
  }
  return y.c ? d + ' Z' : d
}

/** Mochi gövdesi: tepe dar, taban geniş ve yassı */
export const GOVDE: Yol = {
  v: [
    [0, -58],
    [70, 8],
    [0, 60],
    [-70, 8],
  ],
  i: [
    [-40, 0],
    [0, -38],
    [46, 0],
    [0, 32],
  ],
  o: [
    [40, 0],
    [0, 32],
    [-46, 0],
    [0, -38],
  ],
  c: true,
}

/** Tepedeki filiz: iki yapraklı küçük sap */
export const FILIZ: Yol = {
  v: [
    [0, -56],
    [0, -74],
  ],
  i: [
    [0, 0],
    [3, 6],
  ],
  o: [
    [-2, -8],
    [0, 0],
  ],
  c: false,
}
export const YAPRAK: Yol = {
  v: [
    [0, -72],
    [20, -86],
  ],
  i: [
    [10, 0],
    [-10, -4],
  ],
  o: [
    [4, -12],
    [-4, 10],
  ],
  c: true,
}

const acik = (v: V[], c = false, i?: V[], o?: V[]): Yol => ({
  v,
  i: i ?? v.map(() => [0, 0]),
  o: o ?? v.map(() => [0, 0]),
  c,
})

/** Yüz parçaları: göz (sol, sağ) ve ağız; kaş ve gözyaşı isteğe bağlı */
export interface Yuz {
  goz: { tip: 'nokta'; r: number } | { tip: 'yay'; yukari: boolean } | { tip: 'cizgi' } | { tip: 'yildiz' }
  agiz: Yol
  agizDolu?: boolean
  kas?: boolean
  yas?: boolean
  zzz?: boolean
}

/** ^‿^ yüzünün "‿" ağzı: fontlarda bu glif olmadığı için çizilir */
export const GULUS = acik(
  [
    [-11, 14],
    [11, 14],
  ],
  false,
  [
    [0, 0],
    [-4, 11],
  ],
  [
    [4, 11],
    [0, 0],
  ],
)

export const YUZLER: Record<Ruh, Yuz> = {
  mutlu: { goz: { tip: 'yay', yukari: true }, agiz: GULUS },
  heyecanli: {
    goz: { tip: 'yildiz' },
    agiz: acik(
      [
        [-13, 12],
        [13, 12],
      ],
      true,
      [
        [0, 0],
        [-2, 18],
      ],
      [
        [2, 18],
        [0, 0],
      ],
    ),
    agizDolu: true,
  },
  saskin: {
    goz: { tip: 'nokta', r: 7 },
    agiz: acik(
      [
        [0, 10],
        [7, 18],
        [0, 26],
        [-7, 18],
      ],
      true,
      [
        [-4, 0],
        [0, -4],
        [4, 0],
        [0, 4],
      ],
      [
        [4, 0],
        [0, 4],
        [-4, 0],
        [0, -4],
      ],
    ),
    agizDolu: true,
  },
  uzgun: {
    goz: { tip: 'nokta', r: 5.5 },
    agiz: acik(
      [
        [-10, 22],
        [10, 22],
      ],
      false,
      [
        [0, 0],
        [-4, -9],
      ],
      [
        [4, -9],
        [0, 0],
      ],
    ),
    kas: true,
    yas: true,
  },
  uykulu: {
    goz: { tip: 'cizgi' },
    agiz: acik(
      [
        [-6, 18],
        [6, 18],
      ],
      false,
      [
        [0, 0],
        [-2, 4],
      ],
      [
        [2, 4],
        [0, 0],
      ],
    ),
    zzz: true,
  },
}

export const GOZ_X = 24
export const GOZ_Y = -4
export const YANAK_X = 42
export const YANAK_Y = 12

/** Beş köşeli yuvarlak yıldız göz (heyecanlı) */
export function yildizD(cx: number, cy: number, R = 9, r = 4.2) {
  const n = 5
  const p: string[] = []
  for (let k = 0; k < n * 2; k++) {
    const a = (Math.PI / n) * k - Math.PI / 2
    const rr = k % 2 ? r : R
    p.push(`${(cx + Math.cos(a) * rr).toFixed(2)} ${(cy + Math.sin(a) * rr).toFixed(2)}`)
  }
  return `M${p.join(' L')} Z`
}
