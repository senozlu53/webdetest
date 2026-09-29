import type { CSSProperties } from 'react'
import { ILKELER } from '../lib/data'
import { Ikon } from '../components/Ikon'
import { Kod, Section } from '../components/ui'
import { Belir } from '../components/Belir'
import { Enso, WabiContainer, WabiLink, Yer, ZenHero } from '../components/Wabi'

const PROMPT = 'Wabi-sabi UI design, natural minimalism, imperfect rustic texture, raw stone color #E8E4DF, asymmetrical calm layout, meditative emptiness.'

export function Hero() {
  return (
    <section id="ust" aria-labelledby="ust-baslik">
      <ZenHero odak="vazo" sir="yaprak" tohum={7} no="07" etiket="Kurumuş yaprak sırlı vazo ve tek kuru dal" baslik="Kül damlalı vazo, odun fırını, 32 cm" boy={330}>
        <Belir sure={3200}>
          <p className="kicker">
            Stil 033 · <span lang="en">Organic / Natural</span>
          </p>
          <h1 id="ust-baslik" className="baslik mt-9 text-[clamp(54px,9vw,148px)] leading-[0.98] tracking-[0.005em]">
            Kusurlu olan, <span className="vurgu">tamamdır.</span>
          </h1>
          <p className="mt-10 max-w-[38ch] text-[clamp(17px,1.4vw,20px)] text-soluk">Sükun; bir seramik atölyesi ve bir sessizlik odası. Her parça bir kez yapılır ve bir daha yapılamaz.</p>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
            <WabiLink href="#atolye" ton="mat" ikon={<Ikon ad="ok" boyut={16} />}>
              Parçalara bak
            </WabiLink>
            <WabiLink href="#zen" ton="metin">
              Sessizlik odası
            </WabiLink>
          </div>
        </Belir>
      </ZenHero>
    </section>
  )
}

export function Felsefe() {
  return (
    <Section
      id="felsefe"
      no="01"
      madde="Madde 1 · 2 · 3 · Stil ve karakter"
      duzen={0}
      title={
        <>
          Eksik olanın <span className="vurgu">güzelliği</span>
        </>
      }
      lead="Wabi-sabi, kusurlu, yıpranmış ve tamamlanmamış olanda güzellik görür. Bu stil onu ekrana taşır: simetriden kaçınır, ham yüzeyi gizlemez, hiçbir şeyi acele ettirmez."
    >
      <WabiContainer>
        <Yer b={2} s={4} ind={0} ust={0}>
          <Belir>
            <dl className="m-0 grid grid-cols-1 gap-10" data-stil-bilgi="">
              <div>
                <dt className="kicker">Madde 1 · Stil adı</dt>
                <dd className="baslik mt-3 text-[clamp(28px,2.6vw,38px)]">
                  <span lang="en">Natural Minimalism</span> <span className="vurgu">(Wabi-Sabi Digital)</span>
                </dd>
              </div>
              <div>
                <dt className="kicker">Kategori</dt>
                <dd className="mt-3 text-[18px]">
                  <span lang="en">Organic / Natural</span>: ham, işlenmemiş ve son derece sakin
                </dd>
              </div>
              <div>
                <dt className="kicker">Madde 2 · Görsel referans</dt>
                <dd className="mt-3 text-[17px] text-soluk">Asimetrik olarak yerleştirilmiş tek bir seramik vazo, ham taş rengi zemin, kusursuz olmayan ince çizgiler.</dd>
              </div>
            </dl>
            <p className="kicker mt-12 mb-3">Prompt</p>
            <Kod label="Referans prompt" className="!text-[13px]">
              {PROMPT}
            </Kod>
          </Belir>
        </Yer>
        <Yer b={7} s={5} ind={6} ust={6}>
          <ol className="m-0 grid list-none grid-cols-1 gap-[clamp(40px,5vw,72px)] p-0" data-ilkeler="">
            {ILKELER.map((i, n) => (
              <Belir key={i.ad} as="li" gecikme={n * 240}>
                <div style={{ ['--ind' as string]: [0, 14, 5, 20, 9][n] } as CSSProperties} className="kayik">
                  <p className="kicker flex items-baseline gap-4">
                    <span className="rakam text-[15px] tracking-[0.1em]">{String(n + 1).padStart(2, '0')}</span>
                    <span lang="ja-Latn" className="italic tracking-[0.2em] normal-case">
                      {i.japonca}
                    </span>
                  </p>
                  <h3 className="baslik mt-3 text-[clamp(28px,2.7vw,40px)]">{i.ad}</h3>
                  <p className="mt-3 max-w-[46ch] text-[16.5px] text-soluk">{i.metin}</p>
                </div>
              </Belir>
            ))}
          </ol>
        </Yer>
        <Yer b={2} s={2} ind={0} ust={4} className="mt-[clamp(48px,7vw,120px)]">
          <Enso boyut={110} tohum={12} kalin={8} />
        </Yer>
      </WabiContainer>
    </Section>
  )
}
