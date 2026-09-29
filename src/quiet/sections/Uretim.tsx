import { useEffect, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import { SAHNE_AD, Gorsel, type SahneAd } from '../components/Gorsel'
import { Ikon } from '../components/Ikon'
import { EditorialGrid, FullBleedImage, Kolon, QuietButton } from '../components/Quiet'
import { Anahtar, Aralik, Kod, Section, Secim } from '../components/ui'

/* ───────────────────────── Madde 14 · Bileşenler ───────────────────────── */

type Duzen = '12' | '7-5' | '5-7' | '4-4-4' | '3-9'
const DUZENLER: Record<Duzen, [number, number?][]> = {
  '12': [[12]],
  '7-5': [[7], [5]],
  '5-7': [[5], [7]],
  '4-4-4': [[4], [4], [4]],
  '3-9': [[3], [9]],
}
const ORANLAR = { '21 / 9': '21:9', '16 / 9': '16:9', '3 / 2': '3:2', '1 / 1': '1:1' } as const
type Oran = keyof typeof ORANLAR

export function Bilesenler() {
  const [duzen, setDuzen] = useState<Duzen>('7-5')
  const [kilavuz, setKilavuz] = useState(true)
  const [oran, setOran] = useState<Oran>('21 / 9')
  const [sahne, setSahne] = useState<SahneAd>('kemer')
  const kod = `<EditorialGrid>
${DUZENLER[duzen].map(([s], i) => `  <Kolon span={${s}}>${i === 0 ? '…görsel…' : '…metin…'}</Kolon>`).join('\n')}
</EditorialGrid>`
  return (
    <Section id="bilesenler" madde="Madde 14 · Bileşenler" title="Üç bileşen" lead="EditorialGrid: 12 kolonlu, sabit oranlı ızgara. QuietButton: ince çerçeveli, ağır olmayan düğme. FullBleedImage: kenardan kenara görsel, altyazısı altında. Hepsi gölgesiz, hepsi cömert boşluklu.">
      <h3 className="text-[clamp(26px,3vw,38px)]" lang="en">
        &lt;EditorialGrid&gt;
      </h3>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <Secim<Duzen> legend="Kolon düzeni" name="bl-duzen" value={duzen} onChange={setDuzen} options={(Object.keys(DUZENLER) as Duzen[]).map((d) => ({ id: d, ad: d }))} />
        <Anahtar label="12 kolon kılavuzu" checked={kilavuz} onChange={setKilavuz} />
      </div>
      <div className="relative mt-10" data-grid-oyun={duzen}>
        {kilavuz ? (
          <div className="pointer-events-none absolute inset-0 hidden grid-cols-12 gap-x-[var(--oluk)] md:grid" aria-hidden="true" data-kilavuz="">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="bg-kum/60" />
            ))}
          </div>
        ) : null}
        <EditorialGrid aralik={false} className="relative">
          {DUZENLER[duzen].map(([s], i) => (
            <Kolon key={`${duzen}${i}`} span={s} belir={false}>
              <div className={cx('grid min-h-[200px] place-items-center border border-metin bg-yuzey p-6 text-center', i === 0 ? '' : 'bg-zemin')} style={{ borderRadius: 'var(--r)' }} data-kolon={s}>
                <p className="kicker">{s} / 12</p>
              </div>
            </Kolon>
          ))}
        </EditorialGrid>
      </div>
      <Kod label="EditorialGrid kullanımı" className="mt-8" sar={false}>
        {kod}
      </Kod>

      <h3 className="mt-[var(--aralik)] text-[clamp(26px,3vw,38px)]" lang="en">
        &lt;QuietButton&gt;
      </h3>
      <div className="mt-10 grid grid-cols-1 gap-x-[var(--oluk)] gap-y-12 md:grid-cols-3" data-qbtn-varyant="">
        <div className="grid content-start justify-items-start gap-6">
          <p className="kicker">Dolu</p>
          <QuietButton varyant="dolu" boy="b">
            Rezervasyon
          </QuietButton>
          <QuietButton varyant="dolu">Standart</QuietButton>
          <QuietButton varyant="dolu" boy="k">
            Küçük
          </QuietButton>
        </div>
        <div className="grid content-start justify-items-start gap-6">
          <p className="kicker">İnce çerçeve</p>
          <QuietButton boy="b">Koleksiyon</QuietButton>
          <QuietButton>Standart</QuietButton>
          <QuietButton boy="k" disabled>
            Pasif
          </QuietButton>
        </div>
        <div className="grid content-start justify-items-start gap-6">
          <p className="kicker">Metin</p>
          <QuietButton varyant="metin" ikon={<Ikon ad="ok" boyut={18} />}>
            Projeleri gör
          </QuietButton>
          <QuietButton varyant="metin" ikon={<Ikon ad="indir" boyut={18} />}>
            Katalog
          </QuietButton>
        </div>
      </div>
      <p className="mt-6 max-w-[58ch] text-[15px] text-soluk">Hover 0,7 saniyede yavaşça dolgu değiştirir; metin düğmesinde çizgi 1 pikselden 2 piksele kalınlaşır. Sıçrama, kaldırma, gölge yok.</p>
      <Kod label="QuietButton kullanımı" className="mt-6" sar={false}>{`<QuietButton varyant="dolu" boy="b" onClick={git}>
  Rezervasyon
</QuietButton>`}</Kod>

      <h3 className="mt-[var(--aralik)] text-[clamp(26px,3vw,38px)]" lang="en">
        &lt;FullBleedImage&gt;
      </h3>
      <div className="mt-8 flex flex-wrap items-end gap-x-12 gap-y-6">
        <Secim<Oran> legend="Oran" name="bl-oran" value={oran} onChange={setOran} options={(Object.keys(ORANLAR) as Oran[]).map((o) => ({ id: o, ad: ORANLAR[o] }))} />
        <Secim<SahneAd> legend="Görsel" name="bl-sahne" value={sahne} onChange={setSahne} options={(['kemer', 'oda', 'cephe', 'mermer'] as SahneAd[]).map((s) => ({ id: s, ad: s }))} />
      </div>
      <div className="mt-10" data-fullbleed-oyun={oran}>
        <FullBleedImage tasma sahne={sahne} oran={oran} altyazi={SAHNE_AD[sahne]} no="01" />
      </div>
      <Kod label="FullBleedImage kullanımı" className="mt-8" sar={false}>{`<FullBleedImage sahne="${sahne}" oran="${oran}" altyazi="${SAHNE_AD[sahne]}" no="01" />`}</Kod>
    </Section>
  )
}

