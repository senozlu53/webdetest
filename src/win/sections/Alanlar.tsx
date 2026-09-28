import { useState, type FormEvent } from 'react'
import { useWin } from '../lib/store'
import { OYUNLAR, PLANLAR } from '../lib/data'
import { Win95Window } from '../components/Win95Window'
import { DialogBox } from '../components/DialogBox'
import { Pixel } from '../components/Pixel'
import { Button, Check, GroupBox, Progress, Radios, Select, Tabs } from '../components/ui'

/** Piksel Kulübe: bağımsız oyun geliştiricisinin portfolyosu */
function PikselKulube() {
  const w = useWin()
  const [inen, setInen] = useState<Record<string, number>>({})
  const indir = async (id: string, dosya: string) => {
    for (let k = 1; k <= 10; k++) {
      await w.bekle(90)
      setInen((s) => ({ ...s, [id]: k * 10 }))
    }
    w.duyur(`${dosya} indirildi`)
    void w.sor({ baslik: 'İndirme tamamlandı', ikon: 'bilgi', mesaj: <p>{`${dosya} indirildi. (Tanıtım: dosya bilgisayarınıza kaydedilmedi.)`}</p>, butonlar: [{ ad: 'Tamam', deger: 'tamam', varsayilan: true }] })
  }
  const gonder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = e.currentTarget
    await w.bekle(600)
    f.reset()
    void w.sor({ baslik: 'Mesaj gönderildi', ikon: 'bilgi', mesaj: <p>Teşekkürler! Piksel Kulübe genelde üç iş günü içinde yanıt verir. (Tanıtım: mesaj bir yere gitmedi.)</p>, butonlar: [{ ad: 'Tamam', deger: 'tamam', varsayilan: true }] })
  }
  return (
    <Win95Window baslik="Piksel Kulübe · bağımsız oyun stüdyosu" ikon="oyun" seviye="h3" id="piksel-kulube">
      <Tabs
        etiket="Piksel Kulübe"
        sekmeler={[
          {
            id: 'oyun',
            ad: 'Oyunlar',
            icerik: (
              <ul className="grid gap-3">
                {OYUNLAR.map((o) => (
                  <li key={o.id} className="field flex flex-wrap items-start gap-3 p-2">
                    <Pixel ad="oyun" boyut={2} />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold">
                        {o.ad} <span className="font-normal text-muted">({o.yil})</span>
                      </h4>
                      <p className="font-doc text-[1rem] leading-snug">{o.aciklama}</p>
                      <p className="mt-1 text-[0.75rem]">
                        {o.tur} · {o.platform} · {o.durum} · {o.boyut}
                      </p>
                      {inen[o.id] !== undefined && inen[o.id] < 100 ? (
                        <div className="mt-2">
                          <Progress deger={inen[o.id]} etiket={`${o.dosya} indiriliyor`} bloklar={10} />
                        </div>
                      ) : null}
                    </div>
                    <Button className="min-w-0" disabled={o.durum === 'Prototip' || (inen[o.id] !== undefined && inen[o.id] < 100)} onClick={() => void indir(o.id, o.dosya)}>
                      <Pixel ad="disket" />
                      {o.durum === 'Prototip' ? 'Yakında' : 'İndir'}
                    </Button>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            id: 'hakkinda',
            ad: 'Hakkında',
            icerik: (
              <div className="field p-3 font-doc text-[1.0625rem] leading-relaxed">
                <p>
                  <b>Piksel Kulübe</b> iki kişilik bir stüdyo: biri çizer, biri kodlar. 16 renk, 320 × 200 ekran ve bir disketlik oyunlar yapıyoruz. Oyunlarımız <a href="#piksel-kulube">tarayıcıda</a> ve masaüstünde çalışır.
                </p>
                <p className="mt-2">
                  Basın için: <a href="#iletisim-formu">iletişim formu</a>. Sistem gereksinimi: 4 MB bellek, fare önerilir.
                </p>
              </div>
            ),
          },
          {
            id: 'iletisim',
            ad: 'İletişim',
            icerik: (
              <form id="iletisim-formu" onSubmit={gonder} className="grid gap-2">
                <label className="grid gap-0.5">
                  Adınız
                  <input name="ad" required className="field px-1.5 py-0.5" autoComplete="name" />
                </label>
                <label className="grid gap-0.5">
                  E-posta
                  <input name="eposta" type="email" required className="field px-1.5 py-0.5" autoComplete="email" />
                </label>
                <label className="grid gap-0.5">
                  Mesaj
                  <textarea name="mesaj" required rows={3} className="field resize-y px-1.5 py-0.5" />
                </label>
                <div className="flex justify-end gap-1.5">
                  <Button type="submit" varsayilan>
                    Gönder
                  </Button>
                  <Button type="reset">Temizle</Button>
                </div>
              </form>
            ),
          },
        ]}
      />
    </Win95Window>
  )
}

/** FaturaKuşu 95: eğlenceli SaaS pazarlama sayfası, Web 1.0 tablo düzeni ve kurulum sihirbazı */
function FaturaKusu() {
  const w = useWin()
  const [sihirbaz, setSihirbaz] = useState(false)
  const [adim, setAdim] = useState(0)
  const [plan, setPlan] = useState('CD-ROM')
  const [sirket, setSirket] = useState('')
  const [yuzde, setYuzde] = useState(0)
  const [bitti, setBitti] = useState(false)
  const kapat = () => {
    setSihirbaz(false)
    setAdim(0)
    setYuzde(0)
  }
  const kur = async () => {
    setAdim(3)
    for (let k = 1; k <= 20; k++) {
      await w.bekle(70)
      setYuzde(k * 5)
    }
    setAdim(4)
    setBitti(true)
    w.duyur('Kurulum tamamlandı')
  }
  const ADIMLAR = ['Hoş geldiniz', 'Plan', 'Şirket', 'Kuruluyor', 'Bitti']
  return (
    <Win95Window baslik="FaturaKuşu 95 · fatura yazılımı" ikon="belge" seviye="h3" id="faturakusu">
      <div className="field p-3">
        <table className="w-full border-collapse" role="presentation">
          <tbody>
            <tr>
              <td className="w-16 align-top">
                <Pixel ad="belge" boyut={3} />
              </td>
              <td className="align-top">
                <p className="font-fun text-[1.5rem] leading-tight font-bold text-vurgu">Faturalar kendini yazsın!</p>
                <p className="mt-1 font-doc text-[1.0625rem]">
                  FaturaKuşu 95 faturanızı hesaplar, yazdırır ve müşterinize <s>faksla</s> e-postayla gönderir. Kurulum üç tık sürer.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        <ul className="mt-2 grid grid-cols-1 gap-1 font-doc text-[1rem] sm:grid-cols-3">
          {['KDV kendiliğinden hesaplanır', 'Müşteri defteri', 'Tek tıkla PDF'].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <Pixel ad="disket" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="field k95 mt-3 overflow-x-auto">
        <table className="w-full min-w-[26rem] border-collapse font-doc text-[1rem]" border={1} cellPadding={6}>
          <caption className="p-1 text-left font-ui text-[0.8125rem]">Fiyatlar, aylık</caption>
          <thead>
            <tr>
              <th scope="col" className="border border-sh">
                Paket
              </th>
              <th scope="col" className="border border-sh">
                Fiyat
              </th>
              <th scope="col" className="border border-sh">
                Fatura
              </th>
              <th scope="col" className="border border-sh">
                Kullanıcı
              </th>
              <th scope="col" className="border border-sh">
                Destek
              </th>
            </tr>
          </thead>
          <tbody>
            {PLANLAR.map((p) => (
              <tr key={p.ad} className={p.one ? 'bg-[#FFFF00] text-black' : undefined}>
                <th scope="row" className="border border-sh text-left">
                  {p.ad}
                  {p.one ? ' (en çok seçilen)' : ''}
                </th>
                <td className="border border-sh">{p.fiyat}</td>
                <td className="border border-sh">{p.fatura}</td>
                <td className="border border-sh">{p.kullanici}</td>
                <td className="border border-sh">{p.destek}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          varsayilan
          ikon="disket"
          onClick={() => {
            setBitti(false)
            setSihirbaz(true)
          }}
        >
          Ücretsiz dene
        </Button>
        {bitti ? <span data-kurulum="bitti">Kurulu: {sirket || 'Adsız Şirket'} · {plan}</span> : null}
      </div>
      {sihirbaz ? (
        <DialogBox
          baslik="FaturaKuşu 95 Kurulum Sihirbazı"
          onKapat={kapat}
          genislik="30rem"
          altlik={
            adim === 4 ? (
              <Button varsayilan data-varsayilan="" onClick={kapat}>
                Son
              </Button>
            ) : (
              <>
                <Button disabled={adim === 0 || adim === 3} onClick={() => setAdim((a) => a - 1)}>
                  &lt; Geri
                </Button>
                {adim === 2 ? (
                  <Button varsayilan data-varsayilan="" disabled={!sirket.trim()} onClick={() => void kur()}>
                    Kur
                  </Button>
                ) : (
                  <Button varsayilan data-varsayilan="" disabled={adim === 3} onClick={() => setAdim((a) => a + 1)}>
                    İleri &gt;
                  </Button>
                )}
                <Button disabled={adim === 3} onClick={kapat}>
                  İptal
                </Button>
              </>
            )
          }
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[6rem_minmax(0,1fr)]">
            <div className="hidden bg-teal sm:grid sm:place-items-center" aria-hidden="true">
              <Pixel ad="bilgisayar" boyut={4} />
            </div>
            <div className="min-w-0" data-sihirbaz-adim={adim}>
              <p className="text-[0.75rem] text-muted">
                Adım {adim + 1} / 5 · {ADIMLAR[adim]}
              </p>
              {adim === 0 ? (
                <p className="mt-2">Bu sihirbaz FaturaKuşu 95'i bilgisayarınıza kurar. Devam etmek için İleri'ye basın.</p>
              ) : adim === 1 ? (
                <div className="mt-2">
                  <Radios legend="Paket" name="fk-plan" value={plan} onChange={setPlan} options={PLANLAR.map((p) => ({ id: p.ad, ad: `${p.ad} · ${p.fiyat}` }))} />
                </div>
              ) : adim === 2 ? (
                <label className="mt-2 grid gap-1">
                  Şirket adı
                  <input className="field px-1.5 py-0.5" value={sirket} onChange={(e) => setSirket(e.target.value)} autoComplete="organization" required />
                </label>
              ) : adim === 3 ? (
                <div className="mt-2 grid gap-2">
                  <p>Dosyalar kopyalanıyor… C:\FATURA\KUS.EXE</p>
                  <Progress deger={yuzde} etiket="Kurulum" />
                  <p className="text-[0.8125rem]">%{yuzde}</p>
                </div>
              ) : (
                <p className="mt-2">FaturaKuşu 95 kuruldu. İlk faturanız sizi bekliyor. (Tanıtım: hiçbir şey kurulmadı.)</p>
              )}
            </div>
          </div>
        </DialogBox>
      ) : null}
    </Win95Window>
  )
}

/** Disket Günleri: nostaljik kampanya. Kupon formu ve şaka hata penceresi */
function DisketGunleri() {
  const w = useWin()
  const [kabul, setKabul] = useState(false)
  const [yil, setYil] = useState('1995')
  const [kod, setKod] = useState('')
  const kalan = Math.max(0, Math.ceil((new Date('2026-12-31T23:59:00+03:00').getTime() - Date.now()) / 86_400_000))
  const gonder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const eposta = String(new FormData(e.currentTarget).get('eposta'))
    await w.bekle(800)
    let h = 0
    for (const ch of eposta) h = (h * 31 + ch.charCodeAt(0)) % 9000
    const k = `DISKET-${yil.slice(2)}-${String(1000 + h).padStart(4, '0')}`
    setKod(k)
    void w.sor({ baslik: 'Kupon hazır', ikon: 'bilgi', mesaj: <p>{`Kupon kodunuz: ${k}. Kasada söyleyin, 1,44 MB indirim kazanın. (Tanıtım)`}</p>, butonlar: [{ ad: 'Tamam', deger: 'tamam', varsayilan: true }] })
  }
  return (
    <Win95Window baslik="Disket Günleri · nostalji kampanyası" ikon="disket" seviye="h3" id="disket-gunleri">
      <div className="bg-navy p-3 text-white">
        <p className="font-fun text-[1.5rem] leading-tight font-bold">
          <span className="text-[#FFFF00]">1,44 MB</span> kadar indirim!
        </p>
        <p className="field mt-2 inline-flex flex-wrap items-center gap-1 p-1" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <Pixel key={i} ad="disket" boyut={1.5} />
          ))}
        </p>
        <p className="mt-1 text-[0.875rem]">Kampanyanın bitmesine {kalan} gün. Disketi getiren kupon alır.</p>
      </div>
      <form onSubmit={gonder} className="mt-3 grid gap-2">
        <label className="grid gap-0.5">
          E-posta
          <input name="eposta" type="email" required className="field px-1.5 py-0.5" autoComplete="email" />
        </label>
        <Select
          label="İlk bilgisayarınızın yılı:"
          value={yil}
          onChange={setYil}
          options={Array.from({ length: 21 }, (_, i) => String(1985 + i)).map((y) => ({ id: y, ad: y }))}
        />
        <Check label="Kampanya koşullarını okudum" checked={kabul} onChange={setKabul} />
        <div className="flex flex-wrap gap-1.5">
          <Button type="submit" varsayilan disabled={!kabul}>
            Kupon al
          </Button>
          <Button
            onClick={() =>
              void w.sor({
                baslik: 'Hata',
                ikon: 'hata',
                mesaj: <p>Bu fiyat bir hata değil. Programı kapatmanıza gerek yok; indirim gerçekten bu kadar büyük.</p>,
                butonlar: [
                  { ad: 'Tamam', deger: 'tamam', varsayilan: true },
                  { ad: 'Ayrıntılar >>', deger: 'ayrinti' },
                ],
              }).then((c) => {
                if (c === 'ayrinti') void w.sor({ baslik: 'Ayrıntılar', ikon: 'soru', mesaj: <p>KAMPANYA.EXE 0028:C0011E36 adresinde fazla iyi bir fiyat oluşturdu.</p>, butonlar: [{ ad: 'Kapat', deger: 'kapat', varsayilan: true }] })
              })
            }
          >
            Fiyat hatası mı?
          </Button>
        </div>
        {kod ? (
          <p className="field px-2 py-1 font-mono" data-kupon={kod}>
            {kod}
          </p>
        ) : null}
      </form>
    </Win95Window>
  )
}

/** Madde 10: kullanım alanları */
export function Kullanim() {
  return (
    <Win95Window id="kullanim" baslik="Kullanım Alanları (Madde 10)" ikon="ag" govde="p-2">
      <p className="mb-3 px-1">Bağımsız oyun geliştirici portfolyosu, eğlenceli bir SaaS pazarlama sayfası ve nostaljik bir kampanya. Üçü de kurgu; formlar ve sihirbaz çalışır.</p>
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <PikselKulube />
        <FaturaKusu />
        <div className="xl:col-span-2">
          <DisketGunleri />
        </div>
      </div>
      <GroupBox legend="Neden bu stil" className="mt-3">
        <p>Tanıdık gri pencereler, oyun ve yazılım satan bir sayfaya anında eğlenceli bir nostalji katar. Düğmeler neye benzediğini söyler: kabartmalı şey basılır, çukur şeye yazılır.</p>
      </GroupBox>
    </Win95Window>
  )
}
