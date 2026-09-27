import { cx } from '../../shared/cx'

type Props = {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

/** Hap formunda anahtar. 400ms ease-in-out. */
export function Switch({ id, label, checked, onChange, description }: Props) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="flex flex-col">
        <span id={`${id}-label`} className="font-medium">
          {label}
        </span>
        {description ? <span className="text-small text-ink-soft">{description}</span> : null}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        onClick={() => onChange(!checked)}
        className={cx(
          'relative h-8 w-14 shrink-0 cursor-pointer rounded-pill border transition-colors duration-400 ease-soft',
          checked ? 'border-gold-deep bg-gold' : 'border-field bg-sand',
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            'absolute top-1 left-1 size-[22px] rounded-full bg-float-solid shadow-rest transition-transform duration-400 ease-soft',
            checked && 'translate-x-6',
          )}
        />
      </button>
    </div>
  )
}
