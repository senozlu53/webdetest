import { useMemo, useState, type CSSProperties } from 'react'
import type { ColumnDef, FilterFn, Row, RowSelectionState } from '@tanstack/react-table'
import { DataGrid } from '../components/DataGrid'
import { HoloButton, HoloPanel, SectionHead, Segmented, StatusPill } from '../components/ui'
import { HoloIcon } from '../components/Icons'
import { useHolo } from '../lib/store'
import { STATUS_LABEL, VRAM_GB, fmtCtx, fmtGB, fmtNum, type Model, type ModelStatus } from '../lib/data'

type Filter = 'hepsi' | ModelStatus
const MAX_GB = 45

const tr = (s: string) => s.toLocaleLowerCase('tr-TR')
const searchFn: FilterFn<Model> = (row, _col, value: string) => {
  const q = tr(value.trim())
  if (!q) return true
  const m = row.original
  return tr(`${m.name} ${m.params} ${m.quant} ${m.kind} ${STATUS_LABEL[m.status]}`).includes(q)
}

function Status({ m }: { m: Model }) {
  return (
    <StatusPill tone={m.status === 'yuklu' ? 'cyan' : m.status === 'indiriliyor' ? 'blue' : 'muted'} pulse={m.status === 'indiriliyor'}>
      {STATUS_LABEL[m.status]}
    </StatusPill>
  )
}

function SizeBar({ gb }: { gb: number }) {
  return (
    <span className="inline-flex items-center justify-end gap-2">
      <span className="hidden h-1 w-16 overflow-hidden rounded-full bg-[var(--line-soft)] lg:block" aria-hidden="true">
        <span className="block h-full rounded-full bg-cyan shadow-[0_0_6px_var(--glow-strong)]" style={{ width: `${Math.min(100, (gb / MAX_GB) * 100)}%` } as CSSProperties} />
      </span>
      {fmtGB(gb)}
    </span>
  )
}

