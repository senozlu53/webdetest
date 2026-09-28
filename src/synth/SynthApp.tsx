import { Duyuru, SynthProvider } from './lib/store'
import { Header } from './components/Header'
import { Hero, Karakter } from './sections/Giris'
import { Golge, Palet, Sekil, Tipografi } from './sections/Temel'
import { Ikonlar, Vhs } from './sections/Yuzey'
import { Galeri, Portfolyo, Salon, Studyo } from './sections/Alanlar'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Mobil } from './sections/Davranis'

export default function SynthApp() {
  return (
    <SynthProvider>
      <Header />
      <main id="icerik" tabIndex={-1} className="outline-none">
        <Hero />
        <Karakter />
        <Palet />
        <Tipografi />
        <Sekil />
        <Golge />
        <Vhs />
        <Ikonlar />
        <Studyo />
        <Salon />
        <Galeri />
        <Portfolyo />
        <Bilesenler />
        <Figma />
        <Css />
        <Hareket />
        <Mobil />
        <Erisim />
      </main>
      <footer className="mt-20 border-t-2 border-pink bg-[#0d0418] shadow-[0_0_var(--g3)_rgb(255_0_255/0.5)]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-4 py-12 md:px-8">
          <div>
            <p className="script text-[44px]">Neon 84</p>
            <p className="mt-1 text-[14px] text-muted">
              Stil 023 · <span lang="en">Synthwave</span>. Stüdyo, oyunlar, sanatçılar ve eserler kurgudur.
            </p>
          </div>
          <p className="flex flex-wrap gap-5">
            <a href="../../">Tüm stiller</a>
            <a href="../022/">Stil 022</a>
          </p>
        </div>
      </footer>
      <div className="vhs" aria-hidden="true" data-vhs-katman="" />
      <Duyuru />
    </SynthProvider>
  )
}
