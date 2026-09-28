import { SolidButton } from '../components/SolidButton'
import { Tag } from '../components/Tag'
import { IconArrow, IconCart, IconStar } from '../components/Icons'
import { Marquee } from '../components/Marquee'

const STATS: [string, string, string][] = [
  ['3px', 'Çerçeve', 'fill-yellow'],
  ['6·6·0', 'Gölge x·y·blur', 'bg-surface text-ink'],
  ['0', 'Bulanıklık', 'fill-pink'],
  ['%100', 'Düz renk', 'fill-green'],
]

export function Hero() {
  return (
    <>
      <section id="ust" aria-labelledby="baslik" className="relative mx-auto w-full max-w-7xl px-4 pt-10 pb-16 md:px-8 md:pt-16 md:pb-24">
        <div className="flex flex-wrap items-center gap-3">
          <Tag fill="ink" tilt={-3}>
            Stil 016
          </Tag>
          <Tag fill="surface">
            <span lang="en">Brutalism / Experimental</span>
          </Tag>
        </div>
        <h1 id="baslik" className="mega mt-8 max-w-full">
          <span className="block">Ham.</span>
          <span className="mt-[0.08em] mb-[0.16em] inline-block -rotate-1 rounded-brut border-[4px] border-line fill-red px-[0.12em] pt-[0.04em] brut-shadow">Sert.</span>
          <span className="block">Gürültülü.</span>
        </h1>
        <div className="relative mt-10 grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end">
          <div>
            <p className="max-w-[46ch] text-[21px] leading-snug font-medium max-sm:text-[18px]">
              <span lang="en" className="font-bold">
                Neo-Brutalism
              </span>{' '}
              yumuşak gölgeyi ve ince çizgiyi reddeder: saf renk, kalın siyah çerçeve, bulanıklığı sıfır ofset gölge ve devasa yazı. Kasıtlı olarak ham, ama her şey okunur.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <SolidButton size="l" fill="yellow" onClick={() => document.getElementById('bilesenler')?.scrollIntoView()} icon={<IconArrow size={22} strokeWidth={3} />}>
                Bileşenler
              </SolidButton>
              <SolidButton size="l" fill="white" onClick={() => document.getElementById('kullanim')?.scrollIntoView()} icon={<IconCart size={22} />}>
                Mağazayı dene
              </SolidButton>
            </div>
          </div>
          <div className="relative hidden h-[220px] md:block" aria-hidden="true">
            <span className="absolute top-0 right-6 grid size-[190px] rotate-12 place-items-center">
              <IconStar className="absolute inset-0 size-full text-ink" fill="var(--yellow)" strokeWidth={1.4} />
              <span className="relative mt-5 font-display text-[17px] leading-none font-black text-black uppercase [font-stretch:100%]">0 blur</span>
            </span>
            <span className="absolute bottom-2 left-6 size-24 rounded-full border-[3px] border-line fill-blue brut-shadow" />
            <span className="absolute right-[230px] bottom-10 size-16 rotate-6 border-[3px] border-line fill-green brut-shadow-sm" />
          </div>
        </div>
        <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {STATS.map(([v, k, f], i) => (
            <li key={k} className={`rounded-brut border-[3px] border-line px-4 pt-3 pb-4 brut-shadow ${f} ${i % 2 ? 'md:translate-y-6' : ''}`}>
              <p className="font-display text-[clamp(30px,4.4vw,56px)] leading-none font-black [font-stretch:var(--wd,125%)]">{v}</p>
              <p className="kicker mt-2">{k}</p>
            </li>
          ))}
        </ul>
      </section>
      <div className="overflow-x-clip py-10" aria-label="Kayan şeritler" role="group">
        <Marquee label="Şerit: stilin ilkeleri" items={['Ham', 'Sert', 'Düz', 'Kalın', 'Ofset', 'Gürültülü']} fill="yellow" tilt={-2} className="-mx-4" />
        <Marquee label="Şerit: kullanım alanları" items={['Geliştirici araçları', 'Ajanslar', 'Web3', 'Gen-Z mağazalar', 'Portfolyolar']} fill="ink" speed="yavas" reverse tilt={1.5} size="m" className="-mx-4 -mt-1" />
      </div>
    </>
  )
}
