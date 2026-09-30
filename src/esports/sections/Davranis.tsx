import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Bolum } from '../components/Bolum'
import { SlantedButton } from '../components/Dugme'
import { Ayarlar } from '../components/Header'
import { EsportsCard } from '../components/Kart'
import { MacTakvimi } from '../components/Takvim'
import { Aralik, Isaret, Secim } from '../components/ui'
import { kontrast as kontrastHesap, oran } from '../lib/contrast'
import { KARBON, MACLAR } from '../lib/data'
import { useEsports } from '../lib/store'

/* ───────────────────────── Madde 16 · Hareket ───────────────────────── */

const HAREKET_TABLO: [string, string, string, string][] = [
  ['Kayan skor şeridi', '34 sn / tur (ayarlanır)', 'linear · sonsuz', 'Kaymaz; skorlar satır satır durağan'],
  ['Skew slide (düğme dilimi)', '260 ms (ayarlanır)', 'cubic-bezier(.2, .85, .2, 1)', 'Dilim anında dolar'],
  ['Skor sayacı', '500 ms', 'ease-out', 'Yeni değer anında'],
  ['Canlı nabzı', '1,2 sn', 'ease-in-out · sonsuz', 'Durağan'],
  ['Skor tablosu satır yanıp sönmesi', '900 ms', 'ease-out', 'Durağan; canlı güncelleme kapalı'],
]

function Sayac({ deger, etiket }: { deger: number; etiket: string }) {
  const { hareket } = useEsports()
  const [g, setG] = useState(deger)
  const son = useRef(deger)
  useEffect(() => {
    if (!hareket) {
      setG(deger)
      son.current = deger
      return
    }
    const bas = son.current
    const t0 = performance.now()
    let kare = 0
    const ad = (t: number) => {
      const u = Math.min(1, (t - t0) / 500)
      setG(Math.round(bas + (deger - bas) * (1 - (1 - u) ** 3)))
      if (u < 1) kare = requestAnimationFrame(ad)
      else son.current = deger
    }
    kare = requestAnimationFrame(ad)
    return () => cancelAnimationFrame(kare)
  }, [deger, hareket])
  return (
    <p className="rakam text-[clamp(2.5rem,7vw,4rem)] leading-none font-black" aria-label={`${etiket} ${deger}`} data-sayac={deger}>
      <span aria-hidden="true" data-sayac-goz={g}>
        {String(g).padStart(2, '0')}
      </span>
    </p>
  )
}

