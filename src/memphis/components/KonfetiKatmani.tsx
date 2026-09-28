import { useEffect, useRef } from 'react'

const RENK = ['#ffd166', '#06d6a0', '#ef476f', '#ffffff']

/** Tıklama noktasından konfeti saçar. Hareket kapalıysa hiçbir şey yapmaz */
export function konfetiPatlat(x: number, y: number) {
  window.dispatchEvent(new CustomEvent('konfeti', { detail: { x, y } }))
}

/**
 * Madde 8 · 16: konfeti katmanı. Parçalar Web Animations API ile yayılır: önce hızla dışa, sonra yerçekimiyle düşer.
 * Katman tıklamayı geçirir ve ekran okuyucudan gizlidir.
 */
export function KonfetiKatmani() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const f = (e: Event) => {
      const kap = ref.current
      if (!kap || document.documentElement.dataset.motion !== 'on') return
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail
      for (let i = 0; i < 22; i++) {
        const p = document.createElement('i')
        const tur = i % 3
        const renk = RENK[i % RENK.length]
        const w = tur === 0 ? 16 : 10
        const h = tur === 0 ? 6 : 10
        p.style.cssText = `position:fixed;left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;background:${renk};border:2.5px solid #073b4c;border-radius:${tur === 1 ? '50%' : '3px'};${tur === 2 ? 'clip-path:polygon(50% 0,100% 100%,0 100%);border:0;background:' + renk : ''}`
        kap.appendChild(p)
        const a = (i / 22) * Math.PI * 2 + Math.random() * 0.4
        const v = 90 + Math.random() * 110
        const dx = Math.cos(a) * v
        const dy = Math.sin(a) * v - 60
        const don = (Math.random() - 0.5) * 720
        const anim = p.animate(
          [
            { transform: 'translate(0,0) rotate(0deg) scale(0.4)', opacity: 1 },
            { transform: `translate(${dx}px, ${dy}px) rotate(${don / 2}deg) scale(1)`, opacity: 1, offset: 0.35 },
            { transform: `translate(${dx * 1.3}px, ${dy + 260}px) rotate(${don}deg) scale(0.9)`, opacity: 0 },
          ],
          { duration: 1100 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.4,1)' },
        )
        anim.onfinish = () => p.remove()
      }
    }
    window.addEventListener('konfeti', f)
    return () => window.removeEventListener('konfeti', f)
  }, [])
  return <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" />
}
