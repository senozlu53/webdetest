import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cx } from '../../shared/cx'

export type BulutRenk = 'paper' | 'mint' | 'peach' | 'salmon' | 'rose'

/**
 * Madde 2 · 6 · 14: <CloudCard>. Kartın kendisi bulut: gövde 40px yarıçaplı, üst kenardan üç kabarık tepe taşar.
 * Gölge box-shadow değil drop-shadow: bulutun bütün silüetine düşer ve kartın renginin koyu tonundadır.
 * maskot yuvası Figma'daki "Maskot" instance'ının yeri: kartın sağ üst tepesinde oturur.
 */
export function CloudCard<T extends ElementType = 'div'>({
  as,
  renk = 'paper',
  maskot,
  className,
  children,
  ...rest
}: {
  as?: T
  renk?: BulutRenk
  maskot?: ReactNode
  className?: string
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>) {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag className={cx('bulut', className)} data-renk={renk === 'paper' ? undefined : renk} {...rest}>
      <span className="puf" aria-hidden="true" />
      {maskot ? (
        <div className="bulut-maskot" data-maskot-yuva="">
          {maskot}
        </div>
      ) : null}
      {children}
    </Tag>
  )
}
