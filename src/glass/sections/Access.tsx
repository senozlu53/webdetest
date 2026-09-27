import { CheckCircleIcon } from '@phosphor-icons/react'
import { GlassCard } from '../components/GlassCard'
import { SectionHead } from '../components/SectionHead'
import { BLUR_TOKENS } from '../content'
import { useTilt } from '../useTilt'
import type { Theme } from '../../shared/useTheme'

type Props = {
  theme: Theme
  onToggleTheme: () => void
  reduced: boolean
  onToggleReduced: () => void
}

const RULES = [
  'Metin taşıyan cam en az %50–55 dolgulu; %20 altı yalnızca süsleme.',
  'Canlı görsel üstündeki metnin arkasına opak bir degrade katman (gradient fade) konur.',
  'Metin her zaman tam renkli: yarı saydam metin kullanılmaz.',
  '“Saydamlığı azalt” açıkken blur kalkar, cam neredeyse opak olur (işletim sistemi ayarı da izlenir).',
  'backdrop-filter desteklemeyen tarayıcılarda cam otomatik olarak yoğunlaşır.',
  'Hareket azaltma açıkken eğilme, süzülme ve arka plan kayması durur.',
] as const

function TiltDemo() {
  const ref = useTilt<HTMLDivElement>(14)
  return (
    <div ref={ref} data-blur="lg" className="glass glass-tilt glass-glare grid aspect-[4/3] place-items-center rounded-glass-lg p-6 text-center">
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-semibold">Fareyi gezdirin</p>
        <p className="max-w-[28ch] text-sm text-ink-muted">Kart en fazla 14° eğilir; ışık imlecin olduğu yere düşer. Ayrılınca 400ms'de yerine oturur.</p>
      </div>
    </div>
  )
}

export function Access({ theme, onToggleTheme, reduced, onToggleReduced }: Props) {
  return (
    <section id="erisilebilirlik" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="16 · 17 · 18"
          label="Hareket · duyarlılık · erişilebilirlik"
          title="Cam, okunurluğun önüne geçmez"
          lede="Hareket imleci izler ama dikkat dağıtmaz. Mobilde bulanıklık yarıya iner. Saydamlık her zaman kapatılabilir."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-6">
            <TiltDemo />
            <GlassCard className="p-6">
              <h3 className="font-semibold">Madde 16 · Hareket</h3>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                <dt className="text-ink-muted">Eğilme</dt>
                <dd>80ms takip, 400ms geri dönüş, cubic-bezier(0.22, 1, 0.36, 1)</dd>
                <dt className="text-ink-muted">Kaydırma</dt>
                <dd>Işık lekeleri 0,12–0,38 hızla, farklı katmanlarda kayar</dd>
                <dt className="text-ink-muted">Süzülme</dt>
                <dd>9 sn, 14px, ileri-geri</dd>
              </dl>
            </GlassCard>
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <GlassCard className="min-w-0 p-6">
              <h3 className="font-semibold">Madde 17 · Mobilde blur</h3>
              <p className="mt-1 text-sm text-ink-muted">Bulanıklık yarıçapı GPU maliyetini doğrudan büyütür. 768px altında değerler düşer, doygunluk %160'tan %140'a iner.</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-glass-border">
                      <th scope="col" className="py-2 pr-3 font-medium text-ink-muted">
                        Token
                      </th>
                      <th scope="col" className="py-2 pr-3 font-medium text-ink-muted">
                        Masaüstü
                      </th>
                      <th scope="col" className="py-2 pr-3 font-medium text-ink-muted">
                        Mobil
                      </th>
                      <th scope="col" className="py-2 font-medium text-ink-muted">
                        Kullanım
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {BLUR_TOKENS.map((b) => (
                      <tr key={b.token} className="border-b border-glass-border last:border-0">
                        <th scope="row" className="py-2 pr-3 font-mono text-xs font-normal" lang="en">
                          {b.token}
                        </th>
                        <td className="py-2 pr-3 font-mono tabular-nums">{b.desktop}px</td>
                        <td className="py-2 pr-3 font-mono tabular-nums">{b.mobile}px</td>
                        <td className="py-2">{b.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-semibold">Madde 18 · Erişilebilirlik ve varyantlar</h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm">
                {RULES.map((r) => (
                  <li key={r} className="flex gap-2.5">
                    <CheckCircleIcon size={18} weight="fill" className="mt-0.5 shrink-0 text-up" aria-hidden="true" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  aria-pressed={reduced}
                  onClick={onToggleReduced}
                  className="glass min-h-11 cursor-pointer rounded-full px-5 text-sm font-semibold"
                >
                  {reduced ? 'Saydamlığı geri aç' : 'Saydamlığı azalt'}
                </button>
                <button
                  type="button"
                  aria-pressed={theme === 'dark'}
                  onClick={onToggleTheme}
                  className="glass min-h-11 cursor-pointer rounded-full px-5 text-sm font-semibold"
                >
                  {theme === 'dark' ? 'Holografik açık temaya geç' : 'Derin koyu temaya geç'}
                </button>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Gradient fade: canlı görselin üstündeki metnin arkasına opak katman */}
        <GlassCard className="mt-6 grid gap-6 p-6 md:grid-cols-2">
          {[false, true].map((withScrim) => (
            <figure key={String(withScrim)} className="flex flex-col gap-3">
              <div
                className="relative flex h-56 items-end overflow-hidden rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #EC4899 40%, #22D3EE 75%, #FDE68A)' }}
              >
                {withScrim ? <span aria-hidden="true" className="glass-scrim absolute inset-0" /> : null}
                <p className="relative p-5 text-lg font-semibold" style={{ color: withScrim ? 'var(--ink)' : '#FFFFFF' }}>
                  Yeni model yayında: yanıtlar iki kat hızlı.
                </p>
              </div>
              <figcaption className="text-sm text-ink-muted">
                {withScrim ? 'Opak degrade katmanla: metin zemin tonunun üstünde, AA geçer.' : 'Katmansız: parlak renklerde metin kaybolur.'}
              </figcaption>
            </figure>
          ))}
        </GlassCard>
      </div>
    </section>
  )
}
