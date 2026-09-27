import { useId, useState, type CSSProperties } from 'react'
import { SectionHead } from '../components/SectionHead'
import { GlowCard } from '../components/GlowCard'
import type { MotionMode, MotionPref, Signals } from '../hooks/useMotion'
import { cx } from '../../shared/cx'

const MODES: ReadonlyArray<{ id: MotionPref; label: string; note: string }> = [
  { id: 'auto', label: 'Otomatik', note: 'Cihaz sinyallerine göre seçilir' },
  { id: 'live', label: 'Canlı', note: 'Beş leke, tam hız, yayılan parıltı' },
  { id: 'lite', label: 'Sade', note: 'Üç leke, yarı hız, parıltı sabit' },
  { id: 'paused', label: 'Durdur', note: 'Kare donar; yükleme göstergesi döner' },
]

const LABEL: Record<MotionMode, string> = { live: 'Canlı', lite: 'Sade', paused: 'Durdur' }

const COSTS = [
  {
    layer: 'Ortam zemini',
    how: 'Beş radyal leke, yalnızca transform ile kayar',
    cost: 'Düşük: katman bir kez çizilir, sonra GPU’da taşınır',
    lite: 'Üç leke, yarı hız',
  },
  {
    layer: 'GradientMesh',
    how: '@property ile kayıtlı gradyan merkezleri @keyframes ile yer değiştirir',
    cost: 'Orta: her kare yeniden boyanır; ekrandan çıkınca durur',
    lite: 'Yarı hız',
  },
  {
    layer: 'Glow Border',
    how: 'Dönen konik degrade (--angle) ve 14px bulanık parıltı',
    cost: 'Orta: alan küçük, bulanık katman pahalı',
    lite: 'Dış parıltı sabit, halka yavaş',
  },
  {
    layer: 'Gooey ve morph',
    how: 'SVG filtresi (bulanıklık + alfa eşiği), border-radius döngüsü',
    cost: 'Yüksek: filtre her kare yeniden hesaplanır; yalnızca 48–150px alanlarda',
    lite: 'Yarı hız',
  },
] as const

function Signal({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-0">
      <span className="text-muted">{label}</span>
      <span className={cx('text-right', active ? 'font-normal text-ink' : 'text-muted')}>
        {active ? <span className="mr-2 inline-block size-2 rounded-full bg-accent align-middle" aria-hidden="true" /> : null}
        {value}
      </span>
    </li>
  )
}

function ModeControl({ pref, onPref, mode, detected, signals }: Props) {
  const name = useId()
  const b = signals.battery
  return (
    <GlowCard className="flex min-w-0 flex-col gap-6 p-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-xl font-light">Hareket düzeyi</legend>
        {MODES.map((m) => (
          <label
            key={m.id}
            className={cx(
              'flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-[20px] border px-5 py-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-ring',
              pref === m.id ? 'glow-border border-transparent bg-scrim' : 'border-line',
            )}
          >
            <input type="radio" name={name} value={m.id} checked={pref === m.id} onChange={() => onPref(m.id)} className="sr-only" />
            <span className="font-normal">{m.label}</span>
            <span className="text-right text-sm text-muted">{m.note}</span>
          </label>
        ))}
      </fieldset>

      <div>
        <p className="text-sm tracking-[0.12em] text-muted uppercase">Otomatik algılama</p>
        <ul className="mt-2 text-sm">
          <Signal label="Hareketi azalt" value={signals.reduce ? 'Açık' : 'Kapalı'} active={signals.reduce} />
          <Signal label="Veri tasarrufu" value={signals.saveData === null ? 'Bilinmiyor' : signals.saveData ? 'Açık' : 'Kapalı'} active={signals.saveData === true} />
          <Signal
            label="Pil"
            value={b ? `%${Math.round(b.level * 100)} · ${b.charging ? 'şarjda' : 'şarjda değil'}` : 'Tarayıcı bildirmiyor'}
            active={!!b && !b.charging && b.level <= 0.2}
          />
          <Signal label="Ekran" value={signals.narrow ? 'Dar (768px altı)' : 'Geniş'} active={signals.narrow} />
        </ul>
      </div>

      <p role="status" className="rounded-[20px] border border-line px-5 py-4">
        Şu an: <strong>{LABEL[mode]}</strong>
        <span className="text-muted">
          {pref === 'auto' ? ` · ${detected.reason}` : ' · elle seçildi, tarayıcıda hatırlanır'}
        </span>
      </p>
    </GlowCard>
  )
}

