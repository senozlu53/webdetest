import { Tooltip } from 'radix-ui'
import { BiophilicProvider, Duyuru } from './lib/store'
import { DynamicAmbientBackground } from './components/Ambient'
import { Header } from './components/Header'
import { Ikon } from './components/Ikon'
import { Hero, Karakter } from './sections/Giris'
import { DokuBolumu, Derinlik, Ikonlar, Palet, Sekil, Yazi } from './sections/Temel'
import { BitkiYonetimi, Nefes, Portfolyo } from './sections/Uygulamalar'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Mobil } from './sections/Davranis'

function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1240px] px-5 pb-16 sm:px-8 lg:px-12">
      <div className="cam flex flex-wrap items-end justify-between gap-x-10 gap-y-8 p-7 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full bg-btn text-btn-yazi" aria-hidden="true">
            <Ikon ad="gunes" boyut={28} />
          </span>
          <div>
            <p className="font-baslik text-[26px] leading-none font-medium">Ferah</p>
            <p className="kicker mt-1">
              Stil 032 · <span lang="en">Biophilic Design</span>
            </p>
          </div>
        </div>
        <p className="flex flex-wrap gap-x-10 gap-y-1 text-[17px]">
          <a href="../031/" className="inline-flex min-h-12 items-center gap-2">
            <Ikon ad="sol" boyut={18} /> Stil 031
          </a>
          <a href="../../" className="inline-flex min-h-12 items-center">
            Tüm stiller
          </a>
        </p>
      </div>
    </footer>
  )
}

export default function BiophilicApp() {
  return (
    <BiophilicProvider>
      <Tooltip.Provider delayDuration={150}>
        <DynamicAmbientBackground />
        <Header />
        <main id="icerik" tabIndex={-1} className="overflow-x-clip outline-none">
          <Hero />
          <Karakter />
          <Palet />
          <Yazi />
          <Sekil />
          <Derinlik />
          <DokuBolumu />
          <Ikonlar />
          <Nefes />
          <BitkiYonetimi />
          <Portfolyo />
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
    </BiophilicProvider>
  )
}
