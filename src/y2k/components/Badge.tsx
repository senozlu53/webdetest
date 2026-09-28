import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { Tone } from '../lib/store'

/** Madde 11: yüksek kontrastlı rozet. Parlak kapsül; metin zeminin zıttı (siyah, morda beyaz) */
export function Badge({ ton = 'candy', children, className }: { ton?: Tone; children: ReactNode; className?: string }) {
  return <span className={cx(ton, 'inline-flex items-center gap-1 rounded-full border border-[#2b3445]/55 px-3 py-1 font-logo text-[10.5px] leading-none tracking-[0.08em] uppercase', className)}>{children}</span>
}
