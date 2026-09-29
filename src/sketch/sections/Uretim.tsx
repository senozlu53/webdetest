import { useEffect, useMemo, useRef, useState } from 'react'
import { Cizim } from '../components/Rough'
import { Ikon } from '../components/Icons'
import { Not, type NotTur } from '../components/Not'
import { RoughBox } from '../components/Rough'
import { Aralik, Anahtar, KaralamaKutu, RoughButton, Secim, type BtnTur } from '../components/Controls'
import { Kod, Section } from '../components/ui'

const NOT_TURLER: { id: NotTur; ad: string }[] = [
  { id: 'underline', ad: 'altı çizili' },
  { id: 'box', ad: 'kutu' },
  { id: 'circle', ad: 'daire' },
  { id: 'highlight', ad: 'fosforlu' },
  { id: 'strike-through', ad: 'çizik' },
  { id: 'crossed-off', ad: 'karalanmış' },
  { id: 'bracket', ad: 'ayraç' },
]

/** Madde 14: <RoughBox>, <RoughButton>, <Not>, <KaralamaKutu> */
export function Bilesenler() {
  const [tur, setTur] = useState<NotTur>('underline')
  const [tekrar, setTekrar] = useState(0)
  const [ic, setIc] = useState(false)
  return (
    <Section id="bilesenler" madde="Madde 14 · React" title="Dört bileşen" lead="rough.js çizgileri React'in kendi SVG'sine yazar (canvas yok, tohumlu, yeniden çizimde aynı sonuç). Metin işaretleri react-rough-notation ile gelir. Çizim hep aria-hidden'dır; içerik olduğu gibi erişilebilir kalır.">
      <div className="grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-2">
        <div className="min-w-0">
          <h3 className="text-[44px]">{'<RoughButton>'}</h3>
          <p className="mt-2 text-[16px] text-soluk">Üç tür, iki boy, ikonlu, pasif. Üstüne gelince ve odakta üç deneme kare kare titrer; basınca 2 piksel kayar.</p>
          <div className="mt-6 flex flex-wrap items-center gap-5" data-dugmeler="">
            {(['cizgi', 'murekkep', 'kirmizi'] as BtnTur[]).map((t) => (
              <RoughButton key={t} tur={t}>
                {t === 'cizgi' ? 'Çizgi' : t === 'murekkep' ? 'Mürekkep' : 'Kırmızı'}
              </RoughButton>
            ))}
            <RoughButton boy="k" ikon={<Ikon ad="kalem" boyut={22} />}>
              Küçük · 48
            </RoughButton>
            <RoughButton boy="b" tur="murekkep" ikon={<Ikon ad="fincan" boyut={30} renk="#f9f6f0" />}>
              Büyük · 62
            </RoughButton>
            <RoughButton disabled>Pasif</RoughButton>
          </div>
          <Kod label="RoughButton JSX" className="mt-6">{`<RoughButton tur="murekkep" boy="b"
  ikon={<Ikon ad="fincan" />}>
  Menüye bak
</RoughButton>`}</Kod>
        </div>
        <div className="min-w-0">
          <h3 className="text-[44px]">{'<Not>'}</h3>
          <p className="mt-2 text-[16px] text-soluk">react-rough-notation. Yedi işaret türü; hareket kapalıysa animasyonsuz.</p>
          <div className="mt-5">
            <Secim<NotTur>
              legend="Tür"
              name="not-tur"
              value={tur}
              onChange={(t) => {
                setTur(t)
                setTekrar((x) => x + 1)
              }}
              options={NOT_TURLER.map((t) => ({ id: t.id, ad: t.ad }))}
            />
          </div>
          <div className="mt-6 grid min-h-[110px] place-items-center rounded-lg border-2 border-dashed border-komur/40 p-6" data-not-ornek={tur}>
            <p className="text-center font-el text-[52px] leading-none font-bold text-murekkep" key={tekrar}>
              <Not tur={tur} renk={tur === 'highlight' ? '#f6c9cc' : '#e63946'} pad={tur === 'circle' ? 8 : 4}>
                sabah kahvesi
              </Not>
            </p>
          </div>
          <RoughButton boy="k" className="mt-4" onClick={() => setTekrar((x) => x + 1)} ikon={<Ikon ad="kalem" boyut={22} />}>
            Yeniden çiz
          </RoughButton>
        </div>
        <div className="min-w-0">
          <h3 className="text-[44px]">{'<RoughBox>'}</h3>
          <p className="mt-2 text-[16px] text-soluk">Herhangi bir elemanı sarar; ölçüsünü ResizeObserver ile izler, çerçeveyi o ölçüde çizer.</p>
          <RoughBox tohum={601} kare={3} sekil="yuvarlak" r={16} cizgi={2.4} dolgu={ic ? '#e63946' : undefined} dolguTip="hachure" aralik={9} className="tarama tarama-mavi mt-6 grid min-h-[150px] place-items-center bg-kagit/0 p-6 text-center" data-roughbox-ornek="">
            <p className="rounded bg-kagit px-3 font-el text-[42px] leading-none font-bold text-murekkep">Kutuya sarılmış</p>
          </RoughBox>
          <div className="mt-6">
            <Anahtar label="Kırmızı tarama dolgusu" checked={ic} onChange={setIc} />
          </div>
          <Kod label="RoughBox JSX" className="mt-6">{`<RoughBox tohum={601} sekil="yuvarlak" r={16}
  cizgi={2.4} kare={3} dolgu="#e63946">
  …içerik…
</RoughBox>`}</Kod>
        </div>
        <div className="min-w-0">
          <h3 className="text-[44px]">{'<KaralamaKutu>'}</h3>
          <p className="mt-2 text-[16px] text-soluk">Gerçek input; üstüne çizilen kutu ve pathLength=1 zikzak. Kare kare (steps(8)) dolar.</p>
          <div className="mt-6 grid gap-1">
            <KaralamaKutu label="Bir kutu" checked={ic} onChange={setIc} />
            <KaralamaKutu label="Aynı durum, ikinci kutu" hint="İki kutu da aynı state'i taşır." checked={ic} onChange={setIc} />
          </div>
          <Kod label="KaralamaKutu JSX" className="mt-6">{`<KaralamaKutu label="Bir kutu"
  checked={ic} onChange={setIc} />`}</Kod>
        </div>
      </div>
    </Section>
  )
}

