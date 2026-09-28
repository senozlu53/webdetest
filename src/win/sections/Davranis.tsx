import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { OLCEK, useWin, type Olcek } from '../lib/store'
import { Win95Window } from '../components/Win95Window'
import { Glif, Pixel } from '../components/Pixel'
import { Button, GroupBox, Progress, Radios } from '../components/ui'

/** Madde 16: animasyon yok; tık anında sonuç, yalnız yüklemede kum saati */
export function Hareket() {
  const w = useWin()
  const [yuzde, setYuzde] = useState(0)
  const [kopya, setKopya] = useState(false)
  const [olcum, setOlcum] = useState<string>('—')
  const [anim, setAnim] = useState<number | null>(null)
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnim(document.getAnimations().length))
    return () => cancelAnimationFrame(id)
  }, [kopya])
  const kopyala = async () => {
    setKopya(true)
    setYuzde(0)
    for (let k = 1; k <= 20; k++) {
      await w.bekle(100)
      setYuzde(k * 5)
    }
    setKopya(false)
    w.duyur('Kopyalama tamamlandı')
  }
  return (
    <Win95Window id="hareket" baslik="Hareket (Madde 16)" ikon="kumsaati">
      <p>Hiçbir şey kaymaz, solmaz, büyümez. Tıklayınca pencere o karede açılır; bekleme varsa imleç kum saatine döner.</p>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
        <GroupBox legend="Anında">
          <p className="pt-1">Pencere açılışı ile tık arasındaki süre ölçülür.</p>
          <Button
            className="mt-2"
            onClick={() => {
              const t0 = performance.now()
              w.ac('bilgisayar')
              requestAnimationFrame(() => {
                const ok = document.querySelector('[data-app="bilgisayar"]')
                setOlcum(ok ? `${Math.round(performance.now() - t0)} ms, bir karede` : 'açılmadı')
              })
            }}
          >
            Bilgisayarım'ı aç
          </Button>
          <p className="mt-2">
            Ölçüm: <output data-olcum="">{olcum}</output>
          </p>
          <p className="mt-1 text-[0.8125rem]">
            Sayfada çalışan animasyon: <b data-anim={anim ?? ''}>{anim ?? '…'}</b>
          </p>
        </GroupBox>
        <GroupBox legend="Yalnız kum saati">
          <div className="flex items-start gap-3 pt-1">
            <Pixel ad="kumsaati" boyut={2} />
            <p>Kopyalama sürerken imleç her yerde kum saatidir. İlerleme çubuğu blok blok, ara karesiz dolar.</p>
          </div>
          <div className="mt-2">
            <Progress deger={yuzde} etiket="Kopyalama" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Button onClick={() => void kopyala()} disabled={kopya}>
              Dosyaları kopyala
            </Button>
            <span data-mesgul={w.mesgul ? '1' : '0'}>{w.mesgul ? 'Meşgul…' : yuzde === 100 ? 'Tamamlandı' : 'Hazır'}</span>
          </div>
        </GroupBox>
      </div>
      <p className="mt-3 text-[0.8125rem] text-muted">CSS: bütün öğelerde animation ve transition kapalı. Hareketi azalt tercihi olan kullanıcı için ayrıca bir şey kapatmaya gerek yok.</p>
    </Win95Window>
  )
}

