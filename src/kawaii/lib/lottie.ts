/**
 * Madde 14: Lottie animasyonları kodla üretilir (ayrı .json dosyası yok, ağ isteği yok).
 * Maskot SVG bileşeniyle aynı geometriyi kullanır: gövde jöle gibi esner, gözler kırpılır.
 * Çıktı Bodymovin 5.7 şemasıdır; lottie-web "light" oynatıcısı (ifade/eval yok) çalar.
 */
import { GOVDE, FILIZ, YAPRAK, GOZ_X, GOZ_Y, YANAK_X, YANAK_Y, RENK, YUZLER, type MaskotRenk, type Ruh, type Yol } from './maskot'

type N2 = [number, number]
type Prop = { a: 0; k: unknown } | { a: 1; k: unknown[] }

const KAHVE = '#5D4037'
const rgb = (h: string, a = 1) => {
  const s = h.replace('#', '')
  return [0, 2, 4].map((i) => +(parseInt(s.slice(i, i + 2), 16) / 255).toFixed(4)).concat(a)
}
const sabit = (k: unknown): Prop => ({ a: 0, k })
const EZ = { o: { x: [0.33], y: [0] }, i: { x: [0.67], y: [1] } }
/** [kare, değer] listesinden anahtar kareler; son karede eğri gerekmez */
const kare = (l: [number, number[]][]): Prop => ({
  a: 1,
  k: l.map(([t, s], n) => (n === l.length - 1 ? { t, s } : { t, s, ...EZ })),
})

const tr = (o: { p?: N2; a?: N2; s?: Prop | N2; r?: Prop; op?: Prop } = {}) => ({
  ty: 'tr',
  p: sabit(o.p ?? [0, 0]),
  a: sabit(o.a ?? [0, 0]),
  s: Array.isArray(o.s) ? sabit(o.s) : (o.s ?? sabit([100, 100])),
  r: o.r ?? sabit(0),
  o: o.op ?? sabit(100),
  sk: sabit(0),
  sa: sabit(0),
})
const yol = (y: Yol) => ({
  ty: 'sh',
  d: 1,
  ks: sabit({ i: y.i, o: y.o, v: y.v, c: y.c }),
})
const elips = (p: N2, s: N2) => ({ ty: 'el', d: 1, p: sabit(p), s: sabit(s) })
const dolgu = (h: string, a = 1) => ({
  ty: 'fl',
  c: sabit(rgb(h)),
  o: sabit(a * 100),
  r: 1,
})
const cizgi = (h: string, w: number) => ({
  ty: 'st',
  c: sabit(rgb(h)),
  o: sabit(100),
  w: sabit(w),
  lc: 2,
  lj: 2,
  ml: 4,
})
const grup = (nm: string, it: unknown[], t = tr()) => ({
  ty: 'gr',
  nm,
  it: [...it, t],
})

/** İkinci dereceden eğriyi (SVG Q) Lottie kübik yoluna çevirir */
export function q2yol(p0: N2, q: N2, p2: N2): Yol {
  const c1: N2 = [p0[0] + (2 / 3) * (q[0] - p0[0]), p0[1] + (2 / 3) * (q[1] - p0[1])]
  const c2: N2 = [p2[0] + (2 / 3) * (q[0] - p2[0]), p2[1] + (2 / 3) * (q[1] - p2[1])]
  return {
    v: [p0, p2],
    o: [
      [c1[0] - p0[0], c1[1] - p0[1]],
      [0, 0],
    ],
    i: [
      [0, 0],
      [c2[0] - p2[0], c2[1] - p2[1]],
    ],
    c: false,
  }
}
function yildizYol(cx: number, cy: number, R: number, r: number): Yol {
  const v: N2[] = []
  for (let k = 0; k < 10; k++) {
    const a = (Math.PI / 5) * k - Math.PI / 2
    const rr = k % 2 ? r : R
    v.push([+(cx + Math.cos(a) * rr).toFixed(2), +(cy + Math.sin(a) * rr).toFixed(2)])
  }
  return { v, i: v.map(() => [0, 0]), o: v.map(() => [0, 0]), c: true }
}

function gozler(ruh: Ruh) {
  const g = YUZLER[ruh].goz
  const tek = (x: number) => {
    if (g.tip === 'nokta') return [grup('parilti', [elips([x + 2.2, GOZ_Y - 2.4], [g.r * 0.7, g.r * 0.7]), dolgu('#FFFFFF')]), grup('bebek', [elips([x, GOZ_Y], [g.r * 2, g.r * 2]), dolgu(KAHVE)])]
    if (g.tip === 'yildiz') return [grup('yildiz', [yol(yildizYol(x, GOZ_Y, 9, 4.2)), cizgi(KAHVE, 2.5), dolgu(KAHVE)])]
    if (g.tip === 'cizgi') return [grup('kapali', [yol(q2yol([x - 7, GOZ_Y], [x, GOZ_Y + 6], [x + 7, GOZ_Y])), cizgi(KAHVE, 4.5)])]
    return [grup('yay', [yol(q2yol([x - 7, GOZ_Y + 3], [x, GOZ_Y - 8], [x + 7, GOZ_Y + 3])), cizgi(KAHVE, 4.5)])]
  }
  return [...tek(-GOZ_X), ...tek(GOZ_X)]
}

