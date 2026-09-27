import type { ReactNode } from 'react'

/** Madde 9: ince çizgili, kompleks HUD ikonları (32 × 32, çizgi 1.25, currentColor) */
const Frame = ({ children }: { children: ReactNode }) => (
  <>
    <path d="M2 7V2h5M25 2h5v5M30 25v5h-5M7 30H2v-5" opacity="0.55" />
    {children}
  </>
)

export const HUD_ICONS = {
  nisangah: {
    name: 'Nişangâh',
    draw: (
      <Frame>
        <circle cx="16" cy="16" r="9" />
        <circle cx="16" cy="16" r="2.5" />
        <path d="M16 4v6M16 22v6M4 16h6M22 16h6" />
        <path d="M11 11l1.5 1.5M21 21l-1.5-1.5" opacity="0.6" />
      </Frame>
    ),
  },
  radar: {
    name: 'Radar',
    draw: (
      <Frame>
        <circle cx="16" cy="16" r="11" />
        <circle cx="16" cy="16" r="7" opacity="0.6" />
        <circle cx="16" cy="16" r="3" opacity="0.4" />
        <path d="M16 16L24 8" />
        <circle cx="21.5" cy="12.5" r="1.2" fill="currentColor" stroke="none" />
        <path d="M5 16h2M25 16h2M16 5v2M16 25v2" opacity="0.6" />
      </Frame>
    ),
  },
  cip: {
    name: 'Çip',
    draw: (
      <Frame>
        <rect x="9" y="9" width="14" height="14" />
        <rect x="13" y="13" width="6" height="6" opacity="0.6" />
        <path d="M12 9V5M16 9V5M20 9V5M12 27v-4M16 27v-4M20 27v-4M9 12H5M9 16H5M9 20H5M27 12h-4M27 16h-4M27 20h-4" />
      </Frame>
    ),
  },
  kalkan: {
    name: 'Kalkan',
    draw: (
      <Frame>
        <path d="M16 4l10 4v7c0 6-4.5 10.5-10 13C10.5 25.5 6 21 6 15V8z" />
        <path d="M11 15l4 4 7-8" />
        <path d="M16 8v2" opacity="0.6" />
      </Frame>
    ),
  },
  uydu: {
    name: 'Uydu',
    draw: (
      <Frame>
        <rect x="13" y="13" width="6" height="6" transform="rotate(45 16 16)" />
        <path d="M9 9l-4-4M23 23l4 4" />
        <rect x="3" y="11" width="7" height="4" transform="rotate(-45 6.5 13)" opacity="0.7" />
        <rect x="22" y="17" width="7" height="4" transform="rotate(-45 25.5 19)" opacity="0.7" />
        <path d="M20 8a5 5 0 014 4M21 5a8 8 0 016 6" opacity="0.6" />
      </Frame>
    ),
  },
  sinyal: {
    name: 'Sinyal',
    draw: (
      <Frame>
        <path d="M4 17h4l2-6 3 12 3-16 3 14 2-4h7" />
        <path d="M4 26h24" opacity="0.4" strokeDasharray="1 2" />
      </Frame>
    ),
  },
  kilit: {
    name: 'Şifreli',
    draw: (
      <Frame>
        <rect x="8" y="14" width="16" height="12" />
        <path d="M11 14v-3a5 5 0 0110 0v3" />
        <path d="M16 18v4" />
        <path d="M11 29h2M15 29h2M19 29h2" opacity="0.6" />
      </Frame>
    ),
  },
  noral: {
    name: 'Nöral ağ',
    draw: (
      <Frame>
        <circle cx="8" cy="10" r="2" />
        <circle cx="8" cy="22" r="2" />
        <circle cx="16" cy="16" r="2.5" />
        <circle cx="24" cy="9" r="2" />
        <circle cx="24" cy="23" r="2" />
        <path d="M10 10.5l4 4M10 21.5l4-4M18.3 15l3.9-4.6M18.3 17l3.9 4.6M8 12v8" opacity="0.8" />
      </Frame>
    ),
  },
} as const

export type HudIconName = keyof typeof HUD_ICONS

export function HudIcon({ name, size = 32, className, label }: { name: HudIconName; size?: number; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="square"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {HUD_ICONS[name].draw}
    </svg>
  )
}
