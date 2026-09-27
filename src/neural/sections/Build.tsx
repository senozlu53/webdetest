import { useState, type KeyboardEvent, type PointerEvent } from 'react'
import { AIAgentTimeline, Connector, StepNode } from '../components/AIAgentTimeline'
import { Code, Panel, Section } from '../components/ui'
import { useSize } from '../hooks/useSize'
import { STATUS, type StepStatus } from '../lib/agent'
import { useNeural } from '../lib/store'

interface N {
  id: string
  ad: string
  x: number
  y: number
}
const R = 30

/** Arrow Auto benzeri bağlayıcı: düğümlerin göreli konumuna göre çıkış ve giriş kenarını seçer */
function connect(a: N, b: N) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (Math.abs(dx) >= Math.abs(dy)) {
    const s = Math.sign(dx) || 1
    const x1 = a.x + R * s
    const x2 = b.x - (R + 6) * s
    const c = Math.abs(x2 - x1) * 0.5
    return `M${x1.toFixed(0)} ${a.y.toFixed(0)} C${(x1 + c * s).toFixed(0)} ${a.y.toFixed(0)}, ${(x2 - c * s).toFixed(0)} ${b.y.toFixed(0)}, ${x2.toFixed(0)} ${b.y.toFixed(0)}`
  }
  const s = Math.sign(dy) || 1
  const y1 = a.y + R * s
  const y2 = b.y - (R + 6) * s
  const c = Math.abs(y2 - y1) * 0.5
  return `M${a.x.toFixed(0)} ${y1.toFixed(0)} C${a.x.toFixed(0)} ${(y1 + c * s).toFixed(0)}, ${b.x.toFixed(0)} ${(y2 - c * s).toFixed(0)}, ${b.x.toFixed(0)} ${y2.toFixed(0)}`
}

