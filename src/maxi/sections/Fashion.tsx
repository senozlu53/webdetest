import { useRef, useState, type PointerEvent } from 'react'
import { LOOKS, tl, type Look, type Pattern } from '../lib/data'
import { useMaxi } from '../lib/store'
import { rng } from '../lib/rand'
import { Section } from '../components/ui'
import { StickerFace } from '../components/Sticker'
import { IconHeart, IconShuffle } from '../components/Icons'
import { cx } from '../../shared/cx'

const PATTERNS: Pattern[] = ['halftone', 'stripes', 'holo', 'dots', 'zigzag']
const LIGHT_TEXT = new Set(['var(--black)', 'var(--blue)', 'var(--violet)'])

/** Moda illüstrasyonu: omuzları abartılı figür, elbisesi desenli (fotoğraf yok; Madde 9 çıkartma dili) */
function Figure({ look, pattern, pose }: { look: Look; pattern: Pattern; pose: number }) {
  const id = `fg-${look.id}`
  const r = rng(pose * 31 + look.id.charCodeAt(1))
  const armL = r() > 0.5 ? 'M62 92 C40 120 30 150 40 186' : 'M62 92 C36 80 22 56 30 30'
  const armR = r() > 0.5 ? 'M138 92 C160 120 170 150 160 186' : 'M138 92 C166 104 182 126 176 160'
  return (
    <svg viewBox="0 0 200 330" className="h-[300px] w-auto" aria-hidden="true">
      <defs>
        <pattern id={`${id}-halftone`} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill={look.body} />
          <circle cx="5" cy="5" r="2.6" fill="#111014" />
        </pattern>
        <pattern id={`${id}-stripes`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
          <rect width="14" height="14" fill={look.body} />
          <rect width="6" height="14" fill="#111014" />
        </pattern>
        <pattern id={`${id}-dots`} width="22" height="22" patternUnits="userSpaceOnUse">
          <rect width="22" height="22" fill={look.body} />
          <circle cx="6" cy="6" r="4.5" fill="#fff7ee" />
          <circle cx="17" cy="17" r="4.5" fill="#fff7ee" />
        </pattern>
        <pattern id={`${id}-zigzag`} width="20" height="12" patternUnits="userSpaceOnUse">
          <rect width="20" height="12" fill={look.body} />
          <path d="M0 10 L5 2 L10 10 L15 2 L20 10" fill="none" stroke="#111014" strokeWidth="3" />
        </pattern>
        <linearGradient id={`${id}-holo`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9ad5" />
          <stop offset="0.3" stopColor="#9fe8ff" />
          <stop offset="0.6" stopColor="#fff59a" />
          <stop offset="1" stopColor="#c6a8ff" />
        </linearGradient>
      </defs>
      <path d={armL} fill="none" stroke="#111014" strokeWidth="13" strokeLinecap="round" />
      <path d={armR} fill="none" stroke="#111014" strokeWidth="13" strokeLinecap="round" />
      <rect x="78" y="236" width="14" height="70" rx="6" fill="#111014" />
      <rect x="108" y="236" width="14" height="70" rx="6" fill="#111014" />
      <path d="M62 300h36v14H56zM102 300h36l6 14h-42z" fill="var(--pink)" stroke="#111014" strokeWidth="3" />
      <path d="M48 86 Q100 62 152 86 L150 140 L178 250 L22 250 L50 140 Z" fill={pattern === 'holo' ? `url(#${id}-holo)` : `url(#${id}-${pattern})`} stroke="#111014" strokeWidth="4" strokeLinejoin="round" />
      <path d="M40 80 Q60 60 84 76 M160 80 Q140 60 116 76" fill="none" stroke="#111014" strokeWidth="4" />
      <circle cx="100" cy="42" r="24" fill="#111014" />
      <path d="M78 34 Q100 6 124 30 Q110 22 96 30 Q88 22 78 34Z" fill={look.body} stroke="#111014" strokeWidth="3" />
    </svg>
  )
}

/** Madde 10: moda kampanyası. Yatay kayan kolaj kartları; sürükleyerek de kayar */
export function Fashion() {
  const { favs, toggleFav, announce } = useMaxi()
  const [pose, setPose] = useState(1)
  const row = useRef<HTMLUListElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const wasDrag = useRef(false)
  const saved = LOOKS.filter((l) => favs.includes(l.id)).length
  const down = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse' || !row.current) return
    drag.current = { x: e.clientX, left: row.current.scrollLeft, moved: false }
  }
  const move = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current
    if (!d || !row.current) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) d.moved = true
    row.current.scrollLeft = d.left - dx
  }
  const up = () => {
    wasDrag.current = drag.current?.moved ?? false
    drag.current = null
  }
  return (
    <Section
      id="moda"
      tone="bg-peach text-[#111014]"
      kicker="Madde 10 · Moda kampanyası"
      title={
        <>
          <span className="font-mono text-[0.55em]">SS27</span> <span className="font-serif italic">Aşırı</span> <span className="uppercase [font-stretch:150%]">yaz</span>
        </>
      }
      lead="Beş görünüm, beş desen: halftone, çizgi, holografik folyo, puantiye, zikzak. Kartlar yan yana kayar; fareyle sürükleyin ya da odaklanıp ok tuşlarını kullanın."
    >
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => {
            setPose((p) => p + 1)
            announce('Pozlar ve desenler karıştı')
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border-[3px] border-[#111014] bg-white px-4 font-bold"
          data-cursor="karıştır"
        >
          <IconShuffle size={18} /> Deseni karıştır
        </button>
        <p className="font-hand text-[26px] leading-none">kaydedilen: {saved}</p>
      </div>
      <ul
        ref={row}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        className="no-scrollbar -mx-4 flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto px-4 pt-6 pb-10 select-none active:cursor-grabbing md:-mx-8 md:px-8"
        tabIndex={0}
        role="region"
        aria-label="Görünümler, yatay kaydırılabilir"
      >
        {LOOKS.map((l, i) => {
          const light = LIGHT_TEXT.has(l.bg)
          const pat = PATTERNS[(PATTERNS.indexOf(l.pattern) + pose - 1) % PATTERNS.length]
          const fav = favs.includes(l.id)
          return (
            <li key={l.id} className="tilt relative w-[300px] shrink-0 snap-center sm:w-[340px]" style={{ ['--r' as string]: [-0.35, 0.3, -0.15, 0.45, -0.25][i] }}>
              <article className={cx('grain-box relative overflow-hidden rounded-[30px] border-4 border-[#111014] p-5 shadow-[8px_9px_0_#111014]', light ? 'text-[#fff7ee]' : 'text-[#111014]')} style={{ background: l.bg }}>
                <div className="halftone halftone-fade clutter pointer-events-none absolute inset-0 opacity-30 [--dot-size:12px]" style={{ ['--dot' as string]: light ? '#fff7ee' : '#111014' }} aria-hidden="true" />
                <div className="relative flex justify-center">
                  <Figure look={l} pattern={pat} pose={pose} />
                </div>
                <StickerFace shape="burst" bg="var(--butter)" fg="#111014" size={86} className="absolute top-4 left-4">
                  Look {l.no}
                </StickerFace>
                <h3 className="relative mt-2 font-serif text-[34px] leading-none font-black italic">
                  <span className="wonk">{l.ad}</span>
                </h3>
                <ul className="relative mt-3 space-y-1">
                  {l.urunler.map((u) => (
                    <li key={u.ad} className="flex items-baseline justify-between gap-3 border-b-2 border-dashed border-current pb-1 text-[15px] font-semibold">
                      <span>{u.ad}</span>
                      <span className="font-sans font-black">{tl(u.fiyat)}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  aria-pressed={fav}
                  aria-label={`${fav ? 'Kaydedildi' : 'Kaydet'}: ${l.ad}`}
                  onClick={() => {
                    if (wasDrag.current) {
                      wasDrag.current = false
                      return
                    }
                    toggleFav(l.id)
                    announce(fav ? `Look ${l.no} kayıttan çıktı` : `Look ${l.no} kaydedildi`)
                  }}
                  className={cx('relative mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border-[3px] border-[#111014] px-4 font-bold text-[#111014]', fav ? 'bg-pink' : 'bg-white')}
                >
                  <IconHeart size={18} fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Kaydedildi' : 'Kaydet'}
                </button>
              </article>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
