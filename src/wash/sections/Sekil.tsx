import { useState, type CSSProperties } from 'react'
import { useWash } from '../lib/store'
import { TUM_SIMGELER, SIMGE_AD } from '../lib/simge'
import { Baykus, Sahne, type SahneAd } from '../components/Baykus'
import { FircaDarbe, FircaArka, WashButton } from '../components/Firca'
import { Ikon } from '../components/Ikon'
import { PIGMENT, PIGMENT_AD, WatercolorBackground, useSize } from '../components/Leke'
import { Damla, FircaAralik, Kod, Secim, Section } from '../components/ui'

type Ana = 'ultramarin' | 'yesil' | 'gul' | 'ocre'
const ANA = Object.keys(PIGMENT_AD) as Ana[]

/** Madde 6: sıvı gibi dağılan organik fırça darbeleri */
export function Sekil() {
  const [tohum, setTohum] = useState(4)
  const [kalin, setKalin] = useState(0.62)
  const [kuru, setKuru] = useState(0.5)
  const [egim, setEgim] = useState(8)
  const [renk, setRenk] = useState<Ana>('ultramarin')
  const [dalga, setDalga] = useState(0.16)
  const [ref, { w }] = useSize<HTMLDivElement>()
  return (
    <Section
      id="sekil"
      madde="Madde 6 · Şekil dili"
      title="Köşesiz, kenarsız"
      renk="yesil"
      lead="Geometri yok: her şekil bir fırça darbesi ya da bir leke. Darbe soldan sağa ilerler, ortada kalınlaşır, ucunda kıllar dağılır; leke ise bir elipsin çevresinde dalgalanan sıvı sınırdır. İkisi de tohumla üretilir: aynı sayı aynı el."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0">
          <div ref={ref} className="sayfa p-5" data-firca-ornek="">
            {w > 40 ? <FircaDarbe w={Math.max(120, w - 40)} h={150} tohum={tohum} renk={renk} op={0.72} kalin={kalin} kuru={kuru} egim={egim} kuruFiltre={kuru > 0.7} className="leke mx-auto" style={{ opacity: 'var(--su)' }} /> : null}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="relative h-[220px]">
              <WatercolorBackground key={`${tohum}${dalga}${renk}`} lekeler={[{ renk, x: 50, y: 50, w: 90, h: 86, tohum, dalga, gecikme: 0 }]} vb={[400, 300]} sure={1.4} />
            </div>
            <div className="sayfa p-5">
              <h3 className="text-[30px] font-medium italic">Leke</h3>
              <p className="mt-2 text-[16px] text-soluk">Yarıçap ±%{Math.round(dalga * 100)} oynar; 9 kontrol noktası, Catmull-Rom ile yumuşatılır, keskin köşe kalmaz.</p>
              <div className="mt-4">
                <FircaAralik label="Dalga" value={dalga} min={0} max={0.35} step={0.01} onChange={setDalga} format={(v) => `%${Math.round(v * 100)}`} renk={PIGMENT[renk]} />
              </div>
            </div>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Secim<Ana> legend="Pigment" name="sk-renk" value={renk} onChange={setRenk} options={ANA.map((k) => ({ id: k, ad: PIGMENT_AD[k], renk: PIGMENT[k] }))} />
          <FircaAralik label="Fırça kalınlığı" value={kalin} min={0.25} max={0.95} step={0.01} onChange={setKalin} format={(v) => `%${Math.round(v * 100)}`} renk={PIGMENT[renk]} />
          <FircaAralik label="Kuruluk (uç kılları)" value={kuru} min={0} max={1} step={0.05} onChange={setKuru} format={(v) => `%${Math.round(v * 100)}`} renk={PIGMENT[renk]} />
          <FircaAralik label="Sallanma" value={egim} min={0} max={30} onChange={setEgim} format={(v) => `${v}px`} renk={PIGMENT[renk]} />
          <div>
            <WashButton renk={renk} boy="k" onClick={() => setTohum((t) => t + 1)} tohum={tohum + 3}>
              Yeni darbe · tohum {tohum + 1}
            </WashButton>
          </div>
          <Kod label="Fırça üretimi" sar={false}>{`firca(w, h, ${tohum}, {
  kalin: ${kalin.toFixed(2)}, kuru: ${kuru.toFixed(2)}, egim: ${egim}
})`}</Kod>
        </div>
      </div>
    </Section>
  )
}

