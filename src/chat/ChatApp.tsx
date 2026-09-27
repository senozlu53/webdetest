import { useEffect, useRef, useState } from 'react'
import { ChatProvider, useChat } from './lib/store'
import { AIChat } from './components/AIChat'
import { HostPage } from './host/HostPage'
import { IconChat, IconPlus, IconSpark, IconX } from './components/Icons'
import { useMedia, useVisualViewport } from './hooks/useVisualViewport'
import { cx } from '../shared/cx'

/**
 * Madde 18: iki gizli aria-live bölgesi. Yeni duyuru gelince önce boşaltılır, sonra yazılır;
 * böylece aynı metin art arda gelse de yeniden okunur.
 */
function LiveRegions() {
  const { announcements } = useChat()
  const [polite, setPolite] = useState('')
  const [assertive, setAssertive] = useState('')
  const last = announcements[announcements.length - 1]
  useEffect(() => {
    if (!last) return
    const set = last.politeness === 'assertive' ? setAssertive : setPolite
    set('')
    const t = window.setTimeout(() => set(last.text), 60)
    return () => window.clearTimeout(t)
  }, [last])
  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true" data-live="polite">
        {polite}
      </div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true" data-live="assertive">
        {assertive}
      </div>
    </>
  )
}

function Header({ panel, onClose }: { panel?: boolean; onClose?: () => void }) {
  const s = useChat()
  const newChat = (
    <button type="button" onClick={s.reset} disabled={s.messages.length < 2} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 text-[14px] whitespace-nowrap hover:bg-sunken disabled:opacity-40 sm:px-3">
      <IconPlus size={16} />
      <span className={panel ? 'sr-only' : 'max-sm:sr-only'}>Yeni sohbet</span>
    </button>
  )
  if (panel)
    return (
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="relative grid size-9 place-items-center rounded-full bg-brand text-on-brand" aria-hidden="true">
          <IconSpark size={16} />
          <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-chat bg-ok" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block font-semibold">Asistan</span>
          <span className="text-[13px] text-muted">Çevrimiçi · hemen yanıtlar</span>
        </span>
        {newChat}
        {onClose ? (
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full text-muted hover:bg-sunken hover:text-ink" aria-label="Sohbeti kapat">
            <IconX size={18} />
          </button>
        ) : null}
      </div>
    )
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line px-4 md:px-6">
      <span className="flex items-center gap-2 font-semibold">
        <span className="grid size-7 place-items-center rounded-lg bg-brand text-on-brand" aria-hidden="true">
          <IconChat size={16} />
        </span>
        <span>
          sohbet<span className="text-muted">·014</span>
        </span>
      </span>
      <h1 className="min-w-0 truncate text-[15px] font-medium text-muted">
        Stil 014<span className="max-sm:sr-only"> · Conversational UI</span>
      </h1>
      {newChat}
    </header>
  )
}

/** Destek balonu: köşede başlatıcı ve açılır pencere */
function Widget() {
  const s = useChat()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const launcher = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const doneCount = s.messages.filter((m) => m.role === 'assistant' && m.status === 'done').length
  const prev = useRef(doneCount)
  useEffect(() => {
    if (doneCount > prev.current && !open) setUnread((u) => u + (doneCount - prev.current))
    prev.current = doneCount
  }, [doneCount, open])
  useEffect(() => {
    if (open) {
      setUnread(0)
      window.setTimeout(() => panel.current?.querySelector('textarea')?.focus(), 30)
    }
  }, [open])
  const close = () => {
    setOpen(false)
    launcher.current?.focus()
  }
  return (
    <>
      {open ? (
        <div
          ref={panel}
          role="dialog"
          aria-modal="false"
          aria-label="Destek sohbeti"
          onKeyDown={(e) => {
            if (e.key === 'Escape' && !e.defaultPrevented) close()
          }}
          className="widget-panel slide-up z-50 flex flex-col overflow-hidden bg-chat sm:rounded-2xl sm:border sm:border-line sm:shadow-[0_20px_60px_rgb(0_0_0/0.2)]"
        >
          <Header panel onClose={close} />
          <AIChat compact className="flex-1" />
        </div>
      ) : null}
      <button
        ref={launcher}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-label={open ? 'Sohbeti kapat' : `Asistanla konuş${unread ? `, ${unread} okunmamış mesaj` : ''}`}
        className={cx('fixed right-5 bottom-5 z-50 grid size-14 place-items-center rounded-full bg-brand text-on-brand shadow-[0_8px_24px_rgb(0_0_0/0.22)] hover:opacity-95', open && 'max-sm:hidden')}
      >
        {open ? <IconX size={24} /> : <IconChat size={24} />}
        {unread && !open ? <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-err text-[11px] font-semibold text-white">{unread}</span> : null}
      </button>
    </>
  )
}

function Shell() {
  const s = useChat()
  useVisualViewport()
  const wide = useMedia('(min-width: 1024px)')
  const mode = s.mode === 'kenar' && !wide ? 'destek' : s.mode
  return (
    <>
      <LiveRegions />
      {mode === 'tam' ? (
        <div className="fixed inset-x-0 flex flex-col" style={{ top: 'var(--app-top, 0px)', height: 'var(--app-h, 100dvh)' }}>
          <Header />
          <main id="icerik" className="flex min-h-0 flex-1 flex-col">
            <AIChat className="flex-1" />
          </main>
        </div>
      ) : mode === 'kenar' ? (
        <div className="grid grid-cols-[minmax(0,1fr)_420px]" style={{ height: 'var(--app-h, 100dvh)' }}>
          <div className="scroll-y min-w-0">
            <HostPage />
          </div>
          <aside aria-label="Asistan" className="flex min-h-0 flex-col border-l border-line">
            <Header panel />
            <AIChat compact className="flex-1" />
          </aside>
        </div>
      ) : (
        <>
          <HostPage />
          <Widget />
        </>
      )}
    </>
  )
}

export default function ChatApp() {
  return (
    <ChatProvider>
      <Shell />
    </ChatProvider>
  )
}
