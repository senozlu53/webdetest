import { CloudCard } from '../components/CloudCard'
import { KawaiiButton } from '../components/KawaiiButton'
import { KawaiiProgress } from '../components/KawaiiProgress'
import { LottieMascot } from '../components/LottieMascot'
import { Mascot } from '../components/Mascot'
import { Ikon, Kaomoji } from '../components/Icons'
import { Section } from '../components/ui'

const git = (id: string) => document.getElementById(id)?.scrollIntoView()

/** Madde 1 · 2: bulut, pastel, gülen maskot, hatmi düğmeler */
export function Hero() {
  return (
    <section id="ust" aria-labelledby="baslik" className="relative mx-auto w-full max-w-[1200px] px-4 pt-10 pb-6 md:px-8 md:pt-16">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div className="min-w-0">
          <p className="kicker inline-flex items-center gap-2 rounded-bubble bg-mint px-4 py-1.5 shadow-[var(--sh-mint)]">
            <Ikon ad="yildiz" boyut={22} /> Stil 024 · Colorful / Pop / Playful
          </p>
          <h1 id="baslik" className="mt-6 text-[clamp(52px,9vw,112px)] leading-[0.95] [overflow-wrap:anywhere]">
            <span className="block" data-giris="1">
              Pamuk gibi
            </span>
            <span className="block text-[0.62em]" data-giris="1" style={{ ['--gecik' as string]: '120ms' }}>
              yumuşacık öğren
            </span>
          </h1>
          <p className="mt-7 max-w-[44ch] text-[20px]">
            <span lang="ja-Latn">Kawaii</span>: Japon popüler kültürünün "sevimli" estetiği. Pamuk, 5–9 yaş için kurgu bir öğrenme uygulaması: sayı bahçesi, dil dersi, hafıza oyunu ve evcil dostu Pofuduk.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <KawaiiButton boy="b" lottie="yildiz" onClick={() => git('dil')}>
              Derse başla
            </KawaiiButton>
            <KawaiiButton boy="b" renk="mint" lottie="kalp" onClick={() => git('pofuduk')}>
              Pofuduk'u besle
            </KawaiiButton>
          </div>
        </div>
        <div className="relative min-w-0">
          <CloudCard renk="paper" className="mx-auto max-w-[460px] px-6 pt-8 pb-7 md:px-8" data-giris="1" style={{ ['--gecik' as string]: '200ms' }}>
            <div className="flex flex-wrap items-center gap-x-4">
              <LottieMascot ruh="mutlu" renk="peach" boyut={116} etiket="Mutlu maskot Mochi zıplıyor" className="-my-3 -ml-3" />
              <div className="min-w-0">
                <p className="font-display text-[26px] font-extrabold">Günaydın Ada!</p>
                <p className="text-[16px] text-muted">Mochi seni bekliyordu.</p>
              </div>
            </div>
            <KawaiiProgress className="mt-5" etiket="Günlük hedef" deger={3} max={5} birim={(d, m) => `${d} / ${m} ders`} />
            <ul className="m-0 mt-6 grid list-none grid-cols-3 gap-3 p-0 text-center">
              {[
                ['ates', '12', 'gün seri'],
                ['yildiz', '340', 'yıldız'],
                ['kalp', '5', 'can'],
              ].map(([i, s, a]) => (
                <li key={a} className="grid justify-items-center gap-1 rounded-[24px] bg-cream px-2 py-3">
                  <Ikon ad={i as 'ates'} boyut={34} />
                  <span className="font-display text-[22px] leading-none font-extrabold tabular-nums">{s}</span>
                  <span className="text-[14px] text-muted">{a}</span>
                </li>
              ))}
            </ul>
          </CloudCard>
          <div className="suzul pointer-events-none absolute -top-2 -left-2 hidden md:block" aria-hidden="true">
            <Ikon ad="bulut" boyut={64} />
          </div>
          <div className="suzul pointer-events-none absolute -right-1 bottom-4 hidden [animation-delay:-2s] md:block" aria-hidden="true">
            <Ikon ad="cicek" boyut={56} />
          </div>
        </div>
      </div>
    </section>
  )
}

const KURALLAR = [
  {
    renk: 'mint' as const,
    ruh: 'mutlu' as const,
    baslik: 'Arkadaş canlısı',
    metin: 'Her ekranda seni karşılayan bir yüz var. Metin "sen" diye konuşur, emir vermez, cesaretlendirir.',
  },
  {
    renk: 'peach' as const,
    ruh: 'heyecanli' as const,
    baslik: 'Aşırı sevimli',
    metin: (
      <>
        Büyük gözler, pembe yanaklar, küçük gülüş <Kaomoji />. İkonların bile yüzü var.
      </>
    ),
  },
  {
    renk: 'salmon' as const,
    ruh: 'saskin' as const,
    baslik: 'Yumuşak ve yuvarlak',
    metin: 'Tek bir sivri köşe yok. Kartlar bulut, düğmeler hap, çubuklar şeker.',
  },
  {
    renk: 'rose' as const,
    ruh: 'uykulu' as const,
    baslik: 'Tehlikesiz',
    metin: 'Kırmızı alarm, siyah metin, sert gölge yok. Hata bile üzgün ama sakin bir maskotla gelir.',
  },
]

/** Madde 3: dört karakteristik */
export function Karakter() {
  return (
    <Section id="karakter" madde="Madde 3 · Karakteristikler" title="Dört sıcak his" lead="Kawaii bir süs değil, bir ses tonu: arayüz çocuğa hiç korkutmadan, sabırla ve neşeyle eşlik eder.">
      <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-12 p-0 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {KURALLAR.map((k, i) => (
          <CloudCard as="li" key={k.baslik} renk={k.renk} className="px-6 pt-10 pb-7" maskot={<Mascot ruh={k.ruh} renk="paper" boyut={70} />} data-giris="1" style={{ ['--gecik' as string]: `${i * 90}ms` }}>
            <h3 className="text-[28px]">{k.baslik}</h3>
            <p className="mt-3 text-[16px]">{k.metin}</p>
          </CloudCard>
        ))}
      </ul>
    </Section>
  )
}
