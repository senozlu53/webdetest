import type { ComponentType } from 'react'
import { CursorClickIcon, DropHalfIcon, FrameCornersIcon, SelectionIcon, StackIcon, WavesIcon, type IconProps } from '@phosphor-icons/react'
import { GlassCard } from '../components/GlassCard'
import { SectionHead } from '../components/SectionHead'

const ITEMS: ReadonlyArray<{ Icon: ComponentType<IconProps>; name: string; text: string }> = [
  { Icon: DropHalfIcon, name: 'Yarı saydam yüzey', text: 'Cam, arkasındaki rengi taşır. Dolgu %10 ile %60 arasında, metin taşıyorsa en az %50.' },
  { Icon: WavesIcon, name: 'Arka plan bulanıklığı', text: 'backdrop-filter: blur(24px) saturate(160%). Renk kalır, ayrıntı kaybolur.' },
  { Icon: FrameCornersIcon, name: 'İnce kenar', text: '1px yarı saydam beyaz çizgi ve üst kenarda 1px iç parlama; camın kalınlığı.' },
  { Icon: StackIcon, name: 'Yumuşak gölge', text: 'Geniş, yayvan dış gölge katmanı zeminden ayırır; sert gölge kullanılmaz.' },
  { Icon: SelectionIcon, name: 'Yüzen kart', text: 'Paneller zeminden kopuk durur; üst üste binerek hiyerarşi kurar.' },
  { Icon: CursorClickIcon, name: 'Zarif hareket', text: 'Fareyle hafif eğilme, kaydırmada altından süzülen ışık. Süre 300–400ms.' },
]

export function Principles() {
  return (
    <section id="ozellikler" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="03"
          label="Karakteristikler"
          title="Altı özellik, tek malzeme"
          lede="Glassmorphism bir renk paleti değil, bir malzemedir. Aşağıdaki kartların her biri bu altı özelliğin hepsini taşır."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ Icon, name, text }) => (
            <GlassCard as="li" key={name} tilt className="flex flex-col gap-4 p-6">
              <span data-blur="sm" className="glass grid size-12 place-items-center rounded-2xl text-accent">
                <Icon size={24} weight="light" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-ink-muted">{text}</p>
            </GlassCard>
          ))}
        </ul>
      </div>
    </section>
  )
}
