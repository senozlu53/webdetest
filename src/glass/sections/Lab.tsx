import { useId, useMemo, useState } from 'react'
import { CheckCircleIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { GlassCard } from '../components/GlassCard'
import { SectionHead } from '../components/SectionHead'
import { STAGE } from '../content'
import { blend, hexToRgb, worstContrast, type RGB } from '../contrast'
import { cx } from '../../shared/cx'

type Tint = 'white' | 'ink'
type Settings = { blur: number; alpha: number; tint: Tint; border: number; highlight: boolean }

const TINTS: Record<Tint, { label: string; rgb: RGB; css: string }> = {
  white: { label: 'Beyaz cam', rgb: [255, 255, 255], css: '255 255 255' },
  ink: { label: 'Koyu cam', rgb: [18, 20, 46], css: '18 20 46' },
}

const PRESETS: ReadonlyArray<{ id: string; label: string; s: Settings }> = [
  { id: 'spec', label: 'Tanımdaki: white/10', s: { blur: 16, alpha: 10, tint: 'white', border: 20, highlight: false } },
  { id: 'panel', label: 'Önerilen panel', s: { blur: 24, alpha: 65, tint: 'ink', border: 16, highlight: true } },
  { id: 'white40', label: 'Beyaz cam %40', s: { blur: 24, alpha: 40, tint: 'white', border: 30, highlight: true } },
  { id: 'mobile', label: 'Mobil', s: { blur: 14, alpha: 70, tint: 'ink', border: 16, highlight: true } },
]

const WHITE: RGB = [255, 255, 255]
const MUTED: RGB = hexToRgb('#C9CDEA')
const STAGE_BASE = hexToRgb(STAGE.base)
// Sahnedeki keskin şeritler ışık lekelerinin tam renginde; en kötü durum onlardır.
const STAGE_BGS: RGB[] = [
  ...STAGE.blobs.map(hexToRgb),
  ...STAGE.blobs.map((b) => blend(hexToRgb(b), STAGE_BASE, STAGE.opacity)),
  STAGE_BASE,
]

const fmt = (v: number) => v.toFixed(2).replace('.', ',')

function Slider({ label, value, min, max, unit, onChange }: { label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void }) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-sm tabular-nums">
          {value}
          {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 w-full cursor-pointer accent-(--ring)"
      />
    </div>
  )
}

