import { NeuralProvider, LiveRegions } from './lib/store'
import { NeuralBackground } from './components/NeuralBackground'
import { Header } from './components/Header'
import { IconBrain } from './components/Icons'
import { Hero } from './sections/Hero'
import { Traits } from './sections/Traits'
import { Palette } from './sections/Palette'
import { Agent } from './sections/Agent'
import { Training } from './sections/Training'
import { Dataset } from './sections/Dataset'
import { Build } from './sections/Build'
import { Motion } from './sections/Motion'
import { Access } from './sections/Access'

export default function NeuralApp() {
  return (
    <NeuralProvider>
      <NeuralBackground />
      <div id="ust" className="relative z-[1] min-h-screen">
        <Header />
        <main id="icerik" tabIndex={-1} className="outline-none">
          <Hero />
          <Traits />
          <Palette />
          <Agent />
          <Training />
          <Dataset />
          <Build />
          <Motion />
          <Access />
        </main>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-[14px] text-muted md:px-8">
            <p className="flex items-start gap-2">
              <IconBrain size={18} className="mt-0.5 shrink-0 text-violet" />
              <span>
                Stil 015 · <span lang="en">Neural Aesthetic</span>. Modeller, görevler ve eğitim verisi kurgudur.
              </span>
            </p>
            <p>
              <a href="../../" className="text-blue underline underline-offset-2">
                Tüm stiller
              </a>{' '}
              ·{' '}
              <a href="../014/" className="text-blue underline underline-offset-2">
                Stil 014
              </a>
            </p>
          </div>
        </footer>
      </div>
      <LiveRegions />
    </NeuralProvider>
  )
}
