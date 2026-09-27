import { ViewProvider } from './lib/view'
import { Header } from './components/Header'
import { Hero } from './sections/Hero'
import { Traits } from './sections/Traits'
import { Palette } from './sections/Palette'
import { Components } from './sections/Components'
import { Figma } from './sections/Figma'
import { Motion } from './sections/Motion'
import { Access } from './sections/Access'

export default function GenApp() {
  return (
    <ViewProvider>
      <a href="#icerik" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-sans focus:font-medium focus:text-on-accent">
        İçeriğe geç
      </a>
      <Header />
      <main id="icerik">
        <Hero />
        <Traits />
        <Palette />
        <Components />
        <Figma />
        <Motion />
        <Access />
      </main>
      <footer className="border-t border-line px-4 py-10 font-sans md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-[14px] md:flex-row md:items-center md:justify-between">
          <p className="max-w-[70ch] text-muted">
            Stil 013 · <span lang="en">Generative UI</span>. Yazı: Inter, Source Serif 4, JetBrains Mono. Tokenlar: <span className="font-mono text-[13px]">tokens/gen.tokens.json</span>. Model çalışmaz; akış ve araç çağrıları kurgudur.
          </p>
          <nav aria-label="Diğer stiller" className="flex shrink-0 gap-4">
            <a href="../../" className="font-medium text-accent-ink underline underline-offset-4">
              Tüm stiller
            </a>
            <a href="../012/" className="font-medium text-accent-ink underline underline-offset-4">
              Stil 012
            </a>
            <a href="#ust" className="font-medium text-accent-ink underline underline-offset-4">
              Başa dön
            </a>
          </nav>
        </div>
      </footer>
    </ViewProvider>
  )
}
