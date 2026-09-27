import type { Analysis } from '../lib/files'
import { fmtSize, KIND_LABEL } from '../lib/files'
import { IconFile } from '../components/Icons'

/** Dosya eki yanıtı: her dosya için yerelde çıkarılan bilgiler */
export function Dosya({ analyses }: { analyses: Analysis[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {analyses.map((a, i) => (
        <li key={a.name + i} className="overflow-hidden rounded-xl border border-line">
          <div className="flex items-center gap-3 border-b border-line bg-sunken px-3 py-2">
            {a.url ? (
              <img src={a.url} alt={a.name} className="size-12 rounded-lg object-cover" />
            ) : (
              <span className="grid size-12 place-items-center rounded-lg bg-brand-soft text-brand-ink">
                <IconFile size={22} />
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold">{a.name}</span>
              <span className="text-[13px] text-muted">
                {KIND_LABEL[a.kind]} · {fmtSize(a.size)}
              </span>
            </span>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 px-3 py-2 text-[14px]">
            {a.facts.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd className="min-w-0 break-words">{v}</dd>
              </div>
            ))}
          </dl>
          {a.preview ? (
            <pre className="scroll-x border-t border-line bg-sunken px-3 py-2 font-mono text-[12.5px] leading-relaxed" tabIndex={0} aria-label={`${a.name}, ilk satırlar`}>
              <code>{a.preview}</code>
            </pre>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
