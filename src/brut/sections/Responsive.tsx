import { useLayoutEffect, useRef, useState } from 'react'
import { BrutalistCard } from '../components/BrutalistCard'
import { Section } from '../components/ui'
import { Tag } from '../components/Tag'
import { IconWarning } from '../components/Icons'
import { cx } from '../../shared/cx'

const clamp = (min: number, vw: number, max: number, w: number) => Math.min(max, Math.max(min, (vw / 100) * w))
const SCALE = [
  { ad: 'Mega', min: 40, vw: 11, max: 148 },
  { ad: 'Display', min: 34, vw: 7.2, max: 104 },
  { ad: 'Başlık', min: 22, vw: 2.6, max: 34 },
  { ad: 'Gövde', min: 16, vw: 0, max: 18 },
]
const bodyAt = (w: number) => (w <= 640 ? 16 : 18)
/** Mega dar ekranda ayrı eğri: genişlik %100 olduğu için 13,4vw (en çok 64px) */
const megaAt = (w: number) => (w <= 640 ? clamp(40, 13.4, 64, w) : clamp(40, 11, 148, w))

/** Madde 17: ölçek, boyutu seçilebilen bir çerçevede canlı hesaplanır; saf "küçültmeyen" sürüm taşar */
export function Responsive() {
  const [w, setW] = useState(390)
  const box = useRef<HTMLDivElement>(null)
  const naive = useRef<HTMLParagraphElement>(null)
  const [avail, setAvail] = useState(1100)
  const [overflow, setOverflow] = useState(false)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setAvail(Math.floor(el.clientWidth)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  // Çerçeve gerçek genişlikte çizilir; sığmıyorsa zoom ile küçültülür (yerleşim bozulmaz)
  const zoom = Math.min(1, avail / w)
  useLayoutEffect(() => {
    const n = naive.current
    if (n) setOverflow(n.scrollWidth > n.clientWidth + 1)
  }, [w])
  const narrow = w <= 640
  return (
    <Section id="mobil" n="17" kicker="Madde 17 · Duyarlı kurallar" title="Büyük olan daha çok küçülür" lead="Devasa yazı telefonu hemen kırar. Bu yüzden ölçek doğrusal değil: en büyük düzey 3,4 kat küçülür, gövde neredeyse sabit kalır. Dar ekranda Archivo’nun genişlik ekseni de %125’ten %100’e iner.">
      <div className="grid gap-8 lg:grid-cols-12">
        <BrutalistCard className="lg:col-span-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0 flex-1">
              <label htmlFor="genislik" className="flex justify-between font-bold">
                <span>Çerçeve genişliği</span>
                <span className="font-display font-black">{w}px</span>
              </label>
              <input id="genislik" type="range" min={320} max={1100} step={10} value={w} onChange={(e) => setW(+e.target.value)} className="mt-2 w-full accent-[var(--ink)]" aria-valuetext={`${w} piksel`} />
            </div>
            <div className="flex gap-2">
              {[360, 390, 768, 1100].map((v) => (
                <button key={v} type="button" onClick={() => setW(v)} aria-pressed={w === v} className={cx('rounded-brut border-[3px] border-line px-2.5 py-1 font-mono text-[13px] font-bold', w === v ? 'fill-yellow' : 'bg-surface brut-shadow-sm snap press')}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div ref={box} className="mt-6">
            <div className="overflow-hidden rounded-brut border-[3px] border-line bg-bg" style={{ width: w, zoom }}>
              <div className="border-b-[3px] border-line fill-ink px-3 py-1 font-mono text-[12px] font-bold">
                {w}px{zoom < 1 ? ` · %${Math.round(zoom * 100)} ölçekte gösteriliyor` : ''}
              </div>
              <div className="p-4">
                <p className="font-display leading-[0.88] font-black uppercase" style={{ fontSize: megaAt(w), fontStretch: narrow ? '100%' : '125%' }}>
                  Gürültülü.
                </p>
                <p className="mt-3 font-display leading-[0.92] font-black uppercase" style={{ fontSize: clamp(34, 7.2, 104, w), fontStretch: narrow ? '100%' : '125%' }}>
                  Kalın başlık
                </p>
                <p className="mt-3 max-w-[60ch] font-medium" style={{ fontSize: bodyAt(w) }}>
                  Gövde metni {bodyAt(w)}px; satır uzunluğu en fazla 60 karakter.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <p className="font-bold">Küçültmeseydik (141px, sabit):</p>
            {overflow ? (
              <Tag fill="red" size="s">
                <IconWarning size={14} /> Taştı
              </Tag>
            ) : (
              <Tag fill="green" size="s">
                Sığdı
              </Tag>
            )}
          </div>
          <div className="mt-2 overflow-hidden rounded-brut border-[3px] border-dashed border-line" style={{ width: w, zoom }} aria-hidden="true">
            <p ref={naive} className="overflow-hidden p-4 font-display text-[141px] leading-[0.88] font-black whitespace-nowrap uppercase [font-stretch:125%]">
              Gürültülü.
            </p>
          </div>
        </BrutalistCard>
        <BrutalistCard fill="yellow" className="lg:col-span-7">
          <h3 className="headline">Ölçek</h3>
          <div className="scroll-x mt-5 rounded-brut border-[3px] border-black bg-white text-black" tabIndex={0} role="region" aria-label="Yazı ölçeği tablosu, yatay kaydırılabilir">
            <table className="w-full min-w-[460px] text-left">
              <caption className="sr-only">Seçili genişlikte, en büyük ve en küçük ekranda yazı boyutları</caption>
              <thead>
                <tr className="border-b-[3px] border-black">
                  {['Düzey', `Şu an (${w}px)`, 'En büyük', 'En küçük', 'Oran'].map((h) => (
                    <th key={h} scope="col" className="px-3 py-2 text-[13px] font-bold uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono text-[14px] font-bold">
                {SCALE.map((s) => (
                  <tr key={s.ad} className="border-b-[3px] border-black last:border-0">
                    <th scope="row" className="px-3 py-2">
                      {s.ad}
                    </th>
                    <td className="px-3 py-2">{s.ad === 'Mega' ? Math.round(megaAt(w)) : s.vw ? Math.round(clamp(s.min, s.vw, s.max, w)) : bodyAt(w)}px</td>
                    <td className="px-3 py-2">{s.max}px</td>
                    <td className="px-3 py-2">{s.min}px</td>
                    <td className="px-3 py-2">{(s.max / s.min).toFixed(1).replace('.', ',')}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BrutalistCard>
        <BrutalistCard fill="pink" className="lg:col-span-5 lg:mt-12">
          <h3 className="headline">Mobil kuralları</h3>
          <ul className="mt-4 space-y-2.5 font-medium">
            {['Izgara tek sütuna iner; asimetrik kaydırmalar (translate) masaüstüne özel.', 'Çerçeve 3px ve gölge 6px kalır: ölçeklenmez, stilin imzası.', 'Dokunma hedefi en az 44px.', 'Sekmeler ve gezinme yatay kayar, satır kırılmaz.', 'Geniş tablolar kendi alanında kayar.'].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="mt-2 size-3 shrink-0 border-[3px] border-black bg-black" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </BrutalistCard>
      </div>
    </Section>
  )
}
