import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import type { KoseStil } from '../lib/geo'
import { SIMGE_AD, type SimgeAd } from '../lib/simge'
import { ArtDecoCard } from '../components/Cerceve'
import { GoldBorderButton } from '../components/Dugme'
import { Ikon } from '../components/Ikon'
import { Ayirac } from '../components/Ornament'
import { useSize } from '../components/hooks'
import { Aralik, Anahtar, Kod, Section, Secim } from '../components/ui'

/* ───────────────────────── Madde 14 · Bileşenler ───────────────────────── */

const IKON_SEC: SimgeAd[] = ['tac', 'elmas', 'kadeh', 'yelpaze', 'gunes', 'kumsaati']

export function Bilesenler() {
  const [stil, setStil] = useState<KoseStil>('basamak')
  const [kat, setKat] = useState(2)
  const [ikon, setIkon] = useState<SimgeAd>('tac')
  const [ciz, setCiz] = useState(false)
  const [n, setN] = useState(0)
  const kod = `<ArtDecoCard
  ustyazi="Salon Doré"
  baslik="Akşam yemeği"
  ikon="${ikon}"
  stil="${stil}"
  kat={${kat}}${ciz ? '\n  ciz' : ''}
>
  Gece siyahı, altın çizgi.
</ArtDecoCard>`
  return (
    <Section id="bilesenler" madde="Madde 14 · 11 · Bileşenler" title="İki bileşen" lead="İki temel bileşen. Kart altın çerçeveli, ortalanmış ve simetriktir; düğme iç içe iki ince çerçeveden oluşur ve üstüne gelince dolgusu ortadan iki yana açılır. İkisi de gölgesizdir.">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="mx-auto w-full max-w-[420px]" data-artdeco-oyun="">
          <ArtDecoCard key={`${n}${stil}${kat}${ciz}`} ustyazi="Salon Doré" baslik="Akşam yemeği" ikon={ikon} stil={stil} kat={kat} ciz={ciz}>
            <p className="text-[17px] text-soluk">Gece siyahı üzerinde altın çizgi; her satır tek eksende.</p>
            <GoldBorderButton boy="k" className="mt-6">
              Masa ayırt
            </GoldBorderButton>
          </ArtDecoCard>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-6">
          <Secim<KoseStil>
            legend="Köşe"
            name="bl-stil"
            value={stil}
            onChange={setStil}
            options={[
              { id: 'duz', ad: 'Düz' },
              { id: 'pah', ad: 'Pahlı' },
              { id: 'basamak', ad: 'Basamaklı' },
            ]}
          />
          <Aralik label="Çerçeve sayısı" value={kat} min={1} max={4} onChange={setKat} />
          <Secim<SimgeAd> legend="İkon" name="bl-ikon" value={ikon} onChange={setIkon} options={IKON_SEC.map((a) => ({ id: a, ad: SIMGE_AD[a] }))} />
          <Anahtar label="Çizerek aç" hint="Çerçeve çizgileri ortadan kenara çizilir" checked={ciz} onChange={setCiz} />
          <div>
            <GoldBorderButton boy="k" onClick={() => setN((x) => x + 1)}>
              Yeniden oynat
            </GoldBorderButton>
          </div>
        </div>
      </div>
      <Kod label="ArtDecoCard kullanımı" className="mt-8" sar={false}>
        {kod}
      </Kod>

      <h3 className="mt-20 text-[clamp(20px,2.4vw,26px)]">&lt;GoldBorderButton&gt;</h3>
      <div className="relative isolate mx-auto mt-8 max-w-[820px] bg-yuzey p-8" data-gbtn-varyant="">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="grid justify-items-center gap-5">
            <p className="kicker">Doldurulmuş ve çerçeveli</p>
            <GoldBorderButton ana boy="b">
              Oda ayırt
            </GoldBorderButton>
            <GoldBorderButton boy="b">Menüyü gör</GoldBorderButton>
          </div>
          <div className="grid justify-items-center gap-5">
            <p className="kicker">Küçük, ikonlu, pasif</p>
            <GoldBorderButton boy="k" ikon={<Ikon ad="zarf" boyut={22} className="text-inherit" />}>
              Davet iste
            </GoldBorderButton>
            <GoldBorderButton boy="k" ana>
              Kabul et
            </GoldBorderButton>
            <GoldBorderButton boy="k" disabled>
              Pasif
            </GoldBorderButton>
          </div>
        </div>
        <p className="mt-8 text-[16px] text-soluk">Üstüne gelince ya da odaklanınca dolgu ortadan iki yana simetrik açılır (700 ms); yazı rengi altından siyaha döner.</p>
      </div>
      <Kod label="GoldBorderButton kullanımı" className="mt-6" sar={false}>{`<GoldBorderButton ana boy="b" onClick={git}>
  Oda ayırt
</GoldBorderButton>`}</Kod>
    </Section>
  )
}

