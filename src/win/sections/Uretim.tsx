import { useEffect, useRef, useState } from 'react'
import { useWin } from '../lib/store'
import type { IkonAd } from '../lib/pixel'
import { Win95Window } from '../components/Win95Window'
import { Button, Check, Code, GroupBox, Progress, Radios, Select, Tabs } from '../components/ui'

const KOD = `<Win95Window baslik="Not Defteri" ikon="not"
  onKucult={kucult} onBuyut={buyut} onKapat={kapat}>
  <textarea className="field" />
</Win95Window>

<StartButton onKapat={bilgisayariKapat} />   // görev çubuğunda

const yanit = await sor({                      // <DialogBox>
  baslik: 'Dosya silmeyi onayla', ikon: 'uyari',
  mesaj: 'Bu 3 öğeyi silmek istiyor musunuz?',
  butonlar: [{ ad: 'Evet', deger: 'evet', varsayilan: true },
             { ad: 'Hayır', deger: 'hayir' }],
})`

const DIYALOG: { ad: string; ikon: IkonAd; baslik: string; mesaj: string; butonlar: { ad: string; deger: string; varsayilan?: boolean }[] }[] = [
  { ad: 'Bilgi', ikon: 'bilgi', baslik: 'Bilgi', mesaj: 'Disket Avcısı 1.1 yüklendi.', butonlar: [{ ad: 'Tamam', deger: 'tamam', varsayilan: true }] },
  { ad: 'Uyarı', ikon: 'uyari', baslik: 'Disk alanı az', mesaj: 'C: sürücüsünde 1,2 MB boş alan kaldı. Geri dönüşüm kutusunu boşaltmak ister misiniz?', butonlar: [{ ad: 'Evet', deger: 'evet', varsayilan: true }, { ad: 'Hayır', deger: 'hayir' }] },
  { ad: 'Hata', ikon: 'hata', baslik: 'Hata', mesaj: 'Bu program geçersiz bir işlem yaptı ve kapatılacak. (Şaka.)', butonlar: [{ ad: 'Kapat', deger: 'kapat', varsayilan: true }] },
  { ad: 'Soru', ikon: 'soru', baslik: 'Kaydet', mesaj: 'NOTLAR.TXT dosyasındaki değişiklikler kaydedilsin mi?', butonlar: [{ ad: 'Evet', deger: 'evet', varsayilan: true }, { ad: 'Hayır', deger: 'hayir' }, { ad: 'İptal', deger: 'iptal' }] },
]

