import { useMemo, useState, type ComponentType } from 'react'
import type { ColumnDef, FilterFn, Table } from '@tanstack/react-table'
import {
  ArrowCounterClockwiseIcon,
  BellRingingIcon,
  CheckCircleIcon,
  ClockIcon,
  ColumnsIcon,
  DotsThreeIcon,
  EyeIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  ProhibitIcon,
  WarningCircleIcon,
  WarningIcon,
  XCircleIcon,
  type IconProps,
} from '@phosphor-icons/react'
import { DataTable } from '../ui/data-table'
import { Badge, type BadgeVariant } from '../ui/badge'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { TODAY, statusOf, type Invoice, type InvoiceStatus } from '../data/invoices'
import { fmtCurrency, fmtDate } from '../lib/format'

export const STATUS_META: Record<InvoiceStatus, { label: string; variant: BadgeVariant; Icon: ComponentType<IconProps> }> = {
  paid: { label: 'Ödendi', variant: 'success', Icon: CheckCircleIcon },
  open: { label: 'Açık', variant: 'info', Icon: ClockIcon },
  'due-soon': { label: 'Vadesi yaklaşıyor', variant: 'warning', Icon: WarningIcon },
  overdue: { label: 'Gecikmiş', variant: 'danger', Icon: WarningCircleIcon },
  canceled: { label: 'İptal', variant: 'neutral', Icon: XCircleIcon },
}

const STATUS_ORDER: InvoiceStatus[] = ['overdue', 'due-soon', 'open', 'paid', 'canceled']

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const meta = STATUS_META[status]
  return (
    <Badge variant={meta.variant}>
      <meta.Icon weight="fill" aria-hidden="true" />
      {meta.label}
    </Badge>
  )
}

function DueNote({ inv }: { inv: Invoice }) {
  const status = statusOf(inv)
  if (status === 'overdue') return <span className="text-xs font-medium text-error-text">{TODAY - inv.due} gün gecikti</span>
  if (status === 'due-soon' || status === 'open') return <span className="text-xs text-muted-foreground">{inv.due - TODAY} gün kaldı</span>
  if (status === 'paid' && inv.paid !== null) return <span className="text-xs text-muted-foreground">{fmtDate(inv.paid)} ödendi</span>
  return null
}

const COLUMN_LABELS: Record<string, string> = {
  no: 'Fatura no',
  customer: 'Müşteri',
  issued: 'Düzenleme',
  due: 'Vade',
  amount: 'Tutar',
  status: 'Durum',
}

const searchFilter: FilterFn<Invoice> = (row, _id, value: string) => {
  const q = value.trim().toLocaleLowerCase('tr')
  if (!q) return true
  return row.original.no.toLocaleLowerCase('tr').includes(q) || row.original.customer.toLocaleLowerCase('tr').includes(q)
}

type Props = {
  invoices: Invoice[]
  caption: string
  onRemind: (ids: string[]) => void
  onCancel: (id: string) => void
}

type RowAction = { kind: 'details' | 'cancel'; inv: Invoice } | null