/** Madde 7: dijital gölge yok; altına fırçayla daha koyu ton boyanır */
export function Golge() {
  const [alt, setAlt] = useState(true)
  const [koyu, setKoyu] = useState(0.75)
  const [renk, setRenk] = useState<Ana>('ultramarin')
  return (
    <Section
      id="golge"
      madde="Madde 7 · Z-ekseni ve gölge"
      title="Gölge değil, alt ton"
      renk="ultramarin"
      lead="Suluboyada karanlık, üst üste boya sürülerek elde edilir. Bu yüzden bileşenin altına, aynı pigmentin daha koyu bir fırça darbesi çekilir: kâğıda değil sayfaya oturur, kenarı yumuşak ve dalgalıdır. box-shadow ve drop-shadow bu stilde kullanılmaz."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1fr_0.8fr]">
        <figure className="m-0 grid gap-4">
          <div className="grid h-[210px] place-items-center rounded-lg bg-transparent">
            <div className="sayfa grid h-[110px] w-[80%] place-items-center px-4 text-center font-baslik text-[26px] italic" style={{ boxShadow: '6px 8px 14px rgb(0 0 0 / .35)' } as CSSProperties} data-dijital="">
              <span className="line-through decoration-gul decoration-2">box-shadow</span>
            </div>
          </div>
          <figcaption className="text-[17px] text-soluk">
            <b className="text-murekkep">Yapma.</b> Bulanık, siyah gölge: kâğıtta olmayan bir ışık.
          </figcaption>
        </figure>
        <figure className="m-0 grid gap-4">
          <div className="grid h-[210px] place-items-center rounded-lg bg-transparent">
            <div className="relative isolate w-[80%]" data-alt-boya={alt ? '1' : '0'}>
              {alt ? (
                <div className="pointer-events-none absolute -right-2 -bottom-4 -left-1 h-[76px]" style={{ zIndex: -1 }}>
                  <FircaArka renk={renk} alt={false} op={koyu} tasma={[0, 0]} kalin={0.95} tohum={12} kuru={0.3} className="!absolute !inset-0" />
                </div>
              ) : null}
              <div className="sayfa grid h-[110px] place-items-center px-4 text-center font-baslik text-[26px] italic">alt ton</div>
            </div>
          </div>
          <figcaption className="text-[17px] text-soluk">
            <b className="text-murekkep">Yap.</b> Aynı pigmentin koyu tonu, fırçayla kartın altına ve sağına boyanır.
          </figcaption>
        </figure>
        <div className="grid min-w-0 content-start gap-5">
          <Damla label="Alt ton" checked={alt} onChange={setAlt} />
          <FircaAralik label="Ton koyuluğu" value={koyu} min={0.15} max={0.95} step={0.05} onChange={setKoyu} format={(v) => `%${Math.round(v * 100)}`} renk={PIGMENT[renk]} />
          <Secim<Ana> legend="Pigment" name="golge-renk" value={renk} onChange={setRenk} options={ANA.map((k) => ({ id: k, ad: PIGMENT_AD[k], renk: PIGMENT[k] }))} />
        </div>
      </div>
    </Section>
  )
}

const DOKU_TIP: { id: 'sulu' | 'kanvas' | 'duz'; ad: string; not: string; bg: string }[] = [
  { id: 'sulu', ad: 'Kalın presli suluboya kâğıdı', not: 'feDiffuseLighting: çukur ve tepecikler', bg: 'var(--dok-sulu)' },
  { id: 'kanvas', ad: 'Pamuklu kanvas', not: 'dokuma çizgileri + iplik tanesi', bg: 'var(--dok-dokuma), var(--dok-kanvas)' },
  { id: 'duz', ad: 'Düz', not: 'doku kapalı', bg: 'none' },
]

