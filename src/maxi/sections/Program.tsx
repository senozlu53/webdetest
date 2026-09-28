import { useEffect, useRef, useState } from 'react'
import { ARTISTS, DAYS, FEST_START, GENRES, TICKETS, tl, type Artist, type Day, type Genre } from '../lib/data'
import { useMaxi } from '../lib/store'
import { Chips, Section } from '../components/ui'
import { BigButton } from '../components/ui'
import { Starburst } from '../components/Shapes'
import { IconCheck, IconHeart, IconMinus, IconPlus, IconTicket } from '../components/Icons'
import { cx } from '../../shared/cx'

const NEON = ['text-lime', 'text-pink', 'text-cyan', 'text-orange', 'text-butter', 'text-lilac', 'text-peach', 'text-mint']

function useCountdown() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(t)
  }, [])
  const ms = Math.max(0, FEST_START.getTime() - now)
  return { gun: Math.floor(ms / 86_400_000), saat: Math.floor((ms % 86_400_000) / 3_600_000), dk: Math.floor((ms % 3_600_000) / 60_000) }
}

/** Afiş: manşet dev ve geniş sans, orta sıra eğik serif, alt sıra mono; hepsi aynı satırda karışır */
function Name({ a, i, dim, sel, onPick }: { a: Artist; i: number; dim: boolean; sel: boolean; onPick: () => void }) {
  const size = a.tier === 1 ? 'font-sans text-[clamp(38px,6.4vw,92px)] font-black uppercase [font-stretch:150%] max-sm:[font-stretch:100%]' : a.tier === 2 ? 'font-serif text-[clamp(28px,3.8vw,54px)] font-black italic' : 'font-mono text-[clamp(15px,1.6vw,20px)] font-bold'
  return (
    <li className={cx('inline', dim && 'opacity-[0.16]')} aria-hidden={dim || undefined}>
      <button
        type="button"
        onClick={onPick}
        inert={dim}
        aria-pressed={sel}
        data-cursor="bak"
        className={cx('rounded-xl px-1 leading-[1.05] hover:bg-[#fff7ee] hover:text-[#111014]', size, sel ? 'bg-[#fff7ee] text-[#111014]' : NEON[i % NEON.length])}
      >
        {a.tier === 2 ? <span className="wonk">{a.ad}</span> : a.ad}
      </button>
      <span aria-hidden="true" className="mx-2 inline-block align-middle text-[#fff7ee]">
        <svg viewBox="0 0 20 20" width={a.tier === 1 ? 26 : 16} height={a.tier === 1 ? 26 : 16} className="inline">
          <path d="M10 1l2.2 6 6.3-1.5-4.6 4.5 4.6 4.5-6.3-1.5L10 19l-2.2-6-6.3 1.5 4.6-4.5L1.5 5.5 7.8 7z" fill="currentColor" />
        </svg>
      </span>
    </li>
  )
}

