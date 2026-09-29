import { f } from './geo'

/** 32×32 kutuda, dikey eksen (x = 16) etrafında simetrik, 1 piksel ince hatlı ikonlar */
const daire = (cx: number, cy: number, r: number) => `M${f(cx - r)} ${f(cy)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`
const ayna = (x: number) => f(32 - x)

/** Çokgen ya da yıldız: n uçlu, iç yarıçap ri, dış ro */
function yildiz(n: number, ro: number, ri: number, cx = 16, cy = 16, ofs = -Math.PI / 2) {
  const p: string[] = []
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? ro : ri
    const t = ofs + (Math.PI * i) / n
    p.push(`${f(cx + Math.cos(t) * r)} ${f(cy + Math.sin(t) * r)}`)
  }
  return 'M' + p.join('L') + 'Z'
}

function gunes() {
  const d = [daire(16, 16, 4.5)]
  for (let i = 0; i < 16; i++) {
    const t = (Math.PI * 2 * i) / 16 - Math.PI / 2
    const r1 = i % 2 === 0 ? 14 : 11
    d.push(`M${f(16 + Math.cos(t) * 8)} ${f(16 + Math.sin(t) * 8)}L${f(16 + Math.cos(t) * r1)} ${f(16 + Math.sin(t) * r1)}`)
  }
  return d
}

function rozet() {
  const d = [daire(16, 16, 2.2)]
  for (let i = 0; i < 8; i++) {
    const t = (Math.PI * 2 * i) / 8 - Math.PI / 2
    const c = Math.cos(t)
    const s = Math.sin(t)
    const x = (r: number, o: number) => f(16 + c * r - s * o)
    const y = (r: number, o: number) => f(16 + s * r + c * o)
    d.push(`M${x(3.4, 0)} ${y(3.4, 0)}Q${x(9, 4.2)} ${y(9, 4.2)} ${x(13.5, 0)} ${y(13.5, 0)}Q${x(9, -4.2)} ${y(9, -4.2)} ${x(3.4, 0)} ${y(3.4, 0)}Z`)
  }
  d.push(daire(16, 16, 14.5))
  return d
}

