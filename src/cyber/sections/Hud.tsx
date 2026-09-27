import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { CyberHUD } from '../components/CyberHUD'
import { NeonProgress, SectionHead } from '../components/Cyber'
import { Radar, type Blip } from '../components/Radar'
import { HudIcon } from '../components/HudIcons'
import { cx } from '../../shared/cx'

type Line = { kind: 'in' | 'out' | 'ok' | 'err'; text: string }
type Target = { id: string; name: string; angle: number; dist: number; threat: 'düşük' | 'orta' | 'yüksek'; locked: boolean }

const FOUND: Omit<Target, 'locked'>[] = [
  { id: 'T-01', name: 'Gözetim dronu', angle: 42, dist: 0.62, threat: 'orta' },
  { id: 'T-02', name: 'Kara pazar sunucusu', angle: 158, dist: 0.38, threat: 'düşük' },
  { id: 'T-03', name: 'Şirket güvenlik düğümü', angle: 248, dist: 0.8, threat: 'yüksek' },
  { id: 'T-04', name: 'Kurye motosikleti', angle: 322, dist: 0.5, threat: 'düşük' },
]

const HELP = [
  'yardım          komutları listeler',
  'tara            çevredeki düğümleri tarar',
  'durum           sistem durumunu yazar',
  'kilitle T-0x    hedefe kilitlenir',
  'temizle         ekranı siler',
]

const norm = (s: string) => s.trim().toLocaleLowerCase('tr')