/** Madde 11 · 14: bileşenler */
export function Bilesenler() {
  const w = useWin()
  const [yanit, setYanit] = useState('—')
  const [c1, setC1] = useState(true)
  const [r, setR] = useState<'kucuk' | 'buyuk'>('kucuk')
  const [s, setS] = useState('turkce')
  const [ses, setSes] = useState(7)
  const [yuk, setYuk] = useState(35)
  return (
    <Win95Window id="bilesenler" baslik="Bileşenler (Madde 11 · 14)" ikon="pencere">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GroupBox legend="<DialogBox>: X kapatma tuşlu diyalog">
          <div className="flex flex-wrap gap-1.5 pt-1">
            {DIYALOG.map((d) => (
              <Button
                key={d.ad}
                ikon={d.ikon}
                className="min-w-0"
                onClick={async () => {
                  const c = await w.sor({ baslik: d.baslik, ikon: d.ikon, mesaj: <p>{d.mesaj}</p>, butonlar: d.butonlar })
                  setYanit(d.butonlar.find((b) => b.deger === c)?.ad ?? c)
                }}
              >
                {d.ad}
              </Button>
            ))}
          </div>
          <p className="mt-2">
            Son yanıt: <output data-yanit="">{yanit}</output>
          </p>
          <p className="mt-1 text-[0.8125rem] text-muted">Kipli: arkası tıklanmaz. Enter varsayılan düğmeyi, Esc ya da X iptali seçer; odak eski yerine döner.</p>
        </GroupBox>
        <GroupBox legend="<StartButton> ve görev çubuğu">
          <p className="pt-1">Ekranın altındaki görev çubuğu sayfanın gezinmesi: Başlat menüsünde programlar ve bölümler, ortada açık pencereler, sağda saat.</p>
          <Button
            className="mt-2"
            onClick={() => {
              const b = document.querySelector<HTMLButtonElement>('[data-gorev] [aria-haspopup="menu"]')
              b?.click()
            }}
          >
            Başlat menüsünü aç
          </Button>
        </GroupBox>
        <div className="lg:col-span-2">
          <Win95Window baslik="<Win95Window>: bu pencere de bir bileşen" ikon="not" seviye="h3">
            <p>Başlık çubuğundaki küçült düğmesi gövdeyi katlar. Masaüstündeki pencereler ayrıca sürüklenir, ekranı kaplar ve görev çubuğuna küçülür.</p>
            <p className="mt-2 flex flex-wrap gap-1.5">
              <Button onClick={() => w.ac('not')}>Not Defteri'ni aç</Button>
              <Button onClick={() => w.ac('mayin')}>Mayın Tarlası'nı aç</Button>
            </p>
          </Win95Window>
        </div>
        <GroupBox legend="Klasik sekmeler">
          <Tabs
            etiket="Örnek sekmeler"
            sekmeler={[
              { id: 'a', ad: 'Genel', icerik: <p>Seçili sekme 2 piksel yükselir ve alttaki panele kaynaşır.</p> },
              { id: 'b', ad: 'Güvenlik', icerik: <p>Sol ve sağ ok tuşları sekmeler arasında gezer.</p> },
              { id: 'c', ad: 'Ayrıntılar', icerik: <p>Home ilk, End son sekmeye gider.</p> },
            ]}
          />
        </GroupBox>
        <GroupBox legend="Form denetimleri">
          <div className="grid gap-2 pt-1">
            <label className="grid gap-0.5">
              Metin kutusu
              <input className="field px-1.5 py-0.5" defaultValue={'C:\\OYUNLAR'} />
            </label>
            <Check label="Onay kutusu" checked={c1} onChange={setC1} />
            <Radios
              legend="Radyo düğmeleri"
              name="ornek-radyo"
              value={r}
              onChange={setR}
              yatay
              options={[
                { id: 'kucuk', ad: 'Küçük simgeler' },
                { id: 'buyuk', ad: 'Büyük simgeler' },
              ]}
            />
            <Select
              label="Açılır liste:"
              value={s}
              onChange={setS}
              options={[
                { id: 'turkce', ad: 'Türkçe (Q klavye)' },
                { id: 'f', ad: 'Türkçe (F klavye)' },
                { id: 'en', ad: 'İngilizce (ABD)' },
              ]}
            />
            <label className="grid gap-0.5">
              <span>Kaydırıcı: ses {ses}</span>
              <input type="range" className="t95" min={0} max={10} value={ses} onChange={(e) => setSes(+e.target.value)} />
            </label>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <Progress deger={yuk} etiket="Örnek ilerleme" />
              </div>
              <Button className="min-w-0" onClick={() => setYuk((y) => (y >= 100 ? 0 : y + 15))}>
                +%15
              </Button>
            </div>
          </div>
        </GroupBox>
      </div>
      <div className="mt-4">
        <Code etiket="Bileşen kullanımı">{KOD}</Code>
      </div>
    </Win95Window>
  )
}

