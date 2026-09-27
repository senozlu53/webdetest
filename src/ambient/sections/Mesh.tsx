import { useState } from 'react'
import { SectionHead } from '../components/SectionHead'
import { GlowCard } from '../components/GlowCard'
import { GradientMesh } from '../components/GradientMesh'
import { cx } from '../../shared/cx'

/** Figma'daki kurulum: asimetrik vektörler üst üste, her birine Layer Blur */
const VECTORS = [
  { d: 'M60 40c60-30 150-10 170 50s-30 120-100 110S0 150 10 100 20 60 60 40z', color: 'var(--a1-1)', x: -30, y: -24 },
  { d: 'M150 20c50 0 110 40 100 100s-70 80-120 60-60-70-40-110 30-50 60-50z', color: 'var(--a1-2)', x: 34, y: -20 },
  { d: 'M40 150c20-50 100-60 150-30s60 100 10 120-110 20-140-10-40-40-20-80z', color: 'var(--a1-3)', x: -24, y: 30 },
  { d: 'M170 130c40-10 90 20 80 70s-60 60-100 40-40-50-20-80 20-25 40-30z', color: 'var(--a1-4)', x: 36, y: 34 },
] as const

const CSS = `@property --mx1 {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 18%;
}

.gradient-mesh {
  background:
    radial-gradient(at var(--mx1) var(--my1), var(--a1-1) 0, transparent 55%),
    radial-gradient(at var(--mx2) var(--my2), var(--a1-2) 0, transparent 55%),
    /* … */ var(--canvas);
  animation: mesh-flow 18s ease-in-out infinite alternate;
}

@keyframes mesh-flow {
  33% { --mx1: 40%; --my1: 12%; /* … */ }
  66% { --mx1: 68%; --my1: 30%; /* … */ }
}`

const PALETTES = [
  { id: 'aurora1', token: 'Gradient/Aurora1', vars: ['--a1-1', '--a1-2', '--a1-3', '--a1-4'], dark: ['#7C3AED', '#22D3EE', '#F472B6', '#34D399'], light: ['#C4B5FD', '#A5F3FC', '#FBCFE8', '#A7F3D0'] },
  { id: 'aurora2', token: 'Gradient/Aurora2', vars: ['--a2-1', '--a2-2', '--a2-3', '--a2-4'], dark: ['#6366F1', '#EC4899', '#F59E0B', '#10B981'], light: ['#C7D2FE', '#F9A8D4', '#FDE68A', '#6EE7B7'] },
] as const

export function Mesh({ dark }: { dark: boolean }) {
  const [blur, setBlur] = useState(true)
  const [exploded, setExploded] = useState(false)
  const [palette, setPalette] = useState<'aurora1' | 'aurora2'>('aurora1')

  return (
    <section id="mesh" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="04 · 08 · 12 · 13 · 15"
          label="Gradient mesh"
          title="Bulanık vektörlerden akan ışık"
          lede="Figma'da mesh, Layer Blur uygulanmış asimetrik vektörlerin üst üste binmesiyle kurulur. Kodda aynı etki, merkezleri @keyframes ile yer değiştiren radyal gradyanlarla elde edilir."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <GlowCard className="flex min-w-0 flex-col gap-5 p-6">
            <h3 className="text-xl font-light">Figma: vektör + Layer Blur</h3>
            <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[22px] bg-canvas">
              <svg viewBox="-40 -40 340 340" className="h-full w-full" role="img" aria-label="Dört asimetrik vektörün üst üste binmesi">
                {VECTORS.map((v, i) => (
                  <path
                    key={i}
                    d={v.d}
                    fill={v.color}
                    style={{
                      filter: blur ? 'blur(28px)' : 'none',
                      opacity: blur ? 0.9 : 0.75,
                      transform: exploded ? `translate(${v.x}px, ${v.y}px)` : 'none',
                      transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1), filter 600ms ease',
                      mixBlendMode: dark ? 'screen' : 'multiply',
                    }}
                  />
                ))}
              </svg>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" aria-pressed={blur} onClick={() => setBlur((v) => !v)} className={cx('min-h-11 cursor-pointer rounded-full border px-4 text-sm', blur ? 'glow-border border-transparent bg-scrim' : 'border-line')}>
                <span lang="en">Layer Blur</span> {blur ? 'açık' : 'kapalı'}
              </button>
              <button type="button" aria-pressed={exploded} onClick={() => setExploded((v) => !v)} className={cx('min-h-11 cursor-pointer rounded-full border px-4 text-sm', exploded ? 'glow-border border-transparent bg-scrim' : 'border-line')}>
                Katmanları {exploded ? 'birleştir' : 'ayır'}
              </button>
            </div>
          </GlowCard>

          <GlowCard className="flex min-w-0 flex-col gap-5 p-6">
            <h3 className="text-xl font-light">Kod: @property + @keyframes</h3>
            <GradientMesh palette={palette} className="aspect-[4/3] rounded-[22px]" role="img" aria-label="Canlı gradient mesh" />
            <div role="radiogroup" aria-label="Palet" className="flex flex-wrap gap-3">
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={palette === p.id}
                  onClick={() => setPalette(p.id)}
                  className={cx('flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm', palette === p.id ? 'glow-border border-transparent bg-scrim' : 'border-line')}
                >
                  <span className="flex -space-x-1" aria-hidden="true">
                    {p.vars.map((v) => (
                      <span key={v} className="size-3.5 rounded-full border border-line" style={{ background: `var(${v})` }} />
                    ))}
                  </span>
                  <span lang="en">{p.token}</span>
                </button>
              ))}
            </div>
          </GlowCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <GlowCard className="p-6">
            <h3 className="text-xl font-light">Paletler</h3>
            <p className="mt-1 text-sm text-muted">Canlı, birbirine karışan tonlar. Gece temasında neon, Şafak temasında doygun pastel.</p>
            <table className="mt-5 w-full text-left text-sm">
              <caption className="sr-only">Aurora paletleri</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="py-2 font-normal text-muted">
                    Token
                  </th>
                  <th scope="col" className="py-2 font-normal text-muted">
                    {dark ? 'Gece' : 'Şafak'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {PALETTES.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0">
                    <th scope="row" className="py-3 pr-3 font-normal" lang="en">
                      {p.token}
                    </th>
                    <td className="py-3">
                      <span className="flex flex-wrap gap-2">
                        {(dark ? p.dark : p.light).map((c) => (
                          <span key={c} className="flex items-center gap-1.5 font-mono text-xs tabular-nums">
                            <span className="size-4 rounded-full" style={{ background: c }} aria-hidden="true" />
                            {c}
                          </span>
                        ))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlowCard>
          <GlowCard className="min-w-0 p-6">
            <h3 className="text-xl font-light">CSS · Madde 15</h3>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-line bg-scrim p-4 font-mono text-xs leading-relaxed">
              <code>{CSS}</code>
            </pre>
          </GlowCard>
        </div>
      </div>
    </section>
  )
}
