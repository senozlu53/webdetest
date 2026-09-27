import {
  BookOpenIcon,
  CoinIcon,
  GiftIcon,
  HeartIcon,
  PiggyBankIcon,
  RocketLaunchIcon,
  StarIcon,
  TrophyIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { ClayCard } from '../components/ClayCard'
import { ClayIcon } from '../components/ClayIcon'
import { Pop } from '../components/Pop'
import type { Tone } from '../components/types'

type Swatch = { tone: Tone; name: string; role: string; light: string; dark: string; ink: [number, number] }

// Kontrast: metin rengi (#2B2150 açık · #F6F2FF koyu) bu dolgunun üstünde, [açık, koyu]
const SWATCHES: ReadonlyArray<Swatch> = [
  { tone: 'base', name: 'Surface (Clay)', role: 'Kil yüzey', light: '#FFFFFF', dark: '#221B3D', ink: [14.62, 14.75] },
  { tone: 'pink', name: 'Canlı Pembe', role: 'Vurgu', light: '#FF7EB3', dark: '#4A1F45', ink: [6.19, 12.12] },
  { tone: 'purple', name: 'Parlak Mor', role: 'Ana eylem', light: '#8E2DE2', dark: '#34206A', ink: [5.8, 12.21] },
  { tone: 'blue', name: 'Bebek Mavisi', role: 'Bilgi', light: '#A6D8FF', dark: '#183257', ink: [9.67, 11.68] },
  { tone: 'mint', name: 'Nane', role: 'Başarı', light: '#A8EDD2', dark: '#15413A', ink: [10.94, 10.31] },
  { tone: 'butter', name: 'Tereyağı', role: 'Ödül', light: '#FFE59A', dark: '#463A17', ink: [11.79, 10.15] },
  { tone: 'lilac', name: 'Lila', role: 'Kart', light: '#DCCBFF', dark: '#2E2657', ink: [9.77, 12.45] },
]

const ICONS: ReadonlyArray<{ icon: Icon; label: string; tone: Tone; color: string }> = [
  { icon: BookOpenIcon, label: 'Ders', tone: 'lilac', color: 'var(--accent)' },
  { icon: TrophyIcon, label: 'Kupa', tone: 'butter', color: 'var(--ic-butter)' },
  { icon: RocketLaunchIcon, label: 'Başla', tone: 'blue', color: 'var(--ic-blue)' },
  { icon: PiggyBankIcon, label: 'Kumbara', tone: 'pink', color: 'var(--ic-pink)' },
  { icon: HeartIcon, label: 'Can', tone: 'pink', color: 'var(--ic-pink)' },
  { icon: StarIcon, label: 'Yıldız', tone: 'blue', color: 'var(--ic-star)' },
  { icon: GiftIcon, label: 'Hediye', tone: 'mint', color: 'var(--ic-mint)' },
  { icon: CoinIcon, label: 'Jeton', tone: 'butter', color: 'var(--ic-butter)' },
]

const SCALE = [
  { label: 'Display · Baloo 2 · 84/800', cls: 'font-display text-5xl md:text-7xl font-extrabold leading-none', text: 'Merhaba!' },
  { label: 'Başlık · Baloo 2 · 36/800', cls: 'font-display text-4xl font-extrabold leading-tight', text: 'Bugün ne öğreniyoruz?' },
  { label: 'Gövde · Quicksand · 17/500', cls: 'text-[17px] font-medium', text: 'Yuvarlak uçlu harfler iri formlarla aynı dili konuşur; ağır ağırlıklar kalın düğmelere yakışır.' },
  { label: 'Etiket · Quicksand · 15/700', cls: 'text-[15px] font-bold', text: 'Şişirilmiş formlar · Çifte iç gölge · İri hedefler' },
] as const

const SHAPES = [
  { label: 'Radius/Soft', value: '32px', cls: 'rounded-soft', tone: 'blue' as Tone },
  { label: 'Radius/Clay', value: '56px (50px+)', cls: 'rounded-clay', tone: 'mint' as Tone },
  { label: 'Radius/MaxRounded', value: '9999px · hap', cls: 'rounded-max', tone: 'pink' as Tone },
  { label: 'Şişkin asimetrik', value: '64/44/72/52', cls: 'blob', tone: 'butter' as Tone },
]

export function Palette({ dark }: { dark: boolean }) {
  return (
    <section id="renk" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="04 · 05 · 06 · 09"
          label="Renk, yazı, şekil, ikon"
          title="Pastel zemin, parlak kil"
          lede="Arka plan #F9F8FD yumuşak pastel; kil ya beyaz ya da doygun pastel. Metin her dolguda koyu mor mürekkeptir, bu yüzden en açık pastelde bile AA'nın çok üstünde kalır."
        />

        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          <Pop as="li" className="min-w-0">
            <div className="clay-well clay-md flex h-full min-h-44 flex-col justify-end gap-1 rounded-clay p-6">
              <span className="font-display text-xl leading-tight font-extrabold">Background</span>
              <span className="text-[15px] text-muted">Color/PastelBase</span>
              <span className="font-mono text-[14px] font-bold">{dark ? '#120E24' : '#F9F8FD'}</span>
            </div>
          </Pop>
          {SWATCHES.map((s, i) => (
            <Pop as="li" i={i + 1} key={s.tone} className="min-w-0">
              <ClayCard tone={s.tone} volume="lg" className="flex h-full min-h-44 flex-col justify-end gap-1 p-6">
                <span className="font-display text-xl leading-tight font-extrabold">{s.name}</span>
                <span className="text-[15px] font-semibold">{s.role}</span>
                <span className="font-mono text-[14px] font-bold">{dark ? s.dark : s.light}</span>
                <span className="text-[14px] font-bold">Metin {String(dark ? s.ink[1] : s.ink[0]).replace('.', ',')}:1</span>
              </ClayCard>
            </Pop>
          ))}
        </ul>

        <Pop className="mt-8">
          <ClayCard tone="base" volume="md" className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-soft px-6 py-4 text-[15px]">
            <span className="font-bold">Shadow / Highlight</span>
            <span>
              Işık: <span className="font-mono">{dark ? 'neon %60' : 'rgba(255,255,255,0.8)'}</span>
            </span>
            <span>
              Gölge: <span className="font-mono">{dark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.1)'}</span>
            </span>
            <span className="text-muted">Pembe dolguda yalnızca ana metin: ikincil metin orada 3,0:1'e düşer.</span>
          </ClayCard>
        </Pop>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <Pop>
            <ClayCard tone="base" volume="xl" className="h-full p-6 md:p-9">
              <h3 className="text-2xl font-extrabold">Tipografi</h3>
              <p className="mt-1 text-[15px] text-muted">
                Başlıklar Baloo 2 (Ek Type, yuvarlak uçlu, 400–800), gövde Quicksand (Andrew Paglinawan, 300–700). İkisi de ğ, ş, İ, ı ve ₺ içerir.
              </p>
              <ul className="mt-6 flex flex-col gap-6">
                {SCALE.map((t) => (
                  <li key={t.label}>
                    <span className="font-mono text-[13px] text-muted">{t.label}</span>
                    <p className={t.cls}>{t.text}</p>
                  </li>
                ))}
              </ul>
            </ClayCard>
          </Pop>

          <Pop i={1}>
            <ClayCard tone="base" volume="xl" className="flex h-full flex-col gap-6 p-6 md:p-9">
              <div>
                <h3 className="text-2xl font-extrabold">İkonlar</h3>
                <p className="mt-1 text-[15px] text-muted">
                  Tıknaz ve içi dolu. Aynı üç gölge bir SVG filtresiyle ikonun kendi biçimine uygulanır; ikon 3B render edilmiş gibi durur.
                </p>
              </div>
              <ul className="grid grid-cols-4 gap-4">
                {ICONS.map((ic) => (
                  <li key={ic.label} className="flex flex-col items-center gap-2 text-center">
                    <ClayIcon icon={ic.icon} tile={ic.tone} color={ic.color} size={28} />
                    <span className="text-[14px] font-bold">{ic.label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto grid grid-cols-2 gap-4">
                <div className="clay-well clay-sm flex flex-col items-center gap-2 rounded-soft p-4 text-center">
                  <TrophyIcon size={48} weight="thin" aria-hidden="true" className="text-muted" />
                  <span className="text-[14px] font-bold text-muted">İnce çizgi: kilde kaybolur</span>
                </div>
                <div className="clay-well clay-sm flex flex-col items-center gap-2 rounded-soft p-4 text-center">
                  <ClayIcon icon={TrophyIcon} size={48} color="var(--ic-butter)" />
                  <span className="text-[14px] font-bold">Tıknaz dolu + kil filtresi</span>
                </div>
              </div>
            </ClayCard>
          </Pop>
        </div>

        <Pop className="mt-14">
          <h3 className="text-3xl font-extrabold">Şekil dili</h3>
          <p className="mt-2 max-w-[60ch] text-muted">Abartılı köşe yarıçapları, tam yuvarlak haplar ve şişkin asimetrik kapsayıcılar. Keskin köşe yok.</p>
        </Pop>
        <ul className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {SHAPES.map((s, i) => (
            <Pop as="li" i={i} key={s.label} className="flex min-w-0 flex-col items-center gap-4 text-center">
              <div className={`clay clay-lg tone-${s.tone} h-32 w-full max-w-52 ${s.cls}`} aria-hidden="true" />
              <div>
                <p className="font-mono text-[14px] font-bold">{s.label}</p>
                <p className="text-[15px] text-muted">{s.value}</p>
              </div>
            </Pop>
          ))}
        </ul>
      </div>
    </section>
  )
}
