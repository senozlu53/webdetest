import { cx } from '../cx'

type Props = {
  /** Çizgi kalınlığı. Sistemde yalnızca 1px ve 2px kullanılır. */
  thickness?: '1px' | '2px'
  tone?: 'ink' | 'accent'
  className?: string
}

/** Bölümleri ve kartları ayıran düz, gölgesiz çizgi. */
export function ThickDivider({ thickness = '2px', tone = 'ink', className }: Props) {
  return (
    <hr
      className={cx('w-full', tone === 'accent' ? 'bg-accent' : 'bg-ink', className)}
      style={{ height: thickness }}
    />
  )
}
