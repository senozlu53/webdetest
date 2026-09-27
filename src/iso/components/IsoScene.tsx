import type { CSSProperties, ReactNode } from 'react'
import { boxFaces, makeProject, pts, shadowPolygon, type Box, type Project, type Pt } from '../lib/iso'
import { FACES, LABEL_INK, type Hue } from '../lib/palette'
import { useProjection } from '../lib/projection'
import { cx } from '../../shared/cx'

type SceneProps = {
  unit: number
  /** Sahnenin kapladığı 3B hacim: [genişlik (x), derinlik (y), en yüksek z]; viewBox buna göre hesaplanır */
  extent: [number, number, number]
  pad?: number
  /** Ekran okuyucu için sahnenin özeti; verilmezse sahne süstür (aria-hidden) */
  label?: string
  className?: string
  style?: CSSProperties
  children: (P: Project, tilt: number) => ReactNode
}

/** SVG izometrik sahne. Projeksiyon, sayfadaki CSS 3D düzlemiyle aynı açıyı kullanır; açı değişince viewBox yeniden hesaplanır. */
export function IsoScene({ unit, extent, pad = 12, label, className, style, children }: SceneProps) {
  const { tilt } = useProjection()
  const P0 = makeProject(tilt, unit)
  const [W, D, Z] = extent
  const corners = [P0(0, 0, 0), P0(W, 0, 0), P0(W, D, 0), P0(0, D, 0), P0(0, 0, Z), P0(W, 0, Z), P0(W, D, Z), P0(0, D, Z)]
  const minX = Math.min(...corners.map((c) => c[0])) - pad
  const maxX = Math.max(...corners.map((c) => c[0])) + pad
  const minY = Math.min(...corners.map((c) => c[1])) - pad
  const maxY = Math.max(...corners.map((c) => c[1])) + pad
  const P = makeProject(tilt, unit, [-minX, -minY])
  return (
    <svg
      viewBox={`0 0 ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`}
      className={cx('block h-auto w-full overflow-visible', className)}
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {children(P, tilt)}
    </svg>
  )
}

const EDGE = 'rgb(15 23 42 / 0.14)'

/**
 * Sayfaya bir kez eklenen tanımlar: silindir yan yüzleri için soldan (orta ton) sağa (karanlık ton) degrade.
 * Kullanım: fill="url(#cyl-violet)".
 */
export function IsoDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {(Object.keys(FACES) as Hue[]).map((h) => (
          <linearGradient key={h} id={`cyl-${h}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={FACES[h].left} />
            <stop offset="0.55" stopColor={FACES[h].left} />
            <stop offset="1" stopColor={FACES[h].right} />
          </linearGradient>
        ))}
      </defs>
    </svg>
  )
}

type BlockProps = {
  P: Project
  box: Box
  hue: Hue
  /** Sıralı inşa animasyonundaki sırası (Madde 16) */
  i?: number
  build?: 'down' | 'up' | false
  topLabel?: string
  rightLabel?: string
  opacity?: number
  highlight?: boolean
  children?: ReactNode
}

/** Üç tonlu blok: üst aydınlık, sol orta, sağ karanlık (Madde 4). İsteğe bağlı yüz etiketleri kurala uyar. */
export function IsoBlock({ P, box, hue, i = 0, build = 'down', topLabel, rightLabel, opacity = 1, highlight, children }: BlockProps) {
  const f = boxFaces(P, box)
  const tone = FACES[hue]
  const o = P(0, 0, 0)
  const ex = P(1, 0, 0)
  const ey = P(0, 1, 0)
  const ez = P(0, 0, 1)
  const ax: Pt = [ex[0] - o[0], ex[1] - o[1]]
  const ay: Pt = [ey[0] - o[0], ey[1] - o[1]]
  const az: Pt = [ez[0] - o[0], ez[1] - o[1]]
  const z = box.z ?? 0
  // Üst yüz: metin +x boyunca (sağ yukarı) okunur; sağ yüz: metin +x boyunca, aşağısı −z
  const topAnchor = P(box.x + 0.18, box.y + box.d / 2, z + box.h)
  const rightAnchor = P(box.x + 0.18, box.y + box.d, z + box.h * 0.5)
  return (
    <g
      className={cx(build && 'build', build === 'up' && 'build-up')}
      style={{ '--i': i, opacity } as CSSProperties}
      stroke={highlight ? 'var(--ink)' : EDGE}
      strokeWidth={highlight ? 1.5 : 0.75}
      strokeLinejoin="round"
    >
      <polygon points={pts(f.left)} fill={tone.left} />
      <polygon points={pts(f.right)} fill={tone.right} />
      <polygon points={pts(f.top)} fill={tone.top} />
      {topLabel ? (
        <text
          transform={`matrix(${ax[0]} ${ax[1]} ${ay[0]} ${ay[1]} ${topAnchor[0]} ${topAnchor[1]})`}
          fontSize={0.34}
          fontFamily="IBM Plex Mono, monospace"
          fontWeight={600}
          fill={LABEL_INK}
          stroke="none"
          dominantBaseline="middle"
        >
          {topLabel}
        </text>
      ) : null}
      {rightLabel ? (
        <text
          transform={`matrix(${ax[0]} ${ax[1]} ${-az[0]} ${-az[1]} ${rightAnchor[0]} ${rightAnchor[1]})`}
          fontSize={0.3}
          fontFamily="IBM Plex Mono, monospace"
          fontWeight={600}
          fill="#FFFFFF"
          stroke="none"
          dominantBaseline="middle"
        >
          {rightLabel}
        </text>
      ) : null}
      {children}
    </g>
  )
}

/** Sert, tek yönlü uzun gölge (Madde 7) */
export function IsoShadow({ P, box, i = 0, build = true, length = 1, ground }: { P: Project; box: Box; i?: number; build?: boolean; length?: number; ground?: number }) {
  return <polygon className={build ? 'build-shadow' : undefined} style={{ '--i': i } as CSSProperties} points={pts(shadowPolygon(P, box, length, ground))} fill="var(--shadow)" />
}

/** Zemindeki izometrik ızgara çizgileri (x ve y eksenleri boyunca) */
export function IsoGround({ P, size, step = 1, stroke = 'var(--grid-strong)', from = 0, z = 0 }: { P: Project; size: [number, number]; step?: number; stroke?: string; from?: number; z?: number }) {
  const lines: ReactNode[] = []
  for (let x = from; x <= size[0] + 1e-6; x += step) {
    const a = P(x, from, z)
    const b = P(x, size[1], z)
    lines.push(<line key={`x${x}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />)
  }
  for (let y = from; y <= size[1] + 1e-6; y += step) {
    const a = P(from, y, z)
    const b = P(size[0], y, z)
    lines.push(<line key={`y${y}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />)
  }
  return (
    <g stroke={stroke} strokeWidth={0.75}>
      {lines}
    </g>
  )
}
