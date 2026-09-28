import { useEffect, useRef, useState } from 'react'
import { useWin } from '../lib/store'
import { IPUCLARI } from '../lib/data'
import { PALET, PALET_AD } from '../lib/pixel'
import { Win95Window } from '../components/Win95Window'
import { Pixel } from '../components/Pixel'
import { Button, Check, GroupBox, Tabs } from '../components/ui'

/** Karşılama penceresi: "Biliyor muydunuz?" ipuçları 18 maddeyi tek tek anlatır */
export function Hosgeldin() {
  const w = useWin()
  const [i, setI] = useState(0)
  const [ip, metin] = IPUCLARI[i]
  return (
    <Win95Window id="hosgeldin" seviye="h1" baslik="Hoş geldiniz · Stil 020: 90s Old Web" ikon="pencere" katlanir={false}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <p className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">
            <span className="font-bold">Pencere</span> <span className="pix text-[1.1em] font-bold text-vurgu">95</span>'e hoş geldiniz
          </p>
          <p className="mt-1 text-muted">Retro / Nostalgia – 90s Old Web (Web 1.0)</p>
          <div className="field mt-3 flex gap-3 p-3" aria-live="polite" data-ipucu={i + 1}>
            <Pixel ad="ampul" boyut={2} />
            <div className="min-w-0">
              <p className="font-bold">Biliyor muydunuz?</p>
              <p className="mt-1 font-doc text-[1.0625rem] leading-snug">
                <b>{ip}.</b> {metin}
              </p>
              <p className="mt-2 text-[0.75rem] text-muted">
                İpucu {i + 1} / {IPUCLARI.length}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-1.5 md:w-[11rem] md:flex-col">
          <Button varsayilan onClick={() => setI((x) => (x + 1) % IPUCLARI.length)}>
            Sonraki ipucu
          </Button>
          <Button onClick={() => setI((x) => (x - 1 + IPUCLARI.length) % IPUCLARI.length)}>Önceki ipucu</Button>
          <Button onClick={() => document.getElementById('ozellikler')?.scrollIntoView()}>Tura başla</Button>
          <Button ikon="goruntu" onClick={() => w.ac('goruntu')}>
            Görüntü ayarları
          </Button>
        </div>
      </div>
      <p className="mt-4 font-doc text-[1rem]">
        Bu sayfa bir masaüstü. Masaüstü simgeleri çift tıkla (ya da Enter ile, telefonda tek dokunuşla) açılır, alttaki görev çubuğundaki <b>Başlat</b> menüsü bölümlere götürür. Piksel Kulübe, FaturaKuşu 95 ve Disket Günleri kurgu; düğmeler çalışır.
      </p>
    </Win95Window>
  )
}

