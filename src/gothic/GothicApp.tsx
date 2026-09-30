import { Ayrac } from './components/Bolum'
import { Header } from './components/Header'
import { Duyuru, GothicProvider } from './lib/store'
import { Alanlar } from './sections/Alanlar'
import { Erisim, Hareket, Mobil } from './sections/Davranis'
import { Hero, Stil } from './sections/Giris'
import { Derinlik, Renk, Sekil, Simge, Yazi, Yuzey } from './sections/Temel'
import { Bilesenler, Css, Figma } from './sections/Uretim'

function Footer() {
  return (
    <footer className="pt-[var(--bolum)] pb-12">
      <div className="kap">
        <Ayrac tam />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
          <p className="t-etiket t-soluk md:col-span-3">Kuzgun Kapısı Atölyesi · Ağıt Manastırı</p>
          <p className="t-alt md:col-span-6">Bu sayfa kurgusal bir korku oyunu stüdyosunun arayüz referansıdır; stüdyo, oyun, kitap, karakter ve ürün adları gerçek değildir. Yazı: Pirata One, Grenze Gotisch, Spectral ve Cormorant.</p>
          <p className="flex flex-wrap gap-x-8 gap-y-1 md:col-span-3">
            <a href="../038/" className="inline-flex min-h-12 items-center">
              Stil 038
            </a>
            <a href="../../" className="inline-flex min-h-12 items-center">
              Tüm stiller
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function GothicApp() {
  return (
    <GothicProvider>
      <Header />
      <main id="icerik" tabIndex={-1} className="outline-none">
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
    </GothicProvider>
  )
}
