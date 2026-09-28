import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { useY2K, type MotionPref } from '../lib/store'
import { cx } from '../../shared/cx'
import { IconCart, IconClose, IconMoon, IconSettings, IconSun } from './Icons'
import { Chips, Switch } from './ui'

export const NAV = [
  ['muzik', 'Müzik'],
  ['magaza', 'Mağaza'],
  ['portfolyo', 'Portfolyo'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['css', 'CSS'],
  ['hareket', 'Hareket'],
  ['mobil', 'Mobil'],
  ['erisim', 'Erişim'],
] as const

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useY2K()
  return (
    <div className="space-y-5">
      <Chips legend="Tema" name={`${onek}tema`} value={s.mode} onChange={s.setMode} options={[{ id: 'light', ad: 'Buz' }, { id: 'dark', ad: 'Gece' }, { id: 'system', ad: 'Sistem' }]} />
      <Chips<MotionPref> legend={`Hareket · şu an ${s.motion ? 'açık' : 'kapalı'}`} name={`${onek}hareket`} value={s.motionPref} onChange={s.setMotionPref} options={[{ id: 'oto', ad: 'Otomatik' }, { id: 'acik', ad: 'Açık' }, { id: 'kapali', ad: 'Kapalı' }]} />
      <Switch label="Sade yüzey" hint="Parlama ve yansıma katmanları kalkar, krom düz gümüşe ve siyah kenara döner." checked={s.sade} onChange={s.setSade} />
    </div>
  )
}

export function Header() {
  const s = useY2K()
  const [aktif, setAktif] = useState('')
  const adet = Object.values(s.sepet).reduce((a, b) => a + b, 0)
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
  const yuvarlak = 'chrome grid size-10 shrink-0 place-items-center rounded-full border border-[#2b3445]/55 md:size-11'
  return (
    <header className="sticky top-0 z-[70] px-3 pt-3 md:px-6">
      <a href="#icerik" className="candy sr-only rounded-full px-4 py-2 font-logo text-[12px] uppercase focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50">
        İçeriğe geç
      </a>
      <div className="chrome mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-2 gap-y-1 rounded-[28px] border border-[#2b3445]/55 py-1.5 pr-1.5 pl-4 md:flex-nowrap md:rounded-full">
        <a href="#ust" className="inline-flex min-h-10 shrink-0 items-center font-logo text-[12.5px] tracking-[0.1em] whitespace-nowrap text-black uppercase no-underline md:text-[13.5px]">
          Milenyum<span className="text-[#c0268a]" aria-hidden="true">·</span>FM
        </a>
        <nav aria-label="Bölümler" className="order-last -mx-1 w-full min-w-0 overflow-x-auto pb-1 [scrollbar-width:none] md:order-none md:mx-0 md:w-auto md:flex-1 md:pb-0">
          <ul className="flex gap-0.5 md:justify-center">
            {NAV.map(([id, ad]) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={aktif === id ? 'true' : undefined} className={cx('block rounded-full px-3 py-2 font-logo text-[10.5px] tracking-[0.06em] whitespace-nowrap text-black uppercase no-underline', aktif === id ? 'icy border border-[#2b3445]/55' : 'hover:bg-white/55')}>
                  {ad}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <a href="#magaza" className={cx(yuvarlak, 'relative text-black')} aria-label={`Sepet: ${adet} ürün`}>
            <IconCart size={19} />
            {adet ? <span className="candy absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full border border-[#2b3445]/55 px-1 font-logo text-[10px]">{adet}</span> : null}
          </a>
          <button type="button" className={yuvarlak} onClick={() => s.setMode(s.theme === 'dark' ? 'light' : 'dark')} aria-label={s.theme === 'dark' ? 'Buz temasına geç' : 'Gece temasına geç'}>
            {s.theme === 'dark' ? <IconSun size={19} /> : <IconMoon size={19} />}
          </button>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button type="button" className={yuvarlak} aria-label="Görünüm ayarları">
                <IconSettings size={19} />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content align="end" sideOffset={10} collisionPadding={12} className="rim pop-in z-[95] w-[min(380px,calc(100vw-24px))] rounded-[28px] p-5 text-ink">
                <div className="mb-4 flex items-center justify-between">
                  <p className="display text-[22px]">Ayarlar</p>
                  <Popover.Close className="chrome grid size-9 place-items-center rounded-full border border-[#2b3445]/55" aria-label="Kapat">
                    <IconClose size={14} />
                  </Popover.Close>
                </div>
                <Ayarlar />
                <p className="mt-5 text-[14px]">
                  <a href="../../" className="font-semibold underline underline-offset-4">
                    Tüm stiller
                  </a>{' '}
                  ·{' '}
                  <a href="../018/" className="font-semibold underline underline-offset-4">
                    Stil 018
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
