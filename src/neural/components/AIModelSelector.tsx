import { useState } from 'react'
import { Command } from 'cmdk'
import { Popover } from 'radix-ui'
import { CAPS, MACHINE_VRAM, MODELS, canAgent, ctxLabel, fits, model as getModel, type Cap, type Model, type Where } from '../lib/models'
import { num } from '../lib/format'
import { IconCheck, IconChevron, IconChip, IconCloud, IconSearch, IconWarning } from './Icons'
import { cx } from '../../shared/cx'

/** Türkçe karakterleri sadeleştir: "hizli" yazınca "Hızlı" bulunur */
const ascii = (s: string) => s.toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')

/** Bulanık değil, kelime kelime içerir araması: "akson" yalnız Akson modellerini bulur */
const filter = (value: string, search: string, keywords?: string[]) => {
  const hay = ascii([value, ...(keywords ?? [])].join(' '))
  return ascii(search)
    .trim()
    .split(/\s+/)
    .every((w) => hay.includes(w))
    ? 1
    : 0
}

export function WhereIcon({ yer, size = 16, className }: { yer: Where; size?: number; className?: string }) {
  return yer === 'bulut' ? <IconCloud size={size} className={className} /> : <IconChip size={size} className={className} />
}

/** Yetenek rozeti: renk değil metin taşır */
export function CapBadges({ m, className }: { m: Model; className?: string }) {
  if (!m.yetenek.length)
    return (
      <span className={cx('flex flex-wrap gap-1', className)}>
        <span className="chip">Temel metin</span>
      </span>
    )
  return (
    <span className={cx('flex flex-wrap gap-1', className)}>
      {m.yetenek.map((c) => (
        <span key={c} className="chip border-[rgb(167_139_250/0.4)] text-ink" title={CAPS[c].uzun}>
          {CAPS[c].ad}
        </span>
      ))}
    </span>
  )
}

export const modelMeta = (m: Model) => `${ctxLabel(m.baglam)} bağlam · ${m.hiz} tok/sn${m.vram ? ` · ${num(m.vram, 1)} GB` : ''}`

function Item({ m, selected, onPick }: { m: Model; selected: boolean; onPick: () => void }) {
  const ok = fits(m)
  return (
    <Command.Item
      value={m.id}
      keywords={[m.ad, ascii(m.ad), m.yer, ...m.yetenek.map((c) => ascii(CAPS[c].ad))]}
      disabled={!ok}
      onSelect={onPick}
      className="group flex cursor-pointer gap-3 rounded-xl px-3 py-2.5 outline-none data-[disabled=true]:cursor-not-allowed data-[selected=true]:bg-hover data-[selected=true]:shadow-[inset_0_0_0_1px_rgb(167_139_250/0.45)]"
    >
      <span className={cx('mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border', m.yer === 'bulut' ? 'border-[rgb(96_165_250/0.5)] text-blue' : 'border-[rgb(167_139_250/0.5)] text-violet', !ok && 'opacity-50')}>
        <WhereIcon yer={m.yer} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={cx('font-medium', !ok && 'text-muted')}>{m.ad}</span>
          {selected ? (
            <span className="inline-flex items-center gap-1 text-[12px] text-done">
              <IconCheck size={14} /> seçili
            </span>
          ) : null}
        </span>
        <span className="block font-mono text-[11px] text-muted mono-tight">{modelMeta(m)}</span>
        {ok ? <CapBadges m={m} className="mt-1.5" /> : null}
        {!ok ? (
          <span className="mt-1 flex items-center gap-1.5 text-[13px] text-muted">
            <IconWarning size={14} className="shrink-0 text-active" /> Bu makinede çalışmaz: {num(m.vram!, 1)} GB gerekir, {MACHINE_VRAM} GB var
          </span>
        ) : !canAgent(m) ? (
          <span className="mt-1 flex items-center gap-1.5 text-[13px] text-muted">
            <IconWarning size={14} className="shrink-0 text-active" /> Araç çağıramaz: ajanda Ara adımı atlanır
          </span>
        ) : null}
      </span>
    </Command.Item>
  )
}

/**
 * <AIModelSelector> (Madde 11 · 14): bulut / yerel model seçici. Aranabilir liste (cmdk), yer süzgeci,
 * yetenek süzgeci ve rozetler. Bu makineye sığmayan yerel model seçilemez, nedeni yazılır.
 */
