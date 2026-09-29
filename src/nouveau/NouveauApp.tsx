import { Tooltip } from 'radix-ui'
import { NouveauProvider, Duyuru } from './lib/store'
import { DokuKatmani } from './components/DokuKatmani'
import { Header } from './components/Header'
import { Ikon } from './components/Ikon'
import { Hero, Karakter } from './sections/Giris'
import { Derinlik, DokuBolumu, Ikonlar, Palet, Sekil, Yazi } from './sections/Temel'
import { Antikaci, Atolye, Muze, Parfum } from './sections/Uygulamalar'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Mobil } from './sections/Davranis'
import { DalgaHat } from './components/ui'

function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1240px] px-5 pb-16 sm:px-8 lg:px-12">
      <DalgaHat />
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8 pt-10">
        <div className="flex items-center gap-3">
          <Ikon ad="zambak" boyut={44} className="text-zeytin" kalin={1.4} />
          <div>
            <p className="font-baslik text-[26px] leading-none">Süsen</p>
            <p className="kicker mt-1">
              Stil 030 · <span lang="en">Art Nouveau</span>
            </p>
          </div>
        </div>
        <p className="flex flex-wrap gap-x-10 gap-y-1 text-[17px]">
          <a href="../029/" className="inline-flex min-h-12 items-center gap-2">
            <Ikon ad="sol" boyut={18} /> Stil 029
          </a>
          <a href="../../" className="inline-flex min-h-12 items-center">
            Tüm stiller
          </a>
        </p>
      </div>
    </footer>
  )
}

export default function NouveauApp() {
  return (
    <NouveauProvider>
      <Tooltip.Provider delayDuration={150}>
        <DokuKatmani />
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
          <Muze />
          <Antikaci />
          <Parfum />
          <Atolye />
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
    </NouveauProvider>
  )
}
