import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import {
  BellIcon,
  DesktopIcon,
  ListIcon,
  MoonIcon,
  PaletteIcon,
  ReceiptIcon,
  SquaresFourIcon,
  SunIcon,
  UserPlusIcon,
  XIcon,
  type IconProps,
} from '@phosphor-icons/react'
import { useTheme } from '../shared/useTheme'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from './ui/sidebar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Overview } from './views/Overview'
import { InvoiceTable } from './views/InvoiceTable'
import { CustomerWizard } from './views/CustomerWizard'
import { DesignSystem } from './views/DesignSystem'
import { INVOICES, rangeStart, statusOf, type Invoice } from './data/invoices'
import { cn } from './lib/utils'

type RouteId = 'genel-bakis' | 'faturalar' | 'musteri-ekle' | 'tasarim-sistemi'

const ROUTES: ReadonlyArray<{ id: RouteId; label: string; description: string; Icon: ComponentType<IconProps>; group: 'work' | 'system' }> = [
  { id: 'genel-bakis', label: 'Genel bakış', description: 'Tahsilat, açık alacak ve dönemin faturaları', Icon: SquaresFourIcon, group: 'work' },
  { id: 'faturalar', label: 'Faturalar', description: 'Son 12 ayın tüm faturaları', Icon: ReceiptIcon, group: 'work' },
  { id: 'musteri-ekle', label: 'Müşteri ekle', description: 'Dört adımda yeni müşteri kartı', Icon: UserPlusIcon, group: 'work' },
  { id: 'tasarim-sistemi', label: 'Tasarım sistemi', description: 'Stil 003 · Corporate Modern tokenları ve bileşenleri', Icon: PaletteIcon, group: 'system' },
]

function readRoute(): RouteId {
  const hash = window.location.hash.slice(1)
  return (ROUTES.find((r) => r.id === hash)?.id ?? 'genel-bakis') as RouteId
}

