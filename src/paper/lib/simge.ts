/** Madde 9: kâğıttan kesilmiş silüet ikonlar. 48 birimlik ızgarada, katman katman; her katmanın kendi gölgesi var. */
const f = (n: number) => Math.round(n * 100) / 100

export const daire = (cx: number, cy: number, r: number, delik = false) => {
  const s = delik ? 0 : 1
  return `M${f(cx - r)} ${f(cy)}a${r} ${r} 0 1 ${s} ${f(2 * r)} 0a${r} ${r} 0 1 ${s} ${f(-2 * r)} 0Z`
}
/** Çokgen: saat yönüne normalize edilir (delikse ters), böylece nonzero dolguda birleşir */
export const poli = (pts: [number, number][], delik = false) => {
  let a = 0
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[(i + 1) % pts.length]
    a += x1 * y2 - x2 * y1
  }
  const ters = delik ? a > 0 : a < 0
  const p = ters ? [...pts].reverse() : pts
  return `M${p.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`
}
const dik = (x: number, y: number, w: number, h: number, delik = false) =>
  poli(
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ],
    delik,
  )
const yildiz = (cx: number, cy: number, R: number, r: number, n = 5, ac = -90) => {
  const p: [number, number][] = []
  for (let i = 0; i < n * 2; i++) {
    const a = ((ac + (i * 180) / n) * Math.PI) / 180
    const rr = i % 2 ? r : R
    p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
  }
  return poli(p)
}

export interface Katman {
  d: string
  renk: string
  cizgi?: number // verilirse dolgusuz, bu kalınlıkta yuvarlak uçlu çizgi
}
const KAHVE = '#a9744f'
const INK = '#2b2622'
const KREM = '#fffaf0'

function gunes(): string {
  let d = daire(24, 24, 11)
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180
    const b = 3.2 / 13
    const p = (r: number, s: number): [number, number] => [24 + Math.cos(a + s) * r, 24 + Math.sin(a + s) * r]
    d += poli([p(13, -b), p(22.5, 0), p(13, b)])
  }
  return d
}
function disli(): string {
  const p: [number, number][] = []
  const n = 8
  for (let i = 0; i < n; i++) {
    const a0 = (i * 360) / n
    for (const [da, r] of [
      [-11, 15],
      [-6, 21],
      [6, 21],
      [11, 15],
    ] as const) {
      const a = ((a0 + da) * Math.PI) / 180
      p.push([24 + Math.cos(a) * r, 24 + Math.sin(a) * r])
    }
  }
  return poli(p) + daire(24, 24, 6, true)
}

