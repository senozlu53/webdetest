import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { IkonAd } from '../lib/data'

const A = 'var(--vurgu-2)'

/** Madde 9: kafatası, zincir, mühür, haç ve gotik simgeler. 48 birimlik ızgara, 2,5 çizgi, sivri uçlar; dolgular sayfa vurgusunu izler. */
const D: Record<IkonAd, ReactNode> = {
  kafatasi: (
    <>
      <path d="M10 22C10 12.500 16.200 5.500 24 5.500S38 12.500 38 22c0 4.500-2.200 7.600-5 9.400V38a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2v-6.600C12.200 29.600 10 26.500 10 22Z" />
      <path d="M14.500 22c0-2.800 2-4.800 4.600-4.800s4.600 2 4.600 4.800-2 4.300-4.600 4.300-4.600-1.500-4.600-4.300ZM24.300 22c0-2.800 2-4.800 4.600-4.800s4.600 2 4.600 4.800-2 4.300-4.600 4.300-4.600-1.500-4.600-4.300Z" fill="currentColor" stroke="none" />
      <path d="M24 27.500l-2.400 4h4.800Z" fill="currentColor" stroke="none" />
      <path d="M20.500 40v-5M24 40v-5M27.500 40v-5" />
    </>
  ),
  zincir: (
    <g transform="rotate(45 24 24)">
      <rect x="16" y="1.500" width="16" height="21" rx="8" />
      <rect x="21" y="15" width="6" height="18" rx="3" stroke={A} />
      <rect x="16" y="25.500" width="16" height="21" rx="8" />
    </g>
  ),
  muhur: (
    <>
      <circle cx="24" cy="24" r="19" />
      <circle cx="24" cy="24" r="14" />
      <circle cx="24" cy="24" r="16.500" strokeDasharray="0.1 4.210" strokeLinecap="round" strokeWidth={3} />
      <path d="M24 14v20M16.500 21.500h15" stroke={A} strokeWidth={3} />
    </>
  ),
  hac: (
    <>
      <path d="M20 3.500h8L26.500 16 39 14.500v8L26.500 21.500 28 44.500h-8l1.500-23-12.500 1v-8L21.500 16Z" />
      <path d="M24 14v22" stroke={A} strokeWidth={2} />
    </>
  ),
  mum: (
    <>
      <path d="M24 4.500c3.500 4.200 5.200 7 5.200 9.600a5.200 5.200 0 0 1-10.400 0c0-2.600 1.700-5.400 5.200-9.600Z" fill={A} stroke="none" />
      <path d="M24 19v3" />
      <path d="M17.500 22h13V40h-13Z" />
      <path d="M17.500 28c2 0 2.500 1 2.500 3.500s.500 4 2 4" />
      <path d="M12 40h24M14 44h20" />
    </>
  ),
  kemer: (
    <>
      <path d="M9 44V23C9 14 15.500 8 24 3c8.500 5 15 11 15 20v21Z" />
      <path d="M16 44V24c0-5 3.500-9 8-12.500 4.500 3.500 8 7.500 8 12.500v20" />
      <path d="M24 11.500V44M16 29h16" stroke={A} strokeWidth={2.2} />
    </>
  ),
  mizrak: (
    <g transform="rotate(45 24 24)">
      <path d="M24 0.500C29.500 6 30.500 12.500 29 19H19C17.500 12.500 18.500 6 24 0.500Z" fill={A} />
      <path d="M24 19v28.500" />
      <path d="M17 22l7 5 7-5" />
    </g>
  ),
  kilit: (
    <>
      <path d="M9.500 22h29V42.500h-29Z" />
      <path d="M15.500 22v-6.500a8.500 8.500 0 0 1 17 0V22" />
      <circle cx="24" cy="30.500" r="3.200" fill={A} stroke="none" />
      <path d="M24 32.500v5.500" strokeWidth={3} />
    </>
  ),
  anahtar: (
    <>
      <circle cx="14.500" cy="14.500" r="9" />
      <circle cx="14.500" cy="14.500" r="3.500" fill={A} stroke="none" />
      <path d="M21 21l22 22M34 34l5.500-5.500M39.500 39.500l4-4" />
    </>
  ),
  kitap: (
    <>
      <path d="M11 4.500h25a2.500 2.500 0 0 1 2.500 2.500v33H14a3 3 0 0 1-3-3Z" />
      <path d="M11 37a3 3 0 0 1 3-3h24.500M14 39.500h24.500v4H14a3 3 0 0 1-3-3" />
      <path d="M24.500 10.500v16M18.500 16.500h12" stroke={A} strokeWidth={3} />
    </>
  ),
  kuzgun: (
    <>
      <path d="M5 38c6-3 10-9 14-15 3-4.500 7-7.500 12-8l1.500-4.500 3.500 4.500 8 1-8 3.500c.500 8-4 14.500-11.500 17l3 7.500h-3.500L21 40c-5 .500-10 .500-16-2Z" fill="currentColor" fillOpacity="0.3" />
      <circle cx="34" cy="15.500" r="1.400" fill={A} stroke="none" />
      <path d="M13 32c5 .500 9-1.500 12-5.500" />
    </>
  ),
  damla: (
    <>
      <path d="M24 3.500C17.500 12.500 10.500 20 10.500 29.500a13.500 13.500 0 0 0 27 0C37.500 20 30.500 12.500 24 3.500Z" />
      <path d="M17 30.500a7.500 7.500 0 0 0 5.500 7" stroke={A} strokeWidth={3} />
    </>
  ),
  hancer: (
    <>
      <path d="M24 2.500l5 24H19Z" />
      <path d="M11 26.500h26" strokeWidth={4} />
      <path d="M24 30.500V39" strokeWidth={4} />
      <circle cx="24" cy="42.500" r="3" fill={A} stroke="none" />
      <path d="M24 8v14" stroke={A} strokeWidth={1.6} />
    </>
  ),
  can: (
    <>
      <path d="M24 5c-8 0-12.500 6.500-12.500 15v7.500L7 34h34l-4.500-6.500V20C36.500 11.500 32 5 24 5Z" />
      <path d="M24 5V2M18.500 38.500a5.500 5.500 0 0 0 11 0" />
      <path d="M16 19v7" stroke={A} strokeWidth={2.5} />
    </>
  ),
  ay: (
    <>
      <path d="M30 5a19 19 0 1 0 13 27A15.500 15.500 0 0 1 30 5Z" />
      <path d="M35.500 11l1.600 3.300 3.400 1.600-3.400 1.600-1.600 3.400-1.600-3.400-3.400-1.600 3.400-1.600Z" fill={A} stroke="none" />
    </>
  ),
  tabut: (
    <>
      <path d="M18 3.500h12l9.500 12.500L33 44.500H15L8.500 16Z" />
      <path d="M24 15v18M18.500 21h11" stroke={A} strokeWidth={3} />
    </>
  ),
}

export function Ikon({ ad, boy = 48, baslik, className }: { ad: IkonAd; boy?: number | string; baslik?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={boy}
      height={boy}
      className={cx('gt-ikon', className)}
      data-ikon={ad}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinejoin="miter"
      strokeLinecap="round"
      role={baslik ? 'img' : undefined}
      aria-label={baslik}
      aria-hidden={baslik ? undefined : 'true'}
      focusable="false"
    >
      {D[ad]}
    </svg>
  )
}
