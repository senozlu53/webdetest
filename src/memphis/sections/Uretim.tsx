import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { cx } from '../../shared/cx'
import { useMemphis } from '../lib/store'
import type { Ton } from '../lib/data'
import { MemphisCard } from '../components/MemphisCard'
import { PopButton } from '../components/PopButton'
import { Ikon, UiIkon } from '../components/Icons'
import { Aralik, Anahtar, Kod, Section, Secim } from '../components/ui'

const TONLAR: { id: Ton; ad: string }[] = [
  { id: 'sari', ad: 'Hardal' },
  { id: 'camgobegi', ad: 'Cam göbeği' },
  { id: 'pembe', ad: 'Pembe' },
  { id: 'beyaz', ad: 'Beyaz' },
]

/** Madde 11 · 14: <MemphisCard> ve <PopButton>, useRandomRotation ile */
export function Bilesenler() {
  const s = useMemphis()
  const [ton, setTon] = useState<Ton>('sari')
  const [golge, setGolge] = useState<Ton>('lacivert')
  const [aci, setAci] = useState(4)
  const [kose, setKose] = useState<'18' | 'hap' | 'asimetrik'>('18')
  const [oyuncak, setOyuncak] = useState(true)
  const radius = kose === '18' ? 'rounded-[18px]' : kose === 'hap' ? 'rounded-full' : 'rounded-[4px_48px_4px_48px]'
  return (
    <Section id="bilesenler" madde="Madde 11 · 14 · React" title="Kart ve" vurgu="hap düğme" ton="sari" sekil="yarim" lead="<MemphisCard> dönüş açısını useRandomRotation hook'undan alır: açı kartın anahtarından ve sayfa tohumundan türetilir, yenilemede değişmez. Başlıktaki karıştır düğmesi tohumu değiştirir, bütün kartlar yeni açıya yaylanır.">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.618fr]">
        <MemphisCard kimlik="bil-kontrol" ton="beyaz" aci={1} oyuncak={false} className="grid min-w-0 grid-cols-1 content-start gap-5 rounded-[18px] p-6">
          <Secim<Ton> legend="Zemin" name="bil-ton" value={ton} onChange={setTon} options={TONLAR} />
          <Secim<Ton> legend="Gölge" name="bil-golge" value={golge} onChange={setGolge} ton="camgobegi" options={[{ id: 'lacivert', ad: 'Lacivert' }, ...TONLAR.filter((t) => t.id !== 'beyaz')]} />
          <Aralik label="En büyük açı" value={aci} min={0} max={8} onChange={setAci} format={(v) => `±${v}°`} />
          <Secim legend="Köşe" name="bil-kose" value={kose} onChange={setKose} ton="pembe" options={[{ id: '18', ad: '18px' }, { id: 'hap', ad: 'Hap' }, { id: 'asimetrik', ad: 'Asimetrik' }]} />
          <Anahtar label="Oyuncak (üstüne gelince yaylan)" checked={oyuncak} onChange={setOyuncak} />
          <PopButton ton="camgobegi" onClick={s.karistir} ikon={<UiIkon ad="karistir" />} data-bil-karistir="">
            Karıştır · tohum {s.tohum}
          </PopButton>
        </MemphisCard>
        <div className="min-w-0">
          <ul className="m-0 grid list-none grid-cols-1 gap-10 p-0 sm:grid-cols-3" data-bil-kartlar="">
            {['a', 'b', 'c'].map((k, i) => (
              <MemphisCard as="li" key={k} kimlik={`oyun-${k}`} ton={ton} golgeTon={golge} aci={aci} oyuncak={oyuncak} className={cx('p-5', radius)}>
                <Ikon ad={(['ampul', 'nota', 'sohbet'] as const)[i]} boyut={44} />
                <p className="dev mt-3 text-[26px]">Kart {k.toUpperCase()}</p>
                <p className="mt-1 font-mono text-[14px] font-bold" data-kart-aci="">
                  anahtar "oyun-{k}"
                </p>
              </MemphisCard>
            ))}
          </ul>
          <Kod label="MemphisCard JSX" className="mt-10">{`<MemphisCard kimlik="oyun-a" ton="${ton}"${golge !== 'lacivert' ? ` golgeTon="${golge}"` : ''} aci={${aci}}${oyuncak ? '' : ' oyuncak={false}'}>
  …
</MemphisCard>`}</Kod>
        </div>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <h3 className="text-[30px]">
            {'<PopButton>'}
          </h3>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <PopButton ton="sari" boy="b">
              Hardal
            </PopButton>
            <PopButton ton="pembe" konfeti>
              Konfetili
            </PopButton>
            <PopButton ton="camgobegi" ikon={<UiIkon ad="arti" />}>
              Ekle
            </PopButton>
            <PopButton ton="beyaz" boy="k">
              İkincil
            </PopButton>
            <PopButton ton="lacivert" boy="k">
              Koyu
            </PopButton>
            <PopButton ton="sari" disabled>
              Pasif
            </PopButton>
          </div>
          <p className="mt-6 max-w-[52ch] text-[16px]">Hap formu, 4 piksel kontur, katı gölge. Üstüne gelince yayla %7 büyür, basınca 4 piksel sağ alta iner ve %6 ezilir. Pembe düğmede yazı saf siyah; pasif düğme kesikli kontur ve gölgesiz, renk tek başına söylemez.</p>
        </div>
        <Kod label="useRandomRotation">{`/** Anahtar + sayfa tohumu → hep aynı açı */
export function useRandomRotation(anahtar, { max = 4, min = 1.2 } = {}) {
  const { tohum } = useMemphis()
  return useMemo(() => {
    const r = uretec(ozet(anahtar) ^ tohum)   // mulberry32
    const buyukluk = min + r() * (max - min)
    return (r() < 0.5 ? -1 : 1) * buyukluk
  }, [anahtar, tohum, max, min])
}

// Kart: style={{ '--r': \`\${aci}deg\` }}  →  rotate: var(--r)`}</Kod>
      </div>
    </Section>
  )
}