export const OP = 120 // 60 kare/sn: iki saniyelik döngü

/** Maskot animasyonu: ruh hâline göre farklı zıplama, kırpma ve küçük efektler */
export function maskotAnim(ruh: Ruh, renk: MaskotRenk) {
  const r = RENK[renk]
  const yuz = YUZLER[ruh]
  const yanak = renk === 'salmon' ? '#E9827C' : '#FFAAA5'
  // Jöle: önce yassılır, sonra uzar, sönümlenerek durur (Madde 16)
  const jole: Record<Ruh, [number, number[]][]> = {
    mutlu: [
      [0, [100, 100]],
      [10, [110, 90]],
      [22, [94, 107]],
      [34, [104, 97]],
      [46, [99, 101]],
      [56, [100, 100]],
      [OP, [100, 100]],
    ],
    heyecanli: [
      [0, [100, 100]],
      [8, [114, 86]],
      [20, [90, 112]],
      [34, [108, 93]],
      [44, [97, 103]],
      [52, [100, 100]],
      [60, [114, 86]],
      [72, [90, 112]],
      [86, [108, 93]],
      [96, [97, 103]],
      [104, [100, 100]],
      [OP, [100, 100]],
    ],
    saskin: [
      [0, [100, 100]],
      [6, [92, 110]],
      [18, [104, 96]],
      [30, [100, 100]],
      [OP, [100, 100]],
    ],
    uzgun: [
      [0, [100, 100]],
      [40, [103, 97]],
      [80, [100, 100]],
      [OP, [100, 100]],
    ],
    uykulu: [
      [0, [100, 100]],
      [60, [104, 97]],
      [OP, [100, 100]],
    ],
  }
  const zipla: Record<Ruh, [number, number[]][]> = {
    mutlu: [
      [0, [100, 162]],
      [10, [100, 162]],
      [22, [100, 150]],
      [36, [100, 162]],
      [OP, [100, 162]],
    ],
    heyecanli: [
      [0, [100, 162]],
      [8, [100, 162]],
      [20, [100, 140]],
      [34, [100, 162]],
      [60, [100, 162]],
      [72, [100, 140]],
      [86, [100, 162]],
      [OP, [100, 162]],
    ],
    saskin: [
      [0, [100, 162]],
      [6, [100, 154]],
      [18, [100, 162]],
      [OP, [100, 162]],
    ],
    uzgun: [
      [0, [100, 162]],
      [OP, [100, 162]],
    ],
    uykulu: [
      [0, [100, 162]],
      [OP, [100, 162]],
    ],
  }
  const kirp: Prop =
    yuz.goz.tip === 'cizgi'
      ? sabit([100, 100])
      : kare([
          [0, [100, 100]],
          [78, [100, 100]],
          [82, [100, 10]],
          [86, [100, 100]],
          [OP, [100, 100]],
        ])
  const yuzGrup = [
    grup('agiz', [yol(yuz.agiz), cizgi(KAHVE, 4.5), ...(yuz.agizDolu ? [dolgu('#8A5249')] : [])]),
    grup('gozler', gozler(ruh), tr({ p: [0, GOZ_Y], a: [0, GOZ_Y], s: kirp })),
    ...(yuz.kas ? [grup('kas', [yol(q2yol([-32, -14], [-26, -20], [-17, -19])), cizgi(KAHVE, 3.5)]), grup('kas', [yol(q2yol([32, -14], [26, -20], [17, -19])), cizgi(KAHVE, 3.5)])] : []),
  ]
  const ekler = [
    ...(yuz.yas
      ? [
          grup(
            'yas',
            [
              yol({
                v: [
                  [-30, 4],
                  [-25, 14],
                  [-35, 14],
                ],
                i: [
                  [0, 0],
                  [0, -3],
                  [0, 4],
                ],
                o: [
                  [0, 0],
                  [0, 5.5],
                  [0, -3],
                ],
                c: true,
              }),
              cizgi('#6FA8C7', 2),
              dolgu('#D5EEF8'),
            ],
            tr({
              p: [0, 0],
              op: kare([
                [0, [0]],
                [20, [100]],
                [90, [100]],
                [OP, [0]],
              ]),
              s: kare([
                [0, [60, 60]],
                [20, [100, 100]],
                [OP, [100, 100]],
              ]),
            }),
          ),
        ]
      : []),
    ...(yuz.zzz
      ? [
          grup(
            'zzz',
            [
              yol({
                v: [
                  [46, -58],
                  [58, -58],
                  [46, -46],
                  [58, -46],
                ],
                i: [
                  [0, 0],
                  [0, 0],
                  [0, 0],
                  [0, 0],
                ],
                o: [
                  [0, 0],
                  [0, 0],
                  [0, 0],
                  [0, 0],
                ],
                c: false,
              }),
              cizgi(KAHVE, 3.5),
            ],
            tr({
              p: [0, 0],
              op: kare([
                [0, [0]],
                [30, [100]],
                [90, [100]],
                [OP, [0]],
              ]),
            }),
          ),
        ]
      : []),
  ]
  const govdeGrup = [
    grup('parlak', [elips([-36, -26], [22, 12]), dolgu('#FFFFFF', 0.75)], tr({ r: sabit(-30), p: [-36, -26], a: [-36, -26] })),
    grup('yanak', [elips([-YANAK_X, YANAK_Y], [18, 11]), dolgu(yanak, 0.85)]),
    grup('yanak', [elips([YANAK_X, YANAK_Y], [18, 11]), dolgu(yanak, 0.85)]),
    grup('govde', [yol(GOVDE), cizgi(KAHVE, 5), dolgu(r.dolgu)]),
    grup('yaprak', [yol(YAPRAK), cizgi(KAHVE, 4), dolgu('#A8E6CF')]),
    grup('filiz', [yol(FILIZ), cizgi(KAHVE, 4)]),
  ]
  const katman = (ind: number, nm: string, shapes: unknown[], ks: Record<string, Prop>, parent?: number) => ({
    ddd: 0,
    ind,
    ty: 4,
    nm,
    sr: 1,
    ks: {
      o: sabit(100),
      r: sabit(0),
      p: sabit([0, 0, 0]),
      a: sabit([0, 0, 0]),
      s: sabit([100, 100, 100]),
      ...ks,
    },
    ao: 0,
    shapes,
    ip: 0,
    op: OP,
    st: 0,
    bm: 0,
    ...(parent ? { parent } : {}),
  })
  return {
    v: '5.7.4',
    fr: 60,
    ip: 0,
    op: OP,
    w: 200,
    h: 200,
    nm: `maskot-${ruh}-${renk}`,
    ddd: 0,
    assets: [],
    layers: [
      katman(2, 'yuz', [...ekler, ...yuzGrup], {}, 1),
      katman(1, 'govde', govdeGrup, {
        a: sabit([0, 60, 0]),
        p: kare(zipla[ruh].map(([t, v]) => [t, [...v, 0]])),
        s: kare(jole[ruh].map(([t, v]) => [t, [...v, 100]])),
      }),
    ],
  }
}

