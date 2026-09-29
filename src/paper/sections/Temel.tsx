import { useState } from 'react'
import { usePaper } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { Kesik } from '../components/Kesik'
import { PaperCard } from '../components/Paper'
import { Secim, Yarik } from '../components/Oyuk'
import { Kod, Section } from '../components/ui'

const DOGAL = [
  { ad: 'Kraft kâğıt', hex: '#C9A57B', token: 'Color/Kraft', rol: 'Zemin karton, en alt katman', v: 'var(--kraft)' },
  { ad: 'Bej', hex: '#EFE4D0', token: 'Color/Beige', rol: 'Bölüm levhaları', v: 'var(--bej)' },
  { ad: 'Krem', hex: '#FFFAF0', token: 'Color/Cream', rol: 'Üst katman: kartlar ve yazı', v: 'var(--krem)' },
  { ad: 'Kahve mürekkep', hex: '#2B2622', token: 'Color/Ink', rol: 'Bütün metin', v: 'var(--murekkep)' },
]
const PASTEL = [
  { ad: 'Mercan', hex: '#FF7B6B', token: 'Color/Coral', v: 'var(--mercan)' },
  { ad: 'Güneş', hex: '#FFC940', token: 'Color/Sun', v: 'var(--gunes)' },
  { ad: 'Turkuaz', hex: '#2EC4B6', token: 'Color/Teal', v: 'var(--turkuaz)' },
  { ad: 'Gökyüzü', hex: '#5FA8FF', token: 'Color/Sky', v: 'var(--gokyuzu)' },
  { ad: 'Leylak', hex: '#B7A0FF', token: 'Color/Lilac', v: 'var(--leylak)' },
  { ad: 'Yaprak', hex: '#62C370', token: 'Color/Leaf', v: 'var(--yaprak)' },
  { ad: 'Pembe', hex: '#FF93B4', token: 'Color/Pink', v: 'var(--pembe)' },
]

