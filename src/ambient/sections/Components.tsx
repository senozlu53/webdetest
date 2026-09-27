import { useState } from 'react'
import { ArrowsClockwiseIcon, PaperPlaneTiltIcon, SparkleIcon } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { GlowCard } from '../components/GlowCard'
import { GlowButton } from '../components/GlowButton'
import { LiquidSpinner, MorphOrb } from '../components/Liquid'
import { cx } from '../../shared/cx'

const REACT = `<AmbientBackground />

<GlowCard>
  <GradientMesh palette="aurora2" />
  <GlowButton>Yeniden üret</GlowButton>
</GlowCard>`

const STATES = [
  { id: 'idle', label: 'Bekliyor' },
  { id: 'listening', label: 'Dinliyor' },
  { id: 'thinking', label: 'Düşünüyor' },
] as const

export function Components() {
  const [state, setState] = useState<(typeof STATES)[number]['id']>('idle')
  return (
    <section id="bilesenler" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="07 · 11 · 14"
          label={<span lang="en">UI Component Patterns</span>}
          title="Gölge yerine parıltı"
          lede="Düğmelerin çerçevesi dönen bir ışıktır; kartların kenarı imleci izler. Yükleme göstergesi sıvı damlaların birbirine yapışmasıyla döner."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <GlowCard className="flex flex-col gap-5 p-6">
            <h3 className="text-xl font-light">
              <span lang="en">Glow Border</span> düğmeler
            </h3>
            <div className="flex flex-wrap gap-3">
              <GlowButton icon={<SparkleIcon size={18} weight="light" aria-hidden="true" />}>Üret</GlowButton>
              <GlowButton variant="ghost">Vazgeç</GlowButton>
              <GlowButton disabled>Devre dışı</GlowButton>
            </div>
            <label htmlFor="amb-prompt" className="text-sm text-muted">
              İstem
            </label>
            <span className="glow-border flex items-center gap-2 rounded-full bg-scrim py-1.5 pr-1.5 pl-5 focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-ring">
              <input id="amb-prompt" type="text" placeholder="Bir şey sorun…" className="h-10 min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted" />
              <span className="grid size-10 place-items-center rounded-full border border-line" aria-hidden="true">
                <PaperPlaneTiltIcon size={18} weight="light" />
              </span>
            </span>
          </GlowCard>

          <GlowCard className="flex flex-col items-center gap-5 p-6">
            <h3 className="self-start text-xl font-light">
              <span lang="en">Liquid Spinner</span>
            </h3>
            <div className="flex flex-1 items-center justify-center gap-8 py-4">
              <LiquidSpinner size={48} />
              <LiquidSpinner size={72} />
            </div>
            <p className="text-sm text-muted">SVG gooey filtresi: bulanıklaştır, sonra alfa eşiğiyle keskinleştir. Damlalar yaklaştıkça birleşir.</p>
          </GlowCard>

          <GlowCard className="flex flex-col items-center gap-5 p-6">
            <h3 className="self-start text-xl font-light">Form değiştiren kapsayıcı</h3>
            <MorphOrb size={150} state={state} />
            <div role="radiogroup" aria-label="Küre durumu" className="flex flex-wrap justify-center gap-2">
              {STATES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={state === s.id}
                  onClick={() => setState(s.id)}
                  className={cx('min-h-11 cursor-pointer rounded-full border px-4 text-sm', state === s.id ? 'glow-border border-transparent bg-scrim' : 'border-line')}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </GlowCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <GlowCard className="min-w-0 p-6">
            <h3 className="text-xl font-light">React · Madde 14</h3>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-line bg-scrim p-4 font-mono text-xs leading-relaxed">
              <code>{REACT}</code>
            </pre>
          </GlowCard>
          <GlowCard className="flex flex-col gap-4 p-6">
            <h3 className="text-xl font-light">
              <span lang="en">Effects/GlowBorder</span>
            </h3>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted">Kenar</dt>
              <dd>1,5px konik degrade, 6 sn'de bir tur (@property --angle)</dd>
              <dt className="text-muted">Parıltı</dt>
              <dd>Aynı degrade, blur 14px, bekleme %60 · hover %100</dd>
              <dt className="text-muted">Kart ışığı</dt>
              <dd>İmleç merkezli 260px radyal ışık, yalnızca kenar ve iç parıltı</dd>
            </dl>
            <GlowButton icon={<ArrowsClockwiseIcon size={18} weight="light" aria-hidden="true" />} className="w-fit">
              Üzerine gelin
            </GlowButton>
          </GlowCard>
        </div>
      </div>
    </section>
  )
}
