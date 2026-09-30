import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Bolum } from '../components/Bolum'
import { Ayarlar } from '../components/Header'
import { Ikon } from '../components/Ikon'
import { Sandik } from '../components/Sandik'
import { Panel } from '../components/Suslu'
import { Aralik, Buton, Isaret, Secim } from '../components/ui'
import { kontrast as kontrastHesap, oran } from '../lib/contrast'
import { ESYALAR } from '../lib/data'
import { useOyun } from '../lib/oyun'
import { useFantasy } from '../lib/store'
import { useYaldiz, yaldizAyar, yaldizDurum } from '../lib/yaldiz'

/* ───────────────────────── Madde 16 · Hareket ───────────────────────── */

const HAREKET_TABLO: [string, string, string, string][] = [
  ['Sandık kapağı', '340 ms (dış) + 420 ms (iç, 320 ms gecikmeli)', 'ease-in · ease-out', 'Sandık anında açık'],
  ['Parşömen açılışı', '820 ms · kapanış 420 ms', 'cubic-bezier(.22, .8, .24, 1)', 'Pencere anında belirir'],
  ['Çubuk dolumu', '500 ms · hasar izi 700 ms (500 ms gecikmeli)', 'cubic-bezier(.3, .8, .3, 1)', 'Anında yeni değer'],
  ['Ganimet yükselişi', '420 ms', 'cubic-bezier(.2, .9, .3, 1.2)', 'Anında görünür'],
  ['Altın yaldız', '0,55 – 1,15 sn · en çok 240 parça', 'yerçekimi 900 px/sn²', 'Hiç çalışmaz'],
]

