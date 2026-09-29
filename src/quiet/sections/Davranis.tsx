import { useState } from 'react'
import { cx } from '../../shared/cx'
import { useQuiet, type TemaTercih } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { Gorsel } from '../components/Gorsel'
import { Ayarlar } from '../components/Header'
import { useSize } from '../components/hooks'
import { QuietButton } from '../components/Quiet'
import { Aralik, Kod, Section, Secim } from '../components/ui'
import { TEMA_RENK } from './Temel'

/* ───────────────────────── Madde 16 · Hareket ───────────────────────── */

type Tur = 'tek' | 'sirali' | 'gorsel'
const EGRI = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

export function Hareket() {
  const { hareket, hareketTercih } = useQuiet()
  const [tur, setTur] = useState<Tur>('tek')
  const [sure, setSure] = useState(1.8)
  const [acik, setAcik] = useState(true)
  const [n, setN] = useState(0)
  const gecis = (gecikme = 0) => ({ opacity: acik ? 1 : 0, transition: hareket ? `opacity ${sure}s ${EGRI} ${gecikme}s` : 'none' })
  const yeniden = () => {
    setAcik(false)
    setN((x) => x + 1)
    requestAnimationFrame(() => requestAnimationFrame(() => setAcik(true)))
  }
  return (
    <Section id="hareket" madde="Madde 16 · Hareket dili" title="Neredeyse hissedilmeyen" lead="Yalnız opaklık değişir: kayma, ölçek, zıplama yok. Süre 1,8 saniye, eğri yumuşak. Bir şey belirdiğini fark etmezsiniz, ama sayfa hiç aniden değişmez.">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <Secim<Tur>
          legend="Örnek"
          name="hr-tur"
          value={tur}
          onChange={setTur}
          options={[
            { id: 'tek', ad: 'Tek blok' },
            { id: 'sirali', ad: 'Sıralı satırlar' },
            { id: 'gorsel', ad: 'Görsel' },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 items-start gap-x-[var(--oluk)] gap-y-10 lg:grid-cols-12">
        <div key={n} className="min-h-[340px] border border-[var(--cizgi)] bg-yuzey p-8 sm:p-12 lg:col-span-8" data-hareket-sahne={tur} data-fade={acik ? 'acik' : 'gizli'} style={{ borderRadius: 'var(--r)' }}>
          {tur === 'tek' ? (
            <div style={gecis()} data-fade-oge="">
              <p className="kicker">Ardıç · Sonbahar</p>
              <p className="buyuk mt-5 text-[clamp(38px,5vw,64px)]">Yeni sezon, az parça.</p>
              <p className="mt-5 max-w-[42ch] text-soluk">Blok bir bütün olarak, tek bir yavaş solmayla belirir.</p>
            </div>
          ) : tur === 'sirali' ? (
            <div className="grid gap-5">
              {['Keten', 'Kaşmir', 'Yün', 'Traverten'].map((x, i) => (
                <p key={x} className="border-t border-[var(--cizgi)] pt-4 font-serif text-[clamp(28px,3vw,40px)] leading-tight" style={gecis(i * sure * 0.25)} data-fade-oge="">
                  {x}
                </p>
              ))}
            </div>
          ) : (
            <div className="gorsel aspect-[3/2] w-full max-w-[560px]" style={gecis()} data-fade-oge="">
              <Gorsel sahne="kemer" />
            </div>
          )}
        </div>
        <div className="grid content-start gap-7 lg:col-span-4">
          <Aralik label="Süre" value={sure} min={0.4} max={4} step={0.2} onChange={setSure} format={(v) => `${v.toFixed(1).replace('.', ',')} sn`} />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <QuietButton boy="k" onClick={yeniden} data-oynat="">
              Yeniden oynat
            </QuietButton>
            <QuietButton varyant="metin" boy="k" onClick={() => setAcik((a) => !a)} aria-pressed={acik} data-fade-dugme="">
              {acik ? 'Gizle' : 'Göster'}
            </QuietButton>
          </div>
          <p className="border-t border-[var(--cizgi)] pt-5 text-[15px]" data-hareket-durum="">
            Hareket <b className="font-medium">{hareket ? 'açık' : 'kapalı'}</b> <span className="text-soluk">({hareketTercih === 'oto' ? 'sistem tercihi' : 'ayardan'})</span>
          </p>
        </div>
      </div>
      <div className="mt-[var(--aralik)] overflow-x-auto" role="region" aria-label="Hareket değerleri" tabIndex={0}>
        <table className="tablo w-full min-w-[600px] border-collapse text-[15px]" data-hareket-tablo="">
          <caption>Hareket değerleri</caption>
          <tbody>
            {[
              ['Bölüm belirişi', '1,8 sn', 'cubic-bezier(.22, .61, .36, 1)', 'opacity 0 → 1, görününce'],
              ['Galeri geçişi', '1,6 sn', 'cubic-bezier(.22, .61, .36, 1)', 'çapraz solma'],
              ['Düğme', '0,7 sn', 'cubic-bezier(.22, .61, .36, 1)', 'dolgu ve yazı rengi'],
              ['Metin bağlantısı', '0,5 sn', 'ease', 'alt çizgi rengi'],
              ['Anahtar', '0,7 sn', 'cubic-bezier(.22, .61, .36, 1)', 'kare tutamak kayar'],
            ].map(([a, b, c, d]) => (
              <tr key={a}>
                <th scope="row" className="font-medium">
                  {a}
                </th>
                <td className="tabular-nums">{b}</td>
                <td className="font-mono text-[13px]">{c}</td>
                <td>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 max-w-[62ch] text-[15px] text-soluk">Hareket kapalıyken (ya da sistem hareketi azaltıyorsa) her şey ilk andan görünür; geçiş yoktur.</p>
    </Section>
  )
}

/* ───────────────────────── Madde 17 · Mobil ───────────────────────── */

const sinir = (v: number, a: number, b: number) => Math.round(Math.max(a, Math.min(b, v)))

function Spacer({ px, ad }: { px: number; ad: string }) {
  return (
    <div className="flex items-center justify-center border-y border-dashed border-toprak font-mono text-[11px] tracking-widest text-soluk" style={{ height: px }} data-spacer={px} aria-hidden="true">
      {ad} {px}px
    </div>
  )
}

/** Madde 17: mobilde boşluk orantılı daralır, dergi hissi kalır */
export function Mobil() {
  const [g, setG] = useState(390)
  const [ref, { w }] = useSize<HTMLDivElement>()
  const W = w || g
  const bolum = sinir(W * 0.125, 72, 160)
  const aralik = sinir(W * 0.075, 48, 96)
  const baslik = sinir(W * 0.064, 38, 92)
  return (
    <Section
      id="mobil"
      madde="Madde 17 · Duyarlı kurallar"
      title="Daralır, ama dergi kalır"
      lead="Ekran daraldıkça boşluklar orantılı küçülür: bölüm 160 pikselden 72'ye, elemanlar arası 96'dan 48'e. Ama düzen bozulmaz: büyük serif başlık, kenardan kenara görsel, dar ve girintili okuma sütunu, geniş aralıklı küçük üst yazı."
    >
      <div className="grid grid-cols-1 items-start gap-x-[var(--oluk)] gap-y-12 md:grid-cols-2" data-mobil-karsilastirma="">
        <figure className="m-0 grid grid-cols-1 gap-4">
          <div className="w-full max-w-[340px] border border-[var(--cizgi)] bg-yuzey" data-yanlis="" aria-hidden="true">
            <div className="p-3">
              <p className="kicker">Mimari</p>
              <p className="mt-1 font-serif text-[30px] leading-[1.05]">Boşluğun Mimarisi</p>
              <div className="gorsel mt-2 aspect-[3/2]">
                <Gorsel sahne="kumas" />
              </div>
              <p className="mt-2 text-[14px] leading-[1.5] text-soluk">Sessizlik, nesnelerin değil, aralarındaki mesafenin ölçüsüdür.</p>
              <p className="mt-2 text-[14px] text-metin">Devamı</p>
            </div>
          </div>
          <figcaption className="max-w-[340px] text-[16px] text-soluk">
            <b className="font-medium text-metin">Yapma.</b> Boşluğu tamamen kısmak (12 px): sayfa kalabalık bir katalog gibi görünür, editoryal his kaybolur.
          </figcaption>
        </figure>
        <figure className="m-0 grid grid-cols-1 gap-4">
          <div className="w-full max-w-[340px] border border-[var(--cizgi)] bg-yuzey" data-dogru="">
            <div className="px-5" style={{ paddingBlock: 48 }}>
              <p className="kicker">Mimari</p>
              <p className="mt-4 font-serif text-[38px] leading-[1.02] font-light">Boşluğun Mimarisi</p>
              <div className="gorsel mt-12 -mx-5 aspect-[3/2] !rounded-none">
                <Gorsel sahne="kumas" />
              </div>
              <p className="mt-12 pl-[12.5%] text-[15px] leading-[1.8] text-soluk">Sessizlik, nesnelerin değil, aralarındaki mesafenin ölçüsüdür.</p>
            </div>
          </div>
          <figcaption className="max-w-[340px] text-[16px] text-soluk">
            <b className="font-medium text-metin">Yap.</b> Boşluk 48 piksele iner ama kalır; görsel kenardan kenara, metin girintili.
          </figcaption>
        </figure>
      </div>

      <h3 className="mt-[var(--aralik)] text-[clamp(26px,3vw,38px)]">Genişliği dene</h3>
      <div className="mt-6 max-w-[440px]">
        <Aralik label="Ekran genişliği" value={g} min={320} max={900} step={10} onChange={setG} format={(v) => `${v}px`} />
      </div>
      <div className="mt-10 overflow-hidden">
        <div ref={ref} className="max-w-full border border-[var(--cizgi)] bg-yuzey" style={{ width: g }} data-mobil-onizle="" data-genislik={W} data-bolum={bolum} data-aralik={aralik} data-baslik={baslik}>
          <Spacer px={bolum} ad="bölüm" />
          <div className="px-5">
            <p className="kicker">Stil 029 · Dergi</p>
            <p className="buyuk mt-4" style={{ fontSize: baslik }}>
              Az, ama doğru.
            </p>
          </div>
          <Spacer px={aralik} ad="aralık" />
          <div className="gorsel !rounded-none" style={{ aspectRatio: '3 / 2' }}>
            <Gorsel sahne="duvar" />
          </div>
          <Spacer px={aralik} ad="aralık" />
          <div className="px-5" style={{ paddingLeft: '12.5%' }}>
            <p className="max-w-[40ch] text-[15px] text-soluk">Okuma sütunu dar ve girintili kalır; dergi ritmi küçük ekranda da sürer.</p>
          </div>
          <Spacer px={bolum} ad="bölüm" />
        </div>
        <p className="mt-4 text-[15px] text-soluk" aria-live="polite">
          Önizleme {W}px · bölüm <b className="font-medium text-metin">{bolum}px</b> · aralık <b className="font-medium text-metin">{aralik}px</b> · başlık <b className="font-medium text-metin">{baslik}px</b>
        </p>
      </div>

      <div className="mt-[var(--aralik)] overflow-x-auto" role="region" aria-label="Duyarlı kurallar tablosu" tabIndex={0}>
        <table className="tablo w-full min-w-[620px] border-collapse text-[15px]" data-mobil-tablo="">
          <caption>Orantılı daralma</caption>
          <thead>
            <tr>
              <th scope="col" className="etiket">
                Genişlik
              </th>
              <th scope="col" className="etiket">
                Bölüm / aralık
              </th>
              <th scope="col" className="etiket">
                Düzen
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ['< 640 px', '72–80 / 48 px', 'Tek sütun, görsel kenardan kenara, metin girintili'],
              ['640–1024 px', '80–128 / 48–77 px', 'İki kolon (5/7), görsel ve başlık yan yana'],
              ['≥ 1024 px', '128–160 / 77–96 px', '12 kolon, asimetrik yerleşim, cömert boşluk'],
              ['Her boyut', 'Sıkı seçeneği ×0,6', 'Üst yazı 11,5 px, geniş aralık; başlık 300 ağırlık'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <th scope="row" className="font-medium whitespace-nowrap">
                  {a}
                </th>
                <td className="tabular-nums">{b}</td>
                <td>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 18 · Erişim ───────────────────────── */

const ON: Record<string, { ad: string; hex: string }> = {
  komur: { ad: 'Kömür', hex: '#222222' },
  kahve: { ad: 'Kahve', hex: '#5B4E42' },
  soluk: { ad: 'Soluk', hex: '#6E6357' },
  toprak: { ad: 'Toprak', hex: '#8B7B6B' },
  kil: { ad: 'Kil', hex: '#B9A793' },
}
const ARKA: Record<string, { ad: string; hex: string }> = {
  tas: { ad: 'Taş', hex: '#F4F1EA' },
  fildisi: { ad: 'Fildişi', hex: '#FAF8F5' },
  komur: { ad: 'Kömür', hex: '#222222' },
}
const buyukMu = (px: number, agirlik: number) => px >= 24 || (px >= 18.66 && agirlik >= 700)

export function Erisim() {
  const s = useQuiet()
  const [on, setOn] = useState('toprak')
  const [arka, setArka] = useState('tas')
  const [px, setPx] = useState(13)
  const [agirlik, setAgirlik] = useState(400)
  const a = ON[on].hex
  const z = ARKA[arka].hex
  const k = kontrast(a, z)
  const hedef = buyukMu(px, agirlik) ? 3 : 4.5
  const gecer = k >= hedef
  const oneri = (() => {
    const aday = arka === 'komur' ? ['#BDB6AA', '#D8CFC0', '#FAF8F5'] : ['#6E6357', '#5B4E42', '#222222']
    return aday.find((h) => kontrast(h, z) >= 4.5) ?? aday[aday.length - 1]
  })()
  const uygula = () => {
    const anahtar = Object.entries(ON).find(([, v]) => v.hex.toLowerCase() === oneri.toLowerCase())?.[0]
    if (anahtar) setOn(anahtar)
    else setOn(arka === 'komur' ? 'kil' : 'soluk')
  }
  return (
    <Section
      id="erisim"
      madde="Madde 18 · Erişilebilirlik ve varyantlar"
      title="Doğal olarak erişilebilir"
      lead="Kömür yazı, fildişi ya da taş zeminde 14–15:1 verir; yüksek kontrast bu stilin varsayılanıdır. Yalnız zayıf toprak tonları sınır altında kalabilir: onları çizgi ve büyük yazı için, ikincil metin için ise koyu tonlarıyla kullanırız. Deneyin."
    >
      <div className="grid grid-cols-1 items-start gap-x-[var(--oluk)] gap-y-12 lg:grid-cols-12">
        <div className="flex min-h-[280px] flex-col justify-center border border-[var(--cizgi)] p-8 sm:p-12 lg:sticky lg:top-24 lg:col-span-7" style={{ background: z, borderRadius: 'var(--r)' }} data-lab="" data-lab-oran={k.toFixed(2)} data-lab-sonuc={gecer ? 'gecer' : 'yetmez'}>
          <p style={{ color: a, fontFamily: 'var(--font-sans)', fontSize: px, fontWeight: agirlik, letterSpacing: '0.02em', lineHeight: 1.7 }} data-lab-metin="">
            Ürün, mekân ve sayfa aynı sessizlikte buluşur. Gereksiz olan çıkar, kalan ise özenle yerleşir.
          </p>
          <p className="mt-8 font-mono text-[13px]" style={{ color: z === '#222222' ? '#FAF8F5' : '#222222' }}>
            {a} / {z} · {oran(k)}
          </p>
        </div>
        <div className="grid min-w-0 content-start gap-7 lg:col-span-5">
          <Secim<string> legend="Yazı rengi" name="lab-on" value={on} onChange={setOn} options={Object.entries(ON).map(([id, v]) => ({ id, ad: v.ad }))} />
          <Secim<string> legend="Zemin" name="lab-arka" value={arka} onChange={setArka} options={Object.entries(ARKA).map(([id, v]) => ({ id, ad: v.ad }))} />
          <Aralik label="Boyut" value={px} min={11} max={40} onChange={setPx} format={(v) => `${v}px`} />
          <Aralik label="Kalınlık" value={agirlik} min={300} max={700} step={100} onChange={setAgirlik} format={(v) => String(v)} />
          <div className="border-t border-[var(--cizgi)] pt-6" role="status" aria-live="polite">
            <p className="rakam text-[44px] leading-none">{oran(k)}</p>
            <p className="mt-3 text-[16px]" data-lab-karar="">
              {gecer ? (
                <>
                  <b className="font-medium">{k >= 7 ? 'AAA' : 'AA'}</b> · {buyukMu(px, agirlik) ? 'büyük yazı (3:1)' : 'normal yazı (4,5:1)'} için yeterli
                </>
              ) : (
                <>
                  <b className="font-medium">Yetmez</b> · {hedef}:1 gerekir
                </>
              )}
            </p>
            {!gecer ? (
              <div className="mt-4">
                <p className="text-[15px] text-soluk">
                  Öneri: <span className="font-mono">{oneri}</span>
                </p>
                <QuietButton boy="k" className="mt-3" onClick={uygula} data-oneri="">
                  Öneriyi uygula
                </QuietButton>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <h3 className="mt-[var(--aralik)] text-[clamp(26px,3vw,38px)]">Temalar</h3>
      <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-x-[var(--oluk)] gap-y-8 p-0 md:grid-cols-3" data-tema-onizleme="">
        {(['tas', 'fildisi', 'komur'] as const).map((t) => {
          const v = TEMA_RENK[t]
          const secili = s.tema === t
          return (
            <li key={t} data-onizle={t} className="grid grid-cols-1 content-start gap-5 border border-[var(--cizgi)] p-7" style={{ borderRadius: 'var(--r)' }}>
              <p className="font-serif text-[30px] leading-none">{v.ad}</p>
              <p className="text-[15px] text-soluk">Sessiz, düz, okunaklı.</p>
              <dl className="m-0 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-[14px]">
                <dt className="text-soluk">Metin</dt>
                <dd className="m-0 text-right tabular-nums">{oran(kontrast(v.metin, v.zemin))}</dd>
                <dt className="text-soluk">İkincil</dt>
                <dd className="m-0 text-right tabular-nums">{oran(kontrast(v.soluk, v.zemin))}</dd>
                <dt className="text-soluk">Çerçeve</dt>
                <dd className="m-0 text-right tabular-nums">{oran(kontrast(v.toprak, v.zemin))}</dd>
              </dl>
              <div>
                <QuietButton boy="k" onClick={() => s.setTemaTercih(t as TemaTercih)} aria-pressed={secili} data-tema-sec={t}>
                  {secili ? 'Seçili' : 'Seç'}
                </QuietButton>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-[var(--aralik)] grid grid-cols-1 items-start gap-x-[var(--oluk)] gap-y-12 lg:grid-cols-12">
        <div className="border border-[var(--cizgi)] bg-yuzey p-7 sm:p-9 lg:col-span-5" style={{ borderRadius: 'var(--r)' }}>
          <h3 className="text-[clamp(26px,3vw,36px)]">Görünüm ayarları</h3>
          <div className="mt-7">
            <Ayarlar onek="e-" />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h3 className="text-[clamp(26px,3vw,36px)]">Neler var</h3>
          <ul className="m-0 mt-6 grid list-none gap-4 p-0 text-[16px]" data-erisim-liste="">
            {[
              'Metin: kömür / taş 14,1:1, kömür / fildişi 15,0:1; yüksek kontrast varsayılan.',
              'Tema: Taş, Fildişi, Kömür. “Oto” sistem karanlığını izler, karanlıkta zemin kömür, yazı fildişi.',
              'Hareket sistem tercihini izler; kapalıyken yalnız geçiş kalkar, içerik hep görünür.',
              'Yüksek kontrast: yazı saf siyah / beyaz, çizgiler belirgin, doku silinir.',
              'Boşluk “Sıkı” seçeneği ×0,6; uzun sayfayı kısaltmak isteyenler için.',
              'Odak halkası 2 piksel, her etkileşimli öğe ≥ 44 piksel. Seçili durum yalnız renkle değil, kare işaret ve kalın alt çizgiyle belirtilir.',
            ].map((t) => (
              <li key={t} className="flex gap-4">
                <i className={cx('mt-[0.78em] block size-[6px] shrink-0 bg-metin')} aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Kod label="Yüksek kontrast" className="mt-12" sar={false}>{`:root[data-kontrast='yuksek'] {
  --metin: #000000;   /* taşta 18,6:1 */
  --cizgi: rgb(0 0 0 / .55);
}`}</Kod>
    </Section>
  )
}