type Nokta = [number, number]
/** Ramer–Douglas–Peucker: çizimdeki gereksiz noktaları atar */
function sadelestir(n: Nokta[], eps: number): Nokta[] {
  if (n.length < 3) return n
  const [a, b] = [n[0], n[n.length - 1]]
  let enUzak = 0
  let k = 0
  for (let i = 1; i < n.length - 1; i++) {
    const [x, y] = n[i]
    const d = Math.abs((b[1] - a[1]) * x - (b[0] - a[0]) * y + b[0] * a[1] - b[1] * a[0]) / Math.hypot(b[1] - a[1], b[0] - a[0] || 1e-9)
    if (d > enUzak) {
      enUzak = d
      k = i
    }
  }
  if (enUzak <= eps) return [a, b]
  return [...sadelestir(n.slice(0, k + 1), eps).slice(0, -1), ...sadelestir(n.slice(k), eps)]
}
/** Catmull-Rom → kübik Bézier: noktalardan geçen yumuşak SVG yolu */
function egri(n: Nokta[]) {
  if (n.length < 2) return ''
  const f = (v: number) => Math.round(v * 10) / 10
  let d = `M${f(n[0][0])} ${f(n[0][1])}`
  for (let i = 0; i < n.length - 1; i++) {
    const p0 = n[i - 1] ?? n[i]
    const p1 = n[i]
    const p2 = n[i + 1]
    const p3 = n[i + 2] ?? p2
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}
const HAZIR: Record<string, Nokta[]> = {
  dalga: Array.from({ length: 9 }, (_, i) => [10 + i * 35, 75 + Math.sin(i * 1.3) * 42]),
  zikzak: Array.from({ length: 9 }, (_, i) => [10 + i * 35, i % 2 ? 35 : 115]),
  kivrim: Array.from({ length: 14 }, (_, i) => [20 + i * 20 + Math.cos(i * 1.7) * 18, 75 + Math.sin(i * 1.7) * 38]),
}
const TW = 300
const TH = 150

/** Madde 12 · 13: el çizimi dalga → sadeleştirilmiş SVG → Auto Layout bileşeninin arka plan dokusu */
export function Figma() {
  const [ham, setHam] = useState<Nokta[]>(HAZIR.dalga)
  const [cizim, setCizim] = useState(false)
  const [kalin, setKalin] = useState(8)
  const [renk, setRenk] = useState('#EF476F')
  const [olcek, setOlcek] = useState(0.6)
  const alan = useRef<SVGSVGElement>(null)
  const sade = useMemo(() => sadelestir(ham, 2.5), [ham])
  const d = useMemo(() => egri(sade), [sade])
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="${TH}" viewBox="0 0 ${TW} ${TH}"><path d="${d}" fill="none" stroke="#073B4C" stroke-width="${kalin + 6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${renk}" stroke-width="${kalin}" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  const nokta = (e: PointerEvent<SVGSVGElement>): Nokta => {
    const r = e.currentTarget.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * TW, ((e.clientY - r.top) / r.height) * TH]
  }
  useEffect(() => {
    if (!cizim) return
    const bitir = () => setCizim(false)
    window.addEventListener('pointerup', bitir)
    return () => window.removeEventListener('pointerup', bitir)
  }, [cizim])
  return (
    <Section id="figma" madde="Madde 12 · 13 · Figma" title="Çiz," vurgu="desen yap" ton="camgobegi" sekil="dalga" lead="Figma'da elle çizilen dalga vektöre çevrilir, sadeleştirilir ve SVG olarak Auto Layout bileşenine arka plan dokusu yapılır. Aşağıda aynı yol: çizin, noktalar Ramer–Douglas–Peucker ile azalır, Catmull-Rom eğrisiyle yumuşar, SVG olur ve karta döşenir.">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <svg
            ref={alan}
            viewBox={`0 0 ${TW} ${TH}`}
            className="block h-auto w-full cursor-crosshair touch-none rounded-[18px] border-[4px] border-ink bg-paper shadow-[6px_6px_0_var(--shadow)]"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              setCizim(true)
              setHam([nokta(e)])
            }}
            onPointerMove={(e) => {
              if (!cizim) return
              // Nokta olay anında okunur: güncelleyici sonra çalışır, currentTarget o zaman boştur
              const n = nokta(e)
              setHam((l) => [...l, n])
            }}
            role="img"
            aria-label={`Çizim alanı: ${ham.length} ham nokta, sadeleşince ${sade.length}`}
            data-cizim=""
          >
            <polyline points={ham.map((p) => p.join(',')).join(' ')} fill="none" stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="3 3" />
            <path d={d} fill="none" stroke="var(--ink)" strokeWidth={kalin + 6} strokeLinecap="round" strokeLinejoin="round" />
            <path d={d} fill="none" stroke={renk} strokeWidth={kalin} strokeLinecap="round" strokeLinejoin="round" />
            {sade.map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2} />
            ))}
          </svg>
          <p className="font-mono text-[14px] font-bold" aria-live="polite" data-nokta="">
            {ham.length} ham nokta → {sade.length} düğüm → {d.split('C').length - 1} Bézier parçası
          </p>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Hazır dalgalar (klavyeyle)">
            {Object.keys(HAZIR).map((k) => (
              <PopButton key={k} ton="beyaz" boy="k" onClick={() => setHam(HAZIR[k])}>
                {k === 'dalga' ? 'Dalga' : k === 'zikzak' ? 'Zikzak' : 'Kıvrım'}
              </PopButton>
            ))}
          </div>
          <Aralik label="Çizgi kalınlığı" value={kalin} min={4} max={16} onChange={setKalin} format={(v) => `${v}px + 6px kontur`} />
          <Secim legend="Renk" name="fig-renk" value={renk} onChange={setRenk} ton="camgobegi" options={[{ id: '#EF476F', ad: 'Pembe' }, { id: '#06D6A0', ad: 'Cam göbeği' }, { id: '#FFD166', ad: 'Hardal' }]} />
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <div className="rounded-[26px] border-[4px] border-ink p-6 shadow-[8px_8px_0_var(--shadow)]" style={{ backgroundImage: url, backgroundSize: `${TW * olcek}px ${TH * olcek}px`, backgroundColor: 'var(--yellow-50)' }} data-desen-kart="">
            <div className="flex flex-col gap-4 rounded-[18px] border-[4px] border-ink bg-paper p-5">
              <p className="kicker text-muted">Auto Layout · dikey · aralık 16</p>
              <p className="dev text-[clamp(24px,7vw,32px)]">Atölye: Kendi desenini çiz</p>
              <p className="text-[16px]">Cumartesi 14:00, Pembe Çadır. Malzeme bizden.</p>
              <div className="flex flex-wrap gap-3">
                <PopButton ton="pembe" boy="k">
                  Kayıt ol
                </PopButton>
                <Ikon ad="takvim" boyut={40} etiket="Takvim" />
              </div>
            </div>
          </div>
          <Aralik label="Desen ölçeği" value={olcek} min={0.3} max={1} step={0.1} onChange={setOlcek} format={(v) => `${Math.round(v * 100)}%`} />
          <Kod label="Üretilen SVG">{svg.replace('><path', '>\n  <path').replace('/><path', '/>\n  <path').replace('/></svg>', '/>\n</svg>')}</Kod>
        </div>
      </div>
      <Kod label="Figma tokenları, W3C DTCG" className="mt-10">{`{
  "Color":   { "MemphisYellow": { "$type": "color", "$value": "#FFD166" } },
  "Border":  { "MemphisThick":  { "$type": "border", "$value": { "color": "{Color.MemphisInk}", "width": "4px", "style": "solid" } } },
  "Pattern": { "Halftone": { "$type": "string",
    "$value": "radial-gradient(circle, #073B4C 2px, transparent 2.6px) 0 0 / 14px 14px" } }
}`}</Kod>
    </Section>
  )
}

