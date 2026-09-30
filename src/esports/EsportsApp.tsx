import { Header } from './components/Header'
import { Ayrac } from './components/Kart'
import { SkorSeridi } from './components/Serit'
import { Duyuru, EsportsProvider } from './lib/store'
import { Alanlar } from './sections/Alanlar'
import { Erisim, Hareket, Mobil } from './sections/Davranis'
import { Hero, Stil } from './sections/Giris'
import { Derinlik, Renk, Sekil, Simge, Yazi, Yuzey } from './sections/Temel'
import { Bilesenler, Css, Figma } from './sections/Uretim'

function Footer() {
  return (
    <footer className="pt-[var(--bolum)] pb-12">
      <div className="kap">
        <Ayrac />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
          <p className="t-etiket t-soluk md:col-span-3">Vektör-9 · Vektör Kupası</p>
          <p className="t-alt md:col-span-6">Bu sayfa kurgusal bir e-spor organizasyonunun arayüz referansıdır; takım, oyuncu, oyun ve ürün adları gerçek değildir. Yazı: Anybody, Rajdhani ve Orbitron.</p>
          <p className="flex flex-wrap gap-x-8 gap-y-1 md:col-span-3">
            <a href="../037/" className="inline-flex min-h-12 items-center">
              Stil 037
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

export default function EsportsApp() {
  return (
    <EsportsProvider>
      <Header />
      <main id="icerik" tabIndex={-1} className="outline-none">
        <Hero />
        <SkorSeridi />
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
    </EsportsProvider>
  )
}
