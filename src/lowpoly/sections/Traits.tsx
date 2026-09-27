import { useId, useState } from 'react'
import { Glass, SectionHead } from '../components/ui'
import { lightDir, ramp } from '../lib/facets'
import { useStoredAttr } from '../hooks/useStoredAttr'
import { cx } from '../../shared/cx'

const hex = (c: number[]) => '#' + c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')

/**
 * Madde 3 · 6: az yüzle "küre" illüzyonu. Çember N parçaya bölünür; her parça yarım küre
 * üzerindeki eğik bir yüzdür. Düz gölgelendirmede her yüz tek renk alır (yumuşatma yok).
 */
function FacetSphere({ n, smooth }: { n: number; smooth: boolean }) {
  const R = 120
  const L = lightDir(135, 40)
  const rings = 3
  const polys: Array<{ points: string; fill: string }> = []
  for (let k = 0; k < rings; k++) {
    const r0 = (R * k) / rings
    const r1 = (R * (k + 1)) / rings
    const z0 = Math.sqrt(Math.max(0, 1 - (r0 / R) ** 2))
    const z1 = Math.sqrt(Math.max(0, 1 - (r1 / R) ** 2))
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2 + (k % 2 ? Math.PI / n : 0)
      const a1 = ((i + 1) / n) * Math.PI * 2 + (k % 2 ? Math.PI / n : 0)
      const am = (a0 + a1) / 2
      const rm = (r0 + r1) / 2
      const zm = (z0 + z1) / 2
      const nx = (Math.cos(am) * rm) / R
      const ny = (Math.sin(am) * rm) / R
      const len = Math.hypot(nx, ny, zm) || 1
      const lambert = Math.max(0, (nx * L[0] + ny * L[1] + zm * L[2]) / len)
      const base = ramp(0.55 + zm * 0.3)
      const fill = hex(base.map((v) => v * (0.3 + 0.7 * lambert)))
      const p = k === 0 ? [[0, 0], [Math.cos(a0) * r1, Math.sin(a0) * r1], [Math.cos(a1) * r1, Math.sin(a1) * r1]] : [[Math.cos(a0) * r0, Math.sin(a0) * r0], [Math.cos(a0) * r1, Math.sin(a0) * r1], [Math.cos(a1) * r1, Math.sin(a1) * r1], [Math.cos(a1) * r0, Math.sin(a1) * r0]]
      polys.push({ points: p.map(([x, y]) => `${(x + 130).toFixed(1)},${(y + 130).toFixed(1)}`).join(' '), fill })
    }
  }
  return (
    <svg viewBox="0 0 260 260" className="mx-auto w-full max-w-[280px]" role="img" aria-label={smooth ? 'Yumuşak gölgeli küre' : `${n * 3} yüzlü düz gölgeli küre`}>
      <defs>
        <radialGradient id="smooth-sphere" cx="0.32" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#e8d8b0" />
          <stop offset="0.45" stopColor="#7a9e9f" />
          <stop offset="1" stopColor="#101820" />
        </radialGradient>
      </defs>
      {smooth ? (
        <circle cx="130" cy="130" r={R} fill="url(#smooth-sphere)" />
      ) : (
        polys.map((p, i) => <polygon key={i} points={p.points} fill={p.fill} stroke={p.fill} strokeWidth={0.5} strokeLinejoin="round" />)
      )}
    </svg>
  )
}

const TRAITS = [
  ['Düşük detaylı ağ', 'Nesne, onu tanıtan en az sayıda üçgenle kurulur. Detay yerine siluet konuşur.'],
  ['Köşeli gölge', 'Her yüz ışığa göre tek bir ton alır; tonlar arasında geçiş yoktur, kenar keskin kalır.'],
  ['Geometrik form', 'Üçgenler ve çokgenler; eğri yok. Organik biçimler bile düz parçalardan kurulur.'],
  ['Düz gölgelendirme', 'Normaller yüz başına hesaplanır, köşeler paylaşılmaz: flat shading, yumuşatma yok.'],
] as const

export function Traits() {
  const [n, setN] = useState(9)
  const [smooth, setSmooth] = useState(false)
  const [grain, setGrain] = useStoredAttr<'on' | 'off'>('lowpoly-grain', 'grain', 'on')
  const id = useId()
  return (
    <section id="ozellikler" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="01 · 03 · 06 · 08"
          label="Karakteristikler"
          title="Az üçgen, çok karakter"
          lede="Düşük poligon estetiği, bir 3B modelin ağını bilerek seyrek bırakır. Kıvrımlar düz yüzlere bölünür ve her yüz ışığı kendi açısıyla yakalar: dijital origami."
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Glass className="flex flex-col gap-5 p-6">
            <FacetSphere n={n} smooth={smooth} />
            <div>
              <div className="flex items-baseline justify-between text-[14px] font-semibold">
                <label htmlFor={id}>Halka başına yüz</label>
                <output htmlFor={id} className="font-mono">
                  {n} × 3 = {n * 3}
                </output>
              </div>
              <input id={id} type="range" min={5} max={32} value={n} onChange={(e) => setN(Number(e.target.value))} disabled={smooth} className="mt-2 w-full accent-[var(--accent)]" />
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Gölgelendirme">
              {[false, true].map((s) => (
                <button
                  key={String(s)}
                  type="button"
                  aria-pressed={smooth === s}
                  onClick={() => setSmooth(s)}
                  className={cx('min-h-11 cursor-pointer border px-4 text-[14px] font-semibold', smooth === s ? 'border-accent bg-line' : 'border-line text-muted hover:text-ink')}
                >
                  {s ? 'Yumuşak (bu stil değil)' : 'Düz gölgelendirme'}
                </button>
              ))}
            </div>
            <p className="text-[14px] text-muted">Beş yüzde bile göz bir küre görür: keskin hatlar organik bir illüzyon kurar (Madde 6).</p>
          </Glass>
          <div className="flex flex-col gap-4">
            <ul className="grid gap-4 sm:grid-cols-2">
              {TRAITS.map(([t, d]) => (
                <li key={t}>
                  <Glass className="facet-card h-full p-5">
                    <p className="font-display text-lg font-bold">{t}</p>
                    <p className="mt-1 text-[15px] text-muted">{d}</p>
                  </Glass>
                </li>
              ))}
            </ul>
            <Glass className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="max-w-[46ch]">
                <p className="font-display text-lg font-bold">Doku · Madde 8</p>
                <p className="text-[15px] text-muted">Yüzeyler mat ve dokusuzdur; isteğe bağlı %8 dijital gren kristal ve kâğıt hissini artırır. Metin kontrastını değiştirmez.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={grain === 'on'}
                onClick={() => setGrain(grain === 'on' ? 'off' : 'on')}
                className="flex min-h-11 cursor-pointer items-center gap-3 border border-line px-4 text-[14px] font-semibold"
              >
                Gren
                <span className={cx('relative h-6 w-11 border border-line', grain === 'on' && 'bg-accent')} aria-hidden="true">
                  <span className={cx('absolute top-0.5 size-4 bg-ink transition-[left] duration-200', grain === 'on' ? 'left-6 bg-bg' : 'left-0.5')} style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
                </span>
              </button>
            </Glass>
          </div>
        </div>
      </div>
    </section>
  )
}
