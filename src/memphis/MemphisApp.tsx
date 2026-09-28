import { Duyuru, MemphisProvider } from './lib/store'
import { Header } from './components/Header'
import { KonfetiKatmani } from './components/KonfetiKatmani'
import { Sekil } from './components/Shapes'
import { Hero, Karakter } from './sections/Giris'
import { Golge, Palet, SekilDili, Tipografi } from './sections/Temel'
import { Doku, Ikonlar } from './sections/Yuzey'
import { Ajans, Cark, Festival, Okul } from './sections/Alanlar'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Mobil } from './sections/Davranis'

/** Madde 18: renk körlüğü süzgeçleri (Machado, Oliveira, Fernandes 2009; şiddet 1,0), doğrusal RGB'de */
function CvdFiltreleri() {
  const m = {
    protan: '0.152286 1.052583 -0.204868 0 0 0.114503 0.786281 0.099216 0 0 -0.003882 -0.048116 1.051998 0 0 0 0 0 1 0',
    deutan: '0.367322 0.860646 -0.227968 0 0 0.280085 0.672501 0.047413 0 0 -0.011820 0.042940 0.968881 0 0 0 0 0 1 0',
    tritan: '1.255528 -0.076749 -0.178779 0 0 -0.078411 0.930809 0.147602 0 0 0.004733 0.691367 0.303900 0 0 0 0 0 1 0',
    akromat: '0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0',
  }
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      {Object.entries(m).map(([k, v]) => (
        <filter key={k} id={`cvd-${k}`} colorInterpolationFilters="linearRGB">
          <feColorMatrix type="matrix" values={v} />
        </filter>
      ))}
    </svg>
  )
}

export default function MemphisApp() {
  return (
    <MemphisProvider>
      <CvdFiltreleri />
      <Header />
      <main id="icerik" tabIndex={-1} className="outline-none">
        <Hero />
        <Karakter />
        <Palet />
        <Tipografi />
        <SekilDili />
        <Golge />
        <Doku />
        <Ikonlar />
        <Ajans />
        <Festival />
        <Okul />
        <Cark />
        <Bilesenler />
        <Figma />
        <Css />
        <Hareket />
        <Mobil />
        <Erisim />
      </main>
      <footer className="relative mt-20 overflow-hidden border-t-[4px] border-ink bg-yellow">
        <div className="halftone pointer-events-none absolute inset-y-0 right-0 w-1/3 [--dot-color:var(--ink)] max-md:hidden" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-4 py-12 md:px-8">
          <div className="flex items-center gap-4">
            <Sekil tur="ucgen" ton="pembe" boyut={56} golge />
            <div>
              <p className="dev text-[34px]">Konfeti Kolektif</p>
              <p className="font-bold">
                Stil 022 · <span lang="en">Memphis Design</span>. Kolektif, festival, okul ve işler kurgudur.
              </p>
            </div>
          </div>
          <p className="flex flex-wrap gap-3 rounded-full border-[4px] border-ink bg-paper px-5 py-2 font-extrabold">
            <a href="../../">Tüm stiller</a>
            <a href="../021/">Stil 021</a>
          </p>
        </div>
      </footer>
      <KonfetiKatmani />
      <Duyuru />
    </MemphisProvider>
  )
}
