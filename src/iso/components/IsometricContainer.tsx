import type { CSSProperties, ReactNode } from 'react'
import { useProjection } from '../lib/projection'
import { cx } from '../../shared/cx'

type Props = {
  /** Düzlemin kenar uzunluğu (px) */
  size: number
  /** Katmanların çıkabileceği en yüksek Z (px); kap yüksekliği buna göre ayrılır */
  maxZ?: number
  className?: string
  children: ReactNode
}

/**
 * CSS 3D izometrik kap (Madde 14 · 15). İçindeki öğeler düzlemin koordinatlarında durur,
 * `translateZ` ile yükselir. Kap, izdüşümün kapladığı alanı (s·√2 genişlik, s·√2·cos θ + Z·sin θ
 * yükseklik) yerleşimde ayırır; böylece sayfa akışı bozulmaz. Süs amaçlıdır: aria-hidden.
 */
export function IsometricContainer({ size, maxZ = 0, className, children }: Props) {
  const { tilt } = useProjection()
  const t = (tilt * Math.PI) / 180
  const width = size * Math.SQRT2
  const planeH = size * Math.SQRT2 * Math.cos(t)
  const lift = maxZ * Math.sin(t)
  return (
    <div aria-hidden="true" className={cx('relative mx-auto max-w-full', className)} style={{ width, height: planeH + lift }}>
      <div
        className="iso-plane absolute"
        style={
          {
            width: size,
            height: size,
            left: (width - size) / 2,
            top: lift + (planeH - size) / 2,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  )
}

type LayerProps = {
  z: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
  /** Zemine düşen sert gölgenin kayması (ışık yönü +x, +y) */
  shadow?: boolean
  inset?: number
}

/** Z ekseninde süzülen saydam (glass) katman. İçerik düz yerleşir, düzlemle birlikte döner. */
export function LayeredCard({ z, className, style, children, shadow = true, inset = 0 }: LayerProps) {
  return (
    <>
      {shadow && z > 0 ? (
        <div
          className="absolute rounded-md"
          style={{ inset, background: 'var(--shadow)', transform: `translate(${z * 0.45}px, ${z * 0.45}px)` }}
        />
      ) : null}
      <div className={cx('absolute rounded-md transition-transform duration-500 ease-out motion-reduce:transition-none', className)} style={{ inset, transform: `translateZ(${z}px)`, ...style }}>
        {children}
      </div>
    </>
  )
}
