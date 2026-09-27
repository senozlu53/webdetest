import { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { Source } from '../lib/scenarios'
import { IconCheck, IconChevron, IconError, IconPending, IconSpark, IconThinking, IconTool, toolIcon } from './Icons'

/**
 * Madde 16: yumuşak yükseklik esnemesi. İçerik büyüdükçe dış kutu ölçülen yüksekliğe 240ms'de geçer;
 * içerik akarken (sık değişimde) geçiş kısa tutulur. Hareket kapalıyken anında.
 */
export function AutoHeight({ children, className }: { children: ReactNode; className?: string }) {
  const inner = useRef<HTMLDivElement>(null)
  const [h, setH] = useState<number | undefined>(undefined)
  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return
    const ro = new ResizeObserver(() => setH(el.offsetHeight))
    ro.observe(el)
    setH(el.offsetHeight)
    return () => ro.disconnect()
  }, [])
  return (
    <div className={cx('transition-[height] duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] [overflow-y:clip]', className)} style={{ height: h }}>
      {/* Alt boşluk: son kartın gölgesi kırpılmasın */}
      <div ref={inner} className="pb-3">
        {children}
      </div>
    </div>
  )
}

export function StreamCursor() {
  return <span className="gen-cursor" aria-hidden="true" />
}

/* ── Atıf bağlamı: satır içi [n] kaynağını bulur ── */
type CiteCtx = { turn: string; sources: Source[] }
export const CitationContext = createContext<CiteCtx>({ turn: 'x', sources: [] })

/**
 * <AICitation> (Madde 11 · 14): satır içi [n]. Kaynak kartına bağlantıdır; üzerine gelince ya da odakta
 * alan adı, başlık ve önizleme görünür.
 */
export function AICitation({ n }: { n: number }) {
  const { turn, sources } = useContext(CitationContext)
  const src = sources.find((s) => s.n === n)
  const tip = useId()
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block align-baseline">
      <a
        href={`#kaynak-${turn}-${n}`}
        className="cite ml-0.5 inline-grid h-[1.35em] min-w-[1.35em] place-items-center rounded-sm border border-accent-line bg-accent-soft px-1 align-[0.12em] font-sans text-[11px] leading-none font-semibold text-accent-ink no-underline hover:border-accent focus-visible:border-accent"
        aria-label={src ? `Kaynak ${n}: ${src.title}` : `Kaynak ${n}`}
        aria-describedby={open ? tip : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {n}
      </a>
      {open && src ? (
        <span id={tip} role="tooltip" className="gen-enter absolute bottom-[calc(100%+6px)] left-1/2 z-30 block w-[min(300px,80vw)] -translate-x-1/2 rounded-md border border-line bg-surface p-3 text-left font-sans text-[13px] leading-snug not-italic shadow-tool">
          <span className="block truncate text-[12px] text-muted">{src.domain}</span>
          <span className="mt-0.5 block font-semibold text-ink">{src.title}</span>
          <span className="mt-1 line-clamp-3 block text-muted">{src.preview}</span>
        </span>
      ) : null}
    </span>
  )
}

