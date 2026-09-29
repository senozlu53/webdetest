import { Tooltip } from 'radix-ui'
import { BotanicalProvider, Duyuru } from './lib/store'
import { Header } from './components/Header'
import { DokuKatmani } from './components/DokuKatmani'
import { Ikon } from './components/Ikon'
import { LeafDivider, Maskeler } from './components/Botanical'
import { Hero, Karakter } from './sections/Giris'
import { Derinlik, DokuBolumu, Ikonlar, Palet, Sekil, Yazi } from './sections/Temel'
import { Kozmetik, Pazar, Tarim, Turizm } from './sections/Uygulamalar'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Mobil } from './sections/Davranis'

function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1240px] px-5 pb-16 sm:px-8 lg:px-12">
      <LeafDivider tur="dal" />
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8 pt-10">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center bg-zeytin text-[#f8f4ea]" style={{ borderRadius: 'var(--r-tas)' }} aria-hidden="true">
            <Ikon ad="filiz" boyut={28} />
          </span>
          <div>
            <p className="font-baslik text-[26px] leading-none font-semibold">Fidan</p>
            <p className="kicker mt-1">
              Stil 031 · <span lang="en">Botanical / Earthy</span>
            </p>
          </div>
        </div>
        <p className="flex flex-wrap gap-x-10 gap-y-1 text-[17px]">
          <a href="../030/" className="inline-flex min-h-12 items-center gap-2">
            <Ikon ad="sol" boyut={18} /> Stil 030
          </a>
          <a href="../../" className="inline-flex min-h-12 items-center">
            Tüm stiller
          </a>
        </p>
      </div>
    </footer>
  )
}

export default function BotanicalApp() {
  return (
    <BotanicalProvider>
      <Tooltip.Provider delayDuration={150}>
        <Maskeler />
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
          <Pazar />
          <Kozmetik />
          <Tarim />
          <Turizm />
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
    </BotanicalProvider>
  )
}
