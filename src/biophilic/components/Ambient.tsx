import { useMemo, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { damarAt, rastgele, yaprakAt } from '../lib/organik'
import { DOKU_ALFA, useBiophilic, type DogaSeviye } from '../lib/store'
import { degiskenler, palet } from '../lib/zaman'

/* ───────────────────────── Yaprak kümeleri: köşelerden yükselen büyük yapraklar ───────────────────────── */

function kume(tohum: number, adet: number) {
  const r = rastgele(tohum)
  return Array.from({ length: adet }, (_, i) => {
    const aci = -Math.PI / 2 - 0.95 + (i / (adet - 1)) * 1.55 + (r() - 0.5) * 0.12
    const boy = 150 + r() * 120 - Math.abs(i - adet / 2) * 6
    const en = boy * (0.2 + r() * 0.06)
    return { d: yaprakAt(40, 312, aci, boy, en, 0.16), damar: damarAt(40, 312, aci, boy), k: i % 3, gecikme: -(r() * 6) }
  })
}
const KUME = { sol: kume(11, 9), sag: kume(23, 8) }
const YAPRAK_RENK = ['var(--yaprak-2)', 'var(--yaprak-3)', 'var(--yaprak-1)']

function Yapraklar({ yon, tam }: { yon: 'sol' | 'sag'; tam: boolean }) {
  // hafif seviyede yaprak sayısı yarıya iner ve damarlar çizilmez
  const liste = tam ? KUME[yon] : KUME[yon].filter((_, i) => i % 2 === 0)
  return (
    <svg className="amb-yaprak" viewBox="0 0 320 320" data-yon={yon} style={yon === 'sag' ? { scale: '-1 1' } : undefined} aria-hidden="true" focusable="false">
      {liste.map((y, i) => (
        <g key={i} className="salin" style={{ transformOrigin: '40px 312px', ['--d' as string]: `${y.gecikme}s`, ['--r-gen' as string]: 1.8 + (i % 3) * 0.5 } as CSSProperties}>
          <path d={y.d} style={{ fill: YAPRAK_RENK[y.k] }} />
          {tam ? <path d={y.damar} fill="none" stroke="rgb(255 255 255 / .22)" strokeWidth="1.1" strokeLinecap="round" /> : null}
        </g>
      ))}
    </svg>
  )
}

const POLEN = (() => {
  const r = rastgele(5)
  return Array.from({ length: 11 }, () => ({ x: Math.round(r() * 96), b: 3 + Math.round(r() * 4), s: 16 + Math.round(r() * 14), d: -Math.round(r() * 26) }))
})()

/**
 * <DynamicAmbientBackground> (Madde 14): gökyüzü, güneş / ay, ışık huzmeleri, bulutlar, tepeler, su ve polen.
 * Tüm renkler ve güneş konumu CSS değişkenlerinden gelir; değişkenler günün saatine göre yazılır.
 * `hafif` seviyede huzme, bulut, su ve polen hiç oluşturulmaz (Madde 17).
 */
export function DynamicAmbientBackground({ kapsam = 'sayfa', seviye }: { kapsam?: 'sayfa' | 'alan'; seviye?: DogaSeviye }) {
  const { dogaSeviye } = useBiophilic()
  const s = seviye ?? dogaSeviye
  const tam = s === 'tam'
  return (
    <div className="amb" data-kapsam={kapsam} data-seviye={s} aria-hidden="true" data-ambient="">
      <div className="amb-gok" />
      <div className="amb-isik" />
      <div className="amb-disk" />
      {tam ? <div className="amb-huzme" /> : null}
      {tam ? (
        <>
          <div className="amb-bulut" style={{ top: '9%', ['--sure' as string]: '150s', ['--d' as string]: '-60s' } as CSSProperties} />
          <div className="amb-bulut" style={{ top: '24%', width: 'min(34vw, 460px)', opacity: 0.7, ['--sure' as string]: '210s', ['--d' as string]: '-170s' } as CSSProperties} />
        </>
      ) : null}
      <svg className="amb-tepe" viewBox="0 0 1440 360" preserveAspectRatio="none" focusable="false">
        <path d="M0 200C180 140 340 132 520 184S900 246 1100 176 1340 126 1440 164V360H0Z" style={{ fill: 'var(--yaprak-1)' }} opacity="0.92" />
      </svg>
      {tam ? <div className="amb-su" /> : null}
      <svg className="amb-tepe" viewBox="0 0 1440 360" preserveAspectRatio="none" focusable="false">
        <path d="M0 252C220 208 420 232 640 264S1060 252 1240 212 1400 228 1440 236V360H0Z" style={{ fill: 'var(--yaprak-2)' }} />
        <path d="M0 302C200 278 380 298 600 314S1000 302 1200 284 1400 298 1440 302V360H0Z" style={{ fill: 'var(--yaprak-3)' }} />
      </svg>
      <Yapraklar yon="sol" tam={tam} />
      <Yapraklar yon="sag" tam={tam} />
      {tam ? (
        <div className="amb-polen">
          {POLEN.map((p, i) => (
            <i key={i} style={{ ['--x' as string]: `${p.x}%`, ['--b' as string]: `${p.b}px`, ['--s' as string]: `${p.s}s`, ['--d' as string]: `${p.d}s` } as CSSProperties} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

/**
 * Belirli bir saatin görünümünü kendi içinde gösteren alan: kendi değişkenlerini yazar, kendi ortamını çizer.
 * Dinamik tema kartları, Figma modları, dengeleyici karşılaştırması ve mobil simülatörü bunu kullanır.
 */
export function ZamanSahnesi({
  saat,
  denge = true,
  hedef,
  doku,
  seviye,
  ambient = true,
  icKlas = 'relative z-10',
  className,
  style,
  children,
  ...rest
}: {
  saat?: number
  denge?: boolean
  hedef?: number
  doku?: number
  seviye?: DogaSeviye
  /** false: yalnız değişkenleri yazar, ortam çizmez (çizim kendi gökyüzünü getirir) */
  ambient?: boolean
  /** içerik sarmalayıcısının sınıfı (varsayılan: relative z-10) */
  icKlas?: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'>) {
  const c = useBiophilic()
  const s = saat ?? c.saat
  const dk = doku ?? (c.doku === 'yok' ? 0 : DOKU_ALFA)
  const h = hedef ?? c.hedef
  const p = useMemo(() => palet(s, { denge, hedef: h, doku: dk }), [s, denge, h, dk])
  const vars = useMemo(() => degiskenler(p), [p])
  const sv = seviye ?? c.dogaSeviye
  return (
    <div className={cx('zaman-alan', className)} style={{ ...vars, ...style } as CSSProperties} data-cam={p.cam.acik ? 'acik' : 'koyu'} data-mod={p.mod} data-doga-seviye={sv} data-zaman-alan={Math.round(s * 100) / 100} {...rest}>
      {ambient ? <DynamicAmbientBackground kapsam="alan" seviye={sv} /> : null}
      <div className={icKlas}>{children}</div>
    </div>
  )
}
