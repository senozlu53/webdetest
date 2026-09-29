import { ArtDecoCard, Cerceve } from '../components/Cerceve'
import { GoldBorderButton } from '../components/Dugme'
import { Ayirac, Bant, Sunburst, Ziggurat } from '../components/Ornament'
import { useSize } from '../components/hooks'
import { katSayisi } from '../lib/geo'
import { Section } from '../components/ui'
import type { SimgeAd } from '../lib/simge'

const git = (id: string) => document.getElementById(id)?.scrollIntoView()

/** Madde 1 · 2 · 11: ortalanmış zarif kahraman. Doğan güneş, iç içe üç çerçeve, Cinzel başlık */
export function Hero() {
  const [ref, { w }] = useSize<HTMLDivElement>()
  const c = katSayisi(w || 1200)
  return (
    <section id="ust" aria-labelledby="baslik" className="mx-auto w-full max-w-[1240px] px-4 pt-8 pb-8 md:px-8 md:pt-12">
      <div ref={ref} className="relative isolate mx-auto flex max-w-[1000px] flex-col items-center px-5 pt-10 pb-14 text-center md:px-16 md:pt-14" data-hero="" data-kat={c.kat}>
        <Cerceve key={c.kat} kat={c.kat} stil="basamak" k={c.k} aralik={c.aralik} zemin="var(--zemin)" dolgu={false} ciz yavas={2.6} />
        <div className="w-full max-w-[760px]">
          <Sunburst n={40} halka={5} ciz yavas={2.8} className="max-h-[300px]" />
        </div>
        <p className="kicker mt-6">İstanbul · Beyoğlu · MCMXXVIII</p>
        <h1 id="baslik" lang="en" className="mt-5 text-[clamp(38px,8.4vw,104px)] leading-[1.02] font-medium" style={{ letterSpacing: 'calc(0.16em * var(--iz))' }}>
          Aurelia
          <br />
          Palas
        </h1>
        <Ayirac className="mt-8 max-w-[420px]" />
        <p className="mx-auto mt-8 max-w-[52ch] text-[clamp(18px,2vw,21px)] text-metin">Bir asırlık simetrinin ışığında, altın çizgilerle örülmüş bir konaklama. Gece siyahı ve lacivertin sessizliğinde; her kapı, her merdiven, her masa aynı eksene bakar.</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <GoldBorderButton ana boy="b" onClick={() => git('rezervasyon')}>
            Oda ayırt
          </GoldBorderButton>
          <GoldBorderButton boy="b" onClick={() => git('menu')}>
            Menüyü gör
          </GoldBorderButton>
        </div>
      </div>
      <Bant tur="yelpaze" boy={40} className="mx-auto mt-6 max-w-[1000px]" />
    </section>
  )
}

const KURALLAR: { simge: SimgeAd; baslik: string; metin: string }[] = [
  { simge: 'yelpaze', baslik: 'Geometrik simetri', metin: 'Her yerleşim tek bir dikey eksene oturur. Sol ne ise sağ odur; merkez hiç kayıp gitmez.' },
  { simge: 'elmas', baslik: 'Altın ve krom', metin: 'Yaldız yalnız çizgide ve vurguda. Yüzeyler mat, çizgiler parlak; ışık kenarda toplanır.' },
  { simge: 'sutun', baslik: 'İnce çizgi', metin: 'Tüm ağırlık 1 piksellik hatlarda. Gölge yok, dolgu az; zarafet boşluktan gelir.' },
  { simge: 'kadeh', baslik: 'Rafine hiyerarşi', metin: 'Tek büyük başlık, sakin bir ara başlık, okunaklı gövde. Gösteriş sırayla, telaşsız gelir.' },
]

/** Madde 3: dört karakteristik */
export function Karakter() {
  return (
    <Section id="karakter" madde="Madde 3 · Karakteristikler" title="Dört değişmez ilke" lead="Art Deco çağın hızını törene çevirir: makine düzeniyle işlenmiş altın, kusursuz bir ölçü ve sabit bir eksen. Bu sayfa da aynı kurallarla yazıldı.">
      <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 xl:grid-cols-4">
        {KURALLAR.map((k, i) => (
          <li key={k.baslik} className="grid min-w-0 grid-cols-1">
            <ArtDecoCard ikon={k.simge} baslik={k.baslik} kat={2} stil={i % 2 ? 'pah' : 'basamak'} className="h-full">
              <p className="text-[17px] leading-[1.75] text-soluk">{k.metin}</p>
            </ArtDecoCard>
          </li>
        ))}
      </ul>
      <Ziggurat className="mt-16" />
    </Section>
  )
}
