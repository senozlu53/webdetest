import { Duyuru, Y2KProvider } from './lib/store'
import { Header } from './components/Header'
import { Popups } from './components/Popups'
import { Marquee } from './components/Marquee'
import { Badge } from './components/Badge'
import { Hero, Palette, Traits, Type } from './sections/Temel'
import { Iconography, Surface } from './sections/Yuzey'
import { Music, Portfolio, Shop } from './sections/Alanlar'
import { Components, Figma, Gradient } from './sections/Uretim'
import { Access, Motion, Responsive } from './sections/Davranis'

export default function Y2KApp() {
  return (
    <Y2KProvider>
      <Header />
      <main id="icerik" tabIndex={-1} className="outline-none">
        <Hero />
        <Traits />
        <Palette />
        <Type />
        <Surface />
        <Iconography />
        <Music />
        <Shop />
        <Portfolio />
        <Components />
        <Figma />
        <Gradient />
        <Motion />
        <Responsive />
        <Access />
      </main>
      <footer className="mt-10">
        <Marquee label="Kapanış şeridi" hiz={50} ters items={['Milenyum FM', 'Gelecek parlak', 'Her şey krom', 'Stil 019 · Y2K']} />
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-4 py-10 md:px-8">
          <p className="text-[15px]">
            Stil 019 · <span lang="en">Y2K Millennium Aesthetic</span>. Milenyum FM, Sakız mağazası ve Elmas kurgudur.
          </p>
          <p className="flex flex-wrap items-center gap-3 text-[15px] font-semibold">
            <Badge ton="icy">Y2K uyumlu</Badge>
            <a href="../../" className="underline underline-offset-4">
              Tüm stiller
            </a>
            <a href="../018/" className="underline underline-offset-4">
              Stil 018
            </a>
          </p>
        </div>
      </footer>
      <Popups />
      <Duyuru />
    </Y2KProvider>
  )
}
