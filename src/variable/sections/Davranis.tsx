import { useEffect, useMemo, useRef, useState } from 'react'
import { Degisken } from '../components/Degisken'
import { EksenBaslik, type Harita } from '../components/EksenBaslik'
import { Ayarlar } from '../components/Header'
import { Aralik, Bolum, Buton, KENAR } from '../components/ui'
import { basamakYaniti, yayOzellik } from '../lib/fizik'
import { HAREKET_KAYDI, KILIT_ESIGI, useVariable } from '../lib/store'

/* ───────────────────────── Madde 16 · Elastik tepki ───────────────────────── */

const H_ELASTIK: Harita = { x: [{ v: '--wdth', min: 25, max: 151 }], y: [{ v: '--wght', min: 100, max: 1000, ters: true }], dinlenme: { '--wdth': 100, '--wght': 400 } }

function YayGrafigi({ k, c }: { k: number; c: number }) {
  const { pts } = useMemo(() => basamakYaniti(k, c, 2, 120), [k, c])
  const W = 480
  const H = 200
  const tepe = Math.max(1.05, ...pts)
  const y = (v: number) => H - 20 - (v / tepe) * (H - 40)
  const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${((i / (pts.length - 1)) * (W - 20) + 10).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label="Yay basamak yanıtı grafiği" data-cizim="yay" data-yay-grafik="">
      <line x1="10" x2={W - 10} y1={y(1)} y2={y(1)} stroke="var(--kontrol)" strokeDasharray="4 4" strokeWidth="1.5" />
      <line x1="10" x2={W - 10} y1={y(0)} y2={y(0)} stroke="var(--hat)" strokeWidth="1.5" />
      <path d={d} fill="none" stroke="var(--patlama-yazi)" strokeWidth="3" strokeLinejoin="round" />
      <text x="14" y={y(1) - 6} fontSize="12" fill="var(--soluk)" fontFamily="var(--font-metin)">
        hedef
      </text>
    </svg>
  )
}

