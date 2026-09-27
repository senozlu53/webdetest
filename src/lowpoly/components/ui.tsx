import { useMemo, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import { buildMesh, lightDir, shade } from '../lib/facets'
import { ORIGAMI } from '../lib/shapes'
import { cx } from '../../shared/cx'

export function SectionHead({ item, label, title, lede }: { item: string; label: ReactNode; title: ReactNode; lede?: ReactNode }) {
  return (
    <header className="mb-10 max-w-[760px] md:mb-14">
      <p className="font-display text-[13px] font-semibold tracking-[0.18em] text-muted uppercase">
        <span className="text-accent">{item}</span> · {label}
      </p>
      <h2 className="mt-3 text-4xl leading-[1.05] font-bold md:text-6xl">{title}</h2>
      {lede ? <p className="mt-4 max-w-[62ch] text-[17px] text-muted">{lede}</p> : null}
    </header>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost'; icon?: ReactNode; shape?: string; hoverShape?: string }

/** Madde 15: clip-path ile kesilmiş düğme. Şekil arka katmanda, odak halkası düğmenin kutusunda. */
export function FacetButton({ variant = 'primary', icon, shape, hoverShape, className, children, style, type = 'button', ...rest }: BtnProps) {
  return (
    <button
      type={type}
      data-variant={variant}
      className={cx('facet-btn text-[15px]', className)}
      style={{ ...(shape ? { '--btn-shape': shape } : {}), ...(hoverShape ? { '--btn-shape-hover': hoverShape } : {}), ...style } as CSSProperties}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}

export function Glass({ className, children, as: As = 'div' }: { className?: string; children: ReactNode; as?: 'div' | 'section' | 'article' | 'figure' }) {
  return <As className={cx('glass min-w-0 rounded-sm', className)}>{children}</As>
}

/**
 * Madde 11: parçalı (çokgen) arka plan. SVG üçgenler, ışık yönüne göre tek tek gölgelenir.
 * Süstür: üstüne doğrudan metin yazılmaz (Madde 18).
 */
export function FacetField({
  seed = 3,
  cols = 16,
  rows = 9,
  azimuth = 135,
  elevation = 42,
  tint = 0,
  className,
  animate = false,
}: {
  seed?: number
  cols?: number
  rows?: number
  azimuth?: number
  elevation?: number
  tint?: number
  className?: string
  animate?: boolean
}) {
  const W = 1600
  const H = 900
  const mesh = useMemo(() => buildMesh({ width: W, height: H, cols, rows, seed }), [cols, rows, seed])
  const facets = useMemo(() => shade(mesh, lightDir(azimuth, elevation), { zScale: 120, ambient: 0.34, tint }), [mesh, azimuth, elevation, tint])
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={cx('block h-full w-full', className)} aria-hidden="true">
      {facets.map((f, i) => (
        <polygon
          key={i}
          points={f.points}
          fill={f.fill}
          stroke={f.fill}
          strokeWidth={0.6}
          strokeLinejoin="round"
          className={animate ? 'shard' : undefined}
          style={animate ? ({ '--i': Math.round(f.cx / 40 + f.cy / 60), '--dx': `${(f.cx - W / 2) / 30}px`, '--dy': `${(f.cy - H / 2) / 20}px` } as CSSProperties) : undefined}
        />
      ))}
    </svg>
  )
}

const SHADES = { 0: 'var(--facet-hi)', 1: '#7a9e9f', 2: '#314e52' } as const

/** Madde 9: katlanmış kağıt (origami) ikon; her üçgen üç tondan birini alır */
export function Origami({ name, size = 40, className, label }: { name: keyof typeof ORIGAMI; size?: number; className?: string; label?: string }) {
  const icon = ORIGAMI[name]
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {icon.folds.map(([p, s], i) => (
        <polygon key={i} points={p} fill={SHADES[s]} stroke={SHADES[s]} strokeWidth={0.4} strokeLinejoin="round" />
      ))}
    </svg>
  )
}
