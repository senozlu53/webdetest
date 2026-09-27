import { GlassCard } from '../components/GlassCard'
import { SectionHead } from '../components/SectionHead'
import { ALPHAS, PALETTES } from '../content'

const TYPE = [
  { cls: 'text-5xl font-semibold tracking-tight', meta: '48 · 600', sample: 'Portföy' },
  { cls: 'text-3xl font-semibold tracking-tight', meta: '30 · 600', sample: 'Yapay zekâ asistanı' },
  { cls: 'text-lg font-medium', meta: '18 · 500', sample: 'Kartlar zeminden kopuk durur.' },
  { cls: 'text-base', meta: '16 · 400', sample: 'Gövde metni cam üstünde tam renkli: yarı saydam metin kullanılmaz.' },
  { cls: 'font-mono text-sm tabular-nums', meta: 'Mono 14', sample: '1.284.500 TL  +2,4%' },
] as const

export function ColorType() {
  return (
    <section id="renk" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="04 · 05"
          label="Renk ve tipografi"
          title="Güçlü zemin, saydam cam, net metin"
          lede="Renk arka plandaki degradede yaşar; bileşenler yalnızca beyazın ya da koyu mürekkebin saydam tonlarıdır. Metin ise her zaman tam renklidir."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {PALETTES.map((p) => (
            <GlassCard key={p.name} className="flex flex-col gap-5 p-6">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <div
                className="relative h-40 overflow-hidden rounded-2xl"
                style={{
                  background: `radial-gradient(60% 90% at 15% 20%, ${p.blobs[0]}, transparent), radial-gradient(55% 80% at 80% 25%, ${p.blobs[1]}, transparent), radial-gradient(60% 90% at 30% 100%, ${p.blobs[2]}, transparent), radial-gradient(50% 80% at 90% 100%, ${p.blobs[3]}, transparent), ${p.base}`,
                }}
              >
                <div
                  className="absolute inset-x-4 bottom-4 rounded-2xl border px-4 py-3 backdrop-blur-lg"
                  style={{ background: p.glass, borderColor: p.text === '#FFFFFF' ? 'rgb(255 255 255 / .16)' : 'rgb(255 255 255 / .7)' }}
                >
                  <p className="text-sm font-semibold" style={{ color: p.text }}>
                    Metin {p.text}
                  </p>
                  <p className="text-sm" style={{ color: p.muted }}>
                    İkincil {p.muted}
                  </p>
                </div>
              </div>
              <ul className="grid grid-cols-5 gap-2">
                {[p.base, ...p.blobs].map((c) => (
                  <li key={c} className="flex flex-col gap-1.5">
                    <span className="h-10 rounded-xl border border-glass-border" style={{ background: c }} aria-hidden="true" />
                    <span className="font-mono text-[11px] tabular-nums">{c}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-ink-muted">
                Cam dolgusu <span className="font-mono">{p.glass}</span>. En kötü durum: metin {p.worst.text}:1, ikincil{' '}
                {p.worst.muted}:1.
              </p>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mt-6 p-6">
          <h3 className="text-lg font-semibold">
            <span lang="en">Color/Surface/GlassWhite</span> ölçeği
          </h3>
          <p className="mt-1 text-sm text-ink-muted">Aynı degrade üstünde beyazın saydam tonları. %20 altı yalnızca süsleme içindir, metin taşımaz.</p>
          <ul className="mt-5 grid grid-cols-5 gap-3">
            {ALPHAS.map((a) => (
              <li key={a} className="flex flex-col gap-2">
                <span
                  aria-hidden="true"
                  className="relative h-20 overflow-hidden rounded-2xl"
                  style={{ background: 'linear-gradient(120deg, var(--blob-1), var(--blob-2) 45%, var(--blob-3))' }}
                >
                  <span className="absolute inset-2 rounded-xl border border-white/30 backdrop-blur-md" style={{ background: `rgb(255 255 255 / ${a / 100})` }} />
                </span>
                <span className="font-mono text-xs tabular-nums">white/{a}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="mt-6 grid gap-6 p-6 md:grid-cols-[220px_1fr]">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Geist ve Geist Mono</h3>
            <p className="text-sm text-ink-muted">Vercel, 2023. Keskin, geniş açıklıklı sans. Rakamlar için mono ve tabular.</p>
          </div>
          <ul className="flex flex-col divide-y divide-glass-border">
            {TYPE.map((t) => (
              <li key={t.meta} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[88px_1fr] sm:items-baseline sm:gap-4">
                <span className="font-mono text-xs text-ink-muted tabular-nums">{t.meta}</span>
                <span className={t.cls}>{t.sample}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </section>
  )
}
