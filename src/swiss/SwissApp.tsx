import { useEffect, useState } from 'react'
import { GridOverlay } from './components/GridOverlay'
import { SiteHeader } from './SiteHeader'
import { useTheme } from '../shared/useTheme'
import { Hero } from './sections/Hero'
import { Principles } from './sections/Principles'
import { Palette } from './sections/Palette'
import { Typography } from './sections/Typography'
import { Grid } from './sections/Grid'
import { Tokens } from './sections/Tokens'
import { Surface } from './sections/Surface'
import { Icons } from './sections/Icons'
import { Components } from './sections/Components'
import { Motion } from './sections/Motion'
import { Application } from './sections/Application'
import { Access } from './sections/Access'
import { Colophon } from './sections/Colophon'

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
}

export default function App() {
  const { theme, toggle } = useTheme('swiss-theme')
  const [overlay, setOverlay] = useState(false)
  const toggleOverlay = () => setOverlay((v) => !v)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'g' || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return
      setOverlay((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a
        href="#icerik"
        className="swiss-label sr-only focus:not-sr-only focus:fixed focus:left-s focus:top-s focus:z-50 focus:bg-accent focus:p-s focus:text-on-accent"
      >
        İçeriğe geç
      </a>
      <SiteHeader overlay={overlay} onToggleOverlay={toggleOverlay} theme={theme} onToggleTheme={toggle} />
      <main id="icerik">
        <Hero />
        <Principles />
        <Palette />
        <Typography />
        <Grid overlay={overlay} onToggleOverlay={toggleOverlay} />
        <Tokens />
        <Surface />
        <Icons />
        <Components />
        <Motion />
        <Application />
        <Access theme={theme} onToggleTheme={toggle} />
      </main>
      <Colophon />
      <GridOverlay visible={overlay} />
    </>
  )
}
