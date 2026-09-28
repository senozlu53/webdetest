import { Tooltip } from 'radix-ui'
import { Duyuru, KawaiiProvider } from './lib/store'
import { Header } from './components/Header'
import { Mascot } from './components/Mascot'
import { Hero, Karakter } from './sections/Giris'
import { Golge, Palet, Sekil, Tipografi } from './sections/Temel'
import { Doku, Ikonlar } from './sections/Yuzey'
import { DilDersi, SayiBahcesi } from './sections/Alanlar'
import { Hafiza, Pofuduk } from './sections/Oyunlar'
import { Hatalar, Ilerleme } from './sections/Durumlar'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Mobil } from './sections/Davranis'

export default function KawaiiApp() {
  return (
    <KawaiiProvider>
      <Tooltip.Provider delayDuration={150}>
        <Header />
        <main id="icerik" tabIndex={-1} className="overflow-x-clip outline-none">
          <Hero />
          <Karakter />
          <Palet />
          <Tipografi />
          <Sekil />
          <Golge />
          <Doku />
          <Ikonlar />
          <SayiBahcesi />
          <DilDersi />
          <Hafiza />
          <Pofuduk />
          <Hatalar />
          <Ilerleme />
          <Bilesenler />
          <Figma />
          <Css />
          <Hareket />
          <Mobil />
          <Erisim />
        </main>
        <footer className="mt-20 px-2 pb-4 md:px-4">
          <div className="kabarcik mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-6 py-8 md:px-10">
            <div className="flex items-center gap-4">
              <Mascot ruh="uykulu" renk="rose" boyut={72} />
              <div>
                <p className="font-display text-[34px] font-extrabold">Pamuk</p>
                <p className="text-[15px] text-muted">Stil 024 · Kawaii. Uygulama, maskotlar ve kullanıcılar kurgudur.</p>
              </div>
            </div>
            <p className="flex flex-wrap gap-5">
              <a href="../../">Tüm stiller</a>
              <a href="../023/">Stil 023</a>
            </p>
          </div>
        </footer>
        <Duyuru />
      </Tooltip.Provider>
    </KawaiiProvider>
  )
}
