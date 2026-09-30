import { Tooltip } from 'radix-ui'
import { EditorialProvider, Duyuru } from './lib/store'
import { Header } from './components/Header'
import { GridOverlay } from './components/GridOverlay'
import { EditorialContainer } from './components/Editorial'
import { Alanlar } from './sections/Alanlar'
import { Erisim, Hareket, Mobil } from './sections/Davranis'
import { Hero, Stil } from './sections/Giris'
import { Derinlik, Renk, Sekil, Simge, Yazi, Yuzey } from './sections/Temel'
import { Bilesenler, Css, Figma } from './sections/Uretim'

function Footer() {
  return (
    <footer className="pt-[var(--bolum)] pb-12">
      <EditorialContainer className="gap-y-6">
        <div className="kural-cift col-span-4 md:col-span-12" aria-hidden="true" />
        <p className="t-etiket col-span-4 md:col-span-3" data-kol="1">
          Kolon · Sayı 36
        </p>
        <p className="t-alt col-span-4 md:col-span-6 md:col-start-4" data-kol="4">
          Mimarlık ve yayıncılık dergisi. Bu sayfa kurgusal bir yayının otuz altıncı sayısıdır; içerik, kişi ve kitap adları gerçek değildir. Yazı: Newsreader ve Inter Tight.
        </p>
        <p className="col-span-4 flex flex-wrap gap-x-8 gap-y-1 md:col-span-3 md:col-start-10" data-kol="10">
          <a href="../035/" className="inline-flex min-h-12 items-center">
            Stil 035
          </a>
          <a href="../../" className="inline-flex min-h-12 items-center">
            Tüm stiller
          </a>
        </p>
      </EditorialContainer>
    </footer>
  )
}

export default function EditorialApp() {
  return (
    <EditorialProvider>
      <Tooltip.Provider delayDuration={150}>
        <Header />
        <main id="icerik" tabIndex={-1} className="sayfa-belir overflow-x-clip outline-none">
          <Hero />
          <Stil />
          <Renk />
          <Yazi />
          <Sekil />
          <Derinlik />
          <Yuzey />
          <Simge />
          <Alanlar />
          <Bilesenler />
          <Figma />
          <Css />
          <Hareket />
          <Mobil />
          <Erisim />
        </main>
        <Footer />
        <GridOverlay />
        <Duyuru />
      </Tooltip.Provider>
    </EditorialProvider>
  )
}
