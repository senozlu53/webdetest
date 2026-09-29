import { useState } from 'react'
import { cx } from '../../shared/cx'
import { useDeco } from '../lib/store'
import { TUM_SIMGELER, SIMGE_AD, type SimgeAd } from '../lib/simge'
import type { KoseStil } from '../lib/geo'
import { Cerceve } from '../components/Cerceve'
import { GoldBorderButton } from '../components/Dugme'
import { Ikon } from '../components/Ikon'
import { Bant, Sunburst } from '../components/Ornament'
import { Aralik, Anahtar, Kod, Section, Secim } from '../components/ui'

/** Madde 6: yelpaze, zikzak, kanal ve köşe biçimleri */
export function Sekil() {
  const [n, setN] = useState(36)
  const [halka, setHalka] = useState(5)
  const [aci, setAci] = useState(180)
  const [kisa, setKisa] = useState(0.78)
  return (
    <Section id="sekil" madde="Madde 6 · Şekil dili" title="Yelpaze, kanal, basamak" lead="Yuvarlak yok, yay ve doğru var: merkezden yayılan güneş ışınları, dikey kanallar, zikzaklar ve köşeleri basamak basamak ya da 45 derece kesilmiş çerçeveler. Hepsi tek eksene göre aynalıdır.">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative isolate bg-yuzey px-4 pt-10 pb-6" data-sunburst-oyun="">
          <Cerceve kat={2} stil="pah" k={16} aralik={8} />
          <Sunburst key={`${n}${halka}${aci}${kisa}`} n={n} halka={halka} aci={aci} kisa={kisa} className="mx-auto max-h-[340px]" />
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-6">
          <Aralik label="Işın sayısı" value={n} min={8} max={72} step={2} onChange={setN} />
          <Aralik label="Halka sayısı" value={halka} min={0} max={9} onChange={setHalka} />
          <Aralik label="Açı" value={aci} min={90} max={180} step={10} onChange={setAci} format={(v) => `${v}°`} />
          <Aralik label="Kısa ışın oranı" value={kisa} min={0.5} max={1} step={0.02} onChange={setKisa} format={(v) => `%${Math.round(v * 100)}`} />
          <Kod label="Yelpaze üretimi" sar={false}>{`<Sunburst n={${n}} halka={${halka}} aci={${aci}} kisa={${kisa.toFixed(2)}} />`}</Kod>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {[
          { tur: 'yelpaze' as const, ad: 'Yelpaze', not: 'Birbirine geçen yarım daire kabukları' },
          { tur: 'zigzag' as const, ad: 'Zikzak', not: 'Çift sıra keskin açılı şevron' },
          { tur: 'kanal' as const, ad: 'Kanal', not: 'Dikey çizgili sütun yüzeyi' },
        ].map((b) => (
          <figure key={b.tur} className="m-0 grid grid-cols-1 gap-4">
            <div className="relative isolate bg-yuzey p-5">
              <Cerceve kat={1} stil="duz" motif={false} />
              <Bant tur={b.tur} boy={b.tur === 'kanal' ? 120 : 100} />
            </div>
            <figcaption>
              <p className="font-baslik text-[18px] tracking-[0.16em] text-altin-yazi uppercase">{b.ad}</p>
              <p className="mt-1 text-[16px] text-soluk">{b.not}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <h3 className="mt-20 text-[clamp(20px,2.4vw,26px)]">Köşe biçimleri</h3>
      <ul className="m-0 mx-auto mt-8 grid max-w-[900px] list-none grid-cols-1 gap-8 p-0 sm:grid-cols-3" data-kose-tur="">
        {(
          [
            ['duz', 'Düz', 'Sade dikdörtgen'],
            ['pah', 'Pahlı', '45° kesik köşe'],
            ['basamak', 'Basamaklı', 'Ziggurat köşe'],
          ] as [KoseStil, string, string][]
        ).map(([s, ad, not]) => (
          <li key={s} className="grid grid-cols-1 gap-4">
            <div className="relative isolate h-[150px] bg-yuzey">
              <Cerceve kat={2} stil={s} k={14} aralik={9} />
            </div>
            <div>
              <p className="font-baslik text-[16px] tracking-[0.16em] text-altin-yazi uppercase">{ad}</p>
              <p className="text-[16px] text-soluk">{not}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}

const KATMAN_AD = ['Salon', 'Galeri', 'Bar'] as const

/** Madde 7: gölge yok; derinlik çerçevelerle */
export function Derinlik() {
  const [kat, setKat] = useState(3)
  const [aralik, setAralik] = useState(9)
  const [stil, setStil] = useState<KoseStil>('basamak')
  const [motif, setMotif] = useState(true)
  const [sira, setSira] = useState<number[]>([0, 1, 2])
  const one = (i: number) => setSira((s) => [...s.filter((x) => x !== i), i])
  return (
    <Section id="derinlik" madde="Madde 7 · Z ekseni ve gölge" title="Gölgesiz derinlik" lead="Gölge yok; ışık yok. Derinlik iç içe altın çizgilerden ve üst üste binen çerçevelerden gelir: ne kadar çok çerçeve, o kadar içeride. Çizgi kalınlığı sabit, yalnız aralık değişir.">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative isolate flex min-h-[340px] min-w-0 items-center justify-center bg-zemin px-6 py-10" data-ic-ice="">
          <Cerceve key={`${kat}${aralik}${stil}${motif}`} kat={kat} stil={stil} k={12} aralik={aralik} motif={motif} zemin="var(--zemin)" />
          <div className="text-center">
            <Ikon ad="tac" boyut={44} className="mx-auto" />
            <p className="mt-3 font-baslik text-[22px] tracking-[0.24em] text-altin-yazi uppercase">{kat} çerçeve</p>
            <p className="mt-1 text-[16px] text-soluk">{aralik} px aralık</p>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-6">
          <Aralik label="Çerçeve sayısı" value={kat} min={1} max={6} onChange={setKat} />
          <Aralik label="Çerçeve aralığı" value={aralik} min={5} max={18} onChange={setAralik} format={(v) => `${v}px`} />
          <Secim<KoseStil>
            legend="Köşe"
            name="der-kose"
            value={stil}
            onChange={setStil}
            options={[
              { id: 'duz', ad: 'Düz' },
              { id: 'pah', ad: 'Pahlı' },
              { id: 'basamak', ad: 'Basamaklı' },
            ]}
          />
          <Anahtar label="Baklava motifi" checked={motif} onChange={setMotif} />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <figure className="m-0 grid grid-cols-1 gap-4">
          <div className="grid h-[240px] place-items-center bg-zemin">
            <div className="grid h-[110px] w-[70%] place-items-center bg-yuzey px-4 text-center font-baslik text-[16px] tracking-[0.2em] uppercase" style={{ boxShadow: '8px 10px 18px rgb(0 0 0 / .7)' }} data-dijital="">
              <span className="line-through decoration-altin-cizgi decoration-1">box-shadow</span>
            </div>
          </div>
          <figcaption className="text-[17px] text-soluk">
            <b className="text-metin">Yapma.</b> Siyah zeminde siyah gölge görünmez; üstelik bu stilin ışığı altındır, gölgesi yoktur.
          </figcaption>
        </figure>
        <figure className="m-0 grid grid-cols-1 gap-4">
          <div className="grid h-[240px] place-items-center bg-zemin" data-dogru="">
            <div className="relative isolate grid h-[110px] w-[70%] place-items-center bg-yuzey px-4 text-center font-baslik text-[16px] tracking-[0.2em] text-altin-yazi uppercase">
              <Cerceve kat={3} stil="pah" k={10} aralik={7} motif={false} />
              iç içe çerçeve
            </div>
          </div>
          <figcaption className="text-[17px] text-soluk">
            <b className="text-metin">Yap.</b> Üç ince çerçeve: her biri bir kat içeride, kenarlar altın gradyan.
          </figcaption>
        </figure>
      </div>

      <h3 className="mt-20 text-[clamp(20px,2.4vw,26px)]">Üst üste binen çerçeveler</h3>
      <div className="mt-8 grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto]">
        <div className="relative mx-auto h-[300px] w-full max-w-[440px]" data-yigin={sira.join(',')}>
          {KATMAN_AD.map((ad, i) => (
            <div key={ad} className="absolute isolate grid h-[190px] w-[78%] place-items-center bg-yuzey" style={{ left: `${i * 11}%`, top: i * 44, zIndex: sira.indexOf(i) + 1 }} data-yigin-katman={ad}>
              <Cerceve kat={2} stil="pah" k={10} aralik={7} motif={false} />
              <p className="font-baslik text-[18px] tracking-[0.24em] text-altin-yazi uppercase">{ad}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="kicker">Öne getir</p>
          {KATMAN_AD.map((ad, i) => (
            <GoldBorderButton key={ad} boy="k" onClick={() => one(i)} aria-pressed={sira[2] === i}>
              {ad}
            </GoldBorderButton>
          ))}
        </div>
      </div>
    </Section>
  )
}

const DOKULAR: { id: 'kadife' | 'mermer' | 'firca' | 'duz'; ad: string; not: string; maske: string; boyut: string }[] = [
  { id: 'kadife', ad: 'Kadife', not: 'ince tane + yukarıdan soluk altın ışık', maske: 'var(--m-kadife)', boyut: '220px' },
  { id: 'mermer', ad: 'Mermer', not: 'düşük frekanslı damar gürültüsü', maske: 'var(--m-mermer)', boyut: '520px' },
  { id: 'firca', ad: 'Fırçalanmış altın', not: 'yatay çizgili metal tane', maske: 'var(--m-firca)', boyut: '300px' },
  { id: 'duz', ad: 'Düz', not: 'doku kapalı', maske: 'none', boyut: '100px' },
]

/** Madde 8: fırçalanmış altın, kadife, mermer */
export function Doku() {
  const s = useDeco()
  return (
    <Section id="doku" madde="Madde 8 · Doku ve yüzey" title="Kadife, mermer, altın" lead="Doku bir resim değil, altın rengi bir katmandır: SVG gürültüsü maske olarak kesilir, rengi temadan alır. Aynı doku hem koyu hem Fildişi zeminde çalışır. Metin bulunan yüzeylerin arkası düz kalır.">
      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 xl:grid-cols-4" data-doku-izgara="">
        {DOKULAR.map((d) => (
          <li key={d.id} className="grid min-w-0 grid-cols-1 gap-4">
            <div className="relative h-[190px] overflow-hidden border border-altin-soluk bg-zemin" data-doku-kutu={d.id}>
              {d.id !== 'duz' ? <div className="doku-ornek" style={{ WebkitMaskImage: d.maske, maskImage: d.maske, WebkitMaskSize: d.boyut, maskSize: d.boyut, opacity: d.id === 'kadife' ? 0.75 : 0.9 }} /> : null}
              {d.id === 'kadife' ? <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, var(--altin) 22%, transparent), transparent 75%)' }} /> : null}
              {d.id === 'firca' ? (
                <div className="absolute inset-x-6 top-1/2 h-10 -translate-y-1/2" style={{ background: 'linear-gradient(90deg, #8c6d1f, #d4af37 30%, #f3dc82 50%, #d4af37 70%, #8c6d1f)', WebkitMaskImage: 'linear-gradient(#000 0 0)' }}>
                  <div className="size-full" style={{ background: 'repeating-linear-gradient(90deg, rgb(0 0 0 / .1) 0 1px, transparent 1px 3px)' }} />
                </div>
              ) : null}
              <div className="absolute inset-[6px] border border-altin-soluk" aria-hidden="true" />
              {s.doku === d.id ? <span className="absolute right-3 bottom-3 border border-altin-cizgi bg-zemin px-2 py-0.5 font-baslik text-[11px] font-semibold tracking-[0.2em] text-altin-yazi">SEÇİLİ</span> : null}
            </div>
            <div>
              <p className="font-baslik text-[17px] tracking-[0.14em] text-altin-yazi uppercase">{d.ad}</p>
              <p className="mt-1 text-[16px] text-soluk">{d.not}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-12 max-w-[640px]">
        <Secim<'kadife' | 'mermer' | 'firca' | 'duz'>
          legend="Sayfa dokusu"
          name="doku-sec"
          value={s.doku}
          onChange={s.setDoku}
          options={[
            { id: 'kadife', ad: 'Kadife' },
            { id: 'mermer', ad: 'Mermer' },
            { id: 'firca', ad: 'Fırçalanmış altın' },
            { id: 'duz', ad: 'Düz' },
          ]}
        />
      </div>
    </Section>
  )
}

/** Madde 9: 1 piksellik simetrik ikonlar */
export function Ikonlar() {
  const [boyut, setBoyut] = useState(44)
  const [secili, setSecili] = useState<SimgeAd>('tac')
  const [eksen, setEksen] = useState(true)
  return (
    <Section id="ikonlar" madde="Madde 9 · İkonografi" title="Bir piksellik altın" lead="24 klasik motif: her biri 32×32 kutuda dikey eksene göre simetrik, tek renk, 1 piksel hat. Boyut değişse de çizgi kalınlığı değişmez.">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="m-0 grid min-w-0 list-none grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-4 p-0" data-ikon-izgara="">
          {TUM_SIMGELER.map((a) => (
            <li key={a} className="grid grid-cols-1">
              <button type="button" onClick={() => setSecili(a)} aria-pressed={secili === a} className={cx('kart-duz grid min-h-[128px] justify-items-center gap-3 px-2 py-5', secili === a && '!border-altin-cizgi')} aria-label={`${SIMGE_AD[a]} ikonunu büyüt`}>
                <span className="grid h-[76px] place-items-center">
                  <Ikon ad={a} boyut={boyut} />
                </span>
                <span className="font-baslik text-[11px] font-semibold tracking-[0.16em] text-metin uppercase">{SIMGE_AD[a]}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="grid min-w-0 grid-cols-1 gap-6">
          <Aralik label="Boy" value={boyut} min={24} max={72} step={4} onChange={setBoyut} format={(v) => `${v}px`} />
          <div className="relative isolate bg-yuzey p-6" data-buyuk-ikon={secili}>
            <Cerceve kat={2} stil="basamak" k={10} aralik={7} />
            <div className="relative mx-auto size-[200px]">
              {eksen ? (
                <svg viewBox="0 0 32 32" className="absolute inset-0 size-full" fill="none" aria-hidden="true" data-eksen="">
                  <path d="M16 0V32M0 16H32" stroke="var(--altin-cizgi)" strokeOpacity={0.5} strokeDasharray="1 1" vectorEffect="non-scaling-stroke" strokeWidth={1} />
                </svg>
              ) : null}
              <Ikon ad={secili} boyut={200} />
            </div>
            <p className="mt-4 font-baslik text-[16px] tracking-[0.2em] text-altin-yazi uppercase">{SIMGE_AD[secili]}</p>
          </div>
          <Anahtar label="Simetri ekseni" hint="Dikey ve yatay kılavuz" checked={eksen} onChange={setEksen} />
        </div>
      </div>
    </Section>
  )
}
