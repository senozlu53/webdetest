import { Tooltip } from 'radix-ui'
import { WabiProvider, Duyuru } from './lib/store'
import { DokuKatmani } from './components/DokuKatmani'
import { Header } from './components/Header'
import { Ikon } from './components/Ikon'
import { Bolucu, Enso, WabiContainer, Yer } from './components/Wabi'
import { Felsefe, Hero } from './sections/Giris'
import { DokuBolumu, Derinlik, Ikonlar, Renk, Sekil, Yazi } from './sections/Temel'
import { Atolye, Mimari, Yayin, Zen } from './sections/Uygulamalar'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Mobil } from './sections/Davranis'

function Footer() {
  return (
    <footer className="pb-[clamp(56px,8vw,112px)]">
      <div className="mx-auto w-full max-w-[calc(1360px+2*var(--kenar))] px-[var(--kenar)]">
        <Bolucu tohum={29} />
      </div>
      <WabiContainer className="pt-16">
        <Yer b={2} s={4} ind={0}>
          <div className="flex items-center gap-4">
            <Enso boyut={44} tohum={14} kalin={7} />
            <div>
              <p className="font-baslik text-[32px] leading-none font-light tracking-[0.04em]">Sükun</p>
              <p className="kicker mt-2">
                Stil 033 · <span lang="en">Natural Minimalism</span>
              </p>
            </div>
          </div>
        </Yer>
        <Yer b={9} s={4} ind={10} ust={2}>
          <p className="flex flex-wrap gap-x-10 gap-y-1 text-[16px]">
            <a href="../032/" className="inline-flex min-h-12 items-center gap-2">
              <Ikon ad="sol" boyut={16} /> Stil 032
            </a>
            <a href="../../" className="inline-flex min-h-12 items-center">
              Tüm stiller
            </a>
          </p>
        </Yer>
      </WabiContainer>
    </footer>
  )
}

export default function WabiApp() {
  return (
    <WabiProvider>
      <Tooltip.Provider delayDuration={150}>
        <DokuKatmani />
        <Header />
        <main id="icerik" tabIndex={-1} className="overflow-x-clip outline-none">
          <Hero />
          <Felsefe />
          <Renk />
          <Yazi />
          <Sekil />
          <Derinlik />
          <DokuBolumu />
          <Ikonlar />
          <Atolye />
          <Zen />
          <Mimari />
          <Yayin />
          <Bilesenler />
          <Figma />
          <Css />
          <Hareket />
          <Mobil />
          <Erisim />
        </main>
        <Footer />
        <Duyuru />
      </Tooltip.Provider>
    </WabiProvider>
  )
}
