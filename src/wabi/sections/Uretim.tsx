import { useEffect, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import { kontrast, oran } from '../lib/contrast'
import { ASIMETRI_ONAYARLAR, FIGMA_ETIKETLER, FIGMA_MODLARI, PROPLAR, TAILWIND_SINIF, TEMA } from '../lib/data'
import { useWabi } from '../lib/store'
import { Ikon } from '../components/Ikon'
import { Aralik, Kod, Secim, Section } from '../components/ui'
import { ImperfectCard, WabiContainer, Yer, ZenHero } from '../components/Wabi'

/* ───────────────────────── Madde 11 · 14 · Bileşenler ───────────────────────── */

export function Bilesenler() {
  return (
    <Section
      id="bilesenler"
      no="12"
      madde="Madde 11 · 14 · Bileşen kalıpları"
      duzen={3}
      title={
        <>
          Tek <span className="vurgu">odak</span>, dengesiz liste
        </>
      }
      lead="Üç bileşen yeter: <WabiContainer> ızgarayı bilerek dengesiz kurar, <ImperfectCard> elle çizilmiş çerçeveyi verir, <ZenHero> ekrana tek bir nesne bırakır."
    >
      <div className="grid grid-cols-1 gap-[calc(var(--uzay)*0.8)]" data-hero-ornekleri="">
        <div className="border-y border-cizgi/50" data-hero-ornek="sol">
          <ZenHero odak="kase" sir="kil" tohum={3} no="03" etiket="Ham çanak" baslik="Ham çanak, sırsız" boy={150} minH="clamp(380px, 46vw, 520px)" dal={false}>
            <p className="kicker">Sola yaslı · kase</p>
            <p className="baslik mt-4 text-[clamp(30px,4vw,56px)]">Sırsız, yalnız kil.</p>
          </ZenHero>
        </div>
        <div className="border-y border-cizgi/50" data-hero-ornek="sag">
          <ZenHero odak="testi" sir="mat" tohum={19} no="19" etiket="Mat siyah testi" baslik="Mat siyah testi, raku" boy={215} minH="clamp(420px, 50vw, 580px)" yon="sag" dal>
            <p className="kicker">Sağa yaslı · testi</p>
            <p className="baslik mt-4 text-[clamp(30px,4vw,56px)]">Raku ateşinden.</p>
          </ZenHero>
        </div>
      </div>

      <WabiContainer className="mt-[calc(var(--uzay)*1.3)]">
        <Yer b={2} s={3} ind={0} ust={0}>
          <ImperfectCard tohum={31} data-kart="yalin">
            <p className="kicker">Yalın</p>
            <p className="baslik mt-3 text-[26px]">Bir cümle</p>
            <p className="mt-2 text-[15.5px] text-soluk">Çerçeve çok yavaş çizilir; üzerine gelince koyulaşır.</p>
          </ImperfectCard>
        </Yer>
        <Yer b={6} s={3} ind={10} ust={3}>
          <ImperfectCard tohum={41} mat data-kart="mat">
            <p className="kicker !text-current">Mat</p>
            <p className="baslik mt-3 text-[26px]">Ters kart</p>
            <p className="mt-2 text-[15.5px]">Mat siyah dolgu, ham kil yazı. Kontrast 13,4:1.</p>
          </ImperfectCard>
        </Yer>
        <Yer b={10} s={3} ind={4} ust={1}>
          <ImperfectCard tohum={51} kaydir={-20} dolgu={false} data-kart="kaydirilmis">
            <p className="kicker">Kaydırılmış</p>
            <p className="baslik mt-3 text-[26px]">Izgaradan taşan</p>
            <p className="mt-2 text-[15.5px] text-soluk">Yirmi piksel yana kaymış; hizalanmamış olması bilerektir.</p>
          </ImperfectCard>
        </Yer>
      </WabiContainer>

      <WabiContainer className="mt-[calc(var(--uzay)*1.3)]">
        <Yer b={3} s={9} ind={0}>
          <div className="overflow-x-auto" role="region" aria-label="Bileşen özellikleri" tabIndex={0}>
            <table className="tablo w-full min-w-[720px] border-collapse text-[15.5px]" data-proplar="">
              <caption>Bileşen özellikleri</caption>
              <thead>
                <tr>
                  {['Bileşen', 'Özellik', 'Tip', 'Varsayılan', 'Ne yapar'].map((b) => (
                    <th key={b} scope="col" className="etiket">
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PROPLAR.map((p) => (
                  <tr key={p.bilesen + p.ad}>
                    <th scope="row" className="font-mono text-[13px] font-normal">
                      {p.bilesen}
                    </th>
                    <td className="font-mono text-[13px]">{p.ad}</td>
                    <td className="font-mono text-[12.5px]">{p.tip}</td>
                    <td className="font-mono text-[12.5px]">{p.varsayilan}</td>
                    <td>{p.aciklama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Yer>
        <Yer b={4} s={7} ind={6} ust={2} className="mt-10">
          <Kod label="Bileşen kullanımı" sar={false}>{`<WabiContainer yon="sol">\n  <Yer b={2} s={5}>\n    <ImperfectCard tohum={7}>...</ImperfectCard>\n  </Yer>\n  <Yer b={9} s={3} ust={4}>\n    <Seramik tur="vazo" sir="yaprak" dal />\n  </Yer>\n</WabiContainer>`}</Kod>
        </Yer>
      </WabiContainer>
    </Section>
  )
}

/* ───────────────────────── Madde 12 · 13 · Figma ───────────────────────── */

export function Figma() {
  const { hareket } = useWabi()
  const [onayar, setOnayar] = useState<string>('sola')
  const [p, setP] = useState({ sol: 24, sag: 96, ust: 64, alt: 96 })
  const [bosluk, setBosluk] = useState(24)
  const [mod, setMod] = useState<'kil' | 'kul' | 'komur'>('kil')
  const cerceve = useRef<HTMLDivElement>(null)
  const icerik = useRef<HTMLDivElement>(null)
  const [olculen, setOlculen] = useState({ sol: 0, sag: 0, ust: 0, alt: 0, ara: 0 })
  useEffect(() => {
    const t = window.setTimeout(
      () => {
        const c = cerceve.current
        const i = icerik.current
        if (!c || !i) return
        const cr = c.getBoundingClientRect()
        const ir = i.getBoundingClientRect()
        const cocuklar = i.children
        const a = cocuklar[0]?.getBoundingClientRect()
        const b = cocuklar[1]?.getBoundingClientRect()
        setOlculen({ sol: Math.round(ir.left - cr.left), sag: Math.round(cr.right - ir.right), ust: Math.round(ir.top - cr.top), alt: Math.round(cr.bottom - ir.bottom), ara: a && b ? Math.round(b.top - a.bottom) : 0 })
        // boşluklar 1,2 sn'de geçiş yapar: ölçüm geçiş bittikten sonra alınır
      },
      hareket ? 1300 : 80,
    )
    return () => window.clearTimeout(t)
  }, [p, bosluk, hareket])
  const oran2 = p.sag / p.sol
  const asimetrik = oran2 >= 1.5 || oran2 <= 1 / 1.5
  const uygula = (id: string) => {
    const o = ASIMETRI_ONAYARLAR.find((x) => x.id === id)!
    setOnayar(id)
    setP({ sol: o.sol, sag: o.sag, ust: o.ust, alt: o.alt })
  }
  const th = TEMA[mod]
  const satirlar: [string, string, string, string][] = [
    ['Color/WabiStone', TEMA.kil.zemin, TEMA.kul.zemin, TEMA.komur.zemin],
    ['Color/Ink', TEMA.kil.metin, TEMA.kul.metin, TEMA.komur.metin],
    ['Color/InkMuted', TEMA.kil.soluk, TEMA.kul.soluk, TEMA.komur.soluk],
    ['Color/Line', TEMA.kil.kontrol, TEMA.kul.kontrol, TEMA.komur.kontrol],
    ['Color/Focus', TEMA.kil.odak, TEMA.kul.odak, TEMA.komur.odak],
  ]
  return (
    <Section
      id="figma"
      no="13"
      madde="Madde 12 · 13 · Figma mimarisi ve tokenlar"
      duzen={0}
      title={
        <>
          <span lang="en">Auto Layout</span>, bilerek <span className="vurgu">eşitsiz</span>
        </>
      }
      lead="Figma'da iç boşluklar eşit verilmez: bir yan dar, öbür yan geniş bırakılır. Boşluk soldan sağdan farklıysa içerik yaslanır, sayfa nefes alır. Aşağıdaki çerçevede oranı değiştirin; kenar boşlukları tarayıcıda ölçülür."
    >
      <WabiContainer>
        <Yer b={2} s={7} ind={0} data-autolayout="">
          <div ref={cerceve} className="border border-dashed border-cizgi" style={{ paddingLeft: p.sol, paddingRight: p.sag, paddingTop: p.ust, paddingBottom: p.alt, transition: 'padding 1200ms ease' }} data-cerceve="">
            <div ref={icerik} className="flex flex-col" style={{ gap: bosluk, transition: 'gap 1200ms ease' }} data-icerik="">
              <p className="baslik text-[clamp(26px,2.8vw,40px)]">Bir cümle, sakin.</p>
              <p className="text-[15.5px] text-soluk">İçerik kutusu, çerçevenin kenarlarından farklı uzaklıktadır.</p>
            </div>
          </div>
          <p className="mt-5 font-mono text-[12.5px] text-soluk" data-olculen={`${olculen.sol}/${olculen.sag}/${olculen.ust}/${olculen.alt}/${olculen.ara}`}>
            ölçülen: sol {olculen.sol} · sağ {olculen.sag} · üst {olculen.ust} · alt {olculen.alt} · ara {olculen.ara} px
          </p>
        </Yer>
        <Yer b={10} s={3} ind={8} ust={2}>
          <div className="grid grid-cols-1 gap-6">
            <Secim<string> legend="Ön ayar" name="fg-onayar" value={onayar} onChange={uygula} options={ASIMETRI_ONAYARLAR.map((o) => ({ id: o.id, ad: o.ad }))} />
            <Aralik id="fg-sol" label="Sol" value={p.sol} min={0} max={200} step={8} onChange={(v) => setP((x) => ({ ...x, sol: v }))} format={(v) => `${v} px`} />
            <Aralik id="fg-sag" label="Sağ" value={p.sag} min={0} max={200} step={8} onChange={(v) => setP((x) => ({ ...x, sag: v }))} format={(v) => `${v} px`} />
            <Aralik id="fg-bosluk" label="Ara" value={bosluk} min={8} max={96} step={8} onChange={setBosluk} format={(v) => `${v} px`} />
            <p className="text-[15.5px]" data-asimetri={asimetrik ? 'evet' : 'hayir'} aria-live="polite">
              Sol : sağ = <b className="font-normal">1 : {oran2.toFixed(1).replace('.', ',')}</b>
              <span className="mt-1 flex items-center gap-2 text-soluk">
                <Ikon ad={asimetrik ? 'tik' : 'kapat'} boyut={14} />
                {asimetrik ? 'Asimetrik: kullanılabilir' : 'Simetriye yakın: önerilmez'}
              </span>
            </p>
          </div>
        </Yer>
      </WabiContainer>

      <WabiContainer className="mt-[calc(var(--uzay)*1.3)]">
        <Yer b={3} s={8} ind={0}>
          <div className="mb-6">
            <Secim<'kil' | 'kul' | 'komur'> legend="Mod" name="fg-mod" value={mod} onChange={setMod} options={FIGMA_MODLARI.map((m) => ({ id: m.id, ad: m.ad }))} />
          </div>
          <div className="overflow-x-auto" role="region" aria-label="Değişken tablosu" tabIndex={0}>
            <table className="tablo w-full min-w-[560px] border-collapse text-[15px]" data-figma-tablo="">
              <thead>
                <tr>
                  <th scope="col" className="etiket">
                    Değişken
                  </th>
                  {FIGMA_MODLARI.map((m) => (
                    <th key={m.id} scope="col" className={cx('etiket', mod === m.id && 'underline decoration-1 underline-offset-8')} aria-current={mod === m.id ? 'true' : undefined}>
                      {m.ad}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {satirlar.map(([ad, a, b, c]) => (
                  <tr key={ad}>
                    <th scope="row" className="font-mono text-[13px] font-normal">
                      {ad}
                    </th>
                    {[a, b, c].map((h, i) => (
                      <td key={i} className={cx('font-mono text-[12.5px]', FIGMA_MODLARI[i].id === mod && 'font-medium')}>
                        <span className="flex items-center gap-2">
                          <span className="size-4 shrink-0 border border-cizgi" style={{ background: h, borderRadius: '45% 55% 50% 50%' }} aria-hidden="true" />
                          {h}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="font-mono text-[13px] font-normal">
                    Spacing/MeditativeSpace
                  </th>
                  <td colSpan={3} className="font-mono text-[12.5px]">
                    96 px · ölçek 1 : 2 : 3 : 5 : 8 → 96 · 192 · 288 · 480 · 768
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="font-mono text-[13px] font-normal">
                    Font/WeightLight
                  </th>
                  <td colSpan={3} className="font-mono text-[12.5px]">
                    300
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Yer>
        <Yer b={5} s={4} ind={8} ust={2} className="mt-8">
          <div data-onizle={mod} data-figma-onizleme={mod} className="border border-cizgi px-7 pt-8 pb-7" style={{ borderRadius: 'var(--r-el)' }}>
            <p className="kicker">Mod · {th.ad}</p>
            <p className="baslik mt-3 text-[28px]">Sükun</p>
            <p className="mt-2 text-[15px] text-soluk">
              metin {oran(kontrast(th.metin, th.zemin))} · soluk {oran(kontrast(th.soluk, th.zemin))} · çizgi {oran(kontrast(th.kontrol, th.zemin))}
            </p>
          </div>
        </Yer>
        <Yer b={2} s={8} ind={0} ust={2} className="mt-[clamp(32px,5vw,72px)]">
          <dl className="m-0 grid grid-cols-1 gap-x-12 md:grid-cols-2" data-tokenlar="">
            {FIGMA_ETIKETLER.map((t) => (
              <div key={t.ad} className="border-t border-cizgi/50 py-4">
                <dt className="font-mono text-[13.5px] font-normal">{t.ad}</dt>
                <dd className="m-0 mt-1 text-[14.5px] text-soluk">{t.deger}</dd>
              </div>
            ))}
          </dl>
        </Yer>
      </WabiContainer>
    </Section>
  )
}

/* ───────────────────────── Madde 15 · CSS / Tailwind ───────────────────────── */

export function Css() {
  const kutu = useRef<HTMLDivElement>(null)
  const [olc, setOlc] = useState({ bg: '', renk: '', agirlik: '', aralik: '', boy: '', oran: 0 })
  useEffect(() => {
    const el = kutu.current
    if (!el) return
    const cs = getComputedStyle(el)
    const k = kontrast('#4A4542', '#E8E4DF')
    setOlc({ bg: cs.backgroundColor, renk: cs.color, agirlik: cs.fontWeight, aralik: cs.letterSpacing, boy: cs.fontSize, oran: k })
  }, [])
  return (
    <Section
      id="css"
      no="14"
      madde="Madde 15 · CSS / Tailwind yapısı"
      duzen={1}
      title={
        <>
          Dört sınıf, <span className="vurgu">hepsi bu</span>
        </>
      }
      lead={
        <>
          Tüm sayfanın özü tek satırdır: <span className="font-mono text-[0.88em]">{TAILWIND_SINIF}</span>. Ham kil rengi zemin, koyu kahverengi-gri yazı, 300 ağırlık, geniş harf aralığı. Aşağıdaki kutu tam bu sınıflarla çizilir; hesaplanan değerler yanında okunur.
        </>
      }
    >
      <WabiContainer>
        <Yer b={2} s={6} ind={0}>
          <div ref={kutu} className={cx(TAILWIND_SINIF, 'border border-[#8C7B70] px-[clamp(24px,4vw,56px)] py-[clamp(40px,6vw,88px)]')} style={{ borderRadius: 'var(--r-el)' }} data-tailwind-kutu="">
            <p className="text-[12px] uppercase">Tailwind</p>
            <p className="mt-6 font-baslik text-[clamp(30px,4vw,54px)] leading-[1.1]">Kusurlu olan tamdır.</p>
            <p className="mt-5 max-w-[40ch] text-[16px] normal-case">Bu kutunun zemini, yazısı, ağırlığı ve harf aralığı yukarıdaki dört sınıftan gelir; başka bir kural yoktur.</p>
          </div>
        </Yer>
        <Yer b={9} s={4} ind={10} ust={3}>
          <dl className="m-0 grid grid-cols-1 gap-5 text-[15.5px]" data-tailwind-olcum={`${olc.bg}|${olc.renk}|${olc.agirlik}|${olc.aralik}`}>
            {(
              [
                ['background-color', olc.bg],
                ['color', olc.renk],
                ['font-weight', olc.agirlik],
                ['letter-spacing', `${olc.aralik} (${olc.boy ? (parseFloat(olc.aralik) / parseFloat(olc.boy)).toFixed(2).replace('.', ',') : ''} em)`],
                ['kontrast', oran(olc.oran || 1)],
              ] as const
            ).map(([a, b]) => (
              <div key={a} className="border-t border-cizgi/50 pt-3">
                <dt className="kicker">{a}</dt>
                <dd className="m-0 mt-1 font-mono text-[13.5px]">{b}</dd>
              </div>
            ))}
          </dl>
        </Yer>
        <Yer b={3} s={5} ind={0} ust={2} className="mt-[clamp(40px,6vw,96px)]">
          <p className="kicker mb-3">Sınıf → CSS</p>
          <table className="tablo w-full border-collapse text-[15px]" data-sinif-tablo="">
            <tbody>
              {[
                ['bg-[#E8E4DF]', 'background-color: #E8E4DF (Color/WabiStone)'],
                ['text-[#4A4542]', 'color: #4A4542 (7,5:1)'],
                ['font-light', 'font-weight: 300 (Font/WeightLight)'],
                ['tracking-widest', 'letter-spacing: 0.1em'],
              ].map(([a, b]) => (
                <tr key={a}>
                  <th scope="row" className="font-mono text-[13px] font-normal">
                    {a}
                  </th>
                  <td className="text-soluk">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Yer>
        <Yer b={7} s={6} ind={4} ust={2} className="mt-[clamp(40px,6vw,96px)]">
          <p className="kicker mb-3">Asimetrik ızgara</p>
          <Kod
            label="Asimetrik ızgara CSS"
            sar={false}
          >{`.asim {\n  direction: ltr;                      /* yazı yönü değişmez */\n  grid-column: var(--b) / span var(--s);\n}\n.wabi-kap { direction: var(--dir, ltr); }\n[data-yon='sag'] { --dir: rtl; }      /* sağa yaslı: kolonlar sağdan sayılır, ayna yerleşim */\n\n@container (max-width: 719px) {\n  .asim { grid-column: 1 / -1; width: calc(100% - var(--ind) * 1%); justify-self: start; }\n}`}</Kod>
          <p className="kicker mt-8 mb-3">Odak ve tıklama</p>
          <Kod label="Odak CSS" sar={false}>{`:focus-visible,\n:active:where(a, button, [role='switch']) {\n  outline: 2px solid #3B2A20;   /* koyu kahverengi */\n  outline-offset: 4px;\n}`}</Kod>
        </Yer>
      </WabiContainer>
    </Section>
  )
}
