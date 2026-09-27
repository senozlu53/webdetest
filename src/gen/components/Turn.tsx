import { useEffect, useMemo, useRef, useState } from 'react'
import type { Scenario, ToolStep } from '../lib/scenarios'
import { tokens } from '../lib/markdown'
import { AISources, AutoHeight, CitationContext, GenProgress, StreamingIndicator, ToolCall, type ToolStatus } from './core'
import { Markdown } from './Markdown'
import { EventForm, ResultView } from '../results/Results'
import { IconSpark } from './Icons'

type Phase = 'plan' | 'tools' | 'answer' | 'form' | 'extra' | 'done' | 'stopped'
const motionOff = () => document.documentElement.dataset.motion === 'off'

/** Metni kelime kelime akıtır (Madde 16); hareket kapalıysa bir seferde verir */
function useStream(text: string, run: boolean, onDone: () => void) {
  const toks = useMemo(() => tokens(text), [text])
  const [n, setN] = useState(0)
  const done = useRef(onDone)
  done.current = onDone
  useEffect(() => {
    if (!run) return
    if (motionOff()) {
      setN(toks.length)
      done.current()
      return
    }
    let i = 0
    let t = 0
    const step = () => {
      i = Math.min(toks.length, i + (Math.random() < 0.25 ? 2 : 1))
      setN(i)
      if (i >= toks.length) done.current()
      else t = window.setTimeout(step, 22 + Math.random() * 38)
    }
    t = window.setTimeout(step, 60)
    return () => window.clearTimeout(t)
  }, [run, toks])
  return { shown: toks.slice(0, n).join(''), count: n, total: toks.length }
}

/**
 * Tek bir asistan turu: plan → araç çağrıları (sırayla, her biri sonucuyla) → akan yanıt → kaynaklar.
 * Asistan senaryosunda yanıtın içinde form üretilir; gönderilince yeni araç çağrısı başlar.
 */
