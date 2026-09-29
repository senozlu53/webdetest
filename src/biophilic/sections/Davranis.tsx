import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { oran } from '../lib/contrast'
import { DOKU_ALFA, useBiophilic, type DogaSeviye } from '../lib/store'
import { palet as hesapPalet, saatMetni } from '../lib/zaman'
import { ZamanSahnesi } from '../components/Ambient'
import { BiophilicCard, BioButton } from '../components/Biophilic'
import { Bitki } from '../components/Bitki'
import { Ayarlar } from '../components/Header'
import { Ikon } from '../components/Ikon'
import { Anahtar, Aralik, Kod, Section } from '../components/ui'

/* ───────────────────────── Madde 16 · Hareket ───────────────────────── */

export function Hareket() {
  const { hareket, hareketTercih } = useBiophilic()
  const [nefes, setNefes] = useState(6)
  const [nabiz, setNabiz] = useState(64)
  const [ruzgar, setRuzgar] = useState(2.4)
  const sure = 60 / nefes
  return (
    <Section
      id="hareket"
      ikon="kalp"
      madde="Madde 16 · Hareket dili"
      title={
        <>
          Kalp atışı ve <span className="vurgu">nefes</span> hızında
        </>
      }
      lead="Hareket kullanıcıyı çağırmak için değil, ona eşlik etmek için vardır. Genişleme ve daralma dakikada 4–16 nefes, kalp atışı dakikada 50–110 vuruş hızındadır; hiçbir öğe bundan hızlı yer değiştirmez. Hareket kapalıyken her şey durur ama eksiksiz görünür."
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="cam min-w-0 p-6 sm:p-9 lg:col-span-6" data-nefes-hareket="">
          <h3 className="baslik text-[26px]">Genişleme ve daralma</h3>
          <div className="nefesle mt-6" style={{ ['--nefes-sure' as string]: `${sure.toFixed(2)}s` } as CSSProperties} data-nefesle={sure.toFixed(2)}>
            <div className="nefes" style={{ width: 'min(100%, 300px)' }} aria-hidden="true">
              <span className="nefes-halka" data-h="3" />
              <span className="nefes-halka" data-h="2" />
              <span className="nefes-halka" data-h="1" />
              <div className="nefes-orta cam">
                <p className="rakam text-[26px] leading-none">{nefes}</p>
                <p className="text-[12px] text-soluk">nefes/dk</p>
              </div>
            </div>
          </div>
          <div className="mt-6 max-w-[380px]">
            <Aralik label="Nefes hızı" value={nefes} min={4} max={16} step={1} onChange={setNefes} format={(v) => `${v} / dk · ${(60 / v).toFixed(1).replace('.', ',')} sn`} />
          </div>
        </div>
        <div className="cam min-w-0 p-6 sm:p-9 lg:col-span-6" data-kalp-hareket="">
          <h3 className="baslik text-[26px]">Kalp atışı</h3>
          <div className="relative mx-auto mt-6 grid aspect-square w-[min(100%,300px)] place-items-center">
            <span className="halka-yayil absolute inset-[22%] rounded-full border-2 border-[var(--kontrol)]" style={{ ['--halka-sure' as string]: `${(60 / nabiz) * 3}s`, ['--d' as string]: '0s' } as CSSProperties} aria-hidden="true" />
            <span className="halka-yayil absolute inset-[22%] rounded-full border-2 border-[var(--kontrol)]" style={{ ['--halka-sure' as string]: `${(60 / nabiz) * 3}s`, ['--d' as string]: `${(60 / nabiz) * 1.5}s` } as CSSProperties} aria-hidden="true" />
            <span className="kalp-atar grid size-[38%] place-items-center rounded-full bg-btn text-btn-yazi" style={{ ['--kalp-sure' as string]: `${(60 / nabiz).toFixed(3)}s`, boxShadow: 'var(--golge-2)' }} data-kalp={nabiz} aria-hidden="true">
              <Ikon ad="kalp" boyut={54} kalin={1.6} />
            </span>
          </div>
          <p className="rakam mt-4 text-center text-[24px]" data-kalp-metin="">
            {nabiz} bpm <span className="text-[16px] font-normal text-soluk">· vuruş {(60 / nabiz).toFixed(2).replace('.', ',')} sn</span>
          </p>
          <div className="mx-auto mt-4 max-w-[380px]">
            <Aralik label="Nabız" value={nabiz} min={50} max={110} step={2} onChange={setNabiz} format={(v) => `${v} bpm`} />
          </div>
        </div>
      </div>

      <div className="cam mt-[var(--aralik)] p-6 sm:p-9" data-ruzgar-hareket="">
        <div className="grid grid-cols-1 items-center gap-x-10 gap-y-6 md:grid-cols-12">
          <div className="min-w-0 md:col-span-4">
            <h3 className="baslik text-[26px]">Rüzgâr</h3>
            <p className="mt-2 text-[15.5px] text-soluk">Bitki köklerinden salınır. Yalnız “tam” doğa katmanında ve hareket açıkken çalışır.</p>
            <div className="mt-5">
              <Aralik label="Salınım" value={ruzgar} min={0.5} max={5} step={0.1} onChange={setRuzgar} format={(v) => `±${v.toFixed(1).replace('.', ',')}°`} />
            </div>
          </div>
          <div className="flex min-w-0 items-end justify-around gap-2 md:col-span-8" style={{ ['--r-gen' as string]: ruzgar, ['--r-sure' as string]: '7s' } as CSSProperties} data-cayir="">
            {(['egrelti', 'monstera', 'kaucuk', 'sukulent'] as const).map((t, i) => (
              <Bitki key={t} tur={t} className="h-[180px] max-w-[24%]" style={{ ['--d' as string]: `${i * -1.3}s` } as CSSProperties} />
            ))}
          </div>
        </div>
      </div>

      <div className="cam mt-[var(--aralik)] overflow-x-auto p-6 sm:p-9" role="region" aria-label="Hareket değerleri" tabIndex={0}>
        <table className="tablo w-full min-w-[680px] border-collapse text-[16px]" data-hareket-tablo="">
          <caption>Hareket değerleri</caption>
          <tbody>
            {[
              ['Nefes (al / ver)', '4–15 sn', 'ease-in-out, sonsuz', 'halka ölçeği %36 → %66 (iç) / %70 → %100 (dış)'],
              ['Kalp atışı', '60 / bpm sn', 'ease-in-out, çift atım', '%16 ve %9 büyüme; yayılan halka 3 vuruşta söner'],
              ['Işık huzmesi', '9 sn', 'ease-in-out, sonsuz', 'yalnız opaklık, %32 ↔ %62'],
              ['Bulut', '140–220 sn', 'doğrusal, sonsuz', 'yalnız yatay taşıma'],
              ['Bitki salınımı', '7–8 sn', 'ease-in-out, sonsuz', '±1,3–2,5° köke göre'],
              ['Gün ışığı geçişi', '1000 ms', 'ease-in-out', 'renkler, güneş konumu, gölge yönü; hafifte 400 ms, sürüklemede 140 ms'],
              ['Bölüm belirişi', '1,4 sn', 'cubic-bezier(.22, .61, .36, 1)', 'opaklık + 14 px yerleşme'],
            ].map(([a, b, c, d]) => (
              <tr key={a}>
                <th scope="row" className="font-medium">
                  {a}
                </th>
                <td className="tabular-nums">{b}</td>
                <td className="font-mono text-[13px]">{c}</td>
                <td>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="cam mt-6 max-w-[720px] p-5 text-[16.5px] text-soluk sm:p-6" data-hareket-durum={hareket ? 'acik' : 'kapali'}>
        Hareket şu an <b className="text-metin">{hareket ? 'açık' : 'kapalı'}</b> ({hareketTercih === 'oto' ? 'sistem tercihi' : 'ayardan'}). Kapalıyken halkalar, kalp ve bitkiler durur; nefes sayacı adım adını ve geri sayımı yazıyla verir.
      </p>
    </Section>
  )
}

/* ───────────────────────── Madde 17 · Mobil ───────────────────────── */

interface Olcum {
  dugum: number
  animasyon: number
  bulanik: number
  gecis: string
}

function KarsilastirmaKutusu({ seviye }: { seviye: DogaSeviye }) {
  const kok = useRef<HTMLDivElement>(null)
  const [o, setO] = useState<Olcum | null>(null)
  useEffect(() => {
    const t = window.setTimeout(() => {
      const el = kok.current
      if (!el) return
      const hepsi = Array.from(el.querySelectorAll<HTMLElement | SVGElement>('*'))
      setO({
        dugum: el.querySelector('.amb')?.querySelectorAll('*').length ?? 0,
        animasyon: hepsi.filter((e) => getComputedStyle(e).animationName !== 'none').length,
        bulanik: Array.from(el.querySelectorAll('.cam')).filter((e) => getComputedStyle(e).backdropFilter !== 'none').length,
        gecis: (() => {
          const g = getComputedStyle(el.querySelector('.zaman-alan') ?? el)
            .getPropertyValue('--gecis')
            .trim()
          return `${Math.round(g.endsWith('ms') ? parseFloat(g) : parseFloat(g) * 1000)} ms`
        })(),
      })
    }, 300)
    return () => window.clearTimeout(t)
  }, [seviye])
  return (
    <div ref={kok} data-karsilastirma={seviye}>
      <ZamanSahnesi seviye={seviye} className="border border-[var(--cam-kenar)]" icKlas="relative z-10 p-4 pt-28">
        <BiophilicCard ikon={seviye === 'tam' ? 'agac' : 'yaprak'} kicker={seviye === 'tam' ? 'Tam' : 'Hafif'} baslik={seviye === 'tam' ? 'Canlı ortam' : 'Sade ortam'} serit={false}>
          <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-1 text-[14.5px]" data-olcum={o ? `${o.dugum}/${o.animasyon}/${o.bulanik}/${o.gecis}` : ''}>
            <dt className="text-soluk">Ortam düğümü</dt>
            <dd className="m-0 text-right font-medium tabular-nums">{o?.dugum ?? '…'}</dd>
            <dt className="text-soluk">Animasyonlu öğe</dt>
            <dd className="m-0 text-right font-medium tabular-nums">{o?.animasyon ?? '…'}</dd>
            <dt className="text-soluk">Bulanık cam</dt>
            <dd className="m-0 text-right font-medium tabular-nums">{o?.bulanik ?? '…'}</dd>
            <dt className="text-soluk">Geçiş</dt>
            <dd className="m-0 text-right font-medium tabular-nums">{o?.gecis ?? '…'}</dd>
          </dl>
        </BiophilicCard>
      </ZamanSahnesi>
    </div>
  )
}

export function Mobil() {
  const { dogaSeviye, hareket } = useBiophilic()
  const [genislik, setGenislik] = useState(1100)
  const seviye: DogaSeviye = genislik < 768 ? 'hafif' : 'tam'
  const kutu = useRef<HTMLDivElement>(null)
  const [olc, setOlc] = useState({ kolon: 0, dikey: false })
  useEffect(() => {
    const t = window.setTimeout(() => {
      const el = kutu.current
      if (!el) return
      const iz = el.querySelector<HTMLElement>('.mob-izgara')
      const ko = el.querySelector<HTMLElement>('.mob-kolaj')
      setOlc({ kolon: iz ? getComputedStyle(iz).gridTemplateColumns.split(' ').length : 0, dikey: ko ? getComputedStyle(ko).gridTemplateColumns.split(' ').length === 1 : false })
    }, 200)
    return () => window.clearTimeout(t)
  }, [genislik])
  return (
    <Section
      id="mobil"
      ikon="cadir"
      madde="Madde 17 · Responsive kurallar"
      title={
        <>
          Küçük ekranda doğa <span className="vurgu">hafifler</span>
        </>
      }
      lead="768 pikselin altında (ya da veri tasarrufu açıkken) ışık huzmesi, bulut, su ve polen katmanları hiç oluşturulmaz; cam bulanıklığı kalkar, geçişler 400 ms’ye iner. Yerleşim kapsayıcı sorgularıyla dikeye geçer. İki seviyeyi aşağıda yan yana ölçün."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2" data-seviyeler="">
        <KarsilastirmaKutusu seviye="tam" />
        <KarsilastirmaKutusu seviye="hafif" />
      </div>
      <p className="cam mt-6 p-5 text-[15.5px]" data-doga-durum={dogaSeviye}>
        Bu sayfa şu an <b>{dogaSeviye === 'tam' ? 'tam' : 'hafif'}</b> doğa katmanında ({hareket ? 'hareket açık' : 'hareket kapalı'}). Otomatik kural: ekran &lt; 768 px ya da <span className="font-mono text-[13.5px]">saveData</span> → hafif.
      </p>

      <div className="cam mt-[var(--aralik)] grid grid-cols-1 items-center gap-x-10 gap-y-4 p-6 md:grid-cols-2">
        <Aralik label="Kapsayıcı genişliği" value={genislik} min={300} max={1140} step={10} onChange={setGenislik} format={(v) => `${v}px`} />
        <div className="text-[16px]" aria-live="polite" data-mobil-durum={`${olc.kolon}/${olc.dikey ? 'dikey' : 'yatay'}/${seviye}`}>
          <p>
            Izgara: <b>{olc.kolon} kolon</b> · Kolaj: <b>{olc.dikey ? 'dikey' : 'yatay'}</b> · Doğa: <b>{seviye === 'tam' ? 'tam' : 'hafif'}</b>
          </p>
        </div>
      </div>
      <div className="mt-8 overflow-x-auto pb-2">
        <div ref={kutu} className="mob mx-auto" style={{ width: `min(${genislik}px, 100%)` }} data-mobil-kutu={genislik}>
          <ZamanSahnesi seviye={seviye} className="border border-[var(--cam-kenar)]" icKlas="relative z-10 p-4 pt-24 sm:p-6 sm:pt-28">
            <div className="mob-kolaj">
              <div className="cam cam-opak min-w-0 p-6">
                <p className="kicker">Ferah</p>
                <p className="baslik mt-1 text-[clamp(26px,3vw,38px)]">
                  Işığı içeri <span className="vurgu">al.</span>
                </p>
                <div className="mt-4">
                  <BioButton boy="k" ikon={<Ikon ad="gunes" boyut={18} />}>
                    Güne başla
                  </BioButton>
                </div>
              </div>
              <div className="hidden min-w-0 justify-self-center sm:block">
                <Bitki tur="monstera" className="w-[180px]" />
              </div>
            </div>
            <div className="mob-izgara mt-6">
              {(
                [
                  ['nem', 'Nem', '%58'],
                  ['isik', 'Işık', '6.400 lx'],
                  ['sicaklik', 'Sıcaklık', '22,5 °C'],
                ] as const
              ).map(([ik, ad, d]) => (
                <BiophilicCard key={ad} ikon={ik} kicker={ad} baslik={d} serit={false} className="min-w-0">
                  <p className="text-[14.5px] text-soluk">Salon, deve tabanı</p>
                </BiophilicCard>
              ))}
            </div>
          </ZamanSahnesi>
        </div>
      </div>

      <div className="cam mt-[var(--aralik)] overflow-x-auto p-6 sm:p-9" role="region" aria-label="Doğa seviyeleri" tabIndex={0}>
        <table className="tablo w-full min-w-[600px] border-collapse text-[16px]" data-mobil-tablo="">
          <caption>Tam ve hafif doğa katmanı</caption>
          <thead>
            <tr>
              {['Özellik', 'Tam (≥ 768 px)', 'Hafif (< 768 px)'].map((b) => (
                <th key={b} scope="col" className="etiket">
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Ortam katmanları', 'gökyüzü, ışık, güneş, huzme, 2 bulut, 2 tepe, su, yapraklar, polen', 'gökyüzü, ışık, güneş, tepeler, yapraklar'],
              ['Cam bulanıklığı', 'blur 20 px + doygunluk', 'yok (yalnız yarı saydam dolgu)'],
              ['Animasyon', 'huzme, bulut, su, polen, bitki salınımı', 'yok (yalnız renk geçişi)'],
              ['Gün ışığı geçişi', '1000 ms', '400 ms'],
              ['Gölge', 'iki katmanlı, geniş', 'tek katmanlı'],
              ['Okunabilirlik', 'aynı çözücü', 'aynı çözücü (blur hesaba girmez)'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <th scope="row" className="font-medium">
                  {a}
                </th>
                <td>{b}</td>
                <td>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 18 · Erişim ───────────────────────── */

const NOKTALAR = Array.from({ length: 48 }, (_, i) => i * 0.5)

function OranCizgisi({ dengeli, dengesiz, hedef }: { dengeli: number[]; dengesiz: number[]; hedef: number }) {
  const W = 680
  const H = 280
  const sol = 46
  const sag = 122
  const ust = 16
  const alt = 40
  const max = 10
  const min = 2
  const x = (h: number) => sol + (h / 24) * (W - sol - sag)
  const y = (v: number) => ust + ((max - Math.max(min, Math.min(max, v))) / (max - min)) * (H - ust - alt)
  const yol = (a: number[]) => a.map((v, i) => `${i ? 'L' : 'M'}${x(NOKTALAR[i]).toFixed(1)} ${y(v).toFixed(1)}`).join('')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Saate göre en düşük metin kontrastı: dengeleyici açıkken hedefin altına inmez, kapalıyken iner" data-oran-cizgisi="">
      <g stroke="var(--cam-kenar)" strokeWidth="1">
        {[2, 4, 6, 8, 10].map((v) => (
          <line key={v} x1={sol} x2={W - sag} y1={y(v)} y2={y(v)} />
        ))}
      </g>
      {[2, 4, 6, 8, 10].map((v) => (
        <text key={v} x={sol - 8} y={y(v) + 4} textAnchor="end" fontSize="12" style={{ fill: 'var(--soluk)' }}>
          {v}:1
        </text>
      ))}
      {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => (
        <text key={h} x={x(h)} y={H - 16} textAnchor="middle" fontSize="12" style={{ fill: 'var(--soluk)' }}>
          {String(h).padStart(2, '0')}
        </text>
      ))}
      <line x1={sol} x2={W - sag} y1={y(hedef)} y2={y(hedef)} stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 5" strokeLinecap="round" />
      <text x={W - sag + 8} y={y(hedef) + 20} fontSize="12.5" fill="currentColor" fontWeight="600">
        hedef {String(hedef).replace('.', ',')}:1
      </text>
      <path d={yol(dengesiz)} fill="none" stroke="var(--kontrol)" strokeWidth="2.2" strokeDasharray="7 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d={yol(dengeli)} fill="none" style={{ stroke: 'var(--btn)' }} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <text x={W - sag + 8} y={y(dengeli[dengeli.length - 1]) - 10} fontSize="12.5" fill="currentColor" fontWeight="600">
        Dengeli
      </text>
      <text x={W - sag + 8} y={y(dengesiz[dengesiz.length - 1]) + 16} fontSize="12.5" fill="currentColor">
        Dengesiz
      </text>
    </svg>
  )
}

export function Erisim() {
  const c = useBiophilic()
  const [saat, setSaat] = useState(17)
  const [denge, setDenge] = useState(true)
  const dk = c.doku === 'yok' ? 0 : DOKU_ALFA
  const p = useMemo(() => hesapPalet(saat, { denge, hedef: c.hedef, doku: dk }), [saat, denge, c.hedef, dk])
  const seri = useMemo(() => {
    const a = NOKTALAR.map((h) => hesapPalet(h, { denge: true, hedef: c.hedef, doku: dk }).cam)
    const b = NOKTALAR.map((h) => hesapPalet(h, { denge: false, hedef: c.hedef, doku: dk }).cam)
    return { dengeli: a.map((x) => Math.min(x.oran, x.oranSoluk)), dengesiz: b.map((x) => Math.min(x.oran, x.oranSoluk)) }
  }, [c.hedef, dk])
  const gecerli = (n: number) => (n >= 7 ? 'AAA' : n >= 4.5 ? 'AA' : n >= 3 ? 'Yalnız büyük metin' : 'Yetersiz')
  const minDengesiz = Math.min(...seri.dengesiz)
  const minDengeli = Math.min(...seri.dengeli)
  return (
    <Section
      id="erisim"
      ikon="kalkan"
      madde="Madde 18 · Erişilebilirlik ve varyantlar"
      title={
        <>
          Renk değişirken <span className="vurgu">okunabilirlik</span> kaybolmaz
        </>
      }
      lead="Gökyüzü değiştikçe cam panelin altındaki en açık ve en koyu noktalar da değişir. Dengeleyici katman, her saat için panelin opaklığını, açık ya da koyu tonunu ve yazı rengini yeniden çözer; kapalıyken aynı panel bazı saatlerde hedefin altına düşer."
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7" data-dengeleyici="">
          <ZamanSahnesi saat={saat} denge={denge} className="border border-[var(--cam-kenar)]" icKlas="relative z-10 p-5 pt-28 sm:p-8 sm:pt-32" data-denge-sahne={denge ? 'acik' : 'kapali'}>
            <div className="cam p-6 sm:p-8">
              <p className="kicker">{denge ? 'Dengeleyici açık' : 'Dengeleyici kapalı'}</p>
              <p className="baslik mt-2 text-[clamp(26px,3vw,36px)]">Akşamın ilk ışığı</p>
              <p className="mt-3 text-[17px]" data-denge-metin="">
                Ana metin bu rengi kullanır ve panelin altındaki en zor noktada bile okunur olmalıdır.
              </p>
              <p className="mt-2 text-[15.5px] text-soluk" data-denge-soluk="">
                İkincil metin biraz daha soluk, ama aynı ölçüte tabidir.
              </p>
              <div className="mt-5">
                <BioButton boy="k" ikon={<Ikon ad="nefes" boyut={18} />}>
                  Nefes al
                </BioButton>
              </div>
            </div>
          </ZamanSahnesi>
        </div>
        <div className="cam grid min-w-0 content-start gap-6 p-6 sm:p-9 lg:col-span-5">
          <Aralik id="er-saat" label="Saat" value={saat} min={0} max={23.5} step={0.5} onChange={setSaat} format={saatMetni} />
          <Anahtar label="Dengeleyici katman" hint="Kapalıyken cam opaklığı sabit %50 kalır." checked={denge} onChange={setDenge} />
          <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2 text-[15.5px]" data-denge-olcum={`${p.cam.alfa}|${p.cam.oran.toFixed(2)}|${p.cam.oranSoluk.toFixed(2)}`}>
            <dt className="text-soluk">Cam opaklığı</dt>
            <dd className="m-0 text-right font-medium tabular-nums">%{Math.round(p.cam.alfa * 100)}</dd>
            <dt className="text-soluk">Cam tonu</dt>
            <dd className="m-0 text-right font-medium">{p.cam.acik ? 'açık' : 'koyu'}</dd>
            <dt className="text-soluk">Ana metin</dt>
            <dd className="m-0 text-right font-medium tabular-nums" data-ana-oran={p.cam.oran.toFixed(2)}>
              {oran(p.cam.oran)}
            </dd>
            <dt className="text-soluk">İkincil metin</dt>
            <dd className="m-0 text-right font-medium tabular-nums">{oran(p.cam.oranSoluk)}</dd>
          </dl>
          <p className="flex items-center gap-2 text-[17px] font-semibold" aria-live="polite" data-denge-karar={p.cam.gecti ? 'gecti' : 'kaldi'}>
            <Ikon ad={p.cam.gecti ? 'tik' : 'kapat'} boyut={22} />
            {gecerli(Math.min(p.cam.oran, p.cam.oranSoluk))}
            {p.cam.gecti ? '' : ` · hedef ${String(c.hedef).replace('.', ',')}:1`}
          </p>
        </div>
      </div>

      <div className="cam mt-[var(--aralik)] p-6 sm:p-9" data-oran-grafik="">
        <h3 className="baslik text-[26px]">24 saatlik en düşük kontrast</h3>
        <p className="mt-2 max-w-[68ch] text-[16px] text-soluk">
          Her yarım saat için, panelin altındaki en zor zeminde ana ve ikincil metnin düşük olanı. Dengeleyici açıkken en düşük değer <b className="text-metin">{oran(minDengeli)}</b>; kapalıyken <b className="text-metin">{oran(minDengesiz)}</b>.
        </p>
        <ul className="m-0 mt-4 flex list-none flex-wrap gap-x-7 gap-y-2 p-0 text-[15px]">
          <li className="flex items-center gap-2">
            <svg width="34" height="10" aria-hidden="true">
              <line x1="2" x2="32" y1="5" y2="5" style={{ stroke: 'var(--btn)' }} strokeWidth="3.2" strokeLinecap="round" />
            </svg>
            Dengeleyici açık
          </li>
          <li className="flex items-center gap-2">
            <svg width="34" height="10" aria-hidden="true">
              <line x1="2" x2="32" y1="5" y2="5" stroke="var(--kontrol)" strokeWidth="2.2" strokeDasharray="7 6" strokeLinecap="round" />
            </svg>
            Dengeleyici kapalı
          </li>
        </ul>
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[520px]">
            <OranCizgisi dengeli={seri.dengeli} dengesiz={seri.dengesiz} hedef={c.hedef} />
          </div>
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer text-[16px] font-medium">Tabloyu göster</summary>
          <div className="mt-3 overflow-x-auto" role="region" aria-label="Saatlik kontrast tablosu" tabIndex={0}>
            <table className="tablo w-full min-w-[420px] border-collapse text-[14.5px]" data-oran-tablo="">
              <thead>
                <tr>
                  {['Saat', 'Dengeli', 'Dengesiz'].map((b) => (
                    <th key={b} scope="col" className="etiket">
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {NOKTALAR.filter((_, i) => i % 2 === 0).map((h, k) => (
                  <tr key={h}>
                    <th scope="row" className="font-mono text-[13px] font-medium">
                      {saatMetni(h)}
                    </th>
                    <td className="tabular-nums">{oran(seri.dengeli[k * 2])}</td>
                    <td className="tabular-nums">{oran(seri.dengesiz[k * 2])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>

      <div className="mt-[var(--aralik)] grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="cam min-w-0 p-6 sm:p-9 lg:col-span-5">
          <h3 className="baslik text-[24px]">Varyantlar</h3>
          <div className="mt-5" data-erisim-ayarlar="">
            <Ayarlar onek="er-" />
          </div>
        </div>
        <div className="cam min-w-0 p-6 sm:p-9 lg:col-span-7">
          <h3 className="baslik text-[24px]">Kontrol listesi</h3>
          <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-3 p-0 text-[16.5px]" data-erisim-liste="">
            {[
              ['Her saatte okunur', 'Ana ve ikincil metin, panelin altındaki en zor zeminde ≥ 4,5:1; yüksek kontrast varyantında ≥ 7:1.'],
              ['Katman otomatik', 'Opaklık %50–%96,5 arasında çözülür; ton açık ya da koyu seçilir, yazı rengi buna göre döner.'],
              ['Doku hesaba katılır', 'Su, yaprak ve ahşap dokusu en kötü zemin listesine eklenir.'],
              ['Üstüne binenler', 'Menü, diyalog ve yapışkan gezinme neredeyse opak camdır (%95).'],
              ['Renk tek başına değil', 'Seçili çip yaprak işaretli ve dolu; nem durumu ikon ve yazıyla; uyku evreleri desenli.'],
              ['Klavye ve odak', 'Bütün kontroller odaklanabilir; 3 px halka her zeminde görünür renktedir.'],
              ['Hareket', 'Sistem “hareketi azalt” dediğinde halkalar ve bitkiler durur; nefes adımı yazıyla verilir.'],
              ['Ekran okuyucu', 'Süs SVG’leri gizli; ilerleme ve nem çubukları rol ve metin değeriyle; sayaç başlangıç, bitiş ve isteğe bağlı adımları duyurur.'],
            ].map(([a, b]) => (
              <li key={a} className="flex gap-3">
                <Ikon ad="tik" boyut={22} className="mt-1 shrink-0 text-vurgu" />
                <span>
                  <b>{a}.</b> <span className="text-soluk">{b}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-10 max-w-[720px]">
        <Kod
          label="Dengeleyici mantığı"
          sar={false}
        >{`// her saat için: cam tonu × opaklık × yazı rengi\nconst cam = camCoz(karisim(saat), { hedef: 4.5, doku: 0.07 })\n// en zor zeminler: 3 gökyüzü, güneş, 3 yaprak, su (+ doku uçları)\n// opaklık 0,50'den başlar, 0,02 adımla hedef tutana kadar artar`}</Kod>
      </div>
    </Section>
  )
}
