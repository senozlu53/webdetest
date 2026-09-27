import { useRef, type CSSProperties } from 'react'
import { useIdleOffscreen } from '../hooks/useIdleOffscreen'
import { cx } from '../../shared/cx'

/** Sayfaya bir kez eklenen SVG tanımları: gooey filtresi ve holografik ikon degradesi. */
export function LiquidDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
        <linearGradient id="holo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ animation: 'holo-shift 8s linear infinite' }} />
          <stop offset="1" style={{ animation: 'holo-shift-2 8s linear infinite' }} />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** Akışkan yükleme göstergesi: dönen damlalar gooey filtresiyle birbirine yapışır. */
export function LiquidSpinner({ size = 64, label = 'Yükleniyor' }: { size?: number; label?: string }) {
  const dot = (i: number): CSSProperties => ({
    width: size * 0.3,
    height: size * 0.3,
    left: size * 0.35,
    top: size * 0.35,
    background: `var(--a1-${(i % 4) + 1})`,
    animation: `liquid-orbit 1.6s cubic-bezier(0.6, 0, 0.4, 1) ${i * -0.2}s infinite`,
  })
  return (
    <span role="status" aria-label={label} className="liquid-spinner relative inline-block" style={{ width: size, height: size, filter: 'url(#goo)' }}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="absolute rounded-full" style={dot(i)} />
      ))}
      <span className="absolute rounded-full" style={{ width: size * 0.42, height: size * 0.42, left: size * 0.29, top: size * 0.29, background: 'var(--a1-1)' }} />
    </span>
  )
}

/** Sıvı gibi form değiştiren küre; içinde akan mesh. Hız duruma göre değişir. */
export function MorphOrb({ state = 'idle', size = 280, className }: { state?: 'idle' | 'listening' | 'thinking'; size?: number; className?: string }) {
  const dur = state === 'thinking' ? '3s' : state === 'listening' ? '6s' : '12s'
  const ref = useRef<HTMLDivElement>(null)
  useIdleOffscreen(ref)
  return (
    <div ref={ref} className={cx('relative', className)} style={{ width: size, height: size }} aria-hidden="true">
      <div
        className="morph gradient-mesh absolute inset-0"
        style={{ ['--morph-dur' as string]: dur, animationName: 'morph, mesh-flow', animationDuration: `calc(${dur} * var(--speed, 1)), calc(${state === 'thinking' ? '6s' : '18s'} * var(--speed, 1))`, animationIterationCount: 'infinite', animationDirection: 'normal, alternate', animationTimingFunction: 'ease-in-out' }}
      />
      <div
        className="morph absolute inset-0 opacity-70 blur-2xl"
        style={{
          background: 'radial-gradient(closest-side, var(--a1-2), transparent)',
          ['--morph-dur' as string]: dur,
          transform: 'scale(1.1)',
        }}
      />
    </div>
  )
}
