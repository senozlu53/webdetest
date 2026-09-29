import { useId, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Dialog, Tabs } from 'radix-ui'
import { cx } from '../../shared/cx'
import { BOYLAR, ESER_TURLERI, ESERLER, LOTLAR, MOTIFLER, NOTALAR, type Eser } from '../lib/data'
import { useNouveau } from '../lib/store'
import { Ikon } from '../components/Ikon'
import { BotanikKart, Cerceve, DalgaGorsel, NouveauButton, SadePanel } from '../components/Nouveau'
import { Belir, Onay, Secim, Section } from '../components/ui'
import { Gorsel } from '../components/Gorsel'

const tl = (n: number) => `${new Intl.NumberFormat('tr-TR').format(n)} ₺`

/** Alt çizgisi dalgalı alan; etiket, ipucu ve hata metni bağlıdır */
function Alan({ label, hata, ipucu, children }: { label: string; hata?: string; ipucu?: string; children: (p: { id: string; 'aria-invalid'?: true; 'aria-describedby'?: string }) => ReactNode }) {
  const id = useId()
  const hid = `${id}-h`
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="etiket">
        {label}
      </label>
      <div className="alan-kap mt-1">
        {children({
          id,
          'aria-invalid': hata ? true : undefined,
          'aria-describedby': hata || ipucu ? hid : undefined,
        })}
      </div>
      {hata || ipucu ? (
        <p id={hid} className={cx('mt-1 text-[16px]', hata ? 'font-bold text-gul' : 'text-soluk')} data-alan-hata={hata ? '' : undefined}>
          {hata ? <span aria-hidden="true">✕ </span> : null}
          {hata ?? ipucu}
        </p>
      ) : null}
    </div>
  )
}

/* ───────────────────────── Müze ───────────────────────── */

const SALONLAR = ['Tümü', 'Salon 1 · Duvar', 'Salon 2 · Su', 'Salon 3 · Cam', 'Salon 4 · Afiş']

function EserKart({ e, i, onAc }: { e: Eser; i: number; onAc: (e: Eser) => void }) {
  return (
    <Belir as="li" gecikme={i * 90} className={cx('min-w-0', i === 1 ? 'md:mt-14' : i === 2 ? 'md:mt-6' : i % 3 === 0 ? 'md:mt-0' : '')}>
      <article data-eser={e.no} className="grid grid-cols-1 gap-5">
        <DalgaGorsel sahne={e.sahne} oran={i % 2 ? '1 / 1' : '4 / 5'} tohum={e.no.charCodeAt(1) + i} sus="sade" etiket={e.ad} />
        <SadePanel ic="p-5 sm:p-6">
          <p className="kicker">
            {e.salon} · {e.yil}
          </p>
          <h3 className="baslik mt-1 text-[clamp(26px,2vw,28px)]">{e.ad}</h3>
          <p className="mt-1 text-[16.5px] text-soluk">{e.sanatci}</p>
          <div className="mt-3">
            <NouveauButton varyant="metin" boy="k" onClick={() => onAc(e)} ikon={<Ikon ad="ok" boyut={18} />} aria-label={`${e.ad}, ayrıntılar`}>
              Ayrıntı
            </NouveauButton>
          </div>
        </SadePanel>
      </article>
    </Belir>
  )
}

