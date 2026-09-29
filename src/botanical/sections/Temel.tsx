import { useMemo, useState } from 'react'
import { cx } from '../../shared/cx'
import { karis, kontrast, oran } from '../lib/contrast'
import { DOKU_AD, RENKLER, TEMA_RENK } from '../lib/data'
import { ARAYUZ_SIMGELERI, DOGA_SIMGELERI, SIMGE_AD } from '../lib/simge'
import { useBotanical, type Doku } from '../lib/store'
import { Dal, EcoButton, MASKE_AD, MASKE_YOLLARI, type MaskeAd } from '../components/Botanical'
import { Ikon } from '../components/Ikon'
import { Aralik, Belir, Kod, Secim, Section } from '../components/ui'

/* ───────────────────────── Madde 4 · Palet ───────────────────────── */

const RADIUS = ['58% 42% 63% 37% / 46% 55% 45% 54%', '40% 60% 46% 54% / 58% 42% 58% 42%', '52% 48% 38% 62% / 44% 60% 40% 56%', '62% 38% 55% 45% / 52% 48% 52% 48%']

export function Palet() {
  const { tema } = useBotanical()
  const t = TEMA_RENK[tema]
  const satirlar: [string, string, string, string, number, string][] = [
    ['Orman yazı', t.metin, t.zemin, 'Gövde metni, sayfa zemini üstünde', 4.5, 'metin'],
    ['Orman yazı', t.metin, t.yuzey, 'Kart ve panel üstünde', 4.5, 'metin'],
    ['Soluk yazı', t.soluk, t.yuzey, 'İkincil metin', 4.5, 'soluk'],
    ['Zeytin (yazı)', t.zeytinYazi, t.yuzey, 'Vurgu ve bağlantı', 4.5, 'zeytin'],
    ['Derin kil (yazı)', t.kilYazi, t.yuzey, 'Üst yazı, hata', 4.5, 'kil'],
    ['Orman yazı', '#2F4F4F', '#D2B48C', 'Toprak Beji yüzey üstünde', 4.5, 'bej'],
    ['Derin kömür-orman', '#1F3232', '#D2B48C', 'Toprak Beji üstünde (önerilen)', 4.5, 'bej2'],
    ['Koyu yazı', '#1C2E2E', '#C86D51', 'Terracotta düğme, 19,5 px 700 (büyük metin)', 3, 'kilbtn'],
    ['Terracotta', '#C86D51', '#F4EEE1', 'Küçük yazı olarak kullanılmaz', 4.5, 'kilyazi'],
  ]
  return (
    <Section
      id="palet"
      ikon="toprak"
      madde="Madde 4 · 13 · Renk"
      title={
        <>
          Kil, zeytin, <span className="vurgu">toprak</span> ve orman
        </>
      }
      lead="Dört tanım rengi ailesi: her birinin açıktan koyuya beş basamağı var; derinlik bu basamaklardan gelir. Toprak tonları bazen düşük kontrast verdiği için metin daima orman yeşili ya da derin kömür; kontrast canlı hesaplanır, tema değişince tablo da değişir."
    >
      <ul className="m-0 grid list-none grid-cols-2 gap-x-5 gap-y-10 p-0 sm:gap-x-8 lg:grid-cols-4" data-renkler="">
        {RENKLER.map((r, i) => (
          <Belir as="li" key={r.token} gecikme={i * 90} className={cx('min-w-0', i % 2 ? 'lg:mt-10' : '')}>
            <div className="aspect-[5/4] w-full" style={{ background: r.hex, borderRadius: RADIUS[i], boxShadow: 'var(--golge-1)' }} data-swatch={r.hex} role="img" aria-label={`${r.ad} ${r.hex}`} />
            <div className="mt-3 flex h-3 overflow-hidden" style={{ borderRadius: 99 }} aria-hidden="true" data-tonlar="">
              {r.tonlar.map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <p className="baslik mt-4 text-[clamp(19px,2vw,24px)]">{r.ad}</p>
            <p className="rakam text-[clamp(18px,2vw,22px)]">{r.hex}</p>
            <p className="font-mono text-[12.5px] break-all text-soluk">{r.token}</p>
            <p className="mt-2 text-[15.5px] text-soluk">{r.rol}</p>
            <p className="mt-2 flex items-center gap-2 text-[15px]">
              <span className="size-4 shrink-0" style={{ background: r.yazi, borderRadius: '0 100% 0 100%' }} aria-hidden="true" />
              <span>
                {r.yaziAd} <span className="font-mono text-[12.5px]">{r.yazi}</span>
              </span>
            </p>
          </Belir>
        ))}
      </ul>

      <div className="yuzey mt-[var(--aralik)] p-6 sm:p-9">
        <div className="overflow-x-auto" role="region" aria-label="Kontrast tablosu" tabIndex={0}>
          <table className="tablo w-full min-w-[680px] border-collapse text-[16.5px]" data-kontrast-tablo="">
            <caption>Kontrast · {{ keten: 'Keten', toprak: 'Toprak', orman: 'Orman' }[tema]} teması</caption>
            <thead>
              <tr>
                {['Renk', 'Zemin', 'Oran', 'Kullanım', 'Sonuç'].map((b) => (
                  <th key={b} scope="col" className="etiket">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {satirlar.map(([ad, fg, bg, kullanim, hedef, anahtar]) => {
                const k = kontrast(fg, bg)
                const gecti = k >= hedef
                return (
                  <tr key={anahtar} data-kontrast-satir={anahtar}>
                    <th scope="row" className="font-semibold">
                      <span className="mr-2 inline-block size-3.5 align-middle" style={{ background: fg, borderRadius: '0 100% 0 100%' }} aria-hidden="true" />
                      {ad}
                    </th>
                    <td className="font-mono text-[13px]">{bg.toUpperCase()}</td>
                    <td className="rakam" data-oran={k.toFixed(2)}>
                      {oran(k)}
                    </td>
                    <td className="text-soluk">{kullanim}</td>
                    <td>
                      <span className="font-bold">{gecti ? '✓ ' : '✕ '}</span>
                      {hedef === 3 ? (gecti ? 'Büyük metin (AA)' : 'Yetersiz') : gecti ? (k >= 7 ? 'AAA' : 'AA') : anahtar === 'kilyazi' ? 'Yalnız dolgu' : 'Yetersiz'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-[70ch] text-[16px] text-soluk">Terracotta yalnız dolgu, rozet ve büyük kalın yazı içindir; Toprak Beji üstünde orman yeşili sınırda kalır (4,5:1), bu yüzden bej yüzeylerde derin kömür-orman tercih edilir.</p>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 5 · Yazı ───────────────────────── */

type Yuz = 'baslik' | 'metin' | 'yumusak'
const YUZLER: Record<Yuz, { ad: string; sinif: string; not: string }> = {
  baslik: { ad: 'Playfair Display', sinif: 'font-baslik', not: 'Serif, başlık. Yüksek kontrastlı, sıcak, dergi hissi.' },
  metin: { ad: 'DM Sans', sinif: 'font-metin', not: 'Gövde ve arayüz. Geometrik ama yumuşak; ₺ ve Türkçe karakterler var.' },
  yumusak: { ad: 'Quicksand', sinif: 'font-yumusak', not: 'Düğme, etiket, rakam. Yuvarlak uçlu, samimi.' },
}

export function Yazi() {
  const [metin, setMetin] = useState('Toprağa yakın')
  const [boy, setBoy] = useState(60)
  const [yuz, setYuz] = useState<Yuz>('baslik')
  const [agirlik, setAgirlik] = useState(600)
  return (
    <Section
      id="yazi"
      ikon="cicek"
      madde="Madde 5 · Yazı tipi"
      title={
        <>
          Sıcak serif, <span className="vurgu">yumuşak</span> sans
        </>
      }
      lead="Başlıkta Playfair Display, gövdede DM Sans, düğme ve etiketlerde Quicksand: doğal ve samimi. Üçünde de ğ, ş, ı, İ, ç, ö, ü var; ₺ DM Sans ve Quicksand’da mevcut, başlıkta DM Sans tamamlar."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="yuzey min-w-0 p-6 sm:p-9 lg:col-span-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="yz-metin" className="etiket">
                Kendi metnin
              </label>
              <input id="yz-metin" className="alan mt-1.5" value={metin} maxLength={40} onChange={(e) => setMetin(e.target.value)} autoComplete="off" />
            </div>
            <Secim<Yuz> legend="Yazı yüzü" name="yz-yuz" value={yuz} onChange={setYuz} options={(Object.keys(YUZLER) as Yuz[]).map((k) => ({ id: k, ad: YUZLER[k].ad }))} />
          </div>
          <p className={cx('mt-8 leading-[1.08]', YUZLER[yuz].sinif)} style={{ fontSize: `min(${boy}px, 11vw)`, fontWeight: agirlik }} data-ornek="ana">
            {metin || '…'}
          </p>
          <p className="mt-2 text-[16px] text-soluk">{YUZLER[yuz].not}</p>
          <p className="baslik mt-6 leading-[1.2]" style={{ fontSize: 'clamp(22px,3vw,34px)' }} data-ornek="baslik">
            Öğrenci çağı, ığdır şehri, ĞÖŞÜ İÇ · 12.400 ₺
          </p>
          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            <Aralik label="Boy" value={boy} min={28} max={96} step={2} onChange={setBoy} format={(v) => `${v}px`} />
            <Aralik label="Kalınlık" value={agirlik} min={400} max={800} step={50} onChange={setAgirlik} format={(v) => String(v)} />
          </div>
        </div>
        <ul className="m-0 grid min-w-0 list-none grid-cols-1 content-start gap-6 p-0 lg:col-span-4">
          {(Object.keys(YUZLER) as Yuz[]).map((k) => (
            <li key={k} className="yuzey p-5">
              <p className="kicker">{{ baslik: 'Başlık · 400–900', metin: 'Gövde · 100–1000', yumusak: 'Düğme · 300–700' }[k]}</p>
              <p className={cx(YUZLER[k].sinif, 'mt-1 text-[clamp(24px,2.6vw,32px)] leading-[1.1] [overflow-wrap:anywhere]')}>{YUZLER[k].ad}</p>
              <p className={cx(YUZLER[k].sinif, 'mt-2 text-[18px]')}>Aa Bb Çç Ğğ İi Iı Öö Şş Üü 0123 ₺</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[var(--aralik)] grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-12">
        <div className="yuzey min-w-0 p-6 sm:p-9 md:col-span-7">
          <p className="kicker">Ölçek</p>
          <div className="mt-2 grid gap-1">
            {[
              ['Başlık 1', 'font-baslik font-semibold text-[clamp(30px,4vw,52px)] leading-[1.1]', 'Zeytinin sabrı'],
              ['Başlık 2', 'font-baslik font-semibold text-[clamp(24px,2.8vw,34px)] leading-[1.15]', 'Bu haftanın hasadı'],
              ['Başlık 3', 'font-baslik font-semibold text-[24px]', 'Dağ kekiği'],
              ['Vurgu', 'font-baslik italic font-medium text-[26px] text-kil-yazi', 'Elle toplandı'],
              ['Gövde', 'text-[17.5px]', 'Her kavanoz, kendi tarlasının adını taşır.'],
              ['Düğme', 'font-yumusak font-bold text-[17px]', 'Sepete ekle'],
              ['Etiket', 'kicker', 'Yerel üretici'],
            ].map(([ad, sinif, orn]) => (
              <div key={ad} className="grid grid-cols-[84px_1fr] items-baseline gap-x-4 py-1.5">
                <span className="font-mono text-[12.5px] text-soluk">{ad}</span>
                <span className={sinif}>{orn}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="min-w-0 md:col-span-5">
          <blockquote className="m-0 yuzey p-6 sm:p-8">
            <p className="dropcap text-[18.5px]">Toprak, her şeyi hatırlayan sessiz bir defterdir. Ne ekersen onu yazar; ne kadar özen gösterirsen o kadar kalın harflerle.</p>
            <footer className="mt-4 text-[16px] text-soluk">Hasan Usta, zeytin üreticisi</footer>
          </blockquote>
          <Kod label="Yazı tipi tokenları" className="mt-6" sar={false}>{`Typography/Heading
  Playfair Display · 600 · 1.1
Typography/Body
  DM Sans · 420 · 17.5px / 1.68
Typography/Button
  Quicksand · 700 · 17px`}</Kod>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 6 · Şekil ───────────────────────── */

const HAZIR: Record<string, [number, number, number, number]> = {
  taş: [58, 42, 63, 37],
  yaprak: [8, 92, 8, 92],
  damla: [50, 50, 50, 6],
  çakıl: [44, 62, 40, 58],
}

export function Sekil() {
  const [d, setD] = useState<[number, number, number, number]>(HAZIR['taş'])
  const [hazir, setHazir] = useState('taş')
  const sec = (ad: string) => {
    setHazir(ad)
    setD(HAZIR[ad])
  }
  const yari = `${d[0]}% ${d[1]}% ${d[2]}% ${d[3]}% / ${d[3]}% ${d[0]}% ${d[1]}% ${d[2]}%`
  const en = Math.max(...d)
  const az = Math.min(...d)
  const simetri = en - az
  const AD = ['Sol üst', 'Sağ üst', 'Sağ alt', 'Sol alt']
  return (
    <Section
      id="sekil"
      ikon="yaprak"
      madde="Madde 6 · 13 · Şekil dili"
      title={
        <>
          Yaprak ve taş gibi <span className="vurgu">yumuşak</span>
        </>
      }
      lead="Köşeler asimetrik: her biri farklı bir yarıçap, yatay ve dikey yarıçap da farklı. Bu yüzden kartlar bir yaprağa ya da nehir taşına benzer. Dört köşeyi kaydırıp formu kurun; CSS anında yazılır."
    >
      <div className="grid grid-cols-1 items-center gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-6">
          <div
            className="mx-auto aspect-[4/3] w-full max-w-[520px] bg-[var(--toprak-ton)] transition-[border-radius] duration-700"
            style={{ borderRadius: yari, boxShadow: 'var(--golge-2)', border: '1px solid var(--cizgi)' }}
            data-sekil-onizleme={yari}
            role="img"
            aria-label="Ayarlanabilir organik form"
          >
            <div className="grid h-full place-items-center">
              <Dal boy={130} yaprak={7} className="opacity-90" />
            </div>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5 lg:col-span-6">
          <Secim<string> legend="Hazır form" name="sk-hazir" value={hazir} onChange={sec} options={Object.keys(HAZIR).map((k) => ({ id: k, ad: k }))} />
          <div className="yuzey grid grid-cols-1 gap-3 p-6 sm:grid-cols-2 sm:gap-x-8">
            {AD.map((a, i) => (
              <Aralik
                key={a}
                label={a}
                value={d[i]}
                min={0}
                max={100}
                step={2}
                onChange={(v) => {
                  setHazir('')
                  setD((x) => x.map((y, j) => (j === i ? v : y)) as [number, number, number, number])
                }}
                format={(v) => `${v}%`}
              />
            ))}
          </div>
          <p className="text-[17px]" aria-live="polite" data-sekil-simetri={simetri}>
            Köşeler arası fark <b className="rakam">{simetri}</b> puan{simetri === 0 ? ' · tam simetrik daire/elips, organik değil' : simetri < 20 ? ' · neredeyse simetrik' : ' · asimetrik ve organik'}
          </p>
          <Kod label="Üretilen CSS" sar={false}>{`.card {\n  border-radius: ${yari};\n}`}</Kod>
        </div>
      </div>

      <ul className="m-0 mt-[var(--aralik)] grid list-none grid-cols-2 gap-x-6 gap-y-8 p-0 md:grid-cols-4" data-maskeler="">
        {(Object.keys(MASKE_YOLLARI) as MaskeAd[]).map((k) => (
          <li key={k} className="min-w-0">
            <svg viewBox="0 0 1 1" className="mx-auto w-full max-w-[220px]" role="img" aria-label={`${MASKE_AD[k]} maskesi`}>
              <path d={MASKE_YOLLARI[k]} fill="var(--zeytin-ton)" stroke="var(--zeytin)" strokeWidth="0.008" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 1.5 }} />
            </svg>
            <p className="baslik mt-3 text-center text-[22px]">{MASKE_AD[k]}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/* ───────────────────────── Madde 7 · Derinlik ───────────────────────── */

export function Derinlik() {
  const [kat, setKat] = useState(3)
  const [yum, setYum] = useState(60)
  const y = 4 + Math.round(yum / 5)
  const blur = 12 + Math.round(yum * 0.6)
  const alfa = (0.06 + (yum / 100) * 0.14).toFixed(2)
  const golge = `0 1px 2px rgb(var(--golge-rgb) / 0.05), 0 ${y}px ${blur}px -${Math.round(blur / 3)}px rgb(var(--golge-rgb) / ${alfa})`
  const tonlar = ['var(--zemin)', 'var(--yuzey)', 'var(--yuzey2)', 'var(--yuzey3)', 'color-mix(in srgb, var(--yuzey3) 80%, var(--toprak))']
  return (
    <Section
      id="derinlik"
      ikon="dalga"
      madde="Madde 7 · Z ekseni"
      title={
        <>
          Ton sür ton, <span className="vurgu">yumuşacık</span> gölge
        </>
      }
      lead="Derinlik, sert gölgeyle değil aynı rengin bir sonraki tonuyla kurulur: zemin, yüzey, ikinci yüzey, üçüncü yüzey. Üstüne yalnızca çok geniş ve çok soluk bir ortam gölgesi eklenir. Katman ve yumuşaklık ayarlanır."
    >
      <div className="grid grid-cols-1 items-center gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7" data-derinlik-sahne="">
          <div className="p-4 sm:p-7" style={{ background: tonlar[0], borderRadius: 'var(--r-kart)' }} data-katman-tonu="0">
            {Array.from({ length: kat }).reduce<React.ReactNode>(
              (ic, _, i) => (
                <div className="p-4 sm:p-7" style={{ background: tonlar[Math.min(i + 1, 4)], borderRadius: `${2.2 - i * 0.3}rem ${0.8 + i * 0.15}rem ${2.6 - i * 0.3}rem ${1.0 + i * 0.1}rem`, boxShadow: golge }} data-katman-tonu={i + 1}>
                  {ic}
                </div>
              ),
              <div className="text-[17px]">
                <p className="kicker">{kat} katman</p>
                <p className="baslik mt-1 text-[clamp(24px,3vw,34px)]">Her katman bir ton koyu</p>
              </div>,
            )}
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5 lg:col-span-5">
          <div className="yuzey grid grid-cols-1 gap-4 p-6">
            <Aralik label="Katman" value={kat} min={0} max={4} step={1} onChange={setKat} format={(v) => String(v)} />
            <Aralik label="Gölge yumuşaklığı" value={yum} min={0} max={100} step={5} onChange={setYum} format={(v) => `%${v}`} />
          </div>
          <Kod label="Ortam gölgesi" sar={false}>{`box-shadow:\n  0 1px 2px rgb(47 79 79 / .05),\n  0 ${y}px ${blur}px -${Math.round(blur / 3)}px rgb(47 79 79 / ${alfa});`}</Kod>
          <div className="yuzey p-5" data-yanlis="">
            <p className="kicker">✕ Yapma: sert gölge</p>
            <div className="mt-3 h-14 bg-yuzey2" style={{ borderRadius: '0.5rem', boxShadow: '6px 6px 0 #000' }} data-sert-golge="" aria-hidden="true" />
            <p className="mt-3 text-[15.5px] text-soluk">Ofset, sıfır bulanıklık, saf siyah. Bu stilde hiçbir yerde kullanılmaz.</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 8 · Doku ───────────────────────── */

function DokuOrnek({ tur }: { tur: Exclude<Doku, 'duz'> }) {
  const maske = { keten: 'var(--m-keten)', kraft: 'var(--m-kraft)', toprak: 'var(--m-toprak)' }[tur]
  const boyut = { keten: '300px', kraft: '360px', toprak: '280px' }[tur]
  const a = { keten: 0.12, kraft: 0.16, toprak: 0.16 }[tur]
  return <div className="absolute inset-0" style={{ background: 'var(--dok-renk)', opacity: a * 3.2, WebkitMaskImage: maske, maskImage: maske, WebkitMaskSize: boyut, maskSize: boyut }} aria-hidden="true" />
}

export function DokuBolumu() {
  const { doku, setDoku, tema, duyur } = useBotanical()
  const t = TEMA_RENK[tema]
  const seciliA = doku === 'kraft' || doku === 'toprak' ? 0.16 : 0.12
  const zeminUstu = karis(t.zemin, t.dokRenk, doku === 'duz' ? 0 : seciliA)
  const enKotu = kontrast(t.soluk, zeminUstu)
  const turler = ['keten', 'kraft', 'toprak'] as const
  return (
    <Section
      id="doku"
      ikon="dag"
      madde="Madde 8 · Doku ve yüzey"
      title={
        <>
          Keten, kraft, <span className="vurgu">toprak tanesi</span>
        </>
      }
      lead="Sayfa zemini üç dokudan biri olabilir: dokunmuş keten, işlenmemiş kraft kâğıt ya da hafif toprak taneli mat yüzey. Hepsi düşük yoğunlukta ve içeriğin arkasında sabit durur; yoğunluğun okunabilirliğe etkisi aşağıda ölçülür."
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 md:grid-cols-3" data-doku-liste="">
        {turler.map((d, i) => (
          <Belir as="li" key={d} gecikme={i * 100}>
            <div className="relative aspect-[4/3] overflow-hidden" style={{ background: 'var(--zemin)', border: '1px solid var(--cizgi)', borderRadius: RADIUS[i], boxShadow: 'var(--golge-1)' }} data-doku-ornek={d}>
              <DokuOrnek tur={d} />
              <div className="yuzey absolute inset-x-5 bottom-5 px-4 py-3">
                <p className="text-[16px]">Metin dokunun üstünde değil, yüzeyin içinde.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="baslik text-[24px]">{DOKU_AD[d]}</p>
              <EcoButton
                boy="k"
                ton={doku === d ? 'zeytin' : 'hayalet'}
                aria-pressed={doku === d}
                onClick={() => {
                  setDoku(d)
                  duyur(`${DOKU_AD[d]} dokusu uygulandı`)
                }}
                data-doku-uygula={d}
              >
                {doku === d ? 'Uygulandı' : 'Uygula'}
              </EcoButton>
            </div>
          </Belir>
        ))}
      </ul>
      <div className="mt-[var(--aralik)] grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-12">
        <div className="yuzey min-w-0 p-6 sm:p-8 md:col-span-7">
          <p className="kicker">Okunabilirlik (Madde 18)</p>
          <p className="mt-2 text-[18px]">En koyu doku noktasında bile soluk metin şu oranı korur:</p>
          <p className="rakam mt-2 text-[40px]" data-doku-kontrast={enKotu.toFixed(2)}>
            {oran(enKotu)}
          </p>
          <p className="mt-1 text-[16px] text-soluk">
            {enKotu >= 4.5 ? '✓ AA sınırının üstünde' : '✕ AA sınırının altında'} · zemin {t.zemin.toUpperCase()} üstüne doku %{Math.round(seciliA * 100)} {t.dokRenk.toUpperCase()}
          </p>
        </div>
        <div className="min-w-0 md:col-span-5">
          <Kod label="Doku değişkenleri" sar={false}>{`Texture/LinenBase\n  --dok-renk  ${t.dokRenk}\n  --dok-a     ${seciliA}\n  mask-image  var(--m-${doku === 'duz' ? 'keten' : doku})\n  /* fractalNoise, stitchTiles */`}</Kod>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 9 · İkonlar ───────────────────────── */

export function Ikonlar() {
  const [boyut, setBoyut] = useState(40)
  const [kalinlik, setKalinlik] = useState(1.5)
  const gruplar = useMemo(
    () =>
      [
        ['Doğa ikonları', DOGA_SIMGELERI],
        ['Arayüz ikonları', ARAYUZ_SIMGELERI],
      ] as const,
    [],
  )
  return (
    <Section
      id="ikonlar"
      ikon="agac"
      madde="Madde 9 · İkonografi"
      title={
        <>
          Yaprak, toprak, <span className="vurgu">su</span>
        </>
      }
      lead="İnce çizgili, yuvarlak uçlu organik ikonlar: yaprak, filiz, tohum, damla, dalga, toprak katmanları. Yumuşak dolgu yalnız yaprak ve damla gibi dolu formlarda; çizgi kalınlığı ölçekle değişmez."
    >
      <div className="mb-8 grid max-w-[640px] grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
        <Aralik label="Boyut" value={boyut} min={20} max={72} step={2} onChange={setBoyut} format={(v) => `${v}px`} />
        <Aralik label="Çizgi" value={kalinlik} min={1} max={3} step={0.25} onChange={setKalinlik} format={(v) => v.toFixed(2).replace('.', ',')} />
      </div>
      {gruplar.map(([ad, liste]) => (
        <div key={ad} className="mb-10 last:mb-0">
          <h3 className="baslik mb-5 text-[clamp(24px,2.4vw,30px)]">{ad}</h3>
          <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-4 p-0 sm:grid-cols-4 lg:grid-cols-7" data-ikon-liste={ad}>
            {liste.map((s) => (
              <li key={s} className="yuzey flex flex-col items-center gap-2 px-2 py-4 text-center">
                <span className="grid place-items-center text-metin" style={{ minHeight: 72 }}>
                  <Ikon ad={s} boyut={boyut} kalin={kalinlik} etiket={SIMGE_AD[s]} />
                </span>
                <span className="font-mono text-[12.5px] text-soluk">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Section>
  )
}
