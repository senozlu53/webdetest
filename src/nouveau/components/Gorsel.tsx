import { useId, type ReactNode } from 'react'
import { damarAt, elips, kamci, ornekle, petalAt, rastgele, sarmasikAt, serit, sivri, yaprakAt, yumusak, type Nk } from '../lib/bitki'

/**
 * Sayfadaki "fotoğraf" yerine geçen elle çizilmiş illüstrasyonlar (Madde 9 · 11).
 * Hepsi bitkisel kıvrımlardan kurulur ve sabit bir sanat paletiyle boyanır.
 */
export type SahneAd = 'nilufer' | 'sarmasik' | 'zambak' | 'sac' | 'pavus'

export const SAHNE_AD: Record<SahneAd, string> = {
  nilufer: 'Nilüfer havuzu',
  sarmasik: 'Sarmaşık dalı',
  zambak: 'Zambak demeti',
  sac: 'Akan saçlar',
  pavus: 'Tavus kuşu tüyü',
}

interface SahneProp {
  r: () => number
  zid: string
}

const K = {
  gece: '#1B2347',
  gece2: '#2A3566',
  adaC: '#6B8E23',
  adaA: '#9DB365',
  adaK: '#47601A',
  altin: '#C5A059',
  altinA: '#E6CE94',
  gul: '#D8A47F',
  gulK: '#B8775A',
  krem: '#F5EBD3',
} as const

/** dalgalı halka (dalga çizgileri, taç halkaları) */
function dalgaHalka(cx: number, cy: number, rx: number, ry: number, gen: number, k: number, faz: number): string {
  const p: Nk[] = Array.from({ length: 36 }, (_, i) => {
    const t = (i / 36) * Math.PI * 2
    const m = 1 + gen * Math.sin(k * t + faz)
    return [cx + Math.cos(t) * rx * m, cy + Math.sin(t) * ry * m] as Nk
  })
  return yumusak(p, true)
}

function Nilufer({ r, zid }: SahneProp) {
  const halkalar = Array.from({ length: 6 }, (_, i) => ({
    d: dalgaHalka(200, 392 + i * 3, 70 + i * 44, 12 + i * 8, 0.03, 5 + (i % 3), i),
    o: 0.65 - i * 0.09,
  }))
  const pads = [
    [96, 420, 74, 20],
    [318, 442, 86, 24],
    [214, 468, 60, 16],
  ]
  const on = Array.from({ length: 9 }, (_, i) => -Math.PI + 0.22 + (i / 8) * (Math.PI - 0.44))
  return (
    <>
      <rect width="400" height="500" fill={`url(#${zid})`} />
      {halkalar.map((h, i) => (
        <path key={i} d={h.d} fill="none" stroke={K.altin} strokeWidth="1.2" opacity={h.o} />
      ))}
      {pads.map(([x, y, rx, ry], i) => (
        <g key={i}>
          <path d={elips(x, y, rx, ry)} fill={i === 1 ? K.adaK : K.adaC} stroke={K.adaA} strokeWidth="1.5" />
          <path d={`M${x} ${y}L${x + rx * 0.95} ${y - ry * 0.25}`} stroke={K.adaA} strokeWidth="1" />
          <path d={`M${x} ${y}Q${x - rx * 0.4} ${y - ry * 0.5} ${x - rx * 0.8} ${y - ry * 0.3}`} fill="none" stroke={K.adaA} strokeWidth=".8" opacity=".7" />
        </g>
      ))}
      <path
        d={serit(
          ornekle(
            [
              [190, 500],
              [212, 440],
              [188, 380],
              [200, 330],
            ],
            8,
          ),
          (t) => 6 - t * 3,
        )}
        fill={K.adaC}
      />
      {on.map((a, i) => petalAt(200, 330, a, 96 - Math.abs(i - 4) * 9, 1, 0.26).map((d) => <path key={`b${i}`} d={d} fill={K.krem} stroke={K.gulK} strokeWidth="1" opacity=".96" />))}
      {on.filter((_, i) => i % 2 === 0).map((a, i) => petalAt(200, 334, a + 0.09, 66 - Math.abs(i - 2) * 6, 1, 0.3).map((d) => <path key={`f${i}`} d={d} fill={K.gul} stroke={K.gulK} strokeWidth="1" />))}
      {Array.from({ length: 11 }, (_, i) => {
        const a = -Math.PI + 0.3 + (i / 10) * (Math.PI - 0.6)
        const x = 200 + Math.cos(a) * 34
        const y = 330 + Math.sin(a) * 34
        return (
          <g key={i}>
            <path d={`M200 334Q${(200 + x) / 2 + (r() - 0.5) * 6} ${(334 + y) / 2} ${x} ${y}`} fill="none" stroke={K.altin} strokeWidth="1.1" />
            <circle cx={x} cy={y} r="2.2" fill={K.altinA} />
          </g>
        )
      })}
      {[72, 132, 300, 352].map((x, i) => (
        <path
          key={i}
          d={sivri(
            kamci(x, 500, 120 + i * 20, -Math.PI / 2 + (i % 2 ? 0.25 : -0.25), {
              donus: 0.9,
              dalga: 0.3,
              us: 2.6,
              yon: i % 2 ? 1 : -1,
              n: 40,
            }),
            3.6,
            0.5,
            0.8,
          )}
          fill={K.adaA}
          opacity=".8"
        />
      ))}
    </>
  )
}

