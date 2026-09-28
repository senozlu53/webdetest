import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
/** Denetimler için küçük ikonlar; süs için ikon değil çıkartma kullanılır (Madde 9) */
function Svg({ size = 20, children, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      {children}
    </svg>
  )
}
export const IconX = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)
export const IconPlus = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
export const IconMinus = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
)
export const IconHeart = (p: P) => (
  <Svg {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" />
  </Svg>
)
export const IconArrow = (p: P) => (
  <Svg {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Svg>
)
export const IconPause = (p: P) => (
  <Svg {...p}>
    <path d="M8 5v14M16 5v14" strokeWidth={3} />
  </Svg>
)
export const IconPlay = (p: P) => (
  <Svg {...p}>
    <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
  </Svg>
)
export const IconSettings = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2.2" />
    <circle cx="8" cy="17" r="2.2" />
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
export const IconTicket = (p: P) => (
  <Svg {...p}>
    <path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3z" transform="translate(0 2)" />
    <path d="M14 6v14" strokeDasharray="2 3" />
  </Svg>
)
export const IconShuffle = (p: P) => (
  <Svg {...p}>
    <path d="M3 7h3.5c5 0 6 10 11 10H21M3 17h3.5c2 0 3.2-1.6 4.2-3.5M21 7h-3.5c-2 0-3.2 1.6-4.2 3.5M18 4l3 3-3 3M18 14l3 3-3 3" />
  </Svg>
)
export const IconLayers = (p: P) => (
  <Svg {...p}>
    <path d="M12 3l9 5-9 5-9-5z" />
    <path d="M3 13l9 5 9-5" />
  </Svg>
)
export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
)
export const IconChevron = ({ dir = 'right', ...p }: P & { dir?: 'left' | 'right' }) => (
  <Svg {...p}>
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </Svg>
)
