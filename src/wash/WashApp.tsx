import { Tooltip } from 'radix-ui'
import { Duyuru, WashProvider } from './lib/store'
import { Filters } from './components/Filters'
import { Header } from './components/Header'
import { Hero, Karakter } from './sections/Giris'
import { Boya, Palet, Yazi } from './sections/Temel'
import { Doku, Golge, Ikonlar, Sekil } from './sections/Sekil'
import { Masal } from './sections/Masal'
import { Dergi, Sofra, Sukunet } from './sections/Uygulamalar'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Mobil } from './sections/Davranis'
import { Ikon } from './components/Ikon'

function Footer() {
  return (
    <footer className="border-t border-[var(--cizgi)]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-10 md:px-8">
        <p className="flex items-center gap-3 font-baslik text-[26px] italic">
          <Ikon ad="kitap" boyut={36} />
          Sessiz Kitaplık · Stil 027
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-1 text-[17px]">
          <a href="../026/" className="inline-flex min-h-12 items-center">
            ← Stil 026
          </a>
          <a href="../../" className="inline-flex min-h-12 items-center">
            Tüm stiller
          </a>
        </p>
      </div>
    </footer>
  )
}

export default function WashApp() {
  return (
    <WashProvider>
      <Tooltip.Provider delayDuration={150}>
        <Filters />
        <Header />
        <main id="icerik" tabIndex={-1} className="overflow-x-clip outline-none">
          <Hero />
          <Karakter />
          <Palet />
          <Boya />
          <Yazi />
          <Sekil />
          <Golge />
          <Doku />
          <Ikonlar />
          <Masal />
          <Sukunet />
          <Sofra />
          <Dergi />
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
    </WashProvider>
  )
}