function Sarmasik({ r, zid }: SahneProp) {
  const omurga = ornekle(
    [
      [-20, 500],
      [90, 440],
      [150, 350],
      [110, 270],
      [190, 200],
      [300, 170],
      [360, 90],
      [430, 40],
    ],
    10,
  )
  const yaprak: ReactNode[] = []
  const cizim = [K.krem, K.altinA, K.adaA, K.gul]
  for (let i = 6; i < omurga.length - 4; i += 5) {
    const [x, y] = omurga[i]
    const [x2, y2] = omurga[i + 1]
    const a = Math.atan2(y2 - y, x2 - x)
    const yon = (i / 5) % 2 ? 1 : -1
    const boy = 46 + r() * 30
    yaprak.push(
      <g key={i}>
        <path d={sarmasikAt(x, y, a + yon * (1 + r() * 0.5), boy)} fill={cizim[((i / 5) % 4) | 0]} stroke={K.adaK} strokeWidth="1.2" />
        <path d={damarAt(x, y, a + yon * 1.1, boy * 0.95)} fill="none" stroke={K.adaK} strokeWidth="1" opacity=".7" />
      </g>,
    )
  }
  return (
    <>
      <rect width="400" height="500" fill={`url(#${zid})`} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={dalgaHalka(200, 250, 320 - i * 60, 380 - i * 70, 0.04, 6, i * 2)} fill="none" stroke={K.altin} strokeWidth="1" opacity={0.28 - i * 0.06} />
      ))}
      <path d={yumusak(omurga)} fill="none" stroke={K.altin} strokeWidth="5" strokeLinecap="round" />
      {yaprak}
      {[12, 32, 50].map((i, k) => {
        const [x, y] = omurga[i]
        return (
          <path
            key={k}
            d={sivri(
              kamci(x, y, 90 + k * 14, -1.2 + k * 0.9, {
                donus: 1.2,
                dalga: 0.6,
                us: 2.3,
                yon: k % 2 ? 1 : -1,
                n: 40,
              }),
              3.4,
              0.5,
              0.9,
            )}
            fill={K.altinA}
          />
        )
      })}
    </>
  )
}

