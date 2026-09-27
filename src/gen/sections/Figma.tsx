import { useState, type CSSProperties } from 'react'
import { Card, SectionHead } from '../components/ui'
import { ToolCall } from '../components/core'
import { IconSearch } from '../components/Icons'
import { useView } from '../lib/view'

/** Madde 12 · 13: iç içe Auto Layout ve Hug Contents; tokenlar */
export function Figma() {
  const v = useView()
  const [ad, setAd] = useState('katalog_ara')
  const [ozet, setOzet] = useState('4 eşleşme')
  const [yogun, setYogun] = useState(0)
  return (
    <section id="figma" className="px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="12 · 13"
          label="Figma mimarisi"
          title="İç içe Auto Layout, her yerde Hug"
          lede="Üretilen bileşenin boyutu önceden bilinmez. Bu yüzden her kutu içeriğini sarar (Hug contents) ve iç içe Auto Layout katmanları birbirini iter; sabit genişlik yalnız en dış kapsayıcıda."
        />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Card title="Katman denetçisi" meta={v.inspect ? 'açık' : 'kapalı'}>
            <label className="flex cursor-pointer items-center gap-2 font-sans text-[14px]">
              <input type="checkbox" checked={v.inspect} onChange={(e) => v.setInspect(e.target.checked)} className="size-4 accent-[var(--accent)]" />
              Auto Layout katmanlarını bütün sayfada göster
            </label>
            <p className="mt-2 font-sans text-[13px] text-muted">Açıkken her Auto Layout çerçevesi kesikli çizgi ve adıyla görünür (üst çubuktaki katman düğmesi de aynı işi yapar).</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="font-sans text-[12px] font-medium text-muted">
                Araç adı
                <input value={ad} onChange={(e) => setAd(e.target.value.replace(/\s/g, '_'))} maxLength={40} className="mt-1 block min-h-9 w-full rounded-md border border-line-strong bg-bg px-2.5 font-mono text-[13px] text-ink outline-none focus:border-accent" />
              </label>
              <label className="font-sans text-[12px] font-medium text-muted">
                Özet
                <input value={ozet} onChange={(e) => setOzet(e.target.value)} maxLength={40} className="mt-1 block min-h-9 w-full rounded-md border border-line-strong bg-bg px-2.5 text-[13px] text-ink outline-none focus:border-accent" />
              </label>
            </div>
            <div data-layout="Kapsayıcı · fill" className="mt-5 flex flex-col items-start gap-3 rounded-md border border-dashed border-line-strong p-3">
              <ToolCall name={ad || 'arac'} params={{ sorgu: 'backdrop-filter' }} status="done" summary={ozet} elapsed={1300} />
              <div data-layout="Satır · hug" className="hug flex flex-wrap gap-1.5">
                {['kaynak', 'tablo', 'grafik'].map((x) => (
                  <span key={x} data-layout="Çip · hug" className="hug rounded-full border border-line px-2.5 py-0.5 font-sans text-[13px]">
                    {x}
                  </span>
                ))}
              </div>
            </div>
            <pre className="scroll-x mt-4 rounded-md bg-sunken p-3 font-mono text-[12px] leading-relaxed text-muted" tabIndex={0} aria-label="Katman ağacı">
              {`Kapsayıcı            Auto Layout dikey · genişlik: fill
|- ToolCall          Auto Layout yatay · hug × hug
|  |- Durum ikonu    16 × 16
|  |- Ad             metin · hug
|  |- Özet           metin · hug
|  '- Ok             16 × 16
'- Satır             Auto Layout yatay · hug · sarmala
   '- Çip × 3        Auto Layout yatay · hug × hug`}
            </pre>
          </Card>

          <div className="flex min-w-0 flex-col gap-6">
            <Card title="Spacing/DynamicGap" meta={`${16 - yogun * 8}px`}>
              <p className="font-sans text-[14px] text-muted">İçerik yoğunlaştıkça bloklar arası boşluk 16px'ten 8px'e iner; seyrek yanıt ferah, yoğun yanıt sıkı durur.</p>
              <label className="mt-3 flex items-center gap-3 font-sans text-[13px] text-muted">
                Yoğunluk
                <input type="range" min={0} max={1} step={0.25} value={yogun} onChange={(e) => setYogun(+e.target.value)} className="flex-1 accent-[var(--accent)]" />
              </label>
              <div className="dyn-gap mt-3 flex flex-col" style={{ '--density': yogun } as CSSProperties}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-2 rounded-md border border-line px-3 py-1.5 font-sans text-[13px]">
                    <IconSearch size={13} className="text-muted" /> blok {i + 1}
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Tokenlar" meta="madde 13">
              <dl className="flex flex-col divide-y divide-line font-sans text-[13px]">
                {[
                  ['Spacing/DynamicGap', 'calc(16px − yoğunluk × 8px)'],
                  ['Color/AI-Accent', '#4F46E5 · koyu #818CF8'],
                  ['Color/AI-Accent/Soft', '#EEF2FF · koyu indigo %16'],
                  ['Border/ToolCard', '1px #E4E4E7 · 8px'],
                  ['Radius/Container', '8px'],
                  ['Shadow/ToolResult', '0 1px 2px %6 · 0 10px 28px −12px %18'],
                ].map(([k, val]) => (
                  <div key={k} className="flex flex-wrap items-baseline justify-between gap-x-3 py-1.5">
                    <dt className="font-mono text-[12.5px]">{k}</dt>
                    <dd className="text-muted">{val}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
