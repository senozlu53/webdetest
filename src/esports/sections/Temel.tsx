import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Bolum } from '../components/Bolum'
import { useOlc, useSay } from '../components/hooks'
import { Ikon } from '../components/Ikon'
import { EsportsCard } from '../components/Kart'
import { Alan, Aralik, Kod, Secim } from '../components/ui'
import { kontrast as kontrastHesap, oran } from '../lib/contrast'
import { IKONLAR, KARBON, VURGULAR, palet } from '../lib/data'
import { useEsports, type Vurgu } from '../lib/store'

const DOKU_EN_ACIK = '#1b1f27'

/* ───────────────────────── Madde 4 · Renk ───────────────────────── */

export function Renk() {
  const { vurgu, setVurgu, kontrast: kt } = useEsports()
  const p = palet(kt === 'yuksek')
  const satirlar: [string, string, string, string, string, 'metin' | 'buyuk'][] = [
    ['Metin · buz beyazı', p.metin, KARBON, 'Karbon', 'Gövde metni', 'metin'],
    ['İkincil metin', p.soluk, KARBON, 'Karbon', 'Etiket, açıklama, künye', 'metin'],
    ['Elektrik Mavisi #00F0FF', p.mavi, KARBON, 'Karbon', 'Bağlantı, vurgu, sayı', 'metin'],
    ['Neon Lime #39FF14', p.lime, KARBON, 'Karbon', 'Galibiyet, şerit, vurgu', 'metin'],
    ['Turuncu · açık ton #FF8F5F', p.turuncuYazi, KARBON, 'Karbon', 'Uyarı ve mağlubiyet yazısı', 'metin'],
    ['Agresif Turuncu #FF4500', p.turuncu, KARBON, 'Karbon', 'Şerit ve büyük başlık', 'buyuk'],
    ['Karbon · mavi dolgu üstünde', KARBON, '#00f0ff', 'Mavi dolgu', 'Düğme ve seçili çip etiketi', 'metin'],
    ['Karbon · lime dolgu üstünde', KARBON, '#39ff14', 'Lime dolgu', 'Düğme ve seçili çip etiketi', 'metin'],
    ['Karbon · turuncu dolgu #FF7440', KARBON, '#ff7440', 'Turuncu dolgu', 'Seçili çip etiketi (küçük)', 'metin'],
    ['Karbon · turuncu #FF4500', KARBON, '#ff4500', 'Turuncu', 'Düğme etiketi (19 px, kalın)', 'buyuk'],
    ['Beyaz · koyu turuncu rozet', '#ffffff', '#9c2600', 'Rozet', 'Canlı ve mağlubiyet rozeti', 'metin'],
  ]
  const karar = (k: number, t: 'metin' | 'buyuk') => (t === 'buyuk' ? (k >= 4.5 ? 'AAA (büyük)' : k >= 3 ? 'AA (büyük)' : 'Yetersiz') : k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : 'Yetersiz')
  return (
    <Bolum
      id="renk"
      no="02"
      madde="Madde 4 · Renk paleti"
      baslik="Karbon, mavi, lime, turuncu"
      lead="Dört renk bütün arenayı çizer. Karbon siyahı zemindir; mavi, lime ve turuncu şerit ve vurgudur. Küçük metinde turuncunun açık tonu kullanılır, çünkü #FF4500 karbon üstünde yalnız büyük metin için yeterlidir."
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-12">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" data-paletler="">
          {[{ ad: 'Karbon Siyahı', hex: '#0D0E12', rol: 'Zemin ve panel', renk: '#0d0e12', yazi: '#f2f6fa' }, ...VURGULAR.map((v) => ({ ad: v.ad, hex: v.hex.toUpperCase().replace('#FF4500', '#FF4500'), rol: v.rol, renk: v.hex, yazi: '#0d0e12' }))].map((g, i) => (
            <li key={g.hex} data-renk={g.hex}>
              <EsportsCard vurgu={(['mavi', 'mavi', 'lime', 'turuncu'] as Vurgu[])[i]} kesim="kose" className="p-5">
                <span className="renk-blok" style={{ background: g.renk, color: g.yazi, boxShadow: i === 0 ? 'inset 0 0 0 2px rgb(242 246 250 / 0.5)' : undefined }} aria-hidden="true">
                  <span className="rakam text-[1.125rem] font-bold">{g.hex}</span>
                </span>
                <p className="t-h3 mt-4 !text-[1.125rem]">{g.ad}</p>
                <p className="t-alt mt-1">{g.rol}</p>
              </EsportsCard>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="grid content-start gap-5 lg:col-span-3">
            <Secim<Vurgu>
              legend="Vurgu rengi"
              name="renk-vurgu"
              value={vurgu}
              onChange={setVurgu}
              options={[
                { id: 'mavi', ad: 'Mavi' },
                { id: 'lime', ad: 'Lime' },
                { id: 'turuncu', ad: 'Turuncu' },
              ]}
            />
            <p className="t-alt" data-palet-not="">
              Seçilen vurgu bütün sayfada şerit, parlama ve düğmelerin rengini değiştirir.
            </p>
          </div>
          <div className="min-w-0 lg:col-span-9">
            <div className="overflow-x-auto" role="region" aria-label="Renk çiftleri ve okunabilirlik, yatay kaydırılabilir" tabIndex={0}>
              <table className="tablo w-full min-w-[820px]" data-renk-tablo="">
                <caption className="t-alt">Renk çiftleri ve okunabilirlik · normal metin AAA için 7:1, büyük metin için 4,5:1</caption>
                <thead>
                  <tr>
                    <th scope="col">Renk</th>
                    <th scope="col">Zemin</th>
                    <th scope="col">Oran</th>
                    <th scope="col">Dokuda</th>
                    <th scope="col">Karar</th>
                    <th scope="col">Kullanım</th>
                  </tr>
                </thead>
                <tbody>
                  {satirlar.map(([ad, fg, bg, zad, kul, tur]) => {
                    const k = kontrastHesap(fg, bg)
                    const d = bg === KARBON ? kontrastHesap(fg, DOKU_EN_ACIK) : null
                    return (
                      <tr key={ad} data-cift={ad}>
                        <th scope="row">
                          <span className="mr-3 inline-block h-4 w-4 align-[-2px]" style={{ background: fg, boxShadow: '0 0 0 1px rgb(242 246 250 / 0.5)' }} aria-hidden="true" />
                          {ad}
                        </th>
                        <td>{zad}</td>
                        <td className="rakam">{oran(k)}</td>
                        <td className="rakam">{d ? oran(d) : '—'}</td>
                        <td>{karar(d ?? k, tur)}</td>
                        <td>{kul}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 5 · Yazı ───────────────────────── */

type Efekt = 'dolu' | 'vurgu' | 'neon'
export function Yazi() {
  const [metin, setMetin] = useState('Şampiyon hız')
  const [boy, setBoy] = useState(72)
  const [genislik, setGenislik] = useState(130)
  const [agirlik, setAgirlik] = useState(900)
  const [egim, setEgim] = useState(8)
  const [efekt, setEfekt] = useState<Efekt>('dolu')
  const orn = useRef<HTMLParagraphElement>(null)
  const govde = useRef<HTMLParagraphElement>(null)
  const [olc, setOlc] = useState({ fs: '', ff: '', ws: '', tr: '', gt: '' })
  useLayoutEffect(() => {
    const s = getComputedStyle(orn.current!)
    setOlc({ fs: s.fontSize, ff: s.fontFamily.split(',')[0].replace(/["']/g, '').trim(), ws: `${s.fontStretch} · ${s.fontWeight}`, tr: getComputedStyle(orn.current!.firstElementChild!).transform, gt: getComputedStyle(govde.current!).transform })
  }, [metin, boy, genislik, agirlik, egim, efekt])
  return (
    <Bolum
      id="yazi"
      no="03"
      madde="Madde 5 · Tipografi"
      baslik="Genişletilmiş ve kalın"
      lead="Başlıkta Anybody: genişlik ekseni %125–140'a açılmış, 900 kalınlıkta. Gövde ve arayüzde Rajdhani: dar, keskin, hızlı okunur. Skor ve süre rakamlarında Orbitron. Yalnız başlık eğilir; gövde metni hiç eğilmez."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
        <EsportsCard as="article" className="p-7" sarmal="lg:col-span-4" data-ornek-anybody="">
          <p className="t-etiket t-soluk">Anybody · başlık</p>
          <p className="baslik-hiz mt-3 !text-[clamp(3rem,7vw,4.5rem)]" aria-hidden="true">
            Aa
          </p>
          <p className="t-h3 mt-2">Vektör Kupası</p>
        </EsportsCard>
        <EsportsCard vurgu="lime" as="article" className="p-7" sarmal="lg:col-span-4" data-ornek-rajdhani="">
          <p className="t-etiket t-soluk">Rajdhani · gövde ve arayüz</p>
          <p ref={govde} className="mt-3 max-w-[40ch] text-[1.25rem]">
            Sekiz takım üç gün boyunca aynı arenada yarışır. Her maç en iyi üç harita; her raunt yüz yirmi saniye.
          </p>
          <p className="mt-3 font-bold tracking-wider uppercase">Yaz 500 · 600 · 700</p>
          <p className="t-alt mt-2">Türkçenin bütün harfleri: ğüşiöçı İĞÜŞÖÇ ve ₺ işareti.</p>
        </EsportsCard>
        <EsportsCard vurgu="turuncu" as="article" className="p-7" sarmal="lg:col-span-4" data-ornek-orbitron="">
          <p className="t-etiket t-soluk">Orbitron · skor ve süre</p>
          <p className="rakam mt-3 text-[clamp(2.5rem,6vw,3.5rem)] leading-none font-black">02:47</p>
          <p className="rakam mt-3 text-[1.5rem] font-bold">18.432 · 1–1 · 9/16</p>
          <p className="t-alt mt-2">Yalnız rakam ve ASCII işaretler; Türkçe harf içermediği için etiketlerde kullanılmaz.</p>
        </EsportsCard>

        <div className="grid grid-cols-1 content-start gap-5 lg:col-span-4" data-yazi-kontrol="">
          <Alan label="Başlık metni">{(p) => <input className="alan" {...p} value={metin} onChange={(e) => setMetin(e.target.value)} maxLength={22} data-yazi-girdi="" />}</Alan>
          <Aralik id="yazi-boy" label="Boyut" value={boy} min={32} max={120} onChange={setBoy} format={(v) => `${v} px`} />
          <Aralik id="yazi-gen" label="Genişlik (wdth)" value={genislik} min={50} max={150} onChange={setGenislik} format={(v) => `%${v}`} />
          <Aralik id="yazi-agirlik" label="Kalınlık (wght)" value={agirlik} min={100} max={900} step={100} onChange={setAgirlik} />
          <Aralik id="yazi-egim" label="Eğim" value={egim} min={0} max={20} onChange={setEgim} format={(v) => `${v}°`} />
          <Secim<Efekt>
            legend="Efekt"
            name="yazi-efekt"
            value={efekt}
            onChange={setEfekt}
            options={[
              { id: 'dolu', ad: 'Beyaz' },
              { id: 'vurgu', ad: 'Vurgu' },
              { id: 'neon', ad: 'Neon' },
            ]}
          />
        </div>
        <div className="min-w-0 lg:col-span-8">
          <EsportsCard kesim="egik" as="div" className="overflow-x-clip p-7">
            <p ref={orn} className="bas-ornek m-0" data-efekt={efekt} style={{ fontSize: boy, fontStretch: `${genislik}%`, fontWeight: agirlik } as CSSProperties} data-yazi-ornek="">
              <span className="inline-block" style={{ transform: `skewX(${-egim}deg)` }}>
                {metin || 'Vektör-9'}
              </span>
            </p>
          </EsportsCard>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4" data-yazi-olcum={`${olc.fs}|${olc.ff}|${olc.ws}`}>
            <div>
              <dt className="t-etiket t-soluk">Yazı tipi</dt>
              <dd className="m-0 mt-1 text-[1.1875rem]">{olc.ff}</dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Boyut</dt>
              <dd className="rakam m-0 mt-1 text-[1.1875rem]">{olc.fs}</dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Genişlik · kalınlık</dt>
              <dd className="rakam m-0 mt-1 text-[1.1875rem]">{olc.ws}</dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Gövde eğimi</dt>
              <dd className="rakam m-0 mt-1 text-[1.1875rem]" data-govde-egim={olc.gt}>
                {olc.gt === 'none' ? 'yok' : olc.gt}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 6 · Şekil ───────────────────────── */

export function Sekil() {
  const [kes, setKes] = useState(30)
  const [egim, setEgim] = useState(24)
  const kutu = useRef<HTMLDivElement>(null)
  const egikKart = useRef<HTMLDivElement>(null)
  const [aci, setAci] = useState({ kes: '', egim: '', cp: '' })
  useEffect(() => {
    const hesapla = () => {
      const cp = getComputedStyle(kutu.current!).clipPath
      const m = /calc\(100% - ([\d.]+)px\) 0px, 100% ([\d.]+)px/.exec(cp)
      const kes_ = m ? (Math.atan2(+m[2], +m[1]) * 180) / Math.PI : 0
      const h = egikKart.current!.getBoundingClientRect().height
      setAci({ kes: kes_.toFixed(1).replace('.', ','), egim: ((Math.atan2(egim, h) * 180) / Math.PI).toFixed(1).replace('.', ','), cp })
    }
    hesapla()
    const ro = new ResizeObserver(hesapla)
    ro.observe(egikKart.current!)
    return () => ro.disconnect()
  }, [kes, egim])
  const say = useSay('.kart', [kes])
  return (
    <Bolum id="sekil" no="04" madde="Madde 6 · Şekil dili" baslik="45 derece, üçgen, ok" lead="Köşeler 45 derece kesilir: yatay ve dikey bacak eşittir. Kart kenarı ya da eğik, düğme paralelkenar, sekme yamuk. Üçgenler ve ok formları yön ve hız verir.">
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
        <div className="grid grid-cols-1 content-start gap-5 lg:col-span-4">
          <Aralik id="kes-boy" label="Köşe kesimi" value={kes} min={0} max={60} onChange={setKes} format={(v) => `${v} px`} />
          <Aralik id="egim-boy" label="Kart eğimi (sağ kenar)" value={egim} min={0} max={60} onChange={setEgim} format={(v) => `${v} px`} />
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2" data-sekil-olcum="">
            <dt className="t-etiket t-soluk">Kesim açısı</dt>
            <dd className="rakam m-0 font-bold" data-kes-aci={aci.kes}>
              {aci.kes}°
            </dd>
            <dt className="t-etiket t-soluk">Eğik kenar açısı</dt>
            <dd className="rakam m-0 font-bold" data-egim-aci={aci.egim}>
              {aci.egim}°
            </dd>
            <dt className="t-etiket t-soluk">Sayfadaki kart</dt>
            <dd className="rakam m-0 font-bold">{say}</dd>
          </dl>
        </div>
        <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-3 lg:col-span-8">
          <div ref={kutu} className="kes-ornek" style={{ ['--kes-d' as string]: `${kes}px` } as CSSProperties} data-kes-ornek="">
            <span className="rakam text-[1.25rem] font-bold">45°</span>
          </div>
          <div className="grid justify-items-center gap-2">
            <div className="ucgen" aria-hidden="true" />
            <p className="t-etiket t-soluk">Üçgen</p>
          </div>
          <div className="grid justify-items-center gap-2">
            <div className="ok-sekil" aria-hidden="true" />
            <p className="t-etiket t-soluk">Ok</p>
          </div>
        </div>
        <div ref={egikKart} className="lg:col-span-6" data-egik-kart="">
          <EsportsCard kesim="egik" className="p-6" style={{ ['--egim' as string]: `${egim}px` } as CSSProperties}>
            <p className="t-etiket t-soluk">Shape/SlantedCard</p>
            <p className="t-h3 mt-2">Eğik kart</p>
            <p className="mt-2 text-[1.1875rem]">Sol kenarda dört piksellik neon şerit, sağ kenar eğik. Eğim piksel olarak verilir; açı kart yüksekliğine bağlıdır.</p>
          </EsportsCard>
        </div>
        <div className="grid grid-cols-1 content-center gap-6 lg:col-span-6">
          <span className="egik-serit" aria-hidden="true" />
          <p className="t-alt">Şerit −55° eğimli tekrar eden çizgilerdir; tehlike ve hız bölgelerini ayırır.</p>
          <p className="t-alt" data-clip-yazi={aci.cp}>
            Hesaplanan clip-path okunur; kesim açısı çokgen noktalarından hesaplanır.
          </p>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 7 · Derinlik ───────────────────────── */

export function Derinlik() {
  const [yaricap, setYaricap] = useState(14)
  const [siddet, setSiddet] = useState(0.6)
  const [x, setX] = useState(8)
  const [y, setY] = useState(8)
  const [renk, setRenk] = useState<Vurgu>('mavi')
  const rgb = VURGULAR.find((v) => v.id === renk)!.rgb.replace(/ /g, ', ')
  const parla = `drop-shadow(0 0 ${yaricap}px rgba(${rgb}, ${siddet}))`
  const golge = `drop-shadow(${x}px ${y}px 0 rgba(0, 0, 0, 0.6))`
  const say = useOlc(() => ({ f: [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).filter !== 'none').length }), [yaricap, x], { f: 0 })
  return (
    <Bolum
      id="derinlik"
      no="05"
      madde="Madde 7 · Z ekseni ve gölge"
      baslik="Neon parlama, keskin gölge"
      lead="İki gölge dili var: dışa doğru neon parlama ve kesik kenarı izleyen, bulanıklığı olmayan sert gölge. İkisi de `drop-shadow` ile çizilir; bu yüzden kesik köşe ve eğik kenar gölgede de korunur."
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
        <div className="grid grid-cols-1 content-start gap-5 lg:col-span-4" data-derinlik-kontrol="">
          <Aralik id="parla-yaricap" label="Parlama yarıçapı" value={yaricap} min={0} max={40} onChange={setYaricap} format={(v) => `${v} px`} />
          <Aralik id="parla-siddet" label="Parlama şiddeti" value={siddet} min={0} max={1} step={0.05} onChange={setSiddet} format={(v) => v.toFixed(2).replace('.', ',')} />
          <Secim<Vurgu>
            legend="Parlama rengi"
            name="parla-renk"
            value={renk}
            onChange={setRenk}
            options={[
              { id: 'mavi', ad: 'Mavi' },
              { id: 'lime', ad: 'Lime' },
              { id: 'turuncu', ad: 'Turuncu' },
            ]}
          />
          <Aralik id="golge-x" label="Gölge yatay" value={x} min={0} max={20} onChange={setX} format={(v) => `${v} px`} />
          <Aralik id="golge-y" label="Gölge dikey" value={y} min={0} max={20} onChange={setY} format={(v) => `${v} px`} />
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-8">
          <div style={{ filter: parla }} data-parlama={parla}>
            <div className="parla-kutu" style={{ clipPath: 'polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 26px 100%, 0 calc(100% - 26px))', borderLeftColor: `rgb(${rgb})` }}>
              <p className="t-etiket t-soluk">Neon parlama</p>
              <p className="t-h3 mt-2">Kesik kenar boyunca</p>
              <p className="mt-2 text-[1.125rem]">Parlama şeklin dışına değil, şeklin kendisine uyar.</p>
            </div>
          </div>
          <div style={{ filter: golge }} data-golge={golge}>
            <div className="golge-kutu" style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%)' }}>
              <p className="t-etiket t-soluk">Keskin gölge</p>
              <p className="t-h3 mt-2">Sıfır bulanıklık</p>
              <p className="mt-2 text-[1.125rem]">Gölge de eğik kenarı izler.</p>
            </div>
          </div>
          <div className="sm:col-span-2">
            <Kod label="Üretilen filtre" dar>{`filter: ${parla}\n        ${golge};`}</Kod>
          </div>
        </div>
        <div className="lg:col-span-12">
          <p className="t-etiket t-soluk">Z ekseni · üç pencere üst üste</p>
          <div className="z-yigin mt-4" data-z-yigin="">
            {[0, 1, 2].map((i) => (
              <div key={i} className="z-pencere" style={{ ['--z' as string]: i } as CSSProperties}>
                <p className="t-etiket t-soluk">Z {i}</p>
                <p className="t-h3 mt-1 !text-[1.125rem]">{['Arka panel', 'Orta panel', 'Ön panel'][i]}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-12" data-filtre-say={say.f}>
          <p className="t-etiket t-soluk">Canlı sayım</p>
          <p className="mt-2 text-[1.25rem]">
            <span className="rakam text-[2rem]">{say.f}</span> öğede drop-shadow filtresi.
          </p>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 8 · Yüzey ───────────────────────── */

export function Yuzey() {
  const [yog, setYog] = useState(1)
  const [buyut, setBuyut] = useState(6)
  const sayilar = useSay('.kart[data-yuzey]', [yog])
  const y = [
    { id: 'karbon' as const, ad: 'Karbon fiber', not: 'Çapraz örgü: 12 × 12 piksellik tek SVG karosu; dört tonlu iplik.' },
    { id: 'celik' as const, ad: 'Fırçalanmış çelik', not: 'Yatay ışık çizgileri ve soğuk gradyan; beyaz metin.' },
    { id: 'plastik' as const, ad: 'Mat siyah plastik', not: 'İnce tane ve üst kenarda hafif parlak çizgi.' },
  ]
  return (
    <Bolum
      id="yuzey"
      no="06"
      madde="Madde 8 · Doku ve yüzey"
      baslik="Karbon, çelik, plastik"
      lead="Yüzeyler görsel dosyası değil, küçük SVG karolarıdır. Karbon fiber yalnız zemini hafifçe aydınlatan bir örgüdür; metnin altında kalır. Yoğunluk kaydırıcısı hepsini birden açar ve kapatır; yüksek kontrastta doku çizilmez."
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-10">
        <div className="grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          <Aralik id="doku-yog" label="Doku yoğunluğu" value={yog} min={0} max={1} step={0.1} onChange={setYog} format={(v) => `%${Math.round(v * 100)}`} />
          <Aralik id="doku-buyut" label="Örgü büyütme" value={buyut} min={1} max={10} onChange={setBuyut} format={(v) => `${v}×`} />
        </div>
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" style={{ ['--doku-yogunluk' as string]: yog } as CSSProperties} data-dokular="">
          {y.map((d, i) => (
            <li key={d.id}>
              <EsportsCard yuzey={d.id} vurgu={(['mavi', 'lime', 'turuncu'] as Vurgu[])[i]} className="doku-ornek p-6" as="article" sarmal="h-full" data-doku-kart={d.id}>
                <p className="t-etiket t-soluk">Doku</p>
                <h3 className="t-h3 mt-2 !text-[1.25rem]">{d.ad}</h3>
                <p className="mt-2 text-[1.125rem]">{d.not}</p>
              </EsportsCard>
            </li>
          ))}
          <li className="grid content-center gap-2 p-4" data-doku-say={sayilar}>
            <p className="t-etiket t-soluk">Canlı sayım</p>
            <p className="rakam text-[2.5rem] leading-none">{sayilar}</p>
            <p className="t-alt">yüzeyli kart · görsel dosyası 0</p>
          </li>
        </ul>
        <div>
          <p className="t-etiket t-soluk">Karbon örgüsü · büyütülmüş</p>
          <div
            className="mt-3 h-[120px] w-full max-w-3xl border-l-4 border-[color:var(--vurgu)]"
            style={{ backgroundColor: KARBON, backgroundImage: 'var(--doku-karbon)', backgroundSize: `${12 * buyut}px`, imageRendering: 'pixelated' }}
            data-karbon-buyuk=""
            role="img"
            aria-label="Karbon fiber örgüsünün büyütülmüş görüntüsü"
          />
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 9 · Simgeler ───────────────────────── */

type Grup = 'hepsi' | 'silah' | 'savunma' | 'teknik' | 'oyun'
export function Simge() {
  const [grup, setGrup] = useState<Grup>('hepsi')
  const [boy, setBoy] = useState(56)
  const [say, setSay] = useState({ n: 0, tur: 0 })
  useEffect(() => {
    const t = window.setTimeout(() => {
      const hepsi = Array.from(document.querySelectorAll<SVGElement>('main svg.oyun-ikon'))
      setSay({ n: hepsi.length, tur: new Set(hepsi.map((s) => s.dataset.ikon)).size })
    }, 500)
    return () => window.clearTimeout(t)
  }, [grup, boy])
  const liste = useMemo(() => IKONLAR.filter((i) => grup === 'hepsi' || i.grup === grup), [grup])
  return (
    <Bolum id="ikon" no="07" madde="Madde 9 · İkonografi" baslik="Askeri ve endüstriyel" lead="Nişangâh, füze, zırh, radar, dron, işlemci ve kumanda: keskin hatlı, kare uçlu, sivri köşeli çizgi simgeler. Ana hat çizgi rengindedir; küçük dolgular sayfa vurgusunu izler.">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
        <div className="grid grid-cols-1 content-start gap-6 lg:col-span-3">
          <Secim<Grup>
            legend="Grup"
            name="ikon-grup"
            value={grup}
            onChange={setGrup}
            options={[
              { id: 'hepsi', ad: 'Hepsi' },
              { id: 'silah', ad: 'Silah' },
              { id: 'savunma', ad: 'Savunma' },
              { id: 'teknik', ad: 'Teknik' },
              { id: 'oyun', ad: 'Oyun' },
            ]}
          />
          <Aralik id="ikon-boy" label="Boyut" value={boy} min={32} max={96} step={4} onChange={setBoy} format={(v) => `${v} px`} />
          <div data-ikon-say={`${say.n}|${say.tur}`}>
            <p className="t-etiket t-soluk">Sayfadaki simge</p>
            <p className="rakam text-[2.25rem] leading-none">{say.n}</p>
            <p className="t-alt mt-1">{say.tur} farklı çizim, hepsi SVG.</p>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-4" data-glifler="">
          {liste.map((i) => (
            <li key={i.ad} data-glif-kart={i.ad}>
              <div className="ikon-kart">
                <span className="text-[color:var(--m)]">
                  <Ikon ad={i.ad} boy={boy} />
                </span>
                <p className="mt-3 leading-tight font-bold">{i.anlam}</p>
                <p className="t-alt capitalize">{i.grup}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Bolum>
  )
}
