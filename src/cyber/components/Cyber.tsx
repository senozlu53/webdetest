import { useEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../shared/cx'

type Tone = 'cyan' | 'magenta' | 'yesil' | 'mor'
const GLOW: Record<Tone, string> = { cyan: 'glow-cyan', magenta: 'glow-magenta', yesil: 'glow-yesil', mor: 'glow-mor' }

/** Glitch'li metin: üzerine gelince, odakta ya da `active` ile bir kez kayan renkli dilimler */
export function Glitch({ text, active, className, as: As = 'span' }: { text: string; active?: boolean; className?: string; as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' }) {
  return (
    <As className={cx('glitch', className)} data-text={text} data-active={active ? '' : undefined}>
      {text}
    </As>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'magenta' | 'ghost'
  /** Figma varyantı: Default · Glitch · Hover. "hover" durumu statik önizleme içindir. */
  state?: 'default' | 'glitch' | 'hover'
  icon?: ReactNode
}

function cyberSkin(variant: 'primary' | 'magenta' | 'ghost') {
  const fill = variant === 'primary' ? 'var(--cyan)' : variant === 'magenta' ? 'var(--magenta)' : 'var(--bg)'
  const frame = variant === 'magenta' ? 'var(--magenta)' : 'var(--cyan)'
  const ink = variant === 'ghost' ? 'var(--cyan)' : variant === 'primary' ? 'var(--on-cyan)' : 'var(--on-magenta)'
  return {
    className:
      'group chamfer chamfer-sm inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 px-5 font-display text-[15px] font-bold tracking-[0.14em] uppercase no-underline transition-[filter] duration-150 disabled:cursor-not-allowed disabled:opacity-45 [--fill:var(--base-fill)] hover:[--fill:var(--hover-fill)] hover:[filter:drop-shadow(0_0_10px_var(--hover-glow))] data-[state=hover]:[--fill:var(--hover-fill)] data-[state=hover]:[filter:drop-shadow(0_0_10px_var(--hover-glow))]',
    style: {
      '--base-fill': fill,
      '--frame': frame,
      '--hover-fill': variant === 'ghost' ? 'color-mix(in srgb, var(--cyan) 16%, var(--bg))' : fill,
      '--hover-glow': variant === 'magenta' ? 'var(--glow-magenta)' : 'var(--glow-cyan)',
      color: ink,
    } as CSSProperties,
  }
}

/**
 * <CyberButton>: kesik köşeli neon düğme. Şekil ::before/::after katmanlarında; düğmenin kendisi
 * kırpılmaz, odak halkası tam görünür. Glitch varyantı üzerine gelince metni böler.
 */
export function CyberButton({ variant = 'primary', state = 'default', icon, className, children, type = 'button', style, ...rest }: BtnProps) {
  const text = typeof children === 'string' ? children : ''
  const skin = cyberSkin(variant)
  return (
    <button type={type} data-state={state} className={cx(skin.className, className)} style={{ ...skin.style, ...style }} {...rest}>
      {icon}
      {state === 'glitch' && text ? <Glitch text={text} /> : children}
    </button>
  )
}

/** Aynı görünümde bağlantı: sayfa içi gezinme düğme değil, bağlantıdır */
export function CyberLink({ href, variant = 'primary', glitch, icon, children, className }: { href: string; variant?: 'primary' | 'magenta' | 'ghost'; glitch?: boolean; icon?: ReactNode; children: string; className?: string }) {
  const skin = cyberSkin(variant)
  return (
    <a href={href} className={cx(skin.className, className)} style={skin.style}>
      {icon}
      {glitch ? <Glitch text={children} /> : children}
    </a>
  )
}

/**
 * <CyberCard>: kesik köşeli kart. Etiket (Figma'daki "dışarıda kalan label") çerçevenin üstünde,
 * Auto Layout'un dışında sekme olarak durur; çerçeve içeriğe göre büyür.
 */
export function CyberCard({ label, code, tone = 'cyan', glow, className, children, as: As = 'div' }: { label?: string; code?: string; tone?: Tone; glow?: boolean; className?: string; children: ReactNode; as?: 'div' | 'section' | 'article' | 'li' | 'figure' }) {
  return (
    <As className={cx('relative min-w-0', label && 'pt-7', className)}>
      {label ? (
        <span className="absolute top-0 right-[18px] left-[18px] flex items-center gap-2 overflow-hidden font-display text-[13px] font-bold tracking-[0.18em] whitespace-nowrap uppercase" style={{ color: `var(--${tone === 'mor' ? 'mor-text' : tone})` }}>
          <span className="inline-block h-2 w-2 shrink-0" style={{ background: `var(--${tone})` }} aria-hidden="true" />
          {label}
          {code ? (
            <span className="min-w-0 truncate font-hud text-[11px] tracking-normal text-muted" lang="en">
              {code}
            </span>
          ) : null}
        </span>
      ) : null}
      <div className={cx('chamfer chamfer-lg wear h-full p-5 md:p-6', glow && GLOW[tone])} style={{ '--frame': `var(--${tone})` } as CSSProperties}>
        <span className="wear-layer" aria-hidden="true" />
        <div className="relative">{children}</div>
      </div>
    </As>
  )
}

/**
 * Glitch efektli form alanı (Madde 11). Etiket çerçevenin dışında. Hata olunca çerçeve macentaya döner,
 * alan kısa bir sarsıntı yapar; hata metni alana bağlıdır.
 */
export function CyberInput({ label, error, hint, id, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string | null; hint?: string; id: string }) {
  // Yeni bir hata gelince çerçeve kısa bir sarsıntı yapar; alan yeniden kurulmaz, odak kaybolmaz
  const [shaking, setShaking] = useState(false)
  const last = useRef<string | null | undefined>(null)
  useEffect(() => {
    if (error && error !== last.current) {
      setShaking(true)
      const t = window.setTimeout(() => setShaking(false), 340)
      last.current = error
      return () => window.clearTimeout(t)
    }
    last.current = error
  }, [error])
  const describedBy = [error ? `${id}-err` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="font-display text-[13px] font-bold tracking-[0.18em] text-muted uppercase">
        {label}
      </label>
      <div
        className={cx('chamfer chamfer-sm transition-[filter] focus-within:[filter:drop-shadow(0_0_8px_var(--glow-cyan))]', shaking && 'glitch-shake')}
        style={{ '--frame': error ? 'var(--magenta)' : 'var(--line)', '--fill': 'var(--surface)' } as CSSProperties}
      >
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="relative min-h-12 w-full bg-transparent px-4 font-mono text-[15px] text-ink caret-[var(--cyan)] outline-none placeholder:text-muted"
          {...rest}
        />
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
      <p id={`${id}-err`} role="alert" className="min-h-5 font-mono text-[13px] text-magenta">
        {error ? `! ${error}` : ''}
      </p>
    </div>
  )
}

/** Neon çubuklu ilerleme göstergesi: 24 bölüm, dolanlar parlar */
export function NeonProgress({ label, value, tone = 'cyan', segments = 24 }: { label: string; value: number; tone?: Tone; segments?: number }) {
  const on = Math.round((value / 100) * segments)
  const color = `var(--${tone})`
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between font-display text-[13px] font-bold tracking-[0.16em] uppercase">
        <span className="text-muted">{label}</span>
        <span className="font-hud text-[12px] tracking-normal" style={{ color: `var(--${tone === 'mor' ? 'mor-text' : tone})` }}>
          {String(Math.round(value)).padStart(3, '0')}%
        </span>
      </div>
      <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} className="flex h-3 gap-[3px]">
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className="flex-1 -skew-x-[20deg] transition-[background-color,opacity] duration-150"
            style={{ background: i < on ? color : 'var(--line)', opacity: i < on ? 1 : 0.6, filter: i < on ? `drop-shadow(0 0 4px var(--glow-${tone}))` : undefined, transitionDelay: `${i * 12}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export function SectionHead({ item, label, title, lede }: { item: string; label: ReactNode; title: string; lede?: ReactNode }) {
  return (
    <header className="mb-10 max-w-[760px] md:mb-14">
      <p className="flex items-center gap-3 font-display text-[13px] font-bold tracking-[0.22em] text-cyan uppercase">
        <span className="font-hud tracking-normal">{item}</span>
        <span className="h-px w-10 bg-cyan" aria-hidden="true" />
        {label}
      </p>
      <h2 className="mt-3 text-4xl leading-[1] font-bold uppercase md:text-6xl">
        <Glitch text={title} />
      </h2>
      {lede ? <p className="mt-4 max-w-[62ch] text-[17px] text-muted">{lede}</p> : null}
    </header>
  )
}
