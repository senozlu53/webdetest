import { createContext, useContext, useState, type ComponentProps, type ReactNode } from 'react'
import { Slot } from 'radix-ui'
import { ListIcon } from '@phosphor-icons/react'
import { Dialog, SheetContent } from './dialog'
import { Button } from './button'
import { cn } from '../lib/utils'

type SidebarCtx = { openMobile: boolean; setOpenMobile: (open: boolean) => void }
const SidebarContext = createContext<SidebarCtx | null>(null)

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar, <SidebarProvider> içinde kullanılmalı')
  return ctx
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [openMobile, setOpenMobile] = useState(false)
  return <SidebarContext.Provider value={{ openMobile, setOpenMobile }}>{children}</SidebarContext.Provider>
}

/**
 * 1024px ve üstünde sabit sol menü. Altında menü bir çekmeceye (Sheet) katlanır;
 * ana bölümler ayrıca alt gezinme çubuğunda durur.
 */
export function Sidebar({ children, label }: { children: ReactNode; label: string }) {
  const { openMobile, setOpenMobile } = useSidebar()
  return (
    <>
      <aside aria-label={label} className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar lg:flex">
        {children}
      </aside>
      <Dialog open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent title={label}>{children}</SheetContent>
      </Dialog>
    </>
  )
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { setOpenMobile } = useSidebar()
  return (
    <Button variant="ghost" size="icon" className={cn('lg:hidden', className)} onClick={() => setOpenMobile(true)}>
      <ListIcon size={22} />
      <span className="sr-only">Menüyü aç</span>
    </Button>
  )
}

export function SidebarHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex h-16 items-center gap-3 border-b px-4', className)} {...props} />
}

export function SidebarContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4', className)} {...props} />
}

export function SidebarFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('border-t p-3', className)} {...props} />
}

export function SidebarGroup({ className, ...props }: ComponentProps<'nav'>) {
  return <nav className={cn('flex flex-col gap-1', className)} {...props} />
}

export function SidebarGroupLabel({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('px-3 pb-1 text-xs font-semibold text-muted-foreground', className)} {...props} />
}

export function SidebarMenu({ className, ...props }: ComponentProps<'ul'>) {
  return <ul className={cn('flex flex-col gap-0.5', className)} {...props} />
}

export function SidebarMenuItem(props: ComponentProps<'li'>) {
  return <li {...props} />
}

/** Aktif öğe: dolu ikon, mavi zemin, aria-current. Pasif: çizgi ikon. */
export function SidebarMenuButton({
  className,
  isActive,
  asChild,
  ...props
}: ComponentProps<'a'> & { isActive?: boolean; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'a'
  return (
    <Comp
      aria-current={isActive ? 'page' : undefined}
      data-active={isActive || undefined}
      className={cn(
        'relative flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-foreground no-underline transition-colors duration-150 hover:bg-accent',
        'data-[active]:bg-sidebar-active data-[active]:text-sidebar-active-foreground',
        'data-[active]:before:absolute data-[active]:before:inset-y-2 data-[active]:before:-left-3 data-[active]:before:w-1 data-[active]:before:rounded-r-sm data-[active]:before:bg-brand',
        className,
      )}
      {...props}
    />
  )
}
