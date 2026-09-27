import { useEffect, useRef, useState } from 'react'
import { ArrowCounterClockwiseIcon, ArrowRightIcon, CheckIcon, HeartIcon, LightningIcon, PiggyBankIcon, TrophyIcon, XIcon } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { ClayCard } from '../components/ClayCard'
import { ClayButton } from '../components/ClayButton'
import { ClayIcon } from '../components/ClayIcon'
import { Pop } from '../components/Pop'
import type { Tone } from '../components/types'
import { cx } from '../../shared/cx'

/* ── EdTech: Kelime Adası ─────────────────────────────────────── */

const QUESTIONS = [
  { word: 'Elma', answer: 'apple', options: ['apple', 'lemon', 'cherry', 'pear'] },
  { word: 'Muz', answer: 'banana', options: ['grape', 'banana', 'peach', 'plum'] },
  { word: 'Çilek', answer: 'strawberry', options: ['blueberry', 'melon', 'strawberry', 'orange'] },
  { word: 'Üzüm', answer: 'grape', options: ['grape', 'fig', 'apricot', 'kiwi'] },
  { word: 'Karpuz', answer: 'watermelon', options: ['pumpkin', 'coconut', 'mango', 'watermelon'] },
] as const

const HEARTS = 3

function Quiz() {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [hearts, setHearts] = useState(HEARTS)
  const [xp, setXp] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const nextRef = useRef<HTMLButtonElement>(null)
  const focusRef = useRef<HTMLParagraphElement>(null)
  const moved = useRef(false)

  // Son can yanlış cevapla giderse geri bildirim yine gösterilir; sonuç "Sonucu gör" ile açılır
  const done = index >= QUESTIONS.length || (hearts === 0 && picked === null)
  const q = QUESTIONS[Math.min(index, QUESTIONS.length - 1)]
  const answered = picked !== null
  const right = picked === q.answer

  // Cevaptan sonra odak "Devam" düğmesine geçer; seçenekler kilitlenir
  useEffect(() => {
    if (answered) nextRef.current?.focus()
  }, [answered])

  // Yeni soruya ya da sonuca geçince odak başlığa taşınır (Devam düğmesi kaybolur)
  useEffect(() => {
    if (!moved.current) return
    moved.current = false
    focusRef.current?.focus()
  }, [index, done])

  function pick(o: string) {
    if (answered) return
    setPicked(o)
    if (o === q.answer) {
      setXp((x) => x + 10)
      setCorrectCount((c) => c + 1)
    } else setHearts((h) => h - 1)
  }
  function next() {
    moved.current = true
    setPicked(null)
    setIndex((i) => i + 1)
  }
  function restart() {
    moved.current = true
    setIndex(0)
    setPicked(null)
    setHearts(HEARTS)
    setXp(0)
    setCorrectCount(0)
  }

  return (
    <ClayCard tone="base" volume="xl" className="flex min-w-0 flex-col gap-6 p-6 sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ClayIcon icon={LightningIcon} tile="butter" color="var(--ic-butter)" size={24} />
          <div>
            <p className="font-display text-xl leading-tight font-extrabold">Kelime Adası</p>
            <p className="text-[15px] text-muted">İngilizce · Meyveler</p>
          </div>
        </div>
        <div className="flex items-center gap-3 font-bold tabular-nums">
          <span className="flex items-center gap-1" aria-label={`${hearts} can`}>
            {Array.from({ length: HEARTS }, (_, i) => (
              <HeartIcon key={i} size={22} weight="fill" aria-hidden="true" className={i < hearts ? 'text-pink-deep' : 'text-muted opacity-30'} />
            ))}
          </span>
          <span className="clay clay-sm tone-butter rounded-max px-3 py-1 text-[15px] whitespace-nowrap">{xp} XP</span>
        </div>
      </header>

      <div
        className="clay-well clay-sm h-6 rounded-max p-1"
        role="progressbar"
        aria-label="Ders ilerlemesi"
        aria-valuemin={0}
        aria-valuemax={QUESTIONS.length}
        aria-valuenow={Math.min(index + (answered ? 1 : 0), QUESTIONS.length)}
      >
        <div
          className="clay clay-sm tone-pink h-full rounded-max transition-[width] duration-(--spring-dur) ease-(--spring)"
          style={{ width: `${Math.max(8, (Math.min(index + (answered ? 1 : 0), QUESTIONS.length) / QUESTIONS.length) * 100)}%` }}
        />
      </div>

      {done ? (
        <div className="flex flex-col items-center gap-5 py-6 text-center">
          <div className="jelly">
            <ClayIcon icon={TrophyIcon} tile={hearts > 0 ? 'butter' : 'lilac'} color={hearts > 0 ? 'var(--ic-butter)' : 'var(--accent)'} size={72} />
          </div>
          <p ref={focusRef} tabIndex={-1} className="font-display text-3xl font-extrabold outline-none">
            {hearts > 0 ? 'Ders tamam!' : 'Canların bitti'}
          </p>
          <p className="text-muted">
            {correctCount} / {QUESTIONS.length} doğru · {xp} XP kazandın
          </p>
          <ClayButton tone="primary" onClick={restart} icon={<ArrowCounterClockwiseIcon size={20} weight="bold" aria-hidden="true" />}>
            Tekrar oyna
          </ClayButton>
        </div>
      ) : (
        <>
          <div>
            <p className="text-[15px] font-bold text-muted">
              Soru {index + 1} / {QUESTIONS.length} · Bu kelimenin İngilizcesi hangisi?
            </p>
            <p ref={focusRef} tabIndex={-1} className="mt-1 font-display text-5xl font-extrabold outline-none">
              {q.word}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4" role="group" aria-label="Seçenekler">
            {q.options.map((o) => {
              const isAnswer = answered && o === q.answer
              const isWrongPick = answered && o === picked && !right
              const tone: Tone = isAnswer ? 'mint' : isWrongPick ? 'pink' : 'base'
              return (
                <ClayButton
                  key={`${index}-${o}`}
                  tone={tone}
                  size="lg"
                  lang="en"
                  onClick={() => pick(o)}
                  aria-disabled={answered || undefined}
                  className={cx('w-full justify-between px-5 text-lg', isAnswer && 'jelly', isWrongPick && 'wobble', answered && !isAnswer && !isWrongPick && 'opacity-60')}
                >
                  {o}
                  {isAnswer ? (
                    <>
                      <CheckIcon size={22} weight="bold" aria-hidden="true" />
                      <span className="sr-only" lang="tr"> (doğru cevap)</span>
                    </>
                  ) : isWrongPick ? (
                    <>
                      <XIcon size={22} weight="bold" aria-hidden="true" />
                      <span className="sr-only" lang="tr"> (yanlış)</span>
                    </>
                  ) : null}
                </ClayButton>
              )
            })}
          </div>
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-4">
            <p aria-live="polite" className={cx('font-bold', !answered && 'text-muted')}>
              {!answered ? 'Bir seçenek seçin.' : right ? 'Harika! +10 XP' : `Doğrusu “${q.answer}”. Bir can gitti.`}
            </p>
            {answered ? (
              <ClayButton ref={nextRef} tone="primary" onClick={next} icon={<ArrowRightIcon size={20} weight="bold" aria-hidden="true" />}>
                {index === QUESTIONS.length - 1 || hearts === 0 ? 'Sonucu gör' : 'Devam'}
              </ClayButton>
            ) : null}
          </div>
        </>
      )}
    </ClayCard>
  )
}

