import { useState } from 'react'
import { DropIcon, PowerIcon, ThermometerSimpleIcon, WindIcon } from '@phosphor-icons/react'
import { NeumorphButton } from '../components/NeumorphButton'
import { SoftSlider } from '../components/SoftSlider'
import { NeuSegmented } from '../components/Controls'

const MODES = ['Isıtma', 'Soğutma', 'Otomatik'] as const
const deg = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** Akıllı ev termostatı: canlı SoftSlider, mod seçimi ve güç düğmesi */
function Thermostat() {
  const [target, setTarget] = useState(22.5)
  const [mode, setMode] = useState<(typeof MODES)[number]>('Isıtma')
  const [on, setOn] = useState(true)

  return (
    <div className="neu neu-raised-lg flex w-full max-w-[420px] flex-col items-center gap-7 rounded-neu-lg p-6 sm:p-8">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-extrabold">Salon</span>
          <span className="text-sm font-semibold text-muted">{on ? `${mode} · açık` : 'Kapalı'}</span>
        </div>
        <NeumorphButton shape="circle" size="md" pressed={on} onClick={() => setOn((v) => !v)} aria-label="Termostat gücü" icon={<PowerIcon size={22} weight="bold" aria-hidden="true" />} />
      </div>

      <SoftSlider
        label="Hedef sıcaklık"
        value={target}
        min={16}
        max={30}
        step={0.5}
        onChange={setTarget}
        format={(v) => `${deg.format(v)} derece`}
        display={(v) => ({ main: `${deg.format(v)}°`, sub: 'Hedef' })}
        size={260}
        className={on ? undefined : 'opacity-60'}
      />

      <NeuSegmented label="Çalışma modu" options={MODES} value={mode} onChange={setMode} />

      <dl className="grid w-full grid-cols-3 gap-3 text-center">
        {[
          { Icon: ThermometerSimpleIcon, label: 'İç', value: '21,4°' },
          { Icon: DropIcon, label: 'Nem', value: '%46' },
          { Icon: WindIcon, label: 'Dış', value: '14°' },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="neu neu-inset flex flex-col items-center gap-1 rounded-neu py-3">
            <Icon size={20} weight="bold" className="neu-engraved text-muted" aria-hidden="true" />
            <dt className="text-xs font-bold text-muted">{label}</dt>
            <dd className="text-lg font-extrabold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function Hero() {
  return (
    <section id="ust" className="px-4 pt-12 pb-20 md:px-8 md:pt-20 md:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col gap-7">
          <ul className="flex flex-wrap gap-3">
            {['Stil 005', 'Glass / Soft / Depth'].map((t) => (
              <li key={t} className="neu neu-raised-sm rounded-full px-4 py-1.5 text-sm font-bold" lang={t.includes('Glass') ? 'en' : undefined}>
                {t}
              </li>
            ))}
          </ul>
          <h1 className="text-5xl leading-[1.05] font-black md:text-7xl">
            Yüzeyden
            <br />
            doğan arayüz
          </h1>
          <p className="max-w-[48ch] text-lg text-muted">
            Fiziksel dünyadaki plastik ve pürüzsüz yüzeylerin dijital ekrana ekstrüzyon mantığıyla aktarıldığı, düşük kontrastlı
            ve hacimli stil. Termostatı çevirin, düğmelere basın.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#golge" className="neu neu-raised neu-press inline-flex min-h-14 items-center rounded-full px-6 font-bold text-accent no-underline">
              Gölge laboratuvarı
            </a>
            <a href="#erisilebilirlik" className="neu neu-raised neu-press inline-flex min-h-14 items-center rounded-full px-6 font-bold text-ink no-underline">
              Erişilebilirlik
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <Thermostat />
        </div>
      </div>
    </section>
  )
}