/** Madde 8 · 12 · 15: kâğıt dokusu ve çoğaltma kipi */
export function Doku() {
  const s = useWash()
  const [blend, setBlend] = useState<'normal' | 'multiply'>('multiply')
  return (
    <Section
      id="doku"
      madde="Madde 8 · 15 · Doku ve harmanlama"
      title="Kâğıtla bütünleşen boya"
      renk="ocre"
      lead="Doku SVG gürültüsünden gelir (resim dosyası yok). Boya kâğıda çoğaltma kipiyle biner: beyaz alan kâğıdı bozmaz, pigment kâğıdın tanesinden geçer. Aynı görseli normal kipte koyunca çevresinde beyaz bir kutu belirir."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.3fr_1fr]">
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-3">
          {DOKU_TIP.map((d) => (
            <li key={d.id} className="grid content-start gap-3">
              <div className="grid h-[160px] place-items-end rounded-lg border border-[var(--cizgi)] p-2" style={{ backgroundColor: 'var(--kagit)', backgroundImage: d.bg, backgroundBlendMode: 'multiply' }} data-doku-kutu={d.id}>
                {s.doku === d.id ? <span className="sayfa px-2 py-0.5 text-[13px] font-semibold">SEÇİLİ</span> : null}
              </div>
              <div>
                <p className="font-baslik text-[24px] leading-tight font-medium italic">{d.ad}</p>
                <p className="mt-1 text-[15px] text-soluk">{d.not}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="grid min-w-0 content-start gap-5">
          <Secim<'sulu' | 'kanvas' | 'duz'>
            legend="Sayfa dokusu"
            name="doku-sec"
            value={s.doku}
            onChange={s.setDoku}
            options={[
              { id: 'sulu', ad: 'Suluboya kâğıdı' },
              { id: 'kanvas', ad: 'Kanvas' },
              { id: 'duz', ad: 'Düz' },
            ]}
          />
          <FircaAralik label="Su miktarı" value={s.su} min={0.4} max={1.4} step={0.1} onChange={s.setSu} format={(v) => `%${Math.round(v * 100)}`} renk="var(--ultramarin)" />
        </div>
      </div>

      <h3 className="mt-16 text-[38px] font-medium italic">Multiply ile normal</h3>
      <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="relative isolate min-h-[270px] overflow-hidden rounded-lg border border-[var(--cizgi)] p-4" style={{ backgroundColor: 'var(--kagit)', backgroundImage: 'var(--dok)', backgroundBlendMode: 'multiply' }}>
          <div className="relative mx-auto h-[240px] w-full max-w-[520px] bg-white" style={{ mixBlendMode: blend }} data-blend-ornek={blend}>
            <WatercolorBackground
              lekeler={[
                { renk: 'ultramarin', x: 38, y: 46, w: 60, h: 72, tohum: 3, dalga: 0.15, gecikme: 0 },
                { renk: 'gul', x: 66, y: 60, w: 48, h: 56, tohum: 9, dalga: 0.16, gecikme: 0 },
              ]}
              vb={[520, 240]}
              sure={1}
            />
          </div>
        </div>
        <div className="grid min-w-0 content-start gap-5">
          <Secim<'normal' | 'multiply'>
            legend="Harmanlama kipi"
            name="doku-blend"
            value={blend}
            onChange={setBlend}
            options={[
              { id: 'normal', ad: 'Normal (beyaz kutu görünür)' },
              { id: 'multiply', ad: 'Multiply (kâğıtla bütünleşir)' },
            ]}
          />
          <p className="text-[17px] text-soluk">Beyaz zeminli bir görsel (JPG gibi) çoğaltma kipinde kâğıdın rengini korur: beyazla çarpmak hiçbir şeyi değiştirmez, yalnız pigment çarpılır.</p>
        </div>
      </div>
    </Section>
  )
}

const SAHNE_AD: { id: SahneAd; ad: string }[] = [
  { id: 'orman', ad: 'Orman' },
  { id: 'nehir', ad: 'Nehir' },
  { id: 'aksam', ad: 'Akşam' },
  { id: 'gece', ad: 'Gece' },
]

/** Madde 9: el boyaması spot illüstrasyonlar ve karakter */
export function Ikonlar() {
  const [boyut, setBoyut] = useState(64)
  return (
    <Section
      id="ikonlar"
      madde="Madde 9 · İkonografi"
      title="El boyaması resimler"
      renk="gul"
      lead="Çizgi yok: her ikon, saydam pigment katmanlarının (glaze) üst üste sürülmesi. Kesişimler koyulaşır, kenarlarda pigment birikir, iç yüzeyde kâğıdın tanesi görünür. 24 spot illüstrasyon aynı filtre ve aynı üç pigmentle çizildi."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="m-0 grid min-w-0 list-none grid-cols-[repeat(auto-fill,minmax(108px,1fr))] gap-4 p-0" data-ikon-izgara="">
          {TUM_SIMGELER.map((a) => (
            <li key={a} className="sayfa grid justify-items-center gap-2 px-2 py-4 text-center">
              <span className="grid h-[84px] place-items-center">
                <Ikon ad={a} boyut={boyut} />
              </span>
              <span className="font-baslik text-[19px] italic">{SIMGE_AD[a]}</span>
            </li>
          ))}
        </ul>
        <div className="grid min-w-0 content-start gap-5">
          <FircaAralik label="Boy" value={boyut} min={32} max={88} step={4} onChange={setBoyut} format={(v) => `${v}px`} renk="var(--gul)" />
          <div className="sayfa p-4">
            <Baykus className="mx-auto w-[200px]" />
            <p className="mt-3 text-center font-baslik text-[24px] italic">Bilge Baykuş</p>
            <p className="text-center text-[15px] text-soluk">Karakter: 18 pigment katmanı</p>
          </div>
        </div>
      </div>
      <ul className="m-0 mt-12 grid list-none grid-cols-2 gap-5 p-0 lg:grid-cols-4">
        {SAHNE_AD.map((x) => (
          <li key={x.id} className="grid gap-2">
            <div className="h-[130px] overflow-hidden rounded-lg border border-[var(--cizgi)]" style={{ backgroundColor: 'var(--kagit)' }}>
              <Sahne ad={x.id} />
            </div>
            <p className="font-baslik text-[22px] italic">{x.ad}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
