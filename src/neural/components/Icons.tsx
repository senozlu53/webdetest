import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
function Svg({ size = 20, children, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      {children}
    </svg>
  )
}

/* ── Madde 9: beyin, sinir ağı, kıvılcım, işlemci ağacı ── */
export const IconBrain = (p: P) => (
  <Svg {...p}>
    <path d="M9.5 4.5a2.5 2.5 0 0 0-4.6 1.3A3 3 0 0 0 3.5 11a3 3 0 0 0 1 4.9 2.8 2.8 0 0 0 4.9 2.3A2.4 2.4 0 0 0 12 19.5V5.3a2.4 2.4 0 0 0-2.5-.8z" />
    <path d="M14.5 4.5a2.5 2.5 0 0 1 4.6 1.3 3 3 0 0 1 1.4 5.2 3 3 0 0 1-1 4.9 2.8 2.8 0 0 1-4.9 2.3A2.4 2.4 0 0 1 12 19.5" />
    <path d="M12 9h2.2M12 13.5h-2.4M15.5 11.2h1.6M8 8.5h1" />
    <circle cx="14.8" cy="9" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="9" cy="13.5" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
)
export const IconNetwork = (p: P) => (
  <Svg {...p}>
    <circle cx="5" cy="6" r="2" />
    <circle cx="5" cy="18" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="6" r="2" />
    <circle cx="19" cy="18" r="2" />
    <path d="M7 6.6c2 .6 2.8 2.8 3.4 4.2M7 17.4c2-.6 2.8-2.8 3.4-4.2M14 11.2c1.2-1.6 2-3.8 3.1-4.6M14 12.8c1.2 1.6 2 3.8 3.1 4.6" />
  </Svg>
)
export const IconSparkles = (p: P) => (
  <Svg {...p}>
    <path d="M10 3.5l1.6 4.4a2 2 0 0 0 1.2 1.2L17 10.6l-4.2 1.5a2 2 0 0 0-1.2 1.2L10 17.5l-1.6-4.2a2 2 0 0 0-1.2-1.2L3 10.6l4.2-1.5a2 2 0 0 0 1.2-1.2z" />
    <path d="M18 3v3.5M16.2 4.8h3.6M19 16v3M17.5 17.5h3" />
  </Svg>
)
export const IconProcessorTree = (p: P) => (
  <Svg {...p}>
    <rect x="8.5" y="2.5" width="7" height="6" rx="1.5" />
    <path d="M10.5 1v1.5M13.5 1v1.5M10.5 8.5V10M13.5 8.5V10" />
    <path d="M12 10v2.5M5 16v-1.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2V16M12 12.5V16" />
    <rect x="2.5" y="16" width="5" height="5" rx="1.2" />
    <rect x="9.5" y="16" width="5" height="5" rx="1.2" />
    <rect x="16.5" y="16" width="5" height="5" rx="1.2" />
  </Svg>
)

export const IconCloud = (p: P) => (
  <Svg {...p}>
    <path d="M7 18.5h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.5 9.1 4.7 4.7 0 0 0 7 18.5z" />
  </Svg>
)
export const IconChip = (p: P) => (
  <Svg {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
  </Svg>
)
export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
)
export const IconX = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)
export const IconMinus = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
)
export const IconPlus = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
export const IconFit = (p: P) => (
  <Svg {...p}>
    <path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" />
  </Svg>
)
export const IconPlay = (p: P) => (
  <Svg {...p}>
    <path d="M7.5 5.2v13.6a.7.7 0 0 0 1.05.6l11.2-6.8a.7.7 0 0 0 0-1.2L8.55 4.6a.7.7 0 0 0-1.05.6z" fill="currentColor" stroke="none" />
  </Svg>
)
export const IconPause = (p: P) => (
  <Svg {...p}>
    <rect x="6.5" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none" />
    <rect x="14" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none" />
  </Svg>
)
export const IconStep = (p: P) => (
  <Svg {...p}>
    <path d="M5.5 5.8v12.4a.6.6 0 0 0 .9.5l9.6-6.2a.6.6 0 0 0 0-1L6.4 5.3a.6.6 0 0 0-.9.5z" fill="currentColor" stroke="none" />
    <rect x="17" y="5" width="2.5" height="14" rx="1" fill="currentColor" stroke="none" />
  </Svg>
)
export const IconReset = (p: P) => (
  <Svg {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4 4.5v4h4" />
  </Svg>
)
export const IconSearch = (p: P) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4 4" />
  </Svg>
)
export const IconChevron = (p: P) => (
  <Svg {...p}>
    <path d="M7 10l5 5 5-5" />
  </Svg>
)
export const IconWarning = (p: P) => (
  <Svg {...p}>
    <path d="M10.3 4.2L2.9 17.5A2 2 0 0 0 4.6 20.5h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
    <path d="M12 9.5v4M12 16.8v.2" />
  </Svg>
)
export const IconTool = (p: P) => (
  <Svg {...p}>
    <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14" />
  </Svg>
)
export const IconLayers = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.5l9 4.8-9 4.8-9-4.8z" />
    <path d="M3 12.2l9 4.8 9-4.8M3 16.2l9 4.8 9-4.8" />
  </Svg>
)
export const IconSettings = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
    <circle cx="15" cy="7" r="2" />
    <circle cx="9" cy="17" r="2" />
  </Svg>
)
export const IconSkip = (p: P) => (
  <Svg {...p}>
    <path d="M7 12h10" />
  </Svg>
)
export const IconTable = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M3.5 14.5h17M9.5 9.5v10" />
  </Svg>
)
export const IconCopy = (p: P) => (
  <Svg {...p}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
  </Svg>
)
export const IconArrowRight = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)
