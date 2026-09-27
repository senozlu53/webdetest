import { useState, type CSSProperties } from 'react'
import { ArrowRightIcon, BookOpenIcon, CalculatorIcon, MinusIcon, MusicNotesIcon, PaintBrushIcon, PlusIcon, SpeakerHighIcon } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { ClayCard } from '../components/ClayCard'
import { ClayButton } from '../components/ClayButton'
import { ClayToggle } from '../components/ClayToggle'
import { ClayIcon } from '../components/ClayIcon'
import { Pop } from '../components/Pop'
import type { Tone } from '../components/types'
import { cx } from '../../shared/cx'

const COURSES: ReadonlyArray<{ id: string; title: string; meta: string; icon: Icon; tone: Tone; color: string; tilt: number }> = [
  { id: 'dil', title: 'İngilizce', meta: '24 ders · A2', icon: BookOpenIcon, tone: 'lilac', color: 'var(--accent)', tilt: -2 },
  { id: 'mat', title: 'Matematik', meta: '18 ders · 7. sınıf', icon: CalculatorIcon, tone: 'butter', color: 'var(--ic-butter)', tilt: 2 },
  { id: 'sanat', title: 'Çizim', meta: '12 ders · başlangıç', icon: PaintBrushIcon, tone: 'mint', color: 'var(--ic-mint)', tilt: -1.5 },
]

const GOALS = [5, 10, 20] as const

const REACT = `<ClayCard tone="lilac" volume="xl" float>
  <ClayToggle checked={on} onChange={setOn}
    label="Günlük hatırlatma" />
  <ClayButton tone="primary" icon={<ArrowRightIcon />}>
    Devam et
  </ClayButton>
</ClayCard>`

