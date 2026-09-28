import { useMemo, useState, type PointerEvent } from 'react'
import { Section, Range } from '../components/ui'
import { StickerFace } from '../components/Sticker'
import { rng } from '../lib/rand'
import { useMaxi } from '../lib/store'
import { cx } from '../../shared/cx'

type Fam = 'serif' | 'sans'

/** Madde 5: değişken yazı laboratuvarı. Eksenler sınırına kadar; imleçle de sürülür */
function TypeLab() {
  const { announce } = useMaxi()
  const [text, setText] = useState('Boşluk korkusu')
  const [fam, setFam] = useState<Fam>('serif')
  const [wght, setWght] = useState(800)
  const [opsz, setOpsz] = useState(144)
  const [soft, setSoft] = useState(100)
  const [wonk, setWonk] = useState(true)
  const [wdth, setWdth] = useState(150)
  const [ital, setItal] = useState(true)
  const [follow, setFollow] = useState(false)
  const [mixSeed, setMixSeed] = useState(0)
  const style =
    fam === 'serif'
      ? { fontFamily: 'var(--ff-serif)', fontWeight: wght, fontStyle: ital ? 'italic' : 'normal', fontVariationSettings: `'opsz' ${opsz}, 'SOFT' ${soft}, 'WONK' ${wonk ? 1 : 0}` }
      : { fontFamily: 'var(--ff-sans)', fontWeight: wght, fontStyle: ital ? 'italic' : 'normal', fontStretch: `${wdth}%` }
  const css = fam === 'serif' ? `font-weight: ${wght}; font-variation-settings: 'opsz' ${opsz}, 'SOFT' ${soft}, 'WONK' ${wonk ? 1 : 0};` : `font-weight: ${wght}; font-stretch: ${wdth}%;`
  const letters = useMemo(() => {
    if (!mixSeed) return null
    const r = rng(mixSeed)
    return [...text].map((ch) => ({ ch, serif: r() > 0.5, w: 100 + Math.round(r() * 8) * 100, x: 50 + Math.round(r() * 100), it: r() > 0.5 }))
  }, [mixSeed, text])
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!follow) return
    const b = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - b.left) / b.width
    const py = (e.clientY - b.top) / b.height
    setWdth(Math.round(50 + px * 100))
    setWght(Math.round(100 + (1 - py) * 800))
  }
  return (
    <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <div className="space-y-4 rounded-[28px] border-4 border-[#111014] bg-white p-5 text-[#111014] shadow-[8px_9px_0_#111014]">
        <h3 className="font-sans text-[26px] leading-none font-black uppercase [font-stretch:140%]">Değişken yazı</h3>
        <div>
          <label htmlFor="ornek-metin" className="block font-bold">
            Metin
          </label>
          <input id="ornek-metin" value={text} maxLength={28} onChange={(e) => setText(e.target.value || ' ')} className="mt-1 min-h-11 w-full rounded-2xl border-[3px] border-[#111014] px-3 font-semibold" />
        </div>
        <fieldset>
          <legend className="kicker mb-2">Aile</legend>
          <div className="flex gap-2">
            {(
              [
                ['serif', 'Fraunces'],
                ['sans', 'Anybody'],
              ] as const
            ).map(([id, ad]) => (
              <label key={id} className={cx('cursor-pointer rounded-full border-[3px] border-[#111014] px-3 py-1 font-bold has-[:focus-visible]:outline-4 has-[:focus-visible]:outline-[#c8ff00]', fam === id ? 'bg-lime' : 'bg-white')}>
                <input type="radio" name="aile" className="sr-only" checked={fam === id} onChange={() => setFam(id)} />
                {ad}
              </label>
            ))}
          </div>
        </fieldset>
        <Range label="Ağırlık (wght)" value={wght} min={100} max={900} step={10} onChange={setWght} />
        {fam === 'serif' ? (
          <>
            <Range label="Optik boy (opsz)" value={opsz} min={9} max={144} step={1} onChange={setOpsz} />
            <Range label="Yumuşaklık (SOFT)" value={soft} min={0} max={100} step={1} onChange={setSoft} />
            <label className="flex items-center gap-2 font-bold">
              <input type="checkbox" checked={wonk} onChange={(e) => setWonk(e.target.checked)} className="size-5 accent-[var(--pink)]" /> Yamuk harfler (WONK)
            </label>
          </>
        ) : (
          <Range label="Genişlik (wdth)" value={wdth} min={50} max={150} step={1} unit="%" onChange={setWdth} />
        )}
        <label className="flex items-center gap-2 font-bold">
          <input type="checkbox" checked={ital} onChange={(e) => setItal(e.target.checked)} className="size-5 accent-[var(--pink)]" /> İtalik
        </label>
        <label className="flex items-center gap-2 font-bold">
          <input
            type="checkbox"
            checked={follow}
            onChange={(e) => {
              setFollow(e.target.checked)
              if (e.target.checked) setFam('sans')
            }}
            className="size-5 accent-[var(--pink)]"
          />{' '}
          İmleçle sür (x genişlik, y ağırlık)
        </label>
        <button
          type="button"
          onClick={() => {
            setMixSeed((s) => s + 1)
            announce('Harfler karıştı')
          }}
          className="min-h-11 rounded-full border-[3px] border-[#111014] bg-pink px-4 font-bold"
        >
          Harf harf karıştır
        </button>
        {mixSeed ? (
          <button type="button" onClick={() => setMixSeed(0)} className="ml-2 font-bold underline decoration-2 underline-offset-4">
            Düzelt
          </button>
        ) : null}
      </div>
      <div className="min-w-0">
        <div onPointerMove={move} className={cx('grain-box relative grid min-h-[280px] place-items-center overflow-hidden rounded-[28px] border-4 border-[#111014] bg-[#111014] p-6 text-center text-lime', follow && 'cursor-crosshair')} data-cursor={follow ? 'sür' : undefined}>
          <p className="max-w-full text-[clamp(40px,7vw,110px)] leading-[0.95] break-words" style={letters ? undefined : style} aria-label={text}>
            {letters
              ? letters.map((l, i) => (
                  <span key={i} aria-hidden="true" style={{ fontFamily: l.serif ? 'var(--ff-serif)' : 'var(--ff-sans)', fontWeight: l.w, fontStretch: `${l.x}%`, fontStyle: l.it ? 'italic' : 'normal', color: ['#c8ff00', '#ff2e93', '#00e5ff', '#ffe680', '#ff6a00'][i % 5] }}>
                    {l.ch}
                  </span>
                ))
              : text}
          </p>
        </div>
        <pre className="scroll-x mt-4 rounded-2xl border-[3px] border-[#111014] bg-white p-3 text-[12px] text-[#111014]" tabIndex={0} aria-label="Eksen değerleri, CSS">
          <code>{css}</code>
        </pre>
      </div>
    </div>
  )
}

