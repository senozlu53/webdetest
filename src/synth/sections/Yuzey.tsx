import { useId, useMemo, useState } from 'react'
import { useSynth } from '../lib/store'
import { manzara, svgUrl } from '../lib/sanat'
import { RetroCard } from '../components/RetroCard'
import { IKON, Ikon, type IkonAd } from '../components/Icons'
import { NeonSlider, NeonSwitch, Section, Secim } from '../components/ui'

/** Madde 8: VHS bozulmaları. Tracking şeritleri, renk sapması, tarama; hepsi ayarlanır */
export function Vhs() {
  const s = useSynth()
  const fid = useId().replace(/:/g, '')
  const [ab, setAb] = useState(3)
  const [iz, setIz] = useState(2)
  const [tarama, setTarama] = useState(true)
  const resim = useMemo(() => svgUrl(manzara(1984, 400, 300)), [])
  const seritler = Array.from({ length: iz }, (_, i) => ({ ust: 18 + i * 27, boy: 4 + i * 2, kay: (i % 2 ? -1 : 1) * (6 + i * 4) }))
  return (
    <Section id="vhs" madde="Madde 8 · Doku ve yüzey" title="Kaset" script="bozulması" lead="Görüntü bilerek kusurlu: yatay tracking şeritleri resmi yana kaydırır, kırmızı ve cyan kanallar birbirinden ayrılır, tarama çizgileri her şeyin üstünden geçer. Bütün sayfadaki VHS katmanı ayarlardan kapanır.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative min-w-0 overflow-hidden rounded-[10px] border-2 border-line bg-black" data-vhs-ornek="">
          <svg width="0" height="0" className="absolute" aria-hidden="true">
            <filter id={fid} colorInterpolationFilters="sRGB">
              <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="k" />
              <feOffset in="k" dx={-ab} result="k2" />
              <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb" />
              <feOffset in="gb" dx={ab} result="gb2" />
              <feBlend in="k2" in2="gb2" mode="screen" />
            </filter>
          </svg>
          <img src={resim} alt="Tohum 1984'ten üretilmiş synthwave manzarası, VHS bozulmalı" className="block aspect-[4/3] w-full" style={{ filter: ab ? `url(#${fid})` : undefined }} />
          {seritler.map((sr, i) => (
            <img key={i} src={resim} alt="" aria-hidden="true" className="vhs-serit pointer-events-none absolute inset-0 block aspect-[4/3] w-full" style={{ clipPath: `inset(${sr.ust}% 0 ${100 - sr.ust - sr.boy}% 0)`, translate: `${sr.kay}px 0`, filter: 'brightness(1.4) saturate(1.3)', animationDelay: `${-i * 0.7}s` }} />
          ))}
          {tarama ? <div className="pointer-events-none absolute inset-0" style={{ background: 'repeating-linear-gradient(to bottom, transparent 0 2px, rgb(0 0 0 / 0.28) 2px 3px)' }} aria-hidden="true" /> : null}
          <p className="kicker absolute top-4 left-4 flex items-center gap-2 text-white [text-shadow:0_0_4px_#000,1px_1px_0_#000]" aria-hidden="true">
            <Ikon ad="oynat" boyut={16} /> <span lang="en">Play</span>
          </p>
          <p className="kicker absolute right-4 bottom-4 text-white [text-shadow:0_0_4px_#000,1px_1px_0_#000]" aria-hidden="true" lang="en">
            SP 0:04:12
          </p>
          <style>{`:root[data-motion='on'] .vhs-serit { animation: serit 2.6s steps(1) infinite; } @keyframes serit { 0%,70% { opacity: 0 } 72%,78% { opacity: 1 } 80% { opacity: 0 } 88% { opacity: 1 } 90%,100% { opacity: 0 } }`}</style>
        </div>
        <RetroCard className="grid min-w-0 grid-cols-1 content-start gap-6 p-6">
          <NeonSlider label="Renk sapması" value={ab} min={0} max={8} onChange={setAb} format={(v) => `${v}px`} />
          <NeonSlider label="Tracking şeridi" value={iz} min={0} max={3} onChange={setIz} format={(v) => `${v} şerit`} />
          <NeonSwitch label="Tarama çizgileri" checked={tarama} onChange={setTarama} />
          <NeonSwitch label="Sayfadaki VHS katmanı" hint="Tarama ve yukarı akan tracking bandı bütün sayfada." checked={s.vhs} onChange={s.setVhs} />
          <p className="text-[14px] text-muted">Şeritler ara ara belirir (saniyede en çok iki kez); hareket kapalıyken hiç belirmez.</p>
        </RetroCard>
      </div>
    </Section>
  )
}

const SIRA = Object.keys(IKON).filter((k) => !['kapat', 'ok', 'geri', 'durdur'].includes(k)) as IkonAd[]
const AD: Partial<Record<IkonAd, string>> = { oynat: 'Oynat', nota: 'Müzik', kol: 'Oyun', kaset: 'Kaset', resim: 'Galeri', gunes: 'Gün batımı', palmiye: 'Palmiye', kalp: 'Beğen', simsek: 'Enerji', dalga: 'Dalga', ayar: 'Ayar', yildiz: 'Favori', goz: 'Görüntüle' }

/** Madde 9: neon tabela ikonları */
export function Ikonlar() {
  const [renk, setRenk] = useState<'pink' | 'cyan' | 'turuncu'>('pink')
  const [parla, setParla] = useState(true)
  return (
    <Section id="ikon" madde="Madde 9 · İkonografi" title="Cam" script="tüpler" lead="İkonlar neon tabela gibi: yalnız kontur, 1,75 piksel, uçları yuvarlak, dolgu yok. Parlama üç katmanlı drop-shadow; kapatılınca ikon ince çizgi olarak okunur kalır.">
      <div className="flex flex-wrap items-end gap-8">
        <Secim legend="Tüp rengi" name="ikon-renk" value={renk} onChange={setRenk} options={[{ id: 'pink', ad: 'Pembe' }, { id: 'cyan', ad: 'Cyan' }, { id: 'turuncu', ad: 'Turuncu' }]} />
        <NeonSwitch label="Parlama" checked={parla} onChange={setParla} />
      </div>
      <ul className="m-0 mt-8 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-4 lg:grid-cols-7">
        {SIRA.map((ad) => (
          <li key={ad} className="grid justify-items-center gap-3 rounded-[8px] border-2 border-line bg-night-2 p-4 text-center">
            <Ikon ad={ad} renk={renk} parla={parla} boyut={44} />
            <span className="text-[14px] font-bold">{AD[ad] ?? ad}</span>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap items-center gap-6 rounded-[10px] border-2 border-line bg-[#0d0418] p-6" aria-label="Neon tabela örneği: Açık, gece yarısına kadar" role="img">
        <Ikon ad="palmiye" renk="cyan" parla boyut={56} />
        <span className="neon-t titre text-[clamp(40px,7vw,72px)] leading-none text-pink" style={{ fontFamily: 'var(--font-neon)' }} aria-hidden="true">
          AÇIK
        </span>
        <span className="script neon-o -rotate-6 text-[clamp(30px,4vw,44px)] text-orange" style={{ textShadow: 'var(--glow-orange)' }} aria-hidden="true">
          gece yarısına kadar
        </span>
      </div>
    </Section>
  )
}
