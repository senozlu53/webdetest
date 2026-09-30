import { useState, type FormEvent, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { Degisken } from '../components/Degisken'
import { EksenBaslik, type Harita } from '../components/EksenBaslik'
import { Alan, Bolum, Buton, Glif, KENAR } from '../components/ui'
import { GUNLER, ISLER, MODA, PROGRAM, YAZILAR } from '../lib/data'
import { useVariable } from '../lib/store'

const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const tl = (n: number) => `₺${n.toLocaleString('tr-TR')}`

function AltBaslik({ no, id, children, alt }: { no: string; id: string; children: ReactNode; alt?: string }) {
  return (
    <div className="border-t-2 border-metin pt-6" id={id}>
      <p className="kicker">
        <span className="rakam text-[15px] text-metin">{no}</span> — {alt}
      </p>
      <h3 className="mt-3 text-[clamp(30px,4.4vw,60px)]" style={{ fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 60" }}>
        {children}
      </h3>
    </div>
  )
}

/* ───────────────────────── Moda ───────────────────────── */

const MODA_HARITA: Record<string, Harita> = {
  kivrim: { x: [{ v: '--wdth', min: 25, max: 151 }], y: [{ v: '--wght', min: 100, max: 1000, ters: true }], dinlenme: { '--wdth': 100, '--wght': 500 } },
  yirtik: { x: [{ v: '--slnt', min: 0, max: -10 }], y: [{ v: '--wght', min: 100, max: 1000, ters: true }], dinlenme: { '--slnt': 0, '--wght': 300 } },
  gerilim: { x: [{ v: '--wdth', min: 151, max: 25 }], y: [{ v: '--wght', min: 100, max: 1000, ters: true }], dinlenme: { '--wdth': 100, '--wght': 700 } },
  sarkma: {
    x: [
      { v: '--soft', min: 0, max: 100 },
      { v: '--wonk', min: 0, max: 1 },
    ],
    y: [{ v: '--wght', min: 100, max: 900, ters: true }],
    dinlenme: { '--soft': 0, '--wonk': 0, '--wght': 400 },
  },
}

function Moda() {
  const { duyur } = useVariable()
  const [ayrilan, setAyrilan] = useState<string[]>([])
  const toplam = ayrilan.reduce((a, id) => a + (MODA.find((m) => m.id === id)?.fiyat ?? 0), 0)
  const degistir = (id: string) => {
    const m = MODA.find((x) => x.id === id)!
    setAyrilan((s) => {
      const var_ = s.includes(id)
      duyur(`${m.ad} ${var_ ? 'listeden çıkarıldı' : 'listeye eklendi'}`)
      return var_ ? s.filter((x) => x !== id) : [...s, id]
    })
  }
  return (
    <div data-moda="">
      <AltBaslik no="A" id="moda" alt="Deneysel moda sitesi">
        Sezon 35: bükülmüş kumaş
      </AltBaslik>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MODA.map((m) => {
          const on = ayrilan.includes(m.id)
          return (
            <div key={m.id} className="flex flex-col gap-3" data-urun={m.id}>
              <EksenBaslik metin={m.ad} aile={m.id === 'sarkma' ? 'fra' : 'flex'} harita={MODA_HARITA[m.id]} alt={m.tur} boy="clamp(38px, 5.2vw, 76px)" ad={`moda-${m.id}`} className="min-h-[280px]" />
              <p className="text-[15px] text-soluk">{m.not}</p>
              <div className="mt-auto flex items-center justify-between gap-3">
                <span className="rakam text-[20px]">{tl(m.fiyat)}</span>
                <Buton aria-pressed={on} onClick={() => degistir(m.id)} glif={on ? '•' : '+'} aria-label={`${m.ad}: ${on ? 'listeden çıkar' : 'listeye ekle'}`}>
                  {on ? 'Listede' : 'Ayır'}
                </Buton>
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-6 text-[17px]" data-liste-ozet={toplam} aria-live="polite">
        <span className="rakam" data-liste-adet={ayrilan.length}>
          {ayrilan.length}
        </span>{' '}
        parça · <span className="rakam">{tl(toplam)}</span>
      </p>
    </div>
  )
}

/* ───────────────────────── Bienal ───────────────────────── */

function Bienal() {
  const { duyur } = useVariable()
  const [gun, setGun] = useState<(typeof GUNLER)[number]>('Hepsi')
  const [kayit, setKayit] = useState<string[]>([])
  const satirlar = PROGRAM.filter((p) => gun === 'Hepsi' || p.gun === gun)
  return (
    <div data-bienal="">
      <AltBaslik no="B" id="bienal" alt="Mimarlık bienali">
        Bükülen zemin
      </AltBaslik>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Gün süzgeci">
          {GUNLER.map((g) => (
            <Buton key={g} aria-pressed={gun === g} onClick={() => setGun(g)} data-gun={g}>
              {g}
            </Buton>
          ))}
        </div>
        <p className="rakam text-[15px]" data-etkinlik-say={satirlar.length} aria-live="polite">
          <Glif g="#" /> {satirlar.length} etkinlik · {kayit.length} kayıtlı
        </p>
      </div>
      <div className="mt-4 overflow-x-auto" role="region" aria-label="Bienal programı" tabIndex={0}>
        <table className="tablo w-full min-w-[720px] border-collapse text-[16px]" data-program="">
          <caption className="sr-only">Bienal programı</caption>
          <thead>
            <tr>
              {['Gün', 'Saat', 'Yer', 'Etkinlik', 'Tür', 'Kayıt'].map((b) => (
                <th key={b} scope="col">
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {satirlar.map((p) => {
              const id = p.gun + p.saat
              const on = kayit.includes(id)
              return (
                <tr key={id} data-satir={id}>
                  <th scope="row">{p.gun}</th>
                  <td className="rakam text-[15px]">{p.saat}</td>
                  <td className="rakam text-[15px]">{p.yer}</td>
                  <td className="text-[17px]" style={{ fontFamily: 'var(--font-rec)', fontVariationSettings: "'wght' 500, 'CASL' 0, 'MONO' 0" }}>
                    {p.ad}
                  </td>
                  <td>{p.tur}</td>
                  <td>
                    <Buton
                      aria-pressed={on}
                      aria-label={`${p.ad}: ${on ? 'kaydı kaldır' : 'kaydet'}`}
                      glif={on ? '•' : '+'}
                      onClick={() => {
                        setKayit((s) => (on ? s.filter((x) => x !== id) : [...s, id]))
                        duyur(on ? 'Kayıt kaldırıldı' : 'Kaydedildi')
                      }}
                    >
                      {on ? 'Kayıtlı' : 'Kaydet'}
                    </Buton>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ───────────────────────── Dergi ───────────────────────── */

function Dergi() {
  const { duyur } = useVariable()
  const [acik, setAcik] = useState<string | null>(null)
  const [eposta, setEposta] = useState('')
  const [hata, setHata] = useState('')
  const [tamam, setTamam] = useState(false)
  return (
    <div data-dergi="">
      <AltBaslik no="C" id="dergi" alt="Bağımsız tasarım dergisi">
        Sayı otuz beş
      </AltBaslik>
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <EksenBaslik
            metin="35"
            aile="fra"
            uz={4}
            alt="Kapak · imleçle çevirin"
            boy="clamp(120px, 22vw, 320px)"
            ad="dergi-kapak"
            className="min-h-[340px]"
            harita={{
              x: [
                { v: '--soft', min: 0, max: 100 },
                { v: '--wonk', min: 0, max: 1 },
              ],
              y: [
                { v: '--wght', min: 100, max: 900, ters: true },
                { v: '--opsz', min: 144, max: 9 },
              ],
              dinlenme: { '--soft': 100, '--wonk': 1, '--wght': 600, '--opsz': 144 },
            }}
          />
        </div>
        <ol className="lg:col-span-7" data-yazilar="">
          {YAZILAR.map((y) => {
            const on = acik === y.no
            return (
              <li key={y.no} className="border-t border-hat">
                <h4 className="m-0">
                  <button type="button" aria-expanded={on} aria-controls={`yazi-${y.no}`} onClick={() => setAcik(on ? null : y.no)} data-yazi={y.no} className="grid min-h-[72px] w-full grid-cols-[3rem_1fr_auto] items-baseline gap-x-3 border-0 bg-transparent py-4 text-left">
                    <span className="rakam text-[15px] text-soluk">{y.no}</span>
                    <span className="text-[clamp(32px,3.6vw,48px)] leading-[1] font-normal" style={{ fontFamily: 'var(--font-fra)', fontVariationSettings: "'wght' 600, 'opsz' 96" }}>
                      {y.baslik}
                    </span>
                    <Glif g={on ? '−' : '+'} className="text-[24px]" />
                  </button>
                </h4>
                <div id={`yazi-${y.no}`} hidden={!on} className="pb-5 pl-[3.75rem]">
                  <p className="max-w-[52ch] text-[17px]">{y.ozet}</p>
                  <p className="kicker mt-2">
                    {y.yazar} · {y.dk} dk
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
        <form
          className="grid grid-cols-1 gap-4 lg:col-span-7 lg:col-start-6 lg:grid-cols-[1fr_auto] lg:items-end"
          noValidate
          data-abone=""
          onSubmit={(e: FormEvent) => {
            e.preventDefault()
            if (!EPOSTA.test(eposta)) {
              setHata('Geçerli bir e-posta adresi yazın.')
              setTamam(false)
              duyur('E-posta geçersiz')
              return
            }
            setHata('')
            setTamam(true)
            duyur('Kayıt alındı')
          }}
        >
          <Alan label="Sonraki sayı için e-posta" hata={hata}>
            {(p) => <input className="alan" type="email" {...p} value={eposta} onChange={(e) => setEposta(e.target.value)} autoComplete="email" />}
          </Alan>
          <Buton type="submit" ton="patlama" glif="&">
            Haber ver
          </Buton>
        </form>
        {tamam ? (
          <p className="text-[18px] lg:col-span-7 lg:col-start-6" role="status" data-abone-tamam="">
            Kaydınız alındı. Sayı 36 çıkınca haber vereceğiz.
          </p>
        ) : null}
      </div>
    </div>
  )
}

/* ───────────────────────── Kişisel site ───────────────────────── */

function Kisisel() {
  const { duyur } = useVariable()
  const [ad, setAd] = useState('')
  const [eposta, setEposta] = useState('')
  const [mesaj, setMesaj] = useState('')
  const [hata, setHata] = useState<{ ad?: string; eposta?: string; mesaj?: string }>({})
  const [tamam, setTamam] = useState('')
  const gonder = (e: FormEvent) => {
    e.preventDefault()
    const h: typeof hata = {}
    if (ad.trim().length < 3) h.ad = 'Adınızı yazın (en az 3 harf).'
    if (!EPOSTA.test(eposta)) h.eposta = 'Geçerli bir e-posta adresi yazın.'
    if (mesaj.trim().length < 10) h.mesaj = 'Birkaç cümle yazın (en az 10 karakter).'
    setHata(h)
    setTamam('')
    if (h.ad || h.eposta || h.mesaj) {
      duyur('Form eksik: ' + Object.values(h).join(' '))
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-iletisim] [aria-invalid="true"]')?.focus())
      return
    }
    setTamam(`${ad.trim()}, iletiniz alındı. Bir hafta içinde dönerim.`)
    duyur('İleti alındı')
  }
  return (
    <div data-kisisel="">
      <AltBaslik no="D" id="kisisel" alt="Tasarımcının kişisel sitesi">
        Ece Yılmaz
      </AltBaslik>
      <div className="mt-6 overflow-x-clip" data-isim="">
        <Degisken metin="Ece Yılmaz" boy="clamp(50px, 15vw, 230px)" k={0.7} ad="kisisel-isim" />
      </div>
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
        <ol className="lg:col-span-6" data-isler="">
          {ISLER.map((i, n) => (
            <li key={i.ad} className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 border-t border-hat py-3">
              <span className="rakam text-[14px] text-soluk">{String(n + 1).padStart(2, '0')}</span>
              <span className="text-[clamp(22px,2.6vw,34px)] leading-[1.05]" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 700, 'wdth' 100, 'opsz' 60" }}>
                {i.ad}
              </span>
              <span className="rakam text-[14px] text-soluk">
                {i.tur} · {i.yil}
              </span>
            </li>
          ))}
        </ol>
        <form className="grid grid-cols-1 content-start gap-5 lg:col-span-6" onSubmit={gonder} noValidate data-iletisim="">
          <p className="kicker">
            <Glif g="@" /> İletişim
          </p>
          <Alan label="Ad soyad" hata={hata.ad}>
            {(p) => <input className="alan" {...p} value={ad} onChange={(e) => setAd(e.target.value)} autoComplete="name" />}
          </Alan>
          <Alan label="E-posta" hata={hata.eposta}>
            {(p) => <input className="alan" type="email" {...p} value={eposta} onChange={(e) => setEposta(e.target.value)} autoComplete="email" />}
          </Alan>
          <Alan label="İleti" hata={hata.mesaj}>
            {(p) => <textarea className="alan min-h-28" {...p} value={mesaj} onChange={(e) => setMesaj(e.target.value)} rows={3} />}
          </Alan>
          <div>
            <Buton type="submit" ton="patlama" glif="↓">
              Gönder
            </Buton>
          </div>
          {tamam ? (
            <p className={cx('text-[18px]')} role="status" data-iletisim-tamam="">
              {tamam}
            </p>
          ) : null}
        </form>
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
      baslik="Dört sahne"
      vurgulu={[1]}
      lead="Deneysel moda sitesi, mimarlık bienali, bağımsız tasarım dergisi ve bir tasarımcının kişisel sitesi. Dev başlıklar kartın içinde imleçle bükülür; program, fiyat, özet ve form metni ise sabit ve okunaklı kalır."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-y-[clamp(72px,9vw,140px)]`}>
        <Moda />
        <Bienal />
        <Dergi />
        <Kisisel />
      </div>
    </Bolum>
  )
}
