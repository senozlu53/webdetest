import { useState, type FormEvent } from 'react'
import { FadeSection } from '../components/FadeSection'
import { SectionIntro } from '../components/SectionIntro'
import { SoftCard } from '../components/SoftCard'
import { PillButton } from '../components/PillButton'
import { PillInput } from '../components/PillInput'
import { Switch } from '../components/Switch'
import { LineIcon } from '../components/LineIcon'
import { MOODS, ROUTINE } from '../content'
import { cx } from '../../shared/cx'

const REACT_SNIPPET = `<FadeSection>
  <SoftCard blur="sm">
    <h3>Akşam rutini</h3>
    <PillButton variant="accent">
      Seansa başla
    </PillButton>
  </SoftCard>
</FadeSection>`

const TAILWIND_SPEC = `bg-[#FAF9F6] text-[#4A4A4A]
rounded-2xl shadow-soft tracking-wide`

const TAILWIND_TOKENS = `bg-canvas text-ink
rounded-2xl shadow-soft tracking-wide`

export function Components() {
  const [moods, setMoods] = useState<string[]>(['Uyku'])
  const [reminders, setReminders] = useState(true)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState<string | null>(null)

  const toggleMood = (m: string) =>
    setMoods((current) => (current.includes(m) ? current.filter((x) => x !== m) : [...current, m]))

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(email)
  }

  return (
    <FadeSection id="bilesenler" className="py-24 md:py-32">
      <div className="soft-frame">
        <SectionIntro
          item="11 · 14 · 15"
          label={<span lang="en">UI Component Patterns</span>}
          title={
            <>
              Yüzen kartlar, <em className="text-gold-deep">hap</em> alanlar
            </>
          }
          lede="Kartlar zeminden birkaç milimetre yükselmiş gibi durur. Alanlar ve düğmeler hap formundadır; listeler geniş satır aralığıyla nefes alır."
        />

        {/* Buzlu cam etkisinin görünmesi için kartların arkasında yumuşak ışık lekeleri */}
        <div className="relative overflow-hidden rounded-[40px] bg-sand px-5 py-10 md:px-10 md:py-14">
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-16 size-[420px] rounded-full opacity-80 blur-3xl"
            style={{ background: 'color-mix(in oklab, var(--gold) 55%, var(--sand))' }}
          />
          <div
            aria-hidden="true"
            className="absolute -right-10 -bottom-32 size-[380px] rounded-full blur-3xl"
            style={{ background: 'var(--glow)' }}
          />
          <p className="relative text-caption font-medium tracking-wide text-ink-soft">Örnek içerik · Wellness uygulaması</p>
          <div className="relative mt-6 grid items-start gap-6 lg:grid-cols-3">
            <SoftCard blur="md" padding="compact">
              <h3 className="text-h3">Bugünkü niyet</h3>
              <p className="mt-2 text-small text-ink-soft">Birden fazla seçebilirsiniz.</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {MOODS.map((m) => {
                  const active = moods.includes(m)
                  return (
                    <li key={m}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleMood(m)}
                        className={cx(
                          'inline-flex cursor-pointer items-center gap-1.5 rounded-pill border px-4 py-2 text-small transition-colors duration-400 ease-soft',
                          active ? 'border-gold-deep bg-gold text-on-gold' : 'border-field bg-transparent text-ink hover:bg-sand',
                        )}
                      >
                        {active ? <LineIcon name="check" size={16} /> : null}
                        {m}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </SoftCard>

            <SoftCard blur="md" padding="compact" className="lg:translate-y-8">
              <p className="flex items-center gap-2 text-small text-ink-soft">
                <LineIcon name="moon" size={18} className="text-gold-deep" />
                Dün gece
              </p>
              <p className="mt-4 font-serif text-display leading-none tabular-nums">
                7<span className="text-h3"> sa </span>20<span className="text-h3"> dk</span>
              </p>
              <p className="mt-4 text-small text-ink-soft">Önceki gece 6 sa 45 dk. Yatış saatin 22.40'ta sabit kaldı.</p>
            </SoftCard>

            <SoftCard blur="md" padding="compact" className="flex flex-col gap-6">
              <Switch
                id="hatirlatici"
                label="Akşam hatırlatıcısı"
                description={reminders ? 'Her gün 21.30' : 'Kapalı'}
                checked={reminders}
                onChange={setReminders}
              />
              <div className="h-px bg-line" />
              <p className="text-small text-ink-soft">
                Bildirimler sessiz gelir. Titreşim ve kırmızı rozet kullanılmaz.
              </p>
            </SoftCard>
          </div>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-10 lg:col-span-5">
            <div>
              <h3 className="text-h3">Düğmeler</h3>
              <div className="mt-6 flex flex-wrap gap-3">
                <PillButton variant="primary" icon={<LineIcon name="arrow-right" size={18} />}>
                  Seansa başla
                </PillButton>
                <PillButton variant="accent">Üye ol</PillButton>
                <PillButton variant="soft">Daha sonra</PillButton>
                <PillButton variant="ghost">Keşfet</PillButton>
              </div>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
              <h3 className="text-h3">Hap alanlar</h3>
              <PillInput id="seans-ara" label="Seans ara" icon="search" type="search" placeholder="Uyku, nefes, odak…" />
              <PillInput
                id="bulten"
                label="Haftalık mektup"
                type="email"
                autoComplete="email"
                placeholder="ad@alan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex flex-wrap items-center gap-4">
                <PillButton type="submit" variant="primary">
                  Abone ol
                </PillButton>
                <p aria-live="polite" className="text-small text-ink-soft">
                  {sent !== null ? `Örnek form: ${sent || 'boş adres'} gönderilmedi.` : 'Örnek form, gönderim yapılmaz.'}
                </p>
              </div>
            </form>
          </div>

          <SoftCard blur="none" elevation="soft" className="lg:col-span-7">
            <h3 className="text-h3">Akşam rutini</h3>
            <p className="mt-2 text-small text-ink-soft">Geniş satır aralıklı liste · satır yüksekliği 88px</p>
            <ul className="mt-6 flex flex-col">
              {ROUTINE.map((r) => (
                <li key={r.title} className="border-t border-line first:border-t-0">
                  <a
                    href="#bilesenler"
                    className="group -mx-3 flex min-h-[88px] items-center gap-5 rounded-soft px-3 text-ink no-underline transition-colors duration-400 ease-soft hover:bg-sand"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sand text-gold-deep transition-colors duration-400 ease-soft group-hover:bg-float-solid">
                      <LineIcon name={r.icon} size={22} />
                    </span>
                    <span className="flex min-w-0 flex-col leading-snug">
                      <span className="font-medium">{r.title}</span>
                      <span className="text-small text-ink-soft">{r.meta}</span>
                    </span>
                    <LineIcon
                      name="arrow-right"
                      size={18}
                      className="ml-auto shrink-0 text-ink-soft transition-transform duration-400 ease-soft group-hover:translate-x-1"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </SoftCard>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <p className="mb-3 pl-2 text-small font-medium">React · Madde 14</p>
            <pre className="overflow-x-auto rounded-card bg-sand px-7 py-6 text-small leading-relaxed md:px-10 md:py-8">
              <code>{REACT_SNIPPET}</code>
            </pre>
          </div>
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-5">
            <div>
              <p className="mb-3 pl-2 text-small font-medium">
                <span lang="en">Tailwind</span> · Madde 15 · tanımdaki hali
              </p>
              <pre className="overflow-x-auto rounded-card bg-sand px-7 py-6 text-small leading-relaxed">
                <code>{TAILWIND_SPEC}</code>
              </pre>
            </div>
            <div>
              <p className="mb-3 pl-2 text-small font-medium">Bu projede · tokenlarla</p>
              <pre className="overflow-x-auto rounded-card bg-sand px-7 py-6 text-small leading-relaxed">
                <code>{TAILWIND_TOKENS}</code>
              </pre>
              <p className="mt-3 pl-2 text-small text-ink-soft">
                Sabit hex yerine token kullanılır; böylece koyu modda renkler kendiliğinden değişir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FadeSection>
  )
}
