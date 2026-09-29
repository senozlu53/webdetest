import { Tooltip } from 'radix-ui'
import { Duyuru, SketchProvider } from './lib/store'
import { Header } from './components/Header'
import { Ikon } from './components/Icons'
import { CizgiAyrac } from './components/Rough'
import { Hero, Karakter } from './sections/Giris'
import { Palet, Yazi } from './sections/Temel'
import { Sekil } from './sections/Sekil'
import { Doku, Golge, Ikonlar } from './sections/Yuzey'
import { Blog, Menu, Portfolyo } from './sections/Kullanim'
import { Form } from './sections/Form'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Mobil } from './sections/Davranis'

export default function SketchApp() {
  return (
    <SketchProvider>
      <Tooltip.Provider delayDuration={150}>
        {/* Madde 7 · 16: hatching çizgilerine el titremesi veren süzgeç */}
        <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
          <defs>
            <filter id="titrek" x="-4%" y="-4%" width="108%" height="108%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
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
          <Menu />
          <Portfolyo />
          <Blog />
          <Form />
          <Bilesenler />
          <Figma />
          <Css />
          <Hareket />
          <Mobil />
          <Erisim />
        </main>
        <footer className="mx-auto mt-20 w-full max-w-[1200px] px-4 pb-10 md:px-8">
          <CizgiAyrac tohum={77} cizgi={2.4} />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Ikon ad="fincan" boyut={56} />
              <div>
                <p className="font-el text-[42px] leading-none font-bold text-murekkep">Kırık Fincan</p>
                <p className="mt-1 text-[15px] text-soluk">Stil 025 · Hand-drawn / Sketch. Kahveci, menü ve kişiler kurgudur.</p>
              </div>
            </div>
            <p className="flex flex-wrap gap-5">
              <a href="../../">Tüm stiller</a>
              <a href="../024/">Stil 024</a>
            </p>
          </div>
        </footer>
        <Duyuru />
      </Tooltip.Provider>
    </SketchProvider>
  )
}
