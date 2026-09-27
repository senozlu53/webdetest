import { useState, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { tokenize, type Msg } from '../lib/store'
import { fmtSize, kind, KIND_LABEL } from '../lib/files'
import { IconCheck, IconChevron, IconFile, IconSpark, IconSpinner } from './Icons'
import { Widget } from '../widgets/Widget'

export type Pos = 'solo' | 'first' | 'mid' | 'last'

/** Satır içi: **kalın**, `kod`. Akışta kapanmamış işaret sona kadar uygulanır. */
function inline(s: string, streaming: boolean): ReactNode[] {
  const out: ReactNode[] = []
  let i = 0
  let buf = ''
  const flush = () => {
    if (buf) out.push(buf)
    buf = ''
  }
  while (i < s.length) {
    if (s.startsWith('**', i)) {
      const end = s.indexOf('**', i + 2)
      if (end > i || streaming) {
        flush()
        out.push(<strong key={i}>{inline(s.slice(i + 2, end > i ? end : undefined), streaming && end < 0)}</strong>)
        if (end < 0) return out
        i = end + 2
        continue
      }
    }
    if (s[i] === '`') {
      const end = s.indexOf('`', i + 1)
      if (end > i || streaming) {
        flush()
        out.push(<code key={i}>{s.slice(i + 1, end > i ? end : undefined)}</code>)
        if (end < 0) return out
        i = end + 1
        continue
      }
    }
    buf += s[i]
    i++
  }
  flush()
  return out
}

/** Paragraflar ve "- " listeleri; metin whitespace-pre-wrap ile akar */
export function RichText({ text, streaming, caret }: { text: string; streaming?: boolean; caret?: boolean }) {
  const blocks = text.split(/\n{2,}/)
  return (
    <>
      {blocks.map((b, k) => {
        const last = k === blocks.length - 1
        const c = caret && last ? <span className="caret" aria-hidden="true" /> : null
        const lines = b.split('\n')
        if (lines.every((l) => l.startsWith('- ') || !l.trim())) {
          const items = lines.filter((l) => l.startsWith('- '))
          return (
            <ul key={k}>
              {items.map((l, j) => (
                <li key={j}>
                  {inline(l.slice(2), !!streaming && last && j === items.length - 1)}
                  {j === items.length - 1 ? c : null}
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={k}>
            {inline(b, !!streaming && last)}
            {c}
          </p>
        )
      })}
    </>
  )
}

/** AI Thinking Indicator (Madde 16): adımlar sırayla işaretlenir, bitince tek satıra katlanır */
export function AIThinking({ steps, done, finished, ms }: { steps: string[]; done: number; finished: boolean; ms?: number }) {
  const [open, setOpen] = useState(false)
  const list = (
    <ol className="mt-1 flex flex-col gap-1 border-l border-line pl-3 text-[14px]">
      {steps.map((s, i) => {
        const st = i < done ? 'bitti' : i === done && !finished ? 'etkin' : 'bekliyor'
        return (
          <li key={s} className={cx('flex items-center gap-2', st === 'bekliyor' ? 'text-muted/70' : st === 'etkin' ? 'text-ink' : 'text-muted')}>
            {st === 'bitti' ? <IconCheck size={15} className="text-ok" /> : st === 'etkin' ? <IconSpinner size={15} className="text-brand-ink" /> : <span className="inline-block size-[15px] rounded-full border border-dashed border-line-strong" aria-hidden="true" />}
            {s}
            <span className="sr-only">: {st}</span>
          </li>
        )
      })}
    </ol>
  )
  if (!finished)
    return (
      <div className="slide-up mb-2">
        <p className="flex items-center gap-2 text-[14px] text-muted">
          <span className="dots flex gap-1" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-current" />
            <span className="size-1.5 rounded-full bg-current" />
            <span className="size-1.5 rounded-full bg-current" />
          </span>
          Düşünüyor
        </p>
        {list}
      </div>
    )
  return (
    <div className="mb-1.5">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="-ml-1 inline-flex min-h-8 items-center gap-1 rounded-md px-1 text-[13px] text-muted hover:bg-sunken hover:text-ink">
        <IconChevron open={open} size={14} />
        Düşündü · {steps.length} adım{ms ? ` · ${(ms / 1000).toFixed(1).replace('.', ',')} sn` : ''}
      </button>
      {open ? list : null}
    </div>
  )
}

function Attachments({ m }: { m: Msg }) {
  if (!m.attachments?.length) return null
  return (
    <ul className="mb-1.5 flex flex-wrap justify-end gap-2" aria-label={`${m.attachments.length} ek`}>
      {m.attachments.map((a) =>
        a.url ? (
          <li key={a.id}>
            <img src={a.url} alt={a.file.name} className="size-24 rounded-xl border border-line object-cover" />
          </li>
        ) : (
          <li key={a.id} className="flex max-w-[240px] items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-ink">
              <IconFile size={18} />
            </span>
            <span className="min-w-0 text-[13px] leading-tight">
              <span className="block truncate font-medium">{a.file.name}</span>
              <span className="text-muted">
                {KIND_LABEL[kind(a.file)]} · {fmtSize(a.file.size)}
              </span>
            </span>
          </li>
        ),
      )}
    </ul>
  )
}

const hm = (t: number) => new Date(t).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

/**
 * <AIMessage> (Madde 11 · 14): kullanıcı (sağ, marka rengi) ve asistan (sol, nötr) durumları.
 * Asistan mesajı düşünür, akar, biter; varsa ardından etkileşimli örnek belirir.
 */
export function AIMessage({ m, pos, showTime }: { m: Msg; pos: Pos; showTime: boolean }) {
  const user = m.role === 'user'
  const toks = tokenize(m.text)
  const visible = m.status === 'done' ? m.text : toks.slice(0, m.shown).join('')
  const streaming = m.status === 'streaming'
  const [kopya, setKopya] = useState(false)
  return (
    <li className={cx('slide-up flex flex-col', user ? 'items-end' : 'items-start', pos === 'solo' || pos === 'first' ? 'mt-5' : 'mt-1')}>
      <h3 className="sr-only">{user ? 'Siz' : 'Asistan'}</h3>
      {user ? <Attachments m={m} /> : null}
      {!user && m.thinking ? <AIThinking steps={m.thinking} done={m.thought} finished={m.status !== 'thinking'} ms={m.thinkMs} /> : null}
      {(m.text && (visible || streaming)) || (user && m.text) ? (
        <div className={cx('flex max-w-[min(85%,640px)] items-end gap-2', user && 'flex-row-reverse')}>
          {!user && (pos === 'solo' || pos === 'last') ? (
            <span className="mb-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-ink" aria-hidden="true">
              <IconSpark size={14} />
            </span>
          ) : !user ? (
            <span className="w-7 shrink-0" aria-hidden="true" />
          ) : null}
          <div className={cx('bubble min-w-0', user ? 'bubble-user' : 'bubble-asst')} data-pos={pos} aria-busy={streaming || undefined}>
            <RichText text={visible} streaming={streaming} caret={streaming} />
          </div>
        </div>
      ) : null}
      {m.status === 'stopped' ? <p className="mt-1 ml-9 text-[13px] text-muted">Durduruldu{m.shown ? '' : ' · yanıt yazılmadan'}</p> : null}
      {m.status === 'done' && m.widget ? (
        <div className="slide-up mt-2 w-full pl-9">
          <Widget id={m.widget} title={m.widgetTitle ?? ''} m={m} />
        </div>
      ) : null}
      {showTime && m.status !== 'thinking' && m.status !== 'streaming' ? (
        <p className={cx('mt-1 flex items-center gap-2 text-[12px] text-muted', !user && 'ml-9')}>
          <time dateTime={new Date(m.time).toISOString()}>{hm(m.time)}</time>
          {!user && m.status === 'done' ? (
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(m.text.replace(/\*\*/g, '')).then(
                  () => {
                    setKopya(true)
                    window.setTimeout(() => setKopya(false), 1500)
                  },
                  () => undefined,
                )
              }}
              className="rounded px-1 hover:bg-sunken hover:text-ink"
            >
              {kopya ? 'kopyalandı' : 'kopyala'}
            </button>
          ) : null}
        </p>
      ) : null}
    </li>
  )
}
