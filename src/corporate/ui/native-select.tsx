import type { ComponentProps } from 'react'
import { CaretDownIcon } from '@phosphor-icons/react'
import { cn } from '../lib/utils'

/** Yerel <select>: ekran okuyucu ve mobil klavye desteği tarayıcıdan gelir. */
export function NativeSelect({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <span className="relative flex">
      <select
        data-slot="native-select"
        className={cn(
          'h-11 w-full cursor-pointer appearance-none rounded-md border border-input bg-card pr-10 pl-3 text-sm text-foreground transition-[border-color] duration-150',
          'focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring',
          'aria-invalid:border-2 aria-invalid:border-error-border aria-invalid:pl-[11px]',
          'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <CaretDownIcon size={16} aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" />
    </span>
  )
}
