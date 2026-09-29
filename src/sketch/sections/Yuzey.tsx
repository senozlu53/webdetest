import { useEffect, useState, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { useSketch, type Kagit } from '../lib/store'
import { Cizim } from '../components/Rough'
import { Ikon, TUM_IKONLAR } from '../components/Icons'
import { Karala, RoughBox, useSize } from '../components/Rough'
import { Aralik, Anahtar, Secim } from '../components/Controls'
import { Not } from '../components/Not'
import { Kod, Section } from '../components/ui'

/** Yanında karalanmış (scribble) gölge: nesnenin arkasına kaymış tek parça zikzak */
function KaralamaGolge({ children, d = 9 }: { children: React.ReactNode; d?: number }) {
  const [ref, { w, h }] = useSize<HTMLDivElement>()
  return (
    <div ref={ref} className="relative isolate" data-karalama-golge="">
      {w > 8 ? (
        <svg className="pointer-events-none absolute -z-10 overflow-visible" style={{ left: d, top: d }} width={w} height={h} aria-hidden="true">
          <Karala w={w} h={h} ac tohum={9} sw={2} aralik={7} aci={-32} renk="var(--murekkep)" />
        </svg>
      ) : null}
      {children}
    </div>
  )
}

const RENKLER = { komur: 'var(--komur)', murekkep: 'var(--murekkep)', kirmizi: 'var(--kirmizi)' } as const

/** Madde 7: Drop Shadow yok; tarama (hatching) ve karalama */
export function Golge() {
  const [d, setD] = useState(12)
  const [gap, setGap] = useState(6)
  const [aci, setAci] = useState(-45)
  const [renk, setRenk] = useState<keyof typeof RENKLER>('komur')
  const stil = { ['--d' as string]: `${d}px`, ['--gap' as string]: `${gap}px`, ['--a' as string]: `${aci}deg`, ['--tc' as string]: RENKLER[renk] } as CSSProperties
  return (
    <Section id="golge" madde="Madde 7 · Z-ekseni ve gölge" title="Gölge değil, tarama" lead="Kâğıtta bulanık gölge olmaz; kalem ancak çizgi çeker. Yükseklik sağ-alt kenara paralel çizgilerle (hatching) ya da karalamayla anlatılır. Çizgiler hafif dalgalıdır (feTurbulence + feDisplacementMap).">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="grid min-w-0 grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
          <div className="grid content-start gap-4">
            <RoughBox tohum={41} kare={3} sekil="yuvarlak" r={16} className="tarama grid min-h-[190px] place-items-center p-6 text-center" style={stil} data-tarama-ornek="">
              <div>
                <Ikon ad="fincan" boyut={56} />
                <p className="mt-2 font-el text-[38px] leading-none font-bold text-murekkep">Tarama gölge</p>
              </div>
            </RoughBox>
            <p className="text-[15px] text-soluk">
              {d} piksel kayık, {gap}px aralıklı, {aci}° çizgi.
            </p>
          </div>
          <div className="grid content-start gap-4">
            <KaralamaGolge>
              <RoughBox tohum={43} kare={3} sekil="yuvarlak" r={16} className="grid min-h-[190px] place-items-center bg-kagit p-6 text-center">
                <div>
                  <Ikon ad="kalem" boyut={56} />
                  <p className="mt-2 font-el text-[38px] leading-none font-bold text-murekkep">Karalama gölge</p>
                </div>
              </RoughBox>
            </KaralamaGolge>
            <p className="text-[15px] text-soluk">Tek parça zikzak, nesnenin arkasına kayık.</p>
          </div>
          <div className="grid content-start gap-3 sm:col-span-2">
            <p className="text-[17px]">
              Dijital gölge (<code className="font-daktilo">box-shadow: 8px 8px 16px #0004</code>) burada{' '}
              <Not tur="crossed-off" sure={600}>
                yok
              </Not>
              : kâğıtta bulanıklık, kalemde çizgi vardır.
            </p>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Aralik label="Kayma" value={d} min={0} max={24} onChange={setD} format={(v) => `${v}px`} />
          <Aralik label="Çizgi aralığı" value={gap} min={4} max={14} onChange={setGap} format={(v) => `${v}px`} />
          <Aralik label="Çizgi açısı" value={aci} min={-80} max={80} step={5} onChange={setAci} format={(v) => `${v}°`} />
          <Secim<keyof typeof RENKLER>
            legend="Kalem"
            name="golge-renk"
            value={renk}
            onChange={setRenk}
            options={[
              { id: 'komur', ad: 'Kömür' },
              { id: 'murekkep', ad: 'Mürekkep' },
              { id: 'kirmizi', ad: 'Kırmızı' },
            ]}
          />
          <Kod label="Tarama gölge CSS" sar={false}>{`.tarama::after {
  translate: ${d}px ${d}px;
  background: repeating-linear-gradient(${aci}deg,
    ${RENKLER[renk].replace('var(--', '').replace(')', '')} 0 1.5px, transparent 1.5px ${gap}px);
  clip-path: polygon(…L biçimi…);
  filter: url(#titrek);
}`}</Kod>
        </div>
      </div>
    </Section>
  )
}

const DOKULAR: { id: Kagit; ad: string; not: string; bg: string }[] = [
  { id: 'ekskiz', ad: 'Eskiz defteri', not: 'ince tane, hafif pürüz', bg: 'var(--dok-ekskiz)' },
  { id: 'geri', ad: 'Geri dönüşüm kâğıdı', not: 'lif, benek ve tane', bg: 'var(--dok-benek), var(--dok-lif), var(--dok-ekskiz)' },
  { id: 'yok', ad: 'Düz', not: 'doku kapalı (ayar)', bg: 'none' },
]

/** Madde 8: kâğıt dokusu */
export function Doku() {
  const s = useSketch()
  const [tane, setTane] = useState(100)
  useEffect(() => {
    document.documentElement.style.setProperty('--veil', String(1 - tane / 100))
    return () => {
      document.documentElement.style.removeProperty('--veil')
    }
  }, [tane])
  return (
    <Section id="doku" madde="Madde 8 · Doku ve yüzey" title="Pürüzlü kâğıt" lead="Zemin düz renk değil, kâğıt: SVG feTurbulence gürültüsü CSS arka planı olarak gelir (resim dosyası yok). Kartlar boş bırakılır ki tane çizgilerin arkasından görünsün.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-3">
          {DOKULAR.map((k, i) => (
            <li key={k.id} className="grid content-start gap-3">
              <RoughBox tohum={50 + i} kare={3} sekil="yuvarlak" r={14} cizgi={s.kagit === k.id ? 3.2 : 2} className="h-[170px] bg-kagit-2/60" style={{ backgroundImage: k.bg, backgroundColor: '#f9f6f0' } as CSSProperties} data-doku-kutu={k.id}>
                {s.kagit === k.id ? <span className="absolute top-3 right-3 rounded bg-kagit px-2 py-0.5 font-daktilo text-[13px] font-bold">SEÇİLİ</span> : null}
              </RoughBox>
              <div>
                <p className="font-el text-[30px] leading-none font-bold text-murekkep">{k.ad}</p>
                <p className="mt-1 text-[15px] text-soluk">{k.not}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Secim<Kagit>
            legend="Sayfa kâğıdı"
            name="doku-kagit"
            value={s.kagit}
            onChange={s.setKagit}
            options={[
              { id: 'ekskiz', ad: 'Eskiz' },
              { id: 'geri', ad: 'Geri dönüşüm' },
              { id: 'yok', ad: 'Düz' },
            ]}
          />
          <Aralik label="Tane şiddeti" value={tane} min={0} max={100} step={5} onChange={setTane} format={(v) => `%${v}`} />
          <p className="text-[15px] text-soluk">Doku metnin arkasında kalır, üstüne binmez; en koyu tanede bile gövde yazısı 11:1'in üstünde.</p>
        </div>
      </div>
    </Section>
  )
}

/** Madde 9: serbest elle çizilmiş ikonlar */
export function Ikonlar() {
  const [boyut, setBoyut] = useState(56)
  const [sw, setSw] = useState(3)
  const [titre, setTitre] = useState(false)
  return (
    <Section id="ikonlar" madde="Madde 9 · İkonografi" title="Her ikon başka bir el" lead="Her ikon kendi tohumuyla rough.js'ten geçer: iki ikon aynı titrekliği taşımaz, hiçbiri simetrik değildir. Çizim 48 birimlik viewBox içinde olduğundan büyüyünce çizgi de oranında kalınlaşır (Madde 17).">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="m-0 grid min-w-0 list-none grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-4 p-0" data-ikon-izgara="">
          {TUM_IKONLAR.map((a, i) => (
            <RoughBox as="li" key={a} tohum={100 + i} kare={3} sekil="yuvarlak" r={14} cizgi={1.8} className={cx('grid justify-items-center gap-2 px-2 py-4 text-center', i % 3 === 0 && 'tarama')} style={{ ['--d' as string]: '6px' } as CSSProperties}>
              <span className="grid h-[76px] place-items-center">
                <Ikon ad={a} boyut={boyut} sw={sw} hep={titre} kare={titre ? 3 : 1} />
              </span>
              <span className="font-not text-[19px] leading-none">{a}</span>
            </RoughBox>
          ))}
        </ul>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Aralik label="Boyut" value={boyut} min={32} max={80} step={4} onChange={setBoyut} format={(v) => `${v}px`} />
          <Aralik label="Kalem" value={sw} min={2} max={6} step={0.5} onChange={setSw} format={(v) => `${v.toString().replace('.', ',')}`} />
          <Anahtar label="Titret" hint="Her ikon üç ayrı denemeyle kare kare çizilir." checked={titre} onChange={setTitre} />
          <div className="flex items-center gap-4">
            <Cizim w={48} h={48} parcalar={[{ d: 'M9 19 H33 V31 Q33 40 24 40 H18 Q9 40 9 31 Z' }, { d: 'M33 22 Q42 22 42 28 Q42 35 33 35' }]} tohum={11} sw={3} kusur={0.9} className="size-16" />
            <p className="text-[15px] text-soluk">Yuvarlak uç ve yuvarlak birleşim: Figma'da Stroke → Round (Madde 12).</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
