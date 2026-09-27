import type { CSSProperties, ReactNode } from 'react'
import { IsoBlock, IsoScene, IsoShadow } from '../components/IsoScene'
import { Panel, SectionHead } from '../components/ui'
import { boxFaces, cylinder, pts, type Project } from '../lib/iso'
import { CONTRAST, FACES, type Hue } from '../lib/palette'

const HUES: Exclude<Hue, 'slate'>[] = ['blue', 'emerald', 'amber', 'violet', 'rose']
const cf = (n: number) => String(n).replace('.', ',')

/* ── Madde 9: izometrik açıya göre çizilmiş ikonlar ─────────────── */

const E = { stroke: 'rgb(15 23 42 / 0.16)', strokeWidth: 0.6, strokeLinejoin: 'round' as const }

function Server({ P }: { P: Project }) {
  const b = { x: 0.35, y: 0.35, w: 0.9, d: 1.3, h: 1.5 }
  const f = boxFaces(P, b)
  const slots = [0.25, 0.6, 0.95, 1.3]
  return (
    <g {...E}>
      <polygon points={pts(f.left)} fill={FACES.blue.left} />
      <polygon points={pts(f.right)} fill={FACES.blue.right} />
      <polygon points={pts(f.top)} fill={FACES.blue.top} />
      {slots.map((z) => (
        <g key={z}>
          <polyline points={pts([P(0.45, b.y + b.d, z), P(1.05, b.y + b.d, z)])} stroke="rgb(255 255 255 / 0.7)" strokeWidth={1.4} fill="none" />
          <circle cx={P(1.15, b.y + b.d, z)[0]} cy={P(1.15, b.y + b.d, z)[1]} r={1.6} fill="#34D399" stroke="none" />
        </g>
      ))}
    </g>
  )
}

function Database({ P, tilt }: { P: Project; tilt: number }) {
  const parts = [0, 0.5, 1].map((z) => cylinder(P, 1, 1, 0.62, z, 0.42, tilt, 30))
  return (
    <g {...E}>
      {parts.map((c, i) => (
        <g key={i}>
          <path d={c.side} fill="url(#cyl-violet)" />
          <ellipse {...c.top} fill={FACES.violet.top} />
        </g>
      ))}
    </g>
  )
}

function Package({ P }: { P: Project }) {
  const b = { x: 0.35, y: 0.35, w: 1.3, d: 1.3, h: 1 }
  const f = boxFaces(P, b)
  return (
    <g {...E}>
      <polygon points={pts(f.left)} fill={FACES.amber.left} />
      <polygon points={pts(f.right)} fill={FACES.amber.right} />
      <polygon points={pts(f.top)} fill={FACES.amber.top} />
      {/* Bant: üstte y boyunca, sağ yüzde aşağı iner */}
      <polygon points={pts([P(0.88, 0.35, 1), P(1.12, 0.35, 1), P(1.12, 1.65, 1), P(0.88, 1.65, 1)])} fill="#FEF3C7" />
      <polygon points={pts([P(0.88, 1.65, 1), P(1.12, 1.65, 1), P(1.12, 1.65, 0.55), P(0.88, 1.65, 0.55)])} fill="#FDE68A" />
    </g>
  )
}

function Coins({ P, tilt }: { P: Project; tilt: number }) {
  const stack = [0, 0.2, 0.4, 0.6].map((z) => cylinder(P, 0.95, 1.05, 0.6, z, 0.17, tilt, 30))
  return (
    <g {...E}>
      {stack.map((c, i) => (
        <g key={i}>
          <path d={c.side} fill="url(#cyl-amber)" />
          <ellipse {...c.top} fill={FACES.amber.top} />
        </g>
      ))}
      <text x={stack[3].top.cx} y={stack[3].top.cy + 3} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="IBM Plex Mono, monospace" fill="#78350F" stroke="none">
        ₿
      </text>
    </g>
  )
}

function Truck({ P }: { P: Project }) {
  const cargo = boxFaces(P, { x: 0.2, y: 0.6, w: 1.35, d: 0.8, h: 0.95 })
  const cab = boxFaces(P, { x: 1.6, y: 0.65, w: 0.45, d: 0.7, h: 0.65 })
  return (
    <g {...E}>
      <polygon points={pts(cargo.left)} fill={FACES.emerald.left} />
      <polygon points={pts(cargo.right)} fill={FACES.emerald.right} />
      <polygon points={pts(cargo.top)} fill={FACES.emerald.top} />
      <polygon points={pts(cab.left)} fill={FACES.slate.left} />
      <polygon points={pts(cab.right)} fill={FACES.slate.right} />
      <polygon points={pts(cab.top)} fill={FACES.slate.top} />
      {[0.5, 1.3, 1.85].map((x) => {
        const c = P(x, 1.4, 0.05)
        return <ellipse key={x} cx={c[0]} cy={c[1]} rx={4.2} ry={5} fill="#0F172A" stroke="none" />
      })}
    </g>
  )
}

function Bars({ P }: { P: Project }) {
  const bars = [
    { x: 0.3, h: 0.7 },
    { x: 0.85, h: 1.2 },
    { x: 1.4, h: 1.7 },
  ]
  return (
    <g>
      {bars.map((b) => (
        <IsoBlock key={b.x} P={P} box={{ x: b.x, y: 0.9, w: 0.42, d: 0.42, h: b.h }} hue="rose" build={false} />
      ))}
    </g>
  )
}

