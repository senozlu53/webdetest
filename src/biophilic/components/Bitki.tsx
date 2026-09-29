import { useId, useMemo, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { damarAt, ornekle, rastgele, serit, yaprakAt, type Nk } from '../lib/organik'

/* Zamanla değişen renkler CSS değişkenlerinden gelir; saksı ve ahşap, gökyüzüyle harmanlanır */
const SAKSI = 'color-mix(in srgb, #d3a67a 74%, var(--zg-2))'
const SAKSI_KENAR = 'color-mix(in srgb, #e6c29c 74%, var(--zg-2))'
const AHSAP = 'color-mix(in srgb, #b98c5e 84%, var(--yaprak-3))'
const AHSAP_KOYU = 'color-mix(in srgb, #8f6740 84%, var(--yaprak-3))'
const RENK = ['var(--yaprak-2)', 'var(--yaprak-3)', 'var(--yaprak-1)'] as const

function Saksi({ x = 100, y = 200, w = 76, h = 52 }: { x?: number; y?: number; w?: number; h?: number }) {
  const l = x - w / 2
  const r = x + w / 2
  return (
    <g>
      <ellipse cx={x} cy={y + h + 4} rx={w * 0.52} ry={5} fill="rgb(0 0 0 / .14)" />
      <path d={`M${l} ${y}H${r}L${r - 8} ${y + h}Q${r - 9} ${y + h + 5} ${r - 16} ${y + h + 5}H${l + 16}Q${l + 9} ${y + h + 5} ${l + 8} ${y + h}Z`} style={{ fill: SAKSI }} />
      <rect x={l - 3} y={y - 8} width={w + 6} height={13} rx={6.5} style={{ fill: SAKSI_KENAR }} />
    </g>
  )
}

/* ───────────────────────── Monstera ───────────────────────── */
const MON_YAPRAK = 'M0 0C-26 -2 -44 -22 -42 -46C-40 -66 -20 -78 0 -78C20 -78 40 -66 42 -46C44 -22 26 -2 0 0Z'
const MON_YARIK = 'M-2 -20L-34 -22M-2 -35L-41 -42M-2 -51L-33 -63M2 -20L34 -22M2 -35L41 -42M2 -51L33 -63'
const MON_DUZEN = [
  { x: 58, y: 118, r: -40, s: 1.0 },
  { x: 144, y: 108, r: 36, s: 1.06 },
  { x: 100, y: 74, r: -4, s: 1.16 },
  { x: 66, y: 168, r: -72, s: 0.8 },
  { x: 136, y: 164, r: 68, s: 0.84 },
]
function Monstera() {
  const m = useId()
  return (
    <g>
      <defs>
        <mask id={m} maskUnits="userSpaceOnUse" x="-60" y="-100" width="120" height="120">
          <path d={MON_YAPRAK} fill="#fff" />
          <path d={MON_YARIK} stroke="#000" strokeWidth="5" strokeLinecap="round" fill="none" />
        </mask>
      </defs>
      <g className="salin" style={{ transformOrigin: '100px 204px', ['--r-gen' as string]: 1.6 } as CSSProperties}>
        {MON_DUZEN.map((y, i) => (
          <path key={`s${i}`} d={`M100 206Q${(100 + y.x) / 2 + (i % 2 ? 6 : -6)} ${y.y + (206 - y.y) * 0.55} ${y.x} ${y.y}`} fill="none" strokeWidth="3.2" strokeLinecap="round" style={{ stroke: 'var(--yaprak-3)' }} />
        ))}
        {MON_DUZEN.map((y, i) => (
          <g key={i} transform={`translate(${y.x} ${y.y}) rotate(${y.r}) scale(${y.s})`}>
            <path d={MON_YAPRAK} mask={`url(#${m})`} style={{ fill: RENK[i % 3] }} />
            <path d="M0 -2V-70" stroke="rgb(255 255 255 / .3)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </g>
        ))}
      </g>
      <Saksi />
    </g>
  )
}

/* ───────────────────────── Kauçuk (Ficus elastica) ───────────────────────── */
function Kaucuk() {
  const g = useMemo(() => {
    const govde = ornekle(
      [
        [100, 206],
        [96, 160],
        [104, 116],
        [98, 66],
        [102, 30],
      ] as Nk[],
      8,
    )
    const yapraklar = Array.from({ length: 9 }, (_, i) => {
      const idx = Math.round(((i + 1) / 10) * (govde.length - 1))
      const [x, y] = govde[idx]
      const taraf = i % 2 ? 1 : -1
      const aci = -Math.PI / 2 + taraf * (0.95 - i * 0.03)
      const boy = 62 - i * 2.6
      return { d: yaprakAt(x, y, aci, boy, boy * 0.3, 0.1), damar: damarAt(x, y, aci, boy), k: i % 2 ? 1 : 0 }
    })
    return { govde: serit(govde, (t) => 5 - t * 3), yapraklar }
  }, [])
  return (
    <g>
      <g className="salin" style={{ transformOrigin: '100px 204px', ['--r-gen' as string]: 1.3 } as CSSProperties}>
        <path d={g.govde} style={{ fill: 'var(--yaprak-3)' }} />
        {g.yapraklar.map((y, i) => (
          <g key={i}>
            <path d={y.d} style={{ fill: RENK[y.k] }} />
            <path d={y.damar} fill="none" stroke="rgb(255 255 255 / .34)" strokeWidth="1.3" strokeLinecap="round" />
          </g>
        ))}
      </g>
      <Saksi />
    </g>
  )
}

/* ───────────────────────── Eğrelti ───────────────────────── */
function Egrelti() {
  const yapraklar = useMemo(() => {
    const r = rastgele(3)
    return Array.from({ length: 9 }, (_, i) => {
      const a = -Math.PI + 0.32 + (i / 8) * (Math.PI - 0.64)
      const L = 96 + r() * 26 - Math.abs(i - 4) * 3
      const bx = 100
      const by = 204
      const tip: Nk = [bx + Math.cos(a) * L, by + Math.sin(a) * L + 28 + Math.abs(Math.cos(a)) * 22]
      const kontrol: Nk = [bx + Math.cos(a) * L * 0.5, by + Math.sin(a) * L * 1.08]
      const nk = Array.from({ length: 13 }, (_, k) => {
        const t = k / 12
        const u = 1 - t
        return [u * u * bx + 2 * u * t * kontrol[0] + t * t * tip[0], u * u * by + 2 * u * t * kontrol[1] + t * t * tip[1]] as Nk
      })
      let d = ''
      for (let k = 2; k < nk.length; k++) {
        const p = nk[k]
        const q = nk[k - 1]
        const th = Math.atan2(p[1] - q[1], p[0] - q[0])
        const boy = (26 - k * 1.6) * (0.9 + r() * 0.2)
        d += yaprakAt(p[0], p[1], th - 1.15, boy, boy * 0.3, 0.08) + yaprakAt(p[0], p[1], th + 1.15, boy, boy * 0.3, 0.08)
      }
      return { d, sap: serit(nk, (t) => 2.6 - t * 1.6), k: i % 3 }
    })
  }, [])
  return (
    <g>
      <g className="salin" style={{ transformOrigin: '100px 204px', ['--r-gen' as string]: 2 } as CSSProperties}>
        {yapraklar.map((y, i) => (
          <g key={i}>
            <path d={y.sap} style={{ fill: 'var(--yaprak-3)' }} />
            <path d={y.d} style={{ fill: RENK[y.k] }} />
          </g>
        ))}
      </g>
      <Saksi y={202} />
    </g>
  )
}

/* ───────────────────────── Sukulent (rozet) ───────────────────────── */
function Sukulent() {
  const halkalar = useMemo(() => {
    const cx0 = 100
    const cy0 = 176
    const yap = (n: number, faz: number, boy: number, en: number, a0: number, a1: number, k: number) =>
      Array.from({ length: n }, (_, i) => {
        const a = a0 + ((i + faz) / (n - 1 + (faz ? 0 : 0))) * (a1 - a0)
        return { d: yaprakAt(cx0, cy0, a, boy, en, 0.05), k }
      })
    return [...yap(9, 0, 74, 15, -Math.PI + 0.14, -0.14, 1), ...yap(7, 0, 58, 14, -Math.PI + 0.3, -0.3, 0), ...yap(5, 0, 40, 12, -Math.PI + 0.55, -0.55, 2), ...yap(3, 0, 24, 9, -Math.PI + 0.9, -0.9, 0)]
  }, [])
  return (
    <g>
      <g className="salin" style={{ transformOrigin: '100px 204px', ['--r-gen' as string]: 0.9 } as CSSProperties}>
        {halkalar.map((y, i) => (
          <path key={i} d={y.d} style={{ fill: RENK[y.k] }} stroke="rgb(255 255 255 / .2)" strokeWidth="1" />
        ))}
      </g>
      <Saksi x={100} y={176} w={92} h={34} />
    </g>
  )
}

export type BitkiTur = 'monstera' | 'kaucuk' | 'egrelti' | 'sukulent'
export const BITKI_AD: Record<BitkiTur, string> = { monstera: 'Deve tabanı', kaucuk: 'Kauçuk', egrelti: 'Eğrelti otu', sukulent: 'Sukulent' }

/** Zamana uyan bitki çizimi. Yaprak renkleri günün saatine göre değişir; tam seviyede rüzgârda hafifçe salınır */
export function Bitki({ tur, className, etiket, style }: { tur: BitkiTur; className?: string; etiket?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 200 270" className={cx('overflow-visible', className)} style={style} role={etiket ? 'img' : undefined} aria-label={etiket} aria-hidden={etiket ? undefined : true} data-bitki={tur} focusable="false">
      {tur === 'monstera' ? <Monstera /> : tur === 'kaucuk' ? <Kaucuk /> : tur === 'egrelti' ? <Egrelti /> : <Sukulent />}
    </svg>
  )
}

/* ───────────────────────── Mekânlar (biofilik ofis portfolyosu) ───────────────────────── */

export type MekanTur = 'atrium' | 'salon' | 'cati'
function Gok({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" style={{ stopColor: 'var(--zg-1)' }} />
      <stop offset=".58" style={{ stopColor: 'var(--zg-2)' }} />
      <stop offset="1" style={{ stopColor: 'var(--zg-3)' }} />
    </linearGradient>
  )
}
const GUNES_STIL: CSSProperties = { translate: 'calc(var(--gunes-x) * 320px) calc(var(--gunes-y) * 150px)', fill: 'var(--isik-renk)' }

function Atrium({ g, c }: { g: string; c: string }) {
  return (
    <>
      <defs>
        <Gok id={g} />
        <clipPath id={c}>
          <path d="M26 292V128Q26 30 200 30Q374 30 374 128V292Z" />
        </clipPath>
      </defs>
      <rect width="400" height="300" style={{ fill: 'var(--zg-3)' }} opacity=".35" />
      <g clipPath={`url(#${c})`}>
        <rect x="0" y="0" width="400" height="300" fill={`url(#${g})`} />
        <circle cx="40" cy="30" r="26" style={GUNES_STIL} opacity=".92" />
        <path d="M0 210Q90 160 190 200T400 176V300H0Z" style={{ fill: 'var(--yaprak-1)' }} />
        <path d="M0 240Q120 200 220 234T400 220V300H0Z" style={{ fill: 'var(--yaprak-2)' }} />
        {/* ortadaki ağaç */}
        <path d="M194 262C196 220 190 190 186 150M206 262C204 222 212 190 216 150M200 200C200 170 200 150 200 120" style={{ stroke: AHSAP_KOYU }} strokeWidth="7" strokeLinecap="round" fill="none" />
        {[
          [200, 84, 62],
          [158, 118, 44],
          [244, 116, 46],
          [180, 150, 38],
          [224, 150, 40],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} style={{ fill: RENK[i % 3] }} opacity=".96" />
        ))}
      </g>
      {/* çelik-cam iskelet */}
      <g fill="none" strokeLinecap="round" stroke="rgb(255 255 255 / .8)" strokeWidth="2.2">
        <path d="M26 292V128Q26 30 200 30Q374 30 374 128V292" />
        <path d="M200 30V292M113 44Q112 120 112 292M287 44Q288 120 288 292M26 128H374" opacity=".7" />
      </g>
      {/* zemin ve saksılar */}
      <rect x="0" y="262" width="400" height="38" style={{ fill: AHSAP }} />
      <path d="M0 274H400M0 286H400M70 262V300M170 262V300M280 262V300M350 262V300" style={{ stroke: AHSAP_KOYU }} strokeWidth="1.4" opacity=".6" fill="none" />
      <rect x="150" y="248" width="100" height="18" rx="9" style={{ fill: AHSAP_KOYU }} />
      {[
        [60, 250],
        [340, 250],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 26} y={y} width="52" height="20" rx="8" style={{ fill: SAKSI }} />
          <circle cx={x - 12} cy={y - 8} r="14" style={{ fill: 'var(--yaprak-3)' }} />
          <circle cx={x + 6} cy={y - 14} r="17" style={{ fill: 'var(--yaprak-2)' }} />
          <circle cx={x + 18} cy={y - 4} r="12" style={{ fill: 'var(--yaprak-1)' }} />
        </g>
      ))}
    </>
  )
}