/* ───────────────────────── Madde 12 · 13 · Figma ───────────────────────── */

const DURAKLAR = ['#8C6D1F 0%', '#E0C258 22%', '#D4AF37 46%', '#8C6D1F 64%', '#E0C258 84%', '#B8942A 100%']

/** Madde 12 · 13: gradyan stroke ve Auto Layout ile merkezleme */
export function Figma() {
  const [aci, setAci] = useState(135)
  const [kalin, setKalin] = useState(1)
  const [merkez, setMerkez] = useState(true)
  const [ref, { w }] = useSize<HTMLDivElement>()
  const [sapma, setSapma] = useState<number[]>([])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const ler = [...el.querySelectorAll<HTMLElement>('[data-al-cocuk]')].map((c) => {
      const b = c.getBoundingClientRect()
      return Math.round(Math.abs(b.left - r.left - (r.right - b.right)))
    })
    setSapma(ler)
  }, [merkez, w, ref])
  const grad = `linear-gradient(${aci}deg, ${DURAKLAR.join(', ')})`
  const enBuyuk = Math.max(0, ...sapma)
  return (
    <Section id="figma" madde="Madde 12 · 13 · Figma mimarisi" title="Gradyan stroke, merkez" lead="Çerçeve, Figma'da ince bir altın gradyan stroke olarak tanımlanır; bileşenin içi katı Auto Layout ile yatay ve dikey ortalanır. Simetri elle değil, kuralla korunur: sapma sıfır.">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <h3 lang="en" className="text-[clamp(20px,2.4vw,26px)]">
            Border / ThinGold
          </h3>
          <div className="mx-auto mt-8 grid h-[220px] max-w-[440px] place-items-center bg-yuzey p-6 text-center" style={{ border: `${kalin}px solid transparent`, borderImage: `${grad} 1` } as CSSProperties} data-figma-stroke={aci}>
            <div>
              <p className="kicker">Stroke</p>
              <p className="mt-2 font-baslik text-[18px] tracking-[0.2em] text-altin-yazi uppercase">
                {aci}° · {kalin} px
              </p>
            </div>
          </div>
          <div className="mx-auto mt-8 grid max-w-[440px] grid-cols-1 gap-5">
            <Aralik label="Gradyan açısı" value={aci} min={0} max={360} step={15} onChange={setAci} format={(v) => `${v}°`} />
            <Secim<'1' | '2'>
              legend="Kalınlık"
              name="fg-kalin"
              value={String(kalin) as '1' | '2'}
              onChange={(v) => setKalin(+v)}
              options={[
                { id: '1', ad: '1 px' },
                { id: '2', ad: '2 px' },
              ]}
            />
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="text-[clamp(20px,2.4vw,26px)]">Auto Layout</h3>
          <div ref={ref} className={cx('relative mx-auto mt-8 flex h-[220px] max-w-[440px] flex-col justify-center gap-3 border border-altin-soluk bg-yuzey p-6', merkez ? 'items-center text-center' : 'items-start text-left')} data-al={merkez ? 'merkez' : 'sol'}>
            <span className="pointer-events-none absolute inset-y-0 left-1/2 border-l border-dashed border-altin-cizgi opacity-60" aria-hidden="true" data-figma-eksen="" />
            <span className="block" data-al-cocuk="">
              <Ikon ad="tac" boyut={36} />
            </span>
            <p className="kicker !text-inherit" data-al-cocuk="">
              Üst yazı
            </p>
            <p className="font-baslik text-[20px] tracking-[0.2em] text-altin-yazi uppercase" data-al-cocuk="">
              Başlık
            </p>
            <GoldBorderButton boy="k" data-al-cocuk="">
              Düğme
            </GoldBorderButton>
          </div>
          <p className="mt-4 text-[17px]" data-simetri={enBuyuk <= 1 ? 'tam' : 'bozuk'} aria-live="polite">
            Simetri sapması: <b className="font-mono text-altin-yazi">{enBuyuk} px</b> {enBuyuk <= 1 ? '(kusursuz)' : '(bozuk)'}
          </p>
          <div className="mt-5 flex justify-center">
            <Anahtar label="Auto Layout: merkez" hint="Kapalıyken çocuklar sola dayanır ve eksen bozulur" checked={merkez} onChange={setMerkez} />
          </div>
        </div>
      </div>

      <div className="mt-16 overflow-x-auto" role="region" aria-label="Figma katman ağacı" tabIndex={0}>
        <div className="kart-duz p-5">
          <table className="tablo w-full min-w-[620px] border-collapse text-[16px]" data-figma-agac="">
            <caption>Katman ağacı</caption>
            <thead>
              <tr>
                <th scope="col" className="etiket !text-[12px]">
                  Katman
                </th>
                <th scope="col" className="etiket !text-[12px]">
                  Auto Layout
                </th>
                <th scope="col" className="etiket !text-[12px]">
                  Hizalama
                </th>
                <th scope="col" className="etiket !text-[12px]">
                  Stil
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Card', 'Dikey · aralık 24 · dolgu 40/28', 'Merkez / Merkez', 'Stroke: Border/ThinGold'],
                ['Card / İkon', '44 × 44', 'Merkez', 'Stroke 1 px, Color/ArtDecoGold'],
                ['Card / Üst yazı', 'Otomatik genişlik', 'Merkez', 'Typography/LuxurySerif · 14'],
                ['Card / Ayraç', 'Doldur (Fill)', 'Merkez', 'Baklava + iki ince çizgi'],
                ['Card / Başlık', 'Otomatik yükseklik', 'Merkez', 'Typography/LuxurySerif · 26'],
              ].map(([a, b, c, d]) => (
                <tr key={a}>
                  <th scope="row" className="font-mono text-[14px] font-semibold">
                    {a}
                  </th>
                  <td>{b}</td>
                  <td>{c}</td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-[clamp(20px,2.4vw,26px)]">Tokenlar</h3>
        <ul className="m-0 mx-auto mt-8 grid max-w-[900px] list-none grid-cols-1 gap-4 p-0 md:grid-cols-3" data-figma-token="">
          {[
            ['Color/ArtDecoGold', '#D4AF37', 'Parlak Altın: çizgi, başlık', 'renk'],
            ['Border/ThinGold', '1 px · gradyan 135°', 'İnce altın stroke', 'cerceve'],
            ['Typography/LuxurySerif', 'Cinzel 500 · 0,14em', 'Büyük harf, geniş aralık', 'yazi'],
          ].map(([a, b, c, t]) => (
            <li key={a} className="relative isolate bg-yuzey px-5 py-6 text-center">
              <div className="pointer-events-none absolute inset-0 border border-altin-soluk" aria-hidden="true" />
              {t === 'renk' ? <span className="mx-auto mb-3 block size-8 rotate-45 border border-altin-cizgi" style={{ background: '#D4AF37' }} aria-hidden="true" /> : null}
              {t === 'cerceve' ? <span className="mx-auto mb-3 block h-8 w-16" style={{ border: '1px solid transparent', borderImage: `${grad} 1` } as CSSProperties} aria-hidden="true" /> : null}
              {t === 'yazi' ? <span className="mb-3 block font-baslik text-[22px] tracking-[0.14em] text-altin-yazi uppercase">Aa</span> : null}
              <p className="font-mono text-[13px] font-semibold break-all text-metin">{a}</p>
              <p className="mt-2 text-[16px]">{b}</p>
              <p className="text-[15px] text-soluk">{c}</p>
            </li>
          ))}
        </ul>
      </div>
      <Kod label="Figma token dosyası" className="mt-8" sar={false}>{`{
  "Color":  { "ArtDecoGold": { "$type": "color", "$value": "#D4AF37" } },
  "Border": { "ThinGold": { "$type": "gradient", "$value": [
    { "color": "#8C6D1F", "position": 0 },
    { "color": "#E0C258", "position": 0.22 },
    { "color": "#D4AF37", "position": 0.46 }
  ] } },
  "Typography": { "LuxurySerif": { "$type": "typography", "$value": {
    "fontFamily": "Cinzel", "fontWeight": 500,
    "letterSpacing": "0.14em", "textCase": "uppercase" } } }
}`}</Kod>
    </Section>
  )
}

