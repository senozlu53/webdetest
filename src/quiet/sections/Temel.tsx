import { useState, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { useQuiet } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { TUM_SIMGELER, SIMGE_AD } from '../lib/simge'
import { Gorsel } from '../components/Gorsel'
import { Ikon } from '../components/Ikon'
import { EditorialGrid, Kolon, QuietButton } from '../components/Quiet'
import { Anahtar, Aralik, Kod, Section, Secim } from '../components/ui'

export const TEMA_RENK = {
  tas: { ad: 'Taş', zemin: '#F4F1EA', yuzey: '#FAF8F5', metin: '#222222', soluk: '#6E6357', kahve: '#5B4E42', toprak: '#8B7B6B', btnYazi: '#FAF8F5', btn: '#222222' },
  fildisi: { ad: 'Fildişi', zemin: '#FAF8F5', yuzey: '#F4F1EA', metin: '#222222', soluk: '#675C50', kahve: '#5B4E42', toprak: '#8B7B6B', btnYazi: '#FAF8F5', btn: '#222222' },
  komur: { ad: 'Kömür', zemin: '#222222', yuzey: '#2C2B29', metin: '#FAF8F5', soluk: '#BDB6AA', kahve: '#D8CFC0', toprak: '#A89F92', btnYazi: '#222222', btn: '#FAF8F5' },
} as const

const seviye = (k: number, cizgi = false) => (k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : k >= 3 ? (cizgi ? 'Çizgi ve büyük yazı' : 'Yalnız büyük yazı') : 'Yetmez')

const RENKLER = [
  { ad: 'Taş Grisi', hex: '#F4F1EA', token: 'Color/StoneBackground', rol: 'Sayfa zemini. Sıcak kil, hiç soğuk gri değil', koyu: false, span: 6 },
  { ad: 'Kömür', hex: '#222222', token: 'Color/CharcoalText', rol: 'Gövde ve başlık metni, düğme dolgusu', koyu: true, span: 3 },
  { ad: 'Fildişi', hex: '#FAF8F5', token: 'Color/IvorySurface', rol: 'Yüzey, form alanı, ters tema zemini', koyu: false, span: 3 },
  { ad: 'Kahve', hex: '#5B4E42', token: 'Color/EarthDeep', rol: 'Vurgu metni. Taşta 7,1:1', koyu: true, span: 3 },
  { ad: 'Toprak', hex: '#8B7B6B', token: 'Color/EarthMid', rol: 'Kontrol çerçevesi. Yalnız çizgi (3,6:1)', koyu: true, span: 3 },
  { ad: 'Kil', hex: '#B9A793', token: 'Color/EarthClay', rol: 'Süs çizgisi, görsel arka planı', koyu: false, span: 3 },
  { ad: 'Kum', hex: '#D8CFC0', token: 'Color/EarthSand', rol: 'İnce ayraç, boş görsel zemini', koyu: false, span: 3 },
] as const

/** Madde 4: taş, kömür, fildişi ve zayıf toprak tonları */
export function Palet() {
  const { duyur } = useQuiet()
  const kopyala = (hex: string) => {
    navigator.clipboard?.writeText(hex).then(
      () => duyur(`${hex} kopyalandı`),
      () => duyur(`Kopyalanamadı, değer: ${hex}`),
    )
  }
  const CIFT: [string, string, string, boolean][] = []
  ;(Object.keys(TEMA_RENK) as (keyof typeof TEMA_RENK)[]).forEach((t) => {
    const v = TEMA_RENK[t]
    CIFT.push(
      [`${v.ad} · metin / zemin`, v.metin, v.zemin, false],
      [`${v.ad} · ikincil metin / zemin`, v.soluk, v.zemin, false],
      [`${v.ad} · vurgu metni / zemin`, v.kahve, v.zemin, false],
      [`${v.ad} · kontrol çerçevesi / zemin`, v.toprak, v.zemin, true],
      [`${v.ad} · düğme yazısı / düğme`, v.btnYazi, v.btn, false],
    )
  })
  CIFT.push(['Kil #B9A793 metin olarak / taş (kullanılmaz)', '#B9A793', '#F4F1EA', false])
  return (
    <Section id="palet" madde="Madde 4 · Renk paleti" title="Taş, kömür, fildişi" lead="Üç ana ton ve dört zayıf toprak tonu. Doygun renk yok. Metin hep kömür (taşta 14,1:1); toprak tonları yalnız çizgi, dolgu ve ikincil metin için, kendi kontrast sınırlarıyla.">
      <EditorialGrid aralik={false} className="!gap-y-[var(--oluk)]">
        {RENKLER.map((r) => (
          <Kolon key={r.hex} span={r.span === 6 ? 12 : 6} lg={r.span} belir>
            <div className="grid grid-cols-1 gap-4" data-renk-ornek={r.hex}>
              <div className="relative border border-[var(--cizgi)]" style={{ background: r.hex, height: r.span === 6 ? 'clamp(180px, 22vw, 300px)' : 'clamp(140px, 14vw, 180px)', borderRadius: 'var(--r)' }}>
                <span className={cx('absolute bottom-3 left-4 font-mono text-[12px] tracking-widest', r.koyu ? 'text-[#faf8f5]' : 'text-[#222222]')} aria-hidden="true">
                  {r.hex}
                </span>
              </div>
              <div>
                <p className="font-serif text-[26px] leading-tight">{r.ad}</p>
                <p className="mt-1 font-mono text-[12px] break-all text-soluk">{r.token}</p>
                <p className="mt-2 text-[15px] leading-[1.7] text-soluk">{r.rol}</p>
                <QuietButton varyant="metin" boy="k" className="mt-1" onClick={() => kopyala(r.hex)} aria-label={`${r.ad} ${r.hex}, kopyala`}>
                  {r.hex} kopyala
                </QuietButton>
              </div>
            </div>
          </Kolon>
        ))}
      </EditorialGrid>

      <div className="mt-[var(--aralik)] overflow-x-auto" role="region" aria-label="Kontrast tablosu" tabIndex={0}>
        <table className="tablo w-full min-w-[620px] border-collapse text-[15px]" data-kontrast-tablo="">
          <caption>Kontrast · WCAG 2.2</caption>
          <tbody>
            {CIFT.map(([a, y, z, cz]) => {
              const k = kontrast(y, z)
              return (
                <tr key={a}>
                  <th scope="row" className="font-normal">
                    <span className="mr-4 inline-grid size-8 place-items-center border border-[var(--cizgi)] align-middle font-serif text-[16px] leading-none" style={{ background: z, color: y, borderRadius: 'var(--r)' }} aria-hidden="true">
                      A
                    </span>
                    {a}
                  </th>
                  <td className="text-right tabular-nums">{oran(k)}</td>
                  <td className="text-right font-medium whitespace-nowrap">{seviye(k, cz)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

/** Madde 5: dergi tipografisi */
export function Yazi() {
  const [metin, setMetin] = useState('Az, ama doğru.')
  const [boy, setBoy] = useState(96)
  const [agirlik, setAgirlik] = useState(300)
  const [italik, setItalik] = useState(false)
  const [iz, setIz] = useState(-0.01)
  const [gBoy, setGBoy] = useState(17)
  const [gAgirlik, setGAgirlik] = useState(400)
  const [satir, setSatir] = useState(1.8)
  return (
    <Section id="yazi" madde="Madde 5 · Tipografi" title="Serif ve sans, dengede" lead="Cormorant Garamond: ince, uzun, dergi kapağı gibi başlıklar. Montserrat: gövde, üst yazı, düğme; temiz ve geometrik. Serif büyük ve hafif, sans küçük ve geniş aralıklı. İkisinde de ğ, ş, ı, İ, ç, ö, ü ve ₺ var.">
      <div className="grid grid-cols-1 gap-x-[var(--oluk)] gap-y-14 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <p className="kicker">
            Cormorant Garamond · {agirlik} · {italik ? 'italik' : 'düz'}
          </p>
          <p className="mt-6 max-w-full [overflow-wrap:anywhere] text-metin" data-yazi-ornek="" style={{ fontFamily: 'var(--font-serif)', fontSize: `min(${boy}px, 15vw)`, fontWeight: agirlik, fontStyle: italik ? 'italic' : 'normal', letterSpacing: `${iz}em`, lineHeight: 1.02 }}>
            {metin || ' '}
          </p>
          <div className="mt-12 grid grid-cols-1 gap-x-[var(--oluk)] gap-y-8 sm:grid-cols-2">
            <div>
              <p className="kicker">
                Montserrat · {gAgirlik} · {gBoy}px
              </p>
              <p className="mt-4 max-w-[46ch]" data-govde-ornek="" style={{ fontSize: gBoy, fontWeight: gAgirlik, lineHeight: satir }}>
                Ürün, mekân ve sayfa aynı sessizlikte buluşur. Gereksiz olan çıkar, kalan ise özenle yerleşir; boşluk da içeriğin bir parçasıdır.
              </p>
            </div>
            <div>
              <p className="kicker">Ölçek</p>
              <table className="tablo mt-4 w-full border-collapse text-[14px]" data-yazi-tablo="">
                <tbody>
                  {[
                    ['Başlık 1', 'Cormorant 300', '52–176px'],
                    ['Başlık 2', 'Cormorant 400', '38–92px'],
                    ['Başlık 3', 'Cormorant 400', '28–44px'],
                    ['Üst yazı', 'Montserrat 500, 0,3em', '11,5px'],
                    ['Gövde', 'Montserrat 400', '16,5–20px'],
                  ].map(([a, b, c]) => (
                    <tr key={a}>
                      <th scope="row" className="!py-2 font-medium">
                        {a}
                      </th>
                      <td className="!py-2">{b}</td>
                      <td className="!py-2 text-right tabular-nums">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6 lg:col-span-4">
          <div>
            <label htmlFor="yazi-girdi" className="etiket mb-1 block">
              Kendi başlığın
            </label>
            <input id="yazi-girdi" className="alan" value={metin} onChange={(e) => setMetin(e.target.value)} maxLength={30} />
          </div>
          <Aralik label="Başlık boyu" value={boy} min={32} max={176} onChange={setBoy} format={(v) => `${v}px`} />
          <Aralik label="Başlık kalınlığı" value={agirlik} min={300} max={700} step={50} onChange={setAgirlik} format={(v) => String(v)} />
          <Aralik label="Harf aralığı" value={iz} min={-0.04} max={0.12} step={0.005} onChange={setIz} format={(v) => `${v.toFixed(3).replace('.', ',')}em`} />
          <Anahtar label="İtalik" checked={italik} onChange={setItalik} />
          <Aralik label="Gövde boyu" value={gBoy} min={14} max={22} onChange={setGBoy} format={(v) => `${v}px`} />
          <Aralik label="Gövde kalınlığı" value={gAgirlik} min={300} max={600} step={100} onChange={setGAgirlik} format={(v) => String(v)} />
          <Aralik label="Satır aralığı" value={satir} min={1.4} max={2.2} step={0.05} onChange={setSatir} format={(v) => v.toFixed(2).replace('.', ',')} />
        </div>
      </div>
      <Kod label="Yazı yığını" className="mt-16" sar={false}>{`--font-serif: 'Cormorant Garamond Variable', 'Iowan Old Style', Georgia, serif;
--font-sans:  'Montserrat Variable', 'Helvetica Neue', Arial, sans-serif;`}</Kod>
    </Section>
  )
}

type Yari = '0' | '2' | '4'

/** Madde 6: keskin ya da 2–4 px yuvarlak saf geometri */
export function Sekil() {
  const [r, setR] = useState<Yari>('2')
  return (
    <Section id="sekil" madde="Madde 6 · Şekil dili" title="Saf geometri, en fazla 4 piksel" lead="Kare, dikdörtgen, çizgi. Köşe ya keskin ya da 2–4 piksel; hap biçimi, daire ve blob yok. Form içeriğe hizmet eder, önüne geçmez.">
      <div className="grid grid-cols-1 gap-x-[var(--oluk)] gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Secim<Yari>
            legend="Köşe yarıçapı"
            name="sekil-r"
            value={r}
            onChange={setR}
            options={[
              { id: '0', ad: '0 px' },
              { id: '2', ad: '2 px' },
              { id: '4', ad: '4 px' },
            ]}
          />
          <p className="mt-6 max-w-[38ch] text-soluk">Sistem varsayılanı 2 piksel: gözle fark edilmeyecek kadar yumuşak, ama ağır bir kenar değil.</p>
        </div>
        <div className="grid grid-cols-1 gap-x-[var(--oluk)] gap-y-8 sm:grid-cols-3 lg:col-span-8" style={{ ['--r' as string]: `${r}px` } as CSSProperties} data-sekil-ornek={r}>
          <div className="grid content-start gap-4">
            <p className="kicker">Düğme</p>
            <div>
              <QuietButton varyant="dolu">Rezervasyon</QuietButton>
            </div>
          </div>
          <div className="grid content-start gap-4">
            <p className="kicker">Görsel</p>
            <div className="gorsel aspect-[4/3]" data-sekil-gorsel="">
              <Gorsel sahne="kumsal" />
            </div>
          </div>
          <div className="grid content-start gap-4">
            <p className="kicker">Kart</p>
            <div className="border border-[var(--cizgi)] bg-yuzey p-6" style={{ borderRadius: 'var(--r)' }} data-sekil-kart="">
              <p className="font-serif text-[26px] leading-tight">Sessiz Han</p>
              <p className="mt-2 text-[14px] text-soluk">Mardin · 2023</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[var(--aralik)] grid grid-cols-1 gap-x-[var(--oluk)] gap-y-10 md:grid-cols-2">
        <figure className="m-0 grid grid-cols-1 gap-4" data-yanlis="" aria-hidden="true">
          <div className="grid h-[240px] place-items-center bg-[#faf8f5] p-6">
            <div className="grid w-[80%] place-items-center bg-[#d9cdb8] py-10 text-[14px] font-medium tracking-widest text-[#222222] uppercase" style={{ borderRadius: 9999 }}>
              Hap ve blob
            </div>
          </div>
        </figure>
        <figcaption className="text-[16px] text-soluk md:col-start-1">
          <b className="font-medium text-metin">Yapma.</b> Tam yuvarlak hap biçimi öne çıkar; içerik ikinci plana düşer.
        </figcaption>
        <figure className="m-0 grid grid-cols-1 gap-4 md:col-start-2 md:row-start-1" data-dogru="">
          <div className="grid h-[240px] place-items-center bg-yuzey p-6">
            <div className="grid w-[80%] place-items-center border border-metin py-10 text-[14px] font-medium tracking-widest uppercase" style={{ borderRadius: 2 }}>
              Keskin, ince, sessiz
            </div>
          </div>
        </figure>
        <figcaption className="text-[16px] text-soluk md:col-start-2">
          <b className="font-medium text-metin">Yap.</b> 2 piksellik köşe, 1 piksellik çizgi: biçim geri çekilir, içerik konuşur.
        </figcaption>
      </div>
    </Section>
  )
}

/** Madde 7: gölge yok, derinlik katmanlaşmayla */
export function Derinlik() {
  const [ort, setOrt] = useState(96)
  const [onde, setOnde] = useState(true)
  return (
    <Section id="derinlik" madde="Madde 7 · Z ekseni ve gölge" title="Gölgesiz katmanlar" lead="Flat mimari: box-shadow yok. Derinlik, metin bloğunun görselin kenarına taşmasından ve katmanların sırasından gelir. Aşağıda örtüşme miktarını ve hangisinin önde olduğunu deneyin.">
      <div className="grid grid-cols-1 items-start gap-x-[var(--oluk)] gap-y-12 lg:grid-cols-12">
        <div className="relative lg:col-span-8" data-katman-demo="">
          <div className="gorsel aspect-[3/2] w-[82%]">
            <Gorsel sahne="oda" />
          </div>
          <div className="border border-[var(--cizgi)] bg-yuzey p-8 sm:p-10" style={{ borderRadius: 'var(--r)', position: 'relative', zIndex: onde ? 2 : 0, width: 'min(60%, 420px)', marginLeft: 'auto', marginTop: `-${ort + 60}px`, marginRight: 0 }} data-katman-metin="">
            <p className="kicker">Avlu Odası</p>
            <p className="mt-3 font-serif text-[clamp(26px,3vw,38px)] leading-tight">Sabah, keten ve taş.</p>
            <p className="mt-3 text-[15px] text-soluk">Metin görselin üstüne değil, kenarına oturur.</p>
          </div>
        </div>
        <div className="grid min-w-0 content-start gap-6 lg:col-span-4">
          <Aralik label="Örtüşme" value={ort} min={0} max={160} step={8} onChange={setOrt} format={(v) => `${v}px`} />
          <Anahtar label="Metin önde" hint="Kapalıyken görsel metnin üstüne çıkar" checked={onde} onChange={setOnde} />
        </div>
      </div>
      <div className="mt-[var(--aralik)] grid grid-cols-1 gap-x-[var(--oluk)] gap-y-10 md:grid-cols-2">
        <figure className="m-0 grid grid-cols-1 gap-4">
          <div className="grid h-[220px] place-items-center bg-[#faf8f5]">
            <div className="grid h-[110px] w-[70%] place-items-center bg-[#faf8f5] text-[13px] font-medium tracking-widest uppercase" style={{ boxShadow: '0 12px 32px rgb(0 0 0 / .28)' }} data-dijital="">
              <span className="line-through">box-shadow</span>
            </div>
          </div>
          <figcaption className="text-[16px] text-soluk">
            <b className="font-medium text-metin">Yapma.</b> Yükselen kart, sessizliğin tersi: göz gölgeye gider.
          </figcaption>
        </figure>
        <figure className="m-0 grid grid-cols-1 gap-4" data-dogru="">
          <div className="grid h-[220px] place-items-center bg-yuzey">
            <div className="grid h-[110px] w-[70%] place-items-center border border-metin text-[13px] font-medium tracking-widest uppercase" style={{ borderRadius: 2 }}>
              yalnız 1 px çizgi
            </div>
          </div>
          <figcaption className="text-[16px] text-soluk">
            <b className="font-medium text-metin">Yap.</b> Kenar çizgisi ve yüzey tonu farkı: ağırlık yok, yalnız ayrım.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}

const DOKULAR: { id: 'keten' | 'kagit' | 'tas' | 'duz'; ad: string; not: string; maske: string; boyut: string }[] = [
  { id: 'keten', ad: 'İnce keten', not: 'yatay ve dikey iplik, iki gürültü katmanı', maske: 'var(--m-keten)', boyut: '260px' },
  { id: 'kagit', ad: 'Mat kâğıt', not: 'ince tane, hiç parlaklık yok', maske: 'var(--m-kagit)', boyut: '240px' },
  { id: 'tas', ad: 'Doğal taş', not: 'düşük frekanslı traverten damarı', maske: 'var(--m-tas)', boyut: '800px' },
  { id: 'duz', ad: 'Düz', not: 'doku kapalı', maske: 'none', boyut: '100px' },
]

/** Madde 8: kumaş, mat kâğıt ve taş */
export function Doku() {
  const s = useQuiet()
  const [yakin, setYakin] = useState(1)
  return (
    <Section id="doku" madde="Madde 8 · Doku ve yüzey" title="Keten, kâğıt, taş" lead="Doku bir resim değil; SVG gürültüsünden kesilmiş çok ince bir maske. Rengi temadan alır, opaklığı %5–8. Gözle ancak yakından seçilir: yüzey sakin, ama dümdüz de değil.">
      <ul className="m-0 grid list-none grid-cols-1 gap-x-[var(--oluk)] gap-y-10 p-0 sm:grid-cols-2 xl:grid-cols-4" data-doku-izgara="">
        {DOKULAR.map((d) => (
          <li key={d.id} className="grid min-w-0 grid-cols-1 gap-4">
            <div className="relative aspect-[4/5] overflow-hidden border border-[var(--cizgi)] bg-yuzey" style={{ borderRadius: 'var(--r)' }} data-doku-kutu={d.id}>
              {d.id !== 'duz' ? <div className="absolute inset-0 bg-metin" style={{ WebkitMaskImage: d.maske, maskImage: d.maske, WebkitMaskSize: `${parseFloat(d.boyut) * yakin}px`, maskSize: `${parseFloat(d.boyut) * yakin}px`, opacity: 0.22 }} /> : null}
              {s.doku === d.id ? <span className="absolute bottom-3 left-3 border border-metin bg-zemin px-2 py-0.5 text-[11px] font-semibold tracking-[0.2em]">SEÇİLİ</span> : null}
            </div>
            <div>
              <p className="font-serif text-[26px] leading-tight">{d.ad}</p>
              <p className="mt-1 text-[15px] text-soluk">{d.not}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-14 grid grid-cols-1 gap-x-[var(--oluk)] gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Secim<'keten' | 'kagit' | 'tas' | 'duz'>
            legend="Sayfa dokusu"
            name="doku-sec"
            value={s.doku}
            onChange={s.setDoku}
            options={[
              { id: 'keten', ad: 'Keten' },
              { id: 'kagit', ad: 'Mat kâğıt' },
              { id: 'tas', ad: 'Taş' },
              { id: 'duz', ad: 'Düz' },
            ]}
          />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <Aralik label="Yakınlaştır" value={yakin} min={1} max={4} step={0.5} onChange={setYakin} format={(v) => `${v.toFixed(1).replace('.', ',')}×`} />
        </div>
      </div>
    </Section>
  )
}

/** Madde 9: 1 piksellik işlevsel ikonlar */
export function Ikonlar() {
  const [boyut, setBoyut] = useState(28)
  return (
    <Section id="ikonlar" madde="Madde 9 · İkonografi" title="Yalnız işlevsel çizgi" lead="24 ikon, hepsi 24×24 kutuda, tek renk, 1 piksel hat. Süs yok, dolgu yok; her biri bir işi görür. Boyut değişse de hat kalınlığı değişmez.">
      <div className="grid grid-cols-1 gap-x-[var(--oluk)] gap-y-10 lg:grid-cols-12">
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-px border border-[var(--cizgi)] bg-[var(--cizgi)] p-0 lg:col-span-9" data-ikon-izgara="" style={{ borderRadius: 'var(--r)', overflow: 'hidden' }}>
          {TUM_SIMGELER.map((a) => (
            <li key={a} className="grid justify-items-center gap-4 bg-yuzey px-2 py-8">
              <span className="grid h-12 place-items-center">
                <Ikon ad={a} boyut={boyut} />
              </span>
              <span className="text-[12px] tracking-[0.12em] text-soluk uppercase">{SIMGE_AD[a]}</span>
            </li>
          ))}
        </ul>
        <div className="lg:col-span-3">
          <Aralik label="Boy" value={boyut} min={16} max={56} step={4} onChange={setBoyut} format={(v) => `${v}px`} />
          <p className="mt-6 text-[15px] text-soluk">
            Hat: <span className="font-mono">1px</span>, uç: kare, birleşim: keskin.
          </p>
        </div>
      </div>
    </Section>
  )
}