/* ───────────────────────── Madde 12 · 13 · Figma ───────────────────────── */

export function Figma() {
  const [bosluk, setBosluk] = useState(96)
  const [pad, setPad] = useState(96)
  const kutu = useRef<HTMLDivElement>(null)
  const [olculen, setOlculen] = useState<number[]>([])
  useEffect(() => {
    const el = kutu.current
    if (!el) return
    const ler = [...el.querySelectorAll<HTMLElement>('[data-al-cocuk]')]
    const gaps: number[] = []
    for (let i = 1; i < ler.length; i++) gaps.push(Math.round(ler[i].getBoundingClientRect().top - ler[i - 1].getBoundingClientRect().bottom))
    setOlculen(gaps)
  }, [bosluk, pad])
  return (
    <Section
      id="figma"
      madde={
        <>
          Madde 12 · 13 · <span lang="en">Figma</span> mimarisi
        </>
      }
      title="Devasa boşluk, sabit oran"
      lead="Figma'da Auto Layout padding ve aralık değerleri devasadır: elemanlar arası en az 96 piksel. Görseller sabit oranlı (aspect ratio kilitli) çerçevelerde durur, böylece metin–görsel dengesi hiç bozulmaz. Aşağıda boşluğu değiştirin; ölçülen mesafe canlı okunur."
    >
      <div className="grid grid-cols-1 gap-x-[var(--oluk)] gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div ref={kutu} className="border border-dashed border-toprak" style={{ paddingBlock: pad, paddingInline: `min(${pad}px, 12%)`, display: 'flex', flexDirection: 'column', gap: bosluk }} data-al="" data-bosluk={bosluk} data-pad={pad}>
            <div data-al-cocuk="" className="gorsel aspect-[3/2]">
              <Gorsel sahne="kumas" />
            </div>
            <div data-al-cocuk="">
              <p className="kicker">Auto Layout · dikey</p>
              <p className="mt-3 font-serif text-[clamp(28px,3vw,40px)] leading-tight">Elemanlar arası {bosluk}px</p>
            </div>
            <div data-al-cocuk="">
              <QuietButton>Devamı</QuietButton>
            </div>
          </div>
        </div>
        <div className="grid min-w-0 content-start gap-7 lg:col-span-4 lg:col-start-9">
          <Aralik label="Elemanlar arası" value={bosluk} min={16} max={192} step={8} onChange={setBosluk} format={(v) => `${v}px`} />
          <p className="-mt-3 font-mono text-[12px] text-soluk">Spacing/EditorialGenerous</p>
          <Aralik label="Kenar boşluğu" value={pad} min={16} max={192} step={8} onChange={setPad} format={(v) => `${v}px`} />
          <div className="border-t border-[var(--cizgi)] pt-5" aria-live="polite">
            <p className="kicker">Ölçülen mesafe</p>
            <p className="rakam mt-1 text-[30px]" data-olculen={olculen.join(',')}>
              {olculen.length ? olculen.map((g) => `${g}px`).join(' · ') : '—'}
            </p>
            <p className="mt-2 text-[14px] text-soluk">{olculen.length && olculen.every((g) => g === bosluk) ? 'Tam eşit: Auto Layout kuralı korunuyor.' : ''}</p>
          </div>
        </div>
      </div>

      <div className="mt-[var(--aralik)]">
        <p className="kicker">Sabit oranlı çerçeveler</p>
        <ul className="m-0 mt-6 grid list-none grid-cols-2 items-end gap-x-[var(--oluk)] gap-y-8 p-0 md:grid-cols-4" data-oranlar="">
          {(
            [
              ['21 / 9', 'Panorama'],
              ['3 / 2', 'Yatay'],
              ['4 / 5', 'Portre'],
              ['1 / 1', 'Kare'],
            ] as const
          ).map(([o, ad]) => (
            <li key={o}>
              <div className="gorsel" style={{ aspectRatio: o }} data-oran={o}>
                <Gorsel sahne="mermer" />
              </div>
              <p className="mt-3 text-[14px] text-soluk">
                {ad} · {o.replace(' / ', ':')}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[var(--aralik)] overflow-x-auto" role="region" aria-label="Figma katman ağacı" tabIndex={0}>
        <table className="tablo w-full min-w-[620px] border-collapse text-[15px]" data-figma-agac="">
          <caption>Katman ağacı</caption>
          <thead>
            <tr>
              <th scope="col" className="etiket">
                Katman
              </th>
              <th scope="col" className="etiket">
                Auto Layout
              </th>
              <th scope="col" className="etiket">
                Aralık / dolgu
              </th>
              <th scope="col" className="etiket">
                Oran
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Section', 'Dikey', 'aralık 96 · dolgu 160 / 48', '—'],
              ['Section / Başlık', 'Otomatik yükseklik', '—', '—'],
              ['Grid', 'Yatay sarmalı, 12 kolon', 'oluk 32', '—'],
              ['Grid / Görsel', 'Doldur (Fill)', '—', 'kilitli 3:2'],
              ['Grid / Metin', 'Sabit genişlik 38ch', 'aralık 24', '—'],
            ].map(([a, b, c, d]) => (
              <tr key={a}>
                <th scope="row" className="font-mono text-[13px] font-medium">
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

      <ul className="m-0 mt-[var(--aralik)] grid list-none grid-cols-1 gap-x-[var(--oluk)] gap-y-8 p-0 md:grid-cols-3" data-figma-token="">
        {[
          ['Spacing/EditorialGenerous', '96px', 'Elemanlar arası, masaüstü'],
          ['Color/StoneBackground', '#F4F1EA', 'Sayfa zemini'],
          ['Color/CharcoalText', '#222222', 'Metin'],
        ].map(([a, b, c]) => (
          <li key={a} className="border-t border-[var(--cizgi)] pt-6">
            {a.startsWith('Color') ? <span className="mb-4 block h-10 w-full border border-[var(--cizgi)]" style={{ background: b, borderRadius: 'var(--r)' }} aria-hidden="true" /> : <span className="mb-4 block h-10 border-l border-r border-metin" style={{ width: 96 }} aria-hidden="true" />}
            <p className="font-mono text-[13px] font-medium break-all">{a}</p>
            <p className="rakam mt-1 text-[26px]">{b}</p>
            <p className="text-[14px] text-soluk">{c}</p>
          </li>
        ))}
      </ul>
      <Kod label="Figma token dosyası" className="mt-10" sar={false}>{`{
  "Spacing": { "EditorialGenerous": { "$type": "dimension", "$value": "96px" } },
  "Color": {
    "StoneBackground": { "$type": "color", "$value": "#F4F1EA" },
    "CharcoalText":    { "$type": "color", "$value": "#222222" }
  }
}`}</Kod>
    </Section>
  )
}

/* ───────────────────────── Madde 15 · CSS / Tailwind ───────────────────────── */

type Onizle = 'tas' | 'fildisi' | 'komur'

export function Css() {
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)
  const [tema, setTema] = useState<Onizle>('komur')
  const [hesap, setHesap] = useState<Record<string, string>>({})
  useEffect(() => {
    const oku = (el: HTMLElement | null, k: string) => (el ? getComputedStyle(el).getPropertyValue(k) : '')
    setHesap({
      background: oku(a.current, 'background-color'),
      color: oku(a.current, 'color'),
      font: oku(a.current, 'font-family'),
      tracking: oku(a.current, 'letter-spacing'),
      padding: oku(a.current, 'padding-top'),
      'token-bg': oku(b.current, 'background-color'),
      'token-color': oku(b.current, 'color'),
    })
  }, [tema])
  return (
    <Section
      id="css"
      madde={
        <>
          Madde 15 · CSS / <span lang="en">Tailwind</span>
        </>
      }
      title="Dört sınıf yeter"
      lead="Tanım tek satır: bg-[#F4F1EA] text-[#222222] font-serif tracking-wide py-24. Sınıflar sayfada aynen çalışır, hesaplanan değerler yanda okunur. Temaya uyum gerekiyorsa aynı satır token sınıflarıyla yazılır."
    >
      <div className="mb-10">
        <Secim<Onizle>
          legend="Sayfa teması (önizleme)"
          name="css-tema"
          value={tema}
          onChange={setTema}
          options={[
            { id: 'tas', ad: 'Taş' },
            { id: 'fildisi', ad: 'Fildişi' },
            { id: 'komur', ad: 'Kömür' },
          ]}
        />
      </div>
      <div data-onizle={tema} className="grid grid-cols-1 gap-x-[var(--oluk)] gap-y-10 border border-[var(--cizgi)] p-6 md:grid-cols-2 md:p-10" data-css-onizleme={tema}>
        <figure className="m-0 grid grid-cols-1 gap-5">
          <div ref={a} className="bg-[#F4F1EA] py-24 text-center font-serif text-[28px] tracking-wide text-[#222222]" data-css-literal="">
            Literal
          </div>
          <figcaption>
            <code className="font-mono text-[12.5px] break-words">bg-[#F4F1EA] text-[#222222] font-serif tracking-wide py-24</code>
            <p className="mt-2 text-[15px] text-soluk">Tema ne olursa olsun aynı kalır.</p>
          </figcaption>
        </figure>
        <figure className="m-0 grid grid-cols-1 gap-5">
          <div ref={b} className="bg-zemin py-24 text-center font-serif text-[28px] tracking-wide text-metin" data-css-token="">
            Token
          </div>
          <figcaption>
            <code className="font-mono text-[12.5px] break-words">bg-zemin text-metin font-serif tracking-wide py-24</code>
            <p className="mt-2 text-[15px] text-soluk">Temaya uyar: Kömür'de zemin kömür, yazı fildişi.</p>
          </figcaption>
        </figure>
      </div>
      <div className="mt-10 overflow-x-auto" role="region" aria-label="Hesaplanan değerler" tabIndex={0}>
        <table className="tablo w-full min-w-[520px] border-collapse text-[15px]" data-css-tablo="">
          <caption>Hesaplanan değerler (literal)</caption>
          <tbody>
            {(
              [
                ['bg-[#F4F1EA]', 'background-color', 'background'],
                ['text-[#222222]', 'color', 'color'],
                ['font-serif', 'font-family', 'font'],
                ['tracking-wide', 'letter-spacing', 'tracking'],
                ['py-24', 'padding-top', 'padding'],
              ] as const
            ).map(([sinif, ozellik, k]) => (
              <tr key={sinif}>
                <th scope="row" className="font-mono text-[13px] font-medium">
                  {sinif}
                </th>
                <td className="font-mono text-[13px] text-soluk">{ozellik}</td>
                <td className="font-mono text-[13px] [overflow-wrap:anywhere]" data-css-hesap={k}>
                  {hesap[k] || '…'}
                </td>
              </tr>
            ))}
            <tr>
              <th scope="row" className="font-mono text-[13px] font-medium">
                token bg / renk
              </th>
              <td className="font-mono text-[13px] text-soluk">bg-zemin / text-metin</td>
              <td className="font-mono text-[13px]" data-css-hesap="token">
                {hesap['token-bg'] || '…'} · {hesap['token-color'] || '…'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Kod label="Tailwind ile editoryal bölüm" className="mt-10" sar={false}>{`<section class="bg-[#F4F1EA] text-[#222222] font-serif tracking-wide py-24">
  <h2 class="text-6xl font-light">Az, ama doğru.</h2>
</section>`}</Kod>
    </Section>
  )
}
