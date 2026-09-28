import { useMemo, type CSSProperties, type ReactNode } from 'react'
import { tornClip } from '../lib/shapes'
import { cx } from '../../shared/cx'

/** Madde 8: dergi kolajı — yırtık kenarlı kâğıt, isteğe bağlı bant */
export function Paper({ seed = 1, bg = 'var(--paper)', tape, className, style, children, r = 0 }: { seed?: number; bg?: string; tape?: boolean; className?: string; style?: CSSProperties; children?: ReactNode; r?: number }) {
  const clip = useMemo(() => tornClip(seed), [seed])
  return (
    <div className={cx('tilt relative', tape && 'tape', className)} style={{ ['--r' as string]: r, ...style }}>
      <div className="grain-box h-full" style={{ background: bg, clipPath: clip }}>
        {children}
      </div>
    </div>
  )
}
