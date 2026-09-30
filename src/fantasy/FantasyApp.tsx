import { Header } from './components/Header'
import { IkonTanim } from './components/Ikon'
import { GorevModal } from './components/Modal'
import { Ayrac } from './components/Suslu'
import { OyunProvider } from './lib/oyun'
import { Duyuru, FantasyProvider } from './lib/store'
import { YaldizSaglayici } from './lib/yaldiz'
import { Alanlar } from './sections/Alanlar'
import { Erisim, Hareket, Mobil } from './sections/Davranis'
import { Hero, Stil } from './sections/Giris'
import { Derinlik, Renk, Sekil, Simge, Yazi, Yuzey } from './sections/Temel'
import { Bilesenler, Css, Figma } from './sections/Uretim'

function Footer() {
  return (
    <footer className="pt-[var(--bolum)] pb-12">
      <div className="kap">
        <Ayrac />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
          <p className="t-etiket t-soluk md:col-span-3">Külbaşı Stüdyo · Kadim Diyar</p>
          <p className="t-alt md:col-span-6">Bu sayfa kurgusal bir oyunun arayüz referansıdır; karakter, eşya ve lonca adları gerçek değildir. Yazı: Cinzel ve Crimson Pro.</p>
          <p className="flex flex-wrap gap-x-8 gap-y-1 md:col-span-3">
            <a href="../036/" className="inline-flex min-h-12 items-center">
              Stil 036
            </a>
            <a href="../../" className="inline-flex min-h-12 items-center">
              Tüm stiller
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function FantasyApp() {
  return (
    <FantasyProvider>
      <OyunProvider>
        <YaldizSaglayici>
          <IkonTanim />
          <Header />
          <main id="icerik" tabIndex={-1} className="outline-none">
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
          <GorevModal />
          <Duyuru />
        </YaldizSaglayici>
      </OyunProvider>
    </FantasyProvider>
  )
}
