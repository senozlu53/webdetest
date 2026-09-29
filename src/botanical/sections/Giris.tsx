import { Belir, Section } from '../components/ui'
import { BotanicalCard, Dal, EcoButton, MaskeliGorsel } from '../components/Botanical'
import { Ikon } from '../components/Ikon'
import type { SimgeAd } from '../lib/simge'

const git = (id: string) => document.getElementById(id)?.scrollIntoView()

const GERCEKLER: { ikon: SimgeAd; ad: string }[] = [
  { ikon: 'kalkan', ad: 'Organik sertifikalı' },
  { ikon: 'dongu', ad: 'Sıfır plastik, dolumlu' },
  { ikon: 'agac', ad: '37 yerel üretici' },
]

/** Madde 1 · 2 · 11: büyük başlık, yaprak / taş / damla maskeli üç görsel ve rüzgârda sallanan dallar */
export function Hero() {
  return (
    <section id="ust" aria-labelledby="baslik" className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12" style={{ paddingTop: 'clamp(24px, 4vw, 56px)', paddingBottom: 'var(--bolum)' }}>
      <div className="grid grid-cols-1 items-center gap-x-10 gap-y-12 lg:grid-cols-12">
        <Belir sure={2000} className="min-w-0 lg:col-span-6">
          <p className="kicker">
            Stil 031 · <span lang="en">Botanical / Earthy</span>
          </p>
          <h1 id="baslik" className="baslik mt-5 text-[clamp(40px,6.2vw,88px)]">
            Toprak, su ve <span className="vurgu">biraz sabır.</span>
          </h1>
          <p className="mt-6 max-w-[46ch] text-[clamp(18px,1.6vw,21px)] text-soluk">Fidan, küçük üreticilerin organik zeytinyağı, bal, ot ve sabununu kraft kâğıda sarıp kapınıza getiriyor. Bu sayfa da aynı sözü tutar: yumuşak formlar, toprak tonları, gürültüsüz bir düzen.</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <EcoButton ton="kil" boy="b" onClick={() => git('pazar')} ikon={<Ikon ad="ok" boyut={24} />}>
              Pazara göz at
            </EcoButton>
            <EcoButton ton="metin" onClick={() => git('tarim')} ikon={<Ikon ad="filiz" boyut={22} />}>
              Nasıl yetişiyor?
            </EcoButton>
          </div>
          <ul className="m-0 mt-10 flex list-none flex-wrap gap-x-6 gap-y-3 p-0" data-gercekler="">
            {GERCEKLER.map((g) => (
              <li key={g.ad} className="flex items-center gap-2.5 text-[16px] font-semibold">
                <span className="grid size-10 place-items-center bg-zeytin-ton text-zeytin-yazi" style={{ borderRadius: 'var(--r-tas)' }} aria-hidden="true">
                  <Ikon ad={g.ikon} boyut={22} />
                </span>
                {g.ad}
              </li>
            ))}
          </ul>
        </Belir>
        <Belir sure={2400} gecikme={200} className="min-w-0 lg:col-span-6">
          <div className="relative mx-auto w-full max-w-[560px]" style={{ aspectRatio: '1 / 1.06' }} data-hero-kolaj="">
            <div className="absolute inset-[6%_2%_4%_8%] bg-toprak-ton" style={{ borderRadius: 'var(--r-tas)', transform: 'rotate(-4deg)' }} aria-hidden="true" />
            <div className="absolute inset-[2%_6%_10%_20%] bg-zeytin-ton" style={{ borderRadius: '42% 58% 48% 52% / 56% 44% 56% 44%', transform: 'rotate(5deg)' }} aria-hidden="true" />
            <div className="absolute top-[2%] right-[4%] w-[66%]" style={{ filter: 'drop-shadow(0 10px 26px rgb(var(--golge-rgb) / 0.14))' }}>
              <MaskeliGorsel sahne="zeytin" maske="yaprak" oran="4 / 5" tohum={2} etiket="Zeytin dalı illüstrasyonu" />
            </div>
            <div className="absolute bottom-[4%] left-[2%] w-[46%]" style={{ filter: 'drop-shadow(0 8px 22px rgb(var(--golge-rgb) / 0.14))' }}>
              <MaskeliGorsel sahne="bal" maske="tas" oran="1 / 1" tohum={4} etiket="Çiçek balı illüstrasyonu" />
            </div>
            <div className="absolute right-[2%] bottom-[8%] w-[34%]" style={{ filter: 'drop-shadow(0 8px 20px rgb(var(--golge-rgb) / 0.14))' }}>
              <MaskeliGorsel sahne="sabun" maske="damla" oran="4 / 5" tohum={6} etiket="Zeytin sabunu illüstrasyonu" />
            </div>
            <Dal boy={120} yaprak={7} className="pointer-events-none absolute -bottom-2 left-[38%]" palet="zeytin" />
            <Dal boy={96} yaprak={6} yon={-1} palet="kil" gecikme={1.2} className="pointer-events-none absolute top-[0%] left-[2%]" />
          </div>
        </Belir>
      </div>
    </section>
  )
}

