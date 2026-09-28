import { useState } from 'react'
import { Section } from '../components/ui'
import { Blob, Starburst, Stretched, Tri } from '../components/Shapes'
import { Paper } from '../components/Paper'
import { StickerFace } from '../components/Sticker'
import { sheen } from '../hooks/useSheen'
import { IconLayers } from '../components/Icons'
import { cx } from '../../shared/cx'

const NEONS: [string, string, string][] = [
  ['Neon pembe', '#FF2E93', 'koyu 5,47'],
  ['Asit limon', '#C8FF00', 'koyu 16,03'],
  ['Elektrik mavi', '#2F3CFF', 'krem 6,16'],
  ['Turuncu', '#FF6A00', 'koyu 6,60'],
  ['Camgöbeği', '#00E5FF', 'koyu 12,32'],
  ['Mor', '#8A2BFF', 'krem 5,11'],
]
const PASTELS: [string, string][] = [
  ['Leylak', '#C9B5FF'],
  ['Şeftali', '#FFB59E'],
  ['Nane', '#9EF0C8'],
  ['Tereyağı', '#FFE680'],
  ['Gök', '#9FD4FF'],
  ['Gül', '#FFB8D9'],
]
const CLASH: [string, string, string, string][] = [
  ['#FF2E93', '#FF6A00', 'Pembe · turuncu', '1,21'],
  ['#C8FF00', '#FFE680', 'Limon · tereyağı', '1,05'],
  ['#2F3CFF', '#8A2BFF', 'Mavi · mor', '1,21'],
  ['#00E5FF', '#9EF0C8', 'Camgöbeği · nane', '1,15'],
]
const LAYERS: [number, string, string][] = [
  [0, 'Doku: gren, halftone', 'var(--mint)'],
  [10, 'Dev süs yazı', 'var(--pink)'],
  [20, 'Kolaj kâğıdı', 'var(--butter)'],
  [30, '3D nesne', 'var(--cyan)'],
  [40, 'Okunur içerik', 'var(--paper)'],
  [50, 'Çıkartma', 'var(--lime)'],
  [60, 'Uçan rozet', 'var(--orange)'],
  [80, 'İmleç takipçisi', 'var(--lilac)'],
]

