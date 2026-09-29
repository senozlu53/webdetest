import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { KUSUR_AD, type Kusur } from '../lib/cizim'
import { useWabi, type Doku, type HareketTercih, type Kontrast, type TemaTercih, type Yon } from '../lib/store'
import { Enso, WabiButton } from './Wabi'
import { Ikon } from './Ikon'
import { Secim } from './ui'

export const NAV = [
  ['felsefe', 'Felsefe'],
  ['renk', 'Renk'],
  ['yazi', 'Yazı'],
  ['sekil', 'Şekil'],
  ['derinlik', 'Derinlik'],
  ['doku', 'Doku'],
  ['ikonlar', 'İkon'],
  ['atolye', 'Atölye'],
  ['zen', 'Zen'],
  ['mimari', 'Mimari'],
  ['yayin', 'Yayın'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['css', 'CSS'],
  ['hareket', 'Hareket'],
  ['mobil', 'Mobil'],
  ['erisim', 'Erişim'],
] as const

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useWabi()
  return (
    <div className="grid grid-cols-1 gap-7">
      <Secim<TemaTercih>
        legend={`Tema · şu an ${{ kil: 'ham kil', kul: 'kül', komur: 'kömür' }[s.tema]}`}
        name={`${onek}tema`}
        value={s.temaTercih}
        onChange={s.setTemaTercih}
        options={[
          { id: 'oto', ad: 'Oto' },
          { id: 'kil', ad: 'Kil' },
          { id: 'kul', ad: 'Kül' },
          { id: 'komur', ad: 'Kömür' },
        ]}
      />
      <Secim<Doku>
        legend="Doku"
        name={`${onek}doku`}
        value={s.doku}
        onChange={s.setDoku}
        options={[
          { id: 'siva', ad: 'Sıva' },
          { id: 'beton', ad: 'Beton' },
          { id: 'kil', ad: 'Kil' },
          { id: 'seramik', ad: 'Seramik' },
          { id: 'duz', ad: 'Düz' },
        ]}
      />
      <Secim<Kusur> legend="Kusur" name={`${onek}kusur`} value={s.kusur} onChange={s.setKusur} options={(['yok', 'az', 'orta', 'cok'] as Kusur[]).map((k) => ({ id: k, ad: KUSUR_AD[k] }))} />
      <Secim<Yon>
        legend="Yaslanma"
        name={`${onek}yon`}
        value={s.yon}
        onChange={s.setYon}
        options={[
          { id: 'sol', ad: 'Sola yaslı' },
          { id: 'sag', ad: 'Sağa yaslı' },
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
      <a href="#icerik" className="wbtn sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] !bg-zemin" data-boy="k">
        İçeriğe geç
      </a>
      <header className="mx-auto flex w-full max-w-[calc(1360px+2*var(--kenar))] items-center justify-between gap-4 px-[var(--kenar)] pt-7 pb-3">
        <a href="#ust" className="flex items-center gap-3 no-underline" aria-label="Sükun, başa dön">
          <Enso boyut={30} tohum={9} kalin={6} className="max-[380px]:hidden" />
          <span>
            <span className="block font-baslik text-[32px] leading-none font-light tracking-[0.04em] text-metin">Sükun</span>
            <span className="kicker block !text-[10px] !tracking-[0.3em] max-[420px]:hidden">Seramik · Sessizlik</span>
          </span>
        </a>
        <Popover.Root>
          <Popover.Trigger asChild>
            <WabiButton ton="metin" boy="k" aria-label="Görünüm ayarları" ikon={<Ikon ad="menu" boyut={18} />}>
              <span className="max-[420px]:sr-only">Görünüm</span>
            </WabiButton>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="end" sideOffset={10} collisionPadding={12} className="relative z-[95] max-h-[80vh] w-[min(440px,calc(100vw-24px))] overflow-y-auto border border-cizgi bg-zemin p-8 [border-radius:var(--r-el)]" data-ayarlar="">
              <div className="mb-6 flex items-center justify-between gap-3">
                <p className="font-baslik text-[30px] leading-none font-light">Görünüm</p>
                <Popover.Close asChild>
                  <WabiButton ton="metin" boy="k" aria-label="Kapat" ikon={<Ikon ad="kapat" boyut={16} />}>
                    Kapat
                  </WabiButton>
                </Popover.Close>
              </div>
              <Ayarlar />
              <p className="mt-7 flex gap-7 text-[16px]">
                <a href="../../">Tüm stiller</a>
                <a href="../032/">Stil 032</a>
              </p>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </header>
      <nav aria-label="Bölümler" className="sticky top-0 z-[80] border-b border-cizgi/50" style={{ backgroundColor: 'color-mix(in srgb, var(--zemin) 94%, transparent)' }}>
        <ul className="m-0 mx-auto flex max-w-[calc(1360px+2*var(--kenar))] list-none gap-1 overflow-x-auto p-0 px-[calc(var(--kenar)-14px)] [scrollbar-width:none]">
          {NAV.map(([id, ad]) => (
            <li key={id} className="shrink-0">
              <a href={`#${id}`} aria-current={aktif === id ? 'true' : undefined} className={cx('relative flex min-h-12 items-center px-3.5 text-[11.5px] font-normal tracking-[0.24em] whitespace-nowrap uppercase no-underline', aktif === id ? 'text-metin' : 'text-soluk hover:text-metin')}>
                <span lang={id === 'figma' || id === 'css' ? 'en' : undefined}>{ad}</span>
                {aktif === id ? <span className="absolute inset-x-3.5 bottom-2 h-px bg-metin" aria-hidden="true" /> : null}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
