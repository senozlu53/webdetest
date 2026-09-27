import type { ReactNode } from 'react'
import { Popover } from 'radix-ui'
import { useChat, type Brand, type Bubble, type Mode, type MotionPref, type Speed } from '../lib/store'
import { speechCtor } from './AIVoiceInput'
import { IconSettings } from './Icons'
import { cx } from '../../shared/cx'

export const MODES: ReadonlyArray<{ id: Mode; ad: string }> = [
  { id: 'tam', ad: 'Tam ekran' },
  { id: 'kenar', ad: 'Kenar çubuğu' },
  { id: 'destek', ad: 'Destek balonu' },
]
export const BRANDS: ReadonlyArray<{ id: Brand; ad: string; hex: string; k: string }> = [
  { id: 'mavi', ad: 'Mavi', hex: '#2563EB', k: '5,17' },
  { id: 'mor', ad: 'Mor', hex: '#7C3AED', k: '5,70' },
  { id: 'yesil', ad: 'Yeşil', hex: '#047857', k: '5,48' },
  { id: 'mercan', ad: 'Mercan', hex: '#C2410C', k: '5,18' },
]
export const BUBBLES: ReadonlyArray<{ id: Bubble; ad: string }> = [
  { id: 'sivri', ad: 'Sivri köşe' },
  { id: 'kuyruk', ad: 'Kuyruk' },
  { id: 'yuvarlak', ad: 'Yuvarlak' },
]

export function Seg<T extends string>({ legend, name, value, options, onChange, small }: { legend: string; name: string; value: T; options: ReadonlyArray<{ id: T; ad: string; swatch?: string }>; onChange: (v: T) => void; small?: boolean }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-1 text-[12px] font-medium text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-1 rounded-xl bg-sunken p-1">
        {options.map((o) => (
          <label key={o.id} className="flex-1 cursor-pointer rounded-lg has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand">
            <input type="radio" className="sr-only" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
            <span className={cx('flex items-center justify-center gap-1.5 rounded-lg px-2.5 whitespace-nowrap', small ? 'min-h-8 text-[13px]' : 'min-h-9 text-[14px]', value === o.id ? 'bg-surface font-medium text-ink shadow-[0_1px_2px_rgb(0_0_0/0.08)]' : 'text-muted hover:text-ink')}>
              {o.swatch ? <span className="size-3 rounded-full" style={{ background: o.swatch }} aria-hidden="true" /> : null}
              {o.ad}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function SettingsPanel({ footer }: { footer?: ReactNode }) {
  const s = useChat()
  const sr = !!speechCtor()
  return (
    <div className="flex flex-col gap-3">
      <Seg<Mode> legend="Görünüm" name="ayar-gorunum" value={s.mode} options={MODES} onChange={s.setMode} small />
      <Seg legend="Tema" name="ayar-tema" value={s.theme} options={[{ id: 'light', ad: 'Açık' }, { id: 'dark', ad: 'Koyu' }] as const} onChange={s.setTheme} small />
      <Seg<Brand> legend="Marka rengi (kullanıcı balonu)" name="ayar-marka" value={s.brand} options={BRANDS.map((b) => ({ id: b.id, ad: b.ad, swatch: b.hex }))} onChange={s.setBrand} small />
      <Seg<Bubble> legend="Balon biçimi" name="ayar-balon" value={s.bubble} options={BUBBLES} onChange={s.setBubble} small />
      <Seg<MotionPref> legend={`Hareket · şu an ${s.motion === 'acik' ? 'açık' : 'kapalı'}`} name="ayar-hareket" value={s.motionPref} options={[{ id: 'oto', ad: 'Otomatik' }, { id: 'acik', ad: 'Açık' }, { id: 'kapali', ad: 'Kapalı' }]} onChange={s.setMotionPref} small />
      <Seg<Speed> legend="Yanıt akış hızı" name="ayar-hiz" value={s.speed} options={[{ id: 'yavas', ad: 'Yavaş' }, { id: 'normal', ad: 'Normal' }, { id: 'hizli', ad: 'Hızlı' }]} onChange={s.setSpeed} small />
      <label className={cx('flex items-start gap-2.5 text-[14px]', !sr && 'opacity-60')}>
        <input type="checkbox" className="mt-1 size-4 accent-[var(--brand)]" checked={s.realVoice && sr} disabled={!sr} onChange={(e) => s.setRealVoice(e.target.checked)} />
        <span>
          Gerçek konuşma tanıma
          <span className="block text-[12px] text-muted">{sr ? 'Tarayıcının Web Speech API’si; Chrome’da ses Google’a gönderilir. Kapalıyken mikrofon açılmaz, tanıtım kaydı kullanılır.' : 'Bu tarayıcı desteklemiyor; tanıtım kaydı kullanılır.'}</span>
        </span>
      </label>
      {footer}
    </div>
  )
}

/** Komut kutusundaki ayarlar düğmesi (Madde 9): açılır panel */
export function SettingsButton() {
  const s = useChat()
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" className="grid size-10 place-items-center rounded-full text-muted hover:bg-sunken hover:text-ink data-[state=open]:bg-sunken data-[state=open]:text-ink" aria-label="Ayarlar">
          <IconSettings size={20} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="top" align="start" sideOffset={10} collisionPadding={12} className="slide-up z-[70] max-h-[min(560px,var(--radix-popover-content-available-height))] w-[min(360px,calc(100vw-24px))] overflow-y-auto rounded-2xl border border-line bg-surface p-4 text-ink shadow-[0_12px_40px_rgb(0_0_0/0.14)]">
          <p className="mb-3 text-[15px] font-semibold">Ayarlar</p>
          <SettingsPanel
            footer={
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-[14px]">
                <Popover.Close asChild>
                  <button type="button" onClick={s.reset} className="rounded-lg border border-line px-3 py-1.5 hover:bg-sunken">
                    Yeni sohbet
                  </button>
                </Popover.Close>
                <span className="flex gap-3">
                  <a href="../../" className="text-brand-ink underline underline-offset-2">
                    Tüm stiller
                  </a>
                  <a href="../013/" className="text-brand-ink underline underline-offset-2">
                    Stil 013
                  </a>
                </span>
              </div>
            }
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
