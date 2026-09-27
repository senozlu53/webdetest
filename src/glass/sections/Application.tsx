import { useEffect, useRef, useState } from 'react'
import { PaperPlaneRightIcon, SparkleIcon, TrendDownIcon, TrendUpIcon } from '@phosphor-icons/react'
import { GlassCard } from '../components/GlassCard'
import { SectionHead } from '../components/SectionHead'
import { HOLDINGS, PROMPTS, WATCHLIST } from '../content'
import { cx } from '../../shared/cx'

type Message = { role: 'user' | 'assistant'; text: string }

const pct = new Intl.NumberFormat('tr-TR', { style: 'percent', maximumFractionDigits: 0 })
const signedPct = new Intl.NumberFormat('tr-TR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: 'always' })

function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Merhaba. Harcamalarınız, portföyünüz ve tasarruf hedefleriniz hakkında soru sorabilirsiniz. Aşağıdaki önerilerden birini seçin.' },
  ])
  const [typing, setTyping] = useState(false)
  const listRef = useRef<HTMLOListElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])
  // Yalnızca sohbet listesini kaydır; sayfanın kendisi yerinde kalır
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, typing])

  function ask(i: number) {
    if (typing) return
    const p = PROMPTS[i]
    setMessages((m) => [...m, { role: 'user', text: p.q }])
    setTyping(true)
    timer.current = window.setTimeout(() => {
      setMessages((m) => [...m, { role: 'assistant', text: p.a }])
      setTyping(false)
    }, 900)
  }

  return (
    <GlassCard holo blur="xl" className="flex h-[560px] min-w-0 flex-col overflow-hidden">
      <header className="flex items-center gap-3 border-b border-glass-border px-5 py-4">
        <span className="grid size-10 place-items-center rounded-full text-white [background-image:linear-gradient(135deg,var(--blob-1),var(--blob-3))]">
          <SparkleIcon size={20} weight="fill" aria-hidden="true" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="font-semibold">Finans asistanı</span>
          <span className="text-sm text-ink-muted">Örnek sohbet · yanıtlar önceden yazıldı</span>
        </span>
      </header>
      <ol ref={listRef} aria-live="polite" className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
        {messages.map((m, i) => (
          <li
            key={i}
            data-blur="sm"
            data-tone={m.role === 'user' ? 'strong' : 'panel'}
            className={cx(
              'glass max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              m.role === 'user' ? 'ml-auto rounded-br-md' : 'rounded-bl-md',
            )}
          >
            <span className="sr-only">{m.role === 'user' ? 'Siz: ' : 'Asistan: '}</span>
            {m.text}
          </li>
        ))}
        {typing ? (
          <li data-blur="sm" className="glass flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md px-4 py-3" aria-label="Asistan yazıyor">
            {[0, 1, 2].map((d) => (
              <span key={d} className="size-1.5 animate-pulse rounded-full bg-ink-muted" style={{ animationDelay: `${d * 150}ms` }} />
            ))}
          </li>
        ) : null}
      </ol>
      <div className="flex flex-col gap-3 border-t border-glass-border p-4">
        <div className="flex flex-wrap gap-2">
          {PROMPTS.map((p, i) => (
            <button
              key={p.q}
              type="button"
              disabled={typing}
              onClick={() => ask(i)}
              data-blur="sm"
              data-tone="subtle"
              className="glass min-h-11 cursor-pointer rounded-full px-4 text-left text-sm font-medium transition-colors duration-300 hover:bg-glass-strong disabled:cursor-wait disabled:opacity-60"
            >
              {p.q}
            </button>
          ))}
        </div>
        <div data-blur="md" className="glass flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-4">
          <span className="flex-1 text-sm text-ink-muted">Bu örnekte serbest yazma kapalı; önerilerden birini seçin.</span>
          <span className="grid size-10 place-items-center rounded-full text-(--primary-text) opacity-60 [background-image:linear-gradient(120deg,var(--primary-from),var(--primary-to))]" aria-hidden="true">
            <PaperPlaneRightIcon size={18} weight="fill" />
          </span>
        </div>
      </div>
    </GlassCard>
  )
}

function Allocation() {
  return (
    <GlassCard tilt className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-muted">Portföy değeri</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight">1.284.500 TL</p>
        </div>
        <p className="inline-flex items-center gap-1 text-sm font-semibold text-up">
          <TrendUpIcon size={16} weight="bold" aria-hidden="true" />
          %2,4 bugün
        </p>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Dağılım</p>
        <div className="flex h-3 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
          {HOLDINGS.map((h) => (
            <span key={h.label} style={{ width: `${h.share * 100}%`, background: h.color }} />
          ))}
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {HOLDINGS.map((h) => (
            <li key={h.label} className="flex items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: h.color }} aria-hidden="true" />
              <span className="flex-1">{h.label}</span>
              <span className="font-mono tabular-nums">{pct.format(h.share)}</span>
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  )
}

function Watchlist() {
  return (
    <GlassCard className="p-6">
      <h3 className="font-semibold">İzleme listesi</h3>
      <ul className="mt-3 flex flex-col divide-y divide-glass-border">
        {WATCHLIST.map((w) => {
          const up = w.change >= 0
          const Trend = up ? TrendUpIcon : TrendDownIcon
          return (
            <li key={w.code} className="flex min-h-14 items-center gap-3 py-2">
              <span data-blur="sm" data-tone="subtle" className="glass grid size-10 place-items-center rounded-xl font-mono text-[11px] font-semibold">
                {w.code.slice(0, 2)}
              </span>
              <span className="flex flex-1 flex-col leading-tight">
                <span className="font-mono text-sm font-semibold">{w.code}</span>
                <span className="text-xs text-ink-muted">{w.name}</span>
              </span>
              <span className="flex flex-col items-end leading-tight">
                <span className="font-mono text-sm tabular-nums">{w.price} TL</span>
                <span className={cx('inline-flex items-center gap-1 font-mono text-xs font-semibold tabular-nums', up ? 'text-up' : 'text-down')}>
                  <Trend size={12} weight="bold" aria-hidden="true" />
                  {signedPct.format(w.change / 100)}
                  <span className="sr-only">{up ? ' yükseliş' : ' düşüş'}</span>
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </GlassCard>
  )
}

export function Application() {
  return (
    <section id="uygulama" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="10"
          label="UI kullanım alanı"
          title="Yapay zekâ ve finans panelleri"
          lede="Yapay zekâ arayüzleri, teknoloji açılış sayfaları, finansal göstergeler ve portfolyolar. Aşağıdaki ekranlar kurgusaldır; sohbet önerileri çalışır."
        />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Assistant />
          <div className="flex min-w-0 flex-col gap-6">
            <Allocation />
            <Watchlist />
          </div>
        </div>
      </div>
    </section>
  )
}