export function Hareket() {
  const { hareket, hareketTercih } = useEsports()
  const [tur, setTur] = useState(34)
  const [egim, setEgim] = useState(12)
  const [sure, setSure] = useState(260)
  const [a, setA] = useState(1)
  const [b, setB] = useState(1)
  const [dilim, setDilim] = useState('kapalı')
  const dugme = useRef<HTMLButtonElement>(null)
  const [olc, setOlc] = useState('')
  useEffect(() => {
    document.documentElement.style.setProperty('--serit-sure', `${tur}s`)
    setOlc(getComputedStyle(document.querySelector('.serit-ray') ?? document.body).animationDuration)
    return () => {
      document.documentElement.style.removeProperty('--serit-sure')
    }
  }, [tur, hareket])
  const olc2 = (ac: boolean) => {
    window.setTimeout(() => {
      const m = /matrix\(([^)]*)\)/.exec(getComputedStyle(dugme.current!, '::before').transform)
      const tx = m ? parseFloat(m[1].split(',')[4]) : 0
      setDilim(ac ? `dolu · ${Math.round(tx)} px` : `kapalı · ${Math.round(tx)} px`)
    }, sure + 80)
  }
  return (
    <Bolum
      id="hareket"
      no="12"
      madde="Madde 16 · Hareket dili"
      baslik="Kayan skor, kayan dilim"
      lead="İki hareket hızın ritmini kurar: sayfanın üstündeki skor şeridi sürekli sola akar, düğmelerin üstüne gelince neon dilim sağa doğru kayar. İkisi de durdurulabilir; hareket kapalıyken skorlar durağan listelenir ve dilim anında dolar."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
        <EsportsCard as="section" aria-label="Skor şeridi" className="p-6" sarmal="lg:col-span-5" data-hareket-serit="">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="t-h3">Skor şeridi</h3>
            <p className="t-etiket t-soluk" data-hareket-durum="">
              Hareket {hareket ? 'açık' : 'durdu'}
            </p>
          </div>
          <p className="mt-3 text-[1.125rem]">Sayfanın üstündeki şerit üzerine gelince ve “Duraklat” ile durur. Tur süresi:</p>
          <div className="mt-4">
            <Aralik id="serit-tur" label="Tur süresi" value={tur} min={10} max={60} onChange={setTur} format={(v) => `${v} sn`} />
          </div>
          <p className="t-alt mt-3">
            Ölçülen animasyon süresi:{' '}
            <span className="rakam" data-serit-olcu={olc}>
              {olc || '—'}
            </span>
          </p>
          <p className="t-alt mt-1">Tercih: {hareketTercih === 'oto' ? 'sisteme uy' : hareketTercih === 'acik' ? 'açık' : 'durdur'}</p>
        </EsportsCard>
        <EsportsCard vurgu="lime" as="section" aria-label="Skew slide düğmesi" className="p-6" sarmal="lg:col-span-7" data-hareket-dugme="">
          <h3 className="t-h3">Skew slide</h3>
          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            <Aralik id="kayma-egim" label="Eğim" value={egim} min={0} max={24} onChange={setEgim} format={(v) => `${v}°`} />
            <Aralik id="kayma-sure" label="Süre" value={sure} min={80} max={600} step={20} onChange={setSure} format={(v) => `${v} ms`} />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
            <SlantedButton ref={dugme} ton="ikincil" ok egim={egim} sure={sure} onPointerEnter={() => olc2(true)} onPointerLeave={() => olc2(false)} onFocus={() => olc2(true)} onBlur={() => olc2(false)} data-kayma-demo="">
              Üstüme gel
            </SlantedButton>
            <p className="t-alt" role="status">
              Dilim:{' '}
              <span className="rakam" data-dilim={dilim}>
                {dilim}
              </span>
            </p>
          </div>
        </EsportsCard>
        <EsportsCard vurgu="turuncu" as="section" aria-label="Skor sayacı" className="p-6" sarmal="lg:col-span-12" data-hareket-sayac="">
          <h3 className="t-h3">Skor sayacı</h3>
          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
            <div>
              <p className="t-etiket t-soluk">Vektör-9</p>
              <Sayac deger={a} etiket="Vektör-9 skoru" />
              <SlantedButton dar ton="birincil" className="mt-4" onClick={() => setA((n) => n + 1)} data-skor-a="">
                Raunt kazan
              </SlantedButton>
            </div>
            <p className="rakam text-[2rem] font-black" aria-hidden="true">
              –
            </p>
            <div>
              <p className="t-etiket t-soluk">Gölge Hattı</p>
              <Sayac deger={b} etiket="Gölge Hattı skoru" />
              <SlantedButton dar ton="turuncu" className="mt-4" onClick={() => setB((n) => n + 1)} data-skor-b="">
                Raunt kazan
              </SlantedButton>
            </div>
          </div>
        </EsportsCard>
      </div>
      <div className="mt-14 overflow-x-auto" role="region" aria-label="Hareket bütçesi, yatay kaydırılabilir" tabIndex={0} data-hareket-tablo="">
        <table className="tablo w-full min-w-[720px]">
          <caption className="t-alt">Hareket bütçesi</caption>
          <thead>
            <tr>
              <th scope="col">Efekt</th>
              <th scope="col">Süre</th>
              <th scope="col">Eğri</th>
              <th scope="col">Hareket kapalıyken</th>
            </tr>
          </thead>
          <tbody>
            {HAREKET_TABLO.map(([x, y, z, t]) => (
              <tr key={x}>
                <th scope="row">{x}</th>
                <td>{y}</td>
                <td className="font-mono text-[0.9375rem]">{z}</td>
                <td>{t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 17 · Mobil ───────────────────────── */

const ON_AYAR = [320, 390, 768, 1024] as const

export function Mobil() {
  const [gen, setGen] = useState(390)
  const sim = useRef<HTMLDivElement>(null)
  const [o, setO] = useState({ sutun: 0, kes: '', tasma: 0, zaman: '' })
  useLayoutEffect(() => {
    const el = sim.current
    if (!el) return
    const oku = () => {
      const akis = el.querySelector<HTMLElement>('.sim-akis')
      const ic = el.querySelector<HTMLElement>('.sim-ic')
      const z = el.querySelector<HTMLElement>('.takvim-zaman')
      setO({
        sutun: akis ? getComputedStyle(akis).gridTemplateColumns.split(' ').length : 0,
        kes: ic ? getComputedStyle(ic).getPropertyValue('--kes').trim() : '',
        tasma: Math.max(0, el.scrollWidth - el.clientWidth),
        zaman: z ? getComputedStyle(z).display : '',
      })
    }
    oku()
    const ro = new ResizeObserver(oku)
    ro.observe(el)
    return () => ro.disconnect()
  }, [gen])
  return (
    <Bolum
      id="mobil"
      no="13"
      madde="Madde 17 · Duyarlı kurallar"
      baslik="Dikey akış, sıkı kırpma"
      lead="640 pikselin altında yan yana dizilmiş açılı paneller dikey akar, kesim boyutu küçülür, zaman çizelgesinin saat kolonu kartın içine taşınır ve bütün kartlar taşmayı kırpar. Kural ekrana değil kapsayıcıya bağlıdır; aşağıdaki simülatör aynı davranır."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="grid grid-cols-1 content-start gap-6 lg:col-span-4">
          <Aralik id="mobil-gen" label="Cihaz genişliği" value={gen} min={320} max={1024} step={1} onChange={setGen} format={(v) => `${v} px`} />
          <Secim<string> legend="Hazır genişlikler" name="mobil-on" value={String(gen)} onChange={(v) => setGen(+v)} options={ON_AYAR.map((n) => ({ id: String(n), ad: `${n}` }))} />
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2" data-mobil-olcum="">
            <dt className="t-etiket t-soluk">Düzen</dt>
            <dd className="m-0 font-bold" data-mobil-duzen={o.sutun}>
              <span className="rakam">{o.sutun}</span> {o.sutun > 1 ? 'sütun · yan yana' : 'sütun · dikey'}
            </dd>
            <dt className="t-etiket t-soluk">Kesim</dt>
            <dd className="rakam m-0 font-bold" data-mobil-kes={o.kes}>
              {o.kes}
            </dd>
            <dt className="t-etiket t-soluk">Taşma</dt>
            <dd className="rakam m-0 font-bold" data-mobil-tasma={o.tasma}>
              {o.tasma} px
            </dd>
            <dt className="t-etiket t-soluk">Saat kolonu</dt>
            <dd className="m-0 font-bold" data-mobil-zaman={o.zaman}>
              {o.zaman === 'none' ? 'kartın içinde' : 'solda'}
            </dd>
          </dl>
        </div>
        <div className="min-w-0 lg:col-span-8">
          <div className="overflow-x-auto pb-3 pt-3" role="region" aria-label="Cihaz simülatörü, yatay kaydırılabilir" tabIndex={0} data-mobil-kap="">
            <div ref={sim} className="sim mx-auto overflow-clip" style={{ width: gen } as CSSProperties} data-mobil-sim="">
              <div className="sim-ic grid grid-cols-1 gap-6">
                <div className="sim-akis">
                  {[
                    ['Skor', '1–1', 'mavi'],
                    ['Raunt', '9 / 16', 'lime'],
                    ['İzleyici', '18,4B', 'turuncu'],
                  ].map(([a, b, v]) => (
                    <EsportsCard key={a} vurgu={v as 'mavi'} className="p-4">
                      <p className="t-etiket t-soluk">{a}</p>
                      <p className="rakam mt-1 text-[1.5rem] font-bold">{b}</p>
                    </EsportsCard>
                  ))}
                </div>
                <MacTakvimi maclar={MACLAR.slice(1, 4)} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 overflow-x-auto" role="region" aria-label="Duyarlı kurallar, yatay kaydırılabilir" tabIndex={0}>
        <table className="tablo w-full min-w-[680px]">
          <caption className="t-alt">Duyarlı kurallar</caption>
          <thead>
            <tr>
              <th scope="col">Genişlik</th>
              <th scope="col">Paneller</th>
              <th scope="col">Kesim</th>
              <th scope="col">Zaman çizelgesi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">640 px ve üstü</th>
              <td>Yan yana, üç kolona kadar</td>
              <td>22 px kesik köşe, 16 px eğim</td>
              <td>Saat solda, düğüm ortada, kart sağda</td>
            </tr>
            <tr>
              <th scope="row">640 px altı</th>
              <td>Dikey akış, tek sütun</td>
              <td>12 px kesik köşe, 8 px eğim; düğmelerde skew kalkar</td>
              <td>Saat kartın içine taşınır</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 18 · Erişim ───────────────────────── */

const VARYANT = [
  { ad: 'Mavi', v: 'mavi' as const, yazi: '#00f0ff', dolgu: '#00f0ff' },
  { ad: 'Lime', v: 'lime' as const, yazi: '#39ff14', dolgu: '#39ff14' },
  { ad: 'Turuncu', v: 'turuncu' as const, yazi: '#ff8f5f', dolgu: '#ff7440' },
]

interface Bulgu {
  ad: string
  deger: string
  gecti: boolean
}

function denetle(hareket: boolean): Bulgu[] {
  const goruluyor = (e: Element) => {
    const r = e.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && !e.closest('[aria-hidden="true"]') && !e.closest('.sr-only')
  }
  const hedefler = [...document.querySelectorAll<HTMLElement>('.bt, .cip, [role="switch"], .nav-a, .lb th button, .tablo th button')].filter(goruluyor)
  const enKucuk = hedefler.reduce((m, e) => {
    const r = e.getBoundingClientRect()
    return Math.min(m, r.width, r.height)
  }, Infinity)
  const adsiz = [...document.querySelectorAll<HTMLElement>('button, a[href]')].filter((b) => !(b.getAttribute('aria-label') || b.getAttribute('aria-labelledby') || b.textContent?.trim() || (b as HTMLButtonElement).labels?.length)).length
  const resimler = [...document.querySelectorAll('img:not([alt]), svg[role="img"]:not([aria-label])')].length
  const cs = getComputedStyle(document.documentElement)
  const odak = cs.getPropertyValue('--odak').trim()
  const oranOdak = kontrastHesap(odak, KARBON)
  const govde = getComputedStyle(document.querySelector('main .lead') ?? document.body).transform
  const durdur = !hareket || !!document.querySelector('[data-serit-dur]')
  return [
    { ad: 'En küçük dokunma hedefi', deger: `${Math.round(enKucuk)} px (${hedefler.length} öğe)`, gecti: enKucuk >= 44 },
    { ad: 'Adsız düğme ya da bağlantı', deger: String(adsiz), gecti: adsiz === 0 },
    { ad: 'Alt metinsiz görsel', deger: String(resimler), gecti: resimler === 0 },
    { ad: 'Kayan şeridi durduran denetim', deger: hareket ? (durdur ? 'Duraklat düğmesi var' : 'yok') : 'hareket kapalı: durağan liste', gecti: durdur },
    { ad: 'Gövde metni eğimi', deger: govde === 'none' ? 'yok' : govde, gecti: govde === 'none' },
    { ad: `Odak halkası ${odak} / karbon`, deger: oran(oranOdak), gecti: oranOdak >= 3 },
  ]
}

export function Erisim() {
  const [bulgular, setBulgular] = useState<Bulgu[] | null>(null)
  const { duyur, kontrast, hareket } = useEsports()
  const y = kontrast === 'yuksek'
  const m = y ? '#ffffff' : '#f2f6fa'
  const s = y ? '#e6edf5' : '#b4c0cf'
  return (
    <Bolum
      id="erisim"
      no="14"
      madde="Madde 18 · Erişilebilirlik ve varyantlar"
      baslik="Neon, karbonun üstünde"
      lead="Neon mavi ve yeşil koyu karbon zeminde 13:1'in üstünde kontrast verir; turuncu küçük metinde açık tonuyla kullanılır. Kontrast oranları hesaplanarak gösterilir. Vurgu rengi, kontrast, açılar, doku ve hareket ayarları burada da değişir."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
        <EsportsCard as="section" aria-label="Görünüm ayarları" className="p-6" sarmal="lg:col-span-5" data-erisim-ayarlar="">
          <h3 className="t-h3">Ayarlar</h3>
          <div className="mt-5">
            <Ayarlar onek="er-" />
          </div>
        </EsportsCard>
        <div className="grid grid-cols-1 content-start gap-10 lg:col-span-7">
          <div data-varyantlar="">
            <p className="t-etiket t-soluk mb-3">Üç vurgu · metin ve dolgu kontrastı</p>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {VARYANT.map((v) => (
                <li key={v.ad} className="varyant" data-v={v.v} data-varyant={v.ad} style={{ borderLeftColor: v.dolgu }}>
                  <p className="t-etiket">{v.ad}</p>
                  <p className="mt-2 text-[1.125rem]" style={{ color: m }}>
                    Metin <span className="rakam">{oran(kontrastHesap(m, KARBON))}</span>
                  </p>
                  <p className="text-[1.0625rem]" style={{ color: s }}>
                    İkincil <span className="rakam">{oran(kontrastHesap(s, KARBON))}</span>
                  </p>
                  <p className="text-[1.0625rem] font-bold" style={{ color: v.yazi }}>
                    Vurgu <span className="rakam">{oran(kontrastHesap(v.yazi, KARBON))}</span>
                  </p>
                  <p className="mt-2 inline-block px-3 py-0.5 text-[1.0625rem] font-bold" style={{ background: v.dolgu, color: KARBON }}>
                    Dolgu <span className="rakam">{oran(kontrastHesap(KARBON, v.dolgu))}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <EsportsCard vurgu="lime" as="section" aria-label="Canlı denetim" className="p-6" data-denetim="">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="t-h3">Canlı denetim</h3>
                <p className="t-alt mt-1">Şu an sayfada görünen öğeleri ölçer.</p>
              </div>
              <SlantedButton
                ton="birincil"
                onClick={() => {
                  const bl = denetle(hareket)
                  setBulgular(bl)
                  duyur(`Denetim tamamlandı: ${bl.filter((x) => x.gecti).length} / ${bl.length} geçti`)
                }}
                data-denetle=""
              >
                Denetimi çalıştır
              </SlantedButton>
            </div>
            {bulgular ? (
              <ul className="mt-5 grid gap-2" data-denetim-sonuc="" role="status">
                {bulgular.map((b) => (
                  <li key={b.ad} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[color:rgb(242_246_250/0.2)] pb-2" data-bulgu={b.gecti ? 'gecti' : 'kaldi'}>
                    <span>{b.ad}</span>
                    <span className="rakam font-bold">
                      {b.deger} · <Isaret gecti={b.gecti} />
                      {b.gecti ? 'Geçti' : 'Kaldı'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </EsportsCard>
        </div>
      </div>
      <ul className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" data-erisim-liste="">
        {[
          ['Klavye', 'Tüm düğmeler, sekmeler, sıralama başlıkları ve formlar klavyeyle çalışır. Odak halkası 3 piksel, vurgu renginde; kesik köşe odak halkasını kırpmaz. Sayfanın başında “İçeriğe geç” bağlantısı var.'],
          ['Ekran okuyucu', 'Skor şeridi bir liste olarak okunur, ikinci kopyası gizlidir. Tablolar gerçek tablodur; sütun başlıkları aria-sort taşır. Canlı maç aria-current="step" ile işaretlidir. Sohbet akışı duyurulmaz.'],
          ['Hareket', 'Kayan şerit üzerine gelince ve Duraklat ile durur (WCAG 2.2.2). Sistem “hareketi azalt” dediğinde ya da ayardan durdurulduğunda şerit kaymaz, dilim anında dolar.'],
          ['Renk körlüğü', 'Maç durumu yalnız renkle söylenmez: Bitti, Canlı, Yakında yazısı ve farklı düğüm rengi birlikte verilir. Galibiyet ve mağlubiyet serileri G ve M harfini taşır.'],
          ['Eğik yazı', 'Yalnız başlıklar ve etiketler hafifçe eğilir; gövde metni hiç eğilmez. Düğme yazısı düğmenin tersi yönde eğilerek düz okunur. “Düz” ayarı bütün açıları kaldırır.'],
          ['Kontrast', 'Metin karbon üstünde 7:1’in çok üstünde; turuncu küçük metinde açık tonuyla. Yüksek kontrast dokuyu kapatır ve renkleri saf uçlara çeker. Sayfa gerçek piksellerle taranır.'],
        ].map(([b, t]) => (
          <li key={b}>
            <EsportsCard kesim="egik" vurgu={b === 'Hareket' ? 'turuncu' : b === 'Renk körlüğü' ? 'lime' : 'mavi'} as="article" className="p-5" sarmal="h-full">
              <h3 className="t-h3 !text-[1.25rem]">{b}</h3>
              <p className="mt-2 text-[1.125rem]">{t}</p>
            </EsportsCard>
          </li>
        ))}
      </ul>
    </Bolum>
  )
}