export function Turn({ id, query, sc, stopSignal, onBusy, onAnnounce }: { id: string; query: string; sc: Scenario; stopSignal: number; onBusy: (b: boolean) => void; onAnnounce: (m: string) => void }) {
  const [phase, setPhase] = useState<Phase>('plan')
  const [status, setStatus] = useState<ToolStatus[]>(() => sc.steps.map(() => 'pending'))
  const [shownTools, setShownTools] = useState(0)
  const [elapsed, setElapsed] = useState<number[]>([])
  const [extra, setExtra] = useState<{ step: ToolStep; status: ToolStatus; ms?: number } | null>(null)
  const [followUp, setFollowUp] = useState('')
  const timers = useRef<number[]>([])
  const stop0 = useRef(stopSignal)
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, motionOff() ? Math.min(ms, 250) : ms))
  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  // Zaman çizelgesi: plan ve araçlar
  useEffect(() => {
    onBusy(true)
    let t = 900
    later(() => setPhase(sc.steps.length ? 'tools' : 'answer'), t)
    sc.steps.forEach((s, i) => {
      later(() => setShownTools(i + 1), t)
      later(() => setStatus((st) => st.map((x, k) => (k === i ? 'running' : x))), t + 250)
      t += 250 + s.ms
      later(() => {
        setStatus((st) => st.map((x, k) => (k === i ? 'done' : x)))
        setElapsed((e) => {
          const c = [...e]
          c[i] = s.ms
          return c
        })
      }, t)
      t += 200
    })
    if (sc.steps.length) later(() => setPhase('answer'), t)
    return clear
  }, [])

  // Durdur
  useEffect(() => {
    if (stopSignal === stop0.current) return
    stop0.current = stopSignal
    if (phase === 'done' || phase === 'stopped' || phase === 'form') return
    clear()
    setStatus((st) => st.map((x) => (x === 'running' ? 'error' : x)))
    setPhase('stopped')
    onBusy(false)
    onAnnounce('Üretim durduruldu')
  }, [stopSignal])

  const ans = useStream(sc.answer, phase === 'answer', () => {
    if (sc.form) {
      setPhase('form')
      onBusy(false)
      onAnnounce('Yanıt hazır; zaman seçip davet gönderebilirsiniz')
    } else {
      setPhase('done')
      onBusy(false)
      onAnnounce(`Yanıt hazır${sc.sources.length ? `, ${sc.sources.length} kaynak` : ''}`)
    }
  })
  const fu = useStream(followUp, phase === 'extra' && extra?.status === 'done', () => {
    setPhase('done')
    onBusy(false)
    onAnnounce('Etkinlik oluşturuldu')
  })

  const gonder = (v: { baslik: string; zaman: string }) => {
    const step: ToolStep = {
      name: 'etkinlik_olustur',
      label: 'Oluştur',
      params: { baslik: v.baslik, baslangic: `yarın ${v.zaman}`, sure_dk: 45, katilimcilar: ['Siz', 'Ece', 'Mert'] },
      ms: 1100,
      summary: '1 etkinlik',
      result: { kind: 'event', baslik: v.baslik, zaman: v.zaman, sure: 45, kisiler: ['Siz', 'Ece', 'Mert'] },
    }
    onBusy(true)
    setPhase('extra')
    setExtra({ step, status: 'pending' })
    setFollowUp(`Davet gönderildi: **${v.baslik}**, yarın ${v.zaman}. Ece ve Mert'e bildirim gitti; isterseniz gündem maddelerini de ekleyebilirim.`)
    later(() => setExtra((x) => x && { ...x, status: 'running' }), 250)
    later(() => setExtra((x) => x && { ...x, status: 'done', ms: step.ms }), 250 + step.ms)
  }

  const steps = ['Planla', ...sc.steps.map((s) => s.label), 'Yanıtla', ...(extra ? ['Oluştur'] : [])]
  const running = status.findIndex((s) => s === 'running' || s === 'pending')
  const current = phase === 'plan' ? 0 : phase === 'tools' ? 1 + Math.max(0, running) : phase === 'answer' ? sc.steps.length + 1 : phase === 'extra' ? sc.steps.length + 2 : steps.length
  const busy = phase === 'plan' || phase === 'tools' || phase === 'answer' || phase === 'extra'

  return (
    <article aria-labelledby={`${id}-q`} className="flex flex-col gap-4">
      <h3 id={`${id}-q`} className="sr-only">
        Soru: {query}
      </h3>
      <div className="flex justify-end">
        <p data-layout="Mesaj · hug" className="hug gen-enter rounded-md border border-line bg-sunken px-3.5 py-2 font-sans text-[15px] whitespace-pre-wrap">
          <span className="sr-only">Siz: </span>
          {query}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans">
          <span className="flex items-center gap-1.5 text-[14px] font-semibold">
            <span className="grid size-6 place-items-center rounded-md bg-accent-soft text-accent" aria-hidden="true">
              <IconSpark size={13} />
            </span>
            Asistan
          </span>
          <span className="rounded-full border border-line px-2 py-0.5 text-[12px] text-muted">{sc.kullanim}</span>
          <GenProgress steps={steps} current={current} done={phase === 'done'} />
        </div>
        <AutoHeight>
          <div className="flex flex-col gap-3" aria-busy={busy}>
            {phase === 'plan' ? (
              <StreamingIndicator state="dusunuyor" />
            ) : (
              <p className="font-sans text-[13px] text-muted">
                <span className="font-medium text-ink">Plan:</span> {sc.plan}
              </p>
            )}
            {sc.steps.slice(0, shownTools).map((s, i) => (
              <div key={s.name + i} className="flex flex-col gap-2.5">
                <ToolCall name={s.name} params={s.params} status={status[i]} summary={s.summary} elapsed={elapsed[i]} />
                {status[i] === 'done' ? <ResultView r={s.result} sources={sc.sources} /> : null}
              </div>
            ))}
            {phase !== 'plan' && phase !== 'tools' && (ans.count > 0 || phase === 'answer') ? (
              <CitationContext.Provider value={{ turn: id, sources: sc.sources }}>
                <div aria-live="off">
                  <Markdown md={ans.shown} streaming={phase === 'answer'} />
                </div>
              </CitationContext.Provider>
            ) : null}
            {phase === 'answer' ? <StreamingIndicator state="yaziyor" tokens={ans.count} /> : null}
            {phase === 'stopped' ? <StreamingIndicator state="durdu" tokens={ans.count} /> : null}
            {sc.form && (phase === 'form' || extra) ? <EventForm slots={(sc.steps[0].result as { slots: string[] }).slots} disabled={!!extra} onSubmit={gonder} /> : null}
            {extra ? (
              <div className="flex flex-col gap-2.5">
                <ToolCall name={extra.step.name} params={extra.step.params} status={extra.status} summary={extra.step.summary} elapsed={extra.ms} />
                {extra.status === 'done' ? <ResultView r={extra.step.result} sources={[]} /> : null}
                {fu.count ? <Markdown md={fu.shown} streaming={phase === 'extra'} /> : null}
              </div>
            ) : null}
            {phase === 'done' || phase === 'form' ? (
              <>
                <StreamingIndicator state="bitti" tokens={ans.total + fu.total} />
                <AISources sources={sc.sources} turn={id} />
              </>
            ) : null}
          </div>
        </AutoHeight>
      </div>
    </article>
  )
}
