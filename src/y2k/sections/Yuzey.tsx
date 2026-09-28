import { useEffect, useId, useRef, useState } from 'react'
import { useY2K } from '../lib/store'
import { Y2KCard } from '../components/Y2KCard'
import { ChromeButton } from '../components/ChromeButton'
import { Bubble, Ellipse, Starburst } from '../components/Shapes'
import {
  IconArrow,
  IconCart,
  IconCheck,
  IconClose,
  IconDisc,
  IconGlobe,
  IconHeart,
  IconNext,
  IconNote,
  IconPlay,
  IconSearch,
  IconSparkle,
  IconStar,
  IconUser,
  IconVolume,
  IconWindow,
  TribalFlame,
  TribalRing,
  TribalStar,
  TribalWing,
} from '../components/Icons'
import { Section } from '../components/ui'

/** Madde 8: sıvı metal. Krom damla, gürültü haritasıyla yavaşça dalgalanır */
function SiviMetal() {
  const { motion, sade } = useY2K()
  const turb = useRef<SVGFETurbulenceElement>(null)
  const uid = useId().replace(/:/g, '')
  useEffect(() => {
    if (!motion || sade) return
    let raf = 0
    const t0 = performance.now()
    const loop = (t: number) => {
      const k = (t - t0) / 1000
      turb.current?.setAttribute('baseFrequency', `${(0.011 + Math.sin(k * 0.6) * 0.004).toFixed(4)} ${(0.019 + Math.cos(k * 0.45) * 0.005).toFixed(4)}`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [motion, sade])
  return (
    <svg viewBox="0 0 400 260" className="h-auto w-full" role="img" aria-label="Sıvı metal: dalgalanan krom bir damla">
      <defs>
        <linearGradient id={`${uid}g`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.42" stopColor="#c9d4e4" />
          <stop offset="0.5" stopColor="#46536a" />
          <stop offset="0.56" stopColor="#f3f7fc" />
          <stop offset="0.8" stopColor="#a9b8cd" />
          <stop offset="1" stopColor="#5b6b83" />
        </linearGradient>
        <filter id={`${uid}f`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.011 0.019" numOctaves="1" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="30" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={sade ? undefined : `url(#${uid}f)`}>
        <ellipse cx="200" cy="132" rx="150" ry="88" fill={`url(#${uid}g)`} stroke="#1b2130" strokeWidth="2" />
        <ellipse cx="158" cy="96" rx="72" ry="18" fill="#ffffff" opacity="0.7" />
      </g>
    </svg>
  )
}

/** Madde 6 · 7 · 8: şekil, derinlik, doku */
export function Surface() {
  return (
    <Section id="yuzey" kicker="Madde 6 · 7 · 8 · Şekil, derinlik, doku" title="Balonlar, patlamalar ve sıvı metal" lead="Köşeli kutu yok: asimetrik elipsler, yıldız patlamaları, oval balonlar. Derinlik gölgeyle değil, eğim ve kabartmayla; yüzey plastik ya da sıvı metal.">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Y2KCard className="flex flex-col lg:col-span-7">
          <h3 className="display text-[22px]">Şekil dili</h3>
          <ul className="mt-5 grid flex-1 grid-cols-2 content-center items-center gap-6 sm:grid-cols-4">
            <li className="flex flex-col items-center gap-2 text-center text-[14px]">
              <Ellipse w={150} h={96} rot={-22} fill="var(--pink)" />
              asimetrik elips
            </li>
            <li className="flex flex-col items-center gap-2 text-center text-[14px]">
              <Starburst size={120} ton="icy" />
              yıldız patlaması
            </li>
            <li className="flex flex-col items-center gap-2 text-center text-[14px]">
              <Bubble size={112} />
              sabun balonu
            </li>
            <li className="flex flex-col items-center gap-2 text-center text-[14px]">
              <span className="chrome grid h-24 w-36 place-items-center rounded-[50%] border border-[#2b3445]/55 font-logo text-[12px] uppercase">balon</span>
              oval kapsayıcı
            </li>
          </ul>
        </Y2KCard>
        <Y2KCard className="lg:col-span-5">
          <h3 className="display text-[22px]">Madde 8: sıvı metal</h3>
          <SiviMetal />
          <p className="text-[14px] text-muted">Gürültü haritası krom damlayı büker; hareket kapalıyken ya da sade yüzeyde durur.</p>
        </Y2KCard>
        <Y2KCard className="lg:col-span-12">
          <h3 className="display text-[22px]">Madde 7: gölge değil, eğim ve kabartma</h3>
          <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <li>
              <span className="grid h-20 place-items-center rounded-full border border-[#2b3445]/55 bg-[#e0e5ec] font-logo text-[13px] text-black uppercase">Düz</span>
              <p className="mt-2 text-[14px] text-muted">Tek renk: yüzey yok.</p>
            </li>
            <li>
              <span className="grid h-20 place-items-center rounded-full border border-[#2b3445]/55 bg-[#e0e5ec] font-logo text-[13px] text-black uppercase shadow-[0_14px_26px_rgb(0_0_0/0.3)]">Gölge</span>
              <p className="mt-2 text-[14px] text-muted">Yumuşak gölge nesneyi havaya kaldırır; 2000'lerin dili değil.</p>
            </li>
            <li>
              <span className="chrome grid h-20 place-items-center rounded-full border border-[#2b3445]/55 font-logo text-[13px] uppercase">Kabartma</span>
              <p className="mt-2 text-[14px] text-muted">Dört iç gölge ve bir parlama: ışık yukarıdan, kenar yuvarlak.</p>
            </li>
          </ul>
          <div className="chrome mt-6 rounded-[24px] border border-[#2b3445]/55 px-6 py-5">
            <p className="font-logo text-[clamp(18px,3vw,30px)] text-black uppercase [text-shadow:0_1px_0_rgb(255_255_255/0.9),0_-1px_0_rgb(0_0_0/0.35)]">Oyulmuş metin · emboss</p>
            <p className="mt-1 text-[14px]">Metin yine saf siyah; kabartmayı yalnız 1px açık ve koyu kenar verir.</p>
          </div>
        </Y2KCard>
      </div>
    </Section>
  )
}

const UI_IKON: [string, typeof IconPlay][] = [
  ['Çal', IconPlay],
  ['Sonraki', IconNext],
  ['Ses', IconVolume],
  ['Disk', IconDisc],
  ['Nota', IconNote],
  ['Sepet', IconCart],
  ['Beğen', IconHeart],
  ['Ara', IconSearch],
  ['Profil', IconUser],
  ['Dünya', IconGlobe],
  ['Pencere', IconWindow],
  ['Kapat', IconClose],
  ['Onay', IconCheck],
  ['Git', IconArrow],
  ['Yıldız', IconStar],
  ['Parıltı', IconSparkle],
]

/** Madde 9: kalın çizgili ikonlar ve kabile vektörleri */
export function Iconography() {
  const [begen, setBegen] = useState(false)
  return (
    <Section id="ikon" kicker="Madde 9 · İkonografi" title="Kalın çizgi, yıldız ve kabile" lead="Arayüz ikonları 2,5 piksel kalınlığında, yuvarlak uçlu; süs vektörleri simetrik, sivri kabile (tribal) desenleri. Üstlerine gelince dönerler.">
      <ul className="grid grid-cols-4 gap-4 sm:grid-cols-8">
        {UI_IKON.map(([ad, I]) => (
          <li key={ad} className="flex flex-col items-center gap-2 text-center text-[13px]">
            <span className="chrome grid size-14 place-items-center rounded-full border border-[#2b3445]/55 hover:animate-[don_1.2s_linear_infinite]" aria-hidden="true">
              <I size={24} />
            </span>
            {ad}
          </li>
        ))}
      </ul>
      <ul className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
        {(
          [
            ['Alev', TribalFlame, 'text-[#ff66cc]'],
            ['Kanat', TribalWing, 'text-[#2e0854] dark:text-[#a5f2f3]'],
            ['Yıldız', TribalStar, 'text-[#2e0854] dark:text-[#e0e5ec]'],
            ['Halka', TribalRing, 'text-[#ff66cc]'],
          ] as const
        ).map(([ad, T, renk]) => (
          <Y2KCard as="li" key={ad} className="flex flex-col items-center gap-3 text-center">
            <span className={`${renk} inline-block hover:animate-[don_2.4s_linear_infinite]`}>
              <T size={110} />
            </span>
            <span className="font-logo text-[12px] uppercase">{ad}</span>
          </Y2KCard>
        ))}
      </ul>
      <p className="mt-6 text-[15px] text-muted">
        İkon tek başına anlam taşımaz: her düğmede ya yazı var ya erişilebilir ad.
      </p>
      <ChromeButton boyut="sm" ton={begen ? 'candy' : 'chrome'} ikon={<IconHeart size={14} dolu={begen} />} aria-pressed={begen} onClick={() => setBegen((b) => !b)} className="mt-3">
        {begen ? 'Beğenildi' : 'Beğen'}
      </ChromeButton>
    </Section>
  )
}
