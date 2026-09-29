import { useEffect, useMemo, useRef, useState } from 'react'
import { Tooltip } from 'radix-ui'
import { tutamaklar, yumusak, type Nk } from '../lib/organik'
import type { SimgeAd } from '../lib/simge'
import { useBotanical } from '../lib/store'
import { BotanicalCard, EcoButton, LeafDivider, MASKE_AD, type MaskeAd } from '../components/Botanical'
import { Gorsel, SAHNE_AD, type SahneAd } from '../components/Gorsel'
import { Ikon } from '../components/Ikon'
import { Adet, Anahtar, Aralik, Kod, Secim, Section } from '../components/ui'

async function kopyala(s: string) {
  try {
    await navigator.clipboard.writeText(s)
    return true
  } catch {
    return false
  }
}
const SAHNELER: SahneAd[] = ['zeytin', 'bal', 'sabun', 'ot', 'yag', 'sebze', 'fidan', 'vadi', 'kamp']
type KartTon = 'yuzey' | 'kil' | 'zeytin' | 'toprak' | 'orman'

/* ───────────────────────── Madde 14 · Bileşenler ───────────────────────── */

export function Bilesenler() {
  const [maske, setMaske] = useState<MaskeAd>('yaprak')
  const [ton, setTon] = useState<KartTon>('toprak')
  const [katman, setKatman] = useState<'0' | '1' | '2'>('1')
  const [dal, setDal] = useState(true)
  const [sahne, setSahne] = useState<SahneAd>('zeytin')
  const [anahtar, setAnahtar] = useState(true)
  const [secim, setSecim] = useState('a')
  const [adet, setAdet] = useState(2)
  const [ayrac, setAyrac] = useState<'dal' | 'su' | 'tohum'>('dal')
  return (
    <Section
      id="bilesenler"
      ikon="yaprak"
      madde="Madde 11 · 14 · Bileşenler"
      title={
        <>
          Kart, düğme, <span className="vurgu">ayraç</span>
        </>
      }
      lead="Üç temel parça: yaprak maskeli BotanicalCard, taş biçimli EcoButton ve rüzgârda sallanan LeafDivider. Hepsi ton sür ton renk katmanları ve çok yumuşak ortam gölgeleriyle çalışır."
    >
      <h3 className="font-mono text-[clamp(20px,2.4vw,26px)] font-semibold" lang="en">
        &lt;BotanicalCard&gt;
      </h3>
      <div className="mt-6 grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5" data-bilesen="kart">
          <BotanicalCard sahne={sahne} maske={maske} ton={ton} katman={+katman as 0 | 1 | 2} dal={dal} tohum={3} kicker="Yeni hasat" baslik="Kekik ve zeytin" oran="4 / 3.4">
            <p className="text-[17px] text-soluk">Metin her zaman kartın düz yüzeyinde. Maske, ton ve katman ayarlanır.</p>
            <div className="mt-4">
              <EcoButton ton="zeytin" boy="k" ikon={<Ikon ad="ok" boyut={20} />}>
                Ayrıntı
              </EcoButton>
            </div>
          </BotanicalCard>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5 lg:col-span-7">
          <Secim<MaskeAd> legend="Maske" name="bl-maske" value={maske} onChange={setMaske} options={(Object.keys(MASKE_AD) as MaskeAd[]).map((k) => ({ id: k, ad: MASKE_AD[k] }))} />
          <Secim<KartTon>
            legend="Ton"
            name="bl-ton"
            value={ton}
            onChange={setTon}
            options={[
              { id: 'yuzey', ad: 'Yüzey' },
              { id: 'toprak', ad: 'Toprak' },
              { id: 'zeytin', ad: 'Zeytin' },
              { id: 'kil', ad: 'Kil' },
              { id: 'orman', ad: 'Orman' },
            ]}
          />
          <Secim<'0' | '1' | '2'>
            legend="Arka katman"
            name="bl-katman"
            value={katman}
            onChange={setKatman}
            options={[
              { id: '0', ad: '0' },
              { id: '1', ad: '1' },
              { id: '2', ad: '2' },
            ]}
          />
          <Secim<SahneAd> legend="Görsel" name="bl-sahne" value={sahne} onChange={setSahne} options={SAHNELER.slice(0, 6).map((s) => ({ id: s, ad: SAHNE_AD[s] }))} />
          <Anahtar label="Rüzgârda sallanan dal" checked={dal} onChange={setDal} />
          <Kod label="BotanicalCard kullanımı" sar={false}>{`<BotanicalCard sahne="${sahne}" maske="${maske}"\n  ton="${ton}" katman={${katman}}${dal ? ' dal' : ''}\n  kicker="Yeni hasat" baslik="Kekik ve zeytin">\n  …düz yüzeyde metin…\n</BotanicalCard>`}</Kod>
        </div>
      </div>

      <h3 className="mt-[var(--aralik)] font-mono text-[clamp(20px,2.4vw,26px)] font-semibold" lang="en">
        &lt;EcoButton&gt;
      </h3>
      <div className="yuzey mt-6 p-6 sm:p-9">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3" data-ebtn-ton="">
          <div className="grid grid-cols-1 content-start justify-items-start gap-5">
            <p className="kicker">Orman · varsayılan</p>
            <EcoButton ton="orman" boy="b">
              Rezervasyon
            </EcoButton>
            <EcoButton ton="orman">Standart</EcoButton>
            <EcoButton ton="orman" boy="k">
              Küçük
            </EcoButton>
          </div>
          <div className="grid grid-cols-1 content-start justify-items-start gap-5">
            <p className="kicker">Zeytin · Kil</p>
            <EcoButton ton="zeytin" boy="b">
              Sepete ekle
            </EcoButton>
            <EcoButton ton="kil" boy="b" ikon={<Ikon ad="ok" boyut={22} />}>
              Keşfet
            </EcoButton>
            <EcoButton ton="zeytin" boy="k" disabled>
              Pasif
            </EcoButton>
          </div>
          <div className="grid grid-cols-1 content-start justify-items-start gap-5">
            <p className="kicker">Hayalet · Metin</p>
            <EcoButton ton="hayalet" boy="b">
              Koleksiyon
            </EcoButton>
            <EcoButton ton="hayalet">Standart</EcoButton>
            <EcoButton ton="metin" ikon={<Ikon ad="ok" boyut={20} />}>
              Devamını oku
            </EcoButton>
          </div>
        </div>
        <p className="mt-6 max-w-[66ch] text-[16px] text-soluk">Terracotta düğme yalnız büyük ve kalın yazıyla (19,5 px, 700; büyük metin sınırı 3:1). Hover’da renk 0,8 sn’de, form 1,2 sn’de başka bir taşa dönüşür; ölçek ve zıplama yok.</p>
      </div>
      <Kod label="EcoButton kullanımı" className="mt-6" sar={false}>{`<EcoButton ton="kil" boy="b"\n  ikon={<Ikon ad="ok" />}>\n  Pazara göz at\n</EcoButton>`}</Kod>

      <h3 className="mt-[var(--aralik)] font-mono text-[clamp(20px,2.4vw,26px)] font-semibold" lang="en">
        &lt;LeafDivider&gt;
      </h3>
      <div className="yuzey mt-6 p-6 sm:p-9">
        <Secim<'dal' | 'su' | 'tohum'>
          legend="Tür"
          name="bl-ayrac"
          value={ayrac}
          onChange={setAyrac}
          options={[
            { id: 'dal', ad: 'Dal' },
            { id: 'su', ad: 'Su' },
            { id: 'tohum', ad: 'Tohum' },
          ]}
        />
        <div className="mt-8" data-bilesen="ayrac">
          <LeafDivider tur={ayrac} />
        </div>
      </div>
      <Kod label="LeafDivider kullanımı" className="mt-6" sar={false}>{`<LeafDivider tur="${ayrac}" />`}</Kod>

      <h3 className="mt-[var(--aralik)] text-[clamp(24px,2.4vw,30px)]">Kontroller</h3>
      <div className="yuzey mt-6 p-6 sm:p-9">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2" data-kontroller="">
          <Anahtar label="Bülten" hint="Taş tutamaklı anahtar" checked={anahtar} onChange={setAnahtar} />
          <Secim<string>
            legend="Seçim"
            name="bl-secim"
            value={secim}
            onChange={setSecim}
            options={[
              { id: 'a', ad: 'Zeytin' },
              { id: 'b', ad: 'Bal' },
              { id: 'c', ad: 'Kekik' },
            ]}
          />
          <div>
            <p className="etiket mb-2">Adet</p>
            <Adet value={adet} onChange={setAdet} label="Örnek adet" />
          </div>
          <div className="flex items-center gap-3">
            {(['yaprak', 'kalp', 'damla', 'ara'] as SimgeAd[]).map((s) => (
              <Tooltip.Root key={s}>
                <Tooltip.Trigger asChild>
                  <button type="button" className="grid size-12 place-items-center border border-kontrol bg-yuzey2 text-metin hover:bg-yuzey3" style={{ borderRadius: '1.2rem 0.6rem 1.3rem 0.7rem' }} aria-label={`İkon: ${s}`}>
                    <Ikon ad={s} boyut={24} />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content sideOffset={8} className="yuzey z-[96] px-3 py-1.5 text-[15.5px]">
                    {s}
                    <Tooltip.Arrow className="fill-[var(--yuzey)]" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 12 · 13 · Figma ───────────────────────── */

/** Vector Network düğümleri (0–1 uzayı) */
const AG: Record<string, Nk[]> = {
  yaprak: [
    [0.06, 0.94],
    [0.14, 0.58],
    [0.34, 0.24],
    [0.62, 0.07],
    [0.97, 0.04],
    [0.86, 0.5],
    [0.6, 0.82],
    [0.32, 0.96],
  ],
  damla: [
    [0.5, 0.03],
    [0.74, 0.33],
    [0.92, 0.6],
    [0.8, 0.9],
    [0.5, 0.97],
    [0.2, 0.9],
    [0.08, 0.6],
    [0.26, 0.33],
  ],
  taş: [
    [0.46, 0.04],
    [0.8, 0.1],
    [0.97, 0.46],
    [0.84, 0.86],
    [0.48, 0.97],
    [0.14, 0.86],
    [0.03, 0.5],
    [0.16, 0.14],
  ],
}
const FIGMA_TOKENLER = [
  ['Color/TerracottaPrimary', '#C86D51', 'color', 'Vurgu dolgusu, büyük düğme yazısı'],
  ['Color/OliveSurface', '#556B2F', 'color', 'Seçili yüzey, kaydırıcı dolgusu'],
  ['Texture/LinenBase', 'fractalNoise .9 × .04 (iki katman)', 'texture', 'Sayfa zemini dokusu, %12'],
  ['Radius/Pebble', '58% 42% 63% 37% / 46% 55% 45% 54%', 'shape', 'Rozet ve ikon zemini'],
  ['Spacing/Comfort', '1,5 × aralık', 'number', 'Auto Layout iç boşluk oranı'],
] as const

export function Figma() {
  const [sek, setSek] = useState<'yaprak' | 'damla' | 'taş'>('yaprak')
  const [k, setK] = useState(1)
  const [ag, setAg] = useState(true)
  const [kopya, setKopya] = useState('')
  const dugumler = useMemo(() => tutamaklar(AG[sek], k), [sek, k])
  const yol = useMemo(() => yumusak(AG[sek], true, k, 4), [sek, k])
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" width="240" height="240">\n  <path id="LeafMask" d="${yol.length > 300 ? yol.slice(0, 296) + '…' : yol}" fill="#000"/>\n</svg>`
  const kop = async () => {
    setKopya((await kopyala(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><path id="LeafMask" d="${yol}" fill="#000"/></svg>`)) ? 'Kopyalandı' : 'Kopyalanamadı: metni seçip kopyalayın')
    window.setTimeout(() => setKopya(''), 2400)
  }
  // Auto Layout
  const [bosluk, setBosluk] = useState(16)
  const [oranC, setOranC] = useState(1.5)
  const pad = Math.round(bosluk * oranC)
  const kutu = useRef<HTMLDivElement>(null)
  const [olculen, setOlculen] = useState<number[]>([])
  useEffect(() => {
    const el = kutu.current
    if (!el) return
    const ler = [...el.querySelectorAll<HTMLElement>('[data-al-cocuk]')]
    const gaps: number[] = []
    for (let i = 1; i < ler.length; i++) gaps.push(Math.round(ler[i].getBoundingClientRect().top - ler[i - 1].getBoundingClientRect().bottom))
    setOlculen(gaps)
  }, [bosluk, oranC])
  return (
    <Section
      id="figma"
      ikon="dag"
      madde={
        <>
          <span lang="en">Figma</span> mimarisi · Madde 12 · 13
        </>
      }
      title={
        <>
          Vector Network, <span className="vurgu">rahat</span> boşluk
        </>
      }
      lead="Organik formlar Figma’da Vector Network ile çizilir: düğümler ve Bezier tutamakları. Aynı ağ SVG olarak dışa aktarılıp kartın maskesi olur. Auto Layout bileşenlerinde iç boşluk aralığın 1,5 katıdır; cömert ve rahat."
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="bt-fg-maske" clipPathUnits="objectBoundingBox">
            <path d={yol} />
          </clipPath>
        </defs>
      </svg>
      <div className="mb-6 flex flex-wrap items-end gap-x-10 gap-y-4">
        <Secim<'yaprak' | 'damla' | 'taş'>
          legend="Şekil"
          name="fg-sekil"
          value={sek}
          onChange={setSek}
          options={[
            { id: 'yaprak', ad: 'Yaprak' },
            { id: 'damla', ad: 'Damla' },
            { id: 'taş', ad: 'Taş' },
          ]}
        />
        <Anahtar label="Ağı göster" checked={ag} onChange={setAg} />
        <div className="w-full max-w-[260px]">
          <Aralik label="Tutamak gerginliği" value={k} min={0.4} max={1.6} step={0.1} onChange={setK} format={(v) => v.toFixed(1).replace('.', ',')} />
        </div>
      </div>
      <ol className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 md:grid-cols-3" data-figma-adimlar="">
        <li className="min-w-0">
          <p className="kicker">1 · Vector Network</p>
          <div className="yuzey mt-3 p-4">
            <svg viewBox="-0.06 -0.06 1.12 1.12" className="mx-auto h-auto w-full max-w-[260px]" role="img" aria-label="Vector Network: düğümler ve tutamaklar" data-figma-vektor="">
              <path d={yol} fill="var(--zeytin-ton)" stroke="var(--zeytin)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
              {ag
                ? dugumler.map((d, i) => (
                    <g key={i} data-dugum="">
                      <path d={`M${d.giris[0]} ${d.giris[1]}L${d.cikis[0]} ${d.cikis[1]}`} stroke="var(--kil)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                      <circle cx={d.giris[0]} cy={d.giris[1]} r="0.012" fill="var(--yuzey)" stroke="var(--kil)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                      <circle cx={d.cikis[0]} cy={d.cikis[1]} r="0.012" fill="var(--yuzey)" stroke="var(--kil)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                      <rect x={d.nokta[0] - 0.014} y={d.nokta[1] - 0.014} width="0.028" height="0.028" rx="0.008" fill="var(--kil)" />
                    </g>
                  ))
                : null}
            </svg>
          </div>
        </li>
        <li className="min-w-0">
          <p className="kicker">2 · İçerik</p>
          <div className="yuzey mt-3 p-4">
            <div className="mx-auto aspect-square w-full max-w-[260px] overflow-hidden" style={{ borderRadius: '1rem' }}>
              <Gorsel sahne="zeytin" tohum={2} />
            </div>
          </div>
        </li>
        <li className="min-w-0">
          <p className="kicker">3 · Bileşen (maske atanmış)</p>
          <div className="yuzey mt-3 p-4">
            <div className="mx-auto aspect-square w-full max-w-[260px]" data-figma-bilesen="" style={{ clipPath: 'url(#bt-fg-maske)', WebkitClipPath: 'url(#bt-fg-maske)' }}>
              <Gorsel sahne="zeytin" tohum={2} />
            </div>
          </div>
        </li>
      </ol>
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <Kod label="Maske SVG kaynağı" sar={false}>
            {svg}
          </Kod>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <EcoButton boy="k" ton="hayalet" onClick={kop} ikon={<Ikon ad="tik" boyut={18} />} data-figma-kopyala="">
              SVG’yi kopyala
            </EcoButton>
            <span className="text-[16px] text-soluk" role="status" aria-live="polite">
              {kopya}
            </span>
          </div>
        </div>
        <div className="yuzey min-w-0 p-5 sm:p-6 lg:col-span-5">
          <p className="kicker">Katman ağacı</p>
          <ul className="m-0 mt-3 list-none p-0 font-mono text-[13.5px] leading-[1.9]" data-figma-agac="">
            <li>▾ Component/BotanicalCard</li>
            <li className="pl-5">▾ Mask/LeafNetwork (Vector Network)</li>
            <li className="pl-10">Image · Fill</li>
            <li className="pl-5">Frame/Content · Auto Layout, dikey</li>
            <li className="pl-5">Ornament/Sprig (SVG)</li>
          </ul>
        </div>
      </div>

      <h3 className="baslik mt-[var(--aralik)] text-[clamp(24px,2.6vw,32px)]">Auto Layout: cömert boşluk</h3>
      <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <div ref={kutu} className="bg-yuzey" style={{ padding: pad, borderRadius: 'var(--r-kart)', border: '1.5px dashed var(--kontrol)', display: 'flex', flexDirection: 'column', gap: bosluk }} data-al="" data-bosluk={bosluk} data-pad={pad}>
            <div data-al-cocuk="" className="overflow-hidden" style={{ borderRadius: 'var(--r-yumusak)' }}>
              <div className="aspect-[16/7] w-full">
                <Gorsel sahne="vadi" tohum={4} />
              </div>
            </div>
            <div data-al-cocuk="">
              <p className="kicker">Auto Layout · dikey</p>
              <p className="baslik mt-1 text-[clamp(24px,2.6vw,32px)]">
                Aralık {bosluk}px, dolgu {pad}px
              </p>
            </div>
            <div data-al-cocuk="">
              <EcoButton boy="k" ton="zeytin">
                Devamı
              </EcoButton>
            </div>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5 lg:col-span-5">
          <div className="yuzey grid grid-cols-1 gap-4 p-6">
            <Aralik label="Elemanlar arası" value={bosluk} min={8} max={40} step={4} onChange={setBosluk} format={(v) => `${v}px`} />
            <Aralik label="Dolgu oranı" value={oranC} min={0.5} max={2.5} step={0.25} onChange={setOranC} format={(v) => `${v.toFixed(2).replace('.', ',')}×`} />
            <p className="font-mono text-[12.5px] text-soluk">Spacing/Comfort = 1,5 × aralık</p>
          </div>
          <div className="yuzey p-5" aria-live="polite">
            <p className="kicker">Ölçülen mesafe</p>
            <p className="rakam mt-1 text-[28px]" data-olculen={olculen.join(',')}>
              {olculen.length ? olculen.map((g) => `${g}px`).join(' · ') : '—'}
            </p>
            <p className="mt-1 text-[15.5px] text-soluk">{olculen.length && olculen.every((g) => g === bosluk) ? 'Tam eşit: Auto Layout kuralı korunuyor.' : ''}</p>
          </div>
        </div>
      </div>

      <div className="yuzey mt-[var(--aralik)] overflow-x-auto p-6 sm:p-8" role="region" aria-label="Figma tokenları" tabIndex={0}>
        <table className="tablo w-full min-w-[620px] border-collapse text-[16.5px]" data-figma-token="">
          <caption>Değişkenler (Figma Variables)</caption>
          <thead>
            <tr>
              {['Ad', 'Değer', 'Tür', 'Kullanım'].map((b) => (
                <th key={b} scope="col" className="etiket">
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIGMA_TOKENLER.map(([a, b, c, d]) => (
              <tr key={a}>
                <th scope="row" className="font-mono text-[13.5px] font-medium">
                  {a}
                </th>
                <td>
                  {c === 'color' ? <span className="mr-2 inline-block size-4 align-middle" style={{ background: b, borderRadius: '0 100% 0 100%' }} aria-hidden="true" /> : null}
                  {b}
                </td>
                <td className="text-soluk">{c}</td>
                <td>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Kod label="Figma token dosyası" className="mt-8" sar={false}>{`{
  "Color": {
    "TerracottaPrimary": { "$type": "color", "$value": "#C86D51" },
    "OliveSurface":      { "$type": "color", "$value": "#556B2F" }
  },
  "Texture": { "LinenBase": { "$type": "string", "$value": "fractalNoise .9 .04 + .04 .9" } }
}`}</Kod>
    </Section>
  )
}

/* ───────────────────────── Madde 15 · CSS / Tailwind ───────────────────────── */

type Onizle = 'keten' | 'toprak' | 'orman'

export function Css() {
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)
  const [tema, setTema] = useState<Onizle>('keten')
  const [hesap, setHesap] = useState<Record<string, string>>({})
  const { tema: sayfaTema } = useBotanical()
  useEffect(() => {
    const oku = (el: HTMLElement | null, k: string) => (el ? getComputedStyle(el).getPropertyValue(k) : '')
    setHesap({
      background: oku(a.current, 'background-color'),
      color: oku(a.current, 'color'),
      radius: oku(a.current, 'border-top-left-radius'),
      border: oku(a.current, 'border-top-color'),
      shadow: oku(a.current, 'box-shadow'),
      'token-bg': oku(b.current, 'background-color'),
      'token-color': oku(b.current, 'color'),
      'token-shadow': oku(b.current, 'box-shadow'),
    })
  }, [tema, sayfaTema])
  return (
    <Section
      id="css"
      ikon="toprak"
      madde={
        <>
          Madde 15 · CSS / <span lang="en">Tailwind</span>
        </>
      }
      title={
        <>
          Beş sınıf, <span className="vurgu">bir yüzey</span>
        </>
      }
      lead="Tanım tek satır: bg-[#D2B48C] text-[#2F4F4F] rounded-2xl border border-[#556B2F]/20 shadow-sm. Sınıflar sayfada aynen çalışır; shadow-sm bu temada çok yumuşak bir ortam gölgesine bağlıdır. Hesaplanan değerler yanda okunur."
    >
      <div className="mb-8">
        <Secim<Onizle>
          legend="Sayfa teması (önizleme)"
          name="css-tema"
          value={tema}
          onChange={setTema}
          options={[
            { id: 'keten', ad: 'Keten' },
            { id: 'toprak', ad: 'Toprak' },
            { id: 'orman', ad: 'Orman' },
          ]}
        />
      </div>
      <div data-onizle={tema} className="grid grid-cols-1 gap-x-8 gap-y-10 p-6 md:grid-cols-2 md:p-10" style={{ borderRadius: 'var(--r-kart)' }} data-css-onizleme={tema}>
        <figure className="m-0 grid grid-cols-1 gap-5">
          <div ref={a} className="rounded-2xl border border-[#556B2F]/20 bg-[#D2B48C] p-8 text-[#2F4F4F] shadow-sm" data-css-literal="">
            <p className="baslik text-[26px]">Literal</p>
            <p className="mt-1 text-[17px]">Toprak Beji yüzey, orman yeşili yazı.</p>
          </div>
          <figcaption>
            <code className="font-mono text-[12.5px] break-words">bg-[#D2B48C] text-[#2F4F4F] rounded-2xl border border-[#556B2F]/20 shadow-sm</code>
            <p className="mt-2 text-[15.5px] text-soluk">Tema ne olursa olsun aynı kalır; orman yeşili bej üstünde 4,5:1 verir (sınırda).</p>
          </figcaption>
        </figure>
        <figure className="m-0 grid grid-cols-1 gap-5">
          <div ref={b} className="rounded-2xl border border-zeytin/20 bg-toprak p-8 text-derin shadow-sm" data-css-token="">
            <p className="baslik text-[26px]">Token</p>
            <p className="mt-1 text-[17px]">Aynı yüzey, derin kömür-orman yazı.</p>
          </div>
          <figcaption>
            <code className="font-mono text-[12.5px] break-words">bg-toprak text-derin rounded-2xl border border-zeytin/20 shadow-sm</code>
            <p className="mt-2 text-[15.5px] text-soluk">Temaya uyar; bej üstünde 6,8:1 (önerilen).</p>
          </figcaption>
        </figure>
      </div>
      <div className="yuzey mt-8 overflow-x-auto p-6 sm:p-8" role="region" aria-label="Hesaplanan değerler" tabIndex={0}>
        <table className="tablo w-full min-w-[560px] border-collapse text-[16.5px]" data-css-tablo="">
          <caption>Hesaplanan değerler (literal)</caption>
          <tbody>
            {(
              [
                ['bg-[#D2B48C]', 'background-color', 'background'],
                ['text-[#2F4F4F]', 'color', 'color'],
                ['rounded-2xl', 'border-radius', 'radius'],
                ['border-[#556B2F]/20', 'border-color', 'border'],
                ['shadow-sm', 'box-shadow', 'shadow'],
              ] as const
            ).map(([sinif, ozellik, k]) => (
              <tr key={sinif}>
                <th scope="row" className="font-mono text-[13.5px] font-medium">
                  {sinif}
                </th>
                <td className="font-mono text-[13px] text-soluk">{ozellik}</td>
                <td className="font-mono text-[13px] [overflow-wrap:anywhere]" data-css-hesap={k}>
                  {hesap[k] || '…'}
                </td>
              </tr>
            ))}
            <tr>
              <th scope="row" className="font-mono text-[13.5px] font-medium">
                token bg / renk
              </th>
              <td className="font-mono text-[13px] text-soluk">bg-toprak / text-derin</td>
              <td className="font-mono text-[13px]" data-css-hesap="token">
                {hesap['token-bg'] || '…'} · {hesap['token-color'] || '…'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Kod label="Tailwind ile ürün yüzeyi" className="mt-8" sar={false}>{`<article class="bg-[#D2B48C] text-[#2F4F4F] rounded-2xl
  border border-[#556B2F]/20 shadow-sm p-8">
  <h3 class="font-serif text-2xl">Soğuk sıkım</h3>
</article>`}</Kod>
    </Section>
  )
}
