import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useKawaii, type HareketTercih, type Kontrast } from '../lib/store'
import { Mascot } from './Mascot'
import { Ikon } from './Icons'
import { KSwitch, Secim } from './ui'

export const NAV = [
  ['palet', 'Renk'],
  ['yazi', 'Yazı'],
  ['ikonlar', 'İkon'],
  ['sayi', 'Sayı Bahçesi'],
  ['dil', 'Dil'],
  ['hafiza', 'Oyun'],
  ['pofuduk', 'Evcil'],
  ['hatalar', 'Hatalar'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['hareket', 'Hareket'],
  ['erisim', 'Erişim'],
] as const

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useKawaii()
  return (
    <div className="grid grid-cols-1 gap-5">
      <Secim<HareketTercih>
        legend={`Hareket · şu an ${s.hareket ? 'açık' : 'kapalı'}`}
        name={`${onek}hareket`}
        value={s.hareketTercih}
        onChange={s.setHareketTercih}
        options={[
          { id: 'oto', ad: 'Oto' },
          { id: 'acik', ad: 'Açık' },
          { id: 'kapali', ad: 'Kapalı' },
        ]}
      />
      <Secim<Kontrast>
        legend="Kontrast"
        name={`${onek}kontrast`}
        value={s.kontrast}
        onChange={s.setKontrast}
        options={[
          { id: 'normal', ad: 'Normal' },
          { id: 'yuksek', ad: 'Yüksek' },
        ]}
      />
      <KSwitch label="Maskot animasyonu" hint="Lottie maskotları zıplar ve göz kırpar. Kapalıyken durağan." checked={s.maskot} onChange={s.setMaskot} />
    </div>
  )
}

export function Header() {
  const [aktif, setAktif] = useState('')
  useEffect(() => {
    const els = NAV.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (es) => {
        const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (v) setAktif(v.target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
  return (
    <header className="sticky top-0 z-[80] px-2 pt-2 md:px-4">
      <a href="#icerik" className="kbtn sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50" data-boy="k">
        İçeriğe geç
      </a>
      <div className="kabarcik mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 md:flex-nowrap md:px-4">
        <a href="#ust" className="flex shrink-0 items-center gap-1.5 no-underline" aria-label="Pamuk, başa dön">
          <Mascot boyut={42} renk="peach" />
          <span className="font-display text-[26px] font-extrabold">Pamuk</span>
        </a>
        <nav aria-label="Bölümler" className="order-last -mx-1 w-full min-w-0 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:order-none md:mx-0 md:w-auto md:flex-1 md:pb-0">
          <ul className="m-0 flex list-none gap-1 p-0 md:justify-center-safe">
            {NAV.map(([id, ad]) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={aktif === id ? 'true' : undefined} className={cx('block rounded-bubble px-3.5 py-2 text-[15px] font-extrabold whitespace-nowrap no-underline', aktif === id ? 'bg-mint shadow-[0_4px_10px_rgb(76_175_136/0.35)]' : 'hover:bg-cream')}>
                  {ad}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button type="button" className="kbtn ml-auto !size-12 !min-h-12 !p-0" data-renk="mint" aria-label="Görünüm ayarları">
              <Ikon ad="ayar" boyut={28} />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="end" sideOffset={12} collisionPadding={12} className="kabarcik z-[95] w-[min(380px,calc(100vw-24px))] p-6 text-brown">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-display text-[28px] font-extrabold">Ayarlar</p>
                <Popover.Close className="kbtn !size-12 !min-h-12 !p-0" data-renk="paper" aria-label="Kapat">
                  <Ikon ad="kapat" boyut={22} />
                </Popover.Close>
              </div>
              <Ayarlar />
              <p className="mt-5 flex gap-4">
                <a href="../../">Tüm stiller</a>
                <a href="../023/">Stil 023</a>
              </p>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </header>
  )
}
