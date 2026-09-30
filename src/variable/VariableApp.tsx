import { Tooltip } from 'radix-ui'
import { VariableProvider, Duyuru } from './lib/store'
import { KaymaProvider } from './lib/kayma'
import { Header } from './components/Header'
import { KENAR } from './components/ui'
import { Degisken } from './components/Degisken'
import { Alanlar } from './sections/Alanlar'
import { Erisim, Hareket, Mobil } from './sections/Davranis'
import { Hero, Stil } from './sections/Giris'
import { Derinlik, Renk, Sekil, Simge, Yazi, Yuzey } from './sections/Temel'
import { Bilesenler, Css, Figma } from './sections/Uretim'

function Footer() {
  return (
    <footer className="pt-[var(--bolum)]">
      <div className={`${KENAR} pb-6`}>
        <Degisken metin="Büküm" boy="clamp(80px, 30vw, 420px)" k={0.66} ad="alt" />
      </div>
      <div className={`${KENAR} flex flex-wrap items-center justify-between gap-6 border-t border-hat py-10`}>
        <p className="kicker">Stil 035 · Experimental &amp; Variable Typography</p>
        <p className="flex flex-wrap gap-x-8 gap-y-2 text-[16px]">
          <a href="../034/" className="inline-flex min-h-12 items-center">
            Stil 034
          </a>
          <a href="../../" className="inline-flex min-h-12 items-center">
            Tüm stiller
          </a>
        </p>
      </div>
    </footer>
  )
}

export default function VariableApp() {
  return (
    <VariableProvider>
      <KaymaProvider>
        <Tooltip.Provider delayDuration={150}>
          <Header />
          <main id="icerik" tabIndex={-1} className="overflow-x-clip outline-none">
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
          <Duyuru />
        </Tooltip.Provider>
      </KaymaProvider>
    </VariableProvider>
  )
}