/** Madde 17: form korunur, pencere telefonda tam ekran olur */
export function Mobil() {
  const [w, setW] = useState(390)
  const kutu = useRef<HTMLDivElement>(null)
  const [alan, setAlan] = useState(900)
  useLayoutEffect(() => {
    const el = kutu.current
    if (!el) return
    const ro = new ResizeObserver(() => setAlan(Math.floor(el.clientWidth)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const zoom = Math.min(1, alan / w)
  const tam = w < 768
  const form = (
    <div className="grid gap-1.5 p-2 text-[0.8125rem]">
      <label className="grid gap-0.5">
        Kullanıcı adı
        <span className="field block h-5" />
      </label>
      <label className="grid gap-0.5">
        Parola
        <span className="field block h-5" />
      </label>
      <div className="flex justify-end gap-1">
        <span className="btn min-h-6 min-w-12 px-2">Tamam</span>
        <span className="btn min-h-6 min-w-12 px-2">İptal</span>
      </div>
    </div>
  )
  return (
    <Win95Window id="mobil" baslik="Mobil (Madde 17)" ikon="bilgisayar">
      <p>Telefonda pencere kavramı tam ekrana dönüşür: sürükleme ve ekranı kaplama düğmesi kalkar, pencere görev çubuğuna kadar bütün alanı kaplar. İçindeki form aynen kalır: aynı alanlar, aynı sıra, aynı düğmeler.</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label htmlFor="cerceve" className="shrink-0">
          Ekran genişliği: {w}px
        </label>
        <input id="cerceve" type="range" className="t95 min-w-[10rem] flex-1" min={320} max={1024} step={2} value={w} onChange={(e) => setW(+e.target.value)} aria-valuetext={`${w} piksel, ${tam ? 'tam ekran pencere' : 'yüzen pencere'}`} />
        {[360, 390, 768, 1024].map((v) => (
          <Button key={v} className="min-w-0 px-2" aria-pressed={w === v} onClick={() => setW(v)}>
            {v}
          </Button>
        ))}
      </div>
      <p className="mt-2 font-bold" aria-live="polite">
        {tam ? 'Tam ekran pencere, form aynı' : 'Masaüstünde yüzen pencere'}
      </p>
      <div ref={kutu} className="mt-2">
        <div className="inset overflow-hidden" style={{ width: w, zoom }} aria-hidden="true" data-cerceve={tam ? 'tam' : 'yuzen'}>
          <div className="relative h-[16rem] bg-teal">
            {tam ? (
              <div className="outset absolute inset-x-0 top-0 bottom-7 flex flex-col p-0.5">
                <div className="baslik">
                  <span className="flex-1 truncate">Oturum aç</span>
                  <span className="tb">
                    <Glif tip="kapat" />
                  </span>
                </div>
                {form}
              </div>
            ) : (
              <>
                <div className="absolute top-3 left-3 grid gap-2 text-center text-[0.6875rem] text-white">
                  <Pixel ad="bilgisayar" boyut={1.5} />
                  <Pixel ad="klasor" boyut={1.5} />
                </div>
                <div className="outset absolute top-8 left-1/2 w-[18rem] -translate-x-1/2 p-0.5">
                  <div className="baslik">
                    <span className="flex-1 truncate">Oturum aç</span>
                    <span className="tb">
                      <Glif tip="kucult" />
                    </span>
                    <span className="tb">
                      <Glif tip="buyut" />
                    </span>
                    <span className="tb">
                    <Glif tip="kapat" />
                  </span>
                  </div>
                  {form}
                </div>
              </>
            )}
            <div className="absolute inset-x-0 bottom-0 flex h-7 items-center gap-1 border-t-2 border-t-[var(--hi)] bg-face px-1">
              <span className="btn min-h-5 min-w-0 px-1.5 text-[0.75rem] font-bold">Başlat</span>
            </div>
          </div>
        </div>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        <li>768 pikselin altında masaüstü pencereleri ve diyaloglar görev çubuğunun üstündeki bütün alanı kaplar.</li>
        <li>Masaüstü simgeleri üç sütunlu bir ızgaraya dizilir; tek dokunuş açar.</li>
        <li>Görev çubuğu altta kalır; açık pencere düğmeleri yalnız ikon olur.</li>
      </ul>
    </Win95Window>
  )
}

/** Madde 18: rem tabanlı ölçek */
export function Erisim() {
  const w = useWin()
  const [olc, setOlc] = useState<Record<string, number>>({})
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const px = (sel: string, f: (e: HTMLElement) => number) => {
        const e = document.querySelector<HTMLElement>(sel)
        return e ? Math.round(f(e) * 10) / 10 : 0
      }
      setOlc({
        kok: parseFloat(getComputedStyle(document.documentElement).fontSize),
        govde: parseFloat(getComputedStyle(document.body).fontSize),
        dugme: px('#erisim .btn', (e) => e.getBoundingClientRect().height),
        baslik: px('#erisim .baslik', (e) => e.getBoundingClientRect().height),
        ikon: px('#erisim [data-ikon]', (e) => e.getBoundingClientRect().width),
        gorev: px('[data-gorev]', (e) => e.getBoundingClientRect().height),
      })
    })
    return () => cancelAnimationFrame(id)
  }, [w.olcek, w.yazi])
  return (
    <Win95Window id="erisim" baslik="Erişilebilirlik (Madde 18)" ikon="bilgi">
      <p>1995'in 11 piksellik sistem yazısı bugünün ekranlarında okunmaz. Bu sayfada bütün ölçüler rem: kök yazı büyüyünce yazı, düğme, başlık çubuğu, ikon ve görev çubuğu birlikte büyür. Tarayıcının yazı boyutu ayarı da aynı yolu izler.</p>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Radios<Olcek> legend="Yazı boyutu" name="erisim-olcek" value={w.olcek} onChange={w.setOlcek} options={(Object.keys(OLCEK) as Olcek[]).map((k) => ({ id: k, ad: `${OLCEK[k].ad} (%${OLCEK[k].yuzde})` }))} />
        <GroupBox legend="Şu anki ölçüler">
          <table className="text-[0.875rem] tabular-nums" data-olcum-tablo="">
            <caption className="sr-only">Piksel ölçüleri</caption>
            <tbody>
              {(
                [
                  ['Kök yazı', olc.kok],
                  ['Arayüz yazısı', olc.govde],
                  ['Düğme yüksekliği', olc.dugme],
                  ['Başlık çubuğu', olc.baslik],
                  ['İkon', olc.ikon],
                  ['Görev çubuğu', olc.gorev],
                ] as const
              ).map(([a, b]) => (
                <tr key={a}>
                  <th scope="row" className="py-0.5 pr-4 text-left font-normal">
                    {a}
                  </th>
                  <td className="py-0.5">{b ? `${String(b).replace('.', ',')} px` : '…'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 flex items-center gap-2">
            <Pixel ad="disket" boyut={1} />
            <Button className="min-w-0">Örnek düğme</Button>
          </p>
        </GroupBox>
      </div>
      <GroupBox legend="Varyantlar ve kurallar" className="mt-4">
        <ul className="list-disc space-y-1 pl-5">
          <li>Yüksek Kontrast Siyah: Win95'in erişilebilirlik düzeni. Siyah yüz, beyaz metin, sarı link (19,56:1), mor başlık.</li>
          <li>Piksel yazı: bütün arayüz kenar yumuşatmasız piksel yazıya geçer.</li>
          <li>Kontrast: siyah metin gri yüzde 11,54:1, beyaz başlık metni lacivertte 16,01:1, masaüstü yazısı turkuazda 4,77:1.</li>
          <li>Odak: düğmelerde noktalı iç çerçeve, linklerde noktalı dış çerçeve.</li>
          <li>Klavye: Başlat menüsü oklarla, sekmeler oklarla, diyaloglar Esc ile; masaüstü simgesi Enter ile açılır, pencere Esc ile kapanır.</li>
          <li>Animasyon hiç yok; hareketi azalt tercihi zaten karşılanır.</li>
        </ul>
        <p className="mt-2 flex flex-wrap gap-1.5">
          <Button onClick={() => w.setMode(w.theme === 'dark' ? 'light' : 'dark')}>{w.theme === 'dark' ? 'Windows Standart' : 'Yüksek Kontrast Siyah'}</Button>
          <Button onClick={() => w.setYazi(w.yazi === 'piksel' ? 'sistem' : 'piksel')}>{w.yazi === 'piksel' ? 'Sistem yazısı' : 'Piksel yazı'}</Button>
        </p>
      </GroupBox>
    </Win95Window>
  )
}
