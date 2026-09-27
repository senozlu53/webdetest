import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'

type P = { size?: number; className?: string }
function Svg({ size = 20, className, children }: P & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={cx('shrink-0', className)} aria-hidden="true">
      {children}
    </svg>
  )
}

/* Madde 9: mikrofon, ataç, gönder, ayarlar */
export const IconMic = (p: P) => (
  <Svg {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" />
  </Svg>
)
export const IconClip = (p: P) => (
  <Svg {...p}>
    <path d="M20.5 11.5 12.4 19.6a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.4 8.4a1.7 1.7 0 0 1-2.4-2.4l7.7-7.7" />
  </Svg>
)
export const IconSend = (p: P) => (
  <Svg {...p}>
    <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
  </Svg>
)
export const IconSettings = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </Svg>
)
export const IconStop = (p: P) => (
  <Svg {...p}>
    <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" stroke="none" />
  </Svg>
)
export const IconX = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)
export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
)
export const IconDown = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Svg>
)
export const IconChevron = ({ open, ...p }: P & { open?: boolean }) => (
  <Svg {...p} className={cx('transition-transform duration-200', open && 'rotate-90', p.className)}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
)
export const IconPlus = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
export const IconChat = (p: P) => (
  <Svg {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z" />
  </Svg>
)
export const IconFile = (p: P) => (
  <Svg {...p}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4" />
  </Svg>
)
export const IconSpark = (p: P) => (
  <Svg {...p}>
    <path d="M12 3c.7 4.5 2.5 7.3 9 9-6.5 1.7-8.3 4.5-9 9-.7-4.5-2.5-7.3-9-9 6.5-1.7 8.3-4.5 9-9z" fill="currentColor" stroke="none" />
  </Svg>
)
export const IconSpinner = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" opacity=".2" />
    <path d="M12 4a8 8 0 0 1 8 8" className="spin" />
  </Svg>
)
export const IconUpload = (p: P) => (
  <Svg {...p}>
    <path d="M12 16V4M7 9l5-5 5 5M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
  </Svg>
)
