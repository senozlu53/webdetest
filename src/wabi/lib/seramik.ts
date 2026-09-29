/**
 * El yapımı seramik siluetleri (Madde 2 · 8 · 11): çarkta çekilmiş gibi iki yanı birbirinden farklı formlar.
 * Profil yükseklik → yarı genişlik çiftleridir; kusur çarpanı sıfırken form kusursuz simetriktir.
 */
import { ornekle, rastgele, serit, yumusak, type Nk } from './organik'

export type SeramikTur = 'vazo' | 'testi' | 'kase' | 'cay' | 'tabak' | 'tas'
export type Sir = 'kil' | 'kul' | 'yaprak' | 'mat'

interface Profil {
  w: number
  h: number
  /** [yükseklik oranı, yarı genişlik px] */
  p: [number, number][]
  /** ağız elipsinin dikey yarıçapı */
  agiz: number
  ad: string
}
export const PROFIL: Record<Exclude<SeramikTur, 'tas'>, Profil> = {
  vazo: {
    w: 200,
    h: 300,
    ad: 'Vazo',
    agiz: 6,
    p: [
      [0, 25],
      [0.06, 20],
      [0.17, 27],
      [0.33, 52],
      [0.55, 72],
      [0.78, 66],
      [0.93, 45],
      [1, 41],
    ],
  },
  testi: {
    w: 200,
    h: 300,
    ad: 'Testi',
    agiz: 4,
    p: [
      [0, 17],
      [0.09, 14],
      [0.3, 19],
      [0.43, 42],
      [0.62, 68],
      [0.85, 63],
      [0.97, 47],
      [1, 44],
    ],
  },
  kase: {
    w: 240,
    h: 140,
    ad: 'Kase',
    agiz: 20,
    p: [
      [0, 108],
      [0.14, 104],
      [0.45, 86],
      [0.8, 54],
      [0.95, 41],
      [1, 38],
    ],
  },
  cay: {
    w: 160,
    h: 130,
    ad: 'Çay kasesi',
    agiz: 10,
    p: [
      [0, 58],
      [0.1, 57],
      [0.5, 52],
      [0.9, 45],
      [1, 42],
    ],
  },
  tabak: {
    w: 280,
    h: 70,
    ad: 'Tabak',
    agiz: 15,
    p: [
      [0, 128],
      [0.28, 120],
      [0.85, 78],
      [1, 72],
    ],
  },
}

export interface Glaze {
  govde: string
  sir: string
  damla: string
  nokta: string
  cizgi: string
  ic: string
}
export const SIR: Record<Sir, Glaze> = {
  kil: { govde: '#cfc6bb', sir: '#e2dbd2', damla: '#efeae3', nokta: '#6e6259', cizgi: '#5e5148', ic: '#a99f93' },
  kul: { govde: '#a29a91', sir: '#b6afa6', damla: '#d3ccc4', nokta: '#4a4542', cizgi: '#3d3733', ic: '#7d756d' },
  yaprak: { govde: '#7a6a5f', sir: '#8c7b70', damla: '#b0a8a0', nokta: '#2f2621', cizgi: '#2b241f', ic: '#54463d' },
  mat: { govde: '#1e1b19', sir: '#2a2725', damla: '#4a4542', nokta: '#8c8279', cizgi: '#0f0d0c', ic: '#0f0d0c' },
}
export const SIR_AD: Record<Sir, string> = { kil: 'Ham kil', kul: 'Kül sırlı', yaprak: 'Kurumuş yaprak', mat: 'Mat siyah' }

export interface SeramikGeometri {
  w: number
  h: number
  govde: string
  agiz: string
  agizYay: string
  sirYolu: string
  halkalar: string[]
  noktalar: { x: number; y: number; r: number; o: number }[]
  catlak: string
  zemin: string
  /** ağız merkezi (dal buraya yerleştirilir) */
  agizMerkez: Nk
  tas: boolean
}

