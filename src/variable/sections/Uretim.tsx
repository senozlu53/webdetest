import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { EksenBaslik, type Harita } from '../components/EksenBaslik'
import { Alan, Anahtar, Aralik, Bolum, Buton, KENAR, Kod, Secim } from '../components/ui'
import { CSS_SATIRI, FIGMA_OZELLIKLER, PROPLAR, TAILWIND_SATIRI, AILELER, eksenDizesi, type Aile } from '../lib/data'
import { useVariable } from '../lib/store'

/* ───────────────────────── Madde 11 · 14 · Bileşenler ───────────────────────── */

const H_FLEX: Harita = { x: [{ v: '--wdth', min: 25, max: 151 }], y: [{ v: '--wght', min: 100, max: 1000, ters: true }], dinlenme: { '--wdth': 100, '--wght': 400 } }
const H_REC: Harita = {
  x: [
    { v: '--casl', min: 0, max: 1 },
    { v: '--slnt', min: 0, max: -15 },
  ],
  y: [{ v: '--wght', min: 300, max: 1000, ters: true }],
  dinlenme: { '--casl': 0, '--slnt': 0, '--wght': 400 },
}
const H_FRA: Harita = {
  x: [
    { v: '--soft', min: 0, max: 100 },
    { v: '--wonk', min: 0, max: 1 },
  ],
  y: [
    { v: '--wght', min: 100, max: 900, ters: true },
    { v: '--opsz', min: 144, max: 9 },
  ],
  dinlenme: { '--soft': 0, '--wonk': 0, '--wght': 400, '--opsz': 144 },
}

type Duzen = 'kirik' | 'duzgun'
function Kirik({
  c,
  s,
  r,
  mx = '0',
  my = '0',
  don = 0,
  cm,
  sm,
  rm,
  mxm,
  mym,
  children,
  className,
  dikey,
}: {
  c: number
  s: number
  r: number
  mx?: string
  my?: string
  don?: number
  cm?: number
  sm?: number
  rm?: number
  mxm?: string
  mym?: string
  children: React.ReactNode
  className?: string
  dikey?: boolean
}) {
  return (
    <div
      className={cx('kirik', dikey && 'kirik-dikey', className)}
      style={
        {
          ['--c' as string]: c,
          ['--s' as string]: s,
          ['--r' as string]: r,
          ['--mx' as string]: mx,
          ['--my' as string]: my,
          ['--don' as string]: `${don}deg`,
          ...(cm ? { ['--cm' as string]: cm } : null),
          ...(sm ? { ['--sm' as string]: sm } : null),
          ...(rm ? { ['--rm' as string]: rm } : null),
          ...(mxm ? { ['--mxm' as string]: mxm } : null),
          ...(mym ? { ['--mym' as string]: mym } : null),
        } as CSSProperties
      }
      data-kirik={`${c}-${s}`}
    >
      {children}
    </div>
  )
}

