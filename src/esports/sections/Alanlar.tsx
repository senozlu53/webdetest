import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Bolum } from '../components/Bolum'
import { SlantedButton } from '../components/Dugme'
import { Ikon } from '../components/Ikon'
import { EsportsCard } from '../components/Kart'
import { Alan, Aralik, Anahtar, Secim } from '../components/ui'
import { KLIPLER, KLIP_TURLERI, OYUNCULAR, ROLLER, TAKIMLAR } from '../lib/data'
import { useEsports, type Vurgu } from '../lib/store'

/** Madde 10: dört kullanım sahnesi. Hepsi çalışır; hiçbir form bir yere gönderilmez. */
function Sahne({ id, no, baslik, alt, children }: { id: string; no: string; baslik: string; alt: string; children: ReactNode }) {
  const hid = useId()
  return (
    <article data-sahne={id} aria-labelledby={hid} className="grid grid-cols-1 gap-6">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-4 border-[color:var(--vurgu)] pb-3">
        <h3 id={hid} className="t-h3">
          {baslik}
        </h3>
        <p className="t-etiket t-soluk">
          Sahne {no} · {alt}
        </p>
      </header>
      {children}
    </article>
  )
}

/* ─────────── 1 · takım sitesi ─────────── */

function Kadro() {
  const [rol, setRol] = useState<(typeof ROLLER)[number]>('Hepsi')
  const [acik, setAcik] = useState<string | null>('RAZOR')
  const liste = OYUNCULAR.filter((o) => rol === 'Hepsi' || o.rol === rol)
  const t = TAKIMLAR[0]
  return (
    <Sahne id="takim" no="1" baslik="E-spor takım sitesi" alt="Vektör-9 kadrosu">
      <EsportsCard className="p-5 sm:p-6" data-takim-baslik="">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <div className="flex items-center gap-4">
            <span className="text-[color:var(--vurgu-yazi)]">
              <Ikon ad="kupa" boy={52} />
            </span>
            <div>
              <p className="baslik-h2 !text-[1.75rem]">Vektör-9</p>
              <p className="t-alt">
                <span className="rakam">{t.g}</span> galibiyet · <span className="rakam">{t.m}</span> mağlubiyet · seri <span className="rakam">{t.seri}</span>
              </p>
            </div>
          </div>
          <SlantedButton ton="birincil" ok>
            Takıma katıl
          </SlantedButton>
        </div>
      </EsportsCard>
      <Secim<(typeof ROLLER)[number]> legend="Rol" name="kadro-rol" value={rol} onChange={setRol} options={ROLLER.map((r) => ({ id: r, ad: r }))} />
      <p className="t-alt" role="status" data-kadro-say="">
        {liste.length} oyuncu listeleniyor
      </p>
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" data-kadro="">
        {liste.map((o, i) => {
          const on = acik === o.nick
          return (
            <li key={o.nick}>
              <EsportsCard kesim="egik" vurgu={(['mavi', 'lime', 'turuncu'] as Vurgu[])[i % 3]} as="article" className="oyuncu-kart" sarmal="h-full" data-oyuncu={o.nick}>
                <div className="flex items-start gap-3">
                  <span className="text-[color:var(--vurgu-yazi)]">
                    <Ikon ad={o.ikon} boy={44} />
                  </span>
                  <div className="min-w-0">
                    <h4 className="t-h3 break-words">{o.nick}</h4>
                    <p className="t-etiket t-soluk mt-1">{o.rol}</p>
                  </div>
                  <p className="rakam ml-auto text-[1.25rem] font-bold">{o.kd.toFixed(2).replace('.', ',')}</p>
                </div>
                <p className="t-etiket t-soluk">K/D oranı</p>
                {on ? (
                  <p className="mt-1 text-[1.125rem]" id={`not-${o.nick}`}>
                    {o.not}
                  </p>
                ) : null}
                <SlantedButton dar ton="hayalet" className="mt-2 self-start" aria-expanded={on} aria-controls={on ? `not-${o.nick}` : undefined} onClick={() => setAcik(on ? null : o.nick)} data-profil={o.nick}>
                  {on ? 'Profili gizle' : 'Profil'}
                </SlantedButton>
              </EsportsCard>
            </li>
          )
        })}
      </ul>
    </Sahne>
  )
}

