import { useEffect, useMemo, useRef, useState } from 'react'
import { Tooltip } from 'radix-ui'
import { cx } from '../../shared/cx'
import { kontur, konturYol, yumusak, type SusSeviye } from '../lib/bitki'
import { useNouveau } from '../lib/store'
import { Gorsel, SAHNE_AD, type SahneAd } from '../components/Gorsel'
import { Ikon } from '../components/Ikon'
import { BotanikKart, DalgaGorsel, NouveauButton, SadePanel } from '../components/Nouveau'
import { Anahtar, Aralik, Kod, Section, Secim } from '../components/ui'

const SAHNELER: SahneAd[] = ['nilufer', 'sarmasik', 'zambak', 'sac', 'pavus']
const SUSLAR: { id: SusSeviye; ad: string }[] = [
  { id: 'tam', ad: 'Tam' },
  { id: 'sade', ad: 'Sade' },
  { id: 'yalin', ad: 'Yalın' },
]

async function kopyala(s: string) {
  try {
    await navigator.clipboard.writeText(s)
    return true
  } catch {
    return false
  }
}

/* ───────────────────────── Madde 14 · Bileşenler ───────────────────────── */

export function Bilesenler() {
  const [sus, setSus] = useState<SusSeviye>('tam')
  const [katman, setKatman] = useState(1)
  const [tohum, setTohum] = useState(3)
  const [sahne, setSahne] = useState<SahneAd>('nilufer')
  const [oran, setOran] = useState('4 / 5')
  const [gSus, setGSus] = useState<SusSeviye>('sade')
  const [anahtar, setAnahtar] = useState(true)
  const [secim, setSecim] = useState('a')
  return (
    <Section
      id="bilesenler"
      ikon="dal"
      madde="Madde 11 · 14 · Bileşenler"
      title="Bitkisel çerçeveden düğmeye"
      lead="Üç temel parça: kıvrımlı çerçeveli BotanikKart, dalgalı maskeli DalgaGorsel ve yaprak biçimli NouveauButton. Çerçeve kutuyu ölçüp konturu ve sarmaşığı o boyuta göre çizer; görsel aynı konturla clip-path ile kesilir."
    >
      <h3 className="font-mono text-[clamp(20px,2.4vw,26px)] font-semibold" lang="en">
        &lt;BotanikKart&gt;
      </h3>
      <div className="mt-6 grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7" data-bilesen="kart">
          <BotanikKart tohum={tohum} katman={katman} sus={sus} kicker="Kart" baslik="Kenarları kıvrımlı kart" className="w-full">
            <p className="text-[18px]">İçerik her zaman konturun içindeki düz panelde durur. Süs seviyesi mobilde otomatik düşer.</p>
            <div className="mt-4">
              <NouveauButton boy="k" ikon={<Ikon ad="ok" boyut={18} />}>
                Devamı
              </NouveauButton>
            </div>
          </BotanikKart>
        </div>
        <div className="grid grid-cols-1 min-w-0 content-start gap-5 lg:col-span-5">
          <Secim<SusSeviye> legend="Süs seviyesi" name="bl-sus" value={sus} onChange={setSus} options={SUSLAR} />
          <Aralik label="Arka katman" value={katman} min={0} max={3} onChange={setKatman} format={(v) => String(v)} />
          <NouveauButton boy="k" onClick={() => setTohum((t) => (t % 40) + 1)} ikon={<Ikon ad="girdap" boyut={18} />}>
            Yeni çerçeve
          </NouveauButton>
          <Kod label="BotanikKart kullanımı" sar={false}>{`<BotanikKart tohum={${tohum}} katman={${katman}} sus="${sus}"
  kicker="Kart" baslik="Kenarları kıvrımlı kart">
  …düz panelde metin…
</BotanikKart>`}</Kod>
        </div>
      </div>

      <h3 className="mt-[var(--aralik)] font-mono text-[clamp(20px,2.4vw,26px)] font-semibold" lang="en">
        &lt;DalgaGorsel&gt;
      </h3>
      <div className="mt-6 grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5" data-bilesen="gorsel">
          <DalgaGorsel sahne={sahne} oran={oran} tohum={7} sus={gSus} altyazi={SAHNE_AD[sahne]} className="mx-auto w-full max-w-[440px]" />
        </div>
        <div className="grid grid-cols-1 min-w-0 content-start gap-5 lg:col-span-7">
          <Secim<SahneAd> legend="Görsel" name="bl-sahne" value={sahne} onChange={setSahne} options={SAHNELER.map((s) => ({ id: s, ad: SAHNE_AD[s] }))} />
          <Secim<string>
            legend="Oran"
            name="bl-oran"
            value={oran}
            onChange={setOran}
            options={[
              ['4 / 5', '4:5'],
              ['1 / 1', '1:1'],
              ['3 / 2', '3:2'],
              ['16 / 9', '16:9'],
            ].map(([id, ad]) => ({ id, ad }))}
          />
          <Secim<SusSeviye> legend="Süs seviyesi" name="bl-gsus" value={gSus} onChange={setGSus} options={SUSLAR} />
          <Kod label="DalgaGorsel kullanımı" sar={false}>{`<DalgaGorsel sahne="${sahne}" oran="${oran}"
  sus="${gSus}" altyazi="${SAHNE_AD[sahne]}" />`}</Kod>
          <SadePanel ic="p-4 sm:p-5">
            <p className="max-w-[60ch] text-[16.5px] text-soluk">Dairesel kırpma yerine kontur, dalga toplamıyla üretilir; aynı yol hem clip-path hem altın çizgi olarak kullanılır.</p>
          </SadePanel>
        </div>
      </div>

      <h3 className="mt-[var(--aralik)] font-mono text-[clamp(20px,2.4vw,26px)] font-semibold" lang="en">
        &lt;NouveauButton&gt;
      </h3>
      <SadePanel className="mt-6" ic="p-6 sm:p-9">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3" data-nbtn-varyant="">
          <div className="grid grid-cols-1 content-start justify-items-start gap-5">
            <p className="kicker">Dolu</p>
            <NouveauButton varyant="dolu" boy="b">
              Rezervasyon
            </NouveauButton>
            <NouveauButton varyant="dolu">Standart</NouveauButton>
            <NouveauButton varyant="dolu" boy="k">
              Küçük
            </NouveauButton>
          </div>
          <div className="grid grid-cols-1 content-start justify-items-start gap-5">
            <p className="kicker">Çizgi</p>
            <NouveauButton boy="b">Koleksiyon</NouveauButton>
            <NouveauButton>Standart</NouveauButton>
            <NouveauButton boy="k" disabled>
              Pasif
            </NouveauButton>
          </div>
          <div className="grid grid-cols-1 content-start justify-items-start gap-5">
            <p className="kicker">Metin</p>
            <NouveauButton varyant="metin" ikon={<Ikon ad="ok" boyut={20} />}>
              Koleksiyonu gör
            </NouveauButton>
            <NouveauButton varyant="metin" ikon={<Ikon ad="indir" boyut={20} />}>
              Katalog
            </NouveauButton>
          </div>
        </div>
        <p className="mt-6 max-w-[64ch] text-[16.5px] text-soluk">Hover’da özsu alttan yükselir; üst kenarı dalgalıdır (maske). Şekil asimetrik yaprak: iki köşe yuvarlak, iki köşe dar.</p>
      </SadePanel>
      <Kod label="NouveauButton kullanımı" className="mt-6" sar={false}>{`<NouveauButton varyant="dolu" boy="b" onClick={git}
  ikon={<Ikon ad="ok" />}>
  Koleksiyona bak
</NouveauButton>`}</Kod>

      <h3 className="mt-[var(--aralik)] font-mono text-[clamp(20px,2.4vw,26px)] font-semibold">Kontroller</h3>
      <SadePanel className="mt-6" ic="p-6 sm:p-9">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2" data-kontroller="">
          <Anahtar label="Bülten" hint="Yaprak tutamaklı anahtar" checked={anahtar} onChange={setAnahtar} />
          <Secim<string>
            legend="Seçim"
            name="bl-secim"
            value={secim}
            onChange={setSecim}
            options={[
              { id: 'a', ad: 'Sarmaşık' },
              { id: 'b', ad: 'Zambak' },
              { id: 'c', ad: 'Nilüfer' },
            ]}
          />
          <div className="flex items-center gap-4">
            {(['yaprak', 'kalp', 'yildiz', 'ara'] as const).map((s) => (
              <Tooltip.Root key={s}>
                <Tooltip.Trigger asChild>
                  <button type="button" className="grid size-12 place-items-center rounded-[16px_5px_16px_5px] border border-[var(--toprak)] bg-panel text-metin hover:bg-kum" aria-label={`İkon: ${s}`}>
                    <Ikon ad={s} boyut={24} />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content sideOffset={8} className="sade-panel z-[96] px-3 py-1.5 text-[15.5px]">
                    {s}
                    <Tooltip.Arrow className="fill-[var(--panel)]" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </div>
        </div>
      </SadePanel>
    </Section>
  )
}

/* ───────────────────────── Madde 12 · 13 · Figma ───────────────────────── */

const FIGMA_TOKENLER = [
  ['Color/NouveauSage', '#6B8E23', 'color', 'Sarmaşık, yaprak, odak'],
  ['Color/AntiqueGold', '#C5A059', 'color', 'Çerçeve konturu, ayraç'],
  ['Color/DustyRose', '#D8A47F', 'color', 'Taç yaprak, katman'],
  ['Border/OrganicCurve', 'amp 7 · λ 150 · asim 0,6', 'shape', 'Dalga toplamı; dik köşe yok'],
  ['Typography/ArtisticSerif', 'Metamorphous 400', 'font', 'Başlık'],
] as const

export function Figma() {
  const [maske, setMaske] = useState(2)
  const [goster, setGoster] = useState(true)
  const [kopya, setKopya] = useState('')
  const W = 240
  const H = 300
  const { yol, norm } = useMemo(() => {
    const k = kontur(W, H, {
      tohum: maske * 3 + 1,
      genlik: 9,
      dalgaBoyu: 100,
      asimetri: 0.9,
      pay: 6,
      us: 3.6,
    })
    return {
      yol: konturYol(k),
      norm: yumusak(
        k.map(([x, y]) => [x / W, y / H] as const),
        true,
        1,
        4,
      ),
    }
  }, [maske])
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">\n  <path id="OrganicFrameMask" d="${yol}" fill="#000"/>\n</svg>`
  const kop = async () => {
    setKopya((await kopyala(svg)) ? 'Kopyalandı' : 'Kopyalanamadı: metni seçip kopyalayın')
    window.setTimeout(() => setKopya(''), 2400)
  }
  return (
    <Section
      id="figma"
      ikon="tomurcuk"
      madde={
        <>
          <span lang="en">Figma</span> mimarisi · Madde 12 · 13
        </>
      }
      title="Vektör maske, bileşen zemini"
      lead="Figma’da karmaşık organik çerçeve tek bir vektör olarak çizilir, SVG olarak dışa aktarılır ve bileşenin maskesi/arka planı olarak atanır. Kod tarafında aynı SVG yolu objectBoundingBox ile normalize edilir; bileşen hangi boyutta olursa olsun kıvrım oranı korunur."
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="figma-maske" clipPathUnits="objectBoundingBox">
            <path d={norm} />
          </clipPath>
        </defs>
      </svg>
      <div className="mb-8 flex flex-wrap items-end gap-x-10 gap-y-4">
        <Secim<string>
          legend="Maske"
          name="fg-maske"
          value={String(maske)}
          onChange={(v) => setMaske(+v)}
          options={[1, 2, 3, 4].map((n) => ({
            id: String(n),
            ad: `Maske ${n}`,
          }))}
        />
        <Anahtar label="Vektör konturunu göster" checked={goster} onChange={setGoster} />
      </div>
      <ol className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 md:grid-cols-3" data-figma-adimlar="">
        <li className="min-w-0">
          <p className="kicker">1 · Vektör maske (SVG)</p>
          <SadePanel className="mt-3" ic="p-4">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[240px]" role="img" aria-label="Maske vektörü" data-figma-vektor="">
              <path d={yol} fill="color-mix(in srgb, var(--nv-sage) 22%, transparent)" stroke="var(--nv-sage)" strokeWidth="1.6" strokeDasharray="6 4" />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <circle key={i} cx={30 + i * 36} cy={i % 2 ? 40 : 260} r="3" fill="var(--panel)" stroke="var(--nv-sage)" strokeWidth="1.5" />
              ))}
            </svg>
          </SadePanel>
        </li>
        <li className="min-w-0">
          <p className="kicker">2 · İçerik (görsel)</p>
          <SadePanel className="mt-3" ic="p-4">
            <div className="mx-auto aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-[10px]">
              <Gorsel sahne="sarmasik" tohum={2} />
            </div>
          </SadePanel>
        </li>
        <li className="min-w-0">
          <p className="kicker">3 · Bileşen (maske atanmış)</p>
          <SadePanel className="mt-3" ic="p-4">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[240px]" data-figma-bilesen="">
              <div
                className="absolute inset-0"
                style={{
                  clipPath: 'url(#figma-maske)',
                  WebkitClipPath: 'url(#figma-maske)',
                }}
              >
                <Gorsel sahne="sarmasik" tohum={2} />
              </div>
              {goster ? (
                <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                  <path d={yol} fill="none" stroke="var(--nv-gold)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>
              ) : null}
            </div>
          </SadePanel>
        </li>
      </ol>
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <Kod label="Maske SVG kaynağı" sar={false}>
            {svg.length > 700 ? `${svg.slice(0, 640)}…\n</svg>` : svg}
          </Kod>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <NouveauButton boy="k" onClick={kop} ikon={<Ikon ad="indir" boyut={18} />} data-figma-kopyala="">
              SVG’yi kopyala
            </NouveauButton>
            <span className="text-[16px] text-soluk" role="status" aria-live="polite">
              {kopya}
            </span>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <SadePanel ic="p-5 sm:p-6">
            <p className="kicker">Katman ağacı</p>
            <ul className="m-0 mt-3 list-none p-0 font-mono text-[13.5px] leading-[1.9]" data-figma-agac="">
              <li>▾ Component/BotanikKart</li>
              <li className="pl-5">▾ Mask/OrganicFrame (SVG import)</li>
              <li className="pl-10">Content/Image · Fill</li>
              <li className="pl-5">Ornament/Ivy (SVG, seviye: tam)</li>
              <li className="pl-5">Panel/Text · düz dolgu</li>
            </ul>
          </SadePanel>
        </div>
      </div>

      <div className="mt-[var(--aralik)] overflow-x-auto" role="region" aria-label="Figma tokenları" tabIndex={0}>
        <SadePanel ic="p-6 sm:p-8" className="min-w-[640px]">
          <table className="tablo w-full border-collapse text-[17px]" data-figma-token="">
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
                    {c === 'color' ? <span className="mr-2 inline-block size-4 rounded-[0_100%_0_100%] align-middle" style={{ background: b }} aria-hidden="true" /> : null}
                    {b}
                  </td>
                  <td className="text-soluk">{c}</td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SadePanel>
      </div>
      <Kod label="Figma token dosyası" className="mt-8" sar={false}>{`{
  "Color":  { "NouveauSage": { "$type": "color", "$value": "#6B8E23" } },
  "Border": { "OrganicCurve": { "$type": "shape",
              "$value": { "amplitude": "7px", "wavelength": "150px", "asymmetry": 0.6 } } },
  "Typography": { "ArtisticSerif": { "$type": "fontFamily", "$value": ["Metamorphous", "Alegreya"] } }
}`}</Kod>
    </Section>
  )
}

