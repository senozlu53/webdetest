import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { useRandomRotation } from '../lib/rastgele'
import type { Ton } from '../lib/data'

const ZEMIN: Record<Ton, string> = { sari: 'bg-yellow', camgobegi: 'bg-teal', pembe: 'on-pink', beyaz: 'bg-paper', lacivert: 'bg-ink text-paper' }
const GOLGE: Record<Ton | 'lacivert', string> = { sari: 'var(--yellow)', camgobegi: 'var(--teal)', pembe: 'var(--pink)', beyaz: 'var(--paper)', lacivert: 'var(--shadow)' }

type Props<T extends ElementType> = {
  as?: T
  /** Hook anahtarı: aynı anahtar aynı açıyı alır */
  kimlik: string
  ton?: Ton
  golgeTon?: Ton
  /** En büyük dönüş açısı (derece); 0 düz */
  aci?: number
  /** Üstüne gelince yayla düzelir ve büyür */
  oyuncak?: boolean
  /** Renk kodu (desen modunda desen taşır) */
  kod?: 'sari' | 'camgobegi' | 'pembe'
  className?: string
  style?: CSSProperties
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'style' | 'children'>

/**
 * Madde 11 · 14: <MemphisCard>. Kalın kontur, katı gölge (bulanıklık 0), useRandomRotation'dan gelen eğiklik.
 * Kart gölgesi lacivert ya da renkli olabilir; zemin rengi ne olursa olsun yazı en yüksek kontrastlı çiftte kalır.
 */
export function MemphisCard<T extends ElementType = 'div'>({ as, kimlik, ton = 'beyaz', golgeTon = 'lacivert', aci = 3, oyuncak = true, kod, className, style, children, ...rest }: Props<T>) {
  const Tag = (as ?? 'div') as ElementType
  const r = useRandomRotation(kimlik, { max: aci, min: aci ? Math.min(1.2, aci) : 0 })
  return (
    <Tag className={cx('mcard', ZEMIN[ton], className)} data-oyuncak={oyuncak ? '' : undefined} data-kod={kod} data-aci={aci ? r : 0} style={{ ['--r' as string]: `${aci ? r : 0}deg`, ['--cs' as string]: GOLGE[golgeTon], ...style }} {...rest}>
      {children}
    </Tag>
  )
}
