import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cx } from '../../shared/cx'

/**
 * Madde 14: <RetroCard>. Gece yüzeyi, pembeden cyan'a gradyan neon kenar, hafif dış hale;
 * sol üstte ufka bakan üçgen. İçerik her zaman düz koyu yüzeyde: neon yalnız kenarda.
 */
export function RetroCard<T extends ElementType = 'div'>({ as, className, children, kose = true, ...rest }: { as?: T; className?: string; children?: ReactNode; kose?: boolean } & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>) {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag className={cx('rcard', className)} {...rest}>
      {kose ? (
        <svg className="pointer-events-none absolute -top-[2px] -left-[2px]" width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
          <path d="M0 0 H26 L0 26 Z" fill="var(--pink)" />
        </svg>
      ) : null}
      {children}
    </Tag>
  )
}
