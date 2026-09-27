import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'

type P = { size?: number; className?: string; label?: string }

function Svg({ size = 16, className, label, children }: P & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx('shrink-0', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {children}
    </svg>
  )
}

/* ── Madde 9: döngüsel durum ikonları ── */

/** Düşünüyor: sırayla yükselen üç nokta */
export const IconThinking = (p: P) => (
  <Svg {...p}>
    <g className="dot-wave" fill="currentColor" stroke="none">
      <circle cx="3.5" cy="8" r="1.4" />
      <circle cx="8" cy="8" r="1.4" />
      <circle cx="12.5" cy="8" r="1.4" />
    </g>
  </Svg>
)
/** Yükleniyor: dönen yay */
export const IconSpinner = (p: P) => (
  <Svg {...p}>
    <circle cx="8" cy="8" r="5.5" opacity=".2" />
    <path d="M8 2.5a5.5 5.5 0 0 1 5.5 5.5" className="spin" />
  </Svg>
)
/** Araç çalışıyor: yavaş dönen dişli */
export const IconTool = (p: P) => (
  <Svg {...p}>
    <g className="spin-slow">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.8v1.7M8 12.5v1.7M1.8 8h1.7M12.5 8h1.7M3.6 3.6l1.2 1.2M11.2 11.2l1.2 1.2M3.6 12.4l1.2-1.2M11.2 4.8l1.2-1.2" />
    </g>
  </Svg>
)
/** Tamamlandı: çizilerek beliren onay */
export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="M3.5 8.5l3 3 6-7" className="draw" />
  </Svg>
)
export const IconError = (p: P) => (
  <Svg {...p}>
    <circle cx="8" cy="8" r="5.8" />
    <path d="M8 4.8v3.6M8 10.9v.1" />
  </Svg>
)
export const IconPending = (p: P) => (
  <Svg {...p}>
    <circle cx="8" cy="8" r="5.5" strokeDasharray="2 2.3" />
  </Svg>
)
/** Yapay zekâ işareti: dört köşeli parıltı */
export const IconSpark = (p: P) => (
  <Svg {...p}>
    <path d="M8 1.5c.5 3.2 1.8 5.5 6.5 6.5-4.7 1-6 3.3-6.5 6.5-.5-3.2-1.8-5.5-6.5-6.5 4.7-1 6-3.3 6.5-6.5z" fill="currentColor" stroke="none" />
  </Svg>
)

/* ── Arayüz ikonları (sabit) ── */
export const IconSend = (p: P) => (
  <Svg {...p}>
    <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
  </Svg>
)
export const IconStop = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="4" width="8" height="8" rx="1.5" fill="currentColor" stroke="none" />
  </Svg>
)
export const IconChevron = ({ open, ...p }: P & { open?: boolean }) => (
  <Svg {...p} className={cx('transition-transform duration-200', open && 'rotate-90', p.className)}>
    <path d="M6 3.5 10.5 8 6 12.5" />
  </Svg>
)
export const IconCopy = (p: P) => (
  <Svg {...p}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 5.5V3.8A1.3 1.3 0 0 0 9.2 2.5H3.8a1.3 1.3 0 0 0-1.3 1.3v5.4a1.3 1.3 0 0 0 1.3 1.3h1.7" />
  </Svg>
)
export const IconSearch = (p: P) => (
  <Svg {...p}>
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.5 10.5 3 3" />
  </Svg>
)
export const IconFile = (p: P) => (
  <Svg {...p}>
    <path d="M4 1.8h5l3 3v9.4H4z" />
    <path d="M9 1.8v3h3" />
  </Svg>
)
export const IconTable = (p: P) => (
  <Svg {...p}>
    <rect x="2" y="3" width="12" height="10" rx="1.5" />
    <path d="M2 6.5h12M6.5 6.5V13" />
  </Svg>
)
export const IconChart = (p: P) => (
  <Svg {...p}>
    <path d="M2.5 13.5h11M4.5 11V7M8 11V4M11.5 11V8.5" />
  </Svg>
)
export const IconCalendar = (p: P) => (
  <Svg {...p}>
    <rect x="2" y="3" width="12" height="11" rx="1.5" />
    <path d="M2 6.5h12M5.5 1.8v2.4M10.5 1.8v2.4" />
  </Svg>
)
export const IconCode = (p: P) => (
  <Svg {...p}>
    <path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5" />
  </Svg>
)
export const IconSun = (p: P) => (
  <Svg {...p}>
    <circle cx="8" cy="8" r="2.8" />
    <path d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9" />
  </Svg>
)
export const IconMoon = (p: P) => (
  <Svg {...p}>
    <path d="M13.5 9.8A5.8 5.8 0 0 1 6.2 2.5a5.8 5.8 0 1 0 7.3 7.3z" />
  </Svg>
)
export const IconLayers = (p: P) => (
  <Svg {...p}>
    <path d="m8 2 6 3.2-6 3.2-6-3.2z" />
    <path d="m2 8.2 6 3.2 6-3.2" opacity=".6" />
  </Svg>
)

/** Araç adına göre ikon */
export function toolIcon(name: string) {
  if (name.includes('ara')) return IconSearch
  if (name.includes('tablo')) return IconTable
  if (name.includes('grafik')) return IconChart
  if (name.includes('takvim') || name.includes('etkinlik')) return IconCalendar
  if (name.includes('test') || name.includes('yama')) return IconCode
  return IconFile
}
