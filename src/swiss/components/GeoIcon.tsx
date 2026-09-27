import type { ReactNode, SVGProps } from 'react'

/**
 * Soyut, kalın çizgili geometrik ikonlar. 24×24 ızgara, 3px çizgi,
 * kare uç ve sivri köşe. Dolgulu şekiller tam kare ve tam dairedir.
 */
const PATHS = {
  'arrow-right': (
    <>
      <path d="M3 12h16" />
      <path d="M13 5.5 19.5 12 13 18.5" />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d="M5.5 18.5 18 6" />
      <path d="M8 5h11v11" />
    </>
  ),
  'arrow-down': (
    <>
      <path d="M12 3v16" />
      <path d="M5.5 13 12 19.5 18.5 13" />
    </>
  ),
  plus: <path d="M12 4v16M4 12h16" />,
  close: <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />,
  menu: <path d="M3 8h18M3 16h18" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5.5 5.5" />
    </>
  ),
  grid: <path d="M3.5 3.5h17v17h-17zM9.2 3.5v17M14.8 3.5v17" />,
  download: <path d="M12 3v12M6.5 9.5 12 15l5.5-5.5M4 20.5h16" />,
  play: <path d="M6 3.5 20 12 6 20.5z" fill="currentColor" stroke="none" />,
  circle: <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />,
  square: <path d="M3 3h18v18H3z" fill="currentColor" stroke="none" />,
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof PATHS
export const ICON_NAMES = Object.keys(PATHS) as IconName[]

type Props = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName
  size?: number
  /** Verilirse ikon erişilebilir bir ada sahip olur; verilmezse dekoratiftir. */
  title?: string
}

export function GeoIcon({ name, size = 24, title, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="square"
      strokeLinejoin="miter"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  )
}