/** Madde 15: tanımdaki Tailwind satırı, birebir */
export function Css() {
  const ref = useRef<HTMLDivElement>(null)
  const [olcum, setOlcum] = useState<[string, string][]>([])
  useEffect(() => {
    const e = ref.current
    if (!e) return
    const c = getComputedStyle(e)
    setOlcum([
      ['border-width', c.borderTopWidth],
      ['border-color', c.borderTopColor],
      ['background', c.backgroundColor],
      // Tailwind boş gölge katmanlarını da yazar; yalnız görünen katman gösterilir
      ['box-shadow', c.boxShadow.split(/,(?![^(]*\))/).map((x) => x.trim()).filter((x) => !x.startsWith('rgba(0, 0, 0, 0)')).join(', ')],
      ['rotate', c.rotate],
    ])
  }, [])
  return (
    <Section id="css" madde="Madde 15 · CSS / Tailwind" title="Tek satır" vurgu="Memphis" ton="pembe" sekil="kare" lead="Tanımdaki sınıflar olduğu gibi. Tailwind temasında black ve yellow-400 bu paletin değerlerine bağlandı: border-black lacivert #073B4C, bg-yellow-400 hardal #FFD166. Gölgedeki #000 sabit bir değer; tokenlı sürüm yanında.">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <div className="grid min-w-0 grid-cols-1 gap-10">
          <div ref={ref} className="border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_#000] rotate-2 rounded-[4px] p-6" data-madde15="">
            <p className="font-mono text-[14px] leading-relaxed font-bold break-words">border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_#000] rotate-2</p>
          </div>
          <div className="-rotate-2 rounded-[4px] border-4 border-black bg-teal p-6 shadow-[8px_8px_0_var(--shadow)]">
            <p className="font-mono text-[14px] leading-relaxed font-bold break-words">border-4 border-black bg-teal shadow-[8px_8px_0_var(--shadow)] -rotate-2</p>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-6">
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 rounded-[18px] border-[4px] border-ink bg-paper p-5 font-mono text-[14px]" data-olcum="">
            {olcum.map(([a, b]) => (
              <div key={a} className="contents">
                <dt className="font-bold">{a}</dt>
                <dd className="m-0 break-all">{b}</dd>
              </div>
            ))}
          </dl>
          <Kod label="Tema bağlantısı">{`@theme inline {
  --color-black: var(--ink);        /* #073B4C */
  --color-yellow-400: var(--yellow); /* #FFD166 */
}
/* Yüksek kontrast varyantında --ink → #000000:
   border-black da onunla birlikte saf siyaha döner */`}</Kod>
        </div>
      </div>
    </Section>
  )
}
