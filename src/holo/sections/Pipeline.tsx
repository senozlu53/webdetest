import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { HoloButton, HoloPanel, PanelHead, SectionHead, StatusPill } from '../components/ui'
import { HoloIcon, type HoloIconName } from '../components/Icons'
import { Gauge } from '../components/Gauge'
import { useHolo } from '../lib/store'
import { RESPONSES, VRAM_GB, fmtGB, fmtNum, tokenize } from '../lib/data'
import { cx } from '../../shared/cx'

type Phase = 'hazir' | 'token' | 'prefill' | 'decode' | 'bitti' | 'durdu'
const STAGES: ReadonlyArray<{ id: Exclude<Phase, 'hazir' | 'bitti' | 'durdu'> | 'detok'; label: string; hint: string; icon: HoloIconName }> = [
  { id: 'token', label: 'Tokenleştirici', hint: 'Metin → token kimlikleri', icon: 'akis' },
  { id: 'prefill', label: 'Ön doldurma', hint: 'İstem tek geçişte işlenir, KV önbelleği dolar', icon: 'bellek' },
  { id: 'decode', label: 'Kod çözme', hint: 'Her adımda bir token üretilir', icon: 'noral' },
  { id: 'detok', label: 'Detokenleştirici', hint: 'Token → metin, ekrana akar', icon: 'model' },
]
const SUGGEST = ['Orion 70B\'yi 10GbE üzerinden ne kadar sürede indiririm?', 'Q5 ile Q4 nicemleme arasındaki bellek farkı ne?', 'Holografik arayüzü bir cümleyle anlat.']

