import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { karis, kontrast, oran } from '../lib/contrast'
import { elDairesi } from '../lib/cizim'
import { TEMA } from '../lib/data'
import { useWabi } from '../lib/store'
import { Ayarlar } from '../components/Header'
import { Ikon } from '../components/Ikon'
import { Seramik } from '../components/Seramik'
import { Aralik, Secim, Section } from '../components/ui'
import { Enso, ImperfectCard, WabiButton, WabiContainer, Yer } from '../components/Wabi'

/* ───────────────────────── Madde 16 · Hareket ───────────────────────── */

export function Hareket() {
  const { hareket, hareketTercih, k } = useWabi()
  const [sure, setSure] = useState(2.6)
  const [acik, setAcik] = useState(true)
  const [cizSure, setCizSure] = useState(6)
  const [cizildi, setCizildi] = useState(true)
  const [nefes, setNefes] = useState(9)
  const yol = useMemo(() => elDairesi(60, 21, k), [k])
  const yenidenCiz = () => {
    setCizildi(false)
    window.setTimeout(() => setCizildi(true), 60)
  }
  return (
    <Section
      id="hareket"
      no="15"
      madde="Madde 16 · Hareket dili"
      duzen={2}
      title={
        <>
          Neredeyse <span className="vurgu">hissedilmez</span>
        </>
      }
      lead="Hiçbir öğe yer değiştirmez, büyümez ya da sıçramaz. Yalnız opaklık ve renk değişir, hem de saniyeler boyunca. Bir şeyin değiştiğini ancak değiştikten sonra fark edersiniz."
    >
      <WabiContainer>
        <Yer b={2} s={4} ind={0} data-solma-demo="">
          <div className="flex min-h-[250px] items-end" style={{ opacity: acik ? 1 : 0.06, transition: `opacity ${sure}s ease` }} data-solma={acik ? 'acik' : 'kapali'}>
            <Seramik tur="cay" sir="yaprak" tohum={12} boy={130} etiket="Çay kasesi" />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6">
            <Aralik id="solma-sure" label="Solma süresi" value={sure} min={1} max={8} step={0.2} onChange={setSure} format={(v) => `${v.toFixed(1).replace('.', ',')} sn`} />
            <p className="text-[15px] text-soluk" data-solma-hiz={Math.round(100 / sure)}>
              Değişim hızı saniyede en çok %{Math.round(100 / sure)}.
            </p>
            <div>
              <WabiButton onClick={() => setAcik((a) => !a)} boy="k" data-solma-dugme="">
                {acik ? 'Solsun' : 'Gelsin'}
              </WabiButton>
            </div>
          </div>
        </Yer>
        <Yer b={7} s={3} ind={10} ust={4} data-enso-demo="">
          <svg viewBox="-80 -80 160 160" className="h-auto w-full max-w-[280px] overflow-visible" style={{ ['--enso-sure' as string]: `${cizSure}s` } as CSSProperties} role="img" aria-label="Elle çizilen çember">
            <path d={yol} pathLength={1} fill="none" className="cizil" data-goruldu={cizildi ? '' : undefined} data-enso-yol="" style={{ stroke: 'var(--mat)', strokeWidth: 5, strokeLinecap: 'round' }} />
          </svg>
          <div className="mt-8 grid grid-cols-1 gap-6">
            <Aralik id="ciz-sure" label="Çizilme süresi" value={cizSure} min={2} max={12} step={1} onChange={setCizSure} format={(v) => `${v} sn`} />
            <div>
              <WabiButton onClick={yenidenCiz} boy="k" ikon={<Ikon ad="daire" boyut={14} />} data-enso-yeniden="">
                Yeniden çiz
              </WabiButton>
            </div>
          </div>
        </Yer>
        <Yer b={10} s={3} ind={4} ust={2} className="mt-[clamp(0px,7vw,110px)]">
          <div className="solup-gel" style={{ ['--solma-sure' as string]: `${nefes}s` } as CSSProperties} data-solup-gel="">
            <Enso boyut={140} tohum={2} kalin={8} />
          </div>
          <div className="mt-8">
            <Aralik id="nefes-sure" label="Solup gelme" value={nefes} min={4} max={20} step={1} onChange={setNefes} format={(v) => `${v} sn`} />
          </div>
        </Yer>
        <Yer b={3} s={8} ind={0} ust={3} className="mt-[clamp(48px,8vw,128px)]">
          <div className="overflow-x-auto" role="region" aria-label="Hareket değerleri" tabIndex={0}>
            <table className="tablo w-full min-w-[620px] border-collapse text-[16px]" data-hareket-tablo="">
              <caption>Hareket değerleri</caption>
              <tbody>
                {[
                  ['Bölüm belirişi', '2,6 sn', 'cubic-bezier(.3, .1, .2, 1)', 'yalnız opaklık; kayma ya da ölçek yok'],
                  ['Çerçeve çizilmesi', '6 sn', 'aynı eğri', 'stroke-dashoffset, pathLength = 1'],
                  ['Üzerine gelme', '1,2 sn', 'ease', 'çerçeve koyulaşır, köşeler başka bir eğriye döner'],
                  ['Renk ve tema', '1,2 sn', 'ease', 'dolgu, yazı ve çizgi rengi'],
                  ['Işık gezinmesi', '90 sn', 'ease-in-out, gidip gelir', 'sıvanın üstünde soluk bir aydınlık'],
                  ['Sessizlik çemberi', '1,2 sn / adım', 'doğrusal', 'süre boyunca yavaşça kapanır'],
                ].map(([a, b, c, d]) => (
                  <tr key={a}>
                    <th scope="row" className="font-normal">
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
          <p className="mt-6 max-w-[62ch] text-[16px] text-soluk" data-hareket-durum={hareket ? 'acik' : 'kapali'}>
            Hareket şu an <b className="font-normal text-metin">{hareket ? 'açık' : 'kapalı'}</b> ({hareketTercih === 'oto' ? 'sistem tercihi' : 'ayardan'}). Kapalıyken solma, çizilme ve ışık gezinmesi durur; her şey ilk andan görünür.
          </p>
        </Yer>
      </WabiContainer>
    </Section>
  )
}

/* ───────────────────────── Madde 17 · Mobil ───────────────────────── */

const MOB_OGELER = [
  { ad: 'Kül sırlı vazo', tur: 'vazo', sir: 'kul', boy: 170, b: 1, s: 5, ind: 0, ust: 0 },
  { ad: 'Çay kasesi', tur: 'cay', sir: 'yaprak', boy: 84, b: 8, s: 4, ind: 24, ust: 3 },
  { ad: 'Nehir taşı', tur: 'tas', sir: 'kul', boy: 70, b: 4, s: 4, ind: 8, ust: 1 },
] as const

export function Mobil() {
  const [genislik, setGenislik] = useState(1100)
  const kutu = useRef<HTMLDivElement>(null)
  const [olc, setOlc] = useState({ dikey: false, bosluk: 0, agirlik: 0, ustPay: 0 })
  useEffect(() => {
    const t = window.setTimeout(() => {
      const el = kutu.current
      if (!el) return
      const kr = el.getBoundingClientRect()
      const ogeler = Array.from(el.querySelectorAll<HTMLElement>('[data-mob-oge]'))
      const alan = ogeler.reduce((a, o) => {
        const r = o.getBoundingClientRect()
        return a + r.width * r.height
      }, 0)
      const ilk = ogeler[0]?.getBoundingClientRect()
      const merkez = ogeler.reduce((a, o) => a + (o.getBoundingClientRect().left + o.getBoundingClientRect().width / 2 - kr.left), 0) / (ogeler.length || 1)
      const listeBas = el.querySelector('.mob-liste')?.getBoundingClientRect()
      setOlc({
        dikey: ogeler.length > 1 && ogeler[1].getBoundingClientRect().top >= ogeler[0].getBoundingClientRect().bottom - 2,
        bosluk: Math.round((1 - alan / (kr.width * kr.height)) * 100),
        agirlik: Math.round((merkez / kr.width) * 100),
        ustPay: ilk && listeBas ? Math.round(ilk.top - kr.top) : 0,
      })
    }, 200)
    return () => window.clearTimeout(t)
  }, [genislik])
  const [pad, setPad] = useState('')
  useEffect(() => {
    const s = document.querySelector<HTMLElement>('#mobil')
    if (s) setPad(getComputedStyle(s).paddingTop)
  }, [genislik])
  return (
    <Section
      id="mobil"
      no="16"
      madde="Madde 17 · Responsive kurallar"
      duzen={3}
      title={
        <>
          Boşluk <span className="vurgu">dikeye</span> geçer
        </>
      }
      lead="Dar ekranda yatay asimetri dikey eksene çevrilir: nesnelerin yanlara kaymasının yerini üst boşluklar ve küçük girintiler alır. Bölüm boşluğu ise hiçbir genişlikte 96 pikselin altına inmez. Genişliği değiştirin; kurallar kapsayıcı sorgusuyla çalışır."
    >
      <WabiContainer>
        <Yer b={2} s={4} ind={0}>
          <Aralik id="mob-genislik" label="Kapsayıcı genişliği" value={genislik} min={300} max={1140} step={10} onChange={setGenislik} format={(v) => `${v} px`} />
        </Yer>
        <Yer b={8} s={4} ind={8} ust={1}>
          <div className="text-[16px]" aria-live="polite" data-mobil-durum={`${olc.dikey ? 'dikey' : 'yatay'}/${olc.bosluk}`}>
            <p>
              Yerleşim: <b className="font-normal">{olc.dikey ? 'dikey' : 'yatay'}</b> · boşluk <b className="font-normal">%{olc.bosluk}</b>
            </p>
            <p className="mt-1 text-soluk">
              ağırlık merkezi %{olc.agirlik} · bölüm üst boşluğu {pad}
            </p>
          </div>
        </Yer>
      </WabiContainer>
      <div className="mt-[calc(var(--uzay)*0.8)] overflow-x-auto pb-2">
        <div ref={kutu} className="mob mx-auto border-y border-cizgi/60 py-24" style={{ width: `min(${genislik}px, 100%)` }} data-mobil-kutu={genislik}>
          <div className="mob-liste px-[clamp(16px,4cqw,56px)]">
            {MOB_OGELER.map((o, i) => (
              <figure key={o.ad} className="m-0 flex flex-col items-start" style={{ ['--b' as string]: o.b, ['--s' as string]: o.s, ['--ind' as string]: o.ind, ['--ust' as string]: o.ust } as CSSProperties} data-mob-oge={i}>
                <Seramik tur={o.tur} sir={o.sir} boy={o.boy} tohum={i + 3} etiket={o.ad} />
                <figcaption className="nesne-etiket mt-4">{o.ad}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
      <WabiContainer className="mt-[calc(var(--uzay)*1.2)]">
        <Yer b={3} s={8} ind={0}>
          <div className="overflow-x-auto" role="region" aria-label="Kırılma kuralları" tabIndex={0}>
            <table className="tablo w-full min-w-[560px] border-collapse text-[16px]" data-mobil-tablo="">
              <caption>Kapsayıcı kuralları</caption>
              <thead>
                <tr>
                  {['Genişlik', 'Yerleşim', 'Asimetri', 'Boşluk'].map((b) => (
                    <th key={b} scope="col" className="etiket">
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['≥ 720 px', '12 kolon, nesneler farklı kolonlarda', 'yatay: kolon başlangıcı ve genişliği', 'bölüm 96–200 px'],
                  ['< 720 px', 'tek kolon, alt alta', 'dikey: üst boşluk (rem) ve girinti (%)', 'bölüm ≥ 96 px, nesneler arası ≥ 2,5 rem'],
                  ['sağa yaslı', 'aynalanır', 'ızgara direction: rtl; satırlar aynı', 'dar kapta kutu sağa yaslanır'],
                ].map(([a, b, c, d]) => (
                  <tr key={a}>
                    <th scope="row" className="font-normal">
                      {a}
                    </th>
                    <td>{b}</td>
                    <td>{c}</td>
                    <td>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Yer>
      </WabiContainer>
    </Section>
  )
}

/* ───────────────────────── Madde 18 · Erişim ───────────────────────── */

const YAZI_RENKLERI = [
  ['Metin', '#4A4542'],
  ['Soluk', '#5E5148'],
  ['Kurumuş Yaprak', '#8C7B70'],
  ['Kül Grisi', '#B0A8A0'],
  ['Mat Siyah', '#1F1C1A'],
  ['Ham Kil', '#E8E4DF'],
] as const
const ZEMINLER = [
  ['Ham Kil', '#E8E4DF'],
  ['Yüzey', '#EFECE7'],
  ['Kül Grisi', '#B0A8A0'],
  ['Kurumuş Yaprak', '#8C7B70'],
  ['Mat Siyah', '#1F1C1A'],
  ['Kömür', '#1C1A18'],
] as const

export function Erisim() {
  const { tema } = useWabi()
  const t = TEMA[tema]
  const [fg, setFg] = useState('#B0A8A0')
  const [bg, setBg] = useState('#E8E4DF')
  const [buyuk, setBuyuk] = useState<'normal' | 'buyuk'>('normal')
  const k = kontrast(fg, bg)
  const esik = buyuk === 'buyuk' ? 3 : 4.5
  const gecti = k >= esik
  const oneri = YAZI_RENKLERI.filter(([, h]) => h !== fg)
    .map(([ad, h]) => ({ ad, h, k: kontrast(h, bg) }))
    .filter((x) => x.k >= esik)
    .sort((a, b) => a.k - b.k)[0]
  const dokuEn = kontrast(t.soluk, karis(t.zemin, t.dokRenk, t.dokA))
  const odak = useRef<HTMLDivElement>(null)
  const [odakOlc, setOdakOlc] = useState({ renk: '', kalinlik: '', oran: 0 })
  useEffect(() => {
    const el = odak.current
    if (!el) return
    const cs = getComputedStyle(el)
    setOdakOlc({ renk: cs.outlineColor, kalinlik: cs.outlineWidth, oran: kontrast(t.odak, t.zemin) })
  }, [tema])
  return (
    <Section
      id="erisim"
      no="17"
      madde="Madde 18 · Erişilebilirlik ve varyantlar"
      duzen={0}
      title={
        <>
          Soluk taş, <span className="vurgu">koyu kontur</span>
        </>
      }
      lead="Doğal taş renkleri birbirine yakındır ve düşük kontrast riski taşır. Bu yüzden yazı ve denetim çizgileri koyu tonlarla çizilir; tıklama ve odak anında koyu kahverengi bir kontur belirir. Yazı ve zemin rengi seçin: oran, AA / AAA kararı ve öneri anında gösterilir."
    >
      <WabiContainer>
        <Yer b={2} s={6} ind={0}>
          <div className="grid grid-cols-1 gap-8">
            <Secim<string> legend="Yazı rengi" name="er-fg" value={fg} onChange={setFg} options={YAZI_RENKLERI.map(([ad, h]) => ({ id: h, ad }))} />
            <Secim<string> legend="Zemin" name="er-bg" value={bg} onChange={setBg} options={ZEMINLER.map(([ad, h]) => ({ id: h, ad }))} />
            <Secim<'normal' | 'buyuk'>
              legend="Yazı boyu"
              name="er-boy"
              value={buyuk}
              onChange={setBuyuk}
              options={[
                { id: 'normal', ad: 'Normal (17 px, 300)' },
                { id: 'buyuk', ad: 'Büyük (28 px)' },
              ]}
            />
            <div className="border border-cizgi px-8 py-10" style={{ background: bg, borderRadius: 'var(--r-el)' }} data-erisim-onizleme="">
              <p className="font-baslik" style={{ color: fg, fontSize: buyuk === 'buyuk' ? 28 : 17, fontWeight: 300 }}>
                Elle çekilmiş kasenin kenarı düz değildir.
              </p>
            </div>
          </div>
        </Yer>
        <Yer b={9} s={4} ind={10} ust={3}>
          <ImperfectCard tohum={61} dolgu={false}>
            <p className="kicker">Sonuç</p>
            <p className="baslik mt-3 text-[clamp(36px,4vw,56px)]" data-erisim-oran={k.toFixed(2)}>
              {oran(k)}
            </p>
            <p className="mt-3 flex items-center gap-2 text-[17px] font-normal" aria-live="polite" data-erisim-karar={gecti ? 'gecti' : 'kaldi'}>
              <Ikon ad={gecti ? 'tik' : 'kapat'} boyut={18} />
              {gecti ? (k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : 'AA (büyük yazı)') : `Yetersiz: en az ${String(esik).replace('.', ',')}:1 gerekir`}
            </p>
            {!gecti && oneri ? (
              <div className="mt-5 text-[16px]" data-erisim-oneri={oneri.h}>
                <p>
                  Öneri: <b className="font-normal">{oneri.ad}</b> <span className="font-mono text-[13px]">{oneri.h}</span> ile <b className="font-normal">{oran(oneri.k)}</b>.
                </p>
                <div className="mt-4">
                  <WabiButton boy="k" onClick={() => setFg(oneri.h)}>
                    Öneriyi uygula
                  </WabiButton>
                </div>
              </div>
            ) : null}
          </ImperfectCard>
        </Yer>
      </WabiContainer>

      <WabiContainer className="mt-[calc(var(--uzay)*1.3)]">
        <Yer b={3} s={5} ind={0} data-odak-demo="">
          <p className="kicker">Tıkla ve odaklan</p>
          <p className="mt-3 max-w-[44ch] text-[16.5px] text-soluk">Bir düğmeye Tab ile gelin ya da fareyle basılı tutun: koyu kahverengi kontur belirir. Kontur zeminde {oran(odakOlc.oran || 1)} verir.</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
            <WabiButton data-odak-dugme="">Düğme</WabiButton>
            <a href="#erisim" className="text-[17px]" data-odak-link="">
              Bağlantı
            </a>
            <input className="alan !w-52" aria-label="Örnek alan" placeholder="Örnek alan" data-odak-alan="" />
          </div>
          <div className="mt-10 flex items-center gap-6">
            <div ref={odak} className="size-16 border border-cizgi" style={{ outline: '2px solid var(--odak)', outlineOffset: 4, borderRadius: 'var(--r-el)' }} data-odak-ornek="" aria-hidden="true" />
            <p className="font-mono text-[13px] text-soluk" data-odak-olcum={`${odakOlc.kalinlik}|${odakOlc.renk}`}>
              outline {odakOlc.kalinlik} solid {odakOlc.renk}
            </p>
          </div>
        </Yer>
        <Yer b={9} s={4} ind={8} ust={2}>
          <p className="kicker">Doku üstünde soluk metin</p>
          <p className="baslik mt-3 text-[clamp(30px,3.4vw,46px)]" data-doku-erisim={dokuEn.toFixed(2)}>
            {oran(dokuEn)}
          </p>
          <p className="mt-2 text-[15.5px] text-soluk">Dokunun en koyu noktasında, mevcut temada.</p>
        </Yer>
        <Yer b={2} s={4} ind={0} ust={2} className="mt-[clamp(48px,8vw,128px)]">
          <h3 className="baslik text-[28px]">Varyantlar</h3>
          <div className="mt-6" data-erisim-ayarlar="">
            <Ayarlar onek="er-" />
          </div>
        </Yer>
        <Yer b={7} s={6} ind={6} ust={3} className="mt-[clamp(48px,8vw,128px)]">
          <h3 className="baslik text-[28px]">Kontrol listesi</h3>
          <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-4 p-0 text-[16.5px]" data-erisim-liste="">
            {[
              ['Yazı', 'Koyu tonlarla, en az 4,5:1; yüksek kontrast varyantında 7:1. Kül grisi yazı olmaz.'],
              ['İnce çizgi', 'Denetim çerçevesi kurumuş yaprak (3,2:1) ya da koyusu; kül grisi yalnız süs.'],
              ['Odak ve tıklama', '2 px koyu kahverengi kontur, 4 px boşluk; kömür temada açık kahve.'],
              ['Renk tek başına değil', 'Seçili öğe nokta ve dolgu ile; durum ikon ve yazı ile; hata ✕ ve kesikli çizgi ile.'],
              ['Doku', 'En koyu noktada bile soluk metin 4,5:1’in üstünde.'],
              ['Hareket', 'Yalnız solma ve renk; kapalıyken hiçbir şey çalışmaz.'],
              ['Hedef boyutu', 'Düğme, çip, alan ve anahtar en az 46 px.'],
              ['Ekran okuyucu', 'Süs SVG’leri gizli; sepet, sayaç ve form durumları aria-live ile.'],
            ].map(([a, b]) => (
              <li key={a} className="flex gap-3">
                <Ikon ad="tik" boyut={16} className="mt-2 shrink-0" />
                <span>
                  <b className="font-normal">{a}.</b> <span className="text-soluk">{b}</span>
                </span>
              </li>
            ))}
          </ul>
        </Yer>
      </WabiContainer>
    </Section>
  )
}
