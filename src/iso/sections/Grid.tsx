import { useId, useState, type CSSProperties, type ReactNode } from 'react'
import { CpuIcon, HardDrivesIcon } from '@phosphor-icons/react'
import { IsoBlock, IsoScene } from '../components/IsoScene'
import { Code, Panel, SectionHead, Segmented } from '../components/ui'
import { lineAngle, pts, type Projection } from '../lib/iso'
import { FACES } from '../lib/palette'
import { useProjection } from '../lib/projection'

const f = (n: number, d = 3) => String(+n.toFixed(d)).replace('.', ',')
const css = (n: number, d = 5) => String(+n.toFixed(d))

/** Izgara çizimi: 30° (ya da 26,57°) doğrular, dikey eksen ve açı yayı */
function GridFigure() {
  const { tilt } = useProjection()
  const ang = lineAngle(tilt)
  return (
    <IsoScene unit={34} extent={[6, 6, 3]} pad={20} label={`İzometrik ızgara: zemin çizgileri yatayla ${f(ang, 2)} derece açı yapar.`}>
      {(P) => {
        const lines: ReactNode[] = []
        for (let i = 0; i <= 6; i++) {
          const a = P(i, 0)
          const b = P(i, 6)
          const c = P(0, i)
          const d = P(6, i)
          lines.push(<line key={`a${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />, <line key={`b${i}`} x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} />)
        }
        const o = P(0, 6)
        const ex = P(3, 6)
        const ez = P(0, 6, 2.6)
        const ey = P(0, 3)
        const r = 42
        const arcEnd: [number, number] = [o[0] + r * Math.cos((ang * Math.PI) / 180), o[1] - r * Math.sin((ang * Math.PI) / 180)]
        return (
          <>
            <g stroke="var(--grid-strong)" strokeWidth={1}>{lines}</g>
            <IsoBlock P={P} box={{ x: 2, y: 2, w: 2, d: 2, h: 2 }} hue="blue" build={false} />
            <g strokeWidth={2} strokeLinecap="round">
              <line x1={o[0]} y1={o[1]} x2={ex[0]} y2={ex[1]} stroke="#e11d48" />
              <line x1={o[0]} y1={o[1]} x2={ez[0]} y2={ez[1]} stroke="#059669" />
              <line x1={o[0]} y1={o[1]} x2={ey[0]} y2={ey[1]} stroke="var(--accent)" />
            </g>
            <line x1={o[0]} y1={o[1]} x2={o[0] + r + 30} y2={o[1]} stroke="var(--muted)" strokeDasharray="3 3" />
            <path d={`M${o[0] + r},${o[1]} A${r},${r} 0 0 0 ${arcEnd[0]},${arcEnd[1]}`} fill="none" stroke="var(--ink)" strokeWidth={1.5} />
            <g fontFamily="IBM Plex Mono, monospace" fontSize={12} fontWeight={600}>
              <text x={o[0] + r + 6} y={o[1] - 8} fill="var(--ink)">
                {f(ang, 2)}°
              </text>
              <text x={ex[0] + 6} y={ex[1] - 4} fill="#e11d48">
                x
              </text>
              <text x={ey[0] - 14} y={ey[1] - 4} fill="var(--accent)">
                y
              </text>
              <text x={ez[0] + 6} y={ez[1] + 4} fill="#059669">
                z
              </text>
            </g>
          </>
        )
      }}
    </IsoScene>
  )
}

/** Madde 15: düz bir Auto Layout kartı, CSS dönüşümüyle izometrik düzleme yatırılır */
function TransformDemo() {
  const { tilt } = useProjection()
  const [p, setP] = useState(100)
  const id = useId()
  const k = p / 100
  const rx = tilt * k
  const rz = -45 * k
  return (
    <Panel className="flex h-full flex-col gap-5 p-6">
      <div>
        <h3 className="text-lg font-bold">CSS dönüşümü · Madde 15</h3>
        <p className="text-[15px] text-muted">Kart düz yerleşir (flex, boşluklar, metin akışı); dönüşüm yalnızca görüntüyü döndürür. Figma'da Auto Layout'un bozulmaması bu yüzdendir.</p>
      </div>
      <div className="grid min-h-64 place-items-center overflow-hidden rounded-md border border-line bg-bg" aria-hidden="true">
        <div style={{ transform: `rotateX(${rx}deg) rotateZ(${rz}deg)`, transformStyle: 'preserve-3d' }} className="w-56">
          <div className="flex flex-col gap-2 rounded-md border border-line bg-surface p-3 shadow-[6px_6px_0_var(--shadow)]">
            <div className="flex items-center gap-2 font-semibold">
              <HardDrivesIcon size={18} weight="bold" />
              web-2
              <span className="ml-auto rounded bg-line px-1.5 font-mono text-[11px]">eu-1</span>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <CpuIcon size={16} weight="bold" />
              <span className="h-2 flex-1 rounded-full bg-line">
                <span className="block h-full w-3/5 rounded-full" style={{ background: FACES.blue.left }} />
              </span>
              %62
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-baseline justify-between text-[14px] font-semibold">
          <label htmlFor={id}>Dönüşüm</label>
          <output htmlFor={id} className="font-mono">
            %{p}
          </output>
        </div>
        <input id={id} type="range" min={0} max={100} value={p} onChange={(e) => setP(Number(e.target.value))} className="mt-2 w-full accent-[var(--accent)]" />
      </div>
      <Code>{`.iso-plane {
  transform: rotateX(${css(rx, 4)}deg) rotateZ(${css(rz, 2)}deg);
  transform-style: preserve-3d;
}`}</Code>
    </Panel>
  )
}

/** Figma "Skew" yöntemi: üç yüz ayrı ayrı 2B matrisle eğilir; içlerindeki Auto Layout olduğu gibi kalır */
function SkewBox() {
  const { tilt } = useProjection()
  const t = (tilt * Math.PI) / 180
  const k = Math.SQRT1_2
  const c = Math.cos(t)
  const s = Math.sin(t)
  const W = 150
  const D = 150
  const H = 110
  // P(x, y, z) = ((x + y)·k, (y − x)·k·c − z·s); kap sol üstü (0, W·k·c + H·s)
  const oy = W * k * c + H * s
  const Pp = (x: number, y: number, z: number) => [(x + y) * k, (y - x) * k * c - z * s + oy]
  const top = Pp(0, 0, H)
  const right = Pp(0, D, H)
  const m = (a: number, b: number, cc: number, d: number, e: number, ff: number) => `matrix(${css(a)}, ${css(b)}, ${css(cc)}, ${css(d)}, ${css(e, 2)}, ${css(ff, 2)})`
  const faces = {
    top: m(k, -k * c, k, k * c, top[0], top[1]),
    left: m(k, k * c, 0, s, top[0], top[1]),
    right: m(k, -k * c, 0, s, right[0], right[1]),
  }
  const width = (W + D) * k
  const height = oy + D * k * c
  const face: CSSProperties = { position: 'absolute', left: 0, top: 0, transformOrigin: '0 0' }
  const ssr = tilt === 54.7356
  return (
    <Panel className="flex h-full flex-col gap-5 p-6">
      <div>
        <h3 className="text-lg font-bold">Skew yöntemi · Madde 12</h3>
        <p className="text-[15px] text-muted">
          Figma'daki Skew ve Isometric eklentilerinin yaptığı: her yüz düz bir çerçevedir, tek bir 2B matrisle eğilir. İçerideki grafik, tablo ve kartlar Auto
          Layout'ta kalır; düzenleme düz yapılır, görüntü izometriktir.
        </p>
      </div>
      <div className="mx-auto my-2" style={{ position: 'relative', width, height }} aria-hidden="true">
        <div style={{ ...face, width: D, height: H, transform: faces.left, background: FACES.blue.left }} className="flex flex-col justify-end gap-1 p-3">
          <div className="flex h-16 items-end gap-1.5">
            {[40, 70, 55, 90, 65].map((v, i) => (
              <span key={i} className="flex-1 rounded-t-sm bg-white/80" style={{ height: `${v}%` }} />
            ))}
          </div>
          <span className="font-mono text-[10px] font-semibold text-[#0F172A]">trafik</span>
        </div>
        <div style={{ ...face, width: W, height: H, transform: faces.right, background: FACES.blue.right }} className="flex flex-col gap-1 p-3 font-mono text-[10px] text-white">
          {['web-1  %48', 'web-2  %62', 'web-3  %37', 'db-1   %71'].map((r) => (
            <span key={r} className="border-b border-white/30 pb-0.5 whitespace-pre">
              {r}
            </span>
          ))}
        </div>
        <div style={{ ...face, width: W, height: D, transform: faces.top, background: FACES.blue.top }} className="grid grid-cols-2 gap-2 p-3">
          {['CPU', 'RAM', 'Disk', 'Ağ'].map((l) => (
            <span key={l} className="flex flex-col justify-center rounded-sm bg-white/70 px-2 font-mono text-[10px] font-semibold text-[#0F172A]">
              {l}
            </span>
          ))}
        </div>
      </div>
      <Code>{`/* üst */   transform: ${ssr ? 'rotate(-30deg) skewX(30deg) scaleY(0.86603)' : faces.top.replace(/, [\d.-]+, [\d.-]+\)$/, ', 0, 0)')};
/* sol */   transform: ${ssr ? 'skewY(30deg) scaleX(0.86603)' : faces.left.replace(/, [\d.-]+, [\d.-]+\)$/, ', 0, 0)')};
/* sağ */   transform: ${ssr ? 'skewY(-30deg) scaleX(0.86603)' : faces.right.replace(/, [\d.-]+, [\d.-]+\)$/, ', 0, 0)')};`}</Code>
    </Panel>
  )
}

const TOKENS = [
  ['Grid/Isometric', 'açı 30° · birim 24px · rotateX 54,7356° · rotateZ −45°'],
  ['Color/SurfaceTop', '#60A5FA · aydınlık, ışığa bakan yüz'],
  ['Color/SurfaceLeft', '#3B82F6 · orta'],
  ['Color/SurfaceRight', '#1D4ED8 · karanlık'],
  ['Shadow/Directional', 'ışık (−x, −y) · gölge (+x, +y) · uzunluk 0,8 × yükseklik'],
] as const

export function Grid() {
  const { projection, tilt, setProjection } = useProjection()
  const ang = lineAngle(tilt)
  const c = Math.cos((tilt * Math.PI) / 180)
  const xy = Math.sqrt(0.5 + 0.5 * c * c)
  const z = Math.sin((tilt * Math.PI) / 180)
  return (
    <section id="izgara" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="12 · 13 · 15"
          label={<span lang="en">Figma Architecture</span>}
          title="30 derecelik ızgara"
          lede="Gerçek izometride üç eksen aynı oranda kısalır ve zemin çizgileri tam 30° açı yapar. Tanımdaki CSS satırı (rotateX 60°) ise oyunlarda kullanılan 2:1 izometriyi verir; çizgiler 26,57°'dir. Seçim bütün sayfayı değiştirir."
        />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Panel className="flex flex-col gap-5 p-6">
            <Segmented<Projection>
              legend="Projeksiyon"
              name="projeksiyon"
              value={projection}
              onChange={setProjection}
              options={[
                { id: 'gercek', label: 'Gerçek izometrik · 30°' },
                { id: 'oyun', label: 'Tanımdaki CSS · rotateX(60°)' },
              ]}
            />
            <div className="mx-auto w-full max-w-[460px]">
              <GridFigure />
            </div>
            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line bg-line font-mono text-[13px]">
              {[
                ['çizgi açısı', `${f(ang, 2)}°`],
                ['x, y kısalma', f(xy)],
                ['z kısalma', f(z)],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface px-3 py-2.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-lg font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[14px] text-muted">
              {projection === 'gercek'
                ? 'rotateX = arctan √2 = 54,7356° olduğunda cos θ = tan 30° olur: her eksen 0,816 oranında kısalır.'
                : '2:1 izometride yatay iki piksele bir dikey piksel düşer; piksel sanatında basamaksız çizgi verir. Dikey eksen yataylardan uzun görünür.'}
            </p>
          </Panel>
          <TransformDemo />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <SkewBox />
          <Panel className="flex h-full flex-col gap-4 p-6">
            <h3 className="text-lg font-bold">Figma tokenları · Madde 13</h3>
            <dl className="flex flex-col divide-y divide-line">
              {TOKENS.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 py-2.5">
                  <dt className="font-mono text-[14px] font-semibold">{k}</dt>
                  <dd className="text-[14px] text-muted">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto flex items-center gap-4">
              <div className="w-28 shrink-0">
                <IsoScene unit={30} extent={[2, 2, 1.6]} pad={6}>
                  {(P) => (
                    <>
                      <polygon points={pts([P(0.3, 0.3), P(1.7, 0.3), P(1.7, 1.7), P(0.3, 1.7)])} fill="none" stroke="var(--grid-strong)" />
                      <IsoBlock P={P} box={{ x: 0.3, y: 0.3, w: 1.4, d: 1.4, h: 1.4 }} hue="blue" build={false} />
                    </>
                  )}
                </IsoScene>
              </div>
              <ul className="flex flex-col gap-1 font-mono text-[13px]">
                {(['top', 'left', 'right'] as const).map((k) => (
                  <li key={k} className="flex items-center gap-2">
                    <span className="size-3.5 rounded-sm" style={{ background: FACES.blue[k] }} aria-hidden="true" />
                    Surface{k === 'top' ? 'Top' : k === 'left' ? 'Left' : 'Right'} {FACES.blue[k]}
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  )
}
