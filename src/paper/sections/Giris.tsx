import { Kesik } from '../components/Kesik'
import { PaperButton, PaperCard } from '../components/Paper'
import { Sahne, useParalaks } from '../components/Diorama'
import { Section } from '../components/ui'
import { usePaper } from '../lib/store'
import type { SimgeAd } from '../lib/simge'

const git = (id: string) => document.getElementById(id)?.scrollIntoView()

/** Madde 1 · 2 · 11: üst üste binen çok katmanlı kahraman. Katmanlar kaydırınca farklı hızda hareket eder */
export function Hero() {
  const { derinlik, hareket, genislik } = usePaper()
  const ref = useParalaks<HTMLDivElement>('ust', hareket)
  return (
    <section id="ust" aria-labelledby="baslik" className="mx-auto w-full max-w-[1240px] px-3 pt-4 pb-6 md:px-6 md:pt-6">
      <PaperCard nivel={5} renk="var(--gokyuzu)" tohum={3} r={34} dalga={6} adim={150} yuzClass="relative overflow-hidden" data-hero="">
        <div ref={ref} className="relative h-[clamp(600px,90vh,780px)] overflow-hidden" data-derinlik={derinlik}>
          <Sahne derinlik={derinlik} kucuk={genislik < 640} />
          <div className="relative z-[20] px-5 pt-8 md:px-10 md:pt-12">
            <p className="etiket inline-block rounded-md bg-krem px-3 py-1">Stil 026 · Illustration / Handcraft</p>
            <h1 id="baslik" className="kesik-yazi mt-4 text-[clamp(60px,11vw,150px)] leading-[0.95]">
              Kâğıt
              <br />
              Orman
            </h1>
          </div>
          <div className="absolute right-3 bottom-5 left-3 z-[30] md:right-auto md:bottom-8 md:left-10 md:w-[min(560px,52%)]">
            <PaperCard nivel={5} duz tohum={17} r={22} dalga={3} yuzClass="p-6 md:p-7">
              <p className="text-[19px] leading-[1.6]">Geri dönüşümlü kâğıttan, makasla kesilmiş çocuk kitapları ve kırtasiye. Sayfayı kaydır: gökyüzü, dağlar, tepeler ve ön plan aynı anda ama farklı hızlarda hareket eder.</p>
              <div className="mt-5 flex flex-wrap gap-4">
                <PaperButton renk="var(--gunes)" boy="b" ikon={<Kesik ad="kitap" boyut={30} nivel={1} halo={false} />} onClick={() => git('hikaye')}>
                  Hikâyeyi oku
                </PaperButton>
                <PaperButton renk="var(--yaprak)" boy="b" onClick={() => git('dukkan')}>
                  Dükkân
                </PaperButton>
              </div>
            </PaperCard>
          </div>
        </div>
      </PaperCard>
    </section>
  )
}

const KURALLAR: { simge: SimgeAd; renk: string; baslik: string; metin: string }[] = [
  { simge: 'kutu', renk: 'var(--gunes)', baslik: 'Fiziksel katman', metin: 'Her yüzey gerçek bir kâğıt parçası: kalınlığı, kenarı ve altındaki kâğıda düşen gölgesi var.' },
  { simge: 'dag', renk: 'var(--turkuaz)', baslik: 'Net gölge', metin: 'Gölgenin bir sert, bir yumuşak katmanı var. Sert olan kenarı, yumuşak olan yüksekliği anlatır.' },
  { simge: 'yaprak', renk: 'var(--yaprak)', baslik: 'Topografik yapı', metin: 'Tepeler, nehirler, dağlar üst üste kesilmiş haritalar gibi: her yükselti ayrı bir kâğıt.' },
  { simge: 'sepet', renk: 'var(--pembe)', baslik: 'El işi', metin: 'Düz çizgi yok. Kenarlar makas izi taşır, delikler zımbayla açılmış kusursuz daire.' },
]

/** Madde 3: dört karakteristik */
export function Karakter() {
  return (
    <Section id="karakter" madde="Madde 3 · Karakteristikler" renk="var(--turkuaz)" title="Dört kâğıt kat" lead="Ekran değil, masa: her şey bir sayfanın üstüne konmuş başka bir sayfa. Metinse hep en üstteki pürüzsüz krem kâğıtta durur.">
      <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2 xl:grid-cols-4">
        {KURALLAR.map((k, i) => (
          <PaperCard as="li" key={k.baslik} nivel={3} duz tohum={20 + i * 3} r={20} dalga={3} adim={100} yuzClass="p-6">
            <span className="mb-4 grid size-20 place-items-center" style={{ background: k.renk, borderRadius: '50%' }}>
              <Kesik ad={k.simge} boyut={54} nivel={2} />
            </span>
            <h3 className="text-[30px] [overflow-wrap:anywhere]">{k.baslik}</h3>
            <p className="mt-3 text-[16px] font-medium">{k.metin}</p>
          </PaperCard>
        ))}
      </ul>
    </Section>
  )
}