export const SIMGELER = {
  agac: [
    { d: dik(20, 34, 8, 12), renk: KAHVE },
    {
      d: poli([
        [24, 2],
        [35, 16],
        [30, 16],
        [40, 29],
        [31, 29],
        [42, 41],
        [6, 41],
        [17, 29],
        [8, 29],
        [18, 16],
        [13, 16],
      ]),
      renk: '#62c370',
    },
  ],
  yaprak: [
    {
      d:
        'M7 41C4 20 16 6 42 5C43 31 30 43 7 41Z' +
        poli(
          [
            [9, 39],
            [31, 17],
            [33, 19],
            [11, 41],
          ],
          true,
        ),
      renk: '#62c370',
    },
  ],
  gunes: [{ d: gunes(), renk: '#ffc940' }],
  bulut: [{ d: daire(15, 30, 8) + daire(25, 23, 10) + daire(35, 30, 7.5) + dik(15, 30, 20, 8), renk: '#fffaf0' }],
  dag: [
    {
      d: poli([
        [20, 43],
        [33, 18],
        [47, 43],
      ]),
      renk: '#b7a0ff',
    },
    {
      d: poli([
        [2, 43],
        [17, 11],
        [33, 43],
      ]),
      renk: '#2ec4b6',
    },
    {
      d: poli([
        [12.5, 21],
        [17, 11],
        [21.5, 21],
        [17, 18.5],
      ]),
      renk: KREM,
    },
  ],
  ev: [
    { d: dik(9, 22, 30, 21), renk: '#ffc940' },
    {
      d: poli([
        [4, 25],
        [24, 5],
        [44, 25],
      ]),
      renk: '#ff7b6b',
    },
    { d: dik(20, 30, 9, 13), renk: KAHVE },
  ],
  balik: [
    { d: 'M3 24C11 9 30 9 38 24C30 39 11 39 3 24Z', renk: '#5fa8ff' },
    {
      d: poli([
        [35, 24],
        [46, 13],
        [43, 24],
        [46, 35],
      ]),
      renk: '#5fa8ff',
    },
    { d: daire(13, 21, 2.4), renk: INK },
  ],
  kus: [
    {
      d: poli([
        [12, 27],
        [1, 19],
        [4, 31],
      ]),
      renk: '#ff93b4',
    },
    { d: daire(22, 27, 12) + daire(33, 17, 7), renk: '#ff93b4' },
    {
      d: poli([
        [38, 15],
        [47, 19],
        [38, 22],
      ]),
      renk: '#ffc940',
    },
    { d: daire(35, 15.5, 1.8), renk: INK },
  ],
  ay: [{ d: 'M32 4C17 5 9 17 12 29C15 41 29 47 42 39C31 39 23 31 24 20C25 13 28 8 32 4Z', renk: '#ffc940' }],
  cicek: [
    { d: [0, 72, 144, 216, 288].map((a) => daire(24 + Math.cos(((a - 90) * Math.PI) / 180) * 11, 24 + Math.sin(((a - 90) * Math.PI) / 180) * 11, 8)).join(''), renk: '#ff93b4' },
    { d: daire(24, 24, 7), renk: '#ffc940' },
  ],
  damla: [{ d: 'M24 3C24 3 38 20 38 30C38 38 32 45 24 45C16 45 10 38 10 30C10 20 24 3 24 3Z', renk: '#5fa8ff' }],
  kalp: [{ d: 'M24 43C7 30 3 20 8 13C13 7 22 9 24 15C26 9 35 7 40 13C45 20 41 30 24 43Z', renk: '#ff7b6b' }],
  yildiz: [{ d: yildiz(24, 25, 21, 9.5), renk: '#ffc940' }],
  ayi: [
    { d: daire(10, 12, 7) + daire(38, 12, 7), renk: KAHVE },
    { d: daire(24, 26, 17), renk: KAHVE },
    { d: daire(24, 32, 8.5), renk: '#f3d9b8' },
    { d: daire(17, 22, 2.4) + daire(31, 22, 2.4) + daire(24, 29.5, 3), renk: INK },
  ],
  zarf: [
    { d: dik(4, 11, 40, 27), renk: '#ff93b4' },
    {
      d: poli([
        [4, 11],
        [24, 28],
        [44, 11],
      ]),
      renk: '#ffc0d3',
    },
  ],
  sepet: [
    { d: 'M14 20C14 5 34 5 34 20', renk: KAHVE, cizgi: 4 },
    {
      d: poli([
        [6, 20],
        [42, 20],
        [37, 43],
        [11, 43],
      ]),
      renk: '#c9a57b',
    },
    { d: dik(11, 28, 26, 3), renk: '#b08a5e' },
  ],
  kitap: [
    {
      d: poli([
        [3, 9],
        [23, 13],
        [23, 43],
        [3, 39],
      ]),
      renk: '#5fa8ff',
    },
    {
      d: poli([
        [45, 9],
        [25, 13],
        [25, 43],
        [45, 39],
      ]),
      renk: '#ffc940',
    },
    {
      d:
        poli([
          [8, 16],
          [19, 18],
          [19, 21],
          [8, 19],
        ]) +
        poli([
          [8, 24],
          [19, 26],
          [19, 29],
          [8, 27],
        ]),
      renk: KREM,
    },
  ],
  kutu: [
    {
      d: poli([
        [5, 15],
        [24, 6],
        [43, 15],
        [43, 36],
        [24, 45],
        [5, 36],
      ]),
      renk: '#c9a57b',
    },
    {
      d: poli([
        [5, 15],
        [24, 24],
        [43, 15],
        [24, 6],
      ]),
      renk: '#e0c39b',
    },
    {
      d: poli([
        [21, 24],
        [27, 24],
        [27, 45],
        [21, 45],
      ]),
      renk: '#ffc940',
    },
  ],
  onay: [
    {
      d: poli([
        [6, 26],
        [11, 21],
        [19, 29],
        [37, 9],
        [43, 14],
        [19, 41],
      ]),
      renk: '#62c370',
    },
  ],
  arti: [{ d: dik(20, 6, 8, 36) + dik(6, 20, 36, 8), renk: '#62c370' }],
  eksi: [{ d: dik(6, 20, 36, 8), renk: '#ff7b6b' }],
  kapat: [
    {
      d: poli([
        [8, 14],
        [14, 8],
        [24, 18],
        [34, 8],
        [40, 14],
        [30, 24],
        [40, 34],
        [34, 40],
        [24, 30],
        [14, 40],
        [8, 34],
        [18, 24],
      ]),
      renk: '#ff7b6b',
    },
  ],
  ok: [
    {
      d: poli([
        [4, 19],
        [26, 19],
        [26, 8],
        [44, 24],
        [26, 40],
        [26, 29],
        [4, 29],
      ]),
      renk: '#5fa8ff',
    },
  ],
  ayar: [{ d: disli(), renk: '#b7a0ff' }],
} satisfies Record<string, Katman[]>
export type SimgeAd = keyof typeof SIMGELER
export const TUM_SIMGELER = Object.keys(SIMGELER) as SimgeAd[]
