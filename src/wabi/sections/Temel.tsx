import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { karis, kontrast, oran } from '../lib/contrast'
import { elCerceve, elCizgisi, sapma } from '../lib/cizim'
import { RENKLER, TEMA } from '../lib/data'
import { IKON_GRUPLARI, SIMGE_AD } from '../lib/simge'
import { useWabi, type Doku } from '../lib/store'
import { Belir } from '../components/Belir'
import { Ikon } from '../components/Ikon'
import { Seramik } from '../components/Seramik'
import { Aralik, Kod, Secim, Section } from '../components/ui'
import { Enso, ImperfectCard, WabiButton, WabiContainer, Yer } from '../components/Wabi'

const CAKIL = ['58% 42% 63% 37% / 46% 55% 45% 54%', '46% 54% 38% 62% / 58% 44% 56% 42%', '63% 37% 52% 48% / 41% 57% 43% 59%', '41% 59% 57% 43% / 52% 40% 60% 48%']

/* ───────────────────────── Madde 4 · Renk ───────────────────────── */

export function Renk() {
  const t = TEMA.kil
  const dokulu = karis(t.zemin, t.dokRenk, t.dokA)
  const satirlar: [string, string, string, string, string][] = [
    ['Metin', '#4A4542', t.zemin, 'Ham Kil', 'Gövde metni'],
    ['Soluk metin', t.soluk, t.zemin, 'Ham Kil', 'İkincil metin'],
    ['Soluk metin', t.soluk, dokulu, 'dokunun en koyu noktası', 'İkincil metin, en kötü durum'],
    ['Kurumuş Yaprak', '#8C7B70', t.zemin, 'Ham Kil', 'Denetim çerçevesi, ince çizgi'],
    ['Kül Grisi', '#B0A8A0', t.zemin, 'Ham Kil', 'Yalnız süs'],
    ['Mat Siyah', '#1F1C1A', t.zemin, 'Ham Kil', 'Dolu düğme, küçük detay'],
    ['Ham Kil', t.zemin, '#1F1C1A', 'Mat Siyah', 'Dolu düğme yazısı'],
  ]
  const karar = (k: number) => (k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : k >= 3 ? 'Yalnız büyük yazı ve çizgi' : 'Yalnız süs')
  return (
    <Section
      id="renk"
      no="02"
      madde="Madde 4 · Renk paleti"
      duzen={1}
      title={
        <>
          Kil, kül ve <span className="vurgu">kurumuş yaprak</span>
        </>
      }
      lead="Dört ton: ham kil zemin, kül grisi süs, kurumuş yaprak çizgi, mat siyah küçük detay. Doğal taş renkleri birbirine yakındır; bu yüzden yazı yalnız koyu tonlarla, çizgiler yalnız kurumuş yaprakla çizilir."
    >
      <WabiContainer>
        {RENKLER.map((r, i) => (
          <Yer key={r.id} b={[2, 7, 4, 10][i]} s={[4, 3, 3, 2][i]} ind={[0, 24, 8, 40][i]} ust={[0, 4, 1, 3][i]} data-renk={r.hex}>
            <Belir gecikme={i * 260}>
              <div className="border border-cizgi" style={{ background: r.hex, height: r.boy, borderRadius: CAKIL[i], marginTop: r.kaydir }} role="img" aria-label={`${r.ad} ${r.hex}`} />
              <h3 className="baslik mt-6 text-[clamp(26px,2.4vw,34px)]">{r.ad}</h3>
              <p className="rakam mt-1 text-[18px] tracking-[0.08em]">{r.hex}</p>
              <p className="mt-3 max-w-[34ch] text-[15.5px] text-soluk">{r.rol}</p>
            </Belir>
          </Yer>
        ))}
      </WabiContainer>

      <WabiContainer className="mt-[calc(var(--uzay)*1.4)]">
        <Yer b={3} s={8} ind={0}>
          <div className="overflow-x-auto" role="region" aria-label="Renk çiftleri kontrastı" tabIndex={0}>
            <table className="tablo w-full min-w-[640px] border-collapse text-[16px]" data-renk-tablo="">
              <caption>Renk çiftleri</caption>
              <thead>
                <tr>
                  {['Renk', 'Zemin', 'Oran', 'Karar'].map((b) => (
                    <th key={b} scope="col" className="etiket">
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {satirlar.map(([ad, fg, bg, bgAd, kul]) => {
                  const k = kontrast(fg, bg)
                  return (
                    <tr key={ad + bgAd} data-oran={k.toFixed(2)}>
                      <th scope="row" className="font-normal">
                        <span className="mr-3 inline-block size-3.5 border border-cizgi align-[-1px]" style={{ background: fg, borderRadius: '45% 55% 50% 50%' }} aria-hidden="true" />
                        {ad}
                        <span className="block text-[13.5px] text-soluk">{kul}</span>
                      </th>
                      <td>{bgAd}</td>
                      <td className="rakam text-[18px]">{oran(k)}</td>
                      <td>
                        <span className="inline-flex items-center gap-2">
                          <Ikon ad={k >= 4.5 ? 'tik' : k >= 3 ? 'daire' : 'eksi'} boyut={16} />
                          {karar(k)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Yer>
      </WabiContainer>

      <WabiContainer className="mt-[calc(var(--uzay)*1.2)]">
        {(['kil', 'kul', 'komur'] as const).map((id, i) => {
          const th = TEMA[id]
          return (
            <Yer key={id} b={[1, 5, 9][i]} s={[4, 3, 3][i]} ind={[0, 12, 22][i]} ust={[0, 3, 1][i]} data-tema-kart={id}>
              <div data-onizle={id} className="border border-cizgi px-7 pt-8 pb-7" style={{ borderRadius: 'var(--r-el)', marginTop: [0, 40, 16][i] }}>
                <p className="kicker">Tema · {th.ad}</p>
                <p className="baslik mt-4 text-[clamp(26px,2.4vw,34px)]">Sessizce</p>
                <p className="mt-2 text-[15px] text-soluk">İkincil metin</p>
                <p className="mt-5 font-mono text-[12.5px] text-soluk">
                  metin {oran(kontrast(th.metin, th.zemin))} · soluk {oran(kontrast(th.soluk, th.zemin))}
                </p>
              </div>
            </Yer>
          )
        })}
      </WabiContainer>
    </Section>
  )
}

/* ───────────────────────── Madde 5 · Yazı ───────────────────────── */

export function Yazi() {
  const [agirlik, setAgirlik] = useState(300)
  const [aralik, setAralik] = useState(0.1)
  return (
    <Section
      id="yazi"
      no="03"
      madde="Madde 5 · Tipografi"
      duzen={2}
      title={
        <>
          İnce <span className="vurgu">serif</span>, hafif sans
        </>
      }
      lead={
        <>
          Başlıkta Cormorant Garamond Light, gövdede Inter Light. İkisi de 300 ağırlıkta, geniş harf aralığıyla (<span className="font-mono text-[0.9em]">tracking-widest</span>, 0,1 em). Kalın ağırlık kullanılmaz; vurgu italikle, boşlukla ve boyla verilir.
        </>
      }
    >
      <WabiContainer>
        <Yer b={2} s={8} ind={0} data-yazi-ornek="">
          <Belir>
            <p className="kicker">Cormorant Garamond · başlık</p>
            <p className="baslik mt-6 text-[clamp(56px,10vw,156px)] leading-[0.98]" style={{ fontWeight: agirlik, letterSpacing: `${(aralik * 0.4).toFixed(3)}em` }} data-serif-ornek={agirlik}>
              Sessizlik
            </p>
            <p className="baslik mt-3 text-[clamp(24px,3vw,42px)] italic" style={{ fontWeight: agirlik }}>
              0123456789 · ğüşiöçİı · ₺ 1.250,00
            </p>
          </Belir>
        </Yer>
        <Yer b={9} s={4} ind={10} ust={4} className="mt-[clamp(8px,4vw,64px)]">
          <div className="grid grid-cols-1 gap-8">
            <Aralik label="Ağırlık" value={agirlik} min={300} max={500} step={50} onChange={setAgirlik} format={(v) => (v === 300 ? '300 · Light' : String(v))} />
            <Aralik label="Harf aralığı" value={aralik} min={0} max={0.2} step={0.01} onChange={setAralik} format={(v) => `${v.toFixed(2).replace('.', ',')} em`} />
          </div>
        </Yer>
        <Yer b={4} s={5} ind={6} ust={2} className="mt-[clamp(56px,9vw,140px)]">
          <Belir>
            <p className="kicker">Inter Light · gövde</p>
            <p className="mt-5 text-[19px] leading-[1.95]" style={{ fontWeight: agirlik, letterSpacing: `${aralik.toFixed(2)}em` }} data-inter-ornek={aralik}>
              Elle çekilmiş bir kasenin kenarı düz değildir. Bu yüzden bakan göz onu bir an daha uzun tutar. Sayfa da böyle olmalı: eksik, sakin ve dolu olmadığı için nefes alan.
            </p>
          </Belir>
        </Yer>
        <Yer b={2} s={10} ind={0} ust={3} className="mt-[clamp(56px,8vw,120px)]">
          <div className="overflow-x-auto" role="region" aria-label="Tip ölçeği" tabIndex={0}>
            <table className="tablo w-full min-w-[680px] border-collapse text-[16px]" data-tip-olcegi="">
              <caption>Tip ölçeği</caption>
              <thead>
                <tr>
                  {['Rol', 'Yazı tipi', 'Boy / satır', 'Ağırlık', 'Örnek'].map((b) => (
                    <th key={b} scope="col" className="etiket">
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['Görüntü', 'Cormorant Garamond', '148 / 0,98', '300', 'Sessiz', 'font-baslik text-[38px] font-light'],
                    ['Başlık', 'Cormorant Garamond', '92 / 1,08', '300', 'Boşluk', 'font-baslik text-[30px] font-light'],
                    ['Alt başlık', 'Cormorant Garamond', '40 / 1,1', '300', 'Kil ve ateş', 'font-baslik text-[24px] font-light'],
                    ['Gövde', 'Inter', '17,5 / 1,9', '300', 'Elin izi kalır.', 'text-[17.5px] font-light'],
                    ['Küçük', 'Inter', '15 / 1,8', '300', 'Odun fırını, 1240 °C', 'text-[15px] font-light'],
                    ['Üst yazı', 'Inter', '12 / 1,7', '400, +0,3 em', 'No. 07', 'kicker'],
                  ] as const
                ).map(([a, b, c, d, e, k]) => (
                  <tr key={a}>
                    <th scope="row" className="font-normal">
                      {a}
                    </th>
                    <td>{b}</td>
                    <td className="tabular-nums">{c}</td>
                    <td className="tabular-nums">{d}</td>
                    <td className={k}>{e}</td>
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

/* ───────────────────────── Madde 6 · Şekil ───────────────────────── */

export function Sekil() {
  const [tohum, setTohum] = useState(4)
  const [kusur, setKusur] = useState(1.4)
  const [kose, setKose] = useState(12)
  const W = 380
  const H = 230
  const d = useMemo(() => elCerceve(W, H, tohum, kusur, kose), [tohum, kusur, kose])
  const sp = sapma(W, H, tohum, kusur, kose)
  const cizgiD = useMemo(() => elCizgisi(0, 6, 420, 6, tohum + 20, Math.max(0.0001, kusur) * (kusur === 0 ? 0 : 1)), [tohum, kusur])
  return (
    <Section
      id="sekil"
      no="04"
      madde="Madde 6 · Şekil dili"
      duzen={3}
      title={
        <>
          Elle yapılmış gibi, <span className="vurgu">hafif eğri</span>
        </>
      }
      lead="Doğrular biraz sapar, köşeler keskin değildir, daire tam kapanmaz. Kusur bir hata değil, el izidir: aşağıdaki çerçeve her seferinde başka çizilir ve ne kadar saptığı ölçülür."
    >
      <WabiContainer>
        <Yer b={2} s={6} ind={0} data-kusur-oyun="">
          <svg viewBox={`-14 -14 ${W + 28} ${H + 28}`} className="w-full max-w-[520px] overflow-visible" role="img" aria-label={`Elle çizilmiş çerçeve, en büyük sapma ${sp} piksel`}>
            <path d={d} className="cizgi-yol" data-yol={d.length} style={{ strokeWidth: 1.2 }} />
          </svg>
          <p className="mt-6 font-mono text-[13px] text-soluk" data-sapma={sp}>
            en büyük sapma {String(sp).replace('.', ',')} px · {d.match(/C/g)?.length ?? 0} eğri parçası
          </p>
        </Yer>
        <Yer b={9} s={4} ind={12} ust={3} className="mt-[clamp(0px,5vw,80px)]">
          <div className="grid grid-cols-1 gap-8">
            <Aralik id="kusur-aralik" label="Kusur" value={kusur} min={0} max={4} step={0.2} onChange={setKusur} format={(v) => (v === 0 ? 'yok' : v.toFixed(1).replace('.', ','))} />
            <Aralik id="kose-aralik" label="Köşe yuvarlaklığı" value={kose} min={2} max={40} step={2} onChange={setKose} format={(v) => `${v} px`} />
            <div>
              <WabiButton boy="k" onClick={() => setTohum((t) => t + 1)} ikon={<Ikon ad="daire" boyut={16} />} data-yeniden-ciz="">
                Yeniden çiz
              </WabiButton>
            </div>
          </div>
        </Yer>
      </WabiContainer>

      <WabiContainer className="mt-[calc(var(--uzay)*1.3)]">
        <Yer b={4} s={3} ind={0} ust={0}>
          <Belir>
            <Enso boyut={150} tohum={8} kalin={10} />
            <p className="kicker mt-6">Ensō · açık çember</p>
          </Belir>
        </Yer>
        <Yer b={8} s={4} ind={12} ust={4} className="mt-[clamp(0px,6vw,96px)]">
          <Belir gecikme={300}>
            <div className="border border-cizgi" style={{ height: 130, borderRadius: CAKIL[0] }} role="img" aria-label="Çakıl biçimi" />
            <p className="kicker mt-5">Çakıl · yüzdeli yarıçap</p>
          </Belir>
        </Yer>
        <Yer b={2} s={5} ind={4} ust={2} className="mt-[clamp(24px,5vw,80px)]">
          <Belir gecikme={200}>
            <svg viewBox="0 0 420 12" preserveAspectRatio="none" className="h-3 w-full" aria-hidden="true">
              <path d="M0 6H420" className="cizgi-yol" style={{ opacity: 0.55 }} />
            </svg>
            <svg viewBox="0 0 420 12" preserveAspectRatio="none" className="mt-3 h-3 w-full" aria-hidden="true">
              <path d={cizgiD} className="cizgi-yol" />
            </svg>
            <p className="kicker mt-4">Cetvel çizgisi ve el çizgisi</p>
          </Belir>
        </Yer>
        <Yer b={8} s={4} ind={0} ust={2} className="mt-[clamp(24px,5vw,80px)]">
          <ImperfectCard tohum={11} kaydir={0}>
            <p className="kicker">Keskin olmayan köşe</p>
            <p className="baslik mt-3 text-[26px]">Beş farklı yarıçap</p>
            <p className="mt-2 text-[15.5px] text-soluk">5 · 11 · 7 · 13 px, dikeyde 12 · 6 · 11 · 5 px.</p>
          </ImperfectCard>
        </Yer>
      </WabiContainer>
    </Section>
  )
}

/* ───────────────────────── Madde 7 · Derinlik ───────────────────────── */

export function Derinlik() {
  const [uzak, setUzak] = useState(0.5)
  const [konum, setKonum] = useState(62)
  const kok = useRef<HTMLDivElement>(null)
  const [golge, setGolge] = useState({ n: 0, toplam: 0 })
  useEffect(() => {
    const t = window.setTimeout(() => {
      const hepsi = Array.from(document.querySelectorAll<HTMLElement>('body *'))
      setGolge({
        n: hepsi.filter((e) => {
          const s = getComputedStyle(e)
          return s.boxShadow !== 'none' || s.textShadow !== 'none' || s.filter.includes('drop-shadow')
        }).length,
        toplam: hepsi.length,
      })
    }, 400)
    return () => window.clearTimeout(t)
  }, [])
  const sapmaYuzde = Math.abs(konum - 50)
  return (
    <Section
      id="derinlik"
      no="05"
      madde="Madde 7 · Z ekseni ve gölge"
      duzen={0}
      title={
        <>
          Gölge yok, yalnız <span className="vurgu">konum</span>
        </>
      }
      lead="Bu sayfada hiçbir öğenin gölgesi yoktur. Bir nesnenin yakın ya da uzak olduğunu boşluk içindeki yeri, boyu ve tonu söyler: uzaktaki daha küçük, daha yüksekte ve daha soluktur."
    >
      <WabiContainer>
        <Yer b={2} s={8} ind={0} data-derinlik-sahne="">
          <div ref={kok} className="relative h-[clamp(320px,46vw,480px)]" role="img" aria-label="Üç seramik nesne: yakında büyük ve koyu, ortada, uzakta küçük ve soluk">
            <svg viewBox="0 0 1000 8" preserveAspectRatio="none" className="absolute inset-x-0 bottom-[14%] h-2 w-full" aria-hidden="true">
              <path d={elCizgisi(0, 4, 1000, 4, 41, 1, 60)} className="cizgi-yol" />
            </svg>
            <div className="absolute" style={{ left: '4%', bottom: '12%', transition: 'opacity 1200ms' }} data-derinlik="yakin">
              <Seramik tur="kase" sir="mat" tohum={5} boy={104} />
            </div>
            <div className="absolute" style={{ left: `${konum}%`, bottom: `${14 + uzak * 26}%`, opacity: 1 - uzak * 0.55, transition: 'left 1200ms ease, bottom 1200ms ease, opacity 1200ms ease' }} data-derinlik="odak">
              <Seramik tur="vazo" sir="yaprak" tohum={7} boy={Math.round(200 - uzak * 90)} dal />
            </div>
            <div className="absolute" style={{ left: '30%', bottom: '38%', opacity: 0.45 }} data-derinlik="uzak">
              <Seramik tur="tas" sir="kul" tohum={2} boy={54} />
            </div>
            {[38.2, 61.8].map((p) => (
              <span key={p} className="absolute top-0 bottom-0 border-l border-dashed border-cizgi/50" style={{ left: `${p}%` }} aria-hidden="true" />
            ))}
          </div>
        </Yer>
        <Yer b={9} s={4} ind={10} ust={2}>
          <div className="grid grid-cols-1 gap-8">
            <Aralik id="uzak-aralik" label="Uzaklık" value={uzak} min={0} max={1} step={0.05} onChange={setUzak} format={(v) => `%${Math.round(v * 100)}`} />
            <Aralik id="konum-aralik" label="Odak konumu" value={konum} min={5} max={90} step={1} onChange={setKonum} format={(v) => `%${v}`} />
            <p className="text-[15.5px] text-soluk" data-merkezden={sapmaYuzde}>
              Merkezden sapma <b className="font-normal text-metin">%{sapmaYuzde}</b>. Kesikli çizgiler altın oran noktalarıdır (%38,2 ve %61,8); nesneyi tam ortaya koymayın.
            </p>
          </div>
        </Yer>
        <Yer b={3} s={6} ind={4} ust={3} className="mt-[clamp(40px,7vw,110px)]">
          <ImperfectCard tohum={17} dolgu={false} data-golge-sayac={golge.n}>
            <p className="kicker">Canlı sayım</p>
            <p className="baslik mt-3 text-[clamp(30px,3vw,44px)]">
              <span className="rakam">{golge.n}</span> öğede gölge
            </p>
            <p className="mt-2 text-[15.5px] text-soluk">Sayfadaki {golge.toplam} öğenin hiçbirinde box-shadow, text-shadow ya da drop-shadow yok. Çerçeveler ince çizgidir.</p>
          </ImperfectCard>
        </Yer>
      </WabiContainer>
    </Section>
  )
}

/* ───────────────────────── Madde 8 · Doku ───────────────────────── */

const DOKULAR: { id: Doku; ad: string; aciklama: string }[] = [
  { id: 'siva', ad: 'Sıva', aciklama: 'Kireç sıvanın ince tanesi ve geniş, bulutlu tonu.' },
  { id: 'beton', ad: 'Ham beton', aciklama: 'Gözenekler ve kalıp izli, seyrek lekeler.' },
  { id: 'kil', ad: 'Killi toprak', aciklama: 'Yatay kaymış ince tane ve küçük topaklar.' },
  { id: 'seramik', ad: 'El yapımı seramik', aciklama: 'Sır altında seyrek benekler.' },
  { id: 'duz', ad: 'Düz', aciklama: 'Doku yok; yalnız zemin rengi.' },
]

export function DokuBolumu() {
  const { doku, setDoku, tema } = useWabi()
  const th = TEMA[tema]
  const enKotu = kontrast(th.soluk, karis(th.zemin, th.dokRenk, th.dokA))
  return (
    <Section
      id="doku"
      no="06"
      madde="Madde 8 · Doku ve yüzey"
      duzen={1}
      title={
        <>
          Sıva, beton, <span className="vurgu">kil</span>
        </>
      }
      lead="Doku sessizdir: en fazla %8 opaklıkla zeminin arkasında durur, metnin altında kalır. Bir yüzey seçin, tüm sayfa o dokuyla çalışır."
    >
      <WabiContainer>
        {DOKULAR.map((d, i) => (
          <Yer key={d.id} b={[2, 6, 9, 3, 7][i]} s={[3, 3, 3, 3, 3][i]} ind={[0, 10, 24, 6, 18][i]} ust={[0, 3, 1, 2, 4][i]} data-doku-yer={d.id}>
            <div data-doku={d.id}>
              <label className="block cursor-pointer outline-offset-[6px] focus-within:outline-2 focus-within:outline-[var(--odak)]" data-doku-kart={d.id}>
                <input type="radio" name="doku-sec" className="sr-only" checked={doku === d.id} onChange={() => setDoku(d.id)} />
                <span className="doku-ornek block border border-cizgi" style={{ height: [150, 190, 130, 170, 120][i], borderRadius: CAKIL[i % 4], background: 'var(--yuzey)' }} aria-hidden="true" />
                <span className="kicker mt-5 flex items-center gap-2">
                  <Ikon ad={doku === d.id ? 'tik' : 'daire'} boyut={14} />
                  {doku === d.id ? 'Seçili' : 'Seç'}
                </span>
                <span className="baslik mt-2 block text-[clamp(24px,2.2vw,30px)]">{d.ad}</span>
                <span className="mt-1 block max-w-[28ch] text-[15px] text-soluk">{d.aciklama}</span>
              </label>
            </div>
          </Yer>
        ))}
        <Yer b={8} s={4} ind={8} ust={3} className="mt-[clamp(32px,5vw,80px)]" data-doku-olcum={enKotu.toFixed(2)}>
          <p className="kicker">Okunabilirlik</p>
          <p className="mt-3 text-[16px] text-soluk">
            Dokunun en koyu noktasında ikincil metin <b className="font-normal text-metin">{oran(enKotu)}</b> verir; hedef 4,5:1.
          </p>
        </Yer>
      </WabiContainer>
    </Section>
  )
}

/* ───────────────────────── Madde 9 · İkonografi ───────────────────────── */

export function Ikonlar() {
  const [kalin, setKalin] = useState(1)
  const [boy, setBoy] = useState(18)
  return (
    <Section
      id="ikonlar"
      no="07"
      madde="Madde 9 · İkonografi"
      duzen={2}
      title={
        <>
          Yalnız <span className="vurgu">işlev</span>
        </>
      }
      lead="Mikro ikonlar yalnız temel işlevi söyler: yön, eylem, bilgi ve dört malzeme. Tek ince çizgi, dolgu yok, detay yok; uçlar birkaç onda bir birim kaymıştır."
    >
      <WabiContainer>
        <Yer b={2} s={4} ind={0} ust={0}>
          <div className="grid grid-cols-1 gap-8">
            <Aralik id="ikon-kalin" label="Çizgi kalınlığı" value={kalin} min={0.8} max={1.6} step={0.1} onChange={setKalin} format={(v) => v.toFixed(1).replace('.', ',')} />
            <Secim<string> legend="İkon boyu" name="ik-boy" value={String(boy)} onChange={(v) => setBoy(+v)} options={[14, 18, 24].map((n) => ({ id: String(n), ad: `${n} px` }))} />
          </div>
        </Yer>
        <Yer b={7} s={5} ind={6} ust={2} data-ikon-gruplari="">
          <div className="grid grid-cols-1 gap-[clamp(40px,5vw,72px)]">
            {IKON_GRUPLARI.map((g, gi) => (
              <div key={g.ad} className="kayik" style={{ ['--ind' as string]: [0, 12, 4, 18][gi] } as CSSProperties}>
                <h3 className="kicker">{g.ad}</h3>
                <ul className="m-0 mt-5 grid list-none grid-cols-3 gap-x-6 gap-y-7 p-0 sm:grid-cols-4">
                  {g.liste.map((a) => (
                    <li key={a} className="flex flex-col items-start gap-2.5">
                      <Ikon ad={a} boyut={boy} kalin={kalin} />
                      <span className="text-[13px] leading-tight text-soluk">{SIMGE_AD[a]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Yer>
      </WabiContainer>
      <WabiContainer className="mt-[calc(var(--uzay)*1)]">
        <Yer b={2} s={5} ind={0}>
          <Kod label="Ikon çizgi biçimi" sar={false}>{`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"\n     stroke-width="1" stroke-linecap="round" stroke-linejoin="round">\n  <path vector-effect="non-scaling-stroke" d="M4 12.2H19.6M14 6.4L19.8 12L14.2 17.8"/>\n</svg>`}</Kod>
        </Yer>
      </WabiContainer>
    </Section>
  )
}
