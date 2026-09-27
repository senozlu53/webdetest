import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react'
import { Slot } from 'radix-ui'
import { CheckCircleIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { Label } from './label'
import { cn } from '../lib/utils'

/**
 * shadcn/ui Form anatomisi: FormItem · FormLabel · FormControl · FormDescription · FormMessage.
 * shadcn sürümü react-hook-form'a bağlıdır; bu sürüm aynı API'yi kontrollü durumla kurar ve
 * id, aria-describedby ve aria-invalid bağlantılarını otomatik yapar.
 */
type FieldState = 'default' | 'error' | 'success'
type Ctx = { id: string; state: FieldState; message?: ReactNode; hasDescription: boolean }

const FormItemContext = createContext<Ctx | null>(null)

function useFormItem() {
  const ctx = useContext(FormItemContext)
  if (!ctx) throw new Error('Form alanları <FormItem> içinde kullanılmalı')
  return {
    ...ctx,
    controlId: `${ctx.id}-control`,
    descriptionId: `${ctx.id}-description`,
    messageId: `${ctx.id}-message`,
  }
}

type FormItemProps = ComponentProps<'div'> & {
  state?: FieldState
  /** Hata ya da başarı mesajı. */
  message?: ReactNode
  hasDescription?: boolean
}

export function FormItem({ className, state = 'default', message, hasDescription = false, ...props }: FormItemProps) {
  const id = useId()
  return (
    <FormItemContext.Provider value={{ id, state, message, hasDescription }}>
      <div data-slot="form-item" data-state={state} className={cn('grid gap-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

export function FormLabel({ className, children, required, ...props }: ComponentProps<typeof Label> & { required?: boolean }) {
  const { controlId, state } = useFormItem()
  return (
    <Label htmlFor={controlId} className={cn(state === 'error' && 'text-error-text', className)} {...props}>
      {children}
      {required ? (
        <span className="ml-0.5 text-muted-foreground" aria-hidden="true">
          *
        </span>
      ) : null}
    </Label>
  )
}

export function FormControl(props: ComponentProps<typeof Slot.Root>) {
  const { controlId, descriptionId, messageId, state, message, hasDescription } = useFormItem()
  const describedBy = [hasDescription && descriptionId, message && messageId].filter(Boolean).join(' ') || undefined
  return (
    <Slot.Root
      id={controlId}
      aria-describedby={describedBy}
      aria-invalid={state === 'error' || undefined}
      data-valid={state === 'success' || undefined}
      {...props}
    />
  )
}

export function FormDescription({ className, ...props }: ComponentProps<'p'>) {
  const { descriptionId } = useFormItem()
  return <p id={descriptionId} className={cn('text-sm text-muted-foreground', className)} {...props} />
}

export function FormMessage({ className }: { className?: string }) {
  const { messageId, state, message } = useFormItem()
  if (!message || state === 'default') return null
  const Icon = state === 'error' ? WarningCircleIcon : CheckCircleIcon
  return (
    <p
      id={messageId}
      className={cn(
        'flex items-start gap-1.5 text-sm font-medium',
        state === 'error' ? 'text-error-text' : 'text-success-text',
        className,
      )}
    >
      <Icon size={18} weight="fill" className="mt-px shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  )
}
