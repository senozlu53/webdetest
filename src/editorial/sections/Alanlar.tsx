import { useState, type FormEvent, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { Bolum, EditorialContainer } from '../components/Editorial'
import { Ikon } from '../components/Ikon'
import { Pagination } from '../components/Pagination'
import { Alan, Buton, OkBaglanti, Secim } from '../components/ui'
import { BULTEN, HABERLER, KATEGORILER, KITAPLAR, KITAP_KATEGORILERI, PROJELER, SAYI } from '../lib/data'
import { useEditorial } from '../lib/store'

const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const tl = (n: number) => `₺${n.toLocaleString('tr-TR')}`

function AltBaslik({ no, id, children, alt }: { no: string; id: string; children: ReactNode; alt: string }) {
  return (
    <div className="border-t-2 border-metin pt-3" id={id}>
      <p className="t-etiket t-soluk">
        <span className="rakam text-metin">{no}</span> — {alt}
      </p>
      <h3 className="t-h2 mt-3">{children}</h3>
    </div>
  )
}

/* ───────────────────────── A · Gazete portalı ───────────────────────── */

function Gazete() {
  const [kat, setKat] = useState<(typeof KATEGORILER)[number]>('Hepsi')
  const liste = HABERLER.filter((h) => kat === 'Hepsi' || h.kat === kat)
  const [manset, ...digerleri] = liste
  return (
    <div data-gazete="">
      <AltBaslik no="A" id="gazete" alt="Gazete portalı">
        Sayfa bir
      </AltBaslik>
      <div className="mt-8">
        <Secim<(typeof KATEGORILER)[number]> legend="Bölüm" name="gazete-kat" value={kat} onChange={setKat} options={KATEGORILER.map((k) => ({ id: k, ad: k }))} />
      </div>
      <div key={kat} className="gecis g mt-8 gap-y-10" data-haber-say={liste.length}>
        {manset ? (
          <article className="col-span-4 border-t-4 border-metin pt-4 md:col-span-6" data-kol="1" data-manset={manset.id}>
            <p className="t-etiket t-soluk">
              {manset.kat} · <span className="rakam">{manset.saat}</span>
            </p>
            <h4 className="t-h1 mt-3 !text-[clamp(2rem,4.4vw,3.75rem)]">{manset.baslik}</h4>
            <p className="t-dek mt-4 max-w-[36ch]">{manset.ozet}</p>
            <OkBaglanti href="#gazete" className="mt-3">
              Haberin devamı
            </OkBaglanti>
          </article>
        ) : (
          <p className="col-span-4 md:col-span-6">Bu bölümde haber yok.</p>
        )}
        <ul className="col-span-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2 md:col-span-6 md:grid-cols-1 xl:grid-cols-2">
          {digerleri.map((h) => (
            <li key={h.id} className="border-t border-cizgi py-4">
              <p className="t-etiket t-soluk">
                {h.kat} · <span className="rakam">{h.saat}</span>
              </p>
              <h4 className="t-h3 mt-2 !text-[1.375rem] [hyphens:auto] [overflow-wrap:anywhere]">{h.baslik}</h4>
              <p className="t-alt mt-2">{h.ozet}</p>
            </li>
          ))}
        </ul>
      </div>
      <p className="t-alt mt-6" aria-live="polite">
        <span className="rakam">{liste.length}</span> haber · {kat}
      </p>
    </div>
  )
}

/* ───────────────────────── B · Yayınevi kataloğu ───────────────────────── */

const SAYFA_BOYU = 5
type Sira = 'ad' | 'yil' | 'fiyat'

function Yayinevi() {
  const [kat, setKat] = useState<(typeof KITAP_KATEGORILERI)[number]>('Hepsi')
  const [sira, setSira] = useState<Sira>('ad')
  const [s, setS] = useState(1)
  const liste = KITAPLAR.filter((k) => kat === 'Hepsi' || k.kat === kat).sort((a, b) => (sira === 'ad' ? a.ad.localeCompare(b.ad, 'tr') : sira === 'yil' ? b.yil - a.yil : a.fiyat - b.fiyat))
  const toplam = Math.max(1, Math.ceil(liste.length / SAYFA_BOYU))
  const sayfa = Math.min(s, toplam)
  const dilim = liste.slice((sayfa - 1) * SAYFA_BOYU, sayfa * SAYFA_BOYU)
  return (
    <div data-yayinevi="">
      <AltBaslik no="B" id="yayinevi" alt="Yayınevi kataloğu">
        Yeni çıkanlar
      </AltBaslik>
      <div className="mt-8 flex flex-wrap items-start gap-x-12 gap-y-6">
        <Secim<(typeof KITAP_KATEGORILERI)[number]>
          legend="Tür"
          name="kitap-kat"
          value={kat}
          onChange={(v) => {
            setKat(v)
            setS(1)
          }}
          options={KITAP_KATEGORILERI.map((k) => ({ id: k, ad: k }))}
        />
        <Secim<Sira>
          legend="Sıralama"
          name="kitap-sira"
          value={sira}
          onChange={(v) => {
            setSira(v)
            setS(1)
          }}
          options={[
            { id: 'ad', ad: 'Ad' },
            { id: 'yil', ad: 'Yeni' },
            { id: 'fiyat', ad: 'Fiyat' },
          ]}
        />
      </div>
      <div key={`${kat}-${sira}-${sayfa}`} className="gecis mt-8 overflow-x-auto" role="region" aria-label="Kitap listesi" tabIndex={0}>
        <table className="tablo w-full min-w-[620px]" data-kitaplar="" data-kitap-say={dilim.length}>
          <caption className="sr-only">Yayınevi kataloğu</caption>
          <thead>
            <tr>
              {['Kitap', 'Tür', 'Yıl', 'Sayfa', 'Fiyat'].map((b) => (
                <th key={b} scope="col">
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dilim.map((k) => (
              <tr key={k.id} data-kitap={k.id}>
                <th scope="row">
                  {k.ad}
                  <span className="t-alt block font-normal">{k.yazar}</span>
                </th>
                <td>{k.kat}</td>
                <td className="rakam">{k.yil}</td>
                <td className="rakam">{k.sayfa}</td>
                <td className="rakam">{tl(k.fiyat)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <Pagination toplam={toplam} sayfa={sayfa} onChange={setS} etiket="Katalog sayfaları" />
        <p className="t-alt" aria-live="polite" data-katalog-durum={`${sayfa}|${toplam}|${liste.length}`}>
          Sayfa <span className="rakam">{sayfa}</span> / <span className="rakam">{toplam}</span> · <span className="rakam">{liste.length}</span> kitap
        </p>
      </div>
    </div>
  )
}

/* ───────────────────────── C · Kurumsal bülten ───────────────────────── */

function Bulten() {
  const { duyur } = useEditorial()
  const [eposta, setEposta] = useState('')
  const [siklik, setSiklik] = useState<'haftalik' | 'aylik'>('haftalik')
  const [hata, setHata] = useState('')
  const [tamam, setTamam] = useState('')
  const gonder = (e: FormEvent) => {
    e.preventDefault()
    if (!EPOSTA.test(eposta)) {
      setHata('Geçerli bir e-posta adresi yazın.')
      setTamam('')
      duyur('E-posta geçersiz')
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-abone] input[aria-invalid="true"]')?.focus())
      return
    }
    setHata('')
    setTamam(`${eposta} adresine ${siklik === 'haftalik' ? 'haftalık' : 'aylık'} bülten gönderilecek.`)
    duyur('Kaydınız alındı')
  }
  return (
    <div data-bulten="">
      <AltBaslik no="C" id="bulten" alt="Kurumsal bülten">
        Tek sütunlu haber mektubu
      </AltBaslik>
      <div className="g mt-8 gap-y-10">
        <article className="kutu-koyu col-span-4 p-6 md:col-span-6 md:p-8" data-kol="1" data-bulten-onizleme="">
          <div className="flex items-baseline justify-between gap-4 border-b border-metin pb-3">
            <p className="text-[1.375rem] font-extrabold tracking-tight">KOLON BÜLTEN</p>
            <p className="t-etiket t-soluk rakam">Sayı {SAYI.no}</p>
          </div>
          <ol className="mt-2">
            {BULTEN.map((b, i) => (
              <li key={b.baslik} className="grid grid-cols-[2rem_1fr] gap-x-2 border-b border-cizgi py-5 last:border-b-0">
                <span className="rakam t-alt">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="t-h3 block !text-[1.375rem]">{b.baslik}</span>
                  <span className="t-alt mt-2 block">{b.ozet}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="t-alt border-t border-metin pt-3">Bu ileti yalnız abonelere gönderilir. Aboneliği istediğiniz an bitirebilirsiniz.</p>
        </article>
        <form className="col-span-4 grid content-start gap-6 md:col-span-4 md:col-start-9" noValidate onSubmit={gonder} data-abone="" data-kol="9">
          <p className="t-h3">Bültene yazılın</p>
          <Alan label="E-posta" hata={hata}>
            {(p) => <input className="alan" type="email" {...p} value={eposta} onChange={(e) => setEposta(e.target.value)} autoComplete="email" />}
          </Alan>
          <Secim<'haftalik' | 'aylik'>
            legend="Sıklık"
            name="bulten-siklik"
            value={siklik}
            onChange={setSiklik}
            options={[
              { id: 'haftalik', ad: 'Haftalık' },
              { id: 'aylik', ad: 'Aylık' },
            ]}
          />
          <div>
            <Buton type="submit" ton="dolu" ikon="ok-sag">
              Kaydol
            </Buton>
          </div>
          {tamam ? (
            <p role="status" className="border-t border-metin pt-3 text-[1.0625rem]" data-abone-tamam="">
              {tamam}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  )
}

/* ───────────────────────── D · Mimarlık ofisi ───────────────────────── */

type PAlan = 'ad' | 'yil' | 'alan'
export function Mimarlik() {
  const [alan, setAlan] = useState<PAlan>('yil')
  const [yon, setYon] = useState<'asc' | 'desc'>('desc')
  const [secili, setSecili] = useState('p1')
  const sirali = [...PROJELER].sort((a, b) => {
    const d = alan === 'ad' ? a.ad.localeCompare(b.ad, 'tr') : a[alan] - b[alan]
    return yon === 'asc' ? d : -d
  })
  const p = PROJELER.find((x) => x.id === secili) ?? PROJELER[0]
  const sirala = (a: PAlan) => {
    if (a === alan) setYon(yon === 'asc' ? 'desc' : 'asc')
    else {
      setAlan(a)
      setYon(a === 'ad' ? 'asc' : 'desc')
    }
  }
  const baslik = (a: PAlan, ad: string) => (
    <th scope="col" aria-sort={alan === a ? (yon === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" onClick={() => sirala(a)} data-sirala={a}>
        {ad}
        <Ikon ad={alan === a ? (yon === 'asc' ? 'ok-yukari' : 'ok-asagi') : 'ayrac'} className={cx('!size-4', alan !== a && 'opacity-60')} />
      </button>
    </th>
  )
  return (
    <div data-mimarlik="">
      <AltBaslik no="D" id="mimarlik" alt="Mimarlık ofisi">
        Proje dizini
      </AltBaslik>
      <div className="g mt-8 gap-y-10">
        <div className="col-span-4 overflow-x-auto md:col-span-8" role="region" aria-label="Proje dizini" tabIndex={0} data-kol="1">
          <table className="tablo w-full min-w-[560px]" data-projeler="">
            <caption className="sr-only">Proje dizini</caption>
            <thead>
              <tr>
                {baslik('ad', 'Proje')}
                <th scope="col">Tür</th>
                {baslik('yil', 'Yıl')}
                {baslik('alan', 'Alan (m²)')}
              </tr>
            </thead>
            <tbody>
              {sirali.map((x) => (
                <tr key={x.id} data-proje={x.id}>
                  <th scope="row">
                    <button type="button" className="block min-h-11 w-full text-left underline decoration-1 underline-offset-4" aria-pressed={secili === x.id} onClick={() => setSecili(x.id)} style={{ fontWeight: secili === x.id ? 800 : 600 }}>
                      {x.ad}
                    </button>
                  </th>
                  <td>{x.tur}</td>
                  <td className="rakam">{x.yil}</td>
                  <td className="rakam">{x.alan.toLocaleString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside key={p.id} className="gecis col-span-4 border-t-2 border-metin pt-4 md:col-span-4 md:col-start-9" data-kol="9" aria-label="Seçili proje" data-secili={p.id}>
          <p className="t-etiket t-soluk">Seçili proje</p>
          <h4 className="t-h2 mt-2">{p.ad}</h4>
          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6">
            {(
              [
                ['Yıl', String(p.yil)],
                ['Yer', p.yer],
                ['Tür', p.tur],
                ['Alan', `${p.alan.toLocaleString('tr-TR')} m²`],
                ['Ekip', p.ekip],
              ] as const
            ).map(([a, b]) => (
              <div key={a} className="col-span-2 grid grid-cols-subgrid border-t border-cizgi py-2.5">
                <dt className="t-etiket t-soluk">{a}</dt>
                <dd className="m-0 text-[1.0625rem]">{b}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  )
}

export function Alanlar() {
  return (
    <Bolum
      id="alanlar"
      no="08"
      madde="Madde 10 · Kullanım alanları"
      baslik="Dört yayın"
      lead="Bir gazete portalı, bir yayınevi kataloğu, bir kurumsal bülten ve bir mimarlık ofisinin proje dizini. Hepsi aynı on iki kolonun üstünde durur; yalnız metnin miktarı değişir."
      not="* Sahneler kurgudur; yayınevi, kitap ve proje adları gerçek değildir."
    >
      <EditorialContainer izgara={false}>
        <div className="grid grid-cols-1 gap-y-[clamp(72px,9vw,140px)]">
          <Gazete />
          <Yayinevi />
          <Bulten />
          <Mimarlik />
        </div>
      </EditorialContainer>
    </Bolum>
  )
}
