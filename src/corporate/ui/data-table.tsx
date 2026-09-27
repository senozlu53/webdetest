import { useState, type ReactNode } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type Row,
  type SortingState,
  type Table as TanstackTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { CaretDownIcon, CaretLeftIcon, CaretRightIcon, CaretUpDownIcon, CaretUpIcon } from '@phosphor-icons/react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { cn } from '../lib/utils'

type Props<T> = {
  columns: ColumnDef<T>[]
  data: T[]
  getRowId: (row: T) => string
  caption: string
  initialSorting?: SortingState
  globalFilterFn?: FilterFn<T>
  /** Arama, filtre ve sütun seçimi: tablonun üstünde tek satır */
  toolbar?: (table: TanstackTable<T>) => ReactNode
  /** 768px altında her satır bir liste kartına dönüşür */
  mobileRow: (row: Row<T>) => ReactNode
  emptyText?: string
}

const PAGE_SIZES = [10, 20, 50] as const

/**
 * shadcn/ui DataTable tarifi: TanStack Table + Table bileşenleri.
 * Sıralama, arama, sütun filtresi, sütun görünürlüğü, satır seçimi ve sayfalama.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  caption,
  initialSorting = [],
  globalFilterFn,
  toolbar,
  mobileRow,
  emptyText = 'Sonuç yok.',
}: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn,
    autoResetPageIndex: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const rows = table.getRowModel().rows
  const filtered = table.getFilteredRowModel().rows.length
  const { pageIndex, pageSize } = table.getState().pagination
  const from = filtered === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min(filtered, (pageIndex + 1) * pageSize)

  return (
    <div className="flex flex-col gap-4">
      {toolbar ? toolbar(table) : null}

      <div className="hidden overflow-hidden rounded-lg border bg-card md:block">
        <Table>
          <caption className="sr-only">{caption}</caption>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => {
                  const sorted = header.column.getIsSorted()
                  const align = (header.column.columnDef.meta as { align?: 'right' } | undefined)?.align
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
                      className={cn(align === 'right' && 'text-right')}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            '-mx-2 inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-md px-2 hover:bg-accent hover:text-foreground',
                            sorted && 'text-foreground',
                            align === 'right' && 'flex-row-reverse',
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === 'asc' ? (
                            <CaretUpIcon size={14} weight="bold" aria-hidden="true" />
                          ) : sorted === 'desc' ? (
                            <CaretDownIcon size={14} weight="bold" aria-hidden="true" />
                          ) : (
                            <CaretUpDownIcon size={14} aria-hidden="true" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => {
                    const align = (cell.column.columnDef.meta as { align?: 'right' } | undefined)?.align
                    return (
                      <TableCell key={cell.id} className={cn(align === 'right' && 'text-right')}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-32 text-center text-muted-foreground">
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden" aria-label={caption}>
        {rows.length ? rows.map((row) => <li key={row.id}>{mobileRow(row)}</li>) : (
          <li className="rounded-lg border bg-card p-6 text-center text-muted-foreground">{emptyText}</li>
        )}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
          {table.getSelectedRowModel().rows.length > 0
            ? `${table.getSelectedRowModel().rows.length} satır seçildi · `
            : ''}
          {from}–{to} / {filtered} kayıt
        </p>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="tabular-nums">
                {pageSize} / sayfa
                <CaretDownIcon size={14} aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              <DropdownMenuLabel>Sayfa başına satır</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={String(pageSize)} onValueChange={(v) => table.setPageSize(Number(v))}>
                {PAGE_SIZES.map((n) => (
                  <DropdownMenuRadioItem key={n} value={String(n)} className="tabular-nums">
                    {n}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="px-1 text-sm tabular-nums">
            {table.getPageCount() === 0 ? 0 : pageIndex + 1} / {table.getPageCount()}
          </span>
          <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <CaretLeftIcon size={18} aria-hidden="true" />
            <span className="sr-only">Önceki sayfa</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <CaretRightIcon size={18} aria-hidden="true" />
            <span className="sr-only">Sonraki sayfa</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
