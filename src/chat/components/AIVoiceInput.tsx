import { useEffect, useRef, useState } from 'react'
import { IconCheck, IconX } from './Icons'
import { TOPICS } from '../lib/topics'

type SR = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}
type SRCtor = new () => SR
export const speechCtor = (): SRCtor | null => {
  const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

let demoIdx = 0
const BARS = 28

/**
 * <AIVoiceInput> (Madde 11 · 14): konuşmayı metne çevirir. "Gerçek konuşma tanıma" ayarı açık ve tarayıcı
 * destekliyorsa Web Speech API kullanılır (Chrome'da ses Google'a gider). Aksi hâlde tanıtım kaydı:
 * mikrofon açılmaz, örnek bir cümle yazıya dökülür. Sonuç göndermeden önce düzenlenebilir.
 */
export function AIVoiceInput({ real, onDone, onCancel }: { real: boolean; onDone: (text: string) => void; onCancel: () => void }) {
  const [sec, setSec] = useState(0)
  const [text, setText] = useState('')
  const [demo, setDemo] = useState(!real || !speechCtor())
  const [note, setNote] = useState(real && !speechCtor() ? 'Tarayıcınız konuşma tanımayı desteklemiyor; tanıtım kaydı kullanılıyor.' : '')
  const [levels, setLevels] = useState<number[]>(() => Array(BARS).fill(0.15))
  const rec = useRef<SR | null>(null)
  const finalText = useRef('')
  const confirmRef = useRef<HTMLButtonElement>(null)
  const textRef = useRef('')
  textRef.current = text

  // Süre ve ses seviyesi (seviye görseldir; mikrofon verisi okunmaz)
  useEffect(() => {
    const t = window.setInterval(() => setSec((s) => s + 1), 1000)
    const off = document.documentElement.dataset.motion === 'off'
    const l = off ? 0 : window.setInterval(() => setLevels((ls) => ls.map((v, i) => Math.max(0.12, Math.min(1, v * 0.55 + Math.random() * 0.6 * (0.6 + 0.4 * Math.sin((Date.now() / 180 + i) % 6.28)))))), 90)
    confirmRef.current?.focus()
    return () => {
      window.clearInterval(t)
      if (l) window.clearInterval(l)
    }
  }, [])

  // Gerçek tanıma
  useEffect(() => {
    if (demo) return
    const C = speechCtor()!
    const r = new C()
    r.lang = 'tr-TR'
    r.interimResults = true
    r.continuous = true
    r.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i]
        if (res.isFinal) finalText.current += res[0].transcript
        else interim += res[0].transcript
      }
      setText((finalText.current + interim).trim())
    }
    r.onerror = (e) => {
      setNote(`Konuşma tanıma kullanılamadı (${e.error}); tanıtım kaydına geçildi.`)
      setDemo(true)
    }
    const guard = window.setTimeout(() => {
      if (!textRef.current) {
        r.abort()
        setNote('Ses algılanmadı; tanıtım kaydına geçildi.')
        setDemo(true)
      }
    }, 9000)
    try {
      r.start()
      rec.current = r
    } catch {
      setDemo(true)
    }
    return () => {
      window.clearTimeout(guard)
      r.onresult = null
      r.onerror = null
      try {
        r.abort()
      } catch {
        /* zaten durdu */
      }
    }
  }, [demo])

  // Tanıtım: örnek cümle kelime kelime "duyulur"
  useEffect(() => {
    if (!demo) return
    const phrase = TOPICS[demoIdx++ % TOPICS.length].soru
    const words = phrase.split(' ')
    let n = 0
    setText('')
    const t = window.setInterval(() => {
      n++
      setText(words.slice(0, n).join(' '))
      if (n >= words.length) window.clearInterval(t)
    }, document.documentElement.dataset.motion === 'off' ? 1 : 260)
    return () => window.clearInterval(t)
  }, [demo])

  const mm = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
  return (
    <div
      role="group"
      aria-label="Ses kaydı"
      className="flex flex-col gap-2 px-3 pt-3 pb-2"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onCancel()
        }
      }}
    >
      <div className="flex items-center gap-3">
        <span className="pulse-ring grid size-3 shrink-0 place-items-center rounded-full bg-err" aria-hidden="true" />
        <span className="w-10 shrink-0 text-[14px] text-muted tabular-nums" aria-hidden="true">
          {mm}
        </span>
        <span className="flex h-8 flex-1 items-center gap-[3px] overflow-hidden" aria-hidden="true">
          {levels.map((v, i) => (
            <span key={i} className="level h-full w-[3px] shrink-0 rounded-full bg-muted/60" style={{ transform: `scaleY(${v})` }} />
          ))}
        </span>
        <button type="button" onClick={onCancel} className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-sunken hover:text-ink" aria-label="Kaydı iptal et">
          <IconX size={18} />
        </button>
        <button ref={confirmRef} type="button" onClick={() => onDone(text)} disabled={!text} className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-on-brand hover:opacity-90 disabled:opacity-40" aria-label="Metne çevir">
          <IconCheck size={18} />
        </button>
      </div>
      <p className="min-h-[1.6em] text-[15px]">
        {text ? <span>{text}</span> : <span className="text-muted">Dinleniyor…</span>}
      </p>
      <p className="text-[12px] text-muted">{note || (demo ? 'Tanıtım kaydı: mikrofon açılmadı, örnek bir cümle yazıya dökülüyor. Gerçek tanımayı ayarlardan açabilirsiniz.' : 'Tarayıcının konuşma tanıması kullanılıyor.')}</p>
    </div>
  )
}
