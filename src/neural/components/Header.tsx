import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { useNeural, type Contrast, type Fx, type MotionPref } from '../lib/store'
import { IconBrain, IconSettings, IconX } from './Icons'
import { Seg } from './ui'
import { cx } from '../../shared/cx'

export const NAV = [
  ['ag', 'Ağ'],
  ['ajan', 'Ajan'],
  ['egitim', 'Eğitim'],
  ['veri', 'Veri seti'],
  ['yapi', 'Figma ve kod'],
  ['hareket', 'Hareket'],
  ['erisim', 'Erişim'],
] as const

export function SettingsPanel({ inline, prefix = '' }: { inline?: boolean; prefix?: string }) {
  const s = useNeural()
  return (
    <div className={cx('space-y-4', inline && 'grid gap-5 space-y-0 md:grid-cols-3')}>
      <Seg<Fx> legend="Görsel efektler" name={`${prefix}fx`} value={s.fx} onChange={s.setFx} options={[{ id: 'tam', ad: 'Tam' }, { id: 'sade', ad: 'Sade' }]} />
      <Seg<Contrast> legend="Kontrast" name={`${prefix}kontrast`} value={s.contrast} onChange={s.setContrast} options={[{ id: 'normal', ad: 'Normal' }, { id: 'yuksek', ad: 'Yüksek' }]} />
      <Seg<MotionPref> legend={`Hareket · şu an ${s.motion ? 'açık' : 'kapalı'}`} name={`${prefix}hareket`} value={s.motionPref} onChange={s.setMotionPref} options={[{ id: 'oto', ad: 'Otomatik' }, { id: 'acik', ad: 'Açık' }, { id: 'kapali', ad: 'Kapalı' }]} />
    </div>
  )
}

function Settings() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" className="icon-btn" aria-label="Görünüm ayarları">
          <IconSettings size={18} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={10} collisionPadding={12} className="fade-in z-50 w-[min(340px,calc(100vw-24px))] rounded-2xl border border-line-strong bg-panel p-4 text-ink shadow-[0_24px_60px_rgb(0_0_0/0.6)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium">Görünüm</p>
            <Popover.Close className="icon-btn size-8 border-0" aria-label="Kapat">
              <IconX size={16} />
            </Popover.Close>
          </div>
          <SettingsPanel />
          <p className="mt-4 text-[13px] text-muted">Bu stil yalnız koyu modda tasarlandı; açık tema yok. Sade efekt tozu, parıltıyı ve bulanıklığı kaldırır.</p>
          <p className="mt-3 border-t border-line pt-3 text-[14px]">
            <a href="../../" className="text-blue underline underline-offset-2">
              Tüm stiller
            </a>{' '}
            ·{' '}
            <a href="../014/" className="text-blue underline underline-offset-2">
              Stil 014
            </a>
          </p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export function Header() {
  const [active, setActive] = useState<string>('ag')
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
    <header className="sticky top-0 z-40 border-b border-line bg-[rgb(10_10_10/0.78)] backdrop-blur-md">
      <a href="#icerik" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-panel focus:px-3 focus:py-2">
        İçeriğe geç
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:px-8">
        <a href="#ust" className="flex shrink-0 items-center gap-2 font-medium text-ink no-underline">
          <span className="glow grid size-8 place-items-center rounded-full border border-[rgb(167_139_250/0.55)] bg-bg text-violet">
            <IconBrain size={18} />
          </span>
          <span className="font-mono text-[13px] mono-tight">
            nöral<span className="text-faint">·015</span>
          </span>
        </a>
        <nav aria-label="Bölümler" className="no-scrollbar min-w-0 flex-1 overflow-x-auto">
          <ul className="flex gap-1 px-1">
            {NAV.map(([id, ad]) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={active === id ? 'true' : undefined} className={cx('block rounded-lg px-2.5 py-1.5 text-[14px] whitespace-nowrap no-underline', active === id ? 'bg-hover text-ink shadow-[inset_0_0_0_1px_rgb(167_139_250/0.4)]' : 'text-muted hover:text-ink')}>
                  {ad}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Settings />
      </div>
    </header>
  )
}
