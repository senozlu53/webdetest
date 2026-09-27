import { Assistant } from '../components/Assistant'
import { SCENARIOS } from '../lib/scenarios'

/** Madde 2 · 10: sabit ekran yok; arayüz soruya göre üretilir */
export function Hero() {
  return (
    <section id="ust" className="px-4 pt-10 pb-16 md:px-6 md:pt-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-sans text-[13px] font-medium text-muted">
            <span className="rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 text-accent-ink">Stil 013</span> · <span lang="en">AI-Native Design</span>
          </p>
          <h1 className="mt-4 font-sans text-[38px] leading-[1.08] font-semibold tracking-tight md:text-[52px]">Önceden çizilmemiş arayüz</h1>
          <p className="mt-5 max-w-[46ch] font-serif text-[19px] leading-relaxed text-muted">
            Ekranlar sabit değil: kullanıcı sorar, yapay zekâ araç çağırır ve arayüz yanıtla birlikte o an kurulur. Tablo gerekiyorsa tablo, form gerekiyorsa form belirir; gerekmiyorsa hiçbir şey.
          </p>
          <dl className="mt-8 grid max-w-md grid-cols-2 gap-3 font-sans text-[14px]">
            {SCENARIOS.map((s) => (
              <div key={s.id} className="rounded-md border border-line bg-surface px-3 py-2">
                <dt className="font-medium">{s.kullanim}</dt>
                <dd className="text-[13px] text-muted">
                  {s.id === 'ara' ? 'kaynak, tablo, grafik' : s.id === 'dokuman' ? 'dosya, kod, tablo' : s.id === 'copilot' ? 'test, yama' : 'takvim, form'}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-[46ch] font-sans text-[13px] text-muted">
            Bu bir tanıtım: model çalışmaz, akış kurgulanmıştır. Arama ve doküman yanıtları bu deponun gerçek dosyalarına dayanır; kod ve takvim örnektir.
          </p>
        </div>
        <div id="asistan" className="min-w-0 scroll-mt-20" aria-labelledby="asistan-h">
          <h2 id="asistan-h" className="sr-only">
            Asistan
          </h2>
          <Assistant autoStart={SCENARIOS[0].chip} />
        </div>
      </div>
    </section>
  )
}
