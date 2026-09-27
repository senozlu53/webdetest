import type { CSSProperties } from 'react'
import { ArrowDownIcon } from '@phosphor-icons/react'
import { IsoBlock, IsoGround, IsoScene, IsoShadow } from '../components/IsoScene'
import { boxFaces, cylinder, depth, lineAngle, pts, type Box } from '../lib/iso'
import { useProjection } from '../lib/projection'
import { FACES, type Hue } from '../lib/palette'

type Item = { box: Box; hue: Hue; top?: string; right?: string }

const PLATE: Box = { x: 0, y: 0, w: 9, d: 9, h: 0.3 }
const Z0 = 0.3

// Veri merkezi: yük dengeleyici, üç sunucu dolabı, kuyruk ve önbellek
const ITEMS: Item[] = [
  { box: { x: 0.8, y: 6.2, z: Z0, w: 1.6, d: 1.6, h: 0.9 }, hue: 'emerald', top: 'LB' },
  { box: { x: 3.6, y: 5.4, z: Z0, w: 1.1, d: 2.4, h: 2.8 }, hue: 'blue', right: 'web-1' },
  { box: { x: 5.1, y: 5.4, z: Z0, w: 1.1, d: 2.4, h: 2.8 }, hue: 'blue', right: 'web-2' },
  { box: { x: 6.6, y: 5.4, z: Z0, w: 1.1, d: 2.4, h: 2.8 }, hue: 'blue', right: 'web-3' },
  { box: { x: 4.2, y: 1.2, z: Z0, w: 3.6, d: 1.2, h: 0.7 }, hue: 'amber', top: 'kuyruk' },
  { box: { x: 5.4, y: 1.2, z: Z0 + 0.7, w: 1.2, d: 1.2, h: 0.5 }, hue: 'rose' },
]
const ORDER = ITEMS.map((it, i) => ({ ...it, i })).sort((a, b) => depth(a.box) - depth(b.box))

// Z ekseninde süzülen saydam katman (Madde 7)
const GLASS: Box = { x: 3.3, y: 5.0, z: 4.6, w: 4.7, d: 3.2, h: 0 }

const LAYERS = [
  { name: 'Yük dengeleyici', meta: 'LB · 2 bölge', hue: 'emerald' as Hue },
  { name: 'Web katmanı', meta: 'web-1 … web-3 · p99 42 ms', hue: 'blue' as Hue },
  { name: 'İş kuyruğu', meta: '1.284 iş / dk', hue: 'amber' as Hue },
  { name: 'Önbellek ve veritabanı', meta: 'Redis · PostgreSQL', hue: 'violet' as Hue },
]

