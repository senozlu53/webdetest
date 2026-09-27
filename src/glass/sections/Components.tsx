import { useRef, useState } from 'react'
import { ArrowRightIcon, BellIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { GlassCard } from '../components/GlassCard'
import { GlassButton } from '../components/GlassButton'
import { SectionHead } from '../components/SectionHead'
import { cx } from '../../shared/cx'

const SPEC = 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'
const TOKENS = 'glass rounded-glass  /* bg-glass + blur(var(--blur-lg)) + border-glass-border + inset highlight + shadow-glass */'
const REACT = `<GlassNavbar>…</GlassNavbar>

<GlassCard blur="lg" tone="panel" tilt holo>
  <h3>Portföy değeri</h3>
  <GlassButton variant="primary">Ayrıntılar</GlassButton>
</GlassCard>`

const FEED = [
  ['var(--blob-1)', 'Model güncellendi', '2 dk önce'],
  ['var(--blob-2)', 'Yeni fatura: 12.400 TL', '14 dk önce'],
  ['var(--blob-3)', 'Haftalık rapor hazır', '1 sa önce'],
  ['var(--blob-4)', 'Portföy yeniden dengelendi', '3 sa önce'],
  ['var(--blob-1)', 'Oturum açıldı · İstanbul', 'Dün'],
  ['var(--blob-2)', 'Bütçe hedefi aşıldı', 'Dün'],
  ['var(--blob-3)', 'İki adımlı doğrulama açık', '2 gün önce'],
] as const

const SEGMENTS = ['Gün', 'Hafta', 'Ay', 'Yıl'] as const

export function Components() {
  const [segment, setSegment] = useState<(typeof SEGMENTS)[number]>('Hafta')
  const [notify, setNotify] = useState(true)
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <section id="bilesenler" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="11 · 14 · 15"
          label={<span lang="en">UI Component Patterns</span>}
          title="Yüzen paneller, şeffaf gezinme"
          lede="GlassCard ve GlassNavbar sistemin iki temel bileşeni. Gezinme çubuğu altından geçen içeriği bulanıklaştırır; kaydırdıkça cam yoğunlaşır."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard className="flex flex-col gap-4 p-6">
            <h3 className="text-lg font-semibold">GlassNavbar</h3>
            <p className="text-sm text-ink-muted">Kutunun içini kaydırın: renkli satırlar çubuğun altından bulanıklaşarak geçer.</p>
            <div
              tabIndex={0}
              aria-label="Kaydırılabilir örnek akış"
              className="relative h-72 overflow-y-auto rounded-2xl border border-glass-border"
              style={{ background: 'linear-gradient(160deg, var(--blob-1), var(--blob-2) 55%, var(--blob-3))' }}
            >
              <div data-blur="xl" data-tone="panel" className="glass sticky top-3 z-10 mx-3 flex items-center justify-between rounded-full py-1.5 pr-1.5 pl-4">
                <span className="text-sm font-semibold">Akış</span>
                <span data-blur="sm" data-tone="subtle" className="glass grid size-9 place-items-center rounded-full">
                  <BellIcon size={18} weight="light" aria-hidden="true" />
                </span>
              </div>
              <ul className="flex flex-col gap-3 p-3 pt-6">
                {FEED.map(([c, t, time], i) => (
                  <li key={i} className="flex items-center gap-3 rounded-2xl bg-white/85 p-3 text-[#0B1020]">
                    <span className="size-9 shrink-0 rounded-xl" style={{ background: c }} aria-hidden="true" />
                    <span className="flex flex-col leading-snug">
                      <span className="text-sm font-semibold">{t}</span>
                      <span className="text-xs text-[#3D4466]">{time}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold">Düğmeler</h3>
              <div className="flex flex-wrap gap-3">
                <GlassButton icon={<ArrowRightIcon size={18} weight="bold" aria-hidden="true" />}>Başla</GlassButton>
                <GlassButton variant="glass">Cam düğme</GlassButton>
                <GlassButton variant="ghost">Hayalet</GlassButton>
                <GlassButton disabled>Devre dışı</GlassButton>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="cam-ara" className="text-sm font-medium">
                Arama
              </label>
              <span className="relative flex items-center">
                <MagnifyingGlassIcon size={20} weight="light" aria-hidden="true" className="pointer-events-none absolute left-4 z-10 text-ink-muted" />
                <input
                  id="cam-ara"
                  type="search"
                  placeholder="İşlem, kişi ya da tutar"
                  className="glass h-12 w-full rounded-full pr-4 pl-11 text-base text-ink placeholder:text-ink-muted"
                  data-blur="md"
                />
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <p id="donem-etiket" className="text-sm font-medium">
                Dönem
              </p>
              <div role="group" aria-labelledby="donem-etiket" data-blur="md" data-tone="subtle" className="glass flex w-fit gap-1 rounded-full p-1">
                {SEGMENTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={segment === s}
                    onClick={() => setSegment(s)}
                    className={cx(
                      'min-h-10 cursor-pointer rounded-full px-4 text-sm font-medium transition-colors duration-300',
                      segment === s ? 'bg-glass-strong shadow-glass' : 'hover:bg-glass',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="flex min-h-11 cursor-pointer items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={notify}
                  onClick={() => setNotify((v) => !v)}
                  className={cx(
                    'relative h-8 w-14 shrink-0 cursor-pointer rounded-full border border-glass-border transition-colors duration-300',
                    notify ? '[background-image:linear-gradient(120deg,var(--primary-from),var(--primary-to))]' : 'bg-glass-subtle',
                  )}
                >
                  <span className={cx('absolute top-1 left-1 size-6 rounded-full bg-white shadow-glass transition-transform duration-300 ease-glass', notify && 'translate-x-6')} />
                </button>
                <span className="text-sm font-medium">Bildirimler</span>
              </label>
              <GlassButton variant="glass" onClick={() => dialogRef.current?.showModal()}>
                Cam modalı aç
              </GlassButton>
            </div>
          </GlassCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <GlassCard className="flex min-w-0 flex-col gap-3 p-6">
            <h3 className="text-lg font-semibold">
              <span lang="en">Tailwind</span> · Madde 15
            </h3>
            <p className="text-sm text-ink-muted">Tanımdaki hali. Koyu, canlı zeminde beyaz metinle AA'yı geçmez (bkz. laboratuvar).</p>
            <pre className="overflow-x-auto rounded-2xl bg-glass-strong p-4 font-mono text-xs leading-relaxed">
              <code>{SPEC}</code>
            </pre>
            <p className="text-sm text-ink-muted">Bu projede: tek bir bileşen sınıfı, tokenlarla.</p>
            <pre className="overflow-x-auto rounded-2xl bg-glass-strong p-4 font-mono text-xs leading-relaxed">
              <code>{TOKENS}</code>
            </pre>
          </GlassCard>
          <GlassCard className="flex min-w-0 flex-col gap-3 p-6">
            <h3 className="text-lg font-semibold">React · Madde 14</h3>
            <pre className="overflow-x-auto rounded-2xl bg-glass-strong p-4 font-mono text-xs leading-relaxed">
              <code>{REACT}</code>
            </pre>
          </GlassCard>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="cam-modal-baslik"
        className="glass fixed inset-0 m-auto h-fit w-[min(420px,calc(100%-32px))] rounded-glass-lg p-0 text-ink shadow-glass-xl backdrop:bg-black/30 backdrop:backdrop-blur-sm"
        data-blur="xl"
        data-tone="strong"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close()
        }}
      >
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 id="cam-modal-baslik" className="text-xl font-semibold">
              Cam modal
            </h3>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="-mt-2 -mr-2 grid size-11 cursor-pointer place-items-center rounded-full hover:bg-glass"
            >
              <XIcon size={20} aria-hidden="true" />
              <span className="sr-only">Kapat</span>
            </button>
          </div>
          <p className="text-ink-muted">
            En üst katman: blur 40px, en geniş gölge, dolgu en yoğun. Arkasındaki sayfa ayrıca hafifçe bulanıklaşır.
          </p>
          <GlassButton onClick={() => dialogRef.current?.close()} className="w-fit">
            Tamam
          </GlassButton>
        </div>
      </dialog>
    </section>
  )
}
