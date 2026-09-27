import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../../shared/cx'

export type Line = { kind: 'in' | 'out' | 'err' | 'ok'; text: string }
export type Run = (cmd: string) => string[] | 'temizle' | void

/**
 * <TerminalShell> (Madde 14): komut alan kabuk. Geri kaydırma alanı role="log"; satırlar kırılmaz,
 * taşan çıktı yatayda kaydırılır (Madde 17). Yukarı/aşağı ok geçmişi, Tab komut tamamlar.
 */
export function TerminalShell({
  title,
  prompt,
  run,
  intro = [],
  commands = [],
  className,
  height = 'min-h-[12lh] flex-1 basis-0',
  right,
}: {
  title: string
  prompt: string
  run: Run
  intro?: Line[]
  commands?: string[]
  className?: string
  height?: string
  right?: ReactNode
}) {
  const [lines, setLines] = useState<Line[]>(intro)
  const [value, setValue] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hi, setHi] = useState(-1)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const cmd = value.trim()
    setValue('')
    setHi(-1)
    if (!cmd) {
      setLines((l) => [...l, { kind: 'in', text: '' }])
      return
    }
    setHist((h) => [...h, cmd])
    const out = run(cmd)
    if (out === 'temizle') {
      setLines([])
      return
    }
    const yeni: Line[] = [
      { kind: 'in', text: cmd },
      ...(out ?? []).map((t): Line => ({ kind: t.startsWith('[x]') || t.startsWith('[!]') ? 'err' : t.startsWith('[+]') || t.startsWith('[>]') ? 'ok' : 'out', text: t })),
    ]
    setLines((l) => [...l, ...yeni].slice(-300))
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' && hist.length) {
      e.preventDefault()
      const i = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1)
      setHi(i)
      setValue(hist[i])
    } else if (e.key === 'ArrowDown' && hi >= 0) {
      e.preventDefault()
      const i = hi + 1
      if (i >= hist.length) {
        setHi(-1)
        setValue('')
      } else {
        setHi(i)
        setValue(hist[i])
      }
    } else if (e.key === 'Tab' && value && !value.includes(' ')) {
      const m = commands.filter((c) => c.startsWith(value))
      if (m.length === 1) {
        e.preventDefault()
        setValue(m[0] + ' ')
      } else if (m.length > 1) {
        e.preventDefault()
        setLines((l) => [...l, { kind: 'in', text: value }, { kind: 'out', text: m.join('  ') }])
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div className={cx('flex min-w-0 flex-col border border-line', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-line px-1">
        <span className="truncate">
          <span aria-hidden="true" className="text-dim">
            {'[#] '}
          </span>
          <span className="font-bold text-hi">{title}</span>
        </span>
        {right}
      </div>
      <div
        ref={logRef}
        role="log"
        aria-label={`${title} çıktısı`}
        tabIndex={0}
        onClick={() => inputRef.current?.focus()}
        className={cx('scroll-y scroll-x ascii px-1', height)}
      >
        {lines.map((l, i) => (
          <div key={i} className={cx(l.kind === 'err' && 'text-em', l.kind === 'ok' && 'text-ok')}>
            {l.kind === 'in' ? (
              <>
                <span className="text-dim">{prompt} </span>
                <span className="text-hi">{l.text}</span>
              </>
            ) : (
              l.text || ' '
            )}
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center border-t border-line px-1">
        <label htmlFor={id} className="shrink-0 text-dim whitespace-pre">
          {prompt}{' '}
        </label>
        <input
          ref={inputRef}
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-describedby={`${id}-ipucu`}
          className="min-h-[1lh] min-w-0 flex-1 bg-transparent font-mono text-hi caret-[var(--fg)] outline-none"
        />
        <span id={`${id}-ipucu`} className="sr-only">
          Enter çalıştırır. Yukarı ve aşağı ok geçmişi getirir, Tab komutu tamamlar, Ctrl L ekranı temizler. "yardım" komutları listeler.
        </span>
      </form>
    </div>
  )
}
