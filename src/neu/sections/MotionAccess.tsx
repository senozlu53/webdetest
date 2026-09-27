import { useState } from 'react'
import { CheckCircleIcon, EyeIcon, PowerIcon } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { NeumorphButton } from '../components/NeumorphButton'
import { NeuSwitch } from '../components/Controls'
import type { Theme } from '../../shared/useTheme'
import { cx } from '../../shared/cx'

/** --spring eğrisinin örnekleri (k=300, c=20, m=1) */
const SPRING = [0, 0.033, 0.117, 0.234, 0.368, 0.505, 0.636, 0.755, 0.857, 0.941, 1.006, 1.053, 1.084, 1.102, 1.108, 1.106, 1.098, 1.086, 1.072, 1.057, 1.042, 1.029, 1.018, 1.008, 1.001, 0.995, 0.991, 0.989, 0.988, 0.988, 0.989, 0.99, 1]

function SpringCurve() {
  const W = 320
  const H = 180
  const pad = 24
  const x = (i: number) => pad + (i / (SPRING.length - 1)) * (W - pad * 2)
  const y = (v: number) => H - pad - (v / 1.2) * (H - pad * 2)
  const pts = SPRING.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[360px]" role="img" aria-label="Yay eğrisi: hedefi yüzde 10,8 aşar, 500 milisaniyede yerine oturur">
      <line x1={pad} x2={W - pad} y1={y(1)} y2={y(1)} stroke="var(--muted)" strokeWidth="1" strokeDasharray="4 5" />
      <line x1={pad} x2={pad} y1={pad / 2} y2={H - pad} stroke="var(--neu-dark)" strokeWidth="2" />
      <line x1={pad} x2={W - pad} y1={H - pad} y2={H - pad} stroke="var(--neu-dark)" strokeWidth="2" />
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <text x={W - pad} y={y(1) - 8} textAnchor="end" fontSize="12" fontWeight="700" fill="var(--muted)">
        hedef
      </text>
      <text x={W - pad} y={H - 6} textAnchor="end" fontSize="12" fontWeight="700" fill="var(--muted)">
        500 ms
      </text>
    </svg>
  )
}

type Props = { theme: Theme; onToggleTheme: () => void; a11y: boolean; onA11y: (v: boolean) => void }

const A11Y = [
  'Metin zeminle AA sağlar: ana metin 9,63:1, ikincil 5,13:1, vurgu 4,97:1.',
  'Bileşeni yalnızca gölge tanımlar ve gölge kenarı 1,29:1 kalır. Erişilebilir mod her bileşene 1px kenar ekler (3,27:1).',
  'Odakta 2px vurgu renkli çerçeve, 3px boşlukla.',
  'Basılı durum yalnızca iç gölgeyle anlatılmaz: vurgu rengi, ışık noktası ve aria-pressed.',
  'İşletim sisteminde yüksek kontrast açıksa erişilebilir mod kendiliğinden devreye girer.',
  'Hareket azaltma açıksa yay ve dönme animasyonları durur.',
] as const

export function MotionAccess({ theme, onToggleTheme, a11y, onA11y }: Props) {
  const [demo, setDemo] = useState(false)
  return (
    <section id="erisilebilirlik" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="16 · 17 · 18"
          label="Hareket · duyarlılık · erişilebilirlik"
          title="Fiziksel tuş hissi, dijital sorumluluk"
          lede="Düğmeler 80ms'de çöker, bırakınca yayla geri kalkar. Gölgeler yer kapladığı için bileşen aralıkları gölge boyutuna göre ayarlanır. Düşük kontrastın bedeli erişilebilir modla ödenir."
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="neu neu-raised flex flex-col items-center gap-8 rounded-neu-lg p-6 md:p-10">
            <h3 className="self-start text-xl font-extrabold">Madde 16 · Yay</h3>
            <SpringCurve />
            <NeumorphButton shape="circle" size="lg" pressed={demo} onClick={() => setDemo((v) => !v)} aria-label="Yay örneği" icon={<PowerIcon size={30} weight="bold" aria-hidden="true" />} />
            <dl className="grid w-full grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              <dt className="font-bold text-muted">Basma</dt>
              <dd className="font-semibold">80ms · ölçek 0,97 · iç gölge</dd>
              <dt className="font-bold text-muted">Bırakma</dt>
              <dd className="font-semibold">500ms · <code>linear()</code> yay eğrisi · %10,8 aşma</dd>
            </dl>
          </div>

          <div className="neu neu-raised flex min-w-0 flex-col gap-6 rounded-neu-lg p-6 md:p-10">
            <h3 className="text-xl font-extrabold">Madde 17 · Aralık</h3>
            <p className="text-muted">
              Kabarık bir bileşenin gölgesi mesafe + yayılma kadar dışarı taşar: 9 + 16 = 25px. Aralık bundan küçükse gölgeler üst
              üste biner ve biçimler çamurlaşır. Mobilde gölge 6/12px'e iner, aralık 24px'ten 16px'e düşer.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Aralık 6px: gölgeler karışır', gap: 'gap-1.5' },
                { label: 'Aralık 32px: biçimler ayrı', gap: 'gap-8' },
              ].map((g) => (
                <figure key={g.label} className="flex flex-col items-center gap-4">
                  <div className={cx('flex', g.gap)} aria-hidden="true">
                    <span className="neu neu-raised size-12 rounded-full" />
                    <span className="neu neu-raised size-12 rounded-full" />
                  </div>
                  <figcaption className="text-center text-sm font-bold text-muted">{g.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>

        <div className="neu neu-raised mt-10 grid gap-8 rounded-neu-lg p-6 md:grid-cols-2 md:p-10">
          <div className="flex flex-col gap-5">
            <h3 className="text-xl font-extrabold">Madde 18 · Erişilebilirlik</h3>
            <ul className="flex flex-col gap-3">
              {A11Y.map((line) => (
                <li key={line} className="flex gap-3">
                  <CheckCircleIcon size={20} weight="fill" className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <NeuSwitch label="Erişilebilir mod" description={a11y ? 'Tüm bileşenlerde 1px kenar' : 'Yalnızca gölge'} checked={a11y} onChange={onA11y} />
            <NeuSwitch label="Koyu mod" description="Grafit plastik; ışık gölgesi koyu tonda" checked={theme === 'dark'} onChange={onToggleTheme} />
            <div className="neu neu-inset flex items-center gap-4 rounded-neu p-5">
              <EyeIcon size={28} weight="bold" className="shrink-0 text-accent" aria-hidden="true" />
              <p className="text-sm">
                Erişilebilir modu açınca kartlar, düğmeler ve oluklar ince bir kenar kazanır. Biçim artık yalnızca gölgeye bağlı değildir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
