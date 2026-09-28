import { useState } from 'react'
import { PRESETS, VAR_META, useMaxi } from '../lib/store'
import { useScatter } from '../hooks/useScatter'
import { Range, Section } from '../components/ui'
import { KaosSwitch } from '../components/Header'
import { IconShuffle } from '../components/Icons'
import { cx } from '../../shared/cx'

const ITEMS: [string, string, string][] = [
  ['Başlık', 'var(--pink)', 'font-sans uppercase [font-stretch:150%] font-black text-[26px]'],
  ['Çıkartma', 'var(--lime)', 'font-serif italic font-black text-[24px]'],
  ['Fotoğraf', 'var(--cyan)', 'font-mono font-bold text-[15px]'],
  ['Etiket', 'var(--butter)', 'font-hand font-bold text-[28px]'],
  ['Düğme', 'var(--orange)', 'font-sans font-black uppercase text-[18px]'],
  ['Not', 'var(--lilac)', 'font-mono font-bold text-[14px]'],
]

/** Madde 12: Auto Layout bilerek kırılır; her öğe Absolute Position ile x, y, dönme ve z taşır */
function LayoutBreaker() {
  const [mode, setMode] = useState<'auto' | 'abs'>('abs')
  const { spots, seed, shuffle } = useScatter(ITEMS.length, 17)
  const { announce } = useMaxi()
  return (
    <div className="rounded-[30px] border-4 border-[#111014] bg-white p-5 text-[#111014] shadow-[8px_9px_0_#111014]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-sans text-[24px] leading-none font-black uppercase [font-stretch:140%]">Auto Layout mu, Absolute mu?</h3>
        <div className="flex flex-wrap gap-2">
          <div role="radiogroup" aria-label="Yerleşim" className="flex rounded-full border-[3px] border-[#111014] p-0.5">
            {(
              [
                ['auto', 'Auto Layout'],
                ['abs', 'Absolute'],
              ] as const
            ).map(([id, ad]) => (
              <button key={id} type="button" role="radio" aria-checked={mode === id} onClick={() => setMode(id)} className={cx('rounded-full px-3 py-1 text-[14px] font-bold', mode === id ? 'bg-[#111014] text-[#fff7ee]' : '')}>
                {ad}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              shuffle()
              setMode('abs')
              announce('Yeni rastgele yerleşim')
            }}
            className="inline-flex items-center gap-2 rounded-full border-[3px] border-[#111014] bg-pink px-3 py-1 text-[14px] font-bold"
            data-cursor="karıştır"
          >
            <IconShuffle size={16} /> Karıştır
          </button>
        </div>
      </div>
      <div className={cx('relative mt-5 rounded-[22px] border-[3px] border-dashed border-[#111014] bg-[#f7f2ea] [--iw:48%] sm:[--iw:34%]', mode === 'abs' ? 'h-[380px] overflow-hidden' : 'flex flex-col gap-3 p-4')}>
        {ITEMS.map(([ad, bg, font], i) => {
          const s = spots[i]
          return (
            <div
              key={ad}
              className={cx('rounded-[16px] border-[3px] border-[#111014] px-2.5 py-2 transition-all duration-500 sm:px-3', mode === 'abs' ? 'absolute w-(--iw)' : 'relative')}
              style={mode === 'abs' ? { left: `calc(${s.x / 100} * (100% - var(--iw) - 20px) + 10px)`, top: `calc(${s.y / 100} * (100% - 92px) + 10px)`, rotate: `${s.rot}deg`, zIndex: s.z, background: bg } : { background: bg }}
            >
              <p className={font}>{ad}</p>
              <p className="font-mono text-[9px] font-bold whitespace-nowrap sm:text-[10px]">{mode === 'abs' ? `X%${Math.round(s.x)} Y%${Math.round(s.y)} R${s.rot}° z-${s.z}` : `Auto Layout · dikey · aralık 12`}</p>
            </div>
          )
        })}
      </div>
      <p className="mt-3 font-mono text-[12px] font-bold">tohum {seed} · useScatter(6)</p>
    </div>
  )
}

/** Madde 13: sabit token yok, serbest değişkenler. Bu kaydırıcılar bütün sayfayı canlı değiştirir */
function FreeVars() {
  const { vars, setVar, kaos } = useMaxi()
  return (
    <div id="degiskenler" className="scroll-mt-28 rounded-[30px] border-4 border-[#111014] bg-[#111014] p-5 text-[#fff7ee] shadow-[8px_9px_0_var(--lime)]">
      <h3 className="font-serif text-[34px] leading-none font-black italic">
        <span className="wonk">Serbest değişkenler</span>
      </h3>
      <p className="mt-2 max-w-[56ch] text-[15px] font-semibold text-[#cfc6d9]">Sabit bir token sistemi yok. Tasarımcı her değeri sınırına kadar oynatır; buradaki her kaydırıcı bütün sayfaya anında yansır.</p>
      <div className="mt-5">
        <p className="kicker mb-2">Hazır ayar{kaos === 'ozel' ? ' · şu an özel' : ''}</p>
        <KaosSwitch name="kaos-degisken" dark />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {VAR_META.map((m) => (
          <Range key={m.k} label={m.ad} value={vars[m.k]} min={m.min} max={m.max} step={m.step} unit={m.unit} onChange={(v) => setVar(m.k, v)} format={m.k === 'hiz' ? (v) => `${v.toString().replace('.', ',')}×` : undefined} />
        ))}
      </div>
      <pre className="scroll-x mt-6 rounded-2xl border-2 border-[#fff7ee]/40 p-3 text-[12px] leading-relaxed text-lime" tabIndex={0} aria-label="Değişkenlerin şu anki değerleri">
        <code>{JSON.stringify(vars, null, 2)}</code>
      </pre>
      <p className="mt-3 font-mono text-[11px] text-[#cfc6d9]">
        Hazır ayarlar: {Object.entries(PRESETS)
          .map(([k, v]) => `${k} ${v.donme}°/${v.binme}%/${v.rozet}`)
          .join(' · ')}
      </p>
    </div>
  )
}

const HOOK = `// Madde 14: konumları rastgele ya da imlece göre belirleyen kancalar
const { spots, shuffle } = useScatter(6, seed)   // tohumlu x, y, dönme, z
const ref = useMagnetic<HTMLButtonElement>(0.3)   // imlece doğru çekilir
const fx = useScrollFx<HTMLDivElement>()          // --p: −1…1 kaydırma
<CursorFollower />                               // mix-blend-difference

<div ref={fx} className="fx [--fx-rot:40deg] [--fx-hue:120deg]" />`

const TW = `<span className="absolute -rotate-12 z-50
  mix-blend-difference text-white">Kaos!</span>

<div className="tilt" style={{ '--r': -0.4 }} />
/* rotate: calc(var(--r) * var(--rot-max)) */`

export function Build() {
  return (
    <Section
      id="yapi"
      tone="bg-sky text-[#111014]"
      kicker="Madde 12 · 13 · 14 · 15 · Figma ve kod"
      title={
        <>
          <span className="font-mono text-[0.6em]">Auto Layout</span> <span className="font-serif italic">kırıldı</span>
        </>
      }
      lead="Figma’da çerçeveler Absolute Position ile dağılır; değerler sabit token değil, serbest değişken. Kodda aynı iş özel düzen kancalarıyla yapılır."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <LayoutBreaker />
        </div>
        <div className="lg:col-span-5 lg:mt-16">
          <FreeVars />
        </div>
        <figure className="min-w-0 lg:col-span-7">
          <figcaption className="kicker mb-2">React · Madde 14</figcaption>
          <pre className="scroll-x rounded-[22px] border-4 border-[#111014] bg-[#111014] p-4 text-[12.5px] leading-relaxed text-[#fff7ee]" tabIndex={0} aria-label="Kanca kodu">
            <code>{HOOK}</code>
          </pre>
        </figure>
        <figure className="min-w-0 lg:col-span-5">
          <figcaption className="kicker mb-2" lang="en">
            Tailwind · Madde 15
          </figcaption>
          <div className="relative h-[150px] overflow-hidden rounded-[22px] border-4 border-[#111014] bg-[linear-gradient(90deg,var(--pink)_0_33%,var(--blue)_33%_66%,var(--lime)_66%)]" aria-hidden="true">
            <span className="absolute top-8 left-6 z-50 -rotate-12 font-sans text-[64px] leading-none font-black text-white uppercase mix-blend-difference [font-stretch:150%]">Kaos!</span>
          </div>
          <pre className="scroll-x mt-3 rounded-[22px] border-4 border-[#111014] bg-[#111014] p-4 text-[12.5px] leading-relaxed text-[#fff7ee]" tabIndex={0} aria-label="Tailwind sınıfları">
            <code>{TW}</code>
          </pre>
        </figure>
      </div>
    </Section>
  )
}
