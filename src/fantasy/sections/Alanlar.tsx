import { useEffect, useId, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { HealthBar } from '../components/Bar'
import { Bolum } from '../components/Bolum'
import { Ikon } from '../components/Ikon'
import { Panel } from '../components/Suslu'
import { Alan, Aralik, Buton, Secim, SiraOku } from '../components/ui'
import { BOLUMLER, LANSMAN_TARIHI, OYUNLAR, PLATFORMLAR, SIRALAMA, SINIFLAR, SURUMLER, type IkonAd } from '../lib/data'
import { useFantasy } from '../lib/store'
import { useYaldiz } from '../lib/yaldiz'

/** Madde 10: dört kullanım sahnesi. Hepsi gerçek etkileşim taşır; hiçbir form bir yere gönderilmez. */
function Sahne({ id, no, baslik, alt, children }: { id: string; no: string; baslik: string; alt: string; children: ReactNode }) {
  const hid = useId()
  return (
    <article data-sahne={id} aria-labelledby={hid} className="grid grid-cols-1 gap-6">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-[color:var(--altin-koyu)] pb-3">
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

/* ─────────── 1 · oyun stüdyosu portfolyosu ─────────── */

const OYUN_IKON: Record<string, IkonAd> = { o1: 'kilic', o2: 'kalkan', o3: 'kitap', o4: 'yay' }

function Portfolyo() {
  const [pf, setPf] = useState<(typeof PLATFORMLAR)[number]>('Hepsi')
  const [istek, setIstek] = useState<string[]>(['o1'])
  const { duyur } = useFantasy()
  const liste = OYUNLAR.filter((o) => pf === 'Hepsi' || o.platform === pf)
  const degistir = (id: string, ad: string) => {
    const var_ = istek.includes(id)
    setIstek((s) => (var_ ? s.filter((x) => x !== id) : [...s, id]))
    duyur(var_ ? `${ad} istek listesinden çıkarıldı` : `${ad} istek listesine eklendi`)
  }
  return (
    <Sahne id="studyo" no="1" baslik="Oyun stüdyosu portfolyosu" alt="Külbaşı Stüdyo">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <Secim<(typeof PLATFORMLAR)[number]> legend="Platform" name="pf-platform" value={pf} onChange={setPf} options={PLATFORMLAR.map((p) => ({ id: p, ad: p }))} />
        <p className="t-alt" role="status" data-portfoy-say="">
          {liste.length} oyun listeleniyor · İstek listesi: <span className="rakam">{istek.length}</span>
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" data-portfoy="">
        {liste.map((o) => {
          const on = istek.includes(o.id)
          return (
            <li key={o.id}>
              <Panel yuzey="tas" suslu={false} className="flex h-full flex-col p-5" as="article" data-oyun={o.id}>
                <div className="flex items-start gap-3">
                  <Ikon ad={OYUN_IKON[o.id]} boy={48} />
                  <div className="min-w-0">
                    <h4 className="t-h3 !text-[1.25rem] break-words">{o.ad}</h4>
                    <p className="t-etiket t-soluk mt-1">
                      {o.tur} · {o.platform} · <span className="rakam">{o.yil}</span>
                    </p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-[1.0625rem]">{o.ozet}</p>
                <Buton className="mt-4 self-start" ton={on ? 'altin' : 'tas'} aria-pressed={on} onClick={() => degistir(o.id, o.ad)} data-istek={o.id}>
                  {on ? 'İstek listesinde' : 'İstek listesine ekle'}
                </Buton>
              </Panel>
            </li>
          )
        })}
      </ul>
    </Sahne>
  )
}

/* ─────────── 2 · fantastik roman platformu ─────────── */

function Okuyucu() {
  const [no, setNo] = useState(1)
  const [boy, setBoy] = useState(20)
  const { duyur } = useFantasy()
  const b = BOLUMLER[no - 1]
  const git = (n: number) => {
    const h = Math.max(1, Math.min(BOLUMLER.length, n))
    setNo(h)
    duyur(`Bölüm ${h}: ${BOLUMLER[h - 1].baslik}`)
  }
  return (
    <Sahne id="roman" no="2" baslik="Fantastik roman platformu" alt="Kadim Diyar Kroniği">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="grid content-start gap-6 lg:col-span-4">
          <nav aria-label="Bölümler" data-okuyucu-nav="">
            <ol className="m-0 grid list-none gap-2 p-0">
              {BOLUMLER.map((x) => (
                <li key={x.no}>
                  <button type="button" className="okuyucu-bolum" aria-current={no === x.no ? 'true' : undefined} onClick={() => git(x.no)} data-bolum-no={x.no}>
                    <span className="rakam t-etiket">Bölüm {x.no}</span>
                    <span className="block text-[1.125rem] font-semibold">{x.baslik}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <Aralik id="okuyucu-boy" label="Yazı boyu" value={boy} min={17} max={28} onChange={setBoy} format={(v) => `${v} px`} />
        </div>
        <Panel yuzey="parsomen" className="p-7 lg:col-span-8" as="article" data-okuyucu="" aria-label={`Bölüm ${b.no}: ${b.baslik}`}>
          <p className="t-etiket t-soluk">
            Kadim Diyar Kroniği · Bölüm <span className="rakam">{b.no}</span> / <span className="rakam">{BOLUMLER.length}</span>
          </p>
          <h4 className="t-h2 mt-2" data-okuyucu-baslik="">
            {b.baslik}
          </h4>
          <div className="mt-5 grid max-w-[62ch] gap-4" style={{ fontSize: `${boy / 16}rem` }} data-okuyucu-metin="">
            {b.metin.map((m, i) => (
              <p key={i} className={i === 0 ? 'ilk-harf' : undefined}>
                {m}
              </p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Buton ton="yalin" disabled={no === 1} onClick={() => git(no - 1)} data-onceki="">
              Önceki bölüm
            </Buton>
            <Buton ton="altin" disabled={no === BOLUMLER.length} onClick={() => git(no + 1)} data-sonraki="">
              Sonraki bölüm
            </Buton>
          </div>
        </Panel>
      </div>
    </Sahne>
  )
}

/* ─────────── 3 · e-spor topluluğu ─────────── */

type Anahtar = 'ad' | 'puan' | 'uye' | 'sehir'
const KOLONLAR: { id: Anahtar; ad: string }[] = [
  { id: 'ad', ad: 'Lonca' },
  { id: 'puan', ad: 'Puan' },
  { id: 'uye', ad: 'Üye' },
  { id: 'sehir', ad: 'Şehir' },
]

function Siralama() {
  const [anahtar, setAnahtar] = useState<Anahtar>('puan')
  const [yon, setYon] = useState<'asc' | 'desc'>('desc')
  const { duyur } = useFantasy()
  const sirali = useMemo(
    () =>
      [...SIRALAMA].sort((a, b) => {
        const x = a[anahtar]
        const y = b[anahtar]
        const c = typeof x === 'number' ? x - (y as number) : String(x).localeCompare(String(y), 'tr')
        return yon === 'asc' ? c : -c
      }),
    [anahtar, yon],
  )
  const sirala = (k: Anahtar, ad: string) => {
    const y = k === anahtar ? (yon === 'asc' ? 'desc' : 'asc') : k === 'ad' || k === 'sehir' ? 'asc' : 'desc'
    setAnahtar(k)
    setYon(y)
    duyur(`Tablo ${ad} sütununa göre ${y === 'asc' ? 'artan' : 'azalan'} sıralandı`)
  }
  return (
    <Sahne id="espor" no="3" baslik="E-spor topluluğu" alt="Lonca ligi · sezon 4">
      <Panel yuzey="tas" suslu={false} className="p-5 sm:p-7" data-siralama="">
        <div className="overflow-x-auto" role="region" aria-label="Lonca sıralaması, yatay kaydırılabilir" tabIndex={0}>
          <table className="tablo w-full min-w-[560px] border-collapse">
            <caption className="t-alt">Altı loncanın sezon puanı. Sütun başlıklarına basarak sıralayın.</caption>
            <thead>
              <tr>
                <th scope="col">Sıra</th>
                {KOLONLAR.map((k) => (
                  <th key={k.id} scope="col" aria-sort={anahtar === k.id ? (yon === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    <button type="button" onClick={() => sirala(k.id, k.ad)} data-sirala={k.id}>
                      {k.ad}
                      <SiraOku yon={anahtar === k.id ? (yon === 'asc' ? 'artan' : 'azalan') : 'yok'} />
                    </button>
                  </th>
                ))}
                <th scope="col">Puan çubuğu</th>
              </tr>
            </thead>
            <tbody>
              {sirali.map((s) => (
                <tr key={s.ad} data-lonca={s.ad}>
                  <td className="rakam">{SIRALAMA.findIndex((x) => x.ad === s.ad) + 1}</td>
                  <th scope="row">{s.ad}</th>
                  <td className="rakam">{s.puan.toLocaleString('tr-TR')}</td>
                  <td className="rakam">{s.uye}</td>
                  <td>{s.sehir}</td>
                  <td className="w-[168px]">
                    <HealthBar deger={s.puan} azami={10000} tur="deneyim" etiket={`${s.ad} puanı`} kisa />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Sahne>
  )
}

/* ─────────── 4 · RPG lansman sayfası ─────────── */

function Geri() {
  const [simdi, setSimdi] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setSimdi(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])
  const fark = Math.max(0, new Date(LANSMAN_TARIHI).getTime() - simdi)
  const parcalar: [string, number][] = [
    ['Gün', Math.floor(fark / 864e5)],
    ['Saat', Math.floor(fark / 36e5) % 24],
    ['Dakika', Math.floor(fark / 6e4) % 60],
    ['Saniye', Math.floor(fark / 1e3) % 60],
  ]
  return (
    <div role="timer" aria-label={fark ? `Lansmana ${parcalar[0][1]} gün ${parcalar[1][1]} saat kaldı` : 'Kadim Diyar yayında'} data-geri-sayim="" className="grid grid-cols-4 gap-3">
      {parcalar.map(([ad, n]) => (
        <div key={ad} className="geri-kutu">
          <p className="rakam geri-sayi" data-geri={ad}>
            {String(n).padStart(2, '0')}
          </p>
          <p className="t-etiket t-soluk">{ad}</p>
        </div>
      ))}
    </div>
  )
}

const E_POSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function Lansman() {
  const [sinif, setSinif] = useState<(typeof SINIFLAR)[number]['id']>('sovalye')
  const [surum, setSurum] = useState<(typeof SURUMLER)[number]['id']>('kahraman')
  const [eposta, setEposta] = useState('')
  const [hata, setHata] = useState('')
  const [gonderildi, setGonderildi] = useState<string | null>(null)
  const { duyur } = useFantasy()
  const { patlat } = useYaldiz()
  const s = SINIFLAR.find((x) => x.id === sinif)!
  const sv = SURUMLER.find((x) => x.id === surum)!
  const gonder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!E_POSTA.test(eposta.trim())) {
      setHata('Geçerli bir e-posta yazın, örneğin kahraman@ornek.com')
      duyur('Form gönderilemedi: e-posta geçersiz')
      return
    }
    setHata('')
    setGonderildi(`${s.ad} · ${sv.ad} sürüm`)
    duyur('Ön sipariş kaydı alındı')
    const r = (e.currentTarget.querySelector('[data-onsiparis]') as HTMLElement).getBoundingClientRect()
    patlat(r.left + r.width / 2, r.top + r.height / 2, 36)
  }
  return (
    <Sahne id="lansman" no="4" baslik="RPG oyun lansman sayfası" alt="Kadim Diyar · 21 Kasım 2026">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="grid content-start gap-6 lg:col-span-7">
          <Geri />
          <Panel yuzey="tas" className="p-6" data-sinif-kart="">
            <Secim<(typeof SINIFLAR)[number]['id']>
              legend="Sınıfını seç"
              name="lansman-sinif"
              value={sinif}
              onChange={setSinif}
              options={SINIFLAR.map((x) => ({
                id: x.id,
                ad: (
                  <span className="inline-flex items-center gap-2">
                    <Ikon ad={x.ikon} boy={22} />
                    {x.ad}
                  </span>
                ),
              }))}
            />
            <p className="t-alt mt-4" data-sinif-rol="">
              {s.ad}: {s.rol}
            </p>
            <div className="mt-4 grid gap-4" data-sinif-istatistik="">
              <HealthBar deger={s.guc} azami={100} tur="can" etiket="Güç" />
              <HealthBar deger={s.buyu} azami={100} tur="mana" etiket="Büyü" />
              <HealthBar deger={s.hiz} azami={100} tur="deneyim" etiket="Hız" />
            </div>
          </Panel>
        </div>
        <Panel yuzey="parsomen" className="p-7 lg:col-span-5 lg:self-start" as="section" aria-label="Ön sipariş" data-onsiparis-panel="">
          <p className="t-etiket t-soluk">Ön sipariş</p>
          <h4 className="t-h2 mt-1">Adını kayda geçir</h4>
          {gonderildi ? (
            <div className="mt-5" role="status" data-onsiparis-tamam="">
              <p className="text-[1.125rem] font-semibold">Kaydın alındı, kahraman.</p>
              <p className="mt-2">
                {gonderildi} için <span className="rakam">{eposta.trim()}</span> adresine haber vereceğiz. Bu sayfa bir gösteridir; bilgiler hiçbir yere gönderilmez.
              </p>
              <Buton
                className="mt-4"
                ton="yalin"
                onClick={() => {
                  setGonderildi(null)
                  setEposta('')
                }}
              >
                Yeni kayıt
              </Buton>
            </div>
          ) : (
            <form onSubmit={gonder} noValidate className="mt-5 grid gap-5" data-onsiparis-form="">
              <Secim<(typeof SURUMLER)[number]['id']>
                legend="Sürüm"
                name="lansman-surum"
                value={surum}
                onChange={setSurum}
                options={SURUMLER.map((x) => ({
                  id: x.id,
                  ad: (
                    <span className="inline-flex items-baseline gap-2">
                      {x.ad}
                      <span className="rakam">{x.fiyat.toLocaleString('tr-TR')} ₺</span>
                    </span>
                  ),
                }))}
              />
              <Alan label="E-posta" hata={hata} ipucu="Lansman günü tek bir ileti göndeririz.">
                {(p) => (
                  <input
                    {...p}
                    className="alan"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="kahraman@ornek.com"
                    value={eposta}
                    onChange={(e) => {
                      setEposta(e.target.value)
                      if (hata && E_POSTA.test(e.target.value.trim())) setHata('')
                    }}
                    data-eposta=""
                  />
                )}
              </Alan>
              <div className="flex flex-wrap items-center gap-4">
                <Buton type="submit" ton="altin" ikon="sandik" data-onsiparis="">
                  Ön sipariş ver
                </Buton>
                <p className="rakam text-[1.125rem] font-semibold" data-fiyat="">
                  {sv.fiyat.toLocaleString('tr-TR')} ₺
                </p>
              </div>
            </form>
          )}
        </Panel>
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
      baslik="Dört sahne, tek diyar"
      lead="Aynı taş, altın ve parşömen dili dört farklı yerde çalışır: oyun stüdyosu portfolyosu, fantastik roman platformu, e-spor topluluğu ve bir RPG lansman sayfası. Hepsi çalışır: filtreleyin, okuyun, sıralayın, sipariş verin."
    >
      <div className="grid gap-y-[clamp(56px,7vw,96px)]">
        <Portfolyo />
        <Okuyucu />
        <Siralama />
        <Lansman />
      </div>
    </Bolum>
  )
}
