import type { CSSProperties, ReactNode, SVGProps } from 'react'

type P = { size?: number; title?: string } & Omit<SVGProps<SVGSVGElement>, 'children'>

/** Madde 9: kalın çizgili ikonlar (2,5px, yuvarlak uç). Süs: aria-hidden; anlamı düğme metni taşır */
function Svg({ size = 20, title, children, ...rest }: P & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} {...rest}>
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export const IconPlay = (p: P) => (
  <Svg {...p}>
    <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
  </Svg>
)
export const IconPause = (p: P) => (
  <Svg {...p}>
    <path d="M8 5v14M16 5v14" strokeWidth={4} />
  </Svg>
)
export const IconNext = (p: P) => (
  <Svg {...p}>
    <path d="M5 5l9 7-9 7z" fill="currentColor" />
    <path d="M18 5v14" strokeWidth={3} />
  </Svg>
)
export const IconPrev = (p: P) => (
  <Svg {...p}>
    <path d="M19 5l-9 7 9 7z" fill="currentColor" />
    <path d="M6 5v14" strokeWidth={3} />
  </Svg>
)
export const IconHeart = (p: P & { dolu?: boolean }) => {
  const { dolu, ...r } = p
  return (
    <Svg {...r}>
      <path d="M12 20s-8-4.7-8-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8 2.8C20 15.3 12 20 12 20z" fill={dolu ? 'currentColor' : 'none'} />
    </Svg>
  )
}
export const IconCart = (p: P) => (
  <Svg {...p}>
    <path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H7" />
    <circle cx="9.5" cy="19" r="1.6" fill="currentColor" />
    <circle cx="17" cy="19" r="1.6" fill="currentColor" />
  </Svg>
)
export const IconClose = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" strokeWidth={3} />
  </Svg>
)
export const IconSun = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
  </Svg>
)
export const IconMoon = (p: P) => (
  <Svg {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
  </Svg>
)
export const IconSettings = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2.3" />
    <circle cx="8" cy="17" r="2.3" />
  </Svg>
)
export const IconDisc = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M7 9.5a5.5 5.5 0 0 1 3-3" />
  </Svg>
)
export const IconNote = (p: P) => (
  <Svg {...p}>
    <path d="M9 18V5l11-2v13" />
    <circle cx="6.5" cy="18" r="2.5" fill="currentColor" />
    <circle cx="17.5" cy="16" r="2.5" fill="currentColor" />
  </Svg>
)
export const IconVolume = (p: P) => (
  <Svg {...p}>
    <path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z" fill="currentColor" />
    <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" />
  </Svg>
)
export const IconSearch = (p: P) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L21 21" strokeWidth={3} />
  </Svg>
)
export const IconUser = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </Svg>
)
export const IconPlus = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" strokeWidth={3} />
  </Svg>
)
export const IconMinus = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14" strokeWidth={3} />
  </Svg>
)
export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="M4.5 12.5l5 5L19.5 6.5" strokeWidth={3} />
  </Svg>
)
export const IconArrow = (p: P) => (
  <Svg {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Svg>
)
export const IconWindow = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M3 9h18" />
  </Svg>
)
export const IconGlobe = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
  </Svg>
)
/** Dört köşeli parıltı: dolu */
export const IconSparkle = (p: P) => (
  <Svg {...p} stroke="none">
    <path d="M12 1.5C12.9 8 16 11.1 22.5 12 16 12.9 12.9 16 12 22.5 11.1 16 8 12.9 1.5 12 8 11.1 11.1 8 12 1.5z" fill="currentColor" />
  </Svg>
)
export const IconStar = (p: P) => (
  <Svg {...p}>
    <path d="M12 2.5l2.6 6.2 6.7.5-5.1 4.4 1.6 6.5L12 16.6l-5.8 3.5 1.6-6.5-5.1-4.4 6.7-.5z" />
  </Svg>
)

/* ── Kabile (tribal) vektörleri: dolu, simetrik, sivri ── */
type T = { size?: number; className?: string; fill?: string; style?: CSSProperties }
export function TribalFlame({ style, size = 80, className, fill = 'currentColor' }: T) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true">
      <path
        fillRule="evenodd"
        fill={fill}
        d="M50 2C58 20 70 28 64 46C78 40 86 52 80 66C72 84 58 92 50 98C42 92 28 84 20 66C14 52 22 40 36 46C30 28 42 20 50 2ZM50 30C55 42 60 52 53 63C50 68 49 72 50 78C43 69 41 58 46 50C48 44 48 38 50 30Z"
      />
    </svg>
  )
}
export function TribalWing({ style, size = 120, className, fill = 'currentColor' }: T) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true">
      <path fill={fill} d="M4 60C30 58 48 40 58 12C60 30 66 40 80 44C70 47 64 53 62 60C75 58 87 63 97 73C82 71 71 75 61 84C55 73 40 66 4 60Z" />
    </svg>
  )
}
export function TribalStar({ style, size = 90, className, fill = 'currentColor' }: T) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true">
      <path fill={fill} d="M50 0C54 30 70 46 100 50C70 54 54 70 50 100C46 70 30 54 0 50C30 46 46 30 50 0Z" />
      <path fill={fill} d="M50 18C60 38 70 40 82 50C70 60 60 62 50 82C40 62 30 60 18 50C30 40 40 38 50 18Z" transform="rotate(45 50 50)" opacity="0.55" />
    </svg>
  )
}
export function TribalRing({ style, size = 90, className, fill = 'currentColor' }: T) {
  const d = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4
    const r1 = 30
    const r2 = 48
    const w = 0.22
    const p = (r: number, t: number) => `${(50 + r * Math.cos(t)).toFixed(1)} ${(50 + r * Math.sin(t)).toFixed(1)}`
    return `M${p(r1, a - w)}Q${p(r2 * 0.9, a - 0.05)} ${p(r2, a + 0.12)}Q${p(r1 * 1.15, a + 0.1)} ${p(r1, a + w)}Z`
  }).join('')
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true">
      <circle cx="50" cy="50" r="24" fill="none" stroke={fill} strokeWidth="9" />
      <path fill={fill} d={d} />
    </svg>
  )
}
