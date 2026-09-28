import { useLayoutEffect, useRef, useState } from 'react'
import { Section } from '../components/ui'
import { Blob, Starburst } from '../components/Shapes'
import { StickerFace } from '../components/Sticker'
import { cx } from '../../shared/cx'

/**
 * Aynı kolaj, kapsayıcı sorgusuyla (@container) iki kurala uyar:
 * 700px ve üstü: mutlak konumlu, üst üste binen kaos. Altı: alt alta dizilen dev blok kartlar.
 */
function MiniCollage() {
  return (
    <div className="@container">
      <div className="relative flex flex-col gap-3 p-3 @min-[700px]:block @min-[700px]:h-[520px] @min-[700px]:p-0">
        <div className="rounded-[24px] border-4 border-[#111014] bg-pink p-4 text-[#111014] @min-[700px]:absolute @min-[700px]:top-6 @min-[700px]:left-6 @min-[700px]:z-10 @min-[700px]:-rotate-3 @min-[700px]:border-0 @min-[700px]:bg-transparent @min-[700px]:p-0">
          <p className="font-sans text-[44px] leading-[0.85] font-black uppercase [font-stretch:110%] @min-[700px]:text-[110px] @min-[700px]:text-pink @min-[700px]:[font-stretch:150%]">Kaos</p>
          <p className="font-serif text-[40px] leading-[0.85] font-black italic @min-[700px]:ml-24 @min-[700px]:text-[96px] @min-[700px]:text-blue">fest</p>
        </div>
        <div className="grid h-[180px] place-items-center rounded-[24px] border-4 border-[#111014] bg-[#111014] @min-[700px]:absolute @min-[700px]:top-10 @min-[700px]:right-8 @min-[700px]:z-30 @min-[700px]:h-[300px] @min-[700px]:w-[300px] @min-[700px]:rotate-6 @min-[700px]:rounded-full @min-[700px]:border-0 @min-[700px]:bg-transparent">
          <Blob seed={12} size={170} fill="var(--lilac)" />
        </div>
        <div className="rounded-[24px] border-4 border-[#111014] bg-butter p-4 text-[#111014] @min-[700px]:absolute @min-[700px]:bottom-10 @min-[700px]:left-12 @min-[700px]:z-40 @min-[700px]:w-[330px] @min-[700px]:rotate-2 @min-[700px]:shadow-[7px_8px_0_#111014]">
          <p className="text-[17px] font-bold">11–13 Haziran · Liman Deposu · 72 sanatçı</p>
          <span className="mt-3 inline-flex rounded-full border-[3px] border-[#111014] bg-lime px-4 py-2 font-sans font-black uppercase">Bilet al</span>
        </div>
        <div className="flex justify-center rounded-[24px] border-4 border-[#111014] bg-cyan p-3 @min-[700px]:absolute @min-[700px]:right-[34%] @min-[700px]:bottom-16 @min-[700px]:z-50 @min-[700px]:rounded-full @min-[700px]:border-0 @min-[700px]:bg-transparent @min-[700px]:p-0">
          <Starburst size={120} fill="var(--lime)" className="font-sans text-[15px] font-black uppercase">
            3 gün
          </Starburst>
        </div>
        <div className="hidden @min-[700px]:absolute @min-[700px]:top-[46%] @min-[700px]:left-[44%] @min-[700px]:z-20 @min-[700px]:block">
          <StickerFace shape="circle" bg="holo" fg="#111014" size={110}>
            holo
          </StickerFace>
        </div>
      </div>
    </div>
  )
}

/** Madde 17: masaüstündeki kaos mobilde çalışmaz; öğeler dev, blok renkli kartlara dönüşür */
export function Responsive() {
  const [w, setW] = useState(390)
  const box = useRef<HTMLDivElement>(null)
  const [avail, setAvail] = useState(1100)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0
      setAvail(Math.floor(el.clientWidth - pad * 2))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  // Çerçeve kenarı (2 × 4px) genişliğe eklenir: kapsayıcı sorgusu tam w px görür
  const zoom = Math.min(1, avail / (w + 8))
  const wide = w >= 700
  return (
    <Section
      id="mobil"
      tone="bg-rose text-[#111014]"
      kicker="Madde 17 · Duyarlı kurallar"
      title={
        <>
          Kaos <span className="font-serif italic">sığmaz</span>, <span className="font-mono text-[0.6em]">blok</span> <span className="uppercase [font-stretch:150%]">olur</span>
        </>
      }
      lead="Üst üste binen katmanlar telefonda okunmaz, dokunulmaz. Aynı parçalar dar ekranda alt alta dizilen, her biri tek bir şey söyleyen dev renk kartlarına dönüşür."
    >
      <div className="rounded-[30px] border-4 border-[#111014] bg-white p-5 shadow-[8px_9px_0_#111014]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <label htmlFor="cerceve" className="flex justify-between font-bold">
              <span>Çerçeve genişliği</span>
              <span className="font-mono">{w}px</span>
            </label>
            <input id="cerceve" type="range" min={320} max={1100} step={10} value={w} onChange={(e) => setW(+e.target.value)} className="mt-2 w-full accent-[var(--pink)]" aria-valuetext={`${w} piksel, ${wide ? 'kaos düzeni' : 'blok kartlar'}`} />
          </div>
          <div className="flex gap-2">
            {[360, 390, 768, 1100].map((v) => (
              <button key={v} type="button" onClick={() => setW(v)} aria-pressed={w === v} className={cx('rounded-full border-[3px] border-[#111014] px-3 py-1 font-mono text-[13px] font-bold', w === v ? 'bg-lime' : 'bg-white')}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 font-bold" aria-live="polite">
          {wide ? 'Kaos: mutlak konum, eğim, üst üste binme' : 'Blok kartlar: alt alta, düz, dev'}
        </p>
        {/* Çerçevenin çevresi de boş kalmaz: tram doku (horror vacui) */}
        <div ref={box} className="halftone mt-4 rounded-[22px] border-[3px] border-dashed border-[#111014] p-3 [--dot-size:13px] [--dot:rgb(17_16_20/0.16)] sm:p-6">
          <div className="mx-auto overflow-hidden rounded-[22px] border-4 border-[#111014] bg-bg shadow-[6px_7px_0_#111014]" style={{ width: w + 8, zoom }} aria-hidden="true">
            <div className="border-b-4 border-[#111014] bg-[#111014] px-3 py-1 font-mono text-[12px] font-bold text-[#fff7ee]">
              {w}px{zoom < 1 ? ` · %${Math.round(zoom * 100)} ölçekte` : ''}
            </div>
            <MiniCollage />
          </div>
        </div>
      </div>
      <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          ['bg-lime', 'Konum', 'Mutlak konum, eğim ve üst üste binme yalnız 768px ve üstünde. Altında normal akış.'],
          ['bg-cyan', 'Kart', 'Her parça kalın çerçeveli, blok renkli, tam genişlik bir kart olur.'],
          ['bg-butter', 'Kalabalık', 'Uçan rozetler, imleç takipçisi ve süs yazılar kalkar; rozetler satıra dizilir.'],
        ].map(([bg, h, t]) => (
          <li key={h} className={cx('rounded-[26px] border-4 border-[#111014] p-5 shadow-[6px_7px_0_#111014]', bg)}>
            <h3 className="font-sans text-[24px] leading-none font-black uppercase [font-stretch:140%]">{h}</h3>
            <p className="mt-2 font-semibold">{t}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
