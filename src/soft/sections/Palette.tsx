import { FadeSection } from '../components/FadeSection'
import { SectionIntro } from '../components/SectionIntro'
import { SoftCard } from '../components/SoftCard'
import { CONTRAST, DERIVED, SWATCHES } from '../content'
import { cx } from '../../shared/cx'

export function Palette() {
  return (
    <FadeSection id="renk" className="py-24 md:py-32">
      <div className="soft-frame">
        <SectionIntro
          item="04"
          label="Renk Paleti"
          title={
            <>
              Kum, kağıt ve <em className="text-gold-deep">toprak</em>
            </>
          }
          lede="Dört ana renk. Altın, açık zeminde metin taşıyamayacak kadar yumuşak olduğu için erişilebilirlik adına dört ton daha türetildi."
        />

        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {SWATCHES.map((s) => (
            <SoftCard as="li" key={s.token} blur="none" elevation="soft" padding="none" className="overflow-hidden">
              <div className={cx('aspect-[4/3] border-b border-line', s.className)} />
              <div className="flex flex-col gap-1 px-7 py-6">
                <h3 className="font-serif text-h3">{s.name}</h3>
                <p className="text-small text-ink-soft" lang="en">
                  {s.role}
                </p>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-small tabular-nums">
                  <dt className="text-ink-soft">Açık</dt>
                  <dd>{s.light}</dd>
                  <dt className="text-ink-soft">Koyu</dt>
                  <dd>{s.dark}</dd>
                  <dt className="text-ink-soft">Token</dt>
                  <dd>
                    <code className="text-caption">bg-{s.token}</code>
                  </dd>
                </dl>
              </div>
            </SoftCard>
          ))}
        </ul>

        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h3 className="text-h3">Erişilebilirlik için türetilen tonlar</h3>
            <p className="mt-3 max-w-[44ch] text-ink-soft">
              Düşük kontrast hissi korunur, WCAG AA korunur. Metin 4,5:1, form kenarları 3:1 sınırının üstündedir.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {DERIVED.map((d) => (
                <li key={d.token} className="flex items-center gap-4 rounded-pill bg-sand py-2.5 pr-6 pl-2.5">
                  <span className="flex shrink-0 -space-x-2" aria-hidden="true">
                    <span className="size-9 rounded-full border-2 border-sand" style={{ background: d.light }} />
                    <span className="size-9 rounded-full border-2 border-sand" style={{ background: d.dark }} />
                  </span>
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-small text-ink-soft">{d.use}</span>
                  </span>
                  <span className="ml-auto hidden text-small tabular-nums text-ink-soft sm:block">
                    {d.light} · {d.dark}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <SoftCard blur="none" elevation="soft" className="lg:col-span-7">
            <h3 className="text-h3">Kontrast</h3>
            <ul className="mt-6 flex flex-col">
              {CONTRAST.map((c) => (
                <li
                  key={c.fg + c.bg}
                  className="grid grid-cols-[56px_1fr_auto] items-center gap-x-4 gap-y-1 border-t border-line py-4 first:border-t-0"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-14 place-items-center rounded-pill border border-line font-serif text-lead"
                    style={{ color: c.fg, background: c.bg }}
                  >
                    Aa
                  </span>
                  <span className="flex min-w-0 flex-col leading-snug">
                    <span className="font-medium">{c.note}</span>
                    <span className="text-small tabular-nums text-ink-soft">
                      {c.fg} / {c.bg}
                    </span>
                  </span>
                  <span className="flex flex-col items-end leading-snug">
                    <span className="font-serif text-lead tabular-nums">{c.ratio}:1</span>
                    <span className={cx('text-caption', c.pass === 'Metin değil' ? 'text-ink-soft' : 'text-gold-deep')}>
                      {c.pass}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </SoftCard>
        </div>
      </div>
    </FadeSection>
  )
}
