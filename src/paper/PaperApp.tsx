import { Tooltip } from 'radix-ui'
import { Duyuru, PaperProvider } from './lib/store'
import { Header } from './components/Header'
import { Kesik } from './components/Kesik'
import { PaperCard } from './components/Paper'
import { Hero, Karakter } from './sections/Giris'
import { Palet, Yazi } from './sections/Temel'
import { Doku, Golge, Ikonlar, Sekil } from './sections/Yuzey'
import { Dukkan, Hikaye } from './sections/Kullanim'
import { Form } from './sections/Form'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Mobil } from './sections/Davranis'

export default function PaperApp() {
  return (
    <PaperProvider>
      <Tooltip.Provider delayDuration={150}>
        <Header />
        <main id="icerik" tabIndex={-1} className="overflow-x-clip outline-none">
          <Hero />
          <Karakter />
          <Palet />
          <Yazi />
          <Sekil />
          <Golge />
          <Doku />
          <Ikonlar />
          <Hikaye />
          <Dukkan />
          <Form />
          <Bilesenler />
          <Figma />
          <Css />
          <Hareket />
          <Mobil />
          <Erisim />
        </main>
        <footer className="mx-auto mt-6 w-full max-w-[1240px] px-3 pb-10 md:px-6">
          <PaperCard nivel={4} duz tohum={90} r={24} dalga={4} yuzClass="flex flex-wrap items-center justify-between gap-6 px-6 py-7 md:px-10">
            <div className="flex items-center gap-4">
              <Kesik ad="agac" boyut={56} nivel={2} />
              <div>
                <p className="font-baslik text-[34px] leading-none">Kâğıt Orman</p>
                <p className="mt-1 text-[15px] font-medium text-soluk">Stil 026 · Paper Cut. Marka, kitap ve ürünler kurgudur.</p>
              </div>
            </div>
            <p className="flex flex-wrap gap-5">
              <a href="../../">Tüm stiller</a>
              <a href="../025/">Stil 025</a>
            </p>
          </PaperCard>
        </footer>
        <Duyuru />
      </Tooltip.Provider>
    </PaperProvider>
  )
}