export function InvoiceTable({ invoices, caption, onRemind, onCancel }: Props) {
  const [dialog, setDialog] = useState<RowAction>(null)

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        id: 'select',
        enableSorting: false,
        enableHiding: false,
        header: ({ table }) => (
          <label className="-my-2 grid size-11 cursor-pointer place-items-center">
            <Checkbox
              checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false}
              onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
              aria-label="Bu sayfadaki tüm faturaları seç"
            />
          </label>
        ),
        cell: ({ row }) => (
          <label className="-my-2 grid size-11 cursor-pointer place-items-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(v) => row.toggleSelected(!!v)}
              aria-label={`${row.original.no} faturasını seç`}
            />
          </label>
        ),
      },
      {
        id: 'no',
        accessorKey: 'no',
        header: 'Fatura no',
        cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.no}</span>,
      },
      {
        id: 'customer',
        accessorKey: 'customer',
        header: 'Müşteri',
        sortingFn: (a, b) => a.original.customer.localeCompare(b.original.customer, 'tr'),
        cell: ({ row }) => (
          <span className="flex flex-col leading-snug">
            <span className="font-medium">{row.original.customer}</span>
            <span className="text-xs text-muted-foreground">{row.original.sector}</span>
          </span>
        ),
      },
      {
        id: 'issued',
        accessorKey: 'issued',
        header: 'Düzenleme',
        cell: ({ row }) => <span className="tabular-nums">{fmtDate(row.original.issued)}</span>,
      },
      {
        id: 'due',
        accessorKey: 'due',
        header: 'Vade',
        cell: ({ row }) => (
          <span className="flex flex-col leading-snug">
            <span className="tabular-nums">{fmtDate(row.original.due)}</span>
            <DueNote inv={row.original} />
          </span>
        ),
      },
      {
        id: 'amount',
        accessorKey: 'amount',
        header: 'Tutar',
        meta: { align: 'right' },
        cell: ({ row }) => <span className="font-medium tabular-nums">{fmtCurrency(row.original.amount)}</span>,
      },
      {
        id: 'status',
        accessorFn: (inv) => statusOf(inv),
        header: 'Durum',
        sortingFn: (a, b) => STATUS_ORDER.indexOf(statusOf(a.original)) - STATUS_ORDER.indexOf(statusOf(b.original)),
        filterFn: (row, _id, value: InvoiceStatus[]) => !value?.length || value.includes(statusOf(row.original)),
        cell: ({ row }) => (
          <span className="flex flex-col items-start gap-1">
            <StatusBadge status={statusOf(row.original)} />
            {row.original.reminded ? (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <BellRingingIcon size={14} aria-hidden="true" />
                Hatırlatıldı
              </span>
            ) : null}
          </span>
        ),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => <span className="sr-only">İşlemler</span>,
        cell: ({ row }) => <RowActions inv={row.original} onRemind={onRemind} onOpen={setDialog} />,
      },
    ],
    [onRemind],
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={invoices}
        getRowId={(inv) => inv.id}
        caption={caption}
        initialSorting={[{ id: 'issued', desc: true }]}
        globalFilterFn={searchFilter}
        emptyText="Bu filtrelerle eşleşen fatura yok."
        toolbar={(table) => <Toolbar table={table} onRemind={onRemind} />}
        mobileRow={(row) => {
          const inv = row.original
          return (
            <article className="flex flex-col gap-3 rounded-lg border bg-card p-4 data-[selected=true]:border-brand" data-selected={row.getIsSelected()}>
              <div className="flex items-start justify-between gap-3">
                <span className="flex min-w-0 flex-col leading-snug">
                  <span className="font-medium">{inv.customer}</span>
                  <span className="text-sm text-muted-foreground tabular-nums">{inv.no}</span>
                </span>
                <RowActions inv={inv} onRemind={onRemind} onOpen={setDialog} />
              </div>
              <div className="flex items-end justify-between gap-3">
                <span className="flex flex-col leading-snug">
                  <span className="text-sm text-muted-foreground">Vade {fmtDate(inv.due)}</span>
                  <DueNote inv={inv} />
                </span>
                <span className="text-base font-semibold tabular-nums">{fmtCurrency(inv.amount)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-t pt-2">
                <StatusBadge status={statusOf(inv)} />
                <label className="-mr-2 flex h-11 cursor-pointer items-center gap-2 px-2 text-sm">
                  <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />
                  Seç
                </label>
              </div>
            </article>
          )
        }}
      />

      <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
        {dialog?.kind === 'details' ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="tabular-nums">{dialog.inv.no}</DialogTitle>
              <DialogDescription>{dialog.inv.customer}</DialogDescription>
            </DialogHeader>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Durum</dt>
              <dd>
                <StatusBadge status={statusOf(dialog.inv)} />
              </dd>
              <dt className="text-muted-foreground">Tutar</dt>
              <dd className="font-semibold tabular-nums">{fmtCurrency(dialog.inv.amount)}</dd>
              <dt className="text-muted-foreground">Düzenleme</dt>
              <dd className="tabular-nums">{fmtDate(dialog.inv.issued)}</dd>
              <dt className="text-muted-foreground">Vade</dt>
              <dd className="tabular-nums">{fmtDate(dialog.inv.due)}</dd>
              <dt className="text-muted-foreground">Sektör</dt>
              <dd>{dialog.inv.sector}</dd>
            </dl>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Kapat</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        ) : dialog?.kind === 'cancel' ? (
          <DialogContent role="alertdialog">
            <DialogHeader>
              <DialogTitle>{dialog.inv.no} iptal edilsin mi?</DialogTitle>
              <DialogDescription>
                {dialog.inv.customer} adına kesilen {fmtCurrency(dialog.inv.amount)} tutarındaki fatura iptal edilir ve
                alacak toplamlarından çıkar. Bu örnekte değişiklik yalnızca bu sayfada geçerlidir.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Vazgeç</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  onCancel(dialog.inv.id)
                  setDialog(null)
                }}
              >
                Faturayı iptal et
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  )
}

