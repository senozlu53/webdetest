import { Tooltip } from 'radix-ui'
import { QuietProvider, Duyuru } from './lib/store'
import { Header } from './components/Header'
import { Ikon } from './components/Ikon'
import { Hero, Karakter } from './sections/Giris'
import { Derinlik, Doku, Ikonlar, Palet, Sekil, Yazi } from './sections/Temel'
import { Dergi, Galeri, Koleksiyon, Magaza, Mimari, Otel } from './sections/Uygulamalar'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Mobil } from './sections/Davranis'

function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1320px] border-t border-[var(--cizgi)] px-5 pb-16 sm:px-8 lg:px-12" style={{ paddingTop: 'var(--aralik)' }}>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
        <div>
          <p className="font-sans text-[15px] font-medium tracking-[0.42em] uppercase">Ardıç</p>
          <p className="kicker mt-1">
            Stil 029 · <span lang="en">Quiet Luxury</span>
          </p>
        </div>
        <p className="flex flex-wrap gap-x-10 gap-y-1 text-[15px]">
          <a href="../028/" className="inline-flex min-h-12 items-center gap-2">
            <Ikon ad="geri" boyut={16} /> Stil 028
          </a>
          <a href="../../" className="inline-flex min-h-12 items-center">
            Tüm stiller
          </a>
        </p>
      </div>
    </footer>
  )
}

export default function QuietApp() {
  return (
    <QuietProvider>
      <Tooltip.Provider delayDuration={150}>
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
          <Galeri />
          <Mimari />
          <Koleksiyon />
          <Otel />
          <Magaza />
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
    </QuietProvider>
  )
}
