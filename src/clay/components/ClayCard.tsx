import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import { clayClass, type Tone, type Volume } from './types'
import { cx } from '../../shared/cx'

type Props = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'section' | 'li' | 'figure'
  tone?: Tone
  volume?: Volume
  /** Havada asılı durur: dış kap yavaşça süzülür, kart ayrı katmanda kalır (basınca sönebilsin diye). */
  float?: boolean
  tilt?: number
  children?: ReactNode
}

/** Şişirilmiş kil yüzey. Üç gölge `volume` boyutundaki d biriminden türer. */
export function ClayCard({ as = 'div', tone = 'base', volume = 'lg', float, tilt = 0, className, children, ...rest }: Props) {
  const Component = as as ElementType
  const card = (
    <Component className={cx(clayClass(tone, volume), 'rounded-clay', className)} {...rest}>
      {children}
    </Component>
  )
  if (!float) return card
  return (
    <div className="clay-float" style={{ '--tilt': `${tilt}deg` } as CSSProperties}>
      {card}
    </div>
  )
}
