import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { cx } from '../../shared/cx'

type Props = { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; className?: string }

/**
 * Şişkin geçiş anahtarı. İz gömülü bir kuyudur, topuz şişkin bir kil top; yaylı eğriyle
 * karşıya zıplar. Durum yalnız renkle verilmez: topuzda onay ya da çarpı işareti vardır.
 */
export function ClayToggle({ checked, onChange, label, description, className }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cx('group flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 rounded-soft text-left', className)}
    >
      <span className="flex flex-col">
        <span className="font-bold">{label}</span>
        {description ? <span className="text-[15px] text-muted">{description}</span> : null}
      </span>
      <span
        aria-hidden="true"
        className={cx('clay-well clay-md relative h-11 w-[78px] shrink-0 rounded-max transition-colors duration-300', checked && 'bg-primary!')}
      >
        <span
          className={cx(
            'clay clay-sm tone-base absolute top-1 left-1 grid size-9 place-items-center rounded-max transition-transform duration-(--spring-dur) ease-(--spring) motion-reduce:duration-1',
            checked ? 'translate-x-[34px]' : 'translate-x-0',
          )}
        >
          {checked ? <CheckIcon size={18} weight="bold" className="text-accent" /> : <XIcon size={16} weight="bold" className="text-muted" />}
        </span>
      </span>
    </button>
  )
}
