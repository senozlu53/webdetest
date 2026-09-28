import type { CSSProperties } from 'react'
import { cx } from '../../shared/cx'

/**
 * Madde 9: neon tabela ikonları. Yalnız kontur (1,75px, yuvarlak uç), dolgu yok; parlama drop-shadow ile.
 * Her ikon tek sürekli çizgi gibi: bükülmüş cam tüp.
 */
export const IKON = {
  oynat: 'M8 5 L19 12 L8 19 Z',
  durdur: 'M8 5 V19 M16 5 V19',
  nota: 'M9 18 V5 L20 3 V16 M9 18 A3 3 0 1 1 3 18 A3 3 0 1 1 9 18 M20 16 A3 3 0 1 1 14 16 A3 3 0 1 1 20 16',
  kol: 'M6 9 H18 A4 4 0 0 1 22 13 V15 A3 3 0 0 1 17 17 L15 15 H9 L7 17 A3 3 0 0 1 2 15 V13 A4 4 0 0 1 6 9 Z M7 12 V14 M6 13 H8 M16 12.5 H16.01 M18 13.5 H18.01',
  kaset: 'M3 6 H21 V18 H3 Z M8 11 A1.5 1.5 0 1 0 8 11.01 M16 11 A1.5 1.5 0 1 0 16 11.01 M8 9.5 H16 M6 18 L8 15 H16 L18 18',
  resim: 'M3 5 H21 V19 H3 Z M3 15 L8 11 L12 14 L16 10 L21 14 M15 8 A1 1 0 1 0 15 8.01',
  gunes: 'M4 15 A8 8 0 0 1 20 15 M3 15 H21 M5 18 H19 M7 21 H17',
  palmiye: 'M12 21 C12 16 11 12 13 8 M13 8 C10 6 6 7 4 10 M13 8 C15 5 19 5 21 8 M13 8 C12 5 9 3 6 4 M13 8 C15 6 18 3 20 4',
  kalp: 'M12 20 C5 15 3 11 3 8 A4.5 4.5 0 0 1 12 6 A4.5 4.5 0 0 1 21 8 C21 11 19 15 12 20 Z',
  simsek: 'M13 2 L4 14 H11 L10 22 L20 9 H13 Z',
  dalga: 'M2 12 C4 6 6 6 8 12 S12 18 14 12 S18 6 20 12 L22 12',
  ayar: 'M4 7 H20 M4 17 H20 M9 4 V10 M15 14 V20',
  kapat: 'M6 6 L18 18 M18 6 L6 18',
  ok: 'M5 12 H19 M13 6 L19 12 L13 18',
  geri: 'M19 12 H5 M11 6 L5 12 L11 18',
  yildiz: 'M12 3 L14.8 9 L21 9.5 L16.2 13.6 L17.8 20 L12 16.5 L6.2 20 L7.8 13.6 L3 9.5 L9.2 9 Z',
  goz: 'M2 12 C5 6 19 6 22 12 C19 18 5 18 2 12 Z M12 9 A3 3 0 1 0 12 15 A3 3 0 1 0 12 9',
} as const
export type IkonAd = keyof typeof IKON

const RENK: Record<string, string> = { pink: '#ff00ff', cyan: '#00ffff', turuncu: '#ff8c00', metin: 'currentColor' }

export function Ikon({ ad, boyut = 24, renk = 'metin', parla = false, className, style, etiket }: { ad: IkonAd; boyut?: number; renk?: 'pink' | 'cyan' | 'turuncu' | 'metin'; parla?: boolean; className?: string; style?: CSSProperties; etiket?: string }) {
  const c = RENK[renk]
  return (
    <svg viewBox="0 0 24 24" width={boyut} height={boyut} className={cx('shrink-0 overflow-visible', className)} style={{ ...(parla ? { filter: `drop-shadow(0 0 var(--g1) ${c}) drop-shadow(0 0 var(--g2) ${c}) drop-shadow(0 0 var(--g3) ${c})` } : null), ...style }} role={etiket ? 'img' : undefined} aria-label={etiket} aria-hidden={etiket ? undefined : true} focusable="false">
      <path d={IKON[ad]} fill="none" stroke={c} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