function ArrowAuto() {
  const { announce } = useNeural()
  const [ref, { w, h }] = useSize<HTMLDivElement>()
  const [nodes, setNodes] = useState<N[]>([
    { id: 'girdi', ad: 'Girdi', x: 0.14, y: 0.3 },
    { id: 'katman', ad: 'Katman', x: 0.5, y: 0.68 },
    { id: 'cikti', ad: 'Çıktı', x: 0.86, y: 0.32 },
  ])
  const [drag, setDrag] = useState<string | null>(null)
  const px = (n: N): N => ({ ...n, x: n.x * w, y: n.y * h })
  const move = (id: string, x: number, y: number) =>
    setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, x: Math.min(1 - R / Math.max(w, 1), Math.max(R / Math.max(w, 1), x)), y: Math.min(1 - R / Math.max(h, 1), Math.max(R / Math.max(h, 1), y)) } : n)))
  const onMove = (e: PointerEvent) => {
    if (!drag) return
    const b = e.currentTarget.getBoundingClientRect()
    move(drag, (e.clientX - b.left) / b.width, (e.clientY - b.top) / b.height)
  }
  const onKey = (e: KeyboardEvent, n: N) => {
    const d = (e.shiftKey ? 36 : 12) / Math.max(w, 1)
    const dv = (e.shiftKey ? 36 : 12) / Math.max(h, 1)
    const m: Record<string, [number, number]> = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -dv], ArrowDown: [0, dv] }
    const v = m[e.key]
    if (v) {
      e.preventDefault()
      move(n.id, n.x + v[0], n.y + v[1])
    }
  }
  const P = nodes.map(px)
  const paths = w ? [connect(P[0], P[1]), connect(P[1], P[2])] : []
  return (
    <div>
      <div ref={ref} className="relative h-[260px] touch-none overflow-hidden rounded-xl border border-line bg-bg/70" onPointerMove={onMove} onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)}>
        {w ? (
          <svg width={w} height={h} className="absolute inset-0" aria-hidden="true" fill="none">
            <defs>
              <marker id="ok-ucu" viewBox="0 0 10 10" refX="4" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0L10 5L0 10z" fill="#a78bfa" />
              </marker>
              <linearGradient id="aa-g" gradientUnits="userSpaceOnUse" x1="0" x2={w} y1="0" y2="0">
                <stop offset="0" stopColor="#60a5fa" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            {paths.map((d, i) => (
              <g key={i}>
                <path d={d} stroke="url(#aa-g)" strokeWidth={2} markerEnd="url(#ok-ucu)" />
                <path d={d} pathLength={1} className="edge-flow fx-only" stroke="#e0e7ff" strokeWidth={2.5} strokeLinecap="round" style={{ ['--flow-delay' as string]: `${i * 0.8}s` }} />
              </g>
            ))}
          </svg>
        ) : null}
        {P.map((n, i) => (
          <button
            key={n.id}
            type="button"
            className="glow absolute grid size-[60px] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none place-items-center rounded-full border-[1.5px] border-violet bg-bg text-[13px] font-medium active:cursor-grabbing"
            style={{ left: n.x, top: n.y }}
            aria-label={`${n.ad} düğümü. Ok tuşlarıyla taşıyın, Shift ile daha hızlı.`}
            onPointerDown={(e) => {
              e.currentTarget.parentElement?.setPointerCapture(e.pointerId)
              setDrag(n.id)
            }}
            onKeyDown={(e) => onKey(e, nodes[i])}
            onKeyUp={(e) => e.key.startsWith('Arrow') && announce(`${n.ad} taşındı`)}
          >
            {n.ad}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[13px] text-muted">Düğümleri sürükleyin ya da odaklayıp ok tuşlarıyla taşıyın. Bağlantı çıkış ve giriş kenarını kendisi seçer.</p>
      <pre className="scroll-x mt-2 rounded-lg border border-line bg-bg/70 p-2.5 font-mono text-[11px] text-muted mono-tight" tabIndex={0} aria-label="Bağlantı yolları">
        <code>{paths.map((d, i) => `${i ? '\n' : ''}yol ${i + 1}: ${d}`).join('')}</code>
      </pre>
    </div>
  )
}

const STATES: StepStatus[] = ['bekliyor', 'calisiyor', 'tamam', 'hata', 'atlandi']

const REACT = `const adimlar = [
  { id: 'anla', ad: 'Anla', status: 'tamam', progress: 1 },
  { id: 'ara', ad: 'Ara', status: 'calisiyor', progress: 0.4 },
  { id: 'analiz', ad: 'Analiz Et', status: 'bekliyor', progress: 0 },
  { id: 'uret', ad: 'Üret', status: 'bekliyor', progress: 0 },
]

<AIModelSelector value={modelId} onChange={setModelId} />
<AIAgentTimeline steps={adimlar} orientation={genis ? 'yatay' : 'dikey'} />`

const CSS = `/* pathLength="1": yolun uzunluğu 1 kabul edilir */
.edge-draw {                      /* çizerek dolma */
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--p));
  transition: stroke-dashoffset 420ms;
}
.edge-flow {                      /* yol boyunca akan veri */
  stroke-dasharray: 0.07 0.93;
  animation: akis 2.4s linear infinite;
}
@keyframes akis {
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; }
}`

const TW = `<path pathLength={1} className="edge-draw" style={{ '--p': 0.6 }} />

<span className="rounded-full border-[1.5px] border-active
  bg-bg [filter:var(--glow-active)]" />

<div className="panel ticks bg-panel/90 border border-line
  rounded-[14px]" />`

export function Build() {
  return (
    <Section id="yapi" eyebrow="Madde 12 · 13 · 14 · 15 · Figma ve kod" title="Bağlayıcılar, varyantlar, tokenlar" lead="Figma’da bağlantı çizgileri düğümlere bir eklentiyle (Arrow Auto gibi) bağlanır; düğüm taşınınca çizgi yeniden yol bulur. İşlem aşamaları tek bir Step bileşeninin varyantlarıdır.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Otomatik bağlayıcı">
          <ArrowAuto />
        </Panel>
        <Panel title="Step progress varyantları">
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {STATES.map((s, i) => (
              <li key={s} className="flex flex-col items-center gap-2 rounded-xl border border-line px-2 py-3 text-center">
                <StepNode status={s} n={i + 1} size={40} />
                <span className="font-mono text-[10px] leading-tight text-muted mono-tight">
                  State=
                  <br />
                  <span className="text-ink">{STATUS[s]}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="label mt-5">Connector · Progress=0 · 50 · 100</p>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {[0, 0.5, 1].map((p) => (
              <div key={p} className="flex items-center rounded-xl border border-line px-2">
                <Connector orientation="yatay" progress={p} />
              </div>
            ))}
          </div>
          <p className="label mt-5">Orientation=Yatay · Dikey</p>
          <div className="mt-2 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
            <div className="rounded-xl border border-line p-3">
              <AIAgentTimeline
                compact
                orientation="yatay"
                label="Örnek: yatay zaman çizelgesi"
                steps={[
                  { id: 'a', ad: 'Anla', status: 'tamam', progress: 1 },
                  { id: 'b', ad: 'Ara', status: 'calisiyor', progress: 0.5 },
                  { id: 'c', ad: 'Üret', status: 'bekliyor', progress: 0 },
                ]}
              />
            </div>
            <div className="rounded-xl border border-line p-3">
              <AIAgentTimeline
                compact
                orientation="dikey"
                label="Örnek: dikey zaman çizelgesi"
                steps={[
                  { id: 'a', ad: 'Anla', status: 'tamam', progress: 1 },
                  { id: 'b', ad: 'Ara', status: 'hata', progress: 0.3, retries: 1 },
                ]}
              />
            </div>
          </div>
        </Panel>
        <Panel title="Figma tokenları">
          <div className="scroll-x" tabIndex={0} role="region" aria-label="Token tablosu, yatay kaydırılabilir">
            <table className="w-full min-w-[440px] text-left text-[14px]">
              <caption className="sr-only">Figma değişkenleri ve değerleri</caption>
              <thead className="label">
                <tr className="border-b border-line">
                  <th scope="col" className="py-2 pr-3 font-normal">
                    Token
                  </th>
                  <th scope="col" className="py-2 pr-3 font-normal">
                    Değer
                  </th>
                  <th scope="col" className="py-2 font-normal">
                    Örnek
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Color/NodeActive', '#FACC15', <span className="block size-5 rounded-full border-[1.5px] border-active bg-bg" style={{ filter: 'var(--glow-active)' }} />],
                  ['Color/NodeDone', '#4ADE80', <span className="block size-5 rounded-full border-[1.5px] border-done bg-bg" />],
                  ['Color/EdgeLine', '#8B5CF6 · %35', <span className="block h-0.5 w-10 bg-edge" />],
                  ['Effects/NeuralGlow', 'drop-shadow 4px + 16px', <span className="glow block size-5 rounded-full bg-violet" />],
                  ['Gradient/Brand', '#60A5FA – #A78BFA', <span className="block h-3 w-10 rounded-full bg-[linear-gradient(120deg,#60a5fa,#a78bfa)]" />],
                  ['Color/SpaceBlack', '#0A0A0A', <span className="block size-5 rounded-md border border-line-strong bg-bg" />],
                ].map(([k, v, ex]) => (
                  <tr key={k as string} className="border-b border-line last:border-0">
                    <th scope="row" className="py-2 pr-3 font-mono text-[12px] font-normal mono-tight">
                      {k}
                    </th>
                    <td className="py-2 pr-3 font-mono text-[12px] text-muted mono-tight">{v}</td>
                    <td className="py-2" aria-hidden="true">
                      {ex}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-muted">Tamamı tokens/neural.tokens.json dosyasında.</p>
          <p className="label mt-5">Katman yapısı</p>
          <pre className="scroll-x mt-2 rounded-lg border border-line bg-bg/70 p-3 font-mono text-[11px] leading-relaxed text-muted mono-tight" tabIndex={0} aria-label="Figma katman yapısı">
            <code>{`AgentTimeline        Auto Layout · yatay / dikey
  Step               Instance · State, Orientation
    Node             Ellipse 44 · stroke 1,5 · NeuralGlow
    Label            Text · Outfit 17 / Martian 12
  Connector          Vector · Arrow Auto ile bağlı
    Progress         Boolean: 0 · 50 · 100
ModelSelector        Auto Layout · dikey
  Option             Instance · Where=Bulut/Yerel
    CapBadge         Instance · Cap=Akıl/Araç/Görsel`}</code>
          </pre>
        </Panel>
        <Panel title="React ve CSS">
          <div className="grid gap-4">
            <Code label="React">{REACT}</Code>
            <Code label="CSS · stroke-dasharray">{CSS}</Code>
            <Code label="Tailwind">{TW}</Code>
          </div>
        </Panel>
      </div>
    </Section>
  )
}
