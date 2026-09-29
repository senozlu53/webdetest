import { oran } from '../lib/contrast'
import { KARAKTER } from '../lib/data'
import { useBiophilic } from '../lib/store'
import { MODLAR, saatMetni } from '../lib/zaman'
import { ZamanSahnesi } from '../components/Ambient'
import { BiophilicCard, BioLink } from '../components/Biophilic'
import { Bitki } from '../components/Bitki'
import { ZamanKontrol } from '../components/Header'
import { Ikon } from '../components/Ikon'
import { Belir, Kod, Section } from '../components/ui'

const PROMPT = 'Biophilic UI design, living interface, natural sunlight simulation, forest green and sky blue, organic blur, breathable layout, wellness architecture.'

export function Hero() {
  const { saat, mod, palet } = useBiophilic()
  return (
    <section id="ust" className="mx-auto w-full max-w-[1240px] scroll-mt-20 px-5 pt-8 pb-6 sm:px-8 lg:px-12" aria-labelledby="ust-baslik">
      <div className="grid grid-cols-1 items-center gap-x-10 gap-y-8 lg:grid-cols-12">
        <Belir className="min-w-0 lg:col-span-7">
          <div className="cam p-7 sm:p-11" data-hero="">
            <p className="kicker">
              Stil 032 · <span lang="en">Organic / Natural</span>
            </p>
            <h1 id="ust-baslik" className="baslik mt-5 text-[clamp(42px,6.4vw,84px)] leading-[1.02] font-light tracking-[-0.03em]">
              Ekranınızda bir <span className="vurgu font-medium">gün doğar.</span>
            </h1>
            <p className="mt-6 max-w-[54ch] text-[clamp(18px,1.5vw,21px)] text-soluk">Ferah, günün saatini okuyan bir arayüz. Gökyüzü, güneş, yaprak ve su arka planda yaşar; içerik yarı saydam cam panellerde, boşluğuyla birlikte nefes alır.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <BioLink href="#nefes" boy="b" ikon={<Ikon ad="nefes" boyut={24} />}>
                Nefes egzersizini dene
              </BioLink>
              <BioLink href="#gun-dongusu" ton="gunes" boy="b" ikon={<Ikon ad="gunes" boyut={24} />}>
                Gün ışığını değiştir
              </BioLink>
            </div>
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15.5px] text-soluk" data-hero-durum={`${mod}`}>
              <Ikon ad={palet.gunes.gunduz ? 'gunes' : 'ay'} boyut={20} />
              <span>
                <b className="rakam text-metin">{saatMetni(saat)}</b> · {MODLAR[mod].ad}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                cam <b className="text-metin">%{Math.round(palet.cam.alfa * 100)}</b>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                yazı <b className="text-metin">{oran(palet.cam.oran)}</b>
              </span>
            </p>
          </div>
        </Belir>
        <Belir className="min-w-0 lg:col-span-5" gecikme={200}>
          <ZamanSahnesi className="mx-auto aspect-[4/5] w-full max-w-[440px] !rounded-[999px_999px_2.6rem_2.6rem] border border-[var(--cam-kenar)]" style={{ boxShadow: 'var(--golge-3)' }} icKlas="relative z-10 h-full" data-canli-pencere="">
            <Bitki tur="monstera" className="absolute bottom-[7%] left-1/2 w-[78%] -translate-x-1/2" etiket="Canlı pencerede deve tabanı bitkisi" />
            <p className="cam cam-opak absolute top-[6%] left-1/2 -translate-x-1/2 !rounded-full px-5 py-2 text-[15px] font-medium whitespace-nowrap">
              <span className="rakam">{saatMetni(saat)}</span> · {MODLAR[mod].ad}
            </p>
          </ZamanSahnesi>
        </Belir>
      </div>
      <Belir className="mt-10" gecikme={100}>
        <div id="gun-dongusu" className="cam scroll-mt-24 p-6 sm:p-9" data-gun-dongusu="">
          <div className="grid grid-cols-1 items-center gap-x-12 gap-y-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="baslik text-[clamp(26px,2.6vw,34px)]">Gün döngüsü</h2>
              <p className="mt-2 text-[16.5px] text-soluk">Saati sürükleyin. Gökyüzü, güneşin konumu, bitki tonları, cam opaklığı ve gölgenin yönü birlikte, yaklaşık 1 saniyede yumuşakça değişir.</p>
            </div>
            <div className="min-w-0 lg:col-span-8">
              <ZamanKontrol onek="hd-" />
            </div>
          </div>
        </div>
      </Belir>
    </section>
  )
}

export function Karakter() {
  return (
    <Section
      id="karakter"
      ikon="yaprak"
      madde="Madde 1 · 2 · 3 · Stil ve karakter"
      title={
        <>
          Bir arayüz, <span className="vurgu">canlı bir oda</span> gibi
        </>
      }
      lead="Biofilik tasarım, doğal ışığı, bitki örtüsünü ve su hareketini mekâna taşıyarak insanı rahatlatır. Bu stil aynı ilkeleri ekrana uygular: hızlı olmaz, bağırmaz; günün ritmine ve nefese uyar."
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <div className="cam p-7 sm:p-9" data-stil-bilgi="">
            <dl className="m-0 grid grid-cols-1 gap-6">
              <div>
                <dt className="kicker">Madde 1 · Stil adı</dt>
                <dd className="baslik mt-1 text-[clamp(26px,2.6vw,34px)]">
                  <span lang="en">Biophilic Design</span> <span className="vurgu">(Living UI)</span>
                </dd>
              </div>
              <div>
                <dt className="kicker">Kategori</dt>
                <dd className="mt-1 text-[18px]">
                  <span lang="en">Organic / Natural</span> — doğal ışık, bitki, su ve organik ritim
                </dd>
              </div>
              <div>
                <dt className="kicker">Madde 2 · Görsel referans</dt>
                <dd className="mt-1 text-[17px] text-soluk">Canlı bitki görselleriyle bütünleşen yarı saydam cam paneller; günün saatine göre renk değiştiren adaptif zeminler.</dd>
              </div>
            </dl>
            <p className="kicker mt-7 mb-2">Prompt</p>
            <Kod label="Referans prompt" className="!text-[13.5px]">
              {PROMPT}
            </Kod>
          </div>
        </div>
        <ul className="m-0 grid min-w-0 list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:col-span-7" data-karakter="">
          {KARAKTER.map((k, i) => (
            <Belir key={k.baslik} as="li" gecikme={i * 120} className="flex">
              <BiophilicCard className="w-full" ikon={k.ikon} kicker={k.olcu} baslik={k.baslik} nefes={i === 0}>
                <p className="text-[16.5px] text-soluk">{k.metin}</p>
              </BiophilicCard>
            </Belir>
          ))}
        </ul>
      </div>
    </Section>
  )
}