export function Hero() {
  const { tilt } = useProjection()
  const angle = String(+lineAngle(tilt).toFixed(2)).replace('.', ',')
  return (
    <section id="ust" className="px-4 pt-12 pb-16 md:px-8 md:pt-16 md:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="font-mono text-[13px] tracking-wide text-muted uppercase">
            <span className="text-accent">Stil 008</span> · <span lang="en">3D / Spatial</span>
          </p>
          <h1 className="mt-4 text-[44px] leading-[1.02] font-extrabold tracking-tight md:text-[68px]">
            Kaçış noktası olmayan <span className="text-accent">üç boyut</span>
          </h1>
          <p className="mt-6 max-w-[50ch] text-lg text-muted">
            Nesneler perspektif bozulması olmadan, 30 derecelik izometrik ızgaraya oturur. Paralel çizgiler, katmanlı mimari ve teknik, analitik bir görünüm.
          </p>
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line font-mono">
            {[
              ['açı', `${angle}°`],
              ['kaçış noktası', '0'],
              ['yüz tonu', '3'],
            ].map(([k, v]) => (
              <div key={k} className="bg-surface px-4 py-3">
                <dt className="text-[12px] text-muted uppercase">{k}</dt>
                <dd className="text-2xl font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#uygulama" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-accent px-4 text-[15px] font-semibold text-bg no-underline hover:opacity-90">
              Paneli aç
            </a>
            <a href="#izgara" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-field bg-surface px-4 text-[15px] font-semibold text-ink no-underline hover:bg-line">
              <ArrowDownIcon size={16} weight="bold" aria-hidden="true" />
              Izgarayı kur
            </a>
          </div>
        </div>

        {/* Masaüstü: izometrik sahne. Mobil (Madde 17): aynı katmanlar düz bir yığın olarak. */}
        <figure className="hidden md:block">
          <IsoScene unit={38} extent={[9, 9, 5]} label="İzometrik veri merkezi: yük dengeleyici, üç web sunucusu, iş kuyruğu, önbellek ve veritabanı; üstte süzülen p99 gecikme katmanı.">
            {(P, tilt) => {
              const db = cylinder(P, 2.2, 2.4, 0.9, Z0, 1.1, tilt, 38)
              const db2 = cylinder(P, 2.2, 2.4, 0.9, Z0 + 1.2, 1.1, tilt, 38)
              const link = (a: [number, number], b: [number, number], c: [number, number]) =>
                `M${P(a[0], a[1], Z0).join(',')} L${P(b[0], b[1], Z0).join(',')} L${P(c[0], c[1], Z0).join(',')}`
              return (
                <>
                  <clipPath id="hero-plate">
                    <polygon points={pts(boxFaces(P, PLATE).top)} />
                  </clipPath>
                  <IsoShadow P={P} box={PLATE} build={false} length={0.6} />
                  <IsoBlock P={P} box={PLATE} hue="slate" build={false} />
                  <IsoGround P={P} size={[9, 9]} step={1} z={Z0} />
                  {/* Bağlantılar: yalnızca eksenler boyunca */}
                  <g fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="5 4" className="build-shadow" style={{ '--i': 7 } as CSSProperties}>
                    <path d={link([1.6, 6.2], [1.6, 5.0], [4.1, 5.0])} />
                    <path d={link([5.6, 5.4], [5.6, 3.6], [5.6, 2.4])} />
                    <path d={link([4.2, 1.8], [3.1, 1.8], [3.1, 2.4])} />
                  </g>
                  {/* Gölgeler plakanın üstüne düşer, kenarda kırpılır */}
                  <g clipPath="url(#hero-plate)">
                    {ORDER.map((it) => (
                      <IsoShadow key={`s${it.i}`} P={P} box={it.box} i={it.i} ground={Z0} />
                    ))}
                    <IsoShadow P={P} box={{ x: 1.3, y: 1.5, z: Z0, w: 1.8, d: 1.8, h: 2.3 }} i={6} ground={Z0} />
                  </g>
                  {/* Veritabanı: iki katlı silindir */}
                  <g className="build" style={{ '--i': 6 } as CSSProperties} stroke="rgb(15 23 42 / 0.14)" strokeWidth={0.75}>
                    <path d={db.side} fill="url(#cyl-violet)" />
                    <ellipse {...db.top} fill={FACES.violet.top} />
                    <path d={db2.side} fill="url(#cyl-violet)" />
                    <ellipse {...db2.top} fill={FACES.violet.top} />
                  </g>
                  {ORDER.map((it) => (
                    <IsoBlock key={it.i} P={P} box={it.box} hue={it.hue} i={it.i} topLabel={it.top} rightLabel={it.right} />
                  ))}
                  {/* Süzülen cam katman ve zemine düşen izi */}
                  <g className="build" style={{ '--i': 9 } as CSSProperties}>
                    <polygon
                      points={pts([P(GLASS.x, GLASS.y, GLASS.z!), P(GLASS.x + GLASS.w, GLASS.y, GLASS.z!), P(GLASS.x + GLASS.w, GLASS.y + GLASS.d, GLASS.z!), P(GLASS.x, GLASS.y + GLASS.d, GLASS.z!)])}
                      fill="var(--glass)"
                      stroke="var(--glass-line)"
                      strokeWidth={1}
                    />
                    <text x={P(GLASS.x + 1.2, GLASS.y + 1.6, GLASS.z!)[0]} y={P(GLASS.x + 1.2, GLASS.y + 1.6, GLASS.z!)[1]} fontFamily="IBM Plex Mono, monospace" fontSize={13} fontWeight={600} fill="var(--ink)">
                      p99 · 42 ms
                    </text>
                  </g>
                </>
              )
            }}
          </IsoScene>
        </figure>
        <ol className="flex flex-col gap-2 md:hidden" aria-label="Mimari katmanları">
          {LAYERS.map((l, i) => (
            <li key={l.name} className="flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3">
              <span className="font-mono text-[13px] text-muted">{String(i + 1).padStart(2, '0')}</span>
              <span className="h-8 w-1.5 rounded-full" style={{ background: FACES[l.hue].left }} aria-hidden="true" />
              <span className="flex flex-col">
                <span className="font-semibold">{l.name}</span>
                <span className="font-mono text-[13px] text-muted">{l.meta}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
