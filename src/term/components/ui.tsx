import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { bar, pad } from '../lib/ascii'
import { hareketKapali } from '../lib/store'

/** Köşeli parantez: görünür ama ekran okuyucu okumaz */
const B = ({ children }: { children: string }) => <span aria-hidden="true">{children}</span>

/** <Kbd>: tuş kombinasyonu etiketi. keys={['Ctrl', 'K']} → [Ctrl]+[K] */
export function Kbd({ keys, className }: { keys: string[]; className?: string }) {
  return (
    <span className={cx('whitespace-nowrap', className)}>
      {keys.map((k, i) => (
        <span key={k}>
          {i ? <B>+</B> : null}
          <kbd className="font-mono font-bold text-em">
            <B>[</B>
            {k}
            <B>]</B>
          </kbd>
        </span>
      ))}
    </span>
  )
}

/** ASCII düğme: [ etiket ]. Üzerine gelince ve odakta ters video. `inv` her zaman ters (birincil eylem). */
export function Btn({ inv, prefix, className, children, type = 'button', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { inv?: boolean; prefix?: string }) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex min-h-[1lh] cursor-pointer items-center font-bold whitespace-pre disabled:cursor-not-allowed disabled:opacity-50 [&:not(:disabled):hover]:bg-sel-bg [&:not(:disabled):hover]:text-sel-fg focus-visible:bg-sel-bg focus-visible:text-sel-fg',
        inv ? 'bg-sel-bg text-sel-fg' : 'text-fg',
        className,
      )}
      {...rest}
    >
      <B>[ </B>
      {prefix ? <B>{`${prefix} `}</B> : null}
      {children}
      <B> ]</B>
    </button>
  )
}

/** ASCII onay kutusu: [x] / [ ]. Yerel input görünmez ama odaklanır ve okunur. */
export function Check({ checked, onChange, children, disabled, className }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; disabled?: boolean; className?: string }) {
  return (
    <label className={cx('inline-flex cursor-pointer items-start whitespace-pre has-[:focus-visible]:bg-sel-bg has-[:focus-visible]:text-sel-fg has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50', className)}>
      <input type="checkbox" className="sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span aria-hidden="true" className="font-bold">
        {checked ? '[x] ' : '[ ] '}
      </span>
      <span className="whitespace-normal">{children}</span>
    </label>
  )
}

/** ASCII radyo grubu: (*) seçili, ( ) seçili değil */
export function Radios<T extends string>({ legend, name, value, options, onChange, row, hideLegend }: { legend: string; name: string; value: T; options: ReadonlyArray<{ id: T; ad: string }>; onChange: (v: T) => void; row?: boolean; hideLegend?: boolean }) {
  return (
    <fieldset className="min-w-0">
      <legend className={cx('text-dim', hideLegend && 'sr-only')}>{legend}</legend>
      <div className={cx('flex', row ? 'flex-wrap gap-x-2' : 'flex-col')}>
        {options.map((o) => (
          <label key={o.id} className="inline-flex cursor-pointer whitespace-pre has-[:focus-visible]:bg-sel-bg has-[:focus-visible]:text-sel-fg">
            <input type="radio" className="sr-only" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
            <span aria-hidden="true" className="font-bold">
              {value === o.id ? '(*) ' : '( ) '}
            </span>
            <span className={value === o.id ? 'text-hi' : undefined}>{o.ad}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/**
 * Bölüm: "== 04 · KIYASLAMA =====..." başlık satırı ve açıklama. Başlık yazısı 1em, kalın ve büyük harf;
 * boyut hiyerarşisi yok, hiyerarşiyi çizgi ve ters video kurar.
 */
export function Pane({ id, no, title, lede, children }: { id: string; no: string; title: string; lede?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mx-auto max-w-[120ch] px-2 py-[2lh] sm:px-4">
      <div className="flex items-baseline">
        <span className="ascii text-line" aria-hidden="true">
          {'== '}
        </span>
        <h2 id={`${id}-h`} className="shrink-0 uppercase">
          <span className="inv px-1">{no}</span> <span className="text-hi">{title}</span>
        </h2>
        <span className="rule-fill ascii" aria-hidden="true">
          {' ' + '='.repeat(240)}
        </span>
      </div>
      {lede ? <p className="mt-[1lh] max-w-[80ch] text-dim">{lede}</p> : null}
      <div className="mt-[1lh]">{children}</div>
    </section>
  )
}

/** Çerçeveli kutu: başlık üst çizginin üstünde, "+-- başlık --" gibi okunur */
export function Box({ title, right, className, children, as: As = 'div' }: { title?: ReactNode; right?: ReactNode; className?: string; children: ReactNode; as?: 'div' | 'section' | 'aside' }) {
  return (
    <As className={cx('relative min-w-0 border border-line px-2 pt-[1lh] pb-[0.5lh]', className)}>
      {title ? (
        <span className="absolute -top-[0.5lh] left-1 flex max-w-[calc(100%-2ch)] gap-2 bg-bg px-1 leading-[1lh] whitespace-nowrap">
          <span className="truncate font-bold text-hi">{title}</span>
          {right ? <span className="text-dim">{right}</span> : null}
        </span>
      ) : null}
      {children}
    </As>
  )
}

/** Kesik kesik (adımlı) yükleme çubuğu: [#######.............]  35% */
export function Progress({ value, label, width = 30, className }: { value: number; label: string; width?: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v)} className={cx('ascii', className)}>
      <span aria-hidden="true">
        [<span className="text-hi">{bar(v, 100, width)}</span>] {pad(`${Math.round(v)}%`, 4, 'right')}
      </span>
    </div>
  )
}

/**
 * Daktilo (Madde 16): metin karakter karakter yazılır. Hareket kapalıysa tamamı hemen görünür.
 * Ekran okuyucu yarım metni değil tamamını okur (görünmez kopya).
 */
export function useTypewriter(text: string, cps = 60, start = true) {
  const [n, setN] = useState(0)
  const done = n >= text.length
  const raf = useRef(0)
  useEffect(() => {
    if (!start) {
      setN(0)
      return
    }
    if (hareketKapali()) {
      setN(text.length)
      return
    }
    setN(0)
    const t0 = performance.now()
    const tick = (now: number) => {
      const k = Math.min(text.length, Math.floor(((now - t0) / 1000) * cps))
      setN(k)
      if (k < text.length) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [text, cps, start])
  return { shown: text.slice(0, n), done }
}

export function Typewriter({ text, cps = 60, className, cursor = true, onDone }: { text: string; cps?: number; className?: string; cursor?: boolean; onDone?: () => void }) {
  const { shown, done } = useTypewriter(text, cps)
  const fired = useRef(false)
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true
      onDone?.()
    }
  }, [done, onDone])
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
      {cursor && !done ? <span className="cursor" aria-hidden="true" /> : null}
    </span>
  )
}

/** Madde 17: yatay kaydırma alanı. Klavyeyle odaklanabilir; adı ekran okuyucuya söylenir. */
export function ScrollX({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div role="region" aria-label={label} tabIndex={0} className={cx('scroll-x', className)}>
      {children}
    </div>
  )
}