export function Hareket() {
  const { hareket } = useVariable()
  const [k, setK] = useState(170)
  const [c, setC] = useState(11)
  const [olc, setOlc] = useState<{ asim: number } | null>(null)
  const oz = yayOzellik(k, c)
  const olcum = () => setOlc({ asim: basamakYaniti(k, c, 3, 300).asim })
  return (
    <Bolum
      id="hareket"
      no="12"
      madde="Madde 16 · Hareket dili"
      baslik="Elastik tepki"
      vurgulu={[1]}
      lead="İmlecin X koordinatı genişliğe, Y koordinatı kalınlığa gider; ama doğrudan değil: her eksen bir yaydır. Sönüm oranı 1’in altındaysa eksen hedefi aşar, sallanır ve yerleşir. Yayı sertleştirin, gevşetin; tepkinin biçimi yanındaki grafikte çizilir."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12`}>
        <div className="lg:col-span-7" data-elastik="">
          <EksenBaslik metin="Elastik" aile="flex" harita={H_ELASTIK} sertlik={k} sonum={c} alt="x → genişlik · y → kalınlık" boy="clamp(48px, 10vw, 150px)" ad="elastik-lab" className="min-h-[360px]" />
        </div>
        <div className="grid content-start gap-6 lg:col-span-5">
          <Aralik id="yay-sertlik" label="Yay sertliği (k)" value={k} min={40} max={400} step={10} onChange={setK} />
          <Aralik id="yay-sonum" label="Sönüm (c)" value={c} min={2} max={40} step={1} onChange={setC} />
          <dl className="grid grid-cols-3 gap-4" data-yay-ozellik={`${oz.zeta.toFixed(2)}|${oz.asim.toFixed(1)}`}>
            <div>
              <dt className="kicker">Sönüm oranı ζ</dt>
              <dd className="rakam m-0 mt-1 text-[22px]">{oz.zeta.toFixed(2).replace('.', ',')}</dd>
            </div>
            <div>
              <dt className="kicker">Aşım</dt>
              <dd className="rakam m-0 mt-1 text-[22px]">%{oz.asim.toFixed(1).replace('.', ',')}</dd>
            </div>
            <div>
              <dt className="kicker">Doğal frekans</dt>
              <dd className="rakam m-0 mt-1 text-[22px]">{oz.w0.toFixed(1).replace('.', ',')}</dd>
            </div>
          </dl>
          <YayGrafigi k={k} c={c} />
          <div className="flex flex-wrap items-center gap-3">
            <Buton onClick={olcum} data-olc="">
              Basamak yanıtını ölç
            </Buton>
            <p className="rakam text-[14px]" data-asim-olculen={olc ? olc.asim.toFixed(1) : ''} data-asim-beklenen={oz.asim.toFixed(1)}>
              {olc ? `ölçülen aşım %${olc.asim.toFixed(1).replace('.', ',')} · beklenen %${oz.asim.toFixed(1).replace('.', ',')}` : 'henüz ölçülmedi'}
            </p>
          </div>
          <p className="text-[14px] text-soluk" data-hareket-durum={hareket ? 'acik' : 'kapali'}>
            {hareket ? 'Hareket açık: kart imleci yayla izler.' : 'Hareket durdu: kart dinlenme durumunda kalır.'} Kartta ok tuşlarıyla da deneyebilirsiniz.
          </p>
        </div>
        <div className="overflow-x-auto lg:col-span-12" role="region" aria-label="Hareket eşlemeleri" tabIndex={0}>
          <table className="tablo w-full min-w-[620px] border-collapse text-[15px]" data-hareket-tablo="">
            <caption className="kicker">Girdi → eksen</caption>
            <thead>
              <tr>
                {['Girdi', 'Eksen', 'Aralık', 'Eğri'].map((b) => (
                  <th key={b} scope="col">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['İmleç X (kart içi)', 'wdth', '25 → 151', 'yay k=170, c=11'],
                ['İmleç Y (kart içi)', 'wght', '1000 → 100', 'yay k=170, c=11'],
                ['İmleç uzaklığı (harf başına)', 'wght, wdth, slnt', 'şişme yarıçapı ≈ 1,5 × harf boyu', 'yay; halkadaki harf incelir'],
                ['Boşta zaman', 'wght, wdth', '± %10, ± %8', 'sin(1,3 t + 0,9 i)'],
                ['Hover (CSS)', '--wght, --wdth, --slnt', 'kayıtlı özellik', 'cubic-bezier(.34, 1.56, .64, 1)'],
              ].map(([a, b, c2, d]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td className="font-mono text-[13px]">{b}</td>
                  <td>{c2}</td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 17 · Mobil: kilit ───────────────────────── */

export function Mobil() {
  const { kilitli, dar, esneklik } = useVariable()
  const [genislik, setGenislik] = useState(360)
  const kutu = useRef<HTMLDivElement>(null)
  const [olc, setOlc] = useState({ kutu: 0, ayar: '', kilit: false })
  useEffect(() => {
    const oku = () => {
      const k = kutu.current
      if (!k) return
      const harf = k.querySelector<HTMLElement>('.hk')
      const ayar = harf ? getComputedStyle(harf).fontVariationSettings : ''
      const w = /"wght"\s+([\d.]+)/.exec(ayar)?.[1]
      const wd = /"wdth"\s+([\d.]+)/.exec(ayar)?.[1]
      setOlc({ kutu: k.clientWidth, ayar, kilit: w === '400' && wd === '100' })
    }
    const t = window.setTimeout(oku, 250)
    const id = window.setInterval(oku, 700)
    return () => {
      window.clearTimeout(t)
      window.clearInterval(id)
    }
  }, [genislik])
  return (
    <Bolum
      id="mobil"
      no="13"
      madde="Madde 17 · Responsive kurallar"
      baslik="Kilitle"
      vurgulu={[0]}
      lead={`Deforme edilmiş harf küçük ekranda okunmaz. Bu yüzden ${KILIT_ESIGI} pikselin altında bütün eksenler güvenli standart değerlere kilitlenir: kalınlık 400, genişlik 100, eğim 0. Genişliği daraltın; harflerin hesaplanan ayarı anında değişir.`}
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12`}>
        <div className="grid content-start gap-6 lg:col-span-4">
          <Aralik id="mob-genislik" label="Kapsayıcı genişliği" value={genislik} min={280} max={1100} step={10} onChange={setGenislik} format={(v) => `${v} px`} />
          <div className="text-[16px]" aria-live="polite" data-kilit-durum={olc.kilit ? 'kilitli' : 'serbest'}>
            <p>
              Kutu: <b className="rakam">{olc.kutu}</b> px · eksenler: <b>{olc.kilit ? 'kilitli' : 'serbest'}</b>
            </p>
            <p className="mt-2 font-mono text-[12.5px] break-words text-soluk" data-kilit-olcum={olc.ayar}>
              {olc.ayar || '—'}
            </p>
          </div>
          <p className="text-[14px] text-soluk" data-sayfa-kilit={kilitli ? 'evet' : 'hayir'}>
            Bu sayfa şu an: <b className="text-metin">{kilitli ? 'kilitli' : 'serbest'}</b> ({esneklik === 'kilitli' ? 'ayardan' : dar ? 'dar ekran' : 'geniş ekran'}).
          </p>
        </div>
        <div className="overflow-x-auto lg:col-span-8">
          <div ref={kutu} className="kilit-kap" style={{ width: `min(${genislik}px, 100%)`, containerType: 'inline-size', containerName: 'kilit' }} data-kilit-kutu={genislik}>
            <div className="border-2 border-metin p-3">
              <Degisken metin="Büküm" boy="clamp(2.5rem, 24vw, 12rem)" k={0.66} ad="mobil-kilit" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto lg:col-span-12" role="region" aria-label="Kilit kuralları" tabIndex={0}>
          <table className="tablo w-full min-w-[560px] border-collapse text-[15px]" data-kilit-tablo="">
            <caption className="kicker">Kurallar</caption>
            <thead>
              <tr>
                {['Genişlik', 'Eksenler', 'İmleç etkisi', 'Not'].map((b) => (
                  <th key={b} scope="col">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [`≥ ${KILIT_ESIGI} px`, 'serbest', 'açık (tam hareket)', 'display başlıkta deneysel biçim'],
                [`< ${KILIT_ESIGI} px`, 'wght 400 · wdth 100 · slnt 0', 'kapalı', 'okunabilirlik önce gelir'],
                ['Ayardan “hep kilitli”', 'wght 400 · wdth 100 · slnt 0', 'kapalı', 'her genişlikte'],
                ['Eksen laboratuvarı', 'kullanıcı kontrollü', 'kaydırıcılar', 'istisna: örnek bilerek bükülür'],
              ].map(([a, b, c, d]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td className="font-mono text-[13px]">{b}</td>
                  <td>{c}</td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 18 · Erişim ───────────────────────── */

const KURALLAR = [
  ['Yalnız büyük başlık', 'Deneysel eksenler 32 pikselden küçük metinde kullanılmaz. Gövde metni Inter’dir ve hiçbir zaman bükülmez.'],
  ['Dar ekranda kilit', '640 pikselin altında eksenler wght 400 · wdth 100 · slnt 0 değerlerine kilitlenir. Ayardan “hep kilitli” de seçilir.'],
  ['Durdur', 'Başlıktaki Durdur düğmesi bütün hareketi keser: harfler dinlenme durumunda kalır, glitch ve piksel efekti çalışmaz.'],
  ['Sisteme uy', 'İşletim sistemi hareketi azaltıyorsa sayfa hareketsiz açılır. Kullanıcı isterse ayardan geri açar.'],
  ['Ekran okuyucu', 'Bölünmüş harfler gizlidir; her başlık metnini bir kez, bütün olarak okutur. Piksel metni tuval değil erişilebilir görseldir.'],
  ['Klavye', 'Eksen kartları odaklanır; ok tuşları imleç yerine geçer. Odak halkası 3 piksel ve patlama renginde.'],
  ['Yanıp sönme yok', 'Glitch en çok 260 ms sürer, iki patlama arasında en az 1,2 sn vardır ve yalnız birkaç dilimi kaydırır; renk değiştirmez.'],
] as const

interface Denetim {
  buyuk: number
  ihlal: number
  govde: number
  ihlalOrnek: string[]
}
function denetle(): Denetim {
  const guvenli = (ayar: string, px: number) => {
    if (ayar === 'normal' || !ayar) return true
    if (px >= 32) return true
    const p: Record<string, number> = {}
    for (const m of ayar.matchAll(/"([A-Za-z]{4})"\s+(-?[\d.]+)/g)) p[m[1]] = +m[2]
    if ('wght' in p && (p.wght < 300 || p.wght > 800)) return false
    if ('wdth' in p && p.wdth !== 100) return false
    if ('slnt' in p && p.slnt !== 0) return false
    for (const t of ['CASL', 'SOFT', 'WONK']) if (t in p && p[t] !== 0) return false
    return true
  }
  const d: Denetim = { buyuk: 0, ihlal: 0, govde: 0, ihlalOrnek: [] }
  const w = document.createTreeWalker(document.querySelector('main')!, NodeFilter.SHOW_TEXT)
  const gorulen = new Set<Element>()
  for (let t = w.nextNode(); t; t = w.nextNode()) {
    if (!t.textContent?.trim()) continue
    const e = t.parentElement!
    if (gorulen.has(e) || e.closest('.sr-only, script, style, svg, [data-deney], .glif, option')) continue
    gorulen.add(e)
    const s = getComputedStyle(e)
    if (s.display === 'none' || s.visibility === 'hidden') continue
    const px = parseFloat(s.fontSize)
    const ayar = s.fontVariationSettings
    if (ayar !== 'normal' && px >= 32) d.buyuk++
    if (s.fontFamily.includes('Inter') && ayar === 'normal') d.govde++
    if (!guvenli(ayar, px)) {
      d.ihlal++
      if (d.ihlalOrnek.length < 3) d.ihlalOrnek.push(`${e.tagName} ${Math.round(px)}px ${ayar}`)
    }
  }
  return d
}

export function Erisim() {
  const { hareket, kilitli } = useVariable()
  const [say, setSay] = useState({ bilesen: 0, css: 0 })
  const [den, setDen] = useState<Denetim>({ buyuk: 0, ihlal: 0, govde: 0, ihlalOrnek: [] })
  useEffect(() => {
    const oku = () => setSay({ bilesen: HAREKET_KAYDI.size, css: document.getAnimations().filter((a) => a.playState === 'running').length })
    oku()
    const id = window.setInterval(oku, 400)
    return () => window.clearInterval(id)
  }, [hareket])
  useEffect(() => {
    const t = window.setTimeout(() => setDen(denetle()), 800)
    return () => window.clearTimeout(t)
  }, [])
  return (
    <Bolum
      id="erisim"
      no="14"
      madde="Madde 18 · Erişilebilirlik ve varyantlar"
      baslik="Yalnız büyük başlık"
      vurgulu={[1]}
      lead="Deneysel karakterlerin okunması zordur; bu yüzden gövde metninde asla kullanılmaz, yalnız büyük display başlıkta tercih edilir. Aşağıdaki denetim sayfanın kendisini tarar: 32 pikselden küçük hiçbir metinde deneysel ayar olmamalı."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12`}>
        <div className="lg:col-span-5" data-erisim-ayarlar="">
          <h3 className="text-[clamp(22px,7vw,28px)]" style={{ fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 40" }}>
            Varyantlar
          </h3>
          <div className="mt-6">
            <Ayarlar onek="er-" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="border-2 border-metin p-6" data-denetim={den.ihlal} data-denetim-buyuk={den.buyuk} data-denetim-govde={den.govde}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="kicker">Deney denetimi · canlı</p>
              <Buton onClick={() => setDen(denetle())} data-denetle="">
                Yeniden tara
              </Buton>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <p className="text-[clamp(44px,6vw,84px)] leading-[0.95] tabular-nums" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 100" }} data-say="ihlal">
                  {den.ihlal}
                </p>
                <p className="kicker">32 px altında deneysel ayar</p>
              </div>
              <div>
                <p className="text-[clamp(44px,6vw,84px)] leading-[0.95] tabular-nums" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 100" }} data-say="buyuk">
                  {den.buyuk}
                </p>
                <p className="kicker">Büyük başlıkta değişken ayar</p>
              </div>
              <div>
                <p className="text-[clamp(44px,6vw,84px)] leading-[0.95] tabular-nums" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 100" }} data-say="govde">
                  {den.govde}
                </p>
                <p className="kicker">Bükülmeyen gövde metni</p>
              </div>
            </div>
            <p className="mt-4 text-[14px] text-soluk">
              Okunabilirlik gösterimleri (<span className="font-mono">data-deney</span>) denetimin dışındadır.
            </p>
          </div>
          <div className="mt-6 border-2 border-metin p-6" data-hareket-butce={say.bilesen} data-css-anim={say.css}>
            <p className="kicker">Hareket bütçesi · canlı</p>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <p className="text-[clamp(44px,6vw,84px)] leading-[0.95] tabular-nums" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 100" }} data-bs="bilesen">
                  {hareket ? say.bilesen : 0}
                </p>
                <p className="kicker">Çalışan bileşen</p>
              </div>
              <div>
                <p className="text-[clamp(44px,6vw,84px)] leading-[0.95] tabular-nums" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 100" }} data-bs="css">
                  {say.css}
                </p>
                <p className="kicker">CSS animasyonu</p>
              </div>
              <div>
                <p className="text-[clamp(28px,3vw,44px)] leading-[1.2] tabular-nums" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 60" }} data-bs="kilit">
                  {kilitli ? 'kilitli' : 'serbest'}
                </p>
                <p className="kicker">Eksenler</p>
              </div>
            </div>
            <div className="mt-4">
              <Buton ton={hareket ? 'patlama' : 'cizgi'} onClick={() => document.querySelector<HTMLButtonElement>('[data-durdur]')?.click()} data-erisim-durdur="">
                {hareket ? 'Hareketi durdur' : 'Hareketi başlat'}
              </Buton>
            </div>
          </div>
        </div>

        <div className="lg:col-span-12" data-okunurluk="">
          <p className="kicker">Okunabilirlik gösterimi · aynı cümle, üç kullanım</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="border-2 border-metin p-4" data-ornek="govde">
              <p className="etiket">Gövde · Inter 17 px</p>
              <p className="mt-3 text-[17px]">Değişken yazı tipleri yalnız büyük başlıkta bükülür.</p>
              <p className="etiket mt-4 text-soluk">Okunur. Doğru kullanım.</p>
            </div>
            <div className="border-2 border-dashed border-patlama-yazi p-4" data-ornek="hatali">
              <p className="etiket">Gövde boyunda bükülmüş</p>
              <p data-deney="" className="mt-3 text-[17px]" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 1000, 'wdth' 25, 'slnt' -10, 'opsz' 14" }}>
                Değişken yazı tipleri yalnız büyük başlıkta bükülür.
              </p>
              <p className="etiket mt-4 text-patlama-yazi">Okunmaz. Yapmayın.</p>
            </div>
            <div className="border-2 border-metin p-4" data-ornek="baslik">
              <p className="etiket">Büyük başlık · 48 px</p>
              <p className="mt-3 text-[48px] leading-[0.95]" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 1000, 'wdth' 60, 'slnt' -6, 'opsz' 144" }}>
                Bükülür.
              </p>
              <p className="etiket mt-4 text-soluk">Okunur. Başlıkta olur.</p>
            </div>
          </div>
        </div>

        <ul className="lg:col-span-12" data-kurallar="">
          {KURALLAR.map(([a, b]) => (
            <li key={a} className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-hat py-4 sm:grid-cols-[12rem_1fr]">
              <span className="text-[20px]" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 30" }}>
                {a}
              </span>
              <span className="text-[16.5px] text-soluk">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </Bolum>
  )
}
