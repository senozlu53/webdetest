import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { useGorunur } from './hooks'

/** Görününce çok yavaş solarak beliren sarmalayıcı (Madde 16). Yalnız opaklık; hiçbir şey yer değiştirmez */
export function Belir({ children, className, gecikme = 0, sure, as: Tag = 'div' }: { children: ReactNode; className?: string; gecikme?: number; sure?: number; as?: 'div' | 'li' | 'section' | 'p' | 'article' | 'figure' }) {
  const [ref, g] = useGorunur<HTMLElement>(0.08)
  const T = Tag as 'div'
  return (
    <T ref={ref as never} className={cx('belir', className)} data-goruldu={g ? '' : undefined} style={{ ['--belir-gecikme' as string]: `${gecikme}ms`, ...(sure ? { ['--belir-sure' as string]: `${sure}ms` } : {}) } as CSSProperties}>
      {children}
    </T>
  )
}