export function Lab() {
  const [s, setS] = useState<Settings>(PRESETS[0].s)
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((prev) => ({ ...prev, [k]: v }))
  const preset = PRESETS.find((p) => JSON.stringify(p.s) === JSON.stringify(s))?.id

  const tint = TINTS[s.tint]
  const main = useMemo(() => worstContrast(WHITE, tint.rgb, s.alpha / 100, STAGE_BGS), [tint, s.alpha])
  const muted = useMemo(() => worstContrast(MUTED, tint.rgb, s.alpha / 100, STAGE_BGS), [tint, s.alpha])
  const pass = main >= 4.5 && muted >= 4.5

  const css = [
    `background: rgb(${tint.css} / ${(s.alpha / 100).toFixed(2)});`,
    `backdrop-filter: blur(${s.blur}px) saturate(160%);`,
    `border: 1px solid rgb(255 255 255 / ${(s.border / 100).toFixed(2)});`,
    s.highlight ? 'box-shadow: inset 0 1px 0 rgb(255 255 255 / .22), 0 24px 48px -16px rgb(0 0 0 / .55);' : 'box-shadow: 0 24px 48px -16px rgb(0 0 0 / .55);',
  ].join('\n')
  const tw = `${s.tint === 'white' ? 'bg-white' : 'bg-[#12142E]'}/${s.alpha} backdrop-blur-[${s.blur}px] border border-white/${s.border} shadow-xl`

  return (
    <section id="laboratuvar" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="06–08 · 12 · 18"
          label="Cam laboratuvarı"
          title="Bulanıklık okunurluğu kurtarmaz"
          lede="Blur ayrıntıyı siler ama rengi silmez. Parlak bir ışık lekesi metnin tam arkasına geldiğinde okunurluğu belirleyen dolgunun rengi ve opaklığıdır. Tanımdaki bg-white/10 bu sahnede AA'yı geçmez."
        />

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* Sahne: temadan bağımsız sabit, canlı renkler */}
          <div
            className="relative isolate grid min-h-[420px] min-w-0 place-items-center overflow-hidden rounded-[32px] p-6"
            style={{ background: STAGE.base }}
            aria-label="Önizleme sahnesi"
            role="img"
          >
            {STAGE.blobs.map((c, i) => (
              <span
                key={c}
                aria-hidden="true"
                className="absolute size-[60%] rounded-full"
                style={{
                  background: `radial-gradient(closest-side, ${c}, transparent)`,
                  opacity: STAGE.opacity,
                  top: ['-10%', '40%', '-5%', '45%'][i],
                  left: ['-10%', '-5%', '50%', '55%'][i],
                }}
              />
            ))}
            {/* Keskin şeritler: bulanıklığın etkisi bunların kenarlarında görünür */}
            <span aria-hidden="true" className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 -rotate-12 flex-col gap-4 px-6">
              {STAGE.blobs.map((c) => (
                <span key={c} className="h-5 rounded-full" style={{ background: c }} />
              ))}
            </span>
            <div
              className="relative w-full max-w-sm rounded-glass p-6 text-white"
              style={{
                background: `rgb(${tint.css} / ${s.alpha / 100})`,
                WebkitBackdropFilter: `blur(${s.blur}px) saturate(160%)`,
                backdropFilter: `blur(${s.blur}px) saturate(160%)`,
                border: `1px solid rgb(255 255 255 / ${s.border / 100})`,
                boxShadow: `${s.highlight ? 'inset 0 1px 0 rgb(255 255 255 / 0.22), ' : ''}0 24px 48px -16px rgb(0 0 0 / 0.55)`,
              }}
            >
              <p className="text-sm" style={{ color: '#C9CDEA' }}>
                Hesap özeti · Eylül
              </p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">48.260 TL</p>
              <p className="mt-3 text-sm leading-relaxed">Gelir giderden 12.400 TL fazla. Tasarruf hedefinin %82'sine ulaştınız.</p>
            </div>
          </div>

          <GlassCard className="flex min-w-0 flex-col gap-6 p-6">
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-sm font-medium">Hazır ayar</legend>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={preset === p.id}
                    onClick={() => setS(p.s)}
                    className={cx(
                      'min-h-11 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors duration-300',
                      preset === p.id ? 'border-transparent text-(--primary-text) [background-image:linear-gradient(120deg,var(--primary-from),var(--primary-to))]' : 'border-glass-border bg-glass-subtle hover:bg-glass',
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <Slider label="Bulanıklık" value={s.blur} min={0} max={40} unit="px" onChange={(v) => set('blur', v)} />
              <Slider label="Dolgu opaklığı" value={s.alpha} min={0} max={80} unit="%" onChange={(v) => set('alpha', v)} />
              <Slider label="Kenar opaklığı" value={s.border} min={0} max={60} unit="%" onChange={(v) => set('border', v)} />
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-medium">Dolgu rengi</legend>
                <div className="flex gap-2">
                  {(Object.keys(TINTS) as Tint[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={s.tint === t}
                      onClick={() => set('tint', t)}
                      className={cx(
                        'min-h-11 flex-1 cursor-pointer rounded-full border px-3 text-sm font-medium transition-colors duration-300',
                        s.tint === t ? 'border-ring bg-glass-strong' : 'border-glass-border bg-glass-subtle hover:bg-glass',
                      )}
                    >
                      {TINTS[t].label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3">
              <span className="text-sm font-medium">1px iç parlama (Inner Shadow)</span>
              <input type="checkbox" checked={s.highlight} onChange={(e) => set('highlight', e.target.checked)} className="size-5 cursor-pointer accent-(--ring)" />
            </label>

            <div
              role="status"
              className={cx('flex items-start gap-3 rounded-2xl border p-4', pass ? 'border-up/60' : 'border-down/60')}
            >
              {pass ? (
                <CheckCircleIcon size={24} weight="fill" className="shrink-0 text-up" aria-hidden="true" />
              ) : (
                <WarningCircleIcon size={24} weight="fill" className="shrink-0 text-down" aria-hidden="true" />
              )}
              <div className="flex flex-col gap-1 text-sm">
                <p className="font-semibold">
                  En kötü durum: beyaz metin {fmt(main)}:1 · ikincil metin {fmt(muted)}:1
                </p>
                <p className="text-ink-muted">
                  {pass
                    ? 'İki metin de WCAG AA (4,5:1) sınırının üstünde.'
                    : 'AA için 4,5:1 gerekir. Dolguyu koyulaştırın ya da opaklığı artırın; blur bu sonucu değiştirmez.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">CSS</p>
              <pre className="overflow-x-auto rounded-2xl bg-glass-strong p-4 font-mono text-xs leading-relaxed">
                <code>{css}</code>
              </pre>
              <p className="text-sm font-medium" lang="en">
                Tailwind
              </p>
              <pre className="overflow-x-auto rounded-2xl bg-glass-strong p-4 font-mono text-xs leading-relaxed">
                <code>{tw}</code>
              </pre>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