/** Model dizini (Madde 10 · 14): <DataGrid> ile sıralama, arama, durum filtresi ve toplu yükle/kaldır */
export function Models() {
  const s = useHolo()
  const [filter, setFilter] = useState<Filter>('hepsi')
  const [query, setQuery] = useState('')
  const [selection, setSelection] = useState<RowSelectionState>({})
  const data = useMemo(() => (filter === 'hepsi' ? s.models : s.models.filter((m) => m.status === filter)), [s.models, filter])
  const selected = s.models.filter((m) => selection[m.id])
  const canLoad = selected.filter((m) => m.status === 'diskte')
  const canUnload = selected.filter((m) => m.status === 'yuklu' && m.id !== s.activeId)
  const vram = s.models.filter((m) => m.status === 'yuklu').reduce((a, m) => a + m.sizeGB, 0)
  const disk = s.models.filter((m) => m.status !== 'indiriliyor').reduce((a, m) => a + m.sizeGB, 0)

  const activate = (m: Model) => {
    s.setActive(m.id)
    s.say(`${m.name} ${m.params} etkin model oldu`)
  }

  const columns = useMemo<ColumnDef<Model>[]>(
    () => [
      {
        id: 'sec',
        enableSorting: false,
        meta: { width: '44px' },
        header: ({ table }) => (
          <input
            type="checkbox"
            aria-label="Görünen tüm modelleri seç"
            checked={table.getIsAllRowsSelected()}
            ref={(el) => {
              if (el) el.indeterminate = table.getIsSomeRowsSelected()
            }}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="size-4 accent-[var(--cyan)]"
          />
        ),
        cell: ({ row }) => (
          <input type="checkbox" aria-label={`${row.original.name} ${row.original.params} seç`} checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} className="size-4 accent-[var(--cyan)]" />
        ),
      },
      {
        id: 'model',
        accessorFn: (m) => m.name,
        header: 'Model',
        cell: ({ row: { original: m } }) => (
          <span className="flex items-center gap-3">
            <HoloIcon name={m.kind === 'Gömme' ? 'atom' : m.kind === 'Kod' ? 'cip' : m.kind === 'Görsel' ? 'radar' : 'model'} size={20} className={m.id === s.activeId ? 'text-cyan-text' : 'text-muted'} glow={m.id === s.activeId} />
            <span className="flex flex-col leading-tight">
              <span className="font-[500]">
                {m.name} {m.params}
                {m.id === s.activeId ? <span className="ml-2 font-tech text-[11px] tracking-[0.1em] text-cyan-text uppercase">etkin</span> : null}
              </span>
              <span className="text-[13px] text-muted">{m.kind}</span>
            </span>
          </span>
        ),
      },
      { accessorKey: 'quant', header: 'Nicemleme', cell: ({ getValue }) => <span className="font-mono text-[13px]">{getValue<string>()}</span> },
      { accessorKey: 'sizeGB', header: 'Boyut', meta: { align: 'right' }, cell: ({ getValue }) => <SizeBar gb={getValue<number>()} /> },
      { accessorKey: 'ctx', header: 'Bağlam', meta: { align: 'right' }, cell: ({ getValue }) => fmtCtx(getValue<number>()) },
      { accessorKey: 'tps', header: 'Hız', meta: { align: 'right' }, cell: ({ getValue }) => (getValue<number>() ? `${getValue<number>()} t/sn` : '—') },
      {
        accessorKey: 'status',
        header: 'Durum',
        sortingFn: (a, b) => ['yuklu', 'indiriliyor', 'diskte'].indexOf(a.original.status) - ['yuklu', 'indiriliyor', 'diskte'].indexOf(b.original.status),
        cell: ({ row }) => <Status m={row.original} />,
      },
      {
        id: 'eylem',
        enableSorting: false,
        header: () => <span className="sr-only">Eylem</span>,
        cell: ({ row: { original: m } }) =>
          m.kind === 'Gömme' ? null : (
            <HoloButton size="sm" variant="ghost" disabled={m.status === 'indiriliyor' || m.id === s.activeId} onClick={() => activate(m)} aria-label={`${m.name} ${m.params} modelini etkinleştir`}>
              {m.id === s.activeId ? 'Etkin' : 'Etkinleştir'}
            </HoloButton>
          ),
      },
    ],
    [s.activeId, s.setActive, s.say],
  )

  const mobileRow = (row: Row<Model>) => {
    const m = row.original
    return (
      <HoloPanel className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} className="mt-1.5 size-4 accent-[var(--cyan)]" aria-label={`${m.name} ${m.params} seç`} />
            <span className="flex flex-col leading-tight">
              <span className="text-[17px] font-[500]">
                {m.name} {m.params}
              </span>
              <span className="text-[13px] text-muted">
                {m.kind} · <span className="font-mono">{m.quant}</span>
              </span>
            </span>
          </label>
          <Status m={m} />
        </div>
        <dl className="grid grid-cols-3 gap-2 text-[14px] tabular-nums">
          {[
            ['Boyut', fmtGB(m.sizeGB)],
            ['Bağlam', fmtCtx(m.ctx)],
            ['Hız', m.tps ? `${m.tps} t/sn` : '—'],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-tech text-[11px] tracking-[0.1em] text-muted uppercase">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {m.kind !== 'Gömme' ? (
          <HoloButton size="sm" variant={m.id === s.activeId ? 'ghost' : 'glass'} disabled={m.status === 'indiriliyor' || m.id === s.activeId} onClick={() => activate(m)} className="self-start">
            {m.id === s.activeId ? 'Etkin model' : 'Etkinleştir'}
          </HoloButton>
        ) : null}
      </HoloPanel>
    )
  }

  return (
    <section id="dizin" className="px-4 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="10 · 14"
          label="Model dizini"
          title="Ağırlıklar, tek tabloda"
          lede="Diskteki ve bellekteki modeller. Başlıklara tıklayarak sıralayın, arayın, seçip toplu yükleyin ya da kaldırın. Satırlar filtre değişince akarak gelir; dar ekranda her satır bir karta dönüşür."
        />
        <HoloPanel tick className="p-4 md:p-6">
          <DataGrid<Model>
            columns={columns}
            data={data}
            getRowId={(m) => m.id}
            caption="Model dizini: yerel modeller, boyutları ve durumları"
            globalFilter={query}
            globalFilterFn={searchFn}
            rowSelection={selection}
            onRowSelectionChange={setSelection}
            initialSorting={[{ id: 'status', desc: false }]}
            mobileRow={mobileRow}
            empty="Bu filtreyle eşleşen model yok."
            toolbar={() => (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-end gap-4">
                  <label className="flex min-w-[220px] flex-1 flex-col gap-1.5 md:max-w-xs">
                    <span className="font-tech text-[12px] font-semibold tracking-[0.14em] text-muted uppercase">Ara</span>
                    <span className="thin-glow flex min-h-11 items-center gap-2 rounded-full bg-[rgb(var(--surface-rgb)/0.6)] px-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cyan-text">
                      <HoloIcon name="arama" size={16} className="text-cyan-text" />
                      <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ad, nicemleme, tür…" className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted" />
                    </span>
                  </label>
                  <Segmented<Filter>
                    legend="Durum"
                    name="durum"
                    value={filter}
                    onChange={setFilter}
                    size="sm"
                    options={[
                      { id: 'hepsi', label: 'Tümü' },
                      { id: 'yuklu', label: 'Yüklü' },
                      { id: 'diskte', label: 'Diskte' },
                      { id: 'indiriliyor', label: 'İniyor' },
                    ]}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line-soft px-4 py-3" role="group" aria-label="Seçili modeller">
                  <span className="text-[14px] text-muted" aria-live="polite">
                    {selected.length ? `${selected.length} model seçili` : 'Toplu işlem için model seçin'}
                  </span>
                  <HoloButton
                    size="sm"
                    disabled={!canLoad.length}
                    icon={<HoloIcon name="yukle" size={14} glow={false} />}
                    onClick={() => {
                      s.setStatus(canLoad.map((m) => m.id), 'yuklu')
                      s.say(`${canLoad.length} model belleğe yüklendi`)
                      setSelection({})
                    }}
                  >
                    Belleğe yükle{canLoad.length ? ` (${canLoad.length})` : ''}
                  </HoloButton>
                  <HoloButton
                    size="sm"
                    disabled={!canUnload.length}
                    icon={<HoloIcon name="kaldir" size={14} glow={false} />}
                    onClick={() => {
                      s.setStatus(canUnload.map((m) => m.id), 'diskte')
                      s.say(`${canUnload.length} model bellekten kaldırıldı`)
                      setSelection({})
                    }}
                  >
                    Bellekten kaldır{canUnload.length ? ` (${canUnload.length})` : ''}
                  </HoloButton>
                  <span className="ml-auto flex items-center gap-3 font-tech text-[13px] text-muted tabular-nums">
                    <span>
                      VRAM{' '}
                      <span className={vram > VRAM_GB ? 'text-blue-text' : 'text-ink'}>
                        {fmtNum(vram)} / {VRAM_GB} GB
                      </span>
                    </span>
                    <span>Disk {fmtGB(disk)}</span>
                  </span>
                </div>
              </div>
            )}
          />
        </HoloPanel>
      </div>
    </section>
  )
}
