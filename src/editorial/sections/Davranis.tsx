import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Bolum, EditorialContainer, MultiColumnLayout } from '../components/Editorial'
import { Pagination } from '../components/Pagination'
import { Ayarlar } from '../components/Header'
import { Aralik, Buton, Secim } from '../components/ui'
import { ICINDEKILER, METIN } from '../lib/data'
import { ortKarakter } from '../lib/olcu'
import { kontrastTara, type KontrastTarama } from '../lib/tarama'
import { useEditorial } from '../lib/store'

function AltEtiket({ children }: { children: string }) {
  return <p className="t-etiket t-soluk border-t border-metin pt-3">{children}</p>
}

/* ───────────────────────── Madde 16 · Hareket ───────────────────────── */

type Egri = 'ease-out' | 'ease-in-out' | 'linear'
interface Gecis {
  sure: string
  egri: string
  ozellik: string
}

export function Hareket() {
  const { hareket, tema } = useEditorial()
  const [sayfa, setSayfa] = useState(1)
  const [sure, setSure] = useState(240)
  const [egri, setEgri] = useState<Egri>('ease-out')
  const [tekrar, setTekrar] = useState(0)
  const ic = useRef<HTMLDivElement>(null)
  const [g, setG] = useState<Gecis>({ sure: '', egri: '', ozellik: '' })
  const [say, setSay] = useState({ calisan: 0, yerDegistiren: 0 })
  useLayoutEffect(() => {
    const el = ic.current
    if (!el) return
    const a = el.getAnimations()[0]
    if (!a) {
      setG({ sure: '0', egri: '—', ozellik: 'yok (hareket kapalı)' })
      return
    }
    const t = a.effect?.getTiming()
    const kf = (a.effect as KeyframeEffect).getKeyframes()
    const oz = new Set<string>()
    kf.forEach((k) => Object.keys(k).forEach((p) => !['offset', 'easing', 'composite', 'computedOffset'].includes(p) && oz.add(p)))
    setG({ sure: String(t?.duration ?? ''), egri: String(t?.easing ?? ''), ozellik: [...oz].join(', ') })
  }, [sayfa, sure, egri, tekrar, hareket])
  useEffect(() => {
    const oku = () => {
      const calisan = document.getAnimations().filter((a) => a.playState === 'running').length
      let yer = 0
      document.querySelectorAll<HTMLElement>('main *').forEach((e) => {
        const s = getComputedStyle(e)
        if (/transform|translate|scale|rotate|margin|top|left|inset/.test(s.transitionProperty) && s.transitionProperty !== 'all') yer++
      })
      setSay({ calisan, yerDegistiren: yer })
    }
    oku()
    const id = window.setInterval(oku, 500)
    return () => window.clearInterval(id)
  }, [hareket, tema])
  const s = ICINDEKILER[sayfa - 1]
  return (
    <Bolum
      id="hareket"
      no="12"
      madde="Madde 16 · Hareket dili"
      baslik="Yalnız solma"
      lead="Sayfa geçişleri hızlı ve dikkat dağıtmayan bir yumuşak solmadır: yalnız opaklık, 240 milisaniye, hiçbir öğe yer değiştirmez, büyümez ya da sıçramaz. Durdur ya da sistem tercihi bunu tamamen keser."
      not="* Solma bir dekor değil, bir işarettir: içerik değişti. Aşağıdaki dergi sayfasında sayfa değiştirin, süreyi ve eğriyi oynatın."
    >
      <EditorialContainer className="gap-y-16">
        <div className="col-span-4 grid content-start gap-5 md:col-span-3" data-kol="1">
          <AltEtiket>Sayfa geçişi</AltEtiket>
          <Aralik id="gecis-sure" label="Süre" value={sure} min={0} max={600} step={20} onChange={setSure} format={(v) => `${v} ms`} />
          <Secim<Egri>
            legend="Eğri"
            name="gecis-egri"
            value={egri}
            onChange={setEgri}
            options={[
              { id: 'ease-out', ad: 'Yavaşlayan' },
              { id: 'ease-in-out', ad: 'Simetrik' },
              { id: 'linear', ad: 'Doğrusal' },
            ]}
          />
          <Buton ikon="ok-sag" onClick={() => setTekrar((t) => t + 1)} data-tekrar="">
            Yeniden oynat
          </Buton>
        </div>
        <div className="col-span-4 md:col-span-9" data-kol="4">
          <div className="kutu-koyu p-6 md:p-10">
            <div key={`${sayfa}-${tekrar}`} ref={ic} className="gecis min-h-[22rem]" style={{ ['--sure' as string]: `${sure}ms`, ['--egri' as string]: egri }} data-gecis-icerik={sayfa}>
              <p className="t-etiket t-soluk">
                Sayfa <span className="rakam">{s.sayfa}</span> · Kolon {`Sayı 36`}
              </p>
              <h3 className="t-h1 mt-4">{s.baslik}</h3>
              <p className="t-govde olcu mt-6">{METIN[sayfa - 1]}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            <Pagination toplam={ICINDEKILER.length} sayfa={sayfa} onChange={setSayfa} etiket="Dergi sayfaları" />
            <p className="t-alt" aria-live="polite">
              Sayfa <span className="rakam">{sayfa}</span> / <span className="rakam">{ICINDEKILER.length}</span>
            </p>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-x-[var(--bosluk)] gap-y-4 border-t border-metin pt-3 sm:grid-cols-4" data-gecis-olcum={`${g.sure}|${g.egri}|${g.ozellik}`}>
            <div>
              <dt className="t-etiket t-soluk">Ölçülen süre</dt>
              <dd className="rakam m-0 mt-1 text-[1.5rem]">{g.sure || '—'} ms</dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Eğri</dt>
              <dd className="rakam m-0 mt-1 text-[1.125rem]">{g.egri || '—'}</dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Değişen özellik</dt>
              <dd className="rakam m-0 mt-1 text-[1.125rem]">{g.ozellik || '—'}</dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Hareket</dt>
              <dd className="m-0 mt-1 text-[1.125rem]">{hareket ? 'açık' : 'durdu'}</dd>
            </div>
          </dl>
        </div>

        <div className="col-span-4 md:col-span-3" data-kol="1" data-hareket-butce={say.calisan} data-yer-degistiren={say.yerDegistiren}>
          <AltEtiket>Hareket bütçesi · canlı</AltEtiket>
          <p className="rakam mt-3 text-[2.5rem] leading-none">{say.calisan}</p>
          <p className="t-alt mt-1">çalışan animasyon</p>
          <p className="rakam mt-5 text-[2.5rem] leading-none">{say.yerDegistiren}</p>
          <p className="t-alt mt-1">yer değiştiren geçiş (transform, kenar boşluğu, konum)</p>
        </div>
        <div className="col-span-4 overflow-x-auto md:col-span-9" role="region" aria-label="Hareket eşlemeleri" tabIndex={0} data-kol="4">
          <table className="tablo w-full min-w-[560px]" data-hareket-tablo="">
            <caption className="t-etiket t-soluk">Olay → hareket</caption>
            <thead>
              <tr>
                {['Olay', 'Ne değişir', 'Süre', 'Eğri'].map((b) => (
                  <th key={b} scope="col">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Sayfa açılışı', 'ana içerik opaklığı', '320 ms', 'ease-out'],
                ['Bölüm menüsü', 'hedef bölüm opaklığı', '240 ms', 'ease-out'],
                ['Sayfalama, filtre, sıralama', 'yeni içeriğin opaklığı', '240 ms', 'ease-out'],
                ['Makale kartını açma', 'panel opaklığı', '240 ms', 'ease-out'],
                ['Üzerine gelme', 'zemin ve yazı rengi', '150 ms', 'ease'],
                ['Odak', 'halka anında belirir', '0 ms', '—'],
              ].map(([a, b, c, d]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td>{b}</td>
                  <td className="rakam">{c}</td>
                  <td className="rakam">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EditorialContainer>
    </Bolum>
  )
}

/* ───────────────────────── Madde 17 · Mobil ───────────────────────── */

const SIM_METIN = [METIN[0], METIN[1], METIN[3], METIN[5]]

export function Mobil() {
  const { boyut: kok } = useEditorial()
  const [genislik, setGenislik] = useState(1040)
  const sim = useRef<HTMLDivElement>(null)
  const izgara = useRef<HTMLDivElement>(null)
  const mk = useRef<HTMLDivElement>(null)
  const [o, setO] = useState({ kutu: 0, iz: 0, sutun: 0, sutunW: 0, karakter: 0, sayfaIz: 0 })
  useLayoutEffect(() => {
    const oku = () => {
      const g = izgara.current
      const m = mk.current
      const kut = sim.current
      if (!g || !m || !kut) return
      const ic = m.querySelector<HTMLElement>('.mk-ic') ?? m
      const ms = getComputedStyle(ic)
      const n = parseInt(ms.columnCount) || 1
      const bosluk = parseFloat(ms.columnGap) || 0
      const w = (ic.clientWidth - bosluk * (n - 1)) / n
      const p = ic.querySelector<HTMLElement>('p')
      const sayfaG = document.querySelector<HTMLElement>('[data-bolum] .g')
      setO({
        kutu: Math.round(kut.clientWidth),
        iz: getComputedStyle(g).gridTemplateColumns.split(' ').length,
        sutun: n,
        sutunW: Math.round(w),
        karakter: p ? ortKarakter(p, w) : 0,
        sayfaIz: sayfaG ? getComputedStyle(sayfaG).gridTemplateColumns.split(' ').length : 0,
      })
    }
    oku()
    const ro = new ResizeObserver(oku)
    if (sim.current) ro.observe(sim.current)
    window.addEventListener('resize', oku)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', oku)
    }
  }, [genislik, kok])
  const karar = o.karakter < 45 ? 'Çok kısa' : o.karakter > 75 ? 'Çok uzun' : 'Konfor bandında'
  return (
    <Bolum
      id="mobil"
      no="13"
      madde="Madde 17 · Responsive kurallar"
      baslik="Tek sütuna evrilir"
      lead="Çok sütunlu düzen küçük ekranda bozulmaz, sadeleşir: on iki kolon dörde, üç metin sütunu ikiye, sonra bire iner. Okuma sırası ve satır uzunluğu aynı kalır. Kaydırıcı bir kapsayıcının genişliğini değiştirir; her sayı ölçülür."
      not="* Karar ekran genişliğine değil kapsayıcıya bağlıdır: aynı bileşen yan sütunda da tam sayfada da doğru sütun sayısını seçer."
    >
      <EditorialContainer className="gap-y-14">
        <div className="col-span-4 grid content-start gap-5 md:col-span-3" data-kol="1">
          <AltEtiket>Kapsayıcı</AltEtiket>
          <Aralik id="mobil-genislik" label="Genişlik" value={genislik} min={280} max={1200} step={10} onChange={setGenislik} format={(v) => `${v} px`} />
          <dl className="grid gap-4" data-mobil-olcum={`${o.kutu}|${o.iz}|${o.sutun}|${o.sutunW}|${o.karakter}`}>
            <div>
              <dt className="t-etiket t-soluk">Grid izi</dt>
              <dd className="rakam m-0 mt-1 text-[1.5rem]" data-iz={o.iz}>
                {o.iz} kolon
              </dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Metin sütunu</dt>
              <dd className="rakam m-0 mt-1 text-[1.5rem]" data-sutun={o.sutun}>
                {o.sutun} sütun · {o.sutunW} px
              </dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Satır başına karakter</dt>
              <dd className="m-0 mt-1" data-karakter={o.karakter}>
                <span className="rakam text-[1.5rem]">≈ {o.karakter}</span>
                <span className="t-alt block">{karar} (45–75)</span>
              </dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Bu sayfa</dt>
              <dd className="rakam m-0 mt-1 text-[1.125rem]" data-sayfa-iz={o.sayfaIz}>
                {o.sayfaIz} kolonlu ızgara
              </dd>
            </div>
          </dl>
        </div>
        <div className="col-span-4 overflow-x-auto md:col-span-9" data-kol="4">
          <div ref={sim} className="sim" style={{ width: `min(${genislik}px, 100%)` }} data-sim-kutu={genislik}>
            <div className="border border-metin p-4">
              <div ref={izgara} className="sim-g mb-6" aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} className="rakam t-alt border-t border-metin py-1 text-center">
                    {i + 1}
                  </span>
                ))}
              </div>
              <div ref={mk}>
                <MultiColumnLayout sutun={3} kural>
                  {SIM_METIN.map((m) => (
                    <p key={m.slice(0, 10)}>{m}</p>
                  ))}
                </MultiColumnLayout>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4 overflow-x-auto md:col-span-12" role="region" aria-label="Duyarlı kurallar" tabIndex={0}>
          <table className="tablo w-full min-w-[620px]" data-mobil-tablo="">
            <caption className="t-etiket t-soluk">Kurallar</caption>
            <thead>
              <tr>
                {['Kapsayıcı', 'Grid izi', 'Metin sütunu', 'Oluk', 'Not'].map((b) => (
                  <th key={b} scope="col">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['< 640 px', '4 kolon', '1 sütun', '16 px', 'akışkan tek sütun'],
                ['640 – 959 px', '4 → 12 kolon', '2 sütun', '24 px', 'iki sütun, çizgi korunur'],
                ['960 – 1119 px', '12 kolon', '3 sütun', '32 px', 'gazete düzeni'],
                ['≥ 1120 px', '12 kolon', 'seçilen sayı (en çok 4)', '32 px', 'geniş çok sütunlu düzen'],
              ].map(([a, b, c, d, e]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td>{b}</td>
                  <td>{c}</td>
                  <td className="rakam">{d}</td>
                  <td>{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EditorialContainer>
    </Bolum>
  )
}

/* ───────────────────────── Madde 18 · Erişilebilirlik ───────────────────────── */

const KURALLAR = [
  ['Kontrast', 'Bütün metin 7:1 ve üstü (WCAG AAA); büyük metin 4,5:1. Denetim yukarıda canlı çalışır.'],
  ['Yalnız yapı çizgisi soluk', '#E0E0E0 çizgi bilgi taşımaz. Bilgi taşıyan denetim çerçevesi 3:1 ve üstü.'],
  ['Ölçek', 'Yazı boyutu %100, %112 ve %125. Boyutlar rem ile ölçeklenir; 320 pikselde yatay kaydırma yok.'],
  ['Metin aralığı', 'Satır 1,5, paragraf 2 katı, harf 0,12 em, sözcük 0,16 em uygulandığında içerik kırpılmaz (WCAG 1.4.12).'],
  ['Hareket', 'Yalnız solma, 240 ms. Durdur ya da sistemin azaltılmış hareket tercihi hepsini keser.'],
  ['Klavye', 'İçeriğe geç bağlantısı ilk odakta. Odak halkası 3 piksel; hedefler en az 44 piksel.'],
  ['Anlam', 'Tek h1, sıralı başlıklar, işaretlenmiş bölgeler, tablolarda scope. Okuma sırası kaynak sırasıdır.'],
  ['Dil', 'Sayfa Türkçe; İngilizce terimler lang="en". Tireleme yalnız Türkçe sözlükle.'],
] as const

export function Erisim() {
  const { tema, kontrast, boyut, aralik } = useEditorial()
  const [t, setT] = useState<KontrastTarama | null>(null)
  useEffect(() => {
    const id = window.setTimeout(() => setT(kontrastTara()), 900)
    return () => window.clearTimeout(id)
  }, [tema, kontrast, boyut, aralik])
  return (
    <Bolum
      id="erisim"
      no="14"
      madde="Madde 18 · Erişilebilirlik ve varyantlar"
      baslik="AAA, kusursuz"
      lead="Mat zemin ile yüksek kontrastlı kömür metin, WCAG AAA'nın istediği 7:1'i kolayca aşar. Aşağıdaki tarama sayfanın kendi metnini okur: hesaplanan renk, gerçek arka plan, boyut."
      not="* Kâğıt ve beyaz zeminde kömür metin 17:1'in üstündedir; en soluk ikincil metin bile 7'nin altına inmez."
    >
      <EditorialContainer className="gap-y-16">
        <div className="col-span-4 grid content-start gap-5 md:col-span-3" data-kol="1" data-erisim-ayarlar="">
          <AltEtiket>Varyantlar</AltEtiket>
          <Ayarlar onek="er-" />
        </div>
        <div className="col-span-4 md:col-span-9" data-kol="4">
          <div className="border-t-2 border-metin pt-3" data-tarama={t ? `${t.n}|${t.altinda}|${t.enDusuk}|${t.kirpik}` : ''} data-altinda={t ? t.altinda : ''}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="t-etiket t-soluk">Sayfa taraması · canlı</p>
              <Buton onClick={() => setT(kontrastTara())} data-tara="" ikon="ok-sag">
                Yeniden tara
              </Buton>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-[var(--bosluk)] gap-y-6 sm:grid-cols-4">
              <div>
                <dd className="rakam m-0 text-[clamp(2.25rem,5vw,4rem)] leading-none" data-say="n">
                  {t ? t.n : '—'}
                </dd>
                <dt className="t-etiket t-soluk mt-2">Taranan metin</dt>
              </div>
              <div>
                <dd className="rakam m-0 text-[clamp(2.25rem,5vw,4rem)] leading-none" data-say="altinda">
                  {t ? t.altinda : '—'}
                </dd>
                <dt className="t-etiket t-soluk mt-2">AAA altında</dt>
              </div>
              <div>
                <dd className="rakam m-0 text-[clamp(2.25rem,5vw,4rem)] leading-none" data-say="dusuk">
                  {t ? t.enDusuk.toFixed(2).replace('.', ',') : '—'}
                </dd>
                <dt className="t-etiket t-soluk mt-2">En düşük oran</dt>
              </div>
              <div>
                <dd className="rakam m-0 text-[clamp(2.25rem,5vw,4rem)] leading-none" data-say="kirpik">
                  {t ? t.kirpik : '—'}
                </dd>
                <dt className="t-etiket t-soluk mt-2">Kırpılmış metin</dt>
              </div>
            </dl>
            <p className="t-alt mt-4" aria-live="polite">
              {t ? (t.altinda === 0 ? 'Bütün metin AAA sınırının üstünde.' : `Sınırın altında: ${t.ornek.join(' · ')}`) : 'Taranıyor…'}
            </p>
          </div>
        </div>
        <ol className="col-span-4 md:col-span-9 md:col-start-4" data-kol="4" data-kurallar="">
          {KURALLAR.map(([a, b], i) => (
            <li key={a} className="grid grid-cols-[2rem_1fr] gap-x-3 border-t border-cizgi py-4 sm:grid-cols-[2rem_13rem_1fr]">
              <span className="rakam t-alt">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[1.125rem] leading-snug font-semibold max-sm:col-start-2">{a}</span>
              <span className="t-alt max-sm:col-start-2">{b}</span>
            </li>
          ))}
        </ol>
      </EditorialContainer>
    </Bolum>
  )
}
