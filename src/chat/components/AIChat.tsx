import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type DragEvent, type ReactNode } from 'react'
import { useChat } from '../lib/store'
import { TOPICS, topic } from '../lib/topics'
import { validate, isImage, type Attachment } from '../lib/files'
import { AIMessage, type Pos } from './AIMessage'
import { AIPromptBox } from './AIPromptBox'
import { IconDown, IconUpload } from './Icons'
import { cx } from '../../shared/cx'

let aseq = 0

/** AI Prompt Suggestions (Madde 11): son yanıta göre değişen öneri çipleri */
function Suggestions({ ids, onPick }: { ids: string[]; onPick: (q: string) => void }) {
  if (!ids.length) return null
  return (
    <div className="no-scrollbar -mx-1 mb-2 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible" role="group" aria-label="Önerilen sorular">
      {ids.map((id) => {
        const t = topic(id)
        return (
          <button key={id} type="button" onClick={() => onPick(t.soru)} className="shrink-0 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[14px] whitespace-nowrap text-ink shadow-[var(--card-shadow)] hover:border-line-strong hover:bg-sunken">
            {t.chip}
          </button>
        )
      })}
    </div>
  )
}

/**
 * <AIChat> (Madde 11 · 12 · 14 · 15): dikey akış + altta sabit komut kutusu.
 * Liste flex-col-reverse bir kaydırma alanında: tarayıcı en alttan başlar ve yeni mesajda en sonda kalır.
 * Kullanıcı yukarı kaydırdıysa yeri korunur, "son mesaja in" düğmesi yeni mesaj sayısıyla belirir.
 */
