import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Dialog } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useQuiet } from '../lib/store'
import { ANA_MAKALE, ESERLER, MAKALELER, ODALAR, PROJELER, URUNLER, type Konu, type ProjeTur, type Teknik } from '../lib/data'
import { Gorsel, SAHNE_AD, type SahneAd } from '../components/Gorsel'
import { Ikon } from '../components/Ikon'
import { EditorialGrid, Kolon, QuietButton } from '../components/Quiet'
import { Belir, Secim, Section } from '../components/ui'

const tl = (n: number) => `${Math.round(n).toLocaleString('tr-TR')} ₺`

/* ───────────────────────── Galeri (tam ekran imaj galerisi) ───────────────────────── */

const SLAYTLAR: { sahne: SahneAd; baslik: string; not: string }[] = [
  { sahne: 'duvar', baslik: 'Sabah, güney cephesi', not: 'Beton ve tek pencere. Işık günün saatine göre duvarı boydan boya gezer.' },
  { sahne: 'kumsal', baslik: 'Kum tepeleri', not: 'Ada Pavyonu’ndan çıkınca ilk görülen sahil; rüzgârın çizdiği tek çizgi.' },
  { sahne: 'seramik', baslik: 'Üç kap', not: 'Kil Atölyesi’nin ilk yıl ürünleri; sırsız gövde, ateş rengi.' },
  { sahne: 'oda', baslik: 'Avlu odası', not: 'Keten yatak takımı, kireç sıva, kuzey penceresi. Fazlası yok.' },
  { sahne: 'kemer', baslik: 'Öğle, kemerler', not: 'Sessiz Han’ın avlusu; sıva rengi günün saatiyle değişir.' },
  { sahne: 'cephe', baslik: 'Taş cephe', not: 'Kuru Taş Evi; yerel taş, derin söveler, dikey pencereler.' },
]