/* ─────────── 2 · turnuva platformu ─────────── */

const E_POSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const OYUNLAR = ['Arena-Sıfır', 'Kod-Kırmızı', 'Sektör-7'] as const

function Maci({ a, b, sa, sb }: { a: string; b: string; sa?: number; sb?: number }) {
  const bitti = sa !== undefined && sb !== undefined
  const satir = (ad: string, s: number | undefined, kazandi: boolean) => (
    <p className="flex items-center justify-between gap-3 py-1" data-kazanan={kazandi ? '' : undefined}>
      <span className={kazandi ? 'font-bold' : 't-soluk'}>
        {kazandi ? <span className="mr-2 inline-block h-2 w-2 bg-[color:var(--lime)]" aria-label="kazandı" role="img" /> : null}
        {ad}
      </span>
      <span className="rakam font-bold">{s ?? '–'}</span>
    </p>
  )
  return (
    <EsportsCard kesim="duz" parlama={false} className="px-4 py-2" data-mac-kutu="">
      {satir(a, sa, bitti && sa! > sb!)}
      {satir(b, sb, bitti && sb! > sa!)}
    </EsportsCard>
  )
}

function Turnuva() {
  const [takim, setTakim] = useState('')
  const [eposta, setEposta] = useState('')
  const [oyun, setOyun] = useState<(typeof OYUNLAR)[number]>('Arena-Sıfır')
  const [kadro, setKadro] = useState<'3' | '5'>('5')
  const [kural, setKural] = useState(false)
  const [hata, setHata] = useState<{ takim?: string; eposta?: string; kural?: string }>({})
  const [tamam, setTamam] = useState<string | null>(null)
  const { duyur } = useEsports()
  const gonder = (e: FormEvent) => {
    e.preventDefault()
    const h: typeof hata = {}
    if (takim.trim().length < 3) h.takim = 'Takım adı en az üç karakter olmalı'
    if (!E_POSTA.test(eposta.trim())) h.eposta = 'Geçerli bir e-posta yazın, örneğin kaptan@ornek.com'
    if (!kural) h.kural = 'Devam etmek için kuralları kabul edin'
    setHata(h)
    if (Object.keys(h).length) {
      duyur(`Kayıt gönderilemedi: ${Object.keys(h).length} hata`)
      return
    }
    setTamam(`${takim.trim()} · ${oyun} · ${kadro}v${kadro}`)
    duyur('Takım kaydı alındı')
  }
  return (
    <Sahne id="turnuva" no="2" baslik="Turnuva platformu" alt="Vektör Kupası kayıt ve eşleşme">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7" data-eslesme="">
          <p className="t-etiket t-soluk mb-3">Eşleşme ağacı</p>
          <div className="overflow-x-auto pb-2" role="region" aria-label="Eşleşme ağacı, yatay kaydırılabilir" tabIndex={0} data-eslesme-kaydir="">
            <div className="grid min-w-[600px] grid-cols-3 gap-6">
              <div className="grid content-around gap-4">
                <p className="t-etiket t-soluk">Çeyrek final</p>
                <Maci a="Vektör-9" b="Merkez Osu" sa={2} sb={0} />
                <Maci a="Kutup Şoku" b="Ateş Çemberi" sa={2} sb={1} />
                <Maci a="Kızıl Sinyal" b="Gölge Hattı" sa={0} sb={2} />
                <Maci a="Nöbetçi-0" b="Çelik Fırtına" sa={2} sb={1} />
              </div>
              <div className="grid content-around gap-4">
                <p className="t-etiket t-soluk">Yarı final</p>
                <Maci a="Vektör-9" b="Kutup Şoku" />
                <Maci a="Gölge Hattı" b="Nöbetçi-0" />
              </div>
              <div className="grid content-center gap-4">
                <p className="t-etiket t-soluk">Büyük final</p>
                <Maci a="Belli değil" b="Belli değil" />
              </div>
            </div>
          </div>
        </div>
        <EsportsCard vurgu="lime" as="section" aria-label="Takım kaydı" className="p-6" sarmal="lg:col-span-5 lg:self-start" data-kayit-panel="">
          <p className="t-etiket t-soluk">Takım kaydı</p>
          <h4 className="t-h3 mt-1">Kadronu yaz</h4>
          {tamam ? (
            <div className="mt-5" role="status" data-kayit-tamam="">
              <p className="text-[1.25rem] font-bold">Kayıt alındı.</p>
              <p className="mt-2">
                {tamam} için <span className="rakam">{eposta.trim()}</span> adresine eşleşme bilgisi gelecek. Bu sayfa bir gösteridir; bilgiler hiçbir yere gönderilmez.
              </p>
              <SlantedButton
                className="mt-4"
                ton="hayalet"
                dar
                onClick={() => {
                  setTamam(null)
                  setTakim('')
                  setEposta('')
                  setKural(false)
                }}
              >
                Yeni kayıt
              </SlantedButton>
            </div>
          ) : (
            <form onSubmit={gonder} noValidate className="mt-5 grid gap-5" data-kayit-form="">
              <Alan label="Takım adı" hata={hata.takim}>
                {(p) => <input {...p} className="alan" value={takim} onChange={(e) => setTakim(e.target.value)} autoComplete="off" placeholder="Örn. Nova Vektör" data-takim-adi="" />}
              </Alan>
              <Alan label="Kaptan e-posta" hata={hata.eposta}>
                {(p) => <input {...p} className="alan" type="email" autoComplete="email" inputMode="email" placeholder="kaptan@ornek.com" value={eposta} onChange={(e) => setEposta(e.target.value)} data-eposta="" />}
              </Alan>
              <div>
                <label htmlFor="kayit-oyun" className="t-etiket">
                  Oyun
                </label>
                <select id="kayit-oyun" className="alan mt-2" value={oyun} onChange={(e) => setOyun(e.target.value as (typeof OYUNLAR)[number])} data-oyun-sec="">
                  {OYUNLAR.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <Secim<'3' | '5'>
                legend="Kadro"
                name="kayit-kadro"
                value={kadro}
                onChange={setKadro}
                options={[
                  { id: '3', ad: '3v3' },
                  { id: '5', ad: '5v5' },
                ]}
              />
              <div>
                <Anahtar label="Turnuva kurallarını kabul ediyorum" checked={kural} onChange={setKural} />
                {hata.kural ? (
                  <p className="mt-2 font-bold" data-kural-hata="">
                    <span className="t-etiket mr-2 bg-[#9c2600] px-2 py-0.5 text-white">Hata</span>
                    {hata.kural}
                  </p>
                ) : null}
              </div>
              <SlantedButton type="submit" ton="birincil" ok data-kayit-gonder="" className="justify-self-start">
                Kaydı gönder
              </SlantedButton>
            </form>
          )}
        </EsportsCard>
      </div>
    </Sahne>
  )
}

/* ─────────── 3 · yayıncı portfolyosu ─────────── */

function Yayinci() {
  const [tur, setTur] = useState<(typeof KLIP_TURLERI)[number]>('Hepsi')
  const [secili, setSecili] = useState<string | null>('k1')
  const liste = KLIPLER.filter((k) => tur === 'Hepsi' || k.tur === tur)
  const s = KLIPLER.find((k) => k.id === secili)
  return (
    <Sahne id="yayinci" no="3" baslik="Yayıncı portfolyosu" alt="NULLPOINT · yayıncı ve nişancı">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <EsportsCard kesim="kose" as="section" aria-label="Yayıncı künyesi" className="p-6" sarmal="lg:col-span-4 lg:self-start">
          <div className="flex items-center gap-5">
            <span className="halka grid place-items-center text-[color:var(--vurgu-yazi)]" aria-hidden="true">
              <Ikon ad="nisangah" boy={44} />
            </span>
            <div className="min-w-0">
              <h4 className="t-h3">NULLPOINT</h4>
              <p className="t-etiket t-soluk mt-1">Yayıncı · Nişancı</p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              ['Takipçi', '412B'],
              ['Saat', '3.120'],
              ['Ort. izleyici', '6,4B'],
            ].map(([a, b]) => (
              <div key={a}>
                <dt className="t-etiket t-soluk">{a}</dt>
                <dd className="rakam m-0 mt-1 text-[1.125rem] font-bold">{b}</dd>
              </div>
            ))}
          </dl>
        </EsportsCard>
        <div className="grid grid-cols-1 gap-6 lg:col-span-8">
          <Secim<(typeof KLIP_TURLERI)[number]> legend="Klip türü" name="klip-tur" value={tur} onChange={setTur} options={KLIP_TURLERI.map((k) => ({ id: k, ad: k }))} />
          <p className="t-alt" role="status" data-klip-say="">
            {liste.length} klip listeleniyor
          </p>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3" data-klipler="">
            {liste.map((k) => {
              const on = secili === k.id
              return (
                <li key={k.id}>
                  <EsportsCard kesim="egik" vurgu={k.tur === 'Ace' ? 'turuncu' : k.tur === 'Clutch' ? 'lime' : 'mavi'} as="article" className="klip" sarmal="h-full" data-klip={k.id}>
                    <div className="klip-kucuk" aria-hidden="true">
                      <Ikon ad="monitor" boy={40} />
                      <span className="klip-sure rakam">{k.sure}</span>
                    </div>
                    <div className="grid gap-1 px-4">
                      <h5 className="text-[1.1875rem] font-bold">{k.baslik}</h5>
                      <p className="t-alt">
                        {k.tur} · <span className="rakam">{k.izlenme.toLocaleString('tr-TR')}</span> izlenme
                      </p>
                      <SlantedButton dar ton={on ? 'birincil' : 'hayalet'} className="mt-2 self-start" aria-pressed={on} onClick={() => setSecili(on ? null : k.id)} data-klip-sec={k.id}>
                        {on ? 'Seçili' : 'Seç'}
                      </SlantedButton>
                    </div>
                  </EsportsCard>
                </li>
              )
            })}
          </ul>
          <p className="t-alt" data-klip-secili="">
            {s ? `Seçili klip: ${s.baslik} (${s.sure})` : 'Klip seçilmedi'}
          </p>
        </div>
      </div>
    </Sahne>
  )
}