/** Madde 1 · 2 · 3: bir dosyanın "Özellikler" penceresi gibi */
export function Ozellikler() {
  return (
    <Win95Window id="ozellikler" baslik="90s Old Web Özellikleri (Madde 1–3)" ikon="belge">
      <Tabs
        etiket="Stil özellikleri"
        sekmeler={[
          {
            id: 'genel',
            ad: 'Genel',
            icerik: (
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <Pixel ad="pencere" boyut={2} />
                  <label className="sr-only" htmlFor="stil-adi">
                    Stil adı
                  </label>
                  <input id="stil-adi" className="field min-w-0 flex-1 px-1.5 py-0.5" readOnly value="90s Old Web (Web 1.0)" />
                </div>
                <hr className="m-0 border-0 border-t border-t-sh border-b border-b-hi" />
                <table className="text-[0.875rem]">
                  <caption className="sr-only">Genel bilgiler</caption>
                  <tbody>
                    {(
                      [
                        ['Tür', 'Görsel stil'],
                        ['Kategori', 'Retro / Nostalgia'],
                        ['Dönem', 'Grafik arayüzlerin ilk yılları, Web 1.0'],
                        ['Konum', 'C:\\STILLER\\020'],
                        ['Boyut', '18 madde'],
                      ] as const
                    ).map(([a, b]) => (
                      <tr key={a}>
                        <th scope="row" className="w-28 py-1 text-left font-normal">
                          {a}:
                        </th>
                        <td className="py-1">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            id: 'gorsel',
            ad: 'Görsel referans',
            icerik: (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <li className="flex items-center gap-3">
                  <span className="outset grid size-12 shrink-0 place-items-center">
                    <span className="baslik h-3 w-9 min-h-0 p-0" />
                  </span>
                  Klasik gri pencereler
                </li>
                <li className="flex items-center gap-3">
                  <span className="btn min-w-0 shrink-0" aria-hidden="true">
                    Tamam
                  </span>
                  Kalın 3D kabartmalı düğmeler
                </li>
                <li className="flex items-center gap-3 font-doc text-[1rem]">
                  <a href="#renk" className="shrink-0">
                    mavi link
                  </a>
                  <span className="font-ui text-[0.875rem]">Saf mavi, altı çizili linkler</span>
                </li>
                <li className="flex items-center gap-3">
                  <Pixel ad="disket" boyut={2} />
                  Piksel ikonlar
                </li>
              </ul>
            ),
          },
          {
            id: 'karakter',
            ad: 'Karakteristikler',
            icerik: (
              <GroupBox legend="Bu stil">
                <ul className="grid gap-1.5">
                  {['Sistem grisi zeminler (#C0C0C0)', '2 piksellik kabartma (bevel) çerçeveler', 'Varsayılan mavi linkler (#0000FF)', 'Times New Roman dominasyonu', 'Kare köşe, gölgesiz, animasyonsuz'].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <Pixel ad="disket" />
                      {t}
                    </li>
                  ))}
                </ul>
              </GroupBox>
            ),
          },
        ]}
      />
    </Win95Window>
  )
}

const ANA: { ad: string; hex: string; token: string; rol: string; metin: string; oran: string }[] = [
  { ad: 'Windows Grisi', hex: '#C0C0C0', token: 'Color/Win95Grey', rol: 'pencere, düğme, görev çubuğu', metin: 'siyah', oran: '11,54' },
  { ad: 'Deniz Mavisi', hex: '#000080', token: 'Color/Navy', rol: 'etkin başlık, seçim', metin: 'beyaz', oran: '16,01' },
  { ad: 'Turkuaz', hex: '#008080', token: 'Color/Teal', rol: 'masaüstü', metin: 'beyaz', oran: '4,77' },
  { ad: 'Saf Beyaz', hex: '#FFFFFF', token: 'Color/White', rol: 'belge alanı, kabartmanın ışıklı kenarı', metin: 'siyah', oran: '21,00' },
]

/** Madde 4: renk paleti */
export function Renk() {
  return (
    <Win95Window id="renk" baslik="Renk (Madde 4)" ikon="goruntu">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ANA.map((r) => (
          <li key={r.hex} className="outset p-2">
            <div className="inset h-16" style={{ background: r.hex }} aria-hidden="true" />
            <h3 className="mt-2 font-bold">{r.ad}</h3>
            <p className="font-mono text-[0.8125rem]">
              {r.hex} · {r.token}
            </p>
            <p className="text-[0.8125rem] text-muted">{r.rol}</p>
            <p className="text-[0.8125rem]">
              Üstünde {r.metin} metin: {r.oran}:1
            </p>
          </li>
        ))}
      </ul>
      <h3 className="mt-4 font-bold">Kabartmanın iki gri tonu</h3>
      <p className="mt-1">
        Işıklı kenar <code className="font-mono">#FFFFFF</code>, gölgeli kenar <code className="font-mono">#808080</code>. Link maviği <code className="font-mono">#0000FF</code> gri zeminde 4,72:1, beyaz belgede 8,59:1; ziyaret edilmiş mor <code className="font-mono">#800080</code> gri zeminde 5,17:1.
      </p>
      <h3 className="mt-4 font-bold">16 renk (4 bit) VGA paleti</h3>
      <p className="mt-1 text-muted">İkonlar ve duvar kağıtları yalnız bu 16 rengi kullanır.</p>
      <ul className="mt-2 grid grid-cols-2 gap-1.5 min-[420px]:grid-cols-4 lg:grid-cols-8" aria-label="16 renkli palet">
        {Object.entries(PALET).map(([k, hex]) => (
          <li key={k} className="flex items-center gap-1.5 text-[0.75rem]">
            <span className="inset size-5 shrink-0" style={{ background: hex }} aria-hidden="true" />
            <span>
              {PALET_AD[k]}
              <br />
              <span className="font-mono">{hex}</span>
            </span>
          </li>
        ))}
      </ul>
    </Win95Window>
  )
}

/** Yazıyı küçük bir tuvale çizer; yumuşatma kapalıysa yarı saydam pikseller tam siyaha ya da boşa yuvarlanır */
function BitmapYazi({ metin, yumusak, font }: { metin: string; yumusak: boolean; font: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    const w = 96
    const h = 16
    c.width = w
    c.height = h
    ctx.clearRect(0, 0, w, h)
    ctx.font = `11px ${font}`
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#000'
    ctx.fillText(metin, 2, 8.5)
    if (!yumusak) {
      const img = ctx.getImageData(0, 0, w, h)
      for (let i = 3; i < img.data.length; i += 4) img.data[i] = img.data[i] > 70 ? 255 : 0
      ctx.putImageData(img, 0, 0)
    }
  }, [metin, yumusak, font])
  return <canvas ref={ref} className="field block h-auto w-full max-w-[24rem] bg-white [image-rendering:pixelated]" aria-hidden="true" data-yumusak={yumusak ? '1' : '0'} />
}

