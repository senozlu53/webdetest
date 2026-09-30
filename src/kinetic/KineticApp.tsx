import { Tooltip } from 'radix-ui'
import { KineticProvider, Duyuru } from './lib/store'
import { KaymaProvider } from './lib/kayma'
import { Header } from './components/Header'
import { MarqueeText } from './components/MarqueeText'
import { KENAR } from './components/ui'
import { Hero, Stil } from './sections/Giris'
import { Alanlar } from './sections/Alanlar'
import { Erisim, Hareket, Mobil } from './sections/Davranis'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Derinlik, Ikon, Renk, Sekil, Yazi, Yuzey } from './sections/Temel'

function Footer() {
  return (
    <footer className="pt-[var(--bolum)]">
      <MarqueeText metin="STİL 034 — DEVİNİM — DURDUR VE OKU —" ayirac="" hiz={90} className="dev border-y border-hat py-3 text-[clamp(40px,9vw,140px)]" ad="alt-serit" />
      <div className={`${KENAR} flex flex-wrap items-center justify-between gap-6 py-10`}>
        <p className="dev text-[28px]">Devinim</p>
        <p className="flex flex-wrap gap-x-8 gap-y-2 text-[16px]">
          <a href="../033/" className="inline-flex min-h-12 items-center">
            Stil 033
          </a>
          <a href="../../" className="inline-flex min-h-12 items-center">
            Tüm stiller
          </a>
        </p>
      </div>
    </footer>
  )
}

export default function KineticApp() {
  return (
    <KineticProvider>
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
            <Ikon />
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
    </KineticProvider>
  )
}