function RowActions({ inv, onRemind, onOpen }: { inv: Invoice; onRemind: (ids: string[]) => void; onOpen: (a: RowAction) => void }) {
  const status = statusOf(inv)
  const closed = status === 'paid' || status === 'canceled'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="-my-2">
          <DotsThreeIcon size={22} weight="bold" aria-hidden="true" />
          <span className="sr-only">{inv.no} için işlemler</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="tabular-nums">{inv.no}</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onOpen({ kind: 'details', inv })}>
          <EyeIcon size={18} aria-hidden="true" />
          Ayrıntıları görüntüle
        </DropdownMenuItem>
        <DropdownMenuItem disabled={closed} onSelect={() => onRemind([inv.id])}>
          <BellRingingIcon size={18} aria-hidden="true" />
          Hatırlatma gönder
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled={status === 'canceled'} onSelect={() => onOpen({ kind: 'cancel', inv })}>
          <ProhibitIcon size={18} aria-hidden="true" />
          Faturayı iptal et
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Toolbar({ table, onRemind }: { table: Table<Invoice>; onRemind: (ids: string[]) => void }) {
  const statusColumn = table.getColumn('status')
  const selectedStatuses = (statusColumn?.getFilterValue() as InvoiceStatus[] | undefined) ?? []
  const search = (table.getState().globalFilter as string) ?? ''
  const selected = table.getSelectedRowModel().rows
  const remindable = selected.filter((r) => {
    const s = statusOf(r.original)
    return s !== 'paid' && s !== 'canceled'
  })
  const counts: Partial<Record<InvoiceStatus, number>> = {}
  for (const row of table.getCoreRowModel().rows) {
    const s = statusOf(row.original)
    counts[s] = (counts[s] ?? 0) + 1
  }

  const filtered = search !== '' || selectedStatuses.length > 0

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <label htmlFor="fatura-ara" className="sr-only">
            Faturalarda ara
          </label>
          <MagnifyingGlassIcon size={18} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="fatura-ara"
            type="search"
            placeholder="Fatura no ya da müşteri"
            value={search}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <FunnelSimpleIcon size={18} aria-hidden="true" />
              Durum
              {selectedStatuses.length ? (
                <Badge variant="info" className="tabular-nums">
                  {selectedStatuses.length}
                </Badge>
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-60">
            <DropdownMenuLabel>Duruma göre filtrele</DropdownMenuLabel>
            {STATUS_ORDER.map((s) => {
              const meta = STATUS_META[s]
              return (
                <DropdownMenuCheckboxItem
                  key={s}
                  checked={selectedStatuses.includes(s)}
                  onSelect={(e) => e.preventDefault()}
                  onCheckedChange={(checked) => {
                    const next = checked ? [...selectedStatuses, s] : selectedStatuses.filter((x) => x !== s)
                    statusColumn?.setFilterValue(next.length ? next : undefined)
                  }}
                >
                  <meta.Icon size={18} weight="fill" aria-hidden="true" />
                  {meta.label}
                  <span className="ml-auto text-xs text-muted-foreground tabular-nums">{counts[s] ?? 0}</span>
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hidden md:inline-flex">
              <ColumnsIcon size={18} aria-hidden="true" />
              Sütunlar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Görünen sütunlar</DropdownMenuLabel>
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide())
              .map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.id}
                  checked={c.getIsVisible()}
                  onSelect={(e) => e.preventDefault()}
                  onCheckedChange={(v) => c.toggleVisibility(!!v)}
                >
                  {COLUMN_LABELS[c.id] ?? c.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {filtered ? (
          <Button
            variant="ghost"
            onClick={() => {
              table.setGlobalFilter('')
              table.resetColumnFilters()
            }}
          >
            <ArrowCounterClockwiseIcon size={18} aria-hidden="true" />
            Sıfırla
          </Button>
        ) : null}
      </div>
      {selected.length ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" onClick={() => table.resetRowSelection()}>
            Seçimi kaldır
          </Button>
          <Button
            disabled={remindable.length === 0}
            onClick={() => {
              onRemind(remindable.map((r) => r.original.id))
              table.resetRowSelection()
            }}
          >
            <BellRingingIcon size={18} aria-hidden="true" />
            <span className="tabular-nums">Hatırlatma gönder ({remindable.length})</span>
          </Button>
        </div>
      ) : null}
    </div>
  )
}