const ICONS: ReadonlyArray<{ name: string; draw: (P: Project, tilt: number) => ReactNode }> = [
  { name: 'Sunucu', draw: (P) => <Server P={P} /> },
  { name: 'Veritabanı', draw: (P, t) => <Database P={P} tilt={t} /> },
  { name: 'Paket', draw: (P) => <Package P={P} /> },
  { name: 'Kripto', draw: (P, t) => <Coins P={P} tilt={t} /> },
  { name: 'Lojistik', draw: (P) => <Truck P={P} /> },
  { name: 'Analitik', draw: (P) => <Bars P={P} /> },
]

export function Palette() {
  return (
    <section id="renk" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="04 · 05 · 09"
          label="Renk, yazı, ikon"
          title="Her nesneye üç ton"
          lede="Derinlik ışıktan gelir: üst yüz aydınlık, sol yüz orta, sağ yüz karanlık. Aynı üçlü her renkte aynı sırayla tekrar eder; göz yüzleri renk değil, ton farkıyla ayırır."
        />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {HUES.map((h) => (
            <li key={h}>
              <Panel className="flex h-full flex-col gap-3 p-4">
                <IsoScene unit={42} extent={[2.2, 2.2, 1.6]} pad={6}>
                  {(P) => (
                    <>
                      <IsoShadow P={P} box={{ x: 0.5, y: 0.5, w: 1.2, d: 1.2, h: 1.2 }} build={false} length={0.45} />
                      <IsoBlock P={P} box={{ x: 0.5, y: 0.5, w: 1.2, d: 1.2, h: 1.2 }} hue={h} build={false} topLabel="Aa" rightLabel="Aa" />
                    </>
                  )}
                </IsoScene>
                <p className="font-semibold">{FACES[h].name}</p>
                <dl className="flex flex-col gap-1 font-mono text-[12px]">
                  {(['top', 'left', 'right'] as const).map((k) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className="size-3 shrink-0 rounded-sm" style={{ background: FACES[h][k] }} aria-hidden="true" />
                      <dt className="w-10 text-muted">{k === 'top' ? 'Üst' : k === 'left' ? 'Sol' : 'Sağ'}</dt>
                      <dd>{FACES[h][k]}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-auto text-[12px] text-muted">
                  Üstte mürekkep {cf(CONTRAST[h].top)}:1 · sağda beyaz {cf(CONTRAST[h].right)}:1
                </p>
              </Panel>
            </li>
          ))}
        </ul>
        <Panel className="mt-4 p-5 text-[15px]">
          <p>
            <strong className="font-semibold">Etiket kuralı:</strong> Yüz üstüne yazı gerekirse üst yüzde koyu mürekkep (en az 6,56:1), sağ yüzde beyaz (en az 5,02:1)
            kullanılır. Sol yüz iki renge de yeterli kontrast vermez (menekşede 4,2:1), orada yazı yoktur. Uzun metin hiçbir yüze yazılmaz; düz etiket olarak yanında
            durur.
          </p>
        </Panel>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Panel className="p-6">
            <h3 className="text-lg font-bold">Tipografi · Madde 5</h3>
            <p className="text-[15px] text-muted">
              Arayüz Manrope (Mikhail Sharanda, geometrik, 200–800), teknik etiketler IBM Plex Mono (Mike Abbink ve Bold Monday). İkisi de Türkçe harfleri ve ₺ içerir.
            </p>
            <ul className="mt-6 flex flex-col gap-5">
              <li>
                <span className="font-mono text-[12px] text-muted">Display · Manrope 800 · 60</span>
                <p className="text-5xl leading-none font-extrabold tracking-tight md:text-6xl">Katman 04</p>
              </li>
              <li>
                <span className="font-mono text-[12px] text-muted">Başlık · Manrope 700 · 28</span>
                <p className="text-[28px] leading-tight font-bold">Bölgesel yük dağılımı</p>
              </li>
              <li>
                <span className="font-mono text-[12px] text-muted">Gövde · Manrope 400 · 16</span>
                <p>Izgaraya oturan her blok bir hizmeti temsil eder; yükseklik yükü, renk katmanı gösterir.</p>
              </li>
              <li>
                <span className="font-mono text-[12px] text-muted">Teknik · IBM Plex Mono 400/600 · 13</span>
                <p className="font-mono text-[13px]">
                  eu-central-1 · <span className="font-semibold">p99 42 ms</span> · 1.284 iş/dk · ₺0,012/sn
                </p>
              </li>
            </ul>
          </Panel>
          <Panel className="p-6">
            <h3 className="text-lg font-bold">İzometrik ikonlar · Madde 9</h3>
            <p className="text-[15px] text-muted">
              Döndürülmüş düz ikon değil: her biri aynı projeksiyonla, üç tonla çizildi. Projeksiyon değişince ikonlar da yeniden çizilir. Düz arayüzde ise düz ikonlar
              kullanılır.
            </p>
            <ul className="mt-5 grid grid-cols-3 gap-4">
              {ICONS.map((ic) => (
                <li key={ic.name} className="flex flex-col items-center gap-2 rounded-md border border-line p-3">
                  <div className="w-20" style={{ '--i': 0 } as CSSProperties}>
                    <IsoScene unit={30} extent={[2.2, 2.2, 1.8]} pad={4}>
                      {(P, t) => ic.draw(P, t)}
                    </IsoScene>
                  </div>
                  <span className="text-[14px] font-semibold">{ic.name}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </section>
  )
}
