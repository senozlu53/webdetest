import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { STEPS, plan, type Event, type Log, type StepId, type StepStatus, type Task } from '../lib/agent'
import type { Model } from '../lib/models'
import { dur, num } from '../lib/format'
import type { Politeness } from '../lib/store'

export type RunStatus = 'hazir' | 'calisiyor' | 'duraklatildi' | 'bitti'
export interface StepState {
  status: StepStatus
  logs: { log: Log; fail?: boolean }[]
  ms: number
  tok: number
  retries: number
  done: number
  total: number
}
interface State {
  run: RunStatus
  idx: number
  steps: Record<StepId, StepState>
  output: string
  ms: number
  tok: number
  tools: number
}

function fresh(events: Event[]): State {
  const steps = Object.fromEntries(
    STEPS.map((s) => [s.id, { status: 'bekliyor', logs: [], ms: 0, tok: 0, retries: 0, done: 0, total: events.filter((e) => e.step === s.id && (e.type === 'log' || e.type === 'word')).length }]),
  ) as unknown as Record<StepId, StepState>
  return { run: 'hazir', idx: 0, steps, output: '', ms: 0, tok: 0, tools: 0 }
}

const ad = (id: StepId) => STEPS.find((s) => s.id === id)!.ad
const no = (id: StepId) => STEPS.findIndex((s) => s.id === id) + 1

/**
 * Ajan koşusu: plan olaylarını sırayla oynatır. Duraklatılabilir, adım adım ilerletilebilir.
 * Süreler sanal saatle toplanır; duraklatma süreyi bozmaz.
 */
export function useAgentRun(task: Task, model: Model, fail: boolean, announce: (t: string, p?: Politeness) => void) {
  const events = useMemo(() => plan(task, model, fail), [task, model, fail])
  const [s, setS] = useState<State>(() => fresh(events))
  const ref = useRef(s)
  ref.current = s

  // Görev, model ya da hata ayarı değişince sıfırla
  useEffect(() => setS(fresh(events)), [events])

  const apply = useCallback(
    (st: State): State => {
      const ev = events[st.idx]
      if (!ev) return st
      const steps = { ...st.steps }
      const cur = { ...steps[ev.step] }
      cur.ms += ev.ms
      let { output, tok, tools } = st
      if (ev.type === 'start') {
        cur.status = 'calisiyor'
        announce(`Adım ${no(ev.step)} / 4: ${ad(ev.step)} başladı`)
      } else if (ev.type === 'log') {
        cur.logs = [...cur.logs, { log: ev.log, fail: ev.fail }]
        cur.tok += ev.log.tok
        cur.done += 1
        tok += ev.log.tok
        if (ev.log.kind === 'arac') tools += 1
        if (ev.fail) {
          cur.status = 'hata'
          cur.retries += 1
          announce(`Hata: ${ev.log.text}`, 'assertive')
        } else if (cur.status === 'hata') cur.status = 'calisiyor'
      } else if (ev.type === 'word') {
        output += ev.text
        cur.tok += ev.tok
        cur.done += 1
        tok += ev.tok
      } else {
        cur.status = ev.status
        const extra = cur.retries ? `, ${cur.retries} hata kurtarıldı` : ''
        announce(ev.status === 'atlandi' ? `${ad(ev.step)} adımı atlandı` : `${ad(ev.step)} tamamlandı, ${dur(cur.ms / 1000)}${extra}`)
      }
      steps[ev.step] = cur
      const idx = st.idx + 1
      const ms = st.ms + ev.ms
      const end = idx >= events.length
      if (end) announce(`Görev tamamlandı: ${dur(ms / 1000)}, ${num(Math.round(tok))} token. Yanıt aşağıda.`)
      return { ...st, steps, idx, output, tok, tools, ms, run: end ? 'bitti' : st.run }
    },
    [events, announce],
  )

  // Zamanlayıcı: sıradaki olayın süresi kadar bekle
  useEffect(() => {
    if (s.run !== 'calisiyor') return
    const ev = events[s.idx]
    if (!ev) return
    const t = window.setTimeout(() => {
      const st = ref.current
      if (st.run !== 'calisiyor') return
      const next = apply(st)
      ref.current = next
      setS(next)
    }, ev.ms)
    return () => window.clearTimeout(t)
  }, [s.run, s.idx, events, apply])

  const start = () => {
    const base = s.run === 'bitti' ? fresh(events) : s
    setS({ ...base, run: 'calisiyor' })
    if (s.run === 'hazir' || s.run === 'bitti') announce(`Görev başladı: ${task.baslik}, ${model.ad}`)
    else announce('Devam ediliyor')
  }
  const pause = () => {
    const next: State = { ...ref.current, run: 'duraklatildi' }
    ref.current = next
    setS(next)
    announce('Duraklatıldı')
  }
  // Adım adım: tek olay ilerlet, sonra duraklı kal
  const step = () => {
    const st = ref.current
    const base = st.run === 'bitti' ? fresh(events) : st
    const next = apply({ ...base, run: 'duraklatildi' })
    ref.current = next
    setS(next)
  }
  const reset = () => {
    setS(fresh(events))
    announce('Sıfırlandı')
  }
  return { ...s, events, start, pause, step, reset }
}
