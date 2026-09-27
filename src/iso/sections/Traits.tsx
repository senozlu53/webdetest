import type { ReactNode } from 'react'
import { IsoBlock, IsoScene, IsoShadow } from '../components/IsoScene'
import { Panel, SectionHead } from '../components/ui'
import { cylinder, depth, pts, type Box, type Project } from '../lib/iso'
import { FACES } from '../lib/palette'

/** Perspektif küp: kenarlar tek bir kaçış noktasına yakınsar */
function PerspectiveCube() {
  const f = [
    [40, 70],
    [120, 70],
    [120, 150],
    [40, 150],
  ]
  const vp = [230, 40]
  const t = 0.38
  const b = f.map(([x, y]) => [x + (vp[0] - x) * t, y + (vp[1] - y) * t])
  const P = (p: number[]) => p.join(',')
  return (
    <svg viewBox="0 0 260 180" className="h-auto w-full" aria-hidden="true">
      <g stroke="var(--grid-strong)" strokeDasharray="4 4" strokeWidth={1}>
        {f.map((p, i) => (
          <line key={i} x1={p[0]} y1={p[1]} x2={vp[0]} y2={vp[1]} />
        ))}
      </g>
      <circle cx={vp[0]} cy={vp[1]} r={4} fill="var(--accent)" />
      <text x={vp[0] - 6} y={vp[1] - 10} textAnchor="end" fontSize={11} fontFamily="IBM Plex Mono, monospace" fill="var(--muted)">
        kaçış noktası
      </text>
      <polygon points={[f[0], f[1], b[1], b[0]].map(P).join(' ')} fill={FACES.blue.top} />
      <polygon points={[f[1], f[2], b[2], b[1]].map(P).join(' ')} fill={FACES.blue.right} />
      <polygon points={f.map(P).join(' ')} fill={FACES.blue.left} />
    </svg>
  )
}

/** İzometrik küp: uzatılan kenarlar paralel kalır, hiç kesişmez */
function OrthoCube() {
  return (
    <IsoScene unit={46} extent={[2.4, 2.4, 1.4]} pad={8}>
      {(P) => {
        const b: Box = { x: 0.6, y: 0.6, w: 1.2, d: 1.2, h: 1.2 }
        const ext = (x: number, y: number, z: number, dx: number, dy: number) => {
          const a = P(x, y, z)
          const c = P(x + dx, y + dy, z)
          return <line x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} />
        }
        return (
          <>
            <g stroke="var(--grid-strong)" strokeDasharray="4 4" strokeWidth={1}>
              {ext(0.6, 0.6, 1.2, 1.8, 0)}
              {ext(0.6, 1.8, 1.2, 1.8, 0)}
              {ext(0.6, 1.8, 0, 1.8, 0)}
              {ext(0.6, 0.6, 1.2, 0, 1.8)}
            </g>
            <IsoBlock P={P} box={b} hue="blue" build={false} />
          </>
        )
      }}
    </IsoScene>
  )
}

function Prism({ P }: { P: Project }) {
  const x = 0.3
  const y = 0.3
  const w = 1.6
  const d = 1.2
  const h = 0.8
  const back = [P(x, y, 0), P(x + w, y, 0), P(x + w, y + d / 2, h), P(x, y + d / 2, h)]
  const end = [P(x, y, 0), P(x, y + d, 0), P(x, y + d / 2, h)]
  const front = [P(x, y + d / 2, h), P(x + w, y + d / 2, h), P(x + w, y + d, 0), P(x, y + d, 0)]
  return (
    <g stroke="rgb(15 23 42 / 0.14)" strokeWidth={0.75} strokeLinejoin="round">
      <polygon points={pts(back)} fill={FACES.rose.top} />
      <polygon points={pts(end)} fill={FACES.rose.left} />
      <polygon points={pts(front)} fill={FACES.rose.right} />
    </g>
  )
}

const VOXELS: Box[] = [
  { x: 0.2, y: 0.2, w: 0.6, d: 0.6, h: 0.6 },
  { x: 0.8, y: 0.2, w: 0.6, d: 0.6, h: 0.6 },
  { x: 0.2, y: 0.8, w: 0.6, d: 0.6, h: 0.6 },
  { x: 0.8, y: 0.8, w: 0.6, d: 0.6, h: 0.6 },
  { x: 0.2, y: 0.8, z: 0.6, w: 0.6, d: 0.6, h: 0.6 },
  { x: 0.2, y: 0.2, z: 0.6, w: 0.6, d: 0.6, h: 0.6 },
  { x: 0.2, y: 0.8, z: 1.2, w: 0.6, d: 0.6, h: 0.6 },
].sort((a, b) => depth(a) + (a.z ?? 0) - (depth(b) + (b.z ?? 0)))

