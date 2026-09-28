import { BrutProvider, LiveRegions, useBrut } from './lib/store'
import { Header } from './components/Header'
import { Marquee } from './components/Marquee'
import { Hero } from './sections/Hero'
import { Traits } from './sections/Traits'
import { Components } from './sections/Components'
import { UseCases } from './sections/UseCases'
import { Palette } from './sections/Palette'
import { Build } from './sections/Build'
import { Motion } from './sections/Motion'
import { Responsive } from './sections/Responsive'
import { Access } from './sections/Access'
import { cx } from '../shared/cx'

const TONE = { yellow: 'fill-yellow', green: 'fill-green', red: 'fill-red', blue: 'fill-blue' } as const

/** Bildirimler görsel; ekran okuyucuya store.toast içinden canlı bölgeyle duyurulur */
function Toasts() {
  const { toasts } = useBrut()
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-3" aria-hidden="true">
      {toasts.map((t) => (
        <p key={t.id} className={cx('stamp max-w-[min(360px,calc(100vw-32px))] rounded-brut border-[3px] border-line px-4 py-3 font-display text-[17px] font-black uppercase brut-shadow [font-stretch:110%]', TONE[t.tone])}>
          {t.text}
        </p>
      ))}
    </div>
  )
}

export default function BrutApp() {
  return (
    <BrutProvider>
      <Header />
      <main id="icerik" tabIndex={-1} className="outline-none">
        <Hero />
        <Traits />
        <Components />
        <div className="overflow-x-clip py-6">
          <Marquee label="Şerit: bileşenler" lang="en" items={['SolidButton', 'BrutalistCard', 'Marquee', 'Tag']} fill="pink" size="m" tilt={-1.5} className="-mx-4" />
        </div>
        <UseCases />
        <Palette />
        <Build />
        <Motion />
        <Responsive />
        <Access />
      </main>
      <footer className="border-t-[3px] border-line fill-ink">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 py-12 md:px-8">
          <p className="font-display text-[clamp(40px,8vw,112px)] leading-[0.85] font-black uppercase [font-stretch:var(--wd,125%)]">Brüt.</p>
          <div className="font-bold">
            <p>
              Stil 016 · <span lang="en">Neo-Brutalism</span>. Ürünler ve veriler kurgudur.
            </p>
            <p className="mt-2">
              <a href="../../" className="underline decoration-[3px] underline-offset-4">
                Tüm stiller
              </a>{' '}
              ·{' '}
              <a href="../015/" className="underline decoration-[3px] underline-offset-4">
                Stil 015
              </a>
            </p>
          </div>
        </div>
      </footer>
      <Toasts />
      <LiveRegions />
    </BrutProvider>
  )
}
