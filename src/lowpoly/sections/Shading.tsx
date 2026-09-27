import { useId, useState } from 'react'
import { FacetField, Glass, SectionHead } from '../components/ui'

/** Madde 7 · 11: her çokgen ışık kaynağına olan açısına göre kendi (düz) tonunu alır */
export function Shading() {
  const [az, setAz] = useState(135)
  const [el, setEl] = useState(40)
  const azId = useId()
  const elId = useId()
  return (
    <section id="golge" className="relative isolate overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 -z-10">
        <FacetField seed={7} cols={22} rows={12} azimuth={az} elevation={el} />
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 md:px-8 lg:grid-cols-[1.1fr_1fr]">
        <Glass className="p-6 md:p-8">
          <SectionHead
            item="07 · 11"
            label="Yüz gölgelendirme"
            title="Işık açısı, yüz tonu"
            lede="Arkadaki yüzey 528 üçgendir. Her birinin normali hesaplanır; ışıkla yaptığı açının kosinüsü o yüzün tek ve düz tonunu belirler. Işığı çevirin: tonlar yüz yüz değişir, hiçbiri kendi içinde geçiş yapmaz."
          />
          <p className="font-mono text-[13px] text-muted">renk = taban(yükseklik) × (0,34 + 0,66 × max(0, n · L))</p>
        </Glass>
        <Glass className="flex flex-col justify-center gap-6 p-6 md:p-8">
          <div>
            <div className="flex items-baseline justify-between text-[14px] font-semibold">
              <label htmlFor={azId}>Işık yönü</label>
              <output htmlFor={azId} className="font-mono">
                {az}°
              </output>
            </div>
            <input id={azId} type="range" min={0} max={359} value={az} onChange={(e) => setAz(Number(e.target.value))} className="mt-2 w-full accent-[var(--accent)]" />
          </div>
          <div>
            <div className="flex items-baseline justify-between text-[14px] font-semibold">
              <label htmlFor={elId}>Işık yüksekliği</label>
              <output htmlFor={elId} className="font-mono">
                {el}°
              </output>
            </div>
            <input id={elId} type="range" min={10} max={85} value={el} onChange={(e) => setEl(Number(e.target.value))} className="mt-2 w-full accent-[var(--accent)]" />
          </div>
          <dl className="grid gap-3 text-[14px] sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <span className="size-8 shrink-0 bg-[var(--facet-hi)]" style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} aria-hidden="true" />
              <div>
                <dt className="font-mono font-semibold">Color/FacetHighlight</dt>
                <dd className="text-muted">#E8D8B0 · ışığa bakan</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="size-8 shrink-0 bg-[var(--facet-lo)] ring-1 ring-[var(--line)]" style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} aria-hidden="true" />
              <div>
                <dt className="font-mono font-semibold">Color/FacetShadow</dt>
                <dd className="text-muted">#0A1016 · ışıktan kaçan</dd>
              </div>
            </div>
          </dl>
        </Glass>
      </div>
    </section>
  )
}