export function Hareket() {
  const { hareket, yaldizAcik } = useFantasy()
  const { setGorevAcik } = useOyun()
  const [adet, setAdet] = useState(yaldizAyar.adet)
  const [yer, setYer] = useState(yaldizAyar.yercekimi)
  const [hiz, setHiz] = useState(yaldizAyar.hiz)
  const [say, setSay] = useState({ ...yaldizDurum })
  const { patlat } = useYaldiz()
  useEffect(() => {
    const t = window.setInterval(() => setSay({ ...yaldizDurum }), 250)
    return () => window.clearInterval(t)
  }, [])
  return (
    <Bolum
      id="hareket"
      no="12"
      madde="Madde 16 · Hareket dili"
      baslik="Kapak açılır, parşömen serilir"
      lead="Üç hareket oyunun ritmini kurar: sandığın kapağı menteşesinde kalkar, parşömen ortadan iki yana açılır, her tıklamada altın yaldız parçaları saçılır. Sistem ya da sayfa hareketi kapattığında üçü de anında sonuçlanır."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
        <Panel yuzey="tas" className="p-6 lg:col-span-5" as="section" aria-label="Sandık" data-hareket-sandik="">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="t-h3">Sandık</h3>
            <p className="t-etiket t-soluk" data-hareket-durum="">
              Hareket {hareket ? 'açık' : 'durdu'}
            </p>
          </div>
          <div className="mt-4">
            <Sandik />
          </div>
        </Panel>
        <div className="grid content-start gap-10 lg:col-span-7">
          <Panel yuzey="parsomen" className="p-6" as="section" aria-label="Parşömen açılışı">
            <div className="flex items-start gap-4">
              <Ikon ad="parsomen" boy={52} />
              <div className="min-w-0">
                <h3 className="t-h3">Parşömen açılışı</h3>
                <p className="mt-2 text-[1.0625rem]">Üstteki ve alttaki rulo yerinde durur; aradaki kâğıt ortadan dışarı doğru açılır. Kapanırken tersi olur.</p>
              </div>
            </div>
            <Buton className="mt-4" ton="altin" ikon="parsomen" onClick={() => setGorevAcik(true)} data-hareket-rulo="">
              Parşömeni aç
            </Buton>
          </Panel>
          <Panel yuzey="tas" className="p-6" as="section" aria-label="Altın yaldız" data-yaldiz-panel="">
            <h3 className="t-h3">Altın yaldız</h3>
            <p className="mt-2 text-[1.0625rem]">Her düğmeye basışta tıklanan noktadan küçük bir yaldız patlaması çıkar. Klavyeyle basınca patlama düğmenin merkezinden çıkar.</p>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Aralik
                id="yaldiz-adet"
                label="Parça sayısı"
                value={adet}
                min={4}
                max={40}
                onChange={(v) => {
                  yaldizAyar.adet = v
                  setAdet(v)
                }}
              />
              <Aralik
                id="yaldiz-yer"
                label="Yerçekimi"
                value={yer}
                min={300}
                max={1600}
                step={50}
                onChange={(v) => {
                  yaldizAyar.yercekimi = v
                  setYer(v)
                }}
                format={(v) => `${v} px/sn²`}
              />
              <Aralik
                id="yaldiz-hiz"
                label="Saçılma hızı"
                value={hiz}
                min={0.5}
                max={2}
                step={0.1}
                onChange={(v) => {
                  yaldizAyar.hiz = v
                  setHiz(v)
                }}
                format={(v) => `${v.toFixed(1).replace('.', ',')}×`}
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Buton ton="altin" ikon="mucevher" data-yaldiz-sac="">
                Yaldız saçtır
              </Buton>
              <Buton
                ton="yalin"
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  patlat(r.left + r.width / 2, r.top + r.height / 2, adet * 3)
                }}
                data-yaldiz-buyuk=""
                data-sessiz=""
              >
                Büyük patlama
              </Buton>
              <p className="rakam t-alt" data-yaldiz-sayac="" role="status">
                Canlı parça {say.canli} · toplam {say.toplam} · patlama {say.patlama}
              </p>
            </div>
            {!yaldizAcik ? <p className="t-alt mt-3">Yaldız şu an kapalı: hareket durdurulmuş ya da parçacık ayarı kapalı.</p> : null}
          </Panel>
        </div>
      </div>
      <div className="mt-14 overflow-x-auto" role="region" aria-label="Hareket bütçesi, yatay kaydırılabilir" tabIndex={0} data-hareket-tablo="">
        <table className="tablo w-full min-w-[720px] border-collapse">
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
            {HAREKET_TABLO.map(([a, b, c, d]) => (
              <tr key={a}>
                <th scope="row">{a}</th>
                <td>{b}</td>
                <td className="font-mono text-[0.875rem]">{c}</td>
                <td>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 17 · Mobil ───────────────────────── */

const SIM_YUVA = [...ESYALAR.slice(0, 12), ...Array.from({ length: 6 }, () => null)]
const ON_AYAR = [320, 390, 768, 1024] as const

export function Mobil() {
  const [gen, setGen] = useState(390)
  const sim = useRef<HTMLDivElement>(null)
  const [o, setO] = useState({ kose: 0, sutun: 0, yuva: 0 })
  useLayoutEffect(() => {
    const el = sim.current
    if (!el) return
    const oku = () => {
      const izgara = el.querySelector<HTMLElement>('.envanter')
      const s = el.querySelector<HTMLElement>('.slot')
      const kose = [...el.querySelectorAll<HTMLElement>('.suslu-kose')].filter((k) => getComputedStyle(k).display !== 'none').length
      setO({ kose, sutun: izgara ? getComputedStyle(izgara).gridTemplateColumns.split(' ').length : 0, yuva: Math.round((s?.getBoundingClientRect().width ?? 0) * 10) / 10 })
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
      baslik="Dar ekranda sadeleşen süs"
      lead="640 pikselin altında filigree köşeleri kapanır, çerçeve ve iç çizgi kalır; envanter yuvaları 44 piksele iner ve ızgara ekrana sığacak kadar sütunla dizilir. Kural ekran değil kapsayıcı genişliğine bağlı olduğu için aşağıdaki simülatör de aynı davranır."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="grid content-start gap-6 lg:col-span-4">
          <Aralik id="mobil-gen" label="Cihaz genişliği" value={gen} min={320} max={1024} step={1} onChange={setGen} format={(v) => `${v} px`} />
          <Secim<string> legend="Hazır genişlikler" name="mobil-on" value={String(gen)} onChange={(v) => setGen(+v)} options={ON_AYAR.map((n) => ({ id: String(n), ad: `${n}` }))} />
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2" data-mobil-olcum="">
            <dt className="t-etiket t-soluk">Süsleme</dt>
            <dd className="m-0 font-semibold" data-mobil-suslenme="">
              {o.kose > 0 ? 'Tam' : 'Sade'} · <span className="rakam">{o.kose}</span> köşe
            </dd>
            <dt className="t-etiket t-soluk">Izgara</dt>
            <dd className="m-0 font-semibold" data-mobil-izgara="">
              <span className="rakam">{o.sutun}</span> sütun
            </dd>
            <dt className="t-etiket t-soluk">Yuva</dt>
            <dd className="m-0 font-semibold" data-mobil-yuva="">
              <span className="rakam">{o.yuva}</span> px
            </dd>
          </dl>
        </div>
        <div className="min-w-0 lg:col-span-8">
          <div className="overflow-x-auto pb-3 pt-3" role="region" aria-label="Cihaz simülatörü, yatay kaydırılabilir" tabIndex={0} data-mobil-kap="">
            <div ref={sim} className="sim mx-auto" style={{ width: gen }} data-mobil-sim="">
              <Panel yuzey="tas" className="sim-ic" as="div">
                <p className="t-etiket t-soluk">Sırt çantası · örnek</p>
                <ul className="envanter mt-3" aria-hidden="true" data-sim-envanter="">
                  {SIM_YUVA.map((e, i) => (
                    <li key={i} className="slot" data-dolu={e ? '' : undefined} data-nadirlik={e?.nadirlik}>
                      {e ? <Ikon ad={e.ikon} boy="72%" className="slot-ikon" /> : null}
                    </li>
                  ))}
                </ul>
                <p className="t-alt mt-3">Simülatör yalnızca görünümü gösterir; yuvalar burada etkileşimsizdir.</p>
              </Panel>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 overflow-x-auto" role="region" aria-label="Duyarlı kurallar, yatay kaydırılabilir" tabIndex={0}>
        <table className="tablo w-full min-w-[640px] border-collapse">
          <caption className="t-alt">Duyarlı kurallar</caption>
          <thead>
            <tr>
              <th scope="col">Genişlik</th>
              <th scope="col">Süsleme</th>
              <th scope="col">Envanter yuvası</th>
              <th scope="col">Parşömen penceresi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">640 px ve üstü</th>
              <td>Tam: dört filigree köşesi, iç çizgi, gradyan kenar</td>
              <td>En az 56 px, sütun sayısı genişlikle artar</td>
              <td>Ortada, en çok 640 px</td>
            </tr>
            <tr>
              <th scope="row">640 px altı</th>
              <td>Sade: köşe süsleri kapanır, çerçeve ve iç çizgi kalır</td>
              <td>En az 44 px (dokunma hedefi), ekrana sığar</td>
              <td>Kenar boşluğu bırakarak tam genişlik</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 18 · Erişim ───────────────────────── */

const VARYANT = [
  { ad: 'Zindan · Normal', zemin: '#1e1e24', m: '#f4ecd8', s: '#c9bfa8', b: '#e6c55a' },
  { ad: 'Zindan · Yüksek', zemin: '#1e1e24', m: '#ffffff', s: '#e8e2d0', b: '#ffe07a' },
  { ad: 'Parşömen · Normal', zemin: '#e9ddb8', m: '#2b1d0e', s: '#33240f', b: '#4d0c0c' },
  { ad: 'Parşömen · Yüksek', zemin: '#f4ecd0', m: '#000000', s: '#2b1d0e', b: '#3d0000' },
]

interface Bulgu {
  ad: string
  deger: string
  gecti: boolean
}

function denetle(): Bulgu[] {
  const goruluyor = (e: Element) => {
    const r = e.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && !e.closest('[aria-hidden="true"]') && !e.closest('.sr-only')
  }
  const hedefler = [...document.querySelectorAll<HTMLElement>('.dugme, .slot, [role="switch"], .cip, .rulo-kapat, .okuyucu-bolum')].filter(goruluyor)
  const enKucuk = hedefler.reduce((m, e) => {
    const r = e.getBoundingClientRect()
    return Math.min(m, r.width, r.height)
  }, Infinity)
  const cubuklar = [...document.querySelectorAll('[role="progressbar"]')]
  const tam = cubuklar.filter((c) => c.hasAttribute('aria-valuenow') && c.hasAttribute('aria-valuemax') && c.hasAttribute('aria-label')).length
  const adsiz = [...document.querySelectorAll<HTMLElement>('button, a[href]')].filter((b) => !(b.getAttribute('aria-label') || b.getAttribute('aria-labelledby') || b.textContent?.trim() || (b as HTMLButtonElement).labels?.length)).length
  const resimler = [...document.querySelectorAll('img:not([alt]), svg[role="img"]:not([aria-label])')].length
  const cs = getComputedStyle(document.documentElement)
  const odak = cs.getPropertyValue('--odak').trim()
  const zemin = cs.getPropertyValue('--zemin').trim()
  const oranOdak = kontrastHesap(odak, zemin)
  return [
    { ad: 'En küçük dokunma hedefi', deger: `${Math.round(enKucuk)} px (${hedefler.length} öğe)`, gecti: enKucuk >= 44 },
    { ad: 'Adı olan ilerleme çubukları', deger: `${tam} / ${cubuklar.length}`, gecti: tam === cubuklar.length },
    { ad: 'Adsız düğme ya da bağlantı', deger: String(adsiz), gecti: adsiz === 0 },
    { ad: 'Alt metinsiz görsel', deger: String(resimler), gecti: resimler === 0 },
    { ad: `Odak halkası ${odak} / sayfa zemini`, deger: oran(oranOdak), gecti: oranOdak >= 3 },
  ]
}

export function Erisim() {
  const [bulgular, setBulgular] = useState<Bulgu[] | null>(null)
  const { duyur } = useFantasy()
  return (
    <Bolum
      id="erisim"
      no="14"
      madde="Madde 18 · Erişilebilirlik ve varyantlar"
      baslik="Taşın üstünde altın ve beyaz"
      lead="Koyu taş zeminde parşömen beyazı ve açık altın kullanılır; parlak paletin kendisi metinde kullanılmaz. Yüksek kontrast varyantı dokuyu kapatır ve renkleri saf uçlara çeker. Zemin, kontrast, süsleme ve hareket ayarları burada da değişir."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
        <Panel yuzey="tas" className="p-6 lg:col-span-5" as="section" aria-label="Görünüm ayarları" data-erisim-ayarlar="">
          <h3 className="t-h3">Ayarlar</h3>
          <div className="mt-5">
            <Ayarlar onek="er-" />
          </div>
        </Panel>
        <div className="grid content-start gap-10 lg:col-span-7">
          <div data-varyantlar="">
            <p className="t-etiket t-soluk mb-3">Dört varyant · metin ve zemin kontrastı</p>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {VARYANT.map((v) => (
                <li key={v.ad} className="varyant" style={{ background: v.zemin, color: v.m }} data-varyant={v.ad}>
                  <p className="t-etiket">{v.ad}</p>
                  <p className="mt-2 text-[1.125rem]">
                    Gövde metni <span className="rakam">{oran(kontrastHesap(v.m, v.zemin))}</span>
                  </p>
                  <p className="text-[1.0625rem]" style={{ color: v.s }}>
                    İkincil metin <span className="rakam">{oran(kontrastHesap(v.s, v.zemin))}</span>
                  </p>
                  <p className="text-[1.0625rem] font-semibold" style={{ color: v.b }}>
                    Vurgu <span className="rakam">{oran(kontrastHesap(v.b, v.zemin))}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <Panel yuzey="parsomen" className="p-6" as="section" aria-label="Canlı denetim" data-denetim="">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="t-h3">Canlı denetim</h3>
                <p className="t-alt mt-1">Şu an sayfada görünen öğeleri ölçer.</p>
              </div>
              <Buton
                ton="altin"
                onClick={() => {
                  const b = denetle()
                  setBulgular(b)
                  duyur(`Denetim tamamlandı: ${b.filter((x) => x.gecti).length} / ${b.length} geçti`)
                }}
                data-denetle=""
              >
                Denetimi çalıştır
              </Buton>
            </div>
            {bulgular ? (
              <ul className="mt-5 grid gap-2" data-denetim-sonuc="" role="status">
                {bulgular.map((b) => (
                  <li key={b.ad} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[color:rgba(43,29,14,0.3)] pb-2" data-bulgu={b.gecti ? 'gecti' : 'kaldi'}>
                    <span>{b.ad}</span>
                    <span className="rakam font-semibold">
                      {b.deger} · <Isaret gecti={b.gecti} />
                      {b.gecti ? 'Geçti' : 'Kaldı'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Panel>
        </div>
      </div>
      <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-erisim-liste="">
        {[
          ['Klavye', 'Tüm düğmeler, yuvalar ve pencere klavyeyle çalışır. Envanterde ok tuşları gezer, Enter eşyayı alır ve bırakır, Esc vazgeçer. Sayfanın başında “İçeriğe geç” bağlantısı var.'],
          ['Ekran okuyucu', 'Çubuklar progressbar, envanter listbox, pencere dialog rolündedir. Eşya taşıma, kullanma ve satma işlemleri canlı bölgeden duyurulur.'],
          ['Renk körlüğü', 'Nadirlik yalnız renkle söylenmez: adı yazıyla, eşya ise kendi çizimiyle ayrılır. Çubukların değeri sayıyla da yazılır.'],
          ['Hareket', 'Sistem “hareketi azalt” dediğinde ya da ayardan durdurulduğunda hiçbir animasyon oynamaz; sandık ve pencere son hâline anında gelir.'],
          ['Doku', 'Doku yalnızca koyulaştırır ve yüksek kontrastta tamamen kapanır. Metin hiçbir zaman dokuyla yarışmaz.'],
          ['Odak', 'Odak halkası üç piksel, açık altın; parşömende koyu kan kırmızısı. Sayfa zeminiyle en az 3:1 kontrast taşır.'],
        ].map(([b, m]) => (
          <li key={b}>
            <Panel yuzey="tas" suslu={false} className="h-full p-5" as="article">
              <h3 className="t-h3 !text-[1.25rem]">{b}</h3>
              <p className="mt-2 text-[1.0625rem]">{m}</p>
            </Panel>
          </li>
        ))}
      </ul>
    </Bolum>
  )
}
