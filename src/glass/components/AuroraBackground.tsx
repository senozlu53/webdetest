import { useEffect, useRef } from 'react'

const BLOBS = [
  { color: 'var(--blob-1)', size: '62vmax', top: '-18%', left: '-12%', speed: -0.12, delay: '0s' },
  { color: 'var(--blob-2)', size: '48vmax', top: '32%', left: '58%', speed: -0.22, delay: '-8s' },
  { color: 'var(--blob-3)', size: '44vmax', top: '78%', left: '-10%', speed: -0.3, delay: '-16s' },
  { color: 'var(--blob-4)', size: '40vmax', top: '130%', left: '48%', speed: -0.38, delay: '-24s' },
] as const

/**
 * Sabit, canlı degrade zemin. Işık lekeleri radial-gradient ile çizilir (filter: blur yok,
 * GPU'yu yormaz); kaydırdıkça farklı hızlarda kayarak camın altından geçer.
 */
export function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-speed]'))
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      for (const l of layers) l.style.transform = `translate3d(0, ${(y * Number(l.dataset.speed)).toFixed(1)}px, 0)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-canvas">
      {BLOBS.map((b, i) => (
        <div key={i} data-speed={b.speed} className="absolute" style={{ top: b.top, left: b.left }}>
          <div
            className="aurora-blob rounded-full"
            style={{
              width: b.size,
              height: b.size,
              opacity: 'var(--blob-opacity)',
              background: `radial-gradient(closest-side, ${b.color}, transparent)`,
              animation: `aurora-drift 36s ease-in-out ${b.delay} infinite alternate`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
