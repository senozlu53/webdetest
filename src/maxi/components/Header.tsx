import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { useMaxi, type MotionPref } from '../lib/store'
import { IconMoon, IconPause, IconPlay, IconSettings, IconSun, IconTicket, IconX } from './Icons'
import { Chips } from './ui'
import { cx } from '../../shared/cx'

export const NAV = [
  ['program', 'Program'],
  ['galeri', 'Galeri'],
  ['moda', 'Moda'],
  ['editoryal', 'Editoryal'],
  ['palet', 'Palet'],
  ['yapi', 'Figma ve kod'],
  ['hareket', 'Hareket'],
  ['mobil', 'Mobil'],
  ['erisim', 'Erişim'],
] as const

type K3 = 'sakin' | 'normal' | 'tam'

export function KaosSwitch({ name = 'kaos', dark }: { name?: string; dark?: boolean }) {
  const { kaos, setKaos } = useMaxi()
  const opts: { id: K3; ad: string }[] = [
    { id: 'sakin', ad: 'Sakin' },
    { id: 'normal', ad: 'Normal' },
    { id: 'tam', ad: 'Tam kaos' },
  ]
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Kaos düzeyi{kaos === 'ozel' ? ', şu an özel' : ''}</legend>
      <div className={cx('flex rounded-full border-2 p-0.5', dark ? 'border-[#fff7ee]' : 'border-line')}>
        {opts.map((o) => {
          const on = kaos === o.id
          return (
            <label key={o.id} className={cx('cursor-pointer rounded-full px-2.5 py-1 text-[13px] font-black whitespace-nowrap uppercase [font-stretch:110%] has-[:focus-visible]:outline-4 has-[:focus-visible]:outline-[#c8ff00]', on ? 'bg-lime text-[#111014]' : dark ? 'text-[#fff7ee] hover:bg-[#fff7ee]/15' : 'text-ink')}>
              <input type="radio" className="sr-only" name={name} value={o.id} checked={on} onChange={() => setKaos(o.id)} />
              {o.ad}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function SettingsPanel({ prefix = '' }: { prefix?: string }) {
  const s = useMaxi()
  return (
    <div className="space-y-5">
      <Chips legend="Tema" name={`${prefix}tema`} value={s.mode} onChange={s.setMode} options={[{ id: 'light', ad: 'Gündüz' }, { id: 'dark', ad: 'Gece' }, { id: 'system', ad: 'Sistem' }]} />
      <div>
        <p className="kicker mb-2">Kaos{s.kaos === 'ozel' ? ' · şu an özel' : ''}</p>
        <KaosSwitch name={`${prefix}kaos`} />
      </div>
      <Chips<MotionPref> legend={`Hareket · şu an ${s.motion ? 'açık' : 'kapalı'}`} name={`${prefix}hareket`} value={s.motionPref} onChange={s.setMotionPref} options={[{ id: 'oto', ad: 'Otomatik' }, { id: 'acik', ad: 'Açık' }, { id: 'kapali', ad: 'Kapalı' }]} on="bg-pink text-[#111014]" />
    </div>
  )
}

export function Header() {
  const s = useMaxi()
  const [active, setActive] = useState('')
  const tickets = Object.values(s.tickets).reduce((a, b) => a + b, 0)
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
  const btn = 'grid size-10 shrink-0 place-items-center rounded-full border-2 border-[#fff7ee] text-[#fff7ee] hover:bg-[#fff7ee] hover:text-[#111014] min-[400px]:size-11'
  return (
    <header className="sticky top-0 z-[70] border-b-4 border-pink bg-[#0b0a0f] text-[#fff7ee]">
      <a href="#icerik" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:font-black focus:text-[#111014]">
        İçeriğe geç
      </a>
      <div className="mx-auto grid max-w-[1320px] grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-1 px-4 pt-3 pb-2 md:flex md:h-[72px] md:gap-3 md:px-8 md:py-0">
        <a href="#ust" className="holo sticker shrink-0 -rotate-3 rounded-full px-2 py-1 font-sans text-[13px] leading-none font-black uppercase no-underline [font-stretch:140%] min-[360px]:px-3 min-[360px]:text-[15px] md:text-[17px]">
          Maksi<span aria-hidden="true">·</span>017
        </a>
        <nav aria-label="Bölümler" className="no-scrollbar col-span-3 row-start-2 -mx-4 min-w-0 overflow-x-auto px-3 py-1.5 md:mx-0 md:flex-1 md:px-0">
          <ul className="flex gap-1">
            {NAV.map(([id, ad]) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={active === id ? 'true' : undefined} className={cx('block rounded-full px-2.5 py-2 text-[14px] font-bold whitespace-nowrap no-underline md:py-1', active === id ? 'bg-lime text-[#111014]' : 'text-[#fff7ee] hover:bg-[#fff7ee]/15')}>
                  {ad}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="md:hidden" />
        <div className="flex items-center gap-1.5 justify-self-end">
          <div className="hidden 2xl:block">
            <KaosSwitch name="kaos-ust" dark />
          </div>
          <button type="button" className={btn} onClick={() => s.setMotionPref(s.motion ? 'kapali' : 'acik')} aria-label={s.motion ? 'Hareketi durdur' : 'Hareketi başlat'} aria-pressed={!s.motion}>
            {s.motion ? <IconPause size={18} /> : <IconPlay size={16} />}
          </button>
          <a href="#bilet" className={cx(btn, 'relative')} aria-label={`Bilet: ${tickets}`}>
            <IconTicket size={19} />
            {tickets ? <span className="absolute -top-2 -right-2 grid h-6 min-w-6 place-items-center rounded-full bg-lime px-1 text-[12px] font-black text-[#111014]">{tickets}</span> : null}
          </a>
          <button type="button" className={cx(btn, 'max-[379px]:hidden')} onClick={() => s.setMode(s.theme === 'dark' ? 'light' : 'dark')} aria-label={s.theme === 'dark' ? 'Gündüz temasına geç' : 'Gece temasına geç'}>
            {s.theme === 'dark' ? <IconSun size={19} /> : <IconMoon size={19} />}
          </button>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button type="button" className={btn} aria-label="Görünüm ayarları">
                <IconSettings size={19} />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content align="end" sideOffset={12} collisionPadding={12} className="pop-in z-[95] max-h-[var(--radix-popover-content-available-height)] w-[min(380px,calc(100vw-24px))] overflow-y-auto rounded-[28px] border-4 border-[#111014] bg-butter p-5 text-[#111014] shadow-[8px_10px_0_#111014]">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-serif text-[30px] leading-none font-black italic">
                    <span className="wonk">Ayarlar</span>
                  </p>
                  <Popover.Close className="grid size-9 place-items-center rounded-full border-2 border-[#111014] bg-white" aria-label="Kapat">
                    <IconX size={16} />
                  </Popover.Close>
                </div>
                <div className="[--line:#111014] [--paper:#ffffff] [--ink:#111014]">
                  <SettingsPanel />
                </div>
                <p className="mt-5 border-t-2 border-[#111014] pt-4 font-bold">
                  <a href="#degiskenler" className="underline decoration-2 underline-offset-4">
                    Serbest değişkenler
                  </a>{' '}
                  ·{' '}
                  <a href="../../" className="underline decoration-2 underline-offset-4">
                    Tüm stiller
                  </a>{' '}
                  ·{' '}
                  <a href="../016/" className="underline decoration-2 underline-offset-4">
                    Stil 016
                  </a>
                </p>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    </header>
  )
}
