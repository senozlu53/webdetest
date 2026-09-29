import { useEffect, useRef, useState } from 'react'
import { Kesik } from '../components/Kesik'
import { PaperButton, PaperCard, type Sekil } from '../components/Paper'
import { CutoutInput, Secim, Yarik, Yuva } from '../components/Oyuk'
import { Kod, Section } from '../components/ui'

const TONLAR = [
  { id: 'var(--krem)', ad: 'Krem', renk: 'var(--krem)' },
  { id: 'var(--gunes)', ad: 'Güneş', renk: 'var(--gunes)' },
  { id: 'var(--turkuaz)', ad: 'Turkuaz', renk: 'var(--turkuaz)' },
  { id: 'var(--mercan)', ad: 'Mercan', renk: 'var(--mercan)' },
]

/** Madde 14: <PaperCard>, z-endeksi ve <CutoutInput> */
export function Bilesenler() {
  const [nivel, setNivel] = useState(3)
  const [ton, setTon] = useState('var(--gunes)')
  const [sekil, setSekil] = useState<Sekil>('kutu')
  const [delik, setDelik] = useState(true)
  const [duz, setDuz] = useState(false)
  const [sira, setSira] = useState(['Zemin', 'Tepe', 'Ağaç', 'Ayı'])
  const RENK: Record<string, string> = { Zemin: 'var(--leylak)', Tepe: 'var(--yaprak)', Ağaç: 'var(--turkuaz)', Ayı: 'var(--mercan)' }
  const tasi = (i: number, f: number) =>
    setSira((s) => {
      const y = [...s]
      const j = i + f
      if (j < 0 || j >= y.length) return s
      ;[y[i], y[j]] = [y[j], y[i]]
      return y
    })
  const [deger, setDeger] = useState('Minik Ayı')
  return (
    <Section id="bilesenler" madde="Madde 14 · React" renk="var(--gokyuzu)" title="Katman bileşenleri" lead="Bir <PaperCard> iki kaptan oluşur: dış kap gölge filtresini, iç yüz makas izli clip-path'i taşır. Katmanlar z-endeksiyle sıralanır; sıra değişince gölgeler de yer değiştirir.">
      <div className="grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-2">
        <div className="min-w-0">
          <h3 className="text-[clamp(26px,8vw,40px)] [overflow-wrap:anywhere]">{'<PaperCard>'}</h3>
          <div className="mt-6 grid gap-5">
            <Secim<string> legend="Gölge seviyesi" name="pc-nivel" value={String(nivel)} onChange={(v) => setNivel(+v)} options={[1, 2, 3, 4, 5].map((n) => ({ id: String(n), ad: `${n}` }))} />
            <Secim<string> legend="Kâğıt" name="pc-ton" value={ton} onChange={setTon} options={TONLAR} />
            <Secim<Sekil>
              legend="Kesim"
              name="pc-sekil"
              value={sekil}
              onChange={setSekil}
              options={[
                { id: 'kutu', ad: 'Kart' },
                { id: 'dalga', ad: 'Tepe' },
                { id: 'dag', ad: 'Dağ' },
              ]}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Yuva label="Zımba deliği" checked={delik} onChange={setDelik} />
              <Yuva label="Pürüzsüz yüz" checked={duz} onChange={setDuz} />
            </div>
          </div>
          <div className="relative mt-8 h-[220px]" data-papercard-ornek="">
            <PaperCard nivel={1} renk="var(--yaprak)" tohum={2} r={14} dalga={1} className="absolute inset-3" />
            <PaperCard
              nivel={nivel as 1 | 2 | 3 | 4 | 5}
              renk={ton}
              duz={duz}
              sekil={sekil}
              tohum={12}
              r={22}
              dalga={4}
              taban={0.3}
              genlik={0.16}
              delikler={
                delik && sekil === 'kutu'
                  ? [
                      { x: 0.84, y: 0.5, r: 26 },
                      { x: 0.66, y: 0.5, r: 12 },
                    ]
                  : undefined
              }
              className="absolute inset-0"
              yuzClass="flex items-center pl-6"
            >
              <p className="font-baslik text-[30px]">Layer{nivel}</p>
            </PaperCard>
          </div>
          <Kod label="PaperCard JSX" className="mt-6">{`<PaperCard nivel={${nivel}} renk="${ton}"${sekil !== 'kutu' ? ` sekil="${sekil}"` : ''}${duz ? ' duz' : ''}${delik && sekil === 'kutu' ? '\n  delikler={[{ x: .8, y: .5, r: 26 }]}' : ''}>
  …içerik…
</PaperCard>`}</Kod>
        </div>
        <div className="min-w-0">
          <h3 className="text-[clamp(26px,8vw,40px)] [overflow-wrap:anywhere]">Katman sırası (z)</h3>
          <p className="mt-2 text-[16px] font-medium text-soluk">Sıra alttan üste. Düğmeyle bir katmanı yukarı ya da aşağı al; z-endeksi ve gölgeler anında değişir.</p>
          <div className="relative mt-6 h-[230px]" data-z-sahne="">
            {sira.map((ad, i) => (
              <PaperCard key={ad} nivel={(i + 2 > 5 ? 5 : i + 2) as 2 | 3 | 4 | 5} z={i + 1} renk={RENK[ad]} tohum={40 + ad.length} r={16} dalga={3} className="absolute" style={{ left: `${2 + i * 13}%`, top: 6 + i * 34, width: '58%', height: 118 }} yuzClass="p-3" data-z-katman={ad}>
                <p className="etiket">
                  z {i + 1} · {ad}
                </p>
              </PaperCard>
            ))}
          </div>
          <ol className="m-0 mt-5 grid list-none gap-2 p-0" aria-label="Katman listesi">
            {[...sira].reverse().map((ad) => {
              const i = sira.indexOf(ad)
              return (
                <li key={ad} className="flex items-center justify-between gap-3">
                  <span className="font-extrabold">
                    z {i + 1} · {ad}
                  </span>
                  <span className="flex gap-2">
                    <PaperButton renk="var(--bej)" boy="i" aria-label={`${ad} katmanını yukarı al`} disabled={i === sira.length - 1} onClick={() => tasi(i, 1)} tohum={3}>
                      <Kesik ad="ok" boyut={22} nivel={1} halo={false} renk="var(--murekkep)" className="-rotate-90" />
                    </PaperButton>
                    <PaperButton renk="var(--bej)" boy="i" aria-label={`${ad} katmanını aşağı al`} disabled={i === 0} onClick={() => tasi(i, -1)} tohum={4}>
                      <Kesik ad="ok" boyut={22} nivel={1} halo={false} renk="var(--murekkep)" className="rotate-90" />
                    </PaperButton>
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
        <div className="min-w-0">
          <h3 className="text-[clamp(26px,8vw,40px)] [overflow-wrap:anywhere]">{'<PaperButton>'}</h3>
          <p className="mt-2 text-[16px] font-medium text-soluk">Üstüne gelince kâğıt kalkar (gölge Layer4), basınca yüzeye iner (Layer1) ve gölge yönünde kayar.</p>
          <div className="mt-6 flex flex-wrap items-center gap-6" data-dugmeler="">
            <PaperButton renk="var(--gunes)">Güneş</PaperButton>
            <PaperButton renk="var(--turkuaz)">Turkuaz</PaperButton>
            <PaperButton renk="var(--mercan)">Mercan</PaperButton>
            <PaperButton renk="var(--leylak)" boy="k">
              Küçük · 48
            </PaperButton>
            <PaperButton renk="var(--yaprak)" boy="b" ikon={<Kesik ad="yaprak" boyut={30} nivel={1} halo={false} renk="var(--murekkep)" />}>
              Büyük · 64
            </PaperButton>
            <PaperButton renk="var(--gokyuzu)" disabled>
              Pasif
            </PaperButton>
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="text-[clamp(26px,8vw,40px)] [overflow-wrap:anywhere]">{'<CutoutInput>'}</h3>
          <PaperCard nivel={2} duz renk="var(--bej)" tohum={200} r={20} dalga={2} className="mt-6" yuzClass="p-5">
            <CutoutInput etiket="Ayının adı" value={deger} onChange={(e) => setDeger(e.target.value)} ipucu="Yaz, oyuğun içinde krem kâğıt üzerinde belirir." />
          </PaperCard>
          <Kod label="CutoutInput JSX" className="mt-6">{`<CutoutInput etiket="Ayının adı"
  value={deger} onChange={…} />`}</Kod>
        </div>
      </div>
    </Section>
  )
}

/** Madde 12 · 13: Figma'da oyuk ve maske */
export function Figma() {
  const [ic, setIc] = useState([true, true, true])
  const [tohum, setTohum] = useState(3)
  const [r, setR] = useState(24)
  const IC = [
    { ad: 'Inner Shadow 1', v: 'inset 3px 3px 0 rgb(52 34 16 / .4)', ozet: 'x 3 · y 3 · blur 0 · %40' },
    { ad: 'Inner Shadow 2', v: 'inset 4px 7px 9px rgb(52 34 16 / .25)', ozet: 'x 4 · y 7 · blur 9 · %25' },
    { ad: 'Inner Shadow 3', v: 'inset -2px -2px 0 rgb(255 255 255 / .85)', ozet: 'x −2 · y −2 · blur 0 · beyaz %85' },
  ]
  const css =
    IC.filter((_, i) => ic[i])
      .map((x) => x.v)
      .join(', ') || 'none'
  return (
    <Section id="figma" madde="Madde 12 · 13 · Figma" renk="var(--leylak)" title="Oyuk ve maske" lead="Figma'da delik hissi, aynı vektörün üstüne birden çok Inner Shadow ekleyerek yapılır: keskin bir koyu, yumuşak bir koyu ve karşı kenarda bir ışık. Şekil kesimi ise Clip Path / Mask ile.">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="grid min-w-0 gap-5">
          <div className="grid min-h-[210px] place-items-center rounded-[24px] bg-bej p-6">
            <div className="grid h-[120px] w-[240px] place-items-center rounded-[16px_24px_14px_26px/22px_14px_26px_16px] bg-krem font-baslik text-[26px]" style={{ boxShadow: css }} data-oyuk-ornek={ic.filter(Boolean).length}>
              Oyuk
            </div>
          </div>
          {IC.map((x, i) => (
            <Yuva key={x.ad} label={x.ad} hint={x.ozet} checked={ic[i]} onChange={(v) => setIc((s) => s.map((b, j) => (j === i ? v : b)))} />
          ))}
          <Kod label="Inner Shadow CSS" sar={false}>{`box-shadow:\n  ${css.replace(/, /g, ',\n  ')};`}</Kod>
        </div>
        <div className="grid min-w-0 gap-5">
          <div className="relative h-[210px]">
            <PaperCard nivel={1} renk="var(--gunes)" tohum={4} r={16} dalga={1} className="absolute inset-3" />
            <PaperCard nivel={4} renk="var(--gokyuzu)" tohum={tohum} r={r} dalga={7} className="absolute inset-0" delikler={[{ x: 0.5, y: 0.5, r: 34 }]} data-figma-maske="" />
          </div>
          <Yarik label="Clip Path: köşe" value={r} min={0} max={60} onChange={setR} format={(v) => `${v}px`} renk="var(--leylak)" />
          <PaperButton renk="var(--turkuaz)" boy="k" onClick={() => setTohum((t) => t + 1)}>
            Yeni kesim (Seed {tohum + 1})
          </PaperButton>
          <ol className="m-0 grid list-decimal gap-2 pl-5 text-[16px] font-medium">
            <li>Vektörü çiz; kenarlarına Pen ile hafif dalga ver.</li>
            <li>Maske grubu: kâğıdı ve delik dairelerini Subtract ile oy.</li>
            <li>Vektöre Inner Shadow ×3 (yukarıdaki üç satır).</li>
            <li>Dış grup: Drop Shadow ×2 (Shadow/PaperLayer).</li>
            <li>Texture/CraftPaper: Noise, Multiply, %35.</li>
          </ol>
        </div>
      </div>
      <Kod label="Figma tokenları, W3C DTCG" className="mt-8" sar={false}>{`{
  "Shadow":  { "PaperLayer1": { "$type": "shadow", "$value": [
      { "color": "#34221040", "offsetX": "1px", "offsetY": "2px", "blur": "0" },
      { "color": "#34221038", "offsetX": "1px", "offsetY": "2px", "blur": "2px" } ] },
               "PaperLayer2": { "$type": "shadow", "$value": [ … 2px / 4px blur 5px ] } },
  "Texture": { "CraftPaper":  { "$type": "string", "$value": "Noise 35% · Multiply · size 1" } }
}`}</Kod>
    </Section>
  )
}

/** Madde 15: drop-shadow ile SVG maskesine gölge */
export function Css() {
  const [x, setX] = useState(2)
  const [y, setY] = useState(4)
  const [b, setB] = useState(6)
  const [a, setA] = useState(30)
  const ref = useRef<HTMLDivElement>(null)
  const [olcum, setOlcum] = useState('')
  const deger = `drop-shadow(${x}px ${y}px ${b}px rgba(0,0,0,${(a / 100).toString().replace(',', '.')}))`
  useEffect(() => {
    if (ref.current) setOlcum(getComputedStyle(ref.current).filter)
  }, [x, y, b, a])
  return (
    <Section
      id="css"
      madde="Madde 15 · CSS / Tailwind"
      renk="var(--mercan)"
      title="Maskeye gölge"
      lead="SVG maskesiyle delik açılmış bir kutuya box-shadow verilirse gölge yine dikdörtgen kalır. filter: drop-shadow ise alfa kanalını izler: şeklin dışına ve deliklerin içine kesilmiş kenarın gerçek gölgesi düşer."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="grid min-h-[300px] place-items-center rounded-[28px] bg-kraftD/40 p-6">
          <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
            <defs>
              <mask id="pap-maske" maskContentUnits="objectBoundingBox">
                <rect width="1" height="1" fill="white" />
                <circle cx="0.25" cy="0.5" r="0.11" fill="black" />
                <circle cx="0.5" cy="0.5" r="0.11" fill="black" />
                <circle cx="0.75" cy="0.5" r="0.11" fill="black" />
                <circle cx="0.5" cy="0.16" r="0.06" fill="black" />
              </mask>
            </defs>
          </svg>
          <div ref={ref} className="drop-shadow-[2px_4px_6px_rgba(0,0,0,0.3)]" style={{ filter: deger }} data-madde15="">
            <div className="h-[220px] w-[220px] bg-turkuaz" style={{ mask: 'url(#pap-maske)', WebkitMask: 'url(#pap-maske)', borderRadius: '30px 44px 26px 48px / 46px 26px 48px 30px' }} />
          </div>
        </div>
        <div className="grid min-w-0 gap-5">
          <Yarik label="X ofset" value={x} min={-12} max={12} onChange={setX} format={(v) => `${v}px`} renk="var(--mercan)" />
          <Yarik label="Y ofset" value={y} min={-12} max={16} onChange={setY} format={(v) => `${v}px`} renk="var(--mercan)" />
          <Yarik label="Bulanıklık" value={b} min={0} max={24} onChange={setB} format={(v) => `${v}px`} renk="var(--mercan)" />
          <Yarik label="Koyuluk" value={a} min={5} max={70} step={5} onChange={setA} format={(v) => `%${v}`} renk="var(--mercan)" />
          <Kod label="Madde 15 CSS" sar={false}>{`filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.3));`}</Kod>
          <Kod label="Tailwind sınıfı">{'class="drop-shadow-[2px_4px_6px_rgba(0,0,0,0.3)]"'}</Kod>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 rounded-2xl bg-krem p-4 font-mono text-[13.5px] font-semibold" data-olcum="">
            <dt className="font-extrabold">şu an</dt>
            <dd className="m-0 break-all">{deger}</dd>
            <dt className="font-extrabold">hesaplanan</dt>
            <dd className="m-0 break-all" data-olcum-filter="">
              {olcum}
            </dd>
          </dl>
        </div>
      </div>
    </Section>
  )
}
