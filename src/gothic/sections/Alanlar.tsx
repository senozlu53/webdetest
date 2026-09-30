import { Tabs } from 'radix-ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import { BloodProgressBar } from '../components/BloodProgressBar'
import { Bolum } from '../components/Bolum'
import { Dugme } from '../components/Dugme'
import { GothicCard } from '../components/GothicCard'
import { GothicModal } from '../components/GothicModal'
import { Ikon } from '../components/Ikon'
import { Muhur } from '../components/Muhur'
import { Alan, Anahtar, Aralik, Secim } from '../components/ui'
import { GUNLUK, KITAPLAR, OKUMA_METNI, OYUNLAR, type Oyun } from '../lib/alanlar'
import { useGothic } from '../lib/store'

/* ───────── 1 · Survival horror portföyü ───────── */

function Portfoy() {
  const { duyur } = useGothic()
  const [tur, setTur] = useState<'hepsi' | Oyun['tur']>('hepsi')
  const [acik, setAcik] = useState<Oyun | null>(null)
  const donus = useRef<HTMLElement | null>(null)
  const [ind, setInd] = useState(0)
  const [iniyor, setIniyor] = useState(false)
  const liste = useMemo(() => OYUNLAR.filter((o) => tur === 'hepsi' || o.tur === tur), [tur])
  useEffect(() => {
    if (!iniyor) return
    const t = window.setInterval(() => {
      setInd((v) => {
        const n = Math.min(100, v + 4 + Math.round(Math.random() * 4))
        if (n >= 100) {
          window.clearInterval(t)
          setIniyor(false)
          duyur('Demo indirildi')
        }
        return n
      })
    }, 140)
    return () => window.clearInterval(t)
  }, [iniyor, duyur])
  const kapat = (a: boolean) => {
    if (!a) {
      setAcik(null)
      setIniyor(false)
      setInd(0)
    }
  }
  return (
    <div data-sahne="portfoy">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div>
          <p className="t-etiket t-soluk">Kuzgun Kapısı Atölyesi</p>
          <h3 className="baslik-h2 mt-2 !text-[clamp(2rem,4vw,2.75rem)]">Oyunlarımız</h3>
        </div>
        <Secim<'hepsi' | Oyun['tur']>
          legend="Tür"
          name="portfoy-tur"
          value={tur}
          onChange={(v) => {
            setTur(v)
            duyur(`${v === 'hepsi' ? OYUNLAR.length : OYUNLAR.filter((o) => o.tur === v).length} oyun listelendi`)
          }}
          options={[
            { id: 'hepsi', ad: 'Tümü' },
            { id: 'Hayatta kalma', ad: 'Hayatta kalma' },
            { id: 'Bulmaca', ad: 'Bulmaca' },
            { id: 'Keşif', ad: 'Keşif' },
          ]}
        />
      </div>
      <p className="t-alt mt-4" role="status" data-portfoy-sayi="">
        {liste.length} oyun
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3" data-oyunlar="">
        {liste.map((o) => (
          <li key={o.id} className="min-w-0">
            <GothicCard zincir="asili" sallan yuzey={o.yuzey} as="article" aria-label={o.ad} data-oyun-kart={o.id}>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[color:var(--gumus)]">
                  <Ikon ad={o.ikon} boy={40} />
                </span>
                <span className="t-etiket t-soluk">
                  {o.tur} · <span className="rakam">{o.yil}</span>
                </span>
              </div>
              <h4 className="t-h3 mt-3">{o.ad}</h4>
              <p className="mt-2 text-[1.0625rem]">{o.ozet}</p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="t-etiket yazi-vurgu">{o.durum}</span>
                <Dugme
                  dar
                  ton="demir"
                  onClick={(e) => {
                    donus.current = e.currentTarget
                    setAcik(o)
                  }}
                  aria-label={`${o.ad} künyesini aç`}
                >
                  Künyeyi aç
                </Dugme>
              </div>
            </GothicCard>
          </li>
        ))}
      </ul>
      <GothicModal acik={acik !== null} onAcikDegisti={kapat} baslik={acik?.ad ?? ''} aciklama={acik?.ozet} yuzey={acik?.yuzey ?? 'tas'} donusRef={donus}>
        {acik ? (
          <>
            <dl className="grid grid-cols-3 gap-3 text-center">
              {[
                ['Süre', acik.sure],
                ['Platform', acik.platform],
                ['Yıl', String(acik.yil)],
              ].map(([a, b]) => (
                <div key={a} className="border-t border-[#8b4513]/70 pt-2">
                  <dt className="t-etiket t-soluk">{a}</dt>
                  <dd className="rakam m-0 mt-1 text-[1.125rem] font-semibold">{b}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <BloodProgressBar etiket="Demo indiriliyor" deger={ind} metin={ind >= 100 ? 'Hazır' : iniyor || ind > 0 ? `%${ind}` : 'Bekliyor'} />
              <p className="t-alt mt-2">Örnek arayüz: gerçek bir dosya indirilmez.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Dugme
                disabled={iniyor || ind >= 100}
                onClick={() => {
                  setInd(0)
                  setIniyor(true)
                }}
                data-demo-indir=""
              >
                {ind >= 100 ? 'İndirildi' : iniyor ? 'İniyor…' : 'Demoyu indir'}
              </Dugme>
            </div>
          </>
        ) : null}
      </GothicModal>
    </div>
  )
}

/* ───────── 2 · Gotik edebiyat platformu ───────── */

function Kitaplik() {
  const [kitap, setKitap] = useState<(typeof KITAPLAR)[number]['id']>('avlu')
  const [punto, setPunto] = useState(21)
  const [mum, setMum] = useState(true)
  const [ilerleme, setIlerleme] = useState(0)
  const okuyucu = useRef<HTMLDivElement>(null)
  const bolum = kitap === 'mahzen' ? OKUMA_METNI[1] : OKUMA_METNI[0]
  const k = KITAPLAR.find((x) => x.id === kitap)!
  const olc = () => {
    const e = okuyucu.current
    if (!e) return
    const kalan = e.scrollHeight - e.clientHeight
    setIlerleme(kalan > 0 ? Math.round((e.scrollTop / kalan) * 100) : 0)
  }
  useEffect(() => {
    if (okuyucu.current) okuyucu.current.scrollTop = 0
    setIlerleme(0)
  }, [kitap])
  return (
    <div data-sahne="kitaplik" className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-4">
        <p className="t-etiket t-soluk">Gölge Kitaplığı</p>
        <h3 className="baslik-h2 mt-2 !text-[clamp(2rem,4vw,2.75rem)]">Kütüphane</h3>
        <fieldset className="mt-6 min-w-0 border-0 p-0">
          <legend className="sr-only">Kitap seç</legend>
          <ul className="grid gap-4" data-kitaplar="">
            {KITAPLAR.map((b) => (
              <li key={b.id}>
                <label className="kitap" data-on={kitap === b.id ? '' : undefined}>
                  <input type="radio" name="kitap-sec" className="sr-only" value={b.id} checked={kitap === b.id} onChange={() => setKitap(b.id)} />
                  <span className="kitap-sirt" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="t-h3 block !text-[1.375rem]">{b.ad}</span>
                    <span className="t-alt block">
                      {b.yazar} · <span className="rakam">{b.sayfa}</span> sayfa
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        <div className="mt-8 grid gap-6">
          <Aralik label="Yazı boyutu" value={punto} min={16} max={30} onChange={setPunto} format={(v) => `${v} px`} />
          <Anahtar label="Mum ışığı" hint="Sayfanın altında titreyen sıcak bir ışık." checked={mum} onChange={setMum} />
        </div>
      </div>
      <div className="min-w-0 lg:col-span-8">
        <GothicCard as="section" aria-label="Okuma paneli" yuzey="deri" kemer="duz" data-okuyucu-kart="">
          <p className="t-etiket t-soluk">
            {k.ad} · {k.bolum}
          </p>
          <div className="mt-4">
            <BloodProgressBar etiket="Okuma ilerlemesi" deger={ilerleme} damla={false} />
          </div>
          <div ref={okuyucu} onScroll={olc} tabIndex={0} role="region" aria-label={`${k.ad}, okuma metni`} className="okuyucu mt-4" data-mum={mum ? '' : undefined} style={{ fontSize: `${punto}px` }} data-okuyucu="">
            <h4 className="okuyucu-baslik">{bolum.baslik}</h4>
            {[...bolum.paragraflar, ...bolum.paragraflar].map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </GothicCard>
      </div>
    </div>
  )
}

/* ───────── 3 · Bağımsız stüdyo ───────── */

function Studyo() {
  const [ad, setAd] = useState('')
  const [posta, setPosta] = useState('')
  const [ilgi, setIlgi] = useState('devlog')
  const [yemin, setYemin] = useState(false)
  const [hata, setHata] = useState<{
    ad?: string
    posta?: string
    yemin?: string
  }>({})
  const [tamam, setTamam] = useState(false)
  const gonder = useRef<HTMLButtonElement>(null)
  const dogrula = () => {
    const h: typeof hata = {}
    if (ad.trim().length < 2) h.ad = 'Adını yaz; en az iki harf.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(posta.trim())) h.posta = 'Geçerli bir e-posta yaz: ad@alan.com biçiminde.'
    if (!yemin) h.yemin = 'Devam etmek için yemini onayla.'
    return h
  }
  return (
    <div data-sahne="studyo" className="grid grid-cols-1 gap-x-14 gap-y-14 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-6">
        <p className="t-etiket t-soluk">Kuzgun Kapısı Atölyesi</p>
        <h3 className="baslik-h2 mt-2 !text-[clamp(2rem,4vw,2.75rem)]">Geliştirme günlüğü</h3>
        <ol className="zaman mt-8" data-gunluk="">
          {GUNLUK.map((g) => (
            <li key={g.baslik} className="zaman-oge">
              <span className="zaman-isaret text-[color:var(--gumus)]" aria-hidden="true">
                <Ikon ad={g.ikon} boy={26} />
              </span>
              <div className="min-w-0">
                <p className="t-etiket t-soluk rakam">{g.tarih}</p>
                <h4 className="t-h3 mt-1 !text-[1.375rem]">{g.baslik}</h4>
                <p className="t-alt mt-1">{g.metin}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <GothicCard as="section" aria-label="Kuzgun Postası" yuzey="kadife" sarmal="lg:col-span-6 lg:self-start" data-studyo-form="">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="t-h3">Kuzgun Postası</h3>
            <p className="t-alt mt-2 max-w-[38ch]">Ayda bir kez: geliştirme notları, yeni oyunlar, kapalı beta davetleri. Örnek form; hiçbir şey gönderilmez.</p>
          </div>
          <Muhur ikon="kuzgun" boy={64} />
        </div>
        <form
          className="mt-6 grid gap-6"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            const h = dogrula()
            setHata(h)
            if (Object.keys(h).length === 0) {
              setTamam(true)
            } else {
              const form = e.currentTarget
              requestAnimationFrame(() => (form.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus())
            }
          }}
        >
          <Alan label="Ad" hata={hata.ad}>
            {(p) => <input {...p} className="alan" autoComplete="name" value={ad} onChange={(e) => setAd(e.target.value)} placeholder="Emeric Valcourt" />}
          </Alan>
          <Alan label="E-posta" hata={hata.posta} ipucu="Yalnız bülten için kullanılır.">
            {(p) => <input {...p} className="alan" type="email" autoComplete="email" value={posta} onChange={(e) => setPosta(e.target.value)} placeholder="emeric@kuzgunkapisi.example" />}
          </Alan>
          <Alan label="İlgi alanı">
            {(p) => (
              <select {...p} className="alan alan-sec" value={ilgi} onChange={(e) => setIlgi(e.target.value)}>
                <option value="devlog">Geliştirme günlüğü</option>
                <option value="oyun">Yeni oyunlar</option>
                <option value="beta">Kapalı beta davetleri</option>
              </select>
            )}
          </Alan>
          <div>
            <label className="kutu-satir">
              <input type="checkbox" className="kutu" checked={yemin} onChange={(e) => setYemin(e.target.checked)} aria-invalid={hata.yemin ? true : undefined} aria-describedby={hata.yemin ? 'yemin-hata' : undefined} />
              <span>Karanlığa katılıyorum; postamı isteyerek alıyorum.</span>
            </label>
            {hata.yemin ? (
              <p id="yemin-hata" className="mt-2 text-[1.0625rem] font-semibold" data-alan-hata="">
                <span className="t-etiket mr-2 border border-[#a0a0a0] bg-[#5c0606] px-2 py-0.5 text-[#f5efe6]">Hata</span>
                {hata.yemin}
              </p>
            ) : null}
          </div>
          <div>
            <Dugme type="submit" ref={gonder} data-studyo-gonder="">
              Yemin et ve kaydol
            </Dugme>
          </div>
        </form>
      </GothicCard>
      <GothicModal acik={tamam} onAcikDegisti={setTamam} baslik="Kuzgun Postası'na yazıldın" aciklama={`${ad || 'Yolcu'}, örnek kayıt tamamlandı.`} yuzey="kadife" donusRef={gonder}>
        <div className="flex items-center gap-6">
          <Muhur ikon="hac" boy={96} baslik="Kan mührü" />
          <p className="t-alt">
            Mühür basıldı. Bu bir arayüz örneğidir: form hiçbir yere gönderilmez, <span className="rakam">{posta}</span> adresine hiçbir mektup gitmez.
          </p>
        </div>
      </GothicModal>
    </div>
  )
}

/* ───────── Madde 10 ───────── */

const SAHNELER = [
  { id: 'portfoy', ad: 'Survival horror portföyü', kisa: 'Oyun portföyü' },
  { id: 'kitaplik', ad: 'Gotik edebiyat platformu', kisa: 'Edebiyat' },
  { id: 'studyo', ad: 'Bağımsız oyun stüdyosu', kisa: 'Stüdyo' },
] as const

export function Alanlar() {
  return (
    <Bolum id="alanlar" no="08" madde="Madde 10 · UI kullanım alanı" baslik="Üç karanlık sahne" lead="Korku ve hayatta kalma oyunlarının portföyleri, gotik edebiyat platformları ve bağımsız oyun stüdyoları: aynı bileşenler, üç farklı dünya.">
      <Tabs.Root defaultValue="portfoy" data-alanlar-tabs="">
        <Tabs.List className="sekme-liste" aria-label="Kullanım alanları">
          {SAHNELER.map((s) => (
            <Tabs.Trigger key={s.id} value={s.id} className={cx('sekme')}>
              {s.ad}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="portfoy" className="sekme-icerik">
          <Portfoy />
        </Tabs.Content>
        <Tabs.Content value="kitaplik" className="sekme-icerik">
          <Kitaplik />
        </Tabs.Content>
        <Tabs.Content value="studyo" className="sekme-icerik">
          <Studyo />
        </Tabs.Content>
      </Tabs.Root>
    </Bolum>
  )
}
