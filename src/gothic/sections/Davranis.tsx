import { useEffect, useRef, useState } from 'react'
import { BloodProgressBar } from '../components/BloodProgressBar'
import { Bolum } from '../components/Bolum'
import { Dugme } from '../components/Dugme'
import { GothicCard } from '../components/GothicCard'
import { GothicModal } from '../components/GothicModal'
import { Ayarlar } from '../components/Header'
import { useDokuTepe, useOlc, useSay } from '../components/hooks'
import { Muhur } from '../components/Muhur'
import { Anahtar, Aralik, Isaret, Secim } from '../components/ui'
import { kontrast as krn, oran } from '../lib/contrast'
import { SADE_ESIGI, useGothic, type HareketTercih } from '../lib/store'

/* ───────── Madde 16: hareket ───────── */

export function Hareket() {
  const { hareket, hareketTercih, setHareketTercih } = useGothic()
  const [sure, setSure] = useState(900)
  const [modal, setModal] = useState(false)
  const modalDugme = useRef<HTMLButtonElement>(null)
  const [guc, setGuc] = useState(85)
  const [hiz, setHiz] = useState(4.3)
  const [oyna, setOyna] = useState(true)
  const [aci, setAci] = useState(0.7)
  const [dc, setDc] = useState(1)
  return (
    <Bolum id="hareket" no="12" madde="Madde 16 · Hareket dili" baslik="Yavaş, ağır, uğursuz" lead="Pencereler ağır bir zincirle iner, mum ışığı düzensiz titrer, kan damlaları acele etmez. Hiçbir hareket hızlı ya da neşeli değildir; hepsi durdurulabilir.">
      <div className="mb-12 max-w-[420px]">
        <Secim<HareketTercih>
          legend={`Hareket · şu an ${hareket ? 'açık' : 'durdu'}`}
          name="hareket-lab"
          value={hareketTercih}
          onChange={setHareketTercih}
          options={[
            { id: 'oto', ad: 'Sisteme uy' },
            { id: 'acik', ad: 'Açık' },
            { id: 'kapali', ad: 'Durdur' },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2" data-hareket-lab="">
        <GothicCard kemer="duz" yuzey="tas" as="section" aria-label="Pencere açılışı" data-lab="acilis">
          <h3 className="t-h3">Pencerenin açılışı</h3>
          <p className="t-alt mt-2">Kemerli pencere ekranın üstünden iner, önce karanlıktan sıyrılır, sonra netleşir.</p>
          <div className="mt-6 grid gap-6">
            <Aralik label="Açılış süresi" value={sure} min={400} max={1800} step={100} onChange={setSure} format={(v) => `${v} ms`} />
            <p className="rakam t-alt">
              Perde {sure} ms · pencere {sure} ms · kapanış 460 ms · eğri cubic-bezier(0,16, 0,8, 0,28, 1)
            </p>
            <div>
              <Dugme ref={modalDugme} onClick={() => setModal(true)} data-acilis-dene="">
                Pencereyi aç
              </Dugme>
            </div>
          </div>
        </GothicCard>
        <GothicModal acik={modal} onAcikDegisti={setModal} baslik="Sessizlik" aciklama={`Bu pencere ${sure} ms'de açıldı.`} sure={sure} yuzey="tas" donusRef={modalDugme}>
          <div className="flex items-center gap-6">
            <Muhur ikon="can" boy={84} baslik="Çan mührü" />
            <p className="t-alt">Yavaş açılış merak uyandırır; hızlı açılış tehdidi kaçırır.</p>
          </div>
        </GothicModal>

        <GothicCard
          kemer="duz"
          yuzey="kadife"
          as="section"
          aria-label="Mum titremesi"
          data-lab="mum"
          style={{
            ['--sizinti-guc' as string]: guc / 100,
            ['--titre-sure' as string]: `${hiz}s`,
            ['--titre-durum' as string]: oyna ? 'running' : 'paused',
          }}
        >
          <div className="flex items-start gap-6">
            <div className="mum" aria-hidden="true">
              <span className="mum-alev" />
              <span className="mum-govde" />
              <span className="mum-taban" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="t-h3">Mum titremesi</h3>
              <p className="t-alt mt-2">Işık ve alev aynı döngüyü izler; kart ışığı düzensiz oynar.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-6">
            <Aralik label="Işık gücü" value={guc} min={20} max={100} step={5} onChange={setGuc} format={(v) => `%${v}`} />
            <Aralik label="Döngü süresi" value={hiz} min={1.5} max={8} step={0.5} onChange={setHiz} format={(v) => `${v.toFixed(1).replace('.', ',')} sn`} />
            <Anahtar label="Titreme" hint="Kapatınca döngü durur, ışık sabit kalır." checked={oyna} onChange={setOyna} />
          </div>
        </GothicCard>

        <GothicCard kemer="duz" yuzey="demir" as="section" aria-label="Kan damlaları" data-lab="damla" style={{ ['--dc' as string]: dc }}>
          <h3 className="t-h3">Kan damlaları</h3>
          <p className="t-alt mt-2">Damla önce şişer, ağırlaşır, sonra kopar. Döngü altı ile dokuz saniye arasında değişir.</p>
          <div className="mt-6">
            <BloodProgressBar etiket="Kayıt yükleniyor" deger={58} />
          </div>
          <div className="mt-10 grid gap-6">
            <Aralik label="Damla temposu" value={dc} min={0.5} max={2} step={0.25} onChange={setDc} format={(v) => (v === 1 ? 'Normal' : v < 1 ? `${(1 / v).toFixed(1).replace('.', ',')}× hızlı` : `${v.toFixed(2).replace('.', ',')}× yavaş`)} />
          </div>
        </GothicCard>

        <GothicCard kemer="sivri" zincir="asili" sallan yuzey="deri" as="section" aria-label="Zincir salınımı" sarmal="self-start" data-lab="sallan" style={{ ['--sallan-aci' as string]: `${aci}deg` }}>
          <h3 className="t-h3">Sarkaç salınımı</h3>
          <p className="t-alt mt-2">Kart zincirlerinde sekiz saniyede bir yön değiştirir.</p>
          <div className="mt-6">
            <Aralik label="Salınım açısı" value={aci} min={0} max={3} step={0.1} onChange={setAci} format={(v) => `${v.toFixed(1).replace('.', ',')}°`} />
          </div>
        </GothicCard>
      </div>

      <div className="mt-20">
        <h3 className="t-h3">Hareket dili</h3>
        <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Hareket tablosu">
          <table className="tablo w-full min-w-[680px]">
            <thead>
              <tr>
                <th scope="col">Hareket</th>
                <th scope="col">Süre</th>
                <th scope="col">Eğri</th>
                <th scope="col">Amaç</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Pencere açılışı', '900 ms', 'cubic-bezier(0,16, 0,8, 0,28, 1)', 'Ağır iniş'],
                ['Pencere kapanışı', '460 ms', 'ease-in', 'Sessiz çekilme'],
                ['Mum titremesi', '4,3 sn', 'doğrusal, düzensiz duraklar', 'Yaşayan ışık'],
                ['Kan damlası', '6–9 sn', 'ease-in-out, sonra düşüş', 'Ağırlık'],
                ['Zincir salınımı', '8 sn', 'ease-in-out, gidip gelme', 'Sarkaç'],
                ['Kan akışı', '5 sn', 'doğrusal', 'Kanalda hareket'],
              ].map((r) => (
                <tr key={r[0]}>
                  <th scope="row">{r[0]}</th>
                  <td className="rakam whitespace-nowrap">{r[1]}</td>
                  <td className="rakam t-alt">{r[2]}</td>
                  <td className="t-alt">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-alt mt-4 max-w-[70ch]">Hareket kapalıyken (sistem tercihi ya da Ayarlar) bütün süreler sıfıra iner; pencere anında açılır, damlalar sabit asılı durur, mum ışığı titremez.</p>
      </div>
    </Bolum>
  )
}

/* ───────── Madde 17: mobil ───────── */

function Sim({ gen }: { gen: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(gen)
  useEffect(() => {
    const e = ref.current
    if (!e) return
    const ro = new ResizeObserver(([x]) => setW(Math.round(x.contentRect.width)))
    ro.observe(e)
    return () => ro.disconnect()
  }, [])
  const sade = w < SADE_ESIGI
  const olc = useOlc(
    () => {
      const e = ref.current
      if (!e) return { k: '', zincir: 0, doku: false, golge: '' }
      const g = e.querySelector('.gk') as HTMLElement | null
      const zincir = [...e.querySelectorAll('.zc-asili, .zc-serit')].filter((x) => getComputedStyle(x).display !== 'none').length
      return {
        k: g ? getComputedStyle(g).getPropertyValue('--k').trim() : '',
        zincir,
        doku: g ? getComputedStyle(g, '::before').display !== 'none' : false,
        golge: g ? getComputedStyle(g).clipPath : '',
      }
    },
    [sade, gen],
    { k: '', zincir: 0, doku: false, golge: '' },
    250,
  )
  return (
    <>
      <div className="sim" ref={ref} style={{ width: gen, maxWidth: '100%' }} data-sim="" data-sim-sade={sade ? '' : undefined}>
        <div className="sim-ic" data-sade={sade ? '' : undefined}>
          <p className="t-etiket t-soluk mb-6">Kuzgun Kapısı · örnek sayfa</p>
          <div className="sim-akis">
            <GothicCard zincir="asili" sallan yuzey="tas" as="article" aria-label="Örnek kart bir">
              <h4 className="t-h3">Kayıt 01</h4>
              <p className="t-alt mt-2">Avlu, sis ve tek bir mum.</p>
              <div className="mt-4">
                <BloodProgressBar etiket="Sağlık" deger={72} />
              </div>
            </GothicCard>
            <GothicCard zincir="asili" yuzey="demir" as="article" aria-label="Örnek kart iki">
              <h4 className="t-h3">Kayıt 02</h4>
              <p className="t-alt mt-2">Mahzen, zincir ve kapı.</p>
              <div className="mt-4">
                <Dugme dar>Devam et</Dugme>
              </div>
            </GothicCard>
          </div>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4" data-sim-olcum="">
        {[
          ['Genişlik', `${w} px`],
          ['Kip', sade ? 'Düz koyu panel' : 'Gotik'],
          ['Kemer --k', olc.k || '…'],
          ['Zincir', `${olc.zincir} öğe`],
        ].map(([a, b]) => (
          <div key={a}>
            <dt className="t-etiket t-soluk">{a}</dt>
            <dd className="rakam m-0 mt-1 text-[1.125rem] font-semibold">{b}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}

export function Mobil() {
  const [gen, setGen] = useState(900)
  const { aci, sade } = useGothic()
  return (
    <Bolum
      id="mobil"
      no="13"
      madde="Madde 17 · Duyarlı kurallar"
      baslik="Kemer düşer, panel kalır"
      lead={`Gotik kemer ve çerçeve ayrıntıları ${SADE_ESIGI} px'in altında performans ve ekran alanı için düz hatlı koyu panellere dönüşür: zincirler kalkar, doku düşer, kırmızı ışık yerini basit bir gölgeye bırakır.`}
    >
      <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
        <div className="grid content-start gap-7 lg:col-span-4">
          <Aralik label="Kap genişliği" value={gen} min={320} max={960} step={10} onChange={setGen} format={(v) => `${v} px`} id="sim-genislik" />
          <Secim<string>
            legend="Hazır genişlik"
            name="sim-hazir"
            value={String(gen)}
            onChange={(v) => setGen(+v)}
            options={[
              { id: '360', ad: '360 telefon' },
              { id: '640', ad: '640 eşik' },
              { id: '900', ad: '900 geniş' },
            ]}
          />
          <p className="t-alt">
            Sayfanın kendisi de aynı kuralı izler: şu an <span className="rakam font-semibold">{sade ? 'düz panel' : 'gotik'}</span> kipte
            {aci === 'oto' ? ' (dar ekranda otomatik)' : aci === 'duz' ? ' (Ayarlar: düz panel)' : ' (Ayarlar: hep gotik)'}.
          </p>
        </div>
        <div className="min-w-0 lg:col-span-8">
          <Sim gen={gen} />
        </div>
      </div>
      <div className="mt-16">
        <h3 className="t-h3">Ne değişir?</h3>
        <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Duyarlı kurallar tablosu">
          <table className="tablo w-full min-w-[640px]">
            <thead>
              <tr>
                <th scope="col">Öğe</th>
                <th scope="col">{SADE_ESIGI} px ve üstü</th>
                <th scope="col">{SADE_ESIGI} px altı</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Kart üstü', 'Sivri kemer (31 noktalı çokgen)', 'Düz üst kenar'],
                ['Zincir', 'Çerçeve şeridi ve asma zinciri', 'Yok; kart akışta durur'],
                ['Yüzey', 'Pas, taş, deri, kadife dokusu', 'Düz #101013'],
                ['Işık', 'Kırmızı sızıntı, titrek', 'shadow-[0_0_20px_rgba(92,6,6,0.5)]'],
                ['Üst bilgi', 'Kemer karnişi', 'Düz alt çizgi'],
                ['Düğme', 'Sivri uçlu', 'Dikdörtgen'],
              ].map((r) => (
                <tr key={r[0]}>
                  <th scope="row">{r[0]}</th>
                  <td className="t-alt">{r[1]}</td>
                  <td className="t-alt">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────── Madde 18: erişim ───────── */

export function Erisim() {
  const T = useDokuTepe()
  const { kontrast, doku, sizinti, hareket } = useGothic()
  const yuzeyler = [
    { ad: 'Paslı demir', k: 'pas' as const },
    { ad: 'Taş duvar', k: 'tas' as const },
    { ad: 'Yırtık deri', k: 'deri' as const },
    { ad: 'Kadife', k: 'kadife' as const },
  ]
  const kara = useOlc(
    () => {
      let min = 999
      document.querySelectorAll('main *').forEach((e) => {
        const s = getComputedStyle(e)
        if (s.fontFamily.split(',')[0].includes('Pirata') && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim())) min = Math.min(min, parseFloat(s.fontSize))
      })
      return min === 999 ? 0 : Math.round(min)
    },
    [],
    0,
    700,
  )
  const hedef = useOlc(
    () => {
      let min = 999
      document.querySelectorAll('main .gd, main .cip, main .sekme, main .anahtar, main .kitap, main .ikon-kart').forEach((e) => {
        const r = e.getBoundingClientRect()
        if (r.width > 0 && r.height > 0) min = Math.min(min, Math.round(r.height))
      })
      return min === 999 ? 0 : min
    },
    [kontrast],
    0,
    700,
  )
  const bar = useSay('main [role=progressbar]', [], 700)
  const sus = useSay('main .zc-asili, main .zc-serit, main .zc-kose, main .zc-halka, main .kb-damla, main .gk-dekor', [], 700)
  const susGizli = useSay('main .zc-asili[aria-hidden=true], main .zc-serit[aria-hidden=true], main .zc-kose[aria-hidden=true], main .zc-halka[aria-hidden=true], main .kb-damla[aria-hidden=true], main .gk-dekor[aria-hidden=true]', [], 700)
  const anlik = useOlc(
    () => {
      const cs = getComputedStyle(document.documentElement)
      return {
        m: cs.getPropertyValue('--m').trim(),
        s: cs.getPropertyValue('--s').trim(),
        kenar: cs.getPropertyValue('--kenar-ui').trim(),
      }
    },
    [kontrast],
    { m: '#d1d5db', s: '#bcbec3', kenar: '#a0a0a0' },
    150,
  )
  return (
    <Bolum id="erisim" no="14" madde="Madde 18 · Erişilebilirlik ve varyantlar" baslik="Karanlıkta okunabilirlik" lead="Aşırı koyu tonlar metni kolayca yutar; bu yüzden gövde metni hafif soluk gümüşte, #D1D5DB'de tutulur. Saf beyaz karanlıkta göz yorar, kırmızı ise metin taşıyamaz.">
      <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <h3 className="t-h3">Aynı metin, dört yüzey</h3>
          <ul className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2" data-erisim-yuzeyler="">
            {yuzeyler.map((y) => {
              const t = T[y.k]
              return (
                <li key={y.k} className="min-w-0">
                  <div className="erisim-yuzey" data-yuzey={y.k === 'pas' ? 'demir' : y.k}>
                    <p className="t-etiket t-soluk">{y.ad}</p>
                    <p className="mt-2 text-[1.125rem]">Kapının altından sızan ışık, taşın soğuğu ve yalnız bir nefes.</p>
                  </div>
                  <p className="rakam t-alt mt-3">{t ? `#D1D5DB ${oran(krn('#D1D5DB', t.hex))} · #BCBEC3 ${oran(krn('#BCBEC3', t.hex))}` : '…'}</p>
                </li>
              )
            })}
          </ul>
          <div className="mt-12">
            <h3 className="t-h3">Neden saf beyaz değil?</h3>
            <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Metin rengi karşılaştırması">
              <table className="tablo w-full min-w-[560px]" data-metin-tablo="">
                <thead>
                  <tr>
                    <th scope="col">Metin rengi</th>
                    <th scope="col">Gece siyahı üstünde</th>
                    <th scope="col">Not</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['#FFFFFF', 'Parlama, uzun okumada göz yorgunluğu'],
                    ['#D1D5DB', 'Seçilen: soluk gümüş, kontrast yüksek, parlama yok'],
                    ['#BCBEC3', 'İkincil metin'],
                    ['#A0A0A0', 'Yalnız simge ve büyük yazı'],
                  ].map(([h, n]) => (
                    <tr key={h}>
                      <th scope="row" className="rakam whitespace-nowrap">
                        <span className="renk-ornek" style={{ background: h }} aria-hidden="true" />
                        {h}
                      </th>
                      <td className="rakam whitespace-nowrap">{oran(krn(h, '#0A0A0C'))}</td>
                      <td className="t-alt">{n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <GothicCard as="section" aria-label="Erişilebilirlik ayarları" yuzey="kadife" sarmal="lg:col-span-5 lg:self-start" data-erisim-ayarlar="">
          <h3 className="t-h3">Ayarlar</h3>
          <p className="t-alt mt-2 mb-6">Üst bilgideki pencereyle aynı ayarlar; ikisi de kaydedilir.</p>
          <Ayarlar onek="erisim-" />
        </GothicCard>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-6">
          <h3 className="t-h3">Şu an geçerli kurallar</h3>
          <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Varyant tablosu">
            <table className="tablo w-full min-w-[520px]" data-varyant-tablo="">
              <thead>
                <tr>
                  <th scope="col">Kural</th>
                  <th scope="col">Şu an</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Kontrast', kontrast === 'yuksek' ? 'Yüksek: saf beyaz metin, doku ve ışık kapalı' : 'Normal'],
                  ['Gövde metni', anlik.m.toUpperCase()],
                  ['İkincil metin', anlik.s.toUpperCase()],
                  ['Denetim sınırı', anlik.kenar.toUpperCase()],
                  ['Doku', kontrast === 'yuksek' || doku === 'kapali' ? 'Kapalı, düz zemin' : 'Açık'],
                  ['Kırmızı ışık sızıntısı', kontrast === 'yuksek' || sizinti === 'kapali' ? 'Kapalı' : 'Açık'],
                  ['Hareket', hareket ? 'Açık' : 'Durdu'],
                ].map(([a, b]) => (
                  <tr key={a}>
                    <th scope="row">{a}</th>
                    <td className="rakam">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-6">
          <h3 className="t-h3">Denetim listesi</h3>
          <ul className="mt-4 grid gap-4" data-denetim="">
            {[
              [`Kara harf yalnız büyük başlıkta: en küçük Pirata One ${kara || '…'} px`, kara >= 48],
              [`Dokunma hedefi en az 44 px: en küçük ${hedef || '…'} px`, hedef >= 44],
              [`İlerleme çubukları rol ve etiket taşır: ${bar} çubuk`, bar > 0],
              [`Süs öğeleri ekran okuyucudan gizli: ${susGizli}/${sus}`, sus > 0 && sus === susGizli],
              ['Odak halkası: 3 px, kemik beyazı #E6E2DC', true],
              ['Pencere odağı kilitler, Esc kapatır, odak tetikleyiciye döner', true],
              ['Ekran okuyucuya canlı duyuru: yükleme ve filtre', true],
            ].map(([t, ok]) => (
              <li key={String(t)} className="flex gap-3 text-[1.125rem]" data-durum={ok ? 'gecti' : 'kaldi'}>
                <span className="mt-1 shrink-0 yazi-vurgu">
                  <Isaret gecti={Boolean(ok)} />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Bolum>
  )
}
