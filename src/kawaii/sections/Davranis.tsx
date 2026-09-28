import { useEffect, useState } from 'react'
import { cx } from '../../shared/cx'
import { useKawaii } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { CloudCard } from '../components/CloudCard'
import { KawaiiButton } from '../components/KawaiiButton'
import { LottieMascot } from '../components/LottieMascot'
import { Mascot } from '../components/Mascot'
import { Ayarlar } from '../components/Header'
import { Ikon } from '../components/Icons'
import { KSwitch, Section } from '../components/ui'

/** cubic-bezier(x1,y1,x2,y2) eğrisini örnekler (t parametresiyle) */
function bezier(x1: number, y1: number, x2: number, y2: number, n = 48) {
  const b = (a: number, c: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * c * t * t * (1 - t) + t ** 3
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    return [b(x1, x2, t), b(y1, y2, t)] as const
  })
}

/** Madde 16: jöle, esneme, zıplayarak giriş */
export function Hareket() {
  const { hareket } = useKawaii()
  const [durt, setDurt] = useState(0)
  const [giris, setGiris] = useState(0)
  const nokta = bezier(0.34, 1.8, 0.5, 1)
  const W = 300
  const H = 170
  const y0 = 140
  const olc = 100 // y=1 → 100 birim
  const yol = nokta.map(([x, y], i) => `${i ? 'L' : 'M'}${(x * W).toFixed(1)} ${(y0 - y * olc).toFixed(1)}`).join(' ')
  const tepe = Math.max(...nokta.map(([, y]) => y))
  return (
    <Section id="hareket" madde="Madde 16 · Hareket dili" title="Jöle gibi" lead="Her şey biraz fazla gider ve geri sallanır: cubic-bezier(0.34, 1.8, 0.5, 1) hedefi aşar, sonra yerine oturur. Düğmeler üstüne gelince jöle gibi titrer, kartlar zıplayarak girer, basınca yassılır.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="kabarcik grid min-w-0 justify-items-center gap-5 p-6">
          <div className="grid h-[180px] w-full place-items-center rounded-[32px] bg-cream">
            <span key={durt} className={cx('grid size-32 place-items-center rounded-full bg-salmon shadow-[var(--sh-salmon)]', durt > 0 && 'jole-bir')} data-jole-ornek={durt}>
              <Mascot ruh={durt % 2 ? 'heyecanli' : 'mutlu'} renk="paper" boyut={80} />
            </span>
          </div>
          <KawaiiButton renk="salmon" onClick={() => setDurt((d) => d + 1)}>
            Dürt
          </KawaiiButton>
          <p className="text-center text-[15px] text-muted">jole: 620ms · ölçek 1,1 × 0,9 → 0,94 × 1,07 → 1,04 × 0,97 → 1</p>
        </div>
        <div className="kabarcik grid min-w-0 grid-cols-1 content-start gap-4 p-6">
          <p className="font-display text-[22px] font-extrabold">Yumuşama eğrisi</p>
          <svg viewBox={`-14 -6 ${W + 28} ${H + 24}`} className="block h-auto w-full" role="img" aria-label={`Eğri hedefi yüzde ${Math.round((tepe - 1) * 100)} aşıyor, sonra 1'e oturuyor`}>
            <rect x={0} y={y0 - olc} width={W} height={olc} rx={10} fill="#fff8f3" />
            <line x1={0} x2={W} y1={y0 - olc} y2={y0 - olc} stroke="#d9c2b8" strokeWidth="2" strokeDasharray="5 5" />
            <line x1={0} x2={W} y1={y0} y2={y0} stroke="#d9c2b8" strokeWidth="2" />
            <path d={yol} fill="none" stroke="#e9827c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <text x={4} y={y0 - olc - 8} fontSize="13" fill="var(--muted)" fontWeight="700">
              hedef (1)
            </text>
            <text x={4} y={y0 + 20} fontSize="13" fill="var(--muted)" fontWeight="700">
              başlangıç
            </text>
            <text x={W} y={y0 + 20} fontSize="13" fill="var(--muted)" fontWeight="700" textAnchor="end">
              zaman →
            </text>
          </svg>
          <p className="text-[15px] text-muted">
            Tepe <b className="tabular-nums">{tepe.toFixed(2).replace('.', ',')}</b>: hedefin %{Math.round((tepe - 1) * 100)} ötesine gidip geri döner.
          </p>
        </div>
        <div className="kabarcik grid min-w-0 grid-cols-1 content-start gap-4 p-6">
          <p className="font-display text-[22px] font-extrabold">Zıplayarak giriş</p>
          <ul key={giris} className="m-0 grid list-none grid-cols-3 gap-3 p-0" data-giris-grup={giris}>
            {(['mint', 'peach', 'salmon', 'rose', 'mint', 'peach'] as const).map((r, i) => (
              <li
                key={i}
                className="grid aspect-square place-items-center rounded-[28px]"
                style={{
                  background: `var(--${r})`,
                  ['--gecik' as string]: `${i * 80}ms`,
                }}
                data-giris="1"
              >
                <Ikon ad={(['yildiz', 'kalp', 'cicek', 'ay', 'damla', 'elma'] as const)[i]} boyut={40} />
              </li>
            ))}
          </ul>
          <KawaiiButton renk="mint" onClick={() => setGiris((g) => g + 1)} ikon={<Ikon ad="yenile" boyut={24} />}>
            Tekrar oynat
          </KawaiiButton>
          <p className="text-[15px] text-muted">700ms, 80ms arayla. Ölçek 0,6 → 1,08 → 0,97 → 1. {hareket ? '' : 'Hareket kapalı: öğeler doğrudan yerinde.'}</p>
        </div>
      </div>
    </Section>
  )
}

