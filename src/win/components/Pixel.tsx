import { memo } from 'react'
import { IKONLAR, dikdortgenler, type IkonAd } from '../lib/pixel'

/**
 * Madde 9: piksel ikon. 16×16 ızgara; boyut rem cinsinden (1rem = 16px'te bire bir, 2rem = 32×32).
 * shape-rendering="crispEdges": kenar yumuşatması yok. Süs: ekran okuyucudan gizli; anlamı yanındaki yazı taşır.
 */
export const Pixel = memo(function Pixel({ ad, boyut = 1, className, title }: { ad: IkonAd; boyut?: number; className?: string; title?: string }) {
  const r = dikdortgenler(IKONLAR[ad])
  return (
    <svg
      viewBox="0 0 16 16"
      width={`${boyut}rem`}
      height={`${boyut}rem`}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-label={title}
      data-ikon={ad}
      style={{ flexShrink: 0 }}
    >
      {r.map((d, i) => (
        <rect key={i} x={d.x} y={d.y} width={d.w} height={1} fill={d.renk} />
      ))}
    </svg>
  )
})

/** Başlık çubuğu düğmelerinin 8×7 piksel işaretleri */
export function Glif({ tip }: { tip: 'kapat' | 'kucult' | 'buyut' | 'geri' | 'soru' }) {
  const d = {
    kapat: 'M0 0h2v1H0zM6 0h2v1H6zM1 1h2v1H1zM5 1h2v1H5zM2 2h4v1H2zM3 3h2v1H3zM2 4h4v1H2zM1 5h2v1H1zM5 5h2v1H5zM0 6h2v1H0zM6 6h2v1H6z',
    kucult: 'M1 5h6v2H1z',
    buyut: 'M0 0h8v2H0zM0 2h1v5H0zM7 2h1v5H7zM1 6h6v1H1z',
    geri: 'M2 0h6v1H2zM2 1h1v1H2zM7 1h1v3H7zM6 3h1v1H6zM0 2h6v1H0zM0 3h1v4H0zM5 3h1v4H5zM1 6h4v1H1z',
    soru: 'M2 0h4v1H2zM1 1h2v1H1zM5 1h2v2H5zM4 3h2v1H4zM3 4h2v1H3zM3 6h2v1H3z',
  }[tip]
  return (
    <svg viewBox="0 0 8 7" width="0.5rem" height="0.4375rem" shapeRendering="crispEdges" aria-hidden="true">
      <path d={d} fill="currentColor" />
    </svg>
  )
}
