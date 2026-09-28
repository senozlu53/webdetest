import type { CSSProperties } from 'react'
import { useArcade } from '../lib/store'
import { ArcadeText } from '../components/ArcadeText'
import { PixelButton } from '../components/PixelButton'
import { PixelContainer } from '../components/PixelContainer'
import { Ikon, Sprite, SpriteAnim } from '../components/Sprite'
import { Rozet, Section } from '../components/ui'
import { pad } from '../components/Header'
import { PALET, type PaletKod } from '../lib/sprites'

const git = (id: string) => document.getElementById(id)?.scrollIntoView()

/** Madde 1 · 2: karanlık salonda parlayan ekran. Sağda "attract mode": oyun kendi kendine oynar, jeton ister */
export function Hero() {
  const s = useArcade()
  const hi = Math.max(...s.skorlar.map((x) => x.puan))
  return (
    <section id="ust" aria-labelledby="baslik" className="mx-auto grid w-full max-w-[calc(var(--u)*400)] grid-cols-1 items-center gap-10 px-4 pt-10 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0">
        <div className="flex flex-wrap gap-3">
          <Rozet ton="kirmizi">Stil 021</Rozet>
          <Rozet ton="beyaz">Retro / Nostalgia</Rozet>
        </div>
        <ArcadeText as="h1" id="baslik" boyut="xl" ton="sari" neon sapma className="mt-8">
          Jeton Salonu
        </ArcadeText>
        <p className="mt-4 font-ps text-s leading-[1.5] uppercase" lang="en">
          <span data-ton="yesil" className="text-tx">
            Pixel Art
          </span>{' '}
          &amp;{' '}
          <span data-ton="kirmizi" className="text-tx">
            CRT
          </span>
        </p>
        <p className="mt-6 max-w-[48ch] text-body-l">
          8-bit konsolların keskin pikselleri ile tüplü televizyonun tarama çizgileri aynı ekranda. Jeton Salonu kurgu bir espor platformu: turnuva ağacı, yüksek skor tablosu, oynanabilir bir mini oyun ve RPG karakter ekranı. Düğmeler çalışır.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <PixelButton ton="yesil" boy="b" onClick={() => git('oyun')} ikon={<Ikon ad="oynat" buyukluk={1} />}>
            Oyna
          </PixelButton>
          <PixelButton ton="kirmizi" boy="b" onClick={() => git('turnuva')}>
            Turnuva
          </PixelButton>
        </div>
      </div>

      <PixelContainer basamak={2} golge={4} className="min-w-0 p-3" aria-label="Arcade ekranı: tanıtım modu" role="group">
        <div className="relative overflow-hidden bg-[#000] px-4 py-6 text-center text-[#fff]" data-attract="">
          <div className="hud flex justify-between gap-4 text-body" aria-hidden="true">
            <span>
              <span className="text-[#ff0000]">1UP</span> {pad(s.birUp)}
            </span>
            <span>
              <span className="text-[#ffea00]">HI</span> {pad(hi)}
            </span>
          </div>
          <p className="mt-8 font-ps text-m leading-[1.5] text-[#00ff00] uppercase" aria-hidden="true">
            Jeton
            <br />
            Salonu
          </p>
          <div className="relative mt-8 h-[calc(var(--u)*32)]" aria-hidden="true">
            <span className="absolute bottom-0 left-0 h-[var(--u)] w-full bg-[#7f7f7f]" />
            <span className={s.hareket ? 'yuru absolute bottom-[var(--u)]' : 'absolute bottom-[var(--u)] left-[20%]'}>
              <SpriteAnim anim="kahraman" buyukluk={2} oynat={s.hareket} etiket="" />
            </span>
            <span className="absolute right-[18%] bottom-[var(--u)]">
              <SpriteAnim anim="balcik" buyukluk={2} oynat={s.hareket} etiket="" />
            </span>
            <span className="absolute top-0 left-[46%]">
              <SpriteAnim anim="jeton" buyukluk={1} oynat={s.hareket} etiket="" />
            </span>
          </div>
          <p className="mt-8 font-ps text-s leading-[2] uppercase">
            <span className={s.kredi ? 'text-[#00ff00]' : 'blink text-[#ffea00]'} data-yanip={s.kredi ? undefined : ''}>
              {s.kredi ? 'Başlamak için oyna' : 'Jeton at'}
            </span>
            <br />
            <span lang="en" className={s.kredi ? 'text-[#bdbdbd]' : 'blink text-[#ff0000]'} aria-hidden="true">
              {s.kredi ? 'Press start' : 'Insert coin'}
            </span>
          </p>
          <p className="hud mt-6 text-body text-[#bdbdbd]">
            <span lang="en">Credit</span> {s.kredi} · © 1989 Jeton Salonu
          </p>
        </div>
      </PixelContainer>
      <style>{`
        .yuru { left: 0; animation: yuru 6s steps(24) infinite; }
        @keyframes yuru { to { translate: calc(var(--u) * 96) 0; } }
        :root[data-motion='off'] .yuru { animation: none; }
      `}</style>
    </section>
  )
}