function agizYolu(cx: number, cy: number, rx: number, ry: number, r: () => number, k: number): string {
  const pts: Nk[] = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2
    return [cx + Math.cos(a) * rx * (1 + (r() - 0.5) * 0.04 * k), cy + Math.sin(a) * ry * (1 + (r() - 0.5) * 0.08 * k)] as Nk
  })
  return yumusak(pts, true, 1, 1)
}

/** Seramik geometrisi. `k`: kusur çarpanı, `sirOran`: sırın gövdede indiği oran */
export function seramik(tur: SeramikTur, tohum: number, k = 1, sirOran = 0.42): SeramikGeometri {
  const r = rastgele(tohum)
  if (tur === 'tas') {
    const w = 220
    const h = 130
    const pts: Nk[] = Array.from({ length: 11 }, (_, i) => {
      const a = (i / 11) * Math.PI * 2
      const yat = 1 + (r() - 0.5) * 0.22 * k
      const rx = 96 * (1 + (r() - 0.5) * 0.18 * k)
      const ry = 46 * (1 + (r() - 0.5) * 0.3 * k)
      const y = Math.sin(a)
      return [w / 2 + Math.cos(a) * rx * yat, h - 58 + y * ry + (y > 0 ? 0 : -6)] as Nk
    })
    const noktalar = Array.from({ length: 46 }, () => ({ x: 30 + r() * 160, y: 30 + r() * 80, r: 0.5 + r() * 1.2, o: 0.2 + r() * 0.45 }))
    return {
      w,
      h,
      govde: yumusak(pts, true, 1, 1),
      agiz: '',
      agizYay: '',
      sirYolu: '',
      halkalar: [`M${60 + r() * 12} ${h - 66}C${90 + r() * 20} ${h - 76} ${130 + r() * 20} ${h - 70} ${160 + r() * 12} ${h - 60}`],
      noktalar,
      catlak: '',
      zemin: `M14 ${h - 6}C60 ${h - 9} 150 ${h - 3} ${w - 10} ${h - 6}`,
      agizMerkez: [w / 2, 30],
      tas: true,
    }
  }
  const pr = PROFIL[tur]
  const cx = pr.w / 2
  const egim = (r() - 0.5) * 7 * k
  const sol: Nk[] = []
  const sag: Nk[] = []
  let js = 0
  let jr = 0
  pr.p.forEach(([oy, hw], i) => {
    js = js * 0.5 + (r() - 0.5) * 0.075 * k
    jr = jr * 0.5 + (r() - 0.5) * 0.075 * k
    const y = pr.h * oy + (i === pr.p.length - 1 ? -1 : 0) + (r() - 0.5) * 0.8 * k
    const kayma = egim * (1 - oy)
    sol.push([cx - hw * (1 + js) + kayma, y])
    sag.push([cx + hw * (1 + jr) + kayma, y])
  })
  const ay = pr.agiz
  const ust = sol[0]
  const ustSag = sag[0]
  const mx = (ust[0] + ustSag[0]) / 2
  const mrx = (ustSag[0] - ust[0]) / 2
  // silüet: sağ yukarıdan aşağı, sol aşağıdan yukarı, sonra ağzın arka yayı (soldan sağa)
  const yol: Nk[] = [...sag, ...sol.slice().reverse()]
  for (let i = 0; i < 5; i++) {
    const a = Math.PI - ((i + 1) / 6) * Math.PI
    yol.push([mx + Math.cos(a) * mrx, ust[1] - Math.sin(a) * ay])
  }
  const govde = yumusak(yol, true, 0.95, 1)
  const agiz = agizYolu(mx, ust[1], mrx * 0.98, ay, r, k)
  const agizYay = `M${(ust[0] + 0.5).toFixed(1)} ${ust[1].toFixed(1)}A${mrx.toFixed(1)} ${ay} 0 0 0 ${ustSag[0].toFixed(1)} ${ustSag[1].toFixed(1)}`
  // sır çizgisi: dalgalı, damlalı
  const sy = pr.h * sirOran
  const sirPts: Nk[] = []
  const N = 9
  for (let i = 0; i <= N; i++) {
    const x = -8 + ((pr.w + 16) * i) / N
    const damla = r() < 0.22 ? 12 + r() * 26 * k : 0
    sirPts.push([x, sy + (r() - 0.5) * 14 * k + Math.sin(i * 1.3) * 5 * k + damla])
  }
  const sirKenar = yumusak(sirPts.slice().reverse(), false, 1, 1)
  const sirYolu = `M-10 -10L${pr.w + 10} -10L${sirKenar.slice(1)}Z`
  // atölye halkaları: çarkta çekerken kalan yatay izler
  const halkalar = [0.22, 0.42, 0.63, 0.8].map((o, i) => {
    const y = pr.h * o + (r() - 0.5) * 3 * k
    const hw = pr.p.reduce((acc, [oy, w], j, a) => (oy <= o && (a[j + 1]?.[0] ?? 1) >= o ? w + ((a[j + 1]?.[1] ?? w) - w) * ((o - oy) / ((a[j + 1]?.[0] ?? 1) - oy || 1)) : acc), 0)
    const c = cx + egim * (1 - o)
    return `M${(c - hw * 0.96).toFixed(1)} ${y.toFixed(1)}Q${c.toFixed(1)} ${(y + 5 + i).toFixed(1)} ${(c + hw * 0.96).toFixed(1)} ${(y + (r() - 0.5) * 2 * k).toFixed(1)}`
  })
  const noktalar = Array.from({ length: 70 }, () => ({ x: r() * pr.w, y: r() * pr.h, r: 0.45 + r() * 1.1, o: 0.18 + r() * 0.5 }))
  // ince çatlak: ağızdan aşağı
  const cx0 = mx + (r() - 0.3) * mrx
  const cp: Nk[] = [[cx0, ust[1] + 2]]
  const cLen = 0.16 + r() * 0.12
  let px = cx0
  for (let i = 1; i <= 5; i++) {
    px += (r() - 0.5) * 9
    cp.push([px, ust[1] + (pr.h * cLen * i) / 5])
  }
  const catlak = yumusak(cp, false, 1, 1)
  const zemin = `M${(cx - pr.w * 0.46).toFixed(1)} ${(pr.h + 2).toFixed(1)}C${(cx - pr.w * 0.2).toFixed(1)} ${(pr.h + 4 + (r() - 0.5) * 2 * k).toFixed(1)} ${(cx + pr.w * 0.2).toFixed(1)} ${(pr.h + 1 + (r() - 0.5) * 2 * k).toFixed(1)} ${(cx + pr.w * 0.46).toFixed(1)} ${(pr.h + 2).toFixed(1)}`
  return { w: pr.w, h: pr.h, govde, agiz, agizYay, sirYolu, halkalar, noktalar, catlak, zemin, agizMerkez: [mx, ust[1]], tas: false }
}