export function AIChat({ header, compact, className }: { header?: ReactNode; compact?: boolean; className?: string }) {
  const s = useChat()
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [drag, setDrag] = useState(false)
  const [away, setAway] = useState(false)
  const [unread, setUnread] = useState(0)
  const [bottomH, setBottomH] = useState(160)
  const scroller = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const count = useRef(s.messages.length)
  const dragDepth = useRef(0)
  const hid = useId()

  // Alt bölgenin (çipler + kutu) yüksekliği: liste o kadar alt boşluk bırakır
  useLayoutEffect(() => {
    const el = bottom.current
    if (!el) return
    const ro = new ResizeObserver(() => setBottomH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // column-reverse'te scrollTop 0 = en alt; yukarı kaydırdıkça negatif olur
  const onScroll = () => {
    const el = scroller.current
    if (!el) return
    const far = -el.scrollTop > 160
    setAway(far)
    if (!far) setUnread(0)
  }
  useEffect(() => {
    const added = s.messages.length - count.current
    count.current = s.messages.length
    if (added > 0 && away) setUnread((u) => u + added)
    if (s.messages.length === 1) setUnread(0)
  }, [s.messages.length, away])

  const toBottom = () => {
    scroller.current?.scrollTo({ top: 0, behavior: s.motion === 'kapali' ? 'auto' : 'smooth' })
    setUnread(0)
  }
  // Kullanıcı mesaj gönderince her zaman en alta dönülür
  const lastUser = [...s.messages].reverse().find((m) => m.role === 'user')?.id
  useEffect(() => {
    if (lastUser) scroller.current?.scrollTo({ top: 0 })
  }, [lastUser])

  const addFiles = useCallback(
    (files: File[]) => {
      if (!files.length) return
      const { ok, errors: errs } = validate(attachments.length, files)
      setErrors(errs)
      if (errs.length) s.announce(`Eklenemedi: ${errs.join('; ')}`, 'assertive')
      if (ok.length) {
        setAttachments((a) => [...a, ...ok.map((file) => ({ id: `a${++aseq}`, file, url: isImage(file) ? URL.createObjectURL(file) : undefined }))])
        s.announce(`${ok.length} dosya eklendi: ${ok.map((f) => f.name).join(', ')}`)
      }
    },
    [attachments.length, s],
  )
  const remove = (id: string) => {
    const a = attachments.find((x) => x.id === id)
    if (a?.url) URL.revokeObjectURL(a.url)
    setAttachments((l) => l.filter((x) => x.id !== id))
    if (a) s.announce(`${a.file.name} kaldırıldı`)
  }

  const onDrag = (e: DragEvent, type: 'enter' | 'leave' | 'over' | 'drop') => {
    if (!e.dataTransfer?.types.includes('Files')) return
    e.preventDefault()
    if (type === 'enter') {
      dragDepth.current++
      setDrag(true)
    } else if (type === 'leave') {
      dragDepth.current = Math.max(0, dragDepth.current - 1)
      if (!dragDepth.current) setDrag(false)
    } else if (type === 'drop') {
      dragDepth.current = 0
      setDrag(false)
      addFiles([...e.dataTransfer.files])
    }
  }

  // Grup konumu: art arda aynı konuşmacı
  const pos = (i: number): Pos => {
    const r = s.messages[i].role
    const prev = s.messages[i - 1]?.role === r
    const next = s.messages[i + 1]?.role === r
    return prev && next ? 'mid' : prev ? 'last' : next ? 'first' : 'solo'
  }
  const last = s.messages[s.messages.length - 1]
  const chips = !s.busy && last?.role === 'assistant' && last.status !== 'thinking' ? (last.suggestions ?? []) : []

  return (
    <div
      className={cx('relative flex min-h-0 flex-col bg-chat', className)}
      onDragEnter={(e) => onDrag(e, 'enter')}
      onDragLeave={(e) => onDrag(e, 'leave')}
      onDragOver={(e) => onDrag(e, 'over')}
      onDrop={(e) => onDrag(e, 'drop')}
    >
      {header}
      <section aria-labelledby={hid} className="relative min-h-0 flex-1">
        <h2 id={hid} className="sr-only">
          Sohbet
        </h2>
        <div ref={scroller} onScroll={onScroll} tabIndex={-1} className="scroll-y absolute inset-0 flex flex-col-reverse">
          <div className={cx('mx-auto w-full', compact ? 'px-3' : 'max-w-3xl px-4 md:px-6')} style={{ paddingBottom: bottomH + 16 }}>
            <ol className="flex flex-col pt-2" aria-label="Mesajlar">
              {s.messages.map((m, i) => (
                <AIMessage key={m.id} m={m} pos={pos(i)} showTime={pos(i) === 'solo' || pos(i) === 'last'} />
              ))}
            </ol>
          </div>
        </div>
        {away ? (
          <button
            type="button"
            onClick={toBottom}
            className="slide-up absolute left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[14px] shadow-[0_4px_16px_rgb(0_0_0/0.12)] hover:bg-sunken"
            style={{ bottom: bottomH + 12 }}
          >
            <IconDown size={16} />
            {unread ? `${unread} yeni mesaj` : 'Son mesaja in'}
          </button>
        ) : null}
        {/* Madde 12: altta sabit komut çubuğu */}
        <div ref={bottom} className={cx('fade-up absolute inset-x-0 bottom-0 z-10 pt-6', compact ? 'px-3 pb-3' : 'px-3 pb-3 md:px-6 md:pb-5')}>
          <div className={cx('mx-auto', !compact && 'max-w-3xl')}>
            <Suggestions ids={chips.length ? chips : s.messages.length === 1 ? TOPICS.map((t) => t.id) : []} onPick={(q) => s.send(q, [])} />
            <AIPromptBox
              attachments={attachments}
              onAddFiles={addFiles}
              onRemove={remove}
              onClear={() => {
                setAttachments([])
                setErrors([])
              }}
              errors={errors}
              compact={compact}
            />
            {!compact ? <p className="mt-2 hidden text-center text-[12px] text-muted sm:block">Tanıtım: yanıtlar önceden yazılmıştır, dosyalar tarayıcınızdan çıkmaz.</p> : null}
          </div>
        </div>
        {drag ? (
          <div className="pointer-events-none absolute inset-2 z-20 grid place-items-center rounded-2xl border-2 border-dashed border-brand bg-brand-soft/90" aria-hidden="true">
            <p className="flex items-center gap-2 text-[16px] font-medium text-brand-ink">
              <IconUpload size={22} /> Dosyaları bırakın
            </p>
          </div>
        ) : null}
      </section>
    </div>
  )
}