/** Düğme içi küçük ikon animasyonu: gülen kalp atar, gülen yıldız döner */
export function ikonAnim(tip: 'kalp' | 'yildiz') {
  const OPI = 40
  const sekil: Yol =
    tip === 'kalp'
      ? {
          v: [
            [0, -14],
            [34, -8],
            [0, 32],
            [-34, -8],
          ],
          i: [
            [0, -16],
            [0, -22],
            [10, -10],
            [0, 18],
          ],
          o: [
            [0, -16],
            [0, 18],
            [-10, -10],
            [0, -22],
          ],
          c: true,
        }
      : yildizYol(0, 4, 38, 19)
  const renk = tip === 'kalp' ? '#FFAAA5' : '#FFD3B6'
  const sl: [number, number[]][] =
    tip === 'kalp'
      ? [
          [0, [100, 100]],
          [8, [124, 118]],
          [16, [92, 96]],
          [24, [108, 106]],
          [32, [100, 100]],
          [OPI, [100, 100]],
        ]
      : [
          [0, [100, 100]],
          [10, [118, 118]],
          [22, [96, 96]],
          [32, [100, 100]],
          [OPI, [100, 100]],
        ]
  const r = kare(
    tip === 'kalp'
      ? [
          [0, [0]],
          [OPI, [0]],
        ]
      : [
          [0, [0]],
          [14, [-14]],
          [26, [8]],
          [OPI, [0]],
        ],
  )
  const yuz = [grup('agiz', [yol(q2yol([-6, 7], [0, 14], [6, 7])), cizgi(KAHVE, 4)]), grup('goz', [elips([-11, -1], [7, 7]), dolgu(KAHVE)]), grup('goz', [elips([11, -1], [7, 7]), dolgu(KAHVE)]), grup('sekil', [yol(sekil), cizgi(KAHVE, 6), dolgu(renk)])]
  return {
    v: '5.7.4',
    fr: 60,
    ip: 0,
    op: OPI,
    w: 100,
    h: 100,
    nm: `ikon-${tip}`,
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: tip,
        sr: 1,
        ks: {
          o: sabit(100),
          r,
          p: sabit([50, 50, 0]),
          a: sabit([0, 4, 0]),
          s: kare(sl.map(([t, v]) => [t, [...v, 100]])),
        },
        ao: 0,
        shapes: yuz,
        ip: 0,
        op: OPI,
        st: 0,
        bm: 0,
      },
    ],
  }
}
