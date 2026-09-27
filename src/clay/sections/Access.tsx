import { useState } from 'react'
import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { ClayCard } from '../components/ClayCard'
import { ClayButton } from '../components/ClayButton'
import { ClayToggle } from '../components/ClayToggle'
import { Pop } from '../components/Pop'
import type { Theme } from '../../shared/useTheme'
import { cx } from '../../shared/cx'

export type Neon = 'pembe' | 'mor' | 'camgobegi'

const NEONS: ReadonlyArray<{ id: Neon; label: string; hex: string; onClay: string; button: string }> = [
  { id: 'pembe', label: 'Pembe', hex: '#FF7EB3', onClay: '6,88', button: '7,98' },
  { id: 'mor', label: 'Mor', hex: '#B892FF', onClay: '6,65', button: '7,71' },
  { id: 'camgobegi', label: 'Camgöbeği', hex: '#5CE1E6', onClay: '10,35', button: '12,00' },
]

const ROWS: ReadonlyArray<[string, string, string]> = [
  ['Ana metin · zemin', '13,84', '17,11'],
  ['Ana metin · kil yüzey', '14,62', '14,75'],
  ['İkincil metin · zemin', '6,72', '9,48'],
  ['Ana metin · en koyu pastel (pembe)', '6,19', '12,12'],
  ['Ana eylem düğmesi · metni', '5,80', '7,71–12,00'],
  ['Vurgu metni · zemin', '5,48', '6,65–10,35'],
  ['Odak halkası · zemin (3:1 gerekir)', '5,48', '6,65–10,35'],
  ['Kil kenarı · zemin (yalnız gölge)', '1,06–2,24', '1,16–1,69'],
]

function Preview({ mode }: { mode: Theme }) {
  const [on, setOn] = useState(true)
  return (
    <div data-theme={mode} className="rounded-clay bg-bg p-5 text-ink sm:p-7">
      <p className="font-display text-xl font-extrabold">{mode === 'light' ? 'Pastel' : <span lang="en">Dark Cyber-Clay</span>}</p>
      <p className="text-[15px] text-muted">{mode === 'light' ? 'Beyaz ışık, gri gölge' : 'Koyu mat kil, neon iç ışık'}</p>
      <ClayCard tone="base" volume="lg" className="mt-5 flex flex-col gap-4 p-5">
        <p className="font-bold">Haftalık hedef: 5 ders</p>
        <div className="clay-well clay-sm h-5 rounded-max p-1" aria-hidden="true">
          <div className="clay clay-sm tone-pink h-full w-3/5 rounded-max" />
        </div>
        <ClayToggle checked={on} onChange={setOn} label="Bildirimler" />
        <ClayButton tone="primary" className="self-start">
          Devam et
        </ClayButton>
      </ClayCard>
    </div>
  )
}

type Props = {
  theme: Theme
  mode: Theme | 'system'
  onMode: (m: Theme | 'system') => void
  neon: Neon
  onNeon: (n: Neon) => void
  bordered: boolean
  onBordered: (v: boolean) => void
}

