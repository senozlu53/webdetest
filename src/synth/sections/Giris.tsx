import { useEffect, useState } from 'react'
import { useSynth } from '../lib/store'
import { WireframeGrid } from '../components/WireframeGrid'
import { NeonButton } from '../components/NeonButton'
import { RetroCard } from '../components/RetroCard'
import { Ikon } from '../components/Icons'
import { Section } from '../components/ui'

const git = (id: string) => document.getElementById(id)?.scrollIntoView()
const sayac = (s: number) => [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, '0')).join(':')

/** Madde 1 · 2 · 17: ufukta tel kafes güneş, akan ızgara, palmiye. Izgara yalnız bu alanda */
export function Hero() {
  const s = useSynth()
  const [sn, setSn] = useState(754)
  useEffect(() => {
    if (!s.hareket) return
    const t = window.setInterval(() => setSn((x) => x + 1), 1000)
    return () => window.clearInterval(t)
  }, [s.hareket])
  return (
    <section id="ust" aria-labelledby="baslik" className="relative">
      <WireframeGrid className="h-[min(92vh,820px)] min-h-[600px] max-md:h-auto" ufuk={56} gunesX={72} palmiyeSag>
        <div className="mx-auto flex h-full max-w-[1200px] flex-col px-4 pt-10 pb-28 md:px-8 md:pt-16 md:pb-0">
          <div className="flex items-start justify-between gap-4">
            <p className="kicker text-cyan">Stil 023 · Colorful / Pop / Playful</p>
            <p className="kicker sapma flex shrink-0 items-center gap-2 whitespace-nowrap text-text [overflow-wrap:normal]" aria-label={`VHS sayacı ${sayac(sn)}`} data-osd="">
              <Ikon ad="oynat" boyut={16} />
              <span lang="en">Play</span>
              <span className="tabular-nums">{sayac(sn)}</span>
            </p>
          </div>
          <h1 id="baslik" className="mt-8 md:mt-12">
            <span className="chrome titre block text-[clamp(64px,12vw,168px)]">Gece Sürüşü</span>
            <span className="script -mt-2 ml-[8%] block -rotate-6 text-[clamp(44px,7vw,96px)] md:-mt-6" lang="en">
              Synthwave
            </span>
          </h1>
          <p className="mt-12 max-w-[46ch] rounded-[8px] border-2 border-line bg-[#0d0418]/90 p-4 text-[17px] text-text md:mt-14">
            80'lerin neonu, Miami geceleri ve VHS bilimkurgusu. Neon 84 kurgu bir stüdyo: synth, arcade salonu, sanat galerisi ve portfolyo çalışır.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <NeonButton boy="b" onClick={() => git('studyo')} ikon={<Ikon ad="nota" boyut={20} />}>
              Synth'i çal
            </NeonButton>
            <NeonButton boy="b" renk="cyan" onClick={() => git('galeri')}>
              Galeri
            </NeonButton>
          </div>
        </div>
      </WireframeGrid>
    </section>
  )
}

const KURALLAR = [
  { ikon: 'dalga' as const, renk: 'pink' as const, baslik: 'Tel kafes', metin: 'Zemin, dağ ve güneş yalnız çizgiyle çizilir. Hacim dolguyla değil, ızgaranın ufka kısalmasıyla gelir.' },
  { ikon: 'simsek' as const, renk: 'cyan' as const, baslik: 'Neon parlama', metin: 'Her çizgi cam tüp gibi ışır: 2, 4 ve 12 piksellik üç hale üst üste. Zemin hep koyu kalır ki ışık görünsün.' },
  { ikon: 'yildiz' as const, renk: 'turuncu' as const, baslik: 'Krom yazı', metin: 'Başlık metal gibi: üstte gökyüzü, ortada keskin ufuk, altta gün batımı yansıması. İç gölge hacmi verir.' },
  { ikon: 'kaset' as const, renk: 'pink' as const, baslik: 'Retro bilimkurgu', metin: 'VHS sayacı, tracking çizgisi, renk sapması. Gelecek, 1984\'ün hayal ettiği gibi.' },
]

/** Madde 3: dört karakteristik */
export function Karakter() {
  return (
    <Section id="karakter" madde="Madde 3 · Karakteristikler" title="Dört sinyal" script="neon" lead="Izgara yalnız giriş alanında akar; aşağıdaki bölümler saf karanlık zeminde neon arayüzdür (Madde 17).">
      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {KURALLAR.map((k) => (
          <RetroCard as="li" key={k.baslik} className="p-6">
            <Ikon ad={k.ikon} renk={k.renk} parla boyut={40} />
            <h3 className="chrome mt-5 text-[30px]">{k.baslik}</h3>
            <p className="mt-3 text-[15px] text-muted">{k.metin}</p>
          </RetroCard>
        ))}
      </ul>
    </Section>
  )
}
