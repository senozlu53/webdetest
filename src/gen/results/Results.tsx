import { useId, useState, type FormEvent } from 'react'
import type { Result, Source } from '../lib/scenarios'
import { CodeBlock } from '../components/Markdown'
import { IconCalendar, IconChart, IconCheck, IconCode, IconError, IconFile, IconSearch, IconTable } from '../components/Icons'
import { ToolResult } from '../components/core'
import { cx } from '../../shared/cx'

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

/** Araç sonucunu bağlama göre doğru bileşenle çizer: arayüz burada "üretilir" */
export function ResultView({ r, sources }: { r: Result; sources: Source[] }) {
  switch (r.kind) {
    case 'sources':
      return (
        <ToolResult title={`${r.ns.length} kaynak bulundu`} icon={<IconSearch size={13} />}>
          <ul className="flex flex-wrap gap-1.5">
            {r.ns.map((n) => {
              const s = sources.find((x) => x.n === n)!
              return (
                <li key={n} className="gen-enter inline-flex max-w-full items-center gap-1.5 rounded-full border border-line bg-bg px-2.5 py-0.5 text-[13px]">
                  <span className="font-mono text-[11px] text-muted">{n}</span>
                  <span className="truncate">{s.title}</span>
                </li>
              )
            })}
          </ul>
        </ToolResult>
      )
    case 'table':
      return (
        <ToolResult title={r.caption} icon={<IconTable size={13} />}>
          <div className="scroll-x" role="region" tabIndex={0} aria-label={r.caption}>
            <table className="w-full border-collapse text-[14px]">
              <caption className="sr-only">{r.caption}</caption>
              <thead>
                <tr>
                  {r.columns.map((c) => (
                    <th key={c.key} scope="col" className={cx('border-b border-line-strong px-2 py-1.5 font-semibold whitespace-nowrap', c.align === 'right' ? 'text-right' : 'text-left')}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.rows.map((row, i) => (
                  <tr key={i} className="gen-enter border-b border-line last:border-0" style={{ animationDelay: `${i * 70}ms` }}>
                    {r.columns.map((c, k) => {
                      const Cell = k === 0 ? 'th' : 'td'
                      return (
                        <Cell key={c.key} scope={k === 0 ? 'row' : undefined} className={cx('px-2 py-1.5 whitespace-nowrap', k === 0 ? 'text-left font-medium' : 'text-muted', c.align === 'right' && 'text-right tabular-nums')}>
                          {row[c.key]}
                        </Cell>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ToolResult>
      )
    case 'chart':
      return <ChartResult r={r} />
    case 'file':
      return (
        <ToolResult title={r.path} icon={<IconFile size={13} />}>
          <CodeBlock lang={r.lang} text={r.code} />
        </ToolResult>
      )
    case 'tests':
      return (
        <ToolResult title={`Testler · ${r.passed} geçti, ${r.failed} kaldı · ${r.ms} ms`} icon={<IconCode size={13} />}>
          <ul className="scroll-x font-mono text-[13px] leading-relaxed" role="list">
            {r.lines.map((l, i) => (
              <li key={i} className={cx('flex items-start gap-2 whitespace-pre', l.ok ? 'text-muted' : 'text-err')}>
                {l.ok ? <IconCheck size={14} className="mt-[3px] text-ok" /> : <IconError size={14} className="mt-[3px]" />}
                <span className="sr-only">{l.ok ? 'geçti: ' : 'kaldı: '}</span>
                {l.text}
              </li>
            ))}
          </ul>
        </ToolResult>
      )
    case 'diff':
      return (
        <ToolResult title={`Yama · ${r.path}`} icon={<IconCode size={13} />}>
          <CodeBlock lang="diff" text={r.lines.map((l) => `${l.t}${l.s}`).join('\n')} />
        </ToolResult>
      )
    case 'calendar':
      return <CalendarResult r={r} />
    case 'event':
      return (
        <ToolResult title="Etkinlik oluşturuldu" icon={<IconCalendar size={13} />}>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[14px]">
            <dt className="text-muted">Başlık</dt>
            <dd className="font-medium">{r.baslik}</dd>
            <dt className="text-muted">Zaman</dt>
            <dd>
              Yarın {r.zaman}–{fromMin(toMin(r.zaman) + r.sure)} ({r.sure} dk)
            </dd>
            <dt className="text-muted">Katılımcılar</dt>
            <dd>{r.kisiler.join(', ')}</dd>
          </dl>
          <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ok">
            <IconCheck size={14} /> Davetler gönderildi (örnek; gerçek takvime yazılmadı)
          </p>
        </ToolResult>
      )
  }
}

/** Tek serili çubuk grafik: değerler çubuğun yanında yazılı, lejant gerekmez (başlık seriyi adlandırır) */
function ChartResult({ r }: { r: Extract<Result, { kind: 'chart' }> }) {
  const max = Math.max(...r.bars.map((b) => b.value)) * 1.08
  const [hover, setHover] = useState<number | null>(null)
  return (
    <ToolResult title={`${r.title} (${r.unit})`} icon={<IconChart size={13} />}>
      <figure>
        <figcaption className="sr-only">
          {r.title}: {r.bars.map((b) => `${b.label} ${b.value} ${r.unit}`).join(', ')}
        </figcaption>
        <ul className="flex flex-col gap-1.5" aria-hidden="true">
          {r.bars.map((b, i) => (
            <li key={b.label} className="grid grid-cols-[minmax(0,8.5rem)_1fr] items-center gap-3 text-[13px]" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <span className={cx('truncate', hover === i ? 'text-ink' : 'text-muted')}>{b.label}</span>
              <span className="flex items-center gap-2">
                <span
                  className="block h-3.5 origin-left rounded-r-sm transition-[width] duration-500 ease-out"
                  style={{ width: `${(b.value / max) * 100}%`, background: hover === null || hover === i ? 'var(--accent)' : 'color-mix(in srgb, var(--accent) 45%, transparent)' }}
                />
                <span className="shrink-0 font-medium tabular-nums">
                  {b.value} {r.unit}
                  {b.note ? <span className="ml-1 font-normal text-muted">· {b.note}</span> : null}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </figure>
    </ToolResult>
  )
}

/** Takvim sonucu: üç kişinin gün çizelgesi, dolu bloklar ve ortak boşluklar (vurgu rengi + "boş" etiketi) */
function CalendarResult({ r }: { r: Extract<Result, { kind: 'calendar' }> }) {
  const bas = 9 * 60
  const bit = 18 * 60
  const pct = (t: string) => ((toMin(t) - bas) / (bit - bas)) * 100
  return (
    <ToolResult title={`Yarın · ${r.sure} dk ortak boşluk`} icon={<IconCalendar size={13} />}>
      <div className="scroll-x" role="region" tabIndex={0} aria-label="Gün çizelgesi">
        <div className="min-w-[520px]">
          <div className="ml-14 flex justify-between text-[11px] text-muted tabular-nums" aria-hidden="true">
            {[9, 11, 13, 15, 17].map((h) => (
              <span key={h}>{String(h).padStart(2, '0')}:00</span>
            ))}
            <span>18:00</span>
          </div>
          <ul className="mt-1 flex flex-col gap-1.5">
            {r.people.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className="w-12 shrink-0 text-[13px] font-medium">{p}</span>
                <span className="relative h-6 flex-1 rounded-sm bg-sunken" aria-label={`${p} dolu: ${r.busy[p].map(([a, b]) => `${a}–${b}`).join(', ')}`} role="img">
                  {r.slots.map((s) => (
                    <span key={s} className="absolute inset-y-0 bg-accent-soft outline outline-1 -outline-offset-1 outline-accent-line" style={{ left: `${pct(s)}%`, width: `${(r.sure / (bit - bas)) * 100}%` }} />
                  ))}
                  {r.busy[p].map(([a, b]) => (
                    <span key={a} className="absolute inset-y-1 rounded-sm bg-line-strong" style={{ left: `${pct(a)}%`, width: `${pct(b) - pct(a)}%` }} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 ml-14 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-4 rounded-sm bg-line-strong" aria-hidden="true" /> dolu
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-4 rounded-sm bg-accent-soft outline outline-1 -outline-offset-1 outline-accent-line" aria-hidden="true" /> ortak boşluk: {r.slots.join(', ')}
            </span>
          </p>
        </div>
      </div>
    </ToolResult>
  )
}

/**
 * Üretilen form (generative UI): yanıtın içinde, bağlama göre çağrılan doldurulabilir bileşen.
 * Gönderilince yeni bir araç çağrısı (etkinlik_olustur) başlar.
 */
export function EventForm({ slots, disabled, onSubmit }: { slots: string[]; disabled?: boolean; onSubmit: (v: { baslik: string; zaman: string }) => void }) {
  const [zaman, setZaman] = useState(slots[0])
  const [baslik, setBaslik] = useState('Sprint planlama')
  const id = useId()
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!baslik.trim()) return
    onSubmit({ baslik: baslik.trim(), zaman })
  }
  return (
    <form onSubmit={submit} data-layout="Form · hug" className="hug gen-enter flex flex-col gap-3 rounded-md border border-accent-line bg-surface p-3 font-sans text-[14px]">
      <fieldset disabled={disabled}>
        <legend className="text-[12px] font-semibold tracking-wide text-muted uppercase">Zaman seçin</legend>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {slots.map((s) => (
            <label key={s} className={cx('cursor-pointer rounded-full border px-3 py-1 tabular-nums has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent', zaman === s ? 'border-accent bg-accent-soft font-medium text-accent-ink' : 'border-line hover:border-line-strong')}>
              <input type="radio" name={`${id}-z`} value={s} checked={zaman === s} onChange={() => setZaman(s)} className="sr-only" />
              {s}–{fromMin(toMin(s) + 45)}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-1">
        <span className="text-[12px] font-semibold tracking-wide text-muted uppercase">Başlık</span>
        <input value={baslik} onChange={(e) => setBaslik(e.target.value)} disabled={disabled} required className="min-h-10 rounded-md border border-line-strong bg-bg px-3 text-ink outline-none focus:border-accent" />
      </label>
      <div className="flex items-center gap-2">
        <button type="submit" disabled={disabled} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-accent px-4 font-medium text-on-accent hover:opacity-90 disabled:opacity-50">
          <IconCalendar size={15} />
          Davet gönder
        </button>
        <span className="text-[13px] text-muted">Siz, Ece, Mert · 45 dk</span>
      </div>
    </form>
  )
}
