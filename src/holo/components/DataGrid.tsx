import { useState, type CSSProperties, type ReactNode } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table,
} from '@tanstack/react-table'
import { cx } from '../../shared/cx'
import { HoloIcon } from './Icons'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    align?: 'right'
    /** Başlık hücresi ekran okuyucu için ayrı metin isterse */
    srLabel?: string
    width?: string
  }
}

type Props<T> = {
  columns: ColumnDef<T>[]
  data: T[]
  getRowId: (row: T) => string
  caption: string
  globalFilter: string
  globalFilterFn?: FilterFn<T>
  rowSelection: RowSelectionState
  onRowSelectionChange: (s: RowSelectionState) => void
  initialSorting?: SortingState
  toolbar?: (table: Table<T>) => ReactNode
  /** 1024px altında her satır bir kart olur (Madde 17) */
  mobileRow: (row: Row<T>) => ReactNode
  empty: ReactNode
}

/**
 * <DataGrid> (Madde 14): shadcn/ui data-table düzeni, TanStack Table üzerinde. Sıralanabilir başlıklar
 * (aria-sort), satır seçimi, genel arama; satırlar veri değişince akarak gelir (Madde 16).
 */
export function DataGrid<T>({ columns, data, getRowId, caption, globalFilter, globalFilterFn, rowSelection, onRowSelectionChange, initialSorting = [], toolbar, mobileRow, empty }: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: (u) => onRowSelectionChange(typeof u === 'function' ? u(rowSelection) : u),
    globalFilterFn,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })
  const rows = table.getRowModel().rows
  // Filtre ya da sıralama değişince satırlar yeniden akar
  const streamKey = `${globalFilter}|${sorting.map((s) => `${s.id}${s.desc ? '-' : '+'}`).join(',')}`

  return (
    <div className="flex flex-col gap-4">
      {toolbar?.(table)}
      {/* Masaüstü tablo */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-separate border-spacing-0 text-left text-[15px]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const sorted = h.column.getIsSorted()
                  const canSort = h.column.getCanSort()
                  const meta = h.column.columnDef.meta
                  return (
                    <th
                      key={h.id}
                      scope="col"
                      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : canSort ? 'none' : undefined}
                      className={cx('border-b border-line px-3 pb-2.5 font-tech text-[12px] font-semibold tracking-[0.14em] text-muted uppercase', meta?.align === 'right' && 'text-right')}
                      style={meta?.width ? { width: meta.width } : undefined}
                    >
                      {h.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={h.column.getToggleSortingHandler()}
                          className={cx('inline-flex min-h-9 items-center gap-1.5 rounded-md uppercase hover:text-ink', meta?.align === 'right' && 'flex-row-reverse', sorted && 'text-cyan-text')}
                        >
                          {flexRender(h.column.columnDef.header, h.getContext())}
                          <HoloIcon name={sorted === 'asc' ? 'yukari' : sorted === 'desc' ? 'asagi' : 'sirala'} size={14} glow={false} className={sorted ? '' : 'opacity-50'} />
                        </button>
                      ) : (
                        flexRender(h.column.columnDef.header, h.getContext())
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody key={streamKey}>
            {rows.length ? (
              rows.map((row, i) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  className="stream-in group transition-colors hover:bg-[var(--tint)] data-[state=selected]:bg-[var(--tint)]"
                  style={{ '--i': i } as CSSProperties}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={cx('border-b border-line-soft px-3 py-2.5 align-middle', cell.column.columnDef.meta?.align === 'right' && 'text-right tabular-nums')}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-muted">
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Mobil: kart listesi */}
      <ul key={`m-${streamKey}`} className="grid gap-3 sm:grid-cols-2 lg:hidden" aria-label={caption}>
        {rows.length ? (
          rows.map((row, i) => (
            <li key={row.id} className="stream-in" style={{ '--i': i } as CSSProperties}>
              {mobileRow(row)}
            </li>
          ))
        ) : (
          <li className="py-8 text-center text-muted">{empty}</li>
        )}
      </ul>
    </div>
  )
}
