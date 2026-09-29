import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useNouveau, type Doku, type HareketTercih, type Kontrast, type SusTercih, type TemaTercih } from '../lib/store'
import { Ikon } from './Ikon'
import { NouveauButton } from './Nouveau'
import { Secim } from './ui'

export const NAV = [
  ['palet', 'Renk'],
  ['yazi', 'Yazı'],
  ['sekil', 'Şekil'],
  ['derinlik', 'Derinlik'],
  ['doku', 'Doku'],
  ['ikonlar', 'İkon'],
  ['muze', 'Müze'],
  ['antikaci', 'Antikacı'],
  ['parfum', 'Parfüm'],
  ['atolye', 'Atölye'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['css', 'CSS'],
  ['hareket', 'Hareket'],
  ['mobil', 'Mobil'],
  ['erisim', 'Erişim'],
] as const

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useNouveau()
  const temaAd = { parsomen: 'parşömen', zeytin: 'zeytin', gece: 'gece' }[s.tema]
  return (
    <div className="grid grid-cols-1 gap-6">
      <Secim<TemaTercih>
        legend={`Tema · şu an ${temaAd}`}
        name={`${onek}tema`}
        value={s.temaTercih}
        onChange={s.setTemaTercih}
        options={[
          { id: 'oto', ad: 'Oto' },
          { id: 'parsomen', ad: 'Parşömen' },
          { id: 'zeytin', ad: 'Zeytin' },
          { id: 'gece', ad: 'Gece' },
        ]}
      />
      <Secim<Doku>
        legend="Doku"
        name={`${onek}doku`}
        value={s.doku}
        onChange={s.setDoku}
        options={[
          { id: 'parsomen', ad: 'Parşömen' },
          { id: 'cicek', ad: 'Preslenmiş çiçek' },
          { id: 'duvar', ad: 'Duvar kâğıdı' },
          { id: 'duz', ad: 'Düz' },
        ]}
      />
      <Secim<SusTercih>
        legend={`Süs · şu an ${{ tam: 'tam', sade: 'sade', yalin: 'yalın' }[s.sus]}`}
        name={`${onek}sus`}
        value={s.susTercih}
        onChange={s.setSusTercih}
        options={[
          { id: 'oto', ad: 'Oto' },
          { id: 'tam', ad: 'Tam' },
          { id: 'sade', ad: 'Sade' },
          { id: 'yalin', ad: 'Yalın' },
        ]}
      />
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
    <>
      <a href="#icerik" className="nbtn sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:bg-panel" data-boy="k">
        <span className="nbtn-ic">İçeriğe geç</span>
      </a>
      <header className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6 px-5 pt-6 pb-4 sm:px-8 lg:px-12">
        <a href="#ust" className="flex items-center gap-3 no-underline" aria-label="Süsen, başa dön">
          <Ikon ad="zambak" boyut={38} className="text-zeytin" kalin={1.5} />
          <span>
            <span className="block font-baslik text-[26px] leading-none text-metin">Süsen</span>
            <span className="kicker block !text-[10.5px] !tracking-[0.22em] max-[380px]:hidden">Müze · Atölye · Koku</span>
          </span>
        </a>
        <Popover.Root>
          <Popover.Trigger asChild>
            <NouveauButton varyant="metin" boy="k" aria-label="Görünüm ayarları" ikon={<Ikon ad="menu" boyut={20} />}>
              <span className="max-[380px]:sr-only">Görünüm</span>
            </NouveauButton>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="end" sideOffset={12} collisionPadding={12} className="sade-panel relative z-[95] max-h-[80vh] w-[min(440px,calc(100vw-24px))] overflow-y-auto p-7" data-ayarlar="">
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="font-baslik text-[28px] leading-none">Görünüm</p>
                <Popover.Close asChild>
                  <NouveauButton varyant="metin" boy="k" aria-label="Kapat" ikon={<Ikon ad="kapat" boyut={18} />}>
                    Kapat
                  </NouveauButton>
                </Popover.Close>
              </div>
              <Ayarlar />
              <p className="mt-6 flex gap-7 text-[17px]">
                <a href="../../">Tüm stiller</a>
                <a href="../029/">Stil 029</a>
              </p>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </header>
      <nav aria-label="Bölümler" className="sticky top-0 z-[80]" style={{ backgroundColor: 'var(--zemin)' }}>
        <ul className="m-0 mx-auto flex max-w-[1240px] list-none gap-1 overflow-x-auto p-0 px-3 [scrollbar-width:none] sm:px-6 lg:px-10">
          {NAV.map(([id, ad]) => (
            <li key={id} className="shrink-0">
              <a href={`#${id}`} aria-current={aktif === id ? 'true' : undefined} className={cx('relative flex min-h-12 items-center px-3.5 font-metin text-[15.5px] font-bold whitespace-nowrap no-underline', aktif === id ? 'text-metin' : 'text-soluk hover:text-metin')}>
                <span lang={id === 'figma' || id === 'css' ? 'en' : undefined}>{ad}</span>
                {aktif === id ? <span className="absolute inset-x-3 bottom-1 h-2.5 bg-gold [mask:var(--m-dalga-hat)_repeat-x_0_center/48px_10px]" aria-hidden="true" /> : null}
              </a>
            </li>
          ))}
        </ul>
        <div className="dalga-hat" aria-hidden="true" />
      </nav>
    </>
  )
}
