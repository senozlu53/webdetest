import { useState } from 'react'
import { useSketch } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { Ikon } from '../components/Icons'
import { Not } from '../components/Not'
import { RoughBox } from '../components/Rough'
import { Aralik } from '../components/Controls'
import { Kod, Section } from '../components/ui'

const PALET = [
  { ad: 'Eskiz Defteri Kremi', hex: '#F9F6F0', token: 'Color/SketchCream', rol: 'Sayfa zemini', metin: '#2B2B2B' },
  { ad: 'Kömür Siyahı', hex: '#2B2B2B', token: 'Color/Charcoal', rol: 'Çizgi ve gövde metni', metin: '#F9F6F0' },
  { ad: 'Mürekkep Mavisi', hex: '#1D3557', token: 'Color/Ink', rol: 'Başlık, bağlantı, dolgu', metin: '#F9F6F0' },
  { ad: 'Kırmızı Kalem', hex: '#E63946', token: 'Color/RedPencil', rol: 'Vurgu çizgisi, not, daire', metin: '#2B2B2B' },
]

/** Madde 4: dört renk. Kırmızı kalem 3,86:1 olduğu için küçük metinde koyu tonuyla */
export function Palet() {
  const { duyur } = useSketch()
  const kopyala = (hex: string) => {
    navigator.clipboard?.writeText(hex).then(
      () => duyur(`${hex} kopyalandı`),
      () => duyur(`Kopyalanamadı, değer: ${hex}`),
    )
  }
  const CIFT: [string, string, string][] = [
    ['Kömür · krem', '#2B2B2B', '#F9F6F0'],
    ['Mürekkep · krem', '#1D3557', '#F9F6F0'],
    ['İkincil gri · krem', '#5A5A5A', '#F9F6F0'],
    ['Kırmızı kalem · krem', '#E63946', '#F9F6F0'],
    ['Koyu kırmızı · krem', '#C1121F', '#F9F6F0'],
    ['Krem · mürekkep dolgu', '#F9F6F0', '#1D3557'],
    ['Beyaz · koyu kırmızı dolgu', '#FFFFFF', '#C1121F'],
    ['Beyaz · kırmızı kalem dolgu', '#FFFFFF', '#E63946'],
  ]
  return (
    <Section id="palet" madde="Madde 4 · Renk paleti" title="Dört kalem, bir defter" lead="Zemin krem, çizgi kömür, başlık mürekkep mavisi, vurgu kırmızı kalem. Kırmızı kalem kremde 3,86:1: çizgi, daire ve büyük yazı için yeter; küçük yazıda koyu tonu (#C1121F, 5,77:1) kullanılır.">
      <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {PALET.map((p, i) => (
          <li key={p.hex} className="grid min-w-0 content-start gap-4">
            <button type="button" onClick={() => kopyala(p.hex)} aria-label={`${p.ad} ${p.hex}, kopyala`} className="relative block w-full bg-transparent p-0" data-renk-ornek={p.hex}>
              <RoughBox as="span" tohum={30 + i * 4} kare={3} sekil="yuvarlak" r={18} cizgi={2.4} dolgu={p.hex === '#F9F6F0' ? undefined : p.hex} dolguTip="hachure" aralik={p.hex === '#2B2B2B' ? 5 : 6} className="grid h-[150px] place-items-center">
                <span className="relative rounded-md bg-kagit px-3 py-1 font-daktilo text-[16px] font-bold text-komur">{p.hex}</span>
              </RoughBox>
            </button>
            <div>
              <p className="font-el text-[34px] leading-none font-bold text-murekkep">{p.ad}</p>
              <p className="mt-1 font-daktilo text-[14px] text-soluk">{p.token}</p>
              <p className="mt-1.5 text-[16px]">{p.rol}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
        <RoughBox tohum={61} kare={3} sekil="yuvarlak" r={14} className="min-w-0 p-6">
          <p className="kicker">Kırmızı kalemin yeri</p>
          <p className="mt-3 text-[18px]">
            Kırmızı ile <Not tur="underline">altı çizilir</Not>,{' '}
            <Not tur="circle" pad={6}>
              daire
            </Not>{' '}
            içine alınır ya da <Not tur="crossed-off">üstü karalanır</Not>. Metnin kendisi hiçbir zaman açık kırmızı olmaz.
          </p>
          <p className="mt-4 flex items-start gap-3 font-not text-[22px] leading-tight text-kirmiziK" data-kirmizi-not="">
            <Ikon ad="kalem" boyut={28} className="mt-0.5 shrink-0" />
            <span>Küçük kırmızı not: koyu ton, {oran(kontrast('#C1121F', '#F9F6F0'))}</span>
          </p>
        </RoughBox>
        <div className="min-w-0 overflow-x-auto" role="region" aria-label="Kontrast tablosu" tabIndex={0}>
          <table className="el-tablo w-full min-w-[460px] text-[16px]" data-kontrast-tablo="">
            <caption className="pb-2 text-left font-el text-[32px] leading-none font-bold text-murekkep">Kontrast · WCAG 2.2</caption>
            <tbody>
              {CIFT.map(([a, y, z]) => {
                const k = kontrast(y, z)
                return (
                  <tr key={a} className="border-b-2 border-komur/20">
                    <th scope="row" className="py-2.5 pr-3 text-left font-bold">
                      <span className="mr-3 inline-grid size-9 place-items-center rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-komur align-middle font-el text-[24px] leading-none font-bold" style={{ background: z, color: y }} aria-hidden="true">
                        A
                      </span>
                      {a}
                    </th>
                    <td className="py-2.5 text-right tabular-nums">{oran(k)}</td>
                    <td className="py-2.5 pl-3 text-right font-bold">{k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : k >= 3 ? 'Büyük yazı' : 'Yetmez'}</td>
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

/** Madde 5 · 18: el yazısı yalnız başlıkta; gövde okunaklı sans */
export function Yazi() {
  const [ornek, setOrnek] = useState('Sabah kahvesi yarım kalmış bir çizim gibi')
  const [boy, setBoy] = useState(64)
  return (
    <Section
      id="yazi"
      madde="Madde 5 · Tipografi"
      title="Dört el, tek okuyucu"
      lead="Başlıklar Caveat (hafif düzensiz el yazısı), kenar notları Patrick Hand, etiketler ve kod Courier Prime. Gövde metni Atkinson Hyperlegible Next: harf biçimleri birbirine karışmasın diye tasarlanmış sans. Dördü de ğ, ş, ı, İ, ç, ö, ü içerir."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        <RoughBox tohum={71} kare={3} sekil="yuvarlak" r={16} cizgi={2.2} className="tarama tarama-mavi min-w-0 p-6 md:p-8">
          <p className="kicker">Caveat · 700 · başlık</p>
          <p className="mt-2 font-el font-bold text-murekkep [overflow-wrap:anywhere]" style={{ fontSize: boy, lineHeight: 1 }} data-yazi-ornek="">
            {ornek || ' '}
          </p>
          <p className="kicker mt-8">Patrick Hand · 400 · not</p>
          <p className="not mt-2 text-[26px]">Kenara düşülmüş not: üstü çizili, altı çizili, oklu.</p>
          <p className="kicker mt-6">Courier Prime · 700 · etiket ve kod</p>
          <p className="mt-2 font-daktilo text-[18px] font-bold tracking-wide">SİPARİŞ NO. 0427 · MASA 3</p>
          <p className="kicker mt-6">Atkinson Hyperlegible Next · 400 · gövde</p>
          <p className="mt-2 max-w-[56ch] text-[18px]">Gövde metni 18 piksel, satır aralığı 1,65. Il1 ve O0 gibi karışan harfler birbirinden ayrılır; uzun okumada göz yorulmaz. El yazısı burada olsaydı disleksili okuyucu için her satır bir bulmaca olurdu.</p>
        </RoughBox>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <div>
            <label htmlFor="yazi-ornek" className="mb-1.5 block font-bold">
              Kendi başlığın
            </label>
            <input id="yazi-ornek" value={ornek} onChange={(e) => setOrnek(e.target.value)} maxLength={44} className="block min-h-[54px] w-full rounded-lg border-2 border-komur bg-transparent px-4 text-[18px] font-medium text-komur" />
          </div>
          <Aralik label="Başlık boyu" value={boy} min={28} max={110} onChange={setBoy} format={(v) => `${v}px`} />
          <table className="el-tablo w-full text-[16px]">
            <caption className="kicker pb-2 text-left">Ölçek</caption>
            <tbody>
              {[
                ['Başlık 1', 'Caveat 700', '84–190px'],
                ['Başlık 2', 'Caveat 700', '48–92px'],
                ['Başlık 3', 'Caveat 700', '34–42px'],
                ['Not', 'Patrick Hand', '19–34px'],
                ['Etiket', 'Courier Prime 700', '14px'],
                ['Gövde', 'Atkinson 400', '18px'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-b-2 border-komur/20">
                  <th scope="row" className="py-2 pr-3 text-left font-bold">
                    {a}
                  </th>
                  <td className="py-2">{b}</td>
                  <td className="py-2 text-right tabular-nums">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Kod label="Yazı yığını" sar={false}>{`--font-el:     'Caveat Variable', cursive;
--font-not:    'Patrick Hand', cursive;
--font-daktilo:'Courier Prime', 'Courier New', monospace;
--font-sans:   'Atkinson Hyperlegible Next Variable', sans-serif;`}</Kod>
          <p className="text-[15px] text-soluk">Caveat 28 pikselin altında inceldiği için o boyun altına inmez. ₺, → ve ✓ bu fontlarda yok (Caveat hariç ₺): fiyatlar "TL", oklar ve onay işaretleri çizimdir.</p>
        </div>
      </div>
    </Section>
  )
}