export function AIModelSelector({ value, onChange, align = 'start' }: { value: string; onChange: (id: string, m: Model) => void; align?: 'start' | 'end' }) {
  const [open, setOpen] = useState(false)
  const [yer, setYer] = useState<'tum' | Where>('tum')
  const [need, setNeed] = useState<Cap[]>([])
  const cur = getModel(value)
  const list = MODELS.filter((m) => (yer === 'tum' || m.yer === yer) && need.every((c) => m.yetenek.includes(c)))
  const pick = (m: Model) => {
    onChange(m.id, m)
    setOpen(false)
  }
  const group = (w: Where) => list.filter((m) => m.yer === w)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-line-strong bg-bg/70 px-3 py-2 text-left hover:border-[rgb(167_139_250/0.55)] hover:bg-hover">
          <span className={cx('grid size-8 shrink-0 place-items-center rounded-full border', cur.yer === 'bulut' ? 'border-[rgb(96_165_250/0.5)] text-blue' : 'border-[rgb(167_139_250/0.5)] text-violet')}>
            <WhereIcon yer={cur.yer} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">
              <span className="sr-only">Model: </span>
              {cur.ad}
            </span>
            <span className="block truncate font-mono text-[11px] text-muted mono-tight">
              {cur.yer === 'bulut' ? 'Bulut' : 'Yerel'} · {ctxLabel(cur.baglam)} · {cur.hiz} tok/sn
            </span>
          </span>
          <IconChevron size={18} className="shrink-0 text-muted" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align={align} sideOffset={8} collisionPadding={12} className="fade-in z-50 w-[min(420px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-line-strong bg-panel text-ink shadow-[0_24px_60px_rgb(0_0_0/0.6),var(--box-glow)]" aria-label="Model seçici">
          <Command label="Model seç" loop filter={filter} className="flex max-h-[min(560px,var(--radix-popover-content-available-height))] flex-col">
            <div className="flex items-center gap-2 border-b border-line px-3">
              <IconSearch size={17} className="shrink-0 text-muted" />
              <Command.Input placeholder="Model ya da yetenek ara…" className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint" />
            </div>
            <div className="space-y-2 border-b border-line px-3 py-2.5">
              <div role="radiogroup" aria-label="Çalıştığı yer" className="flex gap-1">
                {(
                  [
                    ['tum', 'Tümü'],
                    ['bulut', 'Bulut'],
                    ['yerel', 'Yerel'],
                  ] as const
                ).map(([id, ad]) => (
                  <button key={id} type="button" role="radio" aria-checked={yer === id} onClick={() => setYer(id)} className={cx('rounded-lg px-2.5 py-1 text-[13px]', yer === id ? 'bg-hover text-ink shadow-[inset_0_0_0_1px_rgb(167_139_250/0.45)]' : 'text-muted hover:text-ink')}>
                    {ad}
                  </button>
                ))}
              </div>
              <div role="group" aria-label="Gerekli yetenekler" className="flex flex-wrap gap-1">
                {(Object.keys(CAPS) as Cap[]).map((c) => {
                  const on = need.includes(c)
                  return (
                    <button key={c} type="button" aria-pressed={on} onClick={() => setNeed((n) => (on ? n.filter((x) => x !== c) : [...n, c]))} className={cx('chip', on ? 'border-[rgb(167_139_250/0.7)] bg-[rgb(167_139_250/0.14)] text-ink' : 'hover:text-ink')}>
                      {on ? <IconCheck size={12} /> : null}
                      {CAPS[c].ad}
                    </button>
                  )
                })}
              </div>
            </div>
            <Command.List className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-[0.06em] [&_[cmdk-group-heading]]:text-faint [&_[cmdk-group-heading]]:uppercase">
              <Command.Empty className="px-4 py-8 text-center text-[14px] text-muted">Eşleşen model yok. Süzgeçleri gevşetin.</Command.Empty>
              {group('bulut').length ? (
                <Command.Group heading="Bulut · veri sağlayıcıya gider">
                  {group('bulut').map((m) => (
                    <Item key={m.id} m={m} selected={m.id === value} onPick={() => pick(m)} />
                  ))}
                </Command.Group>
              ) : null}
              {group('yerel').length ? (
                <Command.Group heading={`Yerel · bu makine ${MACHINE_VRAM} GB VRAM`}>
                  {group('yerel').map((m) => (
                    <Item key={m.id} m={m} selected={m.id === value} onPick={() => pick(m)} />
                  ))}
                </Command.Group>
              ) : null}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