/** Kurumuş dal: ağızdan yükselen tek ince dal, iki yan dal ve birkaç kuru yaprak */
export function dal(tohum: number, k = 1, boy = 190) {
  const r = rastgele(tohum)
  const ana = ornekle(
    [
      [0, 0],
      [-6 * (1 + k * 0.3), -boy * 0.3],
      [10 * (1 + k * 0.2), -boy * 0.62],
      [2, -boy],
    ] as Nk[],
    8,
  )
  const yan = (idx: number, yon: number, uz: number) => {
    const [x, y] = ana[Math.round((ana.length - 1) * idx)]
    return ornekle(
      [
        [x, y],
        [x + yon * uz * 0.5, y - uz * 0.35 + (r() - 0.5) * 6],
        [x + yon * uz, y - uz * 0.75 + (r() - 0.5) * 8],
      ] as Nk[],
      6,
    )
  }
  const dallar = [yan(0.42, 1, 58), yan(0.62, -1, 44), yan(0.8, 1, 28)]
  const yapraklar = dallar.map((d) => d[d.length - 1]).concat([ana[ana.length - 1]])
  return {
    ana: serit(ana, (t) => 2.6 - t * 1.8),
    dallar: dallar.map((d) => serit(d, (t) => 1.6 - t * 1.1)),
    yapraklar: yapraklar.map(([x, y], i) => ({ x, y, a: (r() - 0.5) * 1.6 + (i % 2 ? 0.7 : -0.7) })),
  }
}