/* ── Gen-Z Fintech: Kumbara ──────────────────────────────────── */

const TL = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })

type Goal = { id: string; title: string; target: number; saved: number; tone: Tone }
const INITIAL_GOALS: Goal[] = [
  { id: 'konser', title: 'Konser bileti', target: 1800, saved: 1250, tone: 'pink' },
  { id: 'kulaklik', title: 'Kablosuz kulaklık', target: 3200, saved: 900, tone: 'blue' },
  { id: 'tatil', title: 'Yaz tatili', target: 12000, saved: 4600, tone: 'mint' },
]
const AMOUNTS = [50, 100, 250] as const

function PiggyBank() {
  const [goals, setGoals] = useState(INITIAL_GOALS)
  const [balance, setBalance] = useState(2400)
  const [selected, setSelected] = useState('konser')
  const [history, setHistory] = useState<Array<{ id: string; amount: number }>>([])
  const [bump, setBump] = useState(0)

  const goal = goals.find((g) => g.id === selected)!
  const remaining = goal.target - goal.saved
  const reached = remaining <= 0

  function add(amount: number) {
    const real = Math.min(amount, remaining, balance)
    if (real <= 0) return
    setGoals((gs) => gs.map((g) => (g.id === selected ? { ...g, saved: g.saved + real } : g)))
    setBalance((b) => b - real)
    setHistory((h) => [...h, { id: selected, amount: real }])
    setBump((n) => n + 1)
  }
  function undo() {
    const last = history.at(-1)
    if (!last) return
    setGoals((gs) => gs.map((g) => (g.id === last.id ? { ...g, saved: g.saved - last.amount } : g)))
    setBalance((b) => b + last.amount)
    setHistory((h) => h.slice(0, -1))
  }

  return (
    <ClayCard tone="base" volume="xl" className="flex min-w-0 flex-col gap-6 p-6 sm:p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-xl leading-tight font-extrabold">Kumbara</p>
          <p className="text-[15px] text-muted">Harcanabilir bakiye</p>
          <p className="font-display text-3xl font-extrabold tabular-nums" aria-live="polite">
            {TL.format(balance)}
          </p>
        </div>
        <div key={bump} className={bump ? 'jelly' : undefined}>
          <ClayIcon icon={PiggyBankIcon} tile="pink" color="var(--ic-pink)" size={64} />
        </div>
      </header>

      <fieldset>
        <legend className="font-bold">Hedefler</legend>
        <div className="mt-3 flex flex-col gap-4">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.saved / g.target) * 100))
            const on = g.id === selected
            return (
              <label
                key={g.id}
                className={cx(
                  'clay clay-md tone-base clay-press flex cursor-pointer flex-col gap-2.5 rounded-soft px-5 py-4 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ring',
                  on && 'outline-3 outline-offset-3 outline-ink',
                )}
              >
                <input type="radio" name="hedef-kumbara" value={g.id} checked={on} onChange={() => setSelected(g.id)} className="sr-only" />
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-bold">{g.title}</span>
                  <span className="text-[15px] font-bold tabular-nums">
                    {TL.format(g.saved)} <span className="text-muted">/ {TL.format(g.target)}</span>
                  </span>
                </span>
                <span className="clay-well clay-sm block h-5 rounded-max p-1" aria-hidden="true">
                  <span
                    className={cx(`clay clay-sm tone-${g.tone} block h-full rounded-max transition-[width] duration-(--spring-dur) ease-(--spring)`)}
                    style={{ width: `${Math.max(6, pct)}%` }}
                  />
                </span>
                <span className="sr-only">%{pct} tamamlandı</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div>
        <p className="font-bold" aria-live="polite">
          {reached ? `Tebrikler, ${goal.title.toLocaleLowerCase('tr')} hedefine ulaştın!` : `${goal.title} için kalan: ${TL.format(remaining)}`}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {AMOUNTS.map((a) => (
            <ClayButton key={a} tone="primary" onClick={() => add(a)} disabled={reached || balance <= 0}>
              +{TL.format(a)}
            </ClayButton>
          ))}
          <ClayButton tone="base" onClick={undo} disabled={history.length === 0} icon={<ArrowCounterClockwiseIcon size={18} weight="bold" aria-hidden="true" />}>
            Geri al
          </ClayButton>
        </div>
      </div>
    </ClayCard>
  )
}

export function Application() {
  return (
    <section id="uygulama" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="10"
          label="UI kullanım alanı"
          title="Ders ve kumbara"
          lede="Eğitim platformları, Gen-Z odaklı fintech, Web3 projeleri ve eğlenceli portfolyolar. Solda çalışan bir kelime dersi, sağda hedefe para biriktiren bir kumbara."
        />
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <Pop>
            <Quiz />
          </Pop>
          <Pop i={1}>
            <PiggyBank />
          </Pop>
        </div>
      </div>
    </section>
  )
}
