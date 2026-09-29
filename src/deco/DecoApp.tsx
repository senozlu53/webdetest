import { Tooltip } from 'radix-ui'
import { DecoProvider, Duyuru } from './lib/store'
import { Tanimlar } from './components/Tanimlar'
import { Header } from './components/Header'
import { Ayirac, Ziggurat } from './components/Ornament'
import { Ikon } from './components/Ikon'
import { Hero, Karakter } from './sections/Giris'
import { Palet, Yazi } from './sections/Temel'
import { Derinlik, Doku, Ikonlar, Sekil } from './sections/Sekil'
import { Koleksiyon, Kulup, Menu, Mucevher, Rezervasyon } from './sections/Uygulamalar'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Mobil } from './sections/Davranis'

function Footer() {
  return (
    <footer className="mx-auto max-w-[1200px] px-4 pt-6 pb-16 text-center md:px-8">
      <Ziggurat />
      <Ayirac className="mt-8 max-w-[420px]" />
      <div className="mt-8 flex flex-col items-center gap-3">
        <Ikon ad="yelpaze" boyut={36} />
        <p className="font-baslik text-[22px] tracking-[0.34em] text-altin-yazi uppercase" style={{ letterSpacing: 'calc(0.34em * var(--iz))' }}>
          <span lang="en">Aurelia Palas</span> · Stil 028
        </p>
      </div>
      <p className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-1 text-[17px]">
        <a href="../027/" className="inline-flex min-h-12 items-center">
          ‹ Stil 027
        </a>
        <a href="../../" className="inline-flex min-h-12 items-center">
          Tüm stiller
        </a>
      </p>
    </footer>
  )
}

export default function DecoApp() {
  return (
    <DecoProvider>
      <Tooltip.Provider delayDuration={150}>
        <Tanimlar />
        <Header />
        <main id="icerik" tabIndex={-1} className="overflow-x-clip outline-none">
          <Hero />
          <Karakter />
          <Palet />
          <Yazi />
          <Sekil />
          <Derinlik />
          <Doku />
          <Ikonlar />
          <Rezervasyon />
          <Menu />
          <Mucevher />
          <Koleksiyon />
          <Kulup />
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
    </DecoProvider>
  )
}
