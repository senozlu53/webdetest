import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { Vurgu } from '../lib/store'

export type Kesim = 'kose' | 'egik' | 'duz'
export type Yuzey = 'karbon' | 'celik' | 'plastik'

/**
 * <EsportsCard>: 45 derece kesik ya da eğik kenarlı kart (Madde 6 · 7 · 8).
 * Dış sarmalayıcı neon parlamayı ve keskin köşeli gölgeyi `filter: drop-shadow` ile kesik kenarı izleyerek çizer;
 * iç kart `clip-path` ile kesilir. Kenar çizgisi iki katmanlı arka plandır (kesik kenarda da kırılmaz).
 */
export function EsportsCard({
  kesim = 'kose',
  vurgu,
  yuzey = 'karbon',
  parlama = true,
  className,
  sarmal,
  children,
  as: Tag = 'div',
  ...rest
}: { kesim?: Kesim; vurgu?: Vurgu; yuzey?: Yuzey; parlama?: boolean; className?: string; sarmal?: string; children: ReactNode; as?: ElementType } & HTMLAttributes<HTMLElement>) {
  const T = Tag as 'div'
  return (
    <div className={cx('kart-w', sarmal)} data-parlama={parlama ? undefined : 'yok'} data-v={vurgu}>
      <T className={cx('kart', className)} data-kes={kesim} data-yuzey={yuzey} {...rest}>
        {children}
      </T>
    </div>
  )
}

/** Bölüm başlığının altındaki eğik şerit ayraç */
export function Ayrac({ className }: { className?: string }) {
  return <div className={cx('ayrac', className)} aria-hidden="true" data-ayrac="" />
}
