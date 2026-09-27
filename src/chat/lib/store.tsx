import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTheme, type Theme } from '../../shared/useTheme'
import { FALLBACK, TOPICS, WELCOME, route, type WidgetId } from './topics'
import { analyze, KIND_LABEL, type Analysis, type Attachment } from './files'

export type Role = 'user' | 'assistant'
export type Status = 'thinking' | 'streaming' | 'done' | 'stopped'
export type Msg = {
  id: string
  role: Role
  text: string
  attachments?: Attachment[]
  widget?: WidgetId
  widgetTitle?: string
  analyses?: Analysis[]
  thinking?: string[]
  thought: number
  thinkMs?: number
  status: Status
  shown: number
  suggestions?: string[]
  time: number
}
export type Mode = 'tam' | 'kenar' | 'destek'
export type Brand = 'mavi' | 'mor' | 'yesil' | 'mercan'
export type Bubble = 'sivri' | 'kuyruk' | 'yuvarlak'
export type Speed = 'yavas' | 'normal' | 'hizli'
export type MotionPref = 'oto' | 'acik' | 'kapali'
export type Announcement = { id: number; t: string; text: string; politeness: 'polite' | 'assertive' }

export const tokenize = (s: string) => s.match(/\S+\s*|\s+/g) ?? []
export const plain = (s: string) => s.replace(/\*\*/g, '').replace(/`/g, '').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()

const SPEED: Record<Speed, { tok: number; step: number }> = {
  yavas: { tok: 90, step: 650 },
  normal: { tok: 32, step: 420 },
  hizli: { tok: 10, step: 200 },
}

function stored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback
  } catch {
    return fallback
  }
}
function save(key: string, v: string | null) {
  try {
    if (v === null) localStorage.removeItem(key)
    else localStorage.setItem(key, v)
  } catch {
    /* depolama kapalı */
  }
}
function useSetting<T extends string>(key: string, attr: string | null, allowed: readonly T[], fallback: T) {
  const [v, setV] = useState<T>(() => stored(key, allowed, fallback))
  useEffect(() => {
    if (attr) document.documentElement.setAttribute(attr, v)
  }, [attr, v])
  const set = useCallback(
    (n: T) => {
      setV(n)
      save(key, n)
    },
    [key],
  )
  return [v, set] as const
}
function useMedia(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const f = () => setM(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [q])
  return m
}

let seq = 0
const nid = () => `m${++seq}`
const welcome = (): Msg => ({ id: nid(), role: 'assistant', text: WELCOME, thought: 0, status: 'done', shown: tokenize(WELCOME).length, suggestions: TOPICS.map((t) => t.id), time: Date.now() })
const clock = () => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

type Store = {
  messages: Msg[]
  busy: boolean
  send: (text: string, attachments: Attachment[]) => void
  stop: () => void
  reset: () => void
  announcements: Announcement[]
  announce: (text: string, politeness?: 'polite' | 'assertive') => void
  theme: Theme
  setTheme: (t: Theme) => void
  mode: Mode
  setMode: (m: Mode) => void
  brand: Brand
  setBrand: (b: Brand) => void
  bubble: Bubble
  setBubble: (b: Bubble) => void
  speed: Speed
  setSpeed: (s: Speed) => void
  motion: 'acik' | 'kapali'
  motionPref: MotionPref
  setMotionPref: (p: MotionPref) => void
  realVoice: boolean
  setRealVoice: (b: boolean) => void
}
const Ctx = createContext<Store | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const { theme, setMode: setThemeMode } = useTheme('chat-theme')
  const [mode, setMode] = useSetting<Mode>('chat-mode', null, ['tam', 'kenar', 'destek'], 'tam')
  const [brand, setBrand] = useSetting<Brand>('chat-brand', 'data-brand', ['mavi', 'mor', 'yesil', 'mercan'], 'mavi')
  const [bubble, setBubble] = useSetting<Bubble>('chat-bubble', 'data-bubble', ['sivri', 'kuyruk', 'yuvarlak'], 'sivri')
  const [speed, setSpeed] = useSetting<Speed>('chat-speed', null, ['yavas', 'normal', 'hizli'], 'normal')
  const [motionPref, setMotionPref] = useSetting<MotionPref>('chat-motion', null, ['oto', 'acik', 'kapali'], 'oto')
  const [realVoiceS, setRealVoiceS] = useSetting<'acik' | 'kapali'>('chat-voice', null, ['acik', 'kapali'], 'kapali')
  const reduce = useMedia('(prefers-reduced-motion: reduce)')
  const motion = motionPref === 'oto' ? (reduce ? 'kapali' : 'acik') : motionPref
  useEffect(() => {
    document.documentElement.dataset.motion = motion === 'kapali' ? 'off' : 'on'
  }, [motion])

  const [messages, setMessages] = useState<Msg[]>(() => [welcome()])
  const [busy, setBusy] = useState(false)
  const [announcements, setAnn] = useState<Announcement[]>([])
  const timers = useRef<number[]>([])
  const active = useRef<string | null>(null)
  const annId = useRef(0)
  const speedRef = useRef(speed)
  speedRef.current = speed
  const motionRef = useRef(motion)
  motionRef.current = motion

  const announce = useCallback((text: string, politeness: 'polite' | 'assertive' = 'polite') => {
    setAnn((a) => [...a, { id: ++annId.current, t: clock(), text, politeness }].slice(-40))
  }, [])
  const patch = (id: string, p: Partial<Msg> | ((m: Msg) => Partial<Msg>)) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...(typeof p === 'function' ? p(m) : p) } : m)))
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  const run = useCallback((id: string, steps: string[], text: string, finishNote: string, prepare?: Promise<Partial<Msg>>) => {
    const off = motionRef.current === 'kapali'
    const sp = SPEED[speedRef.current]
    const stepMs = off ? 60 : sp.step
    const t0 = performance.now()
    announce('Asistan düşünüyor')
    steps.forEach((_, i) => later(() => patch(id, { thought: i + 1 }), stepMs * (i + 1)))
    const startStream = async () => {
      const extra = prepare ? await prepare : {}
      if (active.current !== id) return
      const toks = tokenize(extra.text ?? text)
      patch(id, { ...extra, status: 'streaming', thinkMs: Math.round(performance.now() - t0), shown: off ? toks.length : 0 })
      const finish = () => {
        patch(id, { status: 'done', shown: toks.length })
        active.current = null
        setBusy(false)
        announce(`Asistan: ${plain(extra.text ?? text)}${finishNote}`)
      }
      if (off) {
        later(finish, 30)
        return
      }
      let n = 0
      const tick = () => {
        n = Math.min(toks.length, n + (Math.random() < 0.2 ? 2 : 1))
        patch(id, { shown: n })
        if (n >= toks.length) finish()
        else later(tick, sp.tok * (0.6 + Math.random() * 0.8))
      }
      later(tick, sp.tok)
    }
    later(() => void startStream(), stepMs * (steps.length + 1))
  }, [announce])

  const send = useCallback(
    (raw: string, attachments: Attachment[]) => {
      const text = raw.trim()
      if ((!text && !attachments.length) || active.current) return
      const user: Msg = { id: nid(), role: 'user', text, attachments: attachments.length ? attachments : undefined, thought: 0, status: 'done', shown: 0, time: Date.now() }
      const id = nid()
      active.current = id
      setBusy(true)
      if (attachments.length) {
        const steps = ['Dosyaları tarayıcıda açıyorum', 'Tür, boyut ve içerik çıkarıyorum', 'Özet hazırlıyorum']
        const prepare = Promise.all(attachments.map(analyze)).then((analyses) => {
          const kinds = [...new Set(analyses.map((a) => KIND_LABEL[a.kind]))].join(', ')
          const txt = `**${analyses.length} dosyaya** baktım (${kinds}). Hepsi tarayıcınızda kaldı; hiçbir yere gönderilmedi.${text ? `\n\nNotunuzu da okudum: "${text.length > 80 ? text.slice(0, 80) + '…' : text}".` : ''}\n\nÖzet aşağıda. Başka bir dosya ekleyebilir ya da bir konu seçebilirsiniz.`
          return { text: txt, analyses, widget: 'dosya' as WidgetId, widgetTitle: 'dosya özeti' }
        })
        const a: Msg = { id, role: 'assistant', text: '', thinking: steps, thought: 0, status: 'thinking', shown: 0, suggestions: ['kutu', 'erisim', 'stil'], time: Date.now() }
        setMessages((ms) => [...ms, user, a])
        run(id, steps, '', ' Örnek: dosya özeti.', prepare)
        return
      }
      const t = route(text)
      const steps = t ? t.dusunce : ['Soruyu anlıyorum', 'Uygun madde arıyorum']
      const reply = t ? t.text : FALLBACK(text)
      const a: Msg = {
        id,
        role: 'assistant',
        text: reply,
        widget: t?.widget,
        widgetTitle: t?.widgetTitle,
        thinking: steps,
        thought: 0,
        status: 'thinking',
        shown: 0,
        suggestions: t ? t.sonraki : ['stil', 'kutu', 'erisim'],
        time: Date.now(),
      }
      setMessages((ms) => [...ms, user, a])
      run(id, steps, reply, t?.widgetTitle ? ` Örnek: ${t.widgetTitle}.` : '')
    },
    [run],
  )

  const stop = useCallback(() => {
    const id = active.current
    if (!id) return
    clear()
    patch(id, (m) => ({ status: 'stopped', thought: m.thinking?.length ?? 0 }))
    active.current = null
    setBusy(false)
    announce('Yanıt durduruldu')
  }, [announce])

  const reset = useCallback(() => {
    clear()
    active.current = null
    setBusy(false)
    setMessages([welcome()])
    announce('Yeni sohbet başladı')
  }, [announce])

  useEffect(() => clear, [])

  const value = useMemo<Store>(
    () => ({
      messages,
      busy,
      send,
      stop,
      reset,
      announcements,
      announce,
      theme,
      setTheme: (t) => setThemeMode(t),
      mode,
      setMode,
      brand,
      setBrand,
      bubble,
      setBubble,
      speed,
      setSpeed,
      motion,
      motionPref,
      setMotionPref,
      realVoice: realVoiceS === 'acik',
      setRealVoice: (b) => setRealVoiceS(b ? 'acik' : 'kapali'),
    }),
    [messages, busy, send, stop, reset, announcements, announce, theme, setThemeMode, mode, setMode, brand, setBrand, bubble, setBubble, speed, setSpeed, motion, motionPref, setMotionPref, realVoiceS, setRealVoiceS],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useChat() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useChat, ChatProvider içinde kullanılmalı')
  return s
}
