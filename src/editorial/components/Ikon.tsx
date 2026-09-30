import { cx } from '../../shared/cx'
import type { IkonAd } from '../lib/data'

/** Madde 9: 1,25 piksellik çizgi, kare uçlu, sivri köşeli. Boyut değişse de çizgi kalınlığı sabit kalır (non-scaling-stroke) */
const YOL: Record<IkonAd, string> = {
  'ok-sag': 'M3 12H21M14 5L21 12L14 19',
  'ok-sol': 'M21 12H3M10 5L3 12L10 19',
  'ok-yukari': 'M12 21V3M5 10L12 3L19 10',
  'ok-asagi': 'M12 3V21M5 14L12 21L19 14',
  'ok-capraz': 'M6 18L18 6M8 6H18V16',
  arti: 'M12 4V20M4 12H20',
  eksi: 'M4 12H20',
  kapat: 'M5 5L19 19M19 5L5 19',
  ayrac: 'M5 9L12 16L19 9',
  yildiz: 'M12 3V21M4.2 7.5L19.8 16.5M19.8 7.5L4.2 16.5',
  dis: 'M14 4H20V10M20 4L11 13M18 14V20H4V6H10',
  izgara: 'M4 4H20V20H4ZM12 4V20M4 12H20',
  sayfa: 'M6 3H18V21H6ZM9 8H15M9 12H15M9 16H13',
  kolon: 'M4 4H20V20H4ZM9.33 4V20M14.67 4V20',
}

export function Ikon({ ad, className, boyut }: { ad: IkonAd; className?: string; boyut?: number | string }) {
  return (
    <svg viewBox="0 0 24 24" className={cx('ikon', className)} style={boyut ? { width: boyut, height: boyut } : undefined} aria-hidden="true" focusable="false" data-ikon={ad}>
      <path d={YOL[ad]} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
