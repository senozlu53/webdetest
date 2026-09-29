import { useEffect, useRef, useState } from 'react'
import { usePaper, type Doku } from '../lib/store'
import { TUM_SIMGELER, type SimgeAd } from '../lib/simge'
import { Kesik } from '../components/Kesik'
import { PaperButton, PaperCard, type Sekil as SekilTur } from '../components/Paper'
import { Secim, Yarik, Yuva } from '../components/Oyuk'
import { Kod, Section } from '../components/ui'

/** Madde 6 · 12: makas izi ve zımba delikleri */
export function Sekil() {
  const [tohum, setTohum] = useState(5)
  const [r, setR] = useState(26)
  const [dalga, setDalga] = useState(5)
  const [delik, setDelik] = useState(3)
  const [dr, setDr] = useState(24)
  const [tur, setTur] = useState<SekilTur>('kutu')
  const delikler = Array.from({ length: delik }, (_, i) => ({ x: (i + 1) / (delik + 1), y: 0.5 + (i % 2 ? 0.12 : -0.12), r: dr }))
  return (
    <Section
      id="sekil"
      madde="Madde 6 · Şekil dili"
      renk="var(--yaprak)"
      title="Makas izi, zımba deliği"
      lead="Kenarlar cetvelle değil makasla kesilmiş: hafif dalgalı, köşeler her seferinde başka yuvarlaklıkta. Delikler ise zımbayla açılmış: kusursuz daire. İkisi de aynı clip-path içinde; delik, evenodd kuralıyla oyulur."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div className="relative h-[320px] min-w-0" data-sekil-sahne="">
          <PaperCard nivel={1} renk="var(--gunes)" tohum={2} r={20} dalga={2} className="absolute inset-3" />
          <PaperCard nivel={4} renk="var(--pembe)" tohum={tohum} sekil={tur} r={r} dalga={dalga} taban={0.3} genlik={0.16} n={4} delikler={tur === 'kutu' ? delikler : undefined} className="absolute inset-0" data-kesik-ornek="" />
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Secim<SekilTur>
            legend="Kesim"
            name="sk-tur"
            value={tur}
            onChange={setTur}
            options={[
              { id: 'kutu', ad: 'Kart' },
              { id: 'dalga', ad: 'Tepe' },
              { id: 'dag', ad: 'Dağ' },
            ]}
          />
          <Yarik label="Köşe yuvarlaklığı" value={r} min={0} max={60} onChange={setR} format={(v) => `${v}px`} renk="var(--pembe)" />
          <Yarik label="Makas titremesi" value={dalga} min={0} max={14} onChange={setDalga} format={(v) => `${v}px`} renk="var(--pembe)" />
          <Yarik label="Zımba deliği" value={delik} min={0} max={6} onChange={setDelik} format={(v) => `${v} adet`} renk="var(--gunes)" />
          <Yarik label="Delik çapı" value={dr} min={10} max={44} onChange={setDr} format={(v) => `${v * 2}px`} renk="var(--gunes)" />
          <PaperButton renk="var(--turkuaz)" boy="k" onClick={() => setTohum((t) => t + 1)}>
            Yeniden kes
          </PaperButton>
        </div>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
        {[
          { ad: 'Asimetrik kavis', renk: 'var(--leylak)', sekil: 'kutu' as const, o: { r: 42, dalga: 8 } },
          { ad: 'Zımbalı şerit', renk: 'var(--turkuaz)', sekil: 'kutu' as const, o: { r: 10, dalga: 1, delikler: [0.14, 0.32, 0.5, 0.68, 0.86].map((x) => ({ x, y: 0.5, r: 13 })) } },
          { ad: 'Topografik dağ', renk: 'var(--yaprak)', sekil: 'dag' as const, o: { taban: 0.4, genlik: 0.3, n: 3 } },
        ].map((x, i) => (
          <figure key={x.ad} className="m-0 grid content-start gap-3">
            <div className="relative h-[170px]">
              <PaperCard nivel={1} renk="var(--gunes)" tohum={i + 40} r={14} dalga={1} className="absolute inset-2" />
              <PaperCard nivel={3} renk={x.renk} tohum={70 + i * 9} sekil={x.sekil} {...x.o} className="absolute inset-0" />
            </div>
            <figcaption className="font-baslik text-[24px] leading-none">{x.ad}</figcaption>
          </figure>
        ))}
      </div>
      <Kod label="Kesim yolu" className="mt-8" sar={false}>{`clip-path: path(evenodd, "M12 0 C…Z   M ${dr} …A ${dr} ${dr}…Z");
/* ilk yol: makas izi, ikinci yol: zımba deliği */`}</Kod>
    </Section>
  )
}

const KATMAN_R = ['var(--gokyuzu)', 'var(--yaprak)', 'var(--gunes)', 'var(--mercan)', 'var(--leylak)']

