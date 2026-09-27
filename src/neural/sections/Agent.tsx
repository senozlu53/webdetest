import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { AIAgentTimeline, type TimelineStep } from '../components/AIAgentTimeline'
import { AIModelSelector, CapBadges } from '../components/AIModelSelector'
import { IconCheck, IconCopy, IconPause, IconPlay, IconReset, IconSparkles, IconStep, IconTool, IconWarning, IconX } from '../components/Icons'
import { Section } from '../components/ui'
import { useAgentRun } from '../hooks/useAgentRun'
import { useMedia } from '../hooks/useMedia'
import { STEPS, TASKS, task as getTask, type LogKind } from '../lib/agent'
import { canAgent, model as getModel } from '../lib/models'
import { dur, num } from '../lib/format'
import { useNeural } from '../lib/store'
import { cx } from '../../shared/cx'

const KIND: Record<LogKind, { ad: string; icon: ReactNode; cls: string }> = {
  dusunce: { ad: 'Düşünce', icon: <IconSparkles size={15} />, cls: 'text-violet' },
  arac: { ad: 'Araç', icon: <IconTool size={15} />, cls: 'text-blue' },
  sonuc: { ad: 'Bulgu', icon: <IconCheck size={15} />, cls: 'text-done' },
  uyari: { ad: 'Uyarı', icon: <IconWarning size={15} />, cls: 'text-active' },
  hata: { ad: 'Hata', icon: <IconX size={15} />, cls: 'text-err' },
}

/** Üretilen metin: ilk satır başlık, "- " ile başlayanlar liste. Akarken son bloğun sonunda imleç */
function Output({ text, streaming }: { text: string; streaming: boolean }) {
  type B = { t: 'p'; s: string; first: boolean } | { t: 'ul'; items: string[] }
  const blocks: B[] = []
  text.split('\n').forEach((l, i) => {
    if (l.startsWith('- ')) {
      const last = blocks[blocks.length - 1]
      if (last?.t === 'ul') last.items.push(l.slice(2))
      else blocks.push({ t: 'ul', items: [l.slice(2)] })
    } else if (l || i === 0) blocks.push({ t: 'p', s: l, first: i === 0 })
  })
  const caret = <span className="caret" aria-hidden="true" />
  return (
    <div className="text-[15px] leading-relaxed text-muted">
      {blocks.map((b, bi) => {
        const end = streaming && bi === blocks.length - 1
        if (b.t === 'p')
          return (
            <p key={bi} className={b.first ? 'font-medium text-ink' : 'mt-2'}>
              {b.s}
              {end ? caret : null}
            </p>
          )
        return (
          <ul key={bi} className="mt-2 space-y-1.5">
            {b.items.map((it, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-violet" aria-hidden="true" />
                <span>
                  {it}
                  {end && i === b.items.length - 1 ? caret : null}
                </span>
              </li>
            ))}
          </ul>
        )
      })}
    </div>
  )
}

