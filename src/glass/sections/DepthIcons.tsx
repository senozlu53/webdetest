import type { ComponentType } from 'react'
import {
  BellIcon,
  ChartLineUpIcon,
  ChatCircleDotsIcon,
  CubeIcon,
  GearSixIcon,
  HouseIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  RobotIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  WalletIcon,
  type IconProps,
} from '@phosphor-icons/react'
import { GlassCard } from '../components/GlassCard'
import { SectionHead } from '../components/SectionHead'
import { Icon3D } from '../components/Icon3D'

const LINE: ReadonlyArray<{ Icon: ComponentType<IconProps>; label: string }> = [
  { Icon: HouseIcon, label: 'Ana sayfa' },
  { Icon: MagnifyingGlassIcon, label: 'Ara' },
  { Icon: ChatCircleDotsIcon, label: 'Sohbet' },
  { Icon: BellIcon, label: 'Bildirim' },
  { Icon: UserCircleIcon, label: 'Profil' },
  { Icon: GearSixIcon, label: 'Ayarlar' },
]

const GLOSSY: ReadonlyArray<{ Icon: ComponentType<IconProps>; label: string; from: string; to: string }> = [
  { Icon: RobotIcon, label: 'Asistan', from: '#A78BFA', to: '#6D28D9' },
  { Icon: WalletIcon, label: 'Cüzdan', from: '#67E8F9', to: '#0E7490' },
  { Icon: ChartLineUpIcon, label: 'Piyasa', from: '#86EFAC', to: '#047857' },
  { Icon: ShieldCheckIcon, label: 'Güvenlik', from: '#F9A8D4', to: '#BE185D' },
  { Icon: LightningIcon, label: 'Hızlı', from: '#FDE68A', to: '#D97706' },
  { Icon: CubeIcon, label: 'Model', from: '#93C5FD', to: '#1D4ED8' },
]

const LAYERS = [
  { name: 'Zemin', detail: 'Canlı degrade, blur yok', blur: '—', shadow: '—', cls: 'left-0 top-0 w-[70%]', tone: 'subtle' as const },
  { name: 'Kart', detail: 'Blur 24 · gölge yayvan', blur: 'lg', shadow: 'glass', cls: 'left-[14%] top-14 w-[70%]', tone: 'panel' as const },
  { name: 'Modal', detail: 'Blur 40 · gölge en geniş', blur: 'xl', shadow: 'glass-xl', cls: 'left-[28%] top-28 w-[70%]', tone: 'strong' as const },
]

export function DepthIcons() {
  return (
    <section id="derinlik" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="07 · 09"
          label="Z-ekseni ve ikonografi"
          title="Derinlik katmanlarla kurulur"
          lede="Üstteki katman hem daha çok bulanıklaştırır hem daha geniş gölge düşürür. İkonlar ya ince çizgili ya da parlak ve hacimlidir; ikisi aynı yerde karışmaz."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold">Üç katman</h3>
            <div className="relative mt-6 h-72" aria-hidden="true">
              <span className="absolute top-16 left-[20%] size-44 rounded-full" style={{ background: 'radial-gradient(closest-side, var(--blob-2), transparent)' }} />
              {LAYERS.map((l) => (
                <div
                  key={l.name}
                  data-blur={l.blur === '—' ? 'sm' : l.blur}
                  data-tone={l.tone}
                  className={`glass absolute h-36 rounded-glass p-4 ${l.cls} ${l.shadow === 'glass-xl' ? 'shadow-glass-xl' : ''}`}
                >
                  <p className="font-semibold">{l.name}</p>
                  <p className="text-sm text-ink-muted">{l.detail}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="flex flex-col gap-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold">İnce çizgili</h3>
              <p className="mt-1 text-sm text-ink-muted">Phosphor, light ağırlık (1,5px). Gezinme ve araç çubukları için.</p>
              <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {LINE.map(({ Icon, label }) => (
                  <li key={label} className="flex flex-col items-center gap-2 text-center">
                    <span data-blur="sm" data-tone="subtle" className="glass grid size-12 place-items-center rounded-2xl">
                      <Icon size={24} weight="light" aria-hidden="true" />
                    </span>
                    <span className="text-xs">{label}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold">Parlak ve hacimli</h3>
              <p className="mt-1 text-sm text-ink-muted">Degrade gövde, üstte ışık, altta iç gölge. Uygulama ve özellik simgeleri için.</p>
              <ul className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-6">
                {GLOSSY.map((g) => (
                  <li key={g.label} className="flex flex-col items-center gap-2 text-center">
                    <Icon3D Icon={g.Icon} from={g.from} to={g.to} />
                    <span className="text-xs">{g.label}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  )
}