/* ───────────────────────── Madde 15 · CSS / Tailwind ───────────────────────── */

const yumusakMaske = (sd: number) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><filter id='b' x='-20%' y='-20%' width='140%' height='140%'><feGaussianBlur stdDeviation='${sd}'/></filter><path filter='url(#b)' d='M50 9C68 6 88 16 92 37C96 58 87 82 63 90C39 96 14 85 10 61C6 38 24 11 50 9Z' fill='#000'/></svg>`)}")`

export function Css() {
  const [sd, setSd] = useState(1.6)
  const [tur, setTur] = useState<'organik' | 'yaprak' | 'dalga'>('organik')
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)
  const [hesap, setHesap] = useState<Record<string, string>>({})
  const { tema } = useNouveau()
  useEffect(() => {
    const oku = (el: HTMLElement | null, k: string) => (el ? getComputedStyle(el).getPropertyValue(k) : '')
    const kisalt = (s: string) => (s.length > 64 ? `${s.slice(0, 60)}…` : s)
    setHesap({
      'mask-image': kisalt(oku(a.current, '-webkit-mask-image') || oku(a.current, 'mask-image')),
      'mask-size': oku(a.current, 'mask-size') || oku(a.current, '-webkit-mask-size'),
      'mask-repeat': oku(a.current, 'mask-repeat') || oku(a.current, '-webkit-mask-repeat'),
      'canli-mask': kisalt(oku(b.current, '-webkit-mask-image') || oku(b.current, 'mask-image')),
      font: oku(a.current, 'font-family'),
    })
  }, [tema, sd, tur])
  const sinif = {
    organik: 'yum-organik',
    yaprak: 'yum-yaprak',
    dalga: 'yum-dalga',
  }[tur]
  return (
    <Section
      id="css"
      ikon="egrelti"
      madde={
        <>
          Madde 15 · CSS / <span lang="en">Tailwind</span>
        </>
      }
      title="mask-image ile yumuşak kenar"
      lead="Dikdörtgen bir görselin sert piksel kenarı, bir SVG eğri maskesiyle yumuşar: mask-image: url(…) ile şekil verilir, kenar bulanıklığı SVG filtresinden gelir. Aşağıdaki bulanıklığı değiştirince maske canlı yeniden üretilir."
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-3 lg:col-span-7" data-css-karsi="">
          <div>
            <p className="kicker mb-2">Maskesiz</p>
            <div className="aspect-[4/5] w-full overflow-hidden" data-css-duz="">
              <Gorsel sahne="zambak" tohum={3} />
            </div>
          </div>
          <div>
            <p className="kicker mb-2">Maskeli · {tur}</p>
            <div ref={a} className={cx('aspect-[4/5] w-full overflow-hidden', sinif)} data-css-maskeli="">
              <Gorsel sahne="zambak" tohum={3} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 min-w-0 content-start gap-6 lg:col-span-5">
          <Secim<'organik' | 'yaprak' | 'dalga'>
            legend="Hazır maske"
            name="css-maske"
            value={tur}
            onChange={setTur}
            options={[
              { id: 'organik', ad: 'Organik' },
              { id: 'yaprak', ad: 'Yaprak' },
              { id: 'dalga', ad: 'Dalga' },
            ]}
          />
          <div>
            <Aralik label="Kenar bulanıklığı" value={sd} min={0} max={6} step={0.2} onChange={setSd} format={(v) => v.toFixed(1).replace('.', ',')} />
            <div
              ref={b}
              className="mt-3 aspect-[5/4] w-full max-w-[280px] overflow-hidden [mask-repeat:no-repeat] [mask-size:100%_100%]"
              style={{
                WebkitMaskImage: yumusakMaske(sd),
                maskImage: yumusakMaske(sd),
                WebkitMaskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
              }}
              data-css-canli={sd}
            >
              <Gorsel sahne="pavus" tohum={2} />
            </div>
          </div>
        </div>
      </div>
      <SadePanel className="mt-[var(--aralik)]" ic="p-6 sm:p-8">
        <div className="overflow-x-auto" role="region" aria-label="Hesaplanan değerler" tabIndex={0}>
          <table className="tablo w-full min-w-[520px] border-collapse text-[17px]" data-css-tablo="">
            <caption>Hesaplanan değerler</caption>
            <tbody>
              {[
                ['mask-image (hazır maske)', 'mask-image'],
                ['mask-size', 'mask-size'],
                ['mask-repeat', 'mask-repeat'],
                ['mask-image (canlı, bulanıklığa göre)', 'canli-mask'],
              ].map(([ad, k]) => (
                <tr key={k}>
                  <th scope="row" className="font-mono text-[13.5px] font-medium">
                    {ad}
                  </th>
                  <td className="font-mono text-[13px] [overflow-wrap:anywhere]" data-css-hesap={k}>
                    {hesap[k] || '…'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SadePanel>
      <Kod label="CSS ve Tailwind örnekleri" className="mt-8" sar={false}>{`/* düz CSS */
.yum-organik {
  mask: url("data:image/svg+xml,…<feGaussianBlur stdDeviation='1.6'/>…")
        center / 100% 100% no-repeat;
}

/* Tailwind (arbitrary değer) */
<div class="[mask-image:url(/organik.svg)] [mask-size:100%_100%] [mask-repeat:no-repeat]">…</div>

/* dalgalı alt kenar: iki maske katmanı */
mask: linear-gradient(#000 0 0) top / 100% calc(100% - 13px) no-repeat,
      url(dalga.svg) bottom / 56px 14px repeat-x;`}</Kod>
    </Section>
  )
}
