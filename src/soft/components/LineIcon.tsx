import type { ReactNode, SVGProps } from 'react'

/**
 * İnce çizgi ikonlar: 24×24 ızgara, 1.5px çizgi, yuvarlak uç ve köşe.
 * Dolgu yoktur; biçimler dostane ve yumuşaktır.
 */
const PATHS = {
  leaf: (
    <>
      <path d="M5 19c0-8.3 5.2-13.4 14-14 .3 8.9-5.3 14-14 14Z" />
      <path d="M5 19c3.2-3.6 6.2-6.4 9.5-8.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </>
  ),
  moon: <path d="M19.5 14.6A7.8 7.8 0 0 1 9.4 4.5a7.8 7.8 0 1 0 10.1 10.1Z" />,
  wind: <path d="M3 9h10.5a3 3 0 1 0-3-3M3 15h14.5a3 3 0 1 1-3 3M3 12h6" />,
  drop: <path d="M12 3.5c3.6 4.3 6 7.6 6 10.6a6 6 0 0 1-12 0c0-3 2.4-6.3 6-10.6Z" />,
  heart: <path d="M12 19.5s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.3c0 5.6-7.5 10.2-7.5 10.2Z" />,
  home: <path d="M4 10.8 12 4l8 6.8V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9v5.5H5.5A1.5 1.5 0 0 1 4 19v-8.2Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  bag: (
    <>
      <path d="M5.5 8.5h13l-1 11a1.5 1.5 0 0 1-1.5 1.4H8a1.5 1.5 0 0 1-1.5-1.4l-1-11Z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="3.5" />
      <path d="M4 10.5h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  sparkle: <path d="M12 3.5c.7 4.2 2.3 5.8 6.5 6.5-4.2.7-5.8 2.3-6.5 6.5-.7-4.2-2.3-5.8-6.5-6.5 4.2-.7 5.8-2.3 6.5-6.5Z" />,
  'arrow-right': <path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5" />,
  check: <path d="m5.5 12.5 4 4 9-9" />,
  play: <path d="M8 5.8v12.4a1 1 0 0 0 1.5.9l9.8-6.2a1 1 0 0 0 0-1.7L9.5 4.9A1 1 0 0 0 8 5.8Z" />,
  pause: <path d="M9 5.5v13M15 5.5v13" />,
  bell: (
    <>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15l1.5-2Z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type LineIconName = keyof typeof PATHS

type Props = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: LineIconName
  size?: number
  title?: string
}

export function LineIcon({ name, size = 24, title, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  )
}