export function Access({ theme, mode, onMode, neon, onNeon, bordered, onBordered }: Props) {
  return (
    <section id="erisilebilirlik" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="18"
          label="Erişilebilirlik ve varyantlar"
          title="İri, net, karanlıkta neon"
          lede="Koyu mürekkep ve iri formlar okunurluğu yüksek tutar. Koyu varyantta açık iç gölge beyaz yerine neon ışığa dönüşür: Dark Cyber-Clay."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <Pop>
            <Preview mode="light" />
          </Pop>
          <Pop i={1}>
            <Preview mode="dark" />
          </Pop>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <Pop>
            <ClayCard tone="base" volume="xl" className="flex h-full flex-col gap-7 p-6 md:p-8">
              <fieldset>
                <legend className="font-display text-xl font-extrabold">Sayfa teması</legend>
                <div className="clay-well clay-sm mt-3 grid grid-cols-3 gap-1.5 rounded-max p-1.5">
                  {(
                    [
                      { id: 'light', label: 'Açık', icon: <SunIcon size={18} weight="fill" aria-hidden="true" /> },
                      { id: 'dark', label: 'Koyu', icon: <MoonIcon size={18} weight="fill" aria-hidden="true" /> },
                      { id: 'system', label: 'Sistem', icon: null },
                    ] as const
                  ).map((m) => (
                    <label key={m.id} className="cursor-pointer rounded-max has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
                      <input type="radio" name="tema" value={m.id} checked={mode === m.id} onChange={() => onMode(m.id)} className="sr-only" />
                      <span className={cx('flex min-h-11 items-center justify-center gap-1.5 rounded-max font-bold', mode === m.id ? 'clay clay-sm tone-primary' : 'text-muted')}>
                        {m.icon}
                        {m.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="font-display text-xl font-extrabold">Neon ışık</legend>
                <p className="text-[15px] text-muted">{theme === 'dark' ? 'Koyu temada iç gölge, vurgu ve odak halkası bu renge döner.' : 'Koyu temada geçerli; yukarıdaki koyu önizlemede görünür.'}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {NEONS.map((n) => (
                    <label key={n.id} className="cursor-pointer rounded-max has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ring">
                      <input type="radio" name="neon" value={n.id} checked={neon === n.id} onChange={() => onNeon(n.id)} className="sr-only" />
                      <span
                        className={cx(
                          'clay clay-sm tone-base inline-flex min-h-11 items-center gap-2 rounded-max px-4 font-bold',
                          neon === n.id && 'outline-3 outline-offset-3 outline-ink',
                        )}
                      >
                        <span className="size-4 rounded-full" style={{ background: n.hex, boxShadow: `0 0 10px ${n.hex}` }} aria-hidden="true" />
                        {n.label}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-[15px] text-muted">
                  Kilde vurgu metni {NEONS.find((n) => n.id === neon)!.onClay}:1 · ana düğme metni {NEONS.find((n) => n.id === neon)!.button}:1
                </p>
              </fieldset>

              <ClayCard tone="base" volume="md" className="rounded-soft px-5 py-2">
                <ClayToggle
                  checked={bordered}
                  onChange={onBordered}
                  label="Kenarlı mod"
                  description="Her kile 2px mürekkep kenar. Sistemde yüksek kontrast açıksa kendiliğinden."
                />
              </ClayCard>
            </ClayCard>
          </Pop>

          <Pop i={1}>
            <ClayCard tone="base" volume="xl" className="flex h-full flex-col gap-5 p-6 md:p-8">
              <h3 className="font-display text-xl font-extrabold">Kontrast (en kötü durum)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[15px]">
                  <thead className="text-muted">
                    <tr>
                      <th className="py-2 pr-3 font-bold">Çift</th>
                      <th className="py-2 pr-3 text-right font-bold">Açık</th>
                      <th className="py-2 text-right font-bold">Koyu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map(([pair, l, d], i) => (
                      <tr key={pair} className={cx('border-t-2 border-well', i === ROWS.length - 1 && 'text-muted')}>
                        <td className="py-2.5 pr-3 font-semibold">{pair}</td>
                        <td className="py-2.5 pr-3 text-right font-mono font-bold whitespace-nowrap">{l}:1</td>
                        <td className="py-2.5 text-right font-mono font-bold whitespace-nowrap">{d}:1</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="flex flex-col gap-2 text-[15px] text-muted">
                <li>
                  <strong className="text-ink">Sınır:</strong> Kilin zeminden ayrılması gölgeye dayanır (1,06–2,24:1; mor dolgu 5,48:1). Bileşeni metin ve ikon da tanımladığı için sorun olmaz;
                  yine de kenarlı mod ve zorunlu renk modu 2px kenar ekler.
                </li>
                <li>
                  <strong className="text-ink">İri hedefler:</strong> Tüm denetimler en az 44px, varsayılan düğme 52px; gövde metni 17px ve 500 ağırlıkta.
                </li>
                <li>
                  <strong className="text-ink">Durum:</strong> Anahtar ve cevaplar yalnız renkle değil, işaret ve metinle de okunur.
                </li>
              </ul>
            </ClayCard>
          </Pop>
        </div>
      </div>
    </section>
  )
}