export function Hud() {
  const [lines, setLines] = useState<Line[]>([
    { kind: 'ok', text: 'NX-7741 · güvenli kanal açık' },
    { kind: 'out', text: '"yardım" yazın ya da aşağıdaki komutlardan birini seçin.' },
  ])
  const [cmd, setCmd] = useState('')
  const [targets, setTargets] = useState<Target[]>([])
  const [scan, setScan] = useState<number | null>(null)
  const [bad, setBad] = useState(false)
  const history = useRef<string[]>([])
  const hIndex = useRef(-1)
  const logRef = useRef<HTMLOListElement>(null)

  const print = (...l: Line[]) => setLines((x) => [...x, ...l].slice(-60))

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, scan])

  // Tarama: yüzde 0 → 100, sonra hedefler radara düşer
  useEffect(() => {
    if (scan === null) return
    if (scan >= 100) {
      setTargets((t) => FOUND.map((f) => ({ ...f, locked: t.find((x) => x.id === f.id)?.locked ?? false })))
      print({ kind: 'ok', text: `tarama tamam · ${FOUND.length} düğüm bulundu` }, ...FOUND.map((f) => ({ kind: 'out' as const, text: `${f.id}  ${f.name} · tehdit ${f.threat}` })))
      setScan(null)
      return
    }
    const t = window.setTimeout(() => setScan((s) => (s === null ? null : Math.min(100, s + 10))), 110)
    return () => window.clearTimeout(t)
  }, [scan])

  function run(raw: string) {
    const c = norm(raw)
    if (!c) return
    history.current = [raw, ...history.current].slice(0, 20)
    hIndex.current = -1
    print({ kind: 'in', text: raw })
    setBad(false)
    if (c === 'yardım' || c === 'yardim' || c === 'help') return print(...HELP.map((h) => ({ kind: 'out' as const, text: h })))
    if (c === 'temizle') return setLines([])
    if (c === 'durum')
      return print(
        { kind: 'out', text: `işlemci %64 · bellek %58 · gecikme 12 ms` },
        { kind: 'out', text: `hedef ${targets.length} · kilitli ${targets.filter((t) => t.locked).length}` },
      )
    if (c === 'tara') {
      if (scan !== null) return print({ kind: 'err', text: 'tarama zaten sürüyor' })
      print({ kind: 'out', text: 'tarama başladı…' })
      return setScan(0)
    }
    const m = c.match(/^kilitle\s+(t-0\d)$/)
    if (m) {
      const id = m[1].toUpperCase()
      if (!targets.some((t) => t.id === id)) {
        setBad(true)
        return print({ kind: 'err', text: `${id} bulunamadı · önce "tara"` })
      }
      setTargets((ts) => ts.map((t) => (t.id === id ? { ...t, locked: !t.locked } : t)))
      const was = targets.find((t) => t.id === id)?.locked
      return print({ kind: 'ok', text: `${id} ${was ? 'kilidi açıldı' : 'kilitlendi'}` })
    }
    setBad(true)
    print({ kind: 'err', text: `bilinmeyen komut: ${raw} · "yardım" yazın` })
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    run(cmd)
    setCmd('')
  }
  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const h = history.current
      if (!h.length) return
      hIndex.current = Math.max(-1, Math.min(h.length - 1, hIndex.current + (e.key === 'ArrowUp' ? 1 : -1)))
      setCmd(hIndex.current === -1 ? '' : h[hIndex.current])
    }
  }

  const blips: Blip[] = targets.map((t) => ({ id: t.id, angle: t.angle, dist: t.dist, tone: t.locked ? 'magenta' : t.threat === 'yüksek' ? 'magenta' : t.threat === 'orta' ? 'cyan' : 'yesil' }))

  return (
    <section id="hud" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="10 · 14"
          label="UI kullanım alanı"
          title="Netrunner terminali"
          lede="Geliştirici araçları, Web3, oyun platformları ve yapay zekâ arayüzleri. Burada komut alan bir terminal ve ona bağlı radar: “tara” düğümleri bulur, “kilitle” hedefe kilitlenir. Hepsi kurgusal."
        />
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <CyberHUD title="Terminal" code="TTY-01">
            <ol ref={logRef} role="log" aria-live="polite" aria-label="Terminal çıktısı" className="h-52 overflow-y-auto font-mono text-[14px] leading-relaxed md:h-72">
              {lines.map((l, i) => (
                <li
                  key={i}
                  className={cx(
                    'break-words whitespace-pre-wrap',
                    l.kind === 'in' && 'text-ink',
                    l.kind === 'out' && 'text-muted',
                    l.kind === 'ok' && 'text-yesil',
                    l.kind === 'err' && 'text-magenta',
                  )}
                >
                  {l.kind === 'in' ? <span className="text-cyan">&gt; </span> : null}
                  {l.text}
                </li>
              ))}
              {scan !== null ? (
                <li className="text-cyan">
                  [{'█'.repeat(scan / 10)}
                  {'░'.repeat(10 - scan / 10)}] %{scan}
                </li>
              ) : null}
            </ol>
            <form onSubmit={submit} onAnimationEnd={() => setBad(false)} className={cx('mt-4 flex items-center gap-2 border-t border-line pt-3', bad && 'glitch-shake')}>
              <label htmlFor="komut" className="font-mono text-cyan">
                <span aria-hidden="true">&gt;</span>
                <span className="sr-only">Komut</span>
              </label>
              <input
                id="komut"
                value={cmd}
                onChange={(e) => setCmd(e.target.value)}
                onKeyDown={onKey}
                autoComplete="off"
                spellCheck={false}
                aria-describedby="komut-ipucu"
                className="min-h-11 flex-1 bg-transparent font-mono text-[15px] text-ink caret-[var(--cyan)] outline-none"
                placeholder="komut yazın…"
              />
            </form>
            <p id="komut-ipucu" className="sr-only">
              Yukarı ve aşağı ok tuşları önceki komutları getirir.
            </p>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Hazır komutlar">
              {['yardım', 'tara', 'durum', 'kilitle T-03', 'temizle'].map((c) => (
                <button key={c} type="button" onClick={() => run(c)} className="min-h-9 cursor-pointer border border-line px-2.5 font-mono text-[13px] text-cyan hover:bg-surface-2">
                  {c}
                </button>
              ))}
            </div>
          </CyberHUD>

          <CyberHUD title="Radar" code="RDR-7">
            <div className="flex justify-center">
              <Radar blips={blips} size={230} />
            </div>
            <ul className="mt-4 flex flex-col gap-2" aria-label="Hedefler">
              {targets.length === 0 ? <li className="font-mono text-[13px] text-muted">Hedef yok · terminalde “tara” çalıştırın.</li> : null}
              {targets.map((t) => (
                <li key={t.id} className={cx('flex items-center gap-3 border px-3 py-2', t.locked ? 'border-magenta' : 'border-line')}>
                  <HudIcon name={t.locked ? 'nisangah' : 'radar'} size={22} className={t.locked ? 'text-magenta' : 'text-cyan'} />
                  <span className="flex-1">
                    <span className="font-mono text-[13px] text-muted">{t.id}</span> <span className="text-[14px] font-semibold">{t.name}</span>
                  </span>
                  <span className={cx('font-display text-[13px] font-bold tracking-[0.1em] uppercase', t.threat === 'yüksek' ? 'text-magenta' : t.threat === 'orta' ? 'text-cyan' : 'text-yesil')}>
                    {t.locked ? 'Kilitli' : t.threat}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 grid gap-3">
              <NeonProgress label="Sinyal" value={scan ?? (targets.length ? 86 : 22)} />
              <NeonProgress label="Isı" value={targets.filter((t) => t.locked).length * 22 + 18} tone="magenta" />
            </div>
          </CyberHUD>
        </div>
      </div>
    </section>
  )
}