export function Bilesenler() {
  const [goster, setGoster] = useState(true)
  const [duzen, setDuzen] = useState<Duzen>('kirik')
  const [tetik, setTetik] = useState(false)
  const [olc, setOlc] = useState({ kayitli: '', kayitsiz: '' })
  const kayitli = useRef<HTMLParagraphElement>(null)
  const kayitsiz = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    if (!tetik) {
      setOlc({ kayitli: '', kayitsiz: '' })
      return
    }
    const t = window.setTimeout(() => {
      setOlc({ kayitli: kayitli.current ? getComputedStyle(kayitli.current).getPropertyValue('--wght').trim() : '', kayitsiz: kayitsiz.current ? getComputedStyle(kayitsiz.current).getPropertyValue('--wght-x').trim() : '' })
    }, 220)
    return () => window.clearTimeout(t)
  }, [tetik])
  return (
    <Bolum
      id="bilesenler"
      no="09"
      madde="Madde 11 · 14 · Bileşenler ve React"
      baslik="Başlık kartları"
      vurgulu={[1]}
      lead={
        <>
          İmleç koordinatlarına göre anlık biçim değiştiren <b>&lt;EksenBaslik&gt;</b> kartları ve ızgarayı bilerek bozan metin blokları. Eksen değerleri <span className="font-mono text-[0.9em]">@property</span> ile kayıtlı sayılardır; CSS geçişleri bu yüzden gerçekten ara değer üretir.
        </>
      }
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-12`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-12" data-eksen-kartlari="">
          <EksenBaslik metin="Esnek" aile="flex" harita={H_FLEX} alt="x → genişlik · y → kalınlık" boy="clamp(44px, 7vw, 100px)" ad="kart-flex" className="min-h-[320px]" />
          <EksenBaslik metin="Sıradan" aile="rec" harita={H_REC} alt="x → sıradanlık ve eğim · y → kalınlık" boy="clamp(44px, 6.4vw, 92px)" ad="kart-rec" className="min-h-[320px]" />
          <EksenBaslik metin="Cıvık" aile="fra" harita={H_FRA} alt="x → yumuşaklık ve tuhaflık · y → kalınlık" boy="clamp(44px, 7vw, 100px)" ad="kart-fra" className="min-h-[320px]" />
        </div>

        <div className="lg:col-span-12" data-kirik-demo="">
          <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Secim<Duzen>
              legend="Yerleşim"
              name="kirik-duzen"
              value={duzen}
              onChange={setDuzen}
              options={[
                { id: 'kirik', ad: 'Bozuk' },
                { id: 'duzgun', ad: 'Düzgün' },
              ]}
            />
            <Anahtar label="12 kolonu göster" checked={goster} onChange={setGoster} />
          </div>
          <div className="relative overflow-x-clip py-6">
            <div className="izgara12" data-duzen={duzen} data-goster={goster ? 'acik' : 'kapali'} data-izgara="">
              {goster ? (
                <div className="izgara-kilavuz" aria-hidden="true" data-kilavuz="">
                  {Array.from({ length: 12 }, (_, i) => (
                    <span key={i} />
                  ))}
                </div>
              ) : null}
              <Kirik c={1} s={8} r={1} sm={12}>
                <p className="vk text-[clamp(44px,9vw,132px)] leading-[0.9]" style={{ ['--wght' as string]: 900, ['--wdth' as string]: 151 }}>
                  Izgara
                </p>
              </Kirik>
              <Kirik c={6} s={7} r={1} cm={4} sm={9} mx="-4%" mxm="0" my="clamp(24px,5vw,72px)" don={-3} className="patlama-blok px-4 py-2">
                <p className="vk f-fra text-[clamp(36px,7vw,100px)] leading-[0.95]" style={{ ['--wght' as string]: 300, ['--soft' as string]: 100, ['--wonk' as string]: 1 }}>
                  bozan blok
                </p>
              </Kirik>
              <Kirik c={1} s={1} r={2} sm={2} dikey mx="0" className="row-span-2 px-1">
                <p className="vk text-[clamp(32px,5vw,64px)] leading-none" style={{ ['--wght' as string]: 800, ['--wdth' as string]: 40 }}>
                  KOLON DIŞI
                </p>
              </Kirik>
              <Kirik c={3} s={6} r={2} cm={3} sm={10} mx="-10%" mxm="0" my="clamp(12px,3vw,40px)" don={2}>
                <p className="vk f-rec text-[clamp(34px,6vw,84px)] leading-[0.95]" style={{ ['--wght' as string]: 900, ['--casl' as string]: 1, ['--slnt' as string]: -12 }}>
                  taşan satır
                </p>
              </Kirik>
              <Kirik c={9} s={4} r={2} rm={3} cm={3} sm={10} mx="4%" mxm="0" my="clamp(-40px,-3vw,-12px)" mym="8px" className="bg-zemin p-3">
                <p className="max-w-[30ch] text-[16px]">Gövde metni sabit kalır: bu paragraf hiçbir eksen bükmez. Yalnız yerleşimi ızgarayı bozar.</p>
              </Kirik>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7" data-kanit="">
          <p className="kicker">@property kanıtı · kayıtlı ve kayıtsız özel özellik</p>
          <div className="mt-4 grid grid-cols-1 gap-2 border-2 border-metin p-4">
            <p ref={kayitli} className="vk kanit-kayitli m-0 text-[clamp(44px,8vw,110px)] leading-[0.95]" data-zorla={tetik ? '' : undefined} data-kayitli="">
              Kayıtlı
            </p>
            <p ref={kayitsiz} className="kanit-kayitsiz m-0 text-[clamp(44px,8vw,110px)] leading-[0.95]" style={{ fontFamily: 'var(--font-disp)' }} data-zorla={tetik ? '' : undefined} data-kayitsiz="">
              Kayıtsız
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Buton ton="patlama" onClick={() => setTetik((t) => !t)} aria-pressed={tetik} data-tetik="">
              Geçişi tetikle
            </Buton>
            <p className="rakam text-[14px]" data-kanit-olcum={`${olc.kayitli}|${olc.kayitsiz}`}>
              220 ms sonra: kayıtlı --wght = {olc.kayitli || '—'} · kayıtsız --wght-x = {olc.kayitsiz || '—'}
            </p>
          </div>
          <p className="mt-2 text-[14px] text-soluk">Kayıtlı özellik 200 ile 1000 arasında ara değerden geçer (elastik eğriyle taşabilir); kayıtsız olan geçişte hemen 1000’e sıçrar.</p>
        </div>
        <div className="lg:col-span-5">
          <Kod
            label="Kayıtlı özellik"
            dar
          >{`@property --wght { syntax: '<number>'; inherits: true; initial-value: 400; }\n@property --wdth { syntax: '<number>'; inherits: true; initial-value: 100; }\n\n.vk { font-variation-settings:\n  'wght' calc(400 + (var(--wght) - 400) * var(--e)),\n  'wdth' calc(100 + (var(--wdth) - 100) * var(--e)); }\n.kart { transition: --wght 900ms cubic-bezier(.34, 1.56, .64, 1); }`}</Kod>
        </div>

        <div className="overflow-x-auto lg:col-span-12" role="region" aria-label="Bileşen özellikleri" tabIndex={0}>
          <table className="tablo w-full min-w-[760px] border-collapse text-[15px]" data-proplar="">
            <caption className="kicker">Bileşen özellikleri</caption>
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
                  <th scope="row" className="font-mono !text-[13px]">
                    {p.bilesen}
                  </th>
                  <td className="font-mono text-[13px]">{p.ad}</td>
                  <td className="font-mono text-[12.5px]">{p.tip}</td>
                  <td className="font-mono text-[12.5px]">{p.varsayilan}</td>
                  <td>{p.aciklama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 12 · 13 · Figma ───────────────────────── */

export function Figma() {
  const [w, setW] = useState(400)
  const [d, setD] = useState(100)
  const [s, setS] = useState(0)
  const [aile, setAile] = useState<Aile>('flex')
  const [metin, setMetin] = useState('Ağ')
  const inst = useRef<HTMLParagraphElement>(null)
  const [hesap, setHesap] = useState('')
  const dize = eksenDizesi(aile === 'flex' ? { wght: w, wdth: d, slnt: s, opsz: 144 } : aile === 'rec' ? { wght: Math.max(300, w), slnt: Math.max(-15, s * 1.5) } : { wght: Math.min(900, w), opsz: 144 })
  useEffect(() => {
    if (inst.current) setHesap(getComputedStyle(inst.current).fontVariationSettings)
  }, [dize])
  const matris = [100, 500, 1000].flatMap((a) => [25, 100, 151].map((b) => ({ a, b })))
  return (
    <Bolum
      id="figma"
      no="10"
      madde="Madde 12 · 13 · Figma mimarisi ve tokenlar"
      baslik="Eksen özellikleri"
      vurgulu={[0]}
      aile="rec"
      lead={
        <>
          Figma’da yazı tipi eksenleri bileşen özelliği (<span lang="en">component property</span>) olur: <b>Font Weight</b>, <b>Width</b>, <b>Slant</b> birer sayı özelliği. Aşağıdaki panel bu özellikleri taklit eder; dokuz ayrı varyant da tek tıkla seçilir.
        </>
      }
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12`}>
        <div className="grid content-start gap-6 lg:col-span-4" data-figma-panel="">
          <div>
            <p className="kicker">Bileşen</p>
            <p className="mt-1 text-[22px] font-semibold" lang="en">
              Variable/Text
            </p>
          </div>
          <Secim<Aile>
            legend="Family (Variant)"
            name="figma-aile"
            value={aile}
            onChange={setAile}
            options={[
              { id: 'flex', ad: 'Flex' },
              { id: 'rec', ad: 'Recursive' },
              { id: 'fra', ad: 'Fraunces' },
            ]}
          />
          <Aralik id="figma-w" label="Font Weight" value={w} min={FIGMA_OZELLIKLER[0].min} max={FIGMA_OZELLIKLER[0].max} step={10} onChange={setW} />
          <Aralik id="figma-d" label="Width" value={d} min={FIGMA_OZELLIKLER[1].min} max={FIGMA_OZELLIKLER[1].max} onChange={setD} />
          <Aralik id="figma-s" label="Slant" value={s} min={FIGMA_OZELLIKLER[2].min} max={FIGMA_OZELLIKLER[2].max} step={0.5} onChange={setS} format={(v) => String(v).replace('.', ',')} />
          <Alan label="Text (en çok 8 karakter)">{(p) => <input className="alan" {...p} value={metin} maxLength={8} onChange={(e) => setMetin(e.target.value)} autoComplete="off" data-figma-metin="" />}</Alan>
        </div>
        <div className="lg:col-span-8">
          <div className="overflow-x-clip border-2 border-metin p-6" data-figma-onizleme="">
            <p ref={inst} className={cx('vk m-0 leading-[0.95]', AILELER[aile].css)} style={{ fontFamily: aile === 'flex' ? 'var(--font-disp)' : aile === 'rec' ? 'var(--font-rec)' : 'var(--font-fra)', fontVariationSettings: dize, fontSize: 'clamp(70px, 14vw, 200px)' }} data-figma-ornek={dize}>
              {metin || 'Ağ'}
            </p>
          </div>
          <p className="mt-3 font-mono text-[13px] break-words text-soluk" data-figma-hesap={hesap}>
            hesaplanan: {hesap}
          </p>
        </div>

        <div className="lg:col-span-12">
          <p className="kicker">Varyant matrisi · Weight × Width</p>
          <ul className="mt-3 grid grid-cols-3 gap-2" data-matris="">
            {matris.map(({ a, b }) => (
              <li key={a + '-' + b}>
                <button
                  type="button"
                  aria-pressed={w === a && d === b}
                  onClick={() => {
                    setAile('flex')
                    setW(a)
                    setD(b)
                  }}
                  className="block w-full overflow-x-clip border-2 border-metin p-2 text-left max-[400px]:p-1.5"
                  data-varyant={`${a}-${b}`}
                  aria-label={`Weight ${a}, Width ${b} varyantını seç`}
                >
                  <span className="vk block text-[clamp(40px,7vw,96px)] leading-[1]" style={{ ['--wght' as string]: a, ['--wdth' as string]: b }} aria-hidden="true">
                    Ağ
                  </span>
                  <span className="rakam block text-[12px] break-words text-soluk max-[400px]:text-[11px]">
                    Weight={a}
                    <br />
                    Width={b}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-x-auto lg:col-span-12" role="region" aria-label="Eksen tokenları" tabIndex={0}>
          <table className="tablo w-full min-w-[640px] border-collapse text-[15px]" data-token-tablo="" data-token-olcum={hesap}>
            <caption className="kicker">Typography/VariableAxis* · Roboto Flex</caption>
            <thead>
              <tr>
                {['Token', 'Eksen', 'Alt', 'Varsayılan', 'Üst'].map((b) => (
                  <th key={b} scope="col">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Typography/VariableAxisWeight', 'wght', 100, 400, 1000],
                  ['Typography/VariableAxisWidth', 'wdth', 25, 100, 151],
                  ['Typography/VariableAxisSlant', 'slnt', -10, 0, 0],
                  ['Typography/VariableAxisOpticalSize', 'opsz', 8, 14, 144],
                ] as const
              ).map(([ad, tag, lo, def, hi]) => (
                <tr key={tag}>
                  <th scope="row" className="font-mono !text-[13px]">
                    {ad}
                  </th>
                  <td className="font-mono text-[14px]">{tag}</td>
                  <td className="rakam text-[15px]">{lo}</td>
                  <td className="rakam text-[15px]">{def}</td>
                  <td className="rakam text-[15px]">{hi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 15 · CSS / Tailwind ───────────────────────── */

export function Css() {
  const a = useRef<HTMLParagraphElement>(null)
  const b = useRef<HTMLParagraphElement>(null)
  const [olc, setOlc] = useState({ a: '', b: '' })
  useEffect(() => {
    if (a.current && b.current) setOlc({ a: getComputedStyle(a.current).fontVariationSettings, b: getComputedStyle(b.current).fontVariationSettings })
  }, [])
  const { hareket } = useVariable()
  return (
    <Bolum
      id="css"
      no="11"
      madde="Madde 15 · CSS / Tailwind yapısı"
      baslik="Tek satır"
      vurgulu={[1]}
      lead={
        <>
          Bütün deneyin özü tek satırdır: <span className="font-mono text-[0.86em]">{CSS_SATIRI}</span>. React <span lang="en">style</span> nesnesi de, Tailwind rastgele özelliği de aynı hesaplanan değeri üretir.
        </>
      }
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12`}>
        <div className="border-2 border-metin p-[clamp(20px,4vw,48px)] lg:col-span-7" data-css-kutu="">
          <p ref={a} className="m-0 text-[clamp(44px,8vw,112px)] leading-[0.95]" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 900, 'wdth' 125" }} data-css-a="">
            React stil
          </p>
          <p ref={b} className="m-0 mt-4 text-[clamp(44px,8vw,112px)] leading-[0.95] [font-family:var(--font-disp)] [font-variation-settings:'wght'_900,'wdth'_125]" data-css-b="">
            Tailwind
          </p>
        </div>
        <dl className="grid grid-cols-1 content-start gap-5 text-[15.5px] lg:col-span-5" data-css-olcum={`${olc.a}|${olc.b}`} data-esit={olc.a && olc.a === olc.b ? 'evet' : 'hayir'}>
          <div className="border-t border-hat pt-3">
            <dt className="kicker">style={'{{ fontVariationSettings }}'}</dt>
            <dd className="m-0 mt-1 font-mono text-[14px]">{olc.a}</dd>
          </div>
          <div className="border-t border-hat pt-3">
            <dt className="kicker">Tailwind [font-variation-settings:…]</dt>
            <dd className="m-0 mt-1 font-mono text-[14px]">{olc.b}</dd>
          </div>
          <div className="border-t border-hat pt-3">
            <dt className="kicker">Sonuç</dt>
            <dd className="m-0 mt-1 text-[16px]">{olc.a && olc.a === olc.b ? 'İkisi de aynı hesaplanan değeri üretiyor.' : 'Ölçülüyor…'}</dd>
          </div>
        </dl>
        <div className="lg:col-span-7" data-fvs="">
          <p className="kicker">Doğrudan geçiş · font-variation-settings</p>
          <p className="fvs-gecis mt-3 border-2 border-metin px-4 py-6 text-[clamp(40px,7vw,100px)] leading-[0.95]" tabIndex={0} data-fvs-kutu="">
            Elastik
          </p>
          <p className="mt-2 text-[14px] text-soluk">Üzerine gelin ya da odaklanın: ağırlık 200 → 1000, genişlik 50 → 151, 700 ms{hareket ? '' : ' (hareket durdu: anında)'}.</p>
        </div>
        <div className="lg:col-span-5">
          <Kod
            label="Tailwind ve React karşılaştırması"
            dar
          >{`// React\n<p style={{ fontVariationSettings: "'wght' 900, 'wdth' 125" }}>\n\n// Tailwind v4, rastgele özellik\n<p className="${TAILWIND_SATIRI}">\n\n// Kayıtlı özellikle geçiş\n.fvs-gecis { font-variation-settings: 'wght' 200, 'wdth' 50;\n  transition: font-variation-settings 700ms cubic-bezier(.34,1.56,.64,1); }`}</Kod>
        </div>
      </div>
    </Bolum>
  )
}