function GooeyDemo() {
  const [on, setOn] = useState(true)
  const [blur, setBlur] = useState(10)
  const filterId = `goo-demo-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const blurId = useId()
  const drop = (color: string, extra: CSSProperties): CSSProperties => ({ background: color, ...extra })

  return (
    <GlowCard className="flex min-w-0 flex-col gap-5 p-6">
      <h3 className="text-xl font-light">
        Birleşen damlalar <span className="text-muted" lang="en">(gooey)</span>
      </h3>
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} />
          <feColorMatrix mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
        </filter>
      </svg>
      <div
        role="img"
        aria-label="Üç damla: ortadaki iki yana gidip gelir, yaklaştığında diğer damlayla sıvı gibi birleşir."
        className="grid min-h-56 flex-1 place-items-center overflow-hidden rounded-[24px] border border-line bg-scrim"
      >
        <div className="relative h-24 w-[17rem]" style={{ filter: on ? `url(#${filterId})` : 'none' }}>
          <span className="absolute top-2 left-0 size-20 rounded-full" style={drop('var(--a1-1)', { animation: 'goo-breathe calc(5s * var(--speed, 1)) ease-in-out infinite' })} />
          <span className="absolute top-2 right-0 size-20 rounded-full" style={drop('var(--a1-2)', { animation: 'goo-breathe calc(5s * var(--speed, 1)) ease-in-out -2.5s infinite' })} />
          <span
            className="absolute top-6 left-[calc(50%-1.5rem)] size-12 rounded-full"
            style={drop('var(--a1-3)', { animation: 'goo-travel calc(3.2s * var(--speed, 1)) cubic-bezier(0.65, 0, 0.35, 1) infinite alternate' })}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => setOn((v) => !v)}
          className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-full border border-line py-1.5 pr-1.5 pl-5 text-left"
        >
          <span>Gooey filtresi</span>
          <span className={cx('relative h-8 w-14 rounded-full transition-colors duration-500', on ? 'bg-accent' : 'bg-line')} aria-hidden="true">
            <span className={cx('absolute top-1 size-6 rounded-full bg-canvas transition-[left] duration-500', on ? 'left-7' : 'left-1')} />
          </span>
        </button>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <label htmlFor={blurId} className="text-sm text-muted">
              Bulanıklık <span className="font-mono">stdDeviation</span>
            </label>
            <output htmlFor={blurId} className="font-mono text-sm">
              {blur}
            </output>
          </div>
          <input id={blurId} type="range" min={0} max={16} value={blur} onChange={(e) => setBlur(Number(e.target.value))} disabled={!on} className="w-full accent-[var(--accent)]" />
        </div>
        <p className="text-sm text-muted">
          Filtre önce bulanıklaştırır, sonra alfa kanalını 22 ile çarpıp 9 çıkarır: yarı saydam kenarlar ya tam görünür ya kaybolur. Birbirine yaklaşan iki
          bulanık kenar eşiği birlikte aştığı için damlalar köprüyle birleşir.
        </p>
      </div>
    </GlowCard>
  )
}

type Props = {
  pref: MotionPref
  onPref: (p: MotionPref) => void
  mode: MotionMode
  detected: { mode: MotionMode; reason: string }
  signals: Signals
}

export function Motion(props: Props) {
  return (
    <section id="hareket" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="16 · 17"
          label="Hareket ve mobil"
          title="Hiç durmayan, pili yormayan hareket"
          lede="Zemin sonsuz ve yavaş döngülerle akar. Maliyet katman katman ölçülür: dar ekranda, düşük pilde ya da veri tasarrufunda sayfa kendiliğinden sadeleşir; hareketi azaltma tercihinde durur."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <ModeControl {...props} />
          <GooeyDemo />
        </div>

        <GlowCard className="mt-6 p-6 md:p-8">
          <h3 className="text-xl font-light">Katman maliyeti</h3>
          <ul className="mt-4">
            <li className="hidden gap-6 border-b border-line pb-3 text-sm tracking-[0.12em] text-muted uppercase md:grid md:grid-cols-[1fr_1.5fr_1.5fr_1fr]" aria-hidden="true">
              <span>Katman</span>
              <span>Teknik</span>
              <span>Maliyet</span>
              <span>Sade modda</span>
            </li>
            {COSTS.map((c) => (
              <li key={c.layer} className="grid gap-1 border-b border-line py-4 last:border-0 md:grid-cols-[1fr_1.5fr_1.5fr_1fr] md:gap-6">
                <span className="font-normal">{c.layer}</span>
                <span className="text-muted">
                  <span className="sr-only">Teknik: </span>
                  {c.how}
                </span>
                <span>
                  <span className="sr-only">Maliyet: </span>
                  {c.cost}
                </span>
                <span className="text-muted">
                  <span className="text-sm md:sr-only">Sade modda: </span>
                  {c.lite}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-[80ch] text-sm text-muted">
            Sekme arka plana geçtiğinde tarayıcı çizimi zaten durdurur. Uzun ve karmaşık sahnelerde canlı mesh yerine 4–6 saniyelik sessiz bir döngü videosu
            (<span className="font-mono">muted playsinline loop</span>, ilk kare <span className="font-mono">poster</span> olarak) işlemciyi daha az yorar; bu
            sayfa yalnızca CSS ile yetindiği için video kullanmıyor.
          </p>
        </GlowCard>
      </div>
    </section>
  )
}
