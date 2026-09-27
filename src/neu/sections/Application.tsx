import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { HeartIcon, PauseIcon, PlayIcon, RepeatIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { NeumorphButton } from '../components/NeumorphButton'
import { SoftSlider } from '../components/SoftSlider'
import { NeuRange } from '../components/Controls'
import { cx } from '../../shared/cx'

const DURATION = 214 // saniye
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(73)
  const [liked, setLiked] = useState(true)
  const [volume, setVolume] = useState(55)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(true)

  // Oynatma sahte bir saatle ilerler; ses çalınmaz
  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setTime((t) => (t + 1 >= DURATION ? 0 : t + 1)), 1000)
    return () => window.clearInterval(id)
  }, [playing])

  return (
    <div className="neu neu-raised-lg flex w-full flex-col gap-7 rounded-neu-lg p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <NeumorphButton shape="circle" size="sm" pressed={shuffle} onClick={() => setShuffle((v) => !v)} aria-label="Karıştır" icon={<ShuffleIcon size={18} weight="bold" aria-hidden="true" />} />
        <p className="text-sm font-bold text-muted">Şimdi çalıyor</p>
        <NeumorphButton shape="circle" size="sm" pressed={liked} onClick={() => setLiked((v) => !v)} aria-label="Beğen" icon={<HeartIcon size={18} weight={liked ? 'fill' : 'bold'} aria-hidden="true" />} />
      </div>

      {/* Albüm kapağı: gömülü çukur içinde kabarık disk */}
      <div className="neu neu-inset mx-auto grid size-56 place-items-center rounded-full">
        <div
          className={cx('neu neu-raised grid size-44 place-items-center rounded-full', playing && 'animate-[spin_12s_linear_infinite] motion-reduce:animate-none')}
          style={{ backgroundImage: 'repeating-radial-gradient(circle at center, var(--neu-hi) 0 2px, var(--base) 2px 5px)' }}
          aria-hidden="true"
        >
          <span className="neu neu-inset grid size-16 place-items-center rounded-full">
            <span className="size-4 rounded-full bg-accent" />
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xl font-extrabold">Kıyıda Sabah</p>
        <p className="font-semibold text-muted">Örnek Topluluk · Kurgusal albüm</p>
      </div>

      <div>
        <NeuRange label="Şarkı konumu" min={0} max={DURATION} value={time} onChange={(e) => setTime(Number(e.target.value))} aria-valuetext={`${mmss(time)} / ${mmss(DURATION)}`} />
        <div className="flex justify-between px-1 text-sm font-bold text-muted tabular-nums">
          <span>{mmss(time)}</span>
          <span>{mmss(DURATION)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-5">
        <NeumorphButton shape="circle" size="md" onClick={() => setTime(0)} aria-label="Başa sar" icon={<SkipBackIcon size={22} weight="fill" aria-hidden="true" />} />
        <NeumorphButton
          shape="circle"
          size="lg"
          pressed={playing}
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? 'Duraklat' : 'Oynat'}
          icon={playing ? <PauseIcon size={30} weight="fill" aria-hidden="true" /> : <PlayIcon size={30} weight="fill" aria-hidden="true" />}
        />
        <NeumorphButton shape="circle" size="md" onClick={() => setTime((t) => Math.min(DURATION - 1, t + 15))} aria-label="15 saniye ileri" icon={<SkipForwardIcon size={22} weight="fill" aria-hidden="true" />} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <NeumorphButton shape="circle" size="sm" pressed={repeat} onClick={() => setRepeat((v) => !v)} aria-label="Tekrarla" icon={<RepeatIcon size={18} weight="bold" aria-hidden="true" />} />
        <SoftSlider label="Ses düzeyi" value={volume} min={0} max={100} onChange={setVolume} format={(v) => `yüzde ${v}`} display={(v) => ({ main: `${v}` })} size={120} />
        <span className="w-11 text-center text-sm font-bold text-muted">Ses</span>
      </div>
    </div>
  )
}

type Op = '+' | '−' | '×' | '÷'

function compute(a: number, b: number, op: Op) {
  if (op === '+') return a + b
  if (op === '−') return a - b
  if (op === '×') return a * b
  return b === 0 ? NaN : a / b
}

const toDisplay = (s: string) => s.replace('.', ',')
const fromNumber = (n: number) => (Number.isFinite(n) ? String(Number(n.toPrecision(12))) : 'Hata')

const KEYS: ReadonlyArray<{ k: string; label: string; kind: 'fn' | 'op' | 'num' | 'eq'; wide?: boolean; aria?: string }> = [
  { k: 'C', label: 'C', kind: 'fn', aria: 'Temizle' },
  { k: '±', label: '±', kind: 'fn', aria: 'İşaret değiştir' },
  { k: '%', label: '%', kind: 'fn', aria: 'Yüzde' },
  { k: '÷', label: '÷', kind: 'op', aria: 'Böl' },
  { k: '7', label: '7', kind: 'num' },
  { k: '8', label: '8', kind: 'num' },
  { k: '9', label: '9', kind: 'num' },
  { k: '×', label: '×', kind: 'op', aria: 'Çarp' },
  { k: '4', label: '4', kind: 'num' },
  { k: '5', label: '5', kind: 'num' },
  { k: '6', label: '6', kind: 'num' },
  { k: '−', label: '−', kind: 'op', aria: 'Çıkar' },
  { k: '1', label: '1', kind: 'num' },
  { k: '2', label: '2', kind: 'num' },
  { k: '3', label: '3', kind: 'num' },
  { k: '+', label: '+', kind: 'op', aria: 'Topla' },
  { k: '0', label: '0', kind: 'num', wide: true },
  { k: '.', label: ',', kind: 'num', aria: 'Ondalık virgül' },
  { k: '=', label: '=', kind: 'eq', aria: 'Eşittir' },
]

