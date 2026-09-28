import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useSynth, type HareketTercih, type Parlama } from '../lib/store'
import { Ikon } from './Icons'
import { NeonSwitch, Secim } from './ui'

export const NAV = [
  ['palet', 'Renk'],
  ['yazi', 'Yazı'],
  ['studyo', 'Stüdyo'],
  ['salon', 'Oyun'],
  ['galeri', 'Galeri'],
  ['portfolyo', 'Portfolyo'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['hareket', 'Hareket'],
  ['erisim', 'Erişim'],
] as const

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useSynth()
  return (
    <div className="grid grid-cols-1 gap-5">
      <Secim<HareketTercih> legend={`Hareket · şu an ${s.hareket ? 'açık' : 'kapalı'}`} name={`${onek}hareket`} value={s.hareketTercih} onChange={s.setHareketTercih} options={[{ id: 'oto', ad: 'Oto' }, { id: 'acik', ad: 'Açık' }, { id: 'kapali', ad: 'Kapalı' }]} />
      <Secim<Parlama> legend="Neon parlama" name={`${onek}parlama`} value={s.parlama} onChange={s.setParlama} options={[{ id: 'tam', ad: 'Tam' }, { id: 'az', ad: 'Az' }]} />
      <NeonSwitch label="VHS efektleri" hint="Tarama, tracking bandı ve renk sapması." checked={s.vhs} onChange={s.setVhs} />
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
    <header className="sticky top-0 z-[80] border-b-2 border-pink bg-night shadow-[0_0_var(--g3)_rgb(255_0_255/0.5)]">
      <a href="#icerik" className="nbtn sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50" data-boy="k">
        İçeriğe geç
      </a>
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 md:flex-nowrap md:px-8">
        <a href="#ust" className="flex shrink-0 items-center gap-2 no-underline" aria-label="Neon 84, başa dön">
          <Ikon ad="gunes" renk="turuncu" parla boyut={26} />
          <span className="script text-[30px]">Neon 84</span>
        </a>
        <nav aria-label="Bölümler" className="order-last -mx-1 w-full min-w-0 overflow-x-auto pb-1 [scrollbar-width:none] md:order-none md:mx-0 md:w-auto md:flex-1 md:pb-0">
          <ul className="m-0 flex list-none gap-1 p-0 md:justify-center-safe">
            {NAV.map(([id, ad]) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={aktif === id ? 'true' : undefined} className={cx('block rounded-[4px] border-2 px-2.5 py-1 text-[13px] font-bold tracking-wider whitespace-nowrap uppercase no-underline', aktif === id ? 'border-cyan text-cyan shadow-[var(--glow-cyan)]' : 'border-transparent text-text hover:border-line')}>
                  {ad}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button type="button" className="nbtn ml-auto !min-h-10 !px-3" data-renk="cyan" aria-label="Görünüm ayarları">
              <Ikon ad="ayar" boyut={20} />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="end" sideOffset={10} collisionPadding={12} className="rcard z-[95] w-[min(380px,calc(100vw-24px))] p-5 text-text">
              <div className="mb-4 flex items-center justify-between">
                <p className="chrome text-[30px]">Ayarlar</p>
                <Popover.Close className="nbtn !min-h-10 !px-3" data-boy="k" aria-label="Kapat">
                  <Ikon ad="kapat" boyut={18} />
                </Popover.Close>
              </div>
              <Ayarlar />
              <p className="mt-5 flex gap-4">
                <a href="../../">Tüm stiller</a>
                <a href="../022/">Stil 022</a>
              </p>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </header>
  )
}
