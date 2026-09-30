import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFantasy } from './store'

interface Parca {
  x: number
  y: number
  vx: number
  vy: number
  t: number
  omur: number
  boy: number
  a: number
  av: number
  renk: string
  sekil: 0 | 1
}

/** yaldız ayarları (Hareket bölümünde oynatılır) */
export const yaldizAyar = { adet: 10, yercekimi: 900, hiz: 1 }
/** canlı sayaçlar (hareket bütçesi) */
export const yaldizDurum = { canli: 0, toplam: 0, patlama: 0 }

const RENKLER = ['#fff3b0', '#f2dc8b', '#d4af37', '#e6c55a', '#ffe9a0', '#b8912a']

interface Ctx {
  patlat: (x: number, y: number, adet?: number) => void
}
const C = createContext<Ctx>({ patlat: () => {} })

/**
 * Altın yaldız parçacıkları (Madde 16): tıklama noktasından saçılan küçük elmas ve yıldız parçaları.
 * Tek bir tuval, yalnız parça varken çizer. Hareket ya da parçacık kapalıyken hiç çalışmaz.
 */
export function YaldizSaglayici({ children }: { children: ReactNode }) {
  const { yaldizRef } = useFantasy()
  const tuval = useRef<HTMLCanvasElement>(null)
  const parcalar = useRef<Parca[]>([])
  const kare = useRef(0)
  const son = useRef(0)

  const boyutla = useCallback(() => {
    const c = tuval.current
    if (!c) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = Math.round(window.innerWidth * dpr)
    c.height = Math.round(window.innerHeight * dpr)
    c.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
  }, [])
  useEffect(() => {
    boyutla()
    window.addEventListener('resize', boyutla)
    return () => window.removeEventListener('resize', boyutla)
  }, [boyutla])

  const ciz = useCallback((now: number) => {
    const c = tuval.current
    const g = c?.getContext('2d')
    if (!c || !g) return
    const dt = Math.min(0.05, (now - son.current) / 1000 || 0.016)
    son.current = now
    g.clearRect(0, 0, window.innerWidth, window.innerHeight)
    const liste = parcalar.current
    for (let i = liste.length - 1; i >= 0; i--) {
      const p = liste[i]
      p.t += dt
      if (p.t >= p.omur) {
        liste.splice(i, 1)
        continue
      }
      p.vy += yaldizAyar.yercekimi * dt
      p.vx *= 0.985
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.a += p.av * dt
      const u = p.t / p.omur
      g.save()
      g.globalAlpha = Math.max(0, 1 - u * u)
      g.translate(p.x, p.y)
      g.rotate(p.a)
      g.fillStyle = p.renk
      g.beginPath()
      if (p.sekil === 0) {
        g.moveTo(0, -p.boy)
        g.lineTo(p.boy * 0.6, 0)
        g.lineTo(0, p.boy)
        g.lineTo(-p.boy * 0.6, 0)
      } else {
        const r = p.boy
        g.moveTo(0, -r)
        g.quadraticCurveTo(r * 0.15, -r * 0.15, r, 0)
        g.quadraticCurveTo(r * 0.15, r * 0.15, 0, r)
        g.quadraticCurveTo(-r * 0.15, r * 0.15, -r, 0)
        g.quadraticCurveTo(-r * 0.15, -r * 0.15, 0, -r)
      }
      g.closePath()
      g.fill()
      g.restore()
    }
    yaldizDurum.canli = liste.length
    if (liste.length) kare.current = requestAnimationFrame(ciz)
    else {
      kare.current = 0
      g.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }, [])

  const patlat = useCallback(
    (x: number, y: number, adet?: number) => {
      if (!yaldizRef.current) return
      const n = adet ?? yaldizAyar.adet
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const v = (80 + Math.random() * 260) * yaldizAyar.hiz
        parcalar.current.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 140, t: 0, omur: 0.55 + Math.random() * 0.6, boy: 2.5 + Math.random() * 4, a: Math.random() * 6, av: (Math.random() - 0.5) * 12, renk: RENKLER[i % RENKLER.length], sekil: i % 3 === 0 ? 1 : 0 })
      }
      if (parcalar.current.length > 240) parcalar.current.splice(0, parcalar.current.length - 240)
      yaldizDurum.toplam += n
      yaldizDurum.patlama++
      yaldizDurum.canli = parcalar.current.length
      if (!kare.current) {
        son.current = performance.now()
        kare.current = requestAnimationFrame(ciz)
      }
    },
    [ciz, yaldizRef],
  )

  // etkileşimli her öğede tıklama noktasından küçük bir patlama; klavye tıklamasında öğenin merkezinden
  useEffect(() => {
    const dinle = (e: MouseEvent) => {
      if (!yaldizRef.current) return
      const t = (e.target as Element | null)?.closest?.('button, a[href], [role="button"], [role="switch"], label.cip, [role="tab"]') as HTMLElement | null
      if (!t || (t as HTMLButtonElement).disabled || t.closest('[data-sessiz]')) return
      let x = e.clientX
      let y = e.clientY
      if (!x && !y) {
        const r = t.getBoundingClientRect()
        x = r.left + r.width / 2
        y = r.top + r.height / 2
      }
      patlat(x, y, Math.max(6, Math.round(yaldizAyar.adet * 0.7)))
    }
    document.addEventListener('click', dinle)
    return () => document.removeEventListener('click', dinle)
  }, [patlat, yaldizRef])
  useEffect(() => () => cancelAnimationFrame(kare.current), [])

  const value = useMemo(() => ({ patlat }), [patlat])
  return (
    <C.Provider value={value}>
      {children}
      <canvas ref={tuval} className="yaldiz-tuval" aria-hidden="true" data-yaldiz="" />
    </C.Provider>
  )
}

export function useYaldiz() {
  return useContext(C)
}
