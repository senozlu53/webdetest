import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dialog } from 'radix-ui'
import { artSpec } from '../lib/art'
import { useMaxi } from '../lib/store'
import { Art } from '../components/Art'
import { Section } from '../components/ui'
import { IconChevron, IconHeart, IconX } from '../components/Icons'
import { cx } from '../../shared/cx'

const BATCH = 9
const CAP = 150

/**
 * Madde 11: sonsuz kaydırmalı dev imaj galerisi. Eserler tohumdan üretilir, uç yok gibi gelir.
 * Kaydırma kendi alanında olur: sayfanın geri kalanına ulaşmak için galeriyi baştan sona geçmek gerekmez.
 * Klavye için "daha fazla yükle" düğmesi ve atlama bağlantısı var; yükleme duyurulur.
 */
export function Gallery() {
  const { announce, favs, toggleFav } = useMaxi()
  const [n, setN] = useState(BATCH * 2)
  const [open, setOpen] = useState<number | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const sentinel = useRef<HTMLDivElement>(null)
  const specs = useMemo(() => Array.from({ length: n }, (_, i) => artSpec(i + 1)), [n])
  const nRef = useRef(n)
  nRef.current = n
  const more = useCallback(() => {
    const c = nRef.current
    if (c >= CAP) return
    const next = Math.min(CAP, c + BATCH)
    nRef.current = next
    setN(next)
    announce(`${next - c} eser daha yüklendi, toplam ${next}`)
  }, [announce])
  useEffect(() => {
    const root = box.current
    const s = sentinel.current
    if (!root || !s) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && more(), { root, rootMargin: '0px 0px 600px 0px' })
    io.observe(s)
    return () => io.disconnect()
  }, [more])
  const cur = open !== null ? specs[open] : null
  // Dialog.Trigger yok: kapanınca odak, en son bakılan eserin düğmesine döner
  const last = useRef(0)
  useEffect(() => {
    if (open !== null) last.current = open
  }, [open])
  const favId = (seed: number) => `eser-${seed}`
  return (
    <Section
      id="galeri"
      tone="bg-lilac text-[#111014]"
      kicker="Madde 10 · 11 · Sanat galerisi"
      title={
        <>
          <span className="uppercase [font-stretch:150%]">Sonsuz</span> <span className="font-serif italic">galeri</span>
        </>
      }
      lead="Her eser bir tohumdan kurulan kolaj: halftone, damla, yıldız patlaması, çizgi, kesik kelime. Aşağı kaydırdıkça yenisi gelir; sayfa değil yalnız galeri kayar."
    >
      <a href="#moda" className="sr-only focus:not-sr-only focus:mb-4 focus:inline-block focus:rounded-full focus:bg-[#111014] focus:px-4 focus:py-2 focus:font-bold focus:text-[#fff7ee]">
        Galeriyi atla
      </a>
      <div ref={box} className="relative h-[78vh] overflow-y-auto overscroll-contain rounded-[32px] border-4 border-[#111014] bg-[#111014] p-3 shadow-[10px_12px_0_#111014] md:p-5" tabIndex={0} role="region" aria-label={`Galeri, ${n} eser, kaydırılabilir`} data-gallery="">
        <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
          {specs.map((sp, i) => (
            <li key={sp.seed} className="break-inside-avoid">
              <button type="button" onClick={() => setOpen(i)} className="group block w-full text-left" data-cursor="büyüt">
                <span className="block overflow-hidden rounded-[22px] border-4 border-[#fff7ee]">
                  <Art spec={sp} className="block h-auto w-full transition-[scale] duration-300 group-hover:scale-[1.04]" />
                </span>
                <span className="mt-2 flex items-baseline justify-between gap-3 px-1 text-[#fff7ee]">
                  <span className={cx('text-[19px] leading-tight font-black', i % 3 === 0 ? 'font-serif italic' : i % 3 === 1 ? 'font-sans uppercase [font-stretch:125%]' : 'font-mono text-[15px]')}>{sp.title}</span>
                  <span className="shrink-0 font-hand text-[20px] text-butter">{sp.year}</span>
                </span>
                <span className="block px-1 font-mono text-[11px] text-[#cfc6d9]">
                  {sp.artist} · {sp.tech}
                  {favs.includes(favId(sp.seed)) ? ' · koleksiyonda' : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div ref={sentinel} className="h-4" aria-hidden="true" />
        <div className="flex justify-center pt-2 pb-4">
          {n < CAP ? (
            <button type="button" onClick={more} className="rounded-full border-[3px] border-[#fff7ee] px-5 py-2 font-bold text-[#fff7ee] hover:bg-[#fff7ee] hover:text-[#111014]">
              Daha fazla yükle
            </button>
          ) : (
            <p className="font-hand text-[26px] text-butter">{CAP} eser. Burada biraz nefes alın.</p>
          )}
        </div>
      </div>

      <Dialog.Root open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[95] bg-[#0b0a0f]/85" />
          <Dialog.Content
            className="pop-in fixed top-1/2 left-1/2 z-[96] max-h-[92vh] w-[min(980px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[32px] border-4 border-[#111014] bg-butter p-4 text-[#111014] shadow-[10px_12px_0_var(--pink)] md:p-6"
            onKeyDown={(e) => {
              if (open === null) return
              if (e.key === 'ArrowRight') setOpen(Math.min(specs.length - 1, open + 1))
              if (e.key === 'ArrowLeft') setOpen(Math.max(0, open - 1))
            }}
            aria-describedby={undefined}
            onCloseAutoFocus={(e) => {
              e.preventDefault()
              box.current?.querySelectorAll<HTMLButtonElement>(':scope > ul > li > button')[last.current]?.focus()
            }}
          >
            {cur ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                <div className="overflow-hidden rounded-[22px] border-4 border-[#111014]">
                  <Art spec={cur} className="block h-auto max-h-[70vh] w-full" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <p className="kicker">
                      Eser {open! + 1} / {specs.length}
                    </p>
                    <Dialog.Close className="grid size-10 shrink-0 place-items-center rounded-full border-[3px] border-[#111014] bg-white" aria-label="Kapat">
                      <IconX size={18} />
                    </Dialog.Close>
                  </div>
                  <Dialog.Title className="mt-2 font-serif text-[clamp(30px,4vw,48px)] leading-[0.95] font-black italic">
                    <span className="wonk">{cur.title}</span>
                  </Dialog.Title>
                  <dl className="mt-4 space-y-1 font-mono text-[13px] font-bold">
                    <div className="flex gap-2">
                      <dt>Sanatçı:</dt>
                      <dd>{cur.artist}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt>Yıl:</dt>
                      <dd>{cur.year}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt>Teknik:</dt>
                      <dd>{cur.tech}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    aria-pressed={favs.includes(favId(cur.seed))}
                    onClick={() => {
                      const had = favs.includes(favId(cur.seed))
                      toggleFav(favId(cur.seed))
                      announce(had ? 'Koleksiyondan çıkarıldı' : 'Koleksiyona eklendi')
                    }}
                    className={cx('mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border-[3px] border-[#111014] px-4 font-bold', favs.includes(favId(cur.seed)) ? 'bg-pink' : 'bg-white')}
                  >
                    <IconHeart size={18} /> {favs.includes(favId(cur.seed)) ? 'Koleksiyonda' : 'Koleksiyona ekle'}
                  </button>
                  <div className="mt-auto flex gap-3 pt-6">
                    <button type="button" onClick={() => setOpen(Math.max(0, open! - 1))} disabled={open === 0} className="inline-flex min-h-11 items-center gap-1 rounded-full border-[3px] border-[#111014] bg-white px-4 font-bold disabled:opacity-40">
                      <IconChevron dir="left" size={18} /> Önceki
                    </button>
                    <button type="button" onClick={() => setOpen(Math.min(specs.length - 1, open! + 1))} disabled={open === specs.length - 1} className="inline-flex min-h-11 items-center gap-1 rounded-full border-[3px] border-[#111014] bg-white px-4 font-bold disabled:opacity-40">
                      Sonraki <IconChevron size={18} />
                    </button>
                  </div>
                  <p className="mt-3 font-mono text-[11px]">Sol ve sağ ok tuşları eserler arasında gezer.</p>
                </div>
              </div>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Section>
  )
}
