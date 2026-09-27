import { useEffect, useState } from 'react'
import { GridOverlay } from './swiss/components/GridOverlay'
import { SiteHeader } from './swiss/SiteHeader'
import { useTheme } from './swiss/useTheme'
import { Hero } from './swiss/sections/Hero'
import { Principles } from './swiss/sections/Principles'
import { Palette } from './swiss/sections/Palette'
import { Typography } from './swiss/sections/Typography'
import { Grid } from './swiss/sections/Grid'
import { Tokens } from './swiss/sections/Tokens'
import { Surface } from './swiss/sections/Surface'
import { Icons } from './swiss/sections/Icons'
import { Components } from './swiss/sections/Components'
import { Motion } from './swiss/sections/Motion'
import { Application } from './swiss/sections/Application'
import { Access } from './swiss/sections/Access'
import { Colophon } from './swiss/sections/Colophon'

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
}

export default function App() {
  const { theme, toggle } = useTheme()
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
