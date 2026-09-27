import { useEffect } from 'react'
import { TermProvider, useTerm } from './lib/store'
import { StatusBar } from './components/StatusBar'
import { CommandPalette } from './components/CommandPalette'
import { Hero } from './sections/Hero'
import { Traits } from './sections/Traits'
import { Palette } from './sections/Palette'
import { Bench } from './sections/Bench'
import { Bios } from './sections/Bios'
import { Server } from './sections/Server'
import { Personal } from './sections/Personal'
import { Motion } from './sections/Motion'
import { Access } from './sections/Access'

/** Ctrl/⌘ + K komut paletini açar/kapatır */
function Kisayol() {
  const { palet, setPalet } = useTerm()
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setPalet(!palet)
      }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [palet, setPalet])
  return null
}

function Duyuru() {
  const { duyuru } = useTerm()
  return (
    <p className="sr-only" role="status" aria-live="polite">
      {duyuru}
    </p>
  )
}

/** CRT açıkken: sabit arayüzün ekrana "yanmış" soluk izi */
function EkranYanigi() {
  return (
    <div className="burn-in pointer-events-none fixed inset-0 z-[65] overflow-hidden opacity-[0.07]" aria-hidden="true">
      <pre className="ascii absolute top-[1lh] right-2 text-fg">{'[012] 1:özellikler 2:renk 3:kıyas 4:bios 5:sunucu\n\n      root@yonetim:~#'}</pre>
      <pre className="ascii absolute bottom-[2lh] left-2 text-fg">{'+----------------------+\n|  SİSTEM HAZIR  [ OK ] |\n+----------------------+'}</pre>
    </div>
  )
}

export default function TermApp() {
  return (
    <TermProvider>
      <Kisayol />
      <Duyuru />
      <a href="#icerik" className="sr-only focus:not-sr-only focus:fixed focus:top-[2lh] focus:left-2 focus:z-[80] focus:bg-sel-bg focus:px-1 focus:font-bold focus:text-sel-fg">
        [içeriğe geç]
      </a>
      <StatusBar />
      <main id="icerik" className="grid-overlay">
        <Hero />
        <Traits />
        <Palette />
        <Bench />
        <Bios />
        <Server />
        <Personal />
        <Motion />
        <Access />
      </main>
      <footer className="mx-auto max-w-[120ch] border-t border-line px-2 py-[1lh] sm:px-4">
        <p className="text-dim">
          stil 012 · <span lang="en">terminal / hacker ui</span> · yazı: JetBrains Mono, Fira Code, Source Code Pro · bileşenler: cmdk, Radix · tokenlar: tokens/term.tokens.json · veriler kurgusaldır
        </p>
        <nav aria-label="Diğer stiller" className="mt-[0.5lh] flex flex-wrap gap-x-2">
          <a href="../../" className="font-bold hover:bg-sel-bg hover:text-sel-fg">
            [tüm stiller]
          </a>
          <a href="../011/" className="font-bold hover:bg-sel-bg hover:text-sel-fg">
            [stil 011]
          </a>
          <a href="#ust" className="font-bold hover:bg-sel-bg hover:text-sel-fg">
            [başa dön]
          </a>
        </nav>
      </footer>
      <CommandPalette />
      <EkranYanigi />
    </TermProvider>
  )
}
