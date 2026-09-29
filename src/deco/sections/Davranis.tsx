import { useEffect, useRef, useState } from 'react'
import { useDeco, type TemaTercih } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { katSayisi } from '../lib/geo'
import { Cerceve } from '../components/Cerceve'
import { GoldBorderButton } from '../components/Dugme'
import { Ayirac, Sunburst } from '../components/Ornament'
import { Ayarlar } from '../components/Header'
import { Ikon } from '../components/Ikon'
import { useSize } from '../components/hooks'
import { Aralik, Kod, Section, Secim } from '../components/ui'
import { TEMA_RENK } from './Temel'

/* ───────────────────────── Madde 16 · Hareket ───────────────────────── */

type Tur = 'yatay' | 'dikey' | 'cizgi' | 'isin'
const EGRI = 'cubic-bezier(0.65, 0, 0.35, 1)'

export function Hareket() {
  const { hareket, hareketTercih } = useDeco()
  const [tur, setTur] = useState<Tur>('yatay')
  const [sure, setSure] = useState(1.4)
  const [acik, setAcik] = useState(true)
  const perde = tur === 'yatay' || tur === 'dikey'
  const kapali = tur === 'yatay' ? 'inset(0 50% 0 50%)' : 'inset(50% 0 50% 0)'
  return (
    <Section
      id="hareket"
      madde="Madde 16 · Hareket dili"
      title="Simetrik açılış"
      lead="Hiçbir şey soldan ya da yukarıdan girmez: perde ortadan iki yana açılır, çizgiler ortadan kenara çizilir, ışınlar merkezden yayılır. Kapanış aynı yolun tersidir; eğri de kendi kendinin aynası olduğu için açılış ve kapanış birbirinin tam simetriğidir."
    >
      <div className="mb-10 flex flex-wrap items-end justify-center gap-x-10 gap-y-6">
        <Secim<Tur>
          legend="Açılış türü"
          name="hr-tur"
          value={tur}
          onChange={setTur}
          options={[
            { id: 'yatay', ad: 'Yatay perde' },
            { id: 'dikey', ad: 'Dikey perde' },
            { id: 'cizgi', ad: 'Çizgi çiz' },
            { id: 'isin', ad: 'Işın aç' },
          ]}
        />
      </div>
      <div className="mx-auto grid max-w-[900px] grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto]">
        <div className="relative isolate flex min-h-[340px] items-center justify-center bg-zemin" data-hareket-sahne={tur} data-perde={acik ? 'acik' : 'kapali'}>
          {perde ? (
            <div className="relative isolate w-full max-w-[420px] bg-yuzey px-8 py-10 text-center" inert={!acik} style={{ clipPath: acik ? 'inset(0 0 0 0)' : kapali, transition: hareket ? `clip-path ${sure}s ${EGRI}` : 'none' }} data-perde-icerik="">
              <Cerceve kat={2} stil="basamak" k={12} aralik={8} />
              <Ikon ad="tac" boyut={44} className="mx-auto" />
              <p className="kicker mt-3">Salon Doré</p>
              <Ayirac className="my-4 max-w-[180px]" baklava={7} />
              <p className="text-[17px] text-soluk">Perde ortadan iki yana açılır.</p>
            </div>
          ) : tur === 'cizgi' ? (
            <div className="relative h-[260px] w-full max-w-[420px]" data-cizgi-sahne="">
              <Cerceve kat={3} stil="basamak" k={14} aralik={9} acik={acik} yavas={sure} zemin="var(--zemin)" />
            </div>
          ) : (
            <div className="w-full max-w-[520px]" data-isin-sahne="">
              <Sunburst n={40} halka={5} acik={acik} yavas={sure} className="max-h-[300px]" />
            </div>
          )}
        </div>
        <div className="grid min-w-0 grid-cols-1 justify-items-center gap-6 md:w-[280px]">
          <GoldBorderButton ana boy="b" onClick={() => setAcik((a) => !a)} aria-pressed={acik} data-perde-dugme="">
            {acik ? 'Kapat' : 'Aç'}
          </GoldBorderButton>
          <Aralik label="Süre" value={sure} min={0.4} max={4} step={0.2} onChange={setSure} format={(v) => `${v.toFixed(1).replace('.', ',')} sn`} />
          <p className="border border-altin-soluk px-4 py-2 text-[16px]" data-hareket-durum="">
            Hareket <b>{hareket ? 'açık' : 'kapalı'}</b> <span className="text-soluk">({hareketTercih === 'oto' ? 'sistem tercihi' : 'ayardan'})</span>
          </p>
        </div>
      </div>

      <div className="mt-16 overflow-x-auto" role="region" aria-label="Hareket değerleri" tabIndex={0}>
        <div className="kart-duz p-5">
          <table className="tablo w-full min-w-[600px] border-collapse text-[16px]" data-hareket-tablo="">
            <caption>Hareket değerleri</caption>
            <tbody>
              {[
                ['Perde açılışı', '1,1 sn', 'cubic-bezier(.65, 0, .35, 1)', 'clip-path inset(0 50%) → inset(0)'],
                ['Çerçeve çizimi', '2,2 sn', 'cubic-bezier(.65, 0, .35, 1)', 'stroke-dashoffset 1 → 0, her çerçeve 0,25 sn arayla'],
                ['Işın açılışı', '2,4 sn', 'cubic-bezier(.65, 0, .35, 1)', 'ortadaki ışın önce, kenarlar sonra'],
                ['Düğme dolgusu', '0,7 sn', 'cubic-bezier(.65, 0, .35, 1)', 'scaleX 0 → 1, merkezden'],
                ['Renk geçişi', '0,4–0,5 sn', 'cubic-bezier(.65, 0, .35, 1)', 'çerçeve ve yazı'],
              ].map(([a, b, c, d]) => (
                <tr key={a}>
                  <th scope="row" className="font-semibold">
                    {a}
                  </th>
                  <td className="tabular-nums">{b}</td>
                  <td className="font-mono text-[14px]">{c}</td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-[62ch] text-[16px] text-soluk">Hareket kapalıyken (ya da sistem hareketi azaltıyorsa) perdeler ve çizgiler anında, sıçramadan yerinde durur.</p>
    </Section>
  )
}

/* ───────────────────────── Madde 17 · Mobil ───────────────────────── */

/** Madde 17: çerçeve daralır, ortalama asla terk edilmez */
export function Mobil() {
  const [g, setG] = useState(560)
  const [ref, { w }] = useSize<HTMLDivElement>()
  const kutu = useRef<HTMLDivElement>(null)
  const [sapma, setSapma] = useState(0)
  const c = katSayisi(w || g)
  useEffect(() => {
    const el = kutu.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const ler = [...el.querySelectorAll<HTMLElement>('[data-merkez]')].map((x) => {
      const b = x.getBoundingClientRect()
      return Math.abs(b.left - r.left - (r.right - b.right))
    })
    setSapma(Math.round(Math.max(0, ...ler)))
  }, [g, w])
  return (
    <Section id="mobil" madde="Madde 17 · Duyarlı kurallar" title="Daralır, ortalanır" lead="Ekran daraldıkça iç içe çerçeve sayısı üçten bire iner, köşe basamakları küçülür, başlık akıcı ölçeklenir; ama her öğe hâlâ tek eksende durur. Sola dayalı bir mobil düzen bu stilin zarafetini bozar.">
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2" data-mobil-karsilastirma="">
        <figure className="m-0 grid grid-cols-1 justify-items-center gap-4">
          <div className="relative isolate w-full max-w-[320px] bg-yuzey px-5 py-8 text-left" data-yanlis="" aria-hidden="true">
            <Cerceve kat={1} stil="duz" motif={false} />
            <p className="kicker !text-left">Oda</p>
            <p className="mt-2 font-baslik text-[24px] tracking-[0.1em] !text-left text-altin-yazi uppercase">Art Deco süit</p>
            <p className="mt-3 text-[16px] text-soluk">Ayrı salon, yelpaze tavan, altın armatürler.</p>
            <div className="mt-5 inline-block border border-altin-cizgi px-5 py-3 text-[13px] tracking-widest text-altin-yazi">SEÇ</div>
          </div>
          <figcaption className="max-w-[320px] text-[17px] text-soluk">
            <b className="text-metin">Yapma.</b> Mobilde sola yaslamak: eksen kaybolur, çerçeve tek yöne bakar.
          </figcaption>
        </figure>
        <figure className="m-0 grid grid-cols-1 justify-items-center gap-4">
          <div className="relative isolate flex w-full max-w-[320px] flex-col items-center bg-yuzey px-5 py-8 text-center" data-dogru="">
            <Cerceve kat={1} stil="basamak" k={8} aralik={7} />
            <p className="kicker">Oda</p>
            <p className="mt-2 font-baslik text-[24px] tracking-[0.1em] text-altin-yazi uppercase">Art Deco süit</p>
            <Ayirac className="my-3 max-w-[140px]" baklava={6} />
            <p className="text-[16px] text-soluk">Ayrı salon, yelpaze tavan, altın armatürler.</p>
            <GoldBorderButton boy="k" className="mt-5">
              Seç
            </GoldBorderButton>
          </div>
          <figcaption className="max-w-[320px] text-[17px] text-soluk">
            <b className="text-metin">Yap.</b> Tek çerçeve, aynı eksen: her satır ortada, düğme bile.
          </figcaption>
        </figure>
      </div>

      <h3 className="mt-20 text-[clamp(20px,2.4vw,26px)]">Genişliği dene</h3>
      <div className="mx-auto mt-6 max-w-[420px]">
        <Aralik label="Ekran genişliği" value={g} min={300} max={900} step={10} onChange={setG} format={(v) => `${v}px`} />
      </div>
      <div className="mt-8 overflow-hidden">
        <div ref={ref} className="mx-auto max-w-full" style={{ width: g }} data-mobil-onizle="" data-kat={c.kat} data-genislik={w}>
          <div ref={kutu} className="relative isolate flex flex-col items-center bg-yuzey px-5 py-10 text-center" style={{ paddingInline: c.kat >= 3 ? 48 : c.kat === 2 ? 32 : 20 }}>
            <Cerceve key={c.kat} kat={c.kat} stil="basamak" k={c.k} aralik={c.aralik} />
            <span data-merkez="" className="block">
              <Ikon ad="yelpaze" boyut={40} />
            </span>
            <p data-merkez="" className="kicker mt-3">
              Beyoğlu · MCMXXVIII
            </p>
            <h4 lang="en" data-merkez="" className="mt-3 text-[clamp(24px,7vw,48px)]">
              Aurelia Palas
            </h4>
            <Ayirac className="my-5 max-w-[200px]" baklava={7} />
            <div data-merkez="">
              <GoldBorderButton boy="k">Oda ayırt</GoldBorderButton>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[17px] text-soluk" aria-live="polite" data-mobil-durum={sapma <= 1 ? 'ortali' : 'kaymis'}>
          Önizleme {w}px · {c.kat} çerçeve · merkez sapması <b className="font-mono text-altin-yazi">{sapma} px</b>
        </p>
      </div>

      <div className="mt-12 overflow-x-auto" role="region" aria-label="Duyarlı kurallar tablosu" tabIndex={0}>
        <div className="kart-duz p-5">
          <table className="tablo w-full min-w-[600px] border-collapse text-[16px]" data-mobil-tablo="">
            <caption>Kırılım kuralları</caption>
            <tbody>
              {[
                ['< 420 px', '1 çerçeve · köşe 8 px · yan boşluk 20 px', 'Ortalı tek sütun'],
                ['420–640 px', '2 çerçeve · köşe 10 px · yan boşluk 32 px', 'Ortalı tek sütun'],
                ['≥ 640 px', '3 çerçeve · köşe 14 px · yan boşluk 48 px', 'Izgaralar 2–4 sütun, hepsi kendi içinde ortalı'],
                ['Gezinme', 'Yatay kaydırılır, sığıyorsa ortalanır (justify-center-safe)', 'Sekmeler ≥ 48 px yüksek'],
              ].map(([a, b, c]) => (
                <tr key={a}>
                  <th scope="row" className="font-semibold whitespace-nowrap">
                    {a}
                  </th>
                  <td>{b}</td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 18 · Erişim ───────────────────────── */

const ZEMIN: Record<string, { ad: string; hex: string }> = {
  siyah: { ad: 'Gece siyahı', hex: '#0B0B0B' },
  lacivert: { ad: 'Lacivert', hex: '#0A192F' },
  zumrut: { ad: 'Zümrüt', hex: '#062A22' },
  fildisi: { ad: 'Fildişi', hex: '#FFFFF0' },
}
const ALTIN: Record<string, { ad: string; hex: string }> = {
  eski: { ad: 'Eski altın', hex: '#8C6D1F' },
  ham: { ad: 'Parlak altın', hex: '#D4AF37' },
  isik: { ad: 'Işıklı altın', hex: '#E3C55A' },
  parlak: { ad: 'Açık altın', hex: '#F3DC82' },
  koyu: { ad: 'Koyu altın', hex: '#6B4F08' },
}
const buyukMu = (px: number, agirlik: number) => px >= 24 || (px >= 18.66 && agirlik >= 700)

/** Madde 18: koyu zeminde altın metin, kontrast + boyut + kalınlık */
export function Erisim() {
  const s = useDeco()
  const [zemin, setZemin] = useState('zumrut')
  const [altin, setAltin] = useState('eski')
  const [px, setPx] = useState(13)
  const [agirlik, setAgirlik] = useState(400)
  const z = ZEMIN[zemin].hex
  const a = ALTIN[altin].hex
  const oranDeger = kontrast(a, z)
  const hedef = buyukMu(px, agirlik) ? 3 : 4.5
  const gecer = oranDeger >= hedef
  const oneri = (() => {
    const koyuZemin = zemin !== 'fildisi'
    const aday = koyuZemin ? ['#D4AF37', '#E3C55A', '#F3DC82'] : ['#6B4F08', '#4A3604']
    const renk = aday.find((h) => kontrast(h, z) >= 4.5) ?? aday[aday.length - 1]
    return { renk, px: Math.max(px, 15), agirlik: Math.max(agirlik, 600) }
  })()
  const uygula = () => {
    const anahtar = Object.entries(ALTIN).find(([, v]) => v.hex === oneri.renk)?.[0]
    if (anahtar) setAltin(anahtar)
    setPx(oneri.px)
    setAgirlik(oneri.agirlik)
  }
  const ONCE: [string, string, number, number, string, number, number][] = [
    ['Üst yazı', '#8C6D1F', 11, 400, '#D4AF37', 14, 600],
    ['Düğme', '#B8942A', 12, 400, '#D4AF37', 15, 600],
    ['Menü bağlantısı', '#8C6D1F', 12, 500, '#D4AF37', 12, 600],
  ]
  return (
    <Section
      id="erisim"
      madde="Madde 18 · Erişilebilirlik ve varyantlar"
      title="Altın da okunmalı"
      lead="İnce, geniş aralıklı altın harf zarif ama kırılgandır. Koyu zeminde kontrastı artırmanın yolu altını soldurmak değil, boyutu ve kalınlığı biraz yükseltmektir: 14 px, 600 ağırlık ve #D4AF37 hem lüks hem AAA. Aşağıda elle deneyin."
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative isolate flex min-h-[300px] flex-col items-center justify-center px-6 py-10 text-center lg:sticky lg:top-24" style={{ background: z }} data-lab="" data-lab-oran={oranDeger.toFixed(2)} data-lab-sonuc={gecer ? 'gecer' : 'yetmez'}>
          <div className="pointer-events-none absolute inset-2 border" style={{ borderColor: `${a}66` }} aria-hidden="true" />
          <p lang="en" className="max-w-full [overflow-wrap:anywhere] uppercase" style={{ color: a, fontFamily: 'var(--font-baslik)', fontSize: px, fontWeight: agirlik, letterSpacing: '0.2em' }} data-lab-metin="">
            Aurelia Palas · Salon Doré
          </p>
          <p className="mt-6 font-mono text-[15px]" style={{ color: ZEMIN[zemin].hex === '#FFFFF0' ? '#1B1709' : '#FFFFF0' }}>
            {a} / {z} · {oran(oranDeger)}
          </p>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-6">
          <Secim<string> legend="Zemin" name="lab-zemin" value={zemin} onChange={setZemin} options={Object.entries(ZEMIN).map(([id, v]) => ({ id, ad: v.ad }))} />
          <Secim<string> legend="Altın tonu" name="lab-altin" value={altin} onChange={setAltin} options={Object.entries(ALTIN).map(([id, v]) => ({ id, ad: v.ad }))} />
          <Aralik label="Boyut" value={px} min={10} max={40} onChange={setPx} format={(v) => `${v}px`} />
          <Aralik label="Kalınlık" value={agirlik} min={300} max={800} step={100} onChange={setAgirlik} format={(v) => String(v)} />
          <div className="border border-altin-soluk px-4 py-4 text-center" role="status" aria-live="polite">
            <p className="rakam text-[34px] leading-none text-altin-yazi">{oran(oranDeger)}</p>
            <p className="mt-2 text-[17px]" data-lab-karar="">
              {gecer ? (
                <>
                  <b>{oranDeger >= 7 ? 'AAA' : 'AA'}</b> · {buyukMu(px, agirlik) ? 'büyük yazı (3:1)' : 'normal yazı (4,5:1)'} için yeterli
                </>
              ) : (
                <>
                  <b>Yetmez</b> · {hedef}:1 gerekir
                </>
              )}
            </p>
            {!gecer ? (
              <div className="mt-4">
                <p className="text-[16px] text-soluk">
                  Öneri: <span className="font-mono">{oneri.renk}</span> · {oneri.px}px · {oneri.agirlik}
                </p>
                <GoldBorderButton boy="k" className="mt-3" onClick={uygula} data-oneri="">
                  Öneriyi uygula
                </GoldBorderButton>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-16 overflow-x-auto" role="region" aria-label="Önce ve sonra tablosu" tabIndex={0}>
        <div className="kart-duz p-5">
          <table className="tablo w-full min-w-[640px] border-collapse text-[16px]" data-once-sonra="">
            <caption>Önce ve sonra · gece siyahı zeminde</caption>
            <thead>
              <tr>
                <th scope="col" className="etiket !text-[12px]">
                  Öğe
                </th>
                <th scope="col" className="etiket !text-[12px]">
                  Önce
                </th>
                <th scope="col" className="etiket !text-[12px]">
                  Sonra
                </th>
              </tr>
            </thead>
            <tbody>
              {ONCE.map(([ad, c1, p1, w1, c2, p2, w2]) => (
                <tr key={ad}>
                  <th scope="row" className="font-semibold">
                    {ad}
                  </th>
                  <td>
                    <span className="mr-3 inline-block bg-[#0B0B0B] px-2 py-1 font-baslik tracking-[0.2em] uppercase" style={{ color: c1, fontSize: p1, fontWeight: w1 }} aria-hidden="true">
                      Aa
                    </span>
                    {p1}px · {w1} · {oran(kontrast(c1, '#0B0B0B'))}
                  </td>
                  <td>
                    <span className="mr-3 inline-block bg-[#0B0B0B] px-2 py-1 font-baslik tracking-[0.2em] uppercase" style={{ color: c2, fontSize: p2, fontWeight: w2 }} aria-hidden="true">
                      Aa
                    </span>
                    {p2}px · {w2} · {oran(kontrast(c2, '#0B0B0B'))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h3 className="mt-20 text-[clamp(20px,2.4vw,26px)]">Temalar</h3>
      <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 xl:grid-cols-4" data-tema-onizleme="">
        {(['siyah', 'lacivert', 'zumrut', 'fildisi'] as const).map((t) => {
          const v = TEMA_RENK[t]
          const secili = s.tema === t
          return (
            <li key={t} data-onizle={t} className="relative isolate grid grid-cols-1 content-start gap-4 border border-altin-soluk p-5 text-center">
              <Cerceve kat={1} stil="pah" k={10} motif={false} zemin="var(--zemin)" />
              <p className="font-baslik text-[18px] tracking-[0.18em] text-altin-yazi uppercase">{v.ad}</p>
              <p className="text-[16px]">Altın çizgi, okunaklı metin.</p>
              <dl className="m-0 grid grid-cols-[1fr_auto] gap-x-3 text-left text-[15px]">
                <dt className="text-soluk">Metin</dt>
                <dd className="m-0 text-right tabular-nums">{oran(kontrast(v.metin, v.zemin))}</dd>
                <dt className="text-soluk">Altın yazı</dt>
                <dd className="m-0 text-right tabular-nums">{oran(kontrast(v.altinYazi, v.zemin))}</dd>
                <dt className="text-soluk">Altın çizgi</dt>
                <dd className="m-0 text-right tabular-nums">{oran(kontrast(v.cizgi, v.zemin))}</dd>
              </dl>
              <div>
                <GoldBorderButton boy="k" onClick={() => s.setTemaTercih(t as TemaTercih)} aria-pressed={secili} data-tema-sec={t}>
                  {secili ? 'Seçili' : 'Seç'}
                </GoldBorderButton>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-16 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="relative isolate bg-yuzey p-6 md:p-8">
          <Cerceve kat={2} stil="basamak" k={12} aralik={8} />
          <h3 className="text-[clamp(20px,2.4vw,26px)]">Görünüm ayarları</h3>
          <Ayirac className="my-5" baklava={7} />
          <Ayarlar onek="e-" />
        </div>
        <div className="min-w-0">
          <h3 className="text-[clamp(20px,2.4vw,26px)]">Neler var</h3>
          <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-3.5 p-0 text-left text-[17px]" data-erisim-liste="">
            {[
              'Tema: Gece siyahı (varsayılan), Lacivert, Zümrüt ve Fildişi. “Oto” seçilirse sistem aydınlıkken Fildişi, karanlıkken Gece siyahı gelir.',
              'Gövde metni fildişi, koyu zeminde 15:1 ve üstü. Altın metin 14 px, 600 ağırlık ve #D4AF37 ile 7:1 ve üstü.',
              'Yüksek kontrast: metin ve altın metin açılır, çerçeve çizgisi 2 px olur, doku silinir.',
              'Harf aralığı: “Dar” seçeneği geniş Cinzel aralığını 0,45 katına indirir, okuma zorluğu olanlar için.',
              'Hareket sistem tercihini izler; kapalıyken perdeler ve çizgiler anında yerinde.',
              'Odak halkası 2 px açık altın, her etkileşimli öğe ≥ 48 px. Seçili durum yalnız renkle değil, baklava işareti ve kalın yazıyla da belirtilir.',
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <i className="mt-[0.7em] block size-[7px] shrink-0 rotate-45 bg-altin-cizgi" aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Kod label="Altın metin kuralı" className="mt-10" sar={false}>{`/* Koyu zeminde altın metin: küçük boyda daha kalın ve daha açık */
.kicker { font: 600 14px/1.5 var(--font-baslik); color: #D4AF37; } /* 9,4:1 siyahta */
:root[data-kontrast='yuksek'] { --altin-yazi: #F3DC82; --kalin: 2px; }`}</Kod>
    </Section>
  )
}