/** Madde 5: tipografi */
export function Yazi() {
  const [yumusak, setYumusak] = useState(false)
  const ornek = 'Dosya Düzen Görünüm ĞŞİ'
  return (
    <Win95Window id="yazi" baslik="Yazı Tipleri (Madde 5)" ikon="belge">
      <div className="field k95 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left">
          <caption className="sr-only">Yazı tipi rolleri</caption>
          <thead>
            <tr>
              {['Yazı tipi', 'Nerede', 'Örnek'].map((h) => (
                <th key={h} scope="col" className="outset px-2 py-0.5 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="align-top">
            <tr>
              <th scope="row" className="px-2 py-2 text-left font-normal">
                Tahoma / MS Sans Serif
              </th>
              <td className="px-2 py-2">menü, düğme, başlık çubuğu</td>
              <td className="px-2 py-2 font-ui">{ornek}</td>
            </tr>
            <tr>
              <th scope="row" className="px-2 py-2 text-left font-normal">
                Times New Roman
              </th>
              <td className="px-2 py-2">belgeler, web sayfaları</td>
              <td className="px-2 py-2 font-doc text-[1.0625rem]">{ornek}</td>
            </tr>
            <tr>
              <th scope="row" className="px-2 py-2 text-left font-normal">
                Comic Sans
              </th>
              <td className="px-2 py-2">eğlenceli duyurular</td>
              <td className="px-2 py-2 font-fun text-[1.0625rem]">{ornek}</td>
            </tr>
            <tr>
              <th scope="row" className="px-2 py-2 text-left font-normal">
                Piksel (Pixelify Sans)
              </th>
              <td className="px-2 py-2">logolar, sayaçlar; ayarlardan bütün arayüz</td>
              <td className="pix px-2 py-2 text-[1rem]">{ornek}</td>
            </tr>
            <tr>
              <th scope="row" className="px-2 py-2 text-left font-normal">
                Courier New
              </th>
              <td className="px-2 py-2">kod, not defteri</td>
              <td className="px-2 py-2 font-mono">{ornek}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <GroupBox legend="Kenar yumuşatma (anti-aliasing)" className="mt-4">
        <p>11 piksellik yazı küçük bir tuvale çizilip büyütülür. Yumuşatma kapalıyken her piksel ya siyah ya boş: 90'ların bitmap ekran yazısı.</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <p className="text-[0.8125rem] text-muted">Tahoma, büyütülmüş</p>
            <BitmapYazi metin="Kaydet" yumusak={yumusak} font="Tahoma, 'DejaVu Sans', sans-serif" />
          </div>
          <div>
            <p className="text-[0.8125rem] text-muted">Times, büyütülmüş</p>
            <BitmapYazi metin="Kaydet" yumusak={yumusak} font="'Times New Roman', 'Liberation Serif', serif" />
          </div>
        </div>
        <p className="mt-2">
          <Check label="Kenar yumuşatmayı aç" checked={yumusak} onChange={setYumusak} />
        </p>
      </GroupBox>
      <p className="mt-3 text-[0.8125rem] text-muted">Tarayıcılar yazıyı hep yumuşatır; macOS'ta -webkit-font-smoothing: none bunu kapatır. Tam bitmap görünüm için ayarlardan piksel yazı seçilebilir.</p>
    </Win95Window>
  )
}
