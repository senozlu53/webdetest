import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { SCENARIOS, pick, type Scenario } from '../lib/scenarios'
import { Turn } from './Turn'
import { IconSend, IconSpark, IconStop } from './Icons'
import { cx } from '../../shared/cx'

type T = { id: string; query: string; sc: Scenario }
let seq = 0

/**
 * Asistan: soruya göre senaryo seçilir; arayüz o tur için adım adım üretilir.
 * `autoStart` verilirse bölüm ekrana ilk girdiğinde o soru kendiliğinden çalışır.
 */
export function Assistant({ autoStart, compact }: { autoStart?: string; compact?: boolean }) {
  const [turns, setTurns] = useState<T[]>([])
  const [busy, setBusy] = useState(false)
  const [stop, setStop] = useState(0)
  const [q, setQ] = useState('')
  const [duyuru, setDuyuru] = useState('')
  const wrap = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  const ask = (text: string) => {
    const t = text.trim()
    if (!t || busy) return
    setTurns((l) => [...l.slice(-3), { id: `t${++seq}`, query: t, sc: pick(t) }])
    setQ('')
  }

  useEffect(() => {
    if (!autoStart || started.current || !wrap.current) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        ask(autoStart)
        io.disconnect()
      }
    }, { threshold: 0.2 })
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [autoStart])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (busy) setStop((s) => s + 1)
    else ask(q)
  }
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!busy) ask(q)
    }
  }

  return (
    <div ref={wrap} className="flex flex-col gap-6">
      <p className="sr-only" role="status" aria-live="polite">
        {duyuru}
      </p>
      {turns.length ? (
        <div className="flex flex-col gap-10">
          {turns.map((t) => (
            <Turn key={t.id} id={t.id} query={t.query} sc={t.sc} stopSignal={stop} onBusy={setBusy} onAnnounce={setDuyuru} />
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-md border border-dashed border-line-strong px-4 py-6 font-sans text-[14px] text-muted">
          <IconSpark size={14} className="text-accent" />
          Henüz bir şey üretilmedi. Aşağıdan bir soru seçin: arayüz yanıtla birlikte oluşur.
        </div>
      )}

      <form onSubmit={onSubmit} className={cx('sticky bottom-3 z-20 rounded-md border border-line-strong bg-surface p-2 font-sans shadow-tool', compact && 'static')}>
        <label htmlFor="gen-soru" className="sr-only">
          Soru
        </label>
        <div className="flex items-end gap-2">
          <textarea
            id="gen-soru"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            rows={1}
            placeholder="Bir şey sorun… (Enter gönderir, Shift+Enter yeni satır)"
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] text-ink outline-none placeholder:text-muted [field-sizing:content]"
          />
          <button
            type="submit"
            disabled={!busy && !q.trim()}
            aria-label={busy ? 'Üretimi durdur' : 'Gönder'}
            className={cx('grid size-10 shrink-0 place-items-center rounded-md transition-colors disabled:opacity-40', busy ? 'border border-line-strong text-ink hover:bg-sunken' : 'bg-accent text-on-accent hover:opacity-90')}
          >
            {busy ? <IconStop size={14} /> : <IconSend size={16} />}
          </button>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5 px-1 pb-0.5" role="group" aria-label="Örnek sorular">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={busy}
              onClick={() => ask(s.chip)}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-line px-2.5 text-[13px] text-muted transition-colors hover:border-accent-line hover:text-ink disabled:opacity-50"
            >
              <span className="font-medium text-accent-ink">{s.kullanim}</span>
              <span className="hidden max-w-[26ch] truncate sm:inline">{s.chip}</span>
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}
