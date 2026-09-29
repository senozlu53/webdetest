import { useEffect, useState } from 'react'
import { usePaper } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { Ayarlar } from '../components/Header'
import { Sahne, useParalaks } from '../components/Diorama'
import { Kesik } from '../components/Kesik'
import { PaperButton, PaperCard } from '../components/Paper'
import { Secim, Yarik, Yuva } from '../components/Oyuk'
import { Kod, Section } from '../components/ui'

const KAT_TABLO: { ad: string; ay: number; ax: number }[] = [
  { ad: 'Bulutlar', ay: 70, ax: 60 },
  { ad: 'Güneş', ay: 40, ax: 0 },
  { ad: 'Uzak dağlar', ay: 54, ax: 0 },
  { ad: 'Yakın dağlar', ay: 38, ax: 0 },
  { ad: 'Tepeler', ay: 22, ax: 0 },
  { ad: 'Ön plan', ay: 0, ax: 0 },
]

/** Madde 16: derin paralaks. Her katman kendi genliğiyle kayar; ilerleme kaydırmaya ya da kaydırıcıya bağlanır */
export function Hareket() {
  const { hareket } = usePaper()
  const [bagla, setBagla] = useState(true)
  const [p, setP] = useState(60)
  const [hiz, setHiz] = useState(1)
  const canli = hareket && bagla
  const ref = useParalaks<HTMLDivElement>('gecis', canli)
  useEffect(() => {
    if (!canli) ref.current?.style.setProperty('--dp', String(p / 100))
  }, [canli, p, ref])
  return (
    <Section
      id="hareket"
      madde="Madde 16 · Hareket dili"
      renk="var(--mercan)"
      title="Her kâğıt başka hızda"
      lead="Sayfa kayarken uzaktaki katmanlar geride kalır, yakındakiler sayfayla birlikte gider. İlerleme --dp değişkeninde (0…1) durur; her katman bunu kendi genliğiyle çarpar. Kaydırmadan denemek için ilerleme kaydırıcısını kullan: hareket kapalıyken de çalışır."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        <PaperCard nivel={4} renk="var(--gokyuzu)" tohum={230} r={28} dalga={5} yuzClass="relative overflow-hidden" data-paralaks-demo="">
          <div ref={ref} className="relative h-[400px] overflow-hidden">
            <Sahne derinlik={5} hiz={hiz} kucuk />
          </div>
        </PaperCard>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Yuva label="Kaydırmaya bağla" hint={hareket ? 'Bu kutu ekrandan geçerken ilerler.' : 'Hareket kapalı: yalnız kaydırıcı çalışır.'} checked={bagla} onChange={setBagla} />
          <Yarik label="İlerleme (--dp)" value={p} min={0} max={100} onChange={setP} format={(v) => (v / 100).toFixed(2).replace('.', ',')} renk="var(--mercan)" />
          <Yarik label="Genlik çarpanı" value={hiz} min={0} max={2} step={0.25} onChange={setHiz} format={(v) => `${v.toString().replace('.', ',')}×`} renk="var(--mercan)" />
          <PaperCard nivel={2} duz tohum={231} r={16} dalga={2} yuzClass="p-4">
            <table className="w-full border-collapse text-[15px]" data-genlik-tablo="">
              <caption className="etiket pb-2 text-left">Katman genlikleri</caption>
              <tbody>
                {KAT_TABLO.map((k) => (
                  <tr key={k.ad} className="border-t-2 border-bej">
                    <th scope="row" className="py-1.5 pr-3 text-left font-bold">
                      {k.ad}
                    </th>
                    <td className="py-1.5 text-right font-mono tabular-nums">{Math.round(k.ay * hiz)} px</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PaperCard>
          <Kod label="Paralaks CSS" sar={false}>{`.paralaks { transform: translate3d(
  calc(var(--dp) * var(--ax) * 1px),
  calc(var(--dp) * var(--ay) * 1px), 0); }`}</Kod>
        </div>
      </div>
    </Section>
  )
}

/** Madde 17: dar ekranda katman sayısı azalır (flattening) */
export function Mobil() {
  const s = usePaper()
  const [d, setD] = useState('oto')
  const derin = (kutu: 'tel' | 'masa') => (d === 'oto' ? (kutu === 'tel' ? 3 : 5) : +d)
  const telD = derin('tel')
  const masaD = derin('masa')
  const ohd = (n: number) => [n >= 5 && 'bulut', n >= 4 && 'tepe', n >= 3 && 'dağ', n >= 2 && 'ön plan', 'gökyüzü'].filter(Boolean).join(' · ')
  return (
    <Section
      id="mobil"
      madde="Madde 17 · Responsive"
      renk="var(--gunes)"
      title="Dar ekranda düzleş"
      lead="Derin katmanlar yatay alan yer: kayan bulutlar, taşan dağlar. Katman sayısı otomatik azalır: 640 pikselin altında 3, 1024 pikselin altında 4, üstünde 5. Sayfadaki her diyorama bu değeri kullanır; ayardan elle de seçilebilir."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <figure className="m-0 grid gap-3">
          <PaperCard nivel={4} renk="var(--gokyuzu)" tohum={240} r={30} dalga={4} yuzClass="relative overflow-hidden" data-derinlik-kutu="tel">
            <div className="relative h-[380px] overflow-hidden" data-derinlik={telD}>
              <Sahne derinlik={telD} kucuk />
            </div>
          </PaperCard>
          <figcaption className="text-[16px] font-medium">
            <b>Telefon</b> · {telD} katman: {ohd(telD)}
          </figcaption>
        </figure>
        <figure className="m-0 grid gap-3">
          <PaperCard nivel={4} renk="var(--gokyuzu)" tohum={241} r={30} dalga={4} yuzClass="relative overflow-hidden" data-derinlik-kutu="masa">
            <div className="relative h-[380px] overflow-hidden" data-derinlik={masaD}>
              <Sahne derinlik={masaD} kucuk />
            </div>
          </PaperCard>
          <figcaption className="text-[16px] font-medium">
            <b>Masaüstü</b> · {masaD} katman: {ohd(masaD)}
          </figcaption>
        </figure>
      </div>
      <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="grid gap-5">
          <Secim<string>
            legend="Katman sayısı (iki kutu için)"
            name="mobil-derinlik"
            value={d}
            onChange={setD}
            options={[
              { id: 'oto', ad: 'Oto' },
              { id: '1', ad: '1' },
              { id: '2', ad: '2' },
              { id: '3', ad: '3' },
              { id: '4', ad: '4' },
              { id: '5', ad: '5' },
            ]}
          />
          <p className="rounded-2xl bg-bej p-4 text-[16px] font-medium" data-derinlik-sayfa={s.derinlik}>
            Bu sayfa şu an <b className="tabular-nums">{s.genislik}</b> piksel genişlikte: etkin derinlik <b className="tabular-nums">{s.derinlik}</b>.
          </p>
        </div>
        <PaperCard nivel={2} duz tohum={242} r={16} dalga={2} yuzClass="p-4">
          <table className="w-full border-collapse text-[15px]">
            <caption className="etiket pb-2 text-left">Otomatik kurallar</caption>
            <tbody>
              {[
                ['< 640 px', '3', 'gökyüzü + ön plan + dağlar'],
                ['640–1023 px', '4', '+ tepeler, ağaçlar'],
                ['≥ 1024 px', '5', '+ bulutlar'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-t-2 border-bej">
                  <th scope="row" className="py-1.5 pr-3 text-left font-bold">
                    {a}
                  </th>
                  <td className="text-center font-mono font-bold">{b}</td>
                  <td className="py-1.5 text-right">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PaperCard>
      </div>
    </Section>
  )
}

const OKU = 'Kâğıt orman sabahları erken uyanır. İlk ışık dağın kenarından kayar, nehir kâğıdın altında görünmez akar.'

/** Madde 18: yazı hep en üstteki pürüzsüz kâğıtta, yüksek kontrastla */
export function Erisim() {
  const s = usePaper()
  const kKraft = kontrast('#2B2622', '#C9A57B')
  const kKrem = kontrast('#2B2622', '#FFFAF0')
  return (
    <Section
      id="erisim"
      madde="Madde 18 · Erişilebilirlik"
      renk="var(--turkuaz)"
      title="Yazı hep üst katmanda"
      lead="Dokulu zemin harflerin kenarını bozar. Bu yüzden bütün metin, dokusuz krem ya da bej kâğıtta durur; doku yalnız altta ve süste. Kontrast bu yüzeylerde 11:1'in üstü. Varyantlar: doku kapalı, yüksek kontrast (koyu mürekkep ve her kâğıda koyu kenar), hareket kapalı, katman derinliği."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid min-w-0 content-start gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <PaperCard nivel={3} renk="var(--kraft)" tohum={250} r={18} dalga={3} yuzClass="p-5" data-yapma="">
              <p className="etiket">Yapma</p>
              <p className="mt-2 text-[17px] font-semibold">{OKU}</p>
              <p className="mt-3 text-[14px] font-bold">Dokulu kraft üstünde: {oran(kKraft)} (doku en koyu yerinde ~4,7:1), harf kenarları pürüzlü.</p>
            </PaperCard>
            <PaperCard nivel={3} duz tohum={251} r={18} dalga={3} yuzClass="p-5" data-yap="">
              <p className="etiket">Yap</p>
              <p className="mt-2 text-[17px] font-semibold">{OKU}</p>
              <p className="mt-3 text-[14px] font-bold">Pürüzsüz krem üstünde: {oran(kKrem)}, kenarlar net.</p>
            </PaperCard>
          </div>
          <Yuva label="Denemek için: dokuyu kapat" hint="Sayfa genelinde doku düz olur; metin zaten dokusuzdu." checked={s.doku === 'duz'} onChange={(v) => s.setDoku(v ? 'duz' : 'karton')} />
          <ul className="m-0 grid list-disc gap-2 pl-5 text-[16px] font-medium">
            <li>
              Metin taşıyan her yüzey <code className="font-mono">data-duz</code>: pürüzsüz krem ya da bej.
            </li>
            <li>Pastel bloklarda yalnız koyu kahve mürekkep (5,9:1 ve üstü); beyaz yazı yok.</li>
            <li>Yüksek kontrastta her kâğıda 1,5 piksel koyu kenar çizilir, mürekkep neredeyse siyah.</li>
            <li>Durum renkle değil şekille: kâğıt yuvarlak, onay kesiği, "AÇIK / KAPALI" yazısı.</li>
            <li>Paralaks ve yaylanma hareket kapalıyken durur; katmanlar yerinde kalır.</li>
          </ul>
        </div>
        <div className="grid min-w-0 content-start gap-6">
          <PaperCard nivel={4} duz tohum={252} r={22} dalga={3} yuzClass="p-6">
            <h3 className="text-[34px]">Varyantlar</h3>
            <div className="mt-5">
              <Ayarlar onek="er-" />
            </div>
          </PaperCard>
          <PaperButton renk="var(--gunes)" boy="k" onClick={() => document.getElementById('ust')?.scrollIntoView()} ikon={<Kesik ad="ok" boyut={24} nivel={1} halo={false} renk="var(--murekkep)" className="-rotate-90" />}>
            Başa dön
          </PaperButton>
        </div>
      </div>
    </Section>
  )
}