function Tickets() {
  const { tickets, setTicket, toast } = useMaxi()
  const total = TICKETS.reduce((a, t) => a + (tickets[t.id] ?? 0) * t.fiyat, 0)
  const count = TICKETS.reduce((a, t) => a + (tickets[t.id] ?? 0), 0)
  return (
    <div id="bilet" className="mt-16 scroll-mt-28">
      <h3 className="font-serif text-[clamp(36px,5vw,72px)] leading-none font-black italic">
        <span className="wonk">Bilet</span> <span className="font-mono text-[0.45em] font-bold not-italic">/ 3 tür</span>
      </h3>
      <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TICKETS.map((t, i) => {
          const n = tickets[t.id] ?? 0
          return (
            <li key={t.id} className="tilt relative text-[#111014] [filter:drop-shadow(7px_8px_0_#fff7ee)]" style={{ ['--r' as string]: [-0.4, 0.3, -0.2][i] }}>
              <div className="grain-box rounded-[24px] border-4 border-[#111014] p-5 [mask:radial-gradient(circle_14px_at_0_62%,transparent_98%,#000)_left/51%_100%_no-repeat,radial-gradient(circle_14px_at_100%_62%,transparent_98%,#000)_right/51%_100%_no-repeat]" style={{ background: t.renk }}>
                <p className="kicker">Horror Vacui · 2027</p>
                <p className="mt-1 font-sans text-[34px] leading-none font-black uppercase [font-stretch:140%]">{t.ad}</p>
                <p className="mt-1 text-[15px] font-semibold">{t.not}</p>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t-[3px] border-dashed border-[#111014] pt-4">
                  <p className="font-sans text-[30px] leading-none font-black">{tl(t.fiyat)}</p>
                  <div className="flex items-center gap-1" role="group" aria-label={`${t.ad} adedi`}>
                    <button type="button" onClick={() => setTicket(t.id, n - 1)} disabled={n === 0} className="grid size-10 place-items-center rounded-full border-[3px] border-[#111014] bg-white disabled:opacity-40" aria-label={`${t.ad}: bir azalt`}>
                      <IconMinus size={16} />
                    </button>
                    <output className="w-8 text-center font-sans text-[22px] font-black" aria-label={`${n} adet`}>
                      {n}
                    </output>
                    <button type="button" onClick={() => setTicket(t.id, n + 1)} disabled={n >= 10} className="grid size-10 place-items-center rounded-full border-[3px] border-[#111014] bg-white disabled:opacity-40" aria-label={`${t.ad}: bir artır`}>
                      <IconPlus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-5">
        <p className="font-sans text-[clamp(28px,4vw,52px)] leading-none font-black [font-stretch:125%]">
          <span className="font-mono text-[0.4em] font-bold">Toplam</span> {tl(total)}
        </p>
        <BigButton
          disabled={!count}
          cursor="al"
          onClick={() => toast(`${count} bilet sepette: ${tl(total)}. Tanıtım, ödeme yok.`, 'var(--lime)')}
        >
          <IconTicket size={22} /> Sepete ekle
        </BigButton>
      </div>
    </div>
  )
}

/** Madde 10: müzik festivali. Yoğun afiş, süzgeçler, geri sayım, bilet */
export function Program() {
  const { favs, toggleFav, announce } = useMaxi()
  const [day, setDay] = useState<'tum' | Day>('tum')
  const [genre, setGenre] = useState<'tum' | Genre>('tum')
  const [sel, setSel] = useState<string | null>('a1')
  const cd = useCountdown()
  const match = (a: Artist) => (day === 'tum' || a.gun === day) && (genre === 'tum' || a.tur === genre)
  const shown = ARTISTS.filter(match).length
  const a = sel ? ARTISTS.find((x) => x.id === sel) : null
  const fav = a ? favs.includes(a.id) : false
  // Kayıt listesi galeri ve moda ile ortak: yalnız sanatçılar
  const mine = ARTISTS.filter((x) => favs.includes(x.id))
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    announce(`${shown} sanatçı gösteriliyor`)
  }, [shown, announce])
  return (
    <Section
      id="program"
      tone="bg-[#0b0a0f] text-[#fff7ee]"
      kicker="Madde 10 · Müzik festivali"
      title={
        <>
          Üç <span className="font-serif text-pink italic">gece</span>, <span className="font-mono text-lime">72</span> <span className="uppercase [font-stretch:150%]">ses</span>
        </>
      }
      lead="Afiş boşluk bırakmaz: manşetler dev ve geniş, orta sıra eğik serif, gece yarısı setleri mono. Süzgeç dışında kalanlar silinmez, söner."
    >
      <div className="flex flex-wrap items-end gap-6">
        <div className="flex items-end gap-2 sm:gap-3" aria-label={`Festivale ${cd.gun} gün ${cd.saat} saat ${cd.dk} dakika`} role="group">
          {[
            [cd.gun, 'gün', 'bg-lime'],
            [cd.saat, 'saat', 'bg-pink'],
            [cd.dk, 'dakika', 'bg-cyan'],
          ].map(([v, k, b], i) => (
            <div key={k as string} className={cx('tilt rounded-[20px] border-4 border-[#111014] px-3 py-2 text-[#111014] sm:px-4', b as string)} style={{ ['--r' as string]: [-0.3, 0.4, -0.1][i] }} aria-hidden="true">
              <p className="font-sans text-[clamp(30px,5vw,64px)] leading-none font-black tabular-nums [font-stretch:125%]">{String(v).padStart(2, '0')}</p>
              <p className="font-mono text-[11px] font-bold uppercase">{k}</p>
            </div>
          ))}
        </div>
        <p className="font-hand text-[30px] leading-none text-butter">kaldı!</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 [--line:#fff7ee] [--paper:#17141f] [--ink:#fff7ee]">
        <Chips<'tum' | Day> legend="Gün" name="gun" value={day} onChange={setDay} options={[{ id: 'tum', ad: 'Tümü' }, ...DAYS.map((d) => ({ id: d.id, ad: `${d.ad} · ${d.tarih}` }))]} />
        <Chips<'tum' | Genre> legend="Tür" name="tur" value={genre} onChange={setGenre} options={[{ id: 'tum', ad: 'Tümü' }, ...GENRES.map((g) => ({ id: g.id, ad: g.ad }))]} on="bg-pink text-[#111014]" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ul className="leading-[1.1]" aria-label={`Sanatçılar: ${shown} gösteriliyor`}>
          {ARTISTS.map((x, i) => (
            <Name key={x.id} a={x} i={i} dim={!match(x)} sel={sel === x.id} onPick={() => setSel(x.id)} />
          ))}
        </ul>
        <aside aria-label="Seçili sanatçı" className="relative h-fit lg:sticky lg:top-28">
          {a ? (
            <div key={a.id} className="pop-in tilt relative rounded-[28px] border-4 border-[#111014] bg-butter p-5 text-[#111014] shadow-[8px_9px_0_var(--pink)]" style={{ ['--r' as string]: 0.35 }}>
              <p className="kicker">{DAYS.find((d) => d.id === a.gun)!.ad} · {a.saat}</p>
              <h3 className="mt-2 font-serif text-[40px] leading-[0.9] font-black italic">
                <span className="wonk">{a.ad}</span>
              </h3>
              <dl className="mt-4 grid grid-cols-2 gap-2 font-mono text-[13px] font-bold">
                <div>
                  <dt className="opacity-70">Sahne</dt>
                  <dd>{a.sahne}</dd>
                </div>
                <div>
                  <dt className="opacity-70">Tür</dt>
                  <dd>{GENRES.find((g) => g.id === a.tur)!.ad}</dd>
                </div>
              </dl>
              <button
                type="button"
                aria-pressed={fav}
                onClick={() => {
                  toggleFav(a.id)
                  announce(fav ? `${a.ad} programından çıktı` : `${a.ad} programına eklendi`)
                }}
                className={cx('mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border-[3px] border-[#111014] px-4 font-bold', fav ? 'bg-pink' : 'bg-white')}
              >
                {fav ? <IconCheck size={18} /> : <IconHeart size={18} />} {fav ? 'Programımda' : 'Programıma ekle'}
              </button>
              <Starburst size={84} fill="var(--lime)" className="clutter absolute -top-9 -right-2 font-sans text-[12px] font-black uppercase md:-right-7">
                {a.tier === 1 ? 'Manşet' : 'Set'}
              </Starburst>
            </div>
          ) : null}
          <p className="mt-6 font-mono text-[13px] font-bold">
            Programım: {mine.length} sanatçı{mine.length ? ` · ${mine.map((x) => x.ad).join(', ')}` : ''}
          </p>
        </aside>
      </div>

      <Tickets />
    </Section>
  )
}
