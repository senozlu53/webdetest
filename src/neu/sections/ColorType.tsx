import type { ComponentType } from 'react'
import {
  BellSimpleIcon,
  FanIcon,
  GearIcon,
  HeartIcon,
  HouseSimpleIcon,
  LightbulbIcon,
  LockSimpleIcon,
  MusicNotesIcon,
  SpeakerHighIcon,
  TelevisionSimpleIcon,
  type IconProps,
} from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { cx } from '../../shared/cx'

export type Base = 'gri' | 'mavi' | 'bej'

export const BASES: ReadonlyArray<{ id: Base; label: string; hex: string; dark: string }> = [
  { id: 'gri', label: 'Gri', hex: '#E0E5EC', dark: 'rgb(163 177 198 / .5)' },
  { id: 'mavi', label: 'Mavi', hex: '#DCE4F2', dark: 'rgb(150 166 196 / .55)' },
  { id: 'bej', label: 'Bej', hex: '#EBE5DC', dark: 'rgb(190 176 156 / .55)' },
]

const CONTRAST = [
  { role: 'Metin', hex: '#31344B', values: '9,63 · 9,53 · 9,73', note: 'AAA' },
  { role: 'İkincil metin', hex: '#555E73', values: '5,13 · 5,08 · 5,19', note: 'AA' },
  { role: 'Vurgu', hex: '#4F46E5', values: '4,97 · 4,92 · 5,02', note: 'AA' },
  { role: 'Erişilebilir kenar', hex: '#737D91', values: '3,27 · 3,24 · 3,31', note: '3:1 (1.4.11)' },
] as const

const TYPE = [
  { cls: 'text-6xl font-black', meta: '60 · 900', sample: '22,5°' },
  { cls: 'text-4xl font-extrabold', meta: '36 · 800', sample: 'Oturma odası' },
  { cls: 'text-xl font-bold', meta: '20 · 700', sample: 'Işıklar %60 parlaklıkta' },
  { cls: 'text-base font-semibold', meta: '16 · 600', sample: 'Gövde metni dolgun ve yuvarlak; ince ağırlık kullanılmaz.' },
] as const

const ICONS: ReadonlyArray<{ Icon: ComponentType<IconProps>; label: string }> = [
  { Icon: HouseSimpleIcon, label: 'Ev' },
  { Icon: LightbulbIcon, label: 'Işık' },
  { Icon: FanIcon, label: 'Fan' },
  { Icon: LockSimpleIcon, label: 'Kilit' },
  { Icon: TelevisionSimpleIcon, label: 'TV' },
  { Icon: SpeakerHighIcon, label: 'Ses' },
  { Icon: MusicNotesIcon, label: 'Müzik' },
  { Icon: BellSimpleIcon, label: 'Zil' },
  { Icon: HeartIcon, label: 'Favori' },
  { Icon: GearIcon, label: 'Ayarlar' },
]

type Props = { base: Base; onBase: (b: Base) => void; dark: boolean }

export function ColorType({ base, onBase, dark }: Props) {
  return (
    <section id="renk" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="04 · 05 · 09"
          label="Renk, tipografi, ikon"
          title="Tek renk, dolgun yazı, gömülü ikon"
          lede="Zemin ve bileşen aynı pastel tondur. Tabanı değiştirdiğinizde bütün sayfa ve iki gölge birlikte değişir. Metin renkleri her tabanda AA'yı geçer."
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="neu neu-raised flex flex-col gap-6 rounded-neu-lg p-6 md:p-8">
            <h3 className="text-xl font-extrabold">
              <span lang="en">Color/MonochromeBase</span>
            </h3>
            <div role="radiogroup" aria-label="Taban rengi" className="grid grid-cols-3 gap-5">
              {BASES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  role="radio"
                  aria-checked={base === b.id}
                  disabled={dark}
                  onClick={() => onBase(b.id)}
                  className={cx(
                    'neu neu-press flex cursor-pointer flex-col items-center gap-3 rounded-neu p-4 disabled:cursor-not-allowed disabled:opacity-60',
                    base === b.id ? 'neu-inset text-accent' : 'neu-raised',
                  )}
                >
                  <span className="size-12 rounded-full border border-(--a11y-border)" style={{ background: b.hex }} aria-hidden="true" />
                  <span className="font-extrabold">{b.label}</span>
                  <span className="font-mono text-xs text-muted tabular-nums">{b.hex}</span>
                </button>
              ))}
            </div>
            {dark ? <p className="text-sm text-muted">Koyu modda taban grafit (#2B2F36) sabittir; seçim açık modda geçerlidir.</p> : null}
            <table className="w-full text-left text-sm">
              <caption className="pb-3 text-left font-bold">Kontrast · gri · mavi · bej</caption>
              <tbody>
                {CONTRAST.map((c) => (
                  <tr key={c.role} className="border-t border-(--neu-dark)">
                    <th scope="row" className="py-2.5 pr-3 font-bold">
                      <span className="mr-2 inline-block size-3 rounded-full align-middle" style={{ background: c.hex }} aria-hidden="true" />
                      {c.role}
                    </th>
                    <td className="py-2.5 pr-3 font-semibold tabular-nums">{c.values}</td>
                    <td className="py-2.5 text-muted">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex min-w-0 flex-col gap-10">
            <div className="neu neu-raised rounded-neu-lg p-6 md:p-8">
              <h3 className="text-xl font-extrabold">Nunito</h3>
              <p className="mt-1 text-sm text-muted">Yuvarlak uçlu, kalın ve dolgun. Ağırlık 600–900.</p>
              <ul className="mt-5 flex flex-col gap-4">
                {TYPE.map((t) => (
                  <li key={t.meta} className="grid gap-1 sm:grid-cols-[80px_1fr] sm:items-baseline">
                    <span className="text-xs font-bold text-muted tabular-nums">{t.meta}</span>
                    <span className={t.cls}>{t.sample}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="neu neu-raised rounded-neu-lg p-6 md:p-8">
              <h3 className="text-xl font-extrabold">Gömülü ikonlar</h3>
              <p className="mt-1 text-sm text-muted">Oyuk içinde, kenarları ışık ve gölgeyle kazınmış gibi.</p>
              <ul className="mt-5 grid grid-cols-5 gap-4">
                {ICONS.map(({ Icon, label }) => (
                  <li key={label} className="flex flex-col items-center gap-2">
                    <span className="neu neu-inset grid size-14 place-items-center rounded-full">
                      <Icon size={26} weight="fill" className="neu-deboss" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-bold text-muted">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
