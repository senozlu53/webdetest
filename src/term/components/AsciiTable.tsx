import type { KeyboardEvent, ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { len, pad } from '../lib/ascii'
import { ScrollX } from './ui'

export type Col<T> = {
  key: string
  label: string
  get: (r: T) => string
  align?: 'left' | 'right'
  sortable?: boolean
  /** Değer hücresinin sınıfı (ör. uyarı satırında kehribar) */
  cls?: (r: T) => string | undefined
}

type Props<T> = {
  columns: Col<T>[]
  rows: T[]
  getId: (r: T) => string
  caption: string
  sort?: { key: string; dir: 'asc' | 'desc' }
  onSort?: (key: string) => void
  selectedId?: string
  onSelect?: (id: string) => void
  empty?: string
  footer?: ReactNode
}

/**
 * ASCII tablo (Madde 11 · <DataGrid>): anlamsal <table>, görünüşü saf ASCII.
 * Her sütunun genişliği en uzun değerden karakter olarak hesaplanır; "| değer " hücreleri ve "+----+" çizgileri
 * aynı ızgaraya oturur. Başlıklar sıralama düğmesi (aria-sort), ilk sütun satır seçme düğmesi (↑/↓ ile gezinir).
 */
export function AsciiTable<T>({ columns, rows, getId, caption, sort, onSort, selectedId, onSelect, empty = 'kayıt yok', footer }: Props<T>) {
  const w = columns.map((c) => Math.max(len(c.label) + (c.sortable ? 2 : 0), ...rows.map((r) => len(c.get(r))), 3))
  const total = w.reduce((a, x) => a + x + 3, 0) + 1
  const rule = '+' + w.map((x) => '-'.repeat(x + 2)).join('+') + '+'
  const ind = (k: string) => (sort?.key === k ? (sort.dir === 'asc' ? ' ^' : ' v') : '  ')

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'j' && e.key !== 'k') return
    e.preventDefault()
    const btns = [...(e.currentTarget.closest('tbody')?.querySelectorAll<HTMLButtonElement>('button[data-row]') ?? [])]
    const i = btns.indexOf(e.currentTarget)
    const next = btns[i + (e.key === 'ArrowDown' || e.key === 'j' ? 1 : -1)]
    next?.focus()
  }

  const ruleRow = (at: string) => (
    <tr aria-hidden="true" data-rule={at}>
      <td colSpan={columns.length} className="text-line">
        {rule}
      </td>
    </tr>
  )

  return (
    <ScrollX label={caption}>
      <table className="ascii border-collapse text-left" style={{ width: `${total}ch`, tableLayout: 'fixed' }}>
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          {w.map((x, i) => (
            <col key={i} style={{ width: `${x + 3 + (i === w.length - 1 ? 1 : 0)}ch` }} />
          ))}
        </colgroup>
        <thead>
          {ruleRow('ust')}
          <tr>
            {columns.map((c, i) => {
              const last = i === columns.length - 1
              const label = pad(c.label + (c.sortable ? ind(c.key) : ''), w[i], c.align)
              return (
                <th
                  key={c.key}
                  scope="col"
                  className="p-0 font-bold"
                  aria-sort={c.sortable ? (sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}
                >
                  <span className="text-line" aria-hidden="true">
                    {'| '}
                  </span>
                  {c.sortable && onSort ? (
                    <button type="button" onClick={() => onSort(c.key)} className="cursor-pointer text-hi uppercase hover:bg-sel-bg hover:text-sel-fg focus-visible:bg-sel-bg focus-visible:text-sel-fg">
                      {label}
                    </button>
                  ) : (
                    <span className="text-hi uppercase">{label}</span>
                  )}
                  <span className="text-line" aria-hidden="true">
                    {last ? ' |' : ' '}
                  </span>
                </th>
              )
            })}
          </tr>
          {ruleRow('bas')}
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((r) => {
              const id = getId(r)
              const sel = selectedId === id
              return (
                <tr key={id} className={cx(sel && 'inv')} onClick={onSelect ? () => onSelect(id) : undefined}>
                  {columns.map((c, i) => {
                    const last = i === columns.length - 1
                    const v = pad(c.get(r), w[i], c.align)
                    return (
                      <td key={c.key} className="p-0">
                        <span className={sel ? undefined : 'text-line'} aria-hidden="true">
                          {'| '}
                        </span>
                        {i === 0 && onSelect ? (
                          <button
                            type="button"
                            data-row=""
                            aria-pressed={sel}
                            onKeyDown={onKey}
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelect(id)
                            }}
                            className={cx('cursor-pointer font-bold focus-visible:bg-sel-bg focus-visible:text-sel-fg', !sel && 'hover:underline')}
                          >
                            {v}
                          </button>
                        ) : (
                          <span className={sel ? undefined : c.cls?.(r)}>{v}</span>
                        )}
                        <span className={sel ? undefined : 'text-line'} aria-hidden="true">
                          {last ? ' |' : ' '}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-0 text-dim">
                {pad(`| ${empty}`, total - 1)}|
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          {ruleRow('alt')}
          {footer ? (
            <tr>
              <td colSpan={columns.length} className="p-0 text-dim">
                {footer}
              </td>
            </tr>
          ) : null}
        </tfoot>
      </table>
    </ScrollX>
  )
}