/** Madde 7: z haritası. Katmanlar ayrılınca sıra görünür: rastgele değil, kurgulu */
function ZMap() {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-[30px] border-4 border-[#111014] bg-[#111014] p-5 text-[#fff7ee] shadow-[8px_9px_0_var(--pink)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-sans text-[26px] leading-none font-black uppercase [font-stretch:140%]">Z haritası</h3>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-pressed={open} className="inline-flex min-h-11 items-center gap-2 rounded-full border-[3px] border-[#fff7ee] px-4 font-bold hover:bg-[#fff7ee] hover:text-[#111014]">
          <IconLayers size={18} /> {open ? 'Katmanları birleştir' : 'Katmanları ayır'}
        </button>
      </div>
      <div className="relative mt-6 grid h-[360px] place-items-center overflow-hidden [perspective:1200px]" aria-hidden="true">
        <div className="relative h-[180px] w-[min(320px,52vw)] transition-transform duration-700 [--zo:6px] [transform-style:preserve-3d] sm:h-[220px] sm:[--zo:9px]" style={{ transform: open ? 'rotateX(58deg) rotateZ(-34deg)' : 'none' }}>
          {LAYERS.map(([z, ad, bg], i) => (
            <div
              key={z}
              className="absolute inset-0 grid place-items-center rounded-[20px] border-[3px] border-[#111014] font-mono text-[12px] font-bold text-[#111014] transition-transform duration-700"
              style={{ background: bg, transform: open ? `translateZ(${i * 34}px)` : `translate(calc(${i - 4} * var(--zo)), calc(${((i - 4) * -7) / 9} * var(--zo))) rotate(${(i % 2 ? 1 : -1) * i * 1.5}deg)`, opacity: open ? 0.92 : 1 }}
            >
              <span className="rounded-full bg-white/85 px-2">
                z-{z} · {ad}
              </span>
            </div>
          ))}
        </div>
      </div>
      <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[12px] font-bold sm:grid-cols-4">
        {LAYERS.map(([z, ad]) => (
          <li key={z}>
            z-{z} {ad}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Palette() {
  const [blobSeed, setBlobSeed] = useState(3)
  const [stretch, setStretch] = useState(260)
  return (
    <Section
      id="palet"
      tone="bg-mint text-[#111014]"
      kicker="Madde 4 – 9 · Görsel dil"
      title={
        <>
          Renk <span className="font-serif italic">cümbüşü</span>, <span className="font-mono text-[0.6em]">doku</span>, <span className="uppercase [font-stretch:150%]">şekil</span>
        </>
      }
      lead="Neonlar, derin pasteller ve siyah aynı anda. Tek kural metin için: pembe, turuncu, limon, camgöbeği ve pasteller üstünde koyu mürekkep; mavi ve mor üstünde krem."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="rounded-[30px] border-4 border-[#111014] bg-white p-5 shadow-[8px_9px_0_#111014] lg:col-span-7">
          <h3 className="font-sans text-[26px] leading-none font-black uppercase [font-stretch:140%]">Neon</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3">
            {NEONS.map(([ad, hex, k], i) => (
              <li key={hex} className="tilt min-w-0" style={{ ['--r' as string]: ((i % 3) - 1) * 0.6 }}>
                <span className="grid h-20 place-items-center rounded-[18px] border-[3px] border-[#111014] font-sans text-[20px] font-black uppercase [font-stretch:125%]" style={{ background: hex, color: k.startsWith('krem') ? '#fff7ee' : '#111014' }}>
                  Aa
                </span>
                <p className="mt-1.5 font-bold">{ad}</p>
                <p className="font-mono text-[11px]">
                  {hex} · {k}:1
                </p>
              </li>
            ))}
          </ul>
          <h3 className="mt-7 font-serif text-[26px] leading-none font-black italic">Derin pastel</h3>
          <ul className="mt-4 flex flex-wrap gap-3">
            {PASTELS.map(([ad, hex], i) => (
              <li key={hex} className="flex flex-col items-center">
                <Blob seed={i + 20} size={74} fill={hex} stroke="#111014" />
                <span className="font-mono text-[11px] font-bold">{ad}</span>
                <span className="font-mono text-[10px]">{hex}</span>
              </li>
            ))}
            <li className="flex flex-col items-center">
              <span className="grid size-[74px] place-items-center rounded-full border-[3px] border-[#111014] bg-[#0b0a0f]" />
              <span className="font-mono text-[11px] font-bold">Siyah</span>
              <span className="font-mono text-[10px]">#0B0A0F</span>
            </li>
          </ul>
        </div>

        <div className="rounded-[30px] border-4 border-[#111014] bg-butter p-5 shadow-[8px_9px_0_#111014] lg:col-span-5 lg:mt-14">
          <h3 className="font-hand text-[34px] leading-none font-bold">Çatışan çiftler</h3>
          <p className="mt-2 text-[15px] font-semibold">Yalnız süste: bu çiftlerde metin okunmaz, bilerek. Sayfada bilgi taşıyan hiçbir metin bu zeminlere yazılmaz.</p>
          <ul className="mt-4 space-y-3">
            {CLASH.map(([a, b, ad, k]) => (
              <li key={ad} className="flex items-center gap-3">
                <span className="grid h-14 w-28 shrink-0 place-items-center rounded-[14px] border-[3px] border-[#111014] font-sans text-[22px] font-black uppercase [font-stretch:140%]" style={{ background: b, color: a }} aria-hidden="true">
                  Kaos
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">{ad}</span>
                  <span className="font-mono text-[12px]">
                    {k}:1 · <span className="rounded bg-[#111014] px-1 text-[#fff7ee]">süs · ihlal kasıtlı</span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-12">
          <h3 className="font-serif text-[clamp(30px,4vw,52px)] leading-none font-black italic">
            <span className="wonk">Doku ve yüzey</span>
          </h3>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <li className="grain-box h-48 rounded-[26px] border-4 border-[#111014] bg-pink p-4 shadow-[6px_7px_0_#111014] [--grain:0.9]">
              <p className="relative font-sans text-[22px] font-black uppercase [font-stretch:140%]">Gren</p>
              <p className="relative mt-1 font-mono text-[12px] font-bold">feTurbulence gürültüsü, çarpma karışımı</p>
            </li>
            <li className="relative h-48 overflow-hidden rounded-[26px] border-4 border-[#111014] bg-cyan p-4 shadow-[6px_7px_0_#111014]">
              <div className="halftone halftone-fade absolute inset-0 [--dot-size:12px] [--fade-dir:120deg]" aria-hidden="true" />
              <p className="relative w-fit rounded-lg bg-cyan px-1 font-sans text-[22px] font-black uppercase [font-stretch:140%]">Halftone</p>
              <p className="relative mt-1 w-fit rounded bg-cyan px-1 font-mono text-[12px] font-bold">nokta vuruşlu baskı, maskeyle solan</p>
            </li>
            <li className="relative h-48">
              <Paper seed={7} bg="#fffdf7" tape r={-0.4} className="h-full">
                <div className="p-5">
                  <p className="font-serif text-[26px] leading-none font-black italic">Kolaj</p>
                  <p className="mt-1 font-mono text-[12px] font-bold">yırtık kenar, bant, eğik kesik</p>
                  <p className="mt-3 inline-block -rotate-3 bg-lime px-2 font-sans text-[18px] font-black uppercase">dergiden</p>{' '}
                  <p className="mt-1 inline-block rotate-2 bg-[#111014] px-2 font-mono text-[14px] font-bold text-[#fff7ee]">kesildi</p>
                </div>
              </Paper>
            </li>
            <li onPointerMove={sheen} className="holo h-48 rounded-[26px] border-4 border-[#111014] p-4 shadow-[6px_7px_0_#111014]" data-cursor="parlat">
              <p className="font-sans text-[22px] font-black uppercase [font-stretch:140%]">Holografik</p>
              <p className="mt-1 font-mono text-[12px] font-bold">konik degrade döner, parlama imleci izler</p>
            </li>
          </ul>
        </div>

        <div className="rounded-[30px] border-4 border-[#111014] bg-white p-5 shadow-[8px_9px_0_#111014] lg:col-span-6">
          <h3 className="font-sans text-[26px] leading-none font-black uppercase [font-stretch:140%]">Şekil dili</h3>
          <div className="mt-5 grid grid-cols-2 items-center gap-5">
            <figure className="flex flex-col items-center gap-2">
              <Tri size={110} />
              <figcaption className="font-mono text-[12px] font-bold">keskin üçgen</figcaption>
            </figure>
            <figure className="flex flex-col items-center gap-2">
              <Starburst size={120} fill="var(--pink)" points={20} inner={0.72} />
              <figcaption className="font-mono text-[12px] font-bold">yıldız patlaması</figcaption>
            </figure>
            <figure className="flex flex-col items-center gap-2">
              <button type="button" onClick={() => setBlobSeed((s) => s + 1)} className="rounded-full" aria-label="Damlayı yeniden şekillendir" data-cursor="şekillendir">
                <Blob seed={blobSeed} size={130} fill="var(--violet)" stroke="#111014" />
              </button>
              <figcaption className="font-mono text-[12px] font-bold">organik damla (basın)</figcaption>
            </figure>
            <figure className="flex flex-col items-center gap-2">
              <Stretched w={stretch} h={80} className="max-w-full" />
              <figcaption className="w-full font-mono text-[12px] font-bold">
                <label htmlFor="esnet" className="block text-center">
                  esnetilmiş vektör: {stretch}px
                </label>
                <input id="esnet" type="range" min={80} max={320} value={stretch} onChange={(e) => setStretch(+e.target.value)} className="mt-1 w-full accent-[var(--pink)]" />
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="lg:col-span-6">
          <ZMap />
        </div>

        <div className="rounded-[30px] border-4 border-[#111014] bg-rose p-5 shadow-[8px_9px_0_#111014] lg:col-span-12">
          <h3 className="font-hand text-[40px] leading-none font-bold">İkon yerine çıkartma</h3>
          <p className="mt-2 max-w-[60ch] font-semibold">Madde 9: küçük çizgi ikonlar yerine büyük, kesik kenarlı, illüstratif çıkartmalar. Denetimlerde okunaklı küçük ikonlar kalır.</p>
          <ul className="mt-6 flex flex-wrap items-center gap-5" aria-label="Çıkartma örnekleri">
            {(
              [
                ['burst', 'var(--lime)', '#111014', 'Yeni!'],
                ['circle', 'holo', '#111014', 'Holo'],
                ['star', 'var(--orange)', '#111014', 'VIP'],
                ['pill', 'var(--blue)', '#fff7ee', 'Bilet'],
                ['burst', 'var(--pink)', '#111014', '%30'],
                ['circle', 'var(--butter)', '#111014', 'Gece'],
                ['star', 'var(--cyan)', '#111014', 'Sahne'],
                ['pill', 'var(--violet)', '#fff7ee', 'Kolaj'],
              ] as const
            ).map(([shape, bg, fg, ad], i) => (
              <li key={i} className={cx('tilt wobble', i % 2 === 1 && 'translate-y-3')} style={{ ['--r' as string]: ((i * 7) % 5) / 2 - 1 }}>
                <StickerFace shape={shape} bg={bg} fg={fg} size={shape === 'pill' ? 80 : 104}>
                  {ad}
                </StickerFace>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
