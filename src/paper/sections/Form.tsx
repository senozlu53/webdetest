import { useRef, useState, type FormEvent } from 'react'
import { usePaper } from '../lib/store'
import { Kesik } from '../components/Kesik'
import { PaperButton, PaperCard } from '../components/Paper'
import { CutoutInput, CutoutSelect, CutoutTextarea, DelikKutu, DelikSecenek, Yarik, Yuva } from '../components/Oyuk'
import { Section } from '../components/ui'

const POSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Madde 11 · 14: yüzeye oyulmuş girdiler. Onay kutusu zımba deliği, seçili olunca deliğe kâğıt yuvarlak oturur */
export function Form() {
  const { duyur } = usePaper()
  const form = useRef<HTMLElement>(null)
  const [ad, setAd] = useState('')
  const [posta, setPosta] = useState('')
  const [konu, setKonu] = useState('kitap')
  const [mesaj, setMesaj] = useState('')
  const [bulten, setBulten] = useState(true)
  const [tohum, setTohum] = useState(false)
  const [onay, setOnay] = useState(false)
  const [yas, setYas] = useState('6-8')
  const [adet, setAdet] = useState(2)
  const [hata, setHata] = useState<{ ad?: string; posta?: string; onay?: string }>({})
  const [sonuc, setSonuc] = useState('')
  const gonder = (e: FormEvent) => {
    e.preventDefault()
    const h: typeof hata = {}
    if (ad.trim().length < 2) h.ad = ad.trim() ? 'Adın en az iki harf olsun.' : 'Adını yazmayı unuttun. Kitabın üstüne ne yazalım?'
    if (!POSTA.test(posta.trim())) h.posta = posta.trim() ? 'Bu adres eksik: @ işareti ve bir alan adı lazım.' : 'E-posta boş kaldı. Haberi nereye yollayalım?'
    if (!onay) h.onay = 'Devam etmek için bu deliği doldurman gerek.'
    setHata(h)
    setSonuc('')
    if (Object.keys(h).length) {
      duyur(`Formda ${Object.keys(h).length} eksik var`)
      requestAnimationFrame(() => (form.current?.querySelector('[aria-invalid="true"], [data-onay-hata] input') as HTMLElement | null)?.focus())
      return
    }
    const m = `Teşekkürler ${ad.trim()}! ${adet} kitap ${yas} yaş için ayrıldı${tohum ? ', tohumlu kâğıt zarfla' : ''}.`
    setSonuc(m)
    duyur(m)
  }
  return (
    <Section
      id="form"
      madde="Madde 11 · 14 · Oyuk girdiler"
      renk="var(--turkuaz)"
      title="Yüzeye oyulmuş"
      lead="Girdiler kâğıdın içine oyulmuş: kenarında keskin iç gölge, alt-sağda kâğıdın kalınlığını gösteren ışıklı dudak. Zemin yine krem ve pürüzsüz, yazı ondan okunur. Onay kutuları zımbayla delinmiş daire; işaretlenince deliğe kâğıt yuvarlak oturur."
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.4fr_1fr]">
        <PaperCard as="form" elRef={form} nivel={4} renk="var(--gokyuzu)" tohum={160} r={26} dalga={4} onSubmit={gonder} noValidate data-form="" yuzClass="p-2.5 md:p-4">
          <PaperCard nivel={2} duz renk="var(--bej)" tohum={161} r={20} dalga={2} yuzClass="grid grid-cols-1 gap-6 p-4 sm:p-5 md:p-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <CutoutInput etiket="Adın" value={ad} onChange={(e) => setAd(e.target.value)} autoComplete="given-name" hata={hata.ad} placeholder="Deniz" />
              <CutoutInput etiket="E-posta" type="email" value={posta} onChange={(e) => setPosta(e.target.value)} autoComplete="email" hata={hata.posta} placeholder="deniz@ornek.com" ipucu="Yalnız haber için." />
            </div>
            <CutoutSelect etiket="Konu" value={konu} onChange={(e) => setKonu(e.target.value)}>
              <option value="kitap">Kitap ayırtmak</option>
              <option value="atolye">Kâğıt kesme atölyesi</option>
              <option value="okul">Okul ziyareti</option>
              <option value="diger">Başka bir şey</option>
            </CutoutSelect>
            <CutoutTextarea etiket="Notun" value={mesaj} onChange={(e) => setMesaj(e.target.value.slice(0, 200))} placeholder="Minik Ayı'ya bir mesajın var mı?" ipucu={`${mesaj.length} / 200`} />
            <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              <fieldset className="grid content-start border-0 p-0">
                <legend className="etiket mb-1.5">Yaş grubu</legend>
                {[
                  ['3-5', '3–5 yaş'],
                  ['6-8', '6–8 yaş'],
                  ['9+', '9 yaş ve üstü'],
                ].map(([v, a]) => (
                  <DelikSecenek key={v} name="form-yas" value={v} label={a} checked={yas === v} onChange={() => setYas(v)} renk="var(--mercan)" />
                ))}
              </fieldset>
              <fieldset className="grid content-start border-0 p-0">
                <legend className="etiket mb-1.5">İşaretle</legend>
                <DelikKutu label="Bültene yaz" hint="Ayda bir, kâğıt kokulu." checked={bulten} onChange={setBulten} renk="var(--gunes)" />
                <DelikKutu label="Tohumlu kâğıt zarf" hint="Zarfı toprağa göm, çiçek çıkar." checked={tohum} onChange={setTohum} renk="var(--yaprak)" />
                <div data-onay-hata={hata.onay ? '' : undefined}>
                  <DelikKutu label="Kişisel verilerimin işlenmesini onaylıyorum" checked={onay} onChange={setOnay} renk="var(--turkuaz)" />
                  {hata.onay ? (
                    <p role="alert" className="mt-1 flex items-start gap-2 rounded-lg bg-mercan px-3 py-2 text-[16px] font-bold" data-onay-mesaj="">
                      <Kesik ad="kapat" boyut={22} nivel={1} halo={false} renk="var(--krem)" className="mt-0.5" />
                      {hata.onay}
                    </p>
                  ) : null}
                </div>
              </fieldset>
            </div>
            <Yuva label="Zarfı kargoyla yolla" hint="Kapalıysa dükkândan alırsın." checked={tohum} onChange={setTohum} />
            <Yarik label="Kitap adedi" value={adet} min={1} max={9} onChange={setAdet} format={(v) => `${v} adet`} renk="var(--turkuaz)" />
            <div className="flex flex-wrap items-center gap-5">
              <PaperButton type="submit" renk="var(--gunes)" boy="b" ikon={<Kesik ad="zarf" boyut={30} nivel={1} halo={false} />}>
                Gönder
              </PaperButton>
              <PaperButton
                renk="var(--krem)"
                boy="b"
                onClick={() => {
                  setAd('')
                  setPosta('')
                  setMesaj('')
                  setOnay(false)
                  setHata({})
                  setSonuc('')
                }}
              >
                Temizle
              </PaperButton>
            </div>
            {sonuc ? (
              <p className="flex items-center gap-3 rounded-2xl bg-yaprak px-4 py-3 text-[18px] font-extrabold" role="status" data-form-sonuc="">
                <Kesik ad="onay" boyut={34} nivel={1} halo={false} renk="var(--krem)" />
                {sonuc}
              </p>
            ) : null}
          </PaperCard>
        </PaperCard>
        <aside className="grid min-w-0 content-start gap-6" aria-label="Bileşen desenleri">
          <PaperCard nivel={3} duz tohum={170} r={20} dalga={3} yuzClass="grid gap-3 p-5">
            <h3 className="text-[30px]">Üç desen</h3>
            <ol className="m-0 grid list-decimal gap-3 pl-5 text-[16px] font-medium">
              <li>
                <b>Oyuk.</b> Keskin iç gölge kenarı, yumuşak iç gölge derinliği, alt-sağdaki ışık kâğıdın kalınlığını verir.
              </li>
              <li>
                <b>Zımba deliği.</b> Kusursuz daire; işaretlenince renkli kâğıt yuvarlak yaylanarak oturur, onay işareti kesik olarak görünür.
              </li>
              <li>
                <b>Hata.</b> Oyuğun kenarı mercan halka olur, altında kâğıt etiketle nazik bir not çıkar; alan aria-invalid ve mesaja bağlıdır.
              </li>
            </ol>
          </PaperCard>
          <PaperCard nivel={2} duz tohum={171} r={20} dalga={3} yuzClass="grid gap-1 p-5">
            <p className="etiket mb-1">Devre dışı örnek</p>
            <DelikKutu label="Bu seçenek kapalı" checked={false} onChange={() => {}} disabled />
            <DelikKutu label="Bu da kapalı ama dolu" checked onChange={() => {}} disabled />
          </PaperCard>
        </aside>
      </div>
    </Section>
  )
}