/** Madde 12 · 13: Figma'da iç çizgi (Inner Stroke) ve tokenlar */
export function Figma() {
  const [katman, setKatman] = useState({ ust: true, alt: true, dolgu: true })
  return (
    <Win95Window id="figma" baslik="Figma (Madde 12 · 13)" ikon="goruntu">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <GroupBox legend="Kabartma: iç gölge değil, iç çizgi">
          <p className="pt-1">Figma'da düğmenin dört kenarına ayrı ayrı 2 piksellik Inside çizgi verilir. İç gölge bulanır ve köşelerde yumuşar; iç çizgi pikseli pikseline keskin kalır ve CSS'teki border ile birebir örtüşür.</p>
          <div className="mt-3 grid gap-1">
            <Check label="Stroke · Inside · üst + sol · 2 · #FFFFFF" checked={katman.ust} onChange={(v) => setKatman((k) => ({ ...k, ust: v }))} />
            <Check label="Stroke · Inside · alt + sağ · 2 · #808080" checked={katman.alt} onChange={(v) => setKatman((k) => ({ ...k, alt: v }))} />
            <Check label="Fill · #C0C0C0" checked={katman.dolgu} onChange={(v) => setKatman((k) => ({ ...k, dolgu: v }))} />
          </div>
          <div className="mt-3 grid place-items-center bg-teal py-6">
            <span
              className="grid h-10 w-40 place-items-center border-2 text-black"
              style={{
                borderTopColor: katman.ust ? '#FFFFFF' : 'transparent',
                borderLeftColor: katman.ust ? '#FFFFFF' : 'transparent',
                borderBottomColor: katman.alt ? '#808080' : 'transparent',
                borderRightColor: katman.alt ? '#808080' : 'transparent',
                background: katman.dolgu ? '#C0C0C0' : 'transparent',
              }}
              data-figma-katman={Number(katman.ust) + Number(katman.alt) + Number(katman.dolgu)}
            >
              Tamam
            </span>
          </div>
        </GroupBox>
        <GroupBox legend="Tokenlar">
          <div className="field k95 mt-1 overflow-x-auto">
            <table className="w-full min-w-[22rem] text-left text-[0.8125rem]">
              <caption className="sr-only">Figma token adları ve değerleri</caption>
              <thead>
                <tr>
                  {['Token', 'Değer'].map((h) => (
                    <th key={h} scope="col" className="outset px-2 py-0.5 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['Color/Win95Grey', '#C0C0C0'],
                    ['Color/Navy', '#000080'],
                    ['Color/Teal', '#008080'],
                    ['Color/White', '#FFFFFF'],
                    ['Color/BevelShadow', '#808080'],
                    ['Border/ClassicOutset', '2px inside · üst, sol #FFF · alt, sağ #808080'],
                    ['Border/ClassicInset', '2px inside · üst, sol #808080 · alt, sağ #FFF'],
                    ['Border/DefaultButton', 'ClassicOutset + 1px dış #000'],
                    ['Radius/None', '0'],
                  ] as const
                ).map(([a, b]) => (
                  <tr key={a}>
                    <th scope="row" className="px-2 py-1 font-mono font-normal">
                      {a}
                    </th>
                    <td className="px-2 py-1">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[0.8125rem] text-muted">Tam liste: tokens/win.tokens.json</p>
        </GroupBox>
      </div>
    </Win95Window>
  )
}

const TANIM = 'border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600 bg-gray-300'
const DUZELTME = 'border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-gray-600 border-r-gray-600 bg-gray-300'

function Kenarlar({ sinif, etiket }: { sinif: string; etiket: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [k, setK] = useState<string[]>([])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const s = getComputedStyle(el)
    const hex = (c: string) => '#' + (c.match(/\d+/g) ?? []).slice(0, 3).map((x) => (+x).toString(16).padStart(2, '0').toUpperCase()).join('')
    setK([hex(s.borderTopColor), hex(s.borderLeftColor), hex(s.borderBottomColor), hex(s.borderRightColor)])
  }, [sinif])
  return (
    <div>
      <p className="mb-1 font-bold">{etiket}</p>
      <div className="grid place-items-center bg-teal py-4">
        <span ref={ref} className={`${sinif} grid h-10 w-36 place-items-center text-black`}>
          Tamam
        </span>
      </div>
      <p className="mt-1 font-mono text-[0.75rem]" data-kenar={k.join(',')}>
        üst {k[0]} · sol {k[1]} · alt {k[2]} · sağ {k[3]}
      </p>
    </div>
  )
}

/** Madde 15: tanımdaki Tailwind satırı ve içindeki tuzak */
export function Css() {
  return (
    <Win95Window id="css" baslik="CSS / Tailwind (Madde 15)" ikon="not">
      <p>
        Tanımdaki satır: <code className="field inline-block px-1 font-mono text-[0.8125rem] break-all">{TANIM}</code>
      </p>
      <p className="mt-2">
        Tuzak: <code className="font-mono">border-white</code> ve <code className="font-mono">border-gray-600</code> ikisi de dört kenarın rengini birden verir; CSS'te sonra gelen kazanır ve dört kenar aynı renge döner. Kabartma kaybolur (aşağıda ölçülen renklere bakın). Kenar renkleri kenar kenar yazılınca düzelir. Bu sayfada <code className="font-mono">gray-300</code> #C0C0C0'a, <code className="font-mono">gray-600</code> #808080'e bağlıdır.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Kenarlar sinif={TANIM} etiket="Tanımdaki gibi" />
        <Kenarlar sinif={DUZELTME} etiket="Kenar kenar" />
      </div>
      <div className="mt-3 grid gap-3">
        <Code etiket="Düzeltilmiş Tailwind satırı">{DUZELTME}</Code>
        <Code etiket="Bu sayfanın kabartma sınıfları">{`.outset { border: 2px solid; border-color: #FFF #808080 #808080 #FFF; background: #C0C0C0; }
.inset  { border: 2px solid; border-color: #808080 #FFF #FFF #808080; }
.btn:active { border-color: #808080 #FFF #FFF #808080; padding: 3px 13px 1px 15px; }
/* box-shadow yok, border-radius yok, transition yok */`}</Code>
      </div>
    </Win95Window>
  )
}
