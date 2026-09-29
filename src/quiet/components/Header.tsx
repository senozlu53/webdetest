import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useQuiet, type Bosluk, type Doku, type HareketTercih, type Kontrast, type TemaTercih } from '../lib/store'
import { QuietButton } from './Quiet'
import { Secim } from './ui'

export const NAV = [
  ['palet', 'Renk'],
  ['yazi', 'Yazı'],
  ['sekil', 'Şekil'],
  ['derinlik', 'Derinlik'],
  ['doku', 'Doku'],
  ['ikonlar', 'İkon'],
  ['galeri', 'Galeri'],
  ['mimari', 'Mimarlık'],
  ['koleksiyon', 'Koleksiyon'],
  ['otel', 'Otel'],
  ['magaza', 'Mağaza'],
  ['dergi', 'Dergi'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['css', 'CSS'],
  ['hareket', 'Hareket'],
  ['mobil', 'Mobil'],
  ['erisim', 'Erişim'],
] as const

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useQuiet()
  const temaAd = { tas: 'taş', fildisi: 'fildişi', komur: 'kömür' }[s.tema]
  return (
    <div className="grid grid-cols-1 gap-7">
      <Secim<TemaTercih>
        legend={`Tema · şu an ${temaAd}`}
        name={`${onek}tema`}
        value={s.temaTercih}
        onChange={s.setTemaTercih}
        options={[
          { id: 'oto', ad: 'Oto' },
          { id: 'tas', ad: 'Taş' },
          { id: 'fildisi', ad: 'Fildişi' },
          { id: 'komur', ad: 'Kömür' },
        ]}
      />
      <Secim<Doku>
        legend="Doku"
        name={`${onek}doku`}
        value={s.doku}
        onChange={s.setDoku}
        options={[
          { id: 'keten', ad: 'Keten' },
          { id: 'kagit', ad: 'Mat kâğıt' },
          { id: 'tas', ad: 'Taş' },
          { id: 'duz', ad: 'Düz' },
        ]}
      />
      <Secim<Bosluk>
        legend="Boşluk"
        name={`${onek}bosluk`}
        value={s.bosluk}
        onChange={s.setBosluk}
        options={[
          { id: 'genis', ad: 'Cömert' },
          { id: 'siki', ad: 'Sıkı' },
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
      <a href="#icerik" className="qbtn sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:bg-zemin" data-boy="k">
        İçeriğe geç
      </a>
      <header className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-6 px-5 pt-7 pb-5 sm:px-8 lg:px-12">
        <a href="#ust" className="no-underline" aria-label="Ardıç, başa dön">
          <span className="block font-sans text-[15px] font-medium tracking-[0.42em] text-metin uppercase">Ardıç</span>
          <span className="kicker block !text-[10px] !tracking-[0.32em]">Atölye · Koleksiyon · Han</span>
        </a>
        <Popover.Root>
          <Popover.Trigger asChild>
            <QuietButton varyant="metin" boy="k" aria-label="Görünüm ayarları">
              Görünüm
            </QuietButton>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="end" sideOffset={12} collisionPadding={12} className="relative z-[95] max-h-[80vh] w-[min(440px,calc(100vw-24px))] overflow-y-auto border border-[var(--cizgi)] bg-yuzey p-7" data-ayarlar="" style={{ borderRadius: 'var(--r)' }}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="font-serif text-[30px] leading-none">Görünüm</p>
                <Popover.Close asChild>
                  <QuietButton varyant="metin" boy="k" aria-label="Kapat">
                    Kapat
                  </QuietButton>
                </Popover.Close>
              </div>
              <Ayarlar />
              <p className="mt-7 flex gap-7 text-[15px]">
                <a href="../../">Tüm stiller</a>
                <a href="../028/">Stil 028</a>
              </p>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </header>
      <nav aria-label="Bölümler" className="sticky top-0 z-[80] border-y border-[var(--cizgi)]" style={{ backgroundColor: 'var(--zemin)' }}>
        <ul className="m-0 mx-auto flex max-w-[1320px] list-none gap-1 overflow-x-auto p-0 px-3 [scrollbar-width:none] sm:px-6 lg:px-10">
          {NAV.map(([id, ad]) => (
            <li key={id} className="shrink-0">
              <a href={`#${id}`} aria-current={aktif === id ? 'true' : undefined} className={cx('relative flex min-h-12 items-center px-3 font-sans text-[10.5px] font-medium tracking-[0.22em] whitespace-nowrap uppercase no-underline', aktif === id ? 'text-metin' : 'text-soluk hover:text-metin')}>
                <span lang={id === 'figma' || id === 'css' ? 'en' : undefined}>{ad}</span>
                {aktif === id ? <span className="absolute inset-x-3 bottom-2 h-px bg-metin" aria-hidden="true" /> : null}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