/** Yalnızca düz #çapa kullanılır: paylaşılan bağlantılarda da çalışır. */
function useHashRoute() {
  const [route, setRoute] = useState<RouteId>(readRoute)
  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

function SidebarNav({ route }: { route: RouteId }) {
  const { setOpenMobile } = useSidebar()
  const group = (g: 'work' | 'system') =>
    ROUTES.filter((r) => r.group === g).map((r) => {
      const active = r.id === route
      return (
        <SidebarMenuItem key={r.id}>
          <SidebarMenuButton href={`#${r.id}`} isActive={active} onClick={() => setOpenMobile(false)}>
            <r.Icon size={20} weight={active ? 'fill' : 'regular'} aria-hidden="true" />
            {r.label}
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    })

  return (
    <>
      <SidebarHeader>
        <span className="grid size-9 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground" aria-hidden="true">
          CB
        </span>
        <span className="flex flex-col leading-tight">
          <span className="font-semibold">Cari Bulut</span>
          <span className="text-xs text-muted-foreground">Örnek A.Ş. · Tahsilat</span>
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup aria-label="Çalışma alanı">
          <SidebarGroupLabel>Çalışma alanı</SidebarGroupLabel>
          <SidebarMenu>{group('work')}</SidebarMenu>
        </SidebarGroup>
        <SidebarGroup aria-label="Sistem">
          <SidebarGroupLabel>Sistem</SidebarGroupLabel>
          <SidebarMenu>{group('system')}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold" aria-hidden="true">
          DA
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-medium">Deniz Aksoy</span>
          <span className="truncate text-xs text-muted-foreground">Finans yöneticisi</span>
        </span>
      </SidebarFooter>
    </>
  )
}

function BottomNav({ route }: { route: RouteId }) {
  const { setOpenMobile } = useSidebar()
  const items = ROUTES.filter((r) => r.group === 'work')
  return (
    <nav
      aria-label="Alt gezinme"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-card pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
    >
      <ul className="grid grid-cols-4">
        {items.map((r) => {
          const active = r.id === route
          return (
            <li key={r.id}>
              <a
                href={`#${r.id}`}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium no-underline transition-colors duration-150',
                  active ? 'text-sidebar-active-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <r.Icon size={22} weight={active ? 'fill' : 'regular'} aria-hidden="true" />
                {r.label}
              </a>
            </li>
          )
        })}
        <li>
          <button
            type="button"
            onClick={() => setOpenMobile(true)}
            className="flex h-16 w-full cursor-pointer flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ListIcon size={22} aria-hidden="true" />
            Menü
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default function CorporateApp() {
  const route = useHashRoute()
  const { theme, mode, setMode } = useTheme('corporate-theme')
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES)
  const [notice, setNotice] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)
  const current = ROUTES.find((r) => r.id === route) ?? ROUTES[0]

  // Sayfa değişince başa dön ve odağı sayfa başlığına taşı (ekran okuyucu yeni sayfayı duyar)
  useEffect(() => {
    document.title = `${current.label} · Cari Bulut · Stil 003`
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo({ top: 0 })
    headingRef.current?.focus()
  }, [current])

  const remind = useCallback((ids: string[]) => {
    setInvoices((list) => list.map((i) => (ids.includes(i.id) ? { ...i, reminded: true } : i)))
    setNotice(`${ids.length} faturaya ödeme hatırlatması gönderildi. Örnek veri: e-posta gönderilmedi.`)
  }, [])

  const cancel = useCallback(
    (id: string) => {
      const no = invoices.find((i) => i.id === id)?.no ?? 'Fatura'
      setInvoices((list) => list.map((i) => (i.id === id ? { ...i, canceled: true } : i)))
      setNotice(`${no} iptal edildi. Toplamlar yeniden hesaplandı.`)
    },
    [invoices],
  )

  const last12 = invoices.filter((i) => i.issued >= rangeStart(12))
  const overdueCount = last12.filter((i) => statusOf(i) === 'overdue').length

  return (
    <SidebarProvider>
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
      >
        İçeriğe geç
      </a>

      <Sidebar label="Ana menü">
        <SidebarNav route={route} />
      </Sidebar>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-[env(safe-area-inset-top,0px)] z-20 flex h-16 items-center gap-2 border-b bg-card px-3 md:px-6 lg:px-8">
          <SidebarTrigger className="-ml-1" />
          <nav aria-label="Konum" className="min-w-0 flex-1">
            <ol className="flex items-center gap-2 text-sm">
              <li className="hidden text-muted-foreground sm:block">Cari Bulut</li>
              <li aria-hidden="true" className="hidden text-muted-foreground sm:block">
                /
              </li>
              <li aria-current="page" className="truncate font-medium">
                {current.label}
              </li>
            </ol>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <BellIcon size={22} aria-hidden="true" />
                {overdueCount ? (
                  <span className="absolute top-1.5 right-1.5 grid min-w-5 place-items-center rounded-full bg-destructive px-1 text-[11px] font-semibold text-destructive-foreground tabular-nums">
                    {overdueCount}
                  </span>
                ) : null}
                <span className="sr-only">Bildirimler: {overdueCount} gecikmiş fatura</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <a href="#faturalar" className="no-underline">
                  <span className="flex flex-col">
                    <span className="font-medium text-foreground">{overdueCount} fatura gecikmede</span>
                    <span className="text-xs text-muted-foreground">Faturalar sayfasında Durum filtresinden seçin</span>
                  </span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {theme === 'dark' ? <MoonIcon size={22} aria-hidden="true" /> : <SunIcon size={22} aria-hidden="true" />}
                <span className="sr-only">Tema seç</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              <DropdownMenuLabel>Tema</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={mode} onValueChange={(v) => setMode(v as 'light' | 'dark' | 'system')}>
                <DropdownMenuRadioItem value="light">
                  <SunIcon size={18} aria-hidden="true" />
                  Açık
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <MoonIcon size={18} aria-hidden="true" />
                  Koyu
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <DesktopIcon size={18} aria-hidden="true" />
                  Sistem
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="#tasarim-sistemi" className="no-underline">
                  <PaletteIcon size={18} aria-hidden="true" />
                  Tasarım sistemi
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main id="icerik" className="flex-1 px-4 pt-6 pb-28 md:px-6 lg:px-8 lg:pb-10">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight outline-none md:text-3xl">
                {current.label}
              </h1>
              <p className="text-sm text-muted-foreground">{current.description}</p>
            </div>

            {notice ? (
              <div role="status" className="flex items-start justify-between gap-3 rounded-md border border-brand bg-(--badge-info-bg) px-4 py-2 text-sm text-(--badge-info-fg)">
                <p className="py-2.5">{notice}</p>
                <Button variant="ghost" size="icon" className="-mr-2 shrink-0" onClick={() => setNotice(null)}>
                  <XIcon size={18} aria-hidden="true" />
                  <span className="sr-only">Bildirimi kapat</span>
                </Button>
              </div>
            ) : null}

            {route === 'genel-bakis' ? <Overview invoices={invoices} onRemind={remind} onCancel={cancel} /> : null}
            {route === 'faturalar' ? (
              <InvoiceTable invoices={last12} caption="Son 12 ayın faturaları" onRemind={remind} onCancel={cancel} />
            ) : null}
            {route === 'musteri-ekle' ? <CustomerWizard /> : null}
            {route === 'tasarim-sistemi' ? <DesignSystem /> : null}

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm text-muted-foreground">
              <p>Stil 003 · Corporate Modern · Tüm sayılar kurgusal örnek veridir.</p>
              <p className="flex gap-4">
                <a href="../../" className="text-link underline-offset-4 hover:underline">
                  Tüm stiller
                </a>
                <a href="../002/" className="text-link underline-offset-4 hover:underline">
                  Stil 002
                </a>
              </p>
            </footer>
          </div>
        </main>
      </div>

      <BottomNav route={route} />
    </SidebarProvider>
  )
}
