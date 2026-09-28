import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { Ton } from '../lib/data'

export type Boyut = 'xs' | 's' | 'm' | 'l' | 'xl'
const BOY: Record<Boyut, string> = { xs: 'text-xs', s: 'text-s', m: 'text-m', l: 'text-l', xl: 'text-xl' }

/**
 * Madde 5 · 14: <ArcadeText>. Press Start 2P, boyut hep 8'in katı (glif pikseli tam sayı).
 * neon: bulanık hale yerine basamaklı çerçeve ve blok gölge. sapma: kromatik sapma (kırmızı sol, camgöbeği sağ).
 * yanip: "Insert Coin" gibi yanıp söner (1 ya da 2 Hz); hareket kapalıysa sabit durur.
 */
export function ArcadeText({ as, boyut = 'm', ton, neon, sapma, yanip, hz = 1, className, style, children, id, lang }: { as?: ElementType; boyut?: Boyut; ton?: Ton; neon?: boolean; sapma?: boolean; yanip?: boolean; hz?: 1 | 2; className?: string; style?: CSSProperties; children: ReactNode; id?: string; lang?: string }) {
  const Tag = (as ?? 'span') as ElementType
  return (
    <Tag id={id} lang={lang} data-ton={ton} data-hz={yanip && hz === 2 ? '2' : undefined} className={cx('font-ps leading-[1.5] uppercase', BOY[boyut], ton ? 'text-tx' : '', neon && 'neon', sapma && 'sapma', yanip && 'blink', className)} style={style}>
      {children}
    </Tag>
  )
}