/** Madde 17: büyük yuvarlak düğmeler doğal dokunma hedefi; mobilde tasarım değişmez */
export function Mobil() {
  const [izgara, setIzgara] = useState(true)
  const [olcum, setOlcum] = useState<{
    n: number
    min: number
    ad: string
  } | null>(null)
  useEffect(() => {
    const t = window.setTimeout(() => {
      const els = [...document.querySelectorAll<HTMLElement>('main .kbtn, main .kchip, main .kswitch')].filter((e) => e.offsetParent)
      let min = Infinity
      let ad = ''
      els.forEach((e) => {
        const r = e.getBoundingClientRect()
        const m = Math.min(r.width, r.height)
        if (m < min) {
          min = m
          ad = (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 24)
        }
      })
      setOlcum({ n: els.length, min: Math.round(min), ad })
    }, 600)
    return () => window.clearTimeout(t)
  }, [])
  const Telefon = ({ genis }: { genis: boolean }) => (
    <div className={cx('mx-auto overflow-hidden border-[6px] border-[#ecd9cf] bg-cream p-3', genis ? 'w-full rounded-[32px]' : 'w-[220px] rounded-[40px]')} aria-hidden="true">
      <div className={cx('grid gap-3', genis ? 'grid-cols-[1fr_1fr]' : 'grid-cols-1')}>
        <div className="flex items-center gap-2 rounded-[24px] bg-paper p-2">
          <Mascot boyut={genis ? 56 : 48} renk="peach" />
          <span className="grid flex-1 gap-1.5">
            <span className="block h-3 w-3/4 rounded-full bg-[#ecd9cf]" />
            <span className="block h-2.5 w-1/2 rounded-full bg-[#f3e3da]" />
          </span>
        </div>
        <div className="grid gap-2 rounded-[24px] bg-paper p-3">
          <span className="block h-4 rounded-full bg-[#f3e3da]">
            <span className="block h-full w-3/5 rounded-full bg-mint" />
          </span>
          <span className="block h-10 rounded-full bg-peach shadow-[0_4px_0_#f2ad85]" />
        </div>
      </div>
    </div>
  )
  return (
    <Section id="mobil" madde="Madde 17 · Responsive" title="Parmak dostu" lead="Hap düğmeler en az 48px yüksek, çipler 48px, anahtar 76 × 48. Parmak ucu için zaten büyük oldukları için telefonda hiçbir bileşen küçülmez ya da değişmez; yalnız ızgaralar tek sütuna iner.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="kabarcik grid min-w-0 grid-cols-1 content-start gap-5 p-6">
          <div className="relative grid min-h-[180px] place-items-center gap-4 rounded-[28px] bg-cream p-5" data-izgara={izgara ? '1' : '0'}>
            {izgara ? <span className="pointer-events-none absolute inset-0 rounded-[28px] bg-[linear-gradient(#e9827c40_1px,transparent_1px),linear-gradient(90deg,#e9827c40_1px,transparent_1px)] bg-[size:48px_48px]" aria-hidden="true" /> : null}
            <div className="relative flex flex-wrap items-center justify-center gap-4">
              <KawaiiButton boy="k">48px</KawaiiButton>
              <KawaiiButton renk="mint">56px</KawaiiButton>
              <KawaiiButton renk="salmon" className="!size-16 !p-0" aria-label="Kalp, 64 piksel">
                <Ikon ad="kalp" boyut={32} />
              </KawaiiButton>
            </div>
          </div>
          <KSwitch label="48px ızgarayı göster" checked={izgara} onChange={setIzgara} />
          <p className="rounded-[24px] bg-mint px-4 py-3 text-[16px] font-bold" data-hedef-olcum={olcum?.min ?? ''}>
            {olcum ? (
              <>
                Bu sayfadaki {olcum.n} dokunmatik denetimin en küçük kenarı <span className="tabular-nums">{olcum.min}px</span>
                {olcum.min >= 48 ? ' (en az 48px, WCAG 2.5.8 ve 2.5.5 hedefinin üstünde).' : '.'}
              </>
            ) : (
              'Ölçülüyor…'
            )}
          </p>
        </div>
        <div className="grid min-w-0 grid-cols-1 items-start gap-6 sm:grid-cols-[1.6fr_1fr]">
          <figure className="m-0">
            <Telefon genis />
            <figcaption className="mt-3 text-[15px] text-muted">Masaüstü: kartlar yan yana.</figcaption>
          </figure>
          <figure className="m-0">
            <Telefon genis={false} />
            <figcaption className="mt-3 text-center text-[15px] text-muted">Telefon: aynı bileşenler, alt alta.</figcaption>
          </figure>
        </div>
      </div>
    </Section>
  )
}

