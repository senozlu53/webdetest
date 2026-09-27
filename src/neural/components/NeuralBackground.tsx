import { useEffect, useRef } from 'react'
import { useNeural } from '../lib/store'
import { rng } from '../lib/rand'

interface Mote {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  tw: number
}

/**
 * Madde 8: arka planda yavaşça kayan dijital toz ve ızgara.
 * Üç derinlik katmanı: uzaktaki toz küçük, soluk ve yavaş; yakındaki büyük ve hızlı (Madde 7).
 * Kaydırınca katmanlar farklı hızda kayar. Sade efekt ya da yüksek kontrastta toz çizilmez.
 */
export function NeuralBackground() {
  const { fx, contrast, motion } = useNeural()
  const canvas = useRef<HTMLCanvasElement>(null)
  const on = fx === 'tam' && contrast === 'normal'

  useEffect(() => {
    const c = canvas.current
    if (!c || !on) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const r = rng(7)
    let motes: Mote[] = []
    let w = 0
    let h = 0
    let raf = 0
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
      c.style.width = `${w}px`
      c.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.min(150, Math.round((w * h) / 9000))
      motes = Array.from({ length: n }, () => {
        const z = r()
        return { x: r() * w, y: r() * h, z, vx: (r() - 0.5) * (0.04 + z * 0.12), vy: -(0.02 + z * 0.1), tw: r() * Math.PI * 2 }
      })
    }
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const sy = window.scrollY
      for (const m of motes) {
        if (motion) {
          m.x += m.vx
          m.y += m.vy
          if (m.y < -4) m.y = h + 4
          if (m.x < -4) m.x = w + 4
          if (m.x > w + 4) m.x = -4
        }
        // Paralaks: yakın toz kaydırmayla daha çok kayar
        const py = (((m.y - sy * (0.04 + m.z * 0.16)) % h) + h) % h
        const a = (0.12 + m.z * 0.5) * (motion ? 0.75 + 0.25 * Math.sin(t / 1400 + m.tw) : 1)
        const size = 0.5 + m.z * 1.5
        ctx.fillStyle = m.z > 0.7 ? `rgba(167,139,250,${a})` : `rgba(147,197,253,${a * 0.8})`
        ctx.beginPath()
        ctx.arc(m.x, py, size, 0, Math.PI * 2)
        ctx.fill()
      }
      if (motion) raf = requestAnimationFrame(draw)
    }
    const onScroll = () => {
      if (!motion) draw(0)
    }
    resize()
    draw(0)
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [on, motion])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_15%_0%,rgb(59_130_246/0.14),transparent_70%),radial-gradient(ellipse_60%_45%_at_90%_10%,rgb(139_92_246/0.14),transparent_70%)]" />
      <div className="grid-bg absolute inset-0" />
      {on ? <canvas ref={canvas} className="fx-only absolute inset-0" /> : null}
    </div>
  )
}