/* ───────────────────────── Madde 15 · CSS / Tailwind ───────────────────────── */

type Onizle = 'siyah' | 'lacivert' | 'zumrut' | 'fildisi'

export function Css() {
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)
  const [tema, setTema] = useState<Onizle>('fildisi')
  const [hesap, setHesap] = useState<Record<string, string>>({})
  useEffect(() => {
    const oku = (el: HTMLElement | null, k: string) => (el ? getComputedStyle(el).getPropertyValue(k) : '')
    setHesap({
      'border-color': oku(a.current, 'border-top-color'),
      'border-width': oku(a.current, 'border-top-width'),
      background: oku(a.current, 'background-color'),
      color: oku(a.current, 'color'),
      'letter-spacing': oku(a.current, 'letter-spacing'),
      'token-bg': oku(b.current, 'background-color'),
      'token-color': oku(b.current, 'color'),
    })
  }, [tema])
  return (
    <Section
      id="css"
      madde="Madde 15 · CSS / Tailwind"
      title="Dört sınıf, bir çerçeve"
      lead="Tanım tek satır: border border-[#D4AF37] bg-[#0B0B0B] text-[#D4AF37] tracking-widest. Bu sınıflar sayfada olduğu gibi kullanılır ve hesaplanan değerleri yanda okunur. Temaya uyum gerekiyorsa aynı satır token sınıflarıyla yazılır."
    >
      <div className="mb-10 flex justify-center">
        <Secim<Onizle>
          legend="Sayfa teması (önizleme)"
          name="css-tema"
          value={tema}
          onChange={setTema}
          options={[
            { id: 'siyah', ad: 'Gece siyahı' },
            { id: 'lacivert', ad: 'Lacivert' },
            { id: 'zumrut', ad: 'Zümrüt' },
            { id: 'fildisi', ad: 'Fildişi' },
          ]}
        />
      </div>
      <div data-onizle={tema} className="grid grid-cols-1 gap-10 border border-altin-soluk p-6 md:grid-cols-2 md:p-10" data-css-onizleme={tema}>
        <figure className="m-0 grid grid-cols-1 gap-5">
          <div ref={a} className="border border-[#D4AF37] bg-[#0B0B0B] px-6 py-10 text-center text-[#D4AF37] tracking-widest uppercase" data-css-literal="">
            <span lang="en" className="font-baslik text-[18px]">
              Literal
            </span>
          </div>
          <figcaption>
            <code className="font-mono text-[13px] break-words text-altin-yazi">border border-[#D4AF37] bg-[#0B0B0B] text-[#D4AF37] tracking-widest</code>
            <p className="mt-2 text-[16px] text-soluk">Tema ne olursa olsun aynı kalır.</p>
          </figcaption>
        </figure>
        <figure className="m-0 grid grid-cols-1 gap-5">
          <div ref={b} className="border border-altin-cizgi bg-zemin px-6 py-10 text-center text-altin-yazi tracking-widest uppercase" data-css-token="">
            <span lang="en" className="font-baslik text-[18px]">
              Token
            </span>
          </div>
          <figcaption>
            <code className="font-mono text-[13px] break-words text-altin-yazi">border border-altin-cizgi bg-zemin text-altin-yazi tracking-widest</code>
            <p className="mt-2 text-[16px] text-soluk">Temaya uyar: Fildişi'nde altın koyulaşır.</p>
          </figcaption>
        </figure>
      </div>
      <div className="mt-8 overflow-x-auto" role="region" aria-label="Hesaplanan değerler" tabIndex={0}>
        <div className="kart-duz p-5">
          <table className="tablo w-full min-w-[520px] border-collapse text-[16px]" data-css-tablo="">
            <caption>Hesaplanan değerler (literal)</caption>
            <tbody>
              {(
                [
                  ['border', 'border-width', 'border-width'],
                  ['border-[#D4AF37]', 'border-color', 'border-color'],
                  ['bg-[#0B0B0B]', 'background-color', 'background'],
                  ['text-[#D4AF37]', 'color', 'color'],
                  ['tracking-widest', 'letter-spacing', 'letter-spacing'],
                ] as const
              ).map(([sinif, ozellik, k]) => (
                <tr key={sinif}>
                  <th scope="row" className="font-mono text-[14px] font-semibold">
                    {sinif}
                  </th>
                  <td className="font-mono text-[14px] text-soluk">{ozellik}</td>
                  <td className="font-mono text-[14px]" data-css-hesap={k}>
                    {hesap[k] || '…'}
                  </td>
                </tr>
              ))}
              <tr>
                <th scope="row" className="font-mono text-[14px] font-semibold">
                  token bg / renk
                </th>
                <td className="font-mono text-[14px] text-soluk">bg-zemin / text-altin-yazi</td>
                <td className="font-mono text-[14px]" data-css-hesap="token">
                  {hesap['token-bg'] || '…'} · {hesap['token-color'] || '…'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Ayirac className="mt-12 max-w-[420px]" />
      <Kod label="Tailwind ile Art Deco kart" className="mt-8" sar={false}>{`<div class="border border-[#D4AF37] bg-[#0B0B0B] p-10 text-center
            text-[#D4AF37] tracking-widest uppercase">
  Aurelia Palas
</div>`}</Kod>
    </Section>
  )
}
