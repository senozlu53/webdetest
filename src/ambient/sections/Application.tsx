import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { SparkleIcon } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { GlowCard } from '../components/GlowCard'
import { GlowButton } from '../components/GlowButton'
import { LiquidSpinner, MorphOrb } from '../components/Liquid'
import { cx } from '../../shared/cx'

const PROMPTS = [
  {
    q: 'Ambient arayüz nedir?',
    a: 'Ortamı bir yüzey gibi kullanan arayüz. Arka plan sabit bir renk değil, yavaşça akan bir ışıktır; bileşenler sınır çizgisi yerine parıltıyla ayrılır ve durum değiştiğinde sıvı gibi biçim değiştirir.',
  },
  {
    q: 'Bu sayfa pili ne kadar harcıyor?',
    a: 'Zemin lekeleri yalnızca transform ile hareket eder, bu yüzden tarayıcı onları bir kez çizip GPU üzerinde kaydırır. Mobilde leke sayısı beşten üçe iner ve hız yarıya düşer. Hareket azaltma açıksa her şey durur.',
  },
  {
    q: 'Koyu zeminde yazı nasıl okunur kalıyor?',
    a: 'Metnin arkasına kenarları eriyen koyu bir katman konur. %62 opaklıkta, en parlak aurora rengi tam arkaya gelse bile beyaz metin 8,49:1, ikincil metin 5,57:1 kontrast verir.',
  },
] as const

type Msg = { role: 'user' | 'assistant'; text: string }

function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'assistant', text: 'Merhaba. Bu sayfanın tasarımıyla ilgili bir soru seçin; yanıtı akış hâlinde yazacağım.' }])
  const [streaming, setStreaming] = useState<string | null>(null)
  const [shown, setShown] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)

  // Yanıt karakter karakter akar (gerçek bir model yok; yanıtlar önceden yazıldı)
  useEffect(() => {
    if (streaming === null) return
    if (shown >= streaming.length) {
      setMsgs((m) => [...m, { role: 'assistant', text: streaming }])
      setStreaming(null)
      setShown(0)
      return
    }
    const id = window.setTimeout(() => setShown((n) => Math.min(streaming.length, n + 3)), 16)
    return () => window.clearTimeout(id)
  }, [streaming, shown])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs, shown])

  function ask(i: number) {
    if (streaming !== null) return
    setMsgs((m) => [...m, { role: 'user', text: PROMPTS[i].q }])
    setShown(0)
    setStreaming(PROMPTS[i].a)
  }

  return (
    // Mobilde sabit yükseklik; geniş ekranda liste mutlak konumlu olduğu için kart üreticinin boyuna uzar
    <GlowCard className="flex h-[600px] min-w-0 flex-col overflow-hidden lg:h-auto lg:min-h-[600px]">
      <header className="flex items-center gap-4 border-b border-line px-5 py-4">
        <MorphOrb size={44} state={streaming !== null ? 'thinking' : 'idle'} />
        <span className="flex flex-col leading-tight">
          <span className="font-normal">Asistan</span>
          <span className="text-sm text-muted">{streaming !== null ? 'Yazıyor…' : 'Hazır · örnek sohbet'}</span>
        </span>
      </header>
      <div className="relative min-h-0 flex-1">
        <ol ref={listRef} className="absolute inset-0 flex flex-col gap-4 overflow-y-auto p-5">
          {msgs.map((m, i) => (
            <li
              key={i}
              className={cx(
                'max-w-[88%] rounded-[22px] px-4 py-3 text-[15px] leading-relaxed',
                m.role === 'user' ? 'ml-auto rounded-br-md border border-line bg-scrim' : 'rounded-bl-md',
              )}
            >
              <span className="sr-only">{m.role === 'user' ? 'Siz: ' : 'Asistan: '}</span>
              {m.text}
            </li>
          ))}
          {streaming !== null ? (
            <li className="max-w-[88%] rounded-[22px] rounded-bl-md px-4 py-3 text-[15px] leading-relaxed" aria-hidden="true">
              {streaming.slice(0, shown)}
              <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 rounded-full bg-accent" />
            </li>
          ) : null}
        </ol>
      </div>
      <p aria-live="polite" className="sr-only">
        {streaming === null && msgs[msgs.length - 1]?.role === 'assistant' ? msgs[msgs.length - 1].text : ''}
      </p>
      <div className="flex flex-col gap-2 border-t border-line p-4">
        {PROMPTS.map((p, i) => (
          <GlowButton key={p.q} variant="ghost" disabled={streaming !== null} onClick={() => ask(i)} className="justify-start text-left">
            {p.q}
          </GlowButton>
        ))}
      </div>
    </GlowCard>
  )
}

