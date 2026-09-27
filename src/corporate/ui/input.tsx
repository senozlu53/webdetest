import type { ComponentProps } from 'react'
import { cn } from '../lib/utils'

/**
 * Metin alanı. Kenar Slate 500: beyazda 4.76:1 (WCAG 1.4.11).
 * Durumlar: odak (mavi çerçeve), hata (aria-invalid), başarı (data-valid), devre dışı.
 */
export function Input({ className, type = 'text', ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-11 w-full min-w-0 rounded-md border border-input bg-card px-3 text-sm text-foreground transition-[border-color,box-shadow] duration-150 ease-out',
        'placeholder:text-muted-foreground',
        'focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring',
        'aria-invalid:border-error-border aria-invalid:border-2 aria-invalid:px-[11px] focus-visible:aria-invalid:outline-error-border',
        'data-[valid=true]:border-success-border',
        'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}
