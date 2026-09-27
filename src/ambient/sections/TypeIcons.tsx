import type { ComponentType } from 'react'
import {
  ChatsCircleIcon,
  CubeIcon,
  ImageIcon,
  LightningIcon,
  MusicNoteIcon,
  PlanetIcon,
  SparkleIcon,
  WalletIcon,
  WaveformIcon,
  type IconProps,
} from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { GlowCard } from '../components/GlowCard'
import { GradientMesh } from '../components/GradientMesh'

const TYPE = [
  { cls: 'text-6xl font-extralight', meta: '60 · 200', sample: 'Merhaba' },
  { cls: 'text-4xl font-light', meta: '36 · 300', sample: 'Size nasıl yardım edebilirim?' },
  { cls: 'text-lg font-light', meta: '18 · 300', sample: 'Gövde metni ince ama okunur; satır aralığı 1,7.' },
  { cls: 'text-sm font-normal tracking-wide', meta: '14 · 400', sample: 'Etiketler ve küçük metin 400 ağırlıkta kalır.' },
] as const

const ICONS: ReadonlyArray<{ Icon: ComponentType<IconProps>; label: string }> = [
  { Icon: SparkleIcon, label: 'Üret' },
  { Icon: ChatsCircleIcon, label: 'Sohbet' },
  { Icon: ImageIcon, label: 'Görsel' },
  { Icon: WaveformIcon, label: 'Ses' },
  { Icon: MusicNoteIcon, label: 'Müzik' },
  { Icon: WalletIcon, label: 'Cüzdan' },
  { Icon: CubeIcon, label: 'Model' },
  { Icon: PlanetIcon, label: 'Keşfet' },
  { Icon: LightningIcon, label: 'Hızlı' },
]

export function TypeIcons() {
  return (
    <section id="tipografi" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="05 · 09"
          label="Tipografi ve ikon"
          title="İnce yazı, ışığa uyan ikon"
          lede="Sora'nın ince ağırlıkları zarif ama küçük boyutta okunmaz; bu yüzden ağırlık boyutla birlikte artar. İkonlar ya holografik degradeyle dolar ya da zeminin rengini içine alır."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <GlowCard className="p-6">
            <h3 className="text-xl font-light">Sora</h3>
            <p className="text-sm text-muted">Jonathan Barnbrook ve Julián Moncada, 2020 · 100–800</p>
            <ul className="mt-6 flex flex-col gap-4">
              {TYPE.map((t) => (
                <li key={t.meta} className="grid gap-1 sm:grid-cols-[76px_1fr] sm:items-baseline">
                  <span className="font-mono text-xs text-muted tabular-nums">{t.meta}</span>
                  <span className={t.cls}>{t.sample}</span>
                </li>
              ))}
            </ul>
          </GlowCard>

          <div className="flex min-w-0 flex-col gap-6">
            <GlowCard className="p-6">
              <h3 className="text-xl font-light">Holografik</h3>
              <p className="text-sm text-muted">İnce çizgi (thin), dolgu sayfadaki animasyonlu degradeden gelir.</p>
              <ul className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-9">
                {ICONS.map(({ Icon, label }) => (
                  <li key={label} className="flex flex-col items-center gap-2">
                    <Icon size={32} weight="thin" className="holo-icon" aria-hidden="true" />
                    <span className="text-xs text-muted">{label}</span>
                  </li>
                ))}
              </ul>
            </GlowCard>
            <GlowCard className="p-6">
              <h3 className="text-xl font-light">Zemine uyan</h3>
              <p className="text-sm text-muted">Yarı saydam ikon, karışım moduyla altındaki mesh rengini alır.</p>
              <GradientMesh className="mt-5 flex flex-wrap items-center justify-around gap-4 rounded-2xl p-6" palette="aurora1">
                {ICONS.slice(0, 6).map(({ Icon, label }) => (
                  <Icon key={label} size={36} weight="light" className="blend-icon text-ink" aria-label={label} role="img" />
                ))}
              </GradientMesh>
            </GlowCard>
          </div>
        </div>
      </div>
    </section>
  )
}
