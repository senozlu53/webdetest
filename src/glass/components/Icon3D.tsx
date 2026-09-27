import type { ComponentType } from 'react'
import type { IconProps } from '@phosphor-icons/react'

/** Parlak, hacimli ikon karosu: degrade gövde, üst parlama, iç gölge. */
export function Icon3D({ Icon, from, to, label }: { Icon: ComponentType<IconProps>; from: string; to: string; label?: string }) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-[20px] text-white"
      style={{
        backgroundImage: `radial-gradient(120% 90% at 30% 15%, rgb(255 255 255 / 0.55), transparent 45%), linear-gradient(145deg, ${from}, ${to})`,
        boxShadow: `inset 0 1px 1px rgb(255 255 255 / 0.7), inset 0 -6px 12px rgb(0 0 0 / 0.18), 0 14px 28px -10px ${to}`,
      }}
    >
      <Icon size={30} weight="fill" style={{ filter: 'drop-shadow(0 2px 3px rgb(0 0 0 / 0.25))' }} />
    </span>
  )
}
