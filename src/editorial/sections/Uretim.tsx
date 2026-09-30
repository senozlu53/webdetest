import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArticleCard } from '../components/ArticleCard'
import { ArticleHeader, Bolum, EditorialContainer, MultiColumnLayout } from '../components/Editorial'
import { Pagination } from '../components/Pagination'
import { Alan, Anahtar, Aralik, Kod, Secim } from '../components/ui'
import { ALINTI, CSS_SATIRI, FIGMA_TOKENLAR, MAKALELER, METIN, OLCEK, PROPLAR, SATIR_YUKSEKLIKLERI } from '../lib/data'
import { useEditorial } from '../lib/store'

/* ───────────────────────── Madde 11 · 14 · Bileşenler ───────────────────────── */

function AltEtiket({ children }: { children: string }) {
  return <p className="t-etiket t-soluk border-t border-metin pt-3">{children}</p>
}

export function Bilesenler() {
  const [kicker, setKicker] = useState('Tasarım · Sayı 36')
  const [baslik, setBaslik] = useState('Boşluk bir malzemedir')
  const [dek, setDek] = useState('Sütunlar arasındaki boşluk, sütunlardan daha çok şey söyler.')
  const [sutun, setSutun] = useState<1 | 2 | 3 | 4>(3)
  const [kural, setKural] = useState(true)
  const [ilk, setIlk] = useState(true)
  const [tek, setTek] = useState(true)
  const [acik, setAcik] = useState<string[]>(['01'])
  const [toplam, setToplam] = useState(12)
  const [sayfa, setSayfa] = useState(4)
  const mk = useRef<HTMLDivElement>(null)
  const [olc, setOlc] = useState({ sutun: '', genislik: 0 })
  useLayoutEffect(() => {
    const el = mk.current
    if (!el) return
    const oku = () => {
      const ic = el.querySelector<HTMLElement>('.mk-ic')
      if (ic) setOlc({ sutun: getComputedStyle(ic).columnCount, genislik: Math.round(ic.clientWidth) })
    }
    oku()
    const ro = new ResizeObserver(oku)
    ro.observe(el)
    return () => ro.disconnect()
  }, [sutun])
  useEffect(() => {
    if (sayfa > toplam) setSayfa(toplam)
  }, [toplam, sayfa])
  const degistir = (no: string) => setAcik((a) => (a.includes(no) ? a.filter((x) => x !== no) : tek ? [no] : [...a, no]))
  return (
    <Bolum
      id="bilesenler"
      no="09"
      madde="Madde 11 · 14 · Bileşenler ve React"
      baslik="Üç bileşen, bir düzen"
      lead={
        <>
          Sayfanın tümü üç bileşenden kurulur: <b>&lt;EditorialContainer&gt;</b> iskeleti, <b>&lt;MultiColumnLayout&gt;</b> gazete sütunlarını, <b>&lt;ArticleHeader&gt;</b> manşeti verir. Açılır makale kartları ve sayfalama aynı çizgi diliyle çalışır.
        </>
      }
      not="* Sütun sayısı ekran genişliğine değil, bileşenin kendi kapsayıcısına bağlıdır. Aynı bileşen dar bir kenar sütununda da, geniş bir sayfada da doğru davranır."
    >
      <EditorialContainer className="gap-y-20">
        {/* ArticleHeader */}
        <div className="col-span-4 grid content-start gap-5 md:col-span-3" data-kol="1">
          <AltEtiket>{'<ArticleHeader>'}</AltEtiket>
          <Alan label="Üst yazı">{(p) => <input className="alan" {...p} value={kicker} onChange={(e) => setKicker(e.target.value)} maxLength={40} />}</Alan>
          <Alan label="Manşet">{(p) => <input className="alan" {...p} value={baslik} onChange={(e) => setBaslik(e.target.value)} maxLength={48} data-baslik-girdi="" />}</Alan>
          <Alan label="Dek">{(p) => <textarea className="alan min-h-24" {...p} value={dek} onChange={(e) => setDek(e.target.value)} rows={3} maxLength={140} />}</Alan>
        </div>
        <div className="col-span-4 md:col-span-9" data-kol="4" data-header-onizleme="">
          <ArticleHeader kicker={kicker} baslik={baslik || 'Manşet'} dek={dek} imza="Deniz Arı" dk={8} seviye={3} />
        </div>

        {/* MultiColumnLayout */}
        <div className="col-span-4 grid content-start gap-5 md:col-span-3" data-kol="1">
          <AltEtiket>{'<MultiColumnLayout>'}</AltEtiket>
          <Secim<'1' | '2' | '3' | '4'>
            legend="Sütun"
            name="mk-sutun"
            value={String(sutun) as '1' | '2' | '3' | '4'}
            onChange={(v) => setSutun(+v as 1 | 2 | 3 | 4)}
            options={[
              { id: '1', ad: '1' },
              { id: '2', ad: '2' },
              { id: '3', ad: '3' },
              { id: '4', ad: '4' },
            ]}
          />
          <Anahtar label="Sütun çizgisi" checked={kural} onChange={setKural} hint="column-rule: 1px" />
          <Anahtar label="Büyük ilk harf" checked={ilk} onChange={setIlk} hint="::first-letter" />
          <p className="t-alt" data-mk-olcum={`${olc.sutun}|${olc.genislik}`}>
            Hesaplanan <span className="rakam">column-count: {olc.sutun}</span>. Kapsayıcı <span className="rakam">{olc.genislik}</span> px.
          </p>
        </div>
        <div className="col-span-4 md:col-span-9" data-kol="4" data-mk-demo="">
          <div ref={mk}>
            <MultiColumnLayout sutun={sutun} kural={kural} ilkHarf={ilk}>
              <p>{METIN[0]}</p>
              <p>{METIN[1]}</p>
              <blockquote className="alinti">{ALINTI}</blockquote>
              <p>{METIN[2]}</p>
              <p>{METIN[3]}</p>
              <p>{METIN[4]}</p>
            </MultiColumnLayout>
          </div>
        </div>

        {/* Açılır makale kartları */}
        <div className="col-span-4 grid content-start gap-5 md:col-span-3" data-kol="1">
          <AltEtiket>Açılır makale kartı</AltEtiket>
          <Anahtar
            label="Aynı anda bir makale"
            checked={tek}
            onChange={(v) => {
              setTek(v)
              if (v) setAcik((a) => a.slice(0, 1))
            }}
            hint="Açık kart sayısı sınırlanır"
          />
          <p className="t-alt" aria-live="polite" data-acik-say={acik.length}>
            <span className="rakam">{acik.length}</span> makale açık
          </p>
        </div>
        <div className="col-span-4 md:col-span-9" data-kol="4" data-makaleler="">
          {MAKALELER.map((m) => (
            <ArticleCard key={m.no} makale={m} acik={acik.includes(m.no)} onToggle={() => degistir(m.no)} />
          ))}
        </div>

        {/* Pagination */}
        <div className="col-span-4 grid content-start gap-5 md:col-span-3" data-kol="1">
          <AltEtiket>{'<Pagination>'}</AltEtiket>
          <Aralik id="sayfalama-toplam" label="Toplam sayfa" value={toplam} min={1} max={40} onChange={setToplam} />
        </div>
        <div className="col-span-4 md:col-span-9" data-kol="4" data-sayfalama-demo="">
          <Pagination toplam={toplam} sayfa={sayfa} onChange={setSayfa} etiket="Örnek sayfalama" />
          <p className="t-alt mt-4" aria-live="polite" data-sayfalama-durum={`${sayfa}|${toplam}`}>
            Sayfa <span className="rakam">{sayfa}</span> / <span className="rakam">{toplam}</span>. Görünen düğme sayısı sayfa sayısıyla büyümez: uçlar, geçerli sayfa ve komşuları kalır.
          </p>
        </div>

        <div className="col-span-4 overflow-x-auto md:col-span-12" role="region" aria-label="Bileşen özellikleri" tabIndex={0}>
          <table className="tablo w-full min-w-[760px]" data-proplar="">
            <caption className="t-etiket t-soluk">Bileşen özellikleri</caption>
            <thead>
              <tr>
                {['Bileşen', 'Özellik', 'Tip', 'Varsayılan', 'Ne yapar'].map((b) => (
                  <th key={b} scope="col">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROPLAR.map((p) => (
                <tr key={p.bilesen + p.ad}>
                  <th scope="row" className="font-mono !text-[0.8125rem]">
                    {p.bilesen}
                  </th>
                  <td className="font-mono text-[0.8125rem]">{p.ad}</td>
                  <td className="font-mono text-[0.78rem]">{p.tip}</td>
                  <td className="font-mono text-[0.78rem]">{p.varsayilan}</td>
                  <td>{p.aciklama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EditorialContainer>
    </Bolum>
  )
}

/* ───────────────────────── Madde 12 · 13 · Figma ───────────────────────── */

type Yon = 'yatay' | 'dikey'
export function Figma() {
  const { tema, boyut: kok } = useEditorial()
  const [oluk, setOluk] = useState<'16' | '24' | '32' | '48'>('32')
  const [kenar, setKenar] = useState<'24' | '40' | '64'>('64')
  const [cerceve, setCerceve] = useState(1440)
  const [fs, setFs] = useState(18)
  const [yon, setYon] = useState<Yon>('yatay')
  const [bosluk, setBosluk] = useState<'0' | '16' | '32'>('32')
  const [ic, setIc] = useState<'0' | '16' | '32'>('32')
  const ilk = useRef<HTMLSpanElement>(null)
  const [olc, setOlc] = useState({ olculen: 0, beklenen: 0 })
  const [canli, setCanli] = useState({ izgara: '', lh: '', renk: '' })
  useLayoutEffect(() => {
    const w = ilk.current?.getBoundingClientRect().width ?? 0
    const beklenen = (cerceve - 2 * +kenar - 11 * +oluk) / 12
    setOlc({ olculen: Math.round(w * 100) / 100, beklenen: Math.round(beklenen * 100) / 100 })
  }, [oluk, kenar, cerceve])
  useEffect(() => {
    const oku = () => {
      const g = document.querySelector<HTMLElement>('[data-bolum] .g')
      const govde = document.querySelector<HTMLElement>('.t-govde')
      const gs = g ? getComputedStyle(g) : null
      const ks = govde ? getComputedStyle(govde) : null
      const kr =
        '#' +
        (getComputedStyle(document.body).color.match(/\d+/g) ?? [])
          .slice(0, 3)
          .map((n) => (+n).toString(16).padStart(2, '0'))
          .join('')
      setCanli({
        izgara: gs ? `${gs.gridTemplateColumns.split(' ').length}|${parseFloat(gs.columnGap)}` : '',
        lh: ks ? (parseFloat(ks.lineHeight) / parseFloat(ks.fontSize)).toFixed(3) : '',
        renk: kr,
      })
    }
    const t = window.setTimeout(oku, 200)
    window.addEventListener('resize', oku)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', oku)
    }
  }, [tema, kok])
  const [kolonSay, oz] = canli.izgara.split('|')
  const dogru = Math.abs(olc.olculen - olc.beklenen) < 0.05
  return (
    <Bolum
      id="figma"
      no="10"
      madde="Madde 12 · 13 · Figma mimarisi ve tokenlar"
      baslik="Sıkı grid, sıkı satır"
      lead="Figma'da sayfa on iki kolonlu bir çerçevedir; her metin stili tek bir satır yüksekliği token'ına bağlıdır. Panel bu kuralları taklit eder: kolon genişliği çerçeve, kenar ve oluktan hesaplanır, ölçülenle karşılaştırılır."
      not="* 12 kolon, 4'e, 3'e, 6'ya ve 2'ye bölünür. Bu yüzden düzenin her katmanı aynı iskelete oturur."
    >
      <EditorialContainer className="gap-y-20">
        {/* Grid/Editorial12 */}
        <div className="col-span-4 grid content-start gap-5 md:col-span-3" data-kol="1" data-figma-grid="">
          <AltEtiket>Grid/Editorial12</AltEtiket>
          <Aralik id="figma-cerceve" label="Çerçeve genişliği" value={cerceve} min={720} max={1440} step={40} onChange={setCerceve} format={(v) => `${v} px`} />
          <Secim<'16' | '24' | '32' | '48'>
            legend="Oluk (gap)"
            name="figma-oluk"
            value={oluk}
            onChange={setOluk}
            options={[
              { id: '16', ad: '16' },
              { id: '24', ad: '24' },
              { id: '32', ad: '32' },
              { id: '48', ad: '48' },
            ]}
          />
          <Secim<'24' | '40' | '64'>
            legend="Kenar (margin)"
            name="figma-kenar"
            value={kenar}
            onChange={setKenar}
            options={[
              { id: '24', ad: '24' },
              { id: '40', ad: '40' },
              { id: '64', ad: '64' },
            ]}
          />
          <p className="t-alt" data-kolon-w={`${olc.olculen}|${olc.beklenen}`} data-kolon-dogru={dogru ? 'evet' : 'hayir'}>
            Kolon = (çerçeve − 2 × kenar − 11 × oluk) ÷ 12 = <span className="rakam">{olc.beklenen.toFixed(2).replace('.', ',')}</span> px. Ölçülen <span className="rakam">{olc.olculen.toFixed(2).replace('.', ',')}</span> px: {dogru ? 'aynı' : 'fark var'}.
          </p>
        </div>
        <div className="col-span-4 overflow-x-auto md:col-span-9" data-kol="4" role="region" aria-label="12 kolonlu çerçeve" tabIndex={0}>
          <div className="outline outline-1 -outline-offset-1 outline-metin" style={{ width: cerceve }} data-figma-cerceve={cerceve}>
            <div style={{ paddingInline: +kenar }}>
              <div className="kilavuz-ic h-40" style={{ ['--kg' as string]: `${oluk}px` }} aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} ref={i === 0 ? ilk : undefined} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Typography/LineHeight */}
        <div className="col-span-4 grid content-start gap-5 md:col-span-3" data-kol="1">
          <AltEtiket>Typography/LineHeight*</AltEtiket>
          <Aralik id="figma-fs" label="Yazı boyutu" value={fs} min={12} max={32} onChange={setFs} format={(v) => `${v} px`} />
          <div className="t-alt">
            <p>Kural 1: 48 px ve üstü başlık satır yüksekliği ≤ 1,1.</p>
            <p className="mt-2">Kural 2: 16 px gövde satır yüksekliği ≥ 1,5.</p>
            <p className="mt-2" data-lh-kural={OLCEK.filter((o) => o.boyut >= 48).every((o) => o.lh <= 1.1) && OLCEK.filter((o) => o.ad === 'Gövde').every((o) => o.lh >= 1.5) ? 'evet' : 'hayir'}>
              Tip ölçeği kurallara {OLCEK.filter((o) => o.boyut >= 48).every((o) => o.lh <= 1.1) && OLCEK.filter((o) => o.ad === 'Gövde').every((o) => o.lh >= 1.5) ? 'uyuyor.' : 'uymuyor.'}
            </p>
          </div>
        </div>
        <ul className="col-span-4 md:col-span-9" data-kol="4" data-satir-yukseklikleri="">
          {SATIR_YUKSEKLIKLERI.map((s) => (
            <li key={s.ad} className="g items-start border-t border-cizgi py-4" data-lh={s.deger}>
              <div className="col-span-4 md:col-span-3">
                <p className="font-semibold leading-snug">
                  {s.ad} <span className="rakam t-alt">{String(s.deger).replace('.', ',')}</span>
                </p>
                <p className="t-alt">{s.kullanim}</p>
                <p className="rakam t-alt">{Math.round(fs * s.deger * 100) / 100} px</p>
              </div>
              <p className="col-span-4 m-0 mt-2 md:col-span-9 md:mt-0" style={{ fontSize: fs, lineHeight: s.deger, maxWidth: '62ch' }}>
                Boşluğu doldurmak kolaydır; onu korumak disiplin ister. Sütunlar arasındaki boşluk okuru bir sonraki satıra taşır.
              </p>
            </li>
          ))}
        </ul>

        {/* Auto Layout */}
        <div className="col-span-4 grid content-start gap-5 md:col-span-3" data-kol="1">
          <AltEtiket>Auto Layout</AltEtiket>
          <Secim<Yon>
            legend="Yön"
            name="figma-yon"
            value={yon}
            onChange={setYon}
            options={[
              { id: 'yatay', ad: 'Yatay' },
              { id: 'dikey', ad: 'Dikey' },
            ]}
          />
          <Secim<'0' | '16' | '32'>
            legend="Boşluk"
            name="figma-bosluk"
            value={bosluk}
            onChange={setBosluk}
            options={[
              { id: '0', ad: '0' },
              { id: '16', ad: '16' },
              { id: '32', ad: '32' },
            ]}
          />
          <Secim<'0' | '16' | '32'>
            legend="İç boşluk"
            name="figma-ic"
            value={ic}
            onChange={setIc}
            options={[
              { id: '0', ad: '0' },
              { id: '16', ad: '16' },
              { id: '32', ad: '32' },
            ]}
          />
        </div>
        <div className="col-span-4 md:col-span-9" data-kol="4">
          <div className="border border-metin" style={{ display: 'flex', flexDirection: yon === 'yatay' ? 'row' : 'column', gap: +bosluk, padding: +ic }} data-autolayout={`${yon}|${bosluk}|${ic}`}>
            {['Kicker', 'Manşet', 'Dek'].map((a) => (
              <div key={a} className="kutu sans min-h-16 min-w-0 flex-1 p-3 text-[0.8125rem] [overflow-wrap:anywhere]" data-alt-katman="">
                {a} · Fill container
              </div>
            ))}
          </div>
          <p className="rakam t-alt mt-3" data-autolayout-yazi="">
            Direction: {yon === 'yatay' ? 'Horizontal' : 'Vertical'} · Gap: {bosluk} · Padding: {ic} · Sizing: Fill container
          </p>
        </div>

        {/* Token tablosu */}
        <div className="col-span-4 overflow-x-auto md:col-span-12" role="region" aria-label="Figma tokenları" tabIndex={0}>
          <table className="tablo w-full min-w-[640px]" data-token-tablo="" data-token-canli={`${canli.izgara}|${canli.lh}|${canli.renk}`}>
            <caption className="t-etiket t-soluk">Tokenlar ve sayfadaki karşılığı</caption>
            <thead>
              <tr>
                {['Token', 'Değer', 'Sayfada ölçülen'].map((b) => (
                  <th key={b} scope="col">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIGMA_TOKENLAR.map((t) => (
                <tr key={t.ad}>
                  <th scope="row" className="font-mono !text-[0.8125rem]">
                    {t.ad}
                  </th>
                  <td className="rakam">
                    {t.tip === 'color' ? <span className="mr-3 inline-block size-4 border border-metin align-[-2px]" style={{ background: t.deger }} aria-hidden="true" /> : null}
                    {t.deger}
                  </td>
                  <td className="rakam">{t.ad === 'Grid/Editorial12' ? `${kolonSay ?? '—'} kolon · oluk ${oz ?? '—'} px` : t.ad === 'Typography/LineHeightRelaxed' ? canli.lh.replace('.', ',') : t.ad === 'Color/EditorialCharcoal' ? canli.renk.toUpperCase() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EditorialContainer>
    </Bolum>
  )
}

/* ───────────────────────── Madde 15 · CSS / Tailwind ───────────────────────── */

export function Css() {
  const { tema, boyut: kok } = useEditorial()
  const kutu = useRef<HTMLDivElement>(null)
  const [olc, setOlc] = useState({ display: '', kolon: 0, oluk: '', aile: '', oran: '', renk: '' })
  useEffect(() => {
    const t = window.setTimeout(() => {
      const el = kutu.current
      if (!el) return
      const s = getComputedStyle(el)
      setOlc({ display: s.display, kolon: s.gridTemplateColumns.split(' ').length, oluk: s.columnGap, aile: s.fontFamily.split(',')[0].replace(/["']/g, '').trim(), oran: (parseFloat(s.lineHeight) / parseFloat(s.fontSize)).toFixed(3), renk: s.color })
    }, 200)
    return () => window.clearTimeout(t)
  }, [tema, kok])
  const esit = olc.display === 'grid' && olc.kolon === 12 && olc.oluk === '32px' && olc.oran === '1.625' && olc.renk.replace(/\s/g, '') === 'rgb(17,17,17)'
  return (
    <Bolum
      id="css"
      no="11"
      madde="Madde 15 · CSS / Tailwind yapısı"
      baslik="Tek satır"
      lead="Bütün düzen tek bir sınıf dizisinde toplanır: on iki kolon, otuz iki piksel oluk, sans, rahat satır aralığı ve mat kömür. Aşağıdaki kutu bu dizinin kendisiyle çizilir; değerler hesaplanan stilden okunur."
      not="* Tailwind'in neutral-900 rengi sayfa temasında #111111 olarak tanımlıdır; yani sınıf, tasarım belirtecinin adıdır."
    >
      <EditorialContainer className="gap-y-14">
        <div className="col-span-4 overflow-x-auto md:col-span-12" role="region" aria-label="Sınıf dizisiyle çizilen kutu" tabIndex={0}>
          <div ref={kutu} className="grid min-w-[900px] grid-cols-12 gap-8 border border-metin bg-white p-6 font-sans leading-relaxed text-neutral-900" data-css-kutu="">
            <p className="col-span-4 m-0 text-[1rem]">Bir sayfayı iyi yapan şey, üstündeki şeylerin çokluğu değil, aralarındaki ilişkilerin açıklığıdır.</p>
            <p className="col-span-4 m-0 text-[1rem]">Grid bu ilişkileri görünür kılan sessiz iskelettir: sütunlar, oluklar, kenar boşlukları ve ölçü.</p>
            <p className="col-span-4 m-0 text-[1rem]">Okur onu görmez; ama her şeyin yerli yerinde olduğunu hisseder.</p>
          </div>
        </div>
        <div className="col-span-4 md:col-span-3" data-kol="1">
          <AltEtiket>Sınıf dizisi</AltEtiket>
          <p className="mt-3 font-mono text-[0.875rem] leading-relaxed break-words" data-css-satir="">
            {CSS_SATIRI}
          </p>
        </div>
        <dl className="col-span-4 grid grid-cols-1 gap-x-[var(--bosluk)] sm:grid-cols-2 md:col-span-9 md:grid-cols-3" data-kol="4" data-css-olcum={`${olc.display}|${olc.kolon}|${olc.oluk}|${olc.aile}|${olc.oran}|${olc.renk}`} data-esit={esit ? 'evet' : 'hayir'}>
          {(
            [
              ['grid', 'display', olc.display],
              ['grid-cols-12', 'grid-template-columns', `${olc.kolon} kolon`],
              ['gap-8', 'column-gap', olc.oluk],
              ['font-sans', 'font-family', olc.aile],
              ['leading-relaxed', 'line-height ÷ font-size', olc.oran.replace('.', ',')],
              ['text-neutral-900', 'color', olc.renk],
            ] as const
          ).map(([sinif, ozellik, deger]) => (
            <div key={sinif} className="border-t border-cizgi py-3">
              <dt className="font-mono text-[0.8125rem]">{sinif}</dt>
              <dd className="m-0 mt-1">
                <span className="t-alt">{ozellik}</span>
                <span className="rakam block text-[1.125rem]">{deger || '—'}</span>
              </dd>
            </div>
          ))}
          <p className="t-alt col-span-full border-t border-metin pt-3" aria-live="polite">
            {esit ? 'Altı sınıfın hesaplanan değeri beklenenle aynı.' : 'Ölçülüyor…'}
          </p>
        </dl>
        <div className="col-span-4 md:col-span-9 md:col-start-4" data-kol="4">
          <Kod
            label="Duyarlı sınıf dizisi ve bileşen kullanımı"
            dar
          >{`// Dar ekranda 4, geniş ekranda 12 kolon\n<div className="grid grid-cols-4 gap-x-4 md:grid-cols-12 md:gap-x-8 font-sans leading-relaxed text-neutral-900">\n\n// Bileşenlerle\n<EditorialContainer as="section">\n  <ArticleHeader kicker="Tasarım" baslik="Izgara bir kafes değildir" seviye={2} />\n  <MultiColumnLayout sutun={3} ilkHarf>{paragraflar}</MultiColumnLayout>\n</EditorialContainer>`}</Kod>
        </div>
      </EditorialContainer>
    </Bolum>
  )
}
