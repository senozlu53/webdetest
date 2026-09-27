import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

/** Durum rozeti. Renk tek başına anlam taşımaz: her rozet ikon + metinle kullanılır. */
const badgeVariants = cva(
  'inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-2 py-0.5 text-xs font-medium [&_svg]:size-3.5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        success: 'bg-(--badge-success-bg) text-(--badge-success-fg)',
        info: 'bg-(--badge-info-bg) text-(--badge-info-fg)',
        warning: 'bg-(--badge-warning-bg) text-(--badge-warning-fg)',
        danger: 'bg-(--badge-danger-bg) text-(--badge-danger-fg)',
        neutral: 'bg-(--badge-neutral-bg) text-(--badge-neutral-fg)',
        outline: 'border border-border text-foreground',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

export function Badge({ className, variant, ...props }: ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}
