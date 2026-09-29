import { KahramanFincan, Sus } from '../components/Doodles'
import { Ikon, type IkonAd } from '../components/Icons'
import { Not } from '../components/Not'
import { RoughBox } from '../components/Rough'
import { RoughButton } from '../components/Controls'
import { Section } from '../components/ui'

const git = (id: string) => document.getElementById(id)?.scrollIntoView()

/** Madde 1 · 2: kurşun kalem fincan, kırmızı kalem altı çizili başlık, kenar notları */
export function Hero() {
  return (
    <section id="ust" aria-labelledby="baslik" className="relative mx-auto w-full max-w-[1200px] px-4 pt-10 pb-6 md:px-8 md:pt-16">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="min-w-0">
          <p className="kicker">Stil 025 · Illustration / Handcraft</p>
          <h1 id="baslik" className="mt-4 text-[clamp(84px,14vw,190px)] leading-[0.95]">
            <span className="block">
              <Not tur="underline" sure={900} sw={3.5} pad={0} gecikme={300}>
                Kırık
              </Not>
            </span>
            <span className="block">Fincan</span>
          </h1>
          <p className="mt-6 -rotate-1 font-not text-[clamp(24px,3vw,34px)] leading-tight text-murekkep">butik kahve &amp; defter atölyesi</p>
          <p className="mt-6 max-w-[46ch] text-[19px]">Her fincan, elle çizilmiş bir sayfa gibi: ölçüsüz, biraz kusurlu, tam bu yüzden sıcak. Menüyü karalıyoruz, siparişi deftere yazıyoruz; yazılım tarafı da Ece'nin kalemiyle.</p>
          <div className="mt-8 flex flex-wrap gap-5">
            <RoughButton tur="murekkep" boy="b" ikon={<Ikon ad="fincan" boyut={30} renk="#f9f6f0" />} onClick={() => git('menu')}>
              Menüye bak
            </RoughButton>
            <RoughButton boy="b" ikon={<Ikon ad="kalem" boyut={30} />} onClick={() => git('form')}>
              Deftere yaz
            </RoughButton>
          </div>
        </div>
        <div className="relative min-w-0">
          <RoughBox className="tarama tarama-mavi px-6 pt-8 pb-6" tohum={7} kare={3} sekil="yuvarlak" r={18} cizgi={2.6} data-hero-kart="">
            <KahramanFincan />
            <p className="mt-2 flex items-center justify-between gap-3 font-not text-[24px] leading-tight text-murekkep">
              <span>bugünün filtresi: Guji</span>
              <span className="text-kirmiziK">85 TL</span>
            </p>
          </RoughBox>
          <Sus tur="ok" className="absolute -top-8 -left-10 hidden rotate-[-8deg] md:block" boyut={84} />
          <p className="absolute -top-14 -left-2 hidden -rotate-6 font-not text-[24px] text-komur md:block" aria-hidden="true">
            yeni çekirdek!
          </p>
          <Sus tur="yildiz" className="absolute -right-4 -bottom-6 hidden md:block" boyut={54} />
        </div>
      </div>
    </section>
  )
}

const KURALLAR: { ikon: IkonAd; baslik: string; metin: string }[] = [
  { ikon: 'kalem', baslik: 'Kusurlu çizgi', metin: 'Hiçbir çizgi düz değil. Köşeler tam kapanmaz, ucu bir taşar; cetvel yok, el var.' },
  { ikon: 'kalp', baslik: 'İnsan dokunuşu', metin: 'Bir insan çizmiş gibi: aynı düğme iki kez aynı çizilmez, üstüne gelince yeniden çizilir.' },
  { ikon: 'yaprak', baslik: 'Organik form', metin: 'Yuvarlaklık daireden değil, elin dönüşünden. Şekiller hafif eğri, hafif asimetrik.' },
  { ikon: 'zarf', baslik: 'Samimi dil', metin: '"Merhaba" değil "günaydın"; hata da azarlamaz, kenara kırmızı kalemle not düşer.' },
]

/** Madde 3: dört karakteristik */
export function Karakter() {
  return (
    <Section id="karakter" madde="Madde 3 · Karakteristikler" title="Dört kalem izi" lead="El çizimi bir süs değil, bir ses tonu: arayüz karşındakine kâğıt ve kalemle konuşur. Gövde yazısı ise hep okunaklı kalır; el yazısı yalnız başlıkta.">
      <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {KURALLAR.map((k, i) => (
          <RoughBox as="li" key={k.baslik} tohum={10 + i * 5} kare={3} sekil="yuvarlak" r={16} cizgi={2.2} className={`tarama ${i % 2 ? 'tarama-kirmizi' : 'tarama-mavi'} p-6`}>
            <Ikon ad={k.ikon} boyut={46} titre />
            <h3 className="mt-4 text-[40px]">{k.baslik}</h3>
            <p className="mt-3 text-[17px]">{k.metin}</p>
          </RoughBox>
        ))}
      </ul>
    </Section>
  )
}
