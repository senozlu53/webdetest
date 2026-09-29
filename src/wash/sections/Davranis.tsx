import { useState } from 'react'
import { useWash, type TemaTercih } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { Sahne } from '../components/Baykus'
import { WashButton } from '../components/Firca'
import { Ikon } from '../components/Ikon'
import { WatercolorBackground, useSize, type LekeTanim } from '../components/Leke'
import { Ayarlar } from '../components/Header'
import { FircaAralik, Kod, Section } from '../components/ui'
import { TEMA_RENK } from './Temel'

const HAREKET_LEKE = (sure: number): LekeTanim[] => [
  { renk: 'ultramarin', x: 30, y: 50, w: 50, h: 76, tohum: 5, dalga: 0.15, gecikme: 0 },
  { renk: 'gul', x: 60, y: 44, w: 42, h: 60, tohum: 10, dalga: 0.16, gecikme: sure * 0.18 },
  { renk: 'yesil', x: 78, y: 64, w: 36, h: 54, tohum: 17, dalga: 0.15, gecikme: sure * 0.36 },
]

/** Madde 16: boyanın kâğıda yayılması, yavaş ve yumuşak */
export function Hareket() {
  const { hareket, hareketTercih } = useWash()
  const [sure, setSure] = useState(3.2)
  const [n, setN] = useState(0)
  const toplam = sure + 0.36 * sure + 3 + 9
  const yuzde = (x: number) => `${Math.min(100, (x / toplam) * 100)}%`
  return (
    <Section
      id="hareket"
      madde="Madde 16 · Hareket dili"
      title="Kâğıda yayılan boya"
      renk="gul"
      lead="Hiçbir şey birden belirmez. Bir damla düşer, kâğıdın tanesine sızarak yayılır, kenarında pigment birikir; birkaç saniye sonra yavaşça kurur. Sayfa geçişleri de aynı sıvıyla açılır. Hareket kapalıysa (ya da sistem 'hareketi azalt' diyorsa) her şey doğrudan yerinde durur."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative isolate h-[300px] overflow-hidden rounded-lg border border-[var(--cizgi)]" style={{ backgroundColor: 'var(--kagit)', backgroundImage: 'var(--dok)', backgroundBlendMode: 'multiply' }} data-hareket-sahne="">
          <WatercolorBackground key={n} lekeler={HAREKET_LEKE(sure)} vb={[600, 300]} sure={sure} gizle />
        </div>
        <div className="grid min-w-0 content-start gap-5">
          <FircaAralik label="Yayılma süresi" value={sure} min={0.8} max={8} step={0.2} onChange={setSure} format={(v) => `${v.toFixed(1).replace('.', ',')} sn`} renk="var(--gul)" />
          <div>
            <WashButton renk="gul" boy="k" onClick={() => setN((x) => x + 1)} ikon={<Ikon ad="damla" boyut={22} />} data-oynat="">
              Yeniden damlat
            </WashButton>
          </div>
          <p className="sayfa px-4 py-3 text-[17px]" data-hareket-durum="">
            Hareket şu an <b>{hareket ? 'açık' : 'kapalı'}</b>
            <span className="text-soluk"> ({hareketTercih === 'oto' ? 'sistem tercihi' : 'sizin seçiminiz'})</span>
          </p>
        </div>
      </div>

      <figure className="sayfa m-0 mt-10 p-5" data-zaman="">
        <figcaption className="font-baslik text-[30px] leading-none font-medium italic">Zaman çizelgesi</figcaption>
        <ol className="m-0 mt-5 grid list-none gap-4 p-0">
          {(
            [
              ['Damla düşer, yayılır', 0, sure, 'var(--ultramarin)', `0 → ${sure.toFixed(1).replace('.', ',')} sn`],
              ['İkinci leke sızar', sure * 0.18, sure, 'var(--gul)', `+${(sure * 0.18).toFixed(1).replace('.', ',')} sn gecikmeyle`],
              ['Üçüncü leke sızar', sure * 0.36, sure, 'var(--yesil)', `+${(sure * 0.36).toFixed(1).replace('.', ',')} sn gecikmeyle`],
              ['Kuruma (opaklık 1 → 0,86)', sure + 3, 9, 'var(--ocre)', '3 sn bekler, 9 sn sürer'],
            ] as const
          ).map(([ad, bas, sn, renk, not]) => (
            <li key={ad} className="grid gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 text-[16px]">
                <span className="font-semibold">{ad}</span>
                <span className="text-soluk">{not}</span>
              </div>
              <div className="relative h-3 rounded-full bg-[var(--cizgi)]/40" aria-hidden="true">
                <span className="absolute top-0 h-full rounded-full" style={{ left: yuzde(bas), width: yuzde(sn), background: renk, opacity: 0.85 }} />
              </div>
            </li>
          ))}
        </ol>
      </figure>

      <div className="mt-8 overflow-x-auto" role="region" aria-label="Hareket değerleri" tabIndex={0}>
        <div className="sayfa p-5">
          <table className="w-full min-w-[560px] border-collapse text-left text-[16px]" data-hareket-tablo="">
            <caption className="pb-3 text-left font-baslik text-[30px] leading-none font-medium italic">Hareket değerleri</caption>
            <tbody>
              {(
                [
                  ['Leke yayılması', '3,2 sn', 'cubic-bezier(.2, .7, .2, 1)', 'ölçek .55 → 1, bulanıklık 6 → 0 px'],
                  ['Kuruma', '9 sn', 'ease-in', 'opaklık 1 → .86'],
                  ['Sayfa açılışı (Reveal)', '2,6 sn', 'cubic-bezier(.25, .6, .25, 1)', 'SVG maskesi, üç daire, dalgalı kenar'],
                  ['Düğme yayılması', '0,9 sn', 'cubic-bezier(.2, .7, .2, 1)', 'üstüne gelince ölçek 1,08; basınca 0,97'],
                  ['Baykuş süzülmesi', '7 sn', 'ease-in-out', 'sonsuz, 7 px'],
                ] as const
              ).map(([a, b, c, d]) => (
                <tr key={a} className="border-t border-[var(--cizgi)]">
                  <th scope="row" className="py-2 pr-4 font-semibold">
                    {a}
                  </th>
                  <td className="py-2 pr-4 tabular-nums">{b}</td>
                  <td className="py-2 pr-4 font-mono text-[14px]">{c}</td>
                  <td className="py-2">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  )
}

/* ─────────── Madde 17: mobil ─────────── */

/** Madde 17: mobilde metin ve grafik blokları kesin sınırlarla ayrılır */
export function Mobil() {
  const [g, setG] = useState(560)
  const [ref, { w }] = useSize<HTMLDivElement>()
  return (
    <Section
      id="mobil"
      madde="Madde 17 · Duyarlı kurallar"
      title="Boya metne binmez"
      renk="yesil"
      lead="Bir leke metnin arkasına kayarsa harfler ıslak bir zeminde kaybolur. Bu yüzden küçük ekranda metin ve resim iki ayrı blok olur; aralarında keskin bir sınır durur. Geniş ekranda yan yana gelirler ama yine iki ayrı yüzeydir: leke hiçbir zaman metnin altına girmez."
    >
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2" data-mobil-karsilastirma="">
        <figure className="m-0 grid gap-3">
          <div className="relative isolate h-[300px] max-w-[340px] overflow-hidden rounded-lg border border-[var(--cizgi)] p-6" data-yanlis="" aria-hidden="true">
            <WatercolorBackground
              lekeler={[
                { renk: 'ultramarin', x: 50, y: 50, w: 100, h: 110, tohum: 4, op: 1, dalga: 0.12, gecikme: 0 },
                { renk: 'gul', x: 62, y: 60, w: 70, h: 60, tohum: 9, op: 1, dalga: 0.14, gecikme: 0 },
              ]}
              vb={[340, 300]}
              sure={0.5}
              gizle
            />
            <div className="relative">
              <p className="font-baslik text-[32px] leading-tight font-medium italic">Orman uyanırken</p>
              <p className="mt-3 text-[17px]" data-leke-ok="">
                Sabah ışığı yaprakların arasından süzülür, baykuş ilk kuşlara günaydın der.
              </p>
            </div>
          </div>
          <figcaption className="max-w-[340px] text-[17px] text-soluk">
            <b className="text-murekkep">Yapma.</b> Metin doğrudan lekenin üstünde; pigmentin koyu yeri harfleri yutuyor.
          </figcaption>
        </figure>
        <figure className="m-0 grid gap-3">
          <div className="max-w-[340px] overflow-hidden rounded-lg border border-[var(--cizgi)]" data-dogru="">
            <div className="relative h-[130px] border-b-2 border-murekkep" data-mobil-grafik="">
              <Sahne ad="orman" className="absolute inset-0" />
            </div>
            <div className="sayfa !rounded-none p-6" data-metin="">
              <p className="font-baslik text-[32px] leading-tight font-medium italic">Orman uyanırken</p>
              <p className="mt-3 text-[17px]">Sabah ışığı yaprakların arasından süzülür, baykuş ilk kuşlara günaydın der.</p>
            </div>
          </div>
          <figcaption className="max-w-[340px] text-[17px] text-soluk">
            <b className="text-murekkep">Yap.</b> Resim ayrı blokta, altında 2 px mürekkep çizgi; metin opak sayfada.
          </figcaption>
        </figure>
      </div>

      <h3 className="mt-16 text-[36px] font-medium italic">Genişliği dene</h3>
      <div className="mt-4 max-w-[420px]">
        <FircaAralik label="Ekran genişliği" value={g} min={320} max={800} step={10} onChange={setG} format={(v) => `${v}px`} renk="var(--yesil)" />
      </div>
      <div className="mt-6 overflow-hidden">
        <div ref={ref} className="@container max-w-full" style={{ width: g }} data-mobil-onizle="" data-duzen={w >= 512 ? 'yan' : 'yigin'}>
          <div className="grid grid-cols-1 @lg:grid-cols-2">
            <div className="relative order-1 h-[180px] border-2 border-murekkep @lg:h-auto @lg:min-h-[220px] @lg:border-r-0" style={{ borderRadius: '3px 12px 4px 4px / 4px 12px 4px 3px' }}>
              <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
                <Sahne ad="nehir" className="absolute inset-0" />
              </div>
            </div>
            <div className="sayfa order-2 !rounded-none border-2 border-murekkep p-5 @lg:!rounded-r-[14px]" data-metin="">
              <p className="font-baslik text-[28px] leading-tight font-medium italic">Nehrin şarkısı</p>
              <p className="mt-2 text-[17px]">Bilge kanatlarını açmış, suyun ardına düşmüş.</p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-[17px] text-soluk" aria-live="polite">
          Önizleme {w}px geniş: <b className="text-murekkep">{w >= 512 ? 'yan yana, iki ayrı yüzey' : 'üst üste, kesin sınır'}</b>
        </p>
      </div>

      <div className="mt-10 overflow-x-auto" role="region" aria-label="Duyarlı kurallar tablosu" tabIndex={0}>
        <div className="sayfa p-5">
          <table className="w-full min-w-[560px] border-collapse text-left text-[16px]" data-mobil-tablo="">
            <caption className="pb-3 text-left font-baslik text-[30px] leading-none font-medium italic">Kırılım kuralları</caption>
            <tbody>
              {(
                [
                  ['< 768 px', 'Tek sütun: önce resim bloğu, altında metin bloğu; aralarında sert sınır', 'Leke metnin altına girmez'],
                  ['≥ 768 px', 'İki sütun: metin sayfası solda, resim sağda; ortak kenar çizgisi', 'Metin hep opak sayfada'],
                  ['Tüm boyutlar', 'Süs lekeleri yalnız boş alanlarda ve aria-hidden', 'Etkileşimli öğeler ≥ 44 px'],
                ] as const
              ).map(([a, b, c]) => (
                <tr key={a} className="border-t border-[var(--cizgi)]">
                  <th scope="row" className="py-2 pr-4 font-semibold whitespace-nowrap">
                    {a}
                  </th>
                  <td className="py-2 pr-4">{b}</td>
                  <td className="py-2">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  )
}

/* ─────────── Madde 18: erişilebilirlik ve varyantlar ─────────── */

const TEMALAR: { id: 'gunduz' | 'parsomen' | 'gece'; ad: string; not: string }[] = [
  { id: 'gunduz', ad: 'Gündüz', not: 'Krem kâğıt, multiply' },
  { id: 'parsomen', ad: 'Parşömen', not: 'Eski sarı kâğıt, multiply' },
  { id: 'gece', ad: 'Gece masalı', not: 'Derin lacivert, screen' },
]

/** Madde 18: koyu tema yerine parşömen ve gece masalı */
export function Erisim() {
  const s = useWash()
  return (
    <Section
      id="erisim"
      madde="Madde 18 · Erişilebilirlik ve varyantlar"
      title="Karanlıkta masal"
      renk="ultramarin"
      lead="Siyah zeminde çoğaltma kipi boyayı yok eder, çünkü koyuyla çarpmak koyu verir. Bu yüzden 'karanlık tema' yok. Yerine iki sıcak seçenek var: eski kâğıt tonunda parşömen ve derin lacivert bir gece masalı; gecede boya screen kipiyle ışıyarak biner."
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-3" data-tema-onizleme="">
        {TEMALAR.map((t) => {
          const v = TEMA_RENK[t.id]
          const secili = s.tema === t.id
          return (
            <li key={t.id} data-onizle={t.id} className="relative isolate grid content-start gap-4 overflow-hidden rounded-lg border border-[var(--cizgi)] p-5" style={{ backgroundImage: 'var(--dok)', backgroundBlendMode: 'multiply' }}>
              <WatercolorBackground
                lekeler={[
                  { renk: 'ultramarin', x: 30, y: 30, w: 60, h: 60, tohum: 3 + t.id.length, dalga: 0.15, gecikme: 0 },
                  { renk: 'gul', x: 76, y: 74, w: 48, h: 48, tohum: 11, dalga: 0.15, gecikme: 0 },
                ]}
                vb={[400, 400]}
                sure={1}
                gizle
              />
              <div className="sayfa relative p-4">
                <p className="font-baslik text-[30px] leading-none font-medium italic">{t.ad}</p>
                <p className="mt-2 text-[16px] text-soluk">{t.not}</p>
                <p className="mt-3 text-[15px] tabular-nums">
                  Metin / sayfa <b>{oran(kontrast(v.ink, v.sayfa))}</b>
                </p>
              </div>
              <div className="relative">
                <WashButton renk="ultramarin" boy="k" onClick={() => s.setTemaTercih(t.id as TemaTercih)} aria-pressed={secili} data-tema-sec={t.id}>
                  {secili ? 'Seçili' : 'Bu temayı seç'}
                </WashButton>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-14 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <figure className="m-0 grid gap-3">
          <div className="relative isolate h-[200px] overflow-hidden rounded-lg border border-[var(--cizgi)]" style={{ background: '#0a0a0f', ['--blend' as string]: 'multiply' }} data-yanlis="" aria-hidden="true">
            <WatercolorBackground
              lekeler={[
                { renk: 'ultramarin', x: 36, y: 50, w: 60, h: 76, tohum: 3, op: 1, gecikme: 0 },
                { renk: 'gul', x: 64, y: 56, w: 50, h: 60, tohum: 9, op: 1, gecikme: 0 },
              ]}
              vb={[500, 200]}
              sure={0.5}
              gizle
            />
          </div>
          <figcaption className="text-[17px] text-soluk">
            <b className="text-murekkep">Yapma.</b> Siyah zemin + multiply: boya çarpılıp kayboluyor.
          </figcaption>
        </figure>
        <figure className="m-0 grid gap-3">
          <div data-onizle="gece" className="relative isolate h-[200px] overflow-hidden rounded-lg border border-[var(--cizgi)]" style={{ backgroundImage: 'var(--dok)', backgroundBlendMode: 'multiply' }} data-dogru="">
            <WatercolorBackground
              lekeler={[
                { renk: 'ultramarin', x: 36, y: 50, w: 60, h: 76, tohum: 3, gecikme: 0 },
                { renk: 'gul', x: 64, y: 56, w: 50, h: 60, tohum: 9, gecikme: 0 },
              ]}
              vb={[500, 200]}
              sure={0.5}
              gizle
            />
          </div>
          <figcaption className="text-[17px] text-soluk">
            <b className="text-murekkep">Yap.</b> Gece masalı lacivert + screen: boya ışıklı bir sulu iz bırakıyor.
          </figcaption>
        </figure>
      </div>

      <div className="mt-14 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="sayfa p-6">
          <h3 className="text-[34px] leading-none font-medium italic">Görünüm ayarları</h3>
          <div className="mt-5">
            <Ayarlar onek="e-" />
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="text-[34px] leading-none font-medium italic">Neler var</h3>
          <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-3 p-0 text-[17px]" data-erisim-liste="">
            {[
              'Tema sistem tercihini izler (prefers-color-scheme), ama her zaman elle değişir; seçim hatırlanır.',
              'Hareket sistem tercihini izler (prefers-reduced-motion): kapalıyken lekeler ve sayfalar doğrudan yerinde.',
              'Yüksek kontrast: metin tonları koyulaşır, çizgiler belirginleşir, leke şeffaflığı azalır.',
              'Metin her zaman opak sayfada; en düşük metin kontrastı 4,5:1.',
              'Seçili durumlar yalnız renkle değil, yaprak simgesi ve yazıyla da belirtilir.',
              'Odak halkası 3 px, tüm etkileşimli öğeler ≥ 44 px.',
              'Dekoratif lekeler aria-hidden; resimlerde alternatif metin var.',
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <Ikon ad="yaprak" boyut={24} className="mt-1 shrink-0" filtre={false} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <WashButton renk="ocre" boy="k" onClick={() => document.querySelector<HTMLButtonElement>('button[aria-label="Görünüm ayarları"]')?.click()} ikon={<Ikon ad="damla" boyut={22} />}>
              Ayar panelini aç
            </WashButton>
          </div>
        </div>
      </div>
      <Kod label="Tema seçimi" className="mt-10" sar={false}>{`:root[data-tema='gece'] {
  --kagit: #14203d;   /* derin lacivert */
  --blend: screen;    /* boya ışıyarak biner */
}
/* oto: matchMedia('(prefers-color-scheme: dark)') → data-tema="gece" */`}</Kod>
    </Section>
  )
}
