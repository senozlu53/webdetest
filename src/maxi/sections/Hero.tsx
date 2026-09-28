import { useState } from 'react'
import { useMaxi } from '../lib/store'
import { PALETTE_3D } from '../lib/data'
import { Scene } from '../components/Scene'
import { BigButton } from '../components/ui'
import { Paper } from '../components/Paper'
import { StickerFace } from '../components/Sticker'
import { Blob, Squiggle, Starburst, Stretched, Tri } from '../components/Shapes'
import { IconArrow, IconShuffle, IconTicket } from '../components/Icons'
import { useScrollFx } from '../hooks/useScrollFx'

/**
 * Madde 2 · 11: sınırlarını taşan kahraman. Katman sırası rastgele görünür ama kurgulu (Madde 7):
 * z-0 doku · z-10 dev yazı · z-20 kolaj · z-30 3D · z-40 okunur kart · z-50 çıkartmalar.
 * Mobilde (Madde 17) aynı içerik alt alta dizilen, blok renkli dev kartlara dönüşür.
 */
export function Hero() {
  const { announce } = useMaxi()
  const [colors, setColors] = useState(['#ff2e93', '#c8ff00', '#00e5ff', '#c9b5ff'])
  const fxA = useScrollFx<HTMLSpanElement>()
  const fxB = useScrollFx<HTMLDivElement>()
  const fxC = useScrollFx<HTMLDivElement>()
  const shuffle = () => {
    setColors((c) => c.map((x, i) => PALETTE_3D[(PALETTE_3D.indexOf(x) + 2 + i) % PALETTE_3D.length]))
    announce('3D nesnelerin renkleri karıştı')
  }
  const popOne = (i: number) => setColors((c) => c.map((x, k) => (k === i ? PALETTE_3D[(PALETTE_3D.indexOf(x) + 1) % PALETTE_3D.length] : x)))

  return (
    <section id="ust" aria-labelledby="baslik" className="relative overflow-x-clip pb-8 md:min-h-[940px] md:pb-0">
      {/* z-0: zemin dokusu ve süs şekilleri */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="halftone halftone-fade absolute -top-10 right-0 h-[70%] w-[70%] [--dot:var(--pink)] [--dot-size:14px] [--fade-dir:200deg]" />
        <Blob seed={4} size={520} fill="var(--butter)" className="clutter sat absolute -bottom-40 -left-40 hidden md:block" />
        <Blob seed={9} size={300} fill="var(--mint)" className="clutter sat absolute top-24 left-[38%] hidden opacity-80 md:block" />
      </div>

      <div className="relative mx-auto max-w-[1320px] px-4 pt-8 md:px-8 md:pt-12">
        <div className="relative z-40 flex flex-wrap items-center gap-2">
          <span className="kicker rounded-full bg-[#111014] px-3 py-1 text-[#fff7ee]">Stil 017</span>
          <span className="kicker rounded-full border-2 border-line px-3 py-1" lang="en">
            Brutalism / Experimental · Maximalism
          </span>
        </div>

        {/* z-10: üst üste binen dev yazı; üç ayrı font ailesi aynı başlıkta (Madde 5). Alt satır okunur metin: z-40, düz zemin */}
        <div className="relative mt-6 max-md:z-10 max-md:rounded-[28px] max-md:border-4 max-md:border-[#111014] max-md:bg-pink max-md:p-5 max-md:text-[#111014] max-md:shadow-[6px_7px_0_#111014]">
          <h1 id="baslik" className="relative z-10">
            <span ref={fxA} className="fx block font-sans text-[16vw] leading-[0.8] font-black tracking-[-0.03em] uppercase [--fx-rot:-4deg] [--fx-y:-40px] [font-stretch:112%] md:text-[clamp(96px,14vw,212px)] md:text-pink md:[font-stretch:150%]">
              Horror
            </span>
            <span className="relative block font-serif text-[20vw] leading-[0.78] font-black italic md:-mt-[calc(var(--overlap)*0.22em)] md:ml-[9vw] md:text-[clamp(110px,16.5vw,250px)] md:text-blue">
              <span className="wonk">vacui</span>
            </span>
          </h1>
          <p className="relative z-40 mt-3 font-mono text-[15px] leading-tight font-bold [font-stretch:112.5%] md:mt-1 md:ml-[9vw] md:w-fit md:rounded-xl md:border-2 md:border-line md:bg-paper md:px-3 md:py-1 md:text-[clamp(16px,1.7vw,24px)]">
            Boşluk Korkusu <span className="font-hand text-[1.4em] leading-none font-bold">festivali</span> · 11–13 Haziran 2027
          </p>
          {/* Madde 15'in sınıfları birebir; alt satırın hemen altına asılı, okunur metne binmez */}
          <span className="clutter pointer-events-none absolute top-full left-[61%] z-50 mt-2 hidden -rotate-12 font-sans text-[clamp(60px,8vw,120px)] leading-none font-black text-white uppercase mix-blend-difference [font-stretch:150%] md:block" aria-hidden="true">
            Kaos!
          </span>
        </div>

        <div className="relative md:mt-[-120px] md:grid md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:items-start md:gap-6">
          {/* z-40: okunur içerik kartı */}
          <div className="relative z-40 mt-6 md:mt-[170px]">
            <div className="tilt grain-box rounded-[28px] border-4 border-[#111014] bg-butter p-6 text-[#111014] shadow-[8px_9px_0_#111014] md:max-w-[520px]" style={{ ['--r' as string]: -0.25 }}>
              <p className="text-[20px] leading-snug font-semibold max-sm:text-[18px]">
                <span className="font-serif font-black italic">Az</span> çok değildir. <span className="font-mono text-[0.85em] font-bold">Çok</span> <span className="font-sans font-black uppercase [font-stretch:150%]">çoktur.</span> Üç gün, üç sahne, yetmiş iki sanatçı ve boş bırakılmış tek bir piksel yok.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <BigButton cursor="bilet" onClick={() => document.getElementById('bilet')?.scrollIntoView()}>
                  <IconTicket size={22} /> Bilet al
                </BigButton>
                <BigButton bg="var(--blue)" fg="#fff7ee" cursor="kaydır" onClick={() => document.getElementById('program')?.scrollIntoView()}>
                  Program <IconArrow size={22} />
                </BigButton>
              </div>
            </div>
            <Paper seed={21} bg="var(--paper)" tape r={0.6} className="z-20 mt-8 max-w-[380px] max-md:hidden">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 p-5 font-mono text-[12px] leading-tight text-ink [font-stretch:87.5%]">
                <div>
                  <dt className="font-bold">Yer</dt>
                  <dd>Liman Deposu, İstanbul</dd>
                </div>
                <div>
                  <dt className="font-bold">Kapı</dt>
                  <dd>Her gün 17.00</dd>
                </div>
                <div>
                  <dt className="font-bold">Sahne</dt>
                  <dd>3 · 72 sanatçı</dd>
                </div>
                <div>
                  <dt className="font-bold">Dönüş</dt>
                  <dd>Gece otobüsü 04.30</dd>
                </div>
              </dl>
            </Paper>
          </div>

          {/* z-30: 3D varlıklar; mobilde siyah dev kart */}
          <div className="relative z-30 mt-6 md:mt-0">
            <div className="max-md:rounded-[28px] max-md:border-4 max-md:border-[#111014] max-md:bg-[#111014] max-md:shadow-[6px_7px_0_#111014]">
              <Scene colors={colors} onPop={popOne} className="h-[340px] w-full md:h-[640px]" />
              <p className="sr-only">Dönen üç boyutlu nesneler: holografik krom düğüm, parlak yıldız patlaması, pastel kapsül ve dalgalanan damla.</p>
            </div>
            <button type="button" onClick={shuffle} className="absolute right-3 bottom-3 z-40 inline-flex items-center gap-2 rounded-full border-2 border-[#111014] bg-paper px-3 py-1.5 text-[14px] font-bold text-ink md:right-10 md:bottom-16" data-cursor="karıştır">
              <IconShuffle size={16} /> Renkleri karıştır
            </button>
          </div>
        </div>

        {/* z-50: çıkartmalar */}
        <div className="clutter pointer-events-none" aria-hidden="true">
          <div ref={fxB} className="fx absolute top-[52px] right-[4%] z-50 hidden [--fx-rot:40deg] [--fx-scale:0.12] md:block">
            <Starburst size={170} fill="var(--lime)" points={18} className="font-sans text-[20px] font-black uppercase [font-stretch:125%]">
              72 sanatçı
            </Starburst>
          </div>
          <div ref={fxC} className="fx absolute right-[32%] bottom-[150px] z-50 hidden [--fx-hue:120deg] [--fx-y:60px] md:block">
            <StickerFace shape="circle" bg="holo" fg="#111014" size={130}>
              3 sahne 3 gece
            </StickerFace>
          </div>
          <Tri size={110} fill="var(--orange)" className="absolute top-[140px] left-[36%] z-20 hidden rotate-[18deg] md:block" />
          <Stretched w={300} h={70} fill="var(--cyan)" className="absolute top-[610px] right-[2%] z-20 hidden -rotate-6 md:block" />
          <Squiggle w={240} color="var(--violet)" className="absolute bottom-[240px] left-[40%] z-20 hidden md:block" />
          <p className="absolute top-[118px] right-[26%] z-20 hidden font-mono text-[11px] leading-tight text-ink [font-stretch:75%] md:block">
            41°01' K · 28°58' D
            <br />
            kapı 17.00 · dönüş 04.30
          </p>
        </div>

        {/* Mobil: çıkartmalar satırı */}
        <div className="mt-6 flex flex-wrap items-center gap-3 md:hidden" aria-hidden="true">
          <Starburst size={120} fill="var(--lime)" className="font-sans text-[15px] font-black uppercase">
            72
            <br />
            sanatçı
          </Starburst>
          <StickerFace shape="circle" bg="holo" fg="#111014" size={104}>
            3 sahne
          </StickerFace>
          <StickerFace shape="pill" bg="var(--orange)" fg="#111014">
            Gece otobüsü
          </StickerFace>
        </div>
      </div>

      {/* Sınırı taşan kelime: bir sonraki bölümün üstüne biner */}
      <p className="clutter pointer-events-none absolute -bottom-[0.38em] left-[-1vw] z-10 hidden font-sans text-[clamp(120px,19vw,300px)] leading-none font-black text-transparent uppercase [-webkit-text-stroke:3px_var(--ink)] [font-stretch:150%] md:block" aria-hidden="true">
        Boşluk
      </p>
    </section>
  )
}