export function Muze() {
  const [salon, setSalon] = useState(SALONLAR[0])
  const [acik, setAcik] = useState<Eser | null>(null)
  const liste = ESERLER.filter((e) => salon === 'Tümü' || e.salon === salon)
  return (
    <Section id="muze" ikon="nilufer" madde="Madde 10 · Sanat tarihi müzesi" title="Kıvrımın yüzyılı" lead="Süsen Müzesi’nin 1890–1910 koleksiyonu: her eser dalgalı maskeli bir alanda, altında düz bir metin panelinde. Salona göre süzün, bir esere dokunup ayrıntıya girin.">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <Secim<string> legend="Salon" name="mz-salon" value={salon} onChange={setSalon} options={SALONLAR.map((s) => ({ id: s, ad: s }))} />
        <p className="text-[17px] text-soluk" aria-live="polite" data-muze-sayi={liste.length}>
          {liste.length} eser gösteriliyor
        </p>
      </div>
      {liste.length ? (
        <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-3" data-eserler="">
          {liste.map((e, i) => (
            <EserKart key={e.no} e={e} i={i} onAc={setAcik} />
          ))}
        </ul>
      ) : (
        <SadePanel ic="p-8">Bu salonda şu an sergilenen eser yok.</SadePanel>
      )}

      <Dialog.Root open={!!acik} onOpenChange={(o) => !o && setAcik(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-[color-mix(in_srgb,var(--nv-gece)_55%,transparent)]" />
          <Dialog.Content className="sade-panel fixed top-1/2 left-1/2 z-[95] max-h-[90vh] w-[min(760px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto p-5 sm:p-8" data-eser-dialog="" aria-describedby="eser-ac">
            {acik ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <DalgaGorsel sahne={acik.sahne} oran="4 / 5" tohum={acik.no.charCodeAt(1) + 3} sus="sade" etiket={acik.ad} />
                <div className="min-w-0">
                  <p className="kicker">
                    {acik.salon} · {acik.yil}
                  </p>
                  <Dialog.Title className="baslik mt-1 text-[clamp(26px,3vw,34px)]">{acik.ad}</Dialog.Title>
                  <p className="mt-1 text-[17px] text-soluk">{acik.sanatci}</p>
                  <Dialog.Description id="eser-ac" className="mt-4 text-[18px]">
                    {acik.aciklama}
                  </Dialog.Description>
                  <div className="mt-6">
                    <Dialog.Close asChild>
                      <NouveauButton boy="k" ikon={<Ikon ad="kapat" boyut={18} />}>
                        Kapat
                      </NouveauButton>
                    </Dialog.Close>
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

/* ───────────────────────── Antikacı ───────────────────────── */

type Sira = 'no' | 'artan' | 'azalan'

export function Antikaci() {
  const { duyur } = useNouveau()
  const [sira, setSira] = useState<Sira>('no')
  const [teklifler, setTeklifler] = useState<Record<string, number>>({})
  const [acik, setAcik] = useState<string | null>(null)
  const [deger, setDeger] = useState('')
  const [hata, setHata] = useState('')
  const lotlar = useMemo(() => {
    const l = [...LOTLAR]
    if (sira === 'artan') l.sort((a, b) => a.fiyat - b.fiyat)
    if (sira === 'azalan') l.sort((a, b) => b.fiyat - a.fiyat)
    return l
  }, [sira])
  const guncel = (no: string, taban: number) => teklifler[no] ?? taban
  const gonder = (e: FormEvent, no: string, taban: number) => {
    e.preventDefault()
    const n = Number(deger.replace(/[^\d]/g, ''))
    const enaz = Math.ceil((guncel(no, taban) * 1.05) / 100) * 100
    if (!n) return setHata('Bir tutar yazın.')
    if (n < enaz) return setHata(`En az ${tl(enaz)} olmalı (mevcut teklifin %5 üstü).`)
    setTeklifler((t) => ({ ...t, [no]: n }))
    setAcik(null)
    setDeger('')
    setHata('')
    duyur(`${no} için ${tl(n)} teklifiniz alındı`)
  }
  return (
    <Section
      id="antikaci"
      ikon="gul"
      madde="Madde 10 · Antikacı"
      title="Kadife Pasaj açık artırması"
      lead="Her lot bir botanik çerçevede. Fiyat ve dönem yazısı düz panelde, teklif alanı dalgalı alt çizgili. Sıralamayı değiştirin ya da bir lota teklif verin: tutar mevcut teklifin %5 üstünde olmalı."
    >
      <div className="mb-10 max-w-[280px]">
        <Alan label="Sıralama">
          {(p) => (
            <select {...p} className="alan" value={sira} onChange={(e) => setSira(e.target.value as Sira)} data-sira="">
              <option value="no">Lot numarası</option>
              <option value="artan">Fiyat: artan</option>
              <option value="azalan">Fiyat: azalan</option>
            </select>
          )}
        </Alan>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-12 p-0 lg:grid-cols-2" data-lotlar="">
        {lotlar.map((l, i) => (
          <Belir as="li" key={l.no} gecikme={i * 80} className="min-w-0">
            <BotanikKart tohum={l.tohum} katman={i % 2 ? 1 : 0} ayrisma={10} kicker={`${l.no} · ${l.donem}`} baslik={l.ad} sus="sade" className="h-full" data-lot={l.no}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-[minmax(0,130px)_minmax(0,1fr)]">
                <div className="gorsel aspect-[4/5] w-full max-w-[200px]" style={{ borderRadius: '40px 10px 40px 10px' }}>
                  <Gorsel sahne={l.sahne} tohum={l.tohum} etiket={l.ad} />
                </div>
                <div className="min-w-0">
                  <p className="text-[16.5px] text-soluk">{l.durum}</p>
                  <p className="rakam mt-2 text-[clamp(24px,2.6vw,34px)] leading-none [overflow-wrap:anywhere]" data-fiyat={guncel(l.no, l.fiyat)}>
                    {tl(guncel(l.no, l.fiyat))}
                  </p>
                  <p className="mt-1 text-[15.5px] text-soluk">{teklifler[l.no] ? 'Sizin teklifiniz' : 'Açılış fiyatı'}</p>
                  <p className="mt-3 text-[17px]">{l.not}</p>
                </div>
              </div>
              {acik === l.no ? (
                <form className="mt-6 grid grid-cols-1 gap-4" onSubmit={(e) => gonder(e, l.no, l.fiyat)} noValidate data-teklif-form={l.no}>
                  <Alan label="Teklifiniz (₺)" hata={hata} ipucu="Sadece rakam yazın">
                    {(p) => <input {...p} className="alan" inputMode="numeric" autoComplete="off" value={deger} onChange={(e) => setDeger(e.target.value)} />}
                  </Alan>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <NouveauButton type="submit" varyant="dolu" boy="k">
                      Teklifi gönder
                    </NouveauButton>
                    <NouveauButton
                      varyant="metin"
                      boy="k"
                      onClick={() => {
                        setAcik(null)
                        setHata('')
                      }}
                    >
                      Vazgeç
                    </NouveauButton>
                  </div>
                </form>
              ) : (
                <div className="mt-6">
                  <NouveauButton
                    boy="k"
                    onClick={() => {
                      setAcik(l.no)
                      setDeger('')
                      setHata('')
                    }}
                    ikon={<Ikon ad="sol" boyut={18} className="rotate-180" />}
                    data-teklif-ac={l.no}
                  >
                    Teklif ver
                  </NouveauButton>
                </div>
              )}
            </BotanikKart>
          </Belir>
        ))}
      </ul>
    </Section>
  )
}

/* ───────────────────────── Parfüm ───────────────────────── */

export function Parfum() {
  const { duyur } = useNouveau()
  const [nota, setNota] = useState<keyof typeof NOTALAR>('ust')
  const [boy, setBoy] = useState<(typeof BOYLAR)[number]['id']>('50')
  const [sepet, setSepet] = useState(0)
  const b = BOYLAR.find((x) => x.id === boy)!
  return (
    <Section id="parfum" ikon="zambak" madde="Madde 10 · Butik parfüm" title="Nilüfer & Sedir" lead="Organik bir koku evi için ürün sayfası: üç nota üç sekmede, her biri kendi illüstrasyonuyla. Boyutu seçin, sepete ekleyin; sayfa sepeti sesli olarak da duyurur.">
      <div className="grid grid-cols-1 items-start gap-x-12 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <DalgaGorsel sahne={NOTALAR[nota].sahne} oran="4 / 5" tohum={12} etiket={`${NOTALAR[nota].ad} illüstrasyonu`} className="mx-auto w-full max-w-[440px]" />
        </div>
        <div className="min-w-0 lg:col-span-7">
          <Cerceve tohum={19} sus="sade" katman={1} ayrisma={10} className="w-full">
            <p className="kicker">Eau de parfum · Nilüfer &amp; Sedir</p>
            <h3 className="baslik mt-2 text-[clamp(26px,3.4vw,42px)]">Su üstünde sarmaşık</h3>
            <p className="mt-3 text-[18px]">Yeşil incir yaprağı ve nilüfer serinliğiyle açılır, kirli gülün üstünde sedirde durur.</p>
            <Tabs.Root value={nota} onValueChange={(v) => setNota(v as keyof typeof NOTALAR)} className="mt-6" data-notalar="">
              <Tabs.List aria-label="Koku notaları" className="flex flex-wrap gap-x-4">
                {(Object.keys(NOTALAR) as (keyof typeof NOTALAR)[]).map((k) => (
                  <Tabs.Trigger key={k} value={k} className="cip" data-on={nota === k ? '' : undefined}>
                    {NOTALAR[k].ad}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              {(Object.keys(NOTALAR) as (keyof typeof NOTALAR)[]).map((k) => (
                <Tabs.Content key={k} value={k} className="mt-3 outline-none" data-nota-icerik={k}>
                  <ul className="m-0 grid grid-cols-1 list-none gap-1 p-0 text-[19px]">
                    {NOTALAR[k].ogeler.map((o) => (
                      <li key={o} className="flex items-center gap-3">
                        <Ikon ad="yaprak" boyut={20} className="text-zeytin" />
                        {o}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[16.5px] text-soluk">Kalıcılık: {NOTALAR[k].sure}</p>
                </Tabs.Content>
              ))}
            </Tabs.Root>
            <div className="mt-6">
              <Secim<(typeof BOYLAR)[number]['id']> legend="Boyut" name="pf-boy" value={boy} onChange={setBoy} options={BOYLAR.map((x) => ({ id: x.id, ad: x.ad }))} />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
              <p className="rakam text-[36px] leading-none" data-parfum-fiyat={b.fiyat}>
                {tl(b.fiyat)}
              </p>
              <NouveauButton
                varyant="dolu"
                onClick={() => {
                  setSepet((s) => s + 1)
                  duyur(`${b.ad} Nilüfer ve Sedir sepete eklendi`)
                }}
                ikon={<Ikon ad="sepet" boyut={22} />}
                data-sepete=""
              >
                Sepete ekle
              </NouveauButton>
            </div>
            <p className="mt-3 text-[17px]" aria-live="polite" data-sepet={sepet}>
              {sepet ? `Sepetinizde ${sepet} şişe var.` : 'Sepetiniz boş.'}
            </p>
          </Cerceve>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Atölye ───────────────────────── */

interface Form {
  ad: string
  posta: string
  tur: string
  motifler: string[]
  olcu: number
  mesaj: string
  onay: boolean
}
const BOS: Form = {
  ad: '',
  posta: '',
  tur: ESER_TURLERI[0],
  motifler: ['Sarmaşık'],
  olcu: 60,
  mesaj: '',
  onay: false,
}

export function Atolye() {
  const { duyur } = useNouveau()
  const [f, setF] = useState<Form>(BOS)
  const [hatalar, setHatalar] = useState<Partial<Record<keyof Form, string>>>({})
  const [bitti, setBitti] = useState(false)
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }))
  const tohum = useMemo(
    () =>
      f.motifler
        .join('')
        .split('')
        .reduce((a, c) => a + c.charCodeAt(0), 0) % 40 || 1,
    [f.motifler],
  )
  const gonder = (e: FormEvent) => {
    e.preventDefault()
    const h: typeof hatalar = {}
    if (f.ad.trim().length < 3) h.ad = 'Adınızı ve soyadınızı yazın.'
    if (!/^\S+@\S+\.\S+$/.test(f.posta)) h.posta = 'Geçerli bir e-posta adresi yazın (ör. ad@site.com).'
    if (!f.motifler.length) h.motifler = 'En az bir motif seçin.'
    if (!f.onay) h.onay = 'Devam etmek için onaylamanız gerekir.'
    setHatalar(h)
    if (Object.keys(h).length) {
      duyur(`Formda ${Object.keys(h).length} eksik var`)
      const form = e.currentTarget as HTMLFormElement
      // ilk hatalı alana odaklan (hatalar işlendikten sonra aria-invalid oturur)
      window.setTimeout(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 60)
      return
    }
    setBitti(true)
    duyur('Talebiniz alındı')
  }
  const motifSec = (m: string) => set('motifler', f.motifler.includes(m) ? f.motifler.filter((x) => x !== m) : [...f.motifler, m])
  return (
    <Section
      id="atolye"
      ikon="sarmasik"
      madde="Madde 10 · Tasarım atölyesi"
      title="Sizin için bir çerçeve büyütelim"
      lead="Özel sipariş formu: motifleri seçtikçe yandaki ön çizim değişir. Alanların hepsi dalgalı alt çizgili, hatalar hem yazıyla hem simgeyle verilir ve ilk hatalı alana odaklanılır."
    >
      {bitti ? (
        <Cerceve tohum={tohum} className="mx-auto w-full max-w-[720px]" data-testid="atolye-tamam">
          <div className="text-center" role="status">
            <Ikon ad="ok" boyut={44} className="mx-auto text-zeytin" />
            <h3 className="baslik mt-3 text-[clamp(26px,3.4vw,40px)]">Talebiniz alındı</h3>
            <p className="mx-auto mt-3 max-w-[46ch] text-[18px]">
              {f.ad}, {f.tur.toLowerCase()} için {f.olcu} cm’lik ön çizimi üç iş günü içinde {f.posta} adresine gönderiyoruz.
            </p>
            <div className="mt-6">
              <NouveauButton
                boy="k"
                onClick={() => {
                  setBitti(false)
                  setF(BOS)
                  setHatalar({})
                }}
              >
                Yeni talep
              </NouveauButton>
            </div>
          </div>
        </Cerceve>
      ) : (
        <div className="grid grid-cols-1 items-start gap-x-12 gap-y-10 lg:grid-cols-12">
          <SadePanel as="section" ic="p-6 sm:p-9" className="min-w-0 lg:col-span-7">
            <form onSubmit={gonder} noValidate className="grid grid-cols-1 gap-7" data-atolye-form="" aria-label="Özel sipariş formu">
              {Object.keys(hatalar).length ? (
                <div role="alert" className="rounded-[18px_6px_18px_6px] border-2 border-gul p-4 text-[17px]" data-hata-ozet="">
                  <p className="font-bold text-gul">✕ Formda düzeltilecek {Object.keys(hatalar).length} yer var:</p>
                  <ul className="m-0 mt-1 list-disc pl-6">
                    {Object.values(hatalar).map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="grid gap-7 sm:grid-cols-2">
                <Alan label="Ad soyad" hata={hatalar.ad}>
                  {(p) => <input {...p} className="alan" autoComplete="name" value={f.ad} onChange={(e) => set('ad', e.target.value)} />}
                </Alan>
                <Alan label="E-posta" hata={hatalar.posta}>
                  {(p) => <input {...p} className="alan" type="email" autoComplete="email" value={f.posta} onChange={(e) => set('posta', e.target.value)} />}
                </Alan>
              </div>
              <Alan label="Eser türü">
                {(p) => (
                  <select {...p} className="alan" value={f.tur} onChange={(e) => set('tur', e.target.value)}>
                    {ESER_TURLERI.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                )}
              </Alan>
              <fieldset className="min-w-0 border-0 p-0">
                <legend className="etiket mb-2">Motifler</legend>
                <div className="flex flex-wrap gap-x-4 gap-y-1" data-motifler="">
                  {MOTIFLER.map((m) => {
                    const on = f.motifler.includes(m)
                    return (
                      <label key={m} className="cip" data-on={on ? '' : undefined}>
                        <input type="checkbox" className="sr-only" checked={on} onChange={() => motifSec(m)} aria-describedby={hatalar.motifler ? 'motif-hata' : undefined} />
                        {m}
                      </label>
                    )
                  })}
                </div>
                {hatalar.motifler ? (
                  <p id="motif-hata" className="mt-1 text-[16px] font-bold text-gul">
                    ✕ {hatalar.motifler}
                  </p>
                ) : null}
              </fieldset>
              <div className="max-w-[420px]">
                <label htmlFor="at-olcu" className="flex items-baseline justify-between gap-3">
                  <span className="etiket">Ölçü</span>
                  <span className="font-mono text-[14px] tabular-nums text-soluk">{f.olcu} cm</span>
                </label>
                <input
                  id="at-olcu"
                  type="range"
                  min={20}
                  max={200}
                  step={10}
                  value={f.olcu}
                  onChange={(e) => set('olcu', +e.target.value)}
                  className="aralik"
                  style={{
                    ['--p' as string]: `${((f.olcu - 20) / 180) * 100}%`,
                  }}
                />
              </div>
              <Alan label="Not (isteğe bağlı)" ipucu="Renk, oda ya da ilham için birkaç cümle yeterli">
                {(p) => <textarea {...p} className="alan" rows={3} value={f.mesaj} onChange={(e) => set('mesaj', e.target.value)} />}
              </Alan>
              <Onay id="at-onay" label="Kişisel verilerimin talebi yanıtlamak için işlenmesini kabul ediyorum." checked={f.onay} onChange={(v) => set('onay', v)} hata={!!hatalar.onay} describedBy={hatalar.onay ? 'onay-hata' : undefined} />
              {hatalar.onay ? (
                <p id="onay-hata" className="-mt-4 text-[16px] font-bold text-gul">
                  ✕ {hatalar.onay}
                </p>
              ) : null}
              <div>
                <NouveauButton type="submit" varyant="dolu" boy="b" ikon={<Ikon ad="posta" boyut={22} />}>
                  Talebi gönder
                </NouveauButton>
              </div>
            </form>
          </SadePanel>
          <div className="min-w-0 lg:col-span-5">
            <p className="kicker mb-3">Ön çizim</p>
            <Cerceve tohum={tohum} katman={Math.min(3, Math.max(0, f.motifler.length - 1))} ayrisma={10} sus="sade" className="w-full" data-testid="atolye-onizleme">
              <DalgaGorsel
                sahne={f.motifler.includes('Zambak') ? 'zambak' : f.motifler.includes('Nilüfer') ? 'nilufer' : f.motifler.includes('Tavus kuşu') ? 'pavus' : f.motifler.includes('Akan saç') ? 'sac' : 'sarmasik'}
                oran="1 / 1"
                tohum={tohum}
                sus="yalin"
                className="mx-auto w-full max-w-[260px]"
              />
              <p className="baslik-k mt-4 text-center text-[22px]">
                {f.tur} · {f.olcu} cm
              </p>
              <p className="mt-1 text-center text-[16px] text-soluk">{f.motifler.join(' · ') || 'Motif seçilmedi'}</p>
            </Cerceve>
          </div>
        </div>
      )}
    </Section>
  )
}