const v = (o: Record<string, string>) => o as CSSProperties

/** Madde 3: dört karakteristik, her biri canlı örnekle */
export function Ozellikler() {
  const kod: PaletKod[] = ['k', 'w', 'a', 'd', 'r', 'R', 'o', 'y', 'Y', 'g', 'G', 'c', 'C', 'b', 'm', 's']
  return (
    <Section id="ozellik" madde="Madde 3 · Karakteristikler" title="Dört kural" lead="Arayüzün her parçası bu dördünden birine dayanır. Kenar yumuşatma yok, palet dar, ekran bozulmaları bilerek eklenir ve her şeyin üstünden tarama çizgisi geçer.">
      <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 xl:grid-cols-4">
        <PixelContainer as="li" ton="sari" className="p-5">
          <ArcadeText as="h3" boyut="s" ton="sari">
            Keskin piksel
          </ArcadeText>
          <div className="mt-4 flex flex-wrap items-end gap-3" aria-hidden="true">
            <Sprite ad="kalp" buyukluk={1} />
            <Sprite ad="kalp" buyukluk={2} />
            <Sprite ad="kalp" buyukluk={3} />
          </div>
          <p className="mt-4">Aynı 16×16 kalp 1x, 2x, 3x. En yakın komşu büyütme: her piksel kare kalır, ara renk yok.</p>
        </PixelContainer>
        <PixelContainer as="li" ton="yesil" className="p-5">
          <ArcadeText as="h3" boyut="s" ton="yesil">
            Dar palet
          </ArcadeText>
          <div className="mt-4 grid grid-cols-8 gap-1" aria-hidden="true">
            {kod.map((k) => (
              <span key={k} className="block aspect-square shadow-[0_0_0_1px_var(--lo-white)]" style={{ background: PALET[k] }} />
            ))}
          </div>
          <p className="mt-4">Sprite'lar 16 renkle çizilir. Arayüz metni yalnız beşini kullanır: beyaz, kırmızı, sarı, yeşil, camgöbeği.</p>
        </PixelContainer>
        <PixelContainer as="li" ton="kirmizi" className="p-5">
          <ArcadeText as="h3" boyut="s" ton="kirmizi">
            Renk sapması
          </ArcadeText>
          <p className="sapma mt-4 font-ps text-m leading-[1.5] text-ink uppercase" aria-hidden="true" style={v({ '--ab-a': '#ff0000', '--ab-b': '#00ffff' })}>
            Game over
          </p>
          <p className="mt-4">Tüpün üç elektron tabancası tam hizalanmaz: kırmızı sola, camgöbeği sağa bir piksel kayar. Bulanıklık değil, kaydırılmış kopya.</p>
        </PixelContainer>
        <PixelContainer as="li" ton="camgobegi" className="p-5">
          <ArcadeText as="h3" boyut="s" ton="camgobegi">
            Tarama çizgisi
          </ArcadeText>
          <div className="relative mt-4 h-[calc(var(--u)*16)] overflow-hidden" aria-hidden="true" style={{ background: 'linear-gradient(90deg,#ff0000 0 25%,#ffea00 0 50%,#00ff00 0 75%,#00ffff 0)' }}>
            <span className="absolute inset-0" style={{ background: 'repeating-linear-gradient(to bottom, transparent 0 calc(var(--u) - 1px), #000 calc(var(--u) - 1px) var(--u))' }} />
          </div>
          <p className="mt-4">Her sanal pikselin alt satırı karanlık. Bütün sayfanın üstünde durur, tıklamayı geçirir; ayarlardan kapanır.</p>
        </PixelContainer>
      </ul>
    </Section>
  )
}
