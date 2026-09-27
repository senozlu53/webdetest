import { useEffect } from 'react'
import { useTheme } from '../shared/useTheme'
import { useView } from './hooks/useView'
import { HoloProvider, useHolo } from './lib/store'
import { HoloNav } from './components/HoloNav'
import { CommandCenter } from './components/CommandCenter'
import { Hero } from './sections/Hero'
import { Traits } from './sections/Traits'
import { Palette } from './sections/Palette'
import { Pipeline } from './sections/Pipeline'
import { Models } from './sections/Models'
import { Network } from './sections/Network'
import { Viewer } from './sections/Viewer'
import { Motion } from './sections/Motion'
import { Access } from './sections/Access'

/** Ctrl/⌘ + K her yerde, "/" yalnız yazı alanı dışında komut merkezini açar */
function Shortcuts() {
  const { setCommandOpen, commandOpen } = useHolo()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      const typing = t.closest('input, textarea, select, [contenteditable="true"]')
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen(!commandOpen)
      } else if (e.key === '/' && !typing && !commandOpen) {
        e.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setCommandOpen, commandOpen])
  return null
}

function Announcer() {
  const { announce } = useHolo()
  return (
    <p className="sr-only" role="status" aria-live="polite">
      {announce}
    </p>
  )
}

export default function HoloApp() {
  const { theme, toggle } = useTheme('holo-theme')
  const v = useView()
  const view = {
    theme,
    toggleTheme: toggle,
    layers: v.layers,
    layersPref: v.layersPref,
    setLayersPref: v.setLayersPref,
    motion: v.motion,
    motionPref: v.motionPref,
    setMotionPref: v.setMotionPref,
  }
  return (
    <HoloProvider view={view}>
      <Shortcuts />
      <Announcer />
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:px-5 focus:py-3 focus:font-tech focus:font-semibold focus:text-on-accent focus:[background:var(--accent-grad)]"
      >
        İçeriğe geç
      </a>
      <HoloNav />
      <main id="icerik">
        <Hero />
        <Traits />
        <Palette />
        <Pipeline />
        <Models />
        <Network />
        <Viewer />
        <Motion layersReason={v.layersReason} motionReason={v.motionReason} />
        <Access />
      </main>
      <CommandCenter />
      <footer className="border-t border-line-soft px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-[14px] md:flex-row md:items-center md:justify-between">
          <p className="max-w-[70ch] text-muted">
            Stil 011 · <span lang="en">Holographic</span>. Yazı: Audiowide, Exo 2, Chakra Petch, IBM Plex Mono. Bileşenler: cmdk, Radix, TanStack Table. Tokenlar:{' '}
            <span className="font-mono">tokens/holo.tokens.json</span>. Modeller, ölçümler ve ağ değerleri kurgusaldır.
          </p>
          <nav aria-label="Diğer stiller" className="flex shrink-0 flex-wrap gap-4 font-tech font-semibold">
            <a href="../../" className="text-cyan-text underline underline-offset-4">
              Tüm stiller
            </a>
            <a href="../010/" className="text-cyan-text underline underline-offset-4">
              Stil 010
            </a>
            <a href="#ust" className="text-cyan-text underline underline-offset-4">
              Başa dön
            </a>
          </nav>
        </div>
      </footer>
    </HoloProvider>
  )
}