/** Madde 7 · 13 · 15: sistemin kalbi, gölge */
export function Golge() {
  const s = usePaper()
  const [nivel, setNivel] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [ozet, setOzet] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const e = ref.current
    if (e) setOzet(getComputedStyle(e).filter)
  }, [nivel, s.isik, s.kontrast])
  return (
    <Section
      id="golge"
      madde="Madde 7 · Z-ekseni ve gölge"
      renk="var(--leylak)"
      title="Katmanı gölge ayırır"
      lead="Her kâğıt, altındakinden iki gölgeyle ayrılır: kenarı gösteren keskin (blur 0) ve yüksekliği gösteren yumuşak. Gölge kesim şeklini izler (drop-shadow); delikli katmanda deliğin içine düşen gölge kendiliğinden iç gölge olur. Işık yönünü değiştir, bütün sayfanın gölgesi birlikte döner."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="relative h-[360px] min-w-0 rounded-[24px] bg-kraftD/40" data-golge-yigin="">
          {KATMAN_R.map((c, i) => (
            <PaperCard key={c} nivel={(i + 1) as 1 | 2 | 3 | 4 | 5} renk={c} tohum={80 + i} r={18} dalga={3} className="absolute" style={{ left: `${4 + i * 8.5}%`, top: 16 + i * 30, width: '62%', height: '44%' }} yuzClass="p-4">
              <p className="etiket">Katman {i + 1}</p>
            </PaperCard>
          ))}
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Secim<string> legend="Seviye" name="golge-nivel" value={String(nivel)} onChange={(v) => setNivel(+v as 1 | 2 | 3 | 4 | 5)} options={[1, 2, 3, 4, 5].map((n) => ({ id: String(n), ad: `Layer${n}` }))} />
          <div ref={ref} style={{ filter: `var(--kenar) var(--sh-${nivel})` }} className="w-max max-w-full" data-golge-ornek={nivel}>
            <div className="grid h-[90px] w-[180px] place-items-center rounded-[18px_26px_14px_28px/22px_14px_28px_16px] bg-gunes font-baslik text-[24px]">Layer{nivel}</div>
          </div>
          <Yarik label="Gölge yönü" value={s.isik} min={0} max={359} step={9} onChange={s.setIsik} format={(v) => `${v}°`} renk="var(--leylak)" />
          <Kod label="Hesaplanan filter" className="!text-[12.5px]">{`filter: ${ozet};`}</Kod>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <figure className="m-0 grid gap-3">
          <div className="grid h-[190px] place-items-center rounded-[24px] bg-kraftD/40">
            <div style={{ boxShadow: '4px 6px 8px rgba(52,34,16,.45)' }} data-yanlis="">
              <div className="grid h-[120px] w-[220px] place-items-center bg-mercan font-baslik text-[22px]" style={{ clipPath: 'path(evenodd, "M0 16C40 0 90 24 130 8C170 -6 210 14 220 4V104C190 124 150 100 110 118C60 132 30 108 0 120Z")' }}>
                box-shadow
              </div>
            </div>
          </div>
          <figcaption className="text-[16px] font-medium">
            <b>Yanlış:</b> box-shadow kutuyu izler, clip-path onu kırpar; gölge ya yok olur ya dikdörtgen kalır.
          </figcaption>
        </figure>
        <figure className="m-0 grid gap-3">
          <div className="grid h-[190px] place-items-center rounded-[24px] bg-kraftD/40">
            <div style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))' }} data-dogru="">
              <div className="grid h-[120px] w-[220px] place-items-center bg-turkuaz font-baslik text-[22px]" style={{ clipPath: 'path(evenodd, "M0 16C40 0 90 24 130 8C170 -6 210 14 220 4V104C190 124 150 100 110 118C60 132 30 108 0 120Z")' }}>
                drop-shadow
              </div>
            </div>
          </div>
          <figcaption className="text-[16px] font-medium">
            <b>Doğru:</b> filter: drop-shadow dış kapta; gölge kesilmiş şeklin kendi kenarını izler.
          </figcaption>
        </figure>
      </div>
      <ul className="m-0 mt-10 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-5">
        {[1, 2, 3, 4, 5].map((n) => (
          <li key={n} className="grid gap-2">
            <div style={{ filter: `var(--sh-${n})` }} className="w-max">
              <div className="h-12 w-[100px] rounded-[10px_16px_9px_18px/14px_9px_18px_10px] bg-krem" />
            </div>
            <p className="font-mono text-[12px] font-bold [overflow-wrap:anywhere]">Shadow/PaperLayer{n}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

const DOKU_TIP: { id: Doku; ad: string; not: string }[] = [
  { id: 'karton', ad: 'Geri dönüştürülmüş karton', not: 'yatay lif, ince benek, oluk çizgisi' },
  { id: 'suluboya', ad: 'Pütürlü suluboya kâğıdı', not: 'kaba tane ve büyük leke' },
  { id: 'duz', ad: 'Düz', not: 'doku kapalı' },
]

/** Madde 8 · 18: dokular yalnız alt ve süs katmanlarda; en üst katman pürüzsüz */
export function Doku() {
  const s = usePaper()
  return (
    <Section
      id="doku"
      madde="Madde 8 · Doku ve yüzey"
      renk="var(--pembe)"
      title="Karton, suluboya, düz"
      lead="Doku SVG gürültüsünden gelir (resim dosyası yok) ve çarpma (multiply) ile rengin üstüne biner. Kraft zemin, süs katmanları ve ikon tabanları dokulu; bölüm levhaları ve metin taşıyan kartlar her zaman pürüzsüz."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-3">
          {DOKU_TIP.map((d, i) => (
            <li key={d.id} className="grid content-start gap-3">
              <PaperCard
                nivel={s.doku === d.id ? 4 : 2}
                renk={['var(--gunes)', 'var(--gokyuzu)', 'var(--mercan)'][i]}
                tohum={90 + i}
                r={18}
                dalga={3}
                yuzClass="h-[150px]"
                yuzStyle={d.id === 'karton' ? { backgroundImage: 'var(--dok-benek), var(--dok-lif), repeating-linear-gradient(0deg, rgb(120 78 34 / 0.06) 0 1px, transparent 1px 5px)' } : d.id === 'suluboya' ? { backgroundImage: 'var(--dok-sulu), var(--dok-leke)' } : { backgroundImage: 'none' }}
                data-doku-kutu={d.id}
              >
                {s.doku === d.id ? <span className="etiket m-3 inline-block rounded-md bg-krem px-2 py-0.5">Seçili</span> : null}
              </PaperCard>
              <div>
                <p className="font-baslik text-[22px] leading-tight">{d.ad}</p>
                <p className="mt-1 text-[15px] font-medium text-soluk">{d.not}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Secim<Doku>
            legend="Sayfa dokusu"
            name="doku-sec"
            value={s.doku}
            onChange={s.setDoku}
            options={[
              { id: 'karton', ad: 'Karton', renk: 'var(--kraft)' },
              { id: 'suluboya', ad: 'Suluboya', renk: 'var(--gokyuzu)' },
              { id: 'duz', ad: 'Düz', renk: 'var(--bej)' },
            ]}
          />
          <figure className="m-0 grid gap-2" aria-label="Katmanların kesiti" data-kesit="">
            <PaperCard nivel={3} renk="var(--krem)" duz tohum={5} r={10} dalga={1.5} yuzClass="px-4 py-3">
              <p className="text-[15px] font-bold">3 · Pürüzsüz krem kâğıt: yazı burada</p>
            </PaperCard>
            <PaperCard nivel={2} renk="var(--turkuaz)" tohum={6} r={10} dalga={1.5} yuzClass="px-4 py-3">
              <p className="text-[15px] font-bold">2 · Dokulu pastel: süs, ikon tabanı</p>
            </PaperCard>
            <PaperCard nivel={1} renk="var(--kraft)" tohum={7} r={10} dalga={1.5} yuzClass="px-4 py-3">
              <p className="text-[15px] font-bold">1 · Kraft karton: zemin</p>
            </PaperCard>
          </figure>
        </div>
      </div>
    </Section>
  )
}

/** Madde 9: kâğıttan kesilmiş silüet ikonlar */
export function Ikonlar() {
  const [boyut, setBoyut] = useState(64)
  const [halo, setHalo] = useState(true)
  const [nivel, setNivel] = useState(2)
  return (
    <Section
      id="ikonlar"
      madde="Madde 9 · İkonografi"
      renk="var(--gunes)"
      title="Kâğıttan silüetler"
      lead="Her ikon birkaç kâğıt parçasının üst üste yapıştırılması: altta krem bir kenar (halo), üstte renkli katmanlar; her katman bir alttakine kendi gölgesini düşürür. Gözler, burun ve damarlar kesilmiş deliktir."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_300px]">
        <ul className="m-0 grid min-w-0 list-none grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-4 p-0" data-ikon-izgara="">
          {TUM_SIMGELER.map((a: SimgeAd, i) => (
            <PaperCard as="li" key={a} nivel={1} renk={['var(--mercan)', 'var(--gunes)', 'var(--turkuaz)', 'var(--gokyuzu)', 'var(--leylak)', 'var(--yaprak)', 'var(--pembe)'][i % 7]} tohum={100 + i} r={14} dalga={2} adim={70} yuzClass="grid justify-items-center gap-2 px-2 py-4 text-center">
              <span className="grid h-[84px] place-items-center">
                <Kesik ad={a} boyut={boyut} halo={halo} nivel={nivel as 1 | 2 | 3 | 4 | 5} />
              </span>
              <span className="rounded-md bg-krem px-2 text-[14px] font-extrabold">{a}</span>
            </PaperCard>
          ))}
        </ul>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Yarik label="Boy" value={boyut} min={32} max={88} step={4} onChange={setBoyut} format={(v) => `${v}px`} renk="var(--gunes)" />
          <Yarik label="Gölge seviyesi" value={nivel} min={1} max={5} onChange={setNivel} format={(v) => `Layer${v}`} renk="var(--gunes)" />
          <Yuva label="Krem kenar" hint="Silüetin altındaki ikinci kâğıt." checked={halo} onChange={setHalo} />
        </div>
      </div>
    </Section>
  )
}