const FIG: { d: string }[] = [{ d: 'M10 14 H190 V106 H10 Z' }, { d: 'M30 46 H110' }, { d: 'M30 66 H150' }, { d: 'M138 40 A14 14 0 1 0 166 40 A14 14 0 1 0 138 40' }, { d: 'M30 90 H74 V100 H30 Z' }]

/** Madde 12 · 13: Figma'da Roughen ve Stroke → Round */
export function Figma() {
  const [miktar, setMiktar] = useState(1.6)
  const [uc, setUc] = useState<'round' | 'butt'>('round')
  return (
    <Section id="figma" madde="Madde 12 · 13 · Figma" title="Düz vektör, pürüzlü kalem" lead="Figma'da çizgiyi kimse titretmez; düz vektör çizilir, Roughen eklentisi (Amount, Segment size) üzerinden geçer. Kalem ucu her zaman Round, birleşim Round. Aşağıda aynı vektör iki hâliyle.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2">
          {[0, miktar].map((m, i) => (
            <figure key={i} className="m-0 grid content-start gap-3">
              <RoughBox tohum={700 + i} kare={i ? 3 : 1} sekil="yuvarlak" r={12} cizgi={1.6} className="p-3">
                <Cizim w={200} h={120} parcalar={FIG.map((f) => ({ ...f, kusur: m / 1 }))} tohum={12} kusur={1} sw={3} className="h-auto w-full" etiket={i ? `Roughen uygulanmış vektör, miktar ${miktar}` : 'Düz vektör'} />
              </RoughBox>
              <figcaption className="text-[16px]">
                <b className="font-el text-[30px] leading-none text-murekkep">{i ? `Roughen · ${miktar.toFixed(1).replace('.', ',')}` : 'Düz vektör'}</b>
                <span className="mt-1 block text-soluk">{i ? 'Amount ' + miktar.toFixed(1).replace('.', ',') + ', Segment size 12' : 'Amount 0: cetvelle çizilmiş'}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Aralik label="Roughen · Amount" value={miktar} min={0.2} max={3.5} step={0.1} onChange={setMiktar} format={(v) => v.toFixed(1).replace('.', ',')} />
          <Secim<'round' | 'butt'>
            legend="Stroke ucu"
            name="fig-uc"
            value={uc}
            onChange={setUc}
            options={[
              { id: 'round', ad: 'Round (kural)' },
              { id: 'butt', ad: 'Butt' },
            ]}
          />
          <svg viewBox="0 0 200 60" className="block h-auto w-full" role="img" aria-label={`Kalın çizgi, uç ${uc === 'round' ? 'yuvarlak' : 'düz'}`} data-uc={uc}>
            <line x1="26" y1="22" x2="174" y2="20" stroke="#2b2b2b" strokeWidth="16" strokeLinecap={uc} />
            <line x1="26" y1="46" x2="174" y2="44" stroke="#e63946" strokeWidth="6" strokeLinecap={uc} />
          </svg>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ol className="m-0 grid list-none gap-3 p-0 text-[17px]" aria-label="Figma iş akışı">
          {[
            ['Düz vektörü çiz', 'Pen ile; köşeleri ızgaraya oturtma.'],
            ['Roughen', 'Amount 1,6 · Segment size 12 · bir kez.'],
            ['Stroke → Round', 'Cap ve Join: Round; ağırlık 2 px.'],
            ['Texture/PaperBase', 'Zemin katmanına gürültü: 40%, size 1.'],
            ['Bileşen yap', 'Aynı vektörü üç kez Roughen et (Seed 1-2-3), varyant "Kare".'],
          ].map(([a, b], i) => (
            <li key={a} className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center el-kose font-daktilo text-[16px] font-bold">{i + 1}</span>
              <span className="min-w-0 pt-1">
                <b>{a}.</b> {b}
              </span>
            </li>
          ))}
        </ol>
        <Kod label="Figma tokenları, W3C DTCG" sar={false}>{`{
  "Stroke":  { "RoughBorder": { "$type": "strokeStyle", "$value": {
      "lineCap": "round", "lineJoin": "round", "width": "2px", "roughen": 1.6 } } },
  "Texture": { "PaperBase":   { "$type": "string", "$value": "noise 40% size 1 #2B2B2B" } },
  "Color":   { "Charcoal":    { "$type": "color",  "$value": "#2B2B2B" },
               "Ink":         { "$type": "color",  "$value": "#1D3557" },
               "RedPencil":   { "$type": "color",  "$value": "#E63946" } }
}`}</Kod>
      </div>
    </Section>
  )
}

const HAZIR: { ad: string; deger: string }[] = [
  { ad: 'Tanımdaki', deger: '255px 15px 225px 15px / 15px 225px 15px 255px' },
  { ad: 'Ters', deger: '15px 225px 15px 255px / 255px 15px 225px 15px' },
  { ad: 'Yumurta', deger: '60% 40% 55% 45% / 50% 60% 40% 50%' },
  { ad: 'Çakıl', deger: '45% 55% 42% 58% / 58% 40% 60% 42%' },
]

/** Madde 15: asimetrik border-radius, birebir */
export function Css() {
  const ref = useRef<HTMLDivElement>(null)
  const [secili, setSecili] = useState(0)
  const [olcum, setOlcum] = useState('')
  const deger = HAZIR[secili].deger
  useEffect(() => {
    const e = ref.current
    if (e) setOlcum(getComputedStyle(e).borderRadius)
  }, [secili])
  const tw = useMemo(() => `rounded-[${deger.replace(/ \/ /g, '/').replace(/ /g, '_')}]`, [deger])
  return (
    <Section id="css" madde="Madde 15 · CSS / Tailwind" title="Tek satır, sekiz sayı" lead="Dört köşenin yatay ve dikey yarıçapı ayrı ayrı verilir; büyük değerler (255px) tarayıcıda kutuya sığacak kadar kısılır, geriye elle yuvarlanmış bir kutu kalır. JS yok, resim yok.">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="grid gap-6">
          <div ref={ref} className="grid min-h-[210px] place-items-center border-[3px] border-komur p-6 text-center" style={{ borderRadius: deger }} data-madde15="">
            <p className="font-el text-[44px] leading-none font-bold text-murekkep">Elle yuvarlanmış</p>
          </div>
          <Secim<string> legend="Yarıçap" name="css-yaricap" value={String(secili)} onChange={(v) => setSecili(+v)} options={HAZIR.map((h, i) => ({ id: String(i), ad: h.ad }))} />
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-5">
          <Kod label="Madde 15 CSS" sar={false}>{`border-radius: ${deger};`}</Kod>
          <Kod label="Tailwind sınıfı">{`class="border-[3px] border-komur ${tw}"`}</Kod>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 rounded-lg border-2 border-komur p-5 font-daktilo text-[14px]" data-olcum="">
            <dt className="font-bold">border-radius</dt>
            <dd className="m-0 break-all" data-olcum-radius="">
              {olcum}
            </dd>
          </dl>
          <p className="text-[15px] text-soluk">
            Çerçeveyi rough.js çizdiği yerlerde bu satıra gerek yoktur; çip, etiket ve tablo gibi hafif öğelerde JS'siz alternatif olarak kullanılır (<code className="font-daktilo">.el-kose</code>).
          </p>
        </div>
      </div>
    </Section>
  )
}
