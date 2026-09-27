import { useTheme } from '../shared/useTheme'
import { useFx } from './hooks/useFx'
import { CyberNav } from './components/CyberNav'
import { Hero } from './sections/Hero'
import { Traits } from './sections/Traits'
import { Palette } from './sections/Palette'
import { Components } from './sections/Components'
import { Hud } from './sections/Hud'
import { Motion } from './sections/Motion'
import { Access } from './sections/Access'

export default function CyberApp() {
  const { theme, toggle } = useTheme('cyber-theme')
  const fx = useFx()
  const dark = theme === 'dark'
  return (
    <>
      {/* Madde 8 · 16: sayfa üstü tarama çizgileri, gürültü ve süzülen tarama bandı */}
      <div aria-hidden="true" className="scanlines pointer-events-none fixed inset-0 z-50" />
      <div aria-hidden="true" className="noise pointer-events-none fixed inset-0 z-50" />
      <div aria-hidden="true" className="scan-beam z-50" />
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-cyan focus:px-4 focus:py-3 focus:font-bold focus:text-on-cyan"
      >
        İçeriğe geç
      </a>
      <CyberNav dark={dark} onTheme={toggle} fx={fx.pref} onFx={fx.setPref} />
      <main id="icerik">
        <Hero />
        <Traits />
        <Palette />
        <Components />
        <Hud />
        <Motion fx={fx.fx} pref={fx.pref} onPref={fx.setPref} reason={fx.reason} />
        <Access />
      </main>
      <footer className="border-t border-line px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-[14px] md:flex-row md:items-center md:justify-between">
          <p className="text-muted">
            Stil 010 · <span lang="en">Cyberpunk</span>. Yazı: Rajdhani, Orbitron, Space Grotesk, IBM Plex Mono. İkonlar: HUD SVG. Tokenlar:{' '}
            <span className="font-mono">tokens/cyber.tokens.json</span>. Terminal ve hedefler kurgusaldır.
          </p>
          <nav aria-label="Diğer stiller" className="flex shrink-0 flex-wrap gap-4 font-display font-bold tracking-[0.1em] uppercase">
            <a href="../../" className="text-cyan underline underline-offset-4">
              Tüm stiller
            </a>
            <a href="../009/" className="text-cyan underline underline-offset-4">
              Stil 009
            </a>
            <a href="#ust" className="text-cyan underline underline-offset-4">
              Başa dön
            </a>
          </nav>
        </div>
      </footer>
    </>
  )
}