function defne() {
  // sol dal: kübik Bezier, yapraklar dışa (sola) ve içe (sağa) dönük sivri ovaller
  const P = [
    [16, 27.5],
    [7, 25],
    [4.5, 15],
    [8.5, 5.5],
  ]
  const nokta = (t: number) => {
    const u = 1 - t
    return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k])
  }
  const teget = (t: number) => {
    const u = 1 - t
    const d = [0, 1].map((k) => 3 * u * u * (P[1][k] - P[0][k]) + 6 * u * t * (P[2][k] - P[1][k]) + 3 * t * t * (P[3][k] - P[2][k]))
    const l = Math.hypot(d[0], d[1])
    return [d[0] / l, d[1] / l]
  }
  const yaprak = (t: number, taraf: 1 | -1, uzun: number) => {
    const [x, y] = nokta(t)
    const [tx, ty] = teget(t)
    const a = (taraf * 38 * Math.PI) / 180
    const dx = tx * Math.cos(a) - ty * Math.sin(a)
    const dy = tx * Math.sin(a) + ty * Math.cos(a)
    const ex = x + dx * uzun
    const ey = y + dy * uzun
    const nx = -dy
    const ny = dx
    const w = uzun * 0.3
    return `M${f(x)} ${f(y)}Q${f((x + ex) / 2 + nx * w)} ${f((y + ey) / 2 + ny * w)} ${f(ex)} ${f(ey)}Q${f((x + ex) / 2 - nx * w)} ${f((y + ey) / 2 - ny * w)} ${f(x)} ${f(y)}Z`
  }
  const sol = ['M16 27.5C7 25 4.5 15 8.5 5.5']
  ;[0.16, 0.4, 0.64, 0.88].forEach((t, i) => {
    sol.push(yaprak(t, 1, 6.2 - i * 0.5))
    if (i > 0) sol.push(yaprak(t + 0.08, -1, 4.4 - i * 0.4))
  })
  sol.push(yaprak(1, 1, 4))
  const yansit = (s: string) => s.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${ayna(+x)} ${y}`)
  return [...sol, ...sol.map(yansit), 'M14.5 28.4L16 26.6L17.5 28.4']
}

function inci() {
  const d = ['M4 8C6 22 26 22 28 8']
  const pt = (t: number) => {
    const u = 1 - t
    return [u * u * u * 4 + 3 * u * u * t * 6 + 3 * u * t * t * 26 + t * t * t * 28, u * u * u * 8 + 3 * u * u * t * 22 + 3 * u * t * t * 22 + t * t * t * 8]
  }
  for (const t of [0.12, 0.26, 0.4]) {
    const [x, y] = pt(t)
    d.push(daire(f(x), f(y - 0.5), 1.4), daire(ayna(x), f(y - 0.5), 1.4))
  }
  d.push('M16 19.6L18.2 22.4L16 25.6L13.8 22.4Z')
  return d
}

export const SIMGELER = {
  tac: ['M5 23L7 11L12 17L16 8L20 17L25 11L27 23Z', 'M6 26.5H26', daire(7, 8.6, 1.1), daire(16, 5.6, 1.1), daire(25, 8.6, 1.1)],
  elmas: ['M9 11L12.5 6H19.5L23 11L16 26Z', 'M9 11H23', 'M12.5 6L16 11L19.5 6', 'M12 11L16 26L20 11'],
  yuzuk: [daire(16, 21, 6.5), 'M12.5 10.5L16 5.5L19.5 10.5L16 14.5Z', 'M12.5 10.5H19.5'],
  kadeh: ['M8 7H24C24 14.5 20 18 16 18C12 18 8 14.5 8 7Z', 'M16 18V26', 'M11 26.5H21', daire(13.5, 10.5, 0.7), daire(18.5, 10.5, 0.7), daire(16, 13.5, 0.7)],
  sarap: ['M10 5H22C22 13 19.5 17 16 17C12.5 17 10 13 10 5Z', 'M10.6 9.5H21.4', 'M16 17V26', 'M11 26.5H21'],
  klos: ['M5 21C5 12 10 8.5 16 8.5C22 8.5 27 12 27 21', 'M3 21H29', 'M6 24.5H26', daire(16, 6.4, 1.6)],
  papyon: ['M4 11L14 16L4 21Z', 'M28 11L18 16L28 21Z', 'M14 13.4H18V18.6H14Z'],
  avize: ['M16 3V8', daire(16, 10, 2), 'M16 12V26', 'M8 14C8 20 24 20 24 14', 'M8 14V11', 'M24 14V11', daire(8, 9.4, 0.9), daire(24, 9.4, 0.9), 'M5 14H11', 'M21 14H27', 'M12 19.4V23', 'M20 19.4V23'],
  lamba: ['M6 8H26L22 17H10Z', 'M11 8L12.5 17', 'M21 8L19.5 17', 'M16 8V17', 'M16 17V23', 'M11 25H21', 'M13.5 23H18.5'],
  sutun: ['M7 5H25', 'M9 8H23', 'M10 8V23', 'M22 8V23', 'M13.5 8V23', 'M18.5 8V23', 'M9 23H23', 'M7 26H25'],
  kapi: ['M7 27V14C7 8.6 11 5 16 5C21 5 25 8.6 25 14V27', 'M4 27H28', 'M11 27V15C11 12 13 10 16 10C19 10 21 12 21 15V27', 'M16 10V27'],
  lir: ['M9 5C6 12 8 21 16 23C24 21 26 12 23 5', 'M8 5H24', 'M13 6V21', 'M16 6V23', 'M19 6V21', 'M12 26H20', 'M16 23V26'],
  yelpaze: ['M0.4 17A18 18 0 0 1 31.6 17', 'M16 26L0.4 17', 'M16 26L7 10.4', 'M16 26V8', 'M16 26L25 10.4', 'M16 26L31.6 17', 'M8.2 21.5A9 9 0 0 1 23.8 21.5', 'M14 26.5H18'],
  gunes: gunes(),
  yildiz: [yildiz(8, 13, 5.2), daire(16, 16, 2)],
  defne: defne(),
  vazo: ['M12 5H20', 'M13 5V9', 'M19 5V9', 'M13 9C7 13 8 22 12 26H20C24 22 25 13 19 9', 'M9.6 16H22.4', 'M10.5 22H21.5', 'M11 26.5H21'],
  kumsaati: ['M9 4H23', 'M9 28H23', 'M10 4C10 12 14 14 16 16C14 18 10 20 10 28', 'M22 4C22 12 18 14 16 16C18 18 22 20 22 28', 'M13 26H19', 'M14.5 23H17.5'],
  parfum: ['M11 12H21L24 16V25L22 27H10L8 25V16Z', 'M14 12V9H18V12', 'M13 9V5H19V9', 'M12 18H20V22H12Z'],
  inci: inci(),
  aski: [daire(16, 6, 2.2), 'M16 8.2V12', 'M16 12L4 22H28Z'],
  sapka: ['M9 22V7H23V22', 'M9 17.5H23', 'M3 22H29', 'M3 22L5 24.5H27L29 22'],
  zarf: ['M4 8H28V24H4Z', 'M4 8L16 17L28 8', 'M4 24L12 15.5', 'M28 24L20 15.5'],
  rozet: rozet(),
} as const

export type SimgeAd = keyof typeof SIMGELER
export const SIMGE_AD: Record<SimgeAd, string> = {
  tac: 'Taç',
  elmas: 'Elmas',
  yuzuk: 'Yüzük',
  kadeh: 'Şampanya',
  sarap: 'Şarap',
  klos: 'Kloş',
  papyon: 'Papyon',
  avize: 'Avize',
  lamba: 'Aplik',
  sutun: 'Sütun',
  kapi: 'Kapı',
  lir: 'Lir',
  yelpaze: 'Yelpaze',
  gunes: 'Güneş',
  yildiz: 'Yıldız',
  defne: 'Defne',
  vazo: 'Vazo',
  kumsaati: 'Kum saati',
  parfum: 'Parfüm',
  inci: 'İnci',
  aski: 'Askı',
  sapka: 'Silindir',
  zarf: 'Davet',
  rozet: 'Rozet',
}
export const TUM_SIMGELER = Object.keys(SIMGELER) as SimgeAd[]