const CIFT: [string, string, string][] = [
  ['Gövde · krem zemin', '#5D4037', '#FFF8F3'],
  ['İkincil · krem zemin', '#735448', '#FFF8F3'],
  ['Kahverengi · nane', '#5D4037', '#A8E6CF'],
  ['Kahverengi · bebek pembesi', '#5D4037', '#FFD3B6'],
  ['Kahverengi · şeftali', '#5D4037', '#FFAAA5'],
  ['Kahverengi · lavanta', '#5D4037', '#D4A5A5'],
  ['Lacivert · lavanta', '#2E3A59', '#D4A5A5'],
  ['Beyaz · bebek pembesi', '#FFFFFF', '#FFD3B6'],
  ['Yüksek kontrast · lavanta', '#3E2723', '#D4A5A5'],
]

/** Madde 18: pastel zeminde okunabilirlik koyu kahverengiyle */
export function Erisim() {
  const { kontrast: mod } = useKawaii()
  return (
    <Section
      id="erisim"
      madde="Madde 18 · Erişilebilirlik"
      title="Pastel ama okunaklı"
      lead="Pastel renkler metin rengi olarak kullanılmaz: beyaz yazı bebek pembesinde 1,38:1'de kalır. Bütün metin koyu kahverengi; lavantada kahverengi 4,31:1 ile sınırın altında kaldığı için lacivert. Yüksek kontrast varyantı metni daha da koyulaştırır ve pastel yüzeylere 2px kahverengi çerçeve ekler."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <CloudCard className="px-6 pt-8 pb-7" maskot={<LottieMascot ruh={mod === 'yuksek' ? 'saskin' : 'mutlu'} renk="mint" boyut={80} />}>
            <p className="font-display text-[28px] font-extrabold">Varyantlar</p>
            <div className="mt-5">
              <Ayarlar onek="er-" />
            </div>
          </CloudCard>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-hidden="true">
            <div className="rounded-[28px] border-[3px] border-dashed border-salmon-d bg-peach p-4">
              <p className="font-display text-[22px] font-extrabold text-white">Derse başla</p>
              <p className="mt-2 flex items-center gap-2 text-[14px] font-bold">
                <Ikon ad="bulut" ruh="uzgun" boyut={24} /> Beyaz: {oran(kontrast('#FFFFFF', '#FFD3B6'))}
              </p>
            </div>
            <div className="rounded-[28px] border-[3px] border-mint-d bg-peach p-4">
              <p className="font-display text-[22px] font-extrabold text-brown">Derse başla</p>
              <p className="mt-2 flex items-center gap-2 text-[14px] font-bold">
                <Ikon ad="kalp" boyut={24} /> Kahverengi: {oran(kontrast('#5D4037', '#FFD3B6'))}
              </p>
            </div>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <div className="relative overflow-x-auto rounded-[28px] bg-paper [border:var(--line)_solid_var(--brown)]" tabIndex={0} role="region" aria-label="Kontrast tablosu">
            <table className="w-full min-w-[440px] border-collapse text-[15px]" data-kontrast-tablo="">
              <caption className="p-4 text-left font-display text-[20px] font-extrabold">Kontrast · WCAG 2.2</caption>
              <tbody>
                {CIFT.map(([a, y, z]) => {
                  const k = kontrast(y, z)
                  return (
                    <tr key={a} className="border-t-2 border-cream">
                      <th scope="row" className="p-3 text-left font-bold">
                        <span
                          className="mr-3 inline-grid size-9 place-items-center rounded-full align-middle font-display font-extrabold"
                          style={{
                            background: z,
                            color: y,
                            boxShadow: z === '#FFF8F3' ? 'inset 0 0 0 2px #ecd9cf' : undefined,
                          }}
                          aria-hidden="true"
                        >
                          A
                        </span>
                        {a}
                      </th>
                      <td className="p-3 text-right tabular-nums">{oran(k)}</td>
                      <td className="p-3 text-right font-extrabold">{k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : k >= 3 ? 'Büyük yazı' : 'Yetmez'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <KawaiiButton renk="mint" onClick={() => document.getElementById('ust')?.scrollIntoView()} ikon={<Ikon ad="yukari" boyut={24} />} className="justify-self-start">
            Başa dön
          </KawaiiButton>
        </div>
      </div>
    </Section>
  )
}