/** Metinden tohum türetir; aynı istem hep aynı kompozisyonu verir. */
function seedOf(text: string) {
  let h = 2166136261
  for (const ch of text) {
    h ^= ch.codePointAt(0) ?? 0
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function composition(seed: number) {
  let s = seed || 1
  const rnd = () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
  const hues = Array.from({ length: 4 }, () => Math.floor(rnd() * 360))
  const layers = hues.map((h, i) => {
    const x = Math.round(rnd() * 100)
    const y = Math.round(rnd() * 100)
    const size = 40 + Math.round(rnd() * 30)
    return `radial-gradient(at ${x}% ${y}%, hsl(${h} 85% ${i % 2 ? 62 : 55}%) 0, transparent ${size}%)`
  })
  return { css: `${layers.join(', ')}, hsl(${hues[0]} 40% 8%)`, hues }
}

function Generator() {
  const [prompt, setPrompt] = useState('Kuzey ışıkları altında sakin bir deniz')
  const [result, setResult] = useState<string | null>('Kuzey ışıkları altında sakin bir deniz')
  const [busy, setBusy] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const comp = useMemo(() => (result ? composition(seedOf(result)) : null), [result])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!prompt.trim() || busy) return
    setBusy(true)
    timer.current = window.setTimeout(() => {
      setResult(prompt.trim())
      setBusy(false)
    }, 1400)
  }

  return (
    <GlowCard className="flex min-w-0 flex-col gap-5 p-6">
      <h3 className="text-xl font-light">Aurora üretici</h3>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label htmlFor="uretici-istem" className="text-sm text-muted">
          İstem
        </label>
        <input
          id="uretici-istem"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="h-12 rounded-full border border-line bg-scrim px-5 text-ink placeholder:text-muted"
          placeholder="Bir sahne tarif edin"
        />
        <GlowButton type="submit" disabled={busy} icon={<SparkleIcon size={18} weight="light" aria-hidden="true" />} className="w-fit">
          {busy ? 'Üretiliyor' : 'Üret'}
        </GlowButton>
      </form>
      <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[24px] border border-line">
        {comp ? (
          <div className={cx('absolute inset-0 transition-opacity duration-700', busy && 'opacity-30')} style={{ background: comp.css }} role="img" aria-label={`Üretilen kompozisyon: ${result}`} />
        ) : null}
        {busy ? <LiquidSpinner size={72} label="Görsel üretiliyor" /> : null}
      </div>
      {comp ? (
        <p className="text-sm text-muted">
          Tohum <span className="font-mono">0x{seedOf(result ?? '').toString(16).toUpperCase()}</span> · tonlar {comp.hues.join('°, ')}°. Gerçek bir
          model değil: istemden türetilen tohumla dört radyal gradyan dizilir; aynı istem hep aynı sonucu verir.
        </p>
      ) : null}
    </GlowCard>
  )
}

export function Application() {
  return (
    <section id="uygulama" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="10"
          label="UI kullanım alanı"
          title="Asistan ve jeneratif arayüz"
          lede="Yapay zekâ asistan platformları, jeneratif arayüzler, Web3 ve premium müzik servisleri. Sohbet yanıtları akarak gelir; üretici istemden bir aurora kompozisyonu türetir."
        />
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <Chat />
          <Generator />
        </div>
      </div>
    </section>
  )
}
