import { ArcadeProvider, Duyuru } from './lib/store'
import { Header } from './components/Header'
import { CRT } from './components/CRT'
import { ArcadeText } from './components/ArcadeText'
import { Hero, Ozellikler } from './sections/Giris'
import { Golge, Palet, Sekil, Tipografi } from './sections/Temel'
import { Doku, Ikonlar } from './sections/Yuzey'
import { Envanter, OyunBolum, Rpg, Turnuva } from './sections/Alanlar'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Olcek } from './sections/Davranis'

export default function ArcadeApp() {
  return (
    <ArcadeProvider>
      <Header />
      <main id="icerik" tabIndex={-1} className="outline-none">
        <Hero />
        <Ozellikler />
        <Palet />
        <Tipografi />
        <Sekil />
        <Golge />
        <Doku />
        <Ikonlar />
        <Turnuva />
        <OyunBolum />
        <Rpg />
        <Envanter />
        <Bilesenler />
        <Figma />
        <Css />
        <Hareket />
        <Olcek />
        <Erisim />
      </main>
      <footer className="mx-auto mt-16 flex w-full max-w-[calc(var(--u)*400)] flex-wrap items-center justify-between gap-6 px-4 pt-8 pb-16 shadow-[0_calc(var(--u)*-1)_0_0_var(--edge)] md:px-8">
        <div>
          <ArcadeText as="p" boyut="s" ton="sari" lang="en">
            Game over
          </ArcadeText>
          <p className="mt-2 text-muted">
            Stil 021 · <span lang="en">Pixel Art &amp; CRT</span>. Jeton Salonu, Jeton Kupası, takımlar ve oyuncular kurgudur.
          </p>
        </div>
        <p className="flex flex-wrap gap-6 text-body-l">
          <a href="../../">Tüm stiller</a>
          <a href="../020/">Stil 020</a>
        </p>
      </footer>
      <CRT />
      <Duyuru />
    </ArcadeProvider>
  )
}
