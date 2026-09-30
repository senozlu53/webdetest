import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { IkonAd } from '../lib/data'

const A = 'var(--vurgu)'
const B = 'var(--vurgu-2)'

/** Madde 9: keskin hatlı, askeri ve endüstriyel simgeler. Düz çizgi, sivri köşe, kare uç; vurgu dolguları sayfa vurgusunu izler. */
const D: Record<IkonAd, ReactNode> = {
  nisangah: (
    <>
      <path d="M15 6H33L42 15V33L33 42H15L6 33V15Z" />
      <path d="M24 1V15M24 33V47M1 24H15M33 24H47" />
      <path d="M24 19L29 24L24 29L19 24Z" fill={A} stroke="none" />
    </>
  ),
  kalkan: (
    <>
      <path d="M24 3L42 9V24L24 45L6 24V9Z" />
      <path d="M24 12L34 15.500V23L24 35L14 23V15.500Z" fill={A} stroke="none" />
      <path d="M24 12V35" stroke="#0d0e12" strokeWidth={2} />
    </>
  ),
  fuze: (
    <>
      <path d="M24 2L32 14V33H16V14Z" />
      <path d="M16 24L8 34V41L16 37M32 24L40 34V41L32 37" />
      <path d="M20 37H28L24 47Z" fill={B} stroke="none" />
      <path d="M24 2L32 14H16Z" fill={A} stroke="none" />
      <path d="M20 22H28" />
    </>
  ),
  drone: (
    <>
      <path d="M19 19H29V29H19Z" />
      <path d="M19 19L10 10M29 19L38 10M19 29L10 38M29 29L38 38" />
      <path d="M3 3H15V15H3Z M33 3H45V15H33Z M3 33H15V45H3Z M33 33H45V45H33Z" fill={A} stroke="none" />
      <path d="M22.500 22.500H25.500V25.500H22.500Z" fill={B} stroke="none" />
    </>
  ),
  radar: (
    <>
      <path d="M24 3L42 13.500V34.500L24 45L6 34.500V13.500Z" />
      <path d="M24 13L33 18.500V29.500L24 35L15 29.500V18.500Z" />
      <path d="M24 24L38 12" stroke={A} strokeWidth={3} />
      <path d="M31 30L36 33" stroke={B} />
      <path d="M22 22H26V26H22Z" fill={A} stroke="none" />
    </>
  ),
  mermi: (
    <>
      <path d="M24 3L33 17V44H15V17Z" />
      <path d="M24 3L33 17H15Z" fill={A} stroke="none" />
      <path d="M15 34H33M15 39H33" />
    </>
  ),
  zirh: (
    <>
      <path d="M14 5L24 9L34 5L43 14L38 22V43H10V22L5 14Z" />
      <path d="M24 9V43" />
      <path d="M14 26H21V34H14Z M27 26H34V34H27Z" fill={A} stroke="none" />
      <path d="M17 14L24 18L31 14" />
    </>
  ),
  simsek: (
    <>
      <path d="M29 3L9 27H22L18 45L39 20H26Z" fill={A} stroke="currentColor" strokeWidth={2} />
    </>
  ),
  kupa: (
    <>
      <path d="M13 5H35V19L29 27H19L13 19Z" />
      <path d="M13 9H5V17L13 21M35 9H43V17L35 21" />
      <path d="M24 27V36M15 43H33V36H15Z" fill={A} stroke="none" />
      <path d="M19 12H29" stroke={B} />
    </>
  ),
  kumanda: (
    <>
      <path d="M9 15H39L46 33L40 41H32L28 34H20L16 41H8L2 33Z" />
      <path d="M13 22V30M9 26H17" />
      <path d="M31 21H35V25H31Z M36 26H40V30H36Z" fill={A} stroke="none" />
    </>
  ),
  kulaklik: (
    <>
      <path d="M8 27V22L14 8H34L40 22V27" />
      <path d="M5 27H15V41H5Z M33 27H43V41H33Z" fill={A} stroke="none" />
      <path d="M43 41L39 46H27" />
    </>
  ),
  monitor: (
    <>
      <path d="M3 7H45V33H3Z" />
      <path d="M17 41H31M24 33V41" />
      <path d="M8 27L17 13H23L14 27Z" fill={A} stroke="none" />
      <path d="M28 27L34 18H38L32 27Z" fill={B} stroke="none" />
    </>
  ),
  islemci: (
    <>
      <path d="M11 11H37V37H11Z" />
      <path d="M19 19H29V29H19Z" fill={A} stroke="none" />
      <path d="M17 3V11M24 3V11M31 3V11M17 37V45M24 37V45M31 37V45M3 17H11M3 24H11M3 31H11M37 17H45M37 24H45M37 31H45" />
    </>
  ),
  yayin: (
    <>
      <path d="M24 19L29 24L24 29L19 24Z" fill={A} stroke="none" />
      <path d="M14 14L8 24L14 34M34 14L40 24L34 34" />
      <path d="M7 6L1 24L7 42M41 6L47 24L41 42" stroke={B} />
    </>
  ),
  rutbe: (
    <>
      <path d="M6 20L24 8L42 20" stroke={A} strokeWidth={3.5} />
      <path d="M6 30L24 18L42 30" />
      <path d="M6 40L24 28L42 40" />
    </>
  ),
  granat: (
    <>
      <path d="M16 17H32L40 27V37L32 45H16L8 37V27Z" />
      <path d="M20 17V10H28V17M28 10L38 8L41 14" />
      <path d="M8 31H40" stroke={A} strokeWidth={3} />
      <path d="M24 34L27 37L24 40L21 37Z" fill={A} stroke="none" />
    </>
  ),
}

export function Ikon({ ad, boy = 48, baslik, className }: { ad: IkonAd; boy?: number | string; baslik?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={boy}
      height={boy}
      className={cx('oyun-ikon', className)}
      data-ikon={ad}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinejoin="miter"
      strokeLinecap="square"
      role={baslik ? 'img' : undefined}
      aria-label={baslik}
      aria-hidden={baslik ? undefined : 'true'}
      focusable="false"
    >
      {D[ad]}
    </svg>
  )
}