function Salon({ g, c }: { g: string; c: string }) {
  return (
    <>
      <defs>
        <Gok id={g} />
        <clipPath id={c}>
          <path d="M130 250V120Q130 50 200 50Q270 50 270 120V250Z" />
        </clipPath>
      </defs>
      <rect width="400" height="300" style={{ fill: AHSAP }} />
      {Array.from({ length: 27 }, (_, i) => (
        <rect key={i} x={i * 15.2} y="0" width="9.6" height="252" style={{ fill: i % 3 === 1 ? AHSAP_KOYU : AHSAP }} opacity={i % 2 ? 0.5 : 0.9} />
      ))}
      <g clipPath={`url(#${c})`}>
        <rect x="120" y="40" width="160" height="220" fill={`url(#${g})`} />
        <circle cx="150" cy="70" r="22" style={{ ...GUNES_STIL, translate: 'calc(var(--gunes-x) * 100px) calc(var(--gunes-y) * 100px)' }} opacity=".92" />
        <path d="M110 200Q170 160 230 196T290 184V260H110Z" style={{ fill: 'var(--yaprak-1)' }} />
        <path d="M110 232Q180 206 240 230T290 224V260H110Z" style={{ fill: 'var(--yaprak-2)' }} />
      </g>
      <path d="M130 250V120Q130 50 200 50Q270 50 270 120V250M200 50V250M130 150H270" fill="none" stroke="rgb(255 255 255 / .78)" strokeWidth="2.6" />
      {/* zemin, halı */}
      <rect x="0" y="252" width="400" height="48" style={{ fill: AHSAP_KOYU }} />
      <ellipse cx="200" cy="278" rx="150" ry="14" style={{ fill: 'var(--zg-3)' }} opacity=".55" />
      {/* koltuk */}
      <rect x="150" y="214" width="150" height="38" rx="16" style={{ fill: 'color-mix(in srgb, #efe4cf 80%, var(--zg-2))' }} />
      <rect x="146" y="196" width="158" height="30" rx="14" style={{ fill: 'color-mix(in srgb, #f6eddb 80%, var(--zg-2))' }} />
      <rect x="164" y="204" width="54" height="22" rx="10" style={{ fill: 'var(--yaprak-2)' }} opacity=".85" />
      {/* sarkıt lamba */}
      <path d="M340 0V64" stroke="rgb(0 0 0 / .4)" strokeWidth="1.5" />
      <circle cx="340" cy="78" r="26" style={{ fill: 'var(--isik-renk)' }} opacity=".35" />
      <path d="M326 76Q340 56 354 76Z" style={{ fill: AHSAP_KOYU }} />
      {/* saksı bitkisi */}
      <g transform="translate(60 268) scale(.42)">
        <g transform="translate(-100 -206)">
          <Kaucuk />
        </g>
      </g>
    </>
  )
}