export function Agent() {
  const s = useNeural()
  const wide = useMedia('(min-width: 768px)')
  const [taskId, setTaskId] = useState(TASKS[0].id)
  const [fail, setFail] = useState(false)
  const t = getTask(taskId)
  const m = getModel(s.modelId)
  const run = useAgentRun(t, m, fail, s.announce)
  const logBox = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const failId = useId()

  const steps: TimelineStep[] = STEPS.map((st) => {
    const r = run.steps[st.id]
    return { id: st.id, ad: st.ad, ne: st.ne, status: r.status, ms: r.ms, progress: r.total ? r.done / r.total : 0, retries: r.retries }
  })
  const logCount = STEPS.reduce((a, st) => a + run.steps[st.id].logs.length, 0)

  // Günlük: kullanıcı yukarı kaydırmadıysa en sonda kal
  useEffect(() => {
    const el = logBox.current
    if (!el) return
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) el.scrollTop = el.scrollHeight
  }, [logCount])

  const running = run.run === 'calisiyor'
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(run.output)
      setCopied(true)
      s.announce('Yanıt kopyalandı')
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      s.announce('Kopyalanamadı', 'assertive')
    }
  }

  return (
    <Section
      id="ajan"
      eyebrow="Madde 10 · 11 · 16 · Otonom ajan takibi"
      title="Ajan ne yapıyor, şimdi hangi adımda?"
      lead="AI Agent Timeline görevi dört aşamada gösterir: Anla, Ara, Analiz Et, Üret. Her düşünce, araç çağrısı ve bulgu günlüğe düşer. Model seçimi davranışı değiştirir: yerel model web’e çıkmaz, araç çağıramayan model Ara adımını atlar."
    >
      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="panel ticks space-y-5 p-4 md:p-5">
          <fieldset>
            <legend className="text-[16px] font-medium">Görev</legend>
            <div className="mt-2.5 space-y-2">
              {TASKS.map((x) => (
                <label key={x.id} className={cx('block cursor-pointer rounded-xl border px-3 py-2.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]', taskId === x.id ? 'border-[rgb(167_139_250/0.55)] bg-hover' : 'border-line hover:bg-hover')}>
                  <input type="radio" name="gorev" className="sr-only" checked={taskId === x.id} onChange={() => setTaskId(x.id)} />
                  <span className="flex items-center gap-2 text-[15px] font-medium">
                    <span className={cx('size-2 rounded-full', taskId === x.id ? 'bg-violet' : 'bg-idle')} aria-hidden="true" />
                    {x.baslik}
                  </span>
                  <span className="mt-1 block text-[13px] leading-snug text-muted">{x.istem}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <p className="mb-2 text-[16px] font-medium" id="model-etiket">
              Model
            </p>
            <AIModelSelector
              value={s.modelId}
              onChange={(id, mm) => {
                s.setModelId(id)
                s.announce(`Model: ${mm.ad}, ${mm.yer === 'bulut' ? 'bulut' : 'yerel'}`)
              }}
            />
            <CapBadges m={m} className="mt-2.5" />
            <p className="mt-2 text-[13px] text-muted">
              {m.yer === 'bulut' ? 'Bulutta çalışır: istem ve araç çıktıları sağlayıcıya gider.' : 'Cihazda çalışır: veri bu makineden çıkmaz, web araması yapılmaz.'}
              {!canAgent(m) ? ' Araç çağıramadığı için Ara adımı atlanır.' : ''}
            </p>
          </div>

          <label htmlFor={failId} className="flex cursor-pointer items-start gap-2.5 text-[14px]">
            <input id={failId} type="checkbox" className="mt-1 size-4 accent-[#a78bfa]" checked={fail} onChange={(e) => setFail(e.target.checked)} />
            <span>
              Ara adımında zaman aşımı oluştur
              <span className="block text-[13px] text-muted">Hata kırmızıyla ve metinle görünür, ajan yeniden dener.</span>
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
            {running ? (
              <button type="button" className="btn btn-ghost" onClick={run.pause}>
                <IconPause size={16} /> Duraklat
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={run.start}>
                <IconPlay size={16} /> {run.run === 'duraklatildi' ? 'Devam et' : run.run === 'bitti' ? 'Yeniden çalıştır' : 'Başlat'}
              </button>
            )}
            <button type="button" className="icon-btn size-10" onClick={run.step} disabled={running} aria-label="Bir olay ilerlet" title="Bir olay ilerlet">
              <IconStep size={16} />
            </button>
            <button type="button" className="icon-btn size-10" onClick={run.reset} disabled={run.run === 'hazir'} aria-label="Sıfırla" title="Sıfırla">
              <IconReset size={17} />
            </button>
          </div>
        </div>

        <div className="panel ticks min-w-0 p-4 md:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[16px] font-medium">Zaman çizelgesi</h3>
            <p className={cx('font-mono text-[12px] mono-tight', running ? 'text-active' : run.run === 'bitti' ? 'text-done' : 'text-muted')} aria-hidden="true">
              {running ? 'ÇALIŞIYOR' : run.run === 'duraklatildi' ? 'DURAKLATILDI' : run.run === 'bitti' ? 'TAMAMLANDI' : 'HAZIR'}
            </p>
          </div>
          <div className="mt-5">
            <AIAgentTimeline steps={steps} orientation={wide ? 'yatay' : 'dikey'} compact={!wide} />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ['Süre', dur(run.ms / 1000)],
              ['Token', num(Math.round(run.tok))],
              ['Araç çağrısı', num(run.tools)],
              ['İşlem yeri', m.yer === 'bulut' ? 'Bulut' : 'Bu cihaz'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-line px-3 py-2">
                <dt className="label">{k}</dt>
                <dd className="font-mono text-[15px] tabular-nums mono-tight">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            <section aria-labelledby="gunluk" className="min-w-0">
              <h4 id="gunluk" className="label mb-2">
                İşlem günlüğü
              </h4>
              <div ref={logBox} className="max-h-[340px] overflow-y-auto rounded-xl border border-line bg-bg/70 p-3" tabIndex={0} aria-label="İşlem günlüğü, kaydırılabilir">
                {logCount === 0 ? <p className="py-6 text-center text-[14px] text-muted">Başlat’a basın ya da olay olay ilerletin.</p> : null}
                {STEPS.map((st, si) => {
                  const r = run.steps[st.id]
                  if (!r.logs.length) return null
                  return (
                    <div key={st.id} className="mb-3 last:mb-0">
                      <p className="font-mono text-[11px] text-faint mono-tight">
                        {String(si + 1).padStart(2, '0')} · {st.ad.toLocaleUpperCase('tr')}
                      </p>
                      <ol className="mt-1 space-y-1.5">
                        {r.logs.map(({ log }, i) => {
                          const k = KIND[log.kind]
                          return (
                            <li key={i} className="fade-in flex gap-2 text-[14px] leading-snug">
                              <span className={cx('mt-0.5 shrink-0', k.cls)} aria-hidden="true">
                                {k.icon}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="sr-only">{k.ad}: </span>
                                <span className={cx(log.kind === 'arac' ? 'font-mono text-[12px] break-all text-ink mono-tight' : log.kind === 'hata' ? 'text-err' : 'text-ink')}>{log.text}</span>
                                {log.detail ? <span className="block text-[13px] text-muted">{log.detail}</span> : null}
                              </span>
                            </li>
                          )
                        })}
                      </ol>
                    </div>
                  )
                })}
              </div>
            </section>
            <section aria-labelledby="yanit" className="min-w-0">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h4 id="yanit" className="label">
                  Üretilen yanıt
                </h4>
                {run.run === 'bitti' ? (
                  <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink">
                    <IconCopy size={14} /> {copied ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                ) : null}
              </div>
              <div className="min-h-[140px] rounded-xl border border-line bg-bg/70 p-4" aria-busy={run.steps.uret.status === 'calisiyor'}>
                {run.output ? <Output text={run.output} streaming={run.steps.uret.status === 'calisiyor'} /> : <p className="py-6 text-center text-[14px] text-muted">Yanıt Üret adımında akacak.</p>}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Section>
  )
}