const KEYBOARD: Record<string, string> = { '/': '÷', '*': '×', x: '×', '-': '−', '+': '+', Enter: '=', '=': '=', Escape: 'C', ',': '.', '.': '.', '%': '%' }

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [acc, setAcc] = useState<number | null>(null)
  const [op, setOp] = useState<Op | null>(null)
  const [fresh, setFresh] = useState(true)
  const [flash, setFlash] = useState<string | null>(null)
  const flashTimer = useRef<number | undefined>(undefined)

  const press = useCallback(
    (k: string) => {
      const current = Number(display)
      if (/^\d$/.test(k)) {
        if (fresh || display === '0' || display === 'Hata') setDisplay(k)
        else if (display.replace(/[-.]/g, '').length < 12) setDisplay(display + k)
        setFresh(false)
      } else if (k === '.') {
        if (fresh || display === 'Hata') setDisplay('0.')
        else if (!display.includes('.')) setDisplay(display + '.')
        setFresh(false)
      } else if (k === 'C') {
        setDisplay('0')
        setAcc(null)
        setOp(null)
        setFresh(true)
      } else if (k === '±') {
        if (display !== '0' && display !== 'Hata') setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display)
      } else if (k === '%') {
        setDisplay(fromNumber(current / 100))
        setFresh(true)
      } else if (k === 'Backspace') {
        if (!fresh && display.length > 1) setDisplay(display.slice(0, -1))
        else setDisplay('0')
      } else if (k === '=') {
        if (op && acc !== null) {
          setDisplay(fromNumber(compute(acc, current, op)))
          setAcc(null)
          setOp(null)
          setFresh(true)
        }
      } else {
        const next = k as Op
        if (acc !== null && op && !fresh) {
          const r = compute(acc, current, op)
          setDisplay(fromNumber(r))
          setAcc(r)
        } else {
          setAcc(current)
        }
        setOp(next)
        setFresh(true)
      }
      // Klavyeyle basıldığında tuş da görsel olarak çöker
      setFlash(k)
      window.clearTimeout(flashTimer.current)
      flashTimer.current = window.setTimeout(() => setFlash(null), 140)
    },
    [display, acc, op, fresh],
  )

  useEffect(() => () => window.clearTimeout(flashTimer.current), [])

  const onKeyDown = (e: KeyboardEvent) => {
    // Odak bir tuştaysa Enter/Boşluk o tuşa basar; "=" yalnızca kabın kendisi odaktayken
    if ((e.key === 'Enter' || e.key === ' ') && e.target !== e.currentTarget) return
    const k = /^\d$/.test(e.key) ? e.key : e.key === 'Backspace' ? 'Backspace' : KEYBOARD[e.key]
    if (!k) return
    e.preventDefault()
    press(k)
  }

  const shown = display === 'Hata' ? 'Hata' : toDisplay(display)

  return (
    <div
      role="group"
      aria-label="Hesap makinesi"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="neu neu-raised-lg flex w-full flex-col gap-6 rounded-neu-lg p-6 sm:p-8"
    >
      <div className="neu neu-inset flex min-h-28 flex-col items-end justify-end rounded-neu px-5 py-4">
        <span className="h-6 text-sm font-bold text-muted tabular-nums">{acc !== null && op ? `${toDisplay(fromNumber(acc))} ${op}` : ''}</span>
        <output aria-live="polite" className="max-w-full truncate text-5xl font-black tabular-nums">
          {shown}
        </output>
      </div>
      <div className="grid grid-cols-4 gap-4 sm:gap-5">
        {KEYS.map((key) => (
          <button
            key={key.k}
            type="button"
            aria-label={key.aria}
            data-pressed={flash === key.k ? '' : undefined}
            aria-pressed={key.kind === 'op' ? op === key.k && fresh : undefined}
            onClick={() => press(key.k)}
            className={cx(
              'neu neu-raised neu-press grid h-16 place-items-center text-2xl font-extrabold',
              key.wide ? 'col-span-2 rounded-full' : 'rounded-full',
              key.kind === 'op' || key.kind === 'eq' ? 'text-accent' : key.kind === 'fn' ? 'text-muted' : 'text-ink',
              key.kind === 'eq' && 'neu-convex',
            )}
          >
            {key.label}
          </button>
        ))}
      </div>
      <p className="text-center text-sm text-muted">Hesap makinesine odaklanıp klavyeden de yazabilirsiniz.</p>
    </div>
  )
}

export function Application() {
  return (
    <section id="uygulama" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="10"
          label="UI kullanım alanı"
          title="Müzik çalar ve hesap makinesi"
          lede="Akıllı ev uygulamaları, müzik çalarlar, hesap makineleri ve konsept arayüzler. Termostat en üstte; burada çalar ve çalışan bir hesap makinesi var."
        />
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <MusicPlayer />
          <Calculator />
        </div>
      </div>
    </section>
  )
}
