import { useEffect, useRef } from 'react'
import { useInView } from '../hooks/useInView'
import { useHolo } from '../lib/store'

type Node = { x: number; y: number; vx: number; vy: number; r: number; blue: boolean }

/**
 * Uçuşan veri parçacıkları (Madde 2 · 16): yavaş sürüklenen düğümler, yakın olanlar arasında ince
 * bağlar ve bağlar üzerinde akan veri paketleri. Tekil katman modunda düğüm sayısı üçte birine iner.
 */
export function Particles({ className }: { className?: string }) {
  const { motion, theme, layers } = useHolo()
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const visible = useInView(wrap, '0px')

  useEffect(() => {
    const el = wrap.current
    const c = canvas.current
    if (!el || !c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const cs = getComputedStyle(el)
    const cyan = cs.getPropertyValue('--cyan-text').trim()
    const blue = cs.getPropertyValue('--blue-text').trim()
    let w = 0
    let h = 0
    let nodes: Node[] = []
    let packets: { a: number; b: number; t: number; v: number }[] = []
    let seed = 7
    const rnd = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    const build = () => {
      const r = el.getBoundingClientRect()
      w = r.width
      h = r.height
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.min(90, Math.round((w * h) / 15000)) / (layers === 'tekil' ? 3 : 1)
      nodes = Array.from({ length: Math.max(12, Math.round(n)) }, () => ({
        x: rnd() * w,
        y: rnd() * h,
        vx: (rnd() - 0.5) * 16,
        vy: (rnd() - 0.5) * 12,
        r: 0.8 + rnd() * 1.6,
        blue: rnd() < 0.3,
      }))
      packets = []
    }
    const LINK = 130
    const frame = (dt: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of nodes) {
        p.x += p.vx * dt
        p.y += p.vy * dt
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20
      }
      ctx.lineWidth = 0.7
      ctx.strokeStyle = cyan
      const links: [number, number][] = []
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
          if (d < LINK) {
            ctx.globalAlpha = (1 - d / LINK) * 0.35
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
            links.push([i, j])
          }
        }
      // Veri paketleri bağlar boyunca akar
      if (dt > 0 && links.length && packets.length < 10 && rnd() < 0.06) {
        const [a, b] = links[Math.floor(rnd() * links.length)]
        packets.push({ a, b, t: 0, v: 0.5 + rnd() * 0.7 })
      }
      packets = packets.filter((k) => (k.t += k.v * dt) < 1)
      ctx.fillStyle = cyan
      for (const k of packets) {
        const A = nodes[k.a]
        const B = nodes[k.b]
        ctx.globalAlpha = Math.sin(k.t * Math.PI)
        ctx.beginPath()
        ctx.arc(A.x + (B.x - A.x) * k.t, A.y + (B.y - A.y) * k.t, 1.8, 0, Math.PI * 2)
        ctx.fill()
      }
      for (const p of nodes) {
        ctx.globalAlpha = 0.75
        ctx.fillStyle = p.blue ? blue : cyan
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    build()
    frame(0)
    const ro = new ResizeObserver(() => {
      build()
      frame(0)
    })
    ro.observe(el)
    if (motion !== 'acik' || !visible) return () => ro.disconnect()
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      frame(Math.min(0.05, (now - last) / 1000))
      last = now
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [motion, theme, layers, visible])

  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