export function Components() {
  const [sound, setSound] = useState(true)
  const [music, setMusic] = useState(false)
  const [course, setCourse] = useState('dil')
  const [goal, setGoal] = useState<(typeof GOALS)[number]>(10)
  const [count, setCount] = useState(3)

  return (
    <section id="bilesenler" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="11 · 14"
          label={<span lang="en">UI Component Patterns</span>}
          title="Şişkin, basınca sönen"
          lede="Düğmeler hap biçimli ve kalındır; basınca havası iner, bırakınca yaylı bir eğriyle geri şişer. Kartlar havada asılı durur, dokununca yassılaşır."
        />

        {/* Havada asılı, basınca sönen kartlar */}
        <fieldset>
          <legend className="font-display text-2xl font-extrabold">Kurs seçin</legend>
          <p className="mt-1 text-muted">Kartlar süzülür; basılı tutunca havası iner. Seçilen kart sönük kalır ve işaretlenir.</p>
          <div className="mt-8 grid gap-10 sm:grid-cols-3">
            {COURSES.map((c, i) => {
              const on = course === c.id
              return (
                <Pop key={c.id} i={i} className="min-w-0">
                  <div className="clay-float" style={{ '--tilt': `${c.tilt}deg`, '--float-delay': `${i * -1.7}s` } as CSSProperties}>
                    <label
                      className={cx(
                        `clay clay-xl tone-${c.tone} clay-press flex cursor-pointer flex-col gap-4 rounded-clay p-7 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ring`,
                        on && 'outline-4 outline-offset-4 outline-ink',
                      )}
                      data-squish={on ? '' : undefined}
                    >
                      <input type="radio" name="kurs" value={c.id} checked={on} onChange={() => setCourse(c.id)} className="sr-only" />
                      <ClayIcon icon={c.icon} tile="base" color={c.color} size={30} className="self-start" />
                      <span className="font-display text-2xl leading-tight font-extrabold">{c.title}</span>
                      <span className="flex items-center justify-between font-bold">
                        {c.meta}
                        <span className={cx('rounded-max px-3 py-0.5 text-[14px]', on ? 'bg-ink text-bg' : 'opacity-0')} aria-hidden={!on}>
                          Seçili
                        </span>
                      </span>
                    </label>
                  </div>
                </Pop>
              )
            })}
          </div>
        </fieldset>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          <Pop>
            <ClayCard tone="base" volume="xl" className="flex h-full flex-col gap-6 p-7">
              <h3 className="text-2xl font-extrabold">Düğmeler</h3>
              <div className="flex flex-wrap gap-4">
                <ClayButton tone="primary" icon={<ArrowRightIcon size={20} weight="bold" aria-hidden="true" />}>
                  Devam et
                </ClayButton>
                <ClayButton tone="pink">Kaydet</ClayButton>
                <ClayButton tone="base">Vazgeç</ClayButton>
                <ClayButton tone="blue" size="sm">
                  Küçük
                </ClayButton>
                <ClayButton tone="mint" size="lg">
                  Büyük
                </ClayButton>
                <ClayButton tone="base" disabled>
                  Kapalı
                </ClayButton>
              </div>
              <p className="mt-auto text-[15px] text-muted">En küçük hedef 44px, varsayılan 52px. Basınca d %35'e iner ve düğme yassılaşır; Enter tuşu da aynı tepkiyi verir.</p>
            </ClayCard>
          </Pop>

          <Pop i={1}>
            <ClayCard tone="base" volume="xl" className="flex h-full flex-col gap-3 p-7">
              <h3 className="text-2xl font-extrabold">Şişkin anahtarlar</h3>
              <ClayToggle checked={sound} onChange={setSound} label="Ses efektleri" description="Doğru cevapta zil" />
              <ClayToggle checked={music} onChange={setMusic} label="Arka plan müziği" description="Çalışırken lo-fi" />
              <div className="mt-2 flex items-center gap-4">
                <ClayIcon icon={sound ? SpeakerHighIcon : MusicNotesIcon} tile={sound ? 'blue' : 'lilac'} color={sound ? 'var(--ic-blue)' : 'var(--accent)'} size={26} />
                <p className="text-[15px] text-muted">Topuz yaylı eğriyle zıplar; durum yalnızca renkle değil, onay ve çarpı işaretiyle de okunur.</p>
              </div>
            </ClayCard>
          </Pop>

          <Pop i={2}>
            <ClayCard tone="base" volume="xl" className="flex h-full flex-col gap-6 p-7">
              <h3 className="text-2xl font-extrabold">Seçici ve sayaç</h3>
              <fieldset>
                <legend className="font-bold">Günlük hedef</legend>
                <div className="clay-well clay-sm mt-3 grid grid-cols-3 gap-1.5 rounded-max p-1.5">
                  {GOALS.map((g) => (
                    <label key={g} className="cursor-pointer rounded-max has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
                      <input type="radio" name="hedef" value={g} checked={goal === g} onChange={() => setGoal(g)} className="sr-only" />
                      <span
                        className={cx(
                          'grid min-h-11 place-items-center rounded-max font-bold transition-[color] duration-300',
                          goal === g ? 'clay clay-sm tone-primary' : 'text-muted',
                        )}
                      >
                        {g} dk
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <p className="font-bold" id="soru-sayisi">
                  Soru sayısı
                </p>
                <div className="mt-3 flex items-center gap-4" role="group" aria-labelledby="soru-sayisi">
                  <ClayButton round tone="base" onClick={() => setCount((c) => Math.max(1, c - 1))} aria-label="Azalt" disabled={count <= 1} icon={<MinusIcon size={20} weight="bold" aria-hidden="true" />} />
                  <output aria-live="polite" className="clay-well clay-sm grid min-h-13 flex-1 place-items-center rounded-max font-display text-2xl font-extrabold tabular-nums">
                    {count}
                  </output>
                  <ClayButton round tone="base" onClick={() => setCount((c) => Math.min(10, c + 1))} aria-label="Artır" disabled={count >= 10} icon={<PlusIcon size={20} weight="bold" aria-hidden="true" />} />
                </div>
              </div>
            </ClayCard>
          </Pop>
        </div>

        <Pop className="mt-8">
          <ClayCard tone="base" volume="lg" className="grid gap-6 p-7 md:grid-cols-[1fr_1.2fr] md:items-center">
            <div>
              <h3 className="text-2xl font-extrabold">React · Madde 14</h3>
              <p className="mt-2 text-muted">
                Gerçek bir 3B motoru yok: <span className="font-mono text-ink">ClayCard</span>, <span className="font-mono text-ink">ClayButton</span>,{' '}
                <span className="font-mono text-ink">ClayToggle</span> ve <span className="font-mono text-ink">ClayIcon</span> yalnızca CSS gölgeleri ve bir SVG
                filtresiyle kurulur. <span className="font-mono text-ink">tone</span> dolguyu, <span className="font-mono text-ink">volume</span> hacim birimini seçer.
              </p>
            </div>
            <pre className="clay-well clay-sm overflow-x-auto rounded-soft p-5 font-mono text-[13px] leading-relaxed">
              <code>{REACT}</code>
            </pre>
          </ClayCard>
        </Pop>
      </div>
    </section>
  )
}
