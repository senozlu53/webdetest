import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { usePaper, type Doku, type DerinlikTercih, type HareketTercih, type Kontrast } from '../lib/store'
import { Kesik } from './Kesik'
import { PaperButton, PaperCard } from './Paper'
import { Secim, Yarik } from './Oyuk'

export const NAV = [
  ['palet', 'Renk'],
  ['yazi', 'Yazı'],
  ['sekil', 'Şekil'],
  ['golge', 'Gölge'],
  ['doku', 'Doku'],
  ['ikonlar', 'İkon'],
  ['hikaye', 'Hikâye'],
  ['dukkan', 'Dükkân'],
  ['form', 'Form'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['css', 'CSS'],
  ['hareket', 'Paralaks'],
  ['mobil', 'Derinlik'],
  ['erisim', 'Erişim'],
] as const

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = usePaper()
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
      <Secim<Doku>
        legend="Doku"
        name={`${onek}doku`}
        value={s.doku}
        onChange={s.setDoku}
        options={[
          { id: 'karton', ad: 'Karton', renk: 'var(--kraft)' },
          { id: 'suluboya', ad: 'Suluboya', renk: 'var(--gokyuzu)' },
          { id: 'duz', ad: 'Düz', renk: 'var(--bej)' },
        ]}
      />
      <Secim<Kontrast>
        legend="Kontrast"
        name={`${onek}kontrast`}
        value={s.kontrast}
        onChange={s.setKontrast}
        options={[
          { id: 'normal', ad: 'Normal' },
          { id: 'yuksek', ad: 'Yüksek', renk: 'var(--mercan)' },
        ]}
      />
      <Secim<DerinlikTercih>
        legend={`Katman derinliği · şu an ${s.derinlik}`}
        name={`${onek}derinlik`}
        value={s.derinlikTercih}
        onChange={s.setDerinlikTercih}
        options={[
          { id: 'oto', ad: 'Oto' },
          { id: '1', ad: '1' },
          { id: '2', ad: '2' },
          { id: '3', ad: '3' },
          { id: '4', ad: '4' },
          { id: '5', ad: '5' },
        ]}
      />
      <Yarik label="Işık: gölge yönü" value={s.isik} min={0} max={359} step={9} onChange={s.setIsik} format={(v) => `${v}°`} renk="var(--gunes)" />
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
    <header className="relative z-[80] mx-auto w-full max-w-[1240px] px-3 pt-3 md:sticky md:top-2 md:px-6">
      <a href="#icerik" className="pbtn sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50" data-boy="k">
        <span className="kagit-yuz" data-duz="" style={{ ['--c' as string]: 'var(--gunes)' }}>
          İçeriğe geç
        </span>
      </a>
      <PaperCard nivel={4} duz tohum={31} r={22} dalga={3} adim={130} yuzClass="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 md:flex-nowrap">
        <a href="#ust" className="flex shrink-0 items-center gap-2 no-underline" aria-label="Kâğıt Orman, başa dön">
          <Kesik ad="agac" boyut={40} nivel={1} />
          <span className="font-baslik text-[26px] leading-none whitespace-nowrap">Kâğıt Orman</span>
        </a>
        <nav aria-label="Bölümler" className="order-last -mx-1 w-full min-w-0 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:order-none md:mx-0 md:w-auto md:flex-1 md:pb-0">
          <ul className="m-0 flex list-none gap-1 p-0 md:justify-center-safe">
            {NAV.map(([id, ad]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={aktif === id ? 'true' : undefined}
                  className={cx('flex min-h-12 items-center rounded-[14px_8px_16px_9px/9px_16px_8px_14px] px-3 text-[16px] font-extrabold whitespace-nowrap no-underline', aktif === id ? 'bg-gunes shadow-[0_2px_0_rgb(52_34_16/0.3)]' : 'hover:bg-bej')}
                >
                  {ad}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Popover.Root>
          <Popover.Trigger asChild>
            <PaperButton renk="var(--turkuaz)" boy="i" className="ml-auto" aria-label="Görünüm ayarları" tohum={5}>
              <Kesik ad="ayar" boyut={26} nivel={1} halo={false} renk="var(--krem)" />
            </PaperButton>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="end" sideOffset={12} collisionPadding={12} className="z-[95] max-h-[80vh] w-[min(400px,calc(100vw-24px))] overflow-y-auto" data-ayarlar="">
              <PaperCard nivel={5} duz tohum={41} r={22} dalga={3} yuzClass="p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="font-baslik text-[32px] leading-none">Ayarlar</p>
                  <Popover.Close asChild>
                    <PaperButton renk="var(--mercan)" boy="i" aria-label="Kapat" tohum={6}>
                      <Kesik ad="kapat" boyut={22} nivel={1} halo={false} renk="var(--krem)" />
                    </PaperButton>
                  </Popover.Close>
                </div>
                <Ayarlar />
                <p className="mt-5 flex gap-4">
                  <a href="../../">Tüm stiller</a>
                  <a href="../025/">Stil 025</a>
                </p>
              </PaperCard>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </PaperCard>
    </header>
  )
}
