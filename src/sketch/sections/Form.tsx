import { useRef, useState, type FormEvent } from 'react'
import { useSketch } from '../lib/store'
import { Ikon } from '../components/Icons'
import { Not } from '../components/Not'
import { RoughBox } from '../components/Rough'
import { Acilir, Anahtar, Aralik, CokSatir, KaralamaKutu, KaralamaSecenek, MetinAlani, RoughButton } from '../components/Controls'
import { Section } from '../components/ui'

const POSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Madde 11: titrek çerçeveli alanlar ve karalanarak dolan onay kutuları. Hata kırmızı kalemle kenara yazılır */
export function Form() {
  const { duyur } = useSketch()
  const form = useRef<HTMLElement>(null)
  const [ad, setAd] = useState('')
  const [posta, setPosta] = useState('')
  const [konu, setKonu] = useState('siparis')
  const [mesaj, setMesaj] = useState('')
  const [bulten, setBulten] = useState(true)
  const [kopya, setKopya] = useState(false)
  const [onay, setOnay] = useState(false)
  const [yanit, setYanit] = useState('eposta')
  const [kartpostal, setKartpostal] = useState(false)
  const [seker, setSeker] = useState(1)
  const [hata, setHata] = useState<{ ad?: string; posta?: string; onay?: string }>({})
  const [sonuc, setSonuc] = useState('')
  const gonder = (e: FormEvent) => {
    e.preventDefault()
    const h: typeof hata = {}
    if (ad.trim().length < 2) h.ad = ad.trim() ? 'Bir harf az geldi. Adını iki harften uzun yazar mısın?' : 'Adını yazmayı unuttun. Fincana ne yazalım?'
    if (!POSTA.test(posta.trim())) h.posta = posta.trim() ? 'Bu adres biraz eksik gibi: @ işareti ve bir alan adı lazım.' : 'E-postanı yazmazsan cevabı nereye yollayalım?'
    if (!onay) h.onay = 'Bu kutuyu karalamadan gönderemem.'
    setHata(h)
    setSonuc('')
    if (Object.keys(h).length) {
      duyur(`Formda ${Object.keys(h).length} eksik var`)
      requestAnimationFrame(() => (form.current?.querySelector('[aria-invalid="true"], [data-onay-hata] input') as HTMLElement | null)?.focus())
      return
    }
    const m = `Notun deftere yazıldı, ${ad.trim()}. ${seker === 0 ? 'Şekersiz' : `${seker} küp şekerli`} kahven hazır.`
    setSonuc(m)
    duyur(m)
  }
  return (
    <Section id="form" madde="Madde 11 · Form bileşenleri" title="Deftere yaz" lead="Alan çerçeveleri titrek, onay kutuları tıklanınca karalanarak doluyor. Hata azarlamaz: kenara kırmızı kalemle not düşer, alanın çerçevesi kırmızıya döner ve odak oraya gider.">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.4fr_1fr]">
        <RoughBox as="form" elRef={form} tohum={500} kare={3} sekil="yuvarlak" r={20} cizgi={2.4} className="tarama tarama-mavi grid min-w-0 grid-cols-1 gap-6 p-6 md:p-8" onSubmit={gonder} noValidate data-form="">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <MetinAlani etiket="Adın" value={ad} onChange={(e) => setAd(e.target.value)} autoComplete="given-name" hata={hata.ad} placeholder="Ece" />
            <MetinAlani etiket="E-posta" type="email" value={posta} onChange={(e) => setPosta(e.target.value)} autoComplete="email" hata={hata.posta} placeholder="ece@ornek.com" ipucu="Yalnız cevap için." />
          </div>
          <Acilir etiket="Konu" value={konu} onChange={(e) => setKonu(e.target.value)}>
            <option value="siparis">Toplu sipariş</option>
            <option value="atolye">Defter atölyesi</option>
            <option value="yazilim">Yazılım işi</option>
            <option value="diger">Başka bir şey</option>
          </Acilir>
          <CokSatir etiket="Mesajın" value={mesaj} onChange={(e) => setMesaj(e.target.value.slice(0, 200))} placeholder="Bugün ne çizelim?" ipucu={`${mesaj.length} / 200`} />
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            <fieldset className="grid content-start border-0 p-0">
              <legend className="kicker mb-1">Yanıt yolu</legend>
              {[
                ['eposta', 'E-posta'],
                ['telefon', 'Telefon'],
                ['posta', 'Kartpostal'],
              ].map(([v, a]) => (
                <KaralamaSecenek key={v} name="form-yanit" value={v} label={a} checked={yanit === v} onChange={() => setYanit(v)} />
              ))}
            </fieldset>
            <fieldset className="grid content-start border-0 p-0">
              <legend className="kicker mb-1">İşaretle</legend>
              <KaralamaKutu label="Bültene yaz" hint="Ayda bir, elle yazılmış." checked={bulten} onChange={setBulten} />
              <KaralamaKutu label="Bir kopyasını bana gönder" checked={kopya} onChange={setKopya} />
              <div data-onay-hata={hata.onay ? '' : undefined}>
                <KaralamaKutu label="Kişisel verilerimin işlenmesini onaylıyorum" checked={onay} onChange={setOnay} />
                {hata.onay ? (
                  <p role="alert" className="flex items-start gap-2 pl-1 font-not text-[20px] leading-tight text-kirmiziK">
                    <Ikon ad="kalem" boyut={24} className="mt-0.5 shrink-0" />
                    {hata.onay}
                  </p>
                ) : null}
              </div>
            </fieldset>
          </div>
          <Anahtar label="Cevabı kartpostalla yolla" hint="Adresini sonra soracağız." checked={kartpostal} onChange={setKartpostal} />
          <Aralik label="Kahveye şeker" value={seker} min={0} max={3} onChange={setSeker} format={(v) => (v === 0 ? 'şekersiz' : `${v} küp`)} />
          <div className="flex flex-wrap items-center gap-5">
            <RoughButton type="submit" tur="murekkep" boy="b" ikon={<Ikon ad="zarf" boyut={28} renk="#f9f6f0" />}>
              Gönder
            </RoughButton>
            <RoughButton
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
            </RoughButton>
          </div>
          {sonuc ? (
            <p className="flex items-center gap-3 font-not text-[24px] leading-tight text-murekkep" role="status" data-form-sonuc="">
              <Ikon ad="onay" boyut={36} renk="var(--murekkep)" />
              <Not tur="underline" sure={500}>
                {sonuc}
              </Not>
            </p>
          ) : null}
        </RoughBox>
        <aside className="grid min-w-0 content-start gap-6" aria-label="Bileşen desenleri">
          <RoughBox tohum={520} kare={3} sekil="yuvarlak" r={14} className="grid gap-3 p-5">
            <p className="font-el text-[34px] leading-none font-bold text-murekkep">Üç desen</p>
            <ol className="m-0 grid list-decimal gap-3 pl-5 text-[16px]">
              <li>
                <b>Titrek çerçeve.</b> Alan üç ayrı denemeyle çizilir; odaklanınca kare kare titrer, kesik mürekkep halkası görünür.
              </li>
              <li>
                <b>Karalanan onay.</b> Kutu işaretlenince tek parça zikzak sekiz karede dolar. Durum renkle değil, kutunun dolu olmasıyla anlaşılır.
              </li>
              <li>
                <b>Kırmızı kalem notu.</b> Hata metni koyu kırmızı (5,77:1), yanında kalem ikonu; alan <code className="font-daktilo">aria-invalid</code> ve mesaja bağlı.
              </li>
            </ol>
          </RoughBox>
          <RoughBox tohum={530} kare={3} sekil="yuvarlak" r={14} className="grid gap-1 p-5">
            <p className="kicker mb-1">Devre dışı örnek</p>
            <KaralamaKutu label="Bu seçenek kapalı" checked={false} onChange={() => {}} disabled />
            <KaralamaKutu label="Bu da kapalı ama dolu" checked onChange={() => {}} disabled />
          </RoughBox>
        </aside>
      </div>
    </Section>
  )
}
