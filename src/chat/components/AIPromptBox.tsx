import { useEffect, useId, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { useChat } from '../lib/store'
import { fmtSize, kind, KIND_LABEL, MAX_BYTES, MAX_FILES, type Attachment } from '../lib/files'
import { AIVoiceInput } from './AIVoiceInput'
import { SettingsButton } from './Settings'
import { IconClip, IconFile, IconMic, IconSend, IconStop, IconX } from './Icons'
import { cx } from '../../shared/cx'

/**
 * <AIPromptBox> (Madde 7 · 9 · 11): metin, ses ve dosya eki barındıran komut kutusu.
 * Enter gönderir, Shift+Enter yeni satır; üretim sürerken gönder düğmesi "durdur" olur (Escape de durdurur).
 */
export function AIPromptBox({ attachments, onAddFiles, onRemove, onClear, errors, compact }: { attachments: Attachment[]; onAddFiles: (f: File[]) => void; onRemove: (id: string) => void; onClear: () => void; errors: string[]; compact?: boolean }) {
  const s = useChat()
  const [text, setText] = useState('')
  const [voice, setVoice] = useState(false)
  const ta = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const canSend = !s.busy && (!!text.trim() || attachments.length > 0)

  const submit = () => {
    if (s.busy) {
      s.stop()
      return
    }
    if (!canSend) return
    s.send(text, attachments)
    setText('')
    onClear()
  }
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      if (!s.busy) submit()
    } else if (e.key === 'Escape' && s.busy) {
      e.preventDefault()
      s.stop()
    }
  }
  const onPaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const files = [...e.clipboardData.files]
    if (files.length) {
      e.preventDefault()
      onAddFiles(files)
    }
  }
  // Ses bitince odak metin alanına döner (ilk açılışta odak zorlanmaz: mobilde klavye kendiliğinden açılmasın)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!voice) ta.current?.focus({ preventScroll: true })
  }, [voice])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="prompt-box relative"
      aria-label="Mesaj yaz"
    >
      {attachments.length ? (
        <ul className="no-scrollbar flex gap-2 overflow-x-auto px-3 pt-3" aria-label={`${attachments.length} ek, en fazla ${MAX_FILES}`}>
          {attachments.map((a) => (
            <li key={a.id} className="relative flex shrink-0 items-center gap-2 rounded-xl border border-line bg-sunken py-1.5 pr-8 pl-1.5">
              {a.url ? <img src={a.url} alt="" className="size-10 rounded-lg object-cover" /> : <span className="grid size-10 place-items-center rounded-lg bg-brand-soft text-brand-ink"><IconFile size={18} /></span>}
              <span className="max-w-[160px] text-[13px] leading-tight">
                <span className="block truncate font-medium">{a.file.name}</span>
                <span className="text-muted">
                  {KIND_LABEL[kind(a.file)]} · {fmtSize(a.file.size)}
                </span>
              </span>
              <button type="button" onClick={() => onRemove(a.id)} className="absolute top-1 right-1 grid size-6 place-items-center rounded-full text-muted hover:bg-surface hover:text-ink" aria-label={`${a.file.name} ekini kaldır`}>
                <IconX size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {voice ? (
        <AIVoiceInput
          real={s.realVoice}
          onCancel={() => {
            setVoice(false)
            s.announce('Ses kaydı iptal edildi')
          }}
          onDone={(t) => {
            setText((x) => (x ? `${x.trimEnd()} ${t}` : t))
            setVoice(false)
            s.announce('Ses metne çevrildi; göndermeden önce düzenleyebilirsiniz')
          }}
        />
      ) : (
        <>
          <label htmlFor={id} className="sr-only">
            Mesaj
          </label>
          <textarea
            ref={ta}
            id={id}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
            onPaste={onPaste}
            rows={1}
            placeholder={s.busy ? 'Yanıt yazılıyor… (Esc: durdur)' : 'Mesaj yazın…'}
            aria-describedby={`${id}-ipucu`}
            className={cx('block w-full resize-none bg-transparent px-4 pt-3.5 text-[16px] leading-[1.6] text-ink outline-none placeholder:text-muted [field-sizing:content]', compact ? 'max-h-32 min-h-[48px]' : 'max-h-[40vh] min-h-[56px]')}
          />
          <p id={`${id}-ipucu`} className="sr-only">
            Enter gönderir, Shift artı Enter yeni satır açar. Dosya yapıştırabilir ya da sohbetin üstüne bırakabilirsiniz.
          </p>
          <div className="flex items-center gap-1 px-2 pb-2">
            <input
              ref={fileRef}
              type="file"
              multiple
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={(e) => {
                onAddFiles([...(e.target.files ?? [])])
                e.target.value = ''
              }}
            />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={attachments.length >= MAX_FILES} className="grid size-10 place-items-center rounded-full text-muted hover:bg-sunken hover:text-ink disabled:opacity-40" aria-label={`Dosya ekle (en fazla ${MAX_FILES}, her biri ${fmtSize(MAX_BYTES)})`}>
              <IconClip size={20} />
            </button>
            <SettingsButton />
            <span className="flex-1" />
            <button type="button" onClick={() => setVoice(true)} disabled={s.busy} className="grid size-10 place-items-center rounded-full text-muted hover:bg-sunken hover:text-ink disabled:opacity-40" aria-label="Sesle yaz">
              <IconMic size={20} />
            </button>
            <button
              type="submit"
              disabled={!s.busy && !canSend}
              aria-label={s.busy ? 'Yanıtı durdur' : 'Gönder'}
              className={cx('grid size-10 place-items-center rounded-full transition-colors disabled:opacity-35', s.busy ? 'bg-ink text-chat' : 'bg-brand text-on-brand hover:opacity-90')}
            >
              {s.busy ? <IconStop size={18} /> : <IconSend size={20} />}
            </button>
          </div>
        </>
      )}
      {errors.length ? (
        <ul role="alert" className="border-t border-line px-4 py-2 text-[13px] text-err">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : null}
    </form>
  )
}
