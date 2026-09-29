import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { karis, kontrast, oran } from '../lib/contrast'
import { TEMA_RENK } from '../lib/data'
import { useBotanical, type Ruzgar } from '../lib/store'
import { BotanicalCard, Dal, EcoButton, MaskeliGorsel } from '../components/Botanical'
import { Ayarlar } from '../components/Header'
import { Ikon } from '../components/Ikon'
import { Aralik, Kod, Secim, Section } from '../components/ui'

/* ───────────────────────── Madde 16 · Hareket ───────────────────────── */

export function Hareket() {
  const { hareket, hareketTercih, ruzgar, setRuzgar } = useBotanical()
  const [akis, setAkis] = useState(14)
  const kok = useRef<HTMLDivElement>(null)
  const [degerler, setDegerler] = useState({ gen: '', sure: '' })
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    setDegerler({ gen: cs.getPropertyValue('--r-gen').trim(), sure: cs.getPropertyValue('--r-sure').trim() })
  }, [ruzgar])
  return (
    <Section
      id="hareket"
      ikon="dalga"
      madde="Madde 16 · Hareket dili"
      title={
        <>
          Rüzgâr ve <span className="vurgu">akan su</span>
        </>
      }
      lead="Bitkiler yavaşça, hiç durmadan sallanır; su bir yönde, aynı hızla akar. Hızlı geçiş, sıçrama ve ani duruş yok. Rüzgâr şiddetini ve akış süresini değiştirin; hareket kapalıyken her şey durgun ama eksiksiz görünür."
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="yuzey min-w-0 overflow-hidden p-6 sm:p-9 lg:col-span-7" data-hareket-sahne="">
          <p className="kicker">Rüzgâr</p>
          <div className="mt-3 flex items-end justify-around gap-2 px-2" style={{ minHeight: 190 }} data-cayir="">
            {[110, 150, 96, 168, 124, 90].map((b, i) => (
              <Dal key={i} boy={b} yaprak={4 + (i % 4)} yon={i % 2 ? 1 : -1} palet={i % 3 === 0 ? 'toprak' : i % 3 === 1 ? 'zeytin' : 'kil'} gecikme={i * 0.7} />
            ))}
          </div>
          <div className="su-akis -mt-2 opacity-60" style={{ ['--k' as string]: 0.8 }} aria-hidden="true" />
          <p className="kicker mt-8">Su</p>
          <div ref={kok} className="mt-3 grid grid-cols-1 gap-2" style={{ ['--akis-sure' as string]: `${akis}s` } as CSSProperties} data-su="">
            {[1, 0.75, 1.4].map((k, i) => (
              <div key={i} className="su-akis" style={{ ['--k' as string]: k, ['--su-renk' as string]: ['var(--zeytin)', 'var(--kil)', 'var(--ormanA, #5c7c7a)'][i] } as CSSProperties} />
            ))}
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5 lg:col-span-5">
          <div className="yuzey grid grid-cols-1 gap-5 p-6">
            <Secim<Ruzgar>
              legend="Rüzgâr şiddeti"
              name="hr-ruzgar"
              value={ruzgar}
              onChange={setRuzgar}
              options={[
                { id: 'sakin', ad: 'Sakin' },
                { id: 'orta', ad: 'Orta' },
                { id: 'guclu', ad: 'Güçlü' },
              ]}
            />
            <Aralik label="Su akış süresi (bir dalga)" value={akis} min={6} max={30} step={2} onChange={setAkis} format={(v) => `${v} sn`} />
            <p className="text-[16.5px]" data-hareket-durum="">
              Hareket <b>{hareket ? 'açık' : 'kapalı'}</b> <span className="text-soluk">({hareketTercih === 'oto' ? 'sistem tercihi' : 'ayardan'})</span>
            </p>
            <p className="font-mono text-[13px] text-soluk" data-ruzgar-deger={`${degerler.gen}/${degerler.sure}`}>
              --r-gen {degerler.gen}° · --r-sure {degerler.sure}
            </p>
          </div>
        </div>
      </div>
      <div className="yuzey mt-[var(--aralik)] overflow-x-auto p-6 sm:p-8" role="region" aria-label="Hareket değerleri" tabIndex={0}>
        <table className="tablo w-full min-w-[620px] border-collapse text-[16.5px]" data-hareket-tablo="">
          <caption>Hareket değerleri</caption>
          <tbody>
            {[
              ['Dal salınımı', '4,6–10 sn', 'ease-in-out, sonsuz', '±1,6–5,5° köke göre; her yaprak ayrıca ±1,7×'],
              ['Su akışı', '8–22 sn', 'doğrusal, sonsuz', 'dalga şeridi (mask) yatay kayar'],
              ['Bölüm belirişi', '1,6 sn', 'cubic-bezier(.22, .61, .36, 1)', 'opaklık + 16 px yerleşme'],
              ['Düğme formu', '1,2 sn', 'ease', 'köşe yarıçapları başka bir taşa dönüşür'],
              ['Düğme rengi', '0,8 sn', 'ease', 'dolgu ve yazı rengi'],
              ['Kart formu', '1,4 sn', 'ease', 'hover’da köşeler yumuşakça değişir'],
            ].map(([a, b, c, d]) => (
              <tr key={a}>
                <th scope="row" className="font-semibold">
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
      <p className="mt-6 max-w-[64ch] text-[16.5px] text-soluk">Hareket kapalıyken (ya da sistem hareketi azaltıyorsa) bitkiler ve su durur, hiçbir animasyon çalışmaz; içerik ilk andan görünür.</p>
    </Section>
  )
}

/* ───────────────────────── Madde 17 · Mobil ───────────────────────── */

export function Mobil() {
  const [genislik, setGenislik] = useState(1100)
  const kutu = useRef<HTMLDivElement>(null)
  const [olc, setOlc] = useState({ kolon: 0, dikey: false, radius: '', gorselH: 0 })
  useEffect(() => {
    const t = window.setTimeout(() => {
      const el = kutu.current
      if (!el) return
      const iz = el.querySelector<HTMLElement>('.mob-izgara')
      const ko = el.querySelector<HTMLElement>('.mob-kolaj')
      const kart = el.querySelector<HTMLElement>('.bcard-yuz')
      const kolon = iz ? getComputedStyle(iz).gridTemplateColumns.split(' ').length : 0
      const dikey = ko ? getComputedStyle(ko).gridTemplateColumns.split(' ').length === 1 : false
      setOlc({ kolon, dikey, radius: kart ? getComputedStyle(kart).borderTopLeftRadius : '', gorselH: Math.round(el.querySelector('[data-maske]')?.getBoundingClientRect().height ?? 0) })
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
          Dikey akar, <span className="vurgu">akışkanlığını</span> kaybetmez
        </>
      }
      lead="Yatay yerleşimler mobilde dikey düzene geçer: kolaj tek sütuna iner, ızgara 3 → 2 → 1 kolon olur. Şekiller yüzdeyle tanımlı olduğu için küçülürken formları bozulmaz. Aşağıdaki genişliği değiştirin; kurallar kapsayıcı sorgusuyla çalışır."
    >
      <div className="yuzey grid grid-cols-1 items-center gap-x-10 gap-y-4 p-6 md:grid-cols-2">
        <Aralik label="Kapsayıcı genişliği" value={genislik} min={300} max={1140} step={10} onChange={setGenislik} format={(v) => `${v}px`} />
        <div className="text-[16.5px]" aria-live="polite" data-mobil-durum={`${olc.kolon}/${olc.dikey ? 'dikey' : 'yatay'}`}>
          <p>
            Izgara: <b>{olc.kolon} kolon</b> · Kolaj: <b>{olc.dikey ? 'dikey' : 'yatay'}</b>
          </p>
          <p className="font-mono text-[13px] text-soluk">kart yarıçapı {olc.radius}</p>
        </div>
      </div>
      <div className="mt-8 overflow-x-auto pb-2">
        <div ref={kutu} className="mob mx-auto" style={{ width: `min(${genislik}px, 100%)` }} data-mobil-kutu={genislik}>
          <div className="yuzey p-4 sm:p-6">
            <div className="mob-kolaj">
              <div className="min-w-0">
                <p className="kicker">Fidan</p>
                <p className="baslik mt-1 text-[clamp(26px,3vw,38px)]">
                  Toprak, su ve <span className="vurgu">biraz sabır.</span>
                </p>
                <div className="mt-4">
                  <EcoButton ton="kil" boy="k">
                    Pazara göz at
                  </EcoButton>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[280px]">
                <MaskeliGorsel sahne="zeytin" maske="yaprak" oran="1 / 1" tohum={2} />
                <Dal boy={80} yaprak={5} className="pointer-events-none absolute -bottom-3 -left-2" />
              </div>
            </div>
            <div className="mob-izgara mt-6">
              {(['yag', 'bal', 'sabun'] as const).map((s, i) => (
                <BotanicalCard key={s} sahne={s} maske={(['tas', 'tas', 'damla'] as const)[i]} oran="4 / 3" tohum={i + 2} ton={(['toprak', 'zeytin', 'kil'] as const)[i]} baslik={['Zeytinyağı', 'Bal', 'Sabun'][i]} className="min-w-0">
                  <p className="text-[15.5px] text-soluk">Elle hasat, yerel üretici.</p>
                </BotanicalCard>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="yuzey mt-[var(--aralik)] overflow-x-auto p-6 sm:p-8" role="region" aria-label="Kırılma noktaları" tabIndex={0}>
        <table className="tablo w-full min-w-[560px] border-collapse text-[16.5px]" data-mobil-tablo="">
          <caption>Kapsayıcı kırılmaları</caption>
          <thead>
            <tr>
              {['Genişlik', 'Izgara', 'Kolaj', 'Şekiller'].map((b) => (
                <th key={b} scope="col" className="etiket">
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['≥ 900 px', '3 kolon', 'yatay (1,1 : 1)', 'yüzdeli yarıçap, değişmez'],
              ['640–899 px', '2 kolon', 'yatay', 'aynı'],
              ['480–639 px', '2 kolon', 'dikey, metin üstte', 'aynı'],
              ['< 480 px', '1 kolon', 'dikey', 'aynı; görsel tam genişlik'],
            ].map(([a, b, c, d]) => (
              <tr key={a}>
                <th scope="row" className="font-semibold">
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
    </Section>
  )
}

/* ───────────────────────── Madde 18 · Erişim ───────────────────────── */

const YAZI_RENKLERI = [
  ['Koyu orman', '#2F4F4F'],
  ['Derin kömür', '#1F3232'],
  ['Zeytin', '#556B2F'],
  ['Derin kil', '#9A4530'],
  ['Terracotta', '#C86D51'],
  ['Toprak beji', '#D2B48C'],
  ['Keten', '#F4EEE1'],
] as const
const ZEMINLER = [
  ['Keten', '#F4EEE1'],
  ['Yüzey', '#FBF8F1'],
  ['Toprak beji', '#D2B48C'],
  ['Terracotta', '#C86D51'],
  ['Zeytin', '#556B2F'],
  ['Orman', '#2F4F4F'],
] as const

export function Erisim() {
  const { tema } = useBotanical()
  const t = TEMA_RENK[tema]
  const [fg, setFg] = useState('#C86D51')
  const [bg, setBg] = useState('#D2B48C')
  const [buyuk, setBuyuk] = useState<'normal' | 'buyuk'>('normal')
  const k = kontrast(fg, bg)
  const esik = buyuk === 'buyuk' ? 3 : 4.5
  const gecti = k >= esik
  const oneri = YAZI_RENKLERI.filter(([, h]) => h !== fg)
    .map(([ad, h]) => ({ ad, h, k: kontrast(h, bg) }))
    .filter((x) => x.k >= 4.5)
    .sort((a, b) => a.k - b.k)[0]
  // doku üstünde soluk metin
  const dokuEn = kontrast(t.soluk, karis(t.zemin, t.dokRenk, t.dokA))
  return (
    <Section
      id="erisim"
      ikon="kalkan"
      madde="Madde 18 · Erişilebilirlik ve varyantlar"
      title={
        <>
          Toprak tonlarında <span className="vurgu">net</span> okuma
        </>
      }
      lead="Toprak tonları bazen düşük kontrast verir: terracotta bej üstünde okunmaz, zeytin bej üstünde sınırda kalır. Bu yüzden metin daima koyu orman yeşili ya da derin kömür. Yazı ve zemin rengini seçin: oran, AA / AAA kararı ve önerilen düzeltme anında gösterilir."
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="yuzey grid min-w-0 grid-cols-1 gap-6 p-6 sm:p-9 lg:col-span-7">
          <Secim<string> legend="Yazı rengi" name="er-fg" value={fg} onChange={setFg} options={YAZI_RENKLERI.map(([ad, h]) => ({ id: h, ad }))} />
          <Secim<string> legend="Zemin" name="er-bg" value={bg} onChange={setBg} options={ZEMINLER.map(([ad, h]) => ({ id: h, ad }))} />
          <Secim<'normal' | 'buyuk'>
            legend="Yazı boyu"
            name="er-boy"
            value={buyuk}
            onChange={setBuyuk}
            options={[
              { id: 'normal', ad: 'Normal (17 px)' },
              { id: 'buyuk', ad: 'Büyük kalın (24 px 700)' },
            ]}
          />
          <div className="p-6" style={{ background: bg, borderRadius: 'var(--r-kart)' }} data-erisim-onizleme="">
            <p style={{ color: fg, fontSize: buyuk === 'buyuk' ? 24 : 17, fontWeight: buyuk === 'buyuk' ? 700 : 420 }} className="font-baslik">
              Soğuk sıkım zeytinyağı, elle toplandı.
            </p>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <BotanicalCard ton={gecti ? 'zeytin' : 'kil'} katman={1} tohum={8} kicker="Sonuç" baslik={<span data-erisim-oran={k.toFixed(2)}>{oran(k)}</span>}>
            <p className="flex items-center gap-2 text-[18px] font-bold" aria-live="polite" data-erisim-karar={gecti ? 'gecti' : 'kaldi'}>
              <Ikon ad={gecti ? 'tik' : 'kapat'} boyut={22} />
              {gecti ? (k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : 'AA (büyük metin)') : `Yetersiz: en az ${String(esik).replace('.', ',')}:1 gerekir`}
            </p>
            {!gecti && oneri ? (
              <div className="mt-4 text-[16.5px]" data-erisim-oneri={oneri.h}>
                <p>
                  Öneri: <b>{oneri.ad}</b> <span className="font-mono text-[13px]">{oneri.h}</span> ile <b>{oran(oneri.k)}</b>.
                </p>
                <div className="mt-3">
                  <EcoButton boy="k" ton="hayalet" onClick={() => setFg(oneri.h)}>
                    Öneriyi uygula
                  </EcoButton>
                </div>
              </div>
            ) : null}
          </BotanicalCard>
        </div>
      </div>

      <div className="mt-[var(--aralik)] grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="yuzey min-w-0 p-6 sm:p-9 lg:col-span-5">
          <h3 className="baslik text-[24px]">Varyantlar</h3>
          <div className="mt-5" data-erisim-ayarlar="">
            <Ayarlar onek="er-" />
          </div>
        </div>
        <div className="yuzey min-w-0 p-6 sm:p-9 lg:col-span-7">
          <h3 className="baslik text-[24px]">Kontrol listesi</h3>
          <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-3 p-0 text-[17px]" data-erisim-liste="">
            {[
              ['Metin rengi', 'Koyu orman yeşili (7,7:1) ya da derin kömür (6,8:1 bej üstünde); terracotta ve toprak beji yazı olmaz.'],
              ['Büyük metin', 'Terracotta düğme yalnız 19,5 px ve 700 ile; bu boy büyük metin sayılır (3:1).'],
              ['Doku', `Doku düşük yoğunlukta; en koyu noktada soluk metin ${oran(dokuEn)}.`],
              ['Renk tek başına değil', 'Seçili öğe yaprak işareti ve dolgu; hata ✕ ve yazı; hasat ve ekim harfle.'],
              ['Klavye', 'Bütün kontroller odaklanabilir; odak halkası 3 px ve 3 px boşluklu.'],
              ['Hedef boyutu', 'Dokunma alanları en az 44 px.'],
              ['Hareket', 'Sistem “hareketi azalt” dediğinde salınım ve akış durur.'],
              ['Ekran okuyucu', 'Süs SVG’leri gizli; sepet, form ve durum değişiklikleri aria-live ile duyurulur.'],
            ].map(([a, b]) => (
              <li key={a} className="flex gap-3">
                <Ikon ad="tik" boyut={22} className="mt-1 shrink-0 text-zeytin-yazi" />
                <span>
                  <b>{a}.</b> <span className="text-soluk">{b}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={cx('mt-10 max-w-[640px]')}>
        <Kod label="Erişilebilir renk çifti" sar={false}>{`/* bej yüzeyde */\nbg-[#D2B48C] text-[#1F3232]   /* 6,8:1 */\n/* keten yüzeyde */\nbg-[#F4EEE1] text-[#2F4F4F]   /* 7,7:1 */`}</Kod>
      </div>
    </Section>
  )
}