/* ───────────────────────── Madde 3 · karakteristikler ───────────────────────── */

const KARAKTERLER: { ikon: SimgeAd; baslik: string; metin: string; maske: 'yaprak' | 'damla' | 'tas' | 'dalga'; ton: 'kil' | 'zeytin' | 'toprak' | 'orman' }[] = [
  { ikon: 'toprak', baslik: 'Toprak tonları', metin: 'Terracotta, zeytin, bej ve orman yeşili aynı ailenin farklı ışıkları. Her tonun beş basamağı var; katmanlar arasındaki fark ton sür ton.', maske: 'yaprak', ton: 'kil' },
  { ikon: 'dongu', baslik: 'Sürdürülebilirlik hissi', metin: 'Az ama uzun ömürlü: kraft kâğıt, cam şişe, dolum. Arayüz de aynı şeyi yapar; gereksiz süs, ağır animasyon ve sert kontrast yok.', maske: 'tas', ton: 'zeytin' },
  { ikon: 'yaprak', baslik: 'Organik ve yumuşak formlar', metin: 'Köşeler asimetrik: biri yaprak gibi geniş, biri taş gibi yuvarlak. Hover’da form yavaşça başka bir taşa dönüşür.', maske: 'damla', ton: 'toprak' },
  { ikon: 'ari', baslik: 'Doğa dostu görsel dil', metin: 'Fotoğraf yerine elle kurgulanmış, düz ve tonlu illüstrasyonlar. Çizgi yok, yalnız aynı renk ailesinden yumuşak şekiller.', maske: 'yaprak', ton: 'orman' },
]

/** Madde 3: dört karakteristik, kaydırılmış (masonry) yerleşimde */
export function Karakter() {
  return (
    <Section
      id="ilke"
      ikon="tohum"
      madde="Madde 3 · Karakteristikler"
      title={
        <>
          Dört <span className="vurgu">sakin</span> ilke
        </>
      }
      lead="Botanical / Earthy, doğal malzemenin sıcaklığını arayüze taşır: huzur veren, sürdürülebilir ve güven veren bir dil. Aşağıdaki dört ilke bu sayfanın her bileşeninde geçerli."
    >
      <ol className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-12 p-0 md:grid-cols-2" data-karakterler="">
        {KARAKTERLER.map((k, i) => (
          <Belir as="li" key={k.baslik} gecikme={i * 120} className={i % 2 ? 'md:mt-16' : ''}>
            <BotanicalCard ton={k.ton} katman={i % 2 ? 1 : 2} dal={i === 0 || i === 3} tohum={i + 1} kicker={`İlke ${String(i + 1).padStart(2, '0')}`} baslik={k.baslik} className="h-full">
              <div className="flex items-start gap-4">
                <span className="grid size-16 shrink-0 place-items-center bg-yuzey text-zeytin-yazi" style={{ borderRadius: i % 2 ? 'var(--r-tas)' : '60% 40% 45% 55% / 45% 55% 45% 55%' }} aria-hidden="true">
                  <Ikon ad={k.ikon} boyut={34} />
                </span>
                <p className="text-[17.5px]">{k.metin}</p>
              </div>
              {i === 0 ? (
                <div className="mt-5 flex h-4 overflow-hidden" style={{ borderRadius: '99px' }} aria-hidden="true" data-ton-cubugu="">
                  {['#F0CBBB', '#E3A48F', '#C86D51', '#9A4530', '#556B2F', '#8A9E5B', '#D2B48C', '#E8D6B8', '#2F4F4F'].map((c) => (
                    <span key={c} className="flex-1" style={{ background: c }} />
                  ))}
                </div>
              ) : null}
            </BotanicalCard>
          </Belir>
        ))}
      </ol>
    </Section>
  )
}
