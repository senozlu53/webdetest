import { useEffect, useId, useRef } from 'react'
import { useY2K } from '../lib/store'

/**
 * Madde 2: gümüş kromdan yapılmış gibi parlayan 3D logo. Yüz: ufuk çizgili krom gradyanı; derinlik: koyu çelik
 * katmanların üst üste dizilmesi (ekstrüzyon); parıltı: SVG ışıklandırma filtresi (bevel & emboss, Madde 7).
 * Işık kaynağı imleci izler. Hareket kapalıyken sabit.
 */
export function ChromeLogo({ text, className, derinlik = 10, genislik = 900, boy = 150 }: { text: string; className?: string; derinlik?: number; genislik?: number; boy?: number }) {
  const uid = useId().replace(/:/g, '')
  const svg = useRef<SVGSVGElement>(null)
  const isik = useRef<SVGFEPointLightElement>(null)
  const { motion, sade } = useY2K()
  const H = boy + derinlik + 40
  useEffect(() => {
    const el = svg.current
    const l = isik.current
    if (!el || !l || !motion) return
    let raf = 0
    let x = 0
    let y = 0
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      x = ((e.clientX - r.left) / r.width) * genislik
      y = ((e.clientY - r.top) / r.height) * H - H
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          l.setAttribute('x', x.toFixed(0))
          l.setAttribute('y', y.toFixed(0))
        })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [motion, genislik, H])
  const ortak = { x: genislik / 2, textAnchor: 'middle' as const, fontFamily: 'var(--font-logo)', fontSize: boy * 0.86, textLength: genislik - 40, lengthAdjust: 'spacingAndGlyphs' as const }
  const taban = boy * 0.86 + 12
  return (
    <svg ref={svg} viewBox={`0 0 ${genislik} ${H}`} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}y`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.36" stopColor="#dfe7f2" />
          <stop offset="0.47" stopColor="#9aabc3" />
          <stop offset="0.5" stopColor="#3b475c" />
          <stop offset="0.54" stopColor="#f1f5fb" />
          <stop offset="0.78" stopColor="#b6c4d8" />
          <stop offset="1" stopColor="#6c7d96" />
        </linearGradient>
        <linearGradient id={`${uid}d`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7d879b" />
          <stop offset="1" stopColor="#1c2230" />
        </linearGradient>
        <filter id={`${uid}f`} x="-5%" y="-20%" width="110%" height="150%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="b" />
          <feSpecularLighting in="b" surfaceScale="5" specularConstant="1.15" specularExponent="24" lightingColor="#ffffff" result="s">
            <fePointLight ref={isik} x={genislik * 0.25} y={-H * 0.6} z="240" />
          </feSpecularLighting>
          <feComposite in="s" in2="SourceAlpha" operator="in" result="si" />
          <feComposite in="SourceGraphic" in2="si" operator="arithmetic" k1="0" k2="1" k3="0.8" k4="0" />
        </filter>
      </defs>
      {Array.from({ length: derinlik }, (_, i) => (
        <text key={i} {...ortak} y={taban + derinlik - i} dx={(derinlik - i) * 0.7} fill={`url(#${uid}d)`}>
          {text}
        </text>
      ))}
      <text {...ortak} y={taban} fill={`url(#${uid}y)`} stroke="#171c28" strokeWidth={2.4} paintOrder="stroke" filter={sade ? undefined : `url(#${uid}f)`}>
        {text}
      </text>
    </svg>
  )
}
