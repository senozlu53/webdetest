import { MaxiProvider, LiveRegions, useMaxi } from './lib/store'
import { BADGES } from './lib/data'
import { Header } from './components/Header'
import { CursorFollower } from './components/CursorFollower'
import { FlyingBadges, badgeToastColor } from './components/FlyingBadges'
import { useMedia } from './hooks/useMedia'
import { StickerFace } from './components/Sticker'
import { Toasts } from './components/ui'
import { Hero } from './sections/Hero'
import { Traits } from './sections/Traits'
import { Program } from './sections/Program'
import { Gallery } from './sections/Gallery'
import { Fashion } from './sections/Fashion'
import { Editorial } from './sections/Editorial'
import { Palette } from './sections/Palette'
import { Build } from './sections/Build'
import { Motion } from './sections/Motion'
import { Responsive } from './sections/Responsive'
import { Access } from './sections/Access'

/** Rozet albümü: uçan rozetlerden toplananlar */
function Album() {
  const { collected, release, vars, announce, kaos, collect, toast } = useMaxi()
  const desktop = useMedia('(min-width: 768px)')
  const max = Math.max(vars.rozet, collected.length)
  // Mobilde rozetler uçmaz: toplanmayanlar burada satıra dizilir (Madde 17)
  const still = desktop || kaos === 'sakin' ? [] : BADGES.slice(0, vars.rozet).filter((b) => !collected.includes(b.id))
  return (
    <div className="rounded-[30px] border-4 border-[#fff7ee] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-[34px] leading-none font-black italic">
          <span className="wonk">Rozet albümü</span>
        </h2>
        <p className="font-mono text-[13px] font-bold" data-album={collected.length}>
          {collected.length} / {max} toplandı
        </p>
      </div>
      {collected.length ? (
        <ul className="mt-4 flex flex-wrap items-center gap-3" aria-label="Toplanan rozetler">
          {collected.map((id) => {
            const b = BADGES.find((x) => x.id === id)!
            return (
              <li key={id} className="pop-in">
                <StickerFace shape={b.shape} bg={b.bg} fg={b.fg} size={b.shape === 'pill' ? 72 : 84}>
                  {b.ad}
                </StickerFace>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="mt-3 font-semibold text-[#cfc6d9]">Ekranın kenarlarında uçan rozetlere basın; buraya yapışırlar. Mobilde uçmazlar, aşağıda satıra dizilirler; sakin modda hiç yoklar.</p>
      )}
      {still.length ? (
        <div className="mt-5">
          <p className="kicker">Uçmayan rozetler · dokunun, toplayın</p>
          <ul className="mt-3 flex flex-wrap items-center gap-3">
            {still.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  data-still-badge={b.id}
                  aria-label={`Rozet: ${b.ad}. Toplamak için bas`}
                  onClick={() => {
                    collect(b.id)
                    toast(`Rozet toplandı: ${b.ad}`, badgeToastColor(b))
                  }}
                  className="rounded-full"
                >
                  <StickerFace shape={b.shape} bg={b.bg} fg={b.fg} size={b.shape === 'pill' ? 72 : 84}>
                    {b.ad}
                  </StickerFace>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {collected.length ? (
        <button
          type="button"
          onClick={() => {
            release()
            announce('Rozetler yeniden uçuyor')
          }}
          className="mt-4 min-h-11 rounded-full border-[3px] border-[#fff7ee] px-4 font-bold hover:bg-[#fff7ee] hover:text-[#111014]"
        >
          Hepsini geri sal
        </button>
      ) : null}
    </div>
  )
}

export default function MaxiApp() {
  return (
    <MaxiProvider>
      <div className="grain-page clutter" aria-hidden="true" />
      <Header />
      <main id="icerik" tabIndex={-1} className="outline-none">
        <Hero />
        <Traits />
        <Program />
        <Gallery />
        <Fashion />
        <Editorial />
        <Palette />
        <Build />
        <Motion />
        <Responsive />
        <Access />
      </main>
      <footer className="relative overflow-hidden bg-[#0b0a0f] text-[#fff7ee]">
        <div className="mx-auto grid grid-cols-1 max-w-[1320px] gap-8 px-4 py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:px-8">
          <Album />
          <div className="self-end">
            <p className="font-sans text-[clamp(56px,10vw,150px)] leading-[0.8] font-black text-transparent uppercase [-webkit-text-stroke:2px_#fff7ee] [font-stretch:150%]" aria-hidden="true">
              Daha!
            </p>
            <p className="mt-4 font-bold">
              Stil 017 · <span lang="en">Maximalism</span>. Festival, sanatçılar, eserler ve ürünler kurgudur.
            </p>
            <p className="mt-2 font-bold">
              <a href="../../" className="underline decoration-2 underline-offset-4">
                Tüm stiller
              </a>{' '}
              ·{' '}
              <a href="../016/" className="underline decoration-2 underline-offset-4">
                Stil 016
              </a>
            </p>
          </div>
        </div>
      </footer>
      <FlyingBadges />
      <CursorFollower />
      <Toasts />
      <LiveRegions />
    </MaxiProvider>
  )
}
