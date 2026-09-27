import { useMemo, useRef, useState, type PointerEvent } from 'react'
import { rng } from '../lib/rand'
import { useNeural } from '../lib/store'
import { cx } from '../../shared/cx'

interface Node {
  l: number
  k: number
  x: number
  y: number
}
interface Edge {
  a: Node
  b: Node
  w: number
}

function build(layers: number[], w: number, h: number, px: number, py: number, seed: number) {
  const r = rng(seed)
  const nodes: Node[][] = layers.map((n, l) => {
    const x = px + ((w - px * 2) * l) / (layers.length - 1)
    return Array.from({ length: n }, (_, k) => ({ l, k, x, y: n === 1 ? h / 2 : py + ((h - py * 2) * (k + 0.5)) / n }))
  })
  const edges: Edge[] = []
  for (let l = 0; l < layers.length - 1; l++) for (const a of nodes[l]) for (const b of nodes[l + 1]) edges.push({ a, b, w: r() })
  return { nodes, edges }
}

/** Madde 6: bağlantılar Bezier eğrisi; kontrol noktaları yatay, böylece akış soldan sağa okunur */
export const bez = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = (x2 - x1) * 0.5
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}C${(x1 + dx).toFixed(1)} ${y1.toFixed(1)} ${(x2 - dx).toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`
}

/** Arka plandaki soluk ağ: odak düzleminin dışında kalır (Madde 7) */
function Ghost({ w, h, layers, seed, r, o }: { w: number; h: number; layers: number[]; seed: number; r: number; o: number }) {
  const g = useMemo(() => build(layers, w, h, 20, 20, seed), [layers, w, h, seed])
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="size-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g opacity={o}>
        {g.edges.map((e, i) => (e.w > 0.55 ? <path key={i} d={bez(e.a.x, e.a.y, e.b.x, e.b.y)} stroke="#8b5cf6" strokeWidth={1} fill="none" opacity={e.w * 0.6} /> : null))}
        {g.nodes.flat().map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={r} fill={i % 3 ? '#60a5fa' : '#a78bfa'} />
        ))}
      </g>
    </svg>
  )
}

const INPUTS = ['istem', 'bağlam', 'araçlar', 'bellek']
export const OUTPUTS = [
  { ad: 'Ara', p: 0.62 },
  { ad: 'Analiz Et', p: 0.27 },
  { ad: 'Üret', p: 0.11 },
]

/**
 * Kahraman ağı: dört katmanlı odak derinliği (uzak, orta, odak, yakın).
 * Odak katmanındaki ağ keskin; uzak ağ ve yakın partiküller bulanık. İmleç hareketinde katmanlar farklı hızda kayar.
 * Seçilen çıktının en güçlü yolu sarı (işlemde) çizgiyle, stroke-dashoffset ile çizilerek belirir.
 */
export function NeuralGraph({ wide, out }: { wide: boolean; out: number }) {
  const { motion } = useNeural()
  const W = wide ? 1000 : 420
  const H = wide ? 440 : 480
  const layers = useMemo(() => (wide ? [4, 6, 7, 6, 3] : [4, 5, 5, 3]), [wide])
  const px = wide ? 130 : 100
  const g = useMemo(() => build(layers, W, H, px, 44, 15), [layers, W, H, px])
  const [par, setPar] = useState({ x: 0, y: 0 })
  const box = useRef<HTMLDivElement>(null)

  // Seçilen çıktıdan geriye en güçlü bağlantıları izle
  const path = useMemo(() => {
    const last = g.nodes.length - 1
    const seq: Node[] = [g.nodes[last][out]]
    for (let l = last; l > 0; l--) {
      const b = seq[0]
      const best = g.edges.filter((e) => e.b === b).sort((x, y) => y.w - x.w)[0]
      seq.unshift(best.a)
    }
    return seq
  }, [g, out])
  const onPath = (n: Node) => path.includes(n)

  const bokeh = useMemo(() => {
    const r = rng(33)
    return Array.from({ length: wide ? 14 : 8 }, () => ({ x: r() * 100, y: r() * 100, s: 6 + r() * 16, c: r() > 0.5 ? '#60a5fa' : '#a78bfa', o: 0.12 + r() * 0.2 }))
  }, [wide])

  const move = (e: PointerEvent) => {
    if (!motion || e.pointerType !== 'mouse') return
    const b = box.current?.getBoundingClientRect()
    if (!b) return
    setPar({ x: (e.clientX - b.left) / b.width - 0.5, y: (e.clientY - b.top) / b.height - 0.5 })
  }
  const shift = (d: number) => ({ transform: `translate3d(${(-par.x * d).toFixed(1)}px, ${(-par.y * d).toFixed(1)}px, 0)`, transition: 'transform 600ms cubic-bezier(0.2,0.7,0.2,1)' })

  return (
    <div ref={box} className="relative size-full overflow-hidden" onPointerMove={move} onPointerLeave={() => setPar({ x: 0, y: 0 })}>
      {/* Uzak katman: küçük, soluk, çok bulanık */}
      <div className="dof fx-only absolute -inset-6 blur-[3px]" style={shift(6)}>
        <Ghost w={W * 1.2} h={H * 1.2} layers={wide ? [7, 9, 10, 9, 7, 5] : [6, 7, 7, 5]} seed={3} r={3} o={0.35} />
      </div>
      {/* Orta katman */}
      <div className="dof fx-only absolute -inset-4 blur-[1.2px]" style={shift(12)}>
        <Ghost w={W} h={H} layers={wide ? [5, 7, 8, 5] : [4, 6, 4]} seed={9} r={2.5} o={0.3} />
      </div>
      {/* Odak katmanı: asıl ağ */}
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" style={shift(18)} aria-hidden="true">
        <defs>
          <linearGradient id="ng-edge" gradientUnits="userSpaceOnUse" x1="0" x2={W} y1="0" y2="0">
            <stop offset="0" stopColor="#60a5fa" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <g fill="none" strokeLinecap="round">
          {g.edges.map((e, i) => (
            <path key={i} d={bez(e.a.x, e.a.y, e.b.x, e.b.y)} stroke="var(--edge)" strokeWidth={0.6 + e.w * 0.9} opacity={0.35 + e.w * 0.65} />
          ))}
          {/* Madde 15: veri akışı — kısa bir çizgi parçası yol boyunca ilerler */}
          {g.edges.map((e, i) =>
            e.w > 0.62 ? (
              <path
                key={`f${i}`}
                className="edge-flow fx-only"
                pathLength={1}
                d={bez(e.a.x, e.a.y, e.b.x, e.b.y)}
                stroke="url(#ng-edge)"
                strokeWidth={2}
                style={{ ['--flow-delay' as string]: `${(e.a.l * 0.55 + e.w * 0.4).toFixed(2)}s`, ['--flow-dur' as string]: '2.6s' }}
              />
            ) : null,
          )}
          <g key={`${out}-${wide}`}>
            {path.slice(1).map((b, i) => {
              const a = path[i]
              return <path key={i} className="draw-on glow-active" pathLength={1} d={bez(a.x, a.y, b.x, b.y)} stroke="var(--node-active)" strokeWidth={2.4} style={{ ['--draw-delay' as string]: `${i * 180}ms`, ['--draw-dur' as string]: '520ms' }} />
            })}
          </g>
        </g>
        <g>
          {g.nodes.flat().map((n, i) => {
            const hot = onPath(n)
            return (
              <g key={i}>
                {hot && motion ? <circle cx={n.x} cy={n.y} r={wide ? 9 : 10} fill="none" stroke="var(--node-active)" strokeWidth={1.5} className="node-pulse" style={{ animationDelay: `${n.l * 180}ms` }} /> : null}
                <circle cx={n.x} cy={n.y} r={wide ? 9 : 10} fill="#0a0a0a" stroke={hot ? 'var(--node-active)' : 'url(#ng-edge)'} strokeWidth={hot ? 2 : 1.4} />
              </g>
            )
          })}
        </g>
        <g className="glow">
          {g.nodes.flat().map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={wide ? 3.6 : 4} fill={onPath(n) ? 'var(--node-active)' : n.l % 2 ? '#a78bfa' : '#60a5fa'} className={onPath(n) ? undefined : 'node-wave'} style={{ ['--wave-delay' as string]: `${n.l * 0.36}s`, ['--wave-base' as string]: '0.4' }} />
          ))}
        </g>
        <g className="font-mono mono-tight" fontSize={wide ? 13 : 12} fill="var(--muted)">
          {g.nodes[0].map((n, i) => (
            <text key={i} x={n.x - 18} y={n.y + 4} textAnchor="end">
              {INPUTS[i]}
            </text>
          ))}
          {g.nodes[g.nodes.length - 1].map((n, i) => (
            <text key={i} x={n.x + 18} y={n.y + 4} fill={i === out ? 'var(--node-active)' : 'var(--muted)'}>
              {OUTPUTS[i].ad}
            </text>
          ))}
        </g>
      </svg>
      {/* Yakın katman: kameraya yakın, odak dışı partiküller */}
      <div className={cx('dof fx-only pointer-events-none absolute inset-0 blur-[5px]')} style={shift(34)} aria-hidden="true">
        {bokeh.map((b, i) => (
          <span key={i} className="absolute rounded-full" style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.s, height: b.s, background: b.c, opacity: b.o }} />
        ))}
      </div>
    </div>
  )
}
