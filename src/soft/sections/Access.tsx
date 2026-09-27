import { FadeSection } from '../components/FadeSection'
import { SectionIntro } from '../components/SectionIntro'
import { SoftCard } from '../components/SoftCard'
import { PillButton } from '../components/PillButton'
import { LineIcon } from '../components/LineIcon'
import type { Theme } from '../../shared/useTheme'

const RESPONSIVE = [
  'Kenar boşluğu mobilde bile 24px; tablette 48, masaüstünde 80px.',
  'Kart iç boşluğu mobilde 24 × 28px, 768px üstünde 32 × 48px.',
  'Bölümler arası 96px mobilde, 128px masaüstünde. İçerik sıkışmaz.',
  'Kartlar tek sütuna iner; aralarındaki 24px boşluk korunur.',
] as const

const ACCESS = [
  'Gövde metni zeminde 8,42:1; ikincil metin 5,48:1.',
  'Altın metin olarak değil yüzey olarak kullanılır; metinde derin altın (5,45:1).',
  'Form kenarları zeminde 3,83:1, odak halkası 2px derin altın.',
  'Hareket azaltma açıksa animasyonlar kapanır, paralaks durur.',
] as const

/** Koyu mod önizlemesi: sayfa temasından bağımsız, sabit renklerle. */
const PREVIEWS = [
  { name: 'Açık', bg: '#FAF9F6', surface: '#F2EDE4', text: '#4A4A4A', muted: '#6B655C', accent: '#7A6333', pill: '#4A4A4A', pillText: '#FAF9F6' },
  { name: 'Koyu', bg: '#1A1814', surface: '#24261D', text: '#EDE6DA', muted: '#ADA391', accent: '#C2A878', pill: '#C2A878', pillText: '#2A2520' },
] as const

type Props = { theme: Theme; onToggleTheme: () => void }

export function Access({ theme, onToggleTheme }: Props) {
  return (
    <FadeSection id="erisilebilirlik" className="py-24 md:py-32">
      <div className="soft-frame">
        <SectionIntro
          item="17 · 18"
          label={
            <>
              <span lang="en">Responsive</span> · Erişilebilirlik
            </>
          }
          title={
            <>
              Yumuşak ama <em className="text-gold-deep">okunur</em>
            </>
          }
          lede="Koyu modda saf siyah yok: zemin derin sıcak kahverengi, yüzeyler koyu zeytin yeşili. Düşük kontrast hissi verir, WCAG AA'yı sağlar."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {PREVIEWS.map((p) => (
            <div key={p.name} className="rounded-card p-6 md:p-8" style={{ background: p.bg, color: p.text }}>
              <p className="text-small" style={{ color: p.muted }}>
                {p.name} mod · {p.bg} · {p.surface}
              </p>
              <div className="mt-6 rounded-soft px-6 py-6" style={{ background: p.surface }}>
                <p className="font-serif text-h3">Akşam rutini</p>
                <p className="mt-2 text-small" style={{ color: p.muted }}>
                  15 dakika · Uyku öncesi beden taraması
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <span className="rounded-pill px-5 py-2.5 text-small font-medium" style={{ background: p.pill, color: p.pillText }}>
                    Başla
                  </span>
                  <span className="text-small underline underline-offset-4" style={{ color: p.accent }}>
                    Ayrıntılar
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <SoftCard blur="none" elevation="soft">
            <h3 className="text-h3">
              Madde 17 · <span lang="en">Responsive</span>
            </h3>
            <ul className="mt-6 flex flex-col gap-4">
              {RESPONSIVE.map((line) => (
                <li key={line} className="flex gap-3">
                  <LineIcon name="check" size={20} className="mt-1 shrink-0 text-gold-deep" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </SoftCard>
          <SoftCard blur="none" elevation="soft">
            <h3 className="text-h3">Madde 18 · Erişilebilirlik</h3>
            <ul className="mt-6 flex flex-col gap-4">
              {ACCESS.map((line) => (
                <li key={line} className="flex gap-3">
                  <LineIcon name="check" size={20} className="mt-1 shrink-0 text-gold-deep" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <PillButton
              variant="soft"
              className="mt-8"
              aria-pressed={theme === 'dark'}
              onClick={onToggleTheme}
              icon={<LineIcon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />}
            >
              {theme === 'dark' ? 'Açık moda dön' : 'Koyu modu dene'}
            </PillButton>
          </SoftCard>
        </div>
      </div>
    </FadeSection>
  )
}
