import { useState } from 'react'
import { LightbulbIcon, PlayIcon, PowerIcon } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { NeumorphButton } from '../components/NeumorphButton'
import { SoftSlider } from '../components/SoftSlider'
import { NeuInput, NeuRange, NeuSegmented, NeuSwitch } from '../components/Controls'

const SPEC = 'bg-[#e0e5ec] shadow-[9px_9px_16px_rgb(163,177,198,0.5),-9px_-9px_16px_rgba(255,255,255,0.5)]'
const TOKENS = 'neu neu-raised neu-press rounded-full  /* var(--base) + var(--neu-dark) + var(--neu-light) */'
const REACT = `<NeumorphButton shape="circle" pressed={on}
  onClick={() => setOn(!on)} aria-label="Işık" />

<SoftSlider label="Ses" min={0} max={100}
  value={volume} onChange={setVolume}
  format={(v) => \`%\${v}\`} />`

const STATES = [
  { label: 'Default', props: {} },
  { label: 'Pressed', props: { 'data-pressed': '' } },
  { label: 'Toggled', props: { pressed: true } },
  { label: 'Focus', props: { className: 'outline-2 outline-offset-3 outline-accent' } },
  { label: 'Disabled', props: { disabled: true } },
] as const

export function Components() {
  const [volume, setVolume] = useState(64)
  const [brightness, setBrightness] = useState(60)
  const [lights, setLights] = useState(true)
  const [scene, setScene] = useState<'Sabah' | 'Akşam' | 'Film'>('Akşam')
  const [auto, setAuto] = useState(true)

  return (
    <section id="bilesenler" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="11 · 14 · 15"
          label={<span lang="en">UI Component Patterns</span>}
          title="Basınca içeri çöken düğmeler"
          lede="Her düğmenin iki varyantı vardır: kabarık (Default) ve çökük (Pressed). Açma/kapama düğmelerinde durum ayrıca vurgu rengi ve küçük bir ışıkla gösterilir."
        />

        <div className="neu neu-raised rounded-neu-lg p-6 md:p-10">
          <h3 className="text-xl font-extrabold">Durumlar</h3>
          <ul className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {STATES.map((s) => (
              <li key={s.label} className="flex flex-col items-center gap-5">
                <NeumorphButton shape="circle" size="lg" aria-label={`${s.label} örneği`} icon={<PowerIcon size={26} weight="bold" aria-hidden="true" />} {...s.props} />
                <span className="text-sm font-bold text-muted" lang="en">
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="neu neu-raised flex flex-col items-center gap-8 rounded-neu-lg p-6 md:p-10">
            <h3 className="self-start text-xl font-extrabold">
              <span lang="en">SoftSlider</span>
            </h3>
            <SoftSlider
              label="Ses düzeyi"
              value={volume}
              min={0}
              max={100}
              onChange={setVolume}
              format={(v) => `yüzde ${v}`}
              display={(v) => ({ main: `%${v}`, sub: 'Ses' })}
              size={200}
            />
            <div className="w-full">
              <div className="flex items-baseline justify-between px-1 text-sm font-bold">
                <span>Parlaklık</span>
                <span className="tabular-nums">%{brightness}</span>
              </div>
              <NeuRange label="Parlaklık" min={0} max={100} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
            </div>
            <p className="text-sm text-muted">Sürükleyin ya da odaklanıp ok tuşlarını, PageUp/PageDown'u kullanın.</p>
          </div>

          <div className="neu neu-raised flex min-w-0 flex-col gap-8 rounded-neu-lg p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-5">
              <NeumorphButton pressed={lights} onClick={() => setLights((v) => !v)} icon={<LightbulbIcon size={22} weight={lights ? 'fill' : 'bold'} aria-hidden="true" />}>
                Işıklar {lights ? 'açık' : 'kapalı'}
              </NeumorphButton>
              <NeumorphButton shape="circle" aria-label="Oynat" icon={<PlayIcon size={22} weight="fill" aria-hidden="true" />} />
            </div>
            <NeuSegmented label="Sahne" options={['Sabah', 'Akşam', 'Film'] as const} value={scene} onChange={setScene} />
            <NeuSwitch label="Otomatik mod" description={auto ? 'Gün batımında ışıklar yanar' : 'Kapalı'} checked={auto} onChange={setAuto} />
            <NeuInput id="oda-adi" label="Oda adı" placeholder="Örneğin çalışma odası" />
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="neu neu-raised flex min-w-0 flex-col gap-3 rounded-neu-lg p-6 md:p-8">
            <h3 className="text-xl font-extrabold">
              <span lang="en">Tailwind</span> · Madde 15
            </h3>
            <p className="text-sm text-muted">Tanımdaki hali: tek renk, iki gölge.</p>
            <pre className="neu neu-inset overflow-x-auto rounded-neu p-4 font-mono text-xs leading-relaxed">
              <code>{SPEC}</code>
            </pre>
            <p className="text-sm text-muted">Bu projede: renkler ve mesafeler token; koyu mod ve mobil kendiliğinden.</p>
            <pre className="neu neu-inset overflow-x-auto rounded-neu p-4 font-mono text-xs leading-relaxed">
              <code>{TOKENS}</code>
            </pre>
          </div>
          <div className="neu neu-raised flex min-w-0 flex-col gap-3 rounded-neu-lg p-6 md:p-8">
            <h3 className="text-xl font-extrabold">React · Madde 14</h3>
            <pre className="neu neu-inset overflow-x-auto rounded-neu p-4 font-mono text-xs leading-relaxed">
              <code>{REACT}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
