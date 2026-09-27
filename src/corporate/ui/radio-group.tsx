import type { ComponentProps } from 'react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { cn } from '../lib/utils'

export function RadioGroup({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('grid gap-3', className)} {...props} />
}

/** Kart biçimli seçenek: tüm kart tıklanabilir, 44px'ten yüksek. */
export function RadioCard({
  className,
  title,
  description,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item> & { title: string; description?: string }) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-card"
      className={cn(
        'group flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-input bg-card p-4 text-left transition-colors duration-150 hover:bg-accent',
        'data-[state=checked]:border-2 data-[state=checked]:border-brand data-[state=checked]:bg-row-selected data-[state=checked]:p-[15px]',
        className,
      )}
      {...props}
    >
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-input bg-card group-data-[state=checked]:border-brand">
        <RadioGroupPrimitive.Indicator className="size-2.5 rounded-full bg-brand" />
      </span>
      <span className="flex flex-col">
        <span className="font-medium">{title}</span>
        {description ? <span className="text-sm text-muted-foreground">{description}</span> : null}
      </span>
    </RadioGroupPrimitive.Item>
  )
}