/** Madde 11: tam ekran imaj galerisi. Yavaş çapraz solma, klavye ok tuşları, tam ekran görünüm */
export function Galeri() {
  const { duyur } = useQuiet()
  const [i, setI] = useState(0)
  const [tam, setTam] = useState(false)
  const sn = SLAYTLAR.length
  const git = (y: number) => {
    const k = (y + sn) % sn
    setI(k)
    duyur(`${k + 1} / ${sn}: ${SLAYTLAR[k].baslik}`)
  }
  const tus = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') git(i + 1)
    else if (e.key === 'ArrowLeft') git(i - 1)
  }
  const no = String(i + 1).padStart(2, '0')
  return (
    <section id="galeri" aria-labelledby="galeri-b" className="w-full scroll-mt-16" style={{ paddingBlock: 'var(--bolum)' }}>
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <Belir>
          <div className="grid grid-cols-1 gap-x-[var(--oluk)] gap-y-8 md:grid-cols-12">
            <p className="kicker md:col-span-3">Madde 11 · İmaj galerisi</p>
            <div className="md:col-span-9">
              <h2 id="galeri-b" className="buyuk text-[clamp(38px,6.4vw,92px)]">
                Kenardan kenara
              </h2>
              <p className="mt-8 max-w-[58ch] text-[clamp(16px,1.3vw,18px)] text-soluk">Az sayıda görsel, ama sayfanın tam genişliğinde. Geçiş 1,6 saniyelik yavaş bir çapraz solma; ok tuşlarıyla ya da düğmelerle gezilir, tam ekranda büyür.</p>
            </div>
          </div>
        </Belir>
      </div>
      <div className="mt-[var(--aralik)] w-full" role="group" aria-roledescription="galeri" aria-label="İmaj galerisi" tabIndex={0} onKeyDown={tus} data-galeri={i}>
        <div className="relative w-full overflow-hidden bg-kum" style={{ aspectRatio: '16 / 8', minHeight: 240, maxHeight: '82vh' }}>
          {SLAYTLAR.map((s, k) => (
            <div
              key={s.sahne}
              role="group"
              aria-roledescription="slayt"
              aria-label={`${k + 1} / ${sn}: ${s.baslik}`}
              aria-hidden={k !== i}
              className="absolute inset-0"
              style={{ opacity: k === i ? 1 : 0, transition: 'opacity 1600ms cubic-bezier(0.22, 0.61, 0.36, 1)' }}
              data-slayt={k}
              data-aktif={k === i ? '' : undefined}
            >
              <Gorsel sahne={s.sahne} etiket={s.baslik} />
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-8 w-full max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-x-[var(--oluk)] gap-y-8 md:grid-cols-12">
          <div className="md:col-span-2">
            <p className="rakam text-[clamp(34px,4vw,56px)] leading-none" data-galeri-no={i} aria-hidden="true">
              {no}
              <span className="text-[0.5em] text-soluk"> / {String(sn).padStart(2, '0')}</span>
            </p>
          </div>
          <div className="md:col-span-5">
            <p className="font-serif text-[clamp(26px,2.6vw,36px)] leading-tight" data-galeri-baslik="">
              {SLAYTLAR[i].baslik}
            </p>
            <p className="mt-2 max-w-[44ch] text-[15px] text-soluk">{SLAYTLAR[i].not}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:col-span-5 md:justify-end">
            <QuietButton boy="k" aria-label="Önceki görsel" onClick={() => git(i - 1)} ikon={<Ikon ad="geri" boyut={18} />} />
            <QuietButton boy="k" aria-label="Sonraki görsel" onClick={() => git(i + 1)} ikon={<Ikon ad="ok" boyut={18} />} />
            <Dialog.Root open={tam} onOpenChange={setTam}>
              <Dialog.Trigger asChild>
                <QuietButton varyant="metin" boy="k" ikon={<Ikon ad="buyut" boyut={18} />}>
                  Tam ekran
                </QuietButton>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Content className="fixed inset-0 z-[120] flex flex-col bg-zemin text-metin outline-none" data-galeri-tam="" onKeyDown={tus} aria-describedby={undefined}>
                  <div className="flex items-center justify-between gap-6 px-5 py-4 sm:px-8">
                    <Dialog.Title className="font-serif text-[22px]">
                      {no} / {String(sn).padStart(2, '0')} · {SLAYTLAR[i].baslik}
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <QuietButton varyant="metin" boy="k" ikon={<Ikon ad="kapat" boyut={18} />}>
                        Kapat
                      </QuietButton>
                    </Dialog.Close>
                  </div>
                  <div className="relative min-h-0 flex-1">
                    <Gorsel sahne={SLAYTLAR[i].sahne} etiket={SLAYTLAR[i].baslik} konum="xMidYMid" />
                  </div>
                  <div className="flex items-center justify-between gap-6 px-5 py-4 sm:px-8">
                    <QuietButton boy="k" aria-label="Önceki görsel" onClick={() => git(i - 1)} ikon={<Ikon ad="geri" boyut={18} />} />
                    <p className="hidden text-[15px] text-soluk sm:block">{SLAYTLAR[i].not}</p>
                    <QuietButton boy="k" aria-label="Sonraki görsel" onClick={() => git(i + 1)} ikon={<Ikon ad="ok" boyut={18} />} />
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
        <ul className="m-0 mt-8 flex list-none flex-wrap gap-x-6 gap-y-0 p-0 md:gap-x-8" aria-label="Görsel seç">
          {SLAYTLAR.map((s, k) => (
            <li key={s.sahne}>
              <button type="button" onClick={() => git(k)} aria-current={k === i ? 'true' : undefined} className={cx('cip', k === i && '')} data-on={k === i ? '' : undefined} data-galeri-sec={k}>
                {String(k + 1).padStart(2, '0')}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ───────────────────────── Mimarlık ───────────────────────── */

/** Madde 10: mimarlık ofisi, proje dizini ve önizleme */
export function Mimari() {
  const [tur, setTur] = useState<'Tümü' | ProjeTur>('Tümü')
  const [secili, setSecili] = useState('kuru-tas')
  const liste = PROJELER.filter((p) => tur === 'Tümü' || p.tur === tur)
  const p = PROJELER.find((x) => x.id === secili) ?? liste[0]
  return (
    <Section id="mimari" madde="Madde 10 · Mimarlık ofisi" title="Ardıç Mimarlık" lead="Proje dizini tablo gibi okunur: sıra, ad, yer, yıl. Bir satırı seçtiğinizde sağdaki görsel ve not değişir. Vurgu yok, ikon yok, yalnız ölçü.">
      <div className="mb-12">
        <Secim<'Tümü' | ProjeTur>
          legend="Tür"
          name="mim-tur"
          value={tur}
          onChange={setTur}
          options={[
            { id: 'Tümü', ad: 'Tümü' },
            { id: 'Konut', ad: 'Konut' },
            { id: 'Otel', ad: 'Otel' },
            { id: 'Kültür', ad: 'Kültür' },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 gap-x-[var(--oluk)] gap-y-12 lg:grid-cols-12">
        <ul className="m-0 list-none border-b border-[var(--cizgi)] p-0 lg:col-span-7" data-proje-liste={liste.length}>
          {liste.map((x) => {
            const on = x.id === p?.id
            return (
              <li key={x.id} className="border-t border-[var(--cizgi)]">
                <button
                  type="button"
                  onClick={() => setSecili(x.id)}
                  aria-pressed={on}
                  data-proje={x.id}
                  className={cx('grid min-h-[72px] w-full grid-cols-[2.2rem_1fr_auto] items-baseline gap-x-4 gap-y-1 py-5 text-left transition-colors duration-500 sm:grid-cols-[3rem_1.4fr_1fr_4.5rem_5.5rem]', on ? 'text-metin' : 'text-soluk hover:text-metin')}
                >
                  <span className="rakam text-[16px]">{x.no}</span>
                  <span className={cx('font-serif text-[clamp(24px,2.4vw,32px)] leading-tight', on && 'underline decoration-1 underline-offset-[7px]')}>{x.ad}</span>
                  <span className="text-right text-[14px] sm:text-left">{x.yer}</span>
                  <span className="hidden text-[14px] tabular-nums sm:block">{x.yil}</span>
                  <span className="hidden text-right text-[14px] tabular-nums sm:block">{x.alan}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="lg:col-span-5">
          {p ? (
            <div className="lg:sticky lg:top-20" data-proje-onizleme={p.id}>
              <div className="gorsel aspect-[4/5]">
                <Gorsel sahne={p.sahne} etiket={`${p.ad}, ${SAHNE_AD[p.sahne]}`} />
              </div>
              <p className="kicker mt-5">
                {p.tur} · {p.yil} · {p.alan}
              </p>
              <p className="mt-2 font-serif text-[clamp(28px,3vw,40px)] leading-tight">{p.ad}</p>
              <p className="mt-3 max-w-[44ch] text-[15px] text-soluk">{p.not}</p>
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Koleksiyon ───────────────────────── */

/** Madde 10: özel sanat koleksiyonu */
export function Koleksiyon() {
  const { duyur } = useQuiet()
  const [teknik, setTeknik] = useState<'Tümü' | Teknik>('Tümü')
  const [fav, setFav] = useState<string[]>([])
  const [talep, setTalep] = useState<string[]>([])
  const [acik, setAcik] = useState<string | null>(null)
  const liste = ESERLER.filter((e) => teknik === 'Tümü' || e.teknik === teknik)
  const eser = ESERLER.find((e) => e.id === acik)
  const favDegis = (id: string, ad: string) =>
    setFav((f) => {
      const yeni = f.includes(id) ? f.filter((x) => x !== id) : [...f, id]
      duyur(f.includes(id) ? `${ad} favorilerden çıkarıldı` : `${ad} favorilere eklendi`)
      return yeni
    })
  return (
    <Section id="koleksiyon" madde="Madde 10 · Sanat koleksiyonu" title="Ardıç Koleksiyon" lead="Katalog numarası, ad, sanatçı; başka bir şey yok. Bir esere tıklayınca ölçüler ve baskı bilgisi tam ekran bir panelde açılır. Favoriler yalnız bu oturumda tutulur.">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <Secim<'Tümü' | Teknik>
          legend="Teknik"
          name="kol-teknik"
          value={teknik}
          onChange={setTeknik}
          options={[
            { id: 'Tümü', ad: 'Tümü' },
            { id: 'Resim', ad: 'Resim' },
            { id: 'Fotoğraf', ad: 'Fotoğraf' },
            { id: 'Heykel', ad: 'Heykel' },
            { id: 'Seramik', ad: 'Seramik' },
          ]}
        />
        <p className="text-[15px] text-soluk" aria-live="polite">
          <span data-eser-sayi={liste.length}>{liste.length} eser</span> · <span data-fav={fav.length}>{fav.length} favori</span>
        </p>
      </div>
      <ul className="m-0 grid list-none grid-cols-2 items-end gap-x-[var(--oluk)] gap-y-[calc(var(--aralik)*0.6)] p-0 lg:grid-cols-4" data-eserler="">
        {liste.map((e, i) => (
          <Belir as="li" key={e.id} className="min-w-0">
            <button type="button" onClick={() => setAcik(e.id)} className="block w-full text-left" data-eser={e.id} aria-haspopup="dialog" aria-label={`${e.ad}, ${e.sanatci}, ayrıntıyı aç`}>
              <div className="gorsel" style={{ aspectRatio: i % 3 === 1 ? '3 / 2' : '4 / 5' }}>
                <Gorsel sahne={e.sahne} />
              </div>
              <p className="kicker mt-4 !text-[10.5px]">{e.no}</p>
              <p className="mt-1 font-serif text-[clamp(20px,2vw,26px)] leading-tight">{e.ad}</p>
              <p className="text-[14px] text-soluk">{e.sanatci}</p>
            </button>
          </Belir>
        ))}
      </ul>
      <Dialog.Root open={!!eser} onOpenChange={(o) => !o && setAcik(null)}>
        <Dialog.Portal>
          <Dialog.Content className="fixed inset-0 z-[120] overflow-y-auto bg-zemin text-metin outline-none" aria-describedby={undefined} data-eser-panel={eser?.id}>
            {eser ? (
              <div className="mx-auto grid min-h-full max-w-[1320px] grid-cols-1 gap-x-[var(--oluk)] gap-y-8 px-5 py-8 sm:px-8 lg:grid-cols-12 lg:px-12">
                <div className="gorsel aspect-[4/5] max-h-[80vh] w-full lg:col-span-7 lg:aspect-auto lg:h-[calc(100vh-4rem)]">
                  <Gorsel sahne={eser.sahne} etiket={`${eser.ad}, ${SAHNE_AD[eser.sahne]}`} />
                </div>
                <div className="flex flex-col justify-between gap-10 lg:col-span-5">
                  <div className="flex justify-end">
                    <Dialog.Close asChild>
                      <QuietButton varyant="metin" boy="k" ikon={<Ikon ad="kapat" boyut={18} />}>
                        Kapat
                      </QuietButton>
                    </Dialog.Close>
                  </div>
                  <div>
                    <p className="kicker">
                      {eser.no} · {eser.teknik}
                    </p>
                    <Dialog.Title className="buyuk mt-4 text-[clamp(38px,5vw,68px)]">{eser.ad}</Dialog.Title>
                    <p className="mt-4 font-serif text-[24px] italic">
                      {eser.sanatci}, {eser.yil}
                    </p>
                    <dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 border-t border-[var(--cizgi)] pt-6 text-[15px]">
                      <dt className="text-soluk">Ölçü</dt>
                      <dd className="m-0">{eser.olcu}</dd>
                      <dt className="text-soluk">Bilgi</dt>
                      <dd className="m-0">{eser.not}</dd>
                    </dl>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <QuietButton
                      varyant="dolu"
                      disabled={talep.includes(eser.id)}
                      onClick={() => {
                        setTalep((t) => [...t, eser.id])
                        duyur(`${eser.no} için bilgi talebi iletildi`)
                      }}
                      data-talep=""
                    >
                      {talep.includes(eser.id) ? 'Talep iletildi' : 'Bilgi talep et'}
                    </QuietButton>
                    <QuietButton varyant="metin" aria-pressed={fav.includes(eser.id)} onClick={() => favDegis(eser.id, eser.ad)} ikon={<Ikon ad="kalp" boyut={18} />} data-favori="">
                      {fav.includes(eser.id) ? 'Favoride' : 'Favorile'}
                    </QuietButton>
                  </div>
                </div>
              </div>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Section>
  )
}

/* ───────────────────────── Otel ───────────────────────── */

const gunFarki = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)

/** Madde 10: butik otel */
export function Otel() {
  const { duyur } = useQuiet()
  const [giris, setGiris] = useState('2026-10-16')
  const [cikis, setCikis] = useState('2026-10-19')
  const [misafir, setMisafir] = useState('2')
  const [oda, setOda] = useState('avlu')
  const [hata, setHata] = useState<Record<string, string>>({})
  const [sonuc, setSonuc] = useState('')
  const r = { giris: useRef<HTMLInputElement>(null), cikis: useRef<HTMLInputElement>(null) }
  const secili = ODALAR.find((o) => o.id === oda)!
  const gece = gunFarki(giris, cikis)
  const sorgula = (e: FormEvent) => {
    e.preventDefault()
    const h: Record<string, string> = {}
    if (!giris) h.giris = 'Varış tarihini seçin.'
    if (!cikis) h.cikis = 'Ayrılış tarihini seçin.'
    else if (giris && gece < 1) h.cikis = 'Ayrılış, varıştan en az bir gün sonra olmalı.'
    setHata(h)
    setSonuc('')
    const ilk = (['giris', 'cikis'] as const).find((k) => h[k])
    if (ilk) {
      r[ilk].current?.focus()
      return
    }
    const m = `${secili.ad} müsait: ${gece} gece, ${misafir} misafir, toplam ${tl(gece * secili.fiyat)}.`
    setSonuc(m)
    duyur(m)
  }
  const ah = (k: string) => (hata[k] ? { 'aria-invalid': true as const, 'aria-describedby': `ot-${k}-h` } : {})
  return (
    <Section id="otel" madde="Madde 10 · Butik otel" title="Ardıç Han" lead="Üç oda, üç ışık. Her oda görselle başlar, yazıyla sonlanır; fiyat sessizce sağda durur. Aşağıda müsaitlik sorgulanabilir. Otel ve fiyatlar kurgudur.">
      <div className="grid grid-cols-1 gap-y-[var(--aralik)]">
        {ODALAR.map((o, i) => (
          <EditorialGrid key={o.id} aralik={false} className="items-end">
            <Kolon span={7} baslangic={i % 2 ? 6 : 1} className={cx(i % 2 === 1 && 'md:order-2')}>
              <div className="gorsel aspect-[3/2]" data-oda-gorsel={o.id}>
                <Gorsel sahne={o.sahne} />
              </div>
            </Kolon>
            <Kolon span={4} baslangic={i % 2 ? 1 : 9} className={cx(i % 2 === 1 && 'md:order-1')}>
              <p className="kicker">
                {String(i + 1).padStart(2, '0')} · {o.m2} m²
              </p>
              <h3 className="mt-4 text-[clamp(30px,3.4vw,46px)]">{o.ad}</h3>
              <p className="mt-4 max-w-[38ch] text-[15px] text-soluk">{o.not}</p>
              <p className="rakam mt-6 text-[26px]">
                {tl(o.fiyat)} <span className="font-sans text-[12px] tracking-[0.2em] text-soluk uppercase">/ gece</span>
              </p>
              <QuietButton
                varyant="metin"
                className="mt-2"
                onClick={() => {
                  setOda(o.id)
                  document.getElementById('ot-form')?.scrollIntoView({ block: 'center' })
                }}
                data-oda-sec={o.id}
                ikon={<Ikon ad="ok" boyut={18} />}
              >
                Bu odayı seç
              </QuietButton>
            </Kolon>
          </EditorialGrid>
        ))}
      </div>

      <form id="ot-form" onSubmit={sorgula} noValidate className="mt-[var(--aralik)] border-t border-[var(--cizgi)] pt-14" aria-label="Müsaitlik sorgula" data-otel-form="">
        <h3 className="text-[clamp(28px,3vw,40px)]">Müsaitlik</h3>
        <div className="mt-10 grid grid-cols-1 gap-x-[var(--oluk)] gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="ot-giris" className="etiket block">
              Varış
            </label>
            <input ref={r.giris} id="ot-giris" type="date" className="alan" value={giris} onChange={(e) => setGiris(e.target.value)} {...ah('giris')} />
            {hata.giris ? (
              <p id="ot-giris-h" role="alert" className="mt-2 text-[14px] font-medium">
                {hata.giris}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="ot-cikis" className="etiket block">
              Ayrılış
            </label>
            <input ref={r.cikis} id="ot-cikis" type="date" className="alan" value={cikis} min={giris} onChange={(e) => setCikis(e.target.value)} {...ah('cikis')} />
            {hata.cikis ? (
              <p id="ot-cikis-h" role="alert" className="mt-2 text-[14px] font-medium">
                {hata.cikis}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="ot-misafir" className="etiket block">
              Misafir
            </label>
            <select id="ot-misafir" className="alan" value={misafir} onChange={(e) => setMisafir(e.target.value)}>
              {['1', '2', '3', '4'].map((m) => (
                <option key={m} value={m}>
                  {m} kişi
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ot-oda" className="etiket block">
              Oda
            </label>
            <select id="ot-oda" className="alan" value={oda} onChange={(e) => setOda(e.target.value)}>
              {ODALAR.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.ad}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
          <QuietButton varyant="dolu" boy="b" type="submit">
            Müsaitliği sorgula
          </QuietButton>
          <p className="text-[15px] text-soluk" data-otel-ozet="">
            {gece > 0 ? `${gece} gece · ${tl(gece * secili.fiyat)}` : 'Tarihleri seçin'}
          </p>
        </div>
        {sonuc ? (
          <p className="mt-8 max-w-[60ch] border-l border-metin pl-5 font-serif text-[22px] leading-snug" role="status" data-otel-sonuc="" data-toplam={gece * secili.fiyat}>
            {sonuc}
          </p>
        ) : null}
      </form>
    </Section>
  )
}

/* ───────────────────────── Mağaza ───────────────────────── */

/** Madde 10: prestijli e-ticaret */
export function Magaza() {
  const { duyur } = useQuiet()
  const [renk, setRenk] = useState<Record<string, string>>({})
  const [sepet, setSepet] = useState<Record<string, number>>({})
  const anahtar = (id: string) => `${id}|${renk[id] ?? URUNLER.find((u) => u.id === id)!.renkler[0]}`
  const ekle = (id: string, ad: string) => {
    const k = anahtar(id)
    setSepet((s) => ({ ...s, [k]: Math.min(5, (s[k] ?? 0) + 1) }))
    duyur(`${ad} sepete eklendi`)
  }
  const degistir = (k: string, f: number) => setSepet((s) => ({ ...s, [k]: Math.max(0, Math.min(5, (s[k] ?? 0) + f)) }))
  const satirlar = Object.entries(sepet)
    .filter(([, n]) => n > 0)
    .map(([k, n]) => ({ k, n, u: URUNLER.find((u) => u.id === k.split('|')[0])!, renk: k.split('|')[1] }))
  const toplam = satirlar.reduce((t, s) => t + s.n * s.u.fiyat, 0)
  const adet = satirlar.reduce((t, s) => t + s.n, 0)
  return (
    <Section id="magaza" madde="Madde 10 · E-ticaret" title="Ardıç Mağaza" lead="Az ürün, çok görsel. Her ürün bir kare fotoğraf, bir ad, bir fiyat; seçenekler yalnız metin. Sepet, sağda sessizce durur. Ürünler ve fiyatlar kurgudur.">
      <div className="grid grid-cols-1 gap-x-[var(--oluk)] gap-y-[var(--aralik)] lg:grid-cols-12">
        <ul className="m-0 grid list-none grid-cols-1 gap-x-[var(--oluk)] gap-y-[calc(var(--aralik)*0.7)] p-0 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-3">
          {URUNLER.map((u) => (
            <Belir as="li" key={u.id} className="min-w-0">
              <div className="grid grid-cols-1 gap-4" data-urun={u.id}>
                <div className="gorsel aspect-[4/5]">
                  <Gorsel sahne={u.sahne} konum={u.konum} etiket={`${u.ad}, ${SAHNE_AD[u.sahne]}`} />
                </div>
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[clamp(22px,2vw,28px)]">{u.ad}</h3>
                    <p className="rakam shrink-0 text-[20px] whitespace-nowrap">{tl(u.fiyat)}</p>
                  </div>
                  <p className="mt-1 text-[14px] text-soluk">{u.not}</p>
                </div>
                <Secim<string> legend="Renk" name={`renk-${u.id}`} value={renk[u.id] ?? u.renkler[0]} onChange={(v) => setRenk((r) => ({ ...r, [u.id]: v }))} options={u.renkler.map((x) => ({ id: x, ad: x }))} gizli />
                <div>
                  <QuietButton boy="k" onClick={() => ekle(u.id, u.ad)} aria-label={`${u.ad} sepete ekle`}>
                    Sepete ekle
                  </QuietButton>
                </div>
              </div>
            </Belir>
          ))}
        </ul>
        <aside className="lg:sticky lg:top-20 lg:col-span-3 lg:self-start" aria-label="Sepet" data-sepet={adet}>
          <p className="kicker">Sepet · {adet} ürün</p>
          {satirlar.length ? (
            <ul className="m-0 mt-6 grid list-none gap-5 p-0" aria-live="polite">
              {satirlar.map((s) => (
                <li key={s.k} className="border-t border-[var(--cizgi)] pt-4" data-sepet-satir={s.k}>
                  <p className="font-serif text-[22px] leading-tight">{s.u.ad}</p>
                  <p className="text-[13px] text-soluk">
                    {s.renk} · {tl(s.u.fiyat)}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <QuietButton varyant="metin" boy="k" className="!min-w-12" aria-label={`${s.u.ad} azalt`} onClick={() => degistir(s.k, -1)} ikon={<Ikon ad="eksi" boyut={16} />} />
                    <span className="rakam min-w-[2ch] text-center text-[20px]" aria-label={`${s.n} adet`}>
                      {s.n}
                    </span>
                    <QuietButton varyant="metin" boy="k" className="!min-w-12" aria-label={`${s.u.ad} artır`} onClick={() => degistir(s.k, 1)} ikon={<Ikon ad="arti" boyut={16} />} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-[15px] text-soluk">Sepetiniz boş.</p>
          )}
          <div className="mt-6 border-t border-metin pt-4">
            <p className="kicker">Toplam</p>
            <p className="rakam text-[34px]" data-toplam={toplam}>
              {tl(toplam)}
            </p>
          </div>
          <div className="mt-5">
            <QuietButton varyant="dolu" boy="k" disabled={!adet} onClick={() => duyur(`Ödemeye geçiliyor: ${tl(toplam)}`)}>
              Ödemeye geç
            </QuietButton>
          </div>
        </aside>
      </div>
    </Section>
  )
}

/* ───────────────────────── Dergi ───────────────────────── */

/** Madde 11: editoryal makale listesi ve büyük başlık alanı */
export function Dergi() {
  const [konu, setKonu] = useState<'Tümü' | Konu>('Tümü')
  const [acik, setAcik] = useState<string | null>(null)
  const id = useId()
  const liste = MAKALELER.filter((m) => konu === 'Tümü' || m.konu === konu)
  return (
    <Section id="dergi" madde="Madde 11 · Editoryal" title="Ardıç Dergi" lead="Büyük bir başlık alanı, dar bir okuma sütunu, altında sade bir makale listesi. Liste satırları açılır; özet açıkken ‘Oku’ bağlantısı görünür. Yazılar kurgudur.">
      <EditorialGrid aralik={false}>
        <Kolon span={7}>
          <div className="gorsel aspect-[4/3]">
            <Gorsel sahne="kumas" />
          </div>
        </Kolon>
        <Kolon span={5} className="self-end">
          <p className="kicker">Mimari · 8 dk · Defne Aksoy</p>
          <h3 className="buyuk mt-5 text-[clamp(40px,5vw,72px)]">Boşluğun Mimarisi</h3>
        </Kolon>
        <Kolon span={5} baslangic={1} className="mt-[var(--aralik)]">
          <blockquote className="m-0 border-0 p-0">
            <p className="font-serif text-[clamp(28px,3vw,42px)] leading-[1.18] italic" data-alinti="">
              “Sessizlik, nesnelerin değil, aralarındaki mesafenin ölçüsüdür.”
            </p>
          </blockquote>
        </Kolon>
        <Kolon span={5} baslangic={7} className="mt-[var(--aralik)]">
          <div className="grid gap-6 font-serif text-[clamp(19px,1.7vw,22px)] leading-[1.75]" data-makale="">
            {ANA_MAKALE.map((p, k) => (
              <p key={k} className={cx(k === 0 && 'dropcap')}>
                {p}
              </p>
            ))}
          </div>
        </Kolon>
      </EditorialGrid>

      <div className="mt-[var(--aralik)]">
        <div className="mb-8">
          <Secim<'Tümü' | Konu>
            legend="Konu"
            name="dergi-konu"
            value={konu}
            onChange={setKonu}
            options={[
              { id: 'Tümü', ad: 'Tümü' },
              { id: 'Mimari', ad: 'Mimari' },
              { id: 'Kültür', ad: 'Kültür' },
              { id: 'Zanaat', ad: 'Zanaat' },
              { id: 'Sanat', ad: 'Sanat' },
            ]}
          />
        </div>
        <ul className="m-0 list-none border-b border-[var(--cizgi)] p-0" data-makale-liste={liste.length}>
          {liste.map((m) => {
            const on = acik === m.id
            return (
              <li key={m.id} className="border-t border-[var(--cizgi)]">
                <h4 className="!text-left">
                  <button type="button" aria-expanded={on} aria-controls={`${id}-${m.id}`} onClick={() => setAcik(on ? null : m.id)} className="grid min-h-[84px] w-full grid-cols-[2.4rem_1fr_auto] items-baseline gap-x-4 py-6 text-left sm:grid-cols-[4rem_1fr_9rem_5rem]" data-makale-satir={m.id}>
                    <span className="rakam text-[18px] text-soluk">{m.no}</span>
                    <span className="font-serif text-[clamp(26px,3vw,40px)] leading-tight normal-case">{m.baslik}</span>
                    <span className="hidden text-[13px] tracking-[0.18em] text-soluk uppercase sm:block">{m.konu}</span>
                    <span className="text-right text-[13px] text-soluk tabular-nums">{m.sure} dk</span>
                  </button>
                </h4>
                {on ? (
                  <div id={`${id}-${m.id}`} className="grid grid-cols-1 gap-x-[var(--oluk)] gap-y-5 pb-10 sm:grid-cols-[4rem_1fr] " data-makale-ozet={m.id}>
                    <span />
                    <div>
                      <p className="max-w-[54ch] font-serif text-[22px] leading-[1.6]">{m.ozet}</p>
                      <p className="mt-3 text-[14px] text-soluk">{m.yazar}</p>
                      <QuietButton varyant="metin" className="mt-4" ikon={<Ikon ad="ok" boyut={18} />}>
                        Oku
                      </QuietButton>
                    </div>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
