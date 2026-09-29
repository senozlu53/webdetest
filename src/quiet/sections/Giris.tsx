import { Belir, Section } from '../components/ui'
import { EditorialGrid, FullBleedImage, Kolon, QuietButton } from '../components/Quiet'
import { Ikon } from '../components/Ikon'

const git = (id: string) => document.getElementById(id)?.scrollIntoView()

/** Madde 1 · 2 · 11: büyük tipografik başlık alanı ve kenardan kenara görsel */
export function Hero() {
  return (
    <section id="ust" aria-labelledby="baslik" className="w-full">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12" style={{ paddingTop: 'calc(clamp(56px, 9vw, 128px) * var(--bosluk))', paddingBottom: 'var(--aralik)' }}>
        <Belir sure={2200}>
          <p className="kicker">
            Stil 029 · <span lang="en">Quiet Luxury</span>
          </p>
          <h1 id="baslik" className="buyuk mt-8 max-w-[14ch] text-[clamp(52px,11.5vw,176px)]">
            Sessizlik, <em className="font-normal italic">en pahalı</em> malzemedir.
          </h1>
        </Belir>
        <div className="mt-[var(--aralik)]">
          <EditorialGrid aralik={false}>
            <Kolon span={4} baslangic={1}>
              <p className="kicker">Ardıç · 2009'dan beri</p>
            </Kolon>
            <Kolon span={5} baslangic={5}>
              <p className="text-[clamp(17px,1.5vw,20px)] leading-[1.9]">Bir mimarlık ofisi, bir koleksiyon, küçük bir han ve az sayıda seçilmiş nesne. Logoya gerek yok; işi bilen zaten görür. Bu sayfa da aynı sözü tutar: bol boşluk, sakin bir yazı, doğru ölçü.</p>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
                <QuietButton varyant="dolu" boy="b" onClick={() => git('galeri')}>
                  Galeriye bak
                </QuietButton>
                <QuietButton varyant="metin" onClick={() => git('mimari')} ikon={<Ikon ad="ok" boyut={18} />}>
                  Projeler
                </QuietButton>
              </div>
            </Kolon>
          </EditorialGrid>
        </div>
      </div>
      <Belir sure={2600}>
        <FullBleedImage sahne="duvar" oran="21 / 9" altyazi="Beton duvar ve pencere ışığı" no="01" />
      </Belir>
    </section>
  )
}

const ILKELER = [
  ['Aşırılıktan arınmış', 'Ne kadar az, o kadar fazla. Renk, gölge, dekor ve slogan tek tek çıkarılır; geriye yalnız ihtiyaç kalır.'],
  ['Cömert boşluk', 'Elemanlar arası 96 piksel ve üstü. Boşluk süs değil, malzemedir; içeriğe nefes verir.'],
  ['Büyük ve kaliteli görsel', 'Az sayıda görsel, ama kenardan kenara. Metin görselin önüne geçmez, altına yerleşir.'],
  ['Kusursuz tipografik denge', 'İnce bir serif ve temiz bir sans. Başlıklar büyük ve hafif, gövde küçük ve sakin.'],
  ['Ham ve doğal tonlar', 'Taş, kömür, fildişi ve zayıf toprak. Doygun renk yok; yüzey keten, kâğıt ya da taş.'],
] as const

/** Madde 3: beş karakteristik */
export function Karakter() {
  return (
    <Section id="ilke" madde="Madde 3 · Karakteristikler" title="Beş sessiz ilke" lead="Quiet luxury bağırmaz: ürünün, mekânın ve sayfanın kalitesi ölçüdedir. Aşağıdaki beş ilke bu sayfanın tamamında geçerli.">
      <ol className="m-0 list-none p-0">
        {ILKELER.map(([b, m], i) => (
          <Belir as="li" key={b} className="grid grid-cols-1 gap-x-[var(--oluk)] gap-y-4 border-t border-[var(--cizgi)] py-10 md:grid-cols-12">
            <span className="rakam text-[18px] text-soluk md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="text-[clamp(28px,3.2vw,44px)] md:col-span-5">{b}</h3>
            <p className="max-w-[50ch] text-soluk md:col-span-5 md:col-start-7">{m}</p>
          </Belir>
        ))}
      </ol>
    </Section>
  )
}