function Zambak({ r, zid }: SahneProp) {
  const govde = [
    {
      p: [
        [120, 520],
        [150, 400],
        [110, 300],
        [140, 200],
      ],
      c: [140, 200],
      boy: 92,
    },
    {
      p: [
        [220, 520],
        [230, 420],
        [280, 330],
        [260, 240],
      ],
      c: [260, 240],
      boy: 78,
    },
    {
      p: [
        [300, 520],
        [320, 440],
        [340, 360],
        [330, 300],
      ],
      c: [330, 300],
      boy: 62,
    },
  ] as const
  return (
    <>
      <rect width="400" height="500" fill={`url(#${zid})`} />
      {govde.map((g, i) => (
        <path key={`s${i}`} d={serit(ornekle(g.p as unknown as Nk[], 8), (t) => 6.5 - t * 3)} fill={K.gece} />
      ))}
      {[
        [130, 420, -2.6],
        [240, 400, -0.5],
        [110, 320, -0.4],
        [300, 400, -2.4],
      ].map(([x, y, a], i) => (
        <path key={`y${i}`} d={yaprakAt(x, y, a, 100, 15)} fill={K.adaC} stroke={K.gece} strokeWidth="1.2" />
      ))}
      {govde.map((g, i) => {
        const [cx, cy] = g.c
        const yon = i % 2 ? 0.55 : -0.5
        return (
          <g key={`c${i}`}>
            {petalAt(cx, cy, -Math.PI / 2 + yon, g.boy, 6, 0.32).map((d, j) => (
              <path key={j} d={d} fill={j % 2 ? K.krem : K.altinA} stroke={K.gece} strokeWidth="1.3" />
            ))}
            {Array.from({ length: 5 }, (_, j) => {
              const a = -Math.PI / 2 + yon + (j - 2) * 0.36
              const x = cx + Math.cos(a) * g.boy * 0.62
              const y = cy + Math.sin(a) * g.boy * 0.62
              return (
                <g key={j}>
                  <path d={`M${cx} ${cy}L${x} ${y}`} stroke={K.gece} strokeWidth="1.2" />
                  <ellipse cx={x} cy={y} rx="3" ry="6" fill={K.gulK} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} />
                </g>
              )
            })}
          </g>
        )
      })}
      <path
        d={sivri(
          kamci(60, 300, 150, -0.9, {
            donus: 1.2,
            dalga: 0.7,
            us: 2.2,
            yon: -1,
            n: 44,
          }),
          4,
          0.6,
          0.9,
        )}
        fill={K.gulK}
        opacity=".7"
      />
      <circle cx={70 + r() * 6} cy="90" r="3" fill={K.altin} />
    </>
  )
}

function Sac({ r, zid }: SahneProp) {
  const teller = Array.from({ length: 20 }, (_, i) => {
    const yon: 1 | -1 = r() < 0.5 ? 1 : -1
    const aci = Math.PI / 2 + (i - 9.5) * 0.09 + (r() - 0.5) * 0.06
    const pts = kamci(196 + (i - 9.5) * 3.4, 214, 250 + r() * 130, aci, {
      donus: 0.7 + r() * 0.9,
      dalga: 1.1 + r() * 1.1,
      us: 2.3 + r() * 0.7,
      yon,
      n: 76,
    })
    const c = i % 7 === 3 ? K.gulK : i % 9 === 5 ? K.adaK : i % 5 === 2 ? K.gece2 : K.gece
    return {
      d: sivri(pts, 4.5 + r() * 6.5, 0.6, 0.75),
      c,
      o: i % 6 === 1 ? 0.6 : 0.95,
    }
  })
  return (
    <>
      <rect width="400" height="500" fill={`url(#${zid})`} />
      <circle cx="200" cy="200" r="152" fill={K.krem} fillOpacity=".38" stroke={K.gece} strokeWidth="2" />
      <circle cx="200" cy="200" r="139" fill="none" stroke={K.gece} strokeWidth="1" opacity=".55" />
      {Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2
        return <circle key={i} cx={200 + Math.cos(a) * 145.5} cy={200 + Math.sin(a) * 145.5} r="2" fill={K.gulK} />
      })}
      {teller.map((t, i) => (
        <path key={i} d={t.d} fill={t.c} opacity={t.o} />
      ))}
      {[-1, 1].map((yon) => (
        <path key={yon} d={yaprakAt(200 + yon * 12, 196, -Math.PI / 2 + yon * 1.05, 92, 22)} fill={K.adaC} stroke={K.gece} strokeWidth="1.3" />
      ))}
      {petalAt(200, 186, -Math.PI / 2, 46, 7, 0.34).map((d, i) => (
        <path key={i} d={d} fill={i % 2 ? K.altinA : K.krem} stroke={K.gece} strokeWidth="1.3" />
      ))}
      <circle cx="200" cy="186" r="7" fill={K.gulK} stroke={K.gece} strokeWidth="1.2" />
    </>
  )
}

