import { useId, type InputHTMLAttributes } from 'react'
import { cx } from '../../shared/cx'

/** Açma/kapama: gömülü hap oluk, kabartma düğme; yaylı hareket. Açıkken oluk vurgu renginde. */
export function NeuSwitch({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-5">
      <span className="flex flex-col">
        <span id={`${id}-l`} className="font-bold">
          {label}
        </span>
        {description ? <span className="text-sm text-muted">{description}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-l`}
        onClick={() => onChange(!checked)}
        className="neu neu-inset relative h-10 w-[72px] shrink-0 cursor-pointer rounded-full"
      >
        <span
          aria-hidden="true"
          className={cx('absolute inset-y-[5px] left-[5px] w-[calc(50%-5px)] rounded-full transition-opacity duration-200', checked ? 'bg-accent opacity-25' : 'opacity-0')}
        />
        <span
          aria-hidden="true"
          className={cx(
            'neu neu-raised-sm neu-convex absolute top-1 left-1 grid size-8 place-items-center rounded-full transition-transform duration-500 ease-spring',
            checked && 'translate-x-8',
          )}
        >
          <span className={cx('size-2 rounded-full transition-colors duration-200', checked ? 'bg-accent' : 'bg-neu-lo')} />
        </span>
      </button>
    </div>
  )
}

/** Segment seçici: gömülü oluk içinde seçili segment kabarır. */
export function NeuSegmented<T extends string>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="neu neu-inset flex w-fit max-w-full flex-wrap gap-1 rounded-[28px] p-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cx(
            'min-h-11 cursor-pointer rounded-full border border-transparent px-4 text-sm font-bold transition-[box-shadow,color] duration-300',
            value === o ? 'neu neu-raised-sm text-accent' : 'text-muted hover:text-ink',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

/** Gömülü metin alanı */
export function NeuInput({ label, id, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string; id: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="pl-5 text-sm font-bold">
        {label}
      </label>
      <input
        id={id}
        className={cx('neu neu-inset h-14 w-full rounded-full px-5 text-base font-semibold text-ink placeholder:font-normal placeholder:text-muted', className)}
        {...rest}
      />
    </div>
  )
}

/** Doğrusal kaydırıcı: yerel <input type="range">, gömülü oluk ve kabartma tutamak (bkz. neu.css) */
export function NeuRange({ label, className, style, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = useId()
  const min = Number(rest.min ?? 0)
  const max = Number(rest.max ?? 100)
  const fill = ((Number(rest.value ?? min) - min) / (max - min || 1)) * 100
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input id={id} type="range" className="neu-range" style={{ ['--fill' as string]: `${fill}%`, ...style }} {...rest} />
    </div>
  )
}
