import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Sahne } from '../components/Baykus'
import { FircaDarbe, WashButton } from '../components/Firca'
import { Ikon } from '../components/Ikon'
import { PIGMENT, PIGMENT_AD, WatercolorBackground, type LekeTanim } from '../components/Leke'
import { MaskeliResim, Reveal } from '../components/Reveal'
import { Damla, FircaAralik, Kod, Secim, Section } from '../components/ui'

type Ana = 'ultramarin' | 'yesil' | 'gul' | 'ocre'
const ANA = Object.keys(PIGMENT_AD) as Ana[]
const YER = [
  { x: 34, y: 46, w: 58, h: 72 },
  { x: 64, y: 56, w: 52, h: 64 },
  { x: 50, y: 26, w: 44, h: 44 },
  { x: 74, y: 30, w: 36, h: 48 },
]

/** Madde 14 · 11: bileşen kütüphanesi. Her bileşenin canlı denemesi ve kullanımı */
export function Bilesenler() {
  const [renk, setRenk] = useState<Ana>('ultramarin')
  const [adet, setAdet] = useState(2)
  const [tohum, setTohum] = useState(3)
  const [blend, setBlend] = useState<'multiply' | 'normal'>('multiply')
  const [mTohum, setMTohum] = useState(4)
  const [mDalga, setMDalga] = useState(0.1)
  const [n, setN] = useState(0)
  const [acik, setAcik] = useState(true)
  const [kaynak, setKaynak] = useState<[number, number]>([0.5, 0.5])
  const [sure, setSure] = useState(2.6)
  const sahne = useRef<HTMLDivElement>(null)

  const lekeler: LekeTanim[] = YER.slice(0, adet).map((y, i) => ({ ...y, renk: ANA[(ANA.indexOf(renk) + i) % 4], tohum: tohum + i * 4, dalga: 0.15, gecikme: i * 0.25 }))
  const oynat = (k: [number, number] = [0.5, 0.5]) => {
    setKaynak(k)
    setAcik(false)
    setN((x) => x + 1)
    requestAnimationFrame(() => requestAnimationFrame(() => setAcik(true)))
  }
  const sahneTikla = (e: React.PointerEvent) => {
    const r = sahne.current?.getBoundingClientRect()
    if (!r) return
    oynat([(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height])
  }
  const kod = `<WatercolorBackground
  lekeler={[
${lekeler.map((l) => `    { renk: '${l.renk}', x: ${l.x}, y: ${l.y}, w: ${l.w}, h: ${l.h}, tohum: ${l.tohum} },`).join('\n')}
  ]}
  sure={3.2}
/>`

  return (
    <Section
      id="bilesenler"
      madde="Madde 14 · 11 · Bileşenler"
      title="Boya bileşenleri"
      renk="yesil"
      lead="Dört yapı taşı: arkaya yayılan lekeler (WatercolorBackground), fırçayla kesilmiş kenarlı görsel (MaskeliResim), arkasında leke olan düğme (WashButton) ve sıvı gibi açılan maske (Reveal). Hepsi tohumla üretilir; dosya yok, filtre var."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0">
          <h3 className="text-[clamp(25px,6.8vw,36px)] font-medium italic [overflow-wrap:anywhere]">&lt;WatercolorBackground&gt;</h3>
          <div className="relative isolate mt-4 h-[300px] overflow-hidden rounded-lg border border-[var(--cizgi)]" style={{ backgroundColor: 'var(--kagit)', backgroundImage: 'var(--dok)', backgroundBlendMode: 'multiply', ['--blend' as string]: blend } as CSSProperties} data-wb-oyun="">
            <WatercolorBackground key={`${renk}${adet}${tohum}`} lekeler={lekeler} vb={[600, 300]} sure={1.6} gizle />
          </div>
        </div>
        <div className="grid min-w-0 content-start gap-5">
          <Secim<Ana> legend="Pigment" name="wb-renk" value={renk} onChange={setRenk} options={ANA.map((k) => ({ id: k, ad: PIGMENT_AD[k], renk: PIGMENT[k] }))} />
          <FircaAralik label="Leke sayısı" value={adet} min={1} max={4} onChange={setAdet} format={(v) => `${v}`} renk={PIGMENT[renk]} />
          <FircaAralik label="Tohum" value={tohum} min={1} max={30} onChange={setTohum} format={(v) => `${v}`} renk={PIGMENT[renk]} />
          <Secim<'multiply' | 'normal'>
            legend="Harmanlama"
            name="wb-blend"
            value={blend}
            onChange={setBlend}
            options={[
              { id: 'multiply', ad: 'Multiply' },
              { id: 'normal', ad: 'Normal' },
            ]}
          />
        </div>
      </div>
      <Kod label="WatercolorBackground kullanımı" className="mt-6" sar={false}>
        {kod}
      </Kod>

      <div className="mt-16 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="min-w-0">
          <h3 className="text-[clamp(25px,6.8vw,36px)] font-medium italic [overflow-wrap:anywhere]">&lt;MaskeliResim&gt;</h3>
          <p className="mt-2 max-w-[52ch] text-[17px] text-soluk">İçerik (resim ya da sahne), fırçayla kesilmiş organik bir lekeye maskelenir. Kenar filtreyle hafifçe dalgalanır; kutu köşesi yok.</p>
          <MaskeliResim tohum={mTohum} dalga={mDalga} etiket="Nehir kıyısı, maskelenmiş suluboya sahne" className="mx-auto mt-5 h-[260px] w-full max-w-[460px]">
            <Sahne ad="nehir" className="absolute inset-0" />
          </MaskeliResim>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FircaAralik label="Şekil (tohum)" value={mTohum} min={1} max={20} onChange={setMTohum} format={(v) => `${v}`} renk="var(--yesil)" />
            <FircaAralik label="Dalga" value={mDalga} min={0.02} max={0.3} step={0.01} onChange={setMDalga} format={(v) => `%${Math.round(v * 100)}`} renk="var(--yesil)" />
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="text-[clamp(25px,6.8vw,36px)] font-medium italic [overflow-wrap:anywhere]">&lt;Reveal&gt;</h3>
          <p className="mt-2 max-w-[52ch] text-[17px] text-soluk">Sahneye tıkla: boya tıkladığın noktadan yayılır. Klavye için düğme var.</p>
          <div ref={sahne} onPointerDown={sahneTikla} className="mt-5 h-[260px] cursor-pointer overflow-hidden rounded-lg border border-[var(--cizgi)]" style={{ backgroundColor: 'var(--kagit)' }} data-reveal-sahne="">
            <Reveal key={n} acik={acik} kaynak={kaynak} sure={sure} className="size-full">
              <Sahne ad="aksam" className="absolute inset-0" />
            </Reveal>
          </div>
          <div className="mt-5 flex flex-wrap items-end gap-6">
            <WashButton renk="gul" boy="k" onClick={() => oynat()} ikon={<Ikon ad="damla" boyut={22} />}>
              Yeniden oynat
            </WashButton>
            <div className="min-w-[200px] flex-1">
              <FircaAralik label="Süre" value={sure} min={0.8} max={6} step={0.2} onChange={setSure} format={(v) => `${v.toFixed(1).replace('.', ',')} sn`} renk="var(--gul)" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-[clamp(25px,6.8vw,36px)] font-medium italic [overflow-wrap:anywhere]">&lt;WashButton&gt;</h3>
        <p className="mt-2 max-w-[60ch] text-[17px] text-soluk">Düğmenin arkasında fırça darbesi var; üstüne gelince hafifçe yayılır, basılınca kurur. Yazı her zaman koyu mürekkep, çünkü leke saydam.</p>
        <div className="sayfa mt-6 grid grid-cols-1 gap-8 p-6 md:grid-cols-[1fr_1fr]" data-wbtn-varyant="">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-6">
            {ANA.map((k, i) => (
              <WashButton key={k} renk={k} boy="b" tohum={5 + i * 3}>
                {PIGMENT_AD[k]}
              </WashButton>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-6">
            <WashButton renk="ultramarin" boy="k" ikon={<Ikon ad="kitap" boyut={22} />}>
              İkonlu
            </WashButton>
            <WashButton renk="yesil" boy="k" disabled>
              Devre dışı
            </WashButton>
            <WashButton renk="gul" boy="k" aria-pressed="true">
              Basılı
            </WashButton>
          </div>
        </div>
        <Kod label="WashButton kullanımı" className="mt-6" sar={false}>{`<WashButton renk="ultramarin" boy="b" ikon={<Ikon ad="kitap" boyut={30} />}>
  Masalı aç
</WashButton>`}</Kod>
      </div>
    </Section>
  )
}

/* ─────────── Madde 12 · 13: Figma ─────────── */

type KatId = 'kagit' | 'leke' | 'bilesen'
const KATMAN: { id: KatId; sira: number; ad: string; kip: string; op: string; icerik: string }[] = [
  { id: 'bilesen', sira: 3, ad: 'Bileşen/Kart', kip: 'Normal', op: '%100', icerik: 'Metin, düğme, form: opak sayfa üstünde' },
  { id: 'leke', sira: 2, ad: 'Leke/Ultramarin', kip: 'Multiply', op: '%72', icerik: 'Saydam WebP, arkada, metne binmez' },
  { id: 'kagit', sira: 1, ad: 'Kâğıt/Suluboya', kip: 'Normal', op: '%100', icerik: '1024² döşenen kâğıt tanesi + zemin rengi' },
]

const DAMASKA = 'repeating-conic-gradient(#d9d9d9 0% 25%, #ffffff 0% 50%) 50% / 20px 20px'

function KatmanSahne({ kat, ayri }: { kat: Record<KatId, boolean>; ayri: boolean }) {
  const kagitStil: CSSProperties = kat.kagit ? { backgroundColor: 'var(--kagit)', backgroundImage: 'var(--dok)', backgroundBlendMode: 'multiply' } : { background: DAMASKA }
  const leke = kat.leke ? (
    <WatercolorBackground
      lekeler={[
        { renk: 'ultramarin', x: 36, y: 46, w: 62, h: 74, tohum: 3, dalga: 0.15, gecikme: 0 },
        { renk: 'gul', x: 66, y: 62, w: 46, h: 54, tohum: 9, dalga: 0.16, gecikme: 0 },
      ]}
      vb={[520, 320]}
      sure={1}
      gizle
    />
  ) : null
  const bilesen = kat.bilesen ? (
    <div className="sayfa relative mx-auto w-[64%] px-5 py-5 text-center">
      <p className="font-baslik text-[28px] leading-none font-medium italic">Günün masalı</p>
      <p className="mt-2 text-[16px] text-soluk">Bilge Baykuş seni bekliyor.</p>
    </div>
  ) : null
  if (!ayri) {
    return (
      <div className="relative isolate grid h-[320px] place-items-center overflow-hidden rounded-lg border border-[var(--cizgi)]" style={kagitStil} data-katman-sahne="birlesik">
        {leke}
        {bilesen}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" data-katman-sahne="ayri">
      {[
        { t: '1 · Kâğıt', ic: null, st: kagitStil, on: kat.kagit },
        { t: '2 · Leke (Multiply)', ic: leke, st: { background: DAMASKA } as CSSProperties, on: kat.leke },
        { t: '3 · Bileşen', ic: bilesen, st: { background: DAMASKA } as CSSProperties, on: kat.bilesen },
      ].map((p) => (
        <figure key={p.t} className="m-0 grid gap-2">
          <div className="relative isolate grid h-[190px] place-items-center overflow-hidden rounded-lg border border-[var(--cizgi)]" style={p.st}>
            {p.ic}
          </div>
          <figcaption className="font-baslik text-[20px] italic">
            {p.t} {p.on ? '' : '(kapalı)'}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const JSON_TOKEN = `{
  "BlendMode": {
    "Multiply": { "$type": "string", "$value": "multiply" },
    "Screen":   { "$type": "string", "$value": "screen" }
  },
  "Color": { "WatercolorWash": {
    "Ultramarine": { "$type": "color", "$value": "#4A5FA8" },
    "SapGreen":    { "$type": "color", "$value": "#6F9B58" },
    "RoseMadder":  { "$type": "color", "$value": "#C9707E" }
  } },
  "Font": { "StorybookSerif": {
    "$type": "fontFamily",
    "$value": ["EB Garamond", "Lora", "Georgia", "serif"]
  } }
}`

/** Madde 12 · 13: Figma mimarisi ve tokenlar */
export function Figma() {
  const [kat, setKat] = useState<Record<KatId, boolean>>({ kagit: true, leke: true, bilesen: true })
  const [ayri, setAyri] = useState(false)
  return (
    <Section
      id="figma"
      madde="Madde 12 · 13 · Figma mimarisi"
      title="Katman katman kâğıt"
      renk="ocre"
      lead="Figma'da üç katman: en altta kâğıt, ortada Multiply kipiyle saydam WebP leke, üstte bileşen. Leke görselleri yüksek çözünürlüklü, alfa kanallı ve beyaz zeminsiz dışa aktarılır; yoksa çoğaltma kipi işe yaramaz."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div className="min-w-0">
          <KatmanSahne kat={kat} ayri={ayri} />
        </div>
        <div className="grid min-w-0 content-start gap-5">
          <h3 className="text-[34px] font-medium italic">Katmanlar</h3>
          {KATMAN.map((k) => (
            <Damla key={k.id} label={`${k.sira} · ${k.ad}`} hint={`${k.kip} · ${k.op}`} checked={kat[k.id]} onChange={(v) => setKat((s) => ({ ...s, [k.id]: v }))} />
          ))}
          <Damla label="Katmanları ayır" hint="Her katmanı yalnız başına göster" checked={ayri} onChange={setAyri} />
        </div>
      </div>

      <div className="mt-12 overflow-x-auto" role="region" aria-label="Figma katman tablosu" tabIndex={0}>
        <div className="sayfa p-5">
          <table className="w-full min-w-[600px] border-collapse text-left text-[16px]" data-figma-katman="">
            <caption className="pb-3 text-left font-baslik text-[30px] leading-none font-medium italic">Katman ağacı</caption>
            <thead>
              <tr className="text-[14px] tracking-widest text-soluk uppercase">
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Sıra
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Katman
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Harmanlama
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Opaklık
                </th>
                <th scope="col" className="py-2 font-semibold">
                  İçerik
                </th>
              </tr>
            </thead>
            <tbody>
              {KATMAN.map((k) => (
                <tr key={k.id} className="border-t border-[var(--cizgi)]">
                  <td className="py-2 pr-3 tabular-nums">{k.sira}</td>
                  <th scope="row" className="py-2 pr-3 font-mono text-[15px] font-semibold">
                    {k.ad}
                  </th>
                  <td className="py-2 pr-3 font-semibold">{k.kip}</td>
                  <td className="py-2 pr-3 tabular-nums">{k.op}</td>
                  <td className="py-2">{k.icerik}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="sayfa p-5">
          <h3 className="text-[30px] leading-none font-medium italic">Dışa aktarım · yüksek çözünürlüklü WebP</h3>
          <dl className="mt-4 grid grid-cols-[minmax(110px,auto)_1fr] gap-x-5 gap-y-2.5 text-[16px]" data-webp-spec="">
            {(
              [
                ['Biçim', 'WebP, alfa kanallı (kalite 85)'],
                ['Ölçek', '2× ve 3× (Figma Export)'],
                ['Geniş leke', '2000 × 1200 px, en çok 180 KB'],
                ['Küçük leke', '512 × 512 px, en çok 40 KB'],
                ['Renk profili', 'sRGB'],
                ['Zemin', 'Saydam. Beyaz ya da opak zemin yok'],
                ['Ad', 'leke-ultramarin-01@2x.webp'],
                ['Yedek', 'Alfa kanallı PNG-8 (eski tarayıcılar)'],
              ] as const
            ).map(([a, b]) => (
              <div key={a} className="contents">
                <dt className="font-semibold text-soluk">{a}</dt>
                <dd className="m-0 [overflow-wrap:anywhere]">{b}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[16px] text-soluk">Bu sayfada lekeler dosya değil, canlı SVG filtresiyle çizilir; Figma dışa aktarımı yalnız üretimde gerekir.</p>
        </div>
        <div className="min-w-0">
          <h3 className="text-[30px] leading-none font-medium italic">Tokenlar</h3>
          <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-3 p-0" data-figma-token="">
            {(
              [
                ['BlendMode/Multiply', 'multiply', 'gündüz ve parşömen'],
                ['BlendMode/Screen', 'screen', 'gece masalı'],
                ['Color/WatercolorWash/Ultramarine', '#4A5FA8', 'var(--ultramarin)'],
                ['Color/WatercolorWash/SapGreen', '#6F9B58', 'var(--yesil)'],
                ['Color/WatercolorWash/RoseMadder', '#C9707E', 'var(--gul)'],
                ['Font/StorybookSerif', 'EB Garamond + Lora', 'font-baslik, font-metin'],
              ] as const
            ).map(([a, b, c]) => (
              <li key={a} className="sayfa flex items-center gap-4 px-4 py-2.5">
                {b.startsWith('#') ? <span className="size-8 shrink-0 rounded-[40%_60%_55%_45%/55%_45%_60%_40%]" style={{ background: b, opacity: 0.8 }} aria-hidden="true" /> : null}
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[14px] font-semibold [overflow-wrap:anywhere]">{a}</p>
                  <p className="text-[16px]">
                    {b} <span className="text-[14px] text-soluk">· {c}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Kod label="Figma token dosyası" className="mt-8" sar={false}>
        {JSON_TOKEN}
      </Kod>
    </Section>
  )
}

/* ─────────── Madde 15: CSS / Tailwind ─────────── */

const SN = ['multiply', 'normal'] as const

/** Madde 15: zemin görselleri kâğıtla mix-blend-multiply ile bütünleşir */
export function Css() {
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)
  const [hesap, setHesap] = useState<Record<string, string>>({})
  useEffect(() => {
    const yaz = () => setHesap({ multiply: a.current ? getComputedStyle(a.current).mixBlendMode : '', normal: b.current ? getComputedStyle(b.current).mixBlendMode : '' })
    yaz()
  }, [])
  const kutu = (k: (typeof SN)[number]) => (
    <figure className="m-0 grid gap-3" key={k}>
      <div className="grid h-[210px] place-items-center overflow-hidden rounded-lg border border-[var(--cizgi)] p-4" style={{ backgroundColor: 'var(--kagit)', backgroundImage: 'var(--dok)', backgroundBlendMode: 'multiply' }}>
        <div ref={k === 'multiply' ? a : b} className={`grid h-full w-full place-items-center bg-white ${k === 'multiply' ? 'mix-blend-multiply' : 'mix-blend-normal'}`} data-css-ornek={k}>
          <FircaDarbe w={220} h={110} tohum={11} renk="ultramarin" op={0.8} kalin={0.8} kuru={0.4} />
        </div>
      </div>
      <figcaption>
        <code className="font-mono text-[15px] font-semibold">{k === 'multiply' ? 'mix-blend-multiply' : 'mix-blend-normal'}</code>
        <span className="mt-1 block text-[16px] text-soluk">
          hesaplanan:{' '}
          <b className="font-mono text-murekkep" data-css-hesap={k}>
            {hesap[k] ?? '…'}
          </b>
        </span>
      </figcaption>
    </figure>
  )
  return (
    <Section id="css" madde="Madde 15 · CSS / Tailwind" title="mix-blend-multiply" renk="ultramarin" lead="Zemin görselleri kâğıda çoğaltma kipiyle oturur. Beyaz zeminli bir görsel bile kâğıdın rengini korur; yalnız pigment çarpılır. Sarmalayıcıya isolate koymak, karışımı o bölümün içinde tutar.">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">{SN.map(kutu)}</div>
      <Kod label="Tailwind ile zemin görseli" className="mt-8" sar={false}>{`<section class="relative isolate bg-kagit bg-blend-multiply">
  <img src="leke-ultramarin@2x.webp" alt=""
       class="absolute inset-0 -z-10 size-full object-cover mix-blend-multiply" />
  <div class="relative bg-sayfa p-8">Metin opak sayfada durur.</div>
</section>`}</Kod>
      <div className="mt-8 overflow-x-auto" role="region" aria-label="CSS sınıfları tablosu" tabIndex={0}>
        <div className="sayfa p-5">
          <table className="w-full min-w-[560px] border-collapse text-left text-[16px]" data-css-tablo="">
            <caption className="pb-3 text-left font-baslik text-[30px] leading-none font-medium italic">Kullanılan sınıflar</caption>
            <tbody>
              {(
                [
                  ['mix-blend-multiply', 'mix-blend-mode: multiply', 'leke görselleri (gündüz, parşömen)'],
                  ['mix-blend-screen', 'mix-blend-mode: screen', 'gece masalı: lacivert zeminde ışıyan boya'],
                  ['bg-blend-multiply', 'background-blend-mode: multiply', 'kâğıt dokusu, zemin rengiyle birleşir'],
                  ['isolate', 'isolation: isolate', 'karışım yalnız bu bölümün içinde kalır'],
                ] as const
              ).map(([a, b, c]) => (
                <tr key={a} className="border-t border-[var(--cizgi)]">
                  <th scope="row" className="py-2 pr-4 font-mono text-[15px] font-semibold">
                    {a}
                  </th>
                  <td className="py-2 pr-4 font-mono text-[15px]">{b}</td>
                  <td className="py-2">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  )
}