/** Madde 10: editoryal deneyim. Aynı cümlede serif, sans ve mono (Madde 5) */
export function Editorial() {
  return (
    <Section
      id="editoryal"
      tone="bg-paper text-ink"
      kicker="Madde 5 · 10 · Editoryal"
      title={
        <>
          Neden <span className="font-serif italic">daha</span> <span className="font-mono text-[0.62em]">fazlası</span> <span className="uppercase [font-stretch:150%]">güzel?</span>
        </>
      }
    >
      <article className="relative">
        <p className="font-hand text-[26px] leading-none">yazan: Kolaj Masası · 7 dakikalık okuma</p>
        <div className="mt-8 gap-10 text-[18px] leading-relaxed font-medium md:columns-2 [&>p+p]:mt-5">
          <p>
            <span className="float-left mt-1 mr-3 font-serif text-[108px] leading-[0.72] font-black text-pink italic">
              <span className="wonk">M</span>
            </span>
            inimalizm bize boşluğun nefes olduğunu söyledi. <span className="font-serif font-black italic">Maksimalizm</span> ise boşluğu bir davet gibi okur: burası da doldurulabilir. <em>Horror vacui</em>, yani boşluk korkusu, ortaçağ el yazmalarının kenar süslerinden seksenlerin Memphis mobilyalarına uzanan eski bir iştah.
          </p>
          <p>
            Ekranda bu iştah üç şeyle beslenir: <span className="rounded bg-pink px-1 font-bold text-[#111014]">çatışan renk</span>, <span className="font-sans font-black uppercase [font-stretch:150%]">üst üste binen</span> yazı ve her yüzeye sinen <span className="font-mono text-[0.85em] font-bold">doku</span>. Neon pembe turuncunun üstüne biner, eğik bir serif geniş bir grotesk ile aynı cümlede dövüşür, halftone noktaları her şeyin arkasında titreşir.
          </p>
          <blockquote className="tilt holo sticker my-8 rounded-[26px] p-6 text-[#111014] [break-inside:avoid]" style={{ ['--r' as string]: -0.5 }}>
            <p className="font-serif text-[34px] leading-[1] font-black italic">
              <span className="wonk">“Boş bir piksel, kullanılmamış bir fırsattır.”</span>
            </p>
            <footer className="mt-3 font-mono text-[12px] font-bold">Kolaj Masası, 2027</footer>
          </blockquote>
          <p>
            Ama kaos da bir kural setidir. Katmanların sırası bellidir: okunacak metin her zaman düz bir zeminde ve en üstte durur. Süsler ne kadar bağırırsa bağırsın, <span className="font-sans font-black uppercase [font-stretch:125%]">düğmeler</span> ve cümleler kendi sessiz adalarında kalır.
          </p>
          <p>
            Mobilde bu gürültü sığmaz. Masaüstündeki dağınık kolaj alt alta dizilen dev renk bloklarına dönüşür; her blok tek bir şey söyler, ama yine de <span className="font-hand text-[1.35em] font-bold">yüksek sesle</span>.
          </p>
          <p className="font-mono text-[13px] leading-snug">¹ Horror vacui: Latince, boşluktan korkmak. ² Memphis Grubu, Milano, 1981.</p>
        </div>
        <p className="clutter pointer-events-none absolute -top-10 right-0 hidden rotate-6 font-hand text-[24px] text-violet md:block" aria-hidden="true">
          not: kenar süsleri = ilk maksimalizm
        </p>
        <div className="clutter absolute -top-16 right-[30%] hidden md:block">
          <StickerFace shape="star" bg="var(--lime)" fg="#111014" size={110}>
            7 dk
          </StickerFace>
        </div>
      </article>
      <TypeLab />
    </Section>
  )
}
