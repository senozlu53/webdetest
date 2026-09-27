import { FadeSection } from '../components/FadeSection'
import { SectionIntro } from '../components/SectionIntro'
import { SoftCard } from '../components/SoftCard'
import { TYPE_SCALE } from '../content'

const FACES = [
  { role: 'Başlık', name: 'Lora', meta: 'Cyreal, 2011 · 400–700 · italik', className: 'font-serif' },
  { role: 'Gövde', name: 'Plus Jakarta Sans', meta: 'Tokotype, 2020 · 200–800', className: 'font-sans' },
] as const

export function Typography() {
  return (
    <FadeSection id="tipografi" className="py-24 md:py-32">
      <div className="soft-frame">
        <SectionIntro
          item="05"
          label="Tipografi"
          title={
            <>
              Zarif serif, <em className="text-gold-deep">sakin</em> sans
            </>
          }
          lede="Başlıklar Lora ile, gövde Plus Jakarta Sans ile dizilir. Serif duyguyu, sans okunurluğu taşır. Vurgu kalınlıkla değil, italikle yapılır."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <SoftCard blur="none" elevation="soft" className="flex flex-col gap-10 lg:col-span-5 lg:self-start">
            <div className="grid grid-cols-2 gap-6">
              {FACES.map((f) => (
                <div key={f.name} className="flex flex-col">
                  <span aria-hidden="true" className={`${f.className} text-[96px] leading-none`}>
                    Aa
                  </span>
                  <span className="mt-4 text-caption font-medium tracking-wide text-ink-soft">{f.role}</span>
                  <span className="font-medium">{f.name}</span>
                  <span className="text-small text-ink-soft">{f.meta}</span>
                </div>
              ))}
            </div>
            <div className="rounded-soft bg-sand px-6 py-5">
              <p className="font-serif text-h3 italic">çğıöşü ÇĞİÖŞÜ</p>
              <p className="mt-1 text-small text-ink-soft">Her iki aile de Türkçe karakterleri kapsar.</p>
            </div>
          </SoftCard>

          <SoftCard as="div" blur="none" elevation="soft" className="lg:col-span-7">
            <ol className="flex flex-col">
              {TYPE_SCALE.map((t) => (
                <li key={t.token} className="grid grid-cols-[72px_1fr] gap-4 border-t border-line py-5 first:border-t-0 first:pt-0">
                  <span className="flex flex-col leading-snug">
                    <span className="font-serif text-lead tabular-nums">{t.size}</span>
                    <span className="text-caption text-ink-soft" lang="en">
                      {t.token}
                    </span>
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className={t.className} style={{ overflowWrap: 'anywhere' }}>
                      {t.sample}
                    </span>
                    <span className="text-caption text-ink-soft">{t.face}</span>
                  </span>
                </li>
              ))}
            </ol>
          </SoftCard>
        </div>

        <article className="mt-6 grid gap-8 rounded-card bg-sand px-7 py-6 md:grid-cols-12 md:px-12 md:py-10">
          <p className="text-caption font-medium tracking-wide text-ink-soft md:col-span-3">Örnek · Yaşam tarzı blogu</p>
          <div className="md:col-span-8">
            <h3 className="text-h2">Yavaş yaşamın küçük ritüelleri</h3>
            <p className="mt-6 max-w-[60ch] text-lead">
              Sabah ilk ışıkta pencereyi aralamak, çayın demlenmesini beklemek, masayı yalnızca bugün gerekenlerle
              kurmak. Ritüel, günü küçük ve anlaşılır parçalara böler.
            </p>
            <p className="mt-4 max-w-[60ch] text-ink-soft">
              Satır aralığı 1,8, satır uzunluğu 60 karakter civarında. Paragraflar arasında 16px, başlık ile metin arasında
              24px boşluk bırakılır.
            </p>
          </div>
        </article>
      </div>
    </FadeSection>
  )
}
