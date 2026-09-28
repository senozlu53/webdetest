import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { useBrut, type Kose, type MotionPref, type Zemin } from '../lib/store'
import { IconCart, IconMoon, IconSettings, IconSun, IconX } from './Icons'
import { Chips, Switch } from './ui'
import { cx } from '../../shared/cx'

export const NAV = [
  ['bilesenler', 'Bileşenler'],
  ['kullanim', 'Kullanım'],
  ['palet', 'Palet'],
  ['yapi', 'Figma ve kod'],
  ['hareket', 'Hareket'],
  ['mobil', 'Mobil'],
  ['erisim', 'Erişim'],
] as const

export function SettingsPanel({ prefix = '' }: { prefix?: string }) {
  const s = useBrut()
  return (
    <div className="space-y-5">
      <Chips legend="Tema" name={`${prefix}tema`} value={s.mode} onChange={s.setMode} options={[{ id: 'light', ad: 'Açık' }, { id: 'dark', ad: 'Koyu' }, { id: 'system', ad: 'Sistem' }]} />
      <Chips<Zemin> legend={`Zemin${s.theme === 'dark' ? ' (yalnız açık tema)' : ''}`} name={`${prefix}zemin`} value={s.zemin} onChange={s.setZemin} options={[{ id: 'kirli', ad: 'Kirli beyaz' }, { id: 'sari', ad: 'Sarı' }]} fill="pink" />
      <Chips<Kose> legend="Köşe" name={`${prefix}kose`} value={s.kose} onChange={s.setKose} options={[{ id: 'keskin', ad: 'Keskin' }, { id: 'yuvarlak', ad: 'Yuvarlak' }]} fill="blue" />
      <Chips<MotionPref> legend={`Hareket · şu an ${s.motion ? 'açık' : 'kapalı'}`} name={`${prefix}hareket`} value={s.motionPref} onChange={s.setMotionPref} options={[{ id: 'oto', ad: 'Otomatik' }, { id: 'acik', ad: 'Açık' }, { id: 'kapali', ad: 'Kapalı' }]} fill="green" />
      <Switch label="Kayan şeritleri durdur" hint="Bütün marquee şeritleri yerinde kalır." checked={s.marqueePaused} onChange={s.setMarqueePaused} />
    </div>
  )
}

function Settings() {
  const { theme, setMode } = useBrut()
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => setMode(theme === 'dark' ? 'light' : 'dark')} className="grid size-11 place-items-center rounded-brut border-[3px] border-line bg-surface brut-shadow-sm snap press" aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}>
        {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
      </button>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button type="button" className="grid size-11 place-items-center rounded-brut border-[3px] border-line bg-surface brut-shadow-sm snap press" aria-label="Görünüm ayarları">
            <IconSettings size={20} />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content align="end" sideOffset={12} collisionPadding={12} className="z-50 max-h-[var(--radix-popover-content-available-height)] w-[min(360px,calc(100vw-24px))] overflow-y-auto rounded-brut border-[3px] border-line bg-surface p-5 text-ink brut-shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <p className="headline">Ayarlar</p>
              <Popover.Close className="grid size-9 place-items-center rounded-brut border-[3px] border-line bg-surface snap press" aria-label="Kapat">
                <IconX size={16} />
              </Popover.Close>
            </div>
            <SettingsPanel />
            <p className="mt-5 border-t-[3px] border-line pt-4 font-bold">
              <a href="../../" className="underline decoration-[3px] underline-offset-4">
                Tüm stiller
              </a>{' '}
              ·{' '}
              <a href="../015/" className="underline decoration-[3px] underline-offset-4">
                Stil 015
              </a>
            </p>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}

export function Header() {
  const { cartCount, cartBump } = useBrut()
  const [active, setActive] = useState<string>('')
  useEffect(() => {
    const els = NAV.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (es) => {
        const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (vis) setActive(vis.target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-line bg-bg">
      <a href="#icerik" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-brut focus:border-[3px] focus:border-line focus:fill-yellow focus:px-3 focus:py-2 focus:font-bold">
        İçeriğe geç
      </a>
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-1 px-4 pt-3 pb-2 sm:gap-x-3 md:flex md:h-[76px] md:py-0 md:px-8">
        <a href="#ust" className="shrink-0 rotate-[-2deg] rounded-brut border-[3px] border-line fill-yellow px-2 py-1 font-display text-[15px] sm:px-2.5 sm:text-[18px] leading-none font-black text-black uppercase [font-stretch:125%] no-underline brut-shadow-sm">
          Brüt<span aria-hidden="true">·</span>016
        </a>
        <nav aria-label="Bölümler" className="no-scrollbar col-span-3 row-start-2 -mx-4 min-w-0 overflow-x-auto px-3 py-2 md:mx-0 md:flex-1 md:px-0">
          <ul className="flex gap-1.5 px-1">
            {NAV.map(([id, ad]) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={active === id ? 'true' : undefined} className={cx('block rounded-brut border-[3px] px-2.5 py-1 text-[15px] font-bold whitespace-nowrap no-underline', active === id ? 'border-line fill-ink' : 'border-transparent hover:border-line')}>
                  {ad}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="md:hidden" />
        <div className="flex items-center gap-2 justify-self-end">
        <a href="#kullanim" className="relative grid size-11 shrink-0 place-items-center rounded-brut border-[3px] border-line fill-pink brut-shadow-sm snap press" aria-label={`Sepet: ${cartCount} ürün`}>
          <IconCart size={20} />
          {cartCount ? (
            <span key={cartBump} className="bump absolute -top-3 -right-3 grid h-6 min-w-6 place-items-center rounded-brut border-[3px] border-line fill-yellow px-1 font-display text-[12px] font-black">
              {cartCount}
            </span>
          ) : null}
        </a>
        <Settings />
        </div>
      </div>
    </header>
  )
}