/* ─────────── 4 · donanım pazarlaması ─────────── */

const POLLING = [1000, 2000, 4000, 8000] as const
function Donanim() {
  const [dpi, setDpi] = useState(12800)
  const [hz, setHz] = useState<(typeof POLLING)[number]>(4000)
  const [sepet, setSepet] = useState(0)
  const { vurgu, duyur } = useEsports()
  const tepki = (1000 / hz).toFixed(3).replace('.', ',')
  const oran = (dpi / 26000) * 100
  return (
    <Sahne id="donanim" no="4" baslik="Donanım pazarlaması" alt="Vektör X1 Pro oyun faresi">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <EsportsCard yuzey="celik" as="section" aria-label="Ürün görseli" className="grid place-items-center p-8" sarmal="lg:col-span-5">
          <svg viewBox="0 0 220 260" width="200" role="img" aria-label="Vektör X1 Pro fare çizimi" data-urun="">
            <path d="M110 12L170 40L190 110L176 220L110 248L44 220L30 110L50 40Z" fill="#12141a" stroke="#f2f6fa" strokeWidth="3" strokeLinejoin="miter" />
            <path d="M110 12V96M50 40L110 96L170 40" stroke="#f2f6fa" strokeWidth="2" fill="none" />
            <path d="M96 118H124V152H96Z" fill="var(--vurgu)" />
            <path d="M32 120L44 220M188 120L176 220" stroke="var(--vurgu)" strokeWidth="6" />
            <path d="M110 248L110 258" stroke="var(--vurgu-2)" strokeWidth="4" />
          </svg>
          <p className="t-etiket mt-4">Işık halkası · {vurgu === 'mavi' ? 'Elektrik mavisi' : vurgu === 'lime' ? 'Neon lime' : 'Turuncu'}</p>
        </EsportsCard>
        <div className="grid grid-cols-1 content-start gap-6 lg:col-span-7">
          <div>
            <p className="t-etiket t-soluk">Vektör X1 Pro</p>
            <h4 className="baslik-h2 mt-2 !text-[2rem]">58 gram, 8000 Hz</h4>
            <p className="t-alt mt-2">Magnezyum iskelet, optik anahtarlar, 100 milyon tık ömrü.</p>
          </div>
          <Aralik id="urun-dpi" label="Hassasiyet (DPI)" value={dpi} min={400} max={26000} step={100} onChange={setDpi} format={(v) => v.toLocaleString('tr-TR')} />
          <div className="spec-cubuk" role="img" aria-label={`Hassasiyet yüzde ${Math.round(oran)}`}>
            <span className="spec-dolgu" style={{ width: `${oran}%` }} data-dpi-cubuk={Math.round(oran)} />
          </div>
          <Secim<string> legend="Tarama hızı" name="urun-hz" value={String(hz)} onChange={(v) => setHz(+v as (typeof POLLING)[number])} options={POLLING.map((h) => ({ id: String(h), ad: `${h} Hz` }))} />
          <dl className="grid grid-cols-3 gap-4" data-urun-ozet="">
            <div>
              <dt className="t-etiket t-soluk">Tepki</dt>
              <dd className="rakam m-0 text-[1.375rem] font-bold" data-tepki={tepki}>
                {tepki} ms
              </dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">DPI</dt>
              <dd className="rakam m-0 text-[1.375rem] font-bold" data-dpi={dpi}>
                {dpi.toLocaleString('tr-TR')}
              </dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Fiyat</dt>
              <dd className="rakam m-0 text-[1.375rem] font-bold">4.299 ₺</dd>
            </div>
          </dl>
          <div className="flex flex-wrap items-center gap-4">
            <SlantedButton
              ton="turuncu"
              ok
              onClick={() => {
                setSepet((n) => n + 1)
                duyur(`Sepete eklendi: ${sepet + 1} ürün`)
              }}
              data-sepete-ekle=""
            >
              Sepete ekle
            </SlantedButton>
            <p className="t-alt" role="status" data-sepet={sepet}>
              Sepet: <span className="rakam">{sepet}</span> ürün
            </p>
          </div>
        </div>
      </div>
    </Sahne>
  )
}

export function Alanlar() {
  return (
    <Bolum
      id="alanlar"
      no="08"
      madde="Madde 10 · UI kullanım alanı"
      baslik="Dört sahne, tek arena"
      lead="Aynı kesik köşe ve neon şerit dili dört farklı yerde çalışır: takım sitesi, turnuva platformu, yayıncı portfolyosu ve donanım pazarlama sayfası. Hepsi çalışır: süzün, kaydolun, klip seçin, DPI ayarlayın."
    >
      <div className="grid grid-cols-1 gap-y-[clamp(56px,7vw,96px)]">
        <Kadro />
        <Turnuva />
        <Yayinci />
        <Donanim />
      </div>
    </Bolum>
  )
}
