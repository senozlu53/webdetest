import { useState } from 'react'
import { FadeSection } from '../components/FadeSection'
import { SectionIntro } from '../components/SectionIntro'
import { SoftCard } from '../components/SoftCard'
import { PillButton } from '../components/PillButton'
import { LineIcon, type LineIconName } from '../components/LineIcon'
import { ROUTINE } from '../content'
import { Breath } from './Breath'
import { cx } from '../../shared/cx'

const TABS: ReadonlyArray<{ icon: LineIconName; label: string }> = [
  { icon: 'home', label: 'Bugün' },
  { icon: 'wind', label: 'Nefes' },
  { icon: 'moon', label: 'Uyku' },
  { icon: 'user', label: 'Profil' },
]

const TAGS = ['Hassas cilt', 'Vegan', 'Parfümsüz'] as const

function MeditationApp() {
  return (
    <SoftCard
      as="article"
      blur="none"
      padding="none"
      aria-label="Örnek meditasyon uygulaması ekranı"
      className="mx-auto flex w-full max-w-[400px] flex-col overflow-hidden rounded-[40px]"
    >
      <header className="flex items-center justify-between px-7 pt-8">
        <div className="leading-snug">
          <p className="text-small text-ink-soft">Salı sabahı</p>
          <p className="font-serif text-h3">Günaydın</p>
        </div>
        <span className="grid size-11 place-items-center rounded-full bg-sand text-gold-deep">
          <LineIcon name="bell" size={20} />
        </span>
      </header>
      <div className="mx-5 mt-6 rounded-[32px] bg-sand px-6 py-8">
        <p className="text-center text-small text-ink-soft">4-7-8 nefes · 4 tur · yaklaşık 76 saniye</p>
        <div className="mt-6">
          <Breath />
        </div>
      </div>
      <ul className="mt-4 flex flex-col px-7">
        {ROUTINE.slice(0, 3).map((r) => (
          <li key={r.title} className="flex min-h-[76px] items-center gap-4 border-t border-line first:border-t-0">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand text-gold-deep">
              <LineIcon name={r.icon} size={20} />
            </span>
            <span className="flex flex-col leading-snug">
              <span className="font-medium">{r.title}</span>
              <span className="text-small text-ink-soft">{r.meta}</span>
            </span>
          </li>
        ))}
      </ul>
      <nav aria-label="Örnek uygulama menüsü" className="mt-4 border-t border-line px-4 pt-3 pb-5">
        <ul className="grid grid-cols-4">
          {TABS.map((t, i) => (
            <li key={t.label} className="flex justify-center">
              <span
                className={cx(
                  'flex flex-col items-center gap-1 rounded-pill px-3 py-1.5 text-caption',
                  i === 1 ? 'bg-sand text-gold-deep' : 'text-ink-soft',
                )}
              >
                <LineIcon name={t.icon} size={22} />
                {t.label}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </SoftCard>
  )
}

function ProductCard() {
  const [added, setAdded] = useState(false)
  return (
    <SoftCard as="article" blur="none" padding="none" className="overflow-hidden">
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{ background: 'radial-gradient(90% 90% at 30% 20%, var(--glow) 0%, var(--sand) 65%)' }}
      >
        {/* Şişe ve taş: yalın geometrik ürün çizimi */}
        <div aria-hidden="true" className="absolute bottom-[14%] left-1/2 flex -translate-x-[70%] flex-col items-center">
          <span className="h-6 w-10 rounded-t-soft rounded-b-md bg-ink" />
          <span className="-mt-1 h-40 w-28 rounded-[28px] border border-line bg-canvas shadow-float md:h-48 md:w-32">
            <span className="mx-auto mt-16 block h-px w-12 bg-gold md:mt-20" />
            <span className="mt-3 block text-center font-serif text-caption italic">pirinç</span>
          </span>
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-[12%] left-[58%] aspect-[1.3] w-[18%] rounded-[58%_42%_52%_48%/48%_56%_44%_52%] bg-gold shadow-float"
        />
        <span className="absolute top-5 left-5 rounded-pill bg-float px-3 py-1 text-caption font-medium backdrop-blur-sm">
          Örnek ürün
        </span>
      </div>
      <div className="flex flex-col gap-5 px-7 py-6 md:px-10 md:py-8">
        <div className="flex items-start justify-between gap-4">
          <div className="leading-snug">
            <h3 className="font-serif text-h3">Pirinç Özlü Tonik</h3>
            <p className="text-small text-ink-soft">150 ml · alkolsüz, günde iki kez</p>
          </div>
          <p className="font-serif text-h3 tabular-nums">₺640</p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <li key={t} className="rounded-pill bg-sand px-3.5 py-1.5 text-small">
              {t}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-3">
          <PillButton
            variant={added ? 'soft' : 'accent'}
            size="lg"
            aria-pressed={added}
            onClick={() => setAdded((a) => !a)}
            icon={<LineIcon name={added ? 'check' : 'bag'} size={20} />}
          >
            {added ? 'Sepette' : 'Sepete ekle'}
          </PillButton>
          <PillButton variant="ghost" size="lg" className="px-4" aria-label="Favorilere ekle" icon={<LineIcon name="heart" size={20} />} />
        </div>
      </div>
    </SoftCard>
  )
}

export function Application() {
  return (
    <FadeSection id="uygulama" className="py-24 md:py-32">
      <div className="soft-frame">
        <SectionIntro
          item="10"
          label="UI Kullanım Alanı"
          title={
            <>
              Wellness ve <em className="text-gold-deep">butik</em> e-ticaret
            </>
          }
          lede="Meditasyon ve sağlık uygulamaları, kozmetik ve moda mağazaları, yaşam tarzı blogları, psikoloji platformları. Aşağıdaki ekranlar kurgusaldır; nefes egzersizi çalışır."
        />
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <MeditationApp />
          </div>
          <div className="flex flex-col gap-8 lg:col-span-7 lg:pt-16">
            <ProductCard />
            <p className="max-w-[52ch] pl-2 text-small text-ink-soft">
              Nefes dairesi, alma evresinde 4 saniyede büyür, 7 saniye bekler, verme evresinde 8 saniyede küçülür. Hareket
              azaltma açıksa daire sabit kalır; evre ve geri sayım metinle gösterilir.
            </p>
          </div>
        </div>
      </div>
    </FadeSection>
  )
}
