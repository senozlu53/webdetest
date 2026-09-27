import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'

/*
 * Madde 9: içi boş, parlayan kontur ikonlar (24px ızgara, 1,5px çizgi, yuvarlak uç).
 * Parlama `glow-icon` ile drop-shadow; renk çevreden (currentColor) gelir.
 */
const P: Record<string, ReactNode> = {
  cip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" />
    </>
  ),
  model: (
    <>
      <path d="M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4z" />
      <path d="M4 7.4 12 12l8-4.6M12 12v9.2" />
      <circle cx="12" cy="12" r="1.3" />
    </>
  ),
  noral: (
    <>
      <circle cx="5" cy="6" r="1.8" />
      <circle cx="5" cy="18" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="6" r="1.8" />
      <circle cx="19" cy="18" r="1.8" />
      <path d="M6.6 7l3.8 3.9M6.6 17l3.8-3.9M13.6 10.9 17.4 7M13.6 13.1l3.8 3.9M7 6h10M7 18h10" />
    </>
  ),
  akis: (
    <>
      <path d="M3 8c3 0 3-3 6-3s3 3 6 3 3-3 6-3" />
      <path d="M3 13c3 0 3-3 6-3s3 3 6 3 3-3 6-3" opacity=".7" />
      <path d="M3 18c3 0 3-3 6-3s3 3 6 3 3-3 6-3" opacity=".45" />
    </>
  ),
  ag: (
    <>
      <rect x="3" y="4" width="18" height="10" rx="2.5" />
      <path d="M7 14v2.5h10V14M12 16.5V20M8 20h8" />
      <path d="M7 8h1.5M10 8h1.5M13 8h1.5M16 8h1" />
    </>
  ),
  depo: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.6" />
      <path d="M5 5.5v13c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-13" />
      <path d="M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6" />
    </>
  ),
  bellek: (
    <>
      <rect x="2.5" y="7" width="19" height="9" rx="1.5" />
      <path d="M6 10v3M9.5 10v3M13 10v3M16.5 10v3M5 16v2.5M19 16v2.5" />
    </>
  ),
  sicaklik: (
    <>
      <path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0z" />
      <path d="M12 9v6.5" />
      <path d="M17 6h2.5M17 9h2" />
    </>
  ),
  atom: (
    <>
      <circle cx="12" cy="12" r="1.5" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-60 12 12)" />
    </>
  ),
  komut: (
    <>
      <path d="M9 9V6.5A2.5 2.5 0 1 0 6.5 9H17.5A2.5 2.5 0 1 0 15 6.5v11a2.5 2.5 0 1 0 2.5-2.5h-11A2.5 2.5 0 1 0 9 17.5z" />
    </>
  ),
  arama: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5.5 5.5" />
    </>
  ),
  oynat: <path d="M7 4.8v14.4a.8.8 0 0 0 1.2.7l11.6-7.2a.8.8 0 0 0 0-1.4L8.2 4.1a.8.8 0 0 0-1.2.7z" />,
  dur: <rect x="6" y="6" width="12" height="12" rx="2" />,
  duraklat: <path d="M8 5v14M16 5v14" />,
  gunes: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  ay: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  katman: (
    <>
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 12 9 5 9-5" opacity=".7" />
      <path d="m3 16 9 5 9-5" opacity=".45" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  kapat: <path d="M6 6l12 12M18 6 6 18" />,
  yukle: (
    <>
      <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4 16.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2.5" />
    </>
  ),
  kaldir: (
    <>
      <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" />
      <path d="M4 16.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2.5" />
    </>
  ),
  onay: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  uyari: (
    <>
      <path d="M12 3.5 21.5 20h-19z" />
      <path d="M12 10v4.5M12 17.2v.3" />
    </>
  ),
  radar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" opacity=".7" />
      <path d="M12 12 18.4 5.6" />
      <circle cx="15.5" cy="15" r="1" />
    </>
  ),
  kup: (
    <>
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5 12 12l8-4.5M12 12v9" opacity=".7" />
    </>
  ),
  ok: <path d="M5 12h14M13 6l6 6-6 6" />,
  sirala: <path d="M8 5v14M4.5 15.5 8 19l3.5-3.5M16 19V5M12.5 8.5 16 5l3.5 3.5" />,
  asagi: <path d="M12 5v14M6 13l6 6 6-6" />,
  yukari: <path d="M12 19V5M6 11l6-6 6 6" />,
  tablo: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M3.5 14.5h17M10 9.5v10" />
    </>
  ),
  grafik: <path d="M4 19h16M4 19V5M7 15l4-5 3 3 5-6" />,
}

export type HoloIconName = keyof typeof P

export const ICON_SET: ReadonlyArray<{ name: HoloIconName; label: string }> = [
  { name: 'cip', label: 'GPU çipi' },
  { name: 'model', label: 'Model' },
  { name: 'noral', label: 'Nöral ağ' },
  { name: 'akis', label: 'Veri akışı' },
  { name: 'ag', label: '10GbE anahtar' },
  { name: 'depo', label: 'Depolama' },
  { name: 'bellek', label: 'Bellek' },
  { name: 'sicaklik', label: 'Sıcaklık' },
  { name: 'atom', label: 'Hesaplama' },
  { name: 'radar', label: 'Tarama' },
  { name: 'katman', label: 'Katmanlar' },
  { name: 'komut', label: 'Komut' },
]

export function HoloIcon({ name, size = 20, className, label, glow = true }: { name: HoloIconName; size?: number; className?: string; label?: string; glow?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx('shrink-0', glow && 'glow-icon', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {P[name]}
    </svg>
  )
}
