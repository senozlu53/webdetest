import type { InputHTMLAttributes } from 'react'
import { cx } from '../../shared/cx'
import { LineIcon, type LineIconName } from './LineIcon'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  icon?: LineIconName
}

/** Hap formunda metin alanı. Kenar 1px, zeminde 3.83:1 (WCAG 1.4.11). */
export function PillInput({ id, label, icon, className, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="pl-6 text-small font-medium">
        {label}
      </label>
      <span className="relative flex items-center">
        {icon ? (
          <LineIcon name={icon} size={20} className="pointer-events-none absolute left-5 text-ink-soft" />
        ) : null}
        <input
          id={id}
          className={cx(
            'w-full rounded-pill border border-field bg-float-solid py-3.5 pr-6 text-body text-ink placeholder:text-ink-soft',
            'transition-[border-color,box-shadow] duration-400 ease-soft focus:border-gold-deep focus:shadow-soft',
            icon ? 'pl-13' : 'pl-6',
            className,
          )}
          {...rest}
        />
      </span>
    </div>
  )
}
