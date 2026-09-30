import { useEffect, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import { Ayrac, Bolum } from '../components/Bolum'
import { GothicCard, type YuzeyAd } from '../components/GothicCard'
import { Dugme } from '../components/Dugme'
import { useDokuTepe, useOlc, type DokuAd } from '../components/hooks'
import { Ikon } from '../components/Ikon'
import { Muhur } from '../components/Muhur'
import { Alan, Anahtar, Aralik, Isaret, Kod, Secim } from '../components/ui'
import { kontrast as krn, oran } from '../lib/contrast'
import { IKONLAR, IKON_ADI, type IkonAd } from '../lib/data'
import { useGothic } from '../lib/store'

const sinif = (o: number, buyuk = false) => (o >= 7 ? 'AAA' : o >= 4.5 ? (buyuk ? 'AAA · büyük' : 'AA') : o >= 3 ? (buyuk ? 'AA · büyük' : 'yalnız büyük yazı, çizgi') : 'süs, yazı taşımaz')

/* ───────── Madde 4 ───────── */

const PALET = [
  {
    ad: 'Gece Siyahı',
    hex: '#0A0A0C',
    rol: 'Zemin, kartın iç yüzü, boğucu karanlık',
    yazi: '#D1D5DB',
    ikon: 'ay' as IkonAd,
  },
  {
    ad: 'Kuru Kan Kırmızısı',
    hex: '#5C0606',
    rol: 'Kenarlık, mühür, ilerleme çubuğu, ışık sızıntısı',
    yazi: '#E6E2DC',
    ikon: 'damla' as IkonAd,
  },
  {
    ad: 'Pas Rengi',
    hex: '#8B4513',
    rol: 'Zincir lekeleri, süs çizgileri, ikincil vurgu',
    yazi: '#FFFFFF',
    ikon: 'zincir' as IkonAd,
  },
  {
    ad: 'Gümüş Gri',
    hex: '#A0A0A0',
    rol: 'Metal, ince çizgi, simge, denetim sınırı',
    yazi: '#0A0A0C',
    ikon: 'mizrak' as IkonAd,
  },
]

export function Renk() {
  const T = useDokuTepe()
  const { vurgu, setVurgu } = useGothic()
  const tepe = T.pas?.hex ?? '#2a2018'
  const satirlar: {
    ad: string
    on: string
    zemin: string
    buyuk?: boolean
    not: string
  }[] = [
    {
      ad: 'Gövde metni',
      on: '#D1D5DB',
      zemin: '#0A0A0C',
      not: 'Madde 18: soluk gümüş, saf beyaz değil',
    },
    {
      ad: 'Soluk (ikincil) metin',
      on: '#BCBEC3',
      zemin: '#0A0A0C',
      not: 'Etiket, alt açıklama',
    },
    {
      ad: 'Soluk metin · paslı demir dokunun en açık noktası',
      on: '#BCBEC3',
      zemin: tepe,
      not: 'Doku ölçümü canlıdır',
    },
    {
      ad: 'Kan kırmızısı metin (açık ton)',
      on: '#FF9A8C',
      zemin: '#0A0A0C',
      not: '#5C0606 küçük yazıda okunmaz; açık tonu kullanılır',
    },
    {
      ad: 'Pas metni (açık ton)',
      on: '#ECB586',
      zemin: '#0A0A0C',
      not: 'Tablo başlığı, ikincil vurgu',
    },
    {
      ad: 'Düğme yazısı · kan dolgunun en açık ucu',
      on: '#E6E2DC',
      zemin: '#7A0C0C',
      not: 'Dolgu #7A0C0C → #5C0606',
    },
    {
      ad: 'Gümüş sınır ve simge',
      on: '#A0A0A0',
      zemin: '#0A0A0C',
      buyuk: true,
      not: 'Denetim sınırı için en az 3:1 gerekir',
    },
    {
      ad: 'Kuru kan #5C0606 · zemin karşısında',
      on: '#5C0606',
      zemin: '#0A0A0C',
      not: 'Yalnız süs ve dolgu; sınır tek başına ona bırakılmaz',
    },
    {
      ad: 'Pas #8B4513 · zemin karşısında',
      on: '#8B4513',
      zemin: '#0A0A0C',
      not: 'Yalnız süs çizgisi',
    },
  ]
  return (
    <Bolum id="renk" no="02" madde="Madde 4 · Renk paleti" baslik="Dört koyu ton" lead="Gece siyahı ağırlığı taşır, kuru kan ışığı, pas ve gümüş metali verir. Renkler dolgu ve ışıktır; okunacak metin hep soluk gümüştedir.">
      <ul className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4" data-palet="">
        {PALET.map((p) => (
          <li key={p.hex} className="min-w-0">
            <div className="renk-blok" style={{ background: p.hex, color: p.yazi }} data-renk={p.hex}>
              <Ikon ad={p.ikon} boy={40} />
              <p className="t-h3" style={{ color: p.yazi }}>
                {p.ad}
              </p>
              <p className="rakam mt-1 text-[1.125rem] font-semibold">{p.hex}</p>
            </div>
            <p className="t-alt mt-3">{p.rol}</p>
          </li>
        ))}
      </ul>

      <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <h3 className="t-h3">Oran</h3>
          <p className="t-alt mt-2">Karanlık ağır basar; kırmızı yalnız ışığın geldiği yerde belirir.</p>
          <div className="oran-cubuk mt-6" role="img" aria-label="Renk dağılımı: yüzde 64 gece siyahı, yüzde 20 gümüş ve metin, yüzde 12 kuru kan, yüzde 4 pas">
            <span style={{ flex: 64, background: '#0A0A0C' }} />
            <span style={{ flex: 20, background: '#A0A0A0' }} />
            <span style={{ flex: 12, background: '#5C0606' }} />
            <span style={{ flex: 4, background: '#8B4513' }} />
          </div>
          <ul className="rakam mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[1.0625rem]">
            <li>Gece siyahı · %64</li>
            <li>Gümüş, metin · %20</li>
            <li>Kuru kan · %12</li>
            <li>Pas · %4</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <span className="rozet" data-ton="kan">
              Kan kırmızısı
            </span>
            <span className="rozet" data-ton="pas">
              Pas
            </span>
            <span className="rozet" data-ton="gumus">
              Gümüş
            </span>
          </div>
          <div className="mt-12">
            <h3 className="t-h3">Vurgu kipleri</h3>
            <p className="t-alt mt-2">Sayfanın vurgusu iki kiptir: kuru kan ışığı ya da pas ışığı. Yazı ve zemin değişmez.</p>
            <div className="mt-5">
              <Secim<'kan' | 'pas'>
                legend="Vurgu"
                name="renk-vurgu"
                gizli
                value={vurgu}
                onChange={setVurgu}
                options={[
                  { id: 'kan', ad: 'Kuru kan' },
                  { id: 'pas', ad: 'Pas' },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <h3 className="t-h3">Kontrast, ölçülmüş</h3>
          <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Kontrast tablosu">
            <table className="tablo w-full min-w-[640px]" data-kontrast-tablo="">
              <caption className="t-alt">WCAG 2.x göreli parlaklık oranı; sınıf yazı boyutuna göre.</caption>
              <thead>
                <tr>
                  <th scope="col">Çift</th>
                  <th scope="col">Oran</th>
                  <th scope="col">Sınıf</th>
                </tr>
              </thead>
              <tbody>
                {satirlar.map((s) => {
                  const o = krn(s.on, s.zemin)
                  return (
                    <tr key={s.ad}>
                      <th scope="row">
                        <span className="flex items-start gap-3">
                          <span className="renk-ornek shrink-0" style={{ background: s.zemin, color: s.on }} aria-hidden="true">
                            Aa
                          </span>
                          <span className="min-w-0">
                            {s.ad}
                            <span className="t-alt block font-normal">{s.not}</span>
                          </span>
                        </span>
                      </th>
                      <td className="rakam whitespace-nowrap">{oran(o)}</td>
                      <td className="whitespace-nowrap">
                        <Isaret gecti={o >= 3} />
                        {sinif(o, s.buyuk)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────── Madde 5 ───────── */

type YaziAile = 'kara' | 'baslik' | 'govde'
const AILE: Record<YaziAile, { ad: string; css: string; min: number }> = {
  kara: { ad: 'Pirata One', css: 'var(--font-kara)', min: 48 },
  baslik: { ad: 'Grenze Gotisch', css: 'var(--font-baslik)', min: 19 },
  govde: { ad: 'Spectral', css: 'var(--font-govde)', min: 12 },
}

export function Yazi() {
  const [metin, setMetin] = useState('Şafakta çanlar ağladı; İğne, ığdır, öğüt, çürük, ÜŞĞÇÖ')
  const [boyut, setBoyut] = useState(64)
  const [aile, setAile] = useState<YaziAile>('kara')
  const [oto, setOto] = useState(true)
  const uygulanan: YaziAile = oto && boyut < AILE[aile].min ? 'govde' : aile
  const zayif = !oto && boyut < AILE[aile].min
  const ornek = useRef<HTMLParagraphElement>(null)
  const olculen = useOlc(
    () => {
      const e = ornek.current
      if (!e) return ''
      const s = getComputedStyle(e)
      return `${s.fontFamily.split(',')[0].replace(/"/g, '')} · ${Math.round(parseFloat(s.fontSize))} px`
    },
    [boyut, aile, oto, metin],
    '',
    150,
  )
  const olcek = [
    {
      ad: 'Kapak',
      sinif: 'baslik-kara',
      ornek: 'Ağıt',
      boyut: 'clamp 56–152 px',
      not: 'Pirata One · yalnız marka ve kapak',
    },
    {
      ad: 'Bölüm başlığı',
      sinif: 'baslik-h2',
      ornek: 'Manastırın künyesi',
      boyut: 'clamp 36–60 px',
      not: 'Grenze Gotisch 700',
    },
    {
      ad: 'Kart başlığı',
      sinif: 't-h3',
      ornek: 'Kilise mahzeni',
      boyut: '28 px',
      not: 'Grenze Gotisch 700',
    },
    {
      ad: 'Gövde',
      sinif: '',
      ornek: 'Karanlık, gotik mimariden beslenir.',
      boyut: '20 px / 1,6',
      not: 'Spectral 400 · sert ve okunaklı serif',
    },
    {
      ad: 'Alıntı',
      sinif: 'alinti',
      ornek: '“Yalnız zincirler ağlıyor.”',
      boyut: 'clamp 24–32 px',
      not: 'Cormorant italik · epigraf',
    },
    {
      ad: 'Etiket',
      sinif: 't-etiket',
      ornek: 'Kayıt 02 · Mahzen',
      boyut: '14 px, aralık 0,16 em',
      not: 'Spectral 600 · büyük harf',
    },
  ]
  return (
    <Bolum id="yazi" no="03" madde="Madde 5 · Tipografi" baslik="Kara harf ve sert serif" lead="Sivri uçlu gotik harfler yalnızca büyük başlıkta durur; okunacak her şey sert ama açık bir serif olan Spectral'dadır.">
      <div className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-12">
        <ul className="grid min-w-0 grid-cols-1 gap-12 lg:col-span-6" data-aileler="">
          <li>
            <p className="t-etiket t-soluk">Pirata One · Old English / blackletter</p>
            <p className="mt-2 text-[clamp(3rem,7vw,5rem)] leading-[0.95]" style={{ fontFamily: 'var(--font-kara)' }} data-ornek="kara">
              Ağıt Manastırı
            </p>
            <p className="t-alt mt-2">Yalnız 48 px ve üstü. ₺ simgesi yoktur; para simgesi Spectral ile yazılır.</p>
          </li>
          <li>
            <p className="t-etiket t-soluk">Grenze Gotisch · gotik başlık</p>
            <p className="mt-2 text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-bold" style={{ fontFamily: 'var(--font-baslik)' }} data-ornek="baslik">
              Kuzgun Kapısı&rsquo;nın son çanı
            </p>
            <p className="t-alt mt-2">19 px ve üstü; düğmelerde ve kart başlıklarında. 100–900 arası ağırlık, ₺ dahil.</p>
          </li>
          <li>
            <p className="t-etiket t-soluk">Spectral · okunabilir sert serif</p>
            <p className="mt-2 max-w-[46ch] text-[1.25rem]" style={{ fontFamily: 'var(--font-govde)' }} data-ornek="govde">
              Manastırın avlusunda sis alçaldı. Zincirlerin sesi duvarlara çarpıp geri döndü; fenerin ışığı üç adım ötesine yetmiyordu. ₺ 1.250,00
            </p>
          </li>
          <li>
            <p className="t-etiket t-soluk">Cormorant · italik alıntı</p>
            <p className="alinti mt-2 max-w-[30ch]" data-ornek="alinti">
              “Karanlık, ışığın yokluğu değil; bekleyen bir misafirdir.”
            </p>
          </li>
        </ul>

        <GothicCard as="section" aria-label="Okunabilirlik denemesi" yuzey="kadife" sarmal="lg:col-span-6" data-yazi-deneme="">
          <h3 className="t-h3">Okunabilirlik denemesi</h3>
          <p className="t-alt mt-2">Kara harfi küçültünce ne olduğunu gör. Otomatik yedek açıksa boyut eşiğin altına inince Spectral&rsquo;a döner.</p>
          <div className="mt-6 grid gap-6">
            <Alan label="Metin">{(p) => <input {...p} className="alan" value={metin} onChange={(e) => setMetin(e.target.value)} />}</Alan>
            <Aralik label="Boyut" value={boyut} min={12} max={96} onChange={setBoyut} format={(v) => `${v} px`} />
            <Secim<YaziAile>
              legend="Yazı tipi"
              name="yazi-aile"
              value={aile}
              onChange={setAile}
              options={[
                { id: 'kara', ad: 'Pirata One' },
                { id: 'baslik', ad: 'Grenze Gotisch' },
                { id: 'govde', ad: 'Spectral' },
              ]}
            />
            <Anahtar label="Otomatik yedek" hint={`Eşik: ${AILE[aile].min} px altında Spectral kullanılır.`} checked={oto} onChange={setOto} />
          </div>
          <div className="deneme-alan mt-6" data-deneme-alan="">
            <p
              ref={ornek}
              style={{
                fontFamily: AILE[uygulanan].css,
                fontSize: `${boyut}px`,
                lineHeight: 1.15,
                fontWeight: uygulanan === 'baslik' ? 700 : 400,
              }}
              data-deneme-ornek=""
            >
              {metin || '—'}
            </p>
          </div>
          <p className="rakam mt-4 text-[1.0625rem]" data-deneme-bilgi="">
            <Isaret gecti={!zayif} />
            {zayif ? `Kara harf ${boyut} px'te zor okunur; Otomatik yedeği aç.` : 'Okunabilir.'} <span className="t-soluk">Uygulanan: {olculen || `${AILE[uygulanan].ad} · ${boyut} px`}</span>
          </p>
        </GothicCard>
      </div>

      <div className="mt-16">
        <h3 className="t-h3">Ölçek</h3>
        <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Yazı ölçeği">
          <table className="tablo w-full min-w-[720px]">
            <thead>
              <tr>
                <th scope="col">Rol</th>
                <th scope="col">Örnek</th>
                <th scope="col">Boyut</th>
                <th scope="col">Yazı tipi</th>
              </tr>
            </thead>
            <tbody>
              {olcek.map((o) => (
                <tr key={o.ad}>
                  <th scope="row">{o.ad}</th>
                  <td>
                    <span
                      className={cx(o.sinif, 'block')}
                      style={o.sinif === 'baslik-kara' ? { fontSize: '3rem', lineHeight: 1 } : o.sinif === 'baslik-h2' ? { fontSize: '2.25rem', lineHeight: 1.1 } : o.sinif === 't-h3' ? { fontSize: '1.75rem' } : o.sinif === 'alinti' ? { fontSize: '1.5rem' } : undefined}
                    >
                      {o.ornek}
                    </span>
                  </td>
                  <td className="rakam whitespace-nowrap">{o.boyut}</td>
                  <td className="t-alt">{o.not}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────── Madde 6 ───────── */

export function Sekil() {
  const [h, setH] = useState(56)
  const [percin, setPercin] = useState(true)
  const kartRef = useRef<HTMLDivElement>(null)
  const ok = useOlc(
    () => {
      const e = kartRef.current?.querySelector('.gk') as HTMLElement | null
      if (!e) return { n: 0, k: '' }
      const cp = getComputedStyle(e).clipPath
      return {
        n: cp === 'none' ? 0 : cp.split(', ').length,
        k: getComputedStyle(e).getPropertyValue('--k').trim(),
      }
    },
    [h],
    { n: 0, k: '' },
    200,
  )
  return (
    <Bolum id="sekil" no="04" madde="Madde 6 · Şekil dili" baslik="Kemer, mızrak, mühür, perçin" lead="Gotik kemer formları, sivri uçlu mızrak motifleri, dairesel mühürler ve demir perçinli kutular: dört biçim, hepsi aynı sivri geometriden gelir.">
      <div className="grid grid-cols-1 gap-x-12 gap-y-20 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-6" ref={kartRef}>
          <p className="t-etiket t-soluk">Gotik kemer</p>
          <div className="mt-5">
            <GothicCard kemerH={h} as="article" yuzey="tas" data-sekil-kemer="">
              <h3 className="t-h3">Sivri kemer</h3>
              <p className="t-alt mt-2">Yükseklik değişir, profil aynı kalır: tepe sivri, omuz dik.</p>
            </GothicCard>
          </div>
          <div className="mt-8">
            <Aralik label="Kemer yüksekliği" value={h} min={0} max={110} onChange={setH} format={(v) => `${v} px`} />
            <p className="rakam t-alt mt-2" data-kemer-bilgi="">
              clip-path: {ok.n ? `polygon, ${ok.n} nokta` : 'düz'} · --k {ok.k || `${h}px`}
            </p>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-6">
          <p className="t-etiket t-soluk">Sivri uçlu mızrak motifleri</p>
          <div className="mt-5 grid gap-8">
            <div>
              <Ayrac tam />
              <p className="t-alt mt-2">Mızrak çiti: başlık altı ve üst bilgi ayracı.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <span className="etiket-sivri">Sivri uçlu etiket</span>
              <span className="etiket-sivri" data-ton="kan">
                Kan mührü
              </span>
              <span className="text-[color:var(--gumus)]">
                <Ikon ad="mizrak" boy={56} />
              </span>
              <span className="text-[color:var(--gumus)]">
                <Ikon ad="hancer" boy={56} />
              </span>
            </div>
          </div>

          <p className="t-etiket t-soluk mt-14">Dairesel mühürler</p>
          <div className="mt-5 flex flex-wrap items-end gap-8" data-muhurler="">
            <Muhur ikon="hac" boy={104} baslik="Kan mührü, haç" />
            <Muhur ikon="kafatasi" boy={88} tur="pas" baslik="Pas mührü, kafatası" />
            <Muhur ikon="muhur" boy={72} tur="gumus" baslik="Gümüş mühür" />
            <Muhur ikon="kuzgun" boy={56} baslik="Küçük mühür, kuzgun" />
          </div>
        </div>

        <div className="min-w-0 lg:col-span-12">
          <p className="t-etiket t-soluk">Demir perçinli kutular</p>
          <div className="mt-5 grid grid-cols-1 items-start gap-x-12 gap-y-10 md:grid-cols-12">
            <GothicCard kemer="duz" yuzey="demir" as="article" sarmal="md:col-span-7" className="percin-kutu" data-percin={percin ? undefined : 'yok'} data-sekil-percin="">
              <h3 className="t-h3">Demir kutu</h3>
              <p className="mt-2 text-[1.125rem]">Köşelerde dört perçin, içeride ince pas çizgisi. Kutu düz kesimlidir; sivriliği köşe levhaları ve kemerli komşuları verir.</p>
            </GothicCard>
            <div className="md:col-span-5">
              <Anahtar label="Perçinler" hint="Köşe perçinlerini gösterir ya da gizler." checked={percin} onChange={setPercin} />
            </div>
          </div>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────── Madde 7 ───────── */

const KATMANLAR: {
  id: 'sizinti' | 'doku' | 'golge' | 'sus'
  ad: string
  z: string
  aciklama: string
}[] = [
  {
    id: 'sizinti',
    ad: 'Kırmızı ışık sızıntısı',
    z: 'z −1 · kartın arkası',
    aciklama: 'Bulanık, kırmızı radyal ışık; kenarlardan taşar ve mum gibi titrer.',
  },
  {
    id: 'doku',
    ad: 'Yüzey dokusu',
    z: 'z −2 · kartın içi',
    aciklama: 'Pas, taş, deri ya da kadife karosu.',
  },
  {
    id: 'golge',
    ad: 'Boğucu iç gölge',
    z: 'z −1 · dokunun üstü',
    aciklama: 'Kenarlara doğru kararan vinyet ve iç halka gölgesi.',
  },
  {
    id: 'sus',
    ad: 'Süs ve perçin',
    z: 'z 0 · içerik altı',
    aciklama: 'Kemer çizgisi, perçinler, pas çizgisi.',
  },
]

export function Derinlik() {
  const [golge, setGolge] = useState(100)
  const [guc, setGuc] = useState(90)
  const [titre, setTitre] = useState(true)
  const [gizli, setGizli] = useState<string[]>([])
  const { hareket } = useGothic()
  const lab = useRef<HTMLDivElement>(null)
  const bilgi = useOlc(
    () => {
      const w = lab.current?.querySelector('.gk-w') as HTMLElement | null
      const g = lab.current?.querySelector('.gk') as HTMLElement | null
      if (!w || !g) return { ic: '', op: '', an: '' }
      return {
        ic: getComputedStyle(g, '::after')
          .boxShadow.replace(/rgba?\([^)]*\)\s*/, '')
          .trim(),
        op: getComputedStyle(w, '::before').opacity,
        an: getComputedStyle(w, '::before').animationDuration,
      }
    },
    [golge, guc, titre, gizli.join(), hareket],
    { ic: '', op: '', an: '' },
    200,
  )
  return (
    <Bolum id="derinlik" no="05" madde="Madde 7 · Z ekseni ve gölge" baslik="Boğucu gölge, sızan ışık" lead="Derin, boğucu iç gölgeler nesneleri karanlığa gömer; arkalarından sızan kırmızı ışık ise onları yerinden ayırır. Katmanları tek tek kapatıp ne yaptıklarını gör.">
      <div className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-12">
        <div ref={lab} className="derinlik-lab min-w-0 lg:col-span-7" data-kapat={gizli.join(' ')} data-titre={titre ? undefined : 'kapali'}>
          <GothicCard
            as="article"
            yuzey="demir"
            data-derinlik-kart=""
            style={{
              ['--ic-golge' as string]: golge / 100,
              ['--sizinti-guc' as string]: guc / 100,
            }}
          >
            <h3 className="t-h3">Kayıp cemaat</h3>
            <p className="mt-3 max-w-[40ch] text-[1.125rem]">Yüz yıllık toz, kandil isi ve nemli taş. Kapının altından kırmızı bir çizgi sızıyor.</p>
            <div className="mt-6">
              <Dugme dar>Kapıyı ittir</Dugme>
            </div>
          </GothicCard>
        </div>
        <div className="grid content-start gap-7 lg:col-span-5">
          <Aralik label="İç gölge yoğunluğu" value={golge} min={0} max={200} step={5} onChange={setGolge} format={(v) => `%${v}`} />
          <Aralik label="Işık sızıntısı gücü" value={guc} min={0} max={100} step={5} onChange={setGuc} format={(v) => `%${v}`} />
          <Anahtar label="Mum titremesi" hint={hareket ? 'Sızıntı yavaş ve düzensiz titrer.' : 'Hareket kapalı: titreme durdu.'} checked={titre} onChange={setTitre} />
          <fieldset className="min-w-0 border-0 p-0">
            <legend className="t-etiket t-soluk mb-3">Katmanlar</legend>
            <ul className="grid gap-4">
              {KATMANLAR.map((k) => {
                const acik = !gizli.includes(k.id)
                return (
                  <li key={k.id}>
                    <Anahtar label={k.ad} hint={`${k.z}. ${k.aciklama}`} checked={acik} onChange={(a) => setGizli((g) => (a ? g.filter((x) => x !== k.id) : [...g, k.id]))} />
                  </li>
                )
              })}
            </ul>
          </fieldset>
        </div>
      </div>
      <p className="rakam t-alt mt-10 max-w-[80ch]" data-derinlik-bilgi="">
        Ölçüm · ışık katmanı opaklığı {bilgi.op || '—'} · titreme döngüsü {bilgi.an || '—'} · iç gölge {bilgi.ic || '—'}
      </p>
    </Bolum>
  )
}

/* ───────── Madde 8 ───────── */

const YUZEYLER: {
  id: YuzeyAd
  doku: DokuAd
  ad: string
  metin: string
  yirtik?: boolean
}[] = [
  {
    id: 'demir',
    doku: 'pas',
    ad: 'Paslı demir',
    metin: 'Turuncu pas lekeleri, oyuklar ve ince çizikler.',
  },
  {
    id: 'tas',
    doku: 'tas',
    ad: 'Eskitilmiş taş duvar',
    metin: 'Düzensiz kesme taşlar, koyu derz ve çatlaklar.',
  },
  {
    id: 'deri',
    doku: 'deri',
    ad: 'Yırtık deri',
    metin: 'İnce gren, kırışıklık damarları, kopuk alt kenar.',
    yirtik: true,
  },
  {
    id: 'kadife',
    doku: 'kadife',
    ad: 'Kadife kumaş',
    metin: 'Kana çalan koyu havlı yüzey, yumuşak parıltı.',
  },
]

export function Yuzey() {
  const T = useDokuTepe()
  const { doku, setDoku } = useGothic()
  return (
    <Bolum id="yuzey" no="06" madde="Madde 8 · Doku ve yüzey" baslik="Demir, taş, deri, kadife" lead="Dört yüzey de tek bir SVG karosudur; en açık noktaları bile metni AAA'da tutacak kadar koyu tutulur. Doku ölçümü aşağıda canlı hesaplanır.">
      <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2" data-yuzeyler="">
        {YUZEYLER.map((y) => (
          <GothicCard key={y.id} yuzey={y.id} yirtik={y.yirtik} kemer={y.id === 'tas' || y.id === 'kadife' ? 'sivri' : 'duz'} as="article" aria-label={y.ad} data-yuzey-kart={y.id}>
            <p className="t-etiket t-soluk">Yüzey</p>
            <h3 className="t-h3 mt-1">{y.ad}</h3>
            <p className="mt-2 text-[1.125rem]">{y.metin}</p>
            <p className="t-alt mt-3">Bu paragraf, dokunun üstünde soluk gümüş metnin nasıl okunduğunu gösterir; harfler ince, çizgiler keskin kalmalıdır.</p>
          </GothicCard>
        ))}
      </div>
      <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <h3 className="t-h3">Doku ölçümü</h3>
          <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Doku ölçüm tablosu">
            <table className="tablo w-full min-w-[600px]" data-doku-tablo="">
              <thead>
                <tr>
                  <th scope="col">Yüzey</th>
                  <th scope="col">En açık nokta</th>
                  <th scope="col">Gövde #D1D5DB</th>
                  <th scope="col">Soluk #BCBEC3</th>
                </tr>
              </thead>
              <tbody>
                {YUZEYLER.map((y) => {
                  const t = T[y.doku]
                  return (
                    <tr key={y.id}>
                      <th scope="row">{y.ad}</th>
                      <td className="rakam whitespace-nowrap">
                        {t ? (
                          <>
                            <span className="renk-ornek" style={{ background: t.hex }} aria-hidden="true" /> {t.hex.toUpperCase()}
                          </>
                        ) : (
                          '…'
                        )}
                      </td>
                      <td className="rakam whitespace-nowrap">{t ? oran(krn('#D1D5DB', t.hex)) : '…'}</td>
                      <td className="rakam whitespace-nowrap">{t ? oran(krn('#BCBEC3', t.hex)) : '…'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid content-start gap-6 lg:col-span-4">
          <Anahtar label="Dokuları göster" hint="Kapalıyken yüzeyler düz ve koyudur." checked={doku === 'acik'} onChange={(a) => setDoku(a ? 'acik' : 'kapali')} />
        </div>
      </div>
    </Bolum>
  )
}

/* ───────── Madde 9 ───────── */

export function Simge() {
  const [sec, setSec] = useState<IkonAd>('kafatasi')
  const [boy, setBoy] = useState(44)
  const [tur, setTur] = useState<'kan' | 'pas' | 'gumus'>('kan')
  const [kopya, setKopya] = useState('')
  const zaman = useRef(0)
  useEffect(() => () => window.clearTimeout(zaman.current), [])
  const kod = `<Muhur ikon="${sec}" tur="${tur}" />`
  return (
    <Bolum id="ikon" no="07" madde="Madde 9 · İkonografi" baslik="On altı gotik simge" lead="Kafatası, zincir, mühür, haç ve gotik simgelerden oluşan özel vektör seti: 48 birimlik ızgara, iki buçuk çizgi, sivri uçlar. Dolgular sayfa vurgusunu izler.">
      <div className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <fieldset className="min-w-0 border-0 p-0">
            <legend className="t-etiket t-soluk mb-4">Simge seç · mühür önizlemesi için</legend>
            <ul className="ikon-izgara" data-ikonlar="">
              {IKONLAR.map((i) => (
                <li key={i}>
                  <label className="ikon-kart" data-on={sec === i ? '' : undefined}>
                    <input type="radio" name="ikon-sec" className="sr-only" value={i} checked={sec === i} onChange={() => setSec(i)} />
                    <Ikon ad={i} boy={boy} />
                    <span className="t-etiket">{IKON_ADI[i]}</span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
          <div className="mt-8 max-w-[420px]">
            <Aralik label="Simge boyutu" value={boy} min={20} max={72} onChange={setBoy} format={(v) => `${v} px`} />
          </div>
        </div>
        <GothicCard as="section" aria-label="Mühür oluşturucu" yuzey="kadife" sarmal="lg:col-span-4" data-muhur-olustur="">
          <h3 className="t-h3">Mühür</h3>
          <div className="mt-5 flex justify-center">
            <Muhur ikon={sec} tur={tur} boy={132} baslik={`${IKON_ADI[sec]} mührü`} />
          </div>
          <div className="mt-6">
            <Secim<'kan' | 'pas' | 'gumus'>
              legend="Mum rengi"
              name="muhur-tur"
              value={tur}
              onChange={setTur}
              options={[
                { id: 'kan', ad: 'Kan' },
                { id: 'pas', ad: 'Pas' },
                { id: 'gumus', ad: 'Gümüş' },
              ]}
            />
          </div>
          <div className="mt-6">
            <Kod label="Mühür kodu">{kod}</Kod>
            <div className="mt-4">
              <Dugme
                dar
                ton="demir"
                onClick={() => {
                  navigator.clipboard?.writeText(kod).catch(() => {})
                  setKopya('Kopyalandı')
                  window.clearTimeout(zaman.current)
                  zaman.current = window.setTimeout(() => setKopya(''), 1800)
                }}
              >
                Kodu kopyala
              </Dugme>
              <span className="t-alt ml-3" role="status">
                {kopya}
              </span>
            </div>
          </div>
        </GothicCard>
      </div>
    </Bolum>
  )
}