export function Pipeline() {
  const s = useHolo()
  const model = s.models.find((m) => m.id === s.activeId)!
  const [prompt, setPrompt] = useState(SUGGEST[1])
  const [phase, setPhase] = useState<Phase>('hazir')
  const [out, setOut] = useState<string[]>([])
  const [tps, setTps] = useState(0)
  const [ttft, setTtft] = useState<number | null>(null)
  const timers = useRef<number[]>([])
  const lastSignal = useRef(s.runSignal)
  const running = phase === 'token' || phase === 'prefill' || phase === 'decode'
  const promptTokens = tokenize(prompt).filter((t) => t.trim()).length
  const outTokens = out.filter((t) => t.trim()).length
  const vram = s.models.filter((m) => m.status === 'yuklu').reduce((a, m) => a + m.sizeGB, 0)

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))

  const run = () => {
    clear()
    const text = RESPONSES.find((r) => r.match.test(prompt))!.text
    const toks = tokenize(text)
    const firstMs = Math.round(90 + model.sizeGB * 20 + promptTokens * 3)
    const perTok = 1000 / Math.max(8, model.tps)
    setOut([])
    setTtft(null)
    setTps(0)
    setPhase('token')
    later(() => setPhase('prefill'), 160)
    later(() => {
      setPhase('decode')
      setTtft(firstMs)
      const words = toks.filter((t) => t.trim()).length
      const finish = (elapsed: number) => {
        const rate = words / (elapsed / 1000)
        setTps(rate)
        setPhase('bitti')
        s.say(`Yanıt tamamlandı: ${words} token, saniyede ${Math.round(rate)} token`)
      }
      // Hareket kapalıysa yanıt tek seferde gelir; açıksa token token akar
      if (document.documentElement.dataset.motion === 'off') {
        setOut(toks)
        finish(words * perTok)
        return
      }
      const start = performance.now()
      let i = 0
      let words2 = 0
      const step = () => {
        // Boşluklar ayrı token sayılmaz: bir sonraki kelimeyle birlikte eklenir
        const chunk: string[] = []
        while (i < toks.length) {
          chunk.push(toks[i])
          i++
          if (toks[i - 1].trim()) break
        }
        words2 += 1
        setOut((o) => [...o, ...chunk])
        setTps(words2 / ((performance.now() - start) / 1000 || 1))
        if (i < toks.length) later(step, perTok * (0.75 + Math.random() * 0.5))
        else finish(performance.now() - start)
      }
      step()
    }, 160 + firstMs)
  }

  const stop = () => {
    clear()
    setPhase('durdu')
    s.say('Üretim durduruldu')
  }

  // Komut merkezinden gelen "Çıkarımı başlat"
  useEffect(() => {
    if (s.runSignal !== lastSignal.current) {
      lastSignal.current = s.runSignal
      run()
    }
  }, [s.runSignal])
  useEffect(() => clear, [])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (running) stop()
    else run()
  }
  const stageState = (id: string) => {
    const order = ['token', 'prefill', 'decode', 'detok']
    const cur = phase === 'decode' ? 2 : order.indexOf(phase)
    const idx = order.indexOf(id)
    if (phase === 'bitti') return 'tamam'
    if (phase === 'hazir' || phase === 'durdu') return 'bekliyor'
    if (id === 'detok' && phase === 'decode') return 'etkin'
    return idx < cur ? 'tamam' : idx === cur ? 'etkin' : 'bekliyor'
  }

  return (
    <section id="hat" className="px-4 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="10 · 11 · 16"
          label="UI kullanım alanı"
          title="Yerel LLM yürütme hattı"
          lede="Model bu makinede, veriler burada kalır. İstem tokenleşir, ön doldurmadan geçer, yanıt token token akarak gelir. Komut merkezinden (Ctrl + K) model değiştirip çıkarımı başlatabilirsiniz. Ölçümler kurgusaldır."
        />
        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <HoloPanel tick className="flex min-w-0 flex-col p-5 md:p-6">
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <label className="flex min-w-0 flex-col gap-1.5">
                  <span className="font-tech text-[12px] font-semibold tracking-[0.14em] text-muted uppercase">Model</span>
                  <select
                    value={s.activeId}
                    onChange={(e) => {
                      const m = s.models.find((x) => x.id === e.target.value)!
                      s.setActive(m.id)
                      s.say(`${m.name} ${m.params} etkin${m.status === 'diskte' ? ', belleğe yüklendi' : ''}`)
                    }}
                    disabled={running}
                    className="thin-glow min-h-11 max-w-full rounded-xl bg-[rgb(var(--surface-rgb)/0.7)] px-3 text-[15px] text-ink"
                  >
                    {s.models
                      .filter((m) => m.kind !== 'Gömme')
                      .map((m) => (
                        <option key={m.id} value={m.id} disabled={m.status === 'indiriliyor'}>
                          {m.name} {m.params} · {m.quant}
                          {m.status === 'diskte' ? ' (diskten yüklenir)' : m.status === 'indiriliyor' ? ' (iniyor)' : ''}
                        </option>
                      ))}
                  </select>
                </label>
                <StatusPill tone={running ? 'cyan' : phase === 'bitti' ? 'blue' : 'muted'} pulse={running}>
                  {running ? 'Üretiliyor' : phase === 'bitti' ? 'Tamamlandı' : phase === 'durdu' ? 'Durduruldu' : 'Hazır'}
                </StatusPill>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="font-tech text-[12px] font-semibold tracking-[0.14em] text-muted uppercase">İstem · {promptTokens} token</span>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault()
                      if (!running) run()
                    }
                  }}
                  rows={2}
                  aria-describedby="istem-ipucu"
                  className="thin-glow resize-none rounded-xl bg-[rgb(var(--surface-rgb)/0.7)] px-4 py-3 text-[16px] text-ink caret-[var(--cyan-text)] outline-none placeholder:text-muted focus-visible:outline-2 focus-visible:outline-cyan-text"
                />
                <span id="istem-ipucu" className="text-[13px] text-muted">
                  Ctrl + Enter ile çalıştırın.
                </span>
              </label>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Örnek istemler">
                {SUGGEST.map((q) => (
                  <button key={q} type="button" onClick={() => setPrompt(q)} className="min-h-9 rounded-full border border-line-soft px-3 text-left text-[13px] text-muted transition-colors hover:border-line hover:text-ink">
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <HoloButton type="submit" variant={running ? 'glass' : 'primary'} icon={<HoloIcon name={running ? 'dur' : 'oynat'} size={16} glow={false} />}>
                  {running ? 'Durdur' : 'Çalıştır'}
                </HoloButton>
                <HoloButton variant="ghost" onClick={() => s.setCommandOpen(true)} icon={<HoloIcon name="komut" size={16} glow={false} />}>
                  Komut merkezi
                </HoloButton>
              </div>
            </form>

            <div className="mt-5 flex min-h-0 flex-1 flex-col">
              <p className="flex items-center justify-between font-tech text-[12px] font-semibold tracking-[0.14em] text-muted uppercase">
                <span>Çıktı</span>
                <span className="tabular-nums">{outTokens} token</span>
              </p>
              <div
                aria-busy={running}
                aria-label="Model çıktısı"
                role="region"
                className="thin-scroll mt-2 min-h-[176px] flex-1 overflow-y-auto rounded-xl border border-line-soft bg-[rgb(var(--bg-rgb)/0.55)] p-4 text-[16px] leading-relaxed"
              >
                {out.length ? (
                  <p>
                    {out.map((t, i) => (
                      <span key={i} className="tok">
                        {t}
                      </span>
                    ))}
                    {running ? <span className="pulse-dot ml-0.5 inline-block h-4 w-2 translate-y-0.5 rounded-sm bg-cyan shadow-[0_0_10px_var(--cyan)]" aria-hidden="true" /> : null}
                  </p>
                ) : (
                  <p className="text-muted">{phase === 'prefill' || phase === 'token' ? 'İstem işleniyor…' : 'Çalıştırın; yanıt burada token token akar.'}</p>
                )}
              </div>
            </div>
          </HoloPanel>

          <div className="flex min-w-0 flex-col gap-6">
            <HoloPanel className="p-5 md:p-6" data-running={running ? '' : undefined}>
              <PanelHead title="Hat" meta={`${model.name} ${model.params}`} icon={<HoloIcon name="akis" size={16} />} />
              <ol className="mt-4 flex flex-col">
                {STAGES.map((st, i) => {
                  const state = stageState(st.id)
                  return (
                    <li key={st.id} className="relative flex gap-3 pb-4 last:pb-0">
                      {i < STAGES.length - 1 ? (
                        <svg className="absolute top-9 left-[17px] h-[calc(100%-28px)] w-1" preserveAspectRatio="none" viewBox="0 0 2 40" aria-hidden="true">
                          <line x1="1" y1="0" x2="1" y2="40" stroke={state === 'bekliyor' ? 'var(--line-soft)' : 'var(--cyan-text)'} strokeWidth="2" className={state !== 'bekliyor' ? 'flow' : undefined} vectorEffect="non-scaling-stroke" />
                        </svg>
                      ) : null}
                      <span
                        className={cx(
                          'relative grid size-9 shrink-0 place-items-center rounded-full border transition-all',
                          state === 'etkin' ? 'border-cyan-text bg-[var(--tint)] text-cyan-text shadow-[0_0_16px_var(--glow-strong)]' : state === 'tamam' ? 'border-line text-cyan-text' : 'border-line-soft text-muted',
                        )}
                      >
                        <HoloIcon name={state === 'tamam' ? 'onay' : st.icon} size={16} glow={state === 'etkin'} />
                      </span>
                      <span className="flex flex-col">
                        <span className="flex items-center gap-2 text-[15px] font-[500]">
                          {st.label}
                          <span className="sr-only">: {state === 'etkin' ? 'çalışıyor' : state === 'tamam' ? 'tamamlandı' : 'bekliyor'}</span>
                        </span>
                        <span className="text-[13px] text-muted">{st.hint}</span>
                      </span>
                    </li>
                  )
                })}
              </ol>
            </HoloPanel>
            <HoloPanel className="p-5 md:p-6">
              <PanelHead title="Ölçümler" meta="canlı" />
              <div className="mt-3 grid grid-cols-2 place-items-center gap-2">
                <Gauge value={Math.min(tps, 150)} max={150} label="Hız" display={tps ? String(Math.round(tps)) : '—'} unit="token/sn" size={132} />
                <Gauge value={ttft ?? 0} max={1500} label="İlk token" display={ttft ? String(ttft) : '—'} unit="ms" size={132} tone="blue" />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line-soft pt-4 text-[14px]">
                <div>
                  <dt className="font-tech text-[12px] tracking-[0.1em] text-muted uppercase">Bağlam</dt>
                  <dd className="tabular-nums">
                    {promptTokens + outTokens} / {model.ctx.toLocaleString('tr-TR')}
                  </dd>
                </div>
                <div>
                  <dt className="font-tech text-[12px] tracking-[0.1em] text-muted uppercase">VRAM</dt>
                  <dd className="tabular-nums">
                    {fmtNum(vram)} / {VRAM_GB} GB
                  </dd>
                </div>
                <div className="col-span-2">
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--line-soft)]" aria-hidden="true">
                    <div className="h-full rounded-full [background:var(--accent-grad)] shadow-[0_0_10px_var(--glow-strong)] transition-[width] duration-500" style={{ width: `${Math.min(100, (vram / VRAM_GB) * 100)}%` } as CSSProperties} />
                  </div>
                  <p className="mt-1.5 text-[13px] text-muted">
                    {model.name} {model.params} {fmtGB(model.sizeGB)}
                    {vram > VRAM_GB ? ' · VRAM aşıldı: katmanlar sistem belleğine taşar' : ''}
                  </p>
                </div>
              </dl>
            </HoloPanel>
          </div>
        </div>
      </div>
    </section>
  )
}