const SHAPES: ReadonlyArray<{ name: string; note: string; draw: (P: Project, tilt: number) => ReactNode }> = [
  { name: 'Küp', note: 'Temel birim', draw: (P) => <IsoBlock P={P} box={{ x: 0.4, y: 0.4, w: 1.2, d: 1.2, h: 1.2 }} hue="blue" build={false} /> },
  { name: 'Prizma', note: 'Katman, platform', draw: (P) => <IsoBlock P={P} box={{ x: 0.1, y: 0.5, w: 1.9, d: 1, h: 0.5 }} hue="emerald" build={false} /> },
  { name: 'Voksel', note: 'Izgaraya oturan yapı taşı', draw: (P) => VOXELS.map((b, i) => <IsoBlock key={i} P={P} box={b} hue="amber" build={false} />) },
  {
    name: 'Silindir',
    note: 'Veritabanı, jeton',
    draw: (P, tilt) => {
      const c = cylinder(P, 1, 1, 0.65, 0, 1.2, tilt, 40)
      return (
        <g stroke="rgb(15 23 42 / 0.14)" strokeWidth={0.75}>
          <path d={c.side} fill="url(#cyl-violet)" />
          <ellipse {...c.top} fill={FACES.violet.top} />
        </g>
      )
    },
  },
  { name: 'Üçgen prizma', note: 'Çatı, yön', draw: (P) => <Prism P={P} /> },
]

export function Traits() {
  return (
    <section id="ozellikler" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="01 · 03 · 06 · 08"
          label="Karakteristikler"
          title="Paralel çizgiler, katmanlı yapı"
          lede="Perspektifte uzaktaki nesne küçülür ve çizgiler bir noktada buluşur. İzometride uzaklık boyutu değiştirmez: ölçü okunur, karşılaştırma dürüsttür. Bu yüzden teknik çizimlerin ve mimari diyagramların dilidir."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <Panel as="figure" className="p-6">
            <PerspectiveCube />
            <figcaption className="mt-4">
              <span className="font-semibold">Perspektif</span>
              <span className="block text-[15px] text-muted">Uzatılan kenarlar tek noktada kesişir; derinlik boyutu bozar.</span>
            </figcaption>
          </Panel>
          <Panel as="figure" className="p-6">
            <div className="mx-auto max-w-[260px]">
              <OrthoCube />
            </div>
            <figcaption className="mt-4">
              <span className="font-semibold">İzometrik (ortografik)</span>
              <span className="block text-[15px] text-muted">Uzatılan kenarlar paralel kalır. Kaçış noktası yok, üç eksen eşit kısalır.</span>
            </figcaption>
          </Panel>
        </div>

        <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Kaçış noktası yok', 'Ortografik projeksiyon: ışınlar paralel, nesne her konumda aynı boyda.'],
            ['Paralel çizgiler', 'Tüm kenarlar üç yönden birine uyar: 30°, 150° ve dikey.'],
            ['Katmanlı mimari', 'Sistemler Z ekseninde üst üste dizilir; her kat bir sorumluluktur.'],
            ['Teknik görünüm', 'Düz vektör yüzeyler, ince ızgara, eşit aralıklı yazı.'],
          ].map(([t, d]) => (
            <li key={t} className="bg-surface p-5">
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-[15px] text-muted">{d}</p>
            </li>
          ))}
        </ul>

        <h3 className="mt-14 text-xl font-bold">Şekil dili · Madde 6</h3>
        <p className="mt-1 max-w-[60ch] text-[15px] text-muted">Küpler, prizmalar ve ızgaraya oturan yapı taşları. Hepsi aynı birim ızgarada ölçülür.</p>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {SHAPES.map((s) => (
            <li key={s.name}>
              <Panel className="flex h-full flex-col p-4">
                <IsoScene unit={40} extent={[2.2, 2.2, 2]} pad={6}>
                  {(P, tilt) => (
                    <>
                      <IsoShadow P={P} box={{ x: 0.4, y: 0.4, w: 1.2, d: 1.2, h: 0.6 }} build={false} length={0.5} />
                      {s.draw(P, tilt)}
                    </>
                  )}
                </IsoScene>
                <p className="mt-3 font-semibold">{s.name}</p>
                <p className="text-[14px] text-muted">{s.note}</p>
              </Panel>
            </li>
          ))}
        </ul>

        <Panel className="mt-6 flex flex-col gap-4 p-6 md:flex-row md:items-center">
          <div className="iso-grid h-28 w-full shrink-0 rounded-md border border-line md:w-72" style={{ backgroundColor: 'var(--grid-strong)' }} aria-hidden="true" />
          <div>
            <p className="font-semibold">Doku · Madde 8</p>
            <p className="text-[15px] text-muted">
              Yüzeyler pürüzsüz vektördür; doku yalnızca zemindeki 1px izometrik ızgaradan gelir. Sayfanın arka planı da aynı ızgaradır ve seçilen projeksiyonla birlikte
              açısını değiştirir.
            </p>
          </div>
        </Panel>
      </div>
    </section>
  )
}
