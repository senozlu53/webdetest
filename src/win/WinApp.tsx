import { useEffect, useRef, useState } from 'react'
import { Duyuru, WinProvider, useWin } from './lib/store'
import { duvarKur } from './lib/duvar'
import { Taskbar } from './components/Taskbar'
import { DesktopIcons } from './components/Desktop'
import { Diyaloglar } from './components/DialogBox'
import { Belgelerim, Bilgisayarim, GeriDonusum, GoruntuOzellikleri, MayinTarlasi, NotDefteri } from './components/Apps'

import { Hosgeldin, Ozellikler, Renk, Yazi } from './sections/Temel'
import { Doku, Ikonlar, Kabartma } from './sections/Gorsel'
import { Kullanim } from './sections/Alanlar'
import { Bilesenler, Css, Figma } from './sections/Uretim'
import { Erisim, Hareket, Mobil } from './sections/Davranis'

/** "Artık bilgisayarınızı güvenle kapatabilirsiniz." */
function KapatEkrani({ onDon }: { onDon: () => void }) {
  const btn = useRef<HTMLButtonElement>(null)
  useEffect(() => btn.current?.focus(), [])
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="kapat-b" className="fixed inset-0 z-[300] grid place-items-center bg-black p-6 text-center" onKeyDown={(e) => e.key === 'Escape' && onDon()}>
      <div>
        <h2 id="kapat-b" className="pix text-[clamp(1.5rem,4vw,2.5rem)] leading-tight text-[#FF8000]">
          Artık bilgisayarınızı
          <br />
          güvenle kapatabilirsiniz.
        </h2>
        <p className="mt-6">
          <button ref={btn} type="button" className="btn" onClick={onDon}>
            Yeniden başlat
          </button>
        </p>
      </div>
    </div>
  )
}

function Masaustu() {
  const w = useWin()
  const [kapali, setKapali] = useState(false)
  useEffect(() => {
    duvarKur(w.theme === 'dark')
  }, [w.theme])
  const kapat = async () => {
    const c = await w.sor({ baslik: 'Pencere 95\'i kapat', ikon: 'bilgisayar', mesaj: <p>Bilgisayar kapatılsın mı?</p>, butonlar: [{ ad: 'Evet', deger: 'evet', varsayilan: true }, { ad: 'Hayır', deger: 'hayir' }] })
    if (c !== 'evet') return
    await w.bekle(900)
    setKapali(true)
  }
  return (
    <>
      <a href="#icerik" className="btn sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[400]">
        İçeriğe geç
      </a>
      <div className="mx-auto grid max-w-[76rem] grid-cols-1 gap-3 px-2 pt-3 md:grid-cols-[6.5rem_minmax(0,1fr)] md:gap-4 md:px-4 md:pt-4">
        <DesktopIcons />
        <main id="icerik" tabIndex={-1} className="grid min-w-0 gap-4 outline-none">
          <Hosgeldin />
          <Ozellikler />
          <Renk />
          <Yazi />
          <Kabartma />
          <Doku />
          <Ikonlar />
          <Kullanim />
          <Bilesenler />
          <Figma />
          <Css />
          <Hareket />
          <Mobil />
          <Erisim />
          <footer className="outset flex flex-wrap items-center justify-between gap-2 px-3 py-2">
            <p>
              Stil 020 · <span lang="en">90s Old Web</span>. Pencere 95, Piksel Kulübe, FaturaKuşu 95 ve Disket Günleri kurgudur.
            </p>
            <p className="flex gap-3 font-doc text-[1rem]">
              <a href="../../">Tüm stiller</a>
              <a href="../019/">Stil 019</a>
            </p>
          </footer>
        </main>
      </div>
      <Bilgisayarim />
      <Belgelerim />
      <MayinTarlasi />
      <NotDefteri />
      <GeriDonusum />
      <GoruntuOzellikleri />
      <Taskbar onKapat={() => void kapat()} />
      <Diyaloglar />
      {kapali ? <KapatEkrani onDon={() => setKapali(false)} /> : null}
      <Duyuru />
    </>
  )
}

export default function WinApp() {
  return (
    <WinProvider>
      <Masaustu />
    </WinProvider>
  )
}