/** <AISources> (Madde 14): alan adı, başlık ve önizleme barındıran kaynak kartları */
export function AISources({ sources, turn, compact }: { sources: Source[]; turn: string; compact?: boolean }) {
  if (!sources.length) return null
  return (
    <section aria-label="Kaynaklar" className="font-sans">
      <h4 className="text-[13px] font-semibold text-muted">Kaynaklar</h4>
      <ol className={cx('mt-2 grid gap-2', compact ? 'grid-cols-1' : 'sm:grid-cols-2')}>
        {sources.map((s) => {
          const Title = s.href ? 'a' : 'span'
          return (
            <li key={s.n} id={`kaynak-${turn}-${s.n}`} className="gen-enter scroll-mt-24 rounded-md border border-line bg-surface p-3 target:border-accent target:bg-accent-soft">
              <div className="flex items-center gap-2 text-[12px] text-muted">
                <span className="grid size-5 shrink-0 place-items-center rounded-sm bg-sunken font-mono text-[11px] font-semibold text-ink" aria-hidden="true">
                  {s.n}
                </span>
                <span className="truncate">{s.domain}</span>
              </div>
              <Title {...(s.href ? { href: s.href, target: '_blank', rel: 'noreferrer' } : {})} className={cx('mt-1.5 block text-[14px] leading-snug font-semibold text-ink', s.href && 'underline-offset-2 hover:text-accent-ink hover:underline')}>
                <span className="sr-only">Kaynak {s.n}: </span>
                {s.title}
              </Title>
              <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{s.preview}</p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export type ToolStatus = 'pending' | 'running' | 'done' | 'error'
const STATUS_TEXT: Record<ToolStatus, string> = { pending: 'sırada', running: 'çalışıyor', done: 'tamamlandı', error: 'hata' }

function StatusIcon({ s }: { s: ToolStatus }) {
  if (s === 'running') return <IconTool size={16} className="text-accent" />
  if (s === 'done') return <IconCheck size={16} className="text-ok" />
  if (s === 'error') return <IconError size={16} className="text-err" />
  return <IconPending size={16} className="text-muted" />
}

/**
 * <ToolCall> (Madde 11 · 14): araç adı, çalışma durumu ve parametreler. Düz kart (Border/ToolCard);
 * parametreler açılır kapanır. Durum metinle de yazılır, ikon tek başına anlam taşımaz.
 */
export function ToolCall({ name, params, status, summary, elapsed, defaultOpen }: { name: string; params: Record<string, unknown>; status: ToolStatus; summary?: string; elapsed?: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)
  const id = useId()
  const Icon = toolIcon(name)
  return (
    <div data-layout="ToolCall · hug" className="hug gen-enter rounded-md border border-line bg-surface font-sans text-[14px]">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left hover:bg-sunken">
        <StatusIcon s={status} />
        <Icon size={15} className="text-muted" />
        <code className="font-mono text-[13px] font-medium text-ink">{name}</code>
        <span className={cx('text-[13px]', status === 'running' ? 'gen-shimmer' : 'text-muted')}>
          {STATUS_TEXT[status]}
          {status === 'done' && summary ? ` · ${summary}` : ''}
          {status === 'done' && elapsed ? ` · ${(elapsed / 1000).toFixed(1).replace('.', ',')} sn` : ''}
        </span>
        <IconChevron open={open} size={14} className="ml-auto text-muted" />
        <span className="sr-only">parametreler</span>
      </button>
      <div id={id} hidden={!open} className="border-t border-line px-3 py-2">
        <p className="text-[12px] font-medium text-muted">Parametreler</p>
        <pre className="scroll-x mt-1 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-ink">{JSON.stringify(params, null, 2)}</pre>
      </div>
    </div>
  )
}

/** <ToolResult> (Madde 7): tek yükseltilmiş katman. Hafif gölge yalnız araç sonucunda. */
export function ToolResult({ title, icon, children, className }: { title: string; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section data-layout="ToolResult · hug" aria-label={title} className={cx('gen-enter min-w-0 rounded-md border border-line bg-surface p-3 font-sans shadow-tool md:p-4', className)}>
      <h4 className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-muted uppercase">
        {icon}
        {title}
      </h4>
      <div className="mt-2.5">{children}</div>
    </section>
  )
}

/** AI Generation Progress (Madde 16): adım adım üretim */
export function GenProgress({ steps, current, done }: { steps: string[]; current: number; done: boolean }) {
  return (
    <ol aria-label="Üretim adımları" className="flex flex-wrap items-center gap-x-1 gap-y-1 font-sans text-[12.5px]">
      {steps.map((s, i) => {
        const state = done || i < current ? 'bitti' : i === current ? 'etkin' : 'bekliyor'
        return (
          <li key={s + i} className="flex items-center gap-1" aria-current={state === 'etkin' ? 'step' : undefined}>
            {i ? <span className={cx('h-px w-3', state === 'bekliyor' ? 'bg-line-strong' : 'bg-accent')} aria-hidden="true" /> : null}
            <span className={cx('inline-flex items-center gap-1 rounded-full border px-2 py-0.5', state === 'etkin' ? 'border-accent-line bg-accent-soft text-accent-ink' : state === 'bitti' ? 'border-line text-ink' : 'border-line text-muted')}>
              {state === 'bitti' ? <IconCheck size={12} className="text-ok" /> : state === 'etkin' ? <IconThinking size={12} className="text-accent" /> : null}
              {s}
              <span className="sr-only">: {state}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/** AI Streaming Indicator (Madde 11): kısmi yanıt durumu */
export function StreamingIndicator({ state, tokens }: { state: 'dusunuyor' | 'yaziyor' | 'bitti' | 'durdu'; tokens?: number }) {
  return (
    <p className="flex items-center gap-2 font-sans text-[13px] text-muted">
      {state === 'dusunuyor' ? (
        <>
          <IconThinking size={16} className="text-accent" />
          <span className="gen-shimmer">Düşünüyor</span>
        </>
      ) : state === 'yaziyor' ? (
        <>
          <IconSpark size={14} className="text-accent" />
          <span>Yanıt yazılıyor</span>
          {tokens ? <span className="tabular-nums">· {tokens} token</span> : null}
        </>
      ) : state === 'durdu' ? (
        <>
          <IconError size={15} className="text-muted" />
          <span>Durduruldu{tokens ? ` · ${tokens} token` : ''}</span>
        </>
      ) : (
        <>
          <IconSpark size={14} className="text-accent" />
          <span>Yanıt tamam{tokens ? ` · ${tokens} token` : ''}</span>
        </>
      )}
    </p>
  )
}

/** Belirli bir süre sonra true olur (hareket kapalıysa hemen) */
export function useAfter(ms: number, on = true) {
  const [v, setV] = useState(false)
  useEffect(() => {
    if (!on) return
    const t = window.setTimeout(() => setV(true), ms)
    return () => window.clearTimeout(t)
  }, [ms, on])
  return v
}