/** Madde 4: doğal kâğıt tonları ve doygun düz pastel bloklar */
export function Palet() {
  const { duyur } = usePaper()
  const kopyala = (hex: string) => {
    navigator.clipboard?.writeText(hex).then(
      () => duyur(`${hex} kopyalandı`),
      () => duyur(`Kopyalanamadı, değer: ${hex}`),
    )
  }
  const Ornek = ({ ad, hex, token, v, rol, i }: { ad: string; hex: string; token: string; v: string; rol?: string; i: number }) => (
    <li className="grid min-w-0 content-start gap-3">
      <button type="button" onClick={() => kopyala(hex)} aria-label={`${ad} ${hex}, kopyala`} className="block w-full border-0 bg-transparent p-0 text-left" data-renk-ornek={hex}>
        <PaperCard nivel={2} renk={v} tohum={30 + i * 5} r={16} dalga={3} adim={90} yuzClass="flex h-[112px] items-end p-3">
          <span className="rounded-md bg-krem px-2.5 py-0.5 font-mono text-[14px] font-bold">{hex}</span>
        </PaperCard>
      </button>
      <div>
        <p className="font-baslik text-[24px] leading-none">{ad}</p>
        <p className="mt-1 font-mono text-[13px] font-semibold text-soluk">{token}</p>
        {rol ? <p className="mt-1 text-[15px] font-medium">{rol}</p> : null}
      </div>
    </li>
  )
  const CIFT: [string, string, string][] = [
    ['Mürekkep · krem (üst katman)', '#2B2622', '#FFFAF0'],
    ['Mürekkep · bej levha', '#2B2622', '#EFE4D0'],
    ['Mürekkep · kraft zemin', '#2B2622', '#C9A57B'],
    ['Mürekkep · mercan', '#2B2622', '#FF7B6B'],
    ['Mürekkep · güneş', '#2B2622', '#FFC940'],
    ['Mürekkep · turkuaz', '#2B2622', '#2EC4B6'],
    ['Mürekkep · gökyüzü', '#2B2622', '#5FA8FF'],
    ['Mürekkep · leylak', '#2B2622', '#B7A0FF'],
    ['Mürekkep · yaprak', '#2B2622', '#62C370'],
    ['Mürekkep · pembe', '#2B2622', '#FF93B4'],
    ['İkincil gri · krem', '#5C5148', '#FFFAF0'],
    ['Beyaz · turkuaz (yapma)', '#FFFFFF', '#2EC4B6'],
  ]
  return (
    <Section
      id="palet"
      madde="Madde 4 · Renk paleti"
      renk="var(--mercan)"
      title="Kraft ve pastel bloklar"
      lead="Zemin doğal kâğıt tonları: kraft, bej, krem. Üstüne doygun, düz pastel bloklar. Metin hiçbir zaman pastelin üstüne beyaz yazılmaz (en fazla 2,5:1): koyu kahve mürekkep bütün pastellerde 5,9:1 ve üstünü verir."
    >
      <p className="etiket mb-4">Doğal tonlar</p>
      <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-8 p-0 lg:grid-cols-4">
        {DOGAL.map((c, i) => (
          <Ornek key={c.hex} {...c} i={i} />
        ))}
      </ul>
      <p className="etiket mt-12 mb-4">Doygun pastel bloklar</p>
      <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-8 p-0 sm:grid-cols-3 lg:grid-cols-4">
        {PASTEL.map((c, i) => (
          <Ornek key={c.hex} {...c} i={i + 6} />
        ))}
      </ul>
      <div className="mt-12 overflow-x-auto" role="region" aria-label="Kontrast tablosu" tabIndex={0}>
        <PaperCard nivel={2} duz tohum={71} r={16} dalga={2} yuzClass="p-5">
          <table className="w-full min-w-[460px] border-collapse text-[16px]" data-kontrast-tablo="">
            <caption className="pb-3 text-left font-baslik text-[28px] leading-none">Kontrast · WCAG 2.2</caption>
            <tbody>
              {CIFT.map(([a, y, z]) => {
                const k = kontrast(y, z)
                return (
                  <tr key={a} className="border-t-2 border-bej">
                    <th scope="row" className="py-2 pr-3 text-left font-bold">
                      <span className="mr-3 inline-grid size-9 place-items-center rounded-[14px_8px_16px_9px/9px_16px_8px_14px] align-middle font-baslik text-[20px]" style={{ background: z, color: y }} aria-hidden="true">
                        A
                      </span>
                      {a}
                    </th>
                    <td className="py-2 text-right tabular-nums">{oran(k)}</td>
                    <td className="py-2 pl-3 text-right font-extrabold">{k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : k >= 3 ? 'Büyük yazı' : 'Yetmez'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </PaperCard>
      </div>
    </Section>
  )
}

const HARF_RENK = [
  { id: 'var(--murekkep)', ad: 'Mürekkep', hex: '#2B2622' },
  { id: 'var(--mercan)', ad: 'Mercan', hex: '#FF7B6B' },
  { id: 'var(--gokyuzu)', ad: 'Gökyüzü', hex: '#5FA8FF' },
  { id: 'var(--yaprak)', ad: 'Yaprak', hex: '#62C370' },
]

/** Madde 5: kâğıttan kesilmiş harfler */
export function Yazi() {
  const [ornek, setOrnek] = useState('Kâğıt Orman')
  const [boy, setBoy] = useState(84)
  const [renk, setRenk] = useState(HARF_RENK[0].id)
  const secili = HARF_RENK.find((r) => r.id === renk)!
  const k = kontrast(secili.hex, '#FFFAF0')
  return (
    <Section
      id="yazi"
      madde="Madde 5 · Tipografi"
      renk="var(--gokyuzu)"
      title="Tıknaz, kesik, kalın"
      lead="Başlıklar Titan One: kalın, tıknaz, köşeleri kâğıttan kesilmiş gibi. Harfin etrafındaki krem halo altındaki ikinci kâğıt, sert ve yumuşak gölge onu yüzeyden ayırır. Büyük İ Titan One'da olmadığı için Paytone One'dan tamamlanır. Gövde Figtree."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        <PaperCard nivel={3} renk="var(--gokyuzu)" tohum={61} r={24} dalga={4} yuzClass="grid min-h-[300px] place-items-center p-6 md:p-10">
          <p className="kesik-yazi text-center [overflow-wrap:anywhere]" style={{ fontSize: `min(${boy}px, 15vw)`, lineHeight: 1, ['--fill' as string]: renk, color: renk }} data-harf-ornek="">
            {ornek || ' '}
          </p>
        </PaperCard>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <div>
            <label htmlFor="harf-girdi" className="mb-2 block font-extrabold">
              Kendi başlığın
            </label>
            <input id="harf-girdi" value={ornek} onChange={(e) => setOrnek(e.target.value)} maxLength={26} className="oyuk" />
          </div>
          <Yarik label="Boy" value={boy} min={32} max={140} onChange={setBoy} format={(v) => `${v}px`} />
          <Secim<string> legend="Harf kâğıdı" name="harf-renk" value={renk} onChange={setRenk} options={HARF_RENK.map((r) => ({ id: r.id, ad: r.ad, renk: r.id === 'var(--murekkep)' ? 'var(--bej)' : r.id }))} />
          <p className="rounded-xl bg-bej p-4 text-[16px] font-medium" data-harf-kontrast={k.toFixed(2)}>
            <b>{secili.ad}</b> harf, krem halo üstünde <b className="tabular-nums">{oran(k)}</b>: {k >= 4.5 ? 'metin olarak yeterli.' : k >= 3 ? 'yalnız büyük başlık için yeterli.' : 'okunmaz; yalnız süs.'}
          </p>
          <table className="w-full border-collapse text-[16px]">
            <caption className="etiket pb-2 text-left">Ölçek</caption>
            <tbody>
              {[
                ['Başlık 1', 'Titan One', '60–150px'],
                ['Başlık 2', 'Titan One', '40–84px'],
                ['Düğme', 'Titan One', '18–26px'],
                ['Gövde', 'Figtree 500', '18px'],
                ['Etiket', 'Mono 800', '14px'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-t-2 border-krem">
                  <th scope="row" className="py-1.5 pr-3 text-left font-bold">
                    {a}
                  </th>
                  <td className="py-1.5">{b}</td>
                  <td className="py-1.5 text-right tabular-nums">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Kod label="Kesik harf CSS" sar={false}>{`.kesik-yazi {
  -webkit-text-stroke: .2em var(--krem);
  paint-order: stroke fill;
  text-shadow: sert 0 blur + yumuşak;
}`}</Kod>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Kesik ad="yildiz" boyut={40} />
        <p className="max-w-[60ch] text-[16px] font-medium text-soluk">Ğ, Ş, İ, Ö, Ç, Ü: hepsi çizim ve gölge bütünlüğünü bozmadan gelir. Fredoka One'da ğ, ş ve İ olmadığı için tercih edilmedi.</p>
      </div>
    </Section>
  )
}