function Pavus({ r, zid }: SahneProp) {
  const omurga: Nk[] = ornekle(
    [
      [200, 520],
      [212, 430],
      [190, 340],
      [206, 250],
      [200, 190],
    ],
    10,
  )
  const barb = Array.from({ length: 46 }, (_, i) => {
    const t = 0.02 + (i / 46) * 0.92
    const idx = Math.floor(t * (omurga.length - 1))
    const [x, y] = omurga[idx]
    const yon = i % 2 ? 1 : -1
    const boy = 96 * Math.sin(Math.PI * (0.18 + t * 0.7)) + 34
    const a0 = -Math.PI / 2 + yon * (1.15 - t * 0.5)
    const p: Nk[] = [
      [x, y],
      [x + Math.cos(a0) * boy * 0.4 + yon * 4, y + Math.sin(a0) * boy * 0.4],
      [x + Math.cos(a0 + yon * 0.35) * boy, y + Math.sin(a0 + yon * 0.35) * boy * 0.9 + 10],
    ]
    return {
      d: yumusak(p),
      c: i % 3 === 0 ? K.altin : i % 3 === 1 ? K.adaA : K.gul,
    }
  })
  return (
    <>
      <rect width="400" height="500" fill={`url(#${zid})`} />
      {barb.map((b, i) => (
        <path key={i} d={b.d} fill="none" stroke={b.c} strokeWidth="1.6" strokeLinecap="round" opacity=".85" />
      ))}
      <path d={yumusak(omurga)} fill="none" stroke={K.altinA} strokeWidth="3.4" strokeLinecap="round" />
      {[
        [66, 84, K.adaC],
        [50, 68, K.altin],
        [34, 52, K.gece],
        [20, 38, K.gul],
        [8, 22, K.gece2],
      ].map(([rx, ry, c], i) => (
        <path key={i} d={dalgaHalka(204, 172, rx as number, ry as number, 0.035, 7, i + r())} fill={c as string} stroke={K.gece} strokeWidth="1.2" />
      ))}
      <path d={dalgaHalka(204, 172, 26, 40, 0.03, 7, 1)} fill="none" stroke={K.altinA} strokeWidth="1" opacity=".7" />
    </>
  )
}

const SAHNELER: Record<SahneAd, (p: SahneProp) => ReactNode> = {
  nilufer: Nilufer,
  sarmasik: Sarmasik,
  zambak: Zambak,
  sac: Sac,
  pavus: Pavus,
}

const ZEMIN: Record<SahneAd, [string, string]> = {
  nilufer: [K.gece, K.gece2],
  sarmasik: ['#33470F', '#587A1C'],
  zambak: ['#E9C9A6', '#D8A47F'],
  sac: ['#E6CE94', '#C5A059'],
  pavus: ['#141A36', '#2A3566'],
}

/** İllüstrasyon. `konum`: slice kırpmasında öne çıkacak nokta (preserveAspectRatio hizası) */
export function Gorsel({ sahne, tohum = 1, konum = 'xMidYMid', className, etiket }: { sahne: SahneAd; tohum?: number; konum?: string; className?: string; etiket?: string }) {
  const uid = useId().replace(/:/g, '')
  const zid = `zg${uid}`
  const Sahne = SAHNELER[sahne]
  const [a, b] = ZEMIN[sahne]
  const r = rastgele(tohum * 977 + sahne.length)
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio={`${konum} slice`} className={className ?? 'block h-full w-full'} role="img" aria-label={etiket ?? SAHNE_AD[sahne]} data-sahne={sahne}>
      <defs>
        <linearGradient id={zid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <Sahne r={r} zid={zid} />
    </svg>
  )
}
