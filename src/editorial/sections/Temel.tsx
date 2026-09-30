import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { EditorialContainer, Bolum } from '../components/Editorial'
import { Ikon } from '../components/Ikon'
import { Anahtar, Aralik, Buton, Kod, OkBaglanti, Secim } from '../components/ui'
import { IKONLAR, METIN, OLCEK, palet, type IkonAd } from '../lib/data'
import { satirOlc } from '../lib/olcu'
import { kontrast as kontrastHesap, oran } from '../lib/contrast'
import { yuzeyTara, type YuzeyTarama } from '../lib/tarama'
import { useEditorial, type Tema } from '../lib/store'

/* ───────────────────────── Madde 4 · Renk ───────────────────────── */

export function Renk() {
  const { tema, setTema, kontrast } = useEditorial()
  const p = palet(tema, kontrast)
  const satirlar: [string, string, string, string, string, 'aaa' | 'kontrol' | 'dekor', string, string][] = [
    ['Metin', p.metin, p.zemin, 'Zemin', 'Gövde ve başlık', 'aaa', 'metin', 'zemin'],
    ['İkincil metin', p.soluk, p.zemin, 'Zemin', 'Alt yazı, künye, üst yazı', 'aaa', 'soluk', 'zemin'],
    ['İkincil metin', p.soluk, p.yuzey, 'Yüzey', 'Kod bloğu, satır vurgusu', 'aaa', 'soluk', 'yuzey'],
    ['Zemin (ters)', p.zemin, p.metin, 'Metin', 'Dolu düğmenin etiketi', 'aaa', 'zemin', 'metin'],
    ['Denetim çizgisi', p.kontrol, p.zemin, 'Zemin', 'Form ve düğme çerçevesi (≥ 3:1)', 'kontrol', 'kontrol', 'zemin'],
    ['Yapısal çizgi', p.cizgi, p.zemin, 'Zemin', '1 px ayırıcı: yalnız yapı, metin değil', 'dekor', 'cizgi', 'zemin'],
  ]
  const karar = (k: number, tur: 'aaa' | 'kontrol' | 'dekor') => (tur === 'dekor' ? 'Yalnız yapı' : tur === 'kontrol' ? (k >= 3 ? 'Çizgi için yeterli' : 'Yetersiz') : k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : 'Yetersiz')
  const renkler: { ad: string; rol: string; hex: string; karsi: string; karsiAd: string; renk: string }[] = [
    { ad: p.ad, rol: 'Zemin', hex: p.zemin, karsi: p.metin, karsiAd: 'metin', renk: p.zemin },
    { ad: tema === 'gece' ? 'Kâğıt beyazı' : 'Mat kömür', rol: 'Metin', hex: p.metin, karsi: p.zemin, karsiAd: 'zemin', renk: p.metin },
    { ad: 'Hafif gri', rol: 'Yapısal çizgi', hex: p.cizgi, karsi: p.zemin, karsiAd: 'zemin', renk: p.cizgi },
  ]
  return (
    <Bolum
      id="renk"
      no="02"
      madde="Madde 4 · Renk paleti"
      baslik="Kâğıt, kömür, hafif gri"
      lead="Üç renk yeter: kâğıt beyazı zemin, mat kömür metin, hafif gri yalnız yapı çizgisi. Metnin hiçbir rengi 7:1 altında kalmaz; gri çizgi ise metin değildir, o yüzden soluk olabilir."
      not="* Kâğıt #FDFBF7 ile saf beyaz #FFFFFF arasında bir seçim var: krem uzun okumada gözü yormaz, beyaz ise daha keskindir."
    >
      <EditorialContainer className="gap-y-12">
        <ul className="col-span-4 grid grid-cols-1 gap-x-[var(--bosluk)] gap-y-8 md:col-span-12 md:grid-cols-3" data-paletler="">
          {renkler.map((r, i) => {
            const k = kontrastHesap(r.hex, r.karsi)
            return (
              <li key={r.rol} data-renk={r.hex} data-kol={i === 0 ? '1' : undefined}>
                <div className="h-44 border border-metin md:h-56" style={{ background: r.renk }} aria-hidden="true" />
                <p className="t-h3 mt-4">{r.ad}</p>
                <p className="t-etiket t-soluk mt-1">{r.rol}</p>
                <p className="rakam mt-3 text-[1.25rem]">{r.hex.toUpperCase()}</p>
                <p className="t-alt mt-1">{i === 2 ? `${oran(k)} ${r.karsiAd} üstünde: dekoratif, metin değil` : `${oran(k)} ${r.karsiAd} üstünde`}</p>
              </li>
            )
          })}
        </ul>

        <div className="col-span-4 md:col-span-3" data-kol="1">
          <Secim<Tema>
            legend="Kâğıt"
            name="renk-tema"
            value={tema}
            onChange={setTema}
            options={[
              { id: 'krem', ad: 'Krem' },
              { id: 'beyaz', ad: 'Beyaz' },
              { id: 'gece', ad: 'Gece' },
            ]}
          />
          <p className="t-alt mt-4" data-palet-not="">
            {tema === 'krem' ? 'Krem kâğıt #FDFBF7: varsayılan.' : tema === 'beyaz' ? 'Saf beyaz #FFFFFF: en keskin zıtlık.' : 'Gece: kömür zemin, kâğıt renkli metin.'}
          </p>
        </div>
        <div className="col-span-4 overflow-x-auto md:col-span-9" role="region" aria-label="Renk çiftleri kontrastı" tabIndex={0} data-kol="4">
          <table className="tablo w-full min-w-[640px]" data-renk-tablo="">
            <caption className="t-etiket t-soluk">Şu anki kâğıt: {p.ad}</caption>
            <thead>
              <tr>
                {['Renk', 'Zemin', 'Oran', 'Karar'].map((b) => (
                  <th key={b} scope="col">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {satirlar.map(([ad, fg, bg, bgAd, kul, tur]) => {
                const k = kontrastHesap(fg, bg)
                return (
                  <tr key={ad + bgAd} data-oran={k.toFixed(2)} data-tur={tur}>
                    <th scope="row">
                      <span className="mr-3 inline-block size-4 border border-metin align-[-2px]" style={{ background: fg }} aria-hidden="true" />
                      {ad}
                      <span className="t-alt block font-normal">{kul}</span>
                    </th>
                    <td>{bgAd}</td>
                    <td className="rakam">{oran(k)}</td>
                    <td>{karar(k, tur)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </EditorialContainer>
    </Bolum>
  )
}

/* ───────────────────────── Madde 5 · Yazı ───────────────────────── */

type YAile = 'serif' | 'sans'
type Hiza = 'sol' | 'yay'
const ALFABE = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'
const ALFABE_KUCUK = 'abcçdefgğhıijklmnoöprsştuüvyz'

export function Yazi() {
  const { boyut: kokBoyut } = useEditorial()
  const [aile, setAile] = useState<YAile>('serif')
  const [boyut, setBoyut] = useState(18)
  const [lh, setLh] = useState(1.625)
  const [olcu, setOlcu] = useState(58)
  const [iz, setIz] = useState(0)
  const [hiza, setHiza] = useState<Hiza>('sol')
  const [tire, setTire] = useState(true)
  const orn = useRef<HTMLParagraphElement>(null)
  const [olc, setOlc] = useState({ satir: 0, karakter: 0 })
  const metin = `${METIN[0]} ${METIN[2]}`
  useLayoutEffect(() => {
    const el = orn.current
    if (!el) return
    setOlc(satirOlc(el))
  }, [aile, boyut, lh, olcu, iz, hiza, tire, kokBoyut])
  useEffect(() => {
    const el = orn.current
    if (!el) return
    const ro = new ResizeObserver(() => setOlc(satirOlc(el)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const karar = olc.karakter < 45 ? 'Çok kısa: göz sık satır atlar' : olc.karakter > 75 ? 'Çok uzun: göz satır başını kaybeder' : 'Konfor bandında (45–75)'
  return (
    <Bolum
      id="yazi"
      no="03"
      madde="Madde 5 · Tipografi"
      baslik="Okunur iki aile"
      lead="Serif metin için, sans künye ve sayı için. İkisi de ekran okumasına göre çizilmiş; gövde metni her koşulda Newsreader, kırk beş ile yetmiş beş karakterlik satırlarda."
      not="* Helvetica Neue, Univers, Garamond ve New York lisanslıdır ya da yalnız bazı cihazlarda vardır. Sayfa aynı ruhtaki açık lisanslı karşılıklarını yükler; sistemde varsa bu adlar yedek olarak kullanılır."
    >
      <EditorialContainer className="gap-y-16">
        <div className="col-span-4 border-t border-metin pt-4 md:col-span-6" data-kol="1" data-ornek-serif="">
          <p className="t-etiket t-soluk">Serif · başlık ve gövde</p>
          <p className="t-display mt-2 !text-[clamp(4rem,10vw,8rem)]" aria-hidden="true">
            Aa
          </p>
          <p className="t-h3">Newsreader</p>
          <p className="t-govde mt-3 text-[1rem]">Optik boyut ve kalınlık eksenli; küçük boyda açık, büyük boyda ince. Türkçenin tüm harfleri ve ₺ işareti var.</p>
          <p className="mt-4 text-[1.125rem] leading-snug break-all" aria-hidden="true">
            {ALFABE}
            <br />
            {ALFABE_KUCUK} 0123456789 ₺ % § ¶
          </p>
        </div>
        <div className="col-span-4 border-t border-metin pt-4 md:col-span-6" data-ornek-sans="">
          <p className="t-etiket t-soluk">Sans · künye, etiket, sayı</p>
          <p className="t-display sans mt-2 !text-[clamp(4rem,10vw,8rem)] !font-semibold" aria-hidden="true">
            Aa
          </p>
          <p className="t-h3 sans !font-semibold">Inter Tight</p>
          <p className="t-govde sans mt-3 text-[1rem]">Helvetica Neue ve Univers ruhunda sıkı aralıklı grotesk. Tablo sayıları eş genişlikte (tnum), sayfa numaraları hizalı.</p>
          <p className="sans mt-4 text-[1.125rem] leading-snug break-all" aria-hidden="true">
            {ALFABE}
            <br />
            {ALFABE_KUCUK} 0123456789 ₺ % § ¶
          </p>
        </div>

        <div className="col-span-4 grid content-start gap-5 md:col-span-3" data-kol="1" data-yazi-kontrol="">
          <Secim<YAile>
            legend="Yazı tipi"
            name="yazi-aile"
            value={aile}
            onChange={setAile}
            options={[
              { id: 'serif', ad: 'Serif' },
              { id: 'sans', ad: 'Sans' },
            ]}
          />
          <Aralik id="yazi-boyut" label="Boyut" value={boyut} min={12} max={32} onChange={setBoyut} format={(v) => `${v} px`} />
          <Aralik id="yazi-lh" label="Satır yüksekliği" value={lh} min={1} max={2} step={0.025} onChange={setLh} format={(v) => v.toFixed(3).replace(/0$/, '').replace('.', ',')} />
          <Aralik id="yazi-olcu" label="Ölçü (satır uzunluğu)" value={olcu} min={24} max={100} onChange={setOlcu} format={(v) => `${v} ch`} />
          <Aralik id="yazi-iz" label="Harf aralığı" value={iz} min={-0.02} max={0.1} step={0.005} onChange={setIz} format={(v) => `${v.toFixed(3).replace('.', ',')} em`} />
          <Secim<Hiza>
            legend="Hizalama"
            name="yazi-hiza"
            value={hiza}
            onChange={setHiza}
            options={[
              { id: 'sol', ad: 'Sola' },
              { id: 'yay', ad: 'İki yana' },
            ]}
          />
          <Anahtar label="Tireleme" checked={tire} onChange={setTire} hint="hyphens: auto" />
          <Buton
            ton="yalin"
            onClick={() => {
              setAile('serif')
              setBoyut(18)
              setLh(1.625)
              setOlcu(58)
              setIz(0)
              setHiza('sol')
              setTire(true)
            }}
            data-sifirla=""
          >
            Sıfırla
          </Buton>
        </div>
        <div className="col-span-4 md:col-span-9" data-kol="4">
          <div className="overflow-x-clip border-y border-metin py-8">
            <p
              ref={orn}
              lang="tr"
              className="m-0"
              style={
                {
                  fontFamily: aile === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)',
                  fontSize: `${boyut}px`,
                  lineHeight: lh,
                  maxWidth: `${olcu}ch`,
                  letterSpacing: `${iz}em`,
                  textAlign: hiza === 'sol' ? 'left' : 'justify',
                  hyphens: tire ? 'auto' : 'manual',
                  textWrap: 'pretty',
                } as CSSProperties
              }
              data-ornek=""
            >
              {metin}
            </p>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-[var(--bosluk)] gap-y-4 sm:grid-cols-4" data-yazi-olcum={`${olc.satir}|${olc.karakter}`}>
            <div>
              <dt className="t-etiket t-soluk">Boyut / satır</dt>
              <dd className="rakam m-0 mt-1 text-[1.25rem]">
                {boyut} / {Math.round(boyut * lh * 10) / 10} px
              </dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Satır sayısı</dt>
              <dd className="rakam m-0 mt-1 text-[1.25rem]">{olc.satir}</dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Satır başına karakter</dt>
              <dd className="rakam m-0 mt-1 text-[1.25rem]" data-karakter-say={olc.karakter}>
                {olc.karakter}
              </dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Karar</dt>
              <dd className="m-0 mt-1 text-[1rem] leading-snug" data-karar="">
                {karar}
              </dd>
            </div>
          </dl>
        </div>
      </EditorialContainer>
    </Bolum>
  )
}

/* ───────────────────────── Madde 6 · Şekil ───────────────────────── */

function KuralOrnek({ ad, sinif, aciklama }: { ad: string; sinif: string; aciklama: string }) {
  const r = useRef<HTMLDivElement>(null)
  const [w, setW] = useState('')
  useEffect(() => {
    if (!r.current) return
    const s = getComputedStyle(r.current)
    setW(s.borderTopWidth === '0px' ? s.borderBottomWidth : s.borderTopWidth)
  }, [])
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-6 border-t border-cizgi py-5" data-kural-satir={ad}>
      <div>
        <p className="font-semibold leading-snug">{ad}</p>
        <p className="t-alt">{aciklama}</p>
      </div>
      <p className="rakam t-alt" data-kalinlik={w}>
        {w}
      </p>
      <div ref={r} className={cx('col-span-2 mt-4', sinif)} aria-hidden="true" />
    </li>
  )
}

export function Sekil() {
  const [tara, setTara] = useState<YuzeyTarama | null>(null)
  useEffect(() => {
    const t = window.setTimeout(() => setTara(yuzeyTara()), 400)
    return () => window.clearTimeout(t)
  }, [])
  return (
    <Bolum
      id="sekil"
      no="04"
      madde="Madde 6 · Şekil dili"
      baslik="Dik açı, ince çizgi"
      lead="Köşe yok: her kutu 90 derece, her yuvarlak yarıçap sıfır. Ayırıcı çizgi bir piksel; yalnız bölümün başında iki, manşetin altında dört piksel."
      not="* Bir piksellik çizgi, bilgisayar ekranında ne varsa onun en ince halidir. Yüksek yoğunluklu ekranlarda da 1 CSS pikseli olarak kalır."
    >
      <EditorialContainer className="gap-y-14">
        <ul className="col-span-4 md:col-span-6" data-kol="1" data-kurallar="">
          <KuralOrnek ad="İnce ayırıcı" sinif="kural" aciklama="1 px, hafif gri. Satır, sütun ve liste ayracı." />
          <KuralOrnek ad="Koyu çizgi" sinif="kural-koyu" aciklama="1 px, mat kömür. Tablo başlığının altı." />
          <KuralOrnek ad="Bölüm çizgisi" sinif="border-t-2 border-metin" aciklama="2 px, mat kömür. Her bölümün ve makalenin üstü." />
          <KuralOrnek ad="Kalın çizgi" sinif="kural-kalin" aciklama="4 px, mat kömür. Yalnız gazete manşetinin üstü." />
        </ul>
        <div className="col-span-4 md:col-span-6">
          <p className="t-etiket t-soluk border-t border-metin pt-3">Katı kutular</p>
          <div className="mt-4 grid grid-cols-6 gap-[var(--bosluk)]" aria-hidden="true">
            <div className="kutu-koyu col-span-4 h-24 p-3 sans text-[0.75rem]">4 kolon</div>
            <div className="kutu col-span-2 h-24 p-3 sans text-[0.75rem]">2 kolon</div>
            <div className="kutu col-span-2 h-24 p-3 sans text-[0.75rem]">2</div>
            <div className="kutu col-span-2 h-24 p-3 sans text-[0.75rem]">2</div>
            <div className="kutu-koyu col-span-2 h-24 p-3 sans text-[0.75rem]">2</div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-[var(--bosluk)] gap-y-4" data-sekil-tarama={tara ? `${tara.kose}|${tara.n}` : ''}>
            <div>
              <p className="t-etiket t-soluk">Yuvarlak köşeli öğe</p>
              <p className="rakam mt-1 text-[2rem] leading-none" data-kose={tara ? tara.kose : ''}>
                {tara ? tara.kose : '—'}
              </p>
            </div>
            <div>
              <p className="t-etiket t-soluk">Taranan öğe</p>
              <p className="rakam mt-1 text-[2rem] leading-none">{tara ? tara.n : '—'}</p>
            </div>
            <div className="col-span-2">
              <p className="t-alt">Sayfadaki her öğenin köşe yarıçapı hesaplanan stilden okunur.</p>
            </div>
          </div>
        </div>
      </EditorialContainer>
    </Bolum>
  )
}

/* ───────────────────────── Madde 7 · Derinlik ───────────────────────── */

const ORNEK_METIN: Record<string, string> = {
  Display: 'Kolon',
  'Başlık 1': 'Sayfa mimarisi',
  'Başlık 2': 'Ölçü ve ritim',
  'Başlık 3': 'Boşluk bir malzemedir',
  Dek: 'Bir cetvel, kafes değil.',
  Gövde: 'Metin, sayfanın taşıyıcı elemanıdır.',
  'Alt yazı': 'Kaan Ünal · 11 dk okuma',
  Etiket: 'Tasarım · Sayfa 12',
}

function OlcekSatiri({ o }: { o: (typeof OLCEK)[number] }) {
  const r = useRef<HTMLParagraphElement>(null)
  const { boyut: kok } = useEditorial()
  const [olc, setOlc] = useState('')
  useLayoutEffect(() => {
    if (!r.current) return
    const s = getComputedStyle(r.current)
    setOlc(`${parseFloat(s.fontSize)}|${Math.round(parseFloat(s.lineHeight) * 10) / 10}`)
  }, [kok])
  const [px, lhPx] = olc.split('|')
  return (
    <li className="g items-baseline border-t border-cizgi py-5" data-olcek-satir={o.ad} data-olc={olc}>
      <div className="col-span-4 md:col-span-3" data-kol="1">
        <p className="font-semibold leading-snug">{o.ad}</p>
        <p className="t-alt">{o.kullanim}</p>
        <p className="rakam t-alt mt-1">
          {px ?? o.boyut} px / {lhPx ?? '—'} px · {o.aile === 'serif' ? 'serif' : 'sans'} {o.agirlik}
        </p>
      </div>
      <p
        ref={r}
        className={cx('col-span-4 mt-2 md:col-span-9 md:mt-0', o.aile === 'sans' ? 'sans' : '', o.ad === 'Etiket' && 'uppercase')}
        style={{ fontFamily: o.aile === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)', fontWeight: o.agirlik, fontSize: o.boyut, lineHeight: o.lh, letterSpacing: o.ad === 'Etiket' ? '0.12em' : o.boyut >= 48 ? '-0.03em' : 0, overflowWrap: 'anywhere' }}
        data-kol="4"
      >
        {ORNEK_METIN[o.ad]}
      </p>
    </li>
  )
}

export function Derinlik() {
  const { tema, kontrast } = useEditorial()
  const [r, setR] = useState(1.333)
  const [tara, setTara] = useState<YuzeyTarama | null>(null)
  useEffect(() => {
    const t = window.setTimeout(() => setTara(yuzeyTara()), 500)
    return () => window.clearTimeout(t)
  }, [tema, kontrast])
  const basamaklar = useMemo(() => [-2, -1, 0, 1, 2, 3, 4].map((n) => ({ n, px: Math.round(18 * Math.pow(r, n) * 10) / 10 })), [r])
  return (
    <Bolum
      id="derinlik"
      no="05"
      madde="Madde 7 · Z ekseni ve gölge"
      baslik="Boyutla derinlik"
      lead="Sıfır gölge. Sayfada ön ve arka plan yok; 72 piksellik bir başlık ile 14 piksellik bir alt yazı arasındaki fark, derinliğin kendisidir."
      not="* Ölçekler bir oranla kurulur: her basamak öncekinin sabit bir katıdır. Aşağıdaki kaydırıcı oranı değiştirir, basamaklar birlikte yer değiştirir."
    >
      <EditorialContainer className="gap-y-16">
        <div className="col-span-4 md:col-span-12">
          <ul data-olcek="">
            {OLCEK.map((o) => (
              <OlcekSatiri key={o.ad} o={o} />
            ))}
          </ul>
          <p className="t-alt border-t border-metin pt-3">
            En büyük ile en küçük gövde başlığı arası:{' '}
            <span className="rakam" data-oran-72-14={(72 / 14).toFixed(2)}>
              {(72 / 14).toFixed(2).replace('.', ',')}
            </span>{' '}
            kat (72 px : 14 px).
          </p>
        </div>

        <div className="col-span-4 grid content-start gap-4 md:col-span-3" data-kol="1">
          <Aralik id="olcek-oran" label="Ölçek oranı" value={r} min={1.125} max={1.618} step={0.005} onChange={setR} format={(v) => v.toFixed(3).replace('.', ',')} />
          <p className="t-alt">18 px gövdeden başlayarak yukarı ve aşağı. 1,250 büyük üçlü, 1,333 tam dörtlü, 1,618 altın oran.</p>
        </div>
        <ol className="col-span-4 md:col-span-9" data-kol="4" data-basamaklar={basamaklar.map((b) => b.px).join(',')}>
          {[...basamaklar].reverse().map((b) => (
            <li key={b.n} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 overflow-x-clip border-t border-cizgi py-2">
              <span className="min-w-0 leading-none" style={{ fontFamily: b.px < 14 ? 'var(--font-sans)' : 'var(--font-serif)', fontSize: b.px, fontWeight: b.px >= 24 ? 600 : 400, letterSpacing: b.px >= 48 ? '-0.03em' : 0, whiteSpace: 'nowrap' }} aria-hidden="true">
                Aa
              </span>
              <span className="rakam t-alt shrink-0">
                n = {b.n} · {b.px.toFixed(1).replace('.', ',')} px
              </span>
            </li>
          ))}
        </ol>

        <div className="col-span-4 border-t border-metin pt-3 md:col-span-12" data-golge-sayac={tara ? tara.golge : ''}>
          <p className="t-etiket t-soluk">Canlı sayım</p>
          <p className="t-h1 mt-2 !text-[clamp(2.5rem,6vw,4.5rem)]">
            <span className="rakam">{tara ? tara.golge : '—'}</span> öğede gölge
          </p>
          <p className="t-alt mt-2">Sayfadaki {tara ? tara.n : '…'} öğenin hiçbirinde box-shadow ya da text-shadow yok.</p>
        </div>
      </EditorialContainer>
    </Bolum>
  )
}

/* ───────────────────────── Madde 8 · Yüzey ───────────────────────── */

export function Yuzey() {
  const { tema, setTema, kontrast, izgara, setIzgara } = useEditorial()
  const [tara, setTara] = useState<YuzeyTarama | null>(null)
  useEffect(() => {
    const t = window.setTimeout(() => setTara(yuzeyTara()), 500)
    return () => window.clearTimeout(t)
  }, [tema, kontrast])
  const kagitlar: { id: Tema; ad: string; not: string }[] = [
    { id: 'krem', ad: 'Krem kâğıt', not: 'Uzun okuma için' },
    { id: 'beyaz', ad: 'Beyaz kâğıt', not: 'En keskin zıtlık' },
    { id: 'gece', ad: 'Gece', not: 'Karanlıkta okuma' },
  ]
  return (
    <Bolum
      id="yuzey"
      no="06"
      madde="Madde 8 · Doku ve yüzey"
      baslik="Mat ve dokusuz"
      lead="Yüzey temizdir: gradyan yok, gölge yok, filtre yok, görsel yok. Kâğıt hissi bir dokudan değil, boşluktan ve çizgiden gelir."
      not="* Üç kâğıt da aynı iskeleti kullanır. Değişen yalnız üç renk değeridir; kontrast oranları AAA'nın altına inmez."
    >
      <EditorialContainer className="gap-y-14">
        <ul className="col-span-4 grid grid-cols-1 gap-[var(--bosluk)] md:col-span-12 md:grid-cols-3" data-kagitlar="">
          {kagitlar.map((k, i) => {
            const p = palet(k.id, kontrast)
            const on = tema === k.id
            return (
              <li key={k.id} data-kol={i === 0 ? '1' : undefined}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTema(k.id)}
                  className="block h-full w-full border p-6 text-left"
                  style={{ background: p.zemin, color: p.metin, borderColor: on ? p.metin : p.kontrol, borderWidth: on ? 2 : 1, padding: on ? 'calc(1.5rem - 1px)' : '1.5rem' }}
                  data-kagit={k.id}
                >
                  <span className="t-etiket block" style={{ color: p.soluk }}>
                    {on ? 'Seçili' : 'Uygula'} · {k.not}
                  </span>
                  <span className="t-h2 mt-6 block">{k.ad}</span>
                  <span className="mt-3 block text-[1.0625rem] leading-relaxed">Mat, dokusuz, saf. Metin kâğıdın üstünde durur, altında hiçbir şey yoktur.</span>
                  <span className="rakam mt-6 block text-[0.875rem]" style={{ color: p.soluk }}>
                    {p.zemin.toUpperCase()} · {p.metin.toUpperCase()} · {oran(kontrastHesap(p.metin, p.zemin))}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="col-span-4 grid grid-cols-2 gap-x-[var(--bosluk)] gap-y-6 border-t border-metin pt-3 md:col-span-9 md:col-start-4 md:grid-cols-4" data-kol="4" data-yuzey-tarama={tara ? `${tara.gradyan}|${tara.golge}|${tara.filtre}|${tara.gorsel}` : ''}>
          {(
            [
              ['Gradyan ve maske', tara?.gradyan],
              ['Gölge', tara?.golge],
              ['Filtre', tara?.filtre],
              ['Görsel ve tuval', tara?.gorsel],
            ] as const
          ).map(([a, v]) => (
            <div key={a}>
              <p className="t-etiket t-soluk">{a}</p>
              <p className="rakam mt-1 text-[2.5rem] leading-none">{v ?? '—'}</p>
            </div>
          ))}
        </div>
        <div className="col-span-4 md:col-span-3 md:row-start-2" data-kol="1">
          <Anahtar label="Kolon kılavuzu" checked={izgara === 'acik'} onChange={(v) => setIzgara(v ? 'acik' : 'kapali')} hint="Sayfanın 12 kolonunu üstüne bindirir" />
        </div>
      </EditorialContainer>
    </Bolum>
  )
}

/* ───────────────────────── Madde 9 · Simgeler ───────────────────────── */

export function Simge() {
  const [kalin, setKalin] = useState(1.25)
  const [boy, setBoy] = useState(28)
  const [say, setSay] = useState<{ n: number; kalin: string }>({ n: 0, kalin: '' })
  useEffect(() => {
    const t = window.setTimeout(() => {
      const hepsi = Array.from(document.querySelectorAll<SVGElement>('main svg.ikon'))
      const w = [...new Set(hepsi.map((s) => parseFloat(getComputedStyle(s).strokeWidth)))].sort((a, b) => a - b)
      setSay({ n: hepsi.length, kalin: w.length ? (w.length === 1 ? String(w[0]) : `${w[0]}–${w[w.length - 1]}`) : '' })
    }, 400)
    return () => window.clearTimeout(t)
  }, [kalin])
  return (
    <Bolum
      id="ikon"
      no="07"
      madde="Madde 9 · İkonografi"
      baslik="İnce çizgiler"
      lead="Simge yalnız hiyerarşiyi destekler: bir ok devam etmeyi, artı açmayı, yıldız bir dipnotu söyler. Çizgi 1,25 piksel, uç kare, köşe sivri; hiçbiri dolu değildir."
      not="* Boyut değişse de çizgi kalınlığı sabit kalır (non-scaling-stroke). Aşağıdaki kaydırıcılar ikisini ayrı ayrı oynatır."
    >
      <EditorialContainer className="gap-y-14">
        <div className="col-span-4 md:col-span-3 grid content-start gap-4" data-kol="1">
          <Aralik id="ikon-kalin" label="Çizgi kalınlığı" value={kalin} min={0.75} max={2.5} step={0.25} onChange={setKalin} format={(v) => `${v.toFixed(2).replace('.', ',')} px`} />
          <Aralik id="ikon-boy" label="Boyut" value={boy} min={16} max={64} step={2} onChange={setBoy} format={(v) => `${v} px`} />
          <div data-ikon-say={say.n} data-ikon-kalin={say.kalin}>
            <p className="t-etiket t-soluk">Sayfadaki çizgi simge</p>
            <p className="rakam mt-1 text-[2.5rem] leading-none">{say.n}</p>
            <p className="t-alt mt-1">Çizgi kalınlığı: {say.kalin ? `${say.kalin} px` : '—'}. Dolu, gölgeli ya da renkli simge yok.</p>
          </div>
        </div>
        <ul className="col-span-4 grid grid-cols-2 gap-x-[var(--bosluk)] gap-y-0 sm:grid-cols-3 md:col-span-9 lg:grid-cols-4" style={{ ['--ikon-kalin' as string]: kalin }} data-kol="4" data-glifler="">
          {IKONLAR.map((i) => (
            <li key={i.ad} className="border-t border-cizgi py-5" data-glif-kart={i.ad}>
              <Ikon ad={i.ad as IkonAd} boyut={boy} />
              <p className="mt-3 leading-snug font-semibold">{i.anlam}</p>
              <p className="t-alt">{i.kullanim}</p>
            </li>
          ))}
        </ul>
        <div className="col-span-4 md:col-span-6 md:col-start-4" data-kol="4">
          <p className="t-etiket t-soluk border-t border-metin pt-3">Bağlantı kalıpları</p>
          <div className="mt-2 flex flex-wrap gap-x-8 gap-y-1">
            <OkBaglanti href="#alanlar">Devamını oku</OkBaglanti>
            <OkBaglanti href="#alanlar" ikon="ok-sol" className="flex-row-reverse">
              Önceki sayı
            </OkBaglanti>
            <OkBaglanti href="https://github.com/senozlu53/webdetest" ikon="dis" rel="noreferrer">
              Kaynak kod
            </OkBaglanti>
          </div>
        </div>
        <div className="col-span-4 md:col-span-3 md:col-start-10" data-kol="10">
          <p className="t-etiket t-soluk border-t border-metin pt-3">Metin işaretleri</p>
          <dl className="mt-2 grid grid-cols-[2rem_1fr] gap-y-1" data-isaretler="">
            {(
              [
                ['*', 'Dipnot çağrısı'],
                ['†', 'İkinci dipnot'],
                ['‡', 'Üçüncü dipnot'],
                ['§', 'Bölüm'],
                ['¶', 'Paragraf'],
              ] as const
            ).map(([g, a]) => (
              <div key={g} className="col-span-2 grid grid-cols-subgrid items-baseline">
                <dt className="text-[1.5rem] leading-none">{g}</dt>
                <dd className="t-alt m-0">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="col-span-4 md:col-span-9 md:col-start-4" data-kol="4">
          <Kod label="Simge kalıbı" dar>{`.ikon { width: 1.5rem; height: 1.5rem; fill: none; stroke: currentColor;\n         stroke-width: 1.25; stroke-linecap: square; stroke-linejoin: miter; }\n/* path { vector-effect: non-scaling-stroke } → boyut değişse de çizgi 1,25 px */`}</Kod>
        </div>
      </EditorialContainer>
    </Bolum>
  )
}
