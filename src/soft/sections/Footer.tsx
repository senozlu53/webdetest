import { FadeSection } from '../components/FadeSection'
import { ROOTS } from '../content'

export function Footer() {
  return (
    <FadeSection as="footer" id="kokler" className="pt-24 pb-16 md:pt-32">
      <div className="soft-frame">
        <div className="rounded-[40px] bg-sand px-7 py-12 md:px-12 md:py-16">
          <p className="soft-eyebrow bg-canvas">Kökler</p>
          <h2 className="mt-6 max-w-[20ch] text-h2">
            Japon sadeliği ile İskandinav <em className="text-gold-deep">sıcaklığı</em>
          </h2>
          <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ROOTS.map((r) => (
              <div key={r.term} className="flex flex-col gap-2">
                <dt>
                  <span className="font-serif text-h3 italic" lang={r.origin === 'Japonya' ? 'ja-Latn' : undefined}>
                    {r.term}
                  </span>
                  <span className="block text-small text-ink-soft">{r.origin}</span>
                </dt>
                <dd className="text-ink-soft">{r.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 flex flex-col gap-4 px-2 text-small text-ink-soft md:flex-row md:items-center md:justify-between">
          <p className="max-w-[70ch]">
            Stil 002 · Soft Minimalism. Başlık: Lora. Gövde: Plus Jakarta Sans. Tokenlar: <code>tokens/soft.tokens.json</code>.
          </p>
          <nav aria-label="Diğer stiller" className="flex gap-6">
            <a href="../../" className="soft-link">
              Tüm stiller
            </a>
            <a href="../001/" className="soft-link">
              Stil 001 · <span lang="en">Swiss Style</span>
            </a>
            <a href="#ust" className="soft-link">
              Başa dön
            </a>
          </nav>
        </div>
      </div>
    </FadeSection>
  )
}
