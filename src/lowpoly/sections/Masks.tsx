import { useId, useState, type KeyboardEvent, type PointerEvent } from 'react'
import poster from '../assets/hero-poster.webp'
import { FacetButton, Glass, SectionHead } from '../components/ui'
import { MASKS, snap, toPolygon, type Pt } from '../lib/shapes'
import { cx } from '../../shared/cx'

/** Madde 12 · 13 · 15: noktaları %5'lik ızgaraya kilitli poligon maske düzenleyici → CSS clip-path */
function MaskEditor() {
  const [preset, setPreset] = useState<keyof typeof MASKS>('kristal')
  const [pts, setPts] = useState<Pt[]>(MASKS.kristal.points)
  const [dragging, setDragging] = useState<number | null>(null)
  const hintId = useId()

  const choose = (k: keyof typeof MASKS) => {
    setPreset(k)
    setPts(MASKS[k].points)
  }
  const move = (i: number, x: number, y: number) => setPts((p) => p.map((q, j) => (j === i ? [snap(x), snap(y)] : q)))
  const onPointer = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging === null) return
    const r = e.currentTarget.getBoundingClientRect()
    move(dragging, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100)
  }
  const onKey = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const d: Record<string, Pt> = { ArrowLeft: [-5, 0], ArrowRight: [5, 0], ArrowUp: [0, -5], ArrowDown: [0, 5] }
    const v = d[e.key]
    if (!v) return
    e.preventDefault()
    move(i, pts[i][0] + v[0], pts[i][1] + v[1])
  }
  const css = `clip-path: ${toPolygon(pts)};`

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Glass className="p-5">
        <div
          className="relative mx-auto aspect-[16/10] w-full touch-none select-none"
          onPointerMove={onPointer}
          onPointerUp={() => setDragging(null)}
          onPointerLeave={() => setDragging(null)}
        >
          {/* Izgara: %5 adım, her %25'te belirgin */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {Array.from({ length: 21 }, (_, i) => (
              <g key={i} stroke="var(--line)" strokeWidth={i % 5 === 0 ? 0.4 : 0.15} vectorEffect="non-scaling-stroke">
                <line x1={i * 5} y1={0} x2={i * 5} y2={100} vectorEffect="non-scaling-stroke" />
                <line x1={0} y1={i * 5} x2={100} y2={i * 5} vectorEffect="non-scaling-stroke" />
              </g>
            ))}
          </svg>
          <img src={poster} alt="Maskelenmiş düşük poligon manzara" className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: toPolygon(pts) }} />
          {pts.map(([x, y], i) => (
            <button
              key={i}
              type="button"
              aria-label={`Nokta ${i + 1}: yatay %${x}, dikey %${y}`}
              aria-describedby={hintId}
              onPointerDown={(e) => {
                e.currentTarget.focus()
                setDragging(i)
              }}
              onKeyDown={onKey(i)}
              className={cx('absolute size-5 -translate-x-1/2 -translate-y-1/2 cursor-grab border-2 border-bg bg-accent', dragging === i && 'scale-125')}
              style={{ left: `${x}%`, top: `${y}%`, clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}
            />
          ))}
        </div>
        <p id={hintId} className="mt-3 text-[14px] text-muted">
          Noktaları sürükleyin ya da odaklanıp ok tuşlarıyla %5 adımla taşıyın. Figma'da da vektör noktaları aynı ızgaraya kilitlenir.
        </p>
      </Glass>
      <Glass className="flex flex-col gap-5 p-6">
        <fieldset>
          <legend className="mb-2 text-[14px] font-semibold">Shape/PolygonMask varyantı</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MASKS) as Array<keyof typeof MASKS>).map((k) => (
              <label key={k} className="cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
                <input type="radio" name="maske" value={k} checked={preset === k} onChange={() => choose(k)} className="sr-only" />
                <span className={cx('flex min-h-11 items-center gap-2 border px-3 text-[14px] font-semibold', preset === k ? 'border-accent bg-line' : 'border-line text-muted hover:text-ink')}>
                  <span className="size-4 bg-current" style={{ clipPath: toPolygon(MASKS[k].points) }} aria-hidden="true" />
                  {MASKS[k].name}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <pre className="overflow-x-auto border border-line bg-bg p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
          <code>{css}</code>
        </pre>
        <p className="text-[14px] text-muted">{pts.length} nokta. Aynı sayıda noktası olan iki poligon arasında clip-path geçişle canlandırılabilir; düğmelerin üzerine gelince açılması bundandır.</p>
      </Glass>
    </div>
  )
}

export function Masks() {
  return (
    <section id="maske" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="12 · 13 · 15"
          label={<span lang="en">Figma · clip-path</span>}
          title="Poligon maskeler"
          lede="Görseller, kartlar ve düğmeler dikdörtgen değil: CSS clip-path ile köşeleri kesilmiş asimetrik çokgenler. Maskeler Figma'da ızgaraya kilitli vektörlerle çizilir, koda aynı yüzdelerle geçer."
        />
        <MaskEditor />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Glass className="flex flex-col gap-4 p-6">
            <h3 className="text-xl font-bold">Düğmeler</h3>
            <div className="flex flex-wrap gap-3">
              <FacetButton>Başla</FacetButton>
              <FacetButton variant="ghost">Keşfet</FacetButton>
              <FacetButton shape="polygon(8% 0, 100% 0, 92% 100%, 0 100%)" hoverShape="polygon(0 0, 100% 0, 100% 100%, 0 100%)">
                Paralel
              </FacetButton>
              <FacetButton disabled>Kapalı</FacetButton>
            </div>
            <p className="text-[14px] text-muted">
              Şekil <span className="font-mono">::before</span> katmanındadır; düğmenin kendisi kırpılmaz. Böylece odak halkası ve tıklama alanı dikdörtgen kalır, kırpılıp
              kaybolmaz. Klavyeyle Sekme'ye basıp deneyin.
            </p>
          </Glass>
          <div className="facet-card glass flex flex-col gap-3 p-7">
            <h3 className="text-xl font-bold">Asimetrik kart</h3>
            <p className="text-[15px] text-muted">Sağ üst ve sol alt köşe %9 kesik. İçerik kesik köşelerden uzak durur: iç boşluk kesimden büyüktür.</p>
            <pre className="overflow-x-auto border border-line bg-bg p-3 font-mono text-[12px] whitespace-pre-wrap">
              <code>clip-path: polygon(0 0, 91% 0, 100% 9%, 100% 100%, 9% 100%, 0 91%);</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
