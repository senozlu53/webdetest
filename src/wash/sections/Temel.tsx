import { useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { useWash } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { yumusat, mulberry32 } from '../lib/firca'
import { Damla, FircaAralik, Kod, Section, Secim } from '../components/ui'
import { WatercolorBackground, PIGMENT, PIGMENT_AD, type LekeTanim } from '../components/Leke'
import { WashButton } from '../components/Firca'
import { Ikon } from '../components/Ikon'

type Ana = 'ultramarin' | 'yesil' | 'gul' | 'ocre'
const HEX: Record<Ana, string> = { ultramarin: '#4A5FA8', yesil: '#6F9B58', gul: '#C9707E', ocre: '#D2A24C' }
const ROL: Record<Ana, string> = { ultramarin: 'Gökyüzü, su, gece', yesil: 'Yaprak, tepe, umut', gul: 'Gül, akşam, sıcaklık', ocre: 'Işık, buğday, bal (yardımcı)' }
const TOKEN: Record<Ana, string> = { ultramarin: 'Color/WatercolorWash/Ultramarine', yesil: 'Color/WatercolorWash/SapGreen', gul: 'Color/WatercolorWash/RoseMadder', ocre: 'Color/WatercolorWash/YellowOchre' }

export const TEMA_RENK = {
  gunduz: { ad: 'Gündüz', kagit: '#F6F0E1', sayfa: '#FBF7EC', ink: '#2B2A3A', soluk: '#57526B', ult: '#2F3F86', yes: '#3F6B2E', gul: '#9C3F55' },
  parsomen: { ad: 'Parşömen', kagit: '#EBDAB2', sayfa: '#F3E6C4', ink: '#33261A', soluk: '#5E4A33', ult: '#2C3A7A', yes: '#3A5F2A', gul: '#8C3A4C' },
  gece: { ad: 'Gece masalı', kagit: '#14203D', sayfa: '#1C2A4E', ink: '#F1E7CE', soluk: '#B9B9D0', ult: '#9FB0F0', yes: '#A8D08F', gul: '#F0A9B5' },
} as const

/** Madde 4: saydam, doygunluğu düşük pigmentler */
export function Palet() {
  const { duyur } = useWash()
  const [kar, setKar] = useState<Record<'u' | 'y' | 'g', boolean>>({ u: true, y: false, g: true })
  const kopyala = (hex: string) => {
    navigator.clipboard?.writeText(hex).then(
      () => duyur(`${hex} kopyalandı`),
      () => duyur(`Kopyalanamadı, değer: ${hex}`),
    )
  }
  const karisim = (() => {
    const k = `${kar.u ? 'u' : ''}${kar.y ? 'y' : ''}${kar.g ? 'g' : ''}`
    return ({ '': 'Boş kâğıt', u: 'Saf Ultramarin', y: 'Saf Sap Yeşili', g: 'Saf Gül Kökü', uy: 'Deniz yeşili (Ultramarin + Sap Yeşili)', ug: 'Erguvan (Ultramarin + Gül Kökü)', yg: 'Toprak kahvesi (Sap Yeşili + Gül Kökü)', uyg: 'Nötr gri-kahve (üçü birden)' } as Record<string, string>)[k]
  })()
  const KAR: LekeTanim[] = [
    ...(kar.u ? [{ renk: 'ultramarin' as const, x: 36, y: 40, w: 56, h: 64, tohum: 3, dalga: 0.14, gecikme: 0 }] : []),
    ...(kar.y ? [{ renk: 'yesil' as const, x: 64, y: 44, w: 56, h: 64, tohum: 7, dalga: 0.14, gecikme: 0 }] : []),
    ...(kar.g ? [{ renk: 'gul' as const, x: 50, y: 66, w: 56, h: 60, tohum: 12, dalga: 0.14, gecikme: 0 }] : []),
  ]
  const CIFT: [string, string, string][] = (['gunduz', 'parsomen', 'gece'] as const).flatMap((t) => {
    const v = TEMA_RENK[t]
    return [
      [`${v.ad} · mürekkep / sayfa`, v.ink, v.sayfa],
      [`${v.ad} · ikincil metin / sayfa`, v.soluk, v.sayfa],
      [`${v.ad} · bağlantı (ultramarin) / kâğıt`, v.ult, v.kagit],
      [`${v.ad} · gül vurgu / sayfa`, v.gul, v.sayfa],
    ] as [string, string, string][]
  })
  CIFT.push(['Ham ultramarin (#4A5FA8) metin olarak / gündüz sayfa', '#4A5FA8', '#FBF7EC'])
  return (
    <Section
      id="palet"
      madde="Madde 4 · Renk paleti"
      title="Üç pigment, bir kâğıt"
      renk="gul"
      lead="Ultramarin, Sap Yeşili ve Gül Kökü: saydam, doygunluğu düşük, su katıldıkça açılan. Boya kâğıda çoğaltma (multiply) kipiyle biner; üst üste sürülünce yeni renkler doğar. Metin rengi ise boyadan türemez: koyu mürekkep, ve bağlantılarda pigmentin koyu tonu."
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(HEX) as Ana[]).map((k, i) => (
          <li key={k} className="grid min-w-0 grid-cols-1 content-start gap-3">
            <div className="relative h-[170px]">
              <WatercolorBackground lekeler={[{ renk: k, x: 50, y: 50, w: 92, h: 92, tohum: 5 + i * 4, dalga: 0.15, gecikme: i * 0.3 }]} vb={[400, 300]} />
              <button type="button" onClick={() => kopyala(HEX[k])} aria-label={`${PIGMENT_AD[k]} ${HEX[k]}, kopyala`} className="sayfa absolute right-3 bottom-3 min-h-11 px-3 py-1 font-mono text-[14px] font-semibold" data-renk-ornek={HEX[k]}>
                {HEX[k]}
              </button>
            </div>
            <div>
              <p className="font-baslik text-[30px] leading-none font-medium italic">{PIGMENT_AD[k]}</p>
              <p className="mt-1 font-mono text-[13px] text-soluk [overflow-wrap:anywhere]">{TOKEN[k]}</p>
              <p className="mt-1.5 text-[17px]">{ROL[k]}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-14 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative h-[320px] min-w-0" data-karisim="">
          <WatercolorBackground key={`${kar.u}${kar.y}${kar.g}`} lekeler={KAR} vb={[600, 320]} sure={1.6} />
        </div>
        <div className="grid min-w-0 content-start gap-5">
          <h3 className="text-[34px] font-medium italic">Glazing: katman katman</h3>
          <Damla label="Ultramarin" checked={kar.u} onChange={(v) => setKar((s) => ({ ...s, u: v }))} />
          <Damla label="Sap Yeşili" checked={kar.y} onChange={(v) => setKar((s) => ({ ...s, y: v }))} />
          <Damla label="Gül Kökü" checked={kar.g} onChange={(v) => setKar((s) => ({ ...s, g: v }))} />
          <p className="sayfa px-4 py-3 text-[18px] font-semibold" data-karisim-ad="">
            {karisim}
          </p>
        </div>
      </div>

      <div className="mt-14 overflow-x-auto" role="region" aria-label="Kontrast tablosu" tabIndex={0}>
        <div className="sayfa p-5">
          <table className="w-full min-w-[520px] border-collapse text-[16px]" data-kontrast-tablo="">
            <caption className="pb-3 text-left font-baslik text-[30px] leading-none font-medium italic">Kontrast · WCAG 2.2</caption>
            <tbody>
              {CIFT.map(([a, y, z]) => {
                const k = kontrast(y, z)
                return (
                  <tr key={a} className="border-t border-[var(--cizgi)]">
                    <th scope="row" className="py-2 pr-3 text-left font-semibold">
                      <span className="mr-3 inline-grid size-9 place-items-center rounded-[4px_10px_4px_10px] align-middle font-baslik text-[22px] leading-none italic" style={{ background: z, color: y, boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / .15)' }} aria-hidden="true">
                        A
                      </span>
                      {a}
                    </th>
                    <td className="py-2 text-right tabular-nums">{oran(k)}</td>
                    <td className="py-2 pl-3 text-right font-semibold">{k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : k >= 3 ? 'Büyük yazı' : 'Yetmez'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  )
}

interface Darbe {
  id: number
  pts: [number, number][]
  renk: Ana
  op: number
  w: number
}
const SAHNE_W = 800
const SAHNE_H = 450

/** Madde 6 · 11: serbest fırça. Sürükle, boya kâğıda yayılır */
export function Boya() {
  const { duyur } = useWash()
  const [renk, setRenk] = useState<Ana>('ultramarin')
  const [su, setSu] = useState(0.6)
  const [kalin, setKalin] = useState(26)
  const [darbeler, setDarbeler] = useState<Darbe[]>([])
  const svg = useRef<SVGSVGElement>(null)
  const aktif = useRef<number | null>(null)
  const sayac = useRef(1)
  const noktaAl = (e: RPointerEvent<SVGSVGElement>): [number, number] => {
    const r = svg.current!.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * SAHNE_W, ((e.clientY - r.top) / r.height) * SAHNE_H]
  }
  const basla = (e: RPointerEvent<SVGSVGElement>) => {
    if (darbeler.length >= 80) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = noktaAl(e)
    const id = sayac.current++
    aktif.current = id
    setDarbeler((l) => [...l, { id, pts: [p], renk, op: su, w: kalin }])
  }
  const surukle = (e: RPointerEvent<SVGSVGElement>) => {
    if (aktif.current == null) return
    const p = noktaAl(e)
    const id = aktif.current
    setDarbeler((l) =>
      l.map((d) => {
        if (d.id !== id) return d
        const son = d.pts[d.pts.length - 1]
        return Math.hypot(p[0] - son[0], p[1] - son[1]) < 4 ? d : { ...d, pts: [...d.pts, p] }
      }),
    )
  }
  const bitir = () => {
    aktif.current = null
  }
  const rastgele = () => {
    const r = mulberry32(Date.now() % 100000)
    const pts: [number, number][] = []
    let x = 80 + r() * 200
    let y = 80 + r() * 290
    for (let i = 0; i < 9; i++) {
      pts.push([x, y])
      x += 50 + r() * 60
      y += (r() - 0.5) * 90
    }
    const id = sayac.current++
    setDarbeler((l) => [...l.slice(-79), { id, pts, renk, op: su, w: kalin }])
    duyur('Bir fırça darbesi eklendi')
  }
  const cizim = useMemo(() => darbeler.map((d) => ({ ...d, yol: yumusat(d.pts) })), [darbeler])
  return (
    <Section id="boya" madde="Madde 2 · 6 · Fırça darbeleri" title="Kendin boya" renk="ultramarin" lead="Tuvalin üstünde sürükle: her darbe pigmenti kâğıda saydam bırakır, kenarında biriktirir ve üst üste gelince koyulaşır. Fare yoksa 'Darbe ekle' düğmesi rastgele bir darbe çizer.">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="sayfa relative min-w-0 p-3 md:p-4">
          <svg
            ref={svg}
            viewBox={`0 0 ${SAHNE_W} ${SAHNE_H}`}
            className="block h-auto w-full touch-none rounded-[2px_10px_2px_8px] bg-transparent"
            role="img"
            aria-label={`Boya tuvali, ${darbeler.length} darbe`}
            onPointerDown={basla}
            onPointerMove={surukle}
            onPointerUp={bitir}
            onPointerCancel={bitir}
            style={{ cursor: 'crosshair', backgroundImage: 'var(--dok)', backgroundBlendMode: 'multiply' }}
            data-tuval={darbeler.length}
          >
            <g filter="url(#wc-sahne)">
              {cizim.map((d) => (
                <path key={d.id} d={d.yol} fill="none" stroke={PIGMENT[d.renk]} strokeWidth={d.w} strokeLinecap="round" strokeLinejoin="round" opacity={d.op} style={{ mixBlendMode: 'var(--blend)' as never }} data-darbe="" />
              ))}
            </g>
          </svg>
          {darbeler.length === 0 ? (
            <p className="pointer-events-none absolute inset-0 grid place-items-center font-baslik text-[clamp(26px,4vw,40px)] text-soluk italic" aria-hidden="true">
              fırçayı buraya sür
            </p>
          ) : null}
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Secim<Ana> legend="Pigment" name="boya-renk" value={renk} onChange={setRenk} options={(Object.keys(HEX) as Ana[]).map((k) => ({ id: k, ad: PIGMENT_AD[k], renk: PIGMENT[k] }))} />
          <FircaAralik label="Su miktarı (saydamlık)" value={su} min={0.2} max={1} step={0.05} onChange={setSu} format={(v) => `%${Math.round(v * 100)}`} renk="var(--ultramarin)" />
          <FircaAralik label="Fırça kalınlığı" value={kalin} min={8} max={56} onChange={setKalin} format={(v) => `${v}px`} renk="var(--yesil)" />
          <div className="flex flex-wrap gap-5">
            <WashButton renk={renk} boy="k" onClick={rastgele} ikon={<Ikon ad="damla" boyut={22} />}>
              Darbe ekle
            </WashButton>
            <WashButton renk="ocre" boy="k" disabled={!darbeler.length} onClick={() => setDarbeler((l) => l.slice(0, -1))}>
              Geri al
            </WashButton>
            <WashButton renk="gul" boy="k" disabled={!darbeler.length} onClick={() => setDarbeler([])}>
              Temizle
            </WashButton>
          </div>
          <p className="text-[16px] text-soluk" role="status">
            {darbeler.length} darbe · en çok 80
          </p>
        </div>
      </div>
    </Section>
  )
}

/** Madde 5: klasik masal serifi */
export function Yazi() {
  const [boy, setBoy] = useState(84)
  const [agirlik, setAgirlik] = useState(500)
  const [italik, setItalik] = useState(true)
  const [metin, setMetin] = useState('Bir varmış, bir yokmuş')
  return (
    <Section
      id="yazi"
      madde="Madde 5 · Tipografi"
      title="Masal kitabı harfleri"
      renk="yesil"
      lead="Başlıklar EB Garamond: yüksek kontrastlı, ince kıllı, eski basımları anımsatan. Gövde Lora: kitap okuma boyunda, geniş satır aralığında. İkisi de ğ, ş, ı, İ, ç, ö, ü içerir; italikleri masal sesinin ta kendisi."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="sayfa min-w-0 p-6 md:p-10">
          <p className="kicker">
            EB Garamond · {agirlik} · {italik ? 'italik' : 'düz'}
          </p>
          <p className="mt-2 text-murekkep [overflow-wrap:anywhere]" style={{ fontFamily: 'var(--font-baslik)', fontSize: `min(${boy}px, 13vw)`, fontWeight: agirlik, fontStyle: italik ? 'italic' : 'normal', lineHeight: 1.02 }} data-yazi-ornek="">
            {metin || ' '}
          </p>
          <p className="kicker mt-8">Lora · 400 · 19 px · satır 1,75</p>
          <p className="basharf mt-3 max-w-[56ch]">Küçük kız ormanın kıyısında durdu. Ağaçların arasında bir ışık kıpırdıyordu; ne ateş böceği ne de yıldızdı bu. Bilge Baykuş, "gel," dedi kısık bir sesle, "sana suyun nasıl konuştuğunu göstereyim."</p>
          <p className="mt-6 max-w-[56ch] italic">Lora italik: konuşma, şiir ve dipnotlar için. “Suyun sesi, kâğıdın sesidir.”</p>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <div>
            <label htmlFor="yazi-girdi" className="mb-2 block font-semibold">
              Kendi başlığın
            </label>
            <input id="yazi-girdi" value={metin} onChange={(e) => setMetin(e.target.value)} maxLength={34} className="alan" />
          </div>
          <FircaAralik label="Boy" value={boy} min={32} max={140} onChange={setBoy} format={(v) => `${v}px`} renk="var(--yesil)" />
          <FircaAralik label="Ağırlık" value={agirlik} min={400} max={800} step={50} onChange={setAgirlik} format={(v) => String(v)} renk="var(--yesil)" />
          <Damla label="İtalik" checked={italik} onChange={setItalik} />
          <table className="w-full border-collapse text-[16px]">
            <caption className="kicker pb-2 text-left">Ölçek</caption>
            <tbody>
              {[
                ['Başlık 1', 'EB Garamond 500 italik', '52–118px'],
                ['Başlık 2', 'EB Garamond 500 italik', '42–84px'],
                ['Başlık 3', 'EB Garamond 500', '30–36px'],
                ['Üst yazı', 'EB Garamond küçük büyük harf', '17px'],
                ['Gövde', 'Lora 400', '19px'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-t border-[var(--cizgi)]">
                  <th scope="row" className="py-1.5 pr-3 text-left font-semibold">
                    {a}
                  </th>
                  <td className="py-1.5">{b}</td>
                  <td className="py-1.5 text-right tabular-nums">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Kod label="Yazı yığını" sar={false}>{`--font-baslik: 'EB Garamond Variable', Georgia, serif;
--font-metin:  'Lora Variable', Georgia, serif;`}</Kod>
        </div>
      </div>
    </Section>
  )
}