function Cati({ g }: { g: string }) {
  return (
    <>
      <defs>
        <Gok id={g} />
      </defs>
      <rect width="400" height="300" fill={`url(#${g})`} />
      <circle cx="30" cy="20" r="24" style={GUNES_STIL} opacity=".92" />
      <path d="M0 150Q80 100 170 140T330 120T400 132V220H0Z" style={{ fill: 'var(--yaprak-1)' }} />
      <path d="M0 184Q110 150 210 180T400 168V230H0Z" style={{ fill: 'var(--yaprak-2)' }} />
      {/* ahşap güverte */}
      <path d="M0 230H400V300H0Z" style={{ fill: AHSAP }} />
      <path d="M0 246H400M0 264H400M0 284H400M60 230L-30 300M160 230L120 300M260 230L280 300M360 230L430 300" style={{ stroke: AHSAP_KOYU }} strokeWidth="1.4" opacity=".55" fill="none" />
      {/* pergola */}
      <g style={{ fill: AHSAP_KOYU }}>
        <rect x="46" y="76" width="10" height="164" rx="3" />
        <rect x="344" y="76" width="10" height="164" rx="3" />
        <rect x="36" y="70" width="328" height="12" rx="4" />
        {[70, 110, 150, 190, 230, 270, 310].map((x) => (
          <rect key={x} x={x} y="62" width="8" height="12" rx="2" />
        ))}
      </g>
      <path d="M52 84Q120 108 200 84T348 84" fill="none" stroke="rgb(255 255 255 / .5)" strokeWidth="1.2" strokeDasharray="1 7" strokeLinecap="round" />
      {[80, 140, 200, 260, 320].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? 95 : 90} r="3.4" style={{ fill: 'var(--isik-renk)' }} />
      ))}
      {/* yükseltilmiş bahçe yatakları */}
      {[
        [110, 224, 84],
        [250, 226, 92],
      ].map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x - w / 2} y={y} width={w} height="30" rx="7" style={{ fill: AHSAP_KOYU }} />
          {Array.from({ length: 5 }, (_, k) => (
            <circle key={k} cx={x - w / 2 + 10 + (k * (w - 20)) / 4} cy={y - 6 - (k % 2) * 7} r={11 + (k % 3) * 3} style={{ fill: RENK[(k + i) % 3] }} />
          ))}
        </g>
      ))}
      <circle cx="184" cy="268" r="12" style={{ fill: 'var(--su-renk)' }} opacity=".75" />
    </>
  )
}

export function Mekan({ tur, className, etiket }: { tur: MekanTur; className?: string; etiket: string }) {
  const g = useId()
  const c = useId()
  return (
    <svg viewBox="0 0 400 300" className={cx('block h-full w-full', className)} role="img" aria-label={etiket} preserveAspectRatio="xMidYMid slice" data-mekan={tur} focusable="false">
      {tur === 'atrium' ? <Atrium g={g} c={c} /> : tur === 'salon' ? <Salon g={g} c={c} /> : <Cati g={g} />}
    </svg>
  )
}
