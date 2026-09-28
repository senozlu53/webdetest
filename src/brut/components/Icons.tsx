import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
/** Madde 9: 2,5px kalın, kare uçlu, sivri birleşimli sert vektör ikonlar */
function Svg({ size = 22, children, strokeWidth = 2.5, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" {...p}>
      {children}
    </svg>
  )
}
export const IconArrow = (p: P) => (
  <Svg {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Svg>
)
export const IconArrowUpRight = (p: P) => (
  <Svg {...p}>
    <path d="M7 17L17 7M8 7h9v9" />
  </Svg>
)
export const IconStar = (p: P) => (
  <Svg {...p}>
    <path d="M12 2.5l2.6 6.3 6.9.6-5.2 4.5 1.6 6.7L12 17l-5.9 3.6 1.6-6.7L2.5 9.4l6.9-.6z" />
  </Svg>
)
export const IconAsterisk = (p: P) => (
  <Svg {...p}>
    <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
  </Svg>
)
export const IconCart = (p: P) => (
  <Svg {...p}>
    <path d="M2.5 4h3l2.4 11h11l2-8H7" />
    <path d="M9 20h.01M18 20h.01" strokeWidth={4} />
  </Svg>
)
export const IconHeart = (p: P) => (
  <Svg {...p}>
    <path d="M12 20l-8-8a4.6 4.6 0 0 1 6.5-6.5L12 7l1.5-1.5A4.6 4.6 0 0 1 20 12z" />
  </Svg>
)
export const IconPlus = (p: P) => (
  <Svg {...p}>
    <path d="M12 4v16M4 12h16" />
  </Svg>
)
export const IconMinus = (p: P) => (
  <Svg {...p}>
    <path d="M4 12h16" />
  </Svg>
)
export const IconX = (p: P) => (
  <Svg {...p}>
    <path d="M5 5l14 14M19 5L5 19" />
  </Svg>
)
export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="M4 12.5l5 5L20 6.5" />
  </Svg>
)
export const IconCopy = (p: P) => (
  <Svg {...p}>
    <path d="M8 8h12v12H8z" />
    <path d="M16 8V4H4v12h4" />
  </Svg>
)
export const IconEye = (p: P) => (
  <Svg {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <path d="M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
  </Svg>
)
export const IconEyeOff = (p: P) => (
  <Svg {...p}>
    <path d="M3 3l18 18M10.5 5.2A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.4 6.4C3.7 8.2 2 12 2 12s3.6 7 10 7a9.5 9.5 0 0 0 5.6-1.8M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </Svg>
)
export const IconPause = (p: P) => (
  <Svg {...p}>
    <path d="M7 5v14M17 5v14" strokeWidth={3.5} />
  </Svg>
)
export const IconPlay = (p: P) => (
  <Svg {...p}>
    <path d="M6 4l14 8-14 8z" fill="currentColor" />
  </Svg>
)
export const IconSun = (p: P) => (
  <Svg {...p}>
    <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
    <path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
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
    <path d="M14 4h4v6h-4zM6 14h4v6H6z" />
  </Svg>
)
export const IconBolt = (p: P) => (
  <Svg {...p}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
  </Svg>
)
export const IconTerminal = (p: P) => (
  <Svg {...p}>
    <path d="M2.5 3.5h19v17h-19z" />
    <path d="M6.5 9l3.5 3-3.5 3M12 15.5h5" />
  </Svg>
)
export const IconRocket = (p: P) => (
  <Svg {...p}>
    <path d="M14 4c3-1.5 6-1 6-1s.5 3-1 6l-6 6-5-5z" />
    <path d="M8 10l-4 1-2 3 5 1M14 16l-1 4-3 2-1-5M15 9h.01" />
  </Svg>
)
export const IconWarning = (p: P) => (
  <Svg {...p}>
    <path d="M12 3l10 18H2z" />
    <path d="M12 10v5M12 18v.01" />
  </Svg>
)
export const IconSmile = (p: P) => (
  <Svg {...p}>
    <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19z" />
    <path d="M8 14.5s1.5 2 4 2 4-2 4-2M9 9.5v.5M15 9.5v.5" />
  </Svg>
)
export const IconGrid = (p: P) => (
  <Svg {...p}>
    <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" />
  </Svg>
)
