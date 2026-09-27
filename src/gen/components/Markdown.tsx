import { useState, type ReactNode } from 'react'
import { parse, type Block, type Inline } from '../lib/markdown'
import { AICitation, StreamCursor } from './core'
import { IconCheck, IconCopy } from './Icons'
import { cx } from '../../shared/cx'

function Inl({ c }: { c: Inline[] }) {
  return (
    <>
      {c.map((x, i) => {
        switch (x.t) {
          case 'text':
            return <span key={i}>{x.s}</span>
          case 'b':
            return (
              <strong key={i}>
                <Inl c={x.c} />
              </strong>
            )
          case 'i':
            return (
              <em key={i}>
                <Inl c={x.c} />
              </em>
            )
          case 'code':
            return <code key={i}>{x.s}</code>
          case 'cite':
            return <AICitation key={i} n={x.n} />
          case 'a':
            return (
              <a key={i} href={x.href}>
                <Inl c={x.c} />
              </a>
            )
        }
      })}
    </>
  )
}

/** Kod bloğu: yatay kaydırma alanında, dil etiketi ve kopyala düğmesiyle (Madde 15 · 17) */
export function CodeBlock({ lang, text, cursor, open }: { lang: string; text: string; cursor?: boolean; open?: boolean }) {
  const [kopya, setKopya] = useState(false)
  return (
    <figure className="overflow-hidden rounded-md border border-line bg-sunken font-sans not-italic">
      <figcaption className="flex items-center justify-between border-b border-line px-3 py-1 text-[12px] text-muted">
        <span className="font-mono">{lang}</span>
        <button
          type="button"
          disabled={open}
          onClick={() => {
            navigator.clipboard?.writeText(text).then(
              () => {
                setKopya(true)
                window.setTimeout(() => setKopya(false), 1500)
              },
              () => undefined,
            )
          }}
          className="inline-flex min-h-7 items-center gap-1 rounded-sm px-1.5 hover:bg-surface hover:text-ink disabled:opacity-50"
        >
          {kopya ? <IconCheck size={13} className="text-ok" /> : <IconCopy size={13} />}
          {kopya ? 'kopyalandı' : 'kopyala'}
        </button>
      </figcaption>
      <pre className="scroll-x px-3 py-2.5 font-mono text-[13px] leading-relaxed" tabIndex={0} aria-label={`${lang} kodu`}>
        <code>
          {lang === 'diff'
            ? text.split('\n').map((l, i) => (
                <span key={i} className={cx('block', l.startsWith('+') && 'bg-[color-mix(in_srgb,var(--ok)_12%,transparent)] text-ok', l.startsWith('-') && 'bg-[color-mix(in_srgb,var(--err)_10%,transparent)] text-err')}>
                  {l || ' '}
                </span>
              ))
            : text}
          {cursor ? <StreamCursor /> : null}
        </code>
      </pre>
    </figure>
  )
}

function render(b: Block, key: number, base: number, cursor: boolean): ReactNode {
  const cur = cursor ? <StreamCursor /> : null
  switch (b.t) {
    case 'h': {
      const H = `h${Math.min(6, b.level + base)}` as 'h3' | 'h4' | 'h5' | 'h6'
      return (
        <H key={key}>
          <Inl c={b.c} />
          {cur}
        </H>
      )
    }
    case 'p':
      return (
        <p key={key}>
          <Inl c={b.c} />
          {cur}
        </p>
      )
    case 'quote':
      return (
        <blockquote key={key}>
          <p>
            <Inl c={b.c} />
            {cur}
          </p>
        </blockquote>
      )
    case 'ul':
    case 'ol': {
      const L = b.t
      return (
        <L key={key}>
          {b.items.map((it, i) => (
            <li key={i}>
              <Inl c={it} />
              {cursor && i === b.items.length - 1 ? <StreamCursor /> : null}
            </li>
          ))}
        </L>
      )
    }
    case 'code':
      return <CodeBlock key={key} lang={b.lang} text={b.text} cursor={cursor} open={b.open} />
    case 'table':
      return (
        <div key={key} className="scroll-x rounded-md border border-line font-sans" role="region" tabIndex={0} aria-label={`Tablo: ${b.head.map((h) => h.map((x) => (x.t === 'text' ? x.s : '')).join('')).join(', ')}`}>
          <table className="w-full border-collapse text-[14px]">
            <thead className="bg-sunken">
              <tr>
                {b.head.map((h, i) => (
                  <th key={i} scope="col" className="border-b border-line px-3 py-1.5 text-left font-semibold whitespace-nowrap" style={{ textAlign: b.align[i] }}>
                    <Inl c={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="gen-enter border-b border-line last:border-0">
                  {r.map((c, k) => (
                    <td key={k} className="px-3 py-1.5 align-top whitespace-nowrap" style={{ textAlign: b.align[k] }}>
                      <Inl c={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

/**
 * Semantik Markdown (Madde 18): başlıklar sayfa hiyerarşisine oturur (base ile kaydırılır: "##" → h4),
 * listeler ul/ol, tablolar th/scope, kod figure + pre. Akış sırasında imleç son bloğun sonunda durur.
 */
export function Markdown({ md, streaming, base = 2, className }: { md: string; streaming?: boolean; base?: number; className?: string }) {
  const blocks = parse(md, streaming)
  return <div className={cx('prose-gen', className)}>{blocks.map((b, i) => render(b, i, base, !!streaming && i === blocks.length - 1))}</div>
}
