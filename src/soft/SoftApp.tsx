import { useTheme } from '../shared/useTheme'
import { SoftHeader } from './SoftHeader'
import { Hero } from './sections/Hero'
import { Principles } from './sections/Principles'
import { Palette } from './sections/Palette'
import { Typography } from './sections/Typography'
import { Surface } from './sections/Surface'
import { Icons } from './sections/Icons'
import { Components } from './sections/Components'
import { Tokens } from './sections/Tokens'
import { Motion } from './sections/Motion'
import { Application } from './sections/Application'
import { Access } from './sections/Access'
import { Footer } from './sections/Footer'

export default function SoftApp() {
  const { theme, toggle } = useTheme('soft-theme')

  return (
    <div className="soft-grain">
      <a
        href="#icerik"
        className="sr-only rounded-pill focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-ink focus:px-5 focus:py-3 focus:text-canvas"
      >
        İçeriğe geç
      </a>
      <SoftHeader theme={theme} onToggleTheme={toggle} />
      <main id="icerik">
        <Hero />
        <Principles />
        <Palette />
        <Typography />
        <Surface />
        <Icons />
        <Components />
        <Tokens />
        <Motion />
        <Application />
        <Access theme={theme} onToggleTheme={toggle} />
      </main>
      <Footer />
    </div>
  )
}
